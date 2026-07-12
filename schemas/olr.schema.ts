import { z } from 'zod';
import { levelSchema, olrOutcomeSchema } from './fiche-session.schema';

/** Schema for knowledge/programmes/<slug>/olr.yaml — a programme's learning outcomes. */

export const programmeOlrSchema = z.object({
  status: z.string().optional(),
  programme: z.string().min(1),
  level: levelSchema,
  outcomes: z.array(olrOutcomeSchema).min(1),
});
export type ProgrammeOlr = z.infer<typeof programmeOlrSchema>;
