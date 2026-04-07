"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { egyptianWinners } from "@/lib/featured-winners";
import { Users, Award, BookOpen } from "lucide-react";

export function EgyptianWinnersSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Show only first 6 winners
  const featuredWinners = egyptianWinners.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
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
    <section
      ref={ref}
      className="py-16 lg:py-24 px-4 lg:px-8 bg-gradient-to-br from-white via-white-92 to-brand-92"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="mb-16 lg:mb-20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-brand" />
          <span className="text-brand font-display text-xs font-semibold tracking-widest uppercase">
            الفائزون والفائزات
          </span>
        </div>
        <h2 className="text-6xl lg:text-7xl font-display font-bold bg-gradient-to-r from-brand to-brand-strong bg-clip-text text-transparent mb-6">
          فائزون مصريون متميزون
        </h2>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          تكريم لأبرز الأكاديميين والباحثين المصريين المتخصصين في العلوم
          الإنسانية والاجتماعية
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
      >
        {featuredWinners.map((winner, index) => (
          <motion.div
            key={winner.id}
            variants={itemVariants}
            whileHover="hover"
            className="h-full"
          >
            <motion.div
              variants={hoverVariants}
              className="group relative h-full p-8 bg-white rounded-lg border border-white-88 shadow-sm overflow-hidden"
            >
              {/* Gradient Accent Top */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand to-brand-strong opacity-8 rounded-full -mr-16 -mt-16 group-hover:opacity-12 transition-opacity" />

              {/* Number Badge */}
              <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-brand to-brand-strong text-white font-display font-bold text-xl mb-6">
                {String(winner.id).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="relative space-y-4">
                {/* Icon */}
                <div className="inline-flex p-3 rounded-lg bg-brand-08 group-hover:bg-brand-12 transition-colors duration-300">
                  <Award className="w-5 h-5 text-brand" />
                </div>

                {/* Name */}
                <motion.h3
                  className="text-2xl font-display font-bold text-text leading-tight"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                >
                  {winner.name}
                </motion.h3>

                {/* Divider */}
                <div className="h-1 w-12 bg-gradient-to-r from-brand to-brand-strong rounded-full" />

                {/* Field Badge */}
                <motion.div
                  className="flex items-center gap-2 pt-2"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                >
                  <BookOpen className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="text-sm font-semibold text-brand">
                    {winner.field}
                  </span>
                </motion.div>

                {/* Cycle */}
                <motion.div
                  className="flex items-center justify-between gap-2 py-4 px-4 bg-brand-08 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                >
                  <span className="text-xs text-muted font-medium">الدورة</span>
                  <span className="text-sm font-bold text-brand">
                    {winner.cycle}
                  </span>
                </motion.div>

                {/* Highlight */}
                {winner.highlight && (
                  <motion.div
                    className="mt-4 p-4 bg-gradient-to-br from-brand-08 to-white-92 rounded-lg border border-brand-12 text-sm text-text italic leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                  >
                    <span className="text-brand font-semibold">✨ </span>
                    {winner.highlight}
                  </motion.div>
                )}
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-brand opacity-5 rounded-tl-full group-hover:opacity-8 transition-opacity" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
