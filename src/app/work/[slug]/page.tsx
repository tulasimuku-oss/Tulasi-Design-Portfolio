import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTopButton } from "@/components/BackToTopButton";
import { CaseStudyHero } from "@/components/CaseStudyLayout";
import { ProjectGallery } from "@/components/ProjectGallery";
import { projects, getProject } from "@/data/projects";
import { getProjectImages, getProjectCover } from "@/lib/project-images";
import { getProjectSlideLinks } from "@/data/slide-links";
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
  const saraliSlideDeck = slug === "sarali-attendance-tracker";
  const galleryImages =
    isSlideDeck || saraliSlideDeck
      ? getProjectImages(slug)
      : galleryWithoutCover(getProjectImages(slug), slug);
  const slideLinks = getProjectSlideLinks(slug);

  return (
    <article id="case-study-top" className="pb-16">
      <CaseStudyHero
        project={project}
        showCoverImage={!isSlideDeck && !saraliSlideDeck}
        showNote={!hideCaseStudyMeta}
      />

      <section className="py-8 md:py-12">
        <ProjectGallery
          images={galleryImages}
          title={project.title}
          layout="showcase"
          imageFit={isSlideDeck || saraliSlideDeck ? "contain" : "cover"}
          interactive
          slideLinks={slideLinks}
        />
      </section>

      {project.prototypeUrl && (
        <section className="px-6 pb-12 md:pb-16">
          <div className="mx-auto max-w-6xl text-center">
            <a
              href={project.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              Check out the working prototype here
            </a>
          </div>
        </section>
      )}

      <section className="px-6 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <BackToTopButton className="label-caps text-peri-glow transition-colors hover:text-text-primary">
            ↑ Back to Top
          </BackToTopButton>
        </div>
      </section>
    </article>
  );
}
