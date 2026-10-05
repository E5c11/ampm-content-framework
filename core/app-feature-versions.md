---
id: AMPM-CONTENT-APP-VERSIONS
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-PIPELINE]
tags: [content, versioning, gating, app-version, exam, keyboard, backend]
provenance: created 2026-10-04 from the keyboard-gating-foundation work (Linear BLA-20/BLA-21/BLA-58;
  AMPM `plan/active/question-keyboards-and-exam-version-gating.md`). Version numbers are real release
  tags, found with `git tag --contains <first commit>` in the AMPM repo — not estimates.
---

# App Feature Versions — Which Builds Can Render This Exam

## Purpose

Content can depend on things only some app builds have: a keyboard, a presentation type, a
character the keyboard can type, a markup form. A build that lacks one shows the question wrongly
or makes it **unanswerable** — and nothing in a render-only review will catch it (the minus-sign
and Physics `steps` incidents in `core/keyboard-input.md`). This doc is the mechanism that stops
such content reaching builds that cannot handle it, **without** forcing every user to update and
without freezing what content you can author.

It owns: the unit of gating (the **exam**), how the minimum version is **derived**, the procedure
for setting it, and the feature→version table.

## The mechanism, end to end

1. The app sends its marketing version on **every** request: header `X-App-Version`
   (`ampm-contracts` `ApiHeaders.APP_VERSION`).
2. The backend has one `exam_versions` row per gated exam. Its content endpoints (lessons,
   questions, and the by-id endpoints) **omit** exams whose minimum is above the caller's version.
   Omission, not an error — an older build just sees a shorter list and cannot tell the exam
   exists. The library's years/papers are derived from synced lessons, so a hidden exam leaves no
   empty year or paper behind.
3. A request with no header (builds that predate the header) is treated as **2.0.0**, a single
   backend setting (`ampm.content.assumed-version-when-missing`).
4. `SubjectResponse.minAppVersion` is the **effective** subject gate: the larger of the subject's
   own gate and the *lowest* gate among its published exams. A subject whose every exam is too new
   for a build therefore shows **"Coming soon"** there (onboarding chips and the library's subject
   switcher both key on `isAvailable`), with no client change.
5. The client keeps a `since` cursor per (content type, subject, syllabus). When its **app version
   changes** it drops the cursor and does a full resync, so an exam that was hidden from an older
   build is delivered after the user updates. (Without this the delta sync would never send rows
   whose `updated_at` is already behind the cursor.)

Builds before **2.0.0** read Firestore, never Spring: this mechanism cannot affect them and they
see no new content. **2.0.0 is the support floor** (`FLOOR` in `tools/lib/feature-versions.js`).

> Status (2026-10-04): built and verified on **dev only**. Prod needs the backend migrations
> (V79 device-info, V80 `questions.keyboard_type`, V81 `exam_versions`) and an app release carrying
> the header + resync before any prod exam can be gated. Until then `set-exam-gate.js --env prod`
> fails (no table), and prod gating is a no-op.

## Rules

**`VER-01`** — The unit of gating is the **exam**: one (subject, syllabus, year, session) — every
paper of that sitting together, never a single paper. A student must not see Paper 3 without
Papers 1 and 2. One `exam_versions` row per exam; `session` is `papers.session` (`june` |
`november`). `enforced_by: schema (primary key), tooling`

**`VER-02`** — An exam's minimum version is **derived, never hand-set**:
`node tools/derive-exam-min.js scripts/add-<subject>-<year>-<session>-*.js`. It is the highest
version needed by any question in any script of the exam: its presentation types, the keyboard it
resolves to, every character of every typed answer (against that keyboard's inventory and the
version each key shipped), and any markup. A hand-set number drifts the moment a script changes.
`enforced_by: validator` (`validate-questions.js` per script, `derive-exam-min.js` per exam)

