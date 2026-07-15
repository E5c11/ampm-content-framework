---
id: AMPM-CONTENT-PRES-MATCH
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-PRES-ORDERING]
tags: [presentation, match, columns, pairing]
---

# `match` — Column Matching

## Metadata contract

**`MATCH-01`** — `metadata` is variable-length (`SCHEMA-ARR-05`), exactly 2N elements,
no padding: first N = left column, last N = right column. Every element is prefixed
`"X - label"` (prefix, space-dash-space, label) — e.g. `"A - Net salary"`,
`"1 - Salary after deductions"`. Up to 8 elements (4 pairs) fits the screen comfortably.
`enforced_by: validator` (non-empty), `renderer` (prefix parsing), `human-review`
(2N split, prefix format).

## Answer contract

**`MATCH-02`** — `answer` is N elements, no padding: the correct pairings as
`"leftPrefix-rightPrefix"` strings, e.g. `"A-2"` (with or without spaces around the
dash — the app normalizes `" - "`/`" – "` to `"-"`). `enforced_by: validator`
(non-empty), `human-review` (pair validity).

## Renderer contract

Verified against app code 2026-07-15:

- `ColumnMatch.kt` (`feature/watch/.../questions/ui/composables/ColumnMatch.kt`): splits
  non-blank `metadata` in half — `take(halfSize)` left, `drop(halfSize)` right — and
  **shuffles each column** at render. Displays items with the prefix stripped. When one
  item is selected on each side, it builds `"leftPrefix-rightPrefix"` from the text
  before the `" - "` separator and checks it against the normalized `answer` set
  immediately: correct pairs lock green; wrong pairs flash red for 800 ms and trigger an
  XP penalty (`onWrongMatch`). Auto-submits once every left item is matched.
- Validation (`QuestionsValidator.kt`): set comparison of normalized pair strings,
  case-insensitive.

**Failure modes:**
- Odd metadata count → the half-split misassigns an element to the wrong column.
- A malformed prefix (missing `" - "`) → the built pair string never matches; that pair
  is permanently un-matchable, no error.
- An answer pairing that references a prefix absent from metadata → same silent
  dead end.

## Validator coverage

Enforces: non-empty metadata and answer only. Human-review only: 2N element count,
`"X - label"` prefix format on every element, every answer pair resolvable from the
prefixes, each right item used exactly once.

## Worked example + pitfalls

```js
question: "Match each term to its definition.",
metadata: [
  "A - Gross salary",
  "B - Net salary",
  "1 - Salary after deductions",
  "2 - Salary before deductions",
],
answer: ["A-2", "B-1"],
presentation: "match",
```

- Left prefixes are letters, right prefixes numbers, by convention — the renderer only
  needs them distinct within their column.
- The student gets immediate per-pair feedback (wrong flash + XP penalty), so
  near-duplicate right-column labels make the question a guessing game — keep
  definitions clearly distinguishable.
- Good fit for statement↔reason in Euclidean geometry (`DESIGN-MATH-04`).
