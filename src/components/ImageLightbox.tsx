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

type FitMetrics = {
  baseWidth: number;
  baseHeight: number;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function touchDistance(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number },
) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
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
  const imgRef = useRef<HTMLImageElement>(null);
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  zoomRef.current = zoom;
  const [metrics, setMetrics] = useState<FitMetrics | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const measureFit = useCallback(() => {
    const img = imgRef.current;
    const scroll = scrollRef.current;
    if (!img?.naturalWidth || !scroll) return;

    const pad = 16;
    const cw = Math.max(1, scroll.clientWidth - pad);
    const ch = Math.max(1, scroll.clientHeight - pad);
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const fit = Math.min(cw / nw, ch / nh);

    setMetrics({
      baseWidth: nw * fit,
      baseHeight: nh * fit,
    });
  }, []);

  useEffect(() => {
    setZoom(1);
    setMetrics(null);
    scrollRef.current?.scrollTo({ left: 0, top: 0 });
  }, [currentIndex, src]);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const observer = new ResizeObserver(() => measureFit());
    observer.observe(scroll);
    return () => observer.disconnect();
  }, [measureFit, currentIndex]);

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
    const root = scrollRef.current;
    if (!root) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStart.current = {
          distance: touchDistance(e.touches[0], e.touches[1]),
          scale: zoomRef.current,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinchStart.current) return;
      e.preventDefault();
      const ratio =
        touchDistance(e.touches[0], e.touches[1]) / pinchStart.current.distance;
      setZoom(clampZoom(pinchStart.current.scale * ratio));
    };

    const onTouchEnd = () => {
      pinchStart.current = null;
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd);
    root.addEventListener("touchcancel", onTouchEnd);
    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [currentIndex]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    },
    [onClose],
  );

  const resetZoom = useCallback(() => {
    setZoom(1);
    scrollRef.current?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, []);

  const nudgeZoom = useCallback((delta: number) => {
    setZoom((z) => clampZoom(z + delta));
  }, []);

  const onImageDoubleClick = () => {
    if (zoom > 1.05) resetZoom();
    else setZoom(2);
  };

  const displayWidth = metrics ? metrics.baseWidth * zoom : undefined;
  const displayHeight = metrics ? metrics.baseHeight * zoom : undefined;

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
          <div className="flex min-h-full min-w-full justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="image-lightbox__stage inline-block p-2 md:p-8"
          >
            <img
              ref={imgRef}
              src={src}
              alt={`${alt} — image ${currentIndex + 1}`}
              className="image-lightbox__image block max-w-none object-contain md:max-h-[85vh]"
              style={
                displayWidth
                  ? {
                      width: displayWidth,
                      height: displayHeight,
                      maxWidth: "none",
                    }
                  : { width: "100%", height: "auto" }
              }
              decoding="async"
              draggable={false}
              onLoad={measureFit}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={onImageDoubleClick}
            />
          </motion.div>
          </div>

          {hasPrev && (
            <button
              type="button"
              onClick={() => onNavigate(currentIndex - 1)}
              className="glass-pill pointer-events-auto absolute left-2 top-1/2 z-10 min-h-11 -translate-y-1/2 rounded-full px-3 py-3 text-text-primary transition-colors hover:text-peri-glow md:left-4 md:px-4"
              aria-label="Previous image"
            >
              ←
            </button>
          )}

          {hasNext && (
            <button
              type="button"
              onClick={() => onNavigate(currentIndex + 1)}
              className="glass-pill pointer-events-auto absolute right-2 top-1/2 z-10 min-h-11 -translate-y-1/2 rounded-full px-3 py-3 text-text-primary transition-colors hover:text-peri-glow md:right-4 md:px-4"
              aria-label="Next image"
            >
              →
            </button>
          )}
        </div>

        <div className="relative z-[210] shrink-0 border-t border-white/10 bg-bg-deep/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <div className="mb-3 flex items-center justify-center gap-2 md:hidden">
            <button
              type="button"
              className="glass-pill min-h-11 min-w-11 rounded-full text-lg text-text-primary"
              aria-label="Zoom out"
              onClick={() => nudgeZoom(-0.5)}
            >
              −
            </button>
            <button
              type="button"
              className="glass-pill min-h-11 rounded-full px-4 text-sm text-text-muted"
              onClick={resetZoom}
            >
              Fit slide
            </button>
            <button
              type="button"
              className="glass-pill min-h-11 min-w-11 rounded-full text-lg text-text-primary"
              aria-label="Zoom in"
              onClick={() => nudgeZoom(0.5)}
            >
              +
            </button>
          </div>
          <p className="mb-2 text-center text-xs text-text-subtle md:hidden">
            Pinch to zoom · drag to pan · Fit slide to reset
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="cta-button w-full py-3 md:mx-auto md:max-w-xs"
          >
            Close full view
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
