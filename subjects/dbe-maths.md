---
id: AMPM-CONTENT-SUBJ-DBE-MATHS
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-PIPELINE]
tags: [subject, maths, dbe, profile]
---

# Subject Profile — DBE Mathematics (Pure Maths)

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"maths"` |
| Postgres tables | `lessons`, `questions` — `subject_id = "maths"` |
| Curriculum sources | **no `curriculum_nodes` rows for `maths` yet** — validator runs **without** `--curriculum`, but the upload script's FK preflight still rejects any `unit`/`topic`/`subtopic` slug (see the Known limitation in `workflows/generate/upload-maths.md`). `skills` rows for `maths` exist |
| Not authored | display names/colours — resolved from the reference tables by JOIN |
| Papers | `nov_p1`, `nov_p2`, `june_p1`, `june_p2` |

## Allowed presentation types

All eight. Question `type` vocabulary: `definition`, `calc`, `application`,
`conversion`, `fraction`, `proof`.

## Subject rules (beyond core)

- MathText markup applies throughout question strings and metadata options
  (`AMPM-CONTENT-MATHTEXT`).
- Graph questions decomposed (`DESIGN-MATH-02`); trig constrained to an interval
  (`DESIGN-MATH-03`); geometry proofs decomposed (`DESIGN-MATH-04`); expression answers
  prefer MCQ (`DESIGN-MATH-05`); Paper 2 per-topic variety (`DESIGN-MATH-06`).
- Per-question `clues` field required (free-tier hint; `AIEXP-03` format —
  1–3 `"- "` bullets, method only, null only if no meaningful hint exists).
- 2–4 practice questions per question group.

## Formula sheet (every paper)

The information sheet is the last page of every DBE Maths paper. Extract **once per
paper**, upload once, and reuse the same Storage URL(s) in every video's
`supplementary_materials` as `{ type: "formula_sheet", label: "Formula Sheet",
image_urls: [...] }`.

## Per-question supplementary material

When a practice question needs a figure (geometry configurations, stats graphs, 3D
trig), generate it at upload time and attach as
`supplementary_material: { type: "graph"|"table"|"diagram"|"shape", label, image_urls }`.

**Decision test:** could a student attempt the question without the figure? No →
include. Yes but it helps → include. Adds nothing → omit. P1 algebra / calculus /
finance / probability are always self-contained — never include.

Generation: matplotlib for stats graphs (`tools/` script template in the upload doc),
SVG→PNG for labeled geometric shapes. Storage path:
`question_supplementary/{subject}/{year}/{paper}/q{order}/{type}_{index}.png`.

## Curriculum units (reference until a curriculum collection exists)

**Paper 1:** `algebra_equations`, `number_patterns`, `functions_graphs`, `finance`,
`calculus`, `probability`.
**Paper 2:** `statistics`, `analytical_geometry`, `trigonometry`, `euclidean_geometry`.
(Topic examples in the AMPM-era upload doc remain illustrative; when a Maths curriculum
collection is created, `PIPE-08` reuse-before-creating applies and this section shrinks
to a pointer.)

## Completed papers ledger

| Paper | Videos | Questions | Date |
|---|---|---|---|
| DBE 2019 Nov P1 | 15 | 51 | 2026-04-23 (re-uploaded with clues, variety, markup) |
| DBE 2019 Nov P2 | 15 | 49 | 2026-04-24 (re-uploaded with clues, variety, markup) |

Formula sheet URLs (reuse per paper):
- 2019 Nov P1: `https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2019/nov_p1/q0/question_1.png`
- 2019 Nov P2: `https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2019/nov_p2/q0/question_1.png`
