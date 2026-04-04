import { AwardsBrowser } from "@/components/awards-browser";
import { fetchAwards } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AwardsPage() {
  const awards = await fetchAwards({ pageSize: 100 });

  return (
    <div className="page-stack">
      <section className="page-heading">
        <span className="eyebrow">صفحة الجوائز</span>
        <h1>كل الجوائز المتاحة في الدليل</h1>
        <p>هذه الصفحة تجمع بيانات الجوائز نفسها، مع إمكانية البحث والتصفية قبل الانتقال إلى التفاصيل أو قائمة الفائزين.</p>
      </section>

      <AwardsBrowser awards={awards.items} />
    </div>
  );
}
