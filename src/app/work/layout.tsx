import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected UX, service design, UI, and visual design projects by Tulasi Mukunda.",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
