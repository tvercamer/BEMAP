import type { FicheSession } from '../../schemas/fiche-session.schema';
import type { OerConfig } from '../../schemas/oer.schema';
import type { QualityGate, Severity } from '../../schemas/quality-gate.schema';

/**
 * Applies the constructive-alignment checks (functional scope §3.3) to a fiche-session.
 * The check ids, names, and severities come from knowledge/rules/quality-gate.yaml; this file
 * implements *how* each id is evaluated. This is the seed of the future web app's validation.
 */

export interface CheckResult {
  id: string;
  name: string;
  severity: Severity;
  passed: boolean;
  /** Human-readable offending items (which LO, which component, which number). */
  offenders: string[];
  message: string;
}

export interface ValidationReport {
  checks: CheckResult[];
  /** True when every `blocking` check passes (assembly precondition). */
  passedBlocking: boolean;
  /** True when every check, including advisory, passes. */
  passedAll: boolean;
}

/**
 * Vague verbs that describe an internal state, not an observable performance.
 * Mirrors the avoid-lists in knowledge/reference/bloom-verbs.{en,nl}.md (QG-03).
 */
const BANNED_VERBS = new Set<string>([
  // EN
  'understand',
  'understands',
  'know',
  'knows',
  'be aware of',
  'aware',
  'be familiar with',
  'familiar',
  'appreciate',
  'learn',
  'grasp',
  'gain insight into',
  // NL
  'begrijpen',
  'kennen',
  'weten',
  'bewust zijn van',
  'vertrouwd zijn met',
  'inzien',
  'appreciëren',
  'leren',
  'kennismaken met',
  'inzicht verwerven in',
]);

type Evaluation = { passed: boolean; offenders: string[]; message: string };
type Evaluator = (session: FicheSession, oer: OerConfig) => Evaluation;

