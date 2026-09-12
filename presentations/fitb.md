---
id: AMPM-CONTENT-PRES-FITB
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-PRES-STEPS]
tags: [presentation, fitb, blanks, metadata]
---

# `fitb` — Fill In The Blank

## Metadata contract

**`FITB-01`** — `metadata` is a **variable-length, non-empty** flat array of label
strings and `"[ ]"` blank markers. Each `"[ ]"` must be its own array element — never
embedded in a label string (`["x = ", "[ ]"]` ✓, `["x = [ ]"]` ✗). Blank marker is
`"[ ]"` **with the space** — `"[]"` is banned. `enforced_by: validator` (non-empty +
split-token + `"[]"` rejection), `renderer`.

*Inventory #2 resolved against validator+renderer, 2026-07-15: an AMPM upload-doc
template comment claimed `metadata: []` for fitb — wrong; empty metadata renders zero
inputs (see failure modes).*

*Inventory #5 resolved, 2026-07-15: `FillInTheBlank.isBlankSlot()` leniently accepts
`"[]"` (no space), but `inputCount()` counts only `"[ ]"` — metadata using `"[]"` would
render a blank whose custom-keyboard input count disagrees. Contract decision: **`"[ ]"`
only**; renderer left as-is (dev scan of 1006 question docs found zero `"[]"` tokens in
real data).*

## Answer contract

**`FITB-02`** — `answer` has exactly 5 elements (`SCHEMA-ARR-01`): one correct value per
blank, in blank order (index 0 = first blank), padded with `""`. The number of non-empty
answer elements must equal the number of blank tokens. Multiple valid answers for one
blank: `|`-separated alternatives in that element (`"private|secret|discreet"`).
`enforced_by: validator` (length 5), `human-review` (blank-count match, alternatives).

## Renderer contract

Verified against app code 2026-07-15:

- `FillInTheBlank.kt` (`feature/watch/.../questions/ui/composables/FillInTheBlank.kt`):
  `expandMetadata()` flattens `metadata` into tokens — `isBlankSlot()` (`trim() == "[ ]"
  || trim() == "[]"`) becomes an input field (`DynamicTextInput`), anything else renders
  as static `BodyText`. A `"[ ]"` embedded inside a longer string is split out and *does*
  render as a blank (legacy-Maths tolerance) — but see the input-count mismatch below.
- `SubjectKeyboardType.kt` `inputCount()`: FITB input count =
  `metadata.count { it.trim() == "[ ]" }` — whole elements only, space form only.
- `PresentationComponent.kt`: the `question` string's `"[]"` placeholders are displayed
  as `"___"`; FITB shows an inline "Check" button (no auto-validate — the user must
  finish typing).
- Validation (`QuestionsValidator.kt`, FITB branch): per blank, in order;
  case-insensitive; trims; `,`→`.`; numeric normalization (`"540"` == `"540.00"`,
  `"2.5"` == `"2.50"`); `|` alternatives accepted per element. User must fill **all**
  blanks — answer count must equal blank count or the result is Incorrect.

**Failure modes when the contract is violated:**
- `metadata: []` → **zero input fields render, no error** — the question is a silent
  dead end (the bug class behind the enforcement chain in `core/persistence.md`).
- `"[]"` (no space) or an embedded `"[ ]"` → a blank renders, but the custom maths
  keyboard's `inputCount()` doesn't count it — input targeting breaks silently.

## Validator coverage

`tools/validate-questions.js` enforces: non-empty metadata (variable-length set),
5-element answer, split-token rule (embedded `"[ ]"` rejected), `"[ ]"`-only token form
(`"[]"` rejected), no `\n` in question. Human-review only: blank-count ↔ answer-count
match, `|` alternatives coverage, answer correctness.

## Worked example + pitfalls

```js
question: "Convert 2.5 hours to minutes: [] minutes",
metadata: ["2.5 hours = ", "[ ]", " minutes"],
answer: ["150", "", "", "", ""],
presentation: "fitb",
```

- **Time values** (`SCHEMA-TYPE-04`): never one `HH:MM` blank (no `":"` key) — split
  into two blanks: `metadata: ["HH", "[ ]", ":", "MM", "[ ]"]`.
- **Fractions** (`SCHEMA-TYPE-05`): never simulate a fraction with `"/"` in fitb —
  use `fraction` presentation.
- Only use fitb when the answer is a specific, matchable string (`DESIGN-ENG-04`);
  open-ended questions go to `multiple_choice`.
- Write answers in standard sentence case — matching is case-insensitive.
- **`metadata` label tokens must stay short — never restate the full `question`
  sentence.** Found live 2026-09-12 (History nov_p2 review): `FillInTheBlank.kt` renders
  its tokens in a single `Row` that **does not wrap** — a long label token either wraps
  internally into a tall multi-line `Text` (pushing the blank input off the visible
  screen entirely, unanswerable) or, if it comes after the blank, simply overflows
  off-screen unseen. The worked example above is the actual contract: `metadata`'s
  prefix/suffix tokens are a short residual label (`"2.5 hours = "`), never a duplicate
  of the full sentence already shown via `question`'s own `"[]"` → `"___"` rendering.
  Affected 6 of 7 `fitb` questions in the same review session, all sharing this one root
  cause — check every `fitb` metadata token against this before authoring more than one.
