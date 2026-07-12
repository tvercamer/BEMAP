import { z } from 'zod';

/** Schema for knowledge/templates/ects-fiche.yaml — the institution's fiche field-spec. */

export const templateFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** richtext | single-select | multi-select | outcomes | richtext-per-werkvorm | ... */
  type: z.string().min(1),
  required: z.boolean().optional(),
  /** Allowed values for select fields. */
  options: z.array(z.string()).optional(),
  /** Where the field's content originates (e.g. "olr-api"). */
  source: z.string().optional(),
  default: z.string().optional(),
  notes: z.string().optional(),
  /** Named content transforms applied on assembly (e.g. "strip-trailing-nvt"). */
  transforms: z.array(z.string()).optional(),
  /** Whether a per-programme standard sentence applies, and how. */
  programme_standard_sentence: z.enum(['optional', 'prefix']).optional(),
  allow_append: z.boolean().optional(),
  includes_study_load: z.boolean().optional(),
  /** The distinct category list Odisee uses for the werkvorm explanation. */
  explanation_categories: z.array(z.string()).optional(),
});
export type TemplateField = z.infer<typeof templateFieldSchema>;

export const ficheTemplateSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  fields: z.array(templateFieldSchema).min(1),
});

export const ficheTemplateSchema = z.object({
  status: z.string().optional(),
  institution: z.string().min(1),
  language: z.enum(['nl', 'en']),
  sections: z.array(ficheTemplateSectionSchema).min(1),
});
export type FicheTemplate = z.infer<typeof ficheTemplateSchema>;

/** Find a field by id across all sections (handy for cross-checks). */
export function findField(template: FicheTemplate, fieldId: string): TemplateField | undefined {
  for (const section of template.sections) {
    const field = section.fields.find((f) => f.id === fieldId);
    if (field) return field;
  }
  return undefined;
}
