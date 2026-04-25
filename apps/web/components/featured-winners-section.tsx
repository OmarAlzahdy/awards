"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Star, Award } from "lucide-react";

interface FeaturedWinner {
  id: number;
  award_id: number;
  winner_name: string;
  nationality_or_location: string | null;
  cycle_label: string | null;
  summary: string | null;
  discipline: string | null;
  awardName: string;
  awardId: number;
}

interface FeaturedWinnersSectionProps {
  winners: FeaturedWinner[];
}

export function FeaturedWinnersSection({
  winners,
}: FeaturedWinnersSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (!winners || winners.length === 0) {
    return null;
  }

  return (
    <section
      ref={ref}
      className="py-12 lg:py-20 px-4 lg:px-8 bg-gradient-to-br  from-brand-92 via-white-96 to-brand-88"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="grid gap-4 mb-12 lg:mb-16"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-brand" fill="currentColor" />
            <span className="text-brand font-display text-xs font-semibold tracking-widest uppercase">
              الفائزون المتميزون
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-text mb-4">
            فائزون من مصر
          </h2>
          <p className="text-lg text-muted max-w-3xl leading-relaxed">
            إليك مجموعة من أبرز الفائزين والفائزات بالجوائز العلمية من مصر
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {winners.map((winner) => (
          <motion.div
            key={winner.id}
            variants={itemVariants}
            className="group relative"
          >
            <Link href={`/awards/${winner.awardId}/winners`}>
              <div className="relative p-6 lg:p-7 border border-border bg-white hover:shadow-card hover:border-brand transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 inline-flex rounded-lg bg-brand-08 group-hover:bg-brand-12 transition-colors duration-300">
                    <Award className="w-5 h-5 text-brand" />
                  </div>
                  {winner.cycle_label && (
                    <span className="text-xs font-semibold text-brand bg-brand-08 px-2.5 py-1 rounded">
                      {winner.cycle_label}
                    </span>
                  )}
                </div>
                <motion.h3
                  className="text-xl font-display font-bold text-text mb-2"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {winner.winner_name}
                </motion.h3>
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <p className="text-sm text-muted leading-relaxed">
                    <span className="font-semibold text-text">الجائزة:</span>{" "}
                    {winner.awardName}
                  </p>
                  {winner.discipline && (
                    <p className="text-sm text-muted">
                      <span className="font-semibold text-text">التخصص:</span>{" "}
                      {winner.discipline}
                    </p>
                  )}
                  {winner.nationality_or_location && (
                    <p className="text-sm text-muted">
                      <span className="font-semibold text-text">المقر:</span>{" "}
                      {winner.nationality_or_location}
                    </p>
                  )}
                  {winner.summary && (
                    <p className="text-sm text-muted line-clamp-3">
                      {winner.summary}
                    </p>
                  )}
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
