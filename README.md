# Лендинг військового лікаря

Концепт-проєкт: односторінковий сайт курсу тактичної медицини й онлайн-консультацій. Лікар, відгуки, ціни й розклад вигадані, фото ілюстративні.

Next.js 15 (App Router, статичний експорт), Tailwind CSS 4, next-intl, React Hook Form + Zod, Motion. Хостинг — GitHub Pages.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000/uk/
npm run build      # статичний сайт у out/
```

`npm run dev` і `npm run build` спершу запускають `scripts/build-images.mjs`: він робить з `photos/*.jpg` адаптивні AVIF і WebP у `public/photos/` і заодно прибирає EXIF та геомітки.

## Де що змінювати

| Що | Файл |
| --- | --- |
| Тексти сторінки | `src/content/uk/site.json` |
| Розклад груп | `src/content/uk/groups.json` (минулі групи зникають самі) |
| Програма курсу | `src/content/uk/program.json` |
| Відгуки | `src/content/uk/reviews.json` |
| Політика, оферта, чек-лист | `src/content/uk/legal.json` |
| Підписи форм і кнопок | `messages/uk.json` |
| Фото | `photos/` + розміри й автори в `src/content/photos.json` |

## Публікація

Кожен push у `main` збирає сайт і публікує його через GitHub Actions (`.github/workflows/deploy.yml`). Сайт також перезбирається щодня о 03:00 UTC.

Змінні репозиторію (Settings → Secrets and variables → Actions → Variables):

- `CONCEPT` — `false`, щоб прибрати плашку «концепт» і дозволити індексацію.
- `LEAD_ENDPOINT` — адреса обробника заявок. Без неї форми працюють у демо-режимі й нічого не надсилають.
- `GA_ID` — GA4 Measurement ID.

## Заявки

GitHub Pages не виконує серверний код, тому заявки приймає окремий обробник `worker/lead.ts` (Cloudflare Worker). Він перевіряє дані тією ж схемою, що й браузер, відкидає ботів через honeypot, обмежує частоту запитів за IP і пересилає заявку в Telegram-бот і CRM.

## Перед запуском

- Замінити фото власною фотозйомкою з занять і додати справжній портрет у блок «Хто навчає».
- Додати фото до відгуків, лише з письмової згоди учасників.
- Підтвердити цифру лічильника (04:00) у клієнта.
- Вписати реквізити ФОП, номер ліцензії, справжні контакти.
- Погодити з юристом політику конфіденційності, оферту й дисклеймери.
- Розгорнути `worker/lead.ts` і прописати `LEAD_ENDPOINT`.
- Шрифт заголовків — Roboto Flex: в Archivo з ТЗ немає кирилиці.
