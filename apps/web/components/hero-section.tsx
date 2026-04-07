import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  summary?: {
    awards_count: number;
    winners_count: number;
    countries_count: number;
    disciplines_count: number;
  };
}

export function HeroSection({ summary }: HeroSectionProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 lg:py-24">
      {/* Left Side - Image */}
      <div className="relative w-full aspect-square bg-linear-to-br from-brand-08 to-white-92 min-h-100 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full relative flex items-center justify-center">
          <Image
            src="/images/hero-img-2.svg"
            alt="أوج - منصة الجوائز العلمية"
            height={800}
            width={800}
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="grid gap-6 lg:gap-8">
        <div className="grid gap-3">
          <span className="text-brand font-display text-xs font-semibold tracking-widest uppercase">
            اكتشف الجوائز العلمية
          </span>
          <h1 className="text-text font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            دليل الجوائز العلمية
            <span className="block text-brand">والحاصلين عليها</span>
          </h1>
        </div>

        <p className="text-muted text-lg leading-relaxed max-w-lg">
          منصة عربية شاملة تجمع أبرز الجوائز العلمية والإنسانية في مكان واحد.
          اكتشف الفائزين والمؤسسات الرائدة في مجالاتهم عبر بحث متقدم وفلترة
          سهلة.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/awards"
            className="button-primary px-8 py-3.5 text-white! font-semibold inline-flex items-center justify-center rounded-none"
          >
            ابدأ الاستكشاف
          </Link>
          <Link
            href="/awards"
            className="button-secondary px-8 py-3.5 text-base font-semibold inline-flex items-center justify-center rounded-none"
          >
            تعرف على المزيد
          </Link>
        </div>
      </div>
    </section>
  );
}
