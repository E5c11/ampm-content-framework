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

### Type contracts — moved to `presentations/` (bootstrap Phase 2, 2026-07-15)

The full per-type contract (metadata shape, answer shape, renderer contract citing app
code, validator coverage, worked examples) lives in one doc per type:

| `presentation` | Contract doc |
|---|---|
| `fitb` | `presentations/fitb.md` |
| `fraction` | `presentations/fraction.md` |
| `multiple_choice` | `presentations/multiple-choice.md` |
| `multi_select` | `presentations/multi-select.md` |
| `ordering` | `presentations/ordering.md` |
| `match` | `presentations/match.md` |
| `equation` | `presentations/equation.md` |
| `steps` | `presentations/steps.md` |

The `SCHEMA-TYPE-*` rule IDs remain owned here (one-line form); the presentation docs
carry the detail:

- **`SCHEMA-TYPE-01`** — `fraction`: `answer[0]`/`answer[1]` (numerator/denominator)
  both non-empty. `enforced_by: validator`
- **`SCHEMA-TYPE-02`** — `multiple_choice`/`multi_select`: every non-empty `answer`
  value exists **verbatim** in `metadata`. `enforced_by: human-review`
- **`SCHEMA-TYPE-03`** — `equation`/`steps` answers use the canonical serialization
  format (see `presentations/equation.md`). `enforced_by: human-review`
- **`SCHEMA-TYPE-04`** — `fitb`: never a single `HH:MM` blank — split time values
  (see `presentations/fitb.md`). `enforced_by: human-review`
- **`SCHEMA-TYPE-05`** — `fitb`: never simulate fractions with `"/"` — use `fraction`.
  `enforced_by: human-review`
- **`SCHEMA-TYPE-06`** — `multiple_choice`: correct option never at `metadata` index 0.
  `enforced_by: human-review`

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
