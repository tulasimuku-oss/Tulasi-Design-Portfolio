"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeGalleryUrl } from "@/lib/project-images";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  alt: string;
}

function touchDistance(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number },
) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  zoomRef.current = zoom;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setZoom(1);
    scrollRef.current?.scrollTo(0, 0);
  }, [currentIndex]);

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

  useEffect(() => {
    const el = zoomWrapRef.current;
    if (!el) return;

    const onMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinchStart.current) return;
      e.preventDefault();
      const ratio =
        touchDistance(e.touches[0], e.touches[1]) / pinchStart.current.distance;
      const next = Math.min(4, Math.max(1, pinchStart.current.scale * ratio));
      setZoom(next);
    };

    el.addEventListener("touchmove", onMove, { passive: false });
    return () => el.removeEventListener("touchmove", onMove);
  }, [currentIndex]);

  const handleClose = useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    },
    [onClose],
  );

  const onImageTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStart.current = {
        distance: touchDistance(e.touches[0], e.touches[1]),
        scale: zoomRef.current,
      };
    }
  };

  const onImageTouchEnd = () => {
    pinchStart.current = null;
  };

  const onImageDoubleClick = () => {
    setZoom((z) => (z > 1.05 ? 1 : 2));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="image-lightbox fixed inset-0 z-[200] flex flex-col bg-bg-deep/92 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Full size image view"
      >
        <div className="relative z-[210] flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6">
          <p className="text-sm text-text-muted">
            {currentIndex + 1} / {images.length}
          </p>
          <p className="hidden text-xs text-text-subtle sm:block">
            Pinch or double-tap to zoom · Esc to close
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="glass-pill flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-lg text-text-primary transition-colors hover:text-peri-glow"
            aria-label="Close full view"
          >
            ✕
          </button>
        </div>

        <div
          ref={scrollRef}
          className="image-lightbox__scroll relative z-[205] min-h-0 flex-1 overflow-auto overscroll-contain"
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
            className="flex min-h-full min-w-full items-start justify-center p-2 pb-4 md:items-center md:p-8"
          >
            <div
              ref={zoomWrapRef}
              className="image-lightbox__zoom-wrap inline-flex origin-top justify-center md:origin-center"
              style={{ transform: `scale(${zoom})` }}
              onTouchStart={onImageTouchStart}
              onTouchEnd={onImageTouchEnd}
              onTouchCancel={onImageTouchEnd}
              onDoubleClick={onImageDoubleClick}
            >
              <img
                src={src}
                alt={`${alt} — image ${currentIndex + 1}`}
                className="image-lightbox__image h-auto w-auto max-w-none object-contain md:max-h-[85vh] md:max-w-[min(72rem,100%)]"
                decoding="async"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
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

        <div className="relative z-[210] shrink-0 border-t border-white/10 bg-bg-deep/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
          <p className="mb-2 text-center text-xs text-text-subtle">
            Pinch or double-tap to zoom
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="cta-button w-full py-3"
          >
            Close full view
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
