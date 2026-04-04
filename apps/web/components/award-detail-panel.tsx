import Link from "next/link";

import type { Award, Winner } from "@/lib/types";

type AwardDetailPanelProps = {
  award: Award;
  winners: Winner[];
};

export function AwardDetailPanel({ award, winners }: AwardDetailPanelProps) {
  return (
    <div className="page-stack">
      <section className="detail-hero">
        <div className="detail-copy">
          <span className="eyebrow">بيانات الجائزة</span>
          <h1>{award.name}</h1>
          <p>{award.summary || "لا توجد نبذة مسجلة لهذه الجائزة."}</p>
        </div>
        <div className="detail-actions">
          <Link className="button-primary" href={`/awards/${award.id}/winners`}>
            صفحة الفائزين
          </Link>
          {award.website_url ? (
            <a className="button-secondary" href={award.website_url} target="_blank" rel="noreferrer">
              الموقع الرسمي
            </a>
          ) : null}
        </div>
      </section>

      <section className="detail-grid">
        <article className="info-card">
          <h2>معلومات أساسية</h2>
          <dl className="detail-list">
            <div>
              <dt>عدد الفائزين</dt>
              <dd>{award.winner_count}</dd>
            </div>
            <div>
              <dt>التخصص</dt>
              <dd>{award.discipline || "غير محدد"}</dd>
            </div>
            <div>
              <dt>الدولة</dt>
              <dd>{award.country || "غير محدد"}</dd>
            </div>
            <div>
              <dt>سنة البداية</dt>
              <dd>{award.year_established || "غير محدد"}</dd>
            </div>
            <div>
              <dt>قيمة الجائزة</dt>
              <dd>{award.prize_value || "غير محدد"}</dd>
            </div>
          </dl>
        </article>

        <article className="info-card">
          <h2>الجهة المشرفة</h2>
          <dl className="detail-list">
            <div>
              <dt>الهيئة</dt>
              <dd>{award.authority_name || award.supervising_body || "غير محدد"}</dd>
            </div>
            <div>
              <dt>نوع الهيئة</dt>
              <dd>{award.authority_type || "غير محدد"}</dd>
            </div>
            <div>
              <dt>ملاحظات</dt>
              <dd>{award.notes || "لا توجد ملاحظات إضافية."}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="preview-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">سجل الفائزين</span>
            <h2>معاينة سريعة</h2>
          </div>
          <p>يعرض هذا القسم أول مجموعة من الفائزين المسجلين. الصفحة الكاملة تعرض كل الأسماء والبيانات المرتبطة بها.</p>
        </div>

        <div className="winner-list">
          {winners.slice(0, 6).map((winner) => (
            <article className="winner-card" key={winner.id}>
              <h3>{winner.winner_name}</h3>
              <p>{winner.summary || "لا توجد نبذة إضافية."}</p>
              <div className="winner-meta">
                <span>{winner.cycle_label || "دورة غير محددة"}</span>
                <span>{winner.nationality_or_location || "غير محدد"}</span>
                <span>{winner.discipline || "غير محدد"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

