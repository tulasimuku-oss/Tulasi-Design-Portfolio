"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { categoryLabels } from "@/data/projects";
import { LazyInView } from "@/components/LazyInView";
import { getProjectCover, isRemotePortfolioImage } from "@/lib/project-images";

interface DynamicProjectShowcaseProps {
  projects: Project[];
  /** Use homepage hero covers (Adobe Portfolio featured tiles) */
  featured?: boolean;
}

const layoutPatterns = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5 md:row-span-1",
  "md:col-span-5 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-8 md:row-span-1",
];

export function DynamicProjectShowcase({
  projects,
  featured = false,
}: DynamicProjectShowcaseProps) {
  const isEqualFeaturedPair = featured && projects.length === 2;

  const featuredPlacement = (index: number) => {
    if (!isEqualFeaturedPair) return "";
    if (index === 0) return "md:col-start-1 md:row-start-1";
    return "md:col-start-2 md:row-start-1";
  };

  return (
    <div
      className={
        isEqualFeaturedPair
          ? "grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch md:gap-x-8"
          : "grid auto-rows-[260px] grid-cols-1 gap-5 md:auto-rows-[220px] md:grid-cols-12 md:gap-6"
      }
    >
      {projects.map((project, index) => {
        const cover = featured
          ? getProjectCover(
              project.slug,
              project.featuredCoverImage ?? project.coverImage,
            )
          : getProjectCover(project.slug, project.coverImage);
        const layout = isEqualFeaturedPair
          ? ""
          : layoutPatterns[index % layoutPatterns.length];

        return (
          <motion.article
            key={project.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`group ${layout} ${featuredPlacement(index)}`.trim()}
          >
            <Link
              href={`/work/${project.slug}`}
              className={`glass-card relative flex flex-col ${
                isEqualFeaturedPair ? "min-h-[320px] md:min-h-[380px]" : "h-full"
              }`}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-[calc(1.25rem-1px)]">
                {cover ? (
                  <LazyInView
                    eager={index < 2}
                    className="absolute inset-0"
                    fallback={
                      <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
                    }
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={cover}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={75}
                        priority={index < 2}
                        loading={index < 2 ? undefined : "lazy"}
                        unoptimized={isRemotePortfolioImage(cover)}
                      />
                    </div>
                  </LazyInView>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-peri-dark to-bg-deep" />
                )}
              </div>

              <div className="glass-caption shrink-0 rounded-b-[calc(1.25rem-1px)] p-5 md:p-6">
                <span className="label-caps text-peri-glow">
                  {featured
                    ? categoryLabels[project.category]
                    : `${categoryLabels[project.category]} · ${project.year}`}
                </span>
                <h3 className="mt-2 text-lg font-medium leading-tight text-text-primary transition-colors group-hover:text-peri-glow md:text-xl">
                  {project.title}
                </h3>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
