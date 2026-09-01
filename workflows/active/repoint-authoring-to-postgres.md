# Repoint Authoring — Firestore → Postgres (Cloud SQL)

**Status:** Phase 0 **DONE** (2026-09-01) — verdict **GO**, full report in
`temp/schema-diff-report.md`. Phases 1–8 not started. **Two Phase-0 findings gate Phase 1**
(see "Open decisions" — the sub-question importer provenance, and O1's idempotency key).

**Goal:** Make this repo's content-authoring pipeline write **directly into the Spring
backend's Cloud SQL Postgres**, replacing the current two-hop path (author → dev Firestore,
then `ampm-firestore-migration` upsert → Postgres). After this, Firestore is a frozen
historical store (read-only, pending only the still-deferred Track A prod reconciliation);
this repo's pipeline is the sole content write path.

**Why now:** The app has been onboarded onto Cloud SQL and is dual-reading (Firestore +
Postgres) with **nothing new being written to Firestore**. New content authored to Firestore
would never reach users unless the Firestore→Postgres importer keeps running — so the
importer hop is now pure overhead. `ampm-backend`'s content API is read-only by design
(`wiki/content/publishing.md` — "the app has never had a write path for this data"), so
"pointing at the backend" means writing its database, exactly as `ampm-firestore-migration`
already does.

**Workflow:** Do NOT enter plan mode — drive implementation from this doc. **Commit after
each phase**, message referencing the phase. Cross-repo model per `workflows/README.md`:
any `ampm-backend` change gets its own thin workflow doc in that repo, cross-referencing
this one — never a direct edit from here.

---

## Decisions locked (this session, 2026-09-01)

| # | Decision | Rationale |
|---|---|---|
| D1 | Write **directly to Cloud SQL Postgres**, not via an API | Backend content API is read-only by design; a bulk-write endpoint is explicitly rejected (`ampm-backend/plan/track-a-content-import.md` §7) |
| D2 | Connect via **Cloud SQL Auth Proxy** → `127.0.0.1:5432` | Matches `ampm-firestore-migration`'s `PG_*` config shape; IAM-auth, no public IP, connection name is explicit (avoids the bootstrap's "dev was local Docker on 15433" split) |
| D3 | **Reuse `ampm-firestore-migration`'s transforms** as the row-shape source of truth | Battle-tested against 900+ real rows; column lists + `*Row` interfaces in `src/transform/*.ts` |
| D4 | Dev Postgres writes from this tooling are **fine**; prod writes are **owner-gated** | Mirrors [[firestore-writes-permission-gated]] and Track A's dev/prod split |
| D5 | The validator keeps checking the **authored/logical shape** (rules unchanged); the Postgres mapping happens after validation | Don't re-verify the schema layer twice; keeps `presentations/`/`core/` rules stable |

**Open decisions — Phase 1 is blocked on the first two:**

- **BLOCKER — Where is the real importer?** (Phase 0 §4b.) The live dev DB was fully
  (re)populated **2026-08-22** — 283 lessons incl. 30 maths, 1006 questions, **1219
  `lesson_ai_explanation_sub_questions` rows**. The `ampm-firestore-migration` checkout at
  `~/WebstormProjects/` (last commit 2026-07-16) **cannot have produced this**: sub-question
  population exists nowhere in its history (`git log -S sub_questions --all` → nothing), and
  its maths support is uncommitted-only. A newer/other version of the importer exists.
  **Owner: point us at where the 2026-08-22 import was run from** (other machine, other
  checkout, `.esc-ai/worktrees/*`). If unrecoverable, the sub-question transform is written
  fresh against V53 + `SubQuestionExplanationResponse` (shape in report §5).
- **O1 — Idempotency key for authored rows.** Confirmed in Phase 0: `lessons`/`questions`
  have only a UUID PK, no `firestore_id`, no natural unique constraint. Options: (a) derive
  the lesson UUID deterministically from a natural key (`paper_path` + lesson `name`, or
  `paper_path` + `sort_order`) so re-running an upload script upserts; (b) random UUID once,
  committed into the script, edits by-id. **Leaning (a).**
