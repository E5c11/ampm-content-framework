---
id: AMPM-CONTENT-PIPELINE
type: guide
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-AI-EXP]
tags: [content, upload, pipeline, firestore, images, validation]
provenance: new 2026-07-15 — shared skeleton extracted from AMPM/workflows/generate/upload-{math-lit,maths,english}.md (their Phases 1.5 / 3.5 / 4 / 5 were 90%+ identical)
---

# Upload Pipeline

## Purpose

The shared, subject-independent skeleton for uploading **one content unit** (one video or
lesson document + its practice questions) to Firestore. The thin per-subject workflow in
`workflows/generate/` sequences these phases and layers the subject deltas from
`subjects/{profile}.md` on top; this doc is the single copy of everything that used to be
triplicated across the three AMPM upload docs.

**Source of truth for all DB fields:** `AMPM/wiki/database/firestore/database_architecture.md`
(persistence mapping to Postgres: `core/persistence.md` once bootstrap Phase 4 lands).

> **Tooling location:** until bootstrap Phase 3 moves tooling into this repo's `tools/`,
> the scripts named below live in `AMPM/scripts/` and run from the AMPM repo root.

---

## Phase sequence

| Phase | What | Commit? |
|-------|------|---------|
| 1 | Analyse the exam question (subject-specific — see profile) | no |
| 1.5 | Extract and upload exam images | no |
| 2 | Design the video/lesson document (subject template) | no |
| 3 | Design the practice questions | no |
| 3.5 | Dump current curriculum vocabulary | no |
| 4 | Write upload script → **validate (hard stop)** → run against dev | **yes** |
| 5 | Verify in Firestore | no |

---

## Phase 1.5 — Extract and Upload Exam Images

**`PIPE-01`** — every extracted image is visually inspected before upload.
`enforced_by: human-review`

1. **Inspect shared pages (if needed):** when two question groups (or a TEXT and its
   questions) share a page, find the exact cut points first:
   ```bash
   python3 scripts/extract-exam-pages.py --pdf temp/<paper>.pdf --inspect <page> --out temp/images/
   ```
   Read the band scan output — find the pt value just above the next heading (`y_end`)
   and just below the last mark allocation (`y_start`).

2. **Extract images:**
   ```bash
   python3 scripts/extract-exam-pages.py \
     --pdf temp/<paper>.pdf \
     --memo-pdf temp/<paper>_memo.pdf \
     --order N \
     --question-pages "P"          \  # e.g. "3-4" or "7:end=480"
     --annexure-pages "P"          \  # omit if none; one run per labeled TEXT/extract
     --memo-pages "P"              \  # e.g. "3" or "8:start=472"
     --out temp/images/qN/
   ```

3. **Visually inspect ALL extracted images and rotate if needed — mandatory, do not
   skip.** Open every extracted PNG (question, annexure, memo) with the Read tool and
   confirm the content is the right way up before uploading. Landscape PDF pages are
   always extracted as portrait-oriented PNGs; if rotated 90°:
   ```bash
   python3 -c "
   from PIL import Image
   img = Image.open('temp/images/qN/annexure_1.png')
   rotated = img.rotate(-90, expand=True)  # -90 = clockwise; use 90 for counter-clockwise
   rotated.save('temp/images/qN/annexure_1.png')
   print(rotated.size)
   "
   ```
   The upload script overwrites the file at the same Storage path, so a rotation fix
   caught after upload needs no Firestore patch — just re-upload.

4. **Upload to Storage — dev only** (**`PIPE-02`** `enforced_by: human-review`; the
   `--project` flag defaults to dev, prod is a separate gated step):
   ```bash
   node scripts/upload-exam-images.js \
     --syllabus <syllabus> --subject <subject> --year YYYY --paper <paper> \
     --order N \
     --dir temp/images/qN/
   # supplementary groups (one run per labeled TEXT/extract):
   #   add --supplementary-type annexure --supplementary-label "<exam's own label>"
   ```

5. Copy the printed `question_image_urls`, `supplementary_materials`, and
   `memo_image_urls` values into the Phase 2 document.

**`PIPE-03`** — supplementary-material labels match the exam's own naming exactly
(`"Text A"`, `"Extract G"`, `"Poem"`, `"Formula Sheet"` — never `"Passage"` or other
invented labels), one entry per TEXT/extract, and files for multiple extracts on one
lesson are renamed distinctly before upload so they don't collide in Storage.
`enforced_by: human-review` (per-subject label conventions: subject profile)

> Skip this phase for video-only uploads where images are not yet available. Set the
> image fields to `null` and populate later.

