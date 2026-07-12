---
stage: 1
id: learning-outcomes
title: Learning Outcomes
inputs:
  - course-context
  - knowledge/reference/dublin-descriptors.md
  - knowledge/reference/bloom-verbs.{nl,en}.md
outputs:
  - course-learning-outcomes
produces_artifact: course-learning-outcomes
rerunnable: true
---

# Stage 1 — Learning Outcomes

## Purpose

Draft measurable course learning outcomes (LOs) that are aligned upward to the programme's
OLR and pitched at the correct level. These LOs anchor everything downstream.

## What good looks like

- **Observable and assessable.** Each LO uses an action verb you can actually test (see
  `bloom-verbs.*`). Ban vague verbs: "understands", "knows", "is familiar with", "is aware
  of".
- **Level-appropriate.** The verb's cognitive level matches the programme level via the
  Dublin descriptors (graduaat → applied/operational; bachelor → broader application and
  analysis; master → evaluation, design, research-informed judgment).
- **Right grain size.** Aim for roughly 4–8 course LOs for a typical OPO — enough to cover
  the course, few enough to each be assessable. Split LOs that bundle two verbs.
- **Traceable upward.** Every LO maps to at least one programme LO (OLR code). Record the
  mapping explicitly.

## Procedure (draft-then-review)

1. From the `course-context` and the loaded OLR, **draft a first set of LOs**, each with:
   its text, the action verb/level, and the OLR code(s) it aligns to.
2. Present the draft with a short rationale and the upward mapping shown as a small table.
3. Invite the professor to edit wording, add, merge, or drop LOs. Push back gently on
   unassessable verbs and propose measurable replacements.
4. Confirm the final set and the OLR mapping before moving on.

## Guardrails

- Do not leave any LO without an OLR mapping. If an intended LO fits no programme LO, flag
  it — either the LO is out of the programme's scope, or the OLR provided is incomplete.
- Keep the LOs in the session language; use the matching `bloom-verbs` list.

## Output

`course-learning-outcomes`: an ordered list, each with `id`, `text`, `verb_level`, and
`olr_refs`. Hand to Stage 2.
