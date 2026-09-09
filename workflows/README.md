# Workflows — ampm-content-framework

Overview of how work happens in this repo: markdown framework docs plus standalone tooling
scripts that define and enforce how AMPM content is authored, validated, and persisted.

**Ceremony:** this repo opts out of `ARCH-BE-*`/Jacoco-gated Final Gate ceremony, same
already-locked reasoning as `ampm-firestore-migration` (a docs-and-tooling repo doesn't need
production-service compliance gates). What replaces it: every workflow carries its own
Verification phase, and the standing correctness gates are (a) `tools/`' validator runs clean
and the schema-diff report stays GO against the live dev Cloud SQL, and (b) every rule in
`presentations/`/`core/` cites what
enforces it (validator / DB constraint / renderer / human review) so unenforced rules are
visible rather than assumed.

**Commit convention:** commit after each phase of a workflow doc, message referencing the
phase. Same as sibling repos.

---

## Cross-repo orchestration model (decided 2026-07-15)

Work that spans repos is **orchestrated from here, executed locally in each repo**: the
orchestrating workflow lives in this repo; any change a sibling repo owns (AMPM, ampm-backend,
ampm-contracts, ampm-knowledge-base) gets its own thin, self-contained workflow doc *in that
repo*, cross-referencing this one. Never edit a sibling repo directly from a workflow here
without that repo having its own doc trail. Precedent: Track A
(`ampm-firestore-migration/workflows/active/track-a-content-import.md`) spawning
`AMPM/workflows/archive/backfill-math-lit-curriculum.md` and `ampm-backend`'s `V62`/`V63`
fixes rather than reaching into those repos itself.

## Language boundary for `tools/` (decided 2026-07-15)

Two tool families, two languages, **no tool ever spans both**:

- **Node** — anything touching Postgres, GCS, or content data (validator, upload scripts,
  vocabulary dump, `create-*` tools, image upload). The shared helpers live in `tools/lib/`.
  Never port the validator to another language — a "faithful rewrite" is exactly the drift
  mechanism this repo exists to kill.
- **Python** — doc-graph upkeep only (index generation, rule-graph validation, profile
  lookup), mirroring `esc-ai-framework/tools/` so those utilities stay adaptable/reusable.

If the boundary ever blurs, consolidate by porting the (small) Python side — never the
content-data side.

---

## Active

_Empty — new work gets its own workflow doc._

## Archive

| Workflow | What | Status |
|---|---|---|
| `archive/repoint-authoring-to-postgres.md` | Moved the authoring pipeline off Firestore to write directly into `ampm-backend`'s Cloud SQL Postgres: `pg` write layer + deterministic UUIDs, content-row / sub-question builders, curriculum/skills tooling on Postgres, images to `media-dev.askmoreprepmore.app`, validator repoint, `firebase-admin` dropped, all `core/`/`subjects/`/`workflows/generate/` docs rewritten. | **Complete, 2026-09-03.** All 8 phases verified against live dev Cloud SQL (incl. a full e2e unit). Of the doc's Phase 8 residuals: Maths curriculum nodes now populated (131 rows, checked 2026-09-10), `english_texts` scripts done (`tools/create-english-text.js`), `review-paper.md` repointed and verified live (see its own Status header) — only Track A prod reconciliation remains genuinely open, and it's owner-gated by design, not a follow-up to schedule. On-device spot-check since completed (maths + geography + physics papers, through 2026-09-10). |
| `archive/bootstrap-content-framework.md` | Stood up this repo: core docs, presentation package (with renderer contracts), subject profiles, pipeline tooling, persistence enforcement chain, ecosystem registration | **Complete, 2026-07-15.** Along the way caught and fixed a real environment split (the deployed dev backend had never received any of the day's work — see doc's Status header) and closed the loop with a direct on-device confirmation of the fix. |
