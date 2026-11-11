"use client";

import type { ReactNode } from "react";
import { MotionReveal } from "@/components/MotionReveal";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <MotionReveal
      as="section"
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionReveal>
  );
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const mobile = useIsMobileViewport();

  if (mobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionReveal
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionReveal>
  );
}
