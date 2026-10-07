"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { photos, photoWidths, type PhotoId } from "@/content";
import { asset, cn } from "@/lib/site";

type Props = {
  /** Clip in public/video/<id>.mp4; its poster is photos/v-<id>.jpg. */
  id: string;
  label: string;
  className?: string;
  /** The hero clip loads straight away; the rest wait until they scroll into view. */
  eager?: boolean;
  controlsClassName?: string;
};

/**
 * Silent loop that plays only while on screen. With prefers-reduced-motion it stays on its poster,
 * and the pause button covers WCAG 2.2.2 for motion that starts by itself.
 */
export function LoopVideo({ id, label, className, eager, controlsClassName }: Props) {
  const t = useTranslations("video");
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const userPaused = useRef(false);

  const posterId = `v-${id}` as PhotoId;
  const { width, height } = photos[posterId];
  const posterWidth = photoWidths(posterId).find((w) => w >= 960) ?? width;
  const poster = asset(`/photos/${posterId}-${posterWidth}.webp`);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(motion.matches);
    if (motion.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !userPaused.current) {
          if (video.preload === "none") video.preload = "auto";
          video.play().catch(() => setPaused(true));
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => undefined);
      setPaused(false);
    } else {
      userPaused.current = true;
      video.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <video
        ref={ref}
        className={className}
        width={width}
        height={height}
        poster={poster}
        muted
        loop
        playsInline
        preload={eager ? "auto" : "none"}
        aria-label={label}
        disablePictureInPicture
      >
        <source src={asset(`/video/${id}.mp4`)} type="video/mp4" />
      </video>
      {!reduced && (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? t("play") : t("pause")}
          className={cn(
            "absolute right-2 bottom-2 z-10 flex size-11 items-center justify-center rounded-[2px] bg-ink/70 text-paper hover:bg-ink",
            controlsClassName,
          )}
        >
          <span aria-hidden="true" className="text-sm leading-none">
            {paused ? "▶" : "❚❚"}
          </span>
        </button>
      )}
    </>
  );
}
