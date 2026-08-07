"use client";

import type { CSSProperties } from "react";
import { isoScene } from "@/data/iso-scene";
import { isoObjectPath } from "@/lib/iso-geometry";

const STROKE = "rgba(200, 201, 240, 0.34)";
const STROKE_WIDTH = 1.1;

export function GradientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="iso-bg-base absolute inset-0" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        {isoScene.map((object) => {
          const style = {
            "--iso-dur": `${object.duration}s`,
            "--iso-delay": `${object.delay}s`,
            "--iso-ease": object.ease,
            transformOrigin: object.origin ?? "center",
          } as CSSProperties;

          return (
            <g key={object.id} transform={`translate(${object.x} ${object.y})`}>
              <g
                className={`iso-object iso-motion-${object.motion}`}
                style={style}
              >
                <path
                  d={isoObjectPath(object)}
                  fill="none"
                  stroke={STROKE}
                  strokeWidth={STROKE_WIDTH}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            </g>
          );
        })}
      </svg>

      <div className="iso-grain absolute inset-0" />
    </div>
  );
}
