import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/CaseStudyLayout";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectCard } from "@/components/ProjectCard";
import { projects, getProject } from "@/data/projects";
import { getProjectImages, getProjectCover } from "@/lib/project-images";
import { isSlideDeckProject } from "@/lib/slide-decks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function galleryWithoutCover(images: string[], slug: string): string[] {
  const cover = getProjectCover(slug);
  if (!cover) return images;

  const coverId = cover.match(/\/([a-f0-9-]+)(?:_|\.)/)?.[1];
  return images.filter((img) => {
    if (img === cover) return false;
    if (coverId && img.includes(coverId)) return false;
    if (img.includes("35e3404c-6f9a-4895-bcf8-84b8a6af13b2")) return false;
    return true;
  });
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description ?? project.title,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const isSlideDeck = isSlideDeckProject(slug);
  const hideCaseStudyMeta =
    isSlideDeck ||
    slug === "library-management" ||
    slug === "caelum" ||
    slug === "upi-device" ||
    slug === "myco-interiors" ||
    slug === "miyazaki-tribute" ||
    slug === "budgee";
  const galleryImages = isSlideDeck
    ? getProjectImages(slug)
    : galleryWithoutCover(getProjectImages(slug), slug);

  const related = projects
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3);

  return (
    <article className="pb-16">
      <CaseStudyHero
        project={project}
        showCoverImage={!isSlideDeck}
        showYear={!hideCaseStudyMeta}
        showNote={!hideCaseStudyMeta}
      />

      <section className="py-8 md:py-12">
        <ProjectGallery
          images={galleryImages}
          title={project.title}
          layout="showcase"
          imageFit={isSlideDeck ? "contain" : "cover"}
          interactive={!isSlideDeck}
        />
      </section>

      {project.prototypeUrl && (
        <section className="px-6 pb-12 md:pb-16">
          <div className="mx-auto max-w-6xl text-center">
            <a
              href={project.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-gradient-to-r from-peri to-peri-light px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(102,103,171,0.55),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-white/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_44px_rgba(139,140,199,0.75)]"
            >
              Check out the working prototype here
            </a>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-white/5 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-medium text-text-primary">
              You may also like
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href="/work"
            className="label-caps text-peri-glow transition-colors hover:text-text-primary"
          >
            ↑ Back to Top
          </Link>
        </div>
      </section>
    </article>
  );
}
