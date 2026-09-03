---
id: AMPM-CONTENT-PIPELINE
type: guide
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-AI-EXP]
tags: [content, upload, pipeline, postgres, cloud-sql, images, validation]
provenance: new 2026-07-15 — shared skeleton extracted from AMPM/workflows/generate/upload-{math-lit,maths,english}.md (their Phases 1.5 / 3.5 / 4 / 5 were 90%+ identical). Repointed Firestore→Postgres 2026-09-03 (workflows/archive/repoint-authoring-to-postgres.md).
---

# Upload Pipeline

## Purpose

The shared, subject-independent skeleton for uploading **one content unit** (one lesson
document + its practice questions) to the backend's **Cloud SQL Postgres**. The thin
per-subject workflow in `workflows/generate/` sequences these phases and layers the subject
deltas from `subjects/{profile}.md` on top.

**Source of truth for all DB fields:** the `ampm-backend` schema
(`**/src/main/resources/db/migration/V*.sql` + the content entities). Field → column
mapping and row-identity rules: `core/persistence.md` + `tools/lib/content-rows.js`.

> **Prerequisite for every phase that touches the DB (1.5 uses GCS; 3.5, 4, 5 use Postgres):**
> the Cloud SQL Auth Proxy must be running —
> `cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432`.
> Image upload (1.5) uses Application Default Credentials, no proxy. See `tools/README.md`.

---

## Phase sequence

| Phase | What | Commit? |
|-------|------|---------|
| 1 | Analyse the exam question (subject-specific — see profile) | no |
| 1.5 | Extract and upload exam images | no |
| 2 | Design the lesson document (subject template) | no |
| 3 | Design the practice questions | no |
| 3.5 | Dump current curriculum vocabulary | no |
| 4 | Fill the upload script → **validate (hard stop)** → upsert to dev | **yes** |
| 5 | Verify (psql / read API) | no |

---

## Phase 1.5 — Extract and Upload Exam Images

**`PIPE-01`** — every extracted image is visually inspected before upload.
`enforced_by: human-review`

`--pdf`/`--memo-pdf` point at `files/` — the source PDFs dropped in per `INSTRUCTIONS.md`
Step 0 (tracked — commit them). `--out`/`temp/images/` is this framework's own working
directory, always (gitignored).

1. **Inspect shared pages (if needed):** when two question groups (or a TEXT and its
   questions) share a page, find the exact cut points first:
   ```bash
   python3 tools/extract-exam-pages.py --pdf files/<paper>.pdf --inspect <page> --out temp/images/
   ```
   Read the band scan output — find the pt value just above the next heading (`y_end`)
   and just below the last mark allocation (`y_start`).

2. **Extract images:**
   ```bash
   python3 tools/extract-exam-pages.py \
     --pdf files/<paper>.pdf \
     --memo-pdf files/<paper>_memo.pdf \
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
   The upload re-uploads to the same object key, so a rotation fix caught after upload
   needs no DB change — just re-run the image upload.

4. **Upload to the media bucket — dev only** (**`PIPE-02`** `enforced_by: human-review`;
   `--project` defaults to dev, prod is a separate gated step). Uses Application Default
   Credentials (`gcloud auth application-default login`):
   ```bash
   node tools/upload-exam-images.js \
     --syllabus <syllabus> --subject <subject> --year YYYY --paper <paper> \
     --order N \
     --dir temp/images/qN/
   # supplementary groups (one run per labeled TEXT/extract):
   #   add --supplementary-type annexure --supplementary-label "<exam's own label>"
   ```
   Prints `https://media-dev.askmoreprepmore.app/...` URLs (bucket
   `media-dev.askmoreprepmore.app`, world-readable — no per-object step).

5. Copy the printed `question_image_urls`, `supplementary_materials`, and
   `memo_image_urls` values into the Phase 2 document.

**`PIPE-03`** — supplementary-material labels match the exam's own naming exactly
(`"Text A"`, `"Extract G"`, `"Poem"`, `"Formula Sheet"` — never `"Passage"` or other
invented labels), one entry per TEXT/extract, and files for multiple extracts on one
lesson are renamed distinctly before upload so they don't collide in Storage.
`enforced_by: human-review` (per-subject label conventions: subject profile)

> Skip this phase for video-only uploads where images are not yet available. Set the
> image fields to `null` and populate later. Object keys are stable
> (`exam_papers/{syllabus}/{subject}/{year}/{paper}/q{order}/...`), shared with the
> historical migrated content.

