# ampm-content-framework

Content authoring framework for AMPM — question/lesson schema contracts, presentation-type
specs, subject–syllabus profiles, generation workflows, and validation tooling.

**Rules and pipeline, not the data.** The content itself lives in the `ampm-backend` Cloud
SQL Postgres — the authoring pipeline here writes it there directly (Firestore is a frozen
historical store the app still dual-reads during the transition; nothing new is written to
it). This repo owns *how* content is authored, validated, and persisted — the single source
of truth that the AMPM app, `ampm-backend`, the future content dashboard, and every
generation session all consume.

## Why this repo exists

Confirmed by audit, 2026-07-15: content-authoring rules previously lived in four places with
no designated winner when they disagreed — `AMPM/ampm-ai-framework/content/` (framework docs),
`AMPM/workflows/generate/*.md` (per-subject upload workflows that *restated* the framework
docs inline), `AMPM/scripts/validate-questions.js` (executable rules), and the app's own
renderer code. The restatements drifted: the audit found direct contradictions between an
upload doc's template comment, its own verification checklist, the canonical schema doc, and
what the renderer actually does. Every new subject×syllabus combination multiplied the copies.
This repo consolidates all of it behind one structure, modeled on `esc-ai-framework`'s
profile-and-layers consumption pattern.

## Structure

```
INSTRUCTIONS.md    — how to consume this framework (profile → layers), mirrors esc-ai-framework
core/              — subject-agnostic invariants: question schema, authoring principles,
                     persistence contract (Cloud SQL Postgres), shared pipeline phases
presentations/     — one doc per presentation type (fitb, fraction, multiple_choice,
                     multi_select, ordering, match, equation, steps), each carrying its
                     renderer contract verified against the app code that consumes it
subjects/          — one profile per subject–syllabus combination (dbe-math-lit,
                     dbe-maths, dbe-english-hl, …) — only what is genuinely specific
workflows/         — how work happens in this repo, incl. the generation workflows
tools/             — executable tooling; see the language boundary in workflows/README.md
context/           — project profile fed to esc-ai-framework
files/             — source material dropped in for a session (exam paper/memo/addendum
                     PDFs, lookup CSVs) — tracked, commit it
temp/              — this framework's own generated working files (extracted images,
                     vocabulary dumps, upload scripts, reports) — gitignored
```

## Boundaries

- **Engineering rules** (architecture, testing, naming) — `esc-ai-framework` and each code
  repo's own framework package. Never duplicated here.
- **Product/business rationale** — `ampm-knowledge-base`. This repo says *how* content is
  built, never *why* the product wants it.
- **App rendering behavior** — owned by the AMPM app code; `presentations/` docs *cite* it as
  the contract they must match, they don't redefine it.

## Status

Bootstrap complete (`workflows/archive/bootstrap-content-framework.md`). Authoring writes
directly to the `ampm-backend` Cloud SQL Postgres — see
`workflows/archive/repoint-authoring-to-postgres.md` for that cutover and
`tools/README.md` for the Auth Proxy prerequisite.
