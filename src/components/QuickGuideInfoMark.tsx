/** Information “i” for quick guide — use on a light badge (`currentColor`). */
export function QuickGuideInfoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="7.35" r="1.75" />
      <path d="M10.55 10.35h2.9v9.1h-2.9v-9.1z" />
    </svg>
  );
}
