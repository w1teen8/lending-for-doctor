import type { Locale } from "@/i18n/routing";
import photos from "./photos.json";
import groupsUk from "./uk/groups.json";
import legalUk from "./uk/legal.json";
import programUk from "./uk/program.json";
import reviewsUk from "./uk/reviews.json";
import siteUk from "./uk/site.json";

const content = {
  uk: { site: siteUk, program: programUk, groups: groupsUk, reviews: reviewsUk, legal: legalUk },
} satisfies Record<Locale, unknown>;

export const getContent = (locale: Locale) => content[locale];

export type Content = (typeof content)["uk"];
export type SiteContent = Content["site"];
export type ProgramDay = Content["program"][number];
export type Group = Content["groups"][number];
export type Review = Content["reviews"][number];

export type PhotoId = keyof typeof photos;
export { photos };

const WIDTHS = [480, 960, 1440, 2400];

/** Same widths scripts/build-images.mjs writes for a photo. */
export function photoWidths(id: PhotoId) {
  const { width } = photos[id];
  return WIDTHS.filter((w) => w < width).concat(width);
}
