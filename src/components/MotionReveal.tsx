"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";

type RevealElement = "div" | "section" | "article";

type MotionRevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  as?: RevealElement;
};

export function MotionReveal({
  children,
  className = "",
  as = "div",
  initial,
  animate,
  whileInView,
  viewport,
  transition,
  ...rest
}: MotionRevealProps) {
  const mobile = useIsMobileViewport();

  if (mobile) {
    if (as === "section") {
      return <section className={className}>{children}</section>;
    }
    if (as === "article") {
      return <article className={className}>{children}</article>;
    }
    return <div className={className}>{children}</div>;
  }

  const motionProps = {
    className,
    initial,
    animate,
    whileInView,
    viewport,
    transition,
    ...rest,
  };

  if (as === "section") {
    return <motion.section {...motionProps}>{children}</motion.section>;
  }
  if (as === "article") {
    return <motion.article {...motionProps}>{children}</motion.article>;
  }
  return <motion.div {...motionProps}>{children}</motion.div>;
}
