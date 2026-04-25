import { AwardsBrowser } from "@/components/awards-browser";
import { fetchAwards } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AwardsPage() {
  const awards = await fetchAwards({ pageSize: 100 });

  return (
    <div className="grid gap-12 lg:gap-16 px-4">
      <section className="grid gap-6 pt-12 lg:pt-16">
        <div>
          <span className="text-brand font-display text-xs font-semibold tracking-widest uppercase block mb-3">
            صفحة الجوائز
          </span>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-text">
            كل الجوائز
            <span className="block text-brand">المتاحة في الدليل</span>
          </h1>
        </div>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          هذه الصفحة تجمع بيانات الجوائز نفسها، مع إمكانية البحث والتصفية قبل
          الانتقال إلى التفاصيل أو قائمة الفائزين.
        </p>
      </section>

      <AwardsBrowser awards={awards.items} />
    </div>
  );
}
