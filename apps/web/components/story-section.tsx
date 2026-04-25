"use client";

import { editorialSections } from "@/lib/content";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BookMarked, Lightbulb, Sparkles } from "lucide-react";

const icons = [BookMarked, Lightbulb, Sparkles];

export function StorySection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="py-12 lg:py-20 px-4 lg:px-8 bg-gradient-to-br from-text-8 via-text-92 to-text-88"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-6 grid-cols-1 md:grid-cols-3"
      >
        {editorialSections.story.map((block, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.article
              key={block.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-8 border border-border bg-surface backdrop-blur-sm hover:bg-white-55 transition-all duration-300">
                <div className="mb-6 p-3 inline-flex rounded-lg bg-brand-08 group-hover:bg-brand-12 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-brand" />
                </div>
                <motion.h2
                  className="text-2xl lg:text-3xl font-display font-bold text-text mb-3"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                >
                  {block.title}
                </motion.h2>
                <motion.p
                  className="text-base leading-relaxed text-muted"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.15 + 0.6, duration: 0.6 }}
                >
                  {block.body}
                </motion.p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
