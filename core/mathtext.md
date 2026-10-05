---
id: AMPM-CONTENT-MATHTEXT
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS]
tags: [content, markup, fractions, sqrt, subscript, maths, math-lit, physics]
provenance: moved from AMPM/ampm-ai-framework/content/mathtext.md, 2026-07-15
---

# MathText Markup Syntax

## Purpose

Defines the markup syntax used in question strings and metadata option strings to render
fractions and square roots structurally, and the rule for subscripts (`MATHTEXT-06`).
Apply when authoring any maths, math_lit, or physics question content.

## Scope

`question` strings and `metadata` option strings for `maths`, `math_lit`, and `physics`
questions. Not used for `english_hl`. Extended to `physics` 2026-09-10 — see
`MATHTEXT-06`, added the same day after physics content shipped with unrendered
underscore-as-subscript notation (`F_net`, `p_i`, …) throughout, caught by direct user
review ("this looks like unrendered LaTeX, not what a student would see in a textbook").
The gap existed because this doc's scope was never extended past maths/math_lit before
physics was authored — `dbe-physics.md` had flagged this as an open item but content
shipped before it was acted on. Extend this scope *before* authoring a new subject's
content, not after.

---

## Supported Markup

| Markup | Renders as | Example |
|---|---|---|
| `\frac{num}{denom}` | Stacked fraction with dividing line | `\frac{3}{4}`, `\frac{x+1}{x-1}` |
| `\sqrt{content}` | √ with overline spanning content | `\sqrt{2x+1}`, `\sqrt{b^2 - 4ac}` |
| Nested | Fraction inside fraction | `\frac{\frac{1}{2}}{3}` |

Plain text, Unicode symbols (×, ÷, ≤, π, θ, ²) and superscripts pass through as-is.

---

## Rules

- **`MATHTEXT-01`** — never use plain `/` for fractions that need structural display —
  e.g. `(x+1)/2` → `\frac{x+1}{2}`. `enforced_by: human-review`
- **`MATHTEXT-02`** — never use bare `√` without braces — `√2x+1` is ambiguous →
  `\sqrt{2x+1}`. `enforced_by: human-review`
- Simple numeric fractions in non-mathematical contexts (e.g. `exam_weight: 1`) do not
  need markup.
- **`MATHTEXT-03`** — `answer` strings use the canonical serialization format (see
  `AMPM-CONTENT-SCHEMA` `SCHEMA-TYPE-03`), not markup. `enforced_by: human-review`

---

## `steps` questions: no markup in `question` field

**`MATHTEXT-04`** — `enforced_by: validator, renderer`

The `question` field for a `steps` question must be a plain instruction only. Never embed
`\frac{}{}` or `\sqrt{}` in it.

The mathematical expression the student starts from belongs in `metadata[0]` as the first
given step. Putting it in `question` duplicates it and breaks the renderer.

```js
// ✅ Correct
question: "Prove the identity. Complete the missing steps:"
metadata: [
  "LHS = sin²θ + cos²θ - 2cos²θ",  // starting expression in metadata[0]
  "[ ]",
  "= 1 - 2cos²θ",
  "= RHS ✓"
]

// ❌ Wrong — markup in question field
question: "Prove that \\frac{sin²θ}{1} + cos²θ - 2cos²θ = ..."
```

---

## `fitb` and `steps`: split-token rule

**`MATHTEXT-05`** — `enforced_by: validator, renderer`

`"[ ]"` (with a space inside) must always be its own array element in `metadata`. Never
embed it inside another string.

```js
// ✅ Correct
metadata: ["x = ", "[ ]"]

// ❌ Wrong — embedded in label string
metadata: ["x = [ ]"]
```

The app renders label strings as static text and `"[ ]"` elements as input fields.
Embedding `[ ]` inside a label string causes it to render as literal text — and the
keyboard input count is derived from the blank tokens, so an embedded blank also means
a missing input. Full renderer contract: `presentations/fitb.md` and
`presentations/steps.md` (bootstrap Phase 2).

---

## Subscripts: never use `_` — Unicode subscript char, or parentheses

**`MATHTEXT-06`** — `enforced_by: human-review`

