"use client";

import { Trophy, Users2, Globe, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface StatisticsSectionProps {
  summary: {
    awards_count: number;
    winners_count: number;
    countries_count: number;
    disciplines_count: number;
  };
}

const StatisticCard = ({
  icon: Icon,
  value,
  label,
  delay,
  isInView,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  delay: number;
  isInView: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        delay: delay * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="group relative"
    >
      <div className="relative p-6 lg:p-8 border border-border bg-surface backdrop-blur-sm hover:bg-white-55 transition-all duration-300">
        <div className="mb-6 p-3 inline-flex rounded-lg bg-brand-08 group-hover:bg-brand-12 transition-colors duration-300">
          <Icon className="w-6 h-6 text-brand" />
        </div>
        <motion.strong
          className="block text-4xl lg:text-5xl font-display font-bold text-brand mb-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={
            isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }
          }
          transition={{
            delay: delay * 0.1 + 0.2,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
        >
          {displayValue.toLocaleString("ar-SA")}
        </motion.strong>
        <motion.span
          className="text-sm lg:text-base text-muted font-medium"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay * 0.1 + 0.4, duration: 0.5 }}
        >
          {label}
        </motion.span>
      </div>
    </motion.div>
  );
};

export function StatisticsSection({ summary }: StatisticsSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const stats = [
    { icon: Trophy, value: summary.awards_count, label: "جائزة موثقة" },
    { icon: Users2, value: summary.winners_count, label: "فائز وفائزة" },
    { icon: Globe, value: summary.countries_count, label: "دولة ومقر" },
    { icon: BookOpen, value: summary.disciplines_count, label: "مسار تخصصي" },
  ];

  return (
    <section
      ref={ref}
      className="py-12 lg:py-20 px-4 lg:px-8 bg-gradient-to-br from-text-8 via-text-92 to-text-88"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="grid gap-4 lg:gap-6 grid-cols-2 md:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <StatisticCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            delay={index}
            isInView={inView}
          />
        ))}
      </motion.div>
    </section>
  );
}
