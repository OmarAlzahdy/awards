"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import type { Award } from "@/lib/types";

type LandingSearchProps = {
  awards: Award[];
  title: string;
  description: string;
};

export function LandingSearch({ awards, title, description }: LandingSearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredAwards = normalizedQuery
    ? awards.filter((award) =>
        [
          award.name,
          award.country,
          award.discipline,
          award.supervising_body,
          award.authority_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : awards;

  return (
    <section className="search-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">القسم الثاني</span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <label className="search-input-shell">
        <span>ابحث في اسم الجائزة أو التخصص أو الدولة أو الجهة</span>
        <input
          aria-label="بحث الجوائز"
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="مثال: التربية، قطر، نايف، الدراسات الإسلامية"
        />
      </label>

      <div className="award-grid">
        {filteredAwards.map((award) => (
          <article className="award-card" key={award.id}>
            <div className="award-card-top">
              <span className="pill">{award.country || "غير محدد"}</span>
              <span className="award-count">{award.winner_count} فائز/ة</span>
            </div>
            <h3>{award.name}</h3>
            <p>{award.summary || "لا توجد نبذة مختصرة مسجلة لهذه الجائزة بعد."}</p>
            <dl className="award-meta">
              <div>
                <dt>التخصص</dt>
                <dd>{award.discipline || "غير محدد"}</dd>
              </div>
              <div>
                <dt>الجهة</dt>
                <dd>{award.authority_name || award.supervising_body || "غير محدد"}</dd>
              </div>
            </dl>
            <div className="card-actions">
              <Link className="button-primary" href={`/awards/${award.id}/winners`}>
                عرض الفائزين
              </Link>
              <Link className="button-secondary" href={`/awards/${award.id}`}>
                تفاصيل الجائزة
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!filteredAwards.length ? (
        <div className="empty-state">
          <p>لا توجد نتائج مطابقة لعبارة البحث الحالية.</p>
        </div>
      ) : null}
    </section>
  );
}
