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
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'maths'` (built 2026-09-03 from the 2019 P1/P2 back-catalogue — `tools/backfill-maths-curriculum.js`). Author **bare** slugs; node IDs are `maths_<unit>` / `maths_<unit>__<topic>__<subtopic>` (`tools/lib/curriculum.js` — the `maths_` prefix avoids colliding with Math Lit's flat scheme). Run the vocab dump with `--curriculum` like the other subjects |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject maths --out temp/curriculum-vocab.json` (Auth Proxy running) |
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
| DBE 2025 Nov P1 | 11 (paper-only, no video) | 44 | 2026-09-03 — one lesson per exam question Q1–Q11, 4 practice questions each, dev only. **2026-10-06:** 6 lessons retrofitted for the new Maths keyboard (typed inequality / equation / exponent / coordinate / letter answers, `keyboard_type` on all 23 typed rows); exam gated at 2.4.0 on dev (`VER-09`) |
| DBE 2025 Nov P2 | 11 (paper-only, no video) | 44 | 2026-10-06 — one lesson per exam question Q1–Q11, 4 practice questions each, dev only. Practice questions are text-complete; 13 of the Q8–Q11 practice questions also carry a generated `supplementary_material` diagram (`scripts/gen-maths-2025-nov-p2-figures.py`, uploaded with `tools/upload-question-supplementary.js --order <lesson>_<question>` so figures in one lesson don't collide at `q<lesson>/diagram_1.png`). Typed `scientific_math` answers in Q1 (`y=52.3-3.7x`), Q3 (`4√5`, `(2;-3)`), Q4 (`(x-4)^2+(y+3)^2=36`), Q5 (`tan36°`, `90°≤x≤270°`, steps `-cosx`), Q6 (`sinx`), Q7 (`h(x)=sin(2x+60°)`); the exam derives 2.4.0 (same gate as P1, `VER-09`) — dev-only until 2.4.0 is tagged |

Formula sheet URLs (reuse per paper):
- 2019 Nov P1: `https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2019/nov_p1/q0/question_1.png`
- 2019 Nov P2: `https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2019/nov_p2/q0/question_1.png`
- 2025 Nov P1: `https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2025/nov_p1/q0/question_1.png`
- 2025 Nov P2: `https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2025/nov_p2/q0/question_1.png`

## Keyboard — Maths variant of `ScientificMath` (updated 2026-10-06)

The old `ScientificMath` (released) is **not complete** for a Grade 12 Maths paper: no `< >`, letters only `x y θ`, no `; [ ] ° ln e ∞ ±`, no subscripts — so Prod Maths 2019 Nov uses only numeric
`fitb`/`fraction`/MC/ordering. The **Maths variant** (2.4.0, AMPM `dev`) adds `;`, `< > ° ∠ , ! ∞ → ±`, a full a–z ABC tab with one-shot shift and `sin cos tan log`. Its inventory, what it still
lacks (**no `/` key, no space key**, no `[ ] { } |`), and which keys raise an exam to 2.2.0 vs 2.4.0 are in `core/keyboard-input.md`. Authoring rules for typed Maths answers: `DESIGN-MATH-05` and
`workflows/generate/upload-maths.md` Phase 4. **Store negative answers with ASCII `-`** (the 2025 P1 `-47` / `-22` already do). Device-verified on the 2025 Nov P1 retrofit (2026-10-06): the typed answers and the `lim_{h→0}` steps row listed in `workflows/generate/upload-maths.md` Phase 4;
not covered there: `<`/`>`, `°`, trig, `ln`/`log`, `fraction`, upper case beyond the shift check, and a pre-2.4.0 build *not* receiving the gated exam (backend-tested only).
