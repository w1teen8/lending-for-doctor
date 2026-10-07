import Link from "next/link";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// GitHub Pages serves this as 404.html for every unknown path, so it carries its own <html>.
export default function NotFound() {
  return (
    <html lang={routing.defaultLocale} className={fontVariables}>
      <body>
        <main className="tone-ink flex min-h-svh items-center">
          <div className="shell py-16">
            <p className="display text-8xl text-signal md:text-[10rem]">404</p>
            <h1 className="h2 mt-6">Такої сторінки немає</h1>
            <p className="mt-4 text-lg measure text-subtle">Можливо, посилання застаріло. Почніть з головної сторінки.</p>
            <Link href={`/${routing.defaultLocale}/`} className="btn btn-outline mt-8">
              На головну
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
