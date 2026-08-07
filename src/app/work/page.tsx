"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CollapsibleWorkCategory } from "@/components/CollapsibleWorkCategory";
import {
  getProjectsByCategory,
  categoryLabels,
  type ProjectCategory,
} from "@/data/projects";

const sections: { id: string; category: ProjectCategory }[] = [
  { id: "ux", category: "ux" },
  { id: "ui", category: "ui" },
];

function readCategoryFromHash(): ProjectCategory | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace("#", "");
  return hash === "ux" || hash === "ui" ? hash : null;
}

export default function WorkPage() {
  const [focusedCategory, setFocusedCategory] = useState<ProjectCategory | null>(
    null,
  );

  useLayoutEffect(() => {
    const syncFromHash = () => setFocusedCategory(readCategoryFromHash());
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const orderedSections = useMemo(() => {
    if (!focusedCategory) return sections;

    const active = sections.find((section) => section.category === focusedCategory);
    const inactive = sections.find((section) => section.category !== focusedCategory);
    if (!active || !inactive) return sections;

    return [active, inactive];
  }, [focusedCategory]);

  return (
    <div className="pb-20 pt-20 md:pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection>
          <div className="glass-panel glow-soft mb-10 p-6 md:mb-12 md:p-8">
            <p className="label-caps text-peri-glow">Portfolio</p>
            <h1 className="mt-2 text-3xl font-medium text-text-primary md:text-4xl">
              All Work
            </h1>
          </div>
        </AnimatedSection>
      </div>

      {orderedSections.map(({ id, category }, sectionIndex) => {
        const sectionProjects = getProjectsByCategory(category);
        if (sectionProjects.length === 0) return null;

        const defaultOpen = focusedCategory ? category === focusedCategory : true;

        return (
          <CollapsibleWorkCategory
            key={id}
            id={id}
            label={categoryLabels[category]}
            projects={sectionProjects}
            sectionIndex={sectionIndex}
            defaultOpen={defaultOpen}
          />
        );
      })}
    </div>
  );
}
