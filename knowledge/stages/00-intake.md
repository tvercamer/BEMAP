---
stage: 0
id: intake
title: Intake
inputs:
  - professor-input
  - knowledge/programmes/*/olr.yaml
outputs:
  - course-context
produces_artifact: course-context
rerunnable: true
---

# Stage 0 — Intake

## Purpose

Capture the context needed to design the OPO, and load the right programme's OLR so every
later stage can align upward. This stage sets the frame; it does not yet draft outcomes.

## First action: choose the session language

Before anything else, ask the professor whether to work in **Dutch (NL)** or **English
(EN)**. Fix this for the whole session and switch entirely into that language.

## What to capture

- **Programme + level** — which opleiding, and graduaat / bachelor / master. The level
  drives the expected cognitive level of the LOs via the Dublin descriptors.
- **Which programme's OLR applies** — load the matching `knowledge/programmes/<slug>/olr.yaml`.
  If none is loaded, ask the professor to provide the programme learning outcomes.
- **ECTS size** — how many credits. This bounds the study-load later.
- **Position in the curriculum** — which phase/semester; is it foundational or advanced?
- **Begincompetenties** — prerequisite competencies / prior OPOs assumed.
- **Constraints** — cohort size, delivery mode, mandatory evaluation forms, sequencing with
  other OPOs, anything the OER or programme imposes.
- **Topic / intent** — a few sentences on what the course is about and why it exists in the
  programme.

## Procedure (draft-then-review)

1. Ask for the language, then the programme + level + ECTS size first — these unlock the
   right reference assets.
2. Gather the rest conversationally; don't interrogate. Offer sensible defaults the
   professor can confirm or override.
3. **Summarize the captured context** back to the professor as a short structured recap and
   confirm it before moving on.

## Revision branch

If the professor is revising an existing OPO, also ingest the current ECTS-fiche and any
materials here. Extract the existing LOs, assessment, and study-load into the same
`course-context` shape so the later stages diagnose rather than start blank.

## Output

A `course-context` record: language, programme, level, ECTS size, curriculum position,
begincompetenties, constraints, topic, and the loaded OLR reference. Hand this to
Stage 1.
