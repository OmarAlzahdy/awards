import Link from "next/link";

import type { Award, Winner } from "@/lib/types";

type AwardDetailPanelProps = {
  award: Award;
  winners: Winner[];
};

export function AwardDetailPanel({ award, winners }: AwardDetailPanelProps) {
  return (
    <div className="grid gap-12 lg:gap-16">
      {/* Header Section */}
      <section className="grid gap-6 pt-12 lg:pt-16">
        <div>
          <span className="text-brand font-display text-xs font-semibold tracking-widest uppercase block mb-3">
            بيانات الجائزة
          </span>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-text">
            {award.name}
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-lg text-muted leading-relaxed">
              {award.summary || "لا توجد نبذة مسجلة لهذه الجائزة."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand hover:bg-brand-strong transition-colors text-center"
                href={`/awards/${award.id}/winners`}
              >
                صفحة الفائزين
              </Link>
              {award.website_url && (
                <a
                  className="px-6 py-2.5 text-sm font-semibold text-brand border-2 border-brand hover:bg-brand-08 transition-colors text-center"
                  href={award.website_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  الموقع الرسمي
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border-2 border-brand bg-white">
              <dt className="text-xs text-muted font-medium mb-2">
                عدد الفائزين
              </dt>
              <dd className="text-3xl font-display font-bold text-brand">
                {award.winner_count}
              </dd>
            </div>
            <div className="p-4 border-2 border-brand bg-white">
              <dt className="text-xs text-muted font-medium mb-2">
                سنة البداية
              </dt>
              <dd className="text-3xl font-display font-bold text-brand">
                {award.year_established || "—"}
              </dd>
            </div>
          </div>
        </div>
      </section>

      {/* Key Information Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Award Details Card */}
        <article className="group relative p-6 lg:p-8 border-2 border-brand bg-white overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand to-brand-strong" />

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand opacity-5 rounded-bl-full -mr-8 -mt-8" />

          <div className="relative space-y-4">
            <h2 className="text-2xl font-display font-bold text-text">
              معلومات الجائزة
            </h2>

            <div className="h-1 w-8 bg-gradient-to-r from-brand to-brand-strong" />

            <dl className="space-y-3">
              <div className="space-y-1">
                <dt className="text-xs text-muted font-medium">التخصص</dt>
                <dd className="font-semibold text-text">
                  {award.discipline || "غير محدد"}
                </dd>
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <dt className="text-xs text-muted font-medium">الدولة</dt>
                <dd className="font-semibold text-text">
                  {award.country || "غير محدد"}
                </dd>
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <dt className="text-xs text-muted font-medium">قيمة الجائزة</dt>
                <dd className="font-semibold text-text">
                  {award.prize_value || "غير محدد"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tl from-brand opacity-5 rounded-tr-full" />
        </article>

        {/* Authority Details Card */}
        <article className="group relative p-6 lg:p-8 border-2 border-brand bg-white overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand to-brand-strong" />

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand opacity-5 rounded-bl-full -mr-8 -mt-8" />

          <div className="relative space-y-4">
            <h2 className="text-2xl font-display font-bold text-text">
              الجهة المشرفة
            </h2>

            <div className="h-1 w-8 bg-gradient-to-r from-brand to-brand-strong" />

            <dl className="space-y-3">
              <div className="space-y-1">
                <dt className="text-xs text-muted font-medium">الهيئة</dt>
                <dd className="font-semibold text-text">
                  {award.authority_name || award.supervising_body || "غير محدد"}
                </dd>
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <dt className="text-xs text-muted font-medium">نوع الهيئة</dt>
                <dd className="font-semibold text-text">
                  {award.authority_type || "غير محدد"}
                </dd>
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <dt className="text-xs text-muted font-medium">ملاحظات</dt>
                <dd className="font-semibold text-text">
                  {award.notes || "لا توجد ملاحظات إضافية."}
                </dd>
              </div>
            </dl>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tl from-brand opacity-5 rounded-tr-full" />
        </article>
      </div>

      {/* Winners Preview Section */}
      <section className="grid gap-8">
        <div>
          <span className="text-brand font-display text-xs font-semibold tracking-widest uppercase block mb-3">
            سجل الفائزين
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-text mb-4">
            الفائزون
          </h2>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            يعرض هذا القسم أول مجموعة من الفائزين المسجلين. تفضل{" "}
            <Link
              href={`/awards/${award.id}/winners`}
              className="text-brand font-semibold hover:text-brand-strong underline"
            >
              بزيارة صفحة الفائزين الكاملة
            </Link>{" "}
            لرؤية جميع الأسماء والبيانات المرتبطة.
          </p>
        </div>

        <div className="grid gap-6">
          {winners.slice(0, 6).map((winner) => (
            <article
              key={winner.id}
              className="group relative p-6 border-2 border-brand bg-white overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Top accent */}
              <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand to-brand-strong" />

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand opacity-5 rounded-bl-full -mr-6 -mt-6 group-hover:opacity-8 transition-opacity" />

              <div className="relative space-y-3">
                <h3 className="text-xl font-display font-bold text-text">
                  {winner.winner_name}
                </h3>

                <div className="h-0.5 w-6 bg-gradient-to-r from-brand to-brand-strong" />

                <div className="flex flex-wrap gap-3 text-sm">
                  {winner.cycle_label && (
                    <span className="px-3 py-1 bg-brand-08 text-brand font-semibold">
                      {winner.cycle_label}
                    </span>
                  )}
                  {winner.nationality_or_location && (
                    <span className="px-3 py-1 bg-brand-08 text-brand font-semibold">
                      {winner.nationality_or_location}
                    </span>
                  )}
                  {winner.discipline && (
                    <span className="px-3 py-1 bg-brand-08 text-brand font-semibold">
                      {winner.discipline}
                    </span>
                  )}
                </div>

                {winner.summary && (
                  <p className="text-sm text-muted leading-relaxed italic pt-2">
                    "{winner.summary}"
                  </p>
                )}
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tl from-brand opacity-5 rounded-tr-full group-hover:opacity-8 transition-opacity" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
