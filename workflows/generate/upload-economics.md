# Upload — DBE Economics (one lesson / real exam question)

**Profile:** `subjects/dbe-economics.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `AMPM-CONTENT-KEYBOARD-INPUT`, `AMPM-CONTENT-APP-VERSIONS`,
`presentations/{multiple-choice,multi-select,match,ordering,fitb,steps}.md` (Economics subset — profile).

> Do NOT enter plan mode. Run once per lesson (one real exam question — Q1, Q2, Q3, Q4, Q5 or Q6 of a
> paper — never split further; profile § Lesson granularity). **Commit after Phase 4, per lesson** — never batch
> lessons into one commit or one uninterrupted run. **Dev only**: nothing in this workflow touches prod.

## Phase 0 — one-time subject setup, then per-lesson curriculum vocabulary

**0a. First lesson only: the `subjects` row.** Economics has none yet (profile § Identity). Check, then insert on **dev**
(direct SQL, no tooling exists; get the user's go-ahead for the values first):

```bash
node -e "
const { getPool, closePool } = require('./tools/lib/postgres');
(async () => {
  const pool = getPool('dev');
  const { rows } = await pool.query(\"SELECT id, name, sort_order, is_active, min_app_version FROM subjects ORDER BY sort_order\");
  console.log(JSON.stringify(rows, null, 1));
  await closePool('dev');
})();
"
```

Pick the next free `sort_order`, a `color` and an `icon`; copy a Business Studies row's other columns
(`syllabus` dbe, `is_published: true`). `is_active: true`, `min_app_version: null` on dev. Do not create the prod row here.
Also confirm `SubjectMapper.kt` (canonical checkout `~/StudioProjects/AMPM`) still falls through to
`displayName.lowercase().replace(" ", "_")` so `"Economics"` → `"economics"`.

**0b. Every lesson: curriculum vocabulary.** `curriculum_nodes.id` is a **global** primary key unless `economics` is in
`NAMESPACED_SUBJECTS` (`tools/lib/curriculum.js` — read it; Business Studies is not namespaced). Dump what exists:

```bash
node -e "
const { getPool, closePool } = require('./tools/lib/postgres');
(async () => {
  const pool = getPool('dev');
  const { rows } = await pool.query('SELECT id, type, name, subject_id FROM curriculum_nodes ORDER BY subject_id, type, id');
  console.log(JSON.stringify(rows, null, 1));
  await closePool('dev');
})();
"
```

- **Units = the CAPS topics** (profile § Curriculum units). Prefer a subject-specific slug (`economics_circular_flow`)
  only if slugs are global and an equivalent already exists elsewhere; otherwise the plain topic slug.
- **Reuse across subjects first (`PIPE-08` at global scope).** Business Studies and History already carry skill-shaped
  subtopics (`essay_argumentation`, `evidence_extraction`, `term_definition_recall`, `classification_and_criteria`,
  `sequencing_and_process`, `scenario_application`). Economics' essay-structure and data-extraction items are the same
  skills — reuse the row. Create Economics-specific subtopics only for what is new: `calculation_and_method`,
  `graph_interpretation`, `data_interpretation` (check Geography first for the last).
- **Keep subtopics coarse** (a handful for the whole subject, not one per question). Topics are created per concept as they
  appear (`business_cycles_phillips_curve`, `perfect_competition_loss`) and reused.
- Create rows with `tools/create-curriculum-node.js` / `create-skill.js` / `create-tag.js` (**dev only**) before writing them
  into any question; re-dump (Phase 3.5) before validating.

## Required inputs

Lesson name (`"Question N"`, matches the real question number — `PIPE-07`), paper (`nov_p1` / `nov_p2`), year, order, the
paper **and** memo PDF. No video (`has_video: false`, `content_tier: 'free'`, `freemium_*: null`).
**Unlike Business Studies, images are in scope** — Economics' stimuli are figures (Phase 2).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1). Read the question *and its memo section*. For each sub-question record: verb and marks
   (identify 1 / name 1 / describe 2 / explain 2 / how-why 2×2), the stimulus it reads, whether the memo wants one word or a
   sentence, and its CAPS unit/topic. Flag: **(a)** calculations (note the 3 + 1 method/answer split), **(b)** drawn-graph items
   (`DESIGN-ECON-03`), **(c)** dependent pairs (`DESIGN-ECON-07`), **(d)** Q1.3 terms and their memo variants.
   For Section C also note the essay's main-part and additional-part headings and the printed rubric box.
2. **Images** (pipeline Phase 1.5). Pull the question's stimulus figures and the memo page(s) with `tools/extract-exam-pages.py`
   (vector graphs) or `pdfimages -png` (embedded rasters — the cartoons and the 2025 P1/P2 graphs are rasters); inspect each
   image, rotate if needed, then `tools/upload-exam-images.js` (**dev only**, `PIPE-02`). Stimulus extracts go in as
   `supplementary_materials` labelled with the paper's own name, e.g. `"Extract"`, `"Table"`, `"Graph"`, `"Cartoon"`
   (`PIPE-03`; rename files distinctly when a question has several). These are the **exam reference** images; the practice
   questions use *fresh* stimuli (Phase 4). Note per lesson any image you could not extract rather than uploading a placeholder.
3. **Lesson document** (pipeline Phase 2): standard template, `has_video: false`. Tags (`PIPE-06`) name CAPS concepts
   (`phillips_curve`, `marginal_cost`, `balance_of_payments`), never a scenario wrapper.
4. **Questions** (pipeline Phase 3) — the Economics-specific decisions:
   - **Choose the presentation by the memo, not the verb.** Single-term items → `fitb`/`text` only when the memo has one
     canonical answer (Q1.3); "name/give any N" → `multi_select` (`DESIGN-BUS-04`); describe/explain/how → `multiple_choice`
     or `multi_select` against the memo's listed points (`DESIGN-ECON-02`); read-a-value-off-the-stimulus → `multiple_choice`
     with a fresh stimulus (`DESIGN-ECON-05`).
   - **Typed answers declare `keyboard_type` — every one, validator error otherwise (`KEYBOARD-04`).** Q1.3 term → `text`, all
     memo variants joined with `|`, full term, no acronym. Number → `standard_math`, bare, unit/`R`/`%` in the label. Calculation
     → `steps` with `scientific_math`, formula rows read-only, blanks bare-numeric (`KEYBOARD-02`/`03`). Check
     `core/keyboard-input.md` § Marking before choosing a value that carries a comma or a negative sign.
   - **Fresh numbers, fresh stimuli (`DESIGN-UNI-01`, `DESIGN-ECON-04/05`).** No real exam figure, schedule, graph value or
     extract text in a practice question. Keep the *structure* (formula → substitute → compute → interpret) and put the
     memo's common slip in as a distractor (e.g. forgetting to divide by ΔQ for marginal cost). Label invented data
     as illustrative — never attribute it to SARB / StatsSA.
   - **Drawn graphs (`DESIGN-ECON-03`).** Never ask for a drawing. Supply a fresh diagram and test the 4-mark scheme
     (axes, each curve, key point/area) as `multiple_choice` / `multi_select` / `match` (≤ 4 pairs) / `ordering`.
   - **Dependent pairs (`DESIGN-ECON-07`).** Keep a calculation and its sign-interpretation item in one lesson; check that no
     later correct option repeats an earlier answer.
   - **Essay lessons (Q5/Q6 only, `DESIGN-ECON-06`).** One lesson per essay. Mix content items on the memo's main-part headings
     and additional-part with strategy items from the printed rubric (intro max 2, no repeating the question; main part max
     26 with ≤ 8 for headings/examples; additional part max 10 with ≤ 2 for listing; higher-order conclusion max 2).
     `ordering` of an essay plan, `multiple_choice` on introductions, `multi_select` on conclusion ingredients. Reuse
     `essay_argumentation`. Never quote the memo's model prose.
   - **`match`**: ≤ 4 pairs (8 metadata elements); split longer matches across two questions.
   - **Check the running MC index-0 tally *before* finalising the set** (`DESIGN-UNI-06`/`SCHEMA-TYPE-06`; also the True/False
     cap `DESIGN-UNI-05`), counted across every Economics lesson already uploaded for this paper and year — Section A alone is
     16 MC per exam. Query rather than estimate:
     ```bash
     node -e "
     const { getPool, closePool } = require('./tools/lib/postgres');
     (async () => {
       const pool = getPool('dev');
       const { rows } = await pool.query(\`
         SELECT count(*) FILTER (WHERE metadata[1] = answer[1]) AS at_index_0, count(*) AS total
         FROM questions q JOIN lessons l ON q.lesson_id = l.id
         WHERE l.subject_id = 'economics' AND l.paper_id = '<nov_p1|nov_p2>' AND l.year_id = '<YYYY>'
           AND q.presentation_id = 'multiple_choice'
       \`);
       console.log(rows[0]);
       await closePool('dev');
     })();
     "
     ```
   - **Clues must not leak the answer.** For every "describe the term" and Q1.3 item, read the question, `context_text` and any
     hint for the term itself or a transparent derivation of it.
   - `questions.type` is one of application/calc/conversion/definition/fraction/interpretation/ordering/proof/ratio/reading/
     rounding — the validator does not check it, so pick it deliberately (`calc` for calculations, `definition` for
     "describe the term", `interpretation` for stimulus reading, `ordering` for sequences).
5. **Vocab dump** (pipeline Phase 3.5): `--subject economics` (Auth Proxy running). Re-run after any Phase 0b addition
   mid-lesson.
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to
   `scripts/add-economics-<year>-<paper>-q<N>.js`; `subject: "economics"` on every block. `aiExplanation`: one entry per real
   exam sub-question for Q1–Q4 where the practice set maps cleanly to numbered sub-parts (real `marks`); for Q5/Q6 **one**
   guidance entry (`marks: 40`, `number` = the question number as a string) summarising the memo's heading breakdown and the
   printed rubric as approach guidance — no model essay. Validate with `--curriculum` — **HARD STOP (`PIPE-10`)** — then
   `--dry-run`, inspect, then upsert to dev. Scripts built from the template run `apply-exam-gate.js` after a real dev upload
   (`VER-09`); confirm its output. **Commit** (`[Data] Add economics <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: every typed row declares a keyboard and its answer is typeable on it
   (`KEYBOARD-01`); no real exam number, schedule or stimulus text appears in a practice question; every drawn-graph item was
   converted, none asks the student to draw; every discursive concept uses a closed-form presentation; dependent pairs do not
   overlap; `match` ≤ 4 pairs; essay lessons carry no verbatim memo prose; image object keys sit under
   `exam_papers/dbe/economics/YYYY/<paper>/`; the MC index-0 tally (query above) is still ≤ ~10% across the paper; the exam
   gate printed by `apply-exam-gate.js` is what you expect (2.4.0 if any `text` / `scientific_math` row exists).

## After the paper is complete

Run `review-paper.md` (emulator review, **AMPM repo root**) before any prod step — in particular the typed rows (Text keyboard
keys are `text_key_<LETTER>`, see the English FAL review notes), the `steps` lessons, and image rendering of the larger graphs.
Prod push is a separate, owner-approved step: `tools/push-paper-to-prod.js` (exam-level, `VER-08`). It refuses content whose
derived exam minimum is above `LATEST_RELEASED`. Economics derives at most 2.4.0, which is already ≤ `LATEST_RELEASED`
(2.4.0 in the tooling today, 2.5.0 once the owed bump lands), so the gate does not block it. Do not touch the constant to
get around anything else (cf. the one-time English FAL override recorded in `tools/lib/feature-versions.js`). The prod
`subjects` row and the prod curriculum vocabulary (mirrored by the push tool) are part of that step.

## Lessons from the first paper (2025 Nov P1, 2026-10-14)

- `dump-curriculum-vocabulary.js` had a subject allowlist; `economics` was added to it. Dump with `--out temp/curriculum-vocab-economics.json`.
- Fresh figures are generated (matplotlib is available) and uploaded with `upload-question-supplementary.js --type graph --order <lesson>`; the
  tool prints `label: null` — set the label (`"Graph"`) in the script, and write the literal URL into each question (the validator evals the
  `questions` array alone, so no outer `const`). Label the chart itself "illustrative" (`DESIGN-ECON-05`). The bucket caches objects for a year,
  so never overwrite a published figure — use a new path.
- A taller question stem can push the last option below the fold on the first view; the capture's `_scroll` shot shows it. Not a defect.
- Phase 5 needs a runner that knows the Text keyboard: `text_key_<LETTER>`, `text_key_space`, `text_key_switch` (digits/punctuation screen,
  `text_key_-` etc.), `text_key_done`; numeric `standard_math` uses `maths_key_<char>`; a `steps` blank is `question_step_input_<n>` and submits via
  the keyboard's Done / "Submit answer". Type **every** `|` alternative, relaunching the lesson between attempts.
- Run the emulator review on a build at or above the exam's derived minimum (here 2.4.0; the dev build was 2.4.1-dev01).

