import { z } from 'zod';

/** Schema for knowledge/rules/quality-gate.yaml — the source of truth for the checks. */

export const severitySchema = z.enum(['blocking', 'advisory']);
export type Severity = z.infer<typeof severitySchema>;

export const qualityGateCheckSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  severity: severitySchema,
  automatable: z.boolean(),
  inputs: z.array(z.string()),
  reference: z.string().optional(),
});
export type QualityGateCheck = z.infer<typeof qualityGateCheckSchema>;

export const qualityGateSchema = z.object({
  version: z.number(),
  policy: z.object({
    chat: z.string(),
    app: z.string(),
  }),
  checks: z.array(qualityGateCheckSchema).min(1),
});
export type QualityGate = z.infer<typeof qualityGateSchema>;
