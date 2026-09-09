---
id: AMPM-CONTENT-DESIGN
type: guide
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [content, questions, design, variety, maths, math-lit, english]
provenance: moved from AMPM/ampm-ai-framework/content/design.md, 2026-07-15
---

# Authoring Principles

## Purpose

Defines the authoring rules for AMPM practice questions — concept independence,
self-containment, variety, and per-subject constraints. Apply these before finalising
any question set.

## Scope

All question authoring sessions, every subject. Subject-specific sections below apply per
the subject profile (`subjects/{profile}.md`).

---

## Universal Rules

### `DESIGN-UNI-01` — No exam content (freshness rule)

`enforced_by: human-review`

No number, name, scenario, quote, or dataset from the real exam paper appears in any
question. Questions test the same *skill* with a completely fresh scenario. This applies
equally to no-video uploads: the exam image is the worked example; the practice
questions are the independent exercise that follows — never a transcription.

### `DESIGN-UNI-02` — Self-contained questions

`enforced_by: human-review`

Each question must make complete sense on its own. No question may reference context,
values, or results from another question in the set.

### `DESIGN-UNI-03` — Distinct skills per video

`enforced_by: human-review`

No two questions in the same video may test the same underlying concept — even with
different numbers or a different scenario.

### `DESIGN-UNI-04` — No newlines in the `question` field

`enforced_by: validator`

The `question` field must be a single flat string. Never use `\n` or line breaks.
Supplementary data belongs in `clues` or `context_text`.

### `DESIGN-UNI-05` — True/False cap — 20% per paper

`enforced_by: validator` (per set), `human-review` (running paper-level count)

No more than 20% of all questions in a paper may use True/False `multiple_choice`.
A True/False question uses exactly two options: `metadata: ["True", "False", "", "", ""]`.
Appropriate for testing a single rule or fact — not for calculation, proof, or multi-step
reasoning. Check the running count before adding one.

### `DESIGN-UNI-06` — Correct answer not at index 0

`enforced_by: human-review` (see `SCHEMA-TYPE-06`)

For `multiple_choice`, the correct option must never be at `metadata` index 0. Index 0
is always a distractor. Place the correct answer randomly at index 1, 2, or 3.

### `DESIGN-UNI-07` — Variety rule

`enforced_by: validator`

| Question count in this video | Minimum distinct `presentation` types |
|---|---|
| 2 | 1 (same type allowed) |
| 3+ | 2 |
| 4+ | 3 |

Never make every question in a set `fitb`. *(Historically listed under "Maths and Math
Lit" only, but the validator enforces it on every set regardless of subject — resolved
against validator, 2026-07-15.)*

### `DESIGN-UNI-08` — Relational framing for classificatory/definitional content

`enforced_by: human-review`

For content whose underlying unit is a fixed fact, definition, or classification — not a
procedure with variable inputs — `DESIGN-UNI-01`'s freshness rule is not satisfied by
rewording alone. A procedural subject (Maths, Math Lit) gets genuine freshness from
varying the numbers: the student must redo the work. A **content-based subject**
(Geography, and any future subject of the same shape — Life Sciences, Chemistry,
History, …) doesn't: a differently-worded question that still tests one isolated fact
lets a student who memorized our version trivially answer the exam's version too, since
no new work was required to get there.

Prefer testing the *relationship* between two or more such facts instead: progression or
hierarchy ("what does A need to gain to become B"), cause/consequence, or application
requiring synthesis of ≥2 facts. This is genuine additional cognitive work, and — done
right — stays within the same curriculum scope as the exam rather than reaching into
peripheral content to manufacture novelty (see `DESIGN-UNI-09`: the curriculum document
is what tells you where that scope boundary actually is).

Worked example (`dbe-geography`, settlement classification): not "match each term to its
definition" (site, situation, hamlet, village as four isolated pairs — restates the
exam's own fact selection); instead "match each settlement type to what it must gain to
reach the next stage of the hierarchy" (isolated dwelling → hamlet → village → town) —
grounded in CAPS's own framing of settlement classification as a hierarchy driven by
gaining higher-order functions/services, not a set of static labels.

### `DESIGN-UNI-09` — Curriculum document required for content-based subjects

`enforced_by: human-review`

