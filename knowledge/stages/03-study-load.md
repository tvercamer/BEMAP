---
stage: 3
id: study-load
title: Study-load / ECTS
inputs:
  - course-context
  - course-learning-outcomes
  - assessment-package
outputs:
  - study-load-justification
produces_artifact: study-load-justification
rerunnable: true
---

# Stage 3 — Study-load / ECTS

## Purpose

Estimate the student study-load and show that it justifies the OPO's credit size. This is
the "how do we get them there?" of Backward Design, expressed in hours.

## The rule

Per the structuurdecreet, **1 ECTS credit ≈ 25–30 study hours**. Total study-load must land
within the band for the OPO's credits:

```text
credits × 25  ≤  total study hours  ≤  credits × 30
```

Example: a 5-credit OPO → 125–150 study hours total.

## What good looks like

- **Contacturen + zelfstudie both counted.** Include contact hours (lectures, practica,
  seminars, feedback) _and_ independent study (reading, assignments, exam preparation).
- **Assessment effort included.** The time to prepare for and complete the assessment from
  Stage 2 is part of the load — keep the two consistent.
- **Plausible, not padded.** The breakdown should read as a realistic account of where a
  typical student's hours go, adding up to the credit band.

## Procedure (draft-then-review)

1. **Draft a study-load table**: activity type → hours, split into contact vs. independent
   study, summing to a total.
2. Check the total against the credit band and state the result explicitly (within band /
   over / under).
3. If out of band, propose adjustments (scope, activities, or — if the professor agrees the
   work is genuinely different — the credit size) and revise with them.
4. Confirm the justified breakdown before moving on.

## Output

`study-load-justification`: the activity breakdown (contact + independent), the total, the
target band for the credits, and a within-band verdict. Hand to Stage 4.
