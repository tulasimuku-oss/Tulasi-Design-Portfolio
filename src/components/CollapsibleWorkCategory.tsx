"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectGrid } from "@/components/ProjectGrid";
import type { Project } from "@/data/projects";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

interface CollapsibleWorkCategoryProps {
  id: string;
  label: string;
  projects: Project[];
  sectionIndex: number;
  defaultOpen?: boolean;
}

export function CollapsibleWorkCategory({
  id,
  label,
  projects,
  sectionIndex,
  defaultOpen = true,
}: CollapsibleWorkCategoryProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <section
      id={id}
      className={`scroll-mt-24 ${sectionIndex > 0 ? "mt-12 md:mt-14" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection delay={sectionIndex * 0.05}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            className="glass mb-6 flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors hover:border-white/40 md:mb-8 md:px-6 md:py-5"
          >
            <h2 className="text-xl font-medium text-text-primary md:text-2xl">
              {label}
            </h2>
            <ChevronDown open={open} />
          </button>
        </AnimatedSection>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`${id}-panel`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ProjectGrid projects={projects} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
