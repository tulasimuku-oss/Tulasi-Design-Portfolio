import { HeroSection } from "@/components/HeroSection";
import { IntroSection } from "@/components/IntroSection";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CategoryPortals } from "@/components/CategoryPortals";
import { DynamicProjectShowcase } from "@/components/DynamicProjectShowcase";
import { getFeaturedProjects } from "@/data/projects";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <HeroSection />

      <section className="relative px-6 pb-16 pt-2 md:pb-20 md:pt-4">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-8 md:mb-10">
              <p className="label-caps text-peri-glow">Explore</p>
              <h2 className="mt-2 text-2xl font-medium text-text-primary md:text-3xl">
                Choose your lens
              </h2>
            </div>
          </AnimatedSection>

          <CategoryPortals />
        </div>
      </section>

      <section className="relative px-6 pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-8 md:mb-10">
              <p className="label-caps text-peri-glow">Featured</p>
              <h2 className="mt-2 max-w-2xl text-2xl font-medium leading-snug text-text-primary md:text-3xl">
                Work that blends research rigour with visual craft
              </h2>
            </div>
          </AnimatedSection>

          <DynamicProjectShowcase projects={featured} featured />
        </div>
      </section>

      <IntroSection />
    </>
  );
}
