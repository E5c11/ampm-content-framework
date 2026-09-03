---
id: AMPM-CONTENT-DESIGN
type: guide
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [content, questions, design, variety, maths, math-lit, english]
provenance: moved from AMPM/ampm-ai-framework/content/design.md, 2026-07-15
---

# Authoring Principles

## Purpose

Defines the authoring rules for AMPM practice questions — concept independence,
self-containment, variety, and per-subject constraints. Apply these before finalising
any question set.

## Scope

All question authoring sessions, every subject. Subject-specific sections below apply per
the subject profile (`subjects/{profile}.md`).

---

## Universal Rules

### `DESIGN-UNI-01` — No exam content (freshness rule)

`enforced_by: human-review`

No number, name, scenario, quote, or dataset from the real exam paper appears in any
question. Questions test the same *skill* with a completely fresh scenario. This applies
equally to no-video uploads: the exam image is the worked example; the practice
questions are the independent exercise that follows — never a transcription.

### `DESIGN-UNI-02` — Self-contained questions

`enforced_by: human-review`

Each question must make complete sense on its own. No question may reference context,
values, or results from another question in the set.

### `DESIGN-UNI-03` — Distinct skills per video

`enforced_by: human-review`

No two questions in the same video may test the same underlying concept — even with
different numbers or a different scenario.

### `DESIGN-UNI-04` — No newlines in the `question` field

`enforced_by: validator`

The `question` field must be a single flat string. Never use `\n` or line breaks.
Supplementary data belongs in `clues` or `context_text`.

### `DESIGN-UNI-05` — True/False cap — 20% per paper

`enforced_by: validator` (per set), `human-review` (running paper-level count)

No more than 20% of all questions in a paper may use True/False `multiple_choice`.
A True/False question uses exactly two options: `metadata: ["True", "False", "", "", ""]`.
Appropriate for testing a single rule or fact — not for calculation, proof, or multi-step
reasoning. Check the running count before adding one.

### `DESIGN-UNI-06` — Correct answer not at index 0

`enforced_by: human-review` (see `SCHEMA-TYPE-06`)

For `multiple_choice`, the correct option must never be at `metadata` index 0. Index 0
is always a distractor. Place the correct answer randomly at index 1, 2, or 3.

### `DESIGN-UNI-07` — Variety rule

`enforced_by: validator`

| Question count in this video | Minimum distinct `presentation` types |
|---|---|
| 2 | 1 (same type allowed) |
| 3+ | 2 |
| 4+ | 3 |

Never make every question in a set `fitb`. *(Historically listed under "Maths and Math
Lit" only, but the validator enforces it on every set regardless of subject — resolved
against validator, 2026-07-15.)*

---

## Maths and Math Lit — Additional Rules

### `DESIGN-MATH-01` — Answer numeric formatting

`enforced_by: human-review`

- Integer answers: never include decimal places — `"540"` not `"540.00"`
- Decimal answers: minimum decimal places — `"2.5"` not `"2.50"`
- No spaces as thousand separators in `answer` or `metadata` — `"12500"` not `"12 500"`
- Always use `.` as the decimal separator, not `,`

---

## Maths — Additional Rules

### `DESIGN-MATH-02` — Graph questions: always decompose

`enforced_by: human-review`

Do not test free-hand drawing. Break graph skills into sub-questions:
- x-intercept(s) → `fitb`
- y-intercept → `fitb`
- Turning point / vertex → `fitb`
- Axis of symmetry → `fitb`
- Domain or range → `fitb` or `multiple_choice`
- Identify graph shape / transformation → `multiple_choice`

### `DESIGN-MATH-03` — Trig equations: always constrain to an interval

`enforced_by: human-review`

Never ask for the general solution. Always specify an interval e.g.
`"solve for x ∈ [0°, 360°]"`. This tests the same skills without complex notation.

### `DESIGN-MATH-04` — Euclidean geometry proofs: decompose

`enforced_by: human-review`

Do not ask for a full written proof. Test with:
- "What is the reason for this step?" → `multiple_choice`
- Arrange proof steps → `ordering`
- Complete a missing step → `steps`
- Match statement to reason → `match`

### `DESIGN-MATH-05` — Expression answers

`enforced_by: human-review`

When the answer is an algebraic expression (e.g. f'(x), equation of a line):
- Prefer `multiple_choice` — provide 4 plausible expressions
- Use `equation` only when MCQ options would be too similar to distinguish without working

### `DESIGN-MATH-06` — Paper 2 variety requirements by topic

`enforced_by: human-review`

| Topic | Must include at least one of |
|---|---|
| Statistics | `multiple_choice` or `ordering` (not only `fitb`) |
| Analytical geometry | `fitb` for values + `multiple_choice` for classification |
| Euclidean geometry | `ordering` or `match` for proof steps/reasons |
| Trigonometry | `steps` or `multiple_choice` for identities; `fitb` for equation solutions |

---

## Math Lit — Additional Rules

### `DESIGN-ML-01` — FITB cap — 65% per paper

`enforced_by: human-review` (paper-level running count; not in the per-set validator)

Across all questions in the paper, no more than 65% may use `fitb` presentation. Check
the running count when designing each video.

### `DESIGN-ML-02` — Non-trivial answers

`enforced_by: human-review`

Do not construct scenarios where the answer is a suspiciously round number (e.g. exactly
R1 000, 50%). Choose input values that require real working — e.g. R1 236, 13.5%. Students
must calculate, not pattern-match.

### `DESIGN-ML-03` — Scope: stay within the question group

`enforced_by: human-review`

Do not carry over scenarios, named places, or data from any other question group in the
same paper — even if two groups share a theme.

---

## English HL — Additional Rules

### `DESIGN-ENG-01` — Theme rule

`enforced_by: human-review`

Keep the same topic/theme as that year's exam text. Fresh stimulus is independently
authored but stays in the same world — different sentences, different quotes, same theme.

### `DESIGN-ENG-02` — Structure rule

`enforced_by: human-review`

Each practice question mirrors the *type* of the corresponding exam sub-question — same
instruction style, same mark implication, same cognitive skill.

### `DESIGN-ENG-03` — `context_text` usage

`enforced_by: human-review`

Use `context_text` for short inline stimulus (1–3 fresh sentences) when the question
needs its own independent passage. Set to `null` when the question draws on
`supplementary_materials` texts or stands alone.

### `DESIGN-ENG-04` — `fitb` usage rule

`enforced_by: human-review`

Only use `fitb` when the answer is a specific, matchable string. Use `multiple_choice`
for open-ended questions ("explain the effect", "discuss", "comment on") — valid phrasings
are too varied to enumerate. When multiple valid answers exist, separate alternatives with
`|` in the answer element (e.g. `"private|secret|discreet"`). Write FITB answers in
standard sentence case — matching is case-insensitive.

### `DESIGN-ENG-05` — Section caps

`enforced_by: human-review`

| Section | Max questions |
|---------|--------------|
| Q1 — Comprehension | 7 |
| Q2 — Summary | 2–4 |
| Q3 — Advertising | 2–4 |
| Q4 — Media/Cartoons | 2–4 |
| Q5 — Using Language Correctly | 7 |
| Paper 3 — all sections | 7 per lesson |
