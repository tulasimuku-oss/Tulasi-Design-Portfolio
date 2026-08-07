import projectCoversData from "@/data/project-covers.json";
import projectImagesData from "@/data/project-images.json";
import {
  getSlideDeckImages,
  isSlideDeckProject,
  type SlideDeckSlug,
} from "@/lib/slide-decks";

export type ProjectImageMap = Record<string, string[]>;
export type ProjectCoverMap = Record<string, string>;

export const projectImages = projectImagesData as ProjectImageMap;
export const projectCovers = projectCoversData as ProjectCoverMap;

export function getProjectImages(slug: string): string[] {
  if (isSlideDeckProject(slug)) {
    return getSlideDeckImages(slug);
  }

  return projectImages[slug] ?? [];
}

export function optimizeGalleryUrl(url: string): string {
  // Adobe Portfolio hashes are tied to each rendition — never rewrite sizes.
  return url;
}

export function isRemotePortfolioImage(url: string): boolean {
  return url.startsWith("https://cdn.myportfolio.com");
}

export function getProjectCover(slug: string, fallback?: string): string | undefined {
  if (slug === "namma-metro") {
    return fallback ?? "/projects/namma-metro/cover.png";
  }

  if (slug === "liveasy") {
    return fallback ?? "/projects/liveasy/cover.png";
  }

  if (slug === "budgee") {
    return fallback ?? "/projects/budgee/cover.png";
  }

  if (slug === "library-management") {
    return fallback ?? "/projects/library-management/cover.png";
  }

  if (isSlideDeckProject(slug)) {
    return fallback ?? `/projects/${slug}/page-0001.png`;
  }

  return fallback ?? projectCovers[slug] ?? projectImages[slug]?.[0];
}

export function getSlideDeckPagePath(slug: SlideDeckSlug, page: number): string {
  return `/projects/${slug}/page-${String(page).padStart(4, "0")}.png`;
}