- **O2 — Publish state. RESOLVED (pending owner nod): write published.** Phase 0 found
  **100% of live content rows are `is_published = true`** with no staging mechanism in use
  anywhere. Pipeline writes `is_published = true`, `published_at = now()` to stay
  consistent. (If a review gate is later wanted: write unpublished + `tools/publish-lesson.js`.)
- **O3 — Track A collision.** The deferred Track A prod reconciliation must never clobber
  authored rows. If O1 picks (a), authored and migrated UUID spaces are disjoint by
  construction (different derivation inputs). Document the rule in Track A's archived doc.

---

## Source material (read, don't guess)

| What | Where |
|---|---|
| Existing transforms + column lists | `ampm-firestore-migration/src/transform/*.ts`, `src/import/*.ts`, `src/upsert.ts`, `src/config.ts`, `src/postgres.ts` |
| Deterministic UUID namespace | `ampm-firestore-migration/src/transform/firestoreId.ts` (`NAMESPACE = b7e13cf0-6f2e-4c7a-9f2b-2a6b6a9f7e3d`) |
| Backend content schema (authoritative) | `ampm-backend/**/src/main/resources/db/migration/V*.sql` — content-relevant: V16, V17, V23, V26, V27, V28, V29, V31, V41, V49–V53, V60, V64 |
| Backend entities (cross-check nullability) | `ampm-backend/content/src/main/kotlin/com/esma/ampm/backend/content/{question,lesson,reference}/*Entity.kt` |
| Deployment facts (Cloud SQL) | `ampm-backend/wiki/architecture/deployment.md` |
| Publish semantics | `ampm-backend/wiki/content/publishing.md`, `core/persistence.md` |
| This repo's pipeline | `core/upload-pipeline.md`, `core/persistence.md`, `tools/*.js`, `workflows/generate/*.md` |

**Cloud SQL dev instance:** connection name `ampm-b9661:us-central1:ampm-backend`, Postgres
17, database `ampm`, user `ampm`, password in Secret Manager (`AMPM_DB_PASSWORD`).

---

## Phase 0 — Schema-diff verification  ✅ **DONE 2026-09-01**

**Report:** `temp/schema-diff-report.md`. Raw `\d+` dumps: `temp/schema/`.
**Verdict:** GO. Schema has **not** drifted — every column the migration transforms write
still exists with the same type/nullability (flyway head V73; nothing after V64 touches a
content table). The risk surfaced instead: (1) the local importer checkout is not the tool
that produced the live data (§4b), (2) `lesson_ai_explanation_sub_questions` must be written
and no local template covers it (§4a). O2 resolved (write published). O1 confirmed real.

The procedure that was run is kept below for the record / re-run.

**Purpose:** Confirm `ampm-firestore-migration`'s transforms still match the live backend
schema before building anything on top of them.

**No code, no doc rewrites in this phase. Output is a report + a go/no-go.**

### 0.1 — Enumerate the write surface

The authoring pipeline will write these tables:

| Table | Written when | Notes |
|---|---|---|
| `lessons` | every unit | + `lesson_tags`, `lesson_supplementary_materials` (junction/child) |
| `lesson_ai_explanation_sub_questions` | every unit | **V53 — NOT handled by the migration repo (see 0.5)** |
| `questions` | every unit | + `question_skills` (junction) |
| `curriculum_nodes` | only when a new unit/topic/subtopic is authored | self-referential FK: unit → topic → subtopic ordering; English namespaces IDs `${unit}__${topic}` |
| `skills` | only when a new skill is authored | |

Read-only (FK targets, must already exist): `subjects`, `syllabuses`, `papers`, `years`,
`question_presentations`, `question_types`, `series`, `english_texts`, `tags`.

### 0.2 — Capture the live dev schema

1. Start the Cloud SQL Auth Proxy (owner may need to run this — needs `gcloud` auth):
   ```bash
   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 5432
   ```
2. Connect and confirm the migration state:
   ```bash
   psql "host=127.0.0.1 port=5432 dbname=ampm user=ampm" \
     -c "SELECT version FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"
   ```
   Expect the head at **V73** (or later). Record the actual value.
3. Dump each write-target table's real shape into `temp/schema/`:
   ```bash
   for t in lessons lesson_tags lesson_supplementary_materials \
            lesson_ai_explanation_sub_questions questions question_skills \
            curriculum_nodes skills; do
     psql "host=127.0.0.1 port=5432 dbname=ampm user=ampm" \
       -c "\d+ $t" > "temp/schema/$t.txt"
   done
   ```

