// Turns photos/*.jpg into responsive AVIF + WebP in public/photos/.
// Re-encoding drops EXIF and GPS tags, so nothing from the camera reaches the site.
import { readdirSync, mkdirSync, statSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import sharp from "sharp";

const SRC = "photos";
const OUT = join("public", "photos");
const WIDTHS = [480, 960, 1440, 2400];

mkdirSync(OUT, { recursive: true });

const isFresh = (out, src) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;

for (const file of readdirSync(SRC).filter((f) => /\.jpe?g$/i.test(f))) {
  const src = join(SRC, file);
  const id = basename(file).replace(/\.jpe?g$/i, "");
  const { width } = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w < width).concat(width);

  for (const w of widths) {
    const base = join(OUT, `${id}-${w}`);
    if (!isFresh(`${base}.avif`, src)) {
      await sharp(src).rotate().resize({ width: w }).avif({ quality: 50, effort: 4 }).toFile(`${base}.avif`);
    }
    if (!isFresh(`${base}.webp`, src)) {
      await sharp(src).rotate().resize({ width: w }).webp({ quality: 74 }).toFile(`${base}.webp`);
    }
  }
  console.log(`${id}: ${widths.join(", ")}`);
}
