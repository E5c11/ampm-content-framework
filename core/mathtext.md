---
id: AMPM-CONTENT-MATHTEXT
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN]
tags: [content, markup, fractions, sqrt, maths, math-lit]
provenance: moved from AMPM/ampm-ai-framework/content/mathtext.md, 2026-07-15
---

# MathText Markup Syntax

## Purpose

Defines the markup syntax used in question strings and metadata option strings to render
fractions and square roots structurally. Apply when authoring any maths or math_lit
question content.

## Scope

`question` strings and `metadata` option strings for `maths` and `math_lit` questions.
Not used for `english_hl`.

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
