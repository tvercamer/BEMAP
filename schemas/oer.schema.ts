import { z } from 'zod';

/** Schema for knowledge/rules/oer-evaluation.yaml — the machine-checkable OER subset (QG-05). */

export const oerConfigSchema = z.object({
  status: z.string().optional(),
  /** Evaluation forms the OER permits. */
  permitted_forms: z.array(z.string()).min(1),
  /** Component weights across an OPO must sum to exactly this (percent). */
  weight_must_sum_to: z.number(),
  /** Max weight of a single component (percent); null = no cap. */
  max_component_weight: z.number().nullable(),
});
export type OerConfig = z.infer<typeof oerConfigSchema>;
