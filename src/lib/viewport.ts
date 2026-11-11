export const MOBILE_LAYOUT_MAX_PX = 767;

export const mobileLayoutMediaQuery = `(max-width: ${MOBILE_LAYOUT_MAX_PX}px)`;

export function isMobileLayoutViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(mobileLayoutMediaQuery).matches;
}
