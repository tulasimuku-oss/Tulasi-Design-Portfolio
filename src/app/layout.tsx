import type { Metadata } from "next";
import { GradientBackground } from "@/components/GradientBackground";
import { Header } from "@/components/Header";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Portfolio`,
    template: `%s — ${site.name}`,
  },
  description: site.bio,
  icons: {
    icon: [{ url: "/favicon.png?v=2", type: "image/png" }],
    apple: "/favicon.png?v=2",
  },
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <GradientBackground />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  );
}
