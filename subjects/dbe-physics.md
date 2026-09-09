---
id: AMPM-CONTENT-SUBJ-DBE-PHYSICS
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, physics, physical-sciences, dbe, profile]
---

# Subject Profile — DBE Physical Sciences: Physics (Paper 1)

Drafted 2026-09-09 from a paper review (before any content existed), then evidenced
2026-09-09/10 against a complete authored paper (`files/Physical Sciences P1 Nov 2025
Eng.pdf`, DBE 2025 Nov P1 — all 10 questions, 13 lessons, 64 practice questions, dev
Postgres) — see the Completed papers ledger for what that session actually confirmed vs.
what's still only illustrative. Sections below are marked per-claim where something
remains unconfirmed; treat anything without such a marker as evidenced, not aspirational.
An "open item" flagged here is not self-enforcing, though — see the MathText scope
section below for what happened when one wasn't acted on before content shipped.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"physics"` — this `subject_id` is Physical Sciences as a whole (one subject, one DB row — see the `subjects` reference row below), not "physics" as distinct from a separate chemistry subject. Physics (Paper 1) and Chemistry (Paper 2, Matter & Materials / Chemical Systems / Chemical Change knowledge areas) are two **papers** under this same subject_id. This profile covers Paper 1 only; Paper 2/Chemistry content is a separate future authoring effort but reuses this same `subject_id = "physics"` — no new `subjects` row needed, just a `dbe-chemistry.md` paper-structure profile analogous to this one. |
| Postgres tables | `lessons`, `questions` — `subject_id = "physics"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'physics'` — empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` (`PIPE-08`) |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject physics --out temp/curriculum-vocab.json` (Auth Proxy running) |
| Not authored | display names/colours — resolved from the reference tables by JOIN |
| Papers | `nov_p1` (physics) authored. `june_p1` presumed to exist once a June-diet paper is sourced. `nov_p2`/`june_p2` (chemistry) not yet authored, but will land under this same `subject_id = "physics"` — see subject/syllabus note above. |
| **Curriculum document (`DESIGN-UNI-09`)** | Not strictly required every session — physics is procedural like Maths (see Subject rules below) — but `files/CAPS FET PHYSICAL SCIENCE WEB.pdf` is the source for the curriculum-unit breakdown below and should be consulted for topic scope/grade placement, especially for the recall-item relational framing. |
| **Source files** | `files/Physical Sciences P1 Nov 2025 Eng.pdf` (question paper), `files/Physical Sciences P1 Nov 2025 MG Afr & Eng.pdf` (memo — sourced 2026-09-09), `files/CAPS FET PHYSICAL SCIENCE WEB.pdf` (curriculum). `temp/Physical Sciences P2 Nov 2025 MG Afr & Eng.pdf` is Paper 2/Chemistry — confirmed by its own title page, out of scope for this profile, left in `temp/` rather than moved to `files/`. |
| `subjects` reference row | **Already exists** — `id: "physics"`, `name: "Physical Science"`, `full_name: "Physical Sciences"`, `code: "PHYSICS"`, `category: "physics_lessons"`, `sort_order: 4`, `color: "#12B886"`, `icon: "atom"`, created 2026-07-09 (well before this profile or any physics content — confirmed by querying dev Postgres directly, 2026-09-10, after this profile incorrectly stated an owner-gated insert was still needed and proposed a different, wrong color; don't repeat that mistake — check the DB before assuming a reference row doesn't exist). **This is the single row for the whole Physical Sciences subject** (`name: "Physical Science"`), covering both Physics (P1) and Chemistry (P2) — the full `subjects` table having no separate `chemistry` row (checked 2026-09-10) is expected, not a gap: physics and chemistry are papers within one subject, not two subjects. A future `dbe-chemistry.md` profile reuses this same row/`subject_id`, it does not create a new one. |

## Paper structure / video mapping

**Three-way decision, not two.** Went through two wrong shapes for Q1 before landing
here on 2026-09-10 — recorded so a future session doesn't re-walk the same path:

1. First cut: bundled all of 1.1–1.10 into one "Question 1" lesson, copying Maths's
   convention without checking it fit. User caught it: *"why is the complete Q1 all
   together in one lesson?"*
2. Second cut (overcorrection): one lesson per numbered item, 10 lessons for Q1,
   copying Geography's convention instead. Technically fixed the topic-mixing
   problem, but each item is only 2 marks — 10x the curriculum-node/tag/image/script
   overhead for content that thin is disproportionate, and it broke image cropping
   (multiple items sharing one exam page needed precision `--inspect` cuts for every
   boundary). User caught this too: *"question 1 is MCQs, and it's tough to create a
   lesson out of each one."*
