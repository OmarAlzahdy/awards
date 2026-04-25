"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import type { Award } from "@/lib/types";
import { Award as AwardIcon } from "lucide-react";

type LandingSearchProps = {
  awards: Award[];
  title: string;
  description: string;
};

export function LandingSearch({
  awards,
  title,
  description,
}: LandingSearchProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredAwards = normalizedQuery
    ? awards.filter((award) =>
        [
          award.name,
          award.country,
          award.discipline,
          award.supervising_body,
          award.authority_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : awards;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -4,
      boxShadow: "0 24px 48px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="grid gap-3">
          <span className="text-sm font-semibold text-text">
            ابحث في اسم الجائزة أو التخصص أو الدولة أو الجهة
          </span>
          <input
            aria-label="بحث الجوائز"
            className="w-full h-12 border border-border bg-white px-4 py-2 text-text placeholder-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand focus:ring-opacity-20"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="مثال: التربية، قطر، نايف، الدراسات الإسلامية"
          />
        </label>
      </div>

      {!filteredAwards.length ? (
        <div className="p-6 border border-border bg-white-92 text-center">
          <p className="text-muted">
            لا توجد نتائج مطابقة لعبارة البحث الحالية.
          </p>
        </div>
      ) : (
        <motion.div
          ref={ref}
          variants={containerVariants}
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredAwards.map((award, index) => (
            <motion.div
              key={award.id}
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.article
                variants={hoverVariants}
                className="group relative h-full p-6 border-2 border-brand bg-white overflow-hidden flex flex-col"
              >
                {/* Brand accent top border */}
                <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand to-brand-strong" />

                {/* Gradient accent corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand opacity-5 rounded-bl-full -mr-8 -mt-8 group-hover:opacity-8 transition-opacity" />

                {/* Content */}
                <div className="relative space-y-4 flex-1">
                  {/* Icon */}
                  <div className="inline-flex p-3 rounded-lg bg-brand-08 group-hover:bg-brand-12 transition-colors">
                    <AwardIcon className="w-5 h-5 text-brand" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg lg:text-xl font-display font-bold text-text leading-tight">
                    {award.name}
                  </h3>

                  {/* Divider */}
                  <div className="h-1 w-8 bg-gradient-to-r from-brand to-brand-strong" />

                  {/* Meta Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">الدولة</span>
                      <span className="font-semibold text-text border-r-2 border-brand pr-3">
                        {award.country || "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">التخصص</span>
                      <span className="font-semibold text-text border-r-2 border-brand pr-3">
                        {award.discipline || "غير محدد"}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  {award.summary && (
                    <p className="text-sm text-muted leading-relaxed pt-2">
                      {award.summary}
                    </p>
                  )}

                  {/* Winner Count Highlight */}
                  <div className="mt-4 p-3 bg-brand-08 border-l-4 border-brand">
                    <span className="text-sm font-semibold text-brand">
                      {award.winner_count} فائز/ة
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                  <Link
                    className="flex-1 px-3 py-2 text-sm text-white! font-semibold  bg-brand hover:bg-brand-strong transition-colors text-center"
                    href={`/awards/${award.id}/winners`}
                  >
                    الفائزون
                  </Link>
                  <Link
                    className="flex-1 px-3 py-2 text-sm font-semibold text-brand border-2 border-brand hover:bg-brand-08 transition-colors text-center"
                    href={`/awards/${award.id}`}
                  >
                    التفاصيل
                  </Link>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tl from-brand opacity-5 rounded-tr-full group-hover:opacity-8 transition-opacity" />
              </motion.article>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
