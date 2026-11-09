"use client";

import { useEffect, useState } from "react";

export function useHomeIntroActive(): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () =>
      setActive(document.body.classList.contains("home-intro-active"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return active;
}
