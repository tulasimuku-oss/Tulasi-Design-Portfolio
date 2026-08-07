export const ISO_SX = 13;
export const ISO_SY = 6.5;
export const ISO_SZ = 13;

export function iso(i: number, j: number, k: number) {
  return {
    x: (i - j) * ISO_SX,
    y: (i + j) * ISO_SY - k * ISO_SZ,
  };
}

export function wireBoxPath(
  i: number,
  j: number,
  k: number,
  di: number,
  dj: number,
  dk: number,
) {
  const c = [
    iso(i, j, k),
    iso(i + di, j, k),
    iso(i + di, j + dj, k),
    iso(i, j + dj, k),
    iso(i, j, k + dk),
    iso(i + di, j, k + dk),
    iso(i + di, j + dj, k + dk),
    iso(i, j + dj, k + dk),
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  return edges
    .map(([a, b]) => `M ${c[a].x} ${c[a].y} L ${c[b].x} ${c[b].y}`)
    .join(" ");
}

export function wireFramePath(
  i: number,
  j: number,
  k: number,
  di: number,
  dj: number,
  dk: number,
) {
  const c = [
    iso(i, j, k),
    iso(i + di, j, k),
    iso(i + di, j + dj, k),
    iso(i, j + dj, k),
    iso(i, j, k + dk),
    iso(i + di, j, k + dk),
    iso(i + di, j + dj, k + dk),
    iso(i, j + dj, k + dk),
  ];

  return [
    `M ${c[0].x} ${c[0].y} L ${c[1].x} ${c[1].y} L ${c[2].x} ${c[2].y} L ${c[3].x} ${c[3].y} Z`,
    `M ${c[4].x} ${c[4].y} L ${c[5].x} ${c[5].y} L ${c[6].x} ${c[6].y} L ${c[7].x} ${c[7].y} Z`,
    `M ${c[0].x} ${c[0].y} L ${c[4].x} ${c[4].y}`,
    `M ${c[1].x} ${c[1].y} L ${c[5].x} ${c[5].y}`,
    `M ${c[2].x} ${c[2].y} L ${c[6].x} ${c[6].y}`,
    `M ${c[3].x} ${c[3].y} L ${c[7].x} ${c[7].y}`,
  ].join(" ");
}

export type IsoShape = "pillar" | "beam-x" | "beam-y" | "frame" | "diamond" | "prism";

export type IsoMotion =
  | "drift-a"
  | "drift-b"
  | "drift-c"
  | "drift-d"
  | "slide-x-a"
  | "slide-x-b"
  | "slide-y-a"
  | "slide-y-b"
  | "pillar-a"
  | "pillar-b"
  | "diamond-a"
  | "diamond-b";

export interface IsoObject {
  id: string;
  x: number;
  y: number;
  shape: IsoShape;
  i: number;
  j: number;
  k: number;
  di: number;
  dj: number;
  dk: number;
  motion: IsoMotion;
  duration: number;
  delay: number;
  ease: string;
  origin?: string;
}

export function isoObjectPath(object: IsoObject): string {
  const { i, j, k, di, dj, dk, shape } = object;

  if (shape === "frame") {
    return wireFramePath(i, j, k, di, dj, dk);
  }

  if (shape === "diamond") {
    return wireFramePath(i, j, k, di, di, dk);
  }

  return wireBoxPath(i, j, k, di, dj, dk);
}
