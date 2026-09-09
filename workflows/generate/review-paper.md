# Review Uploaded Paper — Claude Code Session Runner

> **Runs from the AMPM repo root.** The capture harness and its scripts
> (`scripts/review-build-manifest.js`, `scripts/review-capture.js`,
> `scripts/patch-question.js`) live in `AMPM/scripts/` and drive the emulator / the app.
> Presentation contracts for the review criteria: this repo's `presentations/{type}.md`.

## Status — harness fully repointed

All three scripts are done, dev-verified, and (render-only) run clean end-to-end.

- `scripts/review-build-manifest.js` / `scripts/patch-question.js` — repointed to Cloud SQL
  (2026-09-03). See their headers in `AMPM/scripts/`.
- `scripts/review-capture.js` — rewired 2026-09-03 to navigate by `testTag`/`resource-id`
  (`AMPM` commit `06685d9b7` shipped the tags) instead of coordinate swipes + `content-desc`
  string matching. **It uses exactly 3 tags, all from `AMPM/wiki/lesson/questions-pane.md`
  § Automation selectors** — `lesson_questions_pane` (pager root — gates readiness),
  `question_maths_tools_fab` (opens the per-question supplementary/maths-tools sheet),
  `question_next_button` (`PagerDotNavRow`'s within-video next button, advances). Grep the
  script for `^const TAG_` to get the exact current list rather than trusting this prose if
  it drifts. **Verified live** against a real emulator with real dev content (maths 2019
  nov_p1, then the physics 2025 nov_p1 paper, 2026-09-10): `lesson_questions_pane` correctly
  gates readiness, `question_next_button` correctly advances — confirmed by the captured
  screenshots showing genuinely different questions per step, matching the manifest.
  `AMPM/wiki/lesson/presentation/{type}.md` (per-presentation-type input/interaction
  selectors) is **not used by this script** — those tags exist for a future
  render+answer-feedback pass that actually fills in and submits answers; this capture is
  render-only (see below) and never needs them.

This capture is **render-only** (screenshots + the supplementary sheet) — it doesn't submit
answers. The per-presentation-type input tags exist for a future render+answer-feedback pass
if you want it; not wired in here.

**Setup:** `AMPM/.env` needs a `PG_*_DEV` block (`AMPM/.env.example`) for Phases 1 & 4 — same
Auth Proxy convention as this repo's tooling. Password:
`gcloud secrets versions access latest --secret=AMPM_DB_PASSWORD --project=ampm-b9661`.

---

## Overview

Repeatable process for reviewing an already-uploaded paper in a Claude Code CLI session
with a running Android emulator. Run once per paper (or re-run per lesson).

The run, end to end:

1. **Fetch** the paper's lessons + questions into a local manifest; sanity-check counts.
2. **Capture** — navigate the app to *every* question and screenshot it (initial + scrolled
   + any supplementary sheet). All questions, not just suspect ones — render and crop checks
   need a screenshot of each.
3. **Review** — for each question, read the data *and its screenshot together*; classify
   **PASS** / **AUTO_FIX** / **FLAG**.
4. **Act** — AUTO_FIX → patch it in **dev** now (confident fixes only). FLAG → into the
   report, untouched. PASS → logged.
5. **Report + hand off** — counts, the auto-fix table, every flagged item with reason +
   screenshot path. The human resolves flagged items. **Prod is never touched in this run.**

---

## Required Inputs

| Input | Value |
|-------|-------|
| Subject | `math_lit` \| `maths` \| `english_hl` \| `geography` \| `physics` — this list is illustrative, not enforced by the script (`review-build-manifest.js` takes the subject as a plain positional arg, no allowlist); any `subject_id` with rows in `lessons` works. Update this row when a new subject's first paper is authored, so it doesn't read as unsupported. |
| Syllabus | e.g. `dbe` |
| Year | e.g. `2021` |
| Paper | e.g. `nov_p1` |
| Environment | **dev Cloud SQL** (always review dev first) — `ampm-b9661:us-central1:ampm-backend` |
| Cloud SQL Auth Proxy | running: `cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432` |
| Emulator | Running and unlocked (`adb devices` shows one device), dev app installed (`com.esma.ampm.dev`) |

---

## Phase 1 — Fetch Paper Data

```bash
node scripts/review-build-manifest.js <subject> <syllabus> <year> <paper>
# → temp/review/<paper>_<year>/manifest.json
```

Manifest shape: `{ subject, syllabus, year, paper, paperId, lessons: [{ videoId (lesson
UUID), order, name, questions: [{ id (UUID), order, name, question, textSnippet, contextText,
presentation, type, metadata, answer, clues, difficulty, examWeight, unit, topic, subtopic
(resolved curriculum **names**, not ids), supplementaryLabel, supplementaryType,
supplementaryImageUrls }] }] }`. Carries everything Phase 3 needs — no second query.

> Verify the lesson count and per-lesson question counts look plausible before proceeding.
> `metadata` comes back as a Postgres array — `[]` for `fraction`/`equation`, never null.

---

## Phase 2 — Capture Screenshots

```bash
node scripts/review-capture.js temp/review/<paper>_<year>/manifest.json [--lessons 1,2,3]
```

Per lesson it deep-links to each lesson (`/video/<videoId>?subject=&syllabus=`), then per
question saves under `temp/review/<paper>_<year>/screenshots/lesson_<order>/`:

- `q<n>.png` — initial view
- `q<n>_scroll.png` — after scrolling to reveal all options
- `q<n>_diagram.png` — supplementary-material sheet, if the question has one

> If a screenshot is black or shows the wrong screen, re-run the capture for that lesson
> (`--lessons <order>`). The emulator must be unlocked and the app not in a broken state.
> Navigation selectors actually in use: `AMPM/wiki/lesson/questions-pane.md` § Automation
> selectors (see Status above for the exact 3 tags). `AMPM/wiki/lesson/presentation/
> {type}.md`'s selectors are not wired into `review-capture.js` — not a gap to fix, just
> not needed by a render-only capture.

---

## Phase 3 — Review Each Question

Read each question's data alongside its screenshot; classify PASS / AUTO_FIX / FLAG.

### Logic checks (data only)

- [ ] **Answer correctness:** work the question independently; does `answer` hold the
      correct value for this stimulus?
- [ ] **Correct-answer placement:** `multiple_choice` correct answer never at `metadata`
      index 0 (`SCHEMA-TYPE-06`); every `answer` value appears verbatim in `metadata`
      (`SCHEMA-TYPE-02`).
- [ ] **Array contracts** hold for the type (`SCHEMA-ARR-01..06`, `core/question-schema.md`).
- [ ] **Context-text sufficiency** (English): answerable from `context_text` (+ shared
      stimulus) alone — no external knowledge.
- [ ] **Distractors plausible** — a matric student should have to think.
- [ ] **Instruction format matches section** (English): Q1/Q5 quote the inline stimulus
      (never "the passage"/line numbers); Q2–Q4 fresh stimulus in `context_text`; Paper 2
      answerable from the prescribed-text context; Paper 3 about text-type conventions.
- [ ] **DBE Grade 12 level:** cognitive demand matches `difficulty` (`SCHEMA-CAL-03`).
- [ ] **`fitb` answer coverage:** `|`-separated alternatives where multiple phrasings valid.
- [ ] **Curriculum resolves:** manifest `unit`/`topic`/`subtopic` are real names, not null,
      for any subject that has a curriculum (the upload FK preflight guarantees the FK is
      valid — a null here means the question genuinely has no unit/topic/subtopic set).

### Render checks (screenshot + data)

- [ ] **Math renders:** no raw `\frac`/`\sqrt` visible as text (`AMPM-CONTENT-MATHTEXT`).
- [ ] **Text readable:** no overflow or clipping.
- [ ] **Presentation matches UI:** per `presentations/{type}.md` renderer contract — chips
      for `multiple_choice`, input for `fitb`, num/denom for `fraction`, draggable items for
      `ordering`, columns for `match`, equation field for `equation`, step inputs for `steps`.
- [ ] **`steps` completability** (missed entirely in the 2026-09-10 physics review — 5
      questions all marked PASS despite being unanswerable): re-deriving the stored
      `answer` independently is not enough. Look at the *given* rows only (everything in
      `metadata` that isn't `"[ ]"`) and ask: with just those + the question text, does a
      student have exactly one defensible thing to type per blank? Consecutive blanks
      with no given row between/after them, or an expected answer that's a full sentence
      rather than a short value, is a FLAG/AUTO_FIX-worthy defect, not a pass — see
      `presentations/steps.md`'s pitfalls section for the corrected pattern.
- [ ] **`steps` numbering reads as one coherent line per real step** (a second, separate
      defect from completability above, caught the same day *after* a completability fix
      had already landed and been re-verified live — passing one check doesn't mean the
      other passed). Every `metadata` row, given or blank, gets its own numbered "Step N"
      with no merging. Read the numbered rows top to bottom as a student would: does each
      number correspond to one real unit of working? A label row immediately followed by
      a blank immediately followed by a unit row — e.g. "Step 3: r =", "Step 4: [blank]",
      "Step 5: Ω" — is three fake steps for one real line ("r = ___ Ω") and is a defect,
      not a pass, even though the blank itself is perfectly typeable and correctly graded.
- [ ] **`context_text` visible** above the question when non-null.
- [ ] **Images resolve** — `https://media-dev.askmoreprepmore.app/...` renders, not a broken
      placeholder.

### Image-crop checks (screenshot only)

- [ ] Supplementary images not cut off at top/bottom.
- [ ] Not over-cropped (e.g. section heading lost).
- [ ] Legible at screen size — flag blurry/small images.

---

## Phase 4 — Classify and Act

| Classification | Condition | Action |
|---|---|---|
| **PASS** | All checks pass | Log as reviewed |
| **AUTO_FIX** | Clear, unambiguous error, known correct value | Patch in **dev** via `patch-question.js` |
| **FLAG** | Ambiguous / needs human judgement | Report with reason + screenshot; **do not touch** |

**Safe AUTO_FIX:** wrong `answer` value (confident), correct answer at index 0 (rotate),
missing `|` alternative, obvious `context_text` typo.

**Always FLAG:** answer arguable / interpretation-dependent, uncertain curriculum
alignment, crop uncertain without the source PDF, equation itself possibly wrong.

```bash
# Targets dev Cloud SQL `questions`; dev-only by construction (no --env flag, no prod path).
# Whitelisted fields: answer, metadata, context_text, question, clues, difficulty,
# exam_weight, unit, topic, subtopic (patch the *_id FK columns — Postgres rejects an id
# that isn't a real curriculum_nodes row), skills (replaces the question_skills junction,
# not a column — pass the full new skill-id list, not a diff).
node scripts/patch-question.js \
  --id <question_uuid> \
  --field answer \
  --value '["correct answer", "", "", "", ""]' \
  --confirm        # omit for a dry run (prints old → new, writes nothing)
```

---

## Phase 5 — Write Report + Hand Off

`temp/review/<paper>_<year>/report.md`: summary counts (reviewed / passed / auto-fixed /
flagged), the auto-fix table (lesson, Q#, field, old → new), and every flagged item with
its reason, screenshot path, and suggested action.

> Give the report to the user. The human resolves flagged items. **Prod is a separate,
> later, human-gated step** — never updated as part of this run.

---

## Checklist

- [ ] Cloud SQL Auth Proxy up; `adb devices` shows one running emulator
- [ ] All lessons present in the manifest; counts plausible
- [ ] Screenshot captured for every question (no black frames)
- [ ] Every question reviewed against all logic, render, and crop criteria
- [ ] Auto-fixes applied to **dev only**, confident cases only
- [ ] Report written; flagged items handed to the human before any prod update
