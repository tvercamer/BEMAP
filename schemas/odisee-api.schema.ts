import { z } from 'zod';

/**
 * Schemas for the public Odisee ECTS API (https://ects-invoer.odisee.be).
 * Unknown fields are stripped by zod, so the many null extras in responses are ignored.
 */

export const odiseeVertalingSchema = z.object({
  taal: z.string(), // "N" (Nederlands) | "E" (English)
  tekst: z.string(),
  beschrijving: z.string().nullable(),
});
export type OdiseeVertaling = z.infer<typeof odiseeVertalingSchema>;

export const odiseeYearsSchema = z.array(z.number());

export const odiseeProgrammeSchema = z.object({
  id: z.number(),
  naam: z.string(),
  academiejaar: z.number(),
  code: z.string(),
});
export type OdiseeProgramme = z.infer<typeof odiseeProgrammeSchema>;
export const odiseeProgrammeListSchema = z.array(odiseeProgrammeSchema);

export const odiseeOpoSchema = z.object({
  id: z.number(),
  naam: z.string(),
  opleidingsFase: z.string(),
  opoCode: z.string(),
});
export type OdiseeOpo = z.infer<typeof odiseeOpoSchema>;
export const odiseeOpoListSchema = z.array(odiseeOpoSchema);

export const odiseeLeeruitkomstSchema = z.object({
  id: z.number(),
  nummer: z.number(),
  vertalingen: z.array(odiseeVertalingSchema),
  leerresultaatId: z.number().optional(),
});

export const odiseeLeerresultaatSchema = z.object({
  id: z.number(),
  volgnummer: z.number(),
  vertalingen: z.array(odiseeVertalingSchema),
  leeruitkomsten: z.array(odiseeLeeruitkomstSchema).default([]),
});
export type OdiseeLeerresultaat = z.infer<typeof odiseeLeerresultaatSchema>;
export const odiseeLeerresultaatListSchema = z.array(odiseeLeerresultaatSchema);
