---
id: AMPM-CONTENT-PERSISTENCE
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-PIPELINE]
tags: [content, persistence, postgres, cloud-sql, nullability, publishing]
---

# Persistence Contract

## Purpose

Where authored content lives, how the authoring pipeline writes it, and — the part this
repo owns — **the nullability rules per content field with the enforcement location for
each**, so that a contract like "metadata is never null" is enforced by the schema layer
rather than assumed by app code.

**Detail lives elsewhere — don't duplicate it here:**
- Full table shapes, migration history: `ampm-backend/**/db/migration/V*.sql`, entities
- Publish-flag read-filtering semantics: `ampm-backend/wiki/content/publishing.md`
- The write tooling: `tools/lib/content-rows.js`, `tools/upload-script-template.js`
- The Firestore→Postgres transition history:
  `workflows/archive/repoint-authoring-to-postgres.md`

## Store — Cloud SQL Postgres (`ampm-backend`)

**Authoring writes directly to the backend's Cloud SQL Postgres** (`ampm-b9661:us-central1:
ampm-backend`, database `ampm`), through the Cloud SQL Auth Proxy — `PIPE-11`. There is no
Firestore hop and no separate importer: the upload script builds the target rows and
upserts them.

Firestore is a **frozen historical store** — the app still dual-reads it during the
transition window, but nothing new is written there. Its remaining role is the one-off
Track A reconciliation of the *pre-existing* corpus into prod (still owner-deferred,
`ampm-backend/plan/track-a-content-import.md` §8) — out of scope for this repo.

| Authored block | Postgres table(s) | Note |
|---|---|---|
| `video` (lesson doc) | `lessons` (+ `lesson_tags`, `lesson_supplementary_materials`) | one table for all subjects; `subject_id` FK distinguishes |
| `aiExplanation` | `lessons.ai_*` columns + `lesson_ai_explanation_sub_questions` | summary on the lesson row; one sub-question row per `sub_questions[]` entry |
| `questions[]` | `questions` (+ `question_skills`) | `presentation`→`presentation_id`, `type`→`question_type_id`, `order`→`sort_order` |
| new `unit`/`topic`/`subtopic` | `curriculum_nodes` | flat IDs for math_lit, `unit__topic__subtopic` for english_hl — `tools/create-curriculum-node.js` |
| new `skills[]` entry | `skills` (+ `question_skills` junction) | `tools/create-skill.js` |
| new `tags[]` entry | `tags` | `tools/create-tag.js` |

Row identity is a **deterministic UUIDv5** from a natural key (`tools/lib/uuid.js`,
namespace `84ee2362-…`), so re-running an upload script upserts rather than duplicates, and
authored IDs never collide with Track A's (`b7e13cf0-…`).

## Publish-flag semantics

`questions`, `lessons`, `english_texts` carry `is_published`/`published_at` (V41); reads are
filtered on it. Junction tables (`question_skills`, `lesson_tags`) deliberately carry no
publish flag (`ARCH-BE-PUBLISHING`) — visibility is governed by the owning row.

**`PERSIST-05` — the upload pipeline writes content published** (`is_published = true`,
`published_at = now()`). There is no write-side "publish" action anywhere in the ecosystem
(`ampm-backend/wiki/content/publishing.md`: the write side is deferred to a future content
dashboard), and 100% of the existing live rows are published — writing unpublished would
make the content permanently invisible. If a review/staging gate is ever wanted it is a
separate `tools/publish-lesson.js` + a backend decision. `enforced_by: db-constraint`
(NOT NULL default) + `human-review`.

## Nullability rules (the contract this repo owns)

**`PERSIST-01` — `metadata` is non-null, always.** The empty array is the legitimate
"none" state (`fraction`/`equation` — `SCHEMA-ARR-03`), so blank-driven presentation
types (`fitb`, `steps`) can never silently lose their contract to a NULL that app code
masks with `?: emptyList()`.

Enforcement locations, end to end:
1. `enforced_by: validator` — authoring time: `metadata` required, shape per type.
2. `enforced_by: db-constraint` — write time: `tools/lib/content-rows.js` maps a missing
   `metadata` to `[]` (never `null`), and `questions.metadata` is `text[] NOT NULL` (V64).
3. Contract layer: `QuestionResponse.metadata` non-nullable (`ampm-contracts` ≥ 0.11.0).
4. App layer: **no guard, by owner decision (2026-07-15)** — no `?: emptyList()` masking.
   A NULL reaching the app should be impossible, and if the schema layer ever regresses,
   failing loudly beats rendering an unanswerable question.

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

**`PERSIST-04`** — soft-delete only: content rows are never hard-deleted (`is_deleted` +
`deleted_at`). The upload tooling never sets `deleted_at` (leaves it NULL). Retired
`english_texts` get `active: false`, never deletion (user selections reference the ID).
`enforced_by: human-review` (+ backend framework rules).
