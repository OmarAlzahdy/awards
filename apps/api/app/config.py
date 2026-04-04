from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

API_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DB_PATH = API_ROOT / "data" / "awards.db"
DEFAULT_WORKBOOK_PATH = REPO_ROOT / "Data_Collection (3)2.xlsx"
DEFAULT_REPORT_PATH = API_ROOT / "data" / "import_issues_report.json"


class Settings(BaseSettings):
    app_name: str = "دليل الجوائز العلمية العربية"
    admin_username: str = "admin"
    admin_password: str = "change-me"
    auth_secret: str = "replace-this-secret"
    read_only_mode: bool | None = None
    auto_seed: bool = True
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    database_path: str = str(DEFAULT_DB_PATH)
    workbook_path: str = str(DEFAULT_WORKBOOK_PATH)
    import_report_path: str = str(DEFAULT_REPORT_PATH)

    model_config = SettingsConfigDict(
        env_file=(API_ROOT / ".env", REPO_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url(self) -> str:
        return f"sqlite:///{Path(self.database_path).resolve()}"

    @property
    def is_read_only(self) -> bool:
        if self.read_only_mode is not None:
            return self.read_only_mode
        return bool(os.getenv("VERCEL"))

    @property
    def workbook_file(self) -> Path:
        return Path(self.workbook_path).resolve()

    @property
    def report_file(self) -> Path:
        return Path(self.import_report_path).resolve()

    @property
    def db_file(self) -> Path:
        return Path(self.database_path).resolve()

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()
    settings.db_file.parent.mkdir(parents=True, exist_ok=True)
    settings.report_file.parent.mkdir(parents=True, exist_ok=True)
    return settings

