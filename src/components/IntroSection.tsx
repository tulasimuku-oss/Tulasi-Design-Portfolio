import { AnimatedSection } from "@/components/AnimatedSection";
import { skillset, tools } from "@/data/site";

function InlineList({
  items,
  className = "mt-3",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <p
      className={`text-sm leading-loose text-text-muted md:text-base ${className}`}
    >
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 && (
            <span className="mx-2 text-text-subtle/40" aria-hidden>
              /
            </span>
          )}
          {item}
        </span>
      ))}
    </p>
  );
}

export function IntroSection() {
  return (
    <section className="relative px-6 pb-12 md:pb-16">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <div className="glass-panel p-5 md:p-8">
            <p className="label-caps text-peri-glow">Skillset</p>

            <InlineList
              items={skillset.map((skill) => skill.label)}
              className="mt-6"
            />

            <div className="mt-6 border-t border-white/12 pt-5 md:pt-6">
              <p className="label-caps text-text-subtle">Tools</p>
              <InlineList items={tools} />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
