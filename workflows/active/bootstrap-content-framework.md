# Bootstrap — Content Framework Extraction

**Status:** Phase 0 (scaffold) done, 2026-07-15. **Phases 1+ blocked on owner review of this
doc** — do not start Phase 1 until Emmanuel has approved the plan and the Open Decisions
below are resolved.

**Goal:** consolidate AMPM's content-authoring knowledge — currently spread across
`AMPM/ampm-ai-framework/content/` (4 framework docs), `AMPM/workflows/generate/` (4 workflow
docs, ~1,970 lines), `AMPM/scripts/validate-questions.js`, and implicit renderer behavior in
the app — into this repo as a profile-and-layers framework (modeled on `esc-ai-framework`),
so that new subject×syllabus combinations add a profile instead of a fourth copy of
everything.

**Context (written for a fresh session):** the driving audit happened 2026-07-15 in a
Claude Code session spanning `ampm-backend`/`AMPM`/`ampm-firestore-migration`. Key findings
are recorded inline below (Contradiction Inventory) — this doc is self-contained; the session
transcript is not required.

**Workflow:** Do NOT enter plan mode. Use this doc to drive implementation directly. Commit
after each phase. Cross-repo model per `workflows/README.md`: sibling-repo changes get their
own thin workflow doc in that repo, never direct edits from here.

---

## Source material (read, don't guess)

| What | Where |
|---|---|
| Canonical schema/design/mathtext/ai-exp docs | `AMPM/ampm-ai-framework/content/{schema,design,mathtext,ai-exp}.md` |
| Per-subject upload workflows | `AMPM/workflows/generate/upload-{math-lit,maths,english}.md` |
| Paper review workflow (already subject-agnostic) | `AMPM/workflows/generate/review-paper.md` |
| Executable validation rules | `AMPM/scripts/validate-questions.js` |
| Renderer truth — blank-token grammar | `AMPM/feature/watch/.../questions/ui/composables/FillInTheBlank.kt` (`expandMetadata`, `isBlankSlot`) |
| Renderer truth — input counts per type | `AMPM/feature/watch/.../questions/ui/SubjectKeyboardType.kt` (`inputCount()`) |
| Renderer truth — per-type branching | `AMPM/feature/watch/.../questions/ui/composables/PresentationComponent.kt` |
| Firestore field shapes | `AMPM/wiki/database/firestore/database_architecture.md` |
| Postgres target schema | `ampm-backend/content/src/main/kotlin/.../question/QuestionEntity.kt`, migrations `V26`, `V51`, `V60` |
| Consumption-pattern model | `esc-ai-framework/INSTRUCTIONS.md` (profile → layers, rules by ID, `enforced_by` roles) |

**Precedence rule for every conflict found during extraction:** renderer code > validator >
real data (audited 2026-07-15, see below) > framework doc > workflow-doc prose. Record each
resolution in the extracted doc with a one-line "resolved against X" note.

---

## Contradiction Inventory (verified 2026-07-15 — resolve all during Phases 1–2)

1. **`ampm-ai-framework/content/schema.md` "Array sizing rules" bullet** says `fitb`,
   `fraction`, `multiple_choice`, `multi_select`, `equation` are "always exactly 5 elements"
   without scoping to `answer` — but its own Type contracts table says fitb `metadata` is a
   variable-length token list and fraction/equation `metadata` is `[]`. The validator
   (`FIXED_ANSWER_TYPES` vs `FIXED_METADATA_TYPES`) confirms the bullet is true of `answer`
   only. Fix: scope the bullet to `answer`.
2. **`upload-math-lit.md:211`** template comment: `metadata: [] ... [] for fitb/fraction` —
   wrong for fitb (validator requires non-empty with isolated `"[ ]"` tokens; renderer derives
   input count from those tokens). Correct for fraction only.
3. **`upload-math-lit.md:401` and `upload-english.md:657`** Phase 5 checklists: "fitb …
   `answer` and `metadata` arrays each have exactly 5 elements" — wrong for fitb `metadata`
   (variable-length). `upload-math-lit.md:401` also lists fraction, whose `metadata` must be
   `[]`, not 5 elements.
4. **`AMPM/workflows/bugs-tracking.md`** FITB entry (2026-07-14/15) pairs "FITB/FRACTION" as
   the metadata-driven silent dead end. Wrong half: `inputCount()` gives FRACTION 2 fixed
   inputs regardless of metadata (and the validator *requires* empty metadata for fraction).
   The actual metadata-driven pair is **FITB and STEPS** (both count blank tokens). Correct
   the entry in AMPM when Phase 2's renderer contracts land.