### 0.3 — Diff three ways

For each write-target table, build a column-by-column table comparing:

| Column | In live DB? | nullable / default | In migration `*_COLUMNS` (`src/transform/<t>.ts`) | In backend `*Entity.kt` | Match? |
|---|---|---|---|---|---|

Sources:
- (a) `temp/schema/<t>.txt` from 0.2
- (b) `ampm-firestore-migration/src/transform/<t>.ts` — `*_COLUMNS` array + `*Row` interface
- (c) `ampm-backend/content/src/main/kotlin/.../{question,lesson,reference}/*Entity.kt`

Also scan `V49__rename_video_to_lesson.sql` through the head migration for **any** `ALTER
TABLE` on the tables in 0.1. First-pass finding (re-confirm): **nothing after V64 touches a
content table** — V65–V73 are referral / analytics / admin / user-progress only. If that
holds, the migration repo's transforms are structurally current.

### 0.4 — Confirm the known gaps and unknowns

1. **`lesson_ai_explanation_sub_questions` (V53)** — the migration repo folds the
   AI-explanation *summary* onto `lessons.ai_*` columns (V52) and **drops the
   `sub_questions[]` array entirely**. Confirm:
   - the table shape (`temp/schema/lesson_ai_explanation_sub_questions.txt`) against
     `LessonAiExplanationSubQuestionEntity.kt` — expected columns: `id`, `lesson_id`,
     `number`, `marks` (nullable), `clues`, `approach`, `solution`, `sort_order`, child
     audit (`created_at`, `updated_at`, `is_deleted`, `deleted_at`).
   - whether `LessonContentService` / `LessonResponse` actually reads it (does the app show
     per-sub-question explanations?). Records the authoring contract for Phase 3 either way.
2. **`deriveUuid` namespace** — confirm `src/transform/firestoreId.ts` still pins
   `b7e13cf0-6f2e-4c7a-9f2b-2a6b6a9f7e3d`. It must never change (idempotency of any future
   Track A re-run depends on it). Feeds decision O1/O3.
3. **FK-target seed rows exist in dev** — the 8 `question_presentations` IDs (`fitb`,
   `fraction`, `multiple_choice`, `multi_select`, `ordering`, `match`, `equation`, `steps`)
   and the `question_types` IDs referenced by real math_lit / english_hl questions:
   ```sql
   SELECT id FROM question_presentations ORDER BY id;
   SELECT id FROM question_types ORDER BY id;
   ```
4. **Idempotency (O1)** — confirm `lessons` / `questions` have no unique constraint beyond
   the PK and no `firestore_id` column (first pass: confirmed against `V23`/`V26`). Decide
   the natural-key derivation for authored rows.
5. **`series`** — nullable FK; confirm either rows exist or `NULL` is acceptable for
   authored lessons.

### 0.5 — Output

Write `temp/schema-diff-report.md`:
- The flyway head version.
- Per-table diff tables from 0.3.
- Each discrepancy classified: **benign** (migration repo already handles / no impact),
  **gap** (net-new writer code needed — e.g. sub-questions), or **blocker** (schema moved in
  a way that breaks a transform — needs a decision before Phase 2).
- Resolutions for O1, O2, O3.
- A one-line **GO / NO-GO** for Phase 1.

**Commit** (`docs(workflow): Phase 0 — schema-diff verification report + go/no-go`). Report
only; no other files touched.

---

## Phase 1 — Postgres write layer + config

*(Refined after Phase 0.)*

- Add `pg` to `package.json` (keep `firebase-admin` for now — removed in Phase 6).
- Port into `tools/lib/` (Node `.js`, matching existing tooling — the `tools/` language
  boundary in `workflows/README.md` is Node/TS for anything touching data):
  - `postgres.js` ← `ampm-firestore-migration/src/postgres.ts` (pool lifecycle)
  - `upsert.js` ← `src/upsert.ts` (`INSERT … ON CONFLICT DO UPDATE`)
  - extend `tools/lib/credentials.js` with `pgConfig(env)` ← `src/config.ts` shape
