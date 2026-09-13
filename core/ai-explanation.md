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
  number: "1",      // the REAL exam's own sub-question number, exactly as printed
                     // ("1.1.1", "2.4", "3.3.2", or a bare "5" for a no-sub-part essay)
  marks: N,         // the REAL mark allocation from the memo — never null (AIEXP-08)
  clues: "...",     // see format rules below
  approach: "...",  // see format rules below
  solution: "...",  // see format rules below
}
```

**`AIEXP-08`** — `enforced_by: human-review`. Added 2026-09-13, after a Business Studies
review found `sub_questions` authored against the lesson's own fresh practice questions
instead of the real exam — corrected here as a rule for every subject, not just that one
paper.

`sub_questions[]` always corresponds **1:1 to the real exam's own numbered
sub-questions**, never to the lesson's fresh practice-question set. Concretely:

- `number` is the real exam's own sub-question number, exactly as the paper prints it
  (`"1.1.1"`, `"2.4"`, `"3.3.2"`; a bare `"5"` for an essay/proof question with no
  numbered sub-parts).
- `marks` is that sub-question's real mark allocation from the memo — always a number,
  never `null`.
- `clues`/`approach`/`solution` are a genuine, guided walkthrough of **that real
  sub-question**, derived from **the real memo's actual answer** — in your own words
  (never verbatim memo prose), but describing the real exam content, not the lesson's
  invented scenario.

**Why:** the practice questions in a lesson are freshly authored per `DESIGN-UNI-01` (new
numbers, new scenarios, new wording) so a student can't just memorize our version and
trivially pass the exam's own version. `aiExplanation` serves the opposite purpose: it is
the guided-solution companion to the *real* exam paper, so a student revising with the
real past paper and memo in hand gets clearer scaffolding on the real questions than the
bare memo bullet points give — the memo stays the ground truth; the "AI explanation" adds
guidance on top of it, never substitutes a different (fresh) question in its place. A
lesson's number of `sub_questions` entries is therefore driven by the real exam's own
sub-question count for that lesson, which will often differ from its fresh practice
question count — that's expected, not a mismatch to reconcile.

**This supersedes the "Generation process" section's old English-specific convention**
(`marks: null`, `number` = the practice question's own order) — that predates this rule
and does not apply to newly authored content in any subject, English included. English
HL's already-published `nov_p1`/`nov_p2`/`nov_p3` content was authored under the old
convention and has not been reconciled to this one; that is a separate future pass, not
retroactively fixed by this rule change.

Caught once already, before this rule existed: Life Science's Hominid Brain Volume lesson
had an `aiExplanation` entry grounded in its fresh practice question's fictional species
data instead of the real exam's actual species/values — flagged and fixed in that
session, but not generalized into a written rule until now. History's and Life Science's
own ledgers already independently followed something close to this convention (real
exam numbering, real marks) for their non-essay lessons without it being written down
anywhere general — this rule is that write-down, not a new behavior for those two.

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

**`AIEXP-07`** — `enforced_by: human-review`

The `ai_explanation` is generated **in the Claude Code upload session** by analysing the
real exam question and memo images/text directly. It is not fetched from an API at
runtime.

**For every subject, per `AIEXP-08`:**
1. Read the real exam question paper and the real marking guideline (memo) — required
   before writing a single `sub_questions` entry, not optional supporting material.
2. For **each of the real exam's own numbered sub-questions** covered by this lesson
   (not the lesson's fresh practice questions — those are a separate, independently
   authored set per `DESIGN-UNI-01`): derive `clues` (hint at the concept/method without
   revealing the answer), `approach` (2–4 steps to identify or derive it), `solution`
   (the real memo's actual answer, explained in your own words, numbered steps) —
   grounded in what the memo actually says for that real sub-question.
3. `number` = the real sub-question's own number exactly as printed (`"1.1.1"`, `"2.4"`,
   or a bare `"5"` for an essay with no numbered sub-parts). `marks` = its real
   allocation from the memo — always a number, never `null`.
4. Author as a JS constant in the upload script alongside `video` and `questions`.

**Superseded, do not follow for new work (`AIEXP-08`):** an earlier convention, used for
English HL's already-published content, set `marks: null` and numbered `sub_questions`
by the practice question's own order instead of the real exam's numbering. That content
has not yet been reconciled to the current rule (`AIEXP-08`) — a separate future pass,
not something this doc's rule change retroactively fixes.
