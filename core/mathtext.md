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

## Planned for the next release: structural `_{…}` / `^{…}` markup

**`MATHTEXT-07`** — `enforced_by: validator` (valid to author; marks the exam `next-release` = dev-only)

Decision D4 (2026-10-03): sub- and superscripts will become structural MathText markup, parsed and
rendered by the same code as `\frac{}{}` / `\sqrt{}`:

| Markup | Renders as | Example |
|---|---|---|
| `x_{n}`, `H_{2}O`, `\log_{2}` | lowered subscript | `T_{n}`, `F_{net}` |
| `x^{2}`, `Fe^{3+}`, `10^{-3}` | raised superscript | `10^{14}` |

Why: Unicode has subscripts for only some letters (not `b c d f g q w y z`, `MATHTEXT-06`), has no
uppercase subscripts, and Chemistry/Physics/Maths all need arbitrary ones (`H₂O`, `Fe³⁺`, `Tₙ`, `log₂`).
A structural form also lets the answer be stored and compared exactly: a typed answer stores the
markup, and it is normalised before comparison (the keyboards gain sub/super mode keys, like `a/b`
today, that insert the markup and place the cursor).

**Status: planned for the next app release** (BLA-21 plan item 5d). It is not in any *released* build yet,
and the `MathText` parser on `dev` does not parse it yet (it handles `\frac{…}`, `\sqrt{…}` and canonical
`(a/b)` fractions; everything else is plain text) — so until the renderer change lands and is tagged, a
build would show `_{n}` literally, which is the 2026-09-10 failure below. The release number isn't known
until it's tagged, so for now:

- `MATHTEXT-06` stays **fully in force** for anything published, until a release ships the renderer.
- **`_{…}` / `^{…}` is valid to author now.** `validate-questions.js` accepts it and marks the question as
  depending on a planned capability, so the exam's derived minimum is `next-release` (no version number to
  give it yet). Such content is **dev-only**: `push-paper-to-prod.js` refuses to copy it to prod and
  `set-exam-gate.js` refuses `--min next`, until the release is tagged and its real version is entered in
  `core/app-feature-versions.md` (`VER-06`). Content added in the meantime goes to dev only.
