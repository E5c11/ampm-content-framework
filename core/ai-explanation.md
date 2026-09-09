---
id: AMPM-CONTENT-AI-EXP
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-MATHTEXT]
tags: [content, ai-explanation, clues, approach, solution, postgres]
provenance: moved from AMPM/ampm-ai-framework/content/ai-exp.md, 2026-07-15
---

# AI Explanation Rules

## Purpose

Defines the `ai_explanation` field structure, formatting rules for `clues`, `approach`,
and `solution`, and the process for generating explanations during upload sessions.

## Scope

All upload sessions, every subject. The `aiExplanation` block is authored **once per
lesson** (alongside `video` and `questions` in the upload script), not per question. Its
`sub_questions[]` become `lesson_ai_explanation_sub_questions` rows; the summary fields
(`model`, `generated_at`, …) become `lessons.ai_*` columns —
`tools/lib/content-rows.js` does the mapping. (Per-question `clues` on maths questions
follow the same `clues` format rules below.)

---

## Document Structure

**`AIEXP-01`** — the `ai_explanation` object carries exactly this shape.
`enforced_by: human-review` (structure), `validator` (`--ai-exp` mode checks
`sub_questions` entries)

```js
const aiExplanation = {
  sub_questions: [
    // one entry per exam sub-question (maths/math_lit)
    // or one entry per practice question (english)
  ],
  model: 'claude-sonnet-5',   // the model actually used this session
  generated_at: Date.now(),
  version: 2,              // always an integer
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};
```

---

## `sub_questions` entry structure

**`AIEXP-02`** — `enforced_by: validator` (`--ai-exp` mode: `number`/`marks` presence,
format rules below)

```js
{
  number: "1",      // sub-question number as a string ("1", "2", "1.1", etc.)
  marks: N,         // mark allocation as a number — null for English questions
  clues: "...",     // see format rules below
  approach: "...",  // see format rules below
  solution: "...",  // see format rules below
}
```

---

## Format rules

### `clues`

**`AIEXP-03`** — `enforced_by: validator` (bullet prefix, max count, trailing newline,
answer-leak nudge), `human-review` (hint-not-solution, final call)

- Bullet list: `"- text\n- text"`
- 1–3 bullets
- Each bullet starts with `"- "` (dash space)
- Bullets separated by `"\n"` — no trailing newline
- **Points toward method or technique only** — do not solve the question, compute the
  final value, or state the answer. This applies equally to the per-question `clues`
  field on `fitb`/`calc`-type questions and, for `multiple_choice` **definitional**
  questions ("what is this called?"), to **naming the correct term while explaining
  it** — defining the concept in order to hint at it is exactly how the answer leaks,
  since the definition usually *is* the term.
- Set to `null` only if no meaningful hint can be given

```
✅ "- Use the compound interest formula\n- Convert the rate to a decimal first"

❌ "- Substitute A = 1200, r = 0.085, n = 3 to get R1 530.67"  // solves the question
❌ "Use the compound interest formula\nConvert the rate first\n"  // missing prefix, trailing newline

❌ "- Period of cos 2x = 360° ÷ 2 = 180°."  // computes and states the final answer
✅ "- The standard period of cos x is 360°.\n- Multiplying x by 2 divides the period by the same factor."

❌ "- The informal sector is defined by being unregistered and untaxed."  // names the
   // correct MC option ("The informal sector") while "explaining" it — student just
   // pattern-matches the term against the visible options, no reasoning required
✅ "- Think about whether this business is registered with government and pays tax on
   what it earns.\n- The scenario doesn't fit the formal-sector definition."
```

*Found in production data 2026-09-09 (audited maths and geography live content — 7 of
144 maths questions and 3 of 51 geography questions with `clues` set had this leak,
undetected since enforcement was human-review-only): a bare computed number ("= 51.",
"= 180°") or a defining sentence that names the exact correct term is the two recurring
patterns. `tools/validate-questions.js` now flags (⚠, non-blocking) any `clues` field
that contains one of the question's own `answer[]` values verbatim — treat every hit as
a rewrite, not a false positive, unless the match is clearly coincidental (e.g. a short,
generic number that also appears for an unrelated reason).*

