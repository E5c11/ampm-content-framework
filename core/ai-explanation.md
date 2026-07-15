---
id: AMPM-CONTENT-AI-EXP
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-PIPELINE]
tags: [content, ai-explanation, clues, approach, solution, firestore]
provenance: moved from AMPM/ampm-ai-framework/content/ai-exp.md, 2026-07-15
---

# AI Explanation Rules

## Purpose

Defines the `ai_explanation` field structure, formatting rules for `clues`, `approach`,
and `solution`, and the process for generating explanations during upload sessions.

## Scope

All upload sessions for `maths_questions`, `math_questions`, and `english_questions`.
The `ai_explanation` is authored on the **video document**, not on individual question
documents. (Per-question `clues` on maths questions follow the same `clues` format
rules below.)

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
  model: 'claude-sonnet-4-6',
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

**`AIEXP-03`** — `enforced_by: validator` (bullet prefix, max count, trailing newline),
`human-review` (hint-not-solution)

- Bullet list: `"- text\n- text"`
- 1–3 bullets
- Each bullet starts with `"- "` (dash space)
- Bullets separated by `"\n"` — no trailing newline
- **Points toward method or technique only** — do not solve the question or state the answer
- Set to `null` only if no meaningful hint can be given

```
✅ "- Use the compound interest formula\n- Convert the rate to a decimal first"

❌ "- Substitute A = 1200, r = 0.085, n = 3 to get R1 530.67"  // solves the question
❌ "Use the compound interest formula\nConvert the rate first\n"  // missing prefix, trailing newline
```

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
1. Read each practice question and its correct `answer`
2. Derive `clues` (hint toward the rule or device), `approach` (how to identify or apply it),
   `solution` (correct answer + why distractors are wrong)
3. Set `marks: null` for all English questions
4. Set `number` to the practice question order as a string (`"1"`, `"2"`, `"3"`)
