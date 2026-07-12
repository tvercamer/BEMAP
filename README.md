# BEMAP

Backwards Educational Mapping And Planning

## On this page

1. [What is this tool?](#what-is-this-tool)
2. [Why does it exist?](#why-does-it-exist)
3. [How do I install it?](#how-do-i-install-it)
4. [How do I use it?](#how-do-i-use-it)
5. [Terminology](#terminology)

## What is this tool?

BEMAP is an AI assistant that guides professors in Flemish higher education (graduaat / bachelor / master) through designing a single OPO end-to-end, using **Backward Design**. It produces a compliant **ECTS-fiche**, aligned upward to the programme's existing learning outcomes.

## Why does it exist?

BEMAP encodes an opinionated pedagogical workflow rather than being a blank chatbot. This allows professors of the same institutation to form a more coherent curriculum.

## How do I install it?

You need **Node 20 or newer** (`.nvmrc` pins 20). Then:

```bash
npm install    # installs the tooling and sets up the pre-commit hook
npm run check  # lint + typecheck + tests — the same checks CI runs
```

BEMAP is authored as portable Markdown/YAML knowledge assets ("methodology as code"). The
scripts you'll use most:

| Script                  | Does                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `npm run build:project` | Assemble `project/project-instructions.md` from `knowledge/`  |
| `npm run sync:olr`      | Fetch a programme's OLRs + OPO index from the Odisee API      |
| `npm run sync:oer`      | Snapshot the OER PDFs (general + campus bijlagen) to Markdown |
| `npm run check`         | Lint, typecheck, and run the tests                            |
| `npm run format`        | Auto-format (Biome for TS/JSON, Prettier for MD/YAML)         |

### Syncing a programme's learning outcomes

The programme OLRs and OPO list come from the public Odisee ECTS API. Sync one programme
(by code, name, or id) for an academic year:

```bash
npm run sync:olr -- --programme O-SC-HPBGRD          # latest year
npm run sync:olr -- --programme "Graduaat in het programmeren" --year 2026
```

This writes `knowledge/programmes/<year>/<code>/olr.yaml` (bilingual OLRs) and
`programme.yaml` (the OPO index, so the coach can find a course by `opoCode` or name). To
remember which courses you teach year-over-year, copy `profiles/example.profile.yaml` to
`profiles/<you>.profile.yaml` (git-ignored) and add it to your Claude Project.

## How do I use it?

The MVP is a **chat product**. To stand it up:

1. Run `npm run build:project` to (re)generate `project/project-instructions.md`.
2. Create a new **Claude Project**.
3. Paste `project/project-instructions.md` as the Project's custom instructions.
4. Add the `knowledge/` files (template, OER, OLR, references) as Project knowledge.
5. Start a chat — the coach runs one OPO through the pipeline:
   **Intake → Learning Outcomes → Assessment → Study-load → Quality gate → Fiche assembly**,
   drafting at each step and letting you review before moving on.

The Odisee institution assets are real: the ECTS-fiche field-spec
(`knowledge/templates/ects-fiche.yaml`), the evaluation rules
(`knowledge/rules/oer-evaluation.*`) with snapshotted OER PDFs, and synced programme OLRs
(`knowledge/programmes/`). Refresh them with `npm run sync:olr` / `npm run sync:oer`, then
re-run `npm run build:project`. (English fiche terminology and the synthetic
`example-programme` placeholder are still to be finalised.)

## Terminology

- **Backward Design** — designing a course backwards from the outcomes students should
  achieve, then the assessment that evidences them, then the study effort to get there.
- **Constructive alignment** — outcomes, assessment, and study-load all pointing at the same
  targets. BEMAP's quality gate enforces it.
- **OPO** — opleidingsonderdeel; the course unit being designed. One OPO per session.
- **OLR** — opleidingsleerresultaten; the programme's learning outcomes. Course outcomes must
  align upward to these.
- **ECTS-fiche** — the course's official specification sheet; BEMAP's anchor deliverable.
- **ECTS** — credits expressing study-load (~25–30 study hours per credit).
- **OER** — onderwijs- en examenreglement; governs permitted evaluation forms, weighting, and
  resit rules.
- **Toetsmatrijs** — the LO × assessment coverage matrix that makes alignment visible.