---

## Phase 2 — Design the Lesson Document

The full field template is subject-specific (`subjects/{profile}.md`). You author the
**logical shape** (the `video` block — `name`, `syllabus`, `subject`, `year`, `paper`,
`order`, `content_tier`, `tags`, image URL arrays, …); `tools/lib/content-rows.js` maps it
to `lessons` columns (drops denormalized display names — Postgres resolves those by JOIN;
`order`→`sort_order`; splits `supplementary_materials` into rows). Shared rules:

**`PIPE-04`** — `content_tier` is one of `free` / `plus` / `pro` (not the old `is_premium`
boolean). Denormalized display-name fields are **not authored** — omit them.
`enforced_by: human-review`

**`PIPE-05`** — `order` is the unit's 1-based sequential position across the full paper
(unique within the paper — it's part of the row's deterministic UUID key);
`questions_count` is computed from the questions array. `"{syllabus}/{subject}/{year}/{paper}"`
(the old `paper_path`) is the natural-key prefix for the lesson UUID, not a stored column.
`enforced_by: human-review`

**`PIPE-06`** — `tags` (2–5 lowercase strings) name the concept or curriculum topic
being tested, never the real-world scenario wrapper (✗ `motorcycles`, `house`;
✓ `percentage`, `exchange_rates`, `figurative_language` — real-world terms only when
they name a curriculum topic, e.g. `sars`, `hire_purchase`). `enforced_by: human-review`

### Reference: ID values

Only the **left-hand ID column** is authored (`syllabus`, `subject`, `paper`, `year`) — it's
an FK into the backend's reference tables, which already hold the display names/colours. The
name/colour columns below are kept only so you can sanity-check you picked the right ID.

**Syllabuses**

| `syllabus` | `syllabus_name` | `syllabus_full_name` | `syllabus_color` |
|---|---|---|---|
| `dbe` | `"DBE"` | `"Department of Basic Education"` | `"#D34567"` |
| `ieb` | `"IEB"` | `"Independent Examinations Board"` | `"#18D39D"` |

**Subjects**

| `subject` | display name (reference only) |
|---|---|
| `math_lit` | Mathematical Literacy |
| `maths` | Pure Mathematics |
| `english_hl` | English Home Language |

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

**`PIPE-08` — Reuse before creating: `unit`, `topic`, `subtopic`, `skills`.**
`enforced_by: validator` (Phase 4 run with `--curriculum`), `human-review` (conceptual
equivalence)

Author bare slugs for `unit`/`topic`/`subtopic` and skill IDs. They must already exist in
`curriculum_nodes` / `skills` — the FK preflight in the upload script fails loudly on any
that don't. Check them against the **fresh vocabulary snapshot** (Phase 3.5), which is a
live dump from Postgres — never a list embedded in a doc (embedded lists silently go stale;
that is how a 6th unit went unreconciled and how 75% of real subtopics ended up referenced
by questions but absent from the curriculum).

Scan for **conceptual equivalence**, not just exact string match — `data_analysis` vs
`data_analytics` are duplicates; use whichever exists. If no existing entry covers the
concept, **create the row FIRST, in the same session, before writing it into any question**:

```bash
node tools/create-curriculum-node.js --subject <s> --type unit|topic|subtopic \
  --slug <bare> --name "<display>" [--unit <bare>] [--topic <bare>]
node tools/create-skill.js --subject <s> --id <slug> --name "<display>"
node tools/create-tag.js  --subject <s> --id <slug>            # for a new lesson tag (PIPE-06)
```

Then re-dump the vocabulary snapshot (Phase 3.5).

---

## Phase 3.5 — Dump Current Curriculum Vocabulary

**`PIPE-09`** — required once per session, before Phase 4's validator run.
`enforced_by: validator` (Phase 4 fails without a snapshot when `--curriculum` is used)

```bash
node tools/dump-curriculum-vocabulary.js --subject <subject> --out temp/curriculum-vocab.json
```

Reads `curriculum_nodes` + `skills` from Cloud SQL (Auth Proxy must be running). If you add
a curriculum/skill row during the session (per `PIPE-08`), re-run this dump before
validating.

---

## Phase 4 — Fill & Run Upload Script

**Required framework docs:** `AMPM-CONTENT-AI-EXP`

