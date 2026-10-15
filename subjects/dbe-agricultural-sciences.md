---
id: AMPM-CONTENT-SUBJ-DBE-AGRICULTURAL-SCIENCES
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-LIFE-SCIENCES, AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES]
tags: [subject, agricultural-sciences, dbe, profile]
---

# Subject Profile — DBE Agricultural Sciences (Papers 1 and 2)

**Status (2026-10-15): `nov_p1` (2025) authored on dev and emulator-reviewed (ledger). Profiled from the Nov 2025 papers + memos, the Nov 2024 papers (structure only) and the CAPS document. P2 and 2024 not authored; nothing in prod.** **Load with this profile:** `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`) — it carries the rules for discursive items, drawn
graphs/Punnett squares, generated figures, calculations, typed answers and formatting; this file records only what is specific to Agri.
Closest existing profile: **Life Sciences** (same 150-mark A/B shell, same question-type mix, diagram-led, genetics identical in
kind to Life Sciences P2). **Paper 2 Q2–Q3 additionally borrows from Business Studies** (marketing/management selection, "give TWO"
items) and carries a numeric finance block. Read `dbe-life-sciences.md` for the mechanics this profile does not repeat (linked vs.
independent lessons, shared-diagram reuse, `DESIGN-LIFE-02` explain→selection).

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"agricultural_sciences"` — **`subjects` row created on dev 2026-10-15** (no row existed): `sort_order` 12, `color #2F9E44`, `icon leaf`, `category agricultural_sciences_lessons`, `is_active`/`is_published` true, `min_app_version` null. **Not in prod.** The app does not hard-code subjects (grep of `~/StudioProjects/AMPM` found none), so no `SubjectMapper.kt` change is expected — confirm on the first prod review. |
| Papers | `nov_p1`, `nov_p2` for 2025 and 2024 (papers + memos on disk). `june_p1`/`june_p2` presumed if June papers are sourced. |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/agricultural_sciences/caps/CAPS FET _ AGRICULTURAL SCIENCE _ WEB_1CC4.pdf`. Grade 12 content: Section 3.9–3.12 (term plans); exam structure: Section 4.4.3. **CAPS gives no per-topic percentage weighting table for Agri** (unlike Life Sciences §4.5.3) — only the paper→topic split below and the cognitive-level guide (Knowledge 40 / Comprehension & Application 40 / Analysis, evaluation & synthesis 20). |
| **Source files** | `files/agricultural_sciences/nov_2025/` and `nov_2024/` — `Agricultural Sciences P{1,2} Nov {YYYY} Eng.pdf` + `... MG Eng.pdf`. All staged in git, uncommitted at time of writing. |
| Instructions page | 150 marks, 2½ h, non-programmable calculator allowed, **"Show ALL calculations, including formulae"** (instruction 8). |

## Paper structure (identical in 2024 and 2025)

| | Paper 1 | Paper 2 |
|---|---|---|
| Content (CAPS §4.4.3) | Animal Nutrition · Animal Production, Protection and Control · Reproduction | Agricultural Management and Marketing · Production Factors · Basic Agricultural Genetics |
| Section A (Q1) | 45 marks | 45 marks |
| Section B | Q2 Animal Nutrition (35) · Q3 Animal Production, Protection and Control (35) · Q4 Animal Reproduction (35) | Q2 Agricultural Management and Marketing (35) · Q3 Production Factors (35) · Q4 Basic Agricultural Genetics (35) |

**Section A (both papers, 2025):** 1.1 ten MCQ × 2 = 20 (single-answer and (i)–(iv) "choose the CORRECT combination") · 1.2 A-only / B-only /
both / none × 5 = 10 (P2: match Column B to Column A) · 1.3 "give ONE word/term" × 5 = 10 · 1.4 "change the UNDERLINED WORD(S) to make
it TRUE" × 5 = 5. Section A mixes the three Section B topics (P1 Q1.1.1–1.1.2 digestion, 1.1.6 transport, 1.1.9–1.1.10 anatomy …).
Cluster Section A **by topic** to feed the Section B lessons, same as `DESIGN-UNI-10` / Life Sciences.

**Real sub-question shapes seen (Nov 2025):**

| Shape | Examples | App answer |
|---|---|---|
| Identify a labelled part / picture | P1 2.1.4, 2.2.1, 3.1.1, 3.3.1, 3.6.1, 4.1.1 (flow chart, glands diagram, farm pictures, life cycles, reproductive tract) | `multiple_choice` / `match` on a figure |
| "Name/State/Give ONE (TWO)" recall | P1 2.2.2, 3.5, 3.7.1–3.7.2, 3.9; P2 2.8, 3.7, 4.6.2–4.6.4 | `multiple_choice` / `multi_select` (`CLOSED-DISC-02`) |
| "Choose from the list" (≤ 8 items) | P1 3.4 (tools), 3.8 (diseases) | `match` or `multiple_choice` with the list as options |
| Calculation | P1 2.4.1 DM absorbed, 2.5.1 nutritive ratio, 2.7.1 digestible energy; P2 2.3, 3.5.3 profit/closing balance, 4.2.3 expected plants | `fitb` numeric, `standard_math` |
| Draw a graph / Punnett square | P1 4.4.1 (6), P2 2.5.1 (6), 4.2.1 (4); 2024: P1 3.x combined bar graph, P2 4.5.2 Punnett, P2 line graph | **Supplied figure + read/interpret** — `CLOSED-FIG-01`/`02`, § Agri figures |
| Read a graph/table | P1 4.3 (hormone curves); P2 3.5.1–3.5.4 | `multiple_choice` / `fitb` on a supplied figure |
| Explain/justify (2 marks) | P1 2.2.4, 3.6.3, 4.7.1, 4.8.2; P2 2.3.2, 3.5.1 | `multi_select` / `ordering` (`DESIGN-LIFE-02`) |
| Unmarked-stem essay | **none** — no essay, no rubric-marked long answer in either paper | — |

There is no typed long answer and no essay, so the Business Studies LASO rubric machinery is **not** needed.

## Keyboard — decision (owner, 2026-10-15)

**Depending on 2.4.0 is accepted.** `text` is allowed; run `apply-exam-gate.js` after upload (`VER-09`), and **do not push to prod until 2.4.0 is
tagged** and `LATEST_RELEASED` is bumped (`VER-08`). 2025 P1 + P2 are one exam for gating (so are 2024's). The typed-answer rules are
`CLOSED-KB-01` (declare `keyboard_type`; prefer selection; no case-bearing answers; no ratio colon; "change the underlined word" → `multiple_choice`).
Agri specifics:

- Typed rows that fit: single unambiguous terms only. Memo "any 1 of N" answers (`Snout/lips/teeth`, `Oesophagus/gullet`) are **not** `text`
  candidates; single-word ones (`Cellulase`, `Urea`, `Hydrocephalus`, `Pig`) are, with every memo form listed after `|`.
- Genotypes in P2 Q4 (`Dd`, `DD`, `dd`) are always selection.
- **Memo tolerance:** nutritive ratio 2.5.1 is marked `1 : 4,9 / 1 : 5` — store `4.9|5` and state the rounding. Read every calculation memo for
  such an OR (`CLOSED-CALC-01`).
- Units in the `metadata` label (`kg`, `MJ`, `MJ/kg`, `%`, `R`); rand amounts as plain digits in the answer (`79100`), `R` + thousands space in
  the stem (`CLOSED-FMT-01`).

## Allowed presentation types

- `multiple_choice`, `multi_select`, `match`, `ordering` carry nearly everything. `ordering` for feed flow (mouth → … → anus), the birth stages
  (dilation → expulsion → afterbirth), the entrepreneurial phases (P2 2.7), and the "explain the process" items.
- `fitb`: numeric (`standard_math`) for calculations and graph/table readings; `text` for a handful of one-word terms (see above).
- `steps` / `equation` / `fraction`: not used. The P1 calculations are 1–3 line, with one unknown; `fitb` on the final value is enough
  (`CLOSED-CALC-01`).

## Agri figures (the "draw it" replacement)

Owner confirmed 2026-10-15: generate our own graphs and supply them as supplementary material. The method, guards and upload path are
`CLOSED-FIG-01`/`02`. Agri-specific:

- **Which items:** P1 4.4.1 (semen volume vs. sperm concentration per ejaculate — a **dual-axis** combined bar graph), P2 2.5.1 (price vs. demand
  of sheep — dual-axis), P2 4.2.1 (Punnett square, heterozygous cross, 900 plants), and from 2024 P1 (body temperature vs. number of animals,
  combined bar graph), P2 4.5.2 (Punnett), P2 (line graph of GM vs. conventional maize yield).
- **Fresh data:** vary the species (ram/buck/boar/stallion), months, rand values, volumes, seed trait and cross; never reuse the exam's table.
- Also usable as supplied figures: the P1 4.3 hormone-level curves (oestrogen/progesterone across the oestrus cycle) and the feed-flow charts.
  These are *read/interpret* items already — generate a fresh curve rather than cropping the exam's.

## Subject rules (beyond core)

- **Calculations follow `CLOSED-CALC-01`.** Formulae the AI explanation must reproduce exactly (Agri's own): DM absorbed = DM intake − DM excreted (DM excreted = (100 − %moisture) × manure mass); digestibility
  coefficient; nutritive ratio = 1 : (%TDN − %DP) / %DP; DE = GE − faecal energy; Pearson square for ration mixing (P1 1.1.3 shows it as a figure);
  profit = income − expenditure; closing balance = opening + profit. *Worked check:* 2.4.1 → 12,5 − 2,1 = **10,4 kg**; 2.5.1 → 74/15 = **4,9** (memo also accepts 5); 2.7.1 → 13,65 × 30 = **409,5 MJ**.
- **Content-based subject (`DESIGN-UNI-08`/`09`).** Nearly all non-numeric content is classificatory (diseases and their vectors, handling tools,
  breeds, marketing channels, inheritance patterns). Frame relationally (symptom → disease → vector; need → tool) per question, with a CAPS
  consultation for each; do not copy the memo's list wording as the stem.
- **Photograph questions (P1 Q3, P2 3.4, 4.4, 4.5)** ("PICTURE A/B/C/D") depend on cropped exam photos. Crop with `extract-exam-pages.py`, inspect
  every crop (`PIPE-01`); if a photo is unusable, reframe the question from a text description rather than dropping the topic — but a description
  must not name the answer (`feedback-clues-never-leak-answer`).
- **Linked sub-questions** (`CLOSED-DISC-04`, `DESIGN-UNI-13`): P1 4.3.x all read one graph; P2 4.1.x one genetic diagram; P2 3.5.x one financial
  table; "give a reason for the answer to X" pairs 2.1.1→2.1.2, 4.1.1→4.1.2, 4.5.1(a)→4.5.2. Section A 1.4 ("change the underlined word") →
  `multiple_choice` (`CLOSED-KB-01` rule 5).
- **MC index-0 cap** applies at paper level (`DESIGN-UNI-06`, ~10%). A/B/both/none (1.2) uses a fixed four-option order, so it will skew index
  placement — count it in the tally.

## Curriculum units (Grade 12, CAPS §3.3 / §3.9–3.12)

### Paper 1
| CAPS topic | Paper content | Real Nov 2025 questions |
|---|---|---|
| Animal nutrition (Term 1) | alimentary canals (ruminant/non-ruminant), digestion, accessory glands, feed components and minerals, digestibility, nutritive ratio, energy flow, feed types | Q1.1.1–1.1.4, 1.2.1–1.2.2, 1.3.1, 1.4.1–1.4.2; Q2 (all 35) |
| Animal production, protection and control | production systems, shelter/housing, behaviour and handling, parasites, diseases, poisonous plants, state's role, medication | Q1.1.5–1.1.8, 1.2.3–1.2.4, 1.3.2; Q3 (all 35) |
| Animal reproduction | reproductive organs, gametogenesis, oestrus cycle, AI, multiple births, cloning, pregnancy and parturition | Q1.1.9–1.1.10, 1.2.5, 1.3.3–1.3.5, 1.4.3–1.4.5; Q4 (all 35) |

### Paper 2
| CAPS topic | Paper content | Real Nov 2025 questions |
|---|---|---|
| Agricultural management and marketing | supply and demand, marketing functions/channels/systems, price determination and fixing, entrepreneurship, business plan | Q1.1.1–1.1.4 (approx.), Q2 (all 35) |
| Production factors | land, labour, capital, management, contracts, financial records, risk and forces | Q3 (all 35) |
| Basic agricultural genetics | Mendel's laws, patterns of inheritance, variation, selection and breeding systems, genetic modification | Q1.3.x–1.4.3, Q4 (all 35) |

*The Section A → topic mapping above is approximate — confirm item by item when authoring (`DESIGN-UNI-10`).* Vocabulary
(`curriculum_nodes`, `skills`, tags): none exists yet. Run `tools/dump-curriculum-vocabulary.js` first, reuse before creating (`PIPE-08`),
and expect to create the unit/topic/subtopic tree for both papers.

## App-side status

- **`SubjectMapper.kt`** — probably no change (fallback derives the id); **verify**, as for Life Sciences.
- **`KeyboardResolver.kt`** — no `agricultural_sciences` route; on 2.4.0 resolution is total (declared type → subject → fallback), so every typed row
  must declare `keyboard_type`. Re-read the source at authoring time; the app wins if this drifts.
- **Subject row** — query dev for `is_active`, `is_published`, `min_app_version` before authoring (Life Sciences' `is_active=false` hid it from onboarding).
- **No blocker for the question shapes.** The only genuinely unavailable interactions are *drawing* (graph/Punnett) and typing *genotypes*;
  both are handled by `CLOSED-FIG-01` and `CLOSED-KB-01`.
- Carried-over app bug (Life Sciences ledger): the floating "view diagram" button overlaps the last option's wrapped text on questions with
  `supplementary_material`. This subject is figure-heavy; keep final options short and retest after any app fix.

## Authoring plan

1. Verify identity (subject id, `subjects` row, vocabulary dump).
2. **P2 first** (P2 Q4 genetics reuses a Life Sciences pattern already proven; Q2/Q3 are selection and numeric), **then P1** (more figures/photos).
   Alternatively P1 first if prelims timing favours animal content — owner's call.
3. Extract images for the Nov 2025 papers (`extract-exam-pages.py`), inspect, upload; generate the graph/Punnett figures (`CLOSED-FIG-01`/`02`).
4. Lessons mirror the Section B questions (3 per paper) plus Section A clusters by topic: roughly 12–16 lessons per paper (Life Sciences P1: 16).
5. `validate-questions.js` per script; `derive-exam-min.js`; `apply-exam-gate.js` (dry-run first); `review-paper.md` emulator run; prod push only after 2.4.0.
6. 2024 papers afterwards, then older papers re-done to the current rules (`DESIGN-UNI-15/16` answer-cue rules apply: no answer in the stem, stem and figure).

## Completed papers ledger

**`nov_p1` (2025) — authored on dev and emulator-reviewed, 2026-10-15.** 18 lessons, 75 practice questions, 150/150 marks, scripts
`scripts/add-agricultural-sciences-2025-nov-p1-l01…l18.js`, one commit per lesson. Section A clustered by topic (L1–5: 4+4+4+4+4, 16+ marks each
cluster), then Q2 (L6–9), Q3 (L10–13), Q4 (L14–18). 18 image sets under `exam_papers/dbe/agricultural_sciences/2025/nov_p1/q{lesson}/`; 3 generated
figures under `question_supplementary/…/q2|q15|q16/` (Pearson square, hormone curves, combined bar graph; palette validated with `validate_palette.js`).
Vocabulary created on dev only (3 units, 28 topics, 7 `agri_*` subtopics, 8 skills, 52 tags); not mirrored to prod yet.
- **Mix:** 30 `multiple_choice`, 17 `multi_select`, 12 `match`, 10 `fitb`, 6 `ordering`. MC index-0: 0/30 after a rebalance (the first pass had 4/30).
- **Keyboards:** 7 `standard_math` + 3 `text` (`rumination`, `corpus luteum`, `external|ecto`). The 2025 exam is gated **2.4.0 on dev** (`exam_versions`).
- **Decomposed:** both drawn-graph items (4.4.1 → graph type, criteria, reading, calculation on a supplied figure), every "give TWO"/explain item
  (`multi_select`/`ordering`/`match`), Section A 1.4 "change the underlined word" (`multiple_choice`/`text`).
- **Emulator review (Phases 1–5):** all 75 captured and read. One defect fixed: L16 Q1 `(billion/mℓ)` rendered as a stacked fraction → unit removed from the
  stem. Phase 5: 10/10 typed answers PASS through the real keyboards (digits via `maths_key_*`, letters via `text_key_*`, both `|` alternatives for the
  parasite question). `audit-answer-cues.js`: no findings.
- **Open:** floating "view diagram" button overlaps the last option on figure questions (known app bug, L2 Q1, L15, L16). Anything above 80% of the marks of
  a real sub-question that is only *partly* covered by practice (e.g. P1 4.4.1's six drawing marks) is taught through the decomposed items, not reproduced.
  **Not in prod** — push waits for 2.4.0 (`VER-08`); 2025 P2 is not authored, and the exam gate is per exam.
