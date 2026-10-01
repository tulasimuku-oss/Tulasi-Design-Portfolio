"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Project } from "@/data/projects";
import { getProjectCover } from "@/lib/project-images";
import { ProjectCoverFrame } from "@/components/ProjectCoverFrame";

interface ProjectCarouselProps {
  projects: Project[];
  categoryLabel?: string;
}

const LOOP_COPIES = 3;
const TRACK_GAP_PX = 20;
const FLIP_INTERVAL_MS = 4800;
const SIDE_OPACITY = 0.68;
const SIDE_SCALE = 0.8;

const FLIP_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 44,
  mass: 0.82,
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function cardCenterInViewport(
  trackIndex: number,
  step: number,
  cardWidth: number,
  viewportWidth: number,
  trackX: number,
) {
  const lead = (viewportWidth - cardWidth) / 2;
  return lead + trackIndex * step + cardWidth / 2 + trackX;
}

function CarouselAutoScrollToggle({
  paused,
  onToggle,
}: {
  paused: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="project-carousel__transport"
      aria-pressed={paused}
      aria-label={paused ? "Play automatic carousel scroll" : "Pause automatic carousel scroll"}
      onClick={onToggle}
    >
      {paused ? (
        <svg viewBox="0 0 24 24" className="h-[0.95rem] w-[0.95rem]" fill="currentColor" aria-hidden>
          <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l11.02-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[0.95rem] w-[0.95rem]" fill="currentColor" aria-hidden>
          <path d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z" />
        </svg>
      )}
    </button>
  );
}

