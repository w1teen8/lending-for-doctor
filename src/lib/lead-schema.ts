import { z } from "zod";

// One schema for the browser and for the lead endpoint (worker/lead.ts).
// Error messages are keys into messages/<locale>.json → form.errors.

const name = z.string().trim().min(2, { error: "name" }).max(80, { error: "name" });

const phone = z
  .string()
  .trim()
  .refine((v) => /^\+[1-9]\d{9,14}$/.test(normalizePhone(v)), { error: "phone" });

const comment = z.string().trim().max(500, { error: "comment" });

const consent = z.boolean().refine((v) => v, { error: "consent" });

export const courseLeadSchema = z.object({
  type: z.literal("course"),
  name,
  phone,
  group: z.string().min(1, { error: "group" }).max(64),
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
  group: z.string().min(1).max(64),
  consent,
});

export const leadSchema = z.discriminatedUnion("type", [
  courseLeadSchema,
  consultationLeadSchema,
  waitlistLeadSchema,
]);

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
