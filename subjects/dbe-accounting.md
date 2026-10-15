---
id: AMPM-CONTENT-SUBJ-DBE-ACCOUNTING
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-CLOSED-FORM, AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES, AMPM-CONTENT-SUBJ-DBE-ECONOMICS]
tags: [subject, accounting, dbe, profile, statements, ledgers]
---

# Subject Profile — DBE Accounting (Papers 1 and 2)

**Status (2026-10-15): profiled from the Nov 2025 papers + memos, the Nov 2024 papers (structure only) and the CAPS document. Nothing authored; nothing on dev or prod.**
**Load with this profile:** `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`) for discursive items, generated figures, calculations, typed answers and
formatting. This file records only what is specific to Accounting. Accounting is a **hybrid**: ~70% of the marks are worked numeric statements and
ledgers (procedural, like Maths/Math Lit calculations), ~30% is interpretation, concepts and governance (closed-form, like Business Studies).

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"accounting"` — **no `subjects` row yet**: create on dev before authoring (`sort_order`, colour, icon, `category accounting_lessons`, `is_active`/`is_published`, `min_app_version` null). Check `is_active` (Life Sciences' `false` hid it from onboarding). |
| Papers | `nov_p1`, `nov_p2` for 2025 and 2024 (papers, answer books and memos on disk). June papers presumed if sourced. |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/accounting/caps/CAPS FET _ ACCOUNTING GR 10-12 _ Web_CAB3.pdf`. Topic list: §2.1; Grade 12 teaching plan: §3.2.6; cognitive levels: §4 Table 1 (Knowledge/Comprehension 30 / Application/Analysis 40 / Synthesis/Evaluation 30). |
| **Source files** | `files/accounting/nov_2025/` and `nov_2024/` — `Accounting P{1,2} Nov {YYYY} Eng.pdf`, `... MG Eng.pdf`, `... Answer Book Eng.pdf`. |
| Instructions page | 150 marks, 2 h, non-programmable calculator, **"Show ALL workings"**, **"calculations to ONE decimal point"** (instruction 7), a Financial Indicator Formula Sheet at the end of the paper. |

## Paper structure (Nov 2025; 2024 same shell)

| | Paper 1 | Paper 2 |
|---|---|---|
| Q1 | Company Financial Statements (50) — closing-stock correction, Ordinary Share Capital note, Statement of Financial Position | Reconciliations (40) — bank reconciliation (journal entries + reconciliation statement + management of cash), creditors' reconciliation |
| Q2 | Cash Flow Statement and Financial Indicators (45) — reconciliation note, cash flow statement, NAV/acid-test/pay-out rate, one reason with figures | Stock Valuation (35) — two valuation methods, management of inventories |
| Q3 | Concepts and Interpretation of Financial Information (40) — word-choice shorts, interpretation with "quote TWO indicators with trends", repurchase effect, audit report | Cost Accounting (35) — two manufacturing businesses |
| Q4 | Corporate Governance (15) | Budgeting and Problem-solving (40) — two businesses |

**CAPS topic weighting (§2.1):** Financial Accounting 50–60% (concepts, GAAP, bookkeeping, final accounts and statements, salaries/wages, VAT, reconciliations) ·
Managerial Accounting 20–25% (cost accounting, budgeting) · Managing Resources 20–25% (fixed assets, inventory, ethics, internal control).

**Memo conventions that matter:** marks are for *method* as well as the final figure (`4 598 000 – 13 260`); part-marks for one correct part; "can be negative";
"ignore brackets"; "correct figure from 1.1 carried forward" (`CS`). The practice question marks only the final value, so the *method* lives in the explanation
(`core/ai-explanation.md`).

## Presentation design — the statement-as-figure pattern (owner, 2026-10-15)

The app has no table presentation and none is needed. A statement or ledger is shown as **supplementary material** (an image) with up to **three missing
amounts highlighted and lettered A, B and C**; the student answers them with one `fitb`.

(Worked example: `CLOSED-FIG-03`.)

The general rules — generated figure with lettered blanks, at most three independent blanks, anchoring, and splitting a large grid by section — are
`CLOSED-FIG-03` in `shared/closed-form-subjects.md` (`DESIGN-ACC-01`–`03` are aliases of it). Accounting specifics only:

- **The statement is a fresh generated figure, never the exam's page** (the exam page carries the memo's numbers; `CLOSED-FIG-02`). Same line structure
  and notes as the paper, new numbers, HTML/SVG → PNG at `question_supplementary/accounting/{year}/{paper}/q{order}/…`, labelled with the exam's own
  heading (`PIPE-03`: "Statement of Financial Position", "Cash Flow Statement", "Bank Reconciliation Statement").
- **Balancing figures** ("bank overdraft", "retained income") may be a blank only if everything they balance against is given.
- **Section splits for the SOFP** (36 marks): non-current assets / current assets / equity / non-current liabilities / current liabilities, one linked
  lesson each. Test legibility on the emulator (`workflows/review-paper.md`) before authoring the rest; the "view diagram" button overlap (Agri/Life
  Sciences ledger) applies here too, so keep the final label short.

## Keyboard — decision

- **Numeric blanks (almost everything): `standard_math`, released, no gate**, with the typed-value rules of `CLOSED-KB-01`/`CLOSED-FMT-01`. Accounting
  specifics: memo brackets `(150 000)` are stored `-150000` and the stem says "enter a decrease as a negative number"; ratios and percentages ask for
  one number (`CLOSED-KB-01` rule 4); store the paper's "ONE decimal point" rounding **and** the memo's alternatives (`1.3|1.30`), and state the rounding in the stem.
