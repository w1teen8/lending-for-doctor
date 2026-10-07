import { photos, photoWidths, type PhotoId } from "@/content";
import { asset } from "@/lib/site";

type Props = {
  /** Key of src/content/photos.json; content JSON stores it as a plain string. */
  id: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** AVIF with WebP fallback from scripts/build-images.mjs; width/height reserve space, so no CLS. */
export function Picture({ id, alt, sizes, className, priority }: Props) {
  if (!(id in photos)) throw new Error(`Unknown photo id: ${id}`);
  const { width, height } = photos[id as PhotoId];
  const widths = photoWidths(id as PhotoId);
  const srcSet = (ext: string) => widths.map((w) => `${asset(`/photos/${id}-${w}.${ext}`)} ${w}w`).join(", ");
  const fallback = widths.find((w) => w >= 960) ?? widths[widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={asset(`/photos/${id}-${fallback}.webp`)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