For content-based subjects (`DESIGN-UNI-08`), the official curriculum/syllabus document
(e.g. CAPS) must be available and actually consulted in the authoring session before
questions are written — not optional supporting material, a session blocker. `DESIGN-
UNI-08`'s relational framing depends on knowing the curriculum's own structure
(hierarchy, cause/consequence, what's in vs out of scope) well enough to avoid both
restating the exam and drifting into peripheral content the exam would never touch.
Procedural subjects (Maths, Math Lit) benefit from the same document but don't strictly
require it each session — `DESIGN-UNI-01` is satisfiable there through numeric variation
alone. English HL sits similarly — fresh extracts on the exam's own theme satisfy
freshness without needing the syllabus document consulted every session. Add the
curriculum document's path to the subject profile's Identity table once sourced (see
`dbe-geography.md`).

### `DESIGN-UNI-10` — Lesson/video granularity: bundle vs. split

`enforced_by: human-review`

Promoted from `dbe-physics.md`, 2026-09-10, after Physics re-derived this from scratch
through two wrong shapes on the same paper — the reasoning is subject-agnostic and every
subject was already following some instance of it without it being written down anywhere
general.

**The decision, in priority order:**
1. If an exam question's sub-parts share one continuous scenario/diagram/given-values
   set — later sub-parts build on earlier ones, or all reference the same figure —
   bundle them into **one lesson**. Splitting would fragment shared context a student
   needs (either duplicating the setup across lessons, or leaving a lesson unusable on
   its own).
2. Otherwise, if it's a block of independent items (e.g. an MCQ section, each item a
   fresh unrelated mini-scenario), **cluster by the exam's own thematic/topic ordering**
   — check the curriculum document's topic breakdown to confirm the clusters, don't just
   eyeball it — rather than defaulting to either one-lesson-for-the-whole-block (mixes
   unrelated topics into one video) or one-lesson-per-item (disproportionate
   curriculum-node/tag/image/script overhead for a single-mark item, and multiplies image-
   cropping work when several items share one exam page).
3. Never make the granularity finer than the content actually supports — a thin item
   doesn't need its own curriculum-node subtree and image crop unless nothing else groups
   it with related items.

**Existing instances, once you know to look for it:** Geography's "one video per exam
numbered subsection" (`dbe-geography.md`) is rule 2 taken to its finest natural grain,
since each Geography subsection is independently themed — there was no coarser cluster
to find. Maths bundling a top-level question's sub-parts into one lesson (e.g. 2019 Nov
P1 Q1's 1.1.1–1.2, all one algebra theme) is rule 1. Physics's Q1 MCQ block clustered by
CAPS knowledge area (`dbe-physics.md`) is rule 2 with a real cluster to find, and Q2–Q10
(each one continuous scenario) is rule 1.

### `DESIGN-UNI-11` — Practice-question count scales with bundled content

`enforced_by: human-review`

Promoted from `dbe-physics.md`'s `DESIGN-PHYS-06`, 2026-09-10. A lesson's practice-set
size should scale with how much real exam content it bundles (how many real sub-parts,
per `DESIGN-UNI-10` rule 1) — not default to a fixed count regardless. A lesson covering
one real sub-question and a lesson covering five need different amounts of practice; a
flat "2–4 and done" silently under-covers the latter (a real Physics case: a 5-sub-part
lesson shipped with only 4 practice questions and no practice at all for its
highest-mark sub-part).

**English HL's `DESIGN-ENG-05` section caps are an instance of this rule, not a separate
one** — 2–4 for narrow sections (Summary, Advertising, Media/Cartoons) vs. up to 7 for
content-dense ones (Comprehension, Language, Paper 3) is exactly "scale with bundled
content," just expressed as a per-section table instead of a per-lesson computation.
Rule of thumb for a bundled lesson without a subject-specific table: roughly one fresh
practice question per real exam sub-part (more for a heavily-weighted or multi-skill
sub-part), checked against the sub-part breakdown before deciding the set is complete —
not assumed from a flat default. A lesson covering only one real sub-part (rule 2's
single-item clusters) stays at the subject's normal narrow-case count.

### `DESIGN-UNI-12` — Typed-answer values must match what the keyboard can actually type

`enforced_by: human-review`

Promoted from `dbe-physics.md`'s `steps` correction, 2026-09-10. Any expected typed value
(`fitb` blank, `steps` blank, `equation` answer) must be composable entirely from the
characters the resolved keyboard can actually produce — checked against
`core/keyboard-input.md`, the central inventory sourced directly from the app's keyboard
components, not assumed per-subject. Two real, previously-shipped failures this caught:

1. A `steps` question asked for a full typed sentence (`"20 = 5(3.8 + r)"`) when the
   keyboard has no letters for variable names — unanswerable regardless of formatting.
2. A `steps` blank expected a plain negative number (`"-3"`), but
   `ScientificMathKeyboard`'s minus key emitted a different Unicode character (`−`, U+2212)
   than the validator's numeric parser recognized (ASCII `-`) — silently marking a
   correctly-typed answer wrong. Neither failure is visible in a render-only screenshot
   review; both require checking the *keyboard's* character set against the *answer's*
   characters, which is exactly what `core/keyboard-input.md` exists to make checkable
   without re-deriving it from app source every session.

---

## Maths and Math Lit — Additional Rules

