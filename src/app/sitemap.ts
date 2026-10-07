import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "aptechka/", "privacy/", "oferta/"];
  return routing.locales.flatMap((locale) =>
    pages.map((p) => ({ url: `${site.url}/${locale}/${p}`, priority: p ? 0.3 : 1 })),
  );
}
