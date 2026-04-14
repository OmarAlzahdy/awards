"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../public/images/new-logo.png";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/awards", label: "الجوائز" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-3.5 bg-brand  ">
      <Link className="inline-flex items-center border-0 gap-3.5 " href="/">
        <div className="relative w-28 h-28">
          <Image
            src={logo}
            fill
            alt="أوج"
            className="object-cover object-center filter brightness-125 bg-white/90 "
          />
        </div>
        <span className="flex flex-col gap-1">
          <strong className="font-display tracking-widest text-white text-3xl">
            أَوْج
          </strong>
          <small className="text-white/70">
            منصة عربية للجوائز والحاصلين عليها
          </small>
        </span>
      </Link>
      <nav className="flex gap-2.5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "rounded-full px-4 py-2.5 transition-colors bg-white text-brand! font-semibold"
                  : "rounded-full px-4 py-2.5 transition-colors text-white! hover:bg-white/20"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
