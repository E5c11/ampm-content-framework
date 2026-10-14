---
id: AMPM-CONTENT-SUBJ-DBE-ECONOMICS
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES, AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY, AMPM-CONTENT-SUBJ-DBE-HISTORY]
tags: [subject, economics, dbe, profile]
---

# Subject Profile — DBE Economics (Papers 1 and 2)

**Status: analysed 2026-10-14, nothing authored.** Drafted from the Nov 2024 and Nov 2025 papers and memos for both
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
| `subjects` reference row | **Not created.** Data-only insert (no tooling), same as Business Studies. Pick the next free `sort_order` (`SELECT id, sort_order FROM subjects`; Business Studies is 8, English FAL 10), a `color` and an `icon`. Create on **dev only**; prod row waits for the prod push (`is_active` / `min_app_version` to be decided then). No subject-level app gate is needed (not a setwork subject, `VER-10` does not apply) |

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

## Lesson granularity

One lesson per real question — Q1, Q2, Q3, Q4, Q5, Q6 of a paper, `"Question N"` (`PIPE-07`) — never split further, same
as Business Studies; Section B/C "answer any N" is a `DESIGN-UNI-10` independence signal, so no lesson may assume another
optional question's content. Q1 is the biggest (22 items, three types, drawn from every topic in the paper's scope);
Q2–Q4 are ~10–14 closed-form questions each; Q5/Q6 are essay lessons (`DESIGN-ECON-06`). Expect roughly 6 lessons and 55–70
questions per paper, 24 lessons across the four papers. `DESIGN-UNI-11` scales the count with the bundled content.

## Curriculum units (Grade 12, CAPS Section 2.1 / 3.2.6)

Units = the 20 CAPS topics (a unit per topic; slugs are global unless the subject is added to `NAMESPACED_SUBJECTS` in
`tools/lib/curriculum.js` — check, see upload doc Phase 0):

| Paper | CAPS group | Topics |
|---|---|---|
| P1 | Macroeconomics | 1 basic concepts · 2 basic economic problem · 3 circular flow · 4 quantitative elements · 5 economic systems · 6 business cycles |
| P1 | Economic pursuits | 9 economic growth and development · 10 money and banking · 11 population and labour force · 12 labour market · 13 redress since 1994 |
| P2 | Microeconomics | 7 dynamics of markets (perfect, imperfect, market failure) · 8 public sector intervention and composition of the RSA economy |
| P2 | Contemporary issues | 14 unemployment · 15 labour relations · 16 globalisation · 17 inflation · 18 tourism · 19 poverty · 20 other economic issues (environmental sustainability, climate change, indigenous knowledge) and quantitative elements |

Topic placement is by what the *question* tests (2025 P1 Q4 mixes public-sector failure, the EPWP, free-trade arguments and fiscal policy). Topics
and subtopics: create per concept as they appear; keep **subtopics coarse and reused** (skill-shaped, as in Business
Studies/History): e.g. `term_definition_recall`, `data_interpretation`, `classification_and_criteria`,
`calculation_and_method`, `graph_interpretation`, `essay_structure`, `cause_and_effect`.

## App-side status

- **No app change needed to author** the Business Studies subset. `economics` resolves through the mapper fallback; no
  `KeyboardResolver` entry is needed when every typed row declares a keyboard.
- **Not possible in the app, by design:** student-drawn graphs (`DESIGN-ECON-03`), free-text essays (`DESIGN-ECON-06`).
- **Images:** every stimulus is a figure. Rasters can be pulled with `pdfimages` (2025 P1: Phillips curve p. 7, cartoon p. 10;
  2025 P2: p. 9 and p. 10 figures); vector graphs need a page crop via `tools/extract-exam-pages.py`. Not yet inventoried
  for 2024 — do it in Phase 1.5 of the first lesson.

## Completed papers ledger

*Nothing authored yet.* Record each lesson here as it lands (script, questions, marks, MC index-0 tally, review status).

## Still open

- Create the `subjects` row on dev (sort order, colour, icon) — see Identity.
- Bump `LATEST_RELEASED` to 2.5.0 and refresh the version tables in `core/app-feature-versions.md` (`VER-06`) — separate change,
  owner confirmed 2.5.0 is latest on 2026-10-14; what 2.5.0 added is not yet recorded in this repo. Check whether it changes
  any rule above (keyboards, presentations, image handling).
- Remove the duplicate `Economics P1 Nov 2024 Eng-1.pdf`.
- First lesson to author: 2025 P1 Q2 (macroeconomics: BoP calculation, Phillips curve, two discussion items) — it exercises
  every Economics-specific rule except the drawn graph (first met in 2025 P2 Q4).
- Read the Q5/Q6 essay memos in full (all four papers) before writing the first essay lesson; only the rubric box and the
  topic lists were reviewed for this profile.
- Verify 2025 P2 Q1.3 answers and the 2024 stimulus figures during Phase 1 of each lesson.
