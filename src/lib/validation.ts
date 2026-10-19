import { z } from "zod";

export const productInput = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
  description: z.string().trim().min(10).max(5000),
  priceCents: z.number().int().min(100).max(100_000_000),
  currency: z.literal("BRL").default("BRL"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
});
export const loginInput = z.object({ email: z.email().transform(v => v.toLowerCase()), password: z.string().min(1).max(200) });
