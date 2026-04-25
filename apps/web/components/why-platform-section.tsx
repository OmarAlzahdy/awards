"use client";

import { editorialSections } from "@/lib/content";
import {
  Zap,
  Shield,
  Search,
  Users,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const icons = [Zap, Shield, Search, Users, TrendingUp, Lightbulb];

export function WhyPlatformSection() {
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

  return (
    <section ref={ref} className="py-12 lg:py-20 px-4 lg:px-8 bg-brand">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="grid gap-4 mb-12 lg:mb-16"
      >
        <div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            لماذا هذه المنصة؟
          </h2>
          <p className="text-lg text-white-72 max-w-3xl leading-relaxed">
            منصة شاملة وموثوقة تجمع بين سهولة الاستخدام والمحتوى العلمي الدقيق،
            مما يجعل البحث عن الجوائز والفائزين تجربة سلسة وممتعة
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {editorialSections.heroPoints.map((point, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div
              key={point}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-6 lg:p-7 border border-brand-strong bg-brand-strong hover:bg-white hover:text-brand transition-all duration-300">
                <div className="mb-4 p-3 inline-flex rounded-lg bg-white-12 group-hover:bg-brand-08 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-white group-hover:text-brand" />
                </div>
                <p className="text-base leading-relaxed text-white group-hover:text-brand">
                  {point}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
