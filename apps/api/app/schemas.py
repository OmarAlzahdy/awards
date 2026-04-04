from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class WinnerBase(BaseModel):
    cycle_label: str | None = None
    winner_name: str
    nationality_or_location: str | None = None
    summary: str | None = None
    discipline: str | None = None


class WinnerCreate(WinnerBase):
    award_id: int


class WinnerUpdate(WinnerBase):
    pass


class WinnerRead(WinnerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    award_id: int
    created_at: datetime
    updated_at: datetime


class AwardBase(BaseModel):
    name: str
    summary: str | None = None
    supervising_body: str | None = None
    prize_value: str | None = None
    year_established: int | None = None
    country: str | None = None
    discipline: str | None = None
    notes: str | None = None
    website_url: str | None = None
    authority_name: str | None = None
    authority_type: str | None = None


class AwardCreate(AwardBase):
    id: int | None = None


class AwardUpdate(AwardBase):
    pass


class AwardRead(AwardBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    winner_count: int
    created_at: datetime
    updated_at: datetime


class AwardsListResponse(BaseModel):
    items: list[AwardRead]
    page: int
    page_size: int
    total: int
    total_pages: int


class StatsDiscipline(BaseModel):
    name: str
    count: int


class StatsSummary(BaseModel):
    awards_count: int
    winners_count: int
    countries_count: int
    disciplines_count: int
    top_disciplines: list[StatsDiscipline]
    read_only_mode: bool


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    read_only_mode: bool
    expires_in_seconds: int


class ImportSummary(BaseModel):
    awards_imported: int
    winners_imported: int
    issues_recorded: int
    ignored_blank_columns: int
    report_path: str
