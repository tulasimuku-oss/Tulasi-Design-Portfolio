"use client";

import type { ProjectCategory } from "@/data/projects";
import { categoryLabels } from "@/data/projects";

interface FilterChipsProps {
  active: ProjectCategory | "all";
  onChange: (category: ProjectCategory | "all") => void;
}

const filters: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All Work" },
  { value: "ux", label: categoryLabels.ux },
  { value: "ui", label: categoryLabels.ui },
];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
            active === filter.value
              ? "bg-peri text-white shadow-[0_0_20px_rgba(102,103,171,0.4)]"
              : "glass text-text-muted hover:text-text-primary"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
