# Upload — DBE Agricultural Sciences (one lesson / subsection of a real exam question)

**Profile:** `subjects/dbe-agricultural-sciences.md` · **Shared rules:** `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`) ·
**Skeleton:** `core/upload-pipeline.md` (`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`, `AMPM-CONTENT-AI-EXP`,
`AMPM-CONTENT-KEYBOARD-INPUT`, `AMPM-CONTENT-APP-VERSIONS`,
`presentations/{multiple-choice,multi-select,match,ordering,fitb}.md` (Agricultural Sciences subset — profile; `steps`/`equation`/`fraction` unused).

> **`DESIGN-UNI-14`: 3–4 practice questions per lesson, 5 at most (validator-enforced).** Do NOT enter plan mode. Run once per lesson — a
> lesson is a subsection/theme of a real exam question (or a Section A topic cluster), named `"Question N.M: Description"` /
> `"Question 1: <Topic> (Section A)"`. **Commit after Phase 4, per lesson** — never batch lessons into one commit or one uninterrupted run.
> **Dev only**: nothing in this workflow touches prod.

Nothing is authored yet (profile ledger empty). First paper: **2025 Nov P2** (recommended — genetics, selection and numeric items are the
lower-risk shapes) or P1 (more photos and figures); the owner chooses. 2025 P1 and P2 are **one exam for gating** (`VER-01`), as are 2024's.

## Phase 0 — one-time subject setup, then per-lesson curriculum vocabulary

**0a. First lesson only: tooling and the `subjects` row.**

1. **Subject id — verify, never assume.** The profile's `agricultural_sciences` is a guess. Query dev `subjects` for an existing Agri row, and
   confirm `SubjectMapper.kt` (canonical checkout `~/StudioProjects/AMPM`) still falls through to `displayName.lowercase().replace(" ", "_")`.
   Whatever the row's `id` is wins; fix the profile and this doc to match before the first script (Life Sciences lost a rework to
   singular/plural).
   ```bash
   node -e "
   const { getPool, closePool } = require('./tools/lib/postgres');
   (async () => {
     const pool = getPool('dev');
     const { rows } = await pool.query(\"SELECT id, name, full_name, code, category, sort_order, is_active, is_published, min_app_version FROM subjects ORDER BY sort_order\");
     console.log(JSON.stringify(rows, null, 1));
     await closePool('dev');
   })();
   "
   ```
