# AMPM Content Framework — Instructions

## What This Is

The canonical source for how AMPM practice content — videos/lessons and their
test-your-understanding questions — is authored, validated, uploaded, and persisted.
Extracted from AMPM (`ampm-ai-framework/content/`, `workflows/generate/`, `scripts/`)
starting 2026-07-15; see `workflows/active/bootstrap-content-framework.md` for the
extraction record.

This repo is itself a framework (for content authoring, not engineering). It mirrors
`esc-ai-framework`'s consumption pattern — profile → layers, rules by ID — rather than
consuming a deep slice of it. New subject×syllabus combinations add a profile in
`subjects/`, not another copy of the rules.

**This is the canonical entry point.** AMPM's old framework docs are pointer stubs to
this repo; if you arrived via one of them, you are in the right place.

---

## How to Use This Framework

### Step 0 — Tell Claude what you're authoring

At the start of a session, say:

1. **Which subject and syllabus** — e.g. "DBE Math Lit", "DBE English HL Paper 2". This
   picks the profile in Step 1.
2. **Where the source files are** — drop the exam paper PDF, the memo PDF, any
   addendum/annexure/information-sheet PDFs, and (Math Lit) `youtube_video_data.csv` into
   `files/` at the repo root, then tell Claude their filenames. **For a content-based
   subject** (Geography and any subject of the same shape — see `DESIGN-UNI-08`/`09` in
   `core/authoring-principles.md`), also drop the official curriculum/syllabus document
   (e.g. CAPS) — required before authoring, not optional; the subject profile's Identity
   table records its path once sourced. `files/` is tracked — commit source material there
   like anything else in the repo. (`temp/` is different: this framework's own generated
   working files — extracted images, vocabulary dumps, upload scripts — live there,
   gitignored, not source material.)
3. **Which question(s)** — the paper question number(s) you're authoring this session
   (one video/lesson group at a time; see the subject's generate workflow).

### Step 1 — Read the subject profile

Every authoring session targets one subject×syllabus combination. Read its profile:
`subjects/{syllabus}-{subject}.md` (e.g. `subjects/dbe-math-lit.md`). The profile
declares the allowed presentation types, question types, curriculum source collections,
paper structure, and every genuinely subject-specific rule.

### Step 2 — Load the relevant layers

| # | Layer | Load when |
|---|-------|-----------|
| 1 | `core/` | Always |
| 2 | `presentations/{type}.md` | For each presentation type the session authors (profile declares which are allowed) |
| 3 | `subjects/{profile}.md` | The subject being authored (from Step 1) |

### Step 3 — Follow the generation workflow

`workflows/generate/` holds the thin orchestrators (upload per subject, paper review).
Each declares its phase sequence and which framework docs it requires.

### Step 4 — Apply rules by ID

Every rule in this framework carries an ID and an `enforced_by:` role, so unenforced
rules are visible rather than assumed:

| Role | Meaning |
|------|---------|
| `validator` | `tools/validate-questions.js` fails the set mechanically before upload |
| `db-constraint` | The Postgres schema (owned by `ampm-backend` migrations) rejects the write |
| `renderer` | App code consumes the field directly; violating the rule breaks rendering, usually silently. Each `presentations/` doc cites the exact code |
| `human-review` | No mechanical check exists — the authoring session and reviewer must verify it |

A rule may list several roles; the first is the primary enforcement point.

Rule IDs follow `{DOC}-{CATEGORY}-{NN}` (e.g. `SCHEMA-ARR-01`, `DESIGN-UNI-03`).
The namespace is owned by this repo. `AMPM-CONTENT-*` document IDs predate the
extraction and are preserved (AMPM keeps stubs under the same IDs).

---

## Precedence on conflicts

When sources disagree during authoring or extraction:

**renderer code > validator > real data (audited) > framework doc > workflow prose**

Record each resolution inline in the winning doc with a one-line
"resolved against X, YYYY-MM-DD" note.

---

## Layout

| Path | What | Status |
|------|------|--------|
| `core/` | Always-loaded rules: question schema, authoring principles, MathText markup, AI explanations, upload pipeline skeleton, persistence contract | live |
| `presentations/` | One doc per presentation type: metadata/answer contracts, renderer contract (cites app code), validator coverage, worked examples | live |
| `subjects/` | Subject×syllabus profiles — the subject-specific residue only | live |
| `workflows/generate/` | Thin upload/review orchestrators (`review-paper.md` runs from the AMPM repo root) | live |
| `tools/` | `validate-questions.js`, vocabulary dumper, image uploader/extractor, upload-script template — see `tools/README.md` for setup (`.env`) | live |
| `context/project-profile.yaml` | esc-ai-framework consumption profile — governs engineering work *on* this repo, not content authoring | live |
| `index.md` | Doc-graph index (IDs, relations, rule-ID prefixes) | live |

---

## Document IDs

| ID | Doc | Provenance |
|----|-----|------------|
| `AMPM-CONTENT-SCHEMA` | `core/question-schema.md` | moved from `AMPM/ampm-ai-framework/content/schema.md` |
| `AMPM-CONTENT-DESIGN` | `core/authoring-principles.md` | moved from `.../content/design.md` |
| `AMPM-CONTENT-MATHTEXT` | `core/mathtext.md` | moved from `.../content/mathtext.md` |
| `AMPM-CONTENT-AI-EXP` | `core/ai-explanation.md` | moved from `.../content/ai-exp.md` |
| `AMPM-CONTENT-PIPELINE` | `core/upload-pipeline.md` | new — shared skeleton of AMPM's three upload workflow docs |

AMPM keeps pointer stubs at the old paths under the same IDs, so pre-extraction
references resolve.