const evaluators: Record<string, Evaluator> = {
  // QG-01 — every LO is assessed by at least one component.
  'QG-01': (s) => {
    const coverage = new Map<string, number>();
    for (const entry of s.toetsmatrijs) coverage.set(entry.lo, entry.components.length);
    const orphans = s.learningOutcomes.filter((lo) => (coverage.get(lo.id) ?? 0) === 0);
    return {
      passed: orphans.length === 0,
      offenders: orphans.map((lo) => lo.id),
      message:
        orphans.length === 0
          ? 'Every learning outcome is assessed.'
          : `Unassessed learning outcomes: ${orphans.map((lo) => lo.id).join(', ')}.`,
    };
  },

  // QG-02 — every assessment component maps to at least one LO.
  'QG-02': (s) => {
    const used = new Set<string>();
    for (const entry of s.toetsmatrijs) for (const c of entry.components) used.add(c);
    const orphans = s.assessments.filter((a) => !used.has(a.id));
    return {
      passed: orphans.length === 0,
      offenders: orphans.map((a) => a.id),
      message:
        orphans.length === 0
          ? 'Every assessment maps to a learning outcome.'
          : `Assessments not linked to any LO: ${orphans.map((a) => a.id).join(', ')}.`,
    };
  },

  // QG-03 — LO verbs are observable/measurable (not in the banned list, not empty).
  'QG-03': (s) => {
    const bad = s.learningOutcomes.filter((lo) => {
      const verb = lo.verb.trim().toLowerCase();
      return verb === '' || BANNED_VERBS.has(verb);
    });
    return {
      passed: bad.length === 0,
      offenders: bad.map((lo) => `${lo.id} (verb: "${lo.verb || '∅'}")`),
      message:
        bad.length === 0
          ? 'All learning-outcome verbs are observable.'
          : `Learning outcomes with vague/missing verbs: ${bad.map((lo) => lo.id).join(', ')}.`,
    };
  },

  // QG-04 — total study-load within the ECTS band and consistent with the breakdown.
  'QG-04': (s) => {
    const min = s.ects * 25;
    const max = s.ects * 30;
    const sum = s.studyLoad.breakdown.reduce((acc, item) => acc + item.hours, 0);
    const withinBand = s.studyLoad.total >= min && s.studyLoad.total <= max;
    const consistent = sum === s.studyLoad.total;
    const offenders: string[] = [];
    if (!withinBand) {
      offenders.push(
        `total ${s.studyLoad.total}h is outside the ${min}–${max}h band for ${s.ects} ECTS`,
      );
    }
    if (!consistent) {
      offenders.push(`breakdown sums to ${sum}h but declared total is ${s.studyLoad.total}h`);
    }
    return {
      passed: withinBand && consistent,
      offenders,
      message:
        offenders.length === 0 ? 'Study-load is within band and consistent.' : offenders.join('; '),
    };
  },

  // QG-05 — assessment forms permitted, weights sum correctly, none over cap.
  'QG-05': (s, oer) => {
    const offenders: string[] = [];
    for (const a of s.assessments) {
      if (!oer.permitted_forms.includes(a.form)) {
        offenders.push(`${a.id}: form "${a.form}" is not OER-permitted`);
      }
    }
    const weightSum = s.assessments.reduce((acc, a) => acc + a.weight, 0);
    if (weightSum !== oer.weight_must_sum_to) {
      offenders.push(`weights sum to ${weightSum}%, expected ${oer.weight_must_sum_to}%`);
    }
    const cap = oer.max_component_weight;
    if (cap !== null) {
      for (const a of s.assessments) {
        if (a.weight > cap) offenders.push(`${a.id}: weight ${a.weight}% exceeds cap ${cap}%`);
      }
    }
    return {
      passed: offenders.length === 0,
      offenders,
      message: offenders.length === 0 ? 'Assessment complies with the OER.' : offenders.join('; '),
    };
  },

  // QG-06 — every LO traces to at least one existing programme LO.
  'QG-06': (s) => {
    const codes = new Set(s.olr.map((o) => o.code));
    const bad = s.learningOutcomes.filter(
      (lo) => lo.olrRefs.length === 0 || lo.olrRefs.some((ref) => !codes.has(ref)),
    );
    return {
      passed: bad.length === 0,
      offenders: bad.map((lo) => lo.id),
      message:
        bad.length === 0
          ? 'Every learning outcome traces to a programme LO.'
          : `Learning outcomes without a valid OLR trace: ${bad.map((lo) => lo.id).join(', ')}.`,
    };
  },
};

/** Check ids that have an automated evaluator (exported for the drift test). */
export const implementedCheckIds = Object.keys(evaluators);

export function validateFicheSession(
  session: FicheSession,
  gate: QualityGate,
  oer: OerConfig,
): ValidationReport {
  const checks: CheckResult[] = gate.checks.map((meta) => {
    const evaluator = evaluators[meta.id];
    const outcome: Evaluation = evaluator
      ? evaluator(session, oer)
      : { passed: false, offenders: [], message: `No automated evaluator for ${meta.id}.` };
    return {
      id: meta.id,
      name: meta.name,
      severity: meta.severity,
      passed: outcome.passed,
      offenders: outcome.offenders,
      message: outcome.message,
    };
  });

  const passedBlocking = checks.filter((c) => c.severity === 'blocking').every((c) => c.passed);
  const passedAll = checks.every((c) => c.passed);
  return { checks, passedBlocking, passedAll };
}

/** Render a report as a compact, human-readable checklist (handy for a CLI or the coach). */
export function formatReport(report: ValidationReport): string {
  const lines = report.checks.map((c) => {
    const mark = c.passed ? '✓' : '✗';
    const tag = c.severity === 'blocking' ? '[blocking]' : '[advisory]';
    const detail = c.passed ? '' : ` — ${c.message}`;
    return `${mark} ${c.id} ${tag} ${c.name}${detail}`;
  });
  const verdict = report.passedBlocking
    ? report.passedAll
      ? 'PASS — all checks green.'
      : 'PASS (blocking) — advisory warnings remain.'
    : 'FAIL — blocking checks unresolved.';
  return `${lines.join('\n')}\n${verdict}`;
}
