import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid gap-6">
      <section className="mx-auto max-w-xl rounded-26 border border-border bg-surface p-6 shadow-card backdrop-blur-2xl text-center">
        <span className="text-brand font-display inline-block text-sm font-medium tracking-widest">
          404
        </span>
        <h1 className="text-clamp  font-display font-bold mt-2">
          الصفحة المطلوبة غير موجودة.
        </h1>
        <p className="text-muted text-base leading-loose mt-2">
          قد تكون الجائزة غير متاحة في قاعدة البيانات الحالية أو أن الرابط غير
          صحيح.
        </p>
        <Link className="button-primary text-white! mt-" href="/">
          العودة إلى الرئيسية
        </Link>
      </section>
    </div>
  );
}
