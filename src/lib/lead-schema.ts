import * as z from "zod/mini";

// One schema for the browser and for the lead endpoint (worker/lead.ts).
// zod/mini keeps the client bundle small. Error messages are keys into
// messages/<locale>.json → form.errors.

const name = z.string().check(z.trim(), z.minLength(2, { error: "name" }), z.maxLength(80, { error: "name" }));

const phone = z
  .string()
  .check(z.trim(), z.refine((v) => /^\+[1-9]\d{9,14}$/.test(normalizePhone(v)), { error: "phone" }));

const comment = z.string().check(z.trim(), z.maxLength(500, { error: "comment" }));

const consent = z.boolean().check(z.refine((v) => v, { error: "consent" }));

export const courseLeadSchema = z.object({
  type: z.literal("course"),
  name,
  phone,
  group: z.string().check(z.minLength(1, { error: "group" }), z.maxLength(64)),
  comment,
  consent,
});

export const consultationTopics = ["rehab", "vlk", "second-opinion", "other"] as const;

export const consultationLeadSchema = z.object({
  type: z.literal("consultation"),
  name,
  phone,
  topic: z.enum(consultationTopics, { error: "topic" }),
  comment,
  consent,
});

export const waitlistLeadSchema = z.object({
  type: z.literal("waitlist"),
  name,
  phone,
  group: z.string().check(z.minLength(1), z.maxLength(64)),
  consent,
});

export const leadSchema = z.discriminatedUnion("type", [courseLeadSchema, consultationLeadSchema, waitlistLeadSchema]);

export type CourseLead = z.infer<typeof courseLeadSchema>;
export type ConsultationLead = z.infer<typeof consultationLeadSchema>;
export type WaitlistLead = z.infer<typeof waitlistLeadSchema>;
export type Lead = z.infer<typeof leadSchema>;

export function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

/** Live mask: keeps a leading +, groups Ukrainian numbers as +380 67 123 45 67. */
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 15);
  if (!digits) return "";
  if (digits.startsWith("380")) {
    const parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 8), digits.slice(8, 10), digits.slice(10, 12)];
    return "+" + parts.filter(Boolean).join(" ");
  }
  return "+" + (digits.match(/.{1,3}/g) ?? []).join(" ");
}
