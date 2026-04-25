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
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        src="/videos/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay — lighter, centered vignette instead of side gradient */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Content — full-width centered */}
      <div className="relative z-10 w-full px-6 lg:px-16 max-w-7xl mx-auto text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-2 -mb-8">
          <span className="block w-8 h-px bg-white opacity-80" />
          <div className="relative w-72 h-72 ">
            <Image
              src="/images/new-logo.png"
              alt="أوج - شعار المنصة"
              fill
              className="object-cover object-center"
            />
          </div>
          <span className="block w-8 h-px bg-white opacity-80" />
        </div>

        {/* Main Title */}
        <h1 className="font-display text-5xl md:text-7xl xl:text-8xl font-bold leading-tight text-white/95 gap-8 mb-6 drop-shadow-sm">
          <span className="block font-light tracking-wide">دليل الجوائز</span>
          <span className="block bg-brand/50 py-4  to-white  text-white mt-1">
            العلمية والفائزون
          </span>
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-8">
          <span className="block w-16 h-px bg-white/30" />
          <span className="block w-2 h-2 rounded-full bg-brand/70" />
          <span className="block w-16 h-px bg-white/30" />
        </div>

        {/* Description */}
        <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-light">
          منصة عربية شاملة تجمع أبرز الجوائز العلمية والإنسانية في مكان واحد.
          اكتشف الفائزين والمؤسسات الرائدة في مجالاتهم.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/awards"
            className="button-primary px-10 py-4 text-white! font-semibold inline-flex items-center justify-center rounded-none hover:scale-105 transition-transform duration-300"
          >
            ابدأ الاستكشاف
          </Link>
          <Link
            href="/awards"
            className="button-secondary px-10 py-4 text-white! text-base font-semibold inline-flex items-center justify-center rounded-none hover:scale-105 transition-transform duration-300 bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/20"
          >
            تعرف على المزيد
          </Link>
        </div>

        {/* Stats Row */}
        {summary && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 max-w-3xl mx-auto">
            {[
              { value: summary.awards_count, label: "جائزة" },
              { value: summary.winners_count, label: "فائز" },
              { value: summary.countries_count, label: "دولة" },
              { value: summary.disciplines_count, label: "تخصص" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center py-5 px-4 bg-black/30 backdrop-blur-sm"
              >
                <span className="text-3xl font-bold text-white/95 font-display tabular-nums">
                  {value.toLocaleString("ar-EG")}
                </span>
                <span className="text-white/55 text-sm mt-1 font-light tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
