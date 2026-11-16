export interface ProfileChatQuestion {
  id: string;
  question: string;
  answer: string;
}

export const profileChatQuestions: ProfileChatQuestion[] = [
  {
    id: "profile-summary",
    question: "Summarise this profile in 2 lines",
    answer:
      "Tulasi Mukunda is a UX designer from Bengaluru, India. She has 2+ years of total experience, including designing web pages and graphics.",
  },
  {
    id: "why-hire-experience",
    question:
      "Tulasi has 2 years of experience, but I want a candidate with more than that. Why should I hire her?",
    answer:
      "More experience does not always equal relevant skills. I am a quick learner with strong teamwork skills. I am ready to step outside my comfort zone and initiate tasks outside my job description. I am also actively exploring emerging AI-based tools to speed up my workflow.",
  },
  {
    id: "skills",
    question: "What are Tulasi's skills?",
    answer:
      "Tulasi is well-versed in wireframing, prototyping, user research, user-centered design principles, and usability and accessibility testing.",
  },
  {
    id: "project-count",
    question: "How many projects are in this portfolio?",
    answer:
      "There are 8 visual design projects and 5 UX design projects, so a total of 14.",
  },
  {
    id: "industries",
    question: "What industries are explored in this portfolio?",
    answer: "B2B marketing, SaaS, finance and education, among others",
  },
  {
    id: "contact",
    question: "How can I get in touch with Tulasi?",
    answer:
      'You can reach out via LinkedIn, WhatsApp, email, or Behance. The details can be found in the "Contact" section of the top nav bar, or the "Let\'s Connect" button on the home page.',
  },
];

export const PROFILE_CHAT_STORAGE_KEY = "portfolio-profile-chat-v1";

export interface ProfileChatSession {
  isOpen: boolean;
  askedIds: string[];
}

export function emptyProfileChatSession(): ProfileChatSession {
  return { isOpen: false, askedIds: [] };
}
