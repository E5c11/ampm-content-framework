---
id: AMPM-CONTENT-SCHEMA
type: reference
layer: core
related: [AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [content, questions, schema, firestore, presentation-types]
provenance: moved from AMPM/ampm-ai-framework/content/schema.md, 2026-07-15
---

# Question Schema

## Purpose

Defines the document schema for AMPM question documents — required fields, array sizing
rules, field value constraints, question-type vocabularies, and difficulty/exam-weight
calibration. Apply this when authoring or reviewing question data for any subject.

Per-presentation-type contracts (metadata shape, answer shape, renderer behaviour) live
in `presentations/{type}.md` — one doc per type. The contracts table below is retained
here until Phase 2 of the bootstrap workflow moves it out.

## Scope

All question documents in `maths_questions`, `math_questions`, and `english_questions`
collections (and their Postgres `questions` rows post-migration).

---

## Question Document — Required Fields

**`SCHEMA-DOC-01`** — every field below is present with the stated type and constraint.
`enforced_by: validator` for `name`, `question`, `metadata`, `answer`, `presentation`,
`type`, `unit`, `topic`, `difficulty`, `xp`, `order` (the validator's `REQUIRED_FIELDS`
presence check); `human-review` for the remainder (`subtopic`, `skills`, `exam_weight`,
`video`, `syllabus`, `subject`, `year`, `paper`, `deleted`, timestamps).

| Field | Type | Constraint |
|-------|------|------------|
| `name` | string | `"Question N"` — sequential per video, starting at 1 |
| `question` | string | Single flat string — no `\n` (see `AMPM-CONTENT-DESIGN`) |
| `metadata` | array | See Presentation Types table — always an array, `[]` is the legitimate "none" state (never null; see `core/persistence.md` once Phase 4 lands) |
| `answer` | array | See Presentation Types table |
| `presentation` | string | One of the valid presentation types below |
| `type` | string | See Question Types by subject |
| `unit` | string | Curriculum domain |
| `topic` | string | Topic within unit |
| `subtopic` | string | Granular concept |
| `skills` | string[] | 1–3 conceptual skills |
| `difficulty` | integer | 1–5 |
| `exam_weight` | integer | 1–3 |
| `xp` | integer | `10` |
| `order` | integer | 1-based, sequential per video |
| `video` | string | Firestore document ID — `"PLACEHOLDER"` at authoring time |
| `syllabus` | string | `"dbe"` or `"ieb"` |
| `subject` | string | `"maths"`, `"math_lit"`, `"english_hl"` |
| `year` | string | Four-digit string e.g. `"2021"` |
| `paper` | string | e.g. `"nov_p1"` |
| `deleted` | boolean | `false` |
| `date_created` | number | `Date.now()` |
| `date_modified` | number | `Date.now()` |

**`SCHEMA-DOC-02`** — `unit`, `topic`, `subtopic`, and every `skills` entry must exist in
the subject's curriculum source collection(s) *before* being written into a question
document (reuse-before-creating; see `AMPM-CONTENT-PIPELINE` Phase 3).
`enforced_by: validator` (only when run with `--curriculum` and a fresh vocabulary
snapshot — see pipeline Phase 3.5), else `human-review`.

Field value constraints:

- **`SCHEMA-CAL-01`** — `difficulty`: integer 1–5. `enforced_by: validator`
- **`SCHEMA-CAL-02`** — `exam_weight`: integer 1–3. `enforced_by: validator`
- **`SCHEMA-DOC-03`** — `version` (on `ai_explanation`): always an integer.
  `enforced_by: human-review`

---

## Presentation Types

### Array sizing rules

- **`SCHEMA-ARR-01`** — `fitb`, `fraction`, `multiple_choice`, `multi_select`,
  `equation`: the **`answer`** array is always exactly 5 elements; pad unused slots
  with `""`. `enforced_by: validator`
  *(Resolved against the validator (`FIXED_ANSWER_TYPES` vs `FIXED_METADATA_TYPES`),
  2026-07-15: a previous version of this bullet said "always exactly 5 elements"
  unscoped, contradicting the metadata contracts below — the 5-element rule is true of
  `answer` only. Bootstrap Contradiction Inventory #1.)*
- **`SCHEMA-ARR-02`** — `multiple_choice`, `multi_select`: the **`metadata`** array is
  also exactly 5 elements. `enforced_by: validator`
- **`SCHEMA-ARR-03`** — `fraction`, `equation`: `metadata` is exactly `[]` (empty
  array — not null, not padded). `enforced_by: validator`
- **`SCHEMA-ARR-04`** — `fitb`: `metadata` is a **variable-length**, non-empty token
  list (labels + `"[ ]"` blank markers). `enforced_by: validator, renderer`
- **`SCHEMA-ARR-05`** — `ordering`, `match`, `steps`: `metadata` and `answer` are
  **variable length**, non-empty, no padding. `enforced_by: validator`
- **`SCHEMA-ARR-06`** — `ordering`: `metadata` and `answer` have the same length.
  `enforced_by: validator`

### Type contracts

*(Moves to `presentations/{type}.md` in bootstrap Phase 2, where each row gains its
renderer contract and validator-coverage section.)*

| `presentation` | `metadata` | `answer` |
|---|---|---|
| `fitb` | Flat array of label strings and `"[ ]"` blank markers. Each `"[ ]"` must be its own array element — never embedded in a label string. E.g. `["x = ", "[ ]"]` ✓ not `["x = [ ]"]` ✗ | 5 elements: one correct value per blank (index 0, 1, …), padded with `""` |
| `fraction` | `[]` (empty array) | 5 elements: `["numerator", "denominator", "", "", ""]` |
| `multiple_choice` | 5 elements: 4 option strings + `""`. Correct option **never at index 0** — index 0 is always a distractor. | 5 elements: `["correct option text", "", "", "", ""]` — must match a `metadata` value exactly |
| `multi_select` | 5 elements: option strings | 5 elements: all correct options, padded with `""` |
| `ordering` | N items (will be shuffled by the app) | N items in correct order |
| `match` | 2N elements: first N = left column, last N = right column. Format: `"X - label"` | N elements: correct pairings `"left-right"` e.g. `"A-1"` |
| `equation` | `[]` (empty array) | 5 elements: `["canonical expression", "", "", "", ""]` |
| `steps` | N elements: step text or `"[ ]"` as its own element for each blank | N elements: one correct value per blank, in metadata order |

- **`SCHEMA-TYPE-01`** — `fraction`: `answer[0]` (numerator) and `answer[1]`
  (denominator) are both non-empty. `enforced_by: validator`
- **`SCHEMA-TYPE-02`** — `multiple_choice` / `multi_select`: every non-empty `answer`
  value exists **verbatim** in `metadata`. `enforced_by: human-review` (the app matches
  by exact string; a mismatch makes the question unanswerable)

### `equation` canonical format

**`SCHEMA-TYPE-03`** — `enforced_by: human-review`

- Fractions: `"3/4"` or `"(sin θ)/2"` for multi-char numerator/denominator
- Exponents: `"sin²θ"` or `"x^2"` — decide per question, be consistent
- Spaces around operators: `"2x + 3"` not `"2x+3"`

### `fitb` metadata — time values

**`SCHEMA-TYPE-04`** — never expect a single `HH:MM` input (users cannot type `":"`).
Split into two blanks. `enforced_by: human-review`

```js
metadata: ["HH", "[ ]", ":", "MM", "[ ]"]
answer:   ["23", "55", "", "", ""]
```

### `fitb` metadata — fractions

**`SCHEMA-TYPE-05`** — never use `"/"` as a separator in `fitb` metadata to simulate a
fraction. Use `fraction` presentation instead. `enforced_by: human-review`

---

## `multiple_choice` — correct answer placement

**`SCHEMA-TYPE-06`** — the correct option must **never** be at `metadata` index 0.
Index 0 is always a distractor. Place the correct answer randomly at index 1, 2, or 3.
`enforced_by: human-review` (the validator does not check this; paper-level index-0
distribution is checked by the audit script, per-question placement is on the author)

---

## Question Types by subject

**`SCHEMA-QT-01`** — `type` uses the subject's vocabulary below; nothing else.
`enforced_by: human-review`

### Maths and Math Lit

| `type` | Use when |
|--------|----------|
| `definition` | Identify, name, or state a theorem/rule |
| `calc` | Numerical calculation |
| `application` | Apply a concept to a real-world scenario |
| `conversion` | Convert units, forms, or representations |
| `fraction` | Fraction computation specifically |
| `proof` | Proving an identity or theorem (use with `steps` presentation) |

> `"reading"` is not a valid type. Use `definition` for recall/identification questions.

### English HL

| `type` | Use when |
|--------|----------|
| `definition` | Identify, name, define, or recall a rule, term, device, or structure |
| `application` | Apply a rule or concept to a given stimulus sentence, passage, or writing scenario |

---

## Difficulty and exam weight

**`SCHEMA-CAL-03`** — calibrate against these anchors, not gut feel.
`enforced_by: human-review`

**Difficulty (1–5):**

| Value | Maths / Math Lit | English HL |
|-------|-----------------|------------|
| `1` | Direct recall or single formula substitution | Direct recall (e.g. "what is a simile?") |
| `2` | Single-step problem | Single-step application |
| `3` | Multi-step calculation or proof | Explanation (e.g. explain the effect of a device) |
| `4` | Complex reasoning, multiple concepts linked | Multi-step transformation |
| `5` | Synthesis, non-routine problem | Synthesis / analysis |

**Exam weight (1–3):**
- `1` — Minor topic in past papers
- `2` — Moderately frequent
- `3` — High-frequency, high-mark topic
