"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageLightbox } from "@/components/ImageLightbox";
import { LazyInView } from "@/components/LazyInView";
import { optimizeGalleryUrl, isRemotePortfolioImage } from "@/lib/project-images";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  layout?: "showcase" | "masonry";
  imageFit?: "cover" | "contain";
  interactive?: boolean;
}

export function ProjectGallery({
  images,
  title,
  layout = "showcase",
  imageFit = "cover",
  interactive = true,
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
      <div className="space-y-6 md:space-y-8">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-6xl px-4"
          >
            <GalleryImage
              src={src}
              alt={`${title} ${i + 1}`}
              index={i}
              onClick={interactive ? () => setLightboxIndex(i) : undefined}
              imageFit={imageFit}
              interactive={interactive}
            />
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

  const frameClass = `glass-frame block w-full overflow-hidden ${className}`;
  const imageClass = `h-auto w-full ${fitClass}${
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
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-bg-deep/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <span className="glass-pill m-4 rounded-full px-4 py-2 text-xs text-text-muted">
            Expand
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