There is no structural subscript markup (no `\sub{}` — unlike `\frac{}{}`/`\sqrt{}`, the
renderer does not convert anything to a subscript). An ASCII underscore (`F_net`, `p_i`)
is never converted either — it passes through and renders as a literal underscore
character, which reads as broken/unrendered markup to a student, not a subscript
(confirmed live, caught 2026-09-10 on a physics `steps` question: `"F_net·Δt = p_f −
p_i"` rendered exactly as typed, underscores and all).

Two correct options, chosen per identifier:

1. **A real Unicode subscript character**, when every letter/digit in the subscript has
   one — these render as true small lowered glyphs, no markup needed (already used
   correctly and confirmed rendering fine: `vᵢ`, `μₛ`, `Q₁Q₂`). Digits `₀`–`₉` are always
   available. Latin letters available as Unicode subscripts: `a e h i j k l m n o p r s t
   u v x` (lowercase form used regardless of the source letter's case — Unicode has no
   separate upper-case subscript glyphs). **Not available: `b c d f g q w y z`.**
   Multi-letter subscripts work by concatenating the individual glyphs, e.g. `net` →
   `ₙₑₜ`, `rms` → `ᵣₘₛ`, `max` → `ₘₐₓ` — but only if *every* letter in the subscript is on
   the available list.
2. **`Variable(subscript)` in plain parentheses**, when any letter in the subscript is
   *not* on that list — e.g. `p_f` (final momentum) → `p(f)`, since `f` has no Unicode
   subscript form. Don't partially subscript (`pf` with only some letters lowered) and
   don't leave the underscore in — parentheses read as deliberate notation, an underscore
   reads as an error.

```js
// ✅ Correct — every letter available
"F_net" → "Fₙₑₜ"
"V_rms" → "Vᵣₘₛ"
"p_i"   → "pᵢ"

// ✅ Correct — 'f' has no Unicode subscript, so parenthesize instead
"p_f" → "p(f)"
"v_f" → "v(f)"

// ❌ Wrong — renders as a literal underscore, reads as broken markup
"F_net", "p_i", "v_f"
```

A parenthetical qualifier that was never meant to be a subscript (e.g. `E_k(max)`'s
`(max)`) stays exactly as parenthetical text — only the `k` needs the Unicode-subscript
treatment: `Eₖ(max)`.

---

## Planned for the next release: sub/superscripts — plain forms and `_{…}` / `^{…}`

**`MATHTEXT-07`** — `enforced_by: validator` (valid to author; marks the exam `next-release` = dev-only)

Decision D4 + D16 (2026-10-03/04): MathText renders raised and lowered text, in question text, option text, feedback
and given steps, **and live in the equation/steps answer input**. Built in AMPM initiative 4b, merged to `dev`,
verified on the emulator, **not yet in a released build**. Accepted forms:

| Form | Renders | Example |
|---|---|---|
| `^` / `_` + optional minus + **a number or exactly one letter** | raised / lowered | `3^x`, `x^n`, `2^15`, `x^-2`, `x_1`, `T_n` |
| `^(…)` / `_(…)` (balanced parentheses; the outer parentheses are dropped) | raised / lowered group | `x^(n−1)`, `(1 + i)^n`, `3^(2x)`, `x^(−1/3)` |
| `^{…}` / `_{…}` (balanced braces) | raised / lowered group | `H_{2}O`, `Fe^{3+}`, `10^{-19}`, `F_{net}` |

Anything that matches none of these (a trailing `^`, an unbalanced group) stays literal text. Exponent/subscript
contents are plain text — a fraction inside one shows as `1/3`, not stacked. Checked against real content first:
prod has 9 rows using a caret in exactly these forms (`3^x`, `x^n`, `(1 + i)^n`, `x^(n−1)`, `x^(−1/3)`, `3^(2x)`) and
none using an underscore.

**`MATHTEXT-08`** — `enforced_by: validator` — **plain `_` takes ONE letter or number.** `F_net` would lower only the
`n` and print `et` at full size (`Fₙet`, confirmed on the emulator). Write `F_{net}`. The validator errors on `_` followed
by two or more letters in `maths` / `math_lit` / `physics` text.