---

## Phase 2 — Design the Video/Lesson Document

The full field template is subject-specific (`subjects/{profile}.md`). Shared rules:

**`PIPE-04`** — denormalized display-name fields come from the reference tables below,
verbatim. `enforced_by: human-review`

**`PIPE-05`** — `order` is the unit's 1-based sequential position across the full paper;
`questions_count` equals the number of question documents actually created; `paper_path`
is `"{syllabus}/{subject}/{year}/{paper}"`. `enforced_by: human-review`

**`PIPE-06`** — `tags` (2–5 lowercase strings) name the concept or curriculum topic
being tested, never the real-world scenario wrapper (✗ `motorcycles`, `house`;
✓ `percentage`, `exchange_rates`, `figurative_language` — real-world terms only when
they name a curriculum topic, e.g. `sars`, `hire_purchase`). `enforced_by: human-review`

### Reference: Denormalized Field Values

**Syllabuses**

| `syllabus` | `syllabus_name` | `syllabus_full_name` | `syllabus_color` |
|---|---|---|---|
| `dbe` | `"DBE"` | `"Department of Basic Education"` | `"#D34567"` |
| `ieb` | `"IEB"` | `"Independent Examinations Board"` | `"#18D39D"` |

**Subjects**

| `subject` | `subject_name` | `subject_full_name` | `subject_color` | `subject_category` |
|---|---|---|---|---|
| `math_lit` | `"Math Literacy"` | `"Mathematical Literacy"` | `"#795F96"` | `"maths_videos"` |
| `maths` | `"Mathematics"` | `"Pure Mathematics"` | `"#6561A4"` | `"maths_videos"` |
| `english_hl` | `"English HL"` | `"English Home Language"` | `"#1565C0"` | `"english_videos"` |

**Papers**

| `paper` | `paper_name` | `paper_full_name` | maths/math_lit `paper_color` | english `paper_color` |
|---|---|---|---|---|
| `nov_p1` | `"November Paper 1"` | `"November Final Examination - Paper 1"` | `"#E24F14"` | `"#1976D2"` |
| `nov_p2` | `"November Paper 2"` | `"November Final Examination - Paper 2"` | `"#E24F14"` | `"#1976D2"` |
| `nov_p3` | `"November Paper 3"` | `"November Final Examination - Paper 3"` | — | `"#1976D2"` |
| `june_p1` | `"June Paper 1"` | `"June Examination - Paper 1"` | `"#F58730"` | — |
| `june_p2` | `"June Paper 2"` | `"June Examination - Paper 2"` | `"#F58730"` | — |

---

## Phase 3 — Design the Practice Questions

**Required framework docs:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`, plus
`AMPM-CONTENT-MATHTEXT` (maths/math_lit) — and the `presentations/` doc for each type
used.

Question counts and design deltas are per subject profile. Shared rules:

**`PIPE-07`** — question naming: `name` is `"Question N"`, sequential per video starting
at 1 (independent of the video name); `order` starts at 1 and increments per question.
The UI renders the title as `"Question {order}"`. `enforced_by: human-review`

**`PIPE-08` — Reuse before creating, ALL FOUR vocabulary fields.**
`enforced_by: validator` (Phase 4 run with `--curriculum`), `human-review` (conceptual
equivalence)

`unit`, `topic`, `subtopic`, and `skills` use existing IDs from the subject's curriculum
source collections (declared in the subject profile). Query Firestore for existing
entries at **all levels, every session** — never from a list embedded in a doc (embedded
lists silently go stale; that is how a 6th unit went unreconciled and how 75% of real
subtopics ended up referenced by questions but absent from `math_lit_curriculum`).

Scan results for **conceptual equivalence**, not just exact string match —
`"data_analysis"` vs `"data_analytics"` are duplicates; use whichever exists. If no
existing entry covers the concept, **create the curriculum/skills row FIRST, in the same
session, before writing it into any question document**, then re-dump the vocabulary
snapshot (Phase 3.5).

---

## Phase 3.5 — Dump Current Curriculum Vocabulary

**`PIPE-09`** — required once per session, before Phase 4's validator run.
`enforced_by: validator` (Phase 4 fails without a snapshot when `--curriculum` is used)

```bash
node scripts/dump-curriculum-vocabulary.js --project dev [--subject <subject>] --out temp/curriculum-vocab.json
```

If you add a new curriculum row during the session (per `PIPE-08`), re-run this dump so
the snapshot includes it before validating.

---

## Phase 4 — Write & Run Upload Script

**Required framework docs:** `AMPM-CONTENT-AI-EXP`

Create `scripts/add-<subject>-<year>-<paper>-q<N>.js` following the established pattern:

```js
#!/usr/bin/env node

