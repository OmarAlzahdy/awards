import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-stack">
      <section className="info-card not-found-card">
        <span className="eyebrow">404</span>
        <h1>الصفحة المطلوبة غير موجودة.</h1>
        <p>قد تكون الجائزة غير متاحة في قاعدة البيانات الحالية أو أن الرابط غير صحيح.</p>
        <Link className="button-primary" href="/">
          العودة إلى الرئيسية
        </Link>
      </section>
    </div>
  );
}
