from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )


class Award(TimestampMixin, Base):
    __tablename__ = "awards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(500))
    summary: Mapped[str | None] = mapped_column(Text)
    supervising_body: Mapped[str | None] = mapped_column(String(500))
    prize_value: Mapped[str | None] = mapped_column(String(500))
    year_established: Mapped[int | None] = mapped_column(Integer)
    country: Mapped[str | None] = mapped_column(String(255))
    discipline: Mapped[str | None] = mapped_column(String(255))
    notes: Mapped[str | None] = mapped_column(Text)
    website_url: Mapped[str | None] = mapped_column(String(1000))
    authority_name: Mapped[str | None] = mapped_column(String(500))
    authority_type: Mapped[str | None] = mapped_column(String(500))
    search_text: Mapped[str] = mapped_column(Text)

    winners: Mapped[list["Winner"]] = relationship(
        back_populates="award", cascade="all, delete-orphan"
    )


class Winner(TimestampMixin, Base):
    __tablename__ = "winners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    award_id: Mapped[int] = mapped_column(ForeignKey("awards.id", ondelete="CASCADE"), index=True)
    cycle_label: Mapped[str | None] = mapped_column(String(255))
    winner_name: Mapped[str] = mapped_column(String(255))
    nationality_or_location: Mapped[str | None] = mapped_column(String(255))
    summary: Mapped[str | None] = mapped_column(Text)
    discipline: Mapped[str | None] = mapped_column(String(255))

    award: Mapped[Award] = relationship(back_populates="winners")


class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    imported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    awards_count: Mapped[int] = mapped_column(Integer, default=0)
    winners_count: Mapped[int] = mapped_column(Integer, default=0)
    awards_json: Mapped[str] = mapped_column(Text)
    winners_json: Mapped[str] = mapped_column(Text)


class ImportIssue(Base):
    __tablename__ = "import_issues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_sheet: Mapped[str] = mapped_column(String(255))
    source_key: Mapped[str] = mapped_column(String(255))
    issue_type: Mapped[str] = mapped_column(String(255))
    raw_row_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