5. **Renderer-internal quirk to verify in Phase 2, found but not yet confirmed as a bug:**
   `FillInTheBlank.isBlankSlot()` accepts both `"[ ]"` and `"[]"` (trimmed), but
   `inputCount()` counts only trimmed `"[ ]"` for FITB and *untrimmed exact* `"[ ]"` for
   STEPS. Metadata using `"[]"` (no space) would render blanks but disagree with the keyboard
   input count. Check real data + decide whether the contract is "`"[ ]"` only" (and validator
   should reject `"[]"`) or the renderer should be aligned.
6. **Real-data lint (dev Firestore, audited 2026-07-15, 906 question docs):** clean except 2
   `math_questions` fraction docs with non-empty metadata (`FEfVGwyPuQTbRLUMdjTZ`,
   `l8BmWHcdQ9Y71Vn794Cb`) — harmless at render (FRACTION ignores metadata), but validator
   violations. Fix the 2 docs (dev, and prod equivalents if present) or record as accepted.

---

## Phase 0 — Scaffold ✅ (2026-07-15)

`.gitignore`, `README.md`, `context/project-profile.yaml`, `workflows/README.md` (carries the
cross-repo orchestration + tool-language decisions), this doc.

---

## Phase 1 — Core extraction

Create `INSTRUCTIONS.md` (consumption model: read profile → load `core/` + the presentation
docs the profile allows + the subject doc; rules carry IDs and an `enforced_by:` line —
`validator` / `db-constraint` / `renderer` / `human-review`).

Move into `core/` (move-and-improve, not rewrite):
- `core/question-schema.md` ← `ampm-ai-framework/content/schema.md` — resolve Inventory #1.
  Presentation-type *contracts table* moves out to `presentations/` in Phase 2; this doc keeps
  the document-level field table, ID vocabularies, difficulty/exam-weight calibration.
- `core/authoring-principles.md` ← `content/design.md` (freshness rule, no-transcription,
  naming, single-flat-string, etc.)
- `core/mathtext.md` ← `content/mathtext.md`; `core/ai-explanation.md` ← `content/ai-exp.md`
- `core/upload-pipeline.md` ← the shared skeleton of the three upload docs' Phases 1.5 / 3.5 /
  4 / 5 (image extraction, vocabulary dump, upload script pattern, verify checklist) — these
  are 90%+ identical (Phase 4 scripts: 76/76/79 lines, math-lit vs maths differ by 6 lines).
  Subject-specific deltas stay out; they land in `subjects/` in Phase 3.

