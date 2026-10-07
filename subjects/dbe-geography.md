---
id: AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, geography, dbe, profile]
---

# Subject Profile — DBE Geography

First paper authored against this profile: `nov_p2` 2025 (`files/Geography P2 Nov 2025
Eng.pdf` + `... MG Eng.pdf`). `nov_p1` 2025 (`files/Geography P1 Nov 2025 Eng.pdf` + `...
MG Eng.pdf`) was **read and analysed against the CAPS document on 2026-10-07 but not yet
authored** — the P1 findings below (marked *P1*) are from paper/memo/CAPS analysis only, not
from an upload session, so treat anything P1-specific as unverified until a P1 lesson ships.
The two papers agree on the overall shape (see *Paper structure*), which confirms that
shape is DBE Geography's, not P2's quirk.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"geography"` |
| Postgres tables | `lessons`, `questions` — `subject_id = "geography"` (`geography_maps` exists but is legacy — maps are not available, see Subject rules) |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'geography'` — flat slug IDs, empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject geography --out temp/curriculum-vocab.json` (Auth Proxy running) |
| Not authored | display names/colours — resolved from the reference tables by JOIN |
| Papers | `nov_p2` authored (Rural/Urban Settlements + Economic Geography + Geographical Skills). `nov_p1` confirmed to exist and analysed 2026-10-07 (Climate and Weather + Geomorphology + Geographical Skills; 150 marks, 3 h) — not yet authored. `june_p1`/`june_p2` presumed once a June paper is sourced |
| **Source files** | P2: `files/Geography P2 Nov 2025 Eng.pdf` + `... MG Eng.pdf`. P1: `files/Geography P1 Nov 2025 Eng.pdf` + `files/Geography P1 Nov 2025 MG Eng.pdf`. Curriculum: the CAPS PDF below |
| **CAPS exam outline is out of date** | CAPS Annexure 4.7.1 describes Grade 12 Paper 1 as 225 marks (3×75, "answer any three") and Paper 2 as 75 marks of MC/map calculations. The real 2025 papers are **150 marks each, all questions compulsory**: Q1 60 + Q2 60 + Q3 30. Use CAPS for *content scope and hierarchy*, never for paper structure or mark weights — take those from the paper |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ GEOGRAPHY _ GR 10-12 _ WEB_C9A9.pdf` — required in-session before authoring, not optional. Geography is a content-based subject (`DESIGN-UNI-08`): a fresh scenario alone doesn't satisfy `DESIGN-UNI-01` for classificatory content, and the curriculum document is what supplies the relational/hierarchical structure to frame around, and the scope boundary against drifting into content the exam would never touch |
| `subjects` reference row | **Already exists** — `id: "geography"`, `name: "Geography"`, `full_name: "Geography"`, `code: "GEOGRAPHY"`, `category: "geography_lessons"`, `sort_order: 6`, `color: "#82B420"`, `icon: "map"`, created 2026-09-07 (confirmed by querying dev Postgres directly, 2026-09-10 — matches exactly what this row once proposed pre-insert; the "New row needed" framing below is what's stale, not the values). This was an owner-gated insert (same path as `english_texts` rows) done once, in the past — not a per-session step and not something this framework authors itself. |

## Allowed presentation types

`multiple_choice`, `multi_select`, `fitb`, `match`, `steps` **only** — evidenced against
nov_p2 2025; *P1* analysis finds nothing that needs a sixth type. `fraction`, `equation`, `ordering` not used: scale/ratio answers use `fitb`
with a literal `":"` token (below), not `fraction`; nothing in this paper requires
algebraic manipulation (`equation`) or step-reordering (`ordering`) — reassess if a future
paper's content calls for either. MathText does not apply (no symbolic maths markup).

*P1* item formats and how they map (proposed, not yet uploaded):

| P1 exam item | Maps to |
|---|---|
| Column A / Column B "write only Y or Z" statements (1.1, 2.1 — 8×1 each) | `multiple_choice` with the two Column B options per statement — it is a binary pick. **Caveat:** P2 Q1.1 was authored as `match` for the same exam format, so decide deliberately and record which in the ledger; either way don't copy the "Y/Z" lettering |
| A–D choice (1.2, 2.2 — 7×1 each) | `multiple_choice` |
| A–D choice over "(i) and (iii)" roman-numeral combinations (1.2.3, 1.2.5, 2.2.7) | `multiple_choice`, same as the P2 precedent (`add-geography-2025-nov-p2-q2-1.js`) — the numbered statements go in the stem, the combinations are the options. Prefer `multi_select` when the *learning* is "which of these apply" rather than the exam's lettered-combo trick |
| Options that are sketches (2.1.8 water-table profiles Y/Z) | Needs image options — **check `presentations/multiple-choice.md` for image-option support before authoring**; otherwise describe the profile in words |
| One-word answers (name/state/identify/list — 1.3.1, 1.4.1, 3.3.2) | `fitb`, with `\|` alternatives for accepted synonyms (the memo's "accept examples" / spelling-tolerance rules) |
| Gradient as a ratio (3.1.3 → `1 : 6,33`) | two `fitb` blanks around a literal `":"` token — the same pattern as scale below |
| Explain / describe / suggest (2- and 4-mark F+Q items, 8-mark paragraphs) | reframe objectively — see *Subject rules* |

Question `type` vocabulary: `definition`, `calc`, `interpretation`, `application`.
`interpretation` is Geography-specific — reading a graph/table/map feature and stating
what it shows, distinct from `calc` (numeric/formula work) and `application` (explain
cause/effect, evaluate impact).

## Subject rules (beyond core)

- **Every typed question declares `keyboard_type` — decision 2026-10-07, `KEYBOARD-04`
  (now a validator error).** Geography has no subject default (it resolves to `None`), so
  nothing is inferred and the system keyboard is never used. In practice: **typed blanks are
  numeric only → `keyboard_type: 'standard_math'`** (heights, gradients, ratio halves, scale
  values; `-` and `.` only, no `,` `:` or spaces typed — a ratio's `":"` is a literal
  *metadata* token, and a decimal-comma answer is stored with `.`). **Words are never typed**:
  name/state/identify/list items become `multiple_choice` / `multi_select`. The declarable
  free-text keyboard (`text`) is unbuilt (2.4.0, dev-only) and the `English` keyboard is
  `english_hl`-only, so neither is an option today; revisit if `text` ships. `steps` is
  available only with `scientific_math` declared (use it solely for a genuine multi-row
  derivation of bare-numeric blanks). Any existing Geography `fitb`/`steps` with no declaration
  (P2: `q1-2` and `q3-1`, 2 scripts flagged by the validator 2026-10-07) is to be retrofitted
  per `KEYBOARD-06`; check whether their answers are words.
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
  where it doesn't depend on seeing the map itself.
- **Maps are not available, so no question may depend on one (rule, 2026-10-07).** The
  topographic and orthophoto sheets are never part of this system: not as source material,
  not as images, not as a table. A practice question must be fully answerable from its own
  stem (given values, a described contour pattern or a recreated schematic) with no
  reference to a map block, grid reference, spot height "on the map", symbol "on the
  orthophoto" or feature "in block X". If a real exam sub-question only makes sense with the
  sheet (reading a height at a station, a coordinate lookup, "evidence from block A5"), keep
  its mark-weight by teaching the *technique* on invented data instead. The `aiExplanation`
  entries still follow the real exam's numbering (`AIEXP-08`) and may quote what the memo
  says about the real map, since they are the guide to the real paper. **`map_key` is null on
  every new lesson and question**; the `geography_maps` table is not extended for new papers.
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
- **Marking-guideline vocabulary (*P1* memo; P2's memo is expected to use the same).** Learn
  these before reading a memo — they carry the mark structure the explanations must reflect:
  `(n x m)` = n facts at m marks each (`(4 x 2)` = four facts, 2 marks each = 8);
  `[ANY ONE]`/`[ANY TWO]` = the memo lists more acceptable facts than needed; **`F+Q`** =
  fact plus qualification (a 2-mark point is 1 for the fact, 1 for the qualifying
  explanation — "Presence of vegetation (1)" + "…provides shade (1)"); `[CONCEPT]` = mark for
  the idea, not the wording; `[MUST MENTION …]`/`[MUST INCLUDE TEMPERATURE AND MOISTURE]` =
  an answer missing a named element can't reach full marks; `(accept examples)` = a specific
  instance of the listed category counts; *INSTRUCTIONS FOR PART MARKING* = split-mark rules.
  Action words decide format: list/name/state/identify accept one word; describe/explain/
  suggest/differentiate/define/why/how need a full sentence. When reframing an F+Q or
  `[ANY FOUR]` item objectively, test *recognising the correct fact and its qualification*, and
  distractors should be plausible-but-wrong facts from the same topic (`DESIGN-UNI-08`) —
  never a bare "which is true?" over trivially wrong options.
- **Memo quirk — stray first page (*P1*).** `Geography P1 Nov 2025 MG Eng.pdf` page 3 is a
  leftover marking table for a *different* paper (a "QUESTION 1" with South Atlantic High /
  katabatic / stream-order answers that match nothing in the 2025 P1 booklet) sitting before
  the real memo, which starts on page 4. Take answers only from the section headed
  `SECTION A: CLIMATE AND WEATHER AND GEOMORPHOLOGY`; if an answer disagrees with page 3,
  page 3 is the wrong one. Check P2's memo for the same before trusting its page 3.
- **Measured-value answers carry ranges (*P1* 3.1.3).** The memo accepts `3,7–3,9 cm` and
  `1 : 6,16 – 1 : 6,50` because students measure with a ruler. Practice questions use
  invented *given* measurements, so their answers are exact — don't import ranges, and don't
  ask a student to measure anything. DBE uses the decimal comma (`3,8`, `239,5 m`) and requires
  units in the final answer (exam instruction 10) — follow both in stems and solutions.
- **Freehand drawing in P1 (1.3.5 draw a cold-front cross-section).** Same rule as above — no
  drawing input. Reframe as `multiple_choice` over pre-drawn labelled cross-sections (one
  correct, others with the wrong cloud type / sector / direction) or `multi_select` of the
  four marked elements (correct profile, direction of movement, cloud type, sector).
- **Eight-line paragraphs (*P1* 1.5.4, 2.4.4 — 8 marks, any four 2-mark facts).** The 8-mark
  slot is the biggest single mark-weight in Section A. Don't collapse it to one 1-mark MC:
  `multi_select` (choose the four correct facts) keeps the weight and the reasoning. For
  oxbow formation, which is a sequence, `ordering` would fit but is not in this subject's
  allowed set — add it deliberately (reassess per *Allowed presentation types*) or stay with
  `multi_select`.
- Tags: geography concepts or curriculum topics only — never scenario wrappers
  (✗ `dube_trade_port`, `richards_bay`; ✓ `industrial_development_zone`,
  `informal_sector`) (`PIPE-06`).

## Curriculum hierarchy

`unit` → `topic` → `subtopic` in `curriculum_nodes` (`type in ('unit','topic','subtopic')`,
`subject_id = 'geography'`), plus 1–3 `skills`. Empty before the first session — the real,
current set comes from the Phase 3.5 vocabulary dump, never a list in a doc (`PIPE-08`).
Illustrative units from nov_p2 2025 only: `rural_urban_settlement`, `economic_geography`,
`geographical_skills` (with `map_work`/`gis` as likely topics) — dump per session.

*P1* adds two units — **`climate_weather`** and **`geomorphology`** — and **reuses
`geographical_skills`** (P1 Q3 and P2 Q3 are the same CAPS strand applied to different
topics; one unit, don't fork a `geographical_skills_p1`). CAPS Grade 12 topic list for the
two new units, to hang topics/subtopics from (names are CAPS's, slugs are flat per the
vocabulary dump):

| Unit | CAPS topics → subtopics worth a node |
|---|---|
| `climate_weather` | Mid-latitude cyclones (stages, fronts and their weather, formation conditions); Tropical cyclones (formation factors, stages, quadrants, impact, management); Subtropical anticyclones (pressure cells, ridging, moisture front, line thunderstorms, coastal lows, berg winds); Valley climates (slope aspect, anabatic/katabatic winds, inversion, frost, radiation fog); Urban climates (heat island, pollution dome) |
| `geomorphology` | Drainage systems (basin vocabulary, river types, drainage patterns/density, discharge); Fluvial processes (long/cross profiles, grading, base levels, landforms, rejuvenation, river capture); Catchment and river management |
| `geographical_skills` | Mapwork (synoptic charts/satellite images, topographic maps: gradient, intervisibility, height difference, cross-section, magnetic declination, grid reference), Orthophoto maps, GIS |

**Scope guard.** Urban climates is a Grade 12 CAPS topic that did **not** appear in the
2025 P1 booklet. A topic being absent from one paper doesn't take it out of scope or put
it in — CAPS defines scope, the paper defines emphasis. Don't author unseen-topic lessons
speculatively, and don't treat the real paper's choice as exhaustive.

## `geography_maps` reference table — legacy, do not extend

`geography_maps` exists in dev (`V75`/`V76`) with two rows for the P2 2025 eMalahleni sheets
(`emalahleni_topo_2529cc_2025`, `emalahleni_ortho_2529cc15_2025`); the three P2 Q3 lessons
carry the topo key as lesson-level provenance, set before the rule above was written.
Leave those as they are. **Do not add rows for further papers** (P1 2025's Stellenbosch
sheets 3318DD / 3318DD18 were deliberately not added) and do not set `map_key` on new
content: no sheet exists in the system, so there is nothing for the key to point at in
the app and no question may depend on one.

## Paper structure — shared shape (*P1* and P2)

Both papers: 150 marks, 3 h, all questions compulsory, **Section A = Q1 (60) + Q2 (60),
Section B = Q3 Geographical Skills and Techniques (30)**. Each Section A question has the
same five-subsection skeleton:

| Sub | Marks | Format |
|---|---|---|
| x.1 | 8 | eight 1-mark objective items (P1: Column A/B Y/Z in both Q1.1 and Q2.1; P2: A–D in 1.2/2.1, Column A/B in 1.1 and 2.2 — the 8+7 pair swaps order, so read each paper) |
| x.2 | 7 | seven 1-mark items in the other objective format, often on a shared photo/graph |
| x.3, x.4, x.5 | 15 each | stimulus + a ladder of 1-, 2-, 4-mark items, one of x.3–x.5 ending in an 8-mark paragraph or a 6-mark "suggest strategies" |

In both papers the 15-mark subsections carry a **sustainability/management
strategies** item ("suggest strategies the municipality can…", "sustainable strategies to
reduce veld fire impact") — these are the open-ended, memo-lists-12-accept-any-3 items.
Their answer space is a *large fixed list*, so an objective reframe should be a
`multi_select` over genuine strategies vs. plausible non-strategies, not a recall of the
memo's exact phrasing.

## Paper structure / video mapping — *P1* (`nov_p1`, 13 groups, one video per subsection)

Same grain as P2 below. `order` runs 1–13 across the paper. CAPS topic is the curriculum
anchor each lesson should pull its node from.

| Group | Video | Marks | CAPS topic | `map_key` |
|---|---|---|---|---|
| 1.1 | Synoptic charts: pressure cells, ridging, fronts | 8 | Subtropical anticyclones | null |
| 1.2 | Valley climates: slope aspect, valley winds, frost | 7 | Valley climates | null |
| 1.3 | Mid-latitude cyclone | 15 | Mid-latitude cyclones | null |
| 1.4 | Tropical Cyclone Dikeledi | 15 | Tropical cyclones | null |
| 1.5 | Berg winds and veld fires | 15 | Subtropical anticyclones | null |
| 2.1 | Drainage basin | 8 | Drainage systems | null |
| 2.2 | River capture | 7 | Fluvial processes | null |
| 2.3 | Longitudinal and cross profiles | 15 | Fluvial processes | null |
| 2.4 | Meanders, oxbow lakes, rejuvenation | 15 | Fluvial processes | null |
| 2.5 | Catchment and river management | 15 | Catchment and river management | null |
| 3.1 | Map skills and calculations | 10 | Topographic maps | null (no maps in the system) |
| 3.2 | Map interpretation | 12 | Mapwork / orthophoto | null |
| 3.3 | GIS | 8 | GIS | null |

Marks sum to 150 (60 + 60 + 30). Q3 content, by technique, to reteach generically with
invented values (no sheet): height difference between two trig stations / spot heights;
gradient as `VI : HE` (ratio via the `":"` fitb pattern) and matching a gradient to a
profile sketch; intervisibility with an obstruction; climate/microclimate evidence on
a map (windbreak rows → prevailing wind, perennial vs non-perennial rivers → seasonality,
vegetation cooling → heat island); watershed and river-course evidence; GIS spatial vs
attribute data, line/point/polygon vector features, scale manipulation, resolution and
pixel size. Several 3.2 items ("evidence from block A5", "row of trees J in block E3", "K in block D1 or L in block C2") are meaningless without the
sheet — convert them to a **self-contained schematic** (a small recreated figure) per the
*Simple schematic figures* rule, not to a question about a block nobody can see.

## Paper structure / video mapping — P2

One video per exam **numbered subsection** (1.1, 1.2, 1.3, …) — same granularity as Math
Lit/Maths's "one video per question group." This is `DESIGN-UNI-10` (`core/
authoring-principles.md`) rule 2 taken to its finest natural grain: every Geography
subsection here is independently themed, so the cluster boundary and the subsection
boundary coincide (contrast Physics, where several subsections share one knowledge-area
cluster). `order` is the subsection's sequential position across the whole paper.
nov_p2 2025 = 13 groups (the table below is at *question* level; the 13 videos are the
numbered subsections 1.1–1.5, 2.1–2.5, 3.1–3.3 — same count as P1):

| Group | Video | Marks | `map_key` |
|---|---|---|---|
| 1.1–1.5 | Q1 Rural and Urban Settlements | 60 | null |
| 2.1–2.5 | Q2 Economic Geography of South Africa | 60 | null |
| 3.1–3.3 | Q3 Geographical Skills and Techniques | 30 | set (eMalahleni topo; legacy — new lessons leave it null) |

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
- *P1* extras: photographs (valley winds, meanders, informal settlement on a river bank) are
  cropped, never recreated. Synoptic charts, satellite images and the infographic (1.4: fact
  file + location map + two satellite images) are one composite visual per lesson — extract
  once, label parts A–D as the paper does. The Stellenbosch map sheets and the Danie Craven
  stadium image pair (3.3.5, an actual image-resolution comparison) can't be re-created from
  anything in the booklet; for 3.3 rebuild a pixel-grid comparison as a fresh schematic.
- Recreated schematic diagrams (per Subject rules above) are new assets, not extracted
  from the PDF — produced separately, then uploaded the same way as any other image.

## Completed papers ledger

The `scripts/add-*.js` files committed here are the provenance record. Check dev Postgres
for what's already uploaded before starting a paper:
`psql -c "SELECT name, sort_order FROM lessons WHERE subject_id='geography' AND paper_id='<paper>' AND year_id='<year>' ORDER BY sort_order"`.

### `nov_p2` 2025 — authored 2026-09 (dev)

13 lessons (`scripts/add-geography-2025-nov-p2-*.js`). Its three Q3 lessons carry the
eMalahleni `map_key`, set before the "no maps" rule existed; leave as is. Three `fitb` rows
(`q1-2`, `q3-1`) declare no `keyboard_type` and now fail `KEYBOARD-04` if re-run (retrofit
needed; check whether their answers are words). Phase 5 has not been run on this paper.

### `nov_p1` 2025 — authored and reviewed 2026-10-07 (dev only)

- **Scope:** 13 lessons, 59 practice questions, one script per subsection
  (`scripts/add-geography-2025-nov-p1-q<N>-<M>.js`): Q1 climate and weather (1.1–1.5),
  Q2 geomorphology (2.1–2.5), Q3 skills (3.1–3.3). 82 `aiExplanation` entries, one per real
  exam sub-question with real memo marks (`AIEXP-08`). Presentation mix: 23 `multiple_choice`,
  11 `multi_select`, 10 `match` in Section A; Section B adds 2 numeric `fitb`.
- **Curriculum rows created this session:** units `climate_weather`, `geomorphology`; topics,
  subtopics, skills and tags listed in the scripts. Q3 reuses the existing
  `geographical_skills` unit, its `map_skills_and_calculations`, `map_interpretation` and
  `gis` topics, and the `map_skills`/`map_interpretation`/`gis` tags.
- **No maps (rule written during this paper):** no Q3 question depends on a map sheet, and
  `map_key` is null on all 13 lessons. The Stellenbosch sheets (3318DD, 3318DD18) were
  deliberately not added to `geography_maps`. Section B teaches technique on invented,
  fully stated data; the real exam pages stay as the worked example.
- **Keyboards:** words are never typed. The only typed blanks are 3.1 Q1 (`276.5`) and 3.1 Q2
  (`1`, `6.22` around a literal `":"`), both `keyboard_type: 'standard_math'`. Derived minimum
  app version is the 2.0.0 floor, so no exam gate is needed.
- **Reframes used:** the Y/Z Column A/B items became `multiple_choice`/`match`; the freehand
  cold-front cross-section (1.3.5) became a "which description is drawn correctly"
  `multiple_choice`; the two 8-mark paragraphs (1.5.4, 2.4.4) became `multi_select` over
  the correct facts. No new schematic images were generated for this paper.
- **Image extraction:** cut points for shared pages (P1 pp. 7–8; memo pp. 4–12) were taken
  from heading positions with PyMuPDF word coordinates, not by eye; every crop was checked.
  Memo page 3 is a stray page from another paper and was not used.
- **Phase 5 (2026-10-07):** all 59 questions captured and reviewed, no render defects, no
  auto-fixes. Both typed questions answered correctly through the real number pad. The
  harness `review-capture-answers.js` handles single-blank `fitb` only, so 3.1 Q2 (two
  blanks) was driven by a one-off script.
- **Not done:** no prod push (`push-paper-to-prod.js`), no video (`has_video: false`), and
  `june_p1` is not sourced.
