import type { SlideLink } from "@/data/slide-links";

interface SlideLinkButtonsProps {
  links: SlideLink[];
}

export function SlideLinkButtons({ links }: SlideLinkButtonsProps) {
  return (
    <div
      className={`mt-4 grid gap-3 ${
        links.length === 1
          ? "grid-cols-1 place-items-center"
          : links.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : links.length === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="slide-link-button"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
