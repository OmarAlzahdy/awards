import type { Metadata } from "next";
import { Cairo, Changa } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
  description: "منصة عربية للجوائز العلمية والحاصلين عليها في العلوم الإنسانية والاجتماعية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${changa.variable}`}>
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/">
              <span className="brand-mark">جوائز</span>
              <span className="brand-text">
                <strong>دليل الجوائز</strong>
                <small>منصة عربية للجوائز والحاصلين عليها</small>
              </span>
            </Link>
            <nav className="site-nav">
              <Link href="/">الرئيسية</Link>
              <Link href="/awards">الجوائز</Link>
              <Link href="/admin">الإدارة</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <p>بنيت المنصة لتجميع الجوائز العلمية العربية في مساحة واحدة واضحة وسريعة البحث.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
