---
id: AMPM-CONTENT-SUBJ-DBE-MATH-LIT
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-PIPELINE]
tags: [subject, math-lit, dbe, profile]
---

# Subject Profile — DBE Mathematical Literacy

The subject-specific residue for authoring DBE Math Lit content. Everything else comes
from `core/` and `presentations/` per `INSTRUCTIONS.md`.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"math_lit"` |
| Postgres tables | `lessons`, `questions` — `subject_id = "math_lit"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'math_lit'` — flat slug IDs. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject math_lit --out temp/curriculum-vocab.json` (Auth Proxy running) |
| Not authored | display names/colours — resolved from the reference tables by JOIN |
| Papers | `nov_p1`, `nov_p2`, `june_p1`, `june_p2` |

## Allowed presentation types

All eight: `fitb`, `fraction`, `multiple_choice`, `multi_select`, `ordering`, `match`,
`equation`, `steps`. Question `type` vocabulary: `definition`, `calc`, `application`,
`conversion`, `fraction`, `proof` (`SCHEMA-QT-01`; `"reading"` is invalid — use
`definition`).

## Subject rules (beyond core)

- **FITB cap 65% per paper** (`DESIGN-ML-01`) and **non-trivial answers**
  (`DESIGN-ML-02`), **question-group scoping** (`DESIGN-ML-03`) — see
  `core/authoring-principles.md`.
- MathText markup applies (`AMPM-CONTENT-MATHTEXT`).
- 2–4 practice questions per video/question group.
- Tags: maths concepts or curriculum topics only — never scenario wrappers
  (✗ `motorcycles`; ✓ `percentage`, `sars`, `hire_purchase`) (`PIPE-06`).

## Curriculum hierarchy

`unit` → `topic` → `subtopic` in `curriculum_nodes` (`type in ('unit','topic','subtopic')`,
`subject_id = 'math_lit'`), plus 1–3 `skills`. The real, current set comes from the Phase 3.5
vocabulary dump — never a list in a doc (`PIPE-08`; a hardcoded 5-unit list once went
silently stale while real content used a 6th unit, `maps_and_scale`). Units include
financial mathematics, data handling, measurement, maps/plans, probability — illustrative
only, dump per session.

## Paper structure / video mapping

One video (with YouTube lesson) per exam **question group** (Q1.1, Q1.2, …); `order` is
the group's sequential position across the whole paper. YouTube ID + duration from
`files/youtube_video_data.csv` (match Video title on paper year/paper/question number).

## Image extraction quirks

- Annexures are common (maps, plans, tables) — extract separately with
  `--annexure-pages`; landscape pages need the rotation check (`PIPE-01`).
- Question groups often share pages — use `--inspect` to find cut points.

## Completed papers ledger

The `scripts/add-*.js` files committed here are the provenance record. Check dev Postgres
for what's already uploaded before starting a paper:
`psql -c "SELECT name, sort_order FROM lessons WHERE subject_id='math_lit' AND paper_id='<paper>' AND year_id='<year>' ORDER BY sort_order"`.

**Papers in the database with no upload scripts in this repo.** DBE 2015 Nov P1 and P2 (`subject_id = 'math_lit'`, `year_id = '2015'`) exist on dev but have **no `scripts/add-*.js`**
and no earlier ledger entry — provenance scripts are missing (they were created before the scripts were committed, or outside this repo). What the dev database shows (2026-10-06): lessons created
2026-08-22 18:47 UTC, questions 2026-08-22 19:07 UTC — **P1: 12 lessons ("Question 1.1" … "Question 5.3"), 35 questions** (20 `fitb` + 3 `fraction` on `standard_math`, 12 `multiple_choice`),
**P2: 15 lessons, 37 questions**; all published on dev; the exam derives the 2.0.0 floor (no gate). P2 is already in prod. Push tooling reads the dev rows, so it does not need scripts, but a content change to
these papers would have to be a fix script against the rows (`KEYBOARD-06` style), not a re-upload.
