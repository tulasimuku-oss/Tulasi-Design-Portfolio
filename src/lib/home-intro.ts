const INTRO_SEEN_KEY = "portfolio-home-intro-seen";

export const HOME_LOADING_VIDEO_SRC = "/portfolio-loading.mp4";

function safePathname(url: string): string {
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return "/";
  }
}

export function shouldPlayHomeIntro(options?: { force?: boolean }): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  if (options?.force) {
    return true;
  }

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!nav) {
    return window.location.pathname === "/";
  }

  const initialPath = safePathname(nav.name);
  const currentPath = window.location.pathname;

  if (currentPath === "/" && initialPath !== "/") {
    return false;
  }

  if (nav.type === "reload") {
    return true;
  }

  if (nav.type === "navigate") {
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === "1") {
      return false;
    }

    const ref = document.referrer;
    if (ref) {
      try {
        if (new URL(ref).origin === window.location.origin) {
          return false;
        }
      } catch {
        /* external or invalid referrer — allow intro */
      }
    }

    return true;
  }

  return false;
}

export function markHomeIntroSeen(): void {
  sessionStorage.setItem(INTRO_SEEN_KEY, "1");
}
