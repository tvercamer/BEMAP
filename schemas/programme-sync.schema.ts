import { z } from 'zod';

/** Output shapes written by the OLR sync into knowledge/programmes/<year>/<code>/. */

export const syncProvenanceSchema = z.object({
  institution: z.string(),
  source: z.string(), // the API URL the data came from
  fetched_at: z.string(), // ISO timestamp
  academiejaar: z.number(),
  programme: z.object({
    id: z.number(),
    code: z.string(),
    naam: z.string(),
  }),
});

/** One programme learning outcome, stored bilingually (a session picks NL or EN). */
export const bilingualOutcomeSchema = z.object({
  code: z.string(), // derived from volgnummer, e.g. "LR3"
  volgnummer: z.number(),
  nl: z.string(),
  en: z.string(), // may be "" when the API has no English text
});
export type BilingualOutcome = z.infer<typeof bilingualOutcomeSchema>;

/** knowledge/programmes/<year>/<code>/olr.yaml */
export const programmeOlrFileSchema = syncProvenanceSchema.extend({
  outcomes: z.array(bilingualOutcomeSchema),
});
export type ProgrammeOlrFile = z.infer<typeof programmeOlrFileSchema>;

export const opoIndexEntrySchema = z.object({
  opoCode: z.string(),
  naam: z.string(),
  id: z.number(),
  fase: z.string(),
});
export type OpoIndexEntry = z.infer<typeof opoIndexEntrySchema>;

/** knowledge/programmes/<year>/<code>/programme.yaml — lets the coach look up an OPO by code or name. */
export const programmeIndexFileSchema = syncProvenanceSchema.extend({
  opos: z.array(opoIndexEntrySchema),
});
export type ProgrammeIndexFile = z.infer<typeof programmeIndexFileSchema>;
