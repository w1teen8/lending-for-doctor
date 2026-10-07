import Script from "next/script";
import type { Content } from "@/content";
import { site } from "@/lib/site";
import { ScrollDepth } from "./Client";

/** GA4 only when NEXT_PUBLIC_GA_ID is set. No session recording — see the privacy section of the brief. */
export function Analytics() {
  if (!site.gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(site.gaId)});`}
      </Script>
      <ScrollDepth />
    </>
  );
}

const price = (s: string) => Number(s.replace(/\D/g, ""));

/** Course + Person + LocalBusiness for local search. */
export function JsonLd({ content, locale }: { content: Content; locale: string }) {
  const { site: c, groups } = content;
  const url = `${site.url}/${locale}/`;
  const person = {
    "@type": "Person",
    "@id": `${url}#person`,
    name: c.person.name,
    jobTitle: c.person.role,
    knowsAbout: ["Tactical Combat Casualty Care", "Анестезіологія", "Тактична медицина"],
  };
  const groupPrice = c.pricing.items.find((i) => i.id === "group");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "Course",
        name: c.program.title,
        description: c.meta.description,
        inLanguage: locale,
        provider: { "@id": `${url}#person` },
        hasCourseInstance: groups.map((g) => ({
          "@type": "CourseInstance",
          courseMode: "Onsite",
          startDate: g.start,
          endDate: g.end,
          location: { "@type": "Place", name: g.city, address: { "@type": "PostalAddress", addressLocality: g.city, addressCountry: "UA" } },
          instructor: { "@id": `${url}#person` },
          offers: groupPrice && {
            "@type": "Offer",
            price: price(groupPrice.price),
            priceCurrency: "UAH",
            availability: g.seatsLeft > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
          },
        })),
      },
      {
        "@type": "LocalBusiness",
        name: `${c.person.name} — ${c.program.title}`,
        url,
        telephone: c.contacts.phone.href.replace("tel:", ""),
        address: { "@type": "PostalAddress", addressLocality: c.footer.address, addressCountry: "UA" },
        openingHours: c.footer.openingHours,
        founder: { "@id": `${url}#person` },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
