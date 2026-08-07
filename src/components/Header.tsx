"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";

const navLinks = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/work",
    label: "All Projects",
    match: (path: string) => path === "/work" || path.startsWith("/work/"),
  },
  {
    href: site.linkedin,
    label: "Contact",
    external: true,
  },
];

function navLinkClass(isActive: boolean) {
  return `label-caps rounded-full px-3.5 py-1.5 transition-all duration-300 ${
    isActive
      ? "bg-white/14 text-peri-glow shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] ring-1 ring-white/30"
      : "text-text-muted hover:bg-white/8 hover:text-text-primary"
  }`;
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-40 w-full px-4 pt-4 md:px-6">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-[1.25rem] px-5 py-3.5 md:rounded-[1.75rem] md:px-6">
        <Link
          href="/"
          className="text-sm font-medium tracking-wide text-text-primary transition-colors hover:text-peri-glow"
          onClick={() => setMenuOpen(false)}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = !link.external && link.match?.(pathname);

            return link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClass(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={navLinkClass(Boolean(isActive))}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-[1.25rem] p-3 md:hidden"
          >
            {navLinks.map((link) => {
              const isActive = !link.external && link.match?.(pathname);
              const className = `rounded-xl px-4 py-3 ${navLinkClass(Boolean(isActive))}`;

              return link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={className}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
