# Upload — DBE Computer Applications Technology, Paper 2 (one lesson / subsection of a real exam question)

**Profile:** `subjects/dbe-cat.md` · **Common procedure:** `workflows/generate/closed-form-upload-common.md` (read it first — Phase 0a/0b, the per-lesson phases,
the MC index-0 query, the verify checklist and the gotchas live there and are **not repeated here**) · **Shared rules:** `shared/closed-form-subjects.md`
(`AMPM-CONTENT-CLOSED-FORM`, incl. `CLOSED-A-01` modified true/false and `CLOSED-FIG-04` screenshot stimuli) · **Skeleton:** `core/upload-pipeline.md` ·
`AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`, `AMPM-CONTENT-AI-EXP`, `AMPM-CONTENT-KEYBOARD-INPUT`, `AMPM-CONTENT-APP-VERSIONS`,
`presentations/{multiple-choice,multi-select,match,ordering,fitb}.md` (CAT subset; `steps`, `equation`, `fraction` unused).

> **`DESIGN-UNI-14`: 3–4 practice questions per lesson, 5 at most.** Do NOT enter plan mode. One lesson per run; **commit after Phase 6, per lesson.** **Dev only.**
> **Paper 1 (practical) is not authored** (owner, 2026-10-17); this workflow covers Paper 2 (Theory) only, `paper_id = nov_p2`. The exam is the paper, so there is no
> sibling-paper gate coupling (`VER-01`).

Nothing is authored yet (profile ledger empty). **Real exam: 2026-11-27.** Suggested first paper: **2024 Nov P2** (the only one on disk).
**Gating:** depending on 2.4.0 is the baseline (`VER-11`) — `text` rows are used wherever they beat a choice item; run `apply-exam-gate.js` after upload as usual.

## Phase 0 — CAT specifics (on top of the common Phase 0a/0b)

- **Subject id** is the catalogue seed **`cat`** (`V85`), not `computer_applications_technology`. Query the dev row; whatever it says wins; fix the profile if it differs.
- **`hosted`:** after the **first** lesson is upserted, re-read the dev `cat` row; the `V95` triggers should have set `hosted = true`. If not, flip it by hand with
  `updated_at = NOW()` (common Phase 0a). On prod the `cat` row does not exist yet (Flyway V84) — owner step at push time.
- **Tooling allowlist:** `tools/dump-curriculum-vocabulary.js` already lists `cat` (added 2026-10-17). `audit-answer-cues.js --subject cat` needs nothing.
- **Units = the six CAPS topics** (profile § Curriculum units): `systems_technologies`, `network_technologies`, `internet_technologies`, `information_management`,
  `social_implications`, `solution_development`. Check each slug against other subjects' ids before creating it (`social_implications` and `information_management` are the
  likely clashes); prefix `cat_` when the meaning differs. Topics are the concept a question tests (`convergence`, `file_attributes`, `modified_true_false` is **not** a topic —
  that is a format), `caching`, `social_engineering`, `acceptable_use_policy`, `text_wrapping`, `spreadsheet_error_values`, `html_table_tags`, created per concept and reused.
- **Subtopics** reuse the cross-subject skill-shaped ones first (`term_definition_recall`, `classification_and_criteria`, `scenario_application`, `data_interpretation`,
  `sequencing_and_process`).
- **Pilot first.** Before lesson 2, one Section A cluster lesson (Systems Technologies: a 4-pair `match`, a modified true/false, one `multiple_choice`, one `text` `fitb`) goes
  through `validate-questions.js` **and** an emulator look: the `text` keyboard, the 4-pair match, and any regenerated figure at phone width. Record the **table-figure
  renderer** choice in the profile (`CLOSED-FIG-02`/`04`); Accounting's `render_statement.py` is the closest tool but is statement-shaped.

## Required inputs

Lesson name, which real exam question/sub-question(s) or Section A topic cluster it covers, `nov_p2`, year, order, the paper **and** memo PDF under `files/cat/` (use the
`P2 … Eng.pdf` and `P2 … MG Eng.pdf` pair — the P1 files are not used), and the CAPS term plans (`files/cat/CAPS …`). No video (`has_video: false`, `content_tier: 'free'`,
`freemium_*: null`). **Images are in scope** only as reference screenshots (to attach) and regenerated table/figure stimuli (to author).

## Phases — CAT deltas on the common procedure

