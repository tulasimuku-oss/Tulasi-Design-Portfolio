"use client";

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeGalleryUrl } from "@/lib/project-images";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  alt: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
  alt,
}: ImageLightboxProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;
  const src = optimizeGalleryUrl(images[currentIndex]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
    },
    [currentIndex, hasPrev, hasNext, onClose, onNavigate],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="image-lightbox fixed inset-0 z-[100] flex flex-col bg-bg-deep/92 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Full size image view"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
          <p className="text-sm text-text-muted">
            {currentIndex + 1} / {images.length}
          </p>
          <p className="hidden text-xs text-text-subtle sm:block">
            Pinch or scroll to zoom · Esc to close
          </p>
          <button
            type="button"
            onClick={onClose}
            className="glass-pill hidden min-h-11 min-w-11 items-center justify-center rounded-full text-text-primary transition-colors hover:text-peri-glow md:flex"
            aria-label="Close full view"
          >
            ✕
          </button>
        </div>

        <div
          className="image-lightbox__scroll relative min-h-0 flex-1 overflow-auto overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-full min-w-full items-start justify-center p-2 pb-24 md:items-center md:p-8 md:pb-8"
          >
            <img
              src={src}
              alt={`${alt} — image ${currentIndex + 1}`}
              className="image-lightbox__image h-auto w-full max-w-none object-contain md:max-h-[85vh] md:w-auto md:max-w-[min(72rem,100%)]"
              decoding="async"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>

          {hasPrev && (
            <button
              type="button"
              onClick={() => onNavigate(currentIndex - 1)}
              className="glass-pill absolute left-2 top-1/2 z-10 min-h-11 -translate-y-1/2 rounded-full px-3 py-3 text-text-primary transition-colors hover:text-peri-glow md:left-4 md:px-4"
              aria-label="Previous image"
            >
              ←
            </button>
          )}

          {hasNext && (
            <button
              type="button"
              onClick={() => onNavigate(currentIndex + 1)}
              className="glass-pill absolute right-2 top-1/2 z-10 min-h-11 -translate-y-1/2 rounded-full px-3 py-3 text-text-primary transition-colors hover:text-peri-glow md:right-4 md:px-4"
              aria-label="Next image"
            >
              →
            </button>
          )}
        </div>

        <div className="shrink-0 border-t border-white/10 bg-bg-deep/90 px-4 py-3 backdrop-blur-md md:hidden">
          <p className="mb-2 text-center text-xs text-text-subtle">
            Pinch to zoom on the image
          </p>
          <button type="button" onClick={onClose} className="cta-button w-full py-3">
            Close full view
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