3. **Where it landed: cluster independent MCQ items by the exam's own knowledge-area
   grouping** — which turns out to exactly mirror CAPS's four knowledge areas
   (confirmed by checking the curriculum document itself, Section 2.6 "Weighting of
   Topics"). Q1's ten items aren't randomly ordered — DBE groups them by area, in the
   same order the long-form questions later follow:

   | Part | Items | Knowledge area | CAPS G12 weight |
   |---|---|---|---|
   | 1 | 1.1–1.5 | Mechanics | 17.5% |
   | 2 | 1.6 | Waves, Sound & Light | 3.75% |
   | 3 | 1.7–1.9 | Electricity & Magnetism | 7.5% |
   | 4 | 1.10 | Matter & Materials | 3.75% |

   **4 lessons, orders 1–4**, `name: "Question 1.1–1.5"` / `"1.6"` / `"1.7–1.9"` /
   `"1.10"`. Practice-question count scales with the part's real weight (10, 2, 5–6,
   2) rather than a fixed 2-per-item — the thin single-item parts (2, 4) are fine
   left thin, since Waves and Matter & Materials both get much fuller treatment
   later as their own long-form questions (presumably Q6, Q10) — Part 2/4 here are
   only the MCQ warm-up, not that topic's only coverage.

**The general decision (`DESIGN-UNI-10`, promoted from here to `core/authoring-
principles.md` on 2026-09-10 once English HL turned out to already be following the
same principle via `DESIGN-ENG-05`) — bundle sub-parts sharing one continuous scenario
into one lesson (Q2–Q10 here); otherwise cluster independent items by the exam's own
thematic ordering rather than one-lesson-total or one-lesson-per-item (Q1 here).**

**Image cropping:** clustering by knowledge area minimized this — 4 of 5 exam pages
in Q1 turned out to belong entirely to one part each (no crop needed, whole page
reused), and only one page (page 5, spanning 1.5/1.6/1.7 across three different
parts) needed splitting. Found the cut points empirically: `--inspect`'s band-scan
output was too compressed to read reliably by itself here (short single-line MCQ
options, unlike Geography's longer-form content), so cut points were found by
extracting overlapping test slices (`--question-pages "5:end=N"` /
`"5:start=N:end=M"`) and visually narrowing until each slice held exactly one
item — confirmed clean at `end=333` (1.5), `start=333:end=478` (1.6), `start=478`
(1.7). Prefer this iterate-and-view approach over trusting the band scan alone when
content is dense/short-lined.

**Engineering note:** `lessons`/`questions`/sub-question IDs are deterministic from
`(paper, order)` / `(lesson, question order)` / `(lesson, sub-question number)` alone
(`tools/lib/uuid.js`) — reusing an `order` value for a differently-structured lesson
silently leaves the old rows' children (extra questions, extra `ai_explanation`
entries) orphaned-but-attached unless explicitly cleaned up first. Both restructures
required an explicit `DELETE` of the old rows before rebuilding, since no tooling in
this repo does soft-delete for a full lesson (`PERSIST-04`'s soft-delete norm has no
script backing it yet — direct SQL was used, justified only because this was
same-session dev-only content, never shipped/published to real users).

## Allowed presentation types

**Confirmed against a complete paper** (2025 Nov P1, all 10 questions authored
2026-09-10 — see the evidenced list in the ledger below for exactly which 6 of 8 were
actually used): `fitb`, `multiple_choice`, `steps`, `match`, `ordering`, `multi_select`
all confirmed working; `fraction`/`equation` remain unused so far (not excluded, just
never came up — this paper's answers are always units-carrying numbers, MC options, or
multi-step working, never a bare algebraic expression or true fraction) — reassess if a
future paper's content calls for either, the way Geography reassessed and landed on a
5-type restriction instead of physics's current no-restriction stance.