2. If no row exists, insert on **dev** (direct SQL, no tooling; get the user's go-ahead for the values first): next free `sort_order`, a `color`
   and `icon`, `syllabus` dbe, `is_published: true`, `is_active: true`, `min_app_version: null`; copy another DBE row's remaining columns. Do not
   create the prod row here. If a row exists, read `is_active` / `min_app_version` — Life Sciences' `is_active=false` hid it from onboarding.
3. **Tooling allowlists.** `tools/dump-curriculum-vocabulary.js` has an explicit subject allowlist (line ~45); add the Agri subject id (Economics
   needed the same one-word change). Check `tools/audit-answer-cues.js --subject <id>` accepts it too. `NAMESPACED_SUBJECTS`
   (`tools/lib/curriculum.js`) does **not** list it, so `curriculum_nodes.id` slugs are **global** — same as Economics/Business Studies.
4. Re-read `KeyboardResolver.kt` (AMPM `dev`): no Agri route is expected, which is fine because every typed row declares `keyboard_type`.

**0b. Every lesson: curriculum vocabulary.** Dump what exists, subject-scoped:

```bash
node tools/dump-curriculum-vocabulary.js --subject <agri_id> --out temp/curriculum-vocab-agricultural-sciences.json
```

Use the subject-scoped filename — the shared default `temp/curriculum-vocab.json` was silently overwritten by a concurrent session before (Life
Sciences). For cross-subject reuse also read `SELECT id, type, name, subject_id FROM curriculum_nodes ORDER BY subject_id, type, id`.

- **Units = the CAPS Grade 12 topics** (profile § Curriculum units): P1 `animal_nutrition`, `animal_production_protection_and_control`,
  `animal_reproduction`; P2 `agricultural_management_and_marketing`, `production_factors`, `basic_agricultural_genetics`. Topics are the concept a
  question tests (`ruminant_digestion`, `feed_digestibility`, `oestrus_cycle`, `livestock_diseases`, `marketing_channels`, `mendelian_crosses`),
  created per concept as they appear and reused.
- **Reuse across subjects first (`PIPE-08` at global scope).** Skill-shaped subtopics already exist from Business Studies / History / Economics /
  Life Sciences (`term_definition_recall`, `classification_and_criteria`, `sequencing_and_process`, `scenario_application`, `calculation_and_method`,
  `graph_interpretation`, `data_interpretation`) and Life Sciences' genetics ones. Reuse the row when the meaning is the same; create Agri-specific
  subtopics only for what is new (e.g. `diagram_label_identification` if Life Sciences' is not an equivalent — check `DESIGN-LIFE-03`'s label-ID
  items first). **Keep subtopics coarse** — a handful for the whole subject, not one per question.
- Create rows with `tools/create-curriculum-node.js` / `create-skill.js` / `create-tag.js` (**dev only**) before writing them into any question;
  re-dump (Phase 3.5) before validating. `push-paper-to-prod.js` mirrors this vocabulary later.

## Required inputs

Lesson name, which real exam question/sub-question(s) or Section A cluster it covers, paper (`nov_p1` / `nov_p2`), year, order, the paper **and** memo
PDF under `files/agricultural_sciences/nov_<year>/`, and the CAPS term plan. No video (`has_video: false`, `content_tier: 'free'`, `freemium_*: null`).
**Images are in scope** — Agri's stimuli are diagrams, photographs and graphs (Phase 2).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1). Read the question *and its memo section*. For each sub-question record: verb and marks (identify 1 / name 1 /
   state-give TWO 2 / explain 2 / calculate 3–4 / draw 6), the stimulus it reads, whether the memo wants one word or "any N", and its CAPS
   unit/topic. Flag: **(a)** calculations — note the memo's formula/substitution/answer split **and any `OR` tolerance** (`CLOSED-CALC-01`);
   **(b)** drawn items — P1 4.4.1, P2 2.5.1, P2 4.2.1 (`CLOSED-FIG-01`); **(c)** "reason for the answer to X" pairs and shared-stimulus blocks
   (`CLOSED-DISC-04`, `DESIGN-UNI-13`); **(d)** Section A items by topic — Section A **clusters by topic** into the Section B lessons
   (`DESIGN-UNI-10`); the profile's Section A mapping is approximate, so confirm item by item; **(e)** photograph items ("PICTURE A–D").
2. **Images** (pipeline Phase 1.5). Pull stimulus figures and memo pages with `tools/extract-exam-pages.py` (vector figures) or `pdfimages -png`
   (embedded rasters — the farm photographs are rasters). **Extract into a subject/paper-scoped folder**, e.g.
   `temp/images/agricultural_sciences/2025/nov_p1/q2/`, not bare `temp/images/qN/` (the script does not clean its output; stale files from a
   concurrent session collided before). Verify each directory's file count against the expected page count before wiring URLs. **Inspect every crop**
   (`PIPE-01`), rotate if needed, then `tools/upload-exam-images.js` (**dev only**, `PIPE-02`). Stimulus extracts go in as `supplementary_materials`
   labelled with the paper's own name (`"Diagram"`, `"Picture A"`, `"Graph"`, `"Table"`; `PIPE-03`, rename files distinctly when a question has several).
   These are the **exam reference** images; the practice questions use **fresh** stimuli (Phase 4). If a photo cannot be extracted cleanly, say so
   per lesson rather than uploading a placeholder.
   **Never re-upload different content under an existing object key** — objects are served with a one-year cache and the edge keeps the old bytes
   (Economics, 2026-10-14). Corrected or re-cut images get a new path.
