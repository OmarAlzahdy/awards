from __future__ import annotations

import re
import tempfile
from collections import Counter
from math import ceil
from pathlib import Path

from fastapi import Depends, FastAPI, File, HTTPException, Query, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .auth import TOKEN_TTL_SECONDS, issue_token
from .config import Settings, get_settings
from .database import Runtime, build_runtime, init_db
from .dependencies import (
    get_runtime,
    get_session,
    require_admin,
    require_writable,
    verify_admin_credentials,
)
from .importer import ensure_seed_data, import_workbook, normalize_search_text
from .models import Award, Winner
from .schemas import (
    AwardCreate,
    AwardRead,
    AwardsListResponse,
    AwardUpdate,
    FeaturedWinnerRead,
    ImportSummary,
    LoginRequest,
    LoginResponse,
    StatsDiscipline,
    StatsSummary,
    WinnerCreate,
    WinnerRead,
    WinnerUpdate,
)

CYCLE_YEAR_PATTERN = re.compile(r"(19|20)\d{2}")
DEFAULT_EGYPTIAN_NATIONALITIES = ["\u0645\u0635\u0631\u064a", "\u0645\u0635\u0631\u064a\u0629"]


def winner_count_subquery():
    return (
        select(func.count(Winner.id))
        .where(Winner.award_id == Award.id)
        .correlate(Award)
        .scalar_subquery()
    )


def serialize_award(award: Award, winner_count: int) -> AwardRead:
    return AwardRead.model_validate(
        {
            "id": award.id,
            "name": award.name,
            "summary": award.summary,
            "supervising_body": award.supervising_body,
            "prize_value": award.prize_value,
            "year_established": award.year_established,
            "country": award.country,
            "discipline": award.discipline,
            "notes": award.notes,
            "website_url": award.website_url,
            "authority_name": award.authority_name,
            "authority_type": award.authority_type,
            "winner_count": winner_count,
            "created_at": award.created_at,
            "updated_at": award.updated_at,
        }
    )


def build_awards_filters(q: str | None, discipline: str | None, country: str | None) -> list:
    conditions = []
    if q:
        conditions.append(Award.search_text.contains(normalize_search_text(q)))
    if discipline:
        conditions.append(Award.discipline.contains(discipline.strip()))
    if country:
        conditions.append(Award.country.contains(country.strip()))
    return conditions


def get_award_or_404(session: Session, award_id: int) -> Award:
    award = session.get(Award, award_id)
    if award is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="award_not_found")
    return award


def rebuild_search_text(award: Award) -> str:
    return normalize_search_text(
        award.name,
        award.summary,
        award.supervising_body,
        award.prize_value,
        award.country,
        award.discipline,
        award.notes,
        award.website_url,
        award.authority_name,
        award.authority_type,
    )


def extract_cycle_year(cycle_label: str | None) -> int:
    if not cycle_label:
        return -1
    match = CYCLE_YEAR_PATTERN.search(cycle_label)
    return int(match.group(0)) if match else -1


def serialize_featured_winner(
    winner: Winner,
    award_name: str,
    award_discipline: str | None,
) -> FeaturedWinnerRead:
    return FeaturedWinnerRead.model_validate(
        {
            "id": winner.id,
            "award_id": winner.award_id,
            "cycle_label": winner.cycle_label,
            "winner_name": winner.winner_name,
            "nationality_or_location": winner.nationality_or_location,
            "summary": winner.summary,
            "discipline": winner.discipline,
            "created_at": winner.created_at,
            "updated_at": winner.updated_at,
            "award_name": award_name,
            "award_discipline": award_discipline,
        }
    )


