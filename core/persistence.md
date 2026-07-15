---
id: AMPM-CONTENT-PERSISTENCE
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-PIPELINE]
tags: [content, persistence, firestore, postgres, nullability, publishing]
---

# Persistence Contract

## Purpose

Where authored content lives, how the dual stores map to each other during the
Firestore→Postgres transition, and — the part this repo owns — **the nullability rules
per content field with the enforcement location for each**, so that a contract like
"metadata is never null" is enforced by the schema layer rather than assumed by app
code.

**Detail lives elsewhere — don't duplicate it here:**
- Full collection↔table mapping, migration status per table:
  `ampm-backend/wiki/database/migration-map.md`
- Firestore field shapes: `AMPM/wiki/database/firestore/database_architecture.md`
- Publish-flag read-filtering semantics: `ampm-backend/wiki/content/publishing.md`
- Import mechanics (re-runnable upserts): `ampm-firestore-migration` (Track A docs)

## Store mapping (summary)

Authoring writes to **dev Firestore** (upload pipeline, `PIPE-11`); the migration repo's
re-runnable Track A import moves content into Postgres (`questions`, `lessons`, and
reference/junction tables). During the transition window Firestore remains the authoring
surface and Postgres the serving store for the new backend.

| Firestore | Postgres | Note |
|---|---|---|
| `math_questions` / `maths_questions` / `english_questions` | `questions` | one table; subject FK distinguishes (V26) |
| `math_videos` / `maths_videos` / `english_videos` | `lessons` | |
| `question_presentation` | `question_presentations` | reference table (V20) |
| `math_question_types` | `question_types` | reference table (V21) |
| `math_lit_curriculum` / `english_lit_curriculum` | curriculum tables | unit/topic/subtopic hierarchy |
| `math_lit_skills` | `skills` (+ `question_skills` junction) | V17; junction: question↔skill N:M |

## Publish-flag semantics

`questions`, `lessons`, `english_texts` carry `is_published`/`published_at` (V41);
reads are filtered on it. Junction tables (`question_skills`) deliberately carry no
publish flag (`ARCH-BE-PUBLISHING`) — visibility is governed by the owning row.
Authored content lands unpublished; publishing is a backend-side action, not part of
this repo's upload pipeline.

## Nullability rules (the contract this repo owns)

**`PERSIST-01` — `metadata` is non-null, always.** The empty array is the legitimate
"none" state (`fraction`/`equation` — `SCHEMA-ARR-03`), so blank-driven presentation
types (`fitb`, `steps`) can never silently lose their contract to a NULL that app code
masks with `?: emptyList()`.

Enforcement locations, end to end (the Phase 4 chain, in order):
1. `enforced_by: validator` — authoring time: `metadata` required, shape per type.
2. `enforced_by: db-constraint` — import time: the migration transform maps `[]` → `{}`
   (never NULL; fixed 2026-07-15, `ampm-firestore-migration` commit `9a04c5a`), and
   `questions.metadata` is `SET NOT NULL`
   (`ampm-backend/workflows/active/questions-metadata-not-null.md`).
3. Contract layer: `QuestionResponse.metadata` non-nullable from `ampm-contracts`
   0.11.0.
4. App layer: **no guard, by owner decision (2026-07-15)** — the
   `metadata ?: emptyList()` masking in `SpringQuestionMapper` is deleted once 0.11.0
   lands (AMPM `content-framework-support.md` Phase D). A NULL reaching the app should
   be impossible, and if the schema layer ever regresses, failing loudly beats
   rendering an unanswerable question.

**`PERSIST-02`** — other `questions` non-null columns (enforced by the Postgres schema:
`lesson_id`, `name`, `question`, `answer`, `presentation_id`, `question_type_id`,
`syllabus_id`, `subject_id`, `year_id`, `paper_id`, `sort_order`, `xp`, `difficulty`,
`exam_weight`, `created_at`, `updated_at`, `is_deleted`, `is_published`).
`enforced_by: db-constraint` (authoring-side presence: `SCHEMA-DOC-01`).

**`PERSIST-03`** — legitimately nullable fields, with meaning:
`unit_id`/`topic_id`/`subtopic_id` (pre-backfill content), `clues` (no meaningful hint),
`context_text` (English-only inline stimulus; null = none),
`supplementary_material_*` (null = no attached figure), `english_text_id` (Paper 2
only), `deleted_at`/`published_at` (state timestamps). Authoring rules for when to use
null: subject profiles + `AMPM-CONTENT-DESIGN`. `enforced_by: human-review`.

**`PERSIST-04`** — soft-delete only: content rows are never hard-deleted
(`is_deleted` + `deleted_at`); Firestore side uses the `deleted` boolean. Retired
`english_texts` get `active: false`, never deletion (user selections reference the doc
ID). `enforced_by: human-review` (+ backend framework rules).

## Enforcement-chain status (2026-07-15)

| # | Repo | Step | Status |
|---|---|---|---|
| 1 | `ampm-firestore-migration` | `[]`→NULL transform fix + dev re-import | ✅ done (commits `9a04c5a`, `f5c4772` there; 0 NULLs among 906 imported rows) |
| 2 | `ampm-backend` | seed-row cleanup, backfill + `SET NOT NULL`, entity non-null | ✅ done (V64, commit `6a37056` there; seed row soft-deleted + unpublished per `AMPM-BE-ENT-SOFTDELETE-01`; API sweep of 906 items: 0 null/absent metadata) |
| 3 | `ampm-contracts` | `QuestionResponse.metadata` non-nullable, 0.11.0 | in progress |
| 4 | `AMPM` | bump 0.11.0, delete `?: emptyList()` masking (Phase D) | pending #3 |

Trailing items: backend bumps to 0.11.0 after #3 (recorded in its archived workflow
doc); the 2 dev Postgres fraction rows still carrying legacy scaffolding metadata heal
via re-import once the Firestore source docs are fixed (Inventory #6, owner-gated).