**`VER-03`** — **Gate before publishing.** A gate stops builds from *receiving* an exam; it does
**not** remove rows a device already stored. Raising a gate on a published exam leaves it on every
device that synced earlier. Set the gate while the exam is still unpublished.
`enforced_by: human-review` (`set-exam-gate.js` warns when it sees published rows)

**`VER-04`** — Every gate change goes through `node tools/set-exam-gate.js` — **never raw SQL**.
The tool also sets `updated_at = now()` on the exam's lessons and questions in the same
transaction. Reason (verified live on dev, 2026-10-04): clients sync with a `since` cursor and the
server returns rows with `updated_at > since`; changing or removing a gate touches none of the
exam's rows, so a client that synced past them never receives an exam that just became available
to it. Removing the temporary gate on dev did **not** bring the exam back until `updated_at` was
bumped. `enforced_by: tooling`

**`VER-05`** — **Planned capabilities are valid to author, and dev-only until tagged.** Everything on the
keyboard/exam-gating plan (the `physics` / `chemistry` / `text` keyboards, the extended `scientific_math`
keys and letters, MathText `_{…}` / `^{…}`) validates now. Content that depends on one has the derived minimum
`next-release` (`NEXT` in `feature-versions.js`: "the next release, number unknown until it is tagged"). Such
content may live on **dev only**: `push-paper-to-prod.js` refuses to copy it to prod, `set-exam-gate.js`
refuses `--min next`, and until the capability is in a build the question falls back to subject inference and
may not be answerable on a device. Nothing here blocks authoring; it blocks *publishing*.
`enforced_by: tooling`

**`VER-06`** — When a release adds a capability, in the **same change**: set its `since` in
`tools/lib/feature-versions.js`, add/adjust its row below, and (if it raises what existing exams
need) re-run `derive-exam-min.js` on affected exams. Take the version from the release tag, not
from memory. `enforced_by: human-review`

**`VER-07`** — Don't gate unless the derived minimum is above the floor. An exam whose derived
minimum is `2.0.0` needs no `exam_versions` row (a missing row means no gate).
`enforced_by: human-review`

## Procedure — new or changed exam content

1. Author and validate each script: `node tools/validate-questions.js --script scripts/add-….js`.
   Fix every error; read the "Derived minimum app version" line.
2. Derive the exam: `node tools/derive-exam-min.js scripts/add-<subject>-<year>-<session>-*.js`.
3. If the result is above the floor: set the gate **before** publishing —
   `node tools/set-exam-gate.js --env dev … --min <result>` (dry run), then `--apply`.
4. Publish the exam (`core/upload-pipeline.md`).
5. Verify on a dev build **below** the minimum that the exam is absent and on one at/above it that
   it is present.
6. Prod: same commands with `--env prod --i-know-this-is-prod` after the dev check, and only once
   prod has the backend migrations and an app release that sends the header (see Status above).

If the result is `next-release` the exam depends on a planned capability: keep it on dev, do not gate it and do
not push it to prod until that release is tagged and the real version replaces `NEXT` (`VER-06`).

## Feature → first app version

Source for tooling: `tools/lib/feature-versions.js`. Release = the first AMPM git tag containing
the commit that added the capability.

