---
id: AMPM-CONTENT-PRES-STEPS
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-PRES-FITB, AMPM-CONTENT-PRES-EQUATION]
tags: [presentation, steps, proof, blanks]
---

# `steps` — Complete The Working

## Metadata contract

**`STEPS-01`** — `metadata` is variable-length (`SCHEMA-ARR-05`), non-empty, no
padding: one element per row of working. Given rows are the step text; each blank row is
**exactly the string `"[ ]"`** — its own element, no surrounding whitespace, never
embedded (`MATHTEXT-05`). The starting expression lives in `metadata[0]` as the first
given step, never in `question` (`MATHTEXT-04`). `enforced_by: validator` (non-empty,
split-token, no-markup-in-question), `renderer` (exact-match blank detection).

**Stricter than fitb:** the STEPS renderer and `inputCount()` both require the exact
untrimmed `"[ ]"` — a padded `" [ ] "` or `"[]"` row renders as *given text*, not a
blank. (Inventory #5 contract decision, 2026-07-15: `"[ ]"` only; dev scan of 1006 docs
found no violations in real data.)

## Answer contract

**`STEPS-02`** — `answer` is variable-length, no padding: one correct value per blank
row, in metadata order. Answer count must equal blank-row count. Values use the same
canonical serialization as `equation` answers (`SCHEMA-TYPE-03`) — each blank is an
`EquationInput`. `enforced_by: validator` (non-empty), `human-review` (count match,
canonical form).

## Renderer contract

Verified against app code 2026-07-15:

- `StepsPresentation.kt` (`feature/watch/.../questions/ui/composables/StepsPresentation.kt`):
  renders `metadata` as numbered rows — `row == "[ ]"` (exact, untrimmed) becomes an
  `EquationInput` (custom maths keyboard); every other row is read-only `MathText`.
- `SubjectKeyboardType.kt` `inputCount()`: STEPS → `metadata.count { it == "[ ]" }` —
  exact match, no trim (unlike FITB's trimmed count).
- `PresentationComponent.kt`: Submit button (no auto-validate); enabled once any blank
  has input.
- Validation (`QuestionsValidator.kt`): all blank answers compared in order, trimmed,
  **case-sensitive, no alternatives, no numeric normalization**.

**Failure modes:**
- `metadata` with no `"[ ]"` rows → zero inputs, silent dead end (same class as fitb —
  STEPS is the other half of the metadata-driven pair; Inventory #4).
- A padded/no-space blank token → that row shows as given text; the student sees a
  "complete the steps" question with a missing blank and the answer count no longer
  lines up.
- MathText markup in `question` → duplicated expression and broken rendering
  (`MATHTEXT-04`).

## Validator coverage

Enforces: non-empty metadata and answer, embedded-`"[ ]"` rejection, `\frac`/`\sqrt`
ban in `question`. Human-review only: blank-count ↔ answer-count match, exact `"[ ]"`
token form (until the Phase 3 validator rule lands), canonical answer serialization.

## Worked example + pitfalls

```js
question: "Prove the identity. Complete the missing steps:",
metadata: [
  "LHS = sin²θ + cos²θ - 2cos²θ",
  "[ ]",
  "= 1 - 2cos²θ",
  "= RHS ✓",
],
answer: ["1 - cos²θ - cos²θ + cos²θ... "],  // one element per "[ ]" row, in order
presentation: "steps",
```

- Give enough surrounding steps that each blank has exactly one defensible value.
- Good fit for trig identities and proof completion (`DESIGN-MATH-04`,
  `DESIGN-MATH-06`).
- Blank values are compared exactly (after trim) — keep expected strings short and
  unambiguous.
