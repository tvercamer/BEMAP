---
id: oer-evaluation
title: Rules — OER Evaluation (prose reference)
role: rules
status: partial
institution: Odisee
---

# OER — evaluation rules (Odisee)

The authoritative source is Odisee's **OER** (onderwijs- en examenreglement) plus the
campus-specific bijlage. These are fetched and snapshotted into the KB (see below); the
machine-checkable subset lives in [`oer-evaluation.yaml`](./oer-evaluation.yaml).

## Sources (snapshotted by `npm run sync:oer`)

Configured in [`oer-sources.yaml`](./oer-sources.yaml); snapshots land in
[`oer-snapshots/`](./oer-snapshots/) with provenance (source URL, resolved PDF, fetched-at,
page count, SHA-256):

- **General OER (2026–2027):** <https://www.odisee.be/media/34279> →
  `oer-snapshots/general.md`
- **Campus Brussel bijlage (2026–2027):** <https://www.odisee.be/media/34285> →
  `oer-snapshots/campus-brussel.md`

> The dated PDF URLs change; always resolve through the `media/<id>` links above. The
> snapshots are raw-extracted PDF text (the source of truth for weighting, resit, tolerances,
> and thresholds); this file summarises the evaluation-form list for quick reference.

## Permitted evaluation forms (fiche "Vorm")

The forms permitted on an Odisee fiche (mirrored in `oer-evaluation.yaml` → `permitted_forms`):

- Paper/Werkstuk
- Verslag
- Presentatie
- Medewerking tijdens contactmomenten
- Self assessment/Peer assessment
- Portfolio
- Procesevaluatie
- Vaardigheidstoets
- Take-home
- Ontwerp/Product

Each fiche also picks one evaluation **type** (exam timing) — see
`templates/ects-fiche.yaml` → `evaluatie_type`.

## Weighting, resit, tolerances

Governed by the OER PDFs above. Component weights on an OPO sum to 100%. Resit (herkansing)
rules and grade tolerances are defined in the OER and the campus bijlage — to be extracted
into this section when the OER snapshot is added.