def list_featured_winners_for_nationalities(
    session: Session,
    nationalities: list[str],
    limit: int,
) -> list[FeaturedWinnerRead]:
    if not nationalities:
        return []

    rows = list(
        session.execute(
            select(Winner, Award.name, Award.discipline)
            .join(Award, Award.id == Winner.award_id)
            .where(Winner.nationality_or_location.in_(nationalities))
        )
    )

    rows.sort(key=lambda row: row[0].id)
    rows.sort(key=lambda row: row[0].cycle_label or "", reverse=True)
    rows.sort(key=lambda row: extract_cycle_year(row[0].cycle_label), reverse=True)

    return [
        serialize_featured_winner(winner, award_name, award_discipline)
        for winner, award_name, award_discipline in rows[:limit]
    ]


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()
    runtime = build_runtime(resolved_settings)
    init_db(runtime)
    with runtime.session_factory() as session:
        if resolved_settings.auto_seed:
            ensure_seed_data(session, resolved_settings.workbook_file, resolved_settings.report_file)

    app = FastAPI(
        title=resolved_settings.app_name,
        version="0.1.0",
        summary="API for awards, winners, and admin workflows",
    )
    app.state.runtime = runtime

    app.add_middleware(
        CORSMiddleware,
        allow_origins=resolved_settings.cors_origin_list or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def root(runtime: Runtime = Depends(get_runtime)) -> dict[str, object]:
        return {
            "name": runtime.settings.app_name,
            "read_only_mode": runtime.settings.is_read_only,
            "docs_url": "/docs",
        }

    @app.post("/v1/auth/login", response_model=LoginResponse)
    def login(payload: LoginRequest, runtime: Runtime = Depends(get_runtime)) -> LoginResponse:
        if not verify_admin_credentials(payload.username, payload.password, runtime):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_credentials")
        token = issue_token(payload.username, runtime.settings.auth_secret)
        return LoginResponse(
            token=token,
            read_only_mode=runtime.settings.is_read_only,
            expires_in_seconds=TOKEN_TTL_SECONDS,
        )

    @app.get("/v1/awards", response_model=AwardsListResponse)
    def list_awards(
        q: str | None = Query(default=None),
        discipline: str | None = Query(default=None),
        country: str | None = Query(default=None),
        page: int = Query(default=1, ge=1),
        page_size: int = Query(default=12, ge=1, le=100),
        session: Session = Depends(get_session),
    ) -> AwardsListResponse:
        conditions = build_awards_filters(q, discipline, country)
        total = session.scalar(select(func.count()).select_from(Award).where(*conditions)) or 0
        count_expr = winner_count_subquery()
        statement = (
            select(Award, count_expr.label("winner_count"))
            .where(*conditions)
            .order_by(Award.year_established.desc().nullslast(), Award.name.asc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        rows = session.execute(statement).all()
        items = [serialize_award(award, int(winner_count or 0)) for award, winner_count in rows]
        return AwardsListResponse(
            items=items,
            page=page,
            page_size=page_size,
            total=total,
            total_pages=max(1, ceil(total / page_size)) if total else 1,
        )

    @app.get("/v1/awards/{award_id}", response_model=AwardRead)
    def get_award(award_id: int, session: Session = Depends(get_session)) -> AwardRead:
        award = get_award_or_404(session, award_id)
        count = session.scalar(select(func.count(Winner.id)).where(Winner.award_id == award_id)) or 0
        return serialize_award(award, int(count))

    @app.get("/v1/awards/{award_id}/winners", response_model=list[WinnerRead])
    def get_award_winners(award_id: int, session: Session = Depends(get_session)) -> list[WinnerRead]:
        get_award_or_404(session, award_id)
        winners = session.scalars(
            select(Winner)
            .where(Winner.award_id == award_id)
            .order_by(Winner.cycle_label.desc().nullslast(), Winner.winner_name.asc())
        ).all()
        return [WinnerRead.model_validate(winner) for winner in winners]

    @app.get("/v1/winners/featured", response_model=list[FeaturedWinnerRead])
    def get_featured_winners(
        nationality: list[str] | None = Query(default=None),
        limit: int = Query(default=6, ge=1, le=100),
        session: Session = Depends(get_session),
    ) -> list[FeaturedWinnerRead]:
        selected_nationalities = nationality or DEFAULT_EGYPTIAN_NATIONALITIES
        cleaned_nationalities = [value.strip() for value in selected_nationalities if value.strip()]
        return list_featured_winners_for_nationalities(session, cleaned_nationalities, limit)

    @app.get("/v1/stats/summary", response_model=StatsSummary)
    def get_stats(
        session: Session = Depends(get_session),
        runtime: Runtime = Depends(get_runtime),
    ) -> StatsSummary:
        awards = session.scalars(select(Award)).all()
        winners_count = session.scalar(select(func.count(Winner.id))) or 0
        countries = {award.country for award in awards if award.country}
        discipline_counter: Counter[str] = Counter()
        for award in awards:
            if not award.discipline:
                continue
            segments = re.split(r"[,،/]+", award.discipline)
            for segment in segments:
                normalized = segment.strip()
                if normalized:
                    discipline_counter[normalized] += 1
        top_disciplines = [
            StatsDiscipline(name=name, count=count)
            for name, count in discipline_counter.most_common(6)
        ]
        return StatsSummary(
            awards_count=len(awards),
            winners_count=int(winners_count),
            countries_count=len(countries),
            disciplines_count=len(discipline_counter),
            top_disciplines=top_disciplines,
            read_only_mode=runtime.settings.is_read_only,
        )

    @app.post(
        "/v1/admin/import/excel",
        response_model=ImportSummary,
        dependencies=[Depends(require_admin), Depends(require_writable)],
    )
    async def import_excel(
        file: UploadFile = File(...),
        runtime: Runtime = Depends(get_runtime),
    ) -> ImportSummary:
        suffix = Path(file.filename or "upload.xlsx").suffix or ".xlsx"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_path = Path(temp_file.name)
            temp_file.write(await file.read())
        try:
            with runtime.session_factory() as session:
                result = import_workbook(session, temp_path, runtime.settings.report_file)
        finally:
            temp_path.unlink(missing_ok=True)
        return ImportSummary(**result.__dict__)

    @app.post(
        "/v1/admin/awards",
        response_model=AwardRead,
        dependencies=[Depends(require_admin), Depends(require_writable)],
    )
    def create_award(
        payload: AwardCreate,
        session: Session = Depends(get_session),
    ) -> AwardRead:
        award = Award(
            id=payload.id or None,
            name=payload.name,
            summary=payload.summary,
            supervising_body=payload.supervising_body,
            prize_value=payload.prize_value,
            year_established=payload.year_established,
            country=payload.country,
            discipline=payload.discipline,
            notes=payload.notes,
            website_url=payload.website_url,
            authority_name=payload.authority_name,
            authority_type=payload.authority_type,
            search_text="",
        )
        award.search_text = rebuild_search_text(award)
        session.add(award)
        session.commit()
        session.refresh(award)
        return serialize_award(award, 0)

    @app.put(
        "/v1/admin/awards/{award_id}",
        response_model=AwardRead,
        dependencies=[Depends(require_admin), Depends(require_writable)],
    )
    def update_award(
        award_id: int,
        payload: AwardUpdate,
        session: Session = Depends(get_session),
    ) -> AwardRead:
        award = get_award_or_404(session, award_id)
        for field, value in payload.model_dump().items():
            setattr(award, field, value)
        award.search_text = rebuild_search_text(award)
        session.commit()
        session.refresh(award)
        count = session.scalar(select(func.count(Winner.id)).where(Winner.award_id == award.id)) or 0
        return serialize_award(award, int(count))

    @app.delete(
        "/v1/admin/awards/{award_id}",
        dependencies=[Depends(require_admin), Depends(require_writable)],
    )
    def delete_award(award_id: int, session: Session = Depends(get_session)) -> dict[str, object]:
        award = get_award_or_404(session, award_id)
        session.delete(award)
        session.commit()
        return {"ok": True, "deleted_award_id": award_id}

    @app.post(
        "/v1/admin/winners",
        response_model=WinnerRead,
        dependencies=[Depends(require_admin), Depends(require_writable)],
    )
    def create_winner(
        payload: WinnerCreate,
        session: Session = Depends(get_session),
    ) -> WinnerRead:
        get_award_or_404(session, payload.award_id)
        winner = Winner(**payload.model_dump())
        session.add(winner)
        session.commit()
        session.refresh(winner)
        return WinnerRead.model_validate(winner)

    @app.put(
        "/v1/admin/winners/{winner_id}",
        response_model=WinnerRead,
        dependencies=[Depends(require_admin), Depends(require_writable)],
    )
    def update_winner(
        winner_id: int,
        payload: WinnerUpdate,
        session: Session = Depends(get_session),
    ) -> WinnerRead:
        winner = session.get(Winner, winner_id)
        if winner is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="winner_not_found")
        for field, value in payload.model_dump().items():
            setattr(winner, field, value)
        session.commit()
        session.refresh(winner)
        return WinnerRead.model_validate(winner)

    @app.delete(
        "/v1/admin/winners/{winner_id}",
        dependencies=[Depends(require_admin), Depends(require_writable)],
    )
    def delete_winner(winner_id: int, session: Session = Depends(get_session)) -> dict[str, object]:
        winner = session.get(Winner, winner_id)
        if winner is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="winner_not_found")
        session.delete(winner)
        session.commit()
        return {"ok": True, "deleted_winner_id": winner_id}

    return app


app = create_app()
