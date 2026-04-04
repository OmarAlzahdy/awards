from __future__ import annotations

import json
from pathlib import Path

from sqlalchemy import func, select

from app.config import Settings
from app.database import build_runtime, init_db
from app.importer import import_workbook
from app.models import Award, ImportIssue, Winner


def test_import_workbook_handles_grouping_and_orphans(tmp_path: Path, workbook_path: Path) -> None:
    settings = Settings(
        database_path=str(tmp_path / "import_test.db"),
        workbook_path=str(workbook_path),
        import_report_path=str(tmp_path / "report.json"),
        auto_seed=False,
    )
    runtime = build_runtime(settings)
    init_db(runtime)

    with runtime.session_factory() as session:
        result = import_workbook(session, workbook_path, tmp_path / "report.json")

        award_total = session.scalar(select(func.count()).select_from(Award)) or 0
        winners_total = session.scalar(select(func.count()).select_from(Winner)) or 0
        issues_total = session.scalar(select(func.count()).select_from(ImportIssue)) or 0

        assert result.awards_imported == 61
        assert result.winners_imported == 437
        assert result.issues_recorded == 10
        assert result.ignored_blank_columns == 18
        assert award_total == 61
        assert winners_total == 437
        assert issues_total == 10

        award_1 = session.get(Award, 1)
        assert award_1 is not None
        assert award_1.website_url == "naifprize.org.sa"
        assert award_1.authority_name == "الأمانة العامة لجائزة نايف بن عبدالعزيز"

        award_61 = session.get(Award, 61)
        award_62 = session.get(Award, 62)
        assert award_61 is not None and award_61.website_url is None
        assert award_62 is not None and award_62.website_url is None

    report = json.loads((tmp_path / "report.json").read_text(encoding="utf-8"))
    assert report["issues_recorded"] == 10
    assert any(issue["source_key"] == "40" for issue in report["issues"])

