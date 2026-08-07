"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { SkillId } from "@/data/site";

const skillImages: Record<SkillId, string> = {
  wireframing: "/skills/wireframing.png",
  prototyping: "/skills/prototyping.png",
  "user-research": "/skills/user-research.png",
  "user-centered": "/skills/user-centered.png",
  "usability-testing": "/skills/usability-testing.png",
  accessibility: "/skills/accessibility.png",
};

interface SkillVisualProps {
  skillId: SkillId;
}

export function SkillVisual({ skillId }: SkillVisualProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={skillId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={skillImages[skillId]}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={skillId === "wireframing"}
        />
      </motion.div>
    </AnimatePresence>
  );
}
