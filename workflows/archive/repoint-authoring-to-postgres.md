# Repoint Authoring — Firestore → Postgres (Cloud SQL)

**Status: COMPLETE, 2026-09-03.** All 8 phases done and verified against the live dev Cloud
SQL. The authoring pipeline writes `lessons` / `questions` / `lesson_ai_explanation_sub_questions`
/ junction rows directly to Postgres via the Auth Proxy; images go to
`media-dev.askmoreprepmore.app`; `firebase-admin` is gone. Residuals (Maths curriculum,
`english_texts` scripts, `review-paper.md`, Track A prod) are follow-ups listed in Phase 8,
none blocking. On-device spot-check pending an emulator. Archiving.

Tooling was **built fresh in this repo** (owner call, 2026-09-01 — the tool that last
touched dev on 2026-08-22 was presumed stale, not worth chasing).
`ampm-firestore-migration`'s transforms were **schema-verified reference only**.

**Goal:** Make this repo's content-authoring pipeline write **directly into the Spring
backend's Cloud SQL Postgres**, replacing the current two-hop path (author → dev Firestore,
then a separate Firestore→Postgres importer). After this, Firestore is a frozen historical
store (read-only, pending only the still-deferred Track A prod reconciliation — see
"Out of scope"); this repo's pipeline is the sole path for **new** content.

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
| D3 | **Build the row-builders fresh in this repo.** `ampm-firestore-migration`'s `src/transform/*.ts` are **reference** — Phase 0 verified their column lists still match the live schema exactly, so they're a correct spec to cross-check against, but not imported/depended on | The checkout is stale (no sub-question support anywhere in its history; maths support uncommitted-only) and the tool that actually produced the 2026-08-22 dev state is on another machine and presumed staler still. Owner call 2026-09-01: rebuild, don't chase |
| D4 | Dev Postgres writes from this tooling are **fine**; prod writes are **owner-gated** | Mirrors [[firestore-writes-permission-gated]] and Track A's dev/prod split |
| D5 | The validator keeps checking the **authored/logical shape** (rules unchanged); the Postgres mapping happens after validation | Don't re-verify the schema layer twice; keeps `presentations/`/`core/` rules stable |
| D6 | **O1 — idempotency: deterministic UUIDv5 from a natural key**, namespace `84ee2362-8773-41f9-9d93-22a735709e72` (fresh, pinned, authored-content-only — never Track A's `b7e13cf0-…`) | `lessons`/`questions` have only a UUID PK, no `firestore_id`, no natural unique constraint. Deterministic IDs make re-running an upload script an upsert, and keep authored vs. migrated UUID spaces disjoint (O3) |
| D7 | **O2 — write published**: `is_published = true`, `published_at = now()` | Phase 0: 100% of live content rows are published; no staging mechanism exists (`wiki/content/publishing.md` defers the write side). Consistency beats an unusable draft state. A review gate, if ever wanted, is a later `tools/publish-lesson.js` |

**Natural keys for D6** (`paper_path` = `{syllabus}/{subject}/{year}/{paper}`):

| Row | UUIDv5 name |
|---|---|
| lesson | `lesson:{paper_path}#{order}` |
| question | `question:{lessonUuid}#{question order}` |
| sub-question | `subq:{lessonUuid}#{number}` (e.g. `1.1.1` — unique per lesson) |
| supplementary material | `supp:{lessonUuid}#{index}` |

`order` is unique within a paper (`PIPE-05`/`PIPE-12`); question `order` is unique within a
lesson (`PIPE-07`) — so each name is stable and collision-free. Junction rows
(`question_skills`, `lesson_tags`) are pure-key, no UUID.

---

## Source material (read, don't guess)

| What | Where |
|---|---|
| Reference transforms + column lists (schema-verified, not a dependency — D3) | `ampm-firestore-migration/src/transform/*.ts`, `src/upsert.ts`, `src/config.ts`, `src/postgres.ts` |
| Authored-content UUID namespace (D6, this repo owns it) | `84ee2362-8773-41f9-9d93-22a735709e72` — distinct from Track A's `b7e13cf0-…` (`firestoreId.ts`) |
| Live schema dumps from Phase 0 | `temp/schema/*.txt`, `temp/schema-diff-report.md` |
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

- Add `pg` to `package.json` (keep `firebase-admin` for now — removed in Phase 6).
- New files in `tools/lib/` (Node `.js`, matching existing tooling — the `tools/` language
  boundary in `workflows/README.md` is Node/TS for anything touching data). Written fresh;
  `ampm-firestore-migration/src/{postgres,upsert,config}.ts` are a reference for the shape:
  - `postgres.js` — single lazy `pg.Pool`, `getPool()` / `closePool()`.
  - `upsert.js` — `upsertRow({table, columns, conflictColumns}, row, {dryRun})` doing
    `INSERT … ON CONFLICT (<keys>) DO UPDATE SET …` (or `DO NOTHING` for pure-key junctions).
  - `uuid.js` — `authoredUuid(name)` = `uuidv5(name, '84ee2362-8773-41f9-9d93-22a735709e72')`
    (D6). Add `uuid` to `package.json`.
  - extend `tools/lib/credentials.js` with `pgConfig(env)` reading `PG_*_{DEV,PROD}`.
- `.env` (untracked) gains:
  ```
  PG_HOST_DEV=127.0.0.1
  PG_PORT_DEV=15432
  PG_DATABASE_DEV=ampm
  PG_USER_DEV=ampm
  PG_PASSWORD_DEV=<from Secret Manager AMPM_DB_PASSWORD>
  CLOUD_SQL_CONNECTION_NAME_DEV=ampm-b9661:us-central1:ampm-backend
  # PG_*_PROD — left blank, owner-gated (D4)
  ```
- Update `.env.example` and `tools/README.md` — proxy-first:
  `cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432` before any tool run.
- **Verification:** `tools/pg-smoke.js` connects and prints the flyway head (expect ≥ V73).
- **Commit** (`feat(tools): Phase 1 — Cloud SQL Postgres write layer + config`).

---

## Phase 2 — Upload-script template writes Postgres rows  ✅ **DONE 2026-09-01**

`tools/lib/content-rows.js` + rewritten `tools/upload-script-template.js`. **Phase 3 folded
in** — `buildContentRows` emits `lesson_ai_explanation_sub_questions` rows too. Verified
end-to-end against dev Cloud SQL with a throwaway lesson (`sort_order 999`, since deleted):
dry-run → real run → re-run all clean; row counts `1 lesson · 2 questions · 2 sub-questions ·
1 tag · 1 supplementary · 2 skill-links`, unchanged on re-run (deterministic UUIDs work);
`SELECT` back matched the authored data; namespacing, `metadata` `[]`-safety, `is_published
= true` all correct; test rows removed, dev back to 283/1006/1219.

- New `tools/lib/content-rows.js` — column lists + row builders for `lessons`, `questions`,
  `question_skills`, `lesson_tags`, `lesson_supplementary_materials`. Written from the live
  schema (`temp/schema/*.txt`) and the backend entities; cross-checked against
  `ampm-firestore-migration/src/transform/*.ts` (Phase 0 confirmed those column lists still
  match). Audit columns: `created_at`/`updated_at` = now, `is_deleted` = false, `is_published`
  = true, `published_at` = now (D7). Never write `deleted_at`.
- Rewrite `tools/upload-script-template.js`:
  - build `lessonRow` + `questionRows[]` + junction rows, `upsertRow` each (parent before
    children; `question.lesson_id` = the lesson's UUID).
  - **field renames:** `order` → `sort_order`, `presentation` → `presentation_id`, `type` →
    `question_type_id`, `video` → `lesson_id`; split `supplementary_material` → 3 columns;
    **drop** denormalized display-name fields (`syllabus_name`, `subject_color`, …) — Postgres
    resolves those by JOIN.
  - UUIDs per D6 (`authoredUuid(...)` with the natural-key names in the table above).
  - `question.metadata`: `[]` stays `[]`, never `NULL` (V64 + `PERSIST-01`).
  - `content_tier` ∈ `{free, plus, pro}`; `english_text_id` only for English P2; `series_id`
    nullable (dev has 3 series rows, authored lessons may leave it null).
- Update per-subject scripts' template references in `workflows/generate/` (full doc rewrite
  is Phase 7; here just the mechanics they call).
- **Verification:** dry-run prints rows; one real unit upserted to dev; `SELECT` back and
  compare; re-run the same script → **no duplicate rows** (O1 works).
- **Commit** (`feat(tools): Phase 2 — upload template writes Postgres`).

---

## Phase 3 — AI-explanation sub-questions writer  ✅ **DONE 2026-09-01 (folded into Phase 2)**

`buildContentRows` in `tools/lib/content-rows.js` emits `lesson_ai_explanation_sub_questions`
rows (`id` = `authoredUuid('subq:{lessonUuid}#{number}')`, `sort_order` = array index, child
audit). Verified in the Phase 2 end-to-end run: 2 sub-question rows written, order preserved,
idempotent on re-run. Summary fields map onto `lessons.ai_*` in the same builder.

Net-new — nothing in the reference repo covers this; the backend created V53 expecting an
importer that never shipped it. The app **does** read it (`LessonContentService` →
`lessonAiExplanationSubQuestionRepository.findByLessonIdOrderBySortOrderAsc` →
`AiExplanationResponse.subQuestions`), so a lesson with no rows serves `sub_questions: []`.

- New builder in `tools/lib/content-rows.js` for `lesson_ai_explanation_sub_questions` from
  the authored `aiExplanation.sub_questions[]`: `id` = `authoredUuid('subq:{lessonUuid}#{number}')`,
  `lesson_id`, `number`, `marks` (nullable), `clues`, `approach`, `solution`,
  `sort_order` = array index, child audit (`created_at`/`updated_at` = now, `is_deleted` =
  false, `deleted_at` = null). Shape matches `SubQuestionExplanationResponse` in
  `ampm-contracts`.
- The `aiExplanation` **summary** fields (`model`, `generated_at`, `version`, `reviewed`,
  `input_tokens`, `output_tokens`, `avg_rating`, `rating_count`) map onto `lessons.ai_*`
  columns (V52) — handled in the Phase 2 lesson builder.
- Wire into the upload template, written after the lesson row.
- **Verification:** `SELECT` sub-questions for the test lesson; count == one per exam
  sub-question (`AMPM-CONTENT-AI-EXP`); `sort_order` preserved; re-run → no duplicates.
- **Commit** (`feat(tools): Phase 3 — write lesson_ai_explanation_sub_questions`).

---

## Phase 4 — Curriculum / skills "reuse before creating" repoint  ✅ **DONE 2026-09-03**

Read **directly from Postgres**, not the read API — `api-dev.askmoreprepmore.app` isn't
reachable from the dev environment, and the Phase 1 connection layer already exists (same
source of truth, one less network dependency).

- `tools/dump-curriculum-vocabulary.js`: rewritten — reads `curriculum_nodes` + `skills`
  from Cloud SQL. `--env` (`--project` kept as an alias), `--subject`, `--out`; same JSON
  shape the validator expects (bare-slug arrays). English HL: bare slug = last `__` segment;
  English skills are real `skills` rows now, not distinct-usage-derived.
- New `tools/lib/curriculum.js` — the `curriculum_nodes` ID conventions (flat math_lit /
  namespaced english_hl), now the single source for both `content-rows.js` and the creator.
- New `tools/create-curriculum-node.js`, `create-skill.js`, `create-tag.js` — upsert one row
  each, FK-preflighted (parent nodes / subject must exist), written published. Replaces the
  "add the Firestore doc first" step of `PIPE-08` / `PIPE-06`.
- **Verified on dev:** dumped both subjects (5/25/123/64 math_lit, 8/46/266/250 english_hl);
  created throwaway unit+topic+skill+tag, re-dump showed them, idempotent re-create updated
  the name, english subtopic correctly rejected for a missing parent topic; all test rows
  deleted, counts back to baseline.
- **Commit** (`feat(tools): Phase 4 — curriculum/skills vocab + creation on Postgres`).

---

## Phase 5 — Exam images → media bucket  ✅ **DONE 2026-09-03**

`tools/upload-exam-images.js` rewritten: `@google-cloud/storage` + ADC (no service-account
JSON, no `makePublic()`), targets `media-dev.askmoreprepmore.app`, same object-key layout,
emits `https://media-dev.askmoreprepmore.app/<key>` directly. **Verified on dev:** uploaded a
test PNG → served at the CDN domain (`200`, `image/png`) → test objects removed.

Bucket facts (found 2026-09-03 via `gcloud storage buckets list --project=ampm-b9661`):

| | |
|---|---|
| Bucket | `media-dev.askmoreprepmore.app` (name = the serving domain) · location `AFRICA-SOUTH1` |
| Serving | `https://media-dev.askmoreprepmore.app/<objectPath>` — verified `200`, `image/png`, real bytes |
| Access | **Uniform bucket-level access ON** — no per-object ACLs. Whole bucket is `allUsers` → `roles/storage.objectViewer`, so **no `makePublic()` step** (the current `upload-exam-images.js` calls it — must be removed, it errors under UBLA) |
| Upload creds | ADC works for a project editor; there's also a dedicated `ampm-media-signer@ampm-b9661.iam.gserviceaccount.com` (`objectAdmin`) |
| Object keys | `exam_papers/{syllabus}/{subject}/{year}/{paper}/q{N}/{question|annexure|memo}_{n}.png` — already what the tool produces; supplementary labels use `annexure_{label}_{n}.png` |

- `tools/upload-exam-images.js`: swap `firebase-admin` Storage for `@google-cloud/storage`
  (ADC), target `media-dev.askmoreprepmore.app`, drop the `makePublic()` call, emit
  `https://media-dev.askmoreprepmore.app/<objectPath>` directly. Keep the same object-key
  layout. `--project dev` is the only supported value until prod is provisioned.
- Prod bucket + creds: owner-gated (D4).
- **Verification:** upload one image; `curl -I` the printed URL → `200` + real
  `content-length`.
- **Commit** (`feat(tools): Phase 5 — exam images to media bucket`).

---

## Phase 6 — Validator + dependency cleanup  ✅ **DONE 2026-09-03**

- `tools/validate-questions.js`: rules unchanged (D5). Deleted the dead `loadQuestions`
  require-interceptor (the `--script` path only ever used `extractQuestionsFromSource`, which
  never executes the script). Added a set-level check that fails a script still using
  `firebase-admin` / `admin.firestore(`. Header updated (Firestore → Postgres). `--curriculum`
  JSON shape unchanged, so no parsing change needed.
- `tools/upload-script-template.js`: `upload()` now guarded behind `require.main === module`
  — validating or otherwise requiring the file opens no connection and writes nothing.
- `tools/lib/credentials.js`: dropped the now-unused `serviceAccountPath` (kept `pgConfig`
  + `loadDotEnv`).
- `firebase-admin` **removed** from `package.json`. Runtime deps: `pg`, `uuid`,
  `@google-cloud/storage`. `.env.example` no longer mentions Firebase service accounts
  (the `AMPM_FIREBASE_SA_*` lines in a local `.env` are now dead — safe to delete).
- **Verified:** validator exits 0 on the empty template; flags a real old `add-*.js`
  (`✗ Script still uses firebase-admin`); `require('./tools/upload-script-template.js')`
  runs nothing.
- **Commit** (`refactor(tools): Phase 6 — validator repoint + drop firebase-admin`).

---

## Phase 7 — Docs rewrite  ✅ **DONE 2026-09-03**

Rewrote `core/persistence.md` (store = Cloud SQL; new `PERSIST-05` write-published),
`core/upload-pipeline.md` (Phases 2/3.5/4/5 for Postgres, `PIPE-04..12`, image domain),
`core/question-schema.md` (authored logical shape → columns; dropped `video`/`deleted`/
timestamps), `core/ai-explanation.md`, `core/authoring-principles.md`, `core/mathtext.md`,
`presentations/fraction.md`, the three `workflows/generate/upload-*.md`, all three
`subjects/*.md` (Postgres tables, curriculum sources, vocab-dump command, poetry/`text_key`),
`README.md`, `tools/README.md`, `workflows/README.md`. Known limitations flagged in place:
Maths curriculum nodes don't exist yet; `english_texts` maintenance scripts not yet
repointed. Tool smoke (validator / dump / dry-run) green after the pass.

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

## Phase 8 — End-to-end verification + archive  ✅ **DONE 2026-09-03**

Ran a full unit (`dbe/math_lit/2018/nov_p1` order 998, MC + fitb, 2 sub-questions) through
the real tooling:

1. `tools/upload-exam-images.js` → 3 objects in `media-dev.askmoreprepmore.app`, served
   `200`.
2. `tools/validate-questions.js --curriculum` → **caught a bad subtopic slug**
   (`box_whisker_interpretation` vs the real `box_and_whisker_interpretation`), passed after
   the fix — the hard stop works.
3. `--dry-run` → upsert → re-run: row counts stable (`1 lesson · 2 tags · 1 supp · 2
   sub-q · 2 questions · 2 skill-links`), deterministic UUID → upsert not duplicate.
4. **Publish-filtered SQL read** (mimics `LessonContentService` / `QuestionContentService`
   — `WHERE is_published AND NOT is_deleted`): returned the lesson + questions +
   sub-questions + tags + skills, curriculum FKs resolved, `metadata` intact.
5. Test rows + GCS objects removed; dev back to 283 / 1006 / 1219.

The backend read **API** (`api-dev.askmoreprepmore.app`) isn't reachable from this
environment — the equivalent publish-filtered query was run directly instead.

**On-device spot-check: pending** — no emulator attached this session. Not a blocker (same
call the bootstrap made); do it next time an emulator is up, authoring a real unit.

### Residuals (follow-ups, not blockers — tracked in "Out of scope")

- ~~**Maths curriculum**~~ — **DONE 2026-09-03** (`tools/backfill-maths-curriculum.js`):
  127 `maths` `curriculum_nodes` built + reconciled from the 2019 P1/P2 back-catalogue, all
  100 Maths questions backfilled, and a latent bug fixed (7 questions pointed at Math Lit's
  `probability` node). Maths node IDs are `maths_`-prefixed (`tools/lib/curriculum.js`) to
  avoid PK collisions with Math Lit's flat scheme. **Dev only — prod pending owner go.**
- **`english_texts` maintenance** — `check-p2-videos.js` / `update-english-texts.js` still
  target Firestore in the AMPM repo; a new prescribed text needs a Postgres `english_texts`
  row added by hand until they're ported.
- **`review-paper.md`** (paper-QA harness, AMPM repo) still reads Firestore — its own repoint.
- **Track A prod reconciliation** — still owner-deferred; needs its own rebuild/verify pass.

**Commit + archive.**

---

## Out of scope

- **Track A prod reconciliation** (bulk import of the *existing historical* Firestore corpus
  into prod Postgres) — still owner-deferred. Phase 0 found its dev tooling has drifted from
  what actually ran on 2026-08-22; when prod is triggered it needs its own rebuild/verify
  pass. Not this workflow. This workflow only handles **new** authored content going forward.
- **A content dashboard / review UI** — separate future project.

## Owner-gated / cross-repo items

- **Prod**: Cloud SQL prod connection, media prod bucket, `PG_*_PROD` in `.env` — all
  owner-triggered (D4, mirrors [[firestore-writes-permission-gated]]).
- **Review gate**: if a staging state is ever wanted instead of write-published (D7), it
  needs an `ampm-backend` decision (`wiki/content/publishing.md` defers the write side
  entirely). Thin doc in `ampm-backend` if so.
- **Track A archived doc**: note the authored-vs-migrated UUID-space split (D6/O3) in
  `ampm-firestore-migration/workflows/archive/track-a-content-import.md` — done as a
  one-line cross-reference during Phase 7.