| Capability | First release | Evidence / note |
|---|---|---|
| Spring-backend builds (the floor) | **2.0.0** | Pre-2.0.0 builds are Firestore-only. |
| Presentations `multiple_choice`, `multi_select`, `fitb`, `ordering`, `match` | ≤ 2.0.0 | Not individually tag-checked; all are in the original question UI and present on every Spring build the team has shipped. |
| `fraction` presentation + structural fraction input | v1.1.2 | Below the floor. |
| `StandardMath` and English keyboards | v1.2.0 | Below the floor. |
| `steps`, `equation`, `ScientificMath` keyboard (digits, `. + × ÷ ( ) =`, `sin cos tan π θ √ log ≤ ≥ ∴ ∵ ≠ ∈ ℤ`) | v1.6.0 | Below the floor. |
| ScientificMath: ASCII `-` typeable (minus key previously emitted U+2212) | **2.2.0** | Commit b3e7a8ed0. Before it a typed negative number never matched a stored `-47`. |
| ScientificMath: `x y ^ %` keys | **2.2.0** | Same commit. Before it no variable letter or power could be typed. |
| Stored U+2212 normalised to `-` when marking `fitb`/`steps` (not `fraction`) | **2.2.0** | `QuestionsValidator.normalizeNumericString`, same commit. |
| `questions.keyboard_type` honoured by the client (`none`, `standard_math`, `scientific_math`) | **next release after 2.3.2 — not yet tagged** | Older builds ignore the field and infer by subject, so declaring a keyboard older builds already infer anyway needs no gate. |
| `X-App-Version` header; full resync on app-version change | **next release after 2.3.2 — not yet tagged** | Prerequisite for any prod exam gate to take effect. |
| `physics`, `chemistry`, `text` keyboards | **planned — next release** | BLA-21 / BLA-58. Valid to author; `NEXT` in the tooling until tagged. `physics` (4d) and `chemistry` (4e) are both built on AMPM `dev` and emulator-verified, as is the `fitb` answer box / row label rendering of `^`/`_` markup. |
| Extended `scientific_math` keys: all letters, `< > ; , [ ] ° ' ± ∞ ∩ ∪ !`, `Σ σ Δ Ω μ ε α β`, `ln lim nCr nPr`, sub/super mode keys | **planned — next release** | BLA-21 item 5c0 (final layout still to be designed from real Grade 12 papers). `NEXT` until tagged. |
| `case_sensitive` flag (fitb marking skips lower-casing) | **planned — next release** | D15 / initiative 4c. Needs contracts 0.40.0 (published), backend V82 (deployed to dev), the app change (merged to `dev`, verified on the emulator). `NEXT` until the release is tagged. |
| MathText `_{…}` / `^{…}` markup | **planned — next release** | Decision D4, BLA-21 item 5d. Recorded as `NEXT` in the tooling until the release is tagged and its number is entered here (`VER-06`). |

A capability row marked "next release after 2.3.2" must be replaced with the real tag as soon as it
ships (`VER-06`) — until then content depending on it cannot be given an honest number, which is
why the tooling marks everything planned as `NEXT` (dev-only) instead of guessing a number.

## Known findings from the first run (2026-10-04, existing scripts)

`derive-exam-min.js` over the 115 existing upload scripts: 112 need only the floor; three need
**2.2.0**, all from the negative-number cases above:

| Script | Reason |
|---|---|
| `add-maths-2025-nov-p1-q3.js` | stored answer `"−47"` (U+2212) — needs the 2.2.0 normalisation |
| `add-maths-2025-nov-p1-q9.js` | stored answer `"−22"` (U+2212) — same |
| `add-physics-2025-nov-p1-q4.js` | answer `"-3"` typed on ScientificMath — needs the 2.2.0 ASCII-minus fix |

Consequences, **not yet acted on** (each is a prod/product decision):

- **Physics (Physical Sciences) 2025 Nov** is live in prod and its *subject* gate is **2.1.2** —
  lower than 2.2.0. On a 2.1.2–2.1.x build a student who types the correct `-3` gets the wrong
  character and is marked wrong. The exam's derived minimum is 2.2.0.
- **Maths 2025 Nov** is on dev only; if published before the gate is set it will mark `−47`/`−22`
  wrong on builds below 2.2.0.
- Prefer fixing the *content* where possible: store `-47` (ASCII) rather than `−47`; that removes
  the dependency on the normalisation and drops those two scripts back to the floor.

## Findings from the database-wide run (2026-10-04, dev and prod identical)

`node tools/backfill-keyboard-types.js --env prod` (read-only dry run) derives each exam from the rows in the
database, not from scripts, so it also covers content that was migrated from Firestore and has no upload
script. Prod: 18 exams, 1,542 questions. The script-based findings above stand, plus **11 questions whose
stored answer cannot be typed on the keyboard they resolve to** (`KEYBOARD-01`). These are existing live
content defects, unrelated to this version work, and **not yet fixed**:

