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
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ GEOGRAPHY _ GR 10-12 _ WEB_C9A9.pdf` — required in-session before authoring, not optional. Geography is a content-based subject (`DESIGN-UNI-08`): a fresh scenario alone doesn't satisfy `DESIGN-UNI-01` for classificatory content, and the curriculum document is what supplies the relational/hierarchical structure to frame around, and the scope boundary against drifting into content the exam would never touch |
| `subjects` reference row | **Already exists** — `id: "geography"`, `name: "Geography"`, `full_name: "Geography"`, `code: "GEOGRAPHY"`, `category: "geography_lessons"`, `sort_order: 6`, `color: "#82B420"`, `icon: "map"`, created 2026-09-07 (confirmed by querying dev Postgres directly, 2026-09-10 — matches exactly what this row once proposed pre-insert; the "New row needed" framing below is what's stale, not the values). This was an owner-gated insert (same path as `english_texts` rows) done once, in the past — not a per-session step and not something this framework authors itself. |

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

- **Relational framing over isolated recall (`DESIGN-UNI-08`), grounded in the curriculum
  document (`DESIGN-UNI-09`).** Geography's classificatory content (settlement hierarchy,
  siting, pattern, land-use zones, …) has a small fixed answer space — rewording a
  "define/classify X" question doesn't create new work, so a student who memorizes our
  version trivially answers the exam's differently-worded version too. Prefer testing the
  *relationship* between related classifications (progression/hierarchy, cause/consequence)
  over isolated definition matching. Worked example already in `DESIGN-UNI-08`'s doc —
  the CAPS-grounded settlement-hierarchy progression (isolated dwelling → hamlet → village
  → town) used to rework `nov_p2` Q1.1's practice questions, 2026-09-07.
- **Scale/ratio answers split into two `fitb` blanks around a literal `":"` token** —
  never `fraction` (a stacked fraction bar misrepresents a ratio's real notation).
  Same pattern as `SCHEMA-TYPE-04`'s `HH:MM` split:
  ```js
  metadata: ["[ ]", " : ", "[ ]"],
  answer: ["1", "50000", "", "", ""],
  ```
- **Section A vs Section B need different treatment — corrected 2026-09-07, superseding
  the original plan below.** Section A (Q1 Rural/Urban Settlements, Q2 Economic
  Geography): fresh extracts/graphs/tables/infographics on the same theme, standard
  `DESIGN-UNI-01` practice — numbers, names, and datasets from the real paper never
  reappear. Section B (Q3 Geographical Skills — map calculations, map interpretation,
  GIS) was originally planned to show the real topo/orthophoto map pair as the worked
  example, same map with fresh grid blocks per question. **That assumed the physical map
  sheets would be available as source material — they aren't.** DBE hands the 1:50 000
  topo map and 1:10 000 orthophoto map out as separate physical sheets in the real exam;
  they were never part of the question booklet PDF, and no other source for them exists
  this session. Resolution (matching English HL Paper 3's existing pattern — essay
  *theory* taught objectively, without asking students to write an actual essay): Q3's
  practice questions teach the underlying map-skill **technique** generically (scale
  conversion, area-from-measurement calculation, magnetic declination arithmetic,
  topographic feature recognition, GIS data layering/vector-raster/buffering) with fresh
  invented values, not tied to any specific real map. The real exam page (formulas,
  instructions, GIS sketch) is still shown as the worked example per `DESIGN-UNI-01`
  where it doesn't depend on seeing the map itself. `map_key` is still set at the
  **lesson** level (provenance — which real map the worked example refers to) even
  though no individual practice question needs one anymore.
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
Lit/Maths's "one video per question group." This is `DESIGN-UNI-10` (`core/
authoring-principles.md`) rule 2 taken to its finest natural grain: every Geography
subsection here is independently themed, so the cluster boundary and the subsection
boundary coincide (contrast Physics, where several subsections share one knowledge-area
cluster). `order` is the subsection's sequential position across the whole paper.
nov_p2 2025 = 13 groups:

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
- Section B: **no map sheet available** (see Subject rules above) — question images come
  from the question booklet's own pages (instructions, formulas, the GIS sketch), same
  extraction mechanics as Section A. Pages 17-20 pack tightly (3.1/3.2 share page 18,
  3.2 spans into page 19) — used `--inspect` to find exact pt cut points rather than
  guess; guessing would have been wrong (3.1 and 3.2 do not split cleanly at a page
  boundary).
- Recreated schematic diagrams (per Subject rules above) are new assets, not extracted
  from the PDF — produced separately, then uploaded the same way as any other image.

## Completed papers ledger

The `scripts/add-*.js` files committed here are the provenance record. Check dev Postgres
for what's already uploaded before starting a paper:
`psql -c "SELECT name, sort_order FROM lessons WHERE subject_id='geography' AND paper_id='<paper>' AND year_id='<year>' ORDER BY sort_order"`.
