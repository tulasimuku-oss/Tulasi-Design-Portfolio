"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { categories } from "@/data/site";

const portals = [
  {
    id: "ui" as const,
    label: categories.ui.label,
    description: categories.ui.description,
    href: categories.ui.href,
    image: "/explore/ui-visual-design.png",
    tint: "from-fuchsia-400/20 via-peri/25 to-transparent",
    glow: "group-hover:shadow-[0_24px_80px_rgba(192,132,252,0.2)]",
  },
  {
    id: "ux" as const,
    label: categories.ux.label,
    description: categories.ux.description,
    href: categories.ux.href,
    image: "/explore/ux-service-design.png",
    tint: "from-sky-400/25 via-peri/20 to-transparent",
    glow: "group-hover:shadow-[0_24px_80px_rgba(56,189,248,0.18)]",
  },
];

export function CategoryPortals() {
  const [activeId, setActiveId] = useState<(typeof portals)[number]["id"] | null>(
    null,
  );

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
              onMouseEnter={() => setActiveId(portal.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(portal.id)}
              onBlur={() => setActiveId(null)}
            >
              <div className="portal-panel__backdrop">
                <Image
                  src={portal.image}
                  alt=""
                  fill
                  priority
                  className={`object-cover transition-all duration-700 ${
                    isActive
                      ? "scale-105 saturate-100"
                      : "scale-100 saturate-[0.68]"
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${portal.tint} transition-opacity duration-500 ${
                    isActive ? "opacity-35" : "opacity-20"
                  }`}
                />
              </div>

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
