const INTRO_SEEN_KEY = "portfolio-home-intro-seen";

export const HOME_LOADING_VIDEO_SRC = "/portfolio-loading.mp4";

function safePathname(url: string): string {
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return "/";
  }
}

/** Whether this full page load qualified for the intro (computed once per document). */
let initialIntroEligible: boolean | null = null;

/** Intro already started or skipped for this document — blocks replays on client nav to `/`. */
let introConsumedForDocument = false;

function computeInitialIntroEligible(): boolean {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (!nav) {
    return false;
  }

  const landingPath = safePathname(nav.name);

  if (nav.type === "reload") {
    return landingPath === "/";
  }

  if (nav.type === "navigate") {
    if (landingPath !== "/") {
      return false;
    }

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

export function shouldPlayHomeIntro(options?: { force?: boolean }): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  if (options?.force) {
    return true;
  }

  if (introConsumedForDocument) {
    return false;
  }

  if (initialIntroEligible === null) {
    initialIntroEligible = computeInitialIntroEligible();
  }

  if (!initialIntroEligible || window.location.pathname !== "/") {
    return false;
  }

  introConsumedForDocument = true;
  return true;
}

export function markHomeIntroSeen(): void {
  sessionStorage.setItem(INTRO_SEEN_KEY, "1");
}