3. **Lesson document** (pipeline Phase 2): standard template, `has_video: false`. Tags (`PIPE-06`) name CAPS concepts (`ruminant_digestion`,
   `oestrus_cycle`, `marketing_channels`, `monohybrid_cross`), never a scenario wrapper. 2–3 tags per lesson.
4. **Questions** (pipeline Phase 3) — the shared rules do the heavy lifting; Agri-specific decisions:
   - **Choose the presentation by the memo, not the verb** (`CLOSED-DISC-01`/`02`). "Name/State/Give TWO" → `multi_select` with same-family
     distractors (`CLOSED-DISC-02`); identify a part/picture/disease/tool → `multiple_choice` or `match` on a figure; sequences (feed flow, stages of
     parturition, entrepreneurial phases) → `ordering` (`DESIGN-UNI-15`); A-only/B-only/both/none → `multiple_choice` with the fixed four options;
     "choose from the list" (P1 3.4 tools, 3.8 diseases) → `match` (≤ 4 pairs) or `multiple_choice`.
   - **Typed answers declare `keyboard_type` — every one (`KEYBOARD-04`, `CLOSED-KB-01`).** Number → `standard_math`, bare, unit/`R`/`%` in the
     label (no gate). Single unambiguous term (`Cellulase`, `Urea`, `Hydrocephalus`, `Pig`) → `text`, every memo form joined with `|`, UK/US spelling
     both (**2.4.0 — gating accepted by the owner 2026-10-15**). Memo "any 1 of N" and slash answers → selection, not `text`. Genotypes (`Dd`) are
     never typed. Ratio → ask for the number after the colon. Check `core/keyboard-input.md` § Marking before storing a comma or a negative.
   - **Calculations (`CLOSED-CALC-01`).** Fresh numbers; one unknown; final value typed; formula and substitution in the `aiExplanation`; the
     memo's tolerance stored (`4.9|5` for nutritive ratio). Reproduce Agri's formulas exactly as in the profile § Subject rules (DM absorbed,
     digestibility coefficient, nutritive ratio, digestible energy, profit, closing balance). Make the memo's common slip a distractor (forgetting
     the moisture → dry-matter conversion; using TDN instead of TDN − DP).
   - **Drawn items → generated figure (`CLOSED-FIG-01`/`02`).** Generate with matplotlib, upload with `tools/upload-question-supplementary.js
     --type graph|diagram --order <lesson>` (it prints `label: null` — set the label in the script), write the **literal URL** into each question
     (no outer `const`), mark the figure illustrative if it carries invented data, **never overwrite a published figure path**. Combined bar graphs
     (P1 4.4.1, P2 2.5.1) are **dual-axis**. One shared figure serves 3–4 questions: graph type, correct criteria (`multi_select`), a value read
     (`fitb` numeric), the highest/lowest (`multiple_choice`). A figure never carries the answer to the question beside it.
   - **Punnett squares and crosses (P2 Q4).** Decompose: gametes (`multiple_choice`), genotypes (`multi_select`), fraction/percentage with the
     trait (`fitb` numeric or `multiple_choice`), expected number from N offspring (`fitb` numeric). Do not display a filled square when the question
     is about it.
   - **Fresh stimuli (`DESIGN-UNI-01`, `DESIGN-UNI-08`).** No real exam table, picture text or graph value in a practice question. Prefer relational
     framing (symptom → disease → vector; need → tool; production system → welfare factor) over re-asking an isolated fact.
   - **Label-identification figures** (digestive systems, accessory glands, reproductive tracts, sperm cell): a generated anatomy figure is used
     only if it is clearly correct on inspection; otherwise ask the part **by function with no figure** (`CLOSED-FIG-02`).
   - **Photograph items (P1 Q3, P2 3.4/4.4/4.5).** Use the cropped exam photo as the lesson reference. The practice question may describe the scene
     in text, but the description must not name the answer (`feedback-clues-never-leak-answer`).
   - **Section A 1.4 "change the underlined word"** → `multiple_choice` (`CLOSED-KB-01` rule 5).
   - **Check the running MC index-0 tally *before* finalising the set** (`DESIGN-UNI-06`/`SCHEMA-TYPE-06`; True/False cap `DESIGN-UNI-05`),
     counted across every Agri lesson already uploaded for this paper and year; Section A alone has ~20 MC per paper. Query rather than estimate:
     ```bash
     node -e "
     const { getPool, closePool } = require('./tools/lib/postgres');
     (async () => {
       const pool = getPool('dev');
       const { rows } = await pool.query(\`
         SELECT count(*) FILTER (WHERE metadata[1] = answer[1]) AS at_index_0, count(*) AS total
         FROM questions q JOIN lessons l ON q.lesson_id = l.id
         WHERE l.subject_id = '<agri_id>' AND l.paper_id = '<nov_p1|nov_p2>' AND l.year_id = '<YYYY>'
           AND q.presentation_id = 'multiple_choice'
       \`);
       console.log(rows[0]);
       await closePool('dev');
     })();
     "
     ```
   - **Variety rule (validator):** a 3-question set needs ≥ 2 presentation types, 4+ needs ≥ 3 — mix selection with a numeric `fitb`/`ordering`/`match`.
   - **Clues must not leak the answer.** For every "identify" and "term" item, read the question, `context_text`, options and any hint for the answer
     or a transparent derivation of it (disease names inside symptom stems, organ names inside function stems).
   - `questions.type` is one of application/calc/conversion/definition/fraction/interpretation/ordering/proof/ratio/reading/rounding — the validator
     does not check it, so pick deliberately (`calc` for calculations, `definition` for terms, `interpretation` for graph/table reading,
     `ordering` for sequences, `ratio` for genotypic ratios/nutritive ratio).