1. **Analyse.** As the common Phase 1, plus: record for each sub-question its **topic** (Section A has none printed — use the profile's cluster table), whether it reads a
   screenshot, whether the memo accepts several answers to a single-answer item (profile § Hazards 5), and whether the memo says "accept any valid answer" (then the
   `CLOSED-DISC-02` open-ended audit is mandatory). Flag any item that is a task in practical clothing ("which function…" is knowledge; never write "type the formula").
2. **Images.** Pull the reference screenshots with `extract-exam-pages.py` and attach as `supplementary_materials` named for what they are (`"Screenshot"`, `"Spreadsheet"`,
   `"Report"`, `"Layout"`), under `exam_papers/dbe/cat/2024/nov_p2/`. **Practice stimuli are regenerated** (`CLOSED-FIG-04`): plain table figures with fresh values for data-shaped
   screenshots; words only for dialogs. Inspect every generated figure; one that is not clearly correct is dropped.
3. **Lesson document.** Tags name concepts (`caching`, `social_engineering`, `text_wrapping`, `rfid`), never a scenario wrapper (✗ `school_magazine`, `triathlon`). 2–3 per lesson.
4. **Questions** — CAT-specific decisions (the profile's § Sub-question shapes is the lookup table):
   - **"State/Give/Name TWO" → `multi_select`** with same-family distractors; **run the open-ended audit on every distractor** ("would a marker accept it?"; check the full memo
     list — an SSD *is* an accepted energy saver). Correct options are a subset of the memo list.
   - **Explain/Describe → `multiple_choice`** whose distractors are the neighbouring concept's explanation (UPS vs surge protector vs power supply; hidden vs read-only; flagging vs
     high priority; `<th>` vs `<td>`; single-user vs multi-user). Two-fact explanations: test one fact per question or use a `multi_select` of the two facts.
   - **Q2 description↔term items** → per-topic `match` (≤ 4 pairs, exactly N pairs, no spare right-hand items) **or** `multiple_choice` with the paper's own confusable twins as
     distractors (`#Value!`/`#Name!`, watermark/WordArt, GB/GHz, geotagging/location sharing, drivers/utility).
   - **Modified true/false (Q3)** → four-option `multiple_choice`: `True as written` + three replacements, one correct (`CLOSED-A-01`). Mix true and false across the set, vary the
     position of `True as written`, and put the term to judge in the stem (bold it).
   - **Typed rows (`text`)**: only a single canonical term from the profile's candidate list, every memo form joined with `|`, UK spelling, `keyboard_type: 'text'`. Never type an
     answer containing `= < > # @ +` (the `text` keyboard has none of them — formulas, error values, HTML tags with brackets, e-mail addresses stay selection). Ask for `href`/`th`
     "without angle brackets". At most one typed row per lesson unless the lesson is terminology.
   - **No brand names** in options or correct answers, except where the memo itself lists them for that exact question. Teach concepts, not dead or version-bound products.
   - **Scenarios** are fresh and invented (profile § Hazards 8); the exam's e-magazine and triathlon never reappear.
   - **Never write version-specific click paths** or a ribbon/menu name; formulas in options use `;` argument separators (confirm the convention with the owner before the first
     function item — profile § Hazards 6).
   - Linked pairs where the memo chains (9.2.1 AUP → policy purpose; 9.4.3 → why not scan old photos given 9.4.1–9.4.2): one linked lesson or self-contained pairs
     (`CLOSED-DISC-04`, `DESIGN-UNI-13`).
5. **Vocab dump:** `--subject cat --out temp/curriculum-vocab-cat.json` (Auth Proxy running). Re-run after any Phase 0b addition mid-lesson.
6. **Upload script:** `scripts/add-cat-2024-nov-p2-l<NN>-<slug>.js` from `tools/upload-script-template.js`; `subject: "cat"`; `aiExplanation` one `sub_questions` entry per real
   sub-question the lesson covers, grounded in the **real memo** data (the accepted list and the marker's notes, e.g. "do not accept a repetition of the question"); validate with
   `--curriculum` (**HARD STOP, `PIPE-10`**) → `--dry-run` → upsert to dev. **Commit** (`[Data] Add cat 2024 nov_p2 L<NN> lesson and questions`).
7. **Verify** — the common Phase 7 checklist, plus: no product name appears in an option or answer except memo-listed ones; every `multi_select` distractor survived the
   open-ended audit; no single-answer `multiple_choice` carries two memo-correct options (1.4/1.7/2.6/7.4.1/10.5.1 patterns); every regenerated figure matches its stored answers
   and names nothing it asks; every typed row is typeable on the `text` keyboard; the gate printed by `apply-exam-gate.js` is 2.4.0 if any `text` row exists, else none.

## After the paper is complete

Common "After the paper is complete" section: emulator review (`review-paper.md`, **AMPM repo root**) on a build ≥ 2.4.0, then the owner-approved prod push. In the review pay
particular attention to the `text` rows (type **every** `|` alternative), the 4-pair `match` chips, the four-option modified true/false wrapping, and each regenerated table
figure at phone width. Update the profile ledger and write a memory entry when a paper lands. A CAT subject-expert check (a CAT teacher) is owed before the content is described
as reviewed — the memo's "accept any valid answer" breadth means a distractor-validity read by a practitioner is worth more here than in a closed-list subject.
