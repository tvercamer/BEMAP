---
stage: 2
id: assessment
title: Assessment
inputs:
  - course-learning-outcomes
  - knowledge/rules/oer-evaluation.md
outputs:
  - evaluation-plan
  - toetsmatrijs
  - rubrics
produces_artifact: assessment-package
rerunnable: true
---

# Stage 2 — Assessment

## Purpose

Decide how each learning outcome will be evidenced: an evaluation plan, a **toetsmatrijs**
(LO × assessment coverage matrix), and rubric(s) — all within the OER's permitted forms and
weighting rules.

## The toetsmatrijs (the alignment device)

Build a matrix with **course LOs as rows** and **assessment components as columns**. A cell
is marked when that component assesses that LO. The matrix makes constructive alignment
visible and is what the quality gate checks:

- **No empty LO row** → every outcome is assessed (no orphan LOs).
- **No empty assessment column** → every component maps to at least one LO (no orphan
  assessments).

## What good looks like

- **OER-compliant forms and weighting.** Use only evaluation forms the OER permits; respect
  weighting limits and any resit (herkansing) rules. Consult `oer-evaluation.md`; if a
  needed rule is not there, ask the professor rather than inventing it.
- **Fit for the verb.** The assessment form must be able to evidence the LO's verb — you
  cannot test "design" or "evaluate" with a pure recall MCQ. Match form to cognitive level.
- **Proportionate.** Weighting reflects the importance and study effort of each outcome, not
  just convenience.
- **Rubrics for judged work.** For open/creative/performance assessment, draft a rubric with
  criteria (tied to the LOs) and level descriptors.

## Procedure (draft-then-review)

1. Propose an **evaluation plan**: the components, their forms, weights, and timing
   (permanent evaluation vs. exam, resit eligibility).
2. Build and show the **toetsmatrijs** so coverage is visible; point out any orphan row or
   column and fix it with the professor.
3. For components that need one, **draft rubric(s)** and refine with the professor.
4. Confirm the full assessment package before moving on.

## Output

`assessment-package`: `evaluation-plan` (components with form, weight, timing, resit),
`toetsmatrijs` (LO × component coverage), and `rubrics`. Hand to Stage 3.
