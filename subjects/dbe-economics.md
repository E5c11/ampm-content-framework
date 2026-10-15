---
id: AMPM-CONTENT-SUBJ-DBE-ECONOMICS
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES, AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY, AMPM-CONTENT-SUBJ-DBE-HISTORY]
tags: [subject, economics, dbe, profile]
---

# Subject Profile — DBE Economics (Papers 1 and 2)

**Status: analysed 2026-10-14; 2025 P1+P2 authored and in prod; 2024 P1 and P2 authored to dev 2026-10-15 (32 + 33 lessons, ledger below); both emulator-reviewed clean; the prod push of the 2024 exam is owed.** Drafted from the Nov 2024 and Nov 2025 papers and memos for both
papers (all four in `files/`) and the CAPS Grade 12 plan. Every table below was checked against those eight documents;
anything not yet evidenced is labelled *illustrative*.

Economics is a **content-based, discursive, stimulus-driven** subject. Its closest sibling is Business Studies (same
150-mark shell, same essay shape, same "memo accepts any correct response" marking), and it borrows Geography's
data-response handling. It differs from Business Studies in three ways that matter for authoring: it has **a stimulus
(table / graph / extract / cartoon) behind every Section B data response**, it has **real calculations**, and it asks
for **student-drawn graphs** that the app cannot take.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"economics"` — `SubjectMapper.kt`'s fallback (`displayName.lowercase().replace(" ", "_")`, checked 2026-10-14 against a worktree copy of the source; **re-check against the canonical `~/StudioProjects/AMPM` checkout before the first upload**). No app change expected |
| Postgres tables | `lessons`, `questions` — `subject_id = "economics"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'economics'` — **none yet**. Reuse before creating (`PIPE-08`), including across subjects (Business Studies / History vocabulary — see upload doc Phase 0) |
| Papers | `nov_p1`, `nov_p2` for **2024** and **2025**. Each year's two Nov papers are **one exam for gating** (`VER-01`/`VER-09`). `june_*` presumed once sourced; Economics has no supplementary exam sessions in the files |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ ECONOMICS _ GR 10-12 _ WEB_BD13.pdf` — four-group weighting table (physical p. 8), Grade 12 Annual Teaching Plan 3.2.5 / 3.2.6 (pp. 32–42), NSC examination guideline (pp. 45–46). Required in-session before authoring |
| **Source files** | `files/Economics P1 Nov {2024,2025} Eng.pdf` + `... MG Eng.pdf`; `files/Economics P2 Nov {2024,2025} Eng.pdf` + `... MG Eng.pdf`. **`files/Economics P1 Nov 2024 Eng-1.pdf` is a byte-identical duplicate** of `Economics P1 Nov 2024 Eng.pdf` — delete one before committing |
| `subjects` reference row | **Created on prod 2026-10-14** (same values as dev; created `is_active=false`, `min_app_version 2.4.0`, then set `is_active=true` once the 2025 exam was published — Economics is **live in prod**). **Created on dev 2026-10-14** (direct insert, at the owner's request to upload 2025 P1): `id economics`, `name`/`full_name` Economics, `code ECONOMICS`, `category economics_lessons`, `sort_order 11`, `color #7048E8`, `icon trending-up` (**not verified against the app's icon set — check the subject tile renders**), `is_active`/`is_published` true, `min_app_version` null, `capabilities {}`. **No prod row yet** — created with the prod push. No subject-level gate (`VER-10` does not apply) |

## The documents disagree — the papers win

`DESIGN-ECON-00` — `enforced_by: human-review`. The CAPS examination guideline (pp. 45–46) is out of date relative to the
papers actually set. Where they differ, follow the papers and memos:

