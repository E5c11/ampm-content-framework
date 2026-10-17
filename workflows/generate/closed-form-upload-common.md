# Upload — closed-form subjects, common procedure

**Rules:** `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`) · **Skeleton:** `core/upload-pipeline.md` (`AMPM-CONTENT-PIPELINE`) · **Also:** `AMPM-CONTENT-SCHEMA`,
`AMPM-CONTENT-DESIGN`, `AMPM-CONTENT-AI-EXP`, `AMPM-CONTENT-KEYBOARD-INPUT`, `AMPM-CONTENT-APP-VERSIONS`, `presentations/*.md` for the types a profile allows.

**What this is.** The procedure that Tourism, Agricultural Sciences, Business Studies, Economics and Accounting each re-wrote in their own `upload-*.md`
(extracted 2026-10-17 while writing the Computer Applications Technology workflow). A subject workflow that points here states **only its deltas**: the paper
layout, the subject's own presentation mix, its stimuli and hazards. The existing subject workflows keep their own copies for now and are not repointed;
where the two differ, **this file is newer** and the older copy should be reconciled when it is next edited.

> **`DESIGN-UNI-14`: 3–4 practice questions per lesson, 5 at most (validator-enforced).** Do NOT enter plan mode. Run once per lesson — a lesson is a
> subsection/theme of a real exam question (or a Section A topic cluster). **Commit after Phase 6, per lesson** — never batch lessons into one commit or one
> uninterrupted run. **Dev only**: nothing in this workflow touches prod.

2.4.0 is the authoring baseline (`VER-11`): use `text` `fitb` wherever it beats a choice item; the exam gate is derived and written by the tooling (`VER-09`).

## Phase 0a — first lesson of a subject only: the `subjects` row and the tooling

1. **Subject id and paper id — verify, never assume.** Since 2026-10-15 the `subjects` table is the full NSC catalogue (`core/subject-catalogue.md`,
   backend `V85`): the row usually **already exists** with an id the catalogue chose (`tourism`, `accounting`, `cat`), which can differ from what
   `SubjectMapper.kt`'s fallback (`displayName.lowercase().replace(" ", "_")`) would produce. **The row's `id` wins.** Query dev, then fix the profile to match
   before the first script.
   ```bash
   node -e "
   const { getPool, closePool } = require('./tools/lib/postgres');
   (async () => {
     const pool = getPool('dev');
     const { rows } = await pool.query(\"SELECT id, name, full_name, code, category, sort_order, is_active, hosted, is_published, min_app_version FROM subjects WHERE id = '<subject_id>'\");
     console.log(JSON.stringify(rows, null, 1));
     await closePool('dev');
   })();
   "
   ```
