import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchAward, fetchAwardWinners } from "@/lib/api";

type AwardWinnersPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AwardWinnersPage({
  params,
}: AwardWinnersPageProps) {
  const { id } = await params;
  const awardId = Number(id);
  const [award, winners] = await Promise.all([
    fetchAward(awardId),
    fetchAwardWinners(awardId),
  ]);

  if (!award) {
    notFound();
  }

  return (
    <div className="grid gap-12 lg:gap-16">
      {/* Header Section */}
      <section className="grid gap-6 pt-12 lg:pt-16">
        <div>
          <span className="text-brand font-display text-xs font-semibold tracking-widest uppercase block mb-3">
            الفائزون
          </span>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-text">
            {award.name}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start justify-between">
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            سجل الفائزين المرتبطين بهذه الجائزة، مع الدورة أو السنة والجنسية أو
            المقر والنبذة المختصرة لكل اسم.
          </p>
          <Link
            className="px-6 py-2.5 text-sm font-semibold text-brand border-2 border-brand hover:bg-brand-08 transition-colors whitespace-nowrap"
            href={`/awards/${award.id}`}
          >
            معلومات الجائزة
          </Link>
        </div>
      </section>

      {/* Winners Grid */}
      <div className="grid gap-6">
        {winners.length === 0 ? (
          <div className="p-8 border border-border bg-white-92 text-center">
            <p className="text-muted">لا يوجد فائزون مسجلون لهذه الجائزة.</p>
          </div>
        ) : (
          winners.map((winner, index) => (
            <article
              key={winner.id}
              className="group relative p-6 lg:p-8 border-2 border-brand bg-white overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Top accent */}
              <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand to-brand-strong" />

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand opacity-5 rounded-bl-full -mr-8 -mt-8 group-hover:opacity-8 transition-opacity" />

              <div className="relative space-y-4">
                {/* Winner Name */}
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-text">
                  {winner.winner_name}
                </h2>

                {/* Divider */}
                <div className="h-1 w-8 bg-gradient-to-r from-brand to-brand-strong" />

                {/* Meta Information */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                  <div className="space-y-1">
                    <dt className="text-xs text-muted font-medium">الدورة</dt>
                    <dd className="font-semibold text-text">
                      {winner.cycle_label || "دورة غير محددة"}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs text-muted font-medium">الجنسية</dt>
                    <dd className="font-semibold text-text">
                      {winner.nationality_or_location || "غير محدد"}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs text-muted font-medium">التخصص</dt>
                    <dd className="font-semibold text-text">
                      {winner.discipline || "غير محدد"}
                    </dd>
                  </div>
                </div>

                {/* Summary */}
                {winner.summary && (
                  <div className="p-4 bg-brand-08 border-l-4 border-brand mt-4">
                    <p className="text-sm text-text leading-relaxed italic">
                      "{winner.summary}"
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tl from-brand opacity-5 rounded-tr-full group-hover:opacity-8 transition-opacity" />
            </article>
          ))
        )}
      </div>
    </div>
  );
}
