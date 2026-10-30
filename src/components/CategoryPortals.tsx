"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { categories } from "@/data/site";

const portals = [
  {
    id: "ui" as const,
    label: categories.ui.label,
    description: categories.ui.description,
    href: categories.ui.href,
    image: "/explore/ui-visual-design.png",
    hoverVideo: "/explore/ui-design-hover.mp4",
    tint: "from-fuchsia-400/20 via-peri/25 to-transparent",
    glow: "group-hover:shadow-[0_24px_80px_rgba(192,132,252,0.2)]",
  },
  {
    id: "ux" as const,
    label: categories.ux.label,
    description: categories.ux.description,
    href: categories.ux.href,
    image: "/explore/ux-service-design.png",
    hoverVideo: "/explore/ux-design-hover.mp4",
    tint: "from-sky-400/25 via-peri/20 to-transparent",
    glow: "group-hover:shadow-[0_24px_80px_rgba(56,189,248,0.18)]",
  },
];

type PortalId = (typeof portals)[number]["id"];

export function CategoryPortals() {
  const [activeId, setActiveId] = useState<PortalId | null>(null);
  const videoRefs = useRef<Partial<Record<PortalId, HTMLVideoElement>>>({});

  const playPortalVideo = useCallback((id: PortalId) => {
    setActiveId(id);
    const video = videoRefs.current[id];
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
  }, []);

  const stopPortalVideo = useCallback((id: PortalId) => {
    setActiveId((current) => (current === id ? null : current));
    const video = videoRefs.current[id];
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch md:gap-x-8">
      {portals.map((portal, index) => {
        const isActive = activeId === portal.id;

        return (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.55,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full"
          >
            <Link
              href={portal.href}
              className={`portal-panel group relative block aspect-square w-full overflow-hidden rounded-3xl ${portal.glow}`}
              onMouseEnter={() => playPortalVideo(portal.id)}
              onMouseLeave={() => stopPortalVideo(portal.id)}
              onFocus={() => playPortalVideo(portal.id)}
              onBlur={() => stopPortalVideo(portal.id)}
            >
              <div
                className={`portal-panel__backdrop portal-panel__backdrop-image transition-all duration-700 ${
                  isActive
                    ? "portal-panel__backdrop-image--active portal-panel__backdrop-image--video-playing"
                    : ""
                }`}
                style={{ backgroundImage: `url(${portal.image})` }}
                aria-hidden
              />
              <video
                ref={(el) => {
                  if (el) videoRefs.current[portal.id] = el;
                  else delete videoRefs.current[portal.id];
                }}
                className={`portal-panel__backdrop portal-panel__backdrop-video ${
                  isActive ? "portal-panel__backdrop-video--active" : ""
                }`}
                src={portal.hoverVideo}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
              <div
                className={`portal-panel__backdrop portal-panel__backdrop-tint bg-gradient-to-br ${portal.tint} transition-opacity duration-500 ${
                  isActive ? "opacity-35" : "opacity-20"
                }`}
                aria-hidden
              />

              <div className="portal-panel__frost" aria-hidden />

              <div className="portal-panel__content flex h-full flex-col justify-between p-6 md:p-8">
                <div>
                  <h2 className="text-2xl font-medium text-text-primary transition-colors group-hover:text-peri-glow md:text-3xl">
                    {portal.label}
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted md:text-base">
                    {portal.description}
                  </p>
                </div>

                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-peri-glow transition-transform group-hover:translate-x-1.5">
                  View projects
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
