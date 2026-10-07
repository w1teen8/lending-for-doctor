import { defineRouting } from "next-intl/routing";

// Англійську версію додаємо сюди ("en") разом із messages/en.json і src/content/en/,
// коли з'являться запити від іноземних організацій. Маршрути вже мають префікс /uk.
export const routing = defineRouting({
  locales: ["uk"],
  defaultLocale: "uk",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
