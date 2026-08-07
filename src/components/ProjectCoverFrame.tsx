import Image from "next/image";

import { isRemotePortfolioImage } from "@/lib/project-images";

interface ProjectCoverFrameProps {
  src: string;
  alt: string;
}

/** Equal-aspect cover — fills the frame with no letterboxing */
export function ProjectCoverFrame({ src, alt }: ProjectCoverFrameProps) {
  return (
    <div className="relative aspect-video overflow-hidden bg-[rgba(10,9,20,0.4)]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized={isRemotePortfolioImage(src)}
      />
    </div>
  );
}
