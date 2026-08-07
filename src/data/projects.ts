export type ProjectCategory = "ux" | "ui";

export interface Project {
  slug: string;
  title: string;
  year: string;
  category: ProjectCategory;
  featured: boolean;
  description?: string;
  note?: string;
  coverImage?: string;
  /** Homepage featured showcase — matches Adobe Portfolio hero tiles */
  featuredCoverImage?: string;
  /** External prototype link shown at end of case study */
  prototypeUrl?: string;
}

export const categoryLabels: Record<ProjectCategory, string> = {
  ux: "UX & Service Design",
  ui: "UI & Visual Design",
};

export const projects: Project[] = [
  {
    slug: "namma-metro",
    title: "Service Design- Namma Metro",
    year: "2024",
    category: "ux",
    featured: true,
    description:
      "Bengaluru's metro system is expanding rapidly—but the experience of using it can still feel fragmented. I investigated how commuters navigate the metro system and identified opportunities to make the journey more seamless, transparent, and predictable.",
    coverImage: "/projects/namma-metro/cover.png",
    featuredCoverImage: "/projects/namma-metro/cover.png",
  },
  {
    slug: "caelum",
    title: "Caelum - A Dynamic Spatial Experience",
    year: "2024",
    category: "ui",
    featured: true,
    coverImage: "/projects/caelum/cover.png",
    featuredCoverImage: "/projects/caelum/cover.png",
  },
  {
    slug: "whatsapp-forums",
    title: "WhatsApp Forums - A study of Indian Agriculture",
    year: "2025",
    category: "ux",
    featured: false,
    description:
      "This project was conducted at Sahyadri Farms, Nashik under DISQ. It dives deeply into the world of agriculture, emerging tech innovations and challenges faced by farmers.",
    coverImage: "/projects/whatsapp-forums/page-0001.png",
  },
  {
    slug: "mingos-payment",
    title: "Alternate Payment Method @ Cafe Mingo's",
    year: "2023",
    category: "ux",
    featured: false,
    coverImage: "/projects/mingos-payment/cover.png",
  },
  {
    slug: "library-management",
    title: "LibraSys - Library Management Software redesign",
    year: "2024",
    category: "ux",
    featured: false,
    description:
      "The library at RV University currently depends on emails, physical records and an outdated software for important tasks. Here's my proposal on how the current system can be enhanced, along with additional innovations",
    coverImage: "/projects/library-management/cover.png",
  },
  {
    slug: "liveasy",
    title: "Liveasy -- SaaS interface redesign",
    year: "2024",
    category: "ui",
    featured: false,
    description:
      "My experience designing for a start-up in the logistics feed. This project is an insight into the prototyping and research work I did which helped improve the overall quality of the product",
    coverImage: "/projects/liveasy/cover.png",
  },
  {
    slug: "myco-interiors",
    title: "MYCO - Future, Nature and You",
    year: "2024",
    category: "ui",
    featured: false,
    coverImage: "/projects/myco-interiors/cover.png",
  },
  {
    slug: "upi-device",
    title: "PAYper - A different take on UPI",
    year: "2024",
    category: "ui",
    featured: false,
    coverImage: "/projects/upi-device/cover.png",
  },
  {
    slug: "miyazaki-tribute",
    title: "Tribute Website- Hayao Miyazaki",
    year: "2024",
    category: "ui",
    featured: false,
    coverImage: "/projects/miyazaki-tribute/cover.png",
  },
  {
    slug: "budgee",
    title: "Budgee -- Your Budget Buddy",
    year: "2025",
    category: "ui",
    featured: false,
    coverImage: "/projects/budgee/cover.png",
    prototypeUrl:
      "https://www.figma.com/make/tmXXUpARBOQuEo6vkBL5zd/Personal-Budget-Planner-App?fullscreen=1&t=xwLv1r0J4VbRzMxQ-1&code-node-id=0-6",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  const featuredOrder = ["namma-metro", "caelum"];
  return featuredOrder
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  const order: Record<ProjectCategory, string[]> = {
    ux: [
      "whatsapp-forums",
      "namma-metro",
      "mingos-payment",
      "library-management",
    ],
    ui: [
      "caelum",
      "budgee",
      "liveasy",
      "myco-interiors",
      "upi-device",
      "miyazaki-tribute",
    ],
  };

  return order[category]
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}
