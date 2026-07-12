import { z } from 'zod';

/**
 * A fiche-session is the structured representation of one OPO design run — the data the
 * Backward-Design stages produce. The quality-gate validator checks constructive alignment
 * against this shape. In the Chat MVP the coach holds this implicitly; in the future web app
 * it becomes the persisted session object.
 */

export const levelSchema = z.enum(['graduaat', 'bachelor', 'master']);
export type Level = z.infer<typeof levelSchema>;

export const olrOutcomeSchema = z.object({
  code: z.string().min(1),
  text: z.string().min(1),
});

export const learningOutcomeSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  /** The main action verb (used by QG-03 measurable-verbs). */
  verb: z.string(),
  /** Programme LO codes this outcome aligns upward to (QG-06 olr-traceability). */
  olrRefs: z.array(z.string()),
});
export type LearningOutcome = z.infer<typeof learningOutcomeSchema>;

export const assessmentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Evaluation form; must be permitted by the OER (QG-05). */
  form: z.string().min(1),
  /** Weight as a percentage of the OPO total. */
  weight: z.number().min(0).max(100),
});
export type Assessment = z.infer<typeof assessmentSchema>;

export const toetsmatrijsEntrySchema = z.object({
  /** A learning-outcome id. */
  lo: z.string().min(1),
  /** Assessment component ids that cover this LO. */
  components: z.array(z.string()),
});

export const studyLoadItemSchema = z.object({
  activity: z.string().min(1),
  type: z.enum(['contact', 'independent']),
  hours: z.number().min(0),
});

export const studyLoadSchema = z.object({
  breakdown: z.array(studyLoadItemSchema).min(1),
  /** Declared total study hours; QG-04 checks it against the ECTS band and the breakdown. */
  total: z.number().min(0),
});

export const ficheSessionSchema = z.object({
  language: z.enum(['nl', 'en']),
  programme: z.string().min(1),
  level: levelSchema,
  ects: z.number().positive(),
  olr: z.array(olrOutcomeSchema),
  learningOutcomes: z.array(learningOutcomeSchema).min(1),
  assessments: z.array(assessmentSchema).min(1),
  toetsmatrijs: z.array(toetsmatrijsEntrySchema),
  studyLoad: studyLoadSchema,
});
export type FicheSession = z.infer<typeof ficheSessionSchema>;
