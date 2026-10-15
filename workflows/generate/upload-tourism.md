# Upload — DBE Tourism (one lesson / subsection of a real exam question)

**Profile:** `subjects/dbe-tourism.md` · **Shared rules:** `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`) ·
**Skeleton:** `core/upload-pipeline.md` (`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`, `AMPM-CONTENT-AI-EXP`,
`AMPM-CONTENT-KEYBOARD-INPUT`, `AMPM-CONTENT-APP-VERSIONS`,
`presentations/{multiple-choice,multi-select,match,ordering,fitb}.md` (Tourism subset — profile; `steps` only for a genuine multi-row derivation, `equation`/`fraction` unused).

> **`DESIGN-UNI-14`: 3–4 practice questions per lesson, 5 at most (validator-enforced).** Do NOT enter plan mode. Run once per lesson — a
> lesson is a subsection/theme of a real exam question (or a Section A topic cluster), named `"Question N.M: Description"` /
> `"Question 1: <Topic> (Section A)"`. **Commit after Phase 6, per lesson** — never batch lessons into one commit or one uninterrupted run.
> **Dev only**: nothing in this workflow touches prod.

Nothing is authored yet (profile ledger empty). Tourism is **one paper per year**, so there is no P1/P2 split to schedule and the exam is the paper
(`VER-01`). Suggested first paper: **2025 Nov**. **Gating decision (owner, 2026-10-15): depending on 2.4.0 is accepted** — `text` is allowed, and 2.4.0
is already tagged, so a `text` row does not block the prod push.

## Phase 0 — one-time subject setup, then per-lesson curriculum vocabulary

**0a. First lesson only: tooling and the `subjects` row.**

1. **Subject id and paper id — verify, never assume.** The profile's `tourism` and `nov_p1` are guesses. Query dev `subjects` for an existing Tourism
   row, confirm `SubjectMapper.kt` (canonical checkout `~/StudioProjects/AMPM`) still falls through to `displayName.lowercase().replace(" ", "_")`,
   and confirm that the tooling (`validate`, `add-*` template, `push-paper-to-prod.js`) and the app's paper picker accept a subject whose only paper
   is `nov_p1`. Whatever the row's `id` is wins; fix the profile and this doc to match before the first script.
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
   and `icon`, `syllabus` dbe, `is_published: true`, `is_active: true`, `min_app_version: null`; copy another DBE row's remaining columns
   (`capabilities` is `text[]` — pass `'{}'`, not JSON). Do not create the prod row here. If a row exists, read `is_active` / `min_app_version`.
3. **Tooling allowlists.** `tools/dump-curriculum-vocabulary.js` has an explicit subject allowlist (line ~45); add the Tourism id. Check
   `tools/audit-answer-cues.js --subject <id>` accepts it too. `NAMESPACED_SUBJECTS` (`tools/lib/curriculum.js`) does not list it, so
   `curriculum_nodes.id` slugs are **global** — check topic/tag ids against other subjects before creating them (`marketing_mix`, `customer_care`,
   `sustainable_development` may already belong to Business Studies or Geography; reuse when the meaning is the same).
4. Re-read `KeyboardResolver.kt`: no Tourism route is expected, which is fine because every typed row declares `keyboard_type`.

**0b. Every lesson: curriculum vocabulary.** Dump what exists, subject-scoped:

```bash
node tools/dump-curriculum-vocabulary.js --subject <tourism_id> --out temp/curriculum-vocab-tourism.json
```

Use the subject-scoped filename (the shared default was overwritten by a concurrent session before). For cross-subject reuse also read
`SELECT id, type, name, subject_id FROM curriculum_nodes ORDER BY subject_id, type, id`.

- **Units = the nine CAPS topics** (profile § Curriculum units): `tourism_sectors`, `map_work_tour_planning`, `tourist_attractions`,
  `sustainable_responsible_tourism`, `domestic_regional_international_tourism`, `culture_heritage_tourism`, `foreign_exchange`,
  `communication_customer_care`, `tourism_marketing`. Topics are the concept a question tests (`time_zones`, `bbr_bsr_conversion`,
  `world_heritage_sites`, `travel_documents`, `certification_bodies`), created per concept and reused.
- **Reuse skill-shaped subtopics across subjects first** (`term_definition_recall`, `classification_and_criteria`, `sequencing_and_process`,
  `scenario_application`, `calculation_and_method`, `data_interpretation`). Keep subtopics coarse — a handful for the whole subject.
- Create rows with `tools/create-curriculum-node.js` / `create-skill.js` / `create-tag.js` (**dev only**) before writing them into any question;
  re-dump (Phase 3.5) before validating.

## Required inputs

Lesson name, which real exam question/sub-question(s) or Section A cluster it covers, `nov_p1`, year, order, the paper **and** memo PDF under
`files/tourism/nov_<year>/`, and the CAPS term plan (`files/tourism/caps/`). No video (`has_video: false`, `content_tier: 'free'`, `freemium_*: null`).
**Images are in scope** — Tourism's stimuli are infographics, a world time-zone map, cartoons, banners and photographs (Phase 2).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1). Read the question *and its memo section*. For each sub-question record: verb and marks, the stimulus it reads,
   whether the memo wants one term or "any N", and its **memo topic code** (TS/MTP/TA/SR/DRI/CH/FX/CC/M). Flag: **(a)** calculations — the
   time-zone block (2025 Q2.1; 2024 Q2.1 with DST) and forex (Q3), noting the memo's `OR` full-mark answer and rounding (`CLOSED-CALC-01`);
   **(b)** linked pairs (`CLOSED-DISC-04`, `DESIGN-UNI-13`) — 2.2.1→2.2.2, 4.1.4(b)→(c); **(c)** Section A items by topic code
   (`DESIGN-UNI-10`, `CLOSED-A-01`) — Section A **clusters by topic** into the Section B–E lessons; **(d)** items that need a map or picture the
   student cannot be given (profile § Stimuli 5); **(e)** current-affairs scenarios (profile § Stimuli 2); **(f)** memo `NOTE:` lines that accept
   two answers (2025 1.1.2) or demand a specific element ("must mention the number of hours", 2025 2.1.2).
2. **Images** (pipeline Phase 1.5). Pull stimulus figures and memo pages with `tools/extract-exam-pages.py` (vector figures) or `pdfimages -png`
   (embedded rasters — photographs, banners, cartoons). **Extract into a subject/paper-scoped folder**, e.g. `temp/images/tourism/2025/nov_p1/q4/`,
   and verify each directory's file count against the expected page count. **Inspect every crop** (`PIPE-01`), rotate if needed, then
   `tools/upload-exam-images.js` (**dev only**, `PIPE-02`). Stimulus extracts go in as `supplementary_materials` labelled with the paper's own
   name (`"Infographic"`, `"Map"`, `"Cartoon"`, `"Table"`, `"Banner A"`; `PIPE-03`; rename files distinctly when a question has several). These are
   the **exam reference** images; practice questions use **fresh** stimuli (Phase 4). **Never re-upload different content under an existing object
   key** — corrected images get a new path.
3. **Lesson document** (pipeline Phase 2): standard template, `has_video: false`. Tags (`PIPE-06`) name CAPS concepts (`time_zones`,
   `bank_selling_rate`, `world_heritage_sites`, `green_washing`), never a scenario wrapper (✗ `thabo_world_cup`, `heathrow_fire`). 2–3 tags per lesson.
4. **Questions** (pipeline Phase 3) — the shared rules do the heavy lifting; Tourism-specific decisions:
   - **Choose the presentation by the memo, not the verb** (`CLOSED-DISC-01`/`02`/`CLOSED-A-01`). "Name/Identify/List TWO/FOUR" → `multi_select`
     with same-family distractors; "Discuss/Explain TWO ways" → `multi_select` over the memo's points with plausible-but-wrong points as
     distractors; define a concept → `multiple_choice` whose distractors are the neighbouring term's definition; letter ↔ picture/term (≤ 5) →
     `match`; itinerary/route/border-crossing sequences → `ordering` (`DESIGN-UNI-15`).
   - **Typed answers declare `keyboard_type` — every one (`KEYBOARD-04`, `CLOSED-KB-01`).** Number → `standard_math`, bare, unit / `R` / `GBP`
     in the label (no gate). Single unambiguous term → `text`, every memo form joined with `|`, UK spelling (**gate 2.4.0 accepted**). "Any 1 of N"
     and slash answers → selection. `GBP`/`SWIFT` style codes are fine on `text` (it emits uppercase; marking lower-cases).
   - **Time zones.** Give the UTC offsets in the stem (small city→offset table) — no world map. Hours/zones crossed → one numeric `fitb`; a clock
     time → two numeric blanks around a literal `":"` metadata token (`SCHEMA-TYPE-04`); the date → `multiple_choice` (same / next / previous day);
     DST stated explicitly in the stem. Make the classic slips distractors (adding instead of subtracting the offset; forgetting the layover is
     inside the quoted duration; reversing east/west).
   - **Forex.** Fresh invented BBR/BSR table, marked illustrative; keep `1 unit of foreign currency = R x`. A `multiple_choice` first on *which rate
     and which operation*, then the `fitb` on the final 2-dp value (`851.06` stored with `.`; state the rounding in the stem). Store the memo's
     tolerance, and distractors are the wrong-rate and wrong-operation results.
   - **Fresh stimuli (`DESIGN-UNI-01`, `DESIGN-UNI-08`).** No real exam table, picture text, graph or news item in a practice question. Use
     CAPS-named events and invented, labelled-illustrative scenarios; never invent a real-sounding statistic, quote or attribution. Every
     institutional fact that becomes a correct option (department name, body abbreviation, levy rate, World Heritage listing) is checked against the
     memo or CAPS first.
   - **One correct option only.** If the memo accepts two near-identical answers, put one in the options, never both.
   - **Photographs and maps:** keep the exam image as lesson reference only; the practice question describes the scene or gives the data in text,
     and the description must not name the answer (`feedback-clues-never-leak-answer`). No question may depend on a map the student cannot see.
   - **Check the running MC index-0 tally *before* finalising the set** (`DESIGN-UNI-06`/`SCHEMA-TYPE-06`; True/False cap `DESIGN-UNI-05`), counted
     across every Tourism lesson already uploaded for the year; Q1.1 alone has 20 MC. Query rather than estimate:
     ```bash
     node -e "
     const { getPool, closePool } = require('./tools/lib/postgres');
     (async () => {
       const pool = getPool('dev');
       const { rows } = await pool.query(\`
         SELECT count(*) FILTER (WHERE metadata[1] = answer[1]) AS at_index_0, count(*) AS total
         FROM questions q JOIN lessons l ON q.lesson_id = l.id
         WHERE l.subject_id = '<tourism_id>' AND l.paper_id = 'nov_p1' AND l.year_id = '<YYYY>'
           AND q.presentation_id = 'multiple_choice'
       \`);
       console.log(rows[0]);
       await closePool('dev');
     })();
     "
     ```
   - **Variety rule (validator):** a 3-question set needs ≥ 2 presentation types, 4+ needs ≥ 3 — mix selection with `match`/`ordering`/numeric `fitb`.
   - **Clues must not leak the answer.** For every "identify" and "term" item, read the stem, `context_text`, options and any hint for the answer
     or a transparent derivation of it (a body's abbreviation spelled out in the stem; a country named in a landmark clue).
   - `questions.type` is one of application/calc/conversion/definition/fraction/interpretation/ordering/proof/ratio/reading/rounding — the validator
     does not check it: `calc` for time-zone arithmetic, `conversion` for forex, `definition` for terms, `interpretation` for infographic reading.
5. **Vocab dump** (pipeline Phase 3.5): `--subject <tourism_id> --out temp/curriculum-vocab-tourism.json` (Auth Proxy running). Re-run after any
   Phase 0b addition mid-lesson.
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to `scripts/add-tourism-<year>-q<N>-<slug>.js` (**never** copy another
   subject's script as a template — they predate `KEYBOARD-04`); `subject: "<tourism_id>"` on every block. `aiExplanation`: one `sub_questions`
   entry per real exam sub-question the lesson covers, grounded in the **real** memo data (not the fresh practice scenario), `AIEXP-03`/`04`
   bullet counts (2–4); for time-zone and forex items the explanation shows the memo's method line by line. Validate with `--curriculum` against
   the subject-scoped snapshot — **HARD STOP (`PIPE-10`)** — then `--dry-run`, inspect, then upsert to dev. Scripts built from the template run
   `apply-exam-gate.js` after a real dev upload (`VER-09`); confirm its output. **Commit**
   (`[Data] Add tourism <year> nov_p1 Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: every typed row declares a keyboard and its answer is typeable on it (`KEYBOARD-01`); no real exam
   number, table, picture text or news item appears in a practice question; every "name/give N" item is a `multi_select` with same-family
   distractors; no `multiple_choice` has two memo-correct options; every stored numeric answer carries the memo's tolerance and 2-dp rounding;
   every figure-dependent question has `supplementary_material`; image object keys sit under `exam_papers/dbe/<tourism_id>/YYYY/nov_p1/`; the MC
   index-0 tally is still ≤ ~10% across the paper; the exam gate printed by `apply-exam-gate.js` is what you expect (2.4.0 if any `text` row exists,
   none if every typed row is `standard_math`); `match` right-column labels are unique; run `tools/audit-answer-cues.js --subject <tourism_id>` before
   upload.

## After the paper is complete

Run `review-paper.md` (emulator review, **AMPM repo root**) before any prod step — in particular the `text` rows (Text keyboard keys are
`text_key_<LETTER>`, `text_key_space`, `text_key_switch`, `text_key_done`; `standard_math` uses `maths_key_<char>`; type **every** `|` alternative,
relaunching the lesson between attempts), the two-blank time answers, long `ordering` chips, and option wrapping. Run it on a build at or above the
derived minimum (2.4.0).

Prod push is a separate, owner-approved step: `tools/push-paper-to-prod.js` (exam-level, `VER-08`). With the gate at 2.4.0 it is allowed while
`LATEST_RELEASED` is ≥ 2.4.0 (it is — `v2.4.0` tagged 2026-10-08); do not touch the constant to get around a refusal. The prod `subjects` row and
the prod curriculum vocabulary (mirrored by the push tool) are part of that step. Update the profile ledger and write a memory entry when a paper lands.

## Gotchas inherited from sibling subjects (check before assuming they are fixed)

- A re-split changes lesson contents but lesson/question ids derive from the lesson `order`, so the app caches the old rows: `adb shell pm clear
  com.esma.ampm.dev` before re-capturing.
- A taller stem can push the last option below the first view; the capture's `_scroll` shot shows it. Not a defect.
- `match` ≤ 4 pairs (8 metadata elements) in the lesson UI; split a 5-pair Section A match across two questions.
- Isolated `(A/B)` or `(unit/unit)` in a stem or option renders as a stacked fraction — avoid it.
- Cropping: `extract-exam-pages.py` page specs are easiest computed from `fitz` word positions; page-end crops need an explicit `end=778` or the
  footer shows.
- The validator enforces `DESIGN-UNI-16` length cues, the 5-question cap and `exam_weight` 1–3; plan option lengths up front, and keep correct
  options off the first/last position of a multi-select.