5. **Vocab dump** (pipeline Phase 3.5): `--subject <agri_id> --out temp/curriculum-vocab-agricultural-sciences.json` (Auth Proxy running). Re-run
   after any Phase 0b addition mid-lesson.
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to `scripts/add-agricultural-sciences-<year>-<paper>-q<N>-<slug>.js`
   (**never** copy another subject's script as a template — they predate `KEYBOARD-04`); `subject: "<agri_id>"` on every block.
   `aiExplanation`: one `sub_questions` entry per real exam sub-question the lesson covers, grounded in the **real** memo data (not the fresh
   practice scenario — Life Sciences shipped a content bug where the two drifted), `AIEXP-03`/`04` bullet counts (2–4). Validate with
   `--curriculum` against the subject-scoped snapshot — **HARD STOP (`PIPE-10`)** — then `--dry-run`, inspect, then upsert to dev. Scripts built
   from the template run `apply-exam-gate.js` after a real dev upload (`VER-09`); confirm its output.
   **Commit** (`[Data] Add agricultural_sciences <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: every typed row declares a keyboard and its answer is typeable on it (`KEYBOARD-01`); no real exam
   number, table, picture text or graph value appears in a practice question; every drawn-graph/Punnett item was converted and none asks the student
   to draw; every "name/give N" item is a `multi_select` with same-family distractors; no genotype is typed; each stored numeric answer carries the memo's
   tolerance; every figure-dependent question has `supplementary_material`; image object keys sit under `exam_papers/dbe/<agri_id>/YYYY/<paper>/`;
   the MC index-0 tally is still ≤ ~10% across the paper; the exam gate printed by `apply-exam-gate.js` is what you expect (2.4.0 if any `text` row
   exists, none if every typed row is `standard_math`); run `tools/audit-answer-cues.js --subject <agri_id>` before upload.

## After the paper is complete

Run `review-paper.md` (emulator review, **AMPM repo root**) before any prod step — in particular the `text` rows (Text keyboard keys are
`text_key_<LETTER>`, `text_key_space`, `text_key_switch`, `text_key_done`; `standard_math` uses `maths_key_<char>`; type **every** `|` alternative,
relaunching the lesson between attempts), long `ordering` chips, option wrapping next to the "view diagram" button (open Life Sciences app bug), and
rendering of the larger generated graphs. Run the review on a build at or above the exam's derived minimum (2.4.0).
Prod push is a separate, owner-approved step: `tools/push-paper-to-prod.js` (exam-level, `VER-08`). It refuses an exam whose derived minimum is above
`LATEST_RELEASED`, so **if any `text` row exists the exam waits for the 2.4.0 tag** (`LATEST_RELEASED` bump per `VER-06`); an all-`standard_math`
paper is pushable now. Do not touch the constant to get around it. The prod `subjects` row and the prod curriculum vocabulary (mirrored by the push
tool) are part of that step. Update the profile ledger and write a memory entry when a paper lands.

## Gotchas inherited from sibling subjects (check before assuming they are fixed)

- A re-split changes lesson contents but lesson/question ids derive from the lesson `order`, so the app caches the old rows: `adb shell pm clear
  com.esma.ampm.dev` before re-capturing.
- A taller stem can push the last option below the first view; the capture's `_scroll` shot shows it. Not a defect.
- `match` ≤ 4 pairs (8 metadata elements); split longer matches across two questions.
- Isolated `(A/B)` in option text renders as a stacked fraction — avoid it.

## Lessons from the first paper (2025 Nov P1, 2026-10-15)

- No `subjects` row existed: inserted on dev (`capabilities` is `text[]`, pass `'{}'`, not JSON). `dump-curriculum-vocabulary.js` allowlist needed the id.
- Cropping: `extract-exam-pages.py` page specs are easiest computed from `fitz` word positions (labels such as `2.3`, `3.6`) — cut ~6pt above a
  label and end 5pt above the next; page-end crops need an explicit `end=778` or the footer shows. Rows of a table (1.2.x) need a 2pt margin.
- The validator caught `DESIGN-UNI-16` length cues, the 5-question warning and `exam_weight` 1–3; plan option lengths up front. Multi-select
  options must not start (or end) with the correct ones.
- Rebalance MC positions with a deterministic pattern in the generator, then check the paper-level tally with the SQL query (it ended 0/30).
- An isolated `(unit/unit)` in a stem renders as a stacked fraction — drop the unit from the stem (found in review, L16 Q1).
- Review runner: `review-capture-answers.js` types digits only; for `text` rows use a copy that taps `text_key_<LETTER>` / `text_key_space` and submits with `text_key_done`.
- **`match` columns must have unique labels (found 2026-10-15, P2 L6 Q3).** Two identical right-column labels (`Quantitative` twice) make the pairing ambiguous; check with a query
  over `questions` where `presentation_id = 'match'`. Use `multi_select` for a two-category sort.
- Check topic/tag ids against other subjects before creating them (global ids: `genetics_terminology`, `mutations` and `labour_productivity` already belonged to Life Sciences/Economics).
- A calculation that must read values off a figure should not state them in the stem, and the figure's gridlines should land on the values (200-step axis for 1 000 / 1 800).

## Lessons from 2024 Nov P2 (review, 2026-10-16)

- **Multi-select options are shown in stored order.** A generator that keeps correct options off the ends makes "the first and last are always wrong" a
  paper-level cue the validator does not catch (it only checks all-first-N / all-last-N). Rotate correct options through every position, ends included.
- **A typed answer must not appear anywhere else in its lesson** — not in a sibling stem, option or clue (four leaks in this paper, one in P1). Grep each
  `fitb` answer against the other questions of its lesson before upload.
- **Re-uploading a row as a different presentation leaves stale columns.** The upsert does not null columns the new row omits: a `fitb` turned `match`
  kept `keyboard_type = text` (and would hold the exam gate). Clear it on dev and re-run `apply-exam-gate.js`.
- A figure beside a "which criteria must the graph have" question shows the answer — ask that one without the figure.