In AMPM (thin workflow doc there, per the orchestration model): replace each
`ampm-ai-framework/content/*.md` with a pointer stub (ID preserved, "moved to
ampm-content-framework, see …") so existing `AMPM-CONTENT-*` references don't dangle.

**Validation:** every rule in the moved docs has an ID + `enforced_by:` line; no `AMPM-*`
reference in AMPM resolves to deleted content (grep).

---

## Phase 2 — Presentation package

One doc per type under `presentations/`: `fitb.md`, `fraction.md`, `multiple-choice.md`,
`multi-select.md`, `ordering.md`, `match.md`, `equation.md`, `steps.md`.

Each carries, in this order:
1. **Metadata contract** and **answer contract** (from schema.md's table + validator).
2. **Renderer contract** — cites the actual app code that consumes the field
   (`inputCount()` value, blank-token grammar, the branching composable) and states the
   failure mode when the contract is violated (e.g. fitb: zero inputs, no error). This is the
   section that keeps the doc falsifiable — verify against code at extraction time, resolve
   Inventory #4/#5 here, and correct `AMPM/workflows/bugs-tracking.md`'s entry.
3. **Validator coverage** — which rules `tools/validate-questions.js` enforces, which are
   human-review only.
4. Worked examples + known pitfalls (time values, fraction-via-slash ban, correct-option
   placement, etc. — pulled from schema.md's scattered notes).

**Validation:** each renderer-contract section quotes/cites current code; Inventory #4, #5,
#6 resolved and recorded.

---

## Phase 3 — Subject profiles + thin generation workflows

- `subjects/dbe-math-lit.md`, `subjects/dbe-maths.md`, `subjects/dbe-english-hl.md` — only
  the genuinely subject-specific residue: allowed presentation types, question types,
  curriculum source collection, paper structure/sections, image-extraction quirks (English's
  annexure/extract handling), MathText applicability, difficulty calibration nuances,
  completed-papers ledger. Plain markdown docs — no YAML machinery until a 4th+ combination
  (IEB, new subjects) proves what's worth parameterizing.
- Move `workflows/generate/` here: the three upload docs shrink to thin orchestrators
  (profile pointer + phase sequence + deltas), `review-paper.md` moves near-verbatim.
- Move tooling into `tools/`: `validate-questions.js` (as-is, JS), the vocabulary dumpers,
  the upload-script template, image-extraction helpers. Update path references.
- AMPM keeps pointer stubs at the old `workflows/generate/` paths; its `scripts/` retains
  everything not content-authoring-related (the historical `add-*.js` scripts stay in AMPM as
  the already-uploaded-content record — decide in review if they should move too).

**Validation:** `node tools/validate-questions.js` runs clean from this repo against dev
Firestore; a dry upload-workflow read-through against one already-uploaded paper confirms
nothing needed got lost from the thin docs.

---

## Phase 4 — Persistence contract + enforcement handoffs

- `core/persistence.md`: collection↔table mapping (defer detail to
  `ampm-backend/wiki/database/migration-map.md`, don't duplicate), junction-table shapes,
  publish-flag semantics, **nullability rules per field with the enforcement location for
  each**. Key rule: `metadata` is non-null always (empty array is the legitimate "none"
  state — fraction/equation), so blank-driven types can never silently lose their contract.
- Handoff workflows (thin docs in each repo):
  - **ampm-backend:** delete the dev seed `questions` row with `metadata: null` (the only
    known violating row — Track A's import upserts by Firestore doc ID and never overwrites
    it); migration `ALTER TABLE questions ALTER COLUMN metadata SET NOT NULL` (+ entity
    change). Fits the owner's pre-prod "more changes before Phase 8" window.
  - **ampm-contracts:** `QuestionResponse.metadata` → non-nullable `List<String>` (breaking,
    next version bump).
  - **AMPM:** after the contracts bump, `SpringQuestionMapper`'s `metadata ?: emptyList()`
    is dead code — remove it; the silent-masking bug class dies at the schema layer with zero
    app-side guard logic. (The separate Institutions Empty-state bug stays an ordinary small
    AMPM fix, unrelated to this repo.)
  - **ampm-firestore-migration:** confirm `src/import/questions.ts` writes `[]` (not null)
    for empty metadata, so re-runs stay compatible with the NOT NULL column.

**Validation:** backend build green with NOT NULL; a Track A re-run against dev succeeds
post-constraint.

---

## Phase 5 — Ecosystem registration

- `ampm-knowledge-base` (thin workflow there): add this repo to
  `ecosystem/system-map.md`'s registry; update the README ownership table — content-authoring
  rules move from "that repo's own framework package" to this repo (cross-repo by nature:
  consumed by AMPM, ampm-backend, ampm-firestore-migration, the future content dashboard, and
  generation sessions).
- `AMPM/workflows/README.md`: pointer to this repo for generation work.
- `esc-ai-framework`: nothing moves there (content authoring is AMPM-domain, not generic
  engineering); optionally add this repo to `tools/profiles/` if its Python tooling gets
  reused here (Phase 3 decision).

**Validation:** a fresh session pointed only at `ampm-knowledge-base` can discover this repo
and its role.

---

## Phase 6 — Verification gate (completion gate for this workflow)

- Validator clean against dev Firestore from this repo.
- Contradiction Inventory: all 6 items resolved-and-recorded (or explicitly accepted).
- Grep AMPM for references to moved docs/scripts — all resolve to stubs or new paths.
- One end-to-end dry run: author (don't upload) one question per presentation type for one
  subject following only this repo's docs — confirms the thin-workflow + profile + package
  chain is actually sufficient without the old monolith docs.
- Doc-graph index generated (`index.md`, Python tool or by hand at this scale).

---

## Open Decisions (owner) — resolve before Phase 1

1. **Do the generate workflows move fully here, or stay in AMPM as stubs?** Recommendation:
   move fully (they don't touch app code; AMPM keeps stubs). Affects Phase 3.
2. **Do AMPM's historical `add-*.js` upload scripts move?** Recommendation: no — they're a
   record of already-uploaded content, not reusable tooling. Affects Phase 3.
3. **App-side mapper guard:** after Phase 4's NOT NULL + contracts bump, is any app-side
   null-metadata guard still wanted? Recommendation: no — the schema layer owns it.
4. **The 2 fraction docs with non-empty metadata (Inventory #6):** fix the data or accept
   with a note?