| Exam | Questions | Problem | Fix options |
|---|---|---|---|
| `maths` 2019 Nov | P1 Q2 `144/5`, P1 Q3 `63/10`, P2 Q3 `-4/3` | `fitb` answers written as slash fractions; `StandardMath` has no `/` key. `SCHEMA-TYPE-05` already forbids simulating fractions with `/`. | Convert to the `fraction` presentation, or store a decimal. |
| `maths` 2019 Nov | P2 Q1 (`QR = x`, "express in terms of x") | answer `x`; `StandardMath` has no letters. | Declare `keyboard_type: scientific_math` (typeable from 2.2.0 — the `x` key — and honoured only by builds that read `keyboard_type`), or change the question to a numeric answer. |
| `english_hl` 2021, 2022, 2024 Nov (P1) | 3 + 2 + 2 questions | sentence answers ending in `.` (one also contains the digits `2015`); the English keyboard has no punctuation or digits, and marking does not strip punctuation. | Remove the trailing full stop from stored answers now, or wait for the `text` keyboard (BLA-58) and its trailing-punctuation-tolerant marking; the digit one needs `text`. |

Also: **Physics (Physical Sciences) 2025 Nov** was live with subject gate 2.1.2 while its derived exam minimum
was 2.2.0 (above).

**Status (2026-10-04): all 12 fixed on dev, not yet on prod.** `scripts/fix-keyboard-defects-2026-10-04.js`
(dry run by default; row-checked; validates each corrected row with the same analysis; bumps `updated_at`):
- Maths 2019 P1 Q2, P1 Q3, P2 Q3 became `fraction` questions (`144`/`5`, `63`/`10`, `-4`/`3`).
- Maths 2019 P2 Q1 became numeric (`PQ = 14 cm`, answer `7`) instead of "in terms of x".
- Seven English HL P1 answers lost their trailing full stop; 2021 Q4's year became given text.
- Physics 2025 P1 Q3 now asks for |pᵢ| = `3` instead of `-3`, so the exam no longer derives 2.2.0 and
  needs no gate.
Each was driven through the real dev app on the emulator (fraction boxes + number pad incl. the minus key,
the numeric fitb, the English keyboard on a rewritten question and on a two-alternative answer, the
ScientificMath `steps` input) and marked correct. The same row IDs exist in prod; run the script with
`--env prod --apply --i-know-this-is-prod` when you're ready (and see the order caveat in the pipeline: the
script edits rows in place and bumps `updated_at`, so devices pick the change up on their next sync).
The two Maths 2025 Nov answers `−47` / `−22` (U+2212) are **not** fixed — they are dev-only content and still
derive 2.2.0; storing ASCII `-47` / `-22` would remove that.

Decimal commas (`8,6`) are **not** a defect: marking converts `,` to `.` on both sides for `fitb`, `fraction`
and `steps`, so a student types `8.6`. (An early version of the tool flagged 57 of them; the analysis now
models that.)

## Source of truth

If this doc and the app disagree, **the app wins**; then fix the table above and
`tools/lib/feature-versions.js` together.

- `AMPM/feature/watch/.../questions/ui/KeyboardResolver.kt`, `…/utils/QuestionsValidator.kt`
- `AMPM/core/designsystem/.../components/{SubjectKeyboard,MathsKeyboard,EnglishKeyboard}.kt`
- `AMPM/core/backend/.../SpringApiClient.kt` (header), `…/sync/domain/DefaultContentSyncCoordinator.kt` (resync)
- `ampm-backend` `content/…/AppVersionResolver.kt`, `QuestionRepository.kt` / `LessonRepository.kt`
  (`findPublished`), `V81__create_exam_versions.sql`
- `ampm-contracts` `ExamVersionResponse`, `ApiHeaders`
