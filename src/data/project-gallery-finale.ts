export interface ProjectGalleryFinale {
  videoSrc: string;
  caption: string;
}

export const projectGalleryFinale: Record<string, ProjectGalleryFinale> = {
  caelum: {
    videoSrc: "/projects/caelum/caelum-outdoor.mp4",
    caption: "A quick look at how the concept works in an outdoor setting",
  },
};

export function getProjectGalleryFinale(
  slug: string,
): ProjectGalleryFinale | undefined {
  return projectGalleryFinale[slug];
}