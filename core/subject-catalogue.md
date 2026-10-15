---
id: AMPM-CONTENT-SUBJECT-CATALOGUE
type: reference
layer: core
related: [AMPM-CONTENT-PERSISTENCE, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-APP-VERSIONS]
tags: [content, subjects, catalogue, hosted, syllabus, visibility, exam-timetable]
---

# Subject Catalogue — Why a Subject Does (or Doesn't) Show in the App

## Purpose

Since 2026-10-15 the `subjects` table is no longer "the subjects we have content for". It is the
**full catalogue of NSC subjects**, and a handful of columns decide where each one is shown. This
doc explains that model from the *author's* side: what you do, what happens automatically, and how
to find out why a subject you just authored is not visible.

Added with the Finals Exam Planner (Linear BLA-25, tickets BLA-63 to BLA-75). **Status of the
`hosted` trigger (`CATALOGUE-01`, migration V95): written and verified 2026-10-15; applies to an
environment only once V95 is deployed there** — until then `hosted` still needs a manual flip with
an `updated_at` bump (the gotcha at the end). The backend side lives
in `ampm-backend/wiki/database/postgres/` (`reference-tables.md`, `exam-schedule.md`,
`user-data.md`); this doc does not restate table shapes.

## The model in one picture

```
subjects (catalogue, ~100 rows, one per NSC subject-level)
  ├─ hosted        "we have published content for it"          DERIVED by a DB trigger (V95)
  ├─ is_published  "the subject row itself is live"            set by the catalogue migrations
  ├─ syllabus_ids  "which boards offer it" {dbe} | {dbe,ieb}  set by migration, NOT by content
  └─ min_app_version (effective) = max(subject gate, lowest exam gate in exam_versions)

lessons / questions   ── you author these (upsert, published) ──► they decide `hosted`
exam_session / exam_paper_schedule   ── the DBE and IEB timetables ── imported, never authored here
```

Three different audiences read the catalogue:

| Endpoint | Returns | Read by |
|---|---|---|
| `GET /v1/content/subjects` | **hosted subjects only**, for every client, with their gates | every app build; this is the subject picker and the content sync |
| `GET /v1/content/subject-catalogue` | **every published subject**, hosted or not, each with `hosted` and `syllabusIds` | the new subject selector and the exam planner (reminders for subjects we do not teach) |
| `GET /v1/content/exam-sessions/{id}/schedule` | the official papers and dates | the exam planner |

## Rules

**`CATALOGUE-01` — `hosted` is derived from published content; never set it by hand.**
A database trigger on `lessons` and `questions` (migration V95) sets
`subjects.hosted = TRUE` and bumps `subjects.updated_at` the moment a lesson or question for that
subject becomes `is_published = TRUE` and not deleted. It fires for every writer, which matters
because **this framework writes Postgres directly** (`tools/lib/upsert.js`,
`push-paper-to-prod.js --publish`) and never passes through the backend, so no application code
could do it. Consequences:

- Authoring a subject for the first time needs **no extra step** to make it appear.
- The prod flow still works: `push-paper-to-prod.js` lands rows *unpublished*; `--publish` runs
  `UPDATE lessons SET is_published = true`, which fires the trigger, so the subject becomes hosted
  on prod at the publish step, not at the push.
- It is **one-directional**: unpublishing or deleting content never un-hosts a subject. Un-hosting
  is a deliberate, manual decision (a migration), not a side effect.
- Bumping `updated_at` is what delivers the change to apps that already synced; a hand-edit of
  `hosted` that forgets to bump it would not reach them.
`enforced_by: db-trigger` (V95), covered by `SubjectHostedFromContentIntegrationTest`.

**`CATALOGUE-02` — `hosted` is not "is the content good enough to show".** It only means "at least
one published lesson or question exists". Gating a half-finished subject from users is done with
the exam gate (`VER-*`, `tools/set-exam-gate.js`) or by leaving rows unpublished — not by leaving
`hosted` false. `enforced_by: human-review`

**`CATALOGUE-03` — `syllabus_ids` says which boards *offer* a subject, not which boards you have
content for.** `{dbe}` is DBE-only (e.g. Technical Maths, Religion Studies); `{dbe,ieb}` is offered
by both. It is seeded from the imported exam timetables and changed by migration. Lesson content
keeps its own `syllabus_id` (`dbe`/`ieb`) — unrelated. The subject selector shows a subject only
when the student's effective syllabus is in `syllabus_ids`; effective syllabus =
`syllabus_v2_id ?? syllabus_id ?? 'dbe'` (`user_education`). Content and progress still read the
old `syllabus_id`; do not point content features at `syllabus_v2_id` until IEB content exists.
`enforced_by: db-constraint` (CHECK: non-empty, only `dbe`/`ieb`).

