"use client";

import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
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

const CYCLE_MS = 3800;
const HEADLINE_FONT =
  "text-3xl font-medium leading-[1.15] text-text-primary md:text-4xl lg:text-[2.75rem]";

const wordTransition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
};

function KineticTagline() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLSpanElement>(null);
  const activeWord = HIGHLIGHTS[phase];
  const activeWidth = wordWidths[phase] ?? null;

  useEffect(() => {
    const measureWords = () => {
      if (!measureRef.current) return;

      const nodes =
        measureRef.current.querySelectorAll<HTMLElement>("[data-measure]");
      setWordWidths(
        HIGHLIGHTS.map((_, index) => nodes[index]?.offsetWidth ?? 0),
      );
    };

    measureWords();
    window.addEventListener("resize", measureWords);
    void document.fonts?.ready.then(measureWords);

    return () => window.removeEventListener("resize", measureWords);
  }, []);

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
    <h1 className={`relative ${HEADLINE_FONT}`}>
      <span
        ref={measureRef}
        className="pointer-events-none absolute h-0 overflow-hidden opacity-0"
        aria-hidden
      >
        {HIGHLIGHTS.map((word) => (
          <span
            key={word}
            data-measure
            className={`${HEADLINE_FONT} kinetic-highlight inline-block whitespace-nowrap`}
          >
            {word}
          </span>
        ))}
      </span>

      <span>I turn </span>
      <LayoutGroup id="kinetic-tagline">
        <motion.span
          className="inline-block h-[1.15em] overflow-hidden align-bottom"
          animate={{ width: activeWidth ?? "auto" }}
          transition={wordTransition}
          style={activeWidth ? { width: activeWidth } : undefined}
        >
          <span className="relative block h-full">
            <AnimatePresence initial={false}>
              <motion.span
                key={activeWord}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={wordTransition}
                className="kinetic-highlight absolute left-0 top-0 whitespace-nowrap will-change-transform"
              >
                {activeWord}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.span>
        <motion.span layout="position" transition={wordTransition}>
          {" into better experiences."}
        </motion.span>
      </LayoutGroup>
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
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <motion.div style={{ y: contentY, opacity: contentOpacity }}>
            <FadeIn className="min-w-0">
              <p className="label-caps text-peri-glow">Tulasi Mukunda</p>
              <p className="label-caps mt-2 text-text-subtle">UI/UX Designer</p>
              <div className="mt-5">
                <KineticTagline />
              </div>
            </FadeIn>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-bio-panel">
              <div className="hero-bio-panel__glass" aria-hidden />
              <div className="hero-bio-panel__content p-6 md:p-8">
                <p className="hero-bio-panel__text text-base leading-relaxed md:text-lg">
                  {site.bio}
                </p>
                <p className="hero-bio-panel__meta mt-4 text-sm">
                  {site.availability}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/work" className="hero-bio-panel__projects-link">
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
