export interface SlideLink {
  label: string;
  href: string;
}

export const projectSlideLinks: Partial<
  Record<string, Record<number, SlideLink[]>>
> = {
  insnap: {
    0: [{ label: "Main Page", href: "https://www.insnap.in/" }],
    2: [{ label: "ExpoCaptive Website", href: "https://www.expocaptive.com/" }],
    4: [
      { label: "Main Page", href: "https://www.datacaptive.com/" },
      { label: "Canada Page", href: "https://www.datacaptive.com/ca/" },
      {
        label: "YouTube Channel",
        href: "https://www.youtube.com/@datacaptive",
      },
    ],
    6: [
      { label: "Main Page", href: "https://www.reachstream.com/" },
      {
        label: "YouTube Channel",
        href: "https://www.youtube.com/@reachstream/shorts",
      },
    ],
    8: [
      { label: "TechDataPark", href: "https://www.techdatapark.com/" },
      { label: "Medicoleads", href: "https://www.medicoleads.com/" },
      { label: "ESalesClub", href: "https://www.esalesclub.com/" },
      { label: "CampaignLake", href: "https://www.campaignlake.com/" },
    ],
  },
};

export function getProjectSlideLinks(
  slug: string,
): Record<number, SlideLink[]> | undefined {
  return projectSlideLinks[slug];
}
