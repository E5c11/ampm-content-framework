---
id: AMPM-CONTENT-PRES-ORDERING
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-PRES-MATCH]
tags: [presentation, ordering, sequence]
---

# `ordering` — Arrange In Order

## Metadata contract

**`ORD-01`** — `metadata` is variable-length (`SCHEMA-ARR-05`), non-empty, no padding:
the N items to be arranged. **Store the items in a scrambled order — the app does NOT
shuffle them.** `enforced_by: validator` (non-empty), `human-review` (scrambled
storage).

*Resolved against renderer, 2026-07-15: the pre-extraction schema doc said metadata
"will be shuffled by the app" — false. `Ordering.kt` renders items in stored order
(only `match` shuffles). Metadata stored in correct order hands the student the answer.*

## Answer contract

**`ORD-02`** — `answer` is the same N items in **correct** order; same length as
`metadata` (`SCHEMA-ARR-06`), no padding. Item strings must match metadata verbatim.
`enforced_by: validator` (lengths equal, non-empty), `human-review` (verbatim).

## Renderer contract

Verified against app code 2026-07-15:

- `Ordering.kt` (`feature/watch/.../questions/ui/composables/Ordering.kt`): non-empty
  `metadata` items render as tappable chips **in stored order** (no `shuffled()` call).
  Tapping moves an item to "Your order"; tapping there removes it.
- `PresentationComponent.kt`: **no auto-validate** — Submit button.
- Validation (`QuestionsValidator.kt`): sequence equality, **case-sensitive**, trimmed.

**Failure modes:**
- `metadata` stored in the correct order → question is pre-solved on screen.
- Any answer element differing from its metadata item (case, punctuation) → the correct
  sequence validates Incorrect (case-sensitive comparison).

## Validator coverage

Enforces: non-empty metadata and answer, equal lengths. Human-review only: scrambled
metadata order, verbatim item match, exactly one defensible correct order.

## Worked example + pitfalls

```js
question: "Arrange the steps for calculating compound interest in the correct order.",
metadata: [
  "Substitute values into the formula",
  "Identify P, r and n",
  "Calculate the bracket term",
  "Apply the exponent and multiply by P",
],
answer: [
  "Identify P, r and n",
  "Substitute values into the formula",
  "Calculate the bracket term",
  "Apply the exponent and multiply by P",
],
presentation: "ordering",
```

- Keep item texts short — they render as chips.
- Each step must have exactly one defensible position (no interchangeable steps).
- Good fit for Euclidean-geometry proof steps (`DESIGN-MATH-04`).
