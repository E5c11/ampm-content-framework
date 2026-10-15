# Upload — DBE Accounting (one lesson / subsection of a real exam question)

**Profile:** `subjects/dbe-accounting.md` · **Shared rules:** `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`, esp. `CLOSED-FIG-03`, `CLOSED-CALC-01`,
`CLOSED-KB-01`, `CLOSED-FMT-01`) · **Skeleton:** `core/upload-pipeline.md` (`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `AMPM-CONTENT-KEYBOARD-INPUT`, `AMPM-CONTENT-APP-VERSIONS`,
`presentations/{fitb,multiple-choice,multi-select,match,ordering,steps}.md` (`equation`/`fraction` unused).

> **`DESIGN-UNI-14`: 3–4 practice questions per lesson, 5 at most (validator-enforced).** Do NOT enter plan mode. Run once per lesson — a
> lesson is a subsection/theme of a real exam question (or a theory/interpretation cluster), named `"Question N.M: Description"`. **Commit after Phase 4,
> per lesson** — never batch lessons into one commit or one uninterrupted run. **Dev only**: nothing in this workflow touches prod.

Nothing is authored yet (profile ledger empty). **Run the pilot lesson first** (profile § Authoring plan): P1 Q1.2 (Ordinary Share Capital note) plus one SOFP
section as lettered A/B/C blanks. Do not author further lessons until the pilot has passed `validate-questions.js` **and** an emulator look at the statement
image (legibility on a phone, highlight style, "view diagram" button overlap). The owner then chooses P1 or P2 first. 2025 P1 and P2 are **one exam for
gating** (`VER-01`), as are 2024's — but an Accounting exam is expected to derive the floor version (no `text` rows), so there is nothing to gate.

## Phase 0 — one-time subject setup, then per-lesson curriculum vocabulary

**0a. First lesson only: tooling and the `subjects` row.**

1. **Subject id — verify, never assume.** The profile's `accounting` is a guess. Query dev `subjects` for an existing row and confirm `SubjectMapper.kt`
   (canonical checkout `~/StudioProjects/AMPM`) still falls through to `displayName.lowercase().replace(" ", "_")`. Whatever the row's `id` is wins; fix the
   profile and this doc to match before the first script.
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
2. If no row exists, insert on **dev** (direct SQL; get the user's go-ahead for the values first): next free `sort_order`, a `color` and `icon`, `syllabus` dbe,
   `is_published: true`, `is_active: true`, `min_app_version: null`; `capabilities` is `text[]` (pass `'{}'`, not JSON); copy another DBE row's remaining
   columns. Do not create the prod row here. If a row exists, read `is_active` / `min_app_version`.
3. **Tooling allowlists.** `tools/dump-curriculum-vocabulary.js` has an explicit subject allowlist; add the Accounting id. Check
   `tools/audit-answer-cues.js --subject <id>` accepts it. `NAMESPACED_SUBJECTS` (`tools/lib/curriculum.js`) does not list it, so `curriculum_nodes.id` slugs are
   **global**.
4. Re-read `KeyboardResolver.kt` (AMPM `dev`): no Accounting route is expected, which is fine because every typed row declares `keyboard_type`.
5. **Statement renderer.** There is no figure tool for tables yet. Choose and record one before the pilot (candidates: matplotlib table, or HTML→PNG via a
   headless browser), keep the generator under `scripts/` next to the lesson scripts, and make it take a data object (rows, columns, highlighted cells with
   letters) so one generated statement can serve several questions. Check what is installed rather than assuming.

**0b. Every lesson: curriculum vocabulary.**

```bash
node tools/dump-curriculum-vocabulary.js --subject <accounting_id> --out temp/curriculum-vocab-accounting.json
```

Use the subject-scoped filename (the shared default was overwritten by a concurrent session before). For cross-subject reuse also read
`SELECT id, type, name, subject_id FROM curriculum_nodes ORDER BY subject_id, type, id`.

- **Units = the CAPS Grade 12 topics** (profile § Curriculum units): P1 `company_financial_statements`, `cash_flow_statement`, `financial_indicators`,
  `interpretation_of_financial_information`, `corporate_governance`; P2 `reconciliations`, `stock_valuation`, `cost_accounting`, `budgeting`. Topics are the
  concept a question tests (`share_capital_note`, `bank_reconciliation`, `weighted_average_valuation`, `acid_test_ratio`), created per concept and reused.
- **Reuse across subjects first (`PIPE-08` at global scope):** `calculation_and_method`, `data_interpretation`, `scenario_application`,
  `term_definition_recall`, `classification_and_criteria`, `sequencing_and_process`. Keep subtopics coarse.
- Create rows with `tools/create-curriculum-node.js` / `create-skill.js` / `create-tag.js` (**dev only**) before writing them into any question; re-dump
  (Phase 3.5) before validating. Check topic/tag ids against other subjects first (global ids collide).

## Required inputs

Lesson name, which real exam question/sub-question(s) or cluster it covers, paper (`nov_p1` / `nov_p2`), year, order, the paper, **memo and answer book**
PDFs under `files/accounting/nov_<year>/`, the Financial Indicator Formula Sheet (end of the paper), and the CAPS term plan. No video (`has_video: false`,
`content_tier: 'free'`, `freemium_*: null`).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1). Read the question *and its memo section*. For each sub-question record: verb and marks, the information (A, B, C …) it
   draws on, what the memo marks (final figure vs. method vs. both), any "can be negative", "ignore brackets" or carried-forward (`CS`) rule, and its CAPS
   unit/topic. Flag: **(a)** statement/note/reconciliation completions → lettered-blank figure (`CLOSED-FIG-03`); **(b)** single calculations (closing stock,
   ratio, change in receivables) → one-blank `fitb` (`CLOSED-CALC-01`); **(c)** interpretation ("quote TWO indicators with trends") → `multi_select`
   (`CLOSED-DISC-01`/`02`); **(d)** a calculation whose result drives the next (carried forward) → one **linked** lesson (`DESIGN-UNI-13`); **(e)**
   management/ethics/governance items → closed-form selection.
2. **Images** (pipeline Phase 1.5). Pull the paper's information pages and memo pages with `tools/extract-exam-pages.py` into a subject/paper-scoped folder,
   e.g. `temp/images/accounting/2025/nov_p1/q1/` (the script does not clean its output). Verify each directory's file count against the expected page count.
   **Inspect every crop** (`PIPE-01`), then `tools/upload-exam-images.js` (**dev only**, `PIPE-02`). Statement/information extracts go in as
   `supplementary_materials` labelled with the paper's own name ("Information", "Answer Book page"; `PIPE-03`). These are the **exam reference** images; the
   practice questions use **fresh** statements (Phase 4). **Never re-upload different content under an existing object key** (one-year edge cache); corrected
   images get a new path.
3. **Lesson document** (pipeline Phase 2): standard template, `has_video: false`. Tags (`PIPE-06`) name CAPS concepts (`share_capital_note`,
   `bank_reconciliation`), never a scenario wrapper. 2–3 tags per lesson.
4. **Questions** (pipeline Phase 3) — Accounting decisions:
   - **Lettered-blank figure (`CLOSED-FIG-03`).** Generate the statement with fresh numbers and the exam's line structure; highlight cells A/B/C (letter
     inside, readable without colour); max 3 independent, anchored blanks; one numeric `fitb`, `keyboard_type: "standard_math"`; `supplementary_material` with
     `type: "table"` and the exam's own heading. Upload with `tools/upload-question-supplementary.js --type table --order <lesson>` (it prints `label: null` — set
     the label in the script), write the **literal URL** into each question (no outer `const`), and **never overwrite a published figure path**.
   - **Data integrity of the generated statement.** It must balance (assets = equity + liabilities; reconciliation totals agree; cash flow ties to the
     opening/closing cash) with the blanks' stored values — compute the figure and the answers from one data object, not by hand, and assert it in the
     generator. A statement that does not tie is a content bug the memo would catch.
   - **Typed answers declare `keyboard_type` (`KEYBOARD-04`, `CLOSED-KB-01`).** Numbers → `standard_math`, bare (`4584740`, `-150000`), `R`/`%`/units in the label
     and the stem. Ratios: one number. Store the paper's "ONE decimal point" rounding and the memo's `OR` alternatives with `|`. **No `text` rows** — account
     names and narrations are `multiple_choice`/`match`. Check `core/keyboard-input.md` § Marking before storing a comma or a negative.
   - **Calculations (`CLOSED-CALC-01`).** Fresh numbers; one unknown; final value typed; formula and working in the `aiExplanation`. Quote the formula from the
     Formula Sheet **as printed** (do not recall it). Make the memo's common slip a distractor or a wrong-method option (FIFO instead of weighted average;
     closing instead of average equity; including a cash-in-transit item in the wrong column).
   - **Interpretation (`CLOSED-DISC-01`/`02`).** Options are *indicator + trend + reason*; distractors are the wrong-direction or wrong-indicator versions from
     the same family. Supply the small indicator table as a generated figure.
   - **Sequences** (bank-reconciliation steps, closing-entries order, purchase-to-payment) → `ordering` (`DESIGN-UNI-15`).
   - **Fresh stimuli (`DESIGN-UNI-01`).** No real exam business name, figure or table in a practice question; invent businesses and numbers, keep the
     structure the memo marks.
   - **Check the running MC index-0 tally *before* finalising the set** (`DESIGN-UNI-06`/`SCHEMA-TYPE-06`; True/False cap `DESIGN-UNI-05`), counted across every
     Accounting lesson already uploaded for this paper and year. Query rather than estimate:
     ```bash
     node -e "
     const { getPool, closePool } = require('./tools/lib/postgres');
     (async () => {
       const pool = getPool('dev');
       const { rows } = await pool.query(\`
         SELECT count(*) FILTER (WHERE metadata[1] = answer[1]) AS at_index_0, count(*) AS total
         FROM questions q JOIN lessons l ON q.lesson_id = l.id
         WHERE l.subject_id = '<accounting_id>' AND l.paper_id = '<nov_p1|nov_p2>' AND l.year_id = '<YYYY>'
           AND q.presentation_id = 'multiple_choice'
       \`);
       console.log(rows[0]);
       await closePool('dev');
     })();
     "
     ```
   - **Variety rule (validator):** a 3-question set needs ≥ 2 presentation types, 4+ needs ≥ 3 — pair a lettered-blank `fitb` with a selection question
     (which treatment / why / which direction).
   - **Clues must not leak the answer.** A label, stem or figure never states a blank's value or a transparent derivation of it (`DESIGN-UNI-15`/`16`).
   - `questions.type` is one of application/calc/conversion/definition/fraction/interpretation/ordering/proof/ratio/reading/rounding — the validator does not
     check it, so pick deliberately (`calc` for statement and ratio blanks, `interpretation` for indicator commentary, `definition` for terms).
5. **Vocab dump** (pipeline Phase 3.5): `--subject <accounting_id> --out temp/curriculum-vocab-accounting.json` (Auth Proxy running). Re-run after any
   Phase 0b addition mid-lesson.
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to `scripts/add-accounting-<year>-<paper>-q<N>-<slug>.js` (**never** copy
   another subject's script as a template — they predate `KEYBOARD-04`); `subject: "<accounting_id>"` on every block. `aiExplanation`: one `sub_questions`
   entry per real exam sub-question the lesson covers, grounded in the **real** memo data (not the fresh practice scenario — the two drifted in Life Sciences),
   `AIEXP-03`/`04` bullet counts (2–4). Validate with `--curriculum` against the subject-scoped snapshot — **HARD STOP (`PIPE-10`)** — then `--dry-run`,
   inspect, then upsert to dev. Run `apply-exam-gate.js` after a real dev upload (`VER-09`); confirm it reports no gate (floor version).
   **Commit** (`[Data] Add accounting <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: every typed row declares a keyboard and its answer is typeable on it (`KEYBOARD-01`); no `text` row exists
   and `derive-exam-min.js` returns the floor; every statement figure balances and matches its stored answers; each lettered-blank question has ≤ 3 blanks, all
   independent and anchored; each stored numeric answer carries the memo's tolerance and rounding; every figure-dependent question has
   `supplementary_material`; image object keys sit under `exam_papers/dbe/<accounting_id>/YYYY/<paper>/`; the MC index-0 tally is ≤ ~10% across the paper;
   run `tools/audit-answer-cues.js --subject <accounting_id>` before upload.

## After the paper is complete

Run `review-paper.md` (emulator review, **AMPM repo root**) before any prod step — in particular the **legibility of every statement figure at phone width**,
the highlight letters, `standard_math` entry of negative values (`maths_key_-`), long `ordering` chips, and option wrapping next to the "view diagram" button
(open Life Sciences app bug). Prod push is a separate, owner-approved step: `tools/push-paper-to-prod.js` (exam-level, `VER-08`); an all-`standard_math` paper
derives the floor and is pushable once reviewed. The prod `subjects` row and the prod curriculum vocabulary (mirrored by the push tool) are part of that step.
Update the profile ledger and write a memory entry when a paper lands.

## Gotchas inherited from sibling subjects (check before assuming they are fixed)

- A re-split changes lesson contents but lesson/question ids derive from the lesson `order`, so the app caches the old rows: `adb shell pm clear
  com.esma.ampm.dev` before re-capturing.
- A taller stem can push the last option below the first view; the capture's `_scroll` shot shows it. Not a defect.
- `match` ≤ 4 pairs (8 metadata elements) with **unique labels** in each column; split longer matches or use `multi_select`.
- Isolated `(A/B)` or `(unit/unit)` in a stem or option renders as a stacked fraction — avoid it.
- The validator checks `DESIGN-UNI-16` length cues, the 5-question warning and `exam_weight` 1–3; plan option lengths up front, and keep correct options out of
  the first/last slot of `multi_select`.
- Rebalance MC positions with a deterministic pattern in the generator, then check the paper-level tally with the SQL query above.
- Never re-upload different bytes under an existing object key (cached for a year).