const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('../.firebase/<service-account>.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

const video = { /* Phase 2 data */ };
const questions = [ /* Phase 3 data */ ];

// AI explanation — generated in this session per AMPM-CONTENT-AI-EXP
const aiExplanation = { sub_questions: [ /* ... */ ], model: '<model>', generated_at: Date.now(), version: 2, reviewed: false, input_tokens: 0, output_tokens: 0, avg_rating: null, rating_count: null };

async function upload() {
  const videoRef = await db.collection('<videos-collection>').add({ ...video, ai_explanation: aiExplanation });
  await videoRef.update({ questions_count: questions.length });
  const batch = db.batch();
  questions.forEach(q => {
    const ref = db.collection('<questions-collection>').doc();
    batch.set(ref, { ...q, video: videoRef.id });
  });
  await batch.commit();
  console.log('✅ Done. Video ID:', videoRef.id);
  process.exit(0);
}

upload().catch(err => { console.error('❌ Upload failed:', err.message); process.exit(1); });
```

The collection names (`math_videos`/`math_questions`, `maths_videos`/`maths_questions`,
`english_videos`/`english_questions`) come from the subject profile.

### Validate — HARD STOP before uploading

**`PIPE-10`** — `enforced_by: validator`

```bash
node scripts/validate-questions.js --script scripts/add-<...>.js --curriculum temp/curriculum-vocab.json
```

(The only recognized flags are `--script`, `--ai-exp`, `--curriculum`. Omit
`--curriculum` only where the subject has no live curriculum collection yet — the
subject profile says which applies.)

Do **not** run the upload until the validator exits 0. Auto-fixable violations (array
length, index-0 placement) may be fixed inline; structural violations (split-token
format, `steps` question text) must be rethought. A vocabulary violation means the value
isn't in the curriculum collection yet — add it there first per `PIPE-08`, re-dump,
re-validate; don't work around it by picking a worse-fitting existing value.

**`PIPE-11`** — run against **dev only**. Prod is a separate, manually gated step that
never runs before the dev upload is verified. `enforced_by: human-review`

```bash
node scripts/add-<subject>-<year>-<paper>-q<N>.js
```

> **Commit after this phase.** Include the script file for audit trail.
> Message format: `[Data] Add <subject> <year> <paper> Q<N> video and questions`

---

## Phase 5 — Verify

**`PIPE-12`** — every item below is checked in Firestore (query directly or use
`scripts/check-video.js`) plus the subject profile's additional checklist items.
`enforced_by: human-review`

- [ ] Video/lesson document exists in the right collection with correct `name`, `paper`, `year`, `subject`
- [ ] `order` is correct and unique within the paper
- [ ] `questions_count` matches the number of question documents created
- [ ] `tags` are valid non-empty strings naming concepts (`PIPE-06`)
- [ ] All question documents exist with the correct `video` field (the new doc ID)
- [ ] Each question has non-empty `unit`, `topic`, `subtopic`, and ≥1 `skills` entry, all present in the curriculum collections (`PIPE-08`)
- [ ] Array contracts hold per type — `answer` exactly 5 for `fitb`/`fraction`/`multiple_choice`/`multi_select`/`equation` (`SCHEMA-ARR-01`); `metadata` exactly 5 for `multiple_choice`/`multi_select` (`SCHEMA-ARR-02`); `metadata: []` for `fraction`/`equation` (`SCHEMA-ARR-03`); `fitb` metadata variable-length token list (`SCHEMA-ARR-04`); `ordering`/`match`/`steps` variable length, no padding, `ordering` lengths equal (`SCHEMA-ARR-05`/`06`)
- [ ] `multiple_choice`/`multi_select`: every `answer` value exists verbatim in `metadata` (`SCHEMA-TYPE-02`); correct option never at index 0 (`SCHEMA-TYPE-06`)
- [ ] `fitb`/`steps`: `"[ ]"` always its own element (`MATHTEXT-05`); `steps` question field is a plain instruction (`MATHTEXT-04`)
- [ ] `paper_path` matches `"{syllabus}/{subject}/{year}/{paper}"` (`PIPE-05`)
- [ ] No question content lifted from the real exam paper (`DESIGN-UNI-01`)
- [ ] No `\n` in any `question` field (`DESIGN-UNI-04`)
- [ ] AI explanation present, one `sub_questions` entry per exam sub-question (maths) / practice question (English)
