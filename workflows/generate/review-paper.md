# Review Uploaded Paper — Claude Code Session Runner

> Moved near-verbatim from `AMPM/workflows/generate/review-paper.md` (stub remains
> there), 2026-07-15. **Runs from the AMPM repo root** — the capture harness and the
> scripts named here (`fetch-paper-data.js`, `review-capture.sh`, `patch-question.js`)
> drive the app/emulator and stay in `AMPM/scripts/`. Presentation contracts for the
> review criteria: this repo's `presentations/{type}.md`.

## Overview

Repeatable process for reviewing an already-uploaded paper in a Claude Code CLI session
with a running Android emulator. Run once per paper (or re-run per lesson).

For each lesson in the paper, the session:
1. Fetches all question documents from Firestore
2. Navigates the emulator to each question screen and captures a screenshot
3. Reviews logic, rendering, and image crop — using both the question data and screenshot
4. Auto-fixes safe issues inline; flags ambiguous ones for human review
5. Writes a summary report to `temp/review/<paper_id>/report.md`

**Prerequisite:** AMPM's `workflows/active/paper-review-infra.md` must be complete — the
capture script and instrumented test harness must exist before running this process.

---

## Required Inputs

| Input | Value |
|-------|-------|
| Subject | e.g. `english_hl` |
| Syllabus | e.g. `dbe` |
| Year | e.g. `2021` |
| Paper | e.g. `nov_p1` |
| Firebase project | `dev` (always review dev first) |
| Emulator | Running and unlocked (`adb devices` shows one device) |

---

## Phase 1: Fetch Paper Data from Firestore

```bash
node scripts/fetch-paper-data.js \
  --syllabus dbe --subject english_hl --year 2021 --paper nov_p1 \
  --out temp/review/2021_nov_p1/data.json
```

Output shape: `{ paper, lessons: [{ id, order, name, questions_count,
supplementary_materials, questions: [{ id, order, question, context_text, presentation,
metadata, answer, unit, topic, type }] }] }`.

> Verify the lesson count and question counts look plausible before proceeding.

---

## Phase 2: Capture Screenshots

```bash
# All lessons (iterates from data.json)
bash scripts/review-capture.sh \
  --data temp/review/2021_nov_p1/data.json \
  --out temp/review/2021_nov_p1/screenshots/

# Or a single lesson
bash scripts/review-capture.sh \
  --video-id <video_doc_id> \
  --question-count 7 \
  --out temp/review/2021_nov_p1/screenshots/lesson_1/
```

Saved as `screenshots/lesson_N/qN.png`.

> If a screenshot is black or shows the wrong screen, re-run the capture for that
> lesson. The emulator must be unlocked and the app not in a broken state.

---

## Phase 3: Review Each Question

Read each question's data alongside its screenshot; classify PASS / AUTO_FIX / FLAG.

### Logic checks (data only)

- [ ] **Answer correctness:** work the question independently; does `answer` hold the
      correct value for this stimulus?
- [ ] **Correct answer placement:** `multiple_choice` correct answer never at metadata
      index 0 (`SCHEMA-TYPE-06`).
- [ ] **Context text sufficiency:** answerable from `context_text` (+ shared stimulus)
      alone — no external knowledge.
- [ ] **Distractors plausible** — a matric student should have to think.
- [ ] **Instruction format matches section:** Q1/Q5 quote/reference the inline stimulus
      (never "the passage"/line numbers); Q2–Q4 fresh stimulus in `context_text`;
      Paper 2 answerable from the prescribed-text context; Paper 3 about text-type
      conventions.
- [ ] **DBE Grade 12 level:** cognitive demand matches `difficulty`
      (`SCHEMA-CAL-03` anchors).
- [ ] **`fitb` answer coverage:** `|`-separated alternatives where multiple phrasings
      are valid.

### Render checks (screenshot + data)

- [ ] **Math renders:** no raw `\frac`/`\sqrt` visible as text.
- [ ] **Text readable:** no overflow or clipping.
- [ ] **Presentation matches UI:** chips for `multiple_choice`, input for `fitb`,
      draggable items for `ordering` (per `presentations/{type}.md` renderer contracts).
- [ ] **`context_text` visible** above the question when non-null.

### Image crop checks (screenshot only)

- [ ] Supplementary images not cut off at top/bottom.
- [ ] Not over-cropped (e.g. section heading lost).
- [ ] Legible at screen size — flag blurry/small images.

---

## Phase 4: Classify and Act

| Classification | Condition | Action |
|---|---|---|
| **PASS** | All checks pass | Log as reviewed |
| **AUTO_FIX** | Clear, unambiguous error, known correct value | Fix in dev Firestore via `node scripts/patch-question.js` |
| **FLAG** | Ambiguous / needs human judgement | Report with reason + screenshot path |

**Safe AUTO_FIX:** wrong `answer` value (confident), correct answer at index 0 (rotate),
missing `|` alternative, obvious `context_text` typo.

**Always FLAG:** answer arguable/interpretation-dependent, uncertain curriculum
alignment, crop uncertain without the source PDF, equation itself possibly wrong.

```bash
node scripts/patch-question.js \
  --collection <collection> \
  --id <question_doc_id> \
  --field answer \
  --value '["correct answer", "", "", "", ""]' \
  --confirm     # omit for dry run
```

---

## Phase 5: Write Report

`temp/review/<paper_id>/report.md`: summary counts (reviewed / passed / auto-fixed /
flagged), auto-fix table (lesson, Q#, field, old → new), flagged items with reason,
screenshot path, and suggested action.

> Share the report with the user for flagged items. Do NOT update prod Firestore until
> flagged items are resolved.

---

## Checklist

- [ ] `adb devices` shows one running emulator before starting
- [ ] All lessons present in `data.json`
- [ ] Screenshot captured for every question (no black frames)
- [ ] Every question reviewed against all logic, render, and crop criteria
- [ ] Auto-fixes applied to dev only
- [ ] Report written; flagged items reviewed by a human before any prod update
