import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Author, Gallery, Reviews, Situations, TrustStrip } from "@/components/Blocks";
import { MobileBar } from "@/components/Client";
import { BookingProvider } from "@/components/forms/booking-context";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/Meta";
import { Booking, Consultation, Footer, Groups, Pricing, Program } from "@/components/Sections";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const content = getContent(locale);
  const { site: c } = content;

  // Order follows the brief: proof first, the offer next, the price close to the end.
  return (
    <>
      <Header name={c.person.name} />
      <main id="main">
        <Hero hero={c.hero} />
        <TrustStrip items={c.trust} />
        <Situations data={c.situations} />
        <Author data={c.author} name={c.person.name} />
        <Program data={c.program} days={content.program} />
        <Gallery data={c.gallery} />
        <Reviews title={c.reviews.title} items={content.reviews} />
        <BookingProvider>
          <Groups data={c.groups} groups={content.groups} />
          <Pricing data={c.pricing} />
          <Consultation data={c.consultation} />
          <Booking data={c.booking} contacts={c.contacts} groups={content.groups} />
        </BookingProvider>
      </main>
      <Footer legal={c.footer.legal} />
      <MobileBar />
      <JsonLd content={content} locale={locale} />
    </>
  );
}
