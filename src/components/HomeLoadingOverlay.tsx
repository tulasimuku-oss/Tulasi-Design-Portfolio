"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HOME_LOADING_VIDEO_SRC,
  dispatchHomeIntroComplete,
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

  useLayoutEffect(() => {
    if (!shouldPlayHomeIntro({ force: forceIntro })) {
      dispatchHomeIntroComplete();
      return;
    }

    document.body.classList.add("home-intro-active");
    document.body.style.overflow = "hidden";
    setPhase("playing");

    return () => {
      document.body.style.overflow = "";
    };
  }, [forceIntro]);

  useEffect(() => {
    if (phase !== "playing") return;

    const video = videoRef.current;
    if (!video) return;

    const safetyMs = 45_000;
    const safetyTimer = window.setTimeout(() => {
      finishIntro();
    }, safetyMs);

    void video.play().catch(() => {
      finishIntro();
    });

    return () => window.clearTimeout(safetyTimer);
  }, [phase, finishIntro]);

  useEffect(() => {
    if (phase !== "fading") return;

    const timer = window.setTimeout(() => {
      setPhase("hidden");
      document.body.style.overflow = "";
      dispatchHomeIntroComplete();
    }, 750);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const hideChrome = phase === "playing" || phase === "fading";
    document.body.classList.toggle("home-intro-active", hideChrome);
    return () => document.body.classList.remove("home-intro-active");
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
            onError={finishIntro}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
