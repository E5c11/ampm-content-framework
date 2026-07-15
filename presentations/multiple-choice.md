---
id: AMPM-CONTENT-PRES-MC
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-PRES-MULTI-SELECT]
tags: [presentation, multiple-choice, options]
---

# `multiple_choice` — Single Selection

## Metadata contract

**`MC-01`** — `metadata` has exactly 5 elements (`SCHEMA-ARR-02`): 4 option strings +
`""` (True/False questions: 2 options + three `""`). The correct option is **never at
index 0** (`SCHEMA-TYPE-06` / `DESIGN-UNI-06`) — index 0 is always a distractor.
`enforced_by: validator` (length), `human-review` (index-0 placement).

## Answer contract

**`MC-02`** — `answer` has exactly 5 elements (`SCHEMA-ARR-01`):
`["correct option text", "", "", "", ""]` — `answer[0]` must match one `metadata` value
**verbatim** (`SCHEMA-TYPE-02`). `enforced_by: validator` (length), `human-review`
(verbatim match).

## Renderer contract

Verified against app code 2026-07-15:

- `MultipleChoice.kt` (`feature/watch/.../questions/ui/composables/MultipleChoice.kt`):
  renders `metadata.filter { it.isNotEmpty() }` as checkboxes **in stored order — no
  shuffle**. Selecting an option deselects the others and submits its exact text as the
  answer.
- `PresentationComponent.kt`: multiple_choice **auto-validates** the moment an option is
  selected (`shouldAutoValidate`) — there is no separate submit step.
- `SubjectKeyboardType.kt` `inputCount()`: 0 (no keyboard).
- Validation (`QuestionsValidator.kt`): first user answer vs first correct answer,
  trimmed, case-insensitive.

**Failure modes:**
- `answer[0]` not verbatim in `metadata` → the question is **unanswerable** — every
  selection validates Incorrect, no error surfaces.
- Options are not shuffled at render, so a correct answer stored at index 0 is
  systematically exploitable (first option always right) — hence the index-0 rule.

## Validator coverage

Enforces: 5-element metadata and answer. Human-review only: verbatim answer↔option
match, index-0 placement, distractor plausibility. Set-level: True/False cap ≤20%
(`DESIGN-UNI-05` — validator checks the set; the paper-level running count is on the
author).

## Worked example + pitfalls

```js
question: "Which measure of central tendency is most affected by an outlier?",
metadata: ["Median", "Mean", "Mode", "Range", ""],
answer: ["Mean", "", "", "", ""],
presentation: "multiple_choice",
```

- Distractors must be plausible — a matric student should have to think.
- Use for open-ended English questions instead of fitb (`DESIGN-ENG-04`) and for
  expression answers in Maths (`DESIGN-MATH-05`).
- True/False: exactly `["True", "False", "", "", ""]`; single rule/fact only.
