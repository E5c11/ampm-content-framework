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

### `DESIGN-UNI-02` — Self-contained questions (default)

`enforced_by: human-review`

Each question must make complete sense on its own. No question may reference context,
values, or results from another question in the set. This is the default for every
lesson; `DESIGN-UNI-13` names the one narrow, opt-in exception and how to invoke it.

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

### `DESIGN-UNI-06` — Correct answer at index 0 capped, not banned — revised 2026-09-12

`enforced_by: human-review` (running paper-level count is on the author — same pattern
as `DESIGN-UNI-05`'s True/False cap; a single lesson's small question set is too small a
sample to check a percentage against, so this is tracked across the whole paper, not
per-set)

**Previously an absolute rule ("never at index 0") — loosened, not tightened.** Founder
call 2026-09-12: students figure out a pattern like "the first option is always wrong"
just as readily as they'd figure out any other tell, so a hard ban trades one
exploitable pattern for another, equally exploitable one. The fix is a **skewed
distribution, not a ban**: across a paper, the correct `multiple_choice` option should
land at `metadata` index 0 no more than **~10% of the time**, with the remaining ~90%
distributed across indices 1–3. Placing it at index 0 occasionally is now correct
behavior, not a defect — don't "fix" an index-0 correct answer on sight the way the old
rule implied; check the running count for the paper first.

This was already anticipated once, then went stale: `tools/validate-questions.js` has
carried a `// Answer position distribution (index 0 max 10%)` comment since before this
revision, deferring enforcement to a tool named `audit-firestore-questions.js` — which
does not exist anywhere in this repo or its history (a Firestore-era reference that
outlived the Firestore pipeline itself — this repo's authoring tooling moved off
Firestore onto Cloud SQL Postgres directly, see `workflows/archive/
repoint-authoring-to-postgres.md`). Nothing was actually checking this. No such tool
exists yet for Postgres either — this
remains a human-tracked running count per paper until one is built, exactly like
`DESIGN-UNI-05`'s own paper-level tally.

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

**Superseded in part by `DESIGN-UNI-14` (2026-10-14):** a lesson never exceeds 5 practice questions, so scale by splitting into more lessons rather than growing the set.

**The language subjects' section caps (`LANG-CAP-01`, formerly `DESIGN-ENG-05`) are an instance of this rule, not a separate
one** — 2–4 for narrow sections (Summary, Advertising, Media/Cartoons) vs. up to 7 for
content-dense ones (Comprehension, Language, Paper 3) is exactly "scale with bundled
content," just expressed as a per-section table instead of a per-lesson computation.
Rule of thumb for a bundled lesson without a subject-specific table: roughly one fresh
practice question per real exam sub-part (more for a heavily-weighted or multi-skill
sub-part), checked against the sub-part breakdown before deciding the set is complete —
not assumed from a flat default. A lesson covering only one real sub-part (rule 2's
single-item clusters) stays at the subject's normal narrow-case count.

### `DESIGN-UNI-14` — Lesson size: 3–4 practice questions, 5 at most

`enforced_by: validator` (`tools/validate-questions.js`: **error above 5, warning at 5**)

