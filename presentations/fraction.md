---
id: AMPM-CONTENT-PRES-FRACTION
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-PRES-FITB]
tags: [presentation, fraction, metadata]
---

# `fraction` — Numerator/Denominator Input

## Metadata contract

**`FRAC-01`** — `metadata` is exactly `[]` (empty array — the legitimate "none" state;
never null, never scaffolding like `["[ ]", "/", "[ ]"]`). `enforced_by: validator`
(`EMPTY_METADATA_TYPES`), `db-constraint` (non-null, Phase 4 chain).

*Inventory #6 resolved 2026-07-15: dev scan found 4 fraction docs carrying legacy
input-scaffolding metadata (2 in `math_questions`, 2 in `maths_questions` with
`["P = [ ]/[ ]"]`). Harmless at render (FRACTION ignores metadata) but validator
violations — to be cleared to `[]` in dev per owner decision (fix run pending, tracked
in the bootstrap workflow doc); prod check pending owner approval.*

## Answer contract

**`FRAC-02`** — `answer` has exactly 5 elements (`SCHEMA-ARR-01`):
`["numerator", "denominator", "", "", ""]`, both `answer[0]` and `answer[1]` non-empty.
`enforced_by: validator`.

## Renderer contract

Verified against app code 2026-07-15:

- `Fraction.kt` (`feature/watch/.../questions/ui/composables/Fraction.kt`): renders
  **two fixed inputs** (numerator box, divider line, denominator box). **`metadata` is
  never read** — the layout is hardcoded.
- `SubjectKeyboardType.kt` `inputCount()`: FRACTION → `2`, regardless of metadata.
  *(Inventory #4 resolved against this code, 2026-07-15: FRACTION is NOT part of the
  metadata-driven silent-dead-end pair — that pair is FITB and STEPS. AMPM's
  bugs-tracking entry corrected accordingly.)*
- `PresentationComponent.kt`: inline "Check" button, no auto-validate.
- Validation (`QuestionsValidator.kt`, FRACTION branch): compares
  `[numerator, denominator]` in order; trims; `,`→`.`; filters stray legacy `"/"`
  elements from stored answers; **no `|` alternatives**.

**Failure mode:** none driven by metadata (ignored). An unsimplified expected answer is
the real trap — the student's mathematically-equal-but-unsimplified input compares
unequal (string comparison, e.g. `"2/8"` ≠ `"1/4"`).

## Validator coverage

Enforces: `metadata` empty, 5-element answer, numerator/denominator both present.
Human-review only: the answer is in **simplest form** and the question says so.

## Worked example + pitfalls

```js
question: "Convert 25% into a fraction. Simplify as far as possible.",
metadata: [],
answer: ["1", "4", "", "", ""],
presentation: "fraction",
```

- Always instruct "in its simplest form" — comparison is exact per part.
- Numeric parts only; a whole number answer doesn't belong here (use `fitb`).
- Use `fraction` (not fitb-with-slash) whenever the answer is a fraction
  (`SCHEMA-TYPE-05`).
