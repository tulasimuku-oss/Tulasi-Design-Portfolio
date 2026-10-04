"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageLightbox } from "@/components/ImageLightbox";
import { LazyInView } from "@/components/LazyInView";
import { SlideLinkButtons } from "@/components/SlideLinkButtons";
import type { SlideLink } from "@/data/slide-links";
import { optimizeGalleryUrl, isRemotePortfolioImage } from "@/lib/project-images";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  layout?: "showcase" | "masonry";
  imageFit?: "cover" | "contain";
  interactive?: boolean;
  slideLinks?: Record<number, SlideLink[]>;
}

export function ProjectGallery({
  images,
  title,
  layout = "showcase",
  imageFit = "cover",
  interactive = true,
  slideLinks,
}: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  if (layout === "masonry") {
    return (
      <>
        <div className="mx-auto max-w-6xl columns-1 gap-5 px-4 sm:columns-2 lg:columns-3">
          {images.map((src, i) => (
            <GalleryImage
              key={src}
              src={src}
              alt={`${title} ${i + 1}`}
              index={i}
              onClick={interactive ? () => setLightboxIndex(i) : undefined}
              className="mb-5 break-inside-avoid"
              imageFit={imageFit}
              interactive={interactive}
            />
          ))}
        </div>
        {interactive && lightboxIndex !== null && (
          <ImageLightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
            alt={title}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="project-gallery-showcase space-y-6 md:space-y-8">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
            className="project-gallery-showcase__slide mx-auto max-w-6xl px-0 md:px-4"
          >
            <GalleryImage
              src={src}
              alt={`${title} ${i + 1}`}
              index={i}
              onClick={interactive ? () => setLightboxIndex(i) : undefined}
              imageFit={imageFit}
              interactive={interactive}
            />
            {slideLinks?.[i] && (
              <div className="px-4 md:px-0">
                <SlideLinkButtons links={slideLinks[i]} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {interactive && lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          alt={title}
        />
      )}
    </>
  );
}

function GalleryImage({
  src,
  alt,
  index,
  onClick,
  className = "",
  imageFit = "cover",
  interactive = true,
}: {
  src: string;
  alt: string;
  index: number;
  onClick?: () => void;
  className?: string;
  imageFit?: "cover" | "contain";
  interactive?: boolean;
}) {
  const optimized = optimizeGalleryUrl(src);
  const remoteCdn = isRemotePortfolioImage(optimized);
  const fitClass =
    imageFit === "contain" ? "object-contain" : "object-cover";

  const frameClass = `glass-frame project-gallery-showcase__frame block w-full overflow-hidden ${className}`;
  const imageClass = `project-gallery-showcase__image h-auto w-full max-md:object-contain ${fitClass}${
    interactive ? " transition-transform duration-500 group-hover:scale-[1.01]" : ""
  }`;

  const content = (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        imageFit === "contain" ? "bg-[rgba(10,9,20,0.55)]" : ""
      }`}
    >
      <LazyInView eager={index < 2}>
        <Image
          src={optimized}
          alt={alt}
          width={1920}
          height={1080}
          className={imageClass}
          sizes="(max-width: 768px) 100vw, 1200px"
          quality={70}
          priority={index < 2}
          loading={index < 2 ? undefined : "lazy"}
          unoptimized={remoteCdn}
        />
      </LazyInView>
      {interactive && (
        <div className="project-gallery-showcase__expand-hint absolute inset-0 flex items-end justify-end bg-gradient-to-t from-bg-deep/40 via-transparent to-transparent opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <span className="glass-pill m-3 rounded-full px-4 py-2 text-xs text-text-muted md:m-4">
            Tap to view full size
          </span>
        </div>
      )}
    </div>
  );

  if (!interactive) {
    return <div className={frameClass}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${frameClass} group`}
    >
      {content}
    </button>
  );
}
