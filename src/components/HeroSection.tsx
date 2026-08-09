"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { FadeIn } from "@/components/AnimatedSection";
import { ContactDialog } from "@/components/ContactDialog";

const HIGHLIGHTS = [
  "deep research",
  "visual thinking",
  "high empathy",
  "untapped potential",
  "seamless inclusivity",
] as const;

const CYCLE_MS = 4500;
const HEADLINE_FONT =
  "text-3xl font-medium leading-[1.15] text-text-primary md:text-4xl lg:text-[2.75rem]";

const slideTransition = {
  duration: 0.9,
  ease: [0.4, 0, 0.2, 1] as const,
};

function KineticTagline() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const activeWord = HIGHLIGHTS[phase];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setPhase((current) => (current + 1) % HIGHLIGHTS.length);
    }, CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <h1 className={HEADLINE_FONT}>{site.tagline}</h1>;
  }

  return (
    <h1 className={HEADLINE_FONT}>
      <span>I turn </span>
      <span className="inline-block h-[1.15em] overflow-hidden align-bottom">
        <motion.span layout className="relative inline-block h-full">
          <span className="invisible block whitespace-nowrap" aria-hidden>
            {activeWord}
          </span>
          <AnimatePresence initial={false}>
            <motion.span
              key={activeWord}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={slideTransition}
              className="kinetic-highlight absolute left-0 top-0 whitespace-nowrap"
            >
              {activeWord}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </span>
      <span> into better experiences.</span>
    </h1>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[68svh] items-center px-6 pb-6 pt-24 md:min-h-[72svh] md:pb-8 md:pt-28"
    >
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <FadeIn className="min-w-0">
            <p className="label-caps text-peri-glow">Tulasi Mukunda</p>
            <p className="label-caps mt-2 text-text-subtle">UI/UX Designer</p>
            <div className="mt-5">
              <KineticTagline />
            </div>
          </FadeIn>

          <FadeIn
            delay={0.2}
            className="glass-strong overflow-visible rounded-3xl p-6 md:p-8"
          >
            <p className="text-base leading-relaxed text-text-muted md:text-lg">
              {site.bio}
            </p>
            <p className="mt-4 text-sm text-text-subtle">{site.availability}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/work"
                className="glass-pill inline-flex rounded-full px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:text-peri-glow"
              >
                View All Projects
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="cta-button"
              >
                Let&apos;s Get In Touch
              </button>
            </div>
          </FadeIn>
        </div>
      </motion.div>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
