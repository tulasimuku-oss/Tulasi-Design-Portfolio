"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { getProjectCover } from "@/lib/project-images";
import { ProjectCoverFrame } from "@/components/ProjectCoverFrame";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const coverImage = getProjectCover(project.slug, project.coverImage);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group"
    >
      <Link href={`/work/${project.slug}`} className="glass-card block">
        {coverImage ? (
          <ProjectCoverFrame src={coverImage} alt={project.title} />
        ) : (
          <div className="glass-image-frame aspect-[4/3] bg-gradient-to-br from-peri-dark to-bg-deep" />
        )}
        <div className="glass-caption px-5 py-4">
          <p className="font-medium text-text-primary group-hover:text-peri-glow">
            {project.title}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
