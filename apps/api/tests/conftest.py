from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app


@pytest.fixture()
def workbook_path() -> Path:
    return Path(__file__).resolve().parents[3] / "Data_Collection (3)2.xlsx"


@pytest.fixture()
def api_settings(tmp_path: Path, workbook_path: Path) -> Settings:
    return Settings(
        database_path=str(tmp_path / "test_awards.db"),
        workbook_path=str(workbook_path),
        import_report_path=str(tmp_path / "import_issues_report.json"),
        auth_secret="test-secret",
        admin_username="admin",
        admin_password="secret",
        read_only_mode=False,
        auto_seed=True,
    )


@pytest.fixture()
def client(api_settings: Settings) -> TestClient:
    app = create_app(api_settings)
    return TestClient(app)

