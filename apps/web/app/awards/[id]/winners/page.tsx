import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchAward, fetchAwardWinners } from "@/lib/api";

type AwardWinnersPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AwardWinnersPage({ params }: AwardWinnersPageProps) {
  const { id } = await params;
  const awardId = Number(id);
  const [award, winners] = await Promise.all([fetchAward(awardId), fetchAwardWinners(awardId)]);

  if (!award) {
    notFound();
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <span className="eyebrow">الفائزون</span>
        <h1>{award.name}</h1>
        <p>سجل الفائزين المرتبطين بهذه الجائزة، مع الدورة أو السنة والجنسية أو المقر والنبذة المختصرة لكل اسم.</p>
        <Link className="button-secondary" href={`/awards/${award.id}`}>
          الرجوع إلى تفاصيل الجائزة
        </Link>
      </section>

      <section className="winner-list">
        {winners.map((winner) => (
          <article className="winner-card" key={winner.id}>
            <div className="award-card-top">
              <span className="pill">{winner.cycle_label || "دورة غير محددة"}</span>
              <span className="award-count">{winner.nationality_or_location || "غير محدد"}</span>
            </div>
            <h2>{winner.winner_name}</h2>
            <p>{winner.summary || "لا توجد نبذة إضافية."}</p>
            <div className="winner-meta">
              <span>{winner.discipline || "غير محدد"}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

