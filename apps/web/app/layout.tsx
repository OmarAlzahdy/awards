import type { Metadata } from "next";
import { Cairo, Changa } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const cairo = Cairo({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
});

const changa = Changa({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "دليل الجوائز العلمية العربية",
  description:
    "منصة عربية للجوائز العلمية والحاصلين عليها في العلوم الإنسانية والاجتماعية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${changa.variable}`}
    >
      <body className="text-text font-body min-h-screen">
        <div className="">
          <Navbar />
          <main className="w-full max-w-[95%] mx-auto ">{children}</main>
          <footer className="mt-12 lg:mt-16 bg-brand pt-12 lg:pt-16 px-4 lg:px-8">
            <div className="max-w-[95%] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-12 lg:mb-16">
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-3">
                      أوج
                    </h3>
                    <p className="text-base text-white-72 leading-relaxed max-w-lg">
                      منصة عربية شاملة تجمع الجوائز العلمية والإنسانية في مكان
                      واحد واضح وسهل البحث. اكتشف الفائزين والمؤسسات الرائدة في
                      مجالاتهم.
                    </p>
                  </div>
                  <Link
                    href="/awards"
                    className="px-8 py-3 text-base font-semibold inline-flex items-center justify-center w-fit rounded-none text-brand bg-white hover:bg-white-92 transition-colors"
                  >
                    ابدأ الاستكشاف
                  </Link>
                </div>

                <div className="flex justify-end">
                  <div>
                    <h4 className="text-sm font-semibold tracking-widest text-white-72 mb-6 uppercase">
                      الروابط المهمة
                    </h4>
                    <ul className="grid gap-4 text-white! ">
                      <li>
                        <Link
                          href="/"
                          className="text-white-72 hover:text-white-55! transition-colors"
                        >
                          الرئيسية
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/awards"
                          className="text-white-72 hover:text-white-55! transition-colors"
                        >
                          الجوائز
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-strong pt-8 pb-8">
                <p className="text-xs text-white-55 text-center">
                  © 2026 أوج. جميع الحقوق محفوظة. | منصة عربية للجوائز العلمية
                  والحاصلين عليها
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
