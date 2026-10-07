const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const site = {
  basePath,
  // Absolute site URL including the base path, without a trailing slash.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  // Concept mode: noindex, a visible notice, and forms that send nothing.
  isConcept: process.env.NEXT_PUBLIC_CONCEPT !== "false",
  // HTTPS endpoint that accepts leads (see worker/lead.ts). Empty = demo mode.
  leadEndpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
};

/** Prefixes a public/ path with the base path; next/link does this itself, plain URLs do not. */
export const asset = (path: string) => `${basePath}${path}`;

export const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");