- `.env` (untracked) gains:
  ```
  PG_HOST_DEV=127.0.0.1
  PG_PORT_DEV=5432
  PG_DATABASE_DEV=ampm
  PG_USER_DEV=ampm
  PG_PASSWORD_DEV=<from Secret Manager AMPM_DB_PASSWORD>
  CLOUD_SQL_CONNECTION_NAME_DEV=ampm-b9661:us-central1:ampm-backend
  # PG_*_PROD — left blank, owner-gated (D4)
  ```
- Update `.env.example` and `tools/README.md` (proxy-first instructions).
- **Verification:** `tools/pg-smoke.js` connects via the proxy and prints the flyway head.
- **Commit** (`feat(tools): Phase 1 — Cloud SQL Postgres write layer + config`).

---

## Phase 2 — Upload-script template writes Postgres rows

*(Refined after Phase 0; carries O1 + O2 resolutions.)*

- New `tools/lib/content-rows.js` — the `lessons` / `questions` / `question_skills` /
  `lesson_tags` / `lesson_supplementary_materials` column lists + row builders, mirrored
  from `ampm-firestore-migration/src/transform/{lessons,questions,questionSkills,lessonTags,
  lessonSupplementaryMaterials}.ts`. Cite the migration repo commit the arrays were copied
  from, so drift is auditable.
- Rewrite `tools/upload-script-template.js`:
  - build `lessonRow` + `questionRows[]` + junction rows, `upsertRow` each (parent before
    children; `question.lesson_id` = the lesson's UUID).
  - **field renames:** `order` → `sort_order`, `presentation` → `presentation_id`, `type` →
    `question_type_id`, `video` → `lesson_id`; split `supplementary_material` → 3 columns;
    **drop** denormalized display-name fields (`syllabus_name`, `subject_color`, …) — Postgres
    resolves those by JOIN.
  - lesson UUID per O1.
  - audit columns via `auditColumns(now)`; `is_published` per O2.
  - `question.metadata`: `[]` stays `[]`, never `NULL` (V64 + `PERSIST-01`).
- Update per-subject scripts' template references in `workflows/generate/` (full doc rewrite
  is Phase 7; here just the mechanics they call).
- **Verification:** dry-run prints rows; one real unit upserted to dev; `SELECT` back and
  compare; re-run the same script → **no duplicate rows** (O1 works).
- **Commit** (`feat(tools): Phase 2 — upload template writes Postgres`).

---

## Phase 3 — AI-explanation sub-questions writer

- New builder in `tools/lib/content-rows.js` for `lesson_ai_explanation_sub_questions` from
  the authored `aiExplanation.sub_questions` array: `id` (per O1 or fresh uuid), `lesson_id`,
  `number`, `marks` (nullable), `clues`, `approach`, `solution`, `sort_order`, child audit.
- Wire into the upload template (Phase 2), written after the lesson row.
- **Verification:** `SELECT` sub-questions for the test lesson; count == one per exam
  sub-question (`AMPM-CONTENT-AI-EXP`); order preserved.
- **Commit** (`feat(tools): Phase 3 — write lesson_ai_explanation_sub_questions`).

---

## Phase 4 — Curriculum / skills "reuse before creating" repoint

- `tools/dump-curriculum-vocabulary.js`: replace the Firestore reads with the backend's
  **read API** — `GET /v1/content/curriculum-nodes?subjectId=<s>` and
  `GET /v1/content/skills?subjectId=<s>` (public, read-only; no DB creds needed). Emit the
  same JSON shape the validator's `--curriculum` flag expects. English namespacing: the API
  returns real node IDs; strip `${unit}__${topic}__` prefixes to the bare segment as today.
- New `tools/create-curriculum-node.js` + `tools/create-skill.js` — upsert into
  `curriculum_nodes` / `skills` (Postgres, via Phase 1 layer), respecting the self-FK insert
  order (unit → topic → subtopic) and English ID namespacing. This replaces the "create the
  Firestore doc first" step in `core/upload-pipeline.md` `PIPE-08`.
- **Verification:** dump vocab; create a throwaway node; re-dump; it appears. Delete it.
- **Commit** (`feat(tools): Phase 4 — curriculum/skills vocab + creation on Postgres`).

---

## Phase 5 — Exam images → media bucket