function CarouselCard({
  project,
  trackIndex,
  x,
  step,
  viewportWidth,
  cardWidth,
}: {
  project: Project;
  trackIndex: number;
  x: MotionValue<number>;
  step: number;
  viewportWidth: number;
  cardWidth: number;
}) {
  const cover = getProjectCover(project.slug, project.coverImage);

  const cardFocus = useTransform(x, (latest) => {
    if (!step || !viewportWidth || !cardWidth) {
      return { opacity: 1, scale: 1 };
    }
    const center = cardCenterInViewport(
      trackIndex,
      step,
      cardWidth,
      viewportWidth,
      latest,
    );
    const slidesFromCenter = Math.abs(center - viewportWidth / 2) / step;
    const isCenter = slidesFromCenter <= 0.45;
    return {
      opacity: isCenter ? 1 : SIDE_OPACITY,
      scale: isCenter ? 1 : SIDE_SCALE,
    };
  });

  const opacity = useTransform(cardFocus, (v) => v.opacity);
  const scale = useTransform(cardFocus, (v) => v.scale);

  return (
    <motion.article
      data-carousel-card
      style={{
        opacity,
        scale,
        width: cardWidth || undefined,
        flex: cardWidth ? `0 0 ${cardWidth}px` : undefined,
      }}
      className="project-carousel__card group"
    >
      <Link href={`/work/${project.slug}`} className="glass-card block">
        {cover ? (
          <ProjectCoverFrame src={cover} alt={project.title} />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-peri-dark to-bg-deep" />
        )}
        <div className="glass-caption px-5 py-4">
          <p className="text-base font-medium leading-snug text-text-primary transition-colors group-hover:text-peri-glow md:text-lg">
            {project.title}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

export function ProjectCarousel({
  projects,
  categoryLabel = "Projects",
}: ProjectCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef(0);
  const didDrag = useRef(false);
  const isDragging = useRef(false);
  const autoPaused = useRef(false);
  const userPausedRef = useRef(false);
  const pauseTimer = useRef<number | null>(null);

  const count = projects.length;
  const loopItems = useMemo(
    () =>
      count === 0
        ? []
        : Array.from({ length: LOOP_COPIES }, () => projects).flat(),
    [projects, count],
  );

  const [viewportWidth, setViewportWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [step, setStep] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const x = useMotionValue(0);
  const loopSpan = count * step;

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportW = viewport.getBoundingClientRect().width;
    const tileWidth = Math.max(0, (viewportW - TRACK_GAP_PX * 2) / 3);

    setViewportWidth(viewportW);
    setCardWidth(tileWidth);
    setStep(tileWidth + TRACK_GAP_PX);
  }, []);

  const wrapX = useCallback(
    (value: number) => {
      if (!loopSpan || count <= 1) return value;
      let next = value;
      const min = -loopSpan * (LOOP_COPIES - 1);
      const max = -loopSpan;
      while (next < min) next += loopSpan;
      while (next > max) next -= loopSpan;
      return next;
    },
    [count, loopSpan],
  );

  const pauseAuto = useCallback(() => {
    autoPaused.current = true;
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => {
      if (!userPausedRef.current) {
        autoPaused.current = false;
      }
    }, 3200);
  }, []);

  const toggleUserPaused = useCallback(() => {
    setUserPaused((value) => {
      const next = !value;
      userPausedRef.current = next;
      if (next) {
        autoPaused.current = true;
      } else if (!isDragging.current) {
        autoPaused.current = false;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!step || count === 0) return;
    x.set(-count * step);
  }, [step, count, x]);

  useEffect(() => {
    measure();
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    };
  }, [measure, loopItems.length]);

  useMotionValueEvent(x, "change", (latest) => {
    if (!step || !count) return;
    const wrapped = wrapX(latest);
    if (wrapped !== latest) {
      x.set(wrapped);
      return;
    }
    const raw = Math.round(-wrapped / step);
    setActiveIndex(mod(raw, count));
  });

  const snapToRawIndex = useCallback(
    (targetRaw: number) => {
      if (!step) return;
      animate(x, -targetRaw * step, FLIP_SPRING);
    },
    [step, x],
  );

  const advanceSlide = useCallback(() => {
    if (!step || count <= 1) return;
    const currentRaw = Math.round(-x.get() / step);
    snapToRawIndex(currentRaw + 1);
  }, [count, snapToRawIndex, step, x]);

  useEffect(() => {
    if (!step || count <= 1 || reduceMotion || userPaused) return;

    const id = window.setInterval(() => {
      if (isDragging.current || autoPaused.current) return;
      advanceSlide();
    }, FLIP_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [advanceSlide, count, reduceMotion, step, userPaused]);

  const snapToProjectIndex = useCallback(
    (projectIndex: number) => {
      if (!step || !count) return;
      pauseAuto();
      const currentRaw = Math.round(-x.get() / step);
      const currentMod = mod(currentRaw, count);
      let delta = projectIndex - currentMod;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      const targetRaw = currentRaw + delta;
      snapToRawIndex(targetRaw);
    },
    [count, pauseAuto, snapToRawIndex, step, x],
  );

  if (count === 0) return null;

  return (
    <div className="project-carousel">
      <div
        ref={viewportRef}
        className="project-carousel__viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${categoryLabel} projects`}
      >
        <motion.div
          ref={trackRef}
          className="project-carousel__track"
          style={{
            x,
            gap: TRACK_GAP_PX,
            paddingLeft: viewportWidth && cardWidth ? (viewportWidth - cardWidth) / 2 : undefined,
          }}
          drag={step > 0 ? "x" : false}
          dragElastic={0.04}
          dragMomentum={false}
          onDragStart={() => {
            isDragging.current = true;
            dragOrigin.current = x.get();
            didDrag.current = false;
            pauseAuto();
          }}
          onDrag={() => {
            if (Math.abs(x.get() - dragOrigin.current) > 8) didDrag.current = true;
            x.set(wrapX(x.get()));
          }}
          onDragEnd={(_, info) => {
            isDragging.current = false;
            pauseAuto();
            if (!step) return;
            const projected = wrapX(x.get() + info.velocity.x * 0.08);
            const nearest = Math.round(-projected / step);
            snapToRawIndex(nearest);
          }}
          onClickCapture={(event) => {
            if (!didDrag.current) return;
            event.preventDefault();
            event.stopPropagation();
            didDrag.current = false;
          }}
        >
          {loopItems.map((project, trackIndex) => (
            <CarouselCard
              key={`${project.slug}-${trackIndex}`}
              project={project}
              trackIndex={trackIndex}
              x={x}
              step={step}
              viewportWidth={viewportWidth}
              cardWidth={cardWidth}
            />
          ))}
        </motion.div>
      </div>

      {count > 1 && (
        <div className="project-carousel__controls">
          <div className="project-carousel__dots">
            {projects.map((project, dotIndex) => (
              <button
                key={project.slug}
                type="button"
                className={`project-carousel__dot${dotIndex === activeIndex ? " is-active" : ""}`}
                aria-label={`Go to ${project.title}`}
                aria-current={dotIndex === activeIndex ? "true" : undefined}
                onClick={() => snapToProjectIndex(dotIndex)}
              />
            ))}
          </div>

          {!reduceMotion && (
            <CarouselAutoScrollToggle paused={userPaused} onToggle={toggleUserPaused} />
          )}
        </div>
      )}
    </div>
  );
}
