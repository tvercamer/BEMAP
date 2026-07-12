---
stage: 4
id: fiche-assembly
title: Fiche Assembly
inputs:
  - course-context
  - course-learning-outcomes
  - assessment-package
  - study-load-justification
  - knowledge/templates/ects-fiche.md
outputs:
  - assembled-fiche
produces_artifact: assembled-fiche
rerunnable: true
---

# Stage 4 — Fiche Assembly

## Purpose

Compile everything from Stages 0–3 into the institution's ECTS-fiche template, in the
session language. This is BEMAP's anchor deliverable.

## Procedure

1. **Run the quality gate first.** Do not assemble a fiche that has not passed (or been
   explicitly acknowledged against) the [quality gate](05-quality-gate.md). See its policy
   for warnings vs. blocking.
2. **Fill every template field** from `knowledge/templates/ects-fiche.md` using the gathered
   artifacts. Do not leave template fields silently blank — if a field has no source, ask
   the professor or mark it clearly as to-be-completed.
3. **Preserve traceability.** Keep the LO→OLR mapping and the toetsmatrijs visible in the
   fiche where the template allows.
4. Present the assembled fiche as **Markdown** (renders cleanly and copy-pastes into the
   institution's fiche system). Word/PDF export is deferred to the future web app.

## Output format

The assembled fiche is Markdown that mirrors the institution's template field-for-field, in
the session language. The professor can copy it into the institutional system as-is.

## Output

`assembled-fiche`: the completed ECTS-fiche in the template's structure. This is the final
artifact of a from-scratch run.
