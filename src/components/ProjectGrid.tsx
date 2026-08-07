"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { getProjectCover } from "@/lib/project-images";
import { ProjectCoverFrame } from "@/components/ProjectCoverFrame";

interface ProjectGridProps {
  projects: Project[];
  featured?: boolean;
}

export function ProjectGrid({ projects, featured = false }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {projects.map((project, index) => {
        const cover = featured
          ? getProjectCover(
              project.slug,
              project.featuredCoverImage ?? project.coverImage,
            )
          : getProjectCover(project.slug, project.coverImage);

        return (
          <motion.article
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="group"
          >
            <Link href={`/work/${project.slug}`} className="glass-card block">
              {cover ? (
                <ProjectCoverFrame src={cover} alt={project.title} />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-peri-dark to-bg-deep" />
              )}

              <div className="glass-caption px-5 py-4">
                <p className="text-base font-medium leading-snug text-text-primary transition-colors group-hover:text-peri-glow md:text-lg">
                  {project.title}
                </p>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}

interface CategoryPanelProps {
  label: string;
  description: string;
  href: string;
  index: number;
}

export function CategoryPanel({
  label,
  description,
  href,
  index,
}: CategoryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={href}
        className="glass-strong group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(102,103,171,0.3)] md:p-8"
      >
        <h2 className="text-xl font-medium text-text-primary transition-colors group-hover:text-peri-glow md:text-2xl">
          {label}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-peri-glow transition-transform group-hover:translate-x-1">
          View projects →
        </span>
      </Link>
    </motion.div>
  );
}
