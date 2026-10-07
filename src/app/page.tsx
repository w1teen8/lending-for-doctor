import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

// GitHub Pages has no server redirects, so the root page forwards to the default locale.
export default function RootRedirect() {
  const target = `${routing.defaultLocale}/`;
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={`${site.url}/${target}`} />
        <title>Курс тактичної медицини</title>
      </head>
      <body>
        <a href={target}>Перейти на сайт</a>
      </body>
    </html>
  );
}