Added 2026-10-14 (owner decision). The app gates the next exam question behind finishing a lesson's practice set, so a lesson is a
short, finishable unit — not a chapter. **A lesson has 3–4 practice questions. Five is allowed only when a concept would otherwise go
uncovered; more than five is never allowed.** If a real exam question needs more practice than that, the answer is *more lessons*,
not a bigger set: split along the exam's own subsections and themes (`DESIGN-UNI-10`, Geography's one-lesson-per-subsection is the
model), and let each lesson carry only its slice of the real sub-questions in its AI explanation (`AIEXP-08`, numbering stays the real exam's). **`DESIGN-UNI-17` makes the split mandatory whenever the question's skills do not all fit.**

- **No new exceptions.** There is no allowlist and no per-subject carve-out for new papers. Every new paper follows this rule.
- **The one pre-existing exception is the language caps (`LANG-CAP-01`, up to 7)**, kept only because it predates this rule; the
  validator uses 7 as the ceiling for `english_hl`, `english_fal` and `afrikaans_fal`. It is not a precedent.
- **Supersedes the "one practice question per real sub-part" rule of thumb in `DESIGN-UNI-11`.** One fresh question can cover a concept
  the real paper spreads over several 1-mark items; the practice set covers *concepts*, not a 1:1 copy of the sub-parts.
- **Older content is non-compliant and must be redone** (decision 2026-10-14): Business Studies, History, Life Sciences, Physics and
  Geography lessons above the ceiling, and the first Economics paper. Re-running an old script now fails validation by design.
  Redoing *live* lessons needs a migration plan first — lesson ids are derived from the lesson's name/order, so re-splitting changes
  ids and strands user progress.

### `DESIGN-UNI-15` — Ordering items must not give their own position away

`enforced_by: validator` (`tools/validate-questions.js`, error), `human-review` (the subtler cases), `tooling` (`tools/audit-answer-cues.js`)

Added 2026-10-14 after the Economics essay lessons shipped `ordering` questions whose items were labelled "Introduction …", "Main part: …",
"Additional part: …" and "Conclusion …". The label *is* the answer: the student sorts by the word, not by what they know. An `ordering` item
describes **what the part contains or does**, never **where it goes**.

- **No positional or structural labels in an item**: `Introduction`, `Conclusion`, `Body`, `Main part`, `Additional part`, `Opening`, `Closing`,
  `First`, `Finally`, `Lastly`, `Start with`, `End with`, `Step 1`, `1.`. (`ORDERING_LABEL` in `tools/lib/answer-cues.js`.)
- **Essay-plan ordering** (`DESIGN-BUS-03`, `DESIGN-HIST-02`, `DESIGN-ECON-06`): write the items as the *content* of each part —
  "A definition of the main concept", "Explained points on each market", "An evaluation with positives and negatives",
  "A judgement that adds something new" — so the student must know the essay structure to place them.
- **Also avoid** items that only differ by an obvious sequence word ("then", "afterwards", "next") — the same giveaway in prose.
- Every other ordering rule still applies (`ORD-01`: store the items scrambled).

### `DESIGN-UNI-16` — The correct option must not stand out by length or position

`enforced_by: validator` (per question, error) + `tooling` (paper level, `tools/audit-answer-cues.js`) + review (`review-paper.md` Phase 3)

Added 2026-10-14. Students learn quickly that "the long answer is the right one" and, for `multi_select`, that "the first few are right" — and the
app does **not** shuffle `multiple_choice` or `multi_select` options (stored order is shown). An audit of the two Economics papers found the
correct option was the **longest in ~50% of the multiple_choice questions** (chance is 25%) and the correct options were **always the first N** in
every `multi_select`. Both are authoring defects, not style.

1. **Length (multiple_choice).** Write the correct option and the distractors at **similar length (within about ±20%) and the same grammatical
   shape**. The correct option must not be longer than the longest distractor by ≥ 25% **or** ≥ 25 characters (validator error). Across a paper the
   correct option may be the strictly longest in **at most 30%** of its multiple_choice questions (`LONGEST_RATE_CAP`; chance is 25% — a paper where
   it is *never* the longest is also a cue, aim for ~20–30%). Fix by *lengthening/enriching the distractors* so they are equally specific and
   plausible, not only by trimming the correct answer. Numbers, years and one-word options carry no length cue and are exempt.
2. **Length (multi_select).** The correct options must not average ≥ 1.3× the length of the wrong ones (validator error).
3. **Position (multi_select).** The correct options must not be the first N, or the last N, options in the stored order — shuffle them. For
   `multiple_choice` keep the existing `DESIGN-UNI-06` position rule.
4. **Distractors must be plausible**, not absurd. "Always…/never…/no effect" or an option that contradicts the stem in plain words is a second
   giveaway; write the wrong options as things a half-prepared student might really believe.
5. **Stem leaks.** Do not repeat a distinctive word from the correct option in the stem when the distractors do not share it.

**Review check.** `node tools/audit-answer-cues.js --subject <id> [--year YYYY] [--paper nov_p1]` reads dev and reports the longest-correct rate, every
multiple_choice with a clear length margin, every multi_select with long correct options, and every ordering with labelled items. A review
(`workflows/generate/review-paper.md` Phase 3) must run it and treat any finding as a defect to fix, not a flag.

### `DESIGN-UNI-17` — Cover every skill the real question tests: split the lesson, never drop skills

`enforced_by: human-review` (Phase 1 skill inventory; `workflows/generate/review-paper.md` Phase 3 checks it)

Added 2026-10-17 (owner decision, from Afrikaans FAL P1 Q5.1: 14 one-skill language items fitted into one 5-question lesson left nine skills unpractised).

1. **Inventory first.** In the Phase 1 analysis list the distinct skills of the real exam question — one per sub-question, merging only sub-questions
   that test the *same* skill. This inventory, not the practice-question count, decides how many lessons the question gets.
2. **Every skill is practised.** Each skill in the inventory must be covered by at least one practice question *in the lesson set of that exam question*.
   A skill practised in a different exam question's lesson does not count — a student working this question expects its skills here.
3. **If the inventory does not fit, split — never shorten.** When the skills cannot be covered within `DESIGN-UNI-14`'s 5 questions, split the lesson
   along the exam's own sub-question ranges (e.g. 5.1.1–5.1.5, 5.1.6–5.1.10, 5.1.11–5.1.14) until each lesson covers its slice fully. Do not drop skills to
   stay under the cap, and do not raise the cap.
4. **How a split lesson looks.** The name carries the real range (`"Vraag 5.1: Artikel (5.1.6–5.1.10)"`); the lesson's images are the slice of the question
   and memo pages for that range (the shared text/annexure is repeated on each lesson); `aiExplanation` has only that slice's entries with their real marks and
   printed numbers (`AIEXP-08`), and `exam_question_marks` is the slice's total; `order` is renumbered to keep the paper's sequence.
5. **Out-of-scope skills are recorded, not silently missing.** A skill that cannot be practised (visual-dependent — `LANG-EX-03`; needs a key the keyboard lacks —
   `DESIGN-UNI-12`) is listed as skipped in the analysis/ledger with the reason; it does not count as covered.
6. **Re-splitting an uploaded lesson.** Lesson ids derive from `order`, so a re-split reuses ids: soft-delete the old questions, supplementary rows and AI sub-questions
   and delete the old `question_skills` and `lesson_tags` rows of the affected lessons *before* uploading the new scripts, or stale children survive. Live (prod) lessons need
   the migration plan described under `DESIGN-UNI-14`.

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

### `DESIGN-UNI-13` — Linked vs. independent lesson structure

`enforced_by: human-review`

Added 2026-09-12, ahead of `dbe-life-sciences.md` — surfaced by a Life Sciences design
discussion, but the pattern isn't subject-specific: DBE exams routinely chain sub-parts
("Identify the phase during which the process named in QUESTION 2.1.4(a) takes place"),
and every subject's own multi-part questions could have used this. Written down now,
before the first lesson that needs it, rather than re-derived from scratch the way
`DESIGN-UNI-10` was.

Decide once per lesson — at the same time as `DESIGN-UNI-10`'s bundle-vs-split call, and
never mixed within one lesson — whether its question set is **independent**
(`DESIGN-UNI-02`'s default) or **linked**: later questions may reference an earlier
question's context or result from the same lesson, the way the real exam's own
multi-part sub-questions often do.

No new field is needed to express this. A question's `order` already fixes its position
in the lesson, so a later question's `question` text can safely say "...the process
identified above..." and the reference is unambiguous — what changes is only the
authoring rule: a linked lesson relaxes `DESIGN-UNI-02` for its own question set; an
independent lesson keeps it in full.

**Choose linked only when the dependency is genuine** — a later sub-part builds on an
earlier sub-part's own answer, not merely on shared context. Questions that only share a
diagram or scenario (the existing per-question `supplementary_material` reuse pattern)
stay independent by default; that alone is not a reason to link them — each must still
stand on its own given the figure. Link only when writing every question to stand alone
would force re-deriving or restating an earlier answer inside a later question's stem
(padding, not real content), or would turn a genuinely sequential exam chain into
disconnected trivia.

**Never mix within one lesson** — either every question in the set may reference back to
an earlier one, or none may. A student working through a lesson should not hit an
unpredictable mix of self-contained and dependent items.

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

When the answer is an algebraic expression (e.g. f'(x), equation of a line) or an inequality:
- **Typed (`fitb` with `keyboard_type: 'scientific_math'`)** when the question can fix **one canonical form** (`y=x-1`, `0≤x≤4`, `2^(x-3)`, `h=30-x`, coordinates `(3;-22)`): answers are space-free (no space key),
  use only keys the validator accepts (no `/`), and list `|` alternatives for the other natural orderings (`h=30-x|h=-x+30`); say the required form in the question ("write it as a ≤ x ≤ b"). Marking is
  exact-string after trim, lower-casing and script canonicalisation — no algebraic equivalence.
- A coefficient form is more robust than a whole expression: ask for the numbers (`[ ]x² + [ ]x` → `12`, `-12`) — numeric tolerance, no spelling traps.
- **`multiple_choice`** — 4 plausible expressions — where several equivalent written forms are natural and cannot be constrained, or the answer needs a key the keyboard lacks (`/`).
- `equation` only when neither works: its canonical serialization on the new Maths keyboard is **not specified in these docs** (TODO — the old doc says spaces around operators, the keyboard has no space key); do
  not author `equation` answers until it is documented from a device spot-check (`presentations/equation.md`).
- Interaction with `DESIGN-UNI-07`: typed expressions are `fitb`, so converting multiple-choice rows to typed ones reduces the number of distinct presentation types — a 4-question set needs 3. Keep at least one
  `multiple_choice`/`ordering`/`steps` row beside the `fitb` and `ordering` rows. TODO (owner decision): whether the variety rule should count typed-expression `fitb` separately, or accept `multi_select`/`match` to restore variety.

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

## Language subjects — moved to `shared/`

The English HL rules (`DESIGN-ENG-01`–`05`) were generalised on 2026-10-10 into the shared
language rules, so English FAL, Afrikaans and later languages reuse them. The old IDs stay
valid as aliases; new references use the new IDs. Load `shared/language-subjects.md`
(`AMPM-CONTENT-LANG`) for any language subject, and `shared/setwork.md`
(`AMPM-CONTENT-SETWORK`) for prescribed-text papers.

| Old ID | New ID | Rule |
|---|---|---|
| `DESIGN-ENG-01` | `LANG-EX-01` | Theme rule |
| `DESIGN-ENG-02` | `LANG-EX-02` | Structure rule |
| `DESIGN-ENG-03` | `LANG-CTX-01` | `context_text` usage |
| `DESIGN-ENG-04` | `LANG-ANS-01` | `fitb` vs multiple choice |
| `DESIGN-ENG-05` | `LANG-CAP-01` | Section caps |
