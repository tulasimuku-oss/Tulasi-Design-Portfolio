"use client";

import type { ReactNode } from "react";

type BackToTopButtonProps = {
  className?: string;
  children: ReactNode;
};

export function BackToTopButton({ className, children }: BackToTopButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {children}
    </button>
  );
}