### `DESIGN-MATH-01` — Answer numeric formatting

`enforced_by: human-review`

- Integer answers: never include decimal places — `"540"` not `"540.00"`
- Decimal answers: minimum decimal places — `"2.5"` not `"2.50"`
- No spaces as thousand separators in `answer` or `metadata` — `"12500"` not `"12 500"`
- Always use `.` as the decimal separator, not `,`

---

## Maths — Additional Rules

### `DESIGN-MATH-02` — Graph questions: always decompose

`enforced_by: human-review`

Do not test free-hand drawing. Break graph skills into sub-questions:
- x-intercept(s) → `fitb`
- y-intercept → `fitb`
- Turning point / vertex → `fitb`
- Axis of symmetry → `fitb`
- Domain or range → `fitb` or `multiple_choice`
- Identify graph shape / transformation → `multiple_choice`

### `DESIGN-MATH-03` — Trig equations: always constrain to an interval

`enforced_by: human-review`

Never ask for the general solution. Always specify an interval e.g.
`"solve for x ∈ [0°, 360°]"`. This tests the same skills without complex notation.

### `DESIGN-MATH-04` — Euclidean geometry proofs: decompose

`enforced_by: human-review`

Do not ask for a full written proof. Test with:
- "What is the reason for this step?" → `multiple_choice`
- Arrange proof steps → `ordering`
- Complete a missing step → `steps`
- Match statement to reason → `match`

### `DESIGN-MATH-05` — Expression answers

`enforced_by: human-review`

When the answer is an algebraic expression (e.g. f'(x), equation of a line):
- Prefer `multiple_choice` — provide 4 plausible expressions
- Use `equation` only when MCQ options would be too similar to distinguish without working

### `DESIGN-MATH-06` — Paper 2 variety requirements by topic

`enforced_by: human-review`

| Topic | Must include at least one of |
|---|---|
| Statistics | `multiple_choice` or `ordering` (not only `fitb`) |
| Analytical geometry | `fitb` for values + `multiple_choice` for classification |
| Euclidean geometry | `ordering` or `match` for proof steps/reasons |
| Trigonometry | `steps` or `multiple_choice` for identities; `fitb` for equation solutions |

---

## Math Lit — Additional Rules

### `DESIGN-ML-01` — FITB cap — 65% per paper

`enforced_by: human-review` (paper-level running count; not in the per-set validator)

Across all questions in the paper, no more than 65% may use `fitb` presentation. Check
the running count when designing each video.

### `DESIGN-ML-02` — Non-trivial answers

`enforced_by: human-review`

Do not construct scenarios where the answer is a suspiciously round number (e.g. exactly
R1 000, 50%). Choose input values that require real working — e.g. R1 236, 13.5%. Students
must calculate, not pattern-match.

### `DESIGN-ML-03` — Scope: stay within the question group

`enforced_by: human-review`

Do not carry over scenarios, named places, or data from any other question group in the
same paper — even if two groups share a theme.

---

## English HL — Additional Rules

### `DESIGN-ENG-01` — Theme rule

`enforced_by: human-review`

Keep the same topic/theme as that year's exam text. Fresh stimulus is independently
authored but stays in the same world — different sentences, different quotes, same theme.

### `DESIGN-ENG-02` — Structure rule

`enforced_by: human-review`

Each practice question mirrors the *type* of the corresponding exam sub-question — same
instruction style, same mark implication, same cognitive skill.

### `DESIGN-ENG-03` — `context_text` usage

`enforced_by: human-review`

Use `context_text` for short inline stimulus (1–3 fresh sentences) when the question
needs its own independent passage. Set to `null` when the question draws on
`supplementary_materials` texts or stands alone.

### `DESIGN-ENG-04` — `fitb` usage rule

`enforced_by: human-review`

Only use `fitb` when the answer is a specific, matchable string. Use `multiple_choice`
for open-ended questions ("explain the effect", "discuss", "comment on") — valid phrasings
are too varied to enumerate. When multiple valid answers exist, separate alternatives with
`|` in the answer element (e.g. `"private|secret|discreet"`). Write FITB answers in
standard sentence case — matching is case-insensitive.

### `DESIGN-ENG-05` — Section caps

`enforced_by: human-review`

This is English HL's instance of the general `DESIGN-UNI-11` principle
(practice-question count scales with bundled content) — a per-section table instead of
a per-lesson computation, because English's sections have a fixed, known shape session
to session.

| Section | Max questions |
|---------|--------------|
| Q1 — Comprehension | 7 |
| Q2 — Summary | 2–4 |
| Q3 — Advertising | 2–4 |
| Q4 — Media/Cartoons | 2–4 |
| Q5 — Using Language Correctly | 7 |
| Paper 3 — all sections | 7 per lesson |
