---
id: AMPM-CONTENT-PRES-MULTI-SELECT
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-PRES-MC]
tags: [presentation, multi-select, options, partial-credit]
---

# `multi_select` — Multiple Selection

## Metadata contract

**`MS-01`** — `metadata` has exactly 5 elements (`SCHEMA-ARR-02`): option strings,
padded with `""`. `enforced_by: validator`.

## Answer contract

**`MS-02`** — `answer` has exactly 5 elements (`SCHEMA-ARR-01`): **all** correct
options, padded with `""`; every non-empty value must exist verbatim in `metadata`
(`SCHEMA-TYPE-02`). `enforced_by: validator` (length), `human-review` (verbatim).

## Renderer contract

Verified against app code 2026-07-15:

- `MultiSelection.kt` (`feature/watch/.../questions/ui/composables/MultiSelection.kt`):
  renders non-empty `metadata` as toggleable chips in stored order (no shuffle); each
  toggle adds/removes that option's exact text from the user answer.
- `PresentationComponent.kt`: **no auto-validate** — a Submit button appears; user picks
  several options first.
- Validation (`QuestionsValidator.kt`): set comparison, trimmed, case-insensitive,
  order-independent. **Partial credit**: score = (correct picks − incorrect picks) /
  total correct, clamped 0–1; 0 < score < 1 yields PartiallyCorrect with scaled XP.

**Failure modes:** a correct answer value not verbatim in `metadata` can never be
selected → full marks are unreachable, silently.

## Validator coverage

Enforces: 5-element metadata and answer. Human-review only: verbatim answer⊆metadata,
at least 2 correct options (a single-correct multi_select should be `multiple_choice`).

## Worked example + pitfalls

```js
question: "Select ALL the measures of spread.",
metadata: ["Range", "Mean", "Interquartile range", "Standard deviation", "Mode"],
answer: ["Range", "Interquartile range", "Standard deviation", "", ""],
presentation: "multi_select",
```

- All 5 metadata slots may be real options (no `""` padding needed when there are 5).
- Distractors still count against the student (partial-credit penalty) — keep them
  plausible but clearly wrong on reflection.
