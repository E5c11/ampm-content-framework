---
id: AMPM-CONTENT-PRES-EQUATION
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-PRES-STEPS]
tags: [presentation, equation, math-keyboard]
---

# `equation` — Expression Input

## Metadata contract

**`EQ-01`** — `metadata` is exactly `[]` (empty array — legitimate "none" state, never
null). `enforced_by: validator` (`EMPTY_METADATA_TYPES`), `db-constraint` (non-null,
Phase 4 chain).

## Answer contract

**`EQ-02`** — `answer` has exactly 5 elements (`SCHEMA-ARR-01`):
`["canonical expression", "", "", "", ""]`. The expression uses the canonical
serialization format (`SCHEMA-TYPE-03`): `"3/4"` or `"(sin θ)/2"` fractions, consistent
exponent style per question, spaces around operators (`"2x + 3"`). Not MathText markup
(`MATHTEXT-03`). `enforced_by: validator` (length), `human-review` (canonical format).

## Renderer contract

Verified against app code 2026-07-15:

- `PresentationComponent.kt`: EQUATION renders a single `EquationInput` driven by the
  custom maths keyboard (`MathInputState`); `metadata` is never read.
- `SubjectKeyboardType.kt` `inputCount()`: EQUATION → `1`, regardless of metadata.
- No auto-validate (user must finish composing the expression).
- Validation (`QuestionsValidator.kt`, FRACTION/EQUATION branch): trimmed exact string
  equality — **case-sensitive, no alternatives, no numeric normalization**.

**Failure modes:** none metadata-driven (ignored). The trap is comparison strictness:
if the custom keyboard's serialization of the student's correct input differs from the
stored string by one space or exponent style, it validates Incorrect. This is why the
canonical format and the "prefer `multiple_choice` for expressions" rule
(`DESIGN-MATH-05`) exist.

## Validator coverage

Enforces: empty metadata, 5-element answer. Human-review only: canonical serialization
(match what the maths keyboard actually produces — spot-check on device when in doubt),
single unambiguous expected form.

## Worked example + pitfalls

```js
question: "Determine f'(x) if f(x) = x² + 3x.",
metadata: [],
answer: ["2x + 3", "", "", "", ""],
presentation: "equation",
```

- Use `equation` only when `multiple_choice` options would be indistinguishable without
  working (`DESIGN-MATH-05`).
- One canonical answer only — if two forms are equally natural (`x^2` vs `x²`), the
  question should be reworked or moved to `multiple_choice`.
