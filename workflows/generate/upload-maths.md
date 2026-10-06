# Upload — DBE Mathematics (one question group)

**Profile:** `subjects/dbe-maths.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-MATHTEXT`, `AMPM-CONTENT-AI-EXP`, `AMPM-CONTENT-KEYBOARD-INPUT` (what a student can type — read
before Phase 4), `presentations/{type}.md` per type used.

> Do NOT enter plan mode. Run once per question group. Commit after Phase 4. Moved from
> `AMPM/workflows/generate/upload-maths.md` (stub remains there).

## Required inputs

Same as math-lit (YouTube ID, question number, order, year, paper key, paper + memo
PDFs). Collections and denormalized values: profile.

## Phases (deltas on the pipeline skeleton)

1. **Analyse**: curriculum unit/topic per the profile's unit tables; note graph/diagram/
   formula-sheet dependence; 2–5 concept tags.
2. **Images**: **formula sheet once per paper** (last page), reused in every video's
   `supplementary_materials` (profile); inline diagrams captured with `--question-pages`;
   separate-page diagrams as annexures.
3. **Video document**: standard template + formula-sheet entry on every video.
4. **Questions**: 2–4, fresh scenarios; MathText markup in question/metadata strings;
   **per-question `clues` required** (profile); per-question `supplementary_material`
   when the decision test says so (profile — matplotlib/SVG generation);
   graph-decomposition, interval-constrained trig, decomposed proofs, P2 topic variety
   (`DESIGN-MATH-02`…`06`).
   **Typed answers and keyboards (one authoring track, decision 2026-10-06).** Maths papers use the new
   `scientific_math` keyboard wherever it makes the better question: an expression, equation, inequality,
   coordinate `(3;-22)`, degree `°` or letter answer is a typed `fitb` with `keyboard_type: 'scientific_math'`
   (`DESIGN-MATH-05`: one canonical form, fixed in the question text; `|` for other natural orderings), and a
   bare-numeric answer stays a number with `standard_math` (`KEYBOARD-04`). Constraints that bite (checked against
   `core/keyboard-input.md` and the validator): **no space key and no literal `/` key** — answers are space-free,
   and an exponent like `x^(-1/2)` is untypeable (use a decimal, the `fraction` presentation, or multiple choice);
   store negatives with ASCII `-`; an uppercase letter is typed with the one-shot shift and `fitb` marking
   lower-cases both sides anyway. Keep the variety rule (`DESIGN-UNI-07`, 3 types in a 4-question set) — typed
   expressions are `fitb`, so keep a `multiple_choice`/`ordering`/`steps` row beside them. Do **not** use `equation`
   for typed expressions until its serialization is documented (`presentations/equation.md`, open item).
   Using any new key (`; < > ° ∠ ,` or a letter other than `x y`) or `_{…}` markup makes the exam derive 2.4.0; it is
   gated automatically (`VER-09`, last section). Primes: `f′(x)` / `f″(x)` (U+2032/U+2033) display with the font's quote
   glyphs (`'`, `"`) on screen — harmless, but prefer plain `f'(x)` in new content so what is written is what is seen.
   **Device-verified 2026-10-06** (Maths 2025 Nov P1, 2.4.0 test build, real keys): typed `0≤x≤4` (and `x≤4` rejected), `2^(x-3)` (`2^x-3` rejected), `X=4` typed with the shift key (accepted — `fitb` lower-cases both sides),
`(3;-22)` (`(3;22)` rejected), `h=30-x` (`30-x` rejected); two numeric blanks `12` / `-12` on the number pad with the label `[ ]x² + [ ]x` rendering a raised 2; a `steps` row with `lim_{h→0}` renders `h→0` lowered; bare numbers (`1.14`, `110601`);
a multiple-choice row; and resync delivered the new rows with the new keyboard types. **Not covered on a device or in this paper:** `<` / `>` typed answers (the natural row stayed multiple choice for the variety rule), degrees `°`, trig, `ln`/`log`,
the `fraction` presentation, upper-case answers beyond the shift check, and the *other half* of the gate (a pre-2.4.0 build no longer receiving the gated exam is **backend-tested only**, not device-tested).
5. **Vocab dump** (pipeline Phase 3.5): `--subject maths` (Auth Proxy running). A Maths
   `curriculum_nodes` tree exists as of 2026-09-03 (built from the 2019 P1/P2
   back-catalogue). Author bare slugs; reuse before `tools/create-curriculum-node.js
   --subject maths …`.
6. **Upload script**: copy `tools/upload-script-template.js` to
   `add-maths-<year>-<paper>-q<N>.js`; `subject: "maths"`. Validate with `--curriculum`
   (HARD STOP) → `--dry-run` → upsert to dev → **commit**
   (`[Data] Add maths <year> <paper> Q<N> lesson and questions`). Declare `keyboard_type` on every
   typed question (the validator warns if missing). **Changing an existing paper:** a *content* change
   (new presentation / answer / metadata) is a normal dry-run + re-run of the edited script — deterministic
   ids, so it upserts in place and bumps `updated_at`; only lessons whose content changed need re-running. A
   *keyboard-only* change on rows that already hold the right value is a script edit alone
   (`core/keyboard-input.md` `KEYBOARD-06`). Scripts written before the template's gate hook do not gate the
   exam themselves — run the step below.
7. **Verify**: pipeline checklist plus the Maths items — clues format on every question,
   formula sheet on every video, MathText markup (no plain `/` or bare `√`), `equation`
   canonical answers, `steps` contracts, trig intervals, decomposed graphs. Update the
   profile's completed-papers ledger.

## How a new or retrofitted paper gets its gate (`VER-09`, `core/app-feature-versions.md`)

Last step of every upload **and** retrofit; the minimum is derived, never typed:

1. `node tools/derive-exam-min.js scripts/add-maths-<year>-<session>-*.js` — all papers of the exam.
2. `node tools/apply-exam-gate.js --env dev --subject maths --year <YYYY> --session <june|november>` — dry run: the exam's derived
   minimum, each paper's, the gate it would write, and how many published questions it would hide from older builds; re-run with `--apply`.
   (Scripts built from the current template do this automatically after a real dev upload.)
3. The gate is per **exam**: one paper that needs 2.4.0 gates its sibling paper too, and no paper of it goes to prod until 2.4.0 is tagged
   (`push-paper-to-prod.js` refuses the whole exam, `VER-08`). At the floor nothing is written.
