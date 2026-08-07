export const site = {
  name: "Tulasi Mukunda",
  title: "UX Designer",
  tagline: "I turn research and visual thinking into better experiences.",
  phone: "+91 7619427555",
  whatsapp: "+91 7619427555",
  bio: "I'm Tulasi Mukunda, a UX designer with a background in visual communication and over 2 years of professional design experience. I combine research, empathy, and visual thinking to create experiences that are both useful and engaging.",
  availability: "Open to full-time UX/UI roles · Bengaluru & Remote",
  linkedin: "https://www.linkedin.com/in/tulasi-mukunda-83926b277/",
  email: "tulasimuku@gmail.com",
} as const;

export const skillset = [
  { id: "wireframing", label: "Wireframing" },
  { id: "prototyping", label: "Prototyping" },
  { id: "user-research", label: "User Research" },
  { id: "user-centered", label: "User-centered design principles" },
  { id: "usability-testing", label: "Usability Testing" },
  { id: "accessibility", label: "Accessibility" },
] as const;

export type SkillId = (typeof skillset)[number]["id"];

export const tools = [
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "Microsoft Clipchamp",
  "Canva",
  "Lovable.ai",
] as const;

export const categories = {
  ux: {
    label: "UX & Service Design",
    description:
      "Projects with detailed research, including surveys, interviews and user journey/empathy mapping",
    href: "/work#ux",
  },
  ui: {
    label: "UI & Visual Design",
    description:
      "Projects with detailed user interfaces, strong design language and visually appealing brand identity",
    href: "/work#ui",
  },
} as const;
