"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeGalleryUrl, isRemotePortfolioImage } from "@/lib/project-images";

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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-deep/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="glass-pill absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-colors hover:text-peri-glow"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="absolute left-6 top-6 text-sm text-text-muted">
          {currentIndex + 1} / {images.length}
        </p>

        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className="glass-pill absolute left-4 z-10 rounded-full px-4 py-3 text-text-primary transition-colors hover:text-peri-glow md:left-8"
            aria-label="Previous image"
          >
            ←
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className="glass-pill absolute right-4 z-10 rounded-full px-4 py-3 text-text-primary transition-colors hover:text-peri-glow md:right-8"
            aria-label="Next image"
          >
            →
          </button>
        )}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="relative mx-16 max-h-[85vh] max-w-6xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={optimizeGalleryUrl(images[currentIndex])}
            alt={`${alt} — image ${currentIndex + 1}`}
            width={1920}
            height={1080}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            sizes="100vw"
            priority
            unoptimized={isRemotePortfolioImage(images[currentIndex])}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