**Typed answers.** The answer input renders the same forms while typing in the equation/steps input, **and in a `fitb` box when a
custom keyboard is active** (AMPM `dev`, unreleased: `5^x`, `H_{2}O`, `Fe^{3+}` are drawn raised/lowered; answers with no `^`/`_`
look exactly as before). On a released build a `fitb` box is a plain text field and shows the raw characters. Marking compares a
**canonical** spelling of both sides: `^{x}` and `^x` become `^x`; `^{n-1}`, `^(n-1)` and `^(n−1)` become `^{n-1}`; the same
for `_`; U+2212 becomes `-` inside scripts (`canonicalizeScripts`). So `5^x` equals `5^{x}` and `x^(n-1)` equals `x^{n-1}`.

**Status and what it means for authors.** No *released* build parses `_` or `^{…}`, so a plain `_` or a brace form shows
literally there — the 2026-09-10 failure below. Plain `^` already reads fine unrendered, so it does **not** raise an
exam's minimum. The brace forms and plain `_` are `NEXT` (dev-only until the release is tagged, `VER-05`); `MATHTEXT-06`
stays in force for anything published. When it ships, replace `NEXT` with the real version in
`tools/lib/feature-versions.js` and `core/app-feature-versions.md` (`VER-06`) and rewrite `MATHTEXT-06`.

---

## Where MathText renders — and which subscript rule applies (added 2026-10-05)

From the Physical Sciences 2024 retrofit (verified on the emulator, AMPM `dev`).

**`MATHTEXT-09`** — `enforced_by: human-review` — **Fields that render MathText** (so `\frac`, `\sqrt`, `^`/`_` forms work in them): the
`question` text, `metadata` (including `fitb` row labels and `steps` given rows), `multiple_choice` / `multi_select` option text, and the
`fitb` answer box (custom keyboard only). **Fields that do NOT:** `clues` and the AI explanation (`approach`, `solution` — the AI-explanation
sheet is a plain `Text`). Never author markup in those two; a subscript there is a Unicode glyph or the `Variable(subscript)` parenthetical
(`MATHTEXT-06`). Consequence: a given step may read `p_{f}` while the matching solution reads `p(f)` — that is expected, not a defect.
A `fitb` row label only renders markup from the next release (AMPM `dev` e3e3fac0d; before it a label such as `λ_{L} =` showed raw `_{L}`).

**`MATHTEXT-10`** — `enforced_by: human-review` — **Scripts inside `\frac{…}{…}` and `\sqrt{…}` are supported** (the parser descends into their
arguments; `\frac{v}{λ_{L}}` and `\frac{V_{R1}}{I}` verified on a device).

**`MATHTEXT-11`** — `enforced_by: human-review` — **Which subscript rule applies (precedence of `MATHTEXT-06` vs `-07`):**
- **New content** for an exam that will be dev-only / `next-release` anyway (it declares a `physics`/`chemistry` keyboard or uses any other `NEXT` feature):
  write **every subscript in typed-question given text as `_{…}`** — one rule, renders consistently, and covers multi-letter subscripts
  (`net`, `R1`) that Unicode cannot (`Fₙₑₜ` works but `p_f` / `V_R1` do not exist as glyphs).
- **Content that must work on a released build** keeps `MATHTEXT-06` (Unicode glyph, else `Variable(subscript)`): a released build prints `_{…}` literally.
- **Unicode subscripts stay valid** in any question that needs no markup, and **are not mass-converted**: published prod content cannot render markup and
  conversion is churn. Only convert a Unicode subscript when it sits on the **same line** (same `metadata` element / same string) as a `_{…}` you add, so no
  line mixes `pᵢ` with `p_{f}`.
- Parenthetical qualifiers that were never subscripts (`Eₖ(max)`, `m(Zn)`, `c(Na₂CO₃)`) stay as they are.
- **Answers:** a number stays a bare mantissa (`2.33`) with the power of ten in the given label (`" × 10⁻⁷ C"`) — marking a number is numeric-tolerant, marking
  `^{…}` markup is canonical-string only. Use `^{…}` / `_{…}` in an *answer* only for a symbolic / exact-string answer (a formula, a charge, a unit).
- TODO (open): when the release is tagged, `MATHTEXT-06` is rewritten (`VER-06`); decide then whether existing Unicode-subscript content is converted.