- **Typed account names are not authored.** "Retained income", "Bank", "Debtors' control" are `multiple_choice`/`match`, never `text` — the exam rarely
  marks a typed name and `text` would gate the exam to 2.4.0 for no gain. **An Accounting paper therefore derives the floor version, needs no gate and can go
  to prod as soon as it is reviewed.** This differs from Agri/Tourism/Life Sciences, which accepted a 2.4.0 gate.
- Units in the `metadata` label (`R`, `%`, `days`), not the value (`KEYBOARD-02`).

## Allowed presentation types

- `fitb` (numeric, `standard_math`): the workhorse — statement/ledger/note blanks with the figure (`DESIGN-ACC-01`–`03`), single calculations
  (closing stock, ratio, change in receivables, cost per unit), reading a value from a table.
- `multiple_choice` / `multi_select` / `match` / `ordering`: Q3 interpretation, governance, ethics, internal control, "choose the correct word" shorts,
  which journal/ledger/account an entry belongs to, direction of a change (inflow/outflow, increase/decrease), and the *reason* behind a figure.
- `steps`: use only for a short chain where the method itself is the point and every row is anchored (e.g. weighted-average closing stock: total cost ÷
  total quantity → unit cost → closing value). One trailing blank (`STEPS` precedent); `scientific_math` fallback keyboard carries `+ × ÷ ( )`.
- `equation` / `fraction`: not used (`fraction` only if a ratio is genuinely a fraction).

## Subject rules (beyond core)

- **Calculations follow `CLOSED-CALC-01`** (fresh numbers, one unknown per blank, units in the label, memo tolerance stored). Formulae the explanation must
  reproduce exactly are the Financial Indicator Formula Sheet's (current ratio, acid-test, debt-equity, NAV per share, % return on average shareholders' equity,
  dividend pay-out rate, EPS, DPS …) — read the sheet on disk and quote it, do not recall it. Weighted-average vs FIFO, the bank reconciliation
  (journal entries vs reconciliation statement are different items), manufacturing cost classification and budget variances are subject-specific
  confusable pairs (`CLOSED-DISC-03`).
- **Interpretation items (P1 Q3, P2 problem-solving)** are marked "quote financial indicators with figures **and** give a reason". They convert to
  `multi_select` where each option is *indicator + trend + reason* and the distractors are the wrong-direction or wrong-indicator versions
  (`CLOSED-DISC-01`/`02`). Fresh numbers for fresh companies; the lesson supplies the small indicator table as a generated figure.
- **Corporate governance (P1 Q4), ethics, internal control**: pure closed-form — `CLOSED-DISC-01`–`03`, `CLOSED-ESSAY-01` for the longer items.
- **Linked sub-questions** (`CLOSED-DISC-04`, `DESIGN-UNI-13`): a calculation and its interpretation (e.g. dividend pay-out rate → "is the policy
  sound?") belong in one lesson; a statement's sections share one generated image.
- **"Missing amounts in shaded areas must NOT be filled in"**: the exam's answer-book mechanic has no equivalent — our lettered A/B/C blanks replace it.
- **Answer-cue rules** (`DESIGN-UNI-15`/`16`): no stem or label may reveal a blank's value.
- **MC index-0 cap** applies at paper level (`DESIGN-UNI-06`, ~10%).

## Curriculum units (Grade 12, CAPS §2.1 / §3.2.6)

**Paper 1:** `company_financial_statements`, `cash_flow_statement`, `financial_indicators`, `interpretation_of_financial_information`,
`corporate_governance`. **Paper 2:** `reconciliations`, `stock_valuation`, `cost_accounting`, `budgeting`, plus `fixed_assets`, `ethics`,
`internal_control`, `vat_and_salaries` where they appear. These are provisional until a curriculum collection exists (`tools/create-curriculum-node.js`,
`tools/dump-curriculum-vocabulary.js`) — check the vocabulary dump before inventing node names.

## App-side status

- **`SubjectMapper.kt`** — probably no change (fallback derives the id); **verify**.
- **`KeyboardResolver.kt`** — no `accounting` route; on 2.4.0 resolution is total, so every typed `fitb` declares `keyboard_type` (`KEYBOARD-04`).
- **Supplementary-material rendering on a dense statement is the one genuine unknown** (`DESIGN-ACC-03`). Verify on the emulator before authoring in bulk.
- No new presentation type required.

## Authoring plan

1. Verify identity (create the `subjects` row on dev, vocabulary dump).
2. **Pilot**: one lesson end to end — a generated Ordinary Share Capital note and an SOFP section (A/B/C) — through `validate-questions.js` and the
   emulator, to settle image legibility and the highlight style. Do not author further until the pilot passes.
3. P2 first (reconciliations, stock valuation, cost accounting, budgeting are smaller, self-contained statements) **or** P1 first if the prelims timetable
   favours company statements — owner's call.
4. Lessons mirror the questions (4 per paper) plus theory/interpretation clusters by topic: roughly 14–20 lessons per paper.
5. `validate-questions.js` per script; `derive-exam-min.js` (expect the floor, no gate); `review-paper.md` emulator run; prod push once reviewed.
6. 2024 papers afterwards.

## Completed papers ledger

*(none yet)*
