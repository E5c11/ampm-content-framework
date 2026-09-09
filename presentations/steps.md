---
id: AMPM-CONTENT-PRES-STEPS
type: reference
layer: presentations
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-PRES-FITB, AMPM-CONTENT-PRES-EQUATION]
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
  **case-sensitive, no alternatives**. Numeric blanks get the same tolerance as `fitb`
  (comma→period, `"9.8"` == `"9.80"`, `"540"` == `"540.00"` — via
  `normalizeNumericString`) — added 2026-09-09 specifically so `steps` is usable for
  physics's numeric multi-step calculations, not just Maths's symbolic proof completion.
  A non-numeric blank value passes through unchanged, so symbolic steps (trig identities,
  geometry proof reasons) are unaffected and still require exact-string match.

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

**Before writing any expected blank value, check `core/keyboard-input.md`
(`DESIGN-UNI-12`)** for exactly which characters the resolved keyboard can produce —
don't assume. A `steps` blank the student cannot physically type is unanswerable
regardless of how well-scaffolded the surrounding rows are.

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

**Consecutive blanks with nothing given between/around them are a real defect, not just
a style choice** (caught 2026-09-10: all 5 physics `steps` questions shipped with only
`metadata[0]` given and every remaining row `"[ ]"` — 2-3 blanks in a row, no anchor. The
student sees a bare "Enter answer" box with zero indication of what to type or in what
format; several expected answers were also full algebraic sentences like `"20 = 5(3.8 +
r)"` requiring character-exact reproduction, which is effectively unanswerable). Prefer
**one blank per question, at the end**, matching the pre-existing Maths precedent (`"Determine
f′(x) from first principles..."`, four given rows then one trailing blank worth `"3"`) —
show the *entire* derivation as given/read-only rows and ask only for the final,
well-defined result. This still teaches the method (the student reads every step) without
demanding they reproduce your exact phrasing of an intermediate algebraic manipulation,
which rarely has one canonical written form even when the *value* is unambiguous.

**Keep the blank numeric to get tolerance, not exact-match.** `QuestionsValidator.kt`'s
numeric tolerance (`normalizeNumericString`) only fires when the *entire* blank value
parses as a number — `"0.2"` gets it, `"r = 0.2 Ω"` does not (mixed text/number strings
fall through to exact-string match). Split the label and unit into their own given rows
around the blank, same trick as `fitb`'s `DESIGN-PHYS-02` unit-placement rule:
```js
metadata: ['ε = I(R + r)', '20 = 5(3.8 + r)', 'r =', '[ ]', 'Ω'],
answer: ['0.2'],
```
For scientific notation, pre-factor the exponent into the trailing given row (same
convention several physics `fitb` answers already use) so the blank is still a bare
coefficient:
```js
metadata: ['ΔE = E_a − E_b', '...', 'f =', '[ ]', '× 10¹⁴ Hz'],
answer: ['7.54'],
```