### `approach`

**`AIEXP-04`** — `enforced_by: validator` (bullet prefix, 2–4 count)

- Same bullet format as `clues`
- 2–4 bullets
- Describes the step-by-step strategy for solving — more specific than `clues`

```
✅ "- Identify the principal amount and annual interest rate\n- Convert the rate to decimal (÷ 100)\n- Substitute into A = P(1 + r)^n"
```

### `solution`

**`AIEXP-05`** — `enforced_by: validator` (first line must be a numbered step),
`human-review` (completeness)

- Numbered steps: `"1. text\n2. text\n3. text"`
- Each step starts with `"N. "` (number dot space)
- Steps separated by `"\n"` — no trailing newline
- For English: include the correct answer and explain why distractors are wrong

```
✅ "1. A = P(1 + r)^n\n2. A = 1200(1 + 0.085)^3\n3. A = 1200 × 1.277...\n4. A ≈ R1 532.52"
```

### No markup support at all in `clues`/`approach`/`solution` — different renderer than `questions`

**`AIEXP-06`** — `enforced_by: human-review`

`lesson_ai_explanation_sub_questions.clues/approach/solution` render through
`AiExplanationSheet.kt`'s `ExplanationSection` (`core/designsystem`), which is plain
Compose `Text()`/`BulletLine`/`NumberedLine` — **no `MathText` component at all**. This is
a different renderer from `questions.clues` (which does use `MathText`, via
`CluesBottomSheet`/`CluesDialog` in `PresentationComponent.kt`) and from
`questions.metadata` (`StepsPresentation.kt`, also `MathText`). Confirmed by reading the
composable source directly, 2026-09-10, after `\frac{}{}` was mistakenly added to this
table (copying the `questions`-table fix) and would have rendered as literal broken text
— worse than the plain `/` it was meant to replace. Caught and reverted before it shipped.

- **Never use `\frac{}{}` or `\sqrt{}` here** — `MATHTEXT-01`/`02` don't apply to this
  table; there is no structural-markup renderer at all. A plain `/` for division is fine
  (reads as informal notation in prose, unlike `\frac{}{}` showing up as literal text).
- **Unicode subscript/superscript characters are fine** — `core/mathtext.md`'s
  `MATHTEXT-06` still applies here, since those are just plain Unicode glyphs with no
  markup processing required; `Fₙₑₜ`, `Eₖ(max)`, `vᵢ` etc. render correctly through plain
  `Text()` the same as through `MathText()`.
- If this table ever needs real structural fractions, that's a renderer change
  (`ExplanationSection` would need `MathText`), not a content-authoring workaround.

---

## Generation process

**`AIEXP-06`** — `enforced_by: human-review`

The `ai_explanation` is generated **in the Claude Code upload session** by analysing
question and memo images directly. It is not fetched from an API at runtime.

**For maths and math_lit:**
1. Read the exam question image and memo image
2. For each sub-question: derive `clues`, `approach`, and `solution` from the worked memo solution
3. Author as a JS constant in the upload script alongside `video` and `questions`

**For English:**
1. Read the exam memo (marking guideline) for the real exam question the practice
   questions are grouped under, to see how DBE frames the expected reasoning/answer for
   this skill or device — practice questions are freshly authored (`DESIGN-UNI-01`), but
   `clues`/`approach`/`solution` should still be derived from the memo's reasoning style,
   not from the practice answer in isolation
2. For each practice question: derive `clues` (hint toward the rule or device), `approach`
   (how to identify or apply it), `solution` (correct answer + why distractors are wrong)
3. Set `marks: null` for all English questions — practice questions carry no real exam
   mark allocation
4. Set `number` to the practice question order as a string (`"1"`, `"2"`, `"3"`)