Copy `tools/upload-script-template.js` to `scripts/add-<subject>-<year>-<paper>-q<N>.js`
and fill its three data blocks — `video`, `questions`, `aiExplanation` — with the Phase 2/3
data (logical/authored shape per `AMPM-CONTENT-SCHEMA` + `AMPM-CONTENT-AI-EXP`). The
template handles everything else: builds the `lessons` / `questions` /
`lesson_ai_explanation_sub_questions` / junction rows via `tools/lib/content-rows.js`,
deterministic UUIDs, the FK preflight, and the upsert. `subject` on each block is the only
thing that used to be a "collection" choice.

### Validate — HARD STOP before uploading

**`PIPE-10`** — `enforced_by: validator`

```bash
node tools/validate-questions.js --script scripts/add-<...>.js --curriculum temp/curriculum-vocab.json
```

(Recognized flags: `--script`, `--ai-exp`, `--curriculum`. Omit `--curriculum` only where
the subject has no curriculum hierarchy yet — the subject profile says which applies.) The
validator also fails a script still using `firebase-admin`.

Do **not** run the upload until the validator exits 0. Auto-fixable violations (array
length, index-0 placement) may be fixed inline; structural violations (split-token format,
`steps` question text) must be rethought. A vocabulary violation means the slug isn't a
`curriculum_nodes` / `skills` row yet — create it first per `PIPE-08`, re-dump, re-validate;
don't work around it by picking a worse-fitting existing value.

**`PIPE-11`** — upsert against **dev only** (Auth Proxy running). Prod is a separate,
manually gated step that never runs before the dev upsert is verified.
`enforced_by: human-review`

```bash
node scripts/add-<subject>-<year>-<paper>-q<N>.js --dry-run   # inspect the rows first
node scripts/add-<subject>-<year>-<paper>-q<N>.js             # upsert to dev
```

Re-running is safe (deterministic UUIDs → upsert, not duplicate).

> **Commit after this phase.** Include the script file for audit trail.
> Message format: `[Data] Add <subject> <year> <paper> Q<N> lesson and questions`

---

## Phase 5 — Verify

**`PIPE-12`** — every item below is checked via `psql` (Auth Proxy) or the read API
(`GET /v1/content/lessons/{id}`, `/v1/content/questions?lessonId={id}`), plus the subject
profile's additional checklist items. `enforced_by: human-review`

- [ ] `lessons` row exists with correct `name`, `subject_id`, `syllabus_id`, `year_id`, `paper_id`
- [ ] `sort_order` is correct and unique within the paper
- [ ] `questions_count` matches the number of `questions` rows written
- [ ] `is_published = true` on the lesson and every question (`PERSIST-05`)
- [ ] `lesson_tags` rows present, tag slugs name concepts (`PIPE-06`)
- [ ] All `questions` rows exist with the correct `lesson_id`
- [ ] Each question has non-null `unit_id`, `topic_id`, `subtopic_id`, and ≥1 `question_skills` row (`PIPE-08`)
- [ ] `lesson_ai_explanation_sub_questions`: one row per exam sub-question (maths) / practice question (English), `sort_order` sequential
- [ ] Array contracts hold per type — `answer` exactly 5 for `fitb`/`fraction`/`multiple_choice`/`multi_select`/`equation` (`SCHEMA-ARR-01`); `metadata` exactly 5 for `multiple_choice`/`multi_select` (`SCHEMA-ARR-02`); `metadata` empty for `fraction`/`equation` — `[]` authored, `{}` in Postgres, never NULL (`SCHEMA-ARR-03`, `PERSIST-01`); `fitb` metadata variable-length token list (`SCHEMA-ARR-04`); `ordering`/`match`/`steps` variable length, no padding, `ordering` lengths equal (`SCHEMA-ARR-05`/`06`)
- [ ] `multiple_choice`/`multi_select`: every `answer` value exists verbatim in `metadata` (`SCHEMA-TYPE-02`); correct option never at index 0 (`SCHEMA-TYPE-06`)
- [ ] `fitb`/`steps`: `"[ ]"` always its own element (`MATHTEXT-05`); `steps` question field is a plain instruction (`MATHTEXT-04`)
- [ ] No question content lifted from the real exam paper (`DESIGN-UNI-01`)
- [ ] No `\n` in any `question` field (`DESIGN-UNI-04`)
- [ ] Image URLs resolve (`https://media-dev.askmoreprepmore.app/...` → `200`)
