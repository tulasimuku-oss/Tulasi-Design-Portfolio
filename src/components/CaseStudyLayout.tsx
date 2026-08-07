import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { categoryLabels } from "@/data/projects";
import { getProjectCover, isRemotePortfolioImage } from "@/lib/project-images";

interface CaseStudyHeroProps {
  project: Project;
  showCoverImage?: boolean;
  showYear?: boolean;
  showNote?: boolean;
}

export function CaseStudyHero({
  project,
  showCoverImage = true,
  showYear = true,
  showNote = true,
}: CaseStudyHeroProps) {
  const heroImage = getProjectCover(project.slug, project.coverImage);

  return (
    <>
      <section className="px-6 pt-12 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="glass-panel glow-soft p-6 md:p-10">
            <Link
              href="/work"
              className="label-caps inline-flex items-center gap-2 text-text-muted transition-colors hover:text-peri-glow"
            >
              ← Back to Home
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="glass-pill label-caps rounded-full px-3 py-1.5 text-peri-glow">
                {categoryLabels[project.category]}
              </span>
              {showYear && (
                <span className="glass-pill rounded-full px-3 py-1.5 text-xs text-text-muted">
                  {project.year}
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-medium leading-tight text-text-primary md:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            {project.description && (
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-muted">
                {project.description}
              </p>
            )}

            {showNote && project.note && (
              <p className="glass-pill mt-4 inline-block rounded-xl px-4 py-2 text-sm italic text-text-subtle">
                {project.note}
              </p>
            )}
          </div>
        </div>
      </section>

      {showCoverImage && heroImage && (
        <section className="px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="glass-frame glow-soft overflow-hidden">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={heroImage}
                  alt={project.title}
                  width={1920}
                  height={1080}
                  className="h-auto w-full object-cover"
                  priority
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  unoptimized={isRemotePortfolioImage(heroImage)}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
