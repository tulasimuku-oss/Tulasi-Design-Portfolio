"use client";

import { useEffect, useState } from "react";
import { mobileLayoutMediaQuery } from "@/lib/viewport";

export function useIsMobileViewport(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(mobileLayoutMediaQuery);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
}
