export const SLIDE_DECK_PROJECTS = {
  "whatsapp-forums": 33,
  "namma-metro": 19,
  "mingos-payment": 7,
  liveasy: 15,
  budgee: 18,
  insnap: 10,
} as const;

export type SlideDeckSlug = keyof typeof SLIDE_DECK_PROJECTS;

const SLIDE_DECK_CUSTOM_FILES: Partial<Record<SlideDeckSlug, string[]>> = {
  liveasy: [
    "/projects/liveasy/page-0001.png",
    "/projects/liveasy/page-0002.png",
    "/projects/liveasy/page-0003.png",
    "/projects/liveasy/page-0004.png",
    "/projects/liveasy/page-0005.png",
    "/projects/liveasy/page-0006.png",
    "/projects/liveasy/page-0007.png",
    "/projects/liveasy/page-0008.png",
    "/projects/liveasy/page-0009.png",
    "/projects/liveasy/page-0010.png",
    "/projects/liveasy/page-0011.png",
    "/projects/liveasy/page-0012.png",
    "/projects/liveasy/page-0013.png",
    "/projects/liveasy/page-0014.png",
    "/projects/liveasy/page-0015.png",
  ],
};

export function isSlideDeckProject(slug: string): slug is SlideDeckSlug {
  return slug in SLIDE_DECK_PROJECTS;
}

export function getSlideDeckImages(slug: SlideDeckSlug): string[] {
  const custom = SLIDE_DECK_CUSTOM_FILES[slug];
  if (custom) return custom;

  const count = SLIDE_DECK_PROJECTS[slug];
  return Array.from(
    { length: count },
    (_, index) =>
      `/projects/${slug}/page-${String(index + 1).padStart(4, "0")}.png`,
  );
}