Question `type` vocabulary (extends Maths's, minus `fraction`/`proof`, plus
`interpretation` borrowed from Geography for diagram/graph reading): `definition`,
`calc`, `application`, `interpretation`. `interpretation` = reading a circuit/graph/
field diagram and stating what it shows or predicting a qualitative change (e.g. "how
will the brightness of bulb Y be affected?") — distinct from `calc` (numeric work) and
`application` (apply a law/relationship to a new scenario).

## Subject rules (beyond core)

- **Mostly procedural, like Maths — but recall items need Geography's
  relational-framing treatment.** Most of this paper is calculation (`DESIGN-UNI-01`
  freshness is satisfied by varying the numbers; no `DESIGN-UNI-09` curriculum-document
  requirement per session). But pure recall sub-questions — "define impulse," "state
  Newton's second law," "describe an electric field" — have the same
  small-fixed-answer-space problem `DESIGN-UNI-08` identifies for Geography: a reworded
  restatement of the definition is trivially answered by a student who memorised our
  version too. Apply `DESIGN-UNI-08`'s relational framing to *these specific
  sub-questions only* (e.g. test the relationship between impulse and momentum change,
  or between the four Doppler-effect source/observer-motion cases, rather than isolated
  "define X") — consult the CAPS document for the definition's surrounding
  relationships when writing these.
- **Numeric answers carry units — never bare numbers** (`DESIGN-PHYS-01`,
  `enforced_by: human-review`). Every `calc`-type numeric answer must be dimensionally
  complete. Round per the source paper's own instruction (this paper: "round off FINAL
  numerical answers to a minimum of TWO decimal places") — same spirit as
  `DESIGN-MATH-01` but physics adds the unit and scientific-notation cases:
  - Integer/decimal formatting rules from `DESIGN-MATH-01` apply unchanged (no
    thousand separators, `.` not `,`, minimum necessary decimal places beyond the
    paper's stated minimum).
  - Scientific notation: `"3.00 x 10^8"` style consistent with the data sheet's own
    notation — confirm the exact renderer-safe serialization before the first upload
    (open item, see MathText note below).
- **`fitb` unit placement — the unit is a static label, never part of the matched
  answer** (`DESIGN-PHYS-02`, mirrors `SCHEMA-TYPE-04`'s `HH:MM` split and Geography's
  ratio-token split). Put the numeric blank and the unit as separate `metadata` tokens
  so matching never depends on unit spelling/symbol variants:
  ```js
  metadata: ["a = ", "[ ]", " m·s⁻²"],
  answer: ["9.80", "", "", "", ""],
  ```
- **Graph questions: decompose, same principle as `DESIGN-MATH-02`**
  (`DESIGN-PHYS-03`). Never ask for free-hand sketching. This paper's graphs
  (velocity-time, momentum vs. contact-time, frequency vs. velocity,
  generator voltage-time, photoelectric E_k(max) vs. 1/λ) break into: read/calculate a
  specific value (gradient, intercept, asymptote) → `fitb`; identify the correct
  shape/graph among options → `multiple_choice`; predict how a changed variable shifts
  the graph → `application`/`interpretation` `multiple_choice`, never "sketch the new
  graph."
- **Diagrams needed beyond Maths's geometry/Cartesian-graph set** (`DESIGN-PHYS-04`).
  This paper's diagrams span several categories the pipeline hasn't built templates for
  yet — expect the first few sessions to spend real time here before it's routine:
  free-body diagrams (force vectors on a block/crate), circuit diagrams (cells,
  resistors, switches, ammeters/voltmeters, sometimes multi-loop), electric field
  patterns around point charges, energy-level diagrams, and the AC-generator/motor
  sketch. Same decision test as Maths (could the student attempt the question without
  the figure?) and the same recreation approach as Geography's schematic figures
  (SVG→PNG or matplotlib, new invented values, never the real exam's numbers) — this is
  the main area where physics needs more new pieces than Maths did.
- **Circuit-analysis and force-diagram questions decompose like Euclidean geometry
  proofs** (`DESIGN-PHYS-05`, same shape as `DESIGN-MATH-04`): don't ask for a full
  written circuit analysis or free-body diagram from scratch in one question. Break
  into "what is the reading on ammeter X?" (`fitb`), "identify all forces acting"
  (`match` or `multi_select`), "which statement about how Y is affected is correct?"
  (`multiple_choice`).
- **`steps` is a first-class choice for numeric multi-step calculations, not just
  symbolic proof completion.** `QuestionsValidator.kt`'s `STEPS` branch used to be
  exact-string-only (no numeric tolerance), which made it a trap for physics's
  "calculate the reading on A1" style numeric substitution work — fixed this session
  (see App-side fixes below) so numeric `steps` blanks now get the same `"9.8"` ==
  `"9.80"` / comma-decimal tolerance `fitb` has, while symbolic blanks stay
  exact-match.
  **Correction, 2026-09-10 (caught by direct user testing, not the review agent):** all 5
  `steps` questions shipped in this paper (Q4/Q6/Q8/Q9/Q10) initially had 2-3
  *consecutive* blank rows after only `metadata[0]`, with nothing given in between to
  anchor them — unanswerable in practice (no indication of expected content/format) and
  several expected values were full algebraic sentences requiring character-exact
  reproduction. Fixed by giving the *entire* derivation as read-only rows and leaving
  **one blank, at the end** — see `presentations/steps.md`'s now-expanded pitfalls
  section for the corrected pattern (matches the pre-existing Maths precedent, which
  always did this correctly). Prefer `steps` over one big `fitb` when the working itself
  is worth showing, but that means showing it as *given* text, not as more blanks — a
  `steps` question earns its keep by teaching the method via visible working, not by
  forcing the student to retype your derivation verbatim.
  **Second correction, same day:** the first fix's own answer-scaffolding technique (split
  a blank's label and unit into their own given `metadata` rows, e.g. `'r ='`, `[ ]`,
  `'Ω'`) was itself wrong — every `metadata` row gets its own numbered "Step N"
  (`StepsPresentation.kt`), so this rendered as three disconnected numbered steps for one
  real line of working ("Step 3: r =", "Step 4: [blank]", "Step 5: Ω" instead of one
  coherent "r = ___ Ω"). Caught by the user from a live screenshot, not by the emulator
  re-check that had just been done (which verified the blank was *typeable and correct*,
  not that the surrounding step numbering *read sensibly*). Re-fixed in all 5 questions by
  folding the label/unit into the end of the *preceding* given row's text instead of a new
  row — see `presentations/steps.md` and `core/keyboard-input.md`'s `KEYBOARD-02` for the
  corrected pattern. Lesson: a completability fix and a "does the visible flow make sense"
  check are different checks — passing one doesn't mean the other passed too.
  **Third correction, same day:** the second fix's own given row (`'20 = 5(3.8 + r), so r
  (in Ω) ='`) had two `=` signs — one in the real equation, one appended to lead into the
  blank — reading as genuinely confusing, not just stylistically off (caught by the user
  again, from another live screenshot). Fixed by ending that row with a colon instead of a
  second `=` whenever it already contains an equation. Three real defects in the same
  handful of questions in one session, each only caught by a human actually reading the
  rendered screen — none of the three were visible from re-deriving the stored answer
  value, none were caught by the independent review agent, and two of the three were
  introduced by the *previous* fix in the chain. Worth remembering next time a `steps`
  question needs this scaffolding pattern: check the result against a screenshot, not just
  against the rule that motivated the change.
- **Practice-question count scales with bundled content — `DESIGN-UNI-11`** (promoted
  from here to `core/authoring-principles.md` on 2026-09-10, once it turned out
  English HL's `DESIGN-ENG-05` section caps were already the same principle in a
  different subject). Caught 2026-09-10: Q2 (5 real sub-questions, 2.1–2.4 with 2.3
  split) shipped with only 4 practice questions and no dedicated practice for 2.3.2 —
  the highest-mark sub-part (5 of 17 marks) had no matching skill exercised. Fixed by
  adding a 5th question. Single-item parts (Q1's Part 2/Part 4) correctly stay at 2,
  since there's only one real sub-part to cover.

## App-side keyboard/calculator routing — resolved 2026-09-09

Physics was an unrecognized subject string in three places in `AMPM` (`~/StudioProjects/
AMPM`), each falling through to a wrong/missing default — fixed this session, before any
physics content existed to expose the bug in production:

- `SubjectMapper.kt` — added `PHYSICS_FIRESTORE = "physics"` (matches this profile's
  `subject_id`).
- `KeyboardResolver.kt` (`feature/watch/.../questions/ui/`) — `resolve()` and
  `resolveSubjectDefault()` were falling to `QuestionKeyboardType.None` (no custom
  keyboard at all) for physics; now routed the same as Maths (`ScientificMath` for
  `equation`/`steps`, `StandardMath` for everything else). The file's own doc comment
  already anticipated this: *"Add new subjects (e.g. Physics) by extending this resolver
  only."*
- `SubjectKeyboardType.kt` — `toSubjectKeyboardType()` was falling to `Default`, which
  left `calculatorType` `null` (`QuestionsViewModel.kt`) and **suppressed the on-screen
  calculator entirely** — a real problem given the paper explicitly permits "a
  non-programmable calculator." Now maps `"physics"`/`"physical sciences"` to
  `SubjectKeyboardType.Maths`, reusing the full `MathsCalculatorBottomSheet`.
- Fixed two existing unit tests that had locked in the old (wrong) behaviour
  (`SubjectKeyboardTypeTest.kt`, `KeyboardResolverTest.kt`), and added physics-specific
  cases to both plus `QuestionsValidatorTest.kt`. `:feature:watch:testDebugUnitTest`
  passes. Committed in `AMPM` as `d0dd7adfa` ("Route physics through the maths
  keyboard/calculator resolvers") — not pushed (no AMPM push without explicit request).

## MathText scope — resolved 2026-09-10 (the hard way)

This section originally warned "extend `MATHTEXT` scope to include `physics` before the
first authoring session" — that warning was correct and was **not acted on**: the whole
paper was authored and shipped with `core/mathtext.md` still scoped to `maths`/`math_lit`
only, using ASCII underscore notation (`v_i`, `v_f`, `E_k(max)`, `F_net`, and 14 more
identifiers across 17 questions) as a stand-in for subscripts. The renderer has no
structural subscript markup and never converted these — they rendered as literal
underscores, reading as broken/unrendered LaTeX rather than textbook notation. Caught by
the user reading a live screenshot, not by the earlier review agent (which rationalized
it as "expected/current behavior" precisely because the scope gap made it look
sanctioned) and not by `review-paper.md`'s own render checklist (which only checked for
raw `\frac`/`\sqrt`, not underscore notation — now fixed there too).

Fixed properly this time: `core/mathtext.md` scope extended to `physics`, `MATHTEXT-06`
added (real Unicode subscript character where every letter in the subscript has one —
`aehijklmnoprstuvx` plus digits; `Variable(subscript)` parenthetical otherwise, since
`bcdfgqwyz` have no Unicode subscript form), and all 17 affected questions fixed in dev
Postgres + their upload scripts. Verified live on the emulator.

**Lesson for the next new subject**: an "open item" flagged in a subject profile is not
self-enforcing — it must actually block authoring, or be checked immediately before the
first content ships, not discovered after. The data-sheet notation conventions (`·` as
the SI unit separator, `×`/`x` for scientific notation) mentioned in the original version
of this section turned out fine as plain Unicode pass-through — no markup issue there.

**Same day, same root cause, a second pass**: the user then asked "why isn't `|pᵢ|/m`
in fraction format" — a plain `/` violates `MATHTEXT-01` (fractions needing structural
display must use `\frac{}{}`), a rule that already existed and would have applied to
maths/math_lit content all along; physics just hadn't been checked against it. A full
sweep found more plain-`/` fields across `questions` (12 fields, 11 rows) and
`lesson_ai_explanation_sub_questions` (14 sub-questions) — all real math fractions fixed,
correctly distinguishing genuine math fractions from English "or" usage ("heating/power
effect", "series/parallel") which must stay untouched. This surfaced a third, more
serious rendering gap while fixing it: `\frac{}{}` was first applied uniformly to both
tables, but `lesson_ai_explanation_sub_questions` renders through a **completely
different, plain-`Text()` composable** (`AiExplanationSheet.kt`) with no `MathText`
support at all — so `\frac{}{}` there would have shown up as literal broken text, worse
than the plain `/` it replaced. Caught by reading the actual renderer source before
shipping, not by assumption; reverted for that table (kept as plain `/`) while the
`questions` table (which does render through `MathText`) kept the `\frac{}{}` fix.
Documented as `AIEXP-06` in `core/ai-explanation.md` so this distinction doesn't have to
be rediscovered from source next time. Verified live for both the `metadata`-blank case
(`presentations/steps.md`'s render path) and the separate `questions.clues` hint-dialog
case, since they're two more distinct code paths that both needed checking independently.

## Formula sheet (every paper)

Same pattern as Maths: a data sheet is attached to every DBE Physical Sciences paper —
here it's **3 pages** (physical constants; motion/force/work-energy-power/waves
formulae; electrostatics/circuits/AC formulae), not Maths's single page. Extract once
per paper, upload once, reuse the same Storage URL(s) in every video's
`supplementary_materials` as `{ type: "formula_sheet", label: "Formula Sheet",
image_urls: [...] }` (3 URLs).

## Per-question supplementary material

Same decision test as Maths: could a student attempt the question without the figure?
No → include. Yes but it helps → include. Adds nothing → omit. Unlike Maths, this
paper's diagrams are almost always load-bearing scenario setup (the object/circuit/
charge configuration the question is *about*), not optional aids — expect most physics
questions to need one. `supplementary_material: { type: "diagram"|"circuit"|"graph"|
"table", label, image_urls }`. Storage path:
`question_supplementary/{subject}/{year}/{paper}/q{order}/{type}_{index}.png`.

## Curriculum units (reference until a curriculum collection exists)

From CAPS's Grade 10-12 "Overview of topics" table (Section 2.4) — NSC papers draw
cumulatively across all three grades, not just Grade 12, so a unit's CAPS grade
placement doesn't cap which grade's paper can examine it:

**Mechanics:** `vectors_and_scalars` (G10), `motion_1d` (G10), `vectors_2d` (G11),
`newtons_laws` (G11), `momentum_impulse` (G12), `vertical_projectile_motion` (G12),
`work_energy_power` (G12).
**Waves, Sound & Light:** `doppler_effect` (G12) — the only Grade 12 waves topic
examinable on P1 physics; earlier grades' transverse pulses/waves/sound/EM-radiation
content (G10) and geometrical optics (G11) also remain in scope cumulatively.
**Electricity & Magnetism:** `electrostatics` (G10/G11 — Coulomb's law, electric
field), `electric_circuits` (G10 series-parallel → G12 internal resistance),
`electrodynamics` (G12 — generators, motors, AC).
**Matter & Materials:** `optical_phenomena` (G12 — photoelectric effect only; the rest
of this knowledge area is Paper 2/Chemistry, out of scope).

(Illustrative only — the real, current set comes from the Phase 3.5 vocabulary dump
once a first session populates it, `PIPE-08`.)

## Completed papers ledger

| Paper | Videos | Questions | Date |
|---|---|---|---|
| DBE 2025 Nov P1 | 13 (Q1 parts 1–4, Q2–Q10 — paper-only, no video) — **complete paper** | 64 | 2026-09-09/10 — pilot for this profile; Q1 went through two rebuilds before landing on knowledge-area clustering (see Paper structure / video mapping above); Q2–Q10 each confirmed as one continuous scenario (rule 1) with practice count scaled to real sub-part count (`DESIGN-UNI-11`). All 13 lessons' `exam_question_marks` sum to exactly 150 — matches the real paper's total, cross-checking nothing was missed. |

Formula sheet URLs (reuse per paper):
- 2025 Nov P1: `https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1/q0/question_1.png` (+ `question_2.png`, `question_3.png`)

**Evidenced from the full paper** (updates the "Allowed presentation types" section
above): `multiple_choice`, `fitb`, `multi_select`, `match`, `steps`, `ordering` all
used successfully across Q1–Q10; only `fraction`/`equation` not yet exercised
(unsurprising — physics answers are units-carrying numbers or MC/match/steps, rarely a
bare algebraic expression or a true fraction). `steps` turned out to be the natural fit
for numeric multi-step working throughout (impulse-momentum, Doppler simultaneous
equations, internal resistance, AC power/cost, photon energy) once its numeric-
normalization fix (see App-side fixes) landed — used in 4 of the 7 long-form lessons.
Q1's MCQ block needed no diagram recreation (concepts were expressible in text/fitb);
Q2 confirmed the diagram-heavy prediction — its free-body-diagram practice question
needed a freshly generated schematic (matplotlib, force arrows on a crate), uploaded
via the newly-built
`tools/upload-question-supplementary.js` (the documented `question_supplementary/`
path had no uploader before this). Also surfaced a real validator gap: a question-level
field referencing a shared `const` (e.g. a base image URL) breaks
`validate-questions.js`'s isolated eval of the `questions` array — inline literal URLs
in per-question fields instead.

**A `workflows/generate/review-paper.md` run (2026-09-10) reported 62 PASS/2 AUTO_FIX/0
FLAG across all 64 questions and missed the `steps`-scaffolding defect above entirely**
(all 5 affected questions were marked PASS) — it verified the *stored answer values* were
correct by independent re-derivation, but never assessed whether the on-screen blank
layout was actually completable by a student. Caught instead by the user directly
exercising the app. Lesson for future reviews: `steps` questions need a completability
check (can a student, seeing only the given rows + blank inputs, know what to type?), not
just an answer-correctness check — add this explicitly if `review-paper.md`'s Phase 3
render checklist is revisited.
