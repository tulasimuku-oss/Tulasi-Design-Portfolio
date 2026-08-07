"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyInViewProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Load immediately (e.g. above-the-fold hero slides) */
  eager?: boolean;
  rootMargin?: string;
  className?: string;
}

export function LazyInView({
  children,
  fallback,
  eager = false,
  rootMargin = "500px 0px",
  className = "",
}: LazyInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible
        ? children
        : (fallback ?? (
            <div
              className="aspect-video w-full animate-pulse rounded-2xl bg-white/[0.04]"
              aria-hidden
            />
          ))}
    </div>
  );
}