2. **If a row is missing** (rare now), insert on **dev** only, with the user's go-ahead for the values: next free `sort_order`, `color`, `category`,
   `is_published: true`, `is_active: true`, `min_app_version: null` (`capabilities` is `text[]` — `'{}'`). Do not create the prod row here.
   **`hosted` — verify, don't assume.** On an environment with backend `V95` (dev, verified 2026-10-17: triggers `trg_lessons_mark_subject_hosted` /
   `trg_questions_mark_subject_hosted` present) it flips to `true` by itself when the first lesson or question is published (`CATALOGUE-01`); **after the first upload,
   re-read the row and confirm `hosted = true`**. Where the trigger is absent (an environment below `V95`, or if the row did not flip), set it by hand **with an
   `updated_at` bump** in the same statement (`UPDATE subjects SET hosted = TRUE, updated_at = NOW() WHERE id = '<subject_id>'`, dev first; prod only with the owner's go-ahead) —
   without the bump, clients that already synced never see it (`core/subject-catalogue.md` § Gotcha). Tourism and Accounting were flipped by hand before `V95` existed.
3. **Tooling allowlists.** `tools/dump-curriculum-vocabulary.js` has an explicit subject allowlist; add the id if absent. `tools/audit-answer-cues.js --subject <id>` takes any id.
   `NAMESPACED_SUBJECTS` (`tools/lib/curriculum.js`) does not list closed-form subjects, so `curriculum_nodes.id` slugs are **global**: check every unit/topic/
   subtopic/tag id against other subjects before creating it, reuse when the meaning is the same, and prefix with the subject (`cat_…`) when it is not.
4. **Single-paper or P2-only subjects.** Confirm the validator, upload template, `push-paper-to-prod.js` (partial-exam check) and the app's paper picker
   cope with a subject whose only authored paper is the one you are writing. If the paper picker or push tool trips, stop and report it; do not edit the tool.
5. Re-read `KeyboardResolver.kt`: no closed-form subject has a keyboard route, which is fine because every typed row declares `keyboard_type`.

## Phase 0b — every lesson: curriculum vocabulary

```bash
node tools/dump-curriculum-vocabulary.js --subject <subject_id> --out temp/curriculum-vocab-<subject_id>.json
```

Use the subject-scoped filename (the shared default was overwritten by a concurrent session before). For cross-subject reuse also read
`SELECT id, type, name, subject_id FROM curriculum_nodes ORDER BY subject_id, type, id`.

- **Units = the CAPS topics** the profile lists. Topics are the concept a question tests, created per concept and reused. Reuse skill-shaped subtopics
  across subjects first (`term_definition_recall`, `classification_and_criteria`, `sequencing_and_process`, `scenario_application`, `calculation_and_method`,
  `data_interpretation`); keep subtopics coarse — a handful for the whole subject.
- Create rows with `tools/create-curriculum-node.js` / `create-skill.js` / `create-tag.js` (**dev only**) before writing them into any question; re-dump
  (Phase 3.5) before validating.

## Per-lesson phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1). Read the question *and its memo section*. For each sub-question record: verb and marks, the stimulus it reads, whether the
   memo wants one term or "any N", whether the memo says "accept any valid answer" (stricter distractor audit, `CLOSED-DISC-02`), and its topic. Flag linked
   pairs (`CLOSED-DISC-04`, `DESIGN-UNI-13`), Section A items to cluster by topic (`DESIGN-UNI-10`, `CLOSED-A-01`), memo `NOTE:` lines that accept two answers, and
   any stimulus the student cannot be given (`CLOSED-FIG-02`/`04`).
2. **Images** (pipeline Phase 1.5). Pull stimulus figures and memo pages with `tools/extract-exam-pages.py` (vector figures) or `pdfimages -png` (embedded
   rasters). **Extract into a subject/paper-scoped folder** (`temp/images/<subject_id>/<year>/<paper>/q<N>/`) and verify each directory's file count against the
   expected page count. **Inspect every crop** (`PIPE-01`), then `tools/upload-exam-images.js` (**dev only**, `PIPE-02`). Stimulus extracts go in as
   `supplementary_materials` labelled with the paper's own name (`PIPE-03`); these are the **exam reference** images — practice questions use **fresh** stimuli.
   **Never re-upload different content under an existing object key**; corrected images get a new path. Generated practice figures use
   `tools/upload-question-supplementary.js` (`CLOSED-FIG-02`).
3. **Lesson document** (pipeline Phase 2): standard template, `has_video: false`, `content_tier: 'free'`, `freemium_*: null`. Tags (`PIPE-06`) name concepts,
   never a scenario wrapper. 2–3 tags per lesson. Lesson names follow `"Question N.M: Description"` / `"Question N: <Topic> (Section A)"`.
4. **Questions** (pipeline Phase 3):
   - **Choose the presentation by the memo, not the verb** (`CLOSED-DISC-01`/`02`/`03`, `CLOSED-A-01`).
   - **Typed answers declare `keyboard_type` — every one** (`KEYBOARD-04`, `CLOSED-KB-01`). Number → `standard_math`, bare, unit in the label. Single unambiguous
     term → `text`, every memo form joined with `|`, UK spelling variants included. Check `core/keyboard-input.md` § Marking, and the `text` keyboard's real key
     set, before storing a character (Tourism verified it from `TextKeyboard.kt`: A–Z, digits, `. , ; : ! ? ' " ( ) - / & %` and space — so no `=` `<` `>` `#` `@` `+`; re-read the source, the app wins).
   - **One correct option only.** If the memo accepts two near-identical answers, put one in the options, never both.
   - **Fresh stimuli** (`DESIGN-UNI-01`/`08`); never copy the exam's table, picture text, or scenario; invented data is labelled illustrative.
   - **Check the running MC index-0 tally before finalising the set** (`DESIGN-UNI-06`; True/False cap `DESIGN-UNI-05`), counted across every lesson already
     uploaded for the paper:
     ```bash
     node -e "
     const { getPool, closePool } = require('./tools/lib/postgres');
     (async () => {
       const pool = getPool('dev');
       const { rows } = await pool.query(\`
         SELECT count(*) FILTER (WHERE metadata[1] = answer[1]) AS at_index_0, count(*) AS total
         FROM questions q JOIN lessons l ON q.lesson_id = l.id
         WHERE l.subject_id = '<subject_id>' AND l.paper_id = '<paper>' AND l.year_id = '<YYYY>'
           AND q.presentation_id = 'multiple_choice'
       \`);
       console.log(rows[0]);
       await closePool('dev');
     })();
     "
     ```
   - **Variety rule (validator):** a 3-question set needs ≥ 2 presentation types, 4+ needs ≥ 3.
   - **Clues must not leak the answer.** For every "identify" and "term" item, read the stem, `context_text`, options and any hint for the answer or a transparent
     derivation of it (a body's abbreviation spelled out in the stem).
   - `questions.type` is one of application/calc/conversion/definition/fraction/interpretation/ordering/proof/ratio/reading/rounding (not validator-checked).
5. **Vocab dump** (pipeline Phase 3.5): re-run after any Phase 0b addition mid-lesson.
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to `scripts/add-<subject>-<year>-<paper>-l<NN>-<slug>.js` (**never** copy another
   subject's script as a template — they predate `KEYBOARD-04`); `subject: "<subject_id>"` on every block. `aiExplanation`: one `sub_questions` entry per real
   exam sub-question the lesson covers, grounded in the **real** memo data (not the fresh practice scenario), `AIEXP-03`/`04` bullet counts (2–4). Validate with
   `--curriculum` against the subject-scoped snapshot — **HARD STOP (`PIPE-10`)** — then `--dry-run`, inspect, then upsert to dev. Scripts built from the template
   run `apply-exam-gate.js` after a real dev upload (`VER-09`); confirm its output. **Commit** (`[Data] Add <subject> <year> <paper> L<NN> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: every typed row declares a keyboard and its answer is typeable on it (`KEYBOARD-01`); no real exam number,
   table, picture text or scenario appears in a practice question; every "name/give N" item is a `multi_select` with same-family distractors that fail the
   "would a marker accept it?" test; no `multiple_choice` has two memo-correct options; every figure-dependent question has `supplementary_material`; image
   object keys sit under `exam_papers/dbe/<subject_id>/YYYY/<paper>/`; the MC index-0 tally is ≤ ~10% across the paper; the gate printed by
   `apply-exam-gate.js` is what you expect; `match` right-column labels are unique; run `tools/audit-answer-cues.js --subject <subject_id>` before upload.

## After the paper is complete

Run `review-paper.md` (emulator review, **AMPM repo root**) before any prod step — the `text` rows in particular (Text keyboard keys are
`text_key_<LETTER>`, `text_key_space`, `text_key_switch`, `text_key_done`; `standard_math` uses `maths_key_<char>`; type **every** `|` alternative, relaunching the
lesson between attempts), two-blank answers, long `ordering` chips, option wrapping, and every generated figure at phone width.

Prod push is a separate, owner-approved step: `tools/push-paper-to-prod.js` (exam-level, `VER-08`), pushed **unpublished**, then `--publish`. Do not touch
`LATEST_RELEASED` to get around a refusal. The prod `subjects` row (check it exists — `V85` seeds the catalogue only where it was deployed; **prod was at Flyway V84 on 2026-10-17: no `hosted` column and no `cat` row**, so the row is an owner step and `hosted` arrives with the `V85`–`V95` deploy, whose `V95` sweep flips every subject that already has published content) and the prod
curriculum vocabulary (mirrored by the push tool) are part of that step. Update the profile ledger and write a memory entry when a paper lands.

## Gotchas (check before assuming they are fixed)

- A re-split changes lesson contents but lesson/question ids derive from the lesson `order`, so the app caches the old rows: `adb shell pm clear
  com.esma.ampm.dev` before re-capturing.
- A taller stem can push the last option below the first view; the capture's `_scroll` shot shows it. Not a defect.
- `match` ≤ 4 pairs (8 metadata elements, `MATCH-01`) in the lesson UI; split a larger Section A match across several questions. A `match` has exactly N pairs
  and no spare right-hand items — leftover distractor terms belong in a `multiple_choice` instead.
- Isolated `(A/B)` or `(unit/unit)` in a stem or option renders as a stacked fraction — avoid it.
- Numbers with spaced thousands wrap mid-number: write U+00A0 between groups in stems, options and match chips.
- Cropping: page specs for `extract-exam-pages.py` are easiest computed from `fitz` word positions; page-end crops need an explicit `end=778` or the footer shows.
- The validator enforces `DESIGN-UNI-16` length cues, the 5-question cap and `exam_weight` 1–3; plan option lengths up front, and keep correct options off the
  first/last position of a multi-select.
