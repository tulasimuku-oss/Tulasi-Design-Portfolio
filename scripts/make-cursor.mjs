import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
const dest = join(root, "public", "cursor-portfolio.png");

if (!src) {
  console.error("Usage: node scripts/make-cursor.mjs <source-png>");
  process.exit(1);
}

const isBg = (r, g, b, a) => {
  if (a < 12) return true;
  return r + g + b < 85;
};

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

const { width: w, height: h, channels: ch } = info;
const bg = new Uint8Array(w * h);
const q = [];

const idx = (x, y) => y * w + x;
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  q.push(idx(x, y));
};

for (let x = 0; x < w; x++) {
  push(x, 0);
  push(x, h - 1);
}
for (let y = 0; y < h; y++) {
  push(0, y);
  push(w - 1, y);
}

while (q.length) {
  const i = q.pop();
  if (bg[i]) continue;
  const x = i % w;
  const y = (i / w) | 0;
  const o = i * ch;
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];
  const a = data[o + 3];
  if (!isBg(r, g, b, a)) continue;
  bg[i] = 1;
  push(x - 1, y);
  push(x + 1, y);
  push(x, y - 1);
  push(x, y + 1);
}

for (let i = 0; i < w * h; i++) {
  if (bg[i]) data[i * ch + 3] = 0;
}

let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (data[idx(x, y) * ch + 3] > 8) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

const cw = maxX - minX + 1;
const chh = maxY - minY + 1;

const cropped = await sharp(data, { raw: { width: w, height: h, channels: ch } })
  .extract({ left: minX, top: minY, width: cw, height: chh })
  .resize(28, 28, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

writeFileSync(dest, cropped);
console.log(`Wrote ${dest} (${cropped.length} bytes)`);
