---
stage: 5
id: quality-gate
title: Quality Gate
inputs:
  - course-learning-outcomes
  - assessment-package
  - study-load-justification
  - course-context
  - knowledge/rules/quality-gate.yaml
outputs:
  - quality-report
produces_artifact: quality-report
rerunnable: true
---

# Stage 5 — Quality Gate

## Purpose

Validate constructive alignment before the fiche is assembled. This stage is the narrative
wrapper around the machine-readable checks in
[`knowledge/rules/quality-gate.yaml`](../rules/quality-gate.yaml). That YAML is the single
source of truth for _what_ is checked; this file governs _how the coach runs it_.

## The checks (see the YAML for exact definitions)

- **QG-01 — no orphan LOs**: every LO is assessed by ≥1 component.
- **QG-02 — no orphan assessments**: every component maps to ≥1 LO.
- **QG-03 — measurable verbs**: LO verbs are observable and level-appropriate (advisory).
- **QG-04 — study-load within band**: total hours match the ECTS credit band.
- **QG-05 — OER-compliant assessment**: permitted forms, weights sum to 100%, within limits.
- **QG-06 — OLR traceability**: every LO traces to ≥1 programme LO.

## Policy (Chat MVP)

The coach runs in **warn-and-confirm** mode:

1. Run all checks and produce a short **quality report**: each check with pass / fail and, on
   failure, the specific offending item (which LO, which component, which number).
2. For any **blocking** failure, explain what is broken and **propose the fix**, then offer
   to jump back to the relevant stage to resolve it.
3. Do **not** assemble a fiche with unresolved blocking failures without the professor
   **explicitly acknowledging** them. Advisory failures are surfaced but do not stop
   assembly.
4. When all blocking checks pass, say so plainly and proceed to
   [Stage 4 — Fiche Assembly](04-fiche-assembly.md).

(The future web app will run the same checks from the YAML and can enforce hard blocking,
per the `policy.app` setting. The chat coach approximates this with confirmation.)

## Output

`quality-report`: per-check status with offending items and proposed fixes. Passing (or
acknowledged) is the precondition for assembly.
