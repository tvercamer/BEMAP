import { z } from 'zod';

/** Schema for knowledge/rules/oer-sources.yaml — the OER PDFs to snapshot. */

export const oerSourceSchema = z.object({
  id: z.string().min(1), // used as the snapshot filename
  label: z.string().min(1),
  url: z.string().url(), // stable media/<id> URL (302 → dated PDF)
});
export type OerSource = z.infer<typeof oerSourceSchema>;

export const oerSourcesSchema = z.object({
  institution: z.string().min(1),
  academiejaar: z.string().min(1),
  sources: z.array(oerSourceSchema).min(1),
});
export type OerSources = z.infer<typeof oerSourcesSchema>;
