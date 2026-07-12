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

| Script                  | Does                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `npm run build:project` | Assemble `project/project-instructions.md` from `knowledge/` |
| `npm run check`         | Lint, typecheck, and run the tests                           |
| `npm run format`        | Auto-format (Biome for TS/JSON, Prettier for MD/YAML)        |

## How do I use it?

The MVP is a **chat product**. To stand it up:

1. Run `npm run build:project` to (re)generate `project/project-instructions.md`.
2. Create a new **Claude Project**.
3. Paste `project/project-instructions.md` as the Project's custom instructions.
4. Add the `knowledge/` files (template, OER, OLR, references) as Project knowledge.
5. Start a chat — the coach runs one OPO through the pipeline:
   **Intake → Learning Outcomes → Assessment → Study-load → Quality gate → Fiche assembly**,
   drafting at each step and letting you review before moving on.

Before a real pilot, replace the placeholder institution assets (`status: placeholder`) with
the target institution's real content — the ECTS-fiche template
(`knowledge/templates/`), the OER rules (`knowledge/rules/oer-evaluation.*`), and a
programme's OLR (`knowledge/programmes/`) — then re-run `npm run build:project`.

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
