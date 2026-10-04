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
          key={`${link.href}-${link.label}`}
          href={link.href}
          target={link.sameTab ? undefined : "_blank"}
          rel={link.sameTab ? undefined : "noopener noreferrer"}
          className="slide-link-button"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
