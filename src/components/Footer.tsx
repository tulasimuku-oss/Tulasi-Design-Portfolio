import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative z-10 px-6 py-8">
      <div className="glass mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-2xl px-6 py-5 md:flex-row">
        <p className="text-sm text-text-subtle">{site.name}</p>
        <div className="flex items-center gap-6">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps text-text-muted transition-colors hover:text-peri-glow"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${site.email}`}
            className="label-caps text-text-muted transition-colors hover:text-peri-glow"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