**`CATALOGUE-04` — an unhosted subject is a reminders-only subject.** It appears in the catalogue
and the selector, can be given exam dates and reminders, and has no lessons. It is never returned
by `/subjects`, so old builds (anything before 2.2.0 ignores `min_app_version`) can never see an
empty subject. The moment content is published the trigger moves it to `/subjects`.
`enforced_by: backend` (`findByIsPublishedTrueAndHostedTrue`).

**`CATALOGUE-05` — the subject row must exist first, and one subject has one id.** Writes fail on
the foreign key if the `subject_id` is not in `subjects` (and `seed-curriculum.js` refuses
explicitly). The catalogue already holds every NSC
subject from the 2026 DBE timetable using the convention `maths`, `english_hl`, `afrikaans_fal`,
`isizulu_hl` (lower snake case, level suffix `_hl`/`_fal`/`_sal`). Look for an existing id before
adding one: a duplicate id for the same subject hides its timetable and splits its content (this
happened once: `life_sciences` was seeded next to the real `life_science`; the duplicate is retired).
Physical Sciences is one subject, `physics`, covering both Physics P1 and Chemistry P2.
`enforced_by: db-constraint` (FK) + `human-review`

## "Why isn't my subject showing?" — check in this order

| # | Symptom | Check | Cause / fix |
|---|---|---|---|
| 1 | Not in `/subject-catalogue` either | `subjects` row missing, or `is_published = false`, or `is_deleted` | create the row (`CATALOGUE-05`) / publish it via the catalogue migration |
| 2 | In the catalogue, not in `/subjects` | `hosted = false` | no published lesson or question exists yet. If you *did* publish and it is still false, the trigger or its sweep missed it — see "Verify" below |
| 3 | In `/subjects`, app still hides it | `min_app_version` / exam gate higher than the build | `exam_versions` for the exam (`tools/apply-exam-gate.js`); the app hides a subject whose build is below the gate (e.g. a 2.4.1 build does not show a subject gated at 2.5.0) |
| 4 | App shows it but the lesson list is empty | `lessons.is_published`, `is_deleted`, `syllabus_id`, `paper_id`/`year_id` | the content sync filters on all of these per exam |
| 5 | Shows on dev, not on prod | prod has no row/content, or the prod push was never `--publish`ed | `push-paper-to-prod.js`, then `--publish`; prod also needs the subject row published |
| 6 | Student with an IEB profile does not see it | `syllabus_ids` is `{dbe}` | expected — the board does not offer it (`CATALOGUE-03`) |

### Verify (read-only, through the Auth Proxy)

```sql
SELECT id, hosted, is_published, is_deleted, syllabus_ids, min_app_version, updated_at
FROM subjects WHERE id = '<subject>';

SELECT count(*) FILTER (WHERE is_published AND NOT is_deleted) AS live_lessons
FROM lessons WHERE subject_id = '<subject>';

-- every unhosted subject that nonetheless has live content (should be empty)
SELECT s.id FROM subjects s
WHERE NOT s.hosted AND s.is_published AND NOT s.is_deleted
  AND (EXISTS (SELECT 1 FROM lessons l WHERE l.subject_id = s.id AND l.is_published AND NOT l.is_deleted)
    OR EXISTS (SELECT 1 FROM questions q WHERE q.subject_id = s.id AND q.is_published AND NOT q.is_deleted));
```

And over HTTP: `GET /v1/content/subjects` (hosted, gated by header `X-App-Version`) versus
`GET /v1/content/subject-catalogue` (everything).

## What authors do not touch

- **The exam timetable.** `exam_session` and `exam_paper_schedule` are imported from the official
  DBE and IEB PDFs by `ampm-backend/scripts/exam-timetable/nsc_timetable.py` and applied as a
  migration; the process and the review step are in `ampm-backend/wiki/database/postgres/
  exam-schedule-import.md`. A lesson's `paper_id`/`year_id` identify *content*; a schedule row
  identifies an *exam date*. They are not linked yet (`paper_id` on a schedule row is left NULL until
  the revision-resolver work), so authoring a paper does not need a timetable row and vice versa.
- **Students' exam dates, selections and the DBE/IEB offer.** User data, owned by the backend.

## Gotcha — hand-editing

If you ever edit these tables by hand (a one-off fix), bump `updated_at` in the same statement:
apps sync subjects by `updated_at`, so a flag flipped without it stays invisible to every client
that has already synced until that row changes again.
