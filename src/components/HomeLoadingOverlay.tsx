"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HOME_LOADING_VIDEO_SRC,
  markHomeIntroSeen,
  shouldPlayHomeIntro,
} from "@/lib/home-intro";

export function HomeLoadingOverlay() {
  const searchParams = useSearchParams();
  const forceIntro = searchParams.get("intro") === "1";

  const [phase, setPhase] = useState<"hidden" | "playing" | "fading">("hidden");
  const videoRef = useRef<HTMLVideoElement>(null);

  const finishIntro = useCallback(() => {
    if (!forceIntro) {
      markHomeIntroSeen();
    }
    setPhase("fading");
  }, [forceIntro]);

  useEffect(() => {
    if (!shouldPlayHomeIntro({ force: forceIntro })) return;

    setPhase("playing");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [forceIntro]);

  useEffect(() => {
    if (phase !== "playing") return;

    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(() => {
      finishIntro();
    });
  }, [phase, finishIntro]);

  useEffect(() => {
    if (phase !== "fading") return;

    const timer = window.setTimeout(() => {
      setPhase("hidden");
      document.body.style.overflow = "";
    }, 750);

    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <AnimatePresence>
      {(phase === "playing" || phase === "fading") && (
        <motion.div
          className="home-loading-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "fading" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden={phase === "fading"}
        >
          <video
            ref={videoRef}
            className="home-loading-overlay__video"
            src={HOME_LOADING_VIDEO_SRC}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finishIntro}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
