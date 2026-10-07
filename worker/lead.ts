// Lead endpoint for the static site (GitHub Pages cannot run server code).
// Deploy as a Cloudflare Worker, then set the repo variable LEAD_ENDPOINT to its URL.
//
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, CRM_WEBHOOK_URL, CRM_WEBHOOK_TOKEN.
// Variable: ALLOWED_ORIGIN, e.g. https://w1teen8.github.io
import { leadSchema, type Lead } from "../src/lib/lead-schema";

type Env = {
  ALLOWED_ORIGIN: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  CRM_WEBHOOK_URL?: string;
  CRM_WEBHOOK_TOKEN?: string;
};

// Per-isolate limit: 5 leads per IP per 10 minutes. For hard limits use Cloudflare Rate Limiting rules.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function telegramText(lead: Lead) {
  const title = { course: "Запис на курс", consultation: "Заявка на консультацію", waitlist: "Наступний набір" }[lead.type];
  const lines = [`<b>${title}</b>`, `Ім'я: ${esc(lead.name)}`, `Телефон: ${esc(lead.phone)}`];
  if (lead.type !== "consultation") lines.push(`Група: ${esc(lead.group)}`);
  if (lead.type === "consultation") lines.push(`Тема: ${esc(lead.topic)}`);
  if (lead.type !== "waitlist" && lead.comment) lines.push(`Коментар: ${esc(lead.comment)}`);
  return lines.join("\n");
}

async function deliver(lead: Lead, env: Env) {
  const jobs: Promise<Response>[] = [];
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    jobs.push(
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: telegramText(lead), parse_mode: "HTML" }),
      }),
    );
  }
  if (env.CRM_WEBHOOK_URL) {
    jobs.push(
      fetch(env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.CRM_WEBHOOK_TOKEN ?? ""}` },
        body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
      }),
    );
  }
  if (!jobs.length) return false;
  const results = await Promise.allSettled(jobs);
  // One channel is enough: the owner still gets the lead if the other is down.
  return results.some((r) => r.status === "fulfilled" && r.value.ok);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    const reply = (status: number, body: object) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { error: "method" });
    if (request.headers.get("Origin") !== env.ALLOWED_ORIGIN) return reply(403, { error: "origin" });

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    if (rateLimited(ip)) return reply(429, { error: "rate" });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return reply(400, { error: "json" });
    }

    // Honeypot filled: pretend success so the bot learns nothing.
    if (typeof body === "object" && body && "website" in body && (body as { website: unknown }).website) {
      return reply(200, { ok: true });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) return reply(422, { error: "invalid" });

    const delivered = await deliver(parsed.data, env);
    return delivered ? reply(200, { ok: true }) : reply(502, { error: "delivery" });
  },
};
