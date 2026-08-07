"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SkillVisual } from "@/components/SkillVisual";
import { skillset, tools, type SkillId } from "@/data/site";

const ACTIVE_SKILL = "#d8dcff";
const INACTIVE_SKILL = "#6667ab";

export function IntroSection() {
  const [activeSkillId, setActiveSkillId] = useState<SkillId>(skillset[0].id);

  return (
    <section className="relative px-6 pb-12 md:pb-16">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <div className="glass-panel p-5 md:p-8">
            <p className="label-caps text-peri-glow">Skillset &amp; Tools</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-stretch md:gap-5">
              <div className="skillset-panel flex min-h-[260px] flex-col gap-1.5 p-2 md:min-h-[300px] md:p-3">
                {skillset.map((skill) => {
                  const isActive = skill.id === activeSkillId;

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onMouseEnter={() => setActiveSkillId(skill.id)}
                      onFocus={() => setActiveSkillId(skill.id)}
                      onClick={() => setActiveSkillId(skill.id)}
                      className="skillset-item flex flex-1 items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-all duration-300 md:px-4 md:py-2.5 md:text-base"
                      style={{
                        backgroundColor: isActive ? ACTIVE_SKILL : INACTIVE_SKILL,
                        color: isActive ? "#1e1c42" : "#f8f7ff",
                        boxShadow: isActive
                          ? "0 0 28px rgba(216, 220, 255, 0.35)"
                          : "none",
                      }}
                      aria-pressed={isActive}
                    >
                      {skill.label}
                    </button>
                  );
                })}
              </div>

              <div
                className="skillset-panel relative min-h-[260px] overflow-hidden md:min-h-[300px]"
                aria-live="polite"
                aria-label={`Visual for ${skillset.find((s) => s.id === activeSkillId)?.label}`}
              >
                <SkillVisual skillId={activeSkillId} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2 md:gap-3">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="glass-pill tool-capsule flex items-center justify-center rounded-full px-2 py-2.5"
                >
                  <span className="tool-capsule-label">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