| Item | CAPS guideline | Real 2024 and 2025 papers |
|---|---|---|
| Duration | 1½ hours | **2 hours** (cover page) |
| Q1.3 | "True/False / Fill in the missing word" | **"Give ONE term for each description"** — abbreviations, acronyms and examples are *not* accepted |
| Section B shape | 2.1 name 2×2, 2.2 data response 10×2, 2.3 one 16-mark item | 2.1 two items (2+2), **two** 10-mark data responses, then 2.4 (2×4) and 2.5 (4×2) |
| Section C marking | Format 5 / Body 30 / Interpretation 5 | **Intro 2 / Main 26 / Additional 10 / Conclusion 2** (the paper's own rubric box and the memo) |

## Paper structure (identical in 2024 and 2025)

**150 marks, 2 h, three sections.**

| Section | Question(s) | Choice | Marks | Shape |
|---|---|---|---|---|
| A | Q1 | compulsory | 30 | 1.1 MC (8×2 = 16), 1.2 match (8×1 = 8, options A–I), 1.3 give ONE term (6×1 = 6) |
| B | Q2, Q3, Q4 | any **TWO** | 40 each (80) | 2.1 two "name/give/how" items (2+2); **2.2 and 2.3 data responses (10 each)**; 2.4 "briefly discuss" (2×4 = 8); 2.5 "how/analyse" (4×2 = 8) |
| C | Q5, Q6 | any **ONE** | 40 | Essay: main part 26 + additional part 10 + intro 2 + conclusion 2 (maximum), headings/examples capped at 8 inside the main part |

**The data response is a fixed five-item pattern** — recognise it and the lesson plans itself:

| Item | Marks | Verb | Nature |
|---|---|---|---|
| .1 | 1 | Identify | read a value / item off the stimulus |
| .2 | 1 | Name / Give | one canonical term |
| .3 | 2 | Briefly describe the term | definition |
| .4 | 2 | Explain | one cause / effect / relationship |
| .5 | 4 (2×2) | How can… / Why… | two developed points |

(A calculation or a graph reading replaces .1/.2 or .4 in some stimuli — see below.) Marker's note common to all four
memos: "identify / name / state / list" accept **one word**; "describe / explain / discuss / how / why …" need a **full
sentence**; and almost every memo item ends **"Accept any other correct relevant response"**.

**Topic split.** CAPS weights four groups at 25% each. P1 = Macroeconomics (topics 1–6) + Economic Pursuits (9–13);
P2 = Microeconomics (7–8) + Contemporary Economic Issues (14–20). Q2 and Q3 of each paper are one group each; **Q4 mixes
both** (4.1–4.3 one group, 4.4–4.5 the other, or interleaved).

### Stimulus and essay inventory (checked 2026-10-14)

| Exam | Stimuli (Q2.2, 2.3 / 3.2, 3.3 / 4.2, 4.3) | Calculation | Drawn graph | Essays (26 + 10) |
|---|---|---|---|---|
| **2025 P1** | BoP financial-account table; Phillips curve / StatsSA bar graph (household services); trade-agreements extract / cartoon (public-sector failure); EPWP extract | 2.2.5 reserve assets (A) = 62 869 − 63 066 = **−197** → an *increase* (memo: 3 for method, 1 for answer) | none | Q5 four-sector circular-flow markets + business sector's contribution; Q6 regional development initiatives + incentives for industrial development |
| **2025 P2** | cost & revenue schedule; tax-on-production supply graph; tourism extract; cartoon (environment); cartoon (income distribution); extract (hazardous waste) | 2.2.5 marginal cost (A) = ΔTC/ΔQ = (256−196)/(10−8) = **30** | **4.4** loss-making perfectly competitive firm (8 = graph 4 + explanation 4) | Q5 monopoly (incl. long-run profit graph) + abuse of market power; Q6 measures to combat inflation + trading partners' influence on inflation |
| **2024 P1** | extract; **multiplier graph** (E = 20 + 0,5Y → 30 + 0,5Y); extract; graph; table; cartoon | 2.3.5 ΔY from the graph — **20**, four accepted methods | none | Q5 reasons for international trade + weaker rand; Q6 demand-side growth approach + small businesses |
| **2024 P2** | extract; graph; cartoon; information; **paired graphs** (4.2, short-run loss → long-run normal profit); images | — | **2.4** TC / FC / VC; **4.4** effect of a maximum price | Q5 oligopoly + competition policy; Q6 sustainable development + international measures |

Q1.3 answers seen (all single canonical terms): 2025 P1 — recession, Laffer curve, international/foreign trade, protectionism,
land restitution, demographic indicators. 2024 P1 — real flow, Phillips curve, nationalisation, direct subsidies,
labour-intensive, consumer price index. 2024 P2 — implicit cost, economies of scale, minimum wage, demand-pull inflation,
indigenous knowledge systems, renewable resources. (2025 P2 answers: read from the memo when authoring.)

**Recurring concepts across years** (strong lesson targets — not invented by the profile): Phillips curve (2024 term,
2025 graph), CPI, terms of trade, labour-intensive (2024 term, 2025 definition), implicit cost, perfect-competition loss /
normal profit (2024 4.2 and 2025 4.4), public-sector failure, tourism (every P2), environmental sustainability and
international agreements (every P2).

## Keyboard — Economics has a real (small) typed-answer pool

`DESIGN-ECON-01` — `enforced_by: validator` (declaration, `KEYBOARD-04`) + `human-review` (whether a row is worth typing).
Every typed question declares `keyboard_type`. The pool, in order of how good a fit it is:

1. **Q1.3 "give ONE term"** — the best typed candidate in any content-based subject so far. One canonical term, the memo
   prints the accepted variants (`International trade / Foreign trade`, `Pay As You Earn / PAYE / Personal income tax`),
   and the paper rules out abbreviations, which removes the usual acronym-spelling problem. Declare **`text`**, list
   every memo variant with `|`, store the full term, never an acronym. Marking is trimmed and case-insensitive
   (`core/keyboard-input.md` § Marking). Still prefer MC when the term can be paraphrased (a definition that has two valid
   names, or a term the memo accepts "in other words").
2. **Numeric answers** (a coefficient, a rand value, a percentage, a quantity) — **`standard_math`**, bare number, unit
   and `R`/`%` split into the `metadata` label (`KEYBOARD-02`). The keyboard has `-`, so a negative result (the −197 case)
   is typeable. Store `62869` for a figure the paper prints as `62 869`; a decimal answer uses `.` even though the paper
   prints `0,5` (`,` normalises to `.` at marking — but keep option text and given text in the paper's `0,5` form).
3. **A worked calculation** (`MC = ΔTC ÷ ΔQ`, `K = 1 ÷ (1 − mpc)`, `ΔY = ΔJ × K`) — **`steps`** with `scientific_math`.
   Since 2.4.0 the keyboard has every letter, `Δ`, `÷`, `×`, `(`, `)`, `=`, so the formulas are typeable (`core/keyboard-input.md`
   § `ScientificMath`). The memo awards **3 marks for the working and 1 for the final answer** — a `steps` question is the
   correct shape for that. Use bare-numeric blanks inside the derivation (`KEYBOARD-02`/`KEYBOARD-03`), and give the formula
   rows as read-only context.
4. **Everything else is not typed** — see `DESIGN-ECON-02`.

**Gate.** `text`, `scientific_math` and the extended keys derive **2.4.0**. Tooling's `LATEST_RELEASED` is 2.4.0 at the time
of writing; the owner confirmed on 2026-10-14 that the latest release is **2.5.0**, so the tooling bump (`VER-06`) is owed and
is a separate change. Either way 2.4.0 ≤ the latest release, so **no Economics row is dev-only on gate grounds**. Run
`derive-exam-min.js` / `apply-exam-gate.js` after each upload anyway (`VER-09`); expect a gate of 2.4.0 on the whole exam if
any `text` or `scientific_math` row exists, and note it hides the exam from builds below 2.4.0 on their next sync.

`Economics` has no `KeyboardResolver` route; with a declared `keyboard_type` on every typed row that is irrelevant, and the
2.4.0 fallback (`Text`, `ScientificMath` for `steps`/`equation`) is a safety net, not a plan.

## Subject rules (beyond core)

- **`DESIGN-ECON-02` — discursive items decompose into closed-form questions against the memo's listed points.**
  `enforced_by: human-review`. Sections B (2.1, .3–.5, 2.4, 2.5) and C are marked against non-exhaustive point lists with
  "Accept any other correct relevant response", exactly as in Business Studies: there is no canonical wording to type
  against. Apply `DESIGN-BUS-02` (each ticked point becomes an option), `DESIGN-BUS-04` ("name/give any N" → `multi_select`
  with a correct subset of the memo's list; distractors from the *same* family — e.g. for "leading indicators", lagging or
  coincident indicators; for "direct tax", an indirect tax) and `DESIGN-BUS-05` (near-twin distractors from the paper's own
  confusable pairs — MC vs MR, explicit vs implicit cost, demand-pull vs cost-push, tariff vs quota, absolute vs comparative
  advantage). Do not require every valid answer when the exam wants N ("mark the first TWO").
- **`DESIGN-ECON-03` — drawn graphs are never asked for; their mark scheme is tested instead.**
  `enforced_by: human-review`. The app has no drawing input. Four exam questions are graph-drawing items (2025 P2 4.4;
  2024 P2 2.4, 4.4; and the 2025 P2 Q5 essay's monopoly graph). The memo publishes the scheme (always 4 of the 8 marks:
  axes labelled, each curve drawn and labelled, the key point or area indicated), and the other 4 marks are a prose
  explanation. Teach it as: (a) a supplied **fresh** diagram plus `multiple_choice` / `multi_select` on "which label
  belongs at X", "which curve is MC", "where is the loss area"; (b) `match` curve ↔ meaning (≤ 4 pairs); (c) `ordering` of
  the explanation's reasoning (MR = MC → output → compare AR with AC → loss/profit). The explanation half is `DESIGN-ECON-02`.
  Never reuse the paper's own diagram as the practice stimulus (`DESIGN-UNI-01`) — redraw with different labels/values.
- **`DESIGN-ECON-04` — calculations use fresh numbers and test the memo's method.**
  `enforced_by: human-review`. `DESIGN-UNI-01` applies in full: no real exam figure (62 869, 63 066, 256/196, 20/30) appears
  in a practice question. Keep the *structure* the memo shows (formula → substitute → compute → interpret) and make the
  common slip a distractor: the 2025 P2 marginal-cost item is a trap because the raw difference (60) is not the answer —
  divide by ΔQ (30); the 2025 P1 item asks for a *decision* (increase or decrease) from the sign, which is a follow-up
  `multiple_choice` after the numeric `steps`/`fitb`. Where the memo accepts several methods (2024 P1 2.3.5 gives four),
  the `steps` rows must not hard-wire one — give the formula as context and blank only the arithmetic.
- **`DESIGN-ECON-05` — stimulus items are self-contained and fresh.**
  `enforced_by: human-review`. Section B's .1 items ("identify … in the graph / table / extract / cartoon above") are only
  answerable with the stimulus. Author an **entirely fresh stimulus on the same theme** (Geography Section A rule): an
  invented table with the same columns, a redrawn graph with different values, a new short extract, an original cartoon
  description. The real paper's images attach to the lesson as the exam reference only (`question_image_urls`,
  `memo_image_urls`, `supplementary_materials`, `PIPE-03` — use the paper's own labels). Stats attributed to a real source
  ("Adapted from SARB Quarterly Bulletin") must not be presented with a fabricated attribution: label invented data as
  illustrative.
- **`DESIGN-ECON-06` — essays decompose along the memo's headings; no free text.**
  `enforced_by: human-review`. Same stance as `DESIGN-BUS-03` / `DESIGN-HIST-02`. One lesson per Section C question
  (Q5, Q6), each mixing (a) content items on the essay's own memo headings (`DESIGN-ECON-02`) and (b) essay-strategy items
  grounded in **Economics's own printed rubric**, which is not LASO. Fixed, citable mechanics: Introduction max 2, "a lower-order
  response", start by defining the main concept, do **not** repeat the question, do not preview the body; Body main part max
  26 with **at most 8 marks for headings/examples**; Additional part max 10 with **at most 2 marks for mere listing**;
  Conclusion max 2 and higher-order (summary without repeating facts, a value judgement, extra support, a contradictory
  viewpoint, recommendations). Good objective shapes: `ordering` an essay plan; `multiple_choice` "which introduction earns
  the 2 marks?"; `multi_select` of conclusion ingredients; `multiple_choice` mark-budget ("how many of the 40 marks can
  headings alone earn?" → 8 of 26). The additional part is a *separate* question (10 marks, "How can / Analyse / Evaluate")
  — the essay lesson covers both. Never quote the memo's model-answer prose.
- **`DESIGN-ECON-07` — linked sub-questions.** `enforced_by: human-review`. The data-response pattern has two recurring
  dependencies: a **calculation → interpretation** pair (2024 P1 2.3.1 MPC and 2.3.4 MPS/multiplier feed 2.3.5 ΔY; 2025 P1 2.2.5
  value → increase/decrease) and **identify → describe/explain on the same term**. Apply `DESIGN-UNI-13`'s test: decompose
  freely, but never let a later item's correct option duplicate what an earlier item already stated, and keep a calculation
  and the item that interprets its sign in the same lesson.
- **`DESIGN-ECON-08` — formatting.** `R` + space-separated thousands (`R1 000`, `62 869`), decimal comma in prose and option
  text (`0,5`), negatives with a hyphen-minus (`-197`, ASCII, not U+2212 — `core/keyboard-input.md` Gotcha). Currency and
  percentage tokens never go inside a typed answer (`KEYBOARD-02`). Legislation / programmes keep the paper's form
  (`Broad-Based Black Economic Empowerment (B-BBEE)`). Acronym-heavy content (SARB, IMF, WTO, AGOA, SACU, SADC, EPWP, NSDS,
  IPAP, BoP, CPI, PPI, GDE) is fine in option text; a typed answer is always the full term (the paper forbids acronyms in 1.3).
  The isolated-slash-in-parentheses rule applies (`(A/B)` alone renders as a stacked fraction — Business Studies review).
- **Answer cues — `DESIGN-UNI-15` / `DESIGN-UNI-16` apply with force here.** Economics options are sentence-length, which is exactly where the "longest option is right" cue appears; the essay-plan `ordering` items describe content ("A definition of the main concept"), never position. Run `tools/audit-answer-cues.js` before and after review.
- **MC distribution.** Section A alone has 16 `multiple_choice` per exam; run the paper-level index-0 tally (`DESIGN-UNI-06`,
  ≤ ~10%) and the True/False cap (`DESIGN-UNI-05`) across all Economics lessons of a paper, not per lesson.
- **Clues must not leak the answer** (known recurring bug, see `feedback-clues-never-leak-answer`). Economics definitions
  ("describe the term X") tempt a clue that names the term; the validator now nudges, but check every Q1.3 and `.3` item by hand.

## Allowed presentation types

`multiple_choice`, `multi_select`, `match`, `ordering` — the Business Studies subset, expected to carry most of the marks.
`fitb` — for Q1.3 terms (`text`) and bare numerics (`standard_math`). `steps` — for the calculations
(`scientific_math`). `fraction` / `equation` — not expected (the formulas are products and quotients of named quantities;
use `steps`); revisit only if a paper evidences a stacked fraction answer. Max 4 `match` pairs per question
(`presentations/match.md`).

## Lesson granularity — `DESIGN-UNI-14` (revised 2026-10-14)

**A lesson has 3–4 practice questions (5 only to cover a missing concept; never more).** Lessons follow the exam's own subsections, not
whole real questions — Geography's model, named `"Question N.M: Description"`, with each lesson's AI explanation carrying only the real
sub-questions it covers (`AIEXP-08`). Rough shape per paper: Q1 → 3–4 lessons (the MC block clustered by topic, the match, the typed
terms); each Section B question → 3 lessons (e.g. data-response A, data-response B, the 8-mark discussion items); each essay → 2 lessons
(main part; additional part plus essay strategy). That is ~20 lessons and ~70 questions per paper. Section B/C "answer any N" remains a
`DESIGN-UNI-10` independence signal: no lesson may assume another optional question's content.

**The first authored paper (2025 Nov P1) was redone to this rule on 2026-10-14** — see the ledger.

## Curriculum units (Grade 12, CAPS Section 3.2.6 annual teaching plan)

**Decision 2026-10-14 (while authoring 2025 P1): units follow the Grade 12 *annual teaching plan* topics, not the 20-row overview table** —
the ATP is the Grade 12 content document, and the overview table's groups (macro / micro / pursuits / contemporary) cut across how the
papers actually test (e.g. P1 2025 Q4 tests the public sector, which the overview table files under Microeconomics). Slugs are global
(`economics` is not in `NAMESPACED_SUBJECTS`; one collision found and avoided: the topic slug `exchange_rates` already existed, so the
Economics topic is `currency_exchange_rates`). Created on dev:

| Unit (7) | Topics created for P1 (36) |
|---|---|
| `business_cycles` | `business_cycle_explanations`, `cycle_indicators`, `phillips_curve`, `business_cycle_policy` |
| `circular_flow` | `multiplier`, `circular_flow_markets`, `financial_markets`, `business_sector_contribution` |
| `public_sector` | `public_sector_failure`, `public_goods_and_free_riders`, `taxation_systems`, `fiscal_and_monetary_policy`, `market_efficiency_measures`, `macroeconomic_objectives`, `privatisation` |
| `foreign_exchange_and_bop` | `balance_of_payments`, `currency_exchange_rates`, `terms_of_trade`, `reasons_for_international_trade` |
| `protection_and_free_trade` | `comparative_advantage`, `tariffs_and_trade_barriers`, `export_promotion`, `trade_agreements`, `free_trade_arguments` |
| `growth_and_development` | `industrial_policy`, `redress_and_skills_policies`, `public_works_and_development_policy`, `infrastructure_and_growth`, `regional_development`, `industrial_incentives` |
| `economic_and_social_indicators` | `labour_force_and_unemployment`, `income_inequality_measures`, `international_comparisons`, `social_indicators`, `population_and_labour_force`, `economic_performance_indicators` |

P2 will need further units from the ATP (dynamics of markets — perfect, imperfect, market failure; inflation; tourism; environmental
sustainability) — create them when P2 is authored.

**Subtopics (7, skill-shaped, `econ_` prefix because subtopic ids are also global and `term_definition_recall` etc. already belong to Business
Studies):** `econ_classification`, `econ_calculation`, `econ_term_definition`, `econ_cause_and_effect`, `econ_data_interpretation`,
`econ_policy_evaluation`, `econ_essay_structure`. As with Business Studies, each hangs off one arbitrary parent topic
(`business_cycles/business_cycle_explanations`); nothing checks that a question's topic matches its subtopic's parent.
**Skills (7):** `classify_economic_concept`, `apply_economic_formula`, `define_economic_term`, `explain_economic_impact`,
`interpret_economic_data`, `evaluate_economic_policy`, `structure_economics_essay`. Four lesson tags already existed (`tariffs`,
`exchange_rates`, `vat`, `essay_structure`) and were reused.

## App-side status

- **No app change needed to author** the Business Studies subset. `economics` resolves through the mapper fallback; no
  `KeyboardResolver` entry is needed when every typed row declares a keyboard.
- **Not possible in the app, by design:** student-drawn graphs (`DESIGN-ECON-03`), free-text essays (`DESIGN-ECON-06`).
- **Images:** every stimulus is a figure. Rasters can be pulled with `pdfimages` (2025 P1: Phillips curve p. 7, cartoon p. 10;
  2025 P2: p. 9 and p. 10 figures); vector graphs need a page crop via `tools/extract-exam-pages.py`. Not yet inventoried
  for 2024 — do it in Phase 1.5 of the first lesson.

## Completed papers ledger

### 2025 Nov P1 (`nov_p1`) — authored to dev 2026-10-14, repaired to `DESIGN-UNI-14` the same day, emulator-reviewed twice, **not in prod**

**28 lessons, 85 questions (2–4 per lesson, none above 4)**, one commit per lesson (`scripts/add-economics-2025-nov-p1-l01..l28.js`). Exam gated
**2.4.0** on dev (`text` + `scientific_math`). The first authoring (6 lessons of 12–15 questions) broke the lesson-size rule and was replaced;
its dev rows, 14 test-account answers and old bucket objects were deleted.

Lessons follow the paper's subsections (`"Question N.M: Description"`):

| Real question | Lessons (order) | Questions per lesson |
|---|---|---|
| Q1 (30) | 1.1.1–1.1.4 · 1.1.5–1.1.8 · 1.2 · 1.3 (1–4) | 3 · 3 · 3 · 3 |
| Q2 (40) | 2.1 · 2.2 · 2.2.5 · 2.3 · 2.3.5+2.4 · 2.5 (5–10) | 3 · 3 · 2 · 3 · 4 · 3 |
| Q3 (40) | 3.1 · 3.2 · 3.2.4 · 3.3 · 3.4 · 3.5 (11–16) | 3 each |
| Q4 (40) | 4.1 · 4.2 · 4.2.4 · 4.3 · 4.3.4 · 4.4 (17–22) | 3 · 3 · 3 · 3 · 2 · 3 |
| Q5 essay | main part · business sector · essay structure (23–25) | 3 · 3 · 4 |
| Q6 essay | regional development · incentives · essay structure (26–28) | 4 · 3 · 3 |

- **Variety rule:** every 3-question set has ≥ 2 presentation types and every 4-question set ≥ 3, which is why some questions were converted (a typed-term set became fitb + fitb + mc; several mc-only sets gained a multi-select or match). Typed terms now: quota, Gini coefficient (`text`), plus numeric blanks (`standard_math`) and the reserve-assets `steps` (`scientific_math`).
- **MC index-0 tally: 4 of 45 = 8.9%**; no True/False.
- **Each lesson's AI explanation carries only the real sub-questions it covers** (marks add up to the real question's 30 / 40; essays are split 26 main / 10 additional / 4 intro+conclusion across their three lessons). Image crops are per subsection (exam pages and memo pages cut at the real heading positions; 72 image URLs, all HTTP 200). Two fresh figures: Phillips curve (lesson 8) and bar graph (lesson 12), labelled illustrative.
- **Review #2 (2026-10-14, app cache cleared):** all 85 questions captured, lesson counts "0 / 2–4" correct, no warnings; paper and memo images checked per lesson (lessons 2–6, 23 and 24 were wrong at first — see the cache trap below, fixed and re-checked); typed answers **11/11 attempts PASS**, including every `|` alternative (`quota`, `import quota`, `gini coefficient`, `gini-coefficient`, `gini index`).
- **The image-cache trap (cost one fix pass):** the media bucket serves objects for a year and Google's edge keeps serving the old bytes even after an object is deleted and re-uploaded. Re-cut crops uploaded under the old keys (`q1`–`q6`) kept showing the superseded whole-question pages. **Never reuse an object key for different content** — give re-cut images new file names (here `question_11.png`, `memo_11.png`, …).
- **Open flags for a subject-expert check (unchanged):** CPI and unemployment rate as the non-leading distractors in lesson 5; IPAP described as a "rolling three-year plan" (lesson 2); the "Prosperity (the peak of the upswing)" phase name (lesson 22); "managed float" (lesson 3). Cosmetic: the "PC" label on the Phillips figure sits on the curve.
- **Not yet done:** prod push (waits for P2 and an owner go-ahead), P2 2025, the 2024 papers.

*(Built from a scratchpad generator that composes the scripts from compact specs; the committed scripts are the source of truth. The 28 per-lesson commit subjects end in a stray colon because the lesson name was not substituted — harmless, not rewritten.)*

### 2025 Nov P2 (`nov_p2`) — authored to dev 2026-10-14, emulator-reviewed, **not in prod**

**32 lessons, 106 questions (3–4 each)**, one commit per lesson (`scripts/add-economics-2025-nov-p2-l01..l32.js`), `DESIGN-UNI-14`-compliant from the start. Same
2025 exam gate (2.4.0, set by the P1 rows already on dev; derived from `text` + `scientific_math`).

| Real question | Lessons (order) |
|---|---|
| Q1 (30) | 1.1.1–1.1.4 · 1.1.5–1.1.8 · 1.2 · 1.3 (1–4) |
| Q2 (40) | 2.1 · 2.2 · 2.2.5 · 2.3 · 2.3.5+2.4 · 2.5 (5–10) |
| Q3 (40) | 3.1 · 3.2.1–3 · 3.2.4–5 · 3.3.1–3 · 3.3.4–5 · 3.4 · 3.5 (11–17) |
| Q4 (40) | 4.1 · 4.2.1–3 · 4.2.4–5 · 4.3.1–3 · 4.3.4–5 · 4.4 · 4.5 (18–24) |
| Q5 essay (monopoly) | characteristics (22) · the graph (4) · preventing abuse (10) · essay structure (4) (25–28) |
| Q6 essay (inflation) | monetary (14) · fiscal and other (12) · trading partners (10) · essay structure (4) (29–32) |

- **First drawn-graph conversions (`DESIGN-ECON-03`)**: lesson 23 (4.4, loss of a perfectly competitive firm) and lesson 26 (the monopoly's long-run profit graph) never ask for a drawing. Each is a 4-question set on a fresh supplied diagram: read the profit-maximising quantity (MC), judge statements about the curves (multi-select), compute the loss/profit from the labelled values (numeric `fitb`: 450 and 1200), and order the steps of the explanation (ordering). The 4-mark drawing scheme and the 4-mark explanation sit in the real-question AI explanation.
- **Fresh stimuli (`DESIGN-ECON-05`)**: two cost-and-revenue schedules (profit maximisation at 40 units; marginal cost A = 10 — the common slip is subtracting totals), a tax-on-producers graph, a loss-making firm graph and a monopoly graph, all labelled "illustrative" and drawn with matplotlib. Real exam figures appear only as the lesson's exam-page images.
- **Marks per real question add up** (1.x → 30; each Section B question → 40; Q5 22+4+10+4 and Q6 14+12+10+4 = 40).
- **MC index-0 tally: 3 of 46 = 6.5%** (correct-answer positions 3 / 11 / 14 / 18 for A–D); no True/False. Typed: `barrier to entry`, `demerit good`, `marginal revenue` (`text`, with `|` variants), `44000`, `450`, `1200` (`standard_math`) and the marginal-cost `steps` (`scientific_math`).
- **Curriculum added (dev):** 7 units (`perfect_markets`, `imperfect_markets`, `market_failures`, `economics_inflation` — plain `inflation` was already another subject's node —, `tourism`, `environmental_sustainability`, `redress_and_inequality`), 18 topics, 34 lesson tags; the 7 `econ_*` subtopics and 7 skills are reused.
- **Review:** all 106 questions captured on a cache-cleared app with no warnings; paper and memo tabs spot-checked (lessons 7, 18, 30 memo; every paper tile via a mosaic); both new-graph lessons show the supplementary figure fully; typed answers **10/10 attempts PASS**, including every `|` alternative.
- **Content flags for a subject-expert check:** the Q1.1.1–4 "distributive inefficiency" definition (the paper names allocative, productive and market inefficiency as options, so this is outside the P2 memo — confirm it is in the textbook); "managed float" style facts were not used here. The "NERSA" acronym appears in an option; it is spelled in full alongside.
- **Not yet done:** prod push (2025 exam is now P1 + P2 on dev — ready for an owner go-ahead once the 2.5.0 release bump and the prod `subjects` row are done), the 2024 papers.

### Prod push — 2025 Nov P1 + P2, 2026-10-14 (owner-approved)

Order followed (`VER-03`): prod `subjects` row (inactive, gated 2.4.0) → `push-paper-to-prod.js` P1 with `--allow-partial-exam` (P2 was pushed immediately after; the tool refuses a lone paper of a two-paper exam by default) → P2 → prod exam gate `apply-exam-gate.js --env prod --apply` (2.4.0, 60 lessons / 191 questions bumped) → `--publish` both papers → subject `is_active=true`. Prod now holds 28 + 32 lessons, 85 + 106 questions, all published, 152 images mirrored to the prod bucket (all HTTP 200), curriculum/skills/tags copied by the tool. The prod proxy for this tool listens on 15433 (`PG_PORT_PROD`); a separate prod proxy on 5433 may already be running — they do not conflict. `LATEST_RELEASED` was 2.4.0, equal to the derived minimum, so no override or bump was needed.

### 2024 Nov P1 (`nov_p1`) — authored to dev 2026-10-15, emulator-reviewed the same day, **not in prod**

**32 lessons, 109 questions (3–4 each)**, one commit per lesson (`scripts/add-economics-2024-nov-p1-l01..l32.js`; the 17 "rebalance" commits carry a literal `${VERB:-Add}` in the subject — harmless). `DESIGN-UNI-14`-compliant. Exam gate for 2024 is 2.4.0 (`text` + `scientific_math`).

| Real question | Lessons (order) |
|---|---|
| Q1 (30) | 1.1.1–1.1.4 · 1.1.5–1.1.8 · 1.2 · 1.3 (1–4) |
| Q2 (40) | 2.1 · 2.2.1–4 · 2.2.5 · 2.3 (with the ΔY `steps`) · 2.4 · 2.5 (5–10) |
| Q3 (40) | 3.1 · 3.2.1–3 · 3.2.4–5 · 3.3.1–3 · 3.3.4–5 · 3.4 · 3.5 (11–17) |
| Q4 (40) | 4.1 · 4.2.1–3 · 4.2.4–5 · 4.3.1–3 · 4.3.4–5 · 4.4 · 4.5 (18–24) |
| Q5 essay | demand reasons (13) · supply reasons (13) · weaker rand (10) · essay structure (4) (25–28) |
| Q6 essay | monetary policy (13) · fiscal policy (13) · small businesses (10) · essay structure (4) (29–32) |

- Images cut with a PyMuPDF label-locator (question and memo cut at the real sub-question positions; 78 URLs, all HTTP 200). Two fresh figures, both labelled illustrative: the multiplier graph (E = 12 + 0,75Y → 20 + 0,75Y, lesson 8, `diagram_1.png` — an earlier `graph_1.png` with an overlapping label is orphaned in the bucket) and the labour-productivity bar graph (lesson 14). Tables, extracts and the cartoon are described in the question text (`question` may not contain a newline — validator).
- **MC index-0 tally 0 of 44**; correct-longest 0 of 44 after a rebalance pass (first authoring had 11 at index 0 and 14 longest — the generator now moves a correct index-0 option to 2/3). Typed: `privatisation|privatization` (`text`), numeric `standard_math` blanks (150, 30000, 46, 10, 0.75, -4.5, 32, 30) and the ΔY `steps` (4, 8, 32; `scientific_math`).
- Q5/Q6 essay lessons each carry **one** AI-explanation entry (`number` "5"/"6", marks 13/13/10/4) split from the 26 + 10 + 2 + 2 budget.
- New tags created on dev (economics): 27 slugs, e.g. `privatisation`, `labour_productivity`, `import_substitution`, `weaker_rand`, `demand_side_policy`. No new units/topics/subtopics.
- **Emulator review (2026-10-15, build 2.4.1-dev01, cache cleared):** all 109 questions captured with no warnings; 0 auto-fixes, 0 flags; typed answers **12/12 PASS** (every `|` alternative; the ΔY `steps` needs the keyboard's Next key — `maths_key_next` — between blanks). Cosmetic: lesson 20's exam image has white space below 4.2.5.
- **Not done:** prod push (the 2024 exam is not in prod; the prod `subjects` row already exists), 2024 P2. Content flags for a subject-expert check: CPI as a non-leading distractor (lesson 1), "Remuneration per worker" as the productivity indicator (lesson 14), the 30% land-redistribution figure (lesson 30).

### 2024 Nov P2 (`nov_p2`) — authored to dev 2026-10-15, emulator-reviewed the same day, **not in prod**

**33 lessons, 114 questions (3–4 each)**, one commit per lesson (`scripts/add-economics-2024-nov-p2-l01..l33.js`). Exam gate for 2024 stays 2.4.0 (P1 + P2 on dev, `text` + `scientific_math`).

| Real question | Lessons (order) |
|---|---|
| Q1 (30) | 1.1.1–4 · 1.1.5–8 · 1.2 · 1.3 (1–4) |
| Q2 (40) | 2.1 · 2.2.1–4 · 2.2.5 · 2.3.1–3 · 2.3.4–5 · 2.4 · 2.5 (5–11) |
| Q3 (40) | 3.1 · 3.2.1–3 · 3.2.4–5 · 3.3.1–3 · 3.3.4–5 · 3.4 · 3.5 (12–18) |
| Q4 (40) | 4.1 · 4.2.1–3 · 4.2.4–5 · 4.3.1–3 · 4.3.4–5 · 4.4 · 4.5 (19–25) |
| Q5 essay (oligopoly) | firms/products/entry (13) · kinked demand, collusion, efficiency (13) · competition policy (10) · essay structure (4) (26–29) |
| Q6 essay (sustainability) | property rights/charges/taxes/subsidies (13) · permits/CAC/agreements/education (13) · international measures (10) · essay structure (4) (30–33) |

- **Drawn-graph conversions (`DESIGN-ECON-03`)**: 2.4 (TC/FC/VC, lesson 10) and 4.4 (maximum price, lesson 24) never ask for a drawing — fresh labelled diagrams (curves A/B/C; a market with a R14 maximum price) test reading, a variable-cost calculation, a `steps` shortage calculation (800 / 200 / 600, `scientific_math`) and an ordering of the explanation. The Q5 kinked-demand graph (lesson 27) and the 4.2 market + firm graphs (lessons 20–21), the externality graph (lessons 8–9) and a tourist-arrivals bar graph (lesson 15) are also fresh and labelled illustrative. Figures reused by two lessons are uploaded to each lesson's own path.
- Images: question and memo crops at the real sub-question positions (95 URLs, all HTTP 200). Cartoons and image pairs are described in the question text (no newlines allowed).
- **MC index-0 tally 0 of 47**; correct-longest 13 of 47 (28%, under the 30% cap); typed: `explicit cost|explicit costs`, `cost-push inflation|cost push inflation`, `stagflation` (`text`), numeric blanks (-4, 120, 1.8, 20, 80, 3.38) and the maximum-price `steps`.
- Curriculum added (dev): topics `monopolistic_competition`, `price_controls`, `cost_benefit_analysis`, `tourism_impacts`; 24 more tags. Units and `econ_*` subtopics/skills reused.
- Essay lessons carry one AI-explanation entry each (marks 13/13/10/4 per essay).
- **Emulator review (2026-10-15, build 2.4.1-dev01, cache cleared):** all 114 questions captured with no warnings, 14 figure sheets open; 0 auto-fixes, 0 flags; typed answers **12/12 PASS** (every `|` alternative). Cosmetic: white space under several exam-page images; the two-panel market/firm figure is small at phone width.
- **Not done:** prod push of the whole 2024 exam (P1 + P2), subject-expert check ("administered price inflation" as a consumer-inflation type, the CITES/Rotterdam match items).

## Still open

- Verify the subject tile renders with icon `trending-up` in prod (not checked against the app's icon set; the owner is verifying in prod).
- Bump `LATEST_RELEASED` to 2.5.0 and refresh the version tables in `core/app-feature-versions.md` (`VER-06`) — separate change,
  owner confirmed 2.5.0 is latest on 2026-10-14; what 2.5.0 added is not yet recorded in this repo. Check whether it changes
  any rule above (keyboards, presentations, image handling).
- Remove the duplicate `Economics P1 Nov 2024 Eng-1.pdf`.
- Next: an owner-approved push of the whole 2024 exam, P1 + P2 (the 2025 exam is already in prod).
- Read the Q5/Q6 essay memos in full (all four papers) before writing the first essay lesson; only the rubric box and the
  topic lists were reviewed for this profile.
- Verify 2025 P2 Q1.3 answers and the 2024 stimulus figures during Phase 1 of each lesson.
