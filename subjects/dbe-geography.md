---
id: AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, geography, dbe, profile]
---

# Subject Profile — DBE Geography

First paper authored against this profile: `nov_p2` 2025 (`files/Geography P2 Nov 2025
Eng.pdf` + `... MG Eng.pdf`). Everything below is evidenced against that paper; treat
anything paper-structure-specific as illustrative until a second paper confirms it holds.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"geography"` |
| Postgres tables | `lessons`, `questions` — `subject_id = "geography"` — plus `geography_maps` (new, see below) |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'geography'` — flat slug IDs, empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject geography --out temp/curriculum-vocab.json` (Auth Proxy running) |
| Not authored | display names/colours — resolved from the reference tables by JOIN |
| Papers | `nov_p2` confirmed (Rural/Urban Settlements + Economic Geography + Geographical Skills). `nov_p1` presumed to exist (DBE Geography's other paper is Climate/Weather + Geomorphology) but not yet authored against this profile — don't assume its structure matches P2 |
| **New `subjects` reference row needed** | `id: "geography"`, `name: "Geography"` (no P1/P2 variation to distinguish, unlike English HL's paper-named split), proposed `color: "#82B420"` (GreenLime — unused by any current subject), `icon: "map"` (free-form string, no fixed icon enum found in app code). Owner-gated insert, same as `english_texts` rows — not something this framework authors itself |

## Allowed presentation types

`multiple_choice`, `multi_select`, `fitb`, `match`, `steps` **only** — evidenced against
nov_p2 2025. `fraction`, `equation`, `ordering` not used: scale/ratio answers use `fitb`
with a literal `":"` token (below), not `fraction`; nothing in this paper requires
algebraic manipulation (`equation`) or step-reordering (`ordering`) — reassess if a future
paper's content calls for either. MathText does not apply (no symbolic maths markup).

Question `type` vocabulary: `definition`, `calc`, `interpretation`, `application`.
`interpretation` is Geography-specific — reading a graph/table/map feature and stating
what it shows, distinct from `calc` (numeric/formula work) and `application` (explain
cause/effect, evaluate impact).

## Subject rules (beyond core)

- **Scale/ratio answers split into two `fitb` blanks around a literal `":"` token** —
  never `fraction` (a stacked fraction bar misrepresents a ratio's real notation).
  Same pattern as `SCHEMA-TYPE-04`'s `HH:MM` split:
  ```js
  metadata: ["[ ]", " : ", "[ ]"],
  answer: ["1", "50000", "", "", ""],
  ```
- **Section A vs Section B follow the same `DESIGN-UNI-01` freshness rule, applied to
  different stimuli.** Section A (Q1 Rural/Urban Settlements, Q2 Economic Geography):
  fresh extracts/graphs/tables/infographics on the same theme, standard practice —
  numbers, names, and datasets from the real paper never reappear. Section B (Q3
  Geographical Skills — map calculations, map interpretation, GIS): the real
  topographical + orthophoto map pair is itself the worked example (`DESIGN-UNI-01`
  already covers this: "the exam image is the worked example; the practice questions
  are the independent exercise") — same map shown, but different grid blocks, features,
  and measured values than the real exam questions used. Resolved against
  `DESIGN-UNI-01`, 2026-09-07.
- **Simple schematic figures** (the exam's own "Examiner's own sketch" diagrams —
  settlement pattern shapes, urban land-use zone profiles, GIS data-layering sketches)
  may be recreated as new diagrams with different specific values, the way Maths
  recreates geometry figures for `steps`/`equation` questions — distinct from the
  photographic/real-world images above, which are never recreated, only re-cropped from
  the source PDF.
- **Extended-paragraph and freehand-drawing exam sub-questions have no presentation-type
  equivalent** — no free-text or free-drawing input exists in this system. Don't skip the
  mark-weight; reframe as an objective-format question testing the same underlying
  reasoning (`multiple_choice`/`multi_select`), the way English HL's Paper 3 tests essay
  *theory* objectively rather than asking students to write one.
- Tags: geography concepts or curriculum topics only — never scenario wrappers
  (✗ `dube_trade_port`, `richards_bay`; ✓ `industrial_development_zone`,
  `informal_sector`) (`PIPE-06`).

## Curriculum hierarchy

`unit` → `topic` → `subtopic` in `curriculum_nodes` (`type in ('unit','topic','subtopic')`,
`subject_id = 'geography'`), plus 1–3 `skills`. Empty before the first session — the real,
current set comes from the Phase 3.5 vocabulary dump, never a list in a doc (`PIPE-08`).
Illustrative units from nov_p2 2025 only: `rural_urban_settlement`, `economic_geography`,
`geographical_skills` (with `map_work`/`gis` as likely topics) — dump per session.

## `geography_maps` reference table (new — engineering dependency)

Section B's three subsections (3.1–3.3) all reference the *same* physical
topo+orthophoto map pair by grid block. This is the same shape of need English HL solved
with `english_texts` (`text_key` FK, reused across many lessons/questions for one
prescribed text) — not a reason to duplicate `lessons`/`questions` into a subject-specific
table. Recommend a `geography_maps` table (`id`, `name`, `map_type` `topo`/`ortho`,
`scale`, `sheet_number`, `year`) with a `map_key` FK on lessons/questions, mirroring
`text_key`: **null for Section A lessons, set for Section B lessons.**

**Live in dev as of 2026-09-07** (`V75`/`V76`, deployed): `geography_maps` has two rows,
one per physical map sheet (not one row per pair — `map_type` is singular per row, so
Section B's mixed topo/ortho questions within one lesson are disambiguated per-*question*,
not per-lesson; leave the lesson's own `map_key` null or set to whichever map the lesson's
primary stimulus is, and set each question's own `map_key` to the specific map it
references):

| `map_key` | map | scale | sheet |
|---|---|---|---|
| `emalahleni_topo_2529cc_2025` | Topographical | 1:50 000 | 2529CC |
| `emalahleni_ortho_2529cc15_2025` | Orthophoto | 1:10 000 | 2529CC15 |

No `tools/create-geography-map.js` script exists yet — these two rows were inserted
directly (one-off, matching the same owner-gated direct-insert path used for the
`subjects`/`question_types` rows). Build the script if/when a third map is needed.

## Paper structure / video mapping

One video per exam **numbered subsection** (1.1, 1.2, 1.3, …) — same granularity as Math
Lit/Maths's "one video per question group." `order` is the subsection's sequential
position across the whole paper. nov_p2 2025 = 13 groups:

| Group | Video | Marks | `map_key` |
|---|---|---|---|
| 1.1–1.5 | Q1 Rural and Urban Settlements | 60 | null |
| 2.1–2.5 | Q2 Economic Geography of South Africa | 60 | null |
| 3.1–3.3 | Q3 Geographical Skills and Techniques | 30 | set (eMalahleni topo + orthophoto) |

No YouTube video data source confirmed yet for Geography (unlike Math Lit's
`files/youtube_video_data.csv`) — check before Phase 2 whether one exists per lesson, or
whether Geography ships `has_video: false` initially like English HL often does.

## Image extraction quirks

- Section A: standard per-lesson extraction — photos, graphs, tables, infographics,
  extracts. Multiple visual elements can share one lesson's subsection (e.g. 1.4 has both
  a sketch profile and two photographs) — extract and label each distinctly.
- Section B: all three subsections crop from the **same shared map sheet** rather than
  each getting an independent source image. Extract the relevant grid-block region per
  lesson, distinct filenames per lesson (same collision-avoidance principle as `PIPE-03`),
  even though the source map is shared.
- Recreated schematic diagrams (per Subject rules above) are new assets, not extracted
  from the PDF — produced separately, then uploaded the same way as any other image.

## Completed papers ledger

The `scripts/add-*.js` files committed here are the provenance record. Check dev Postgres
for what's already uploaded before starting a paper:
`psql -c "SELECT name, sort_order FROM lessons WHERE subject_id='geography' AND paper_id='<paper>' AND year_id='<year>' ORDER BY sort_order"`.