- The media bucket behind `https://media-dev.askmoreprepmore.app/` is **ready** (owner
  confirmed). Get the GCS bucket name + confirm the object-path convention — the migration
  repo rewrites `exam_papers/{syllabus}/{subject}/{year}/{paper}/qN/…` paths **unchanged**
  onto the new domain, so keep those exact object keys.
- `tools/upload-exam-images.js`: swap `firebase-admin` Storage for `@google-cloud/storage`
  (ADC or a service account), upload to the media bucket, emit
  `https://media-dev.askmoreprepmore.app/<objectPath>` directly (no post-hoc rewrite).
- Prod bucket + creds: owner-gated (D4).
- **Verification:** upload one image; `curl -I` the printed CDN URL → `200` + real
  `content-length`.
- **Commit** (`feat(tools): Phase 5 — exam images to media bucket`).

---

## Phase 6 — Validator + dependency cleanup

- `tools/validate-questions.js`: rules unchanged (D5 — it validates the authored/logical
  shape). Add a guard that the upload script imports the Postgres writer, not
  `firebase-admin`. Adjust `--curriculum` snapshot parsing only if Phase 4 changed the JSON
  shape (it shouldn't).
- Remove `firebase-admin` from `package.json` once no tool references it. `pg` and
  `@google-cloud/storage` are the runtime deps.
- **Verification:** validator exits 0 on the Phase 2 test script; non-zero on a deliberately
  broken one (array-length, split-token).
- **Commit** (`refactor(tools): Phase 6 — validator repoint + drop firebase-admin`).

---

## Phase 7 — Docs rewrite

The framework's whole purpose is docs-match-reality — this is real work, not a footnote.

- `core/persistence.md` — rewrite "Store mapping": Postgres is the authoring **and** serving
  store; Firestore is frozen historical (read-only, pending only Track A prod
  reconciliation). Update the enforcement-chain table (the validator now writes Postgres
  directly; no Firestore→Postgres transform step in the authoring path).
- `core/upload-pipeline.md` — Phase 4/5 rewritten for Postgres upserts; Phase 1.5 image
  domain/paths; `PIPE-08`/`PIPE-09` point at the API + `create-*` tools; `PIPE-11` "run
  against dev" → "upsert to dev Cloud SQL via the Auth Proxy".
- `workflows/generate/upload-{math-lit,maths,english}.md` — collection names → table names;
  Firestore verification steps → `psql` / API checks.
- `README.md` — the "content lives in Firestore (live authoring store)" line.
- `index.md`, `tools/README.md`, `.env.example` — consistency pass.
- **Verification:** grep the repo for `firestore` / `firebase` — every remaining hit is
  either historical context (clearly dated) or the Track A reconciliation reference.
- **Commit** (`docs: Phase 7 — pipeline + persistence docs for Postgres authoring`).

---

## Phase 8 — End-to-end verification + archive

- Author one **real** unit through the whole new pipeline (pick a math_lit question group):
  images → lesson → questions → sub-questions → validate (hard stop) → upsert dev.
- Confirm via the backend read API: `GET /v1/content/lessons/{id}`,
  `GET /v1/content/questions?lessonId={id}` return the unit (once published per O2).
- Idempotency: re-run the upload script → row counts unchanged.
- On-device spot-check if an emulator is attachable (same gate the bootstrap used) — else
  record pending in a support doc, don't block the archive on it.
- Move this doc to `workflows/archive/`, update `workflows/README.md`'s Archive table.
- **Commit** (`docs(workflow): Phase 8 — end-to-end verified, archive repoint-to-postgres`).

---

## Owner-gated / cross-repo items

- **Prod**: Cloud SQL prod connection, media prod bucket, `PG_*_PROD` in `.env` — all
  owner-triggered (D4, mirrors [[firestore-writes-permission-gated]]).
- **O2 publish mechanism**: if a staging/review gate is wanted instead of write-published,
  that may need an `ampm-backend` decision (its `wiki/content/publishing.md` currently
  defers the write side entirely). Thin doc in `ampm-backend` if so.
- **Track A archived doc**: add the authored-vs-migrated UUID-space rule (O3) to
  `ampm-firestore-migration/workflows/archive/track-a-content-import.md` when O1 is decided.
