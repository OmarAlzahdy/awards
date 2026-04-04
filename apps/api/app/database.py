from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import Settings, get_settings
from .models import Base


@dataclass
class Runtime:
    settings: Settings

    def __post_init__(self) -> None:
        connect_args = {"check_same_thread": False}
        self.engine = create_engine(self.settings.database_url, connect_args=connect_args)
        self.session_factory = sessionmaker(
            bind=self.engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
            class_=Session,
        )


def build_runtime(settings: Settings | None = None) -> Runtime:
    return Runtime(settings or get_settings())


def init_db(runtime: Runtime) -> None:
    Base.metadata.create_all(runtime.engine)

