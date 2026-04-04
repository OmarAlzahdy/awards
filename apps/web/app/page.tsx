import { fetchAwards, fetchSummary } from "@/lib/api";
import { editorialSections } from "@/lib/content";
import { LandingSearch } from "@/components/landing-search";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [summary, awardsResponse] = await Promise.all([
    fetchSummary(),
    fetchAwards({ pageSize: 24 }),
  ]);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">من مشروع تخرج إلى دليل حي</span>
          <h1>دليل الجوائز العلمية والحاصلين عليها في العلوم الإنسانية والاجتماعية.</h1>
          <p className="hero-lead">{editorialSections.heroLead}</p>
          <div className="hero-stats">
            <article>
              <strong>{summary.awards_count}</strong>
              <span>جائزة موثقة</span>
            </article>
            <article>
              <strong>{summary.winners_count}</strong>
              <span>فائز وفائزة</span>
            </article>
            <article>
              <strong>{summary.countries_count}</strong>
              <span>دولة ومقر</span>
            </article>
            <article>
              <strong>{summary.disciplines_count}</strong>
              <span>مسار تخصصي</span>
            </article>
          </div>
        </div>
        <aside className="hero-note">
          <h2>لماذا هذه المنصة؟</h2>
          <ul className="feature-list">
            {editorialSections.heroPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </aside>
      </section>

      <LandingSearch
        awards={awardsResponse.items}
        title="ابحث عن الجائزة المناسبة"
        description="هذه هي المنطقة العملية في الصفحة: ابحث بالاسم أو الدولة أو التخصص أو الجهة المشرفة، ثم افتح صفحة الفائزين مباشرة أو انتقل إلى تفاصيل الجائزة."
      />

      <section className="editorial-grid">
        {editorialSections.story.map((block) => (
          <article className="info-card" key={block.title}>
            <h2>{block.title}</h2>
            <p>{block.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
