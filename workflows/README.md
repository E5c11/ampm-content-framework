# Workflows — ampm-content-framework

Overview of how work happens in this repo: markdown framework docs plus standalone tooling
scripts that define and enforce how AMPM content is authored, validated, and persisted.

**Ceremony:** this repo opts out of `ARCH-BE-*`/Jacoco-gated Final Gate ceremony, same
already-locked reasoning as `ampm-firestore-migration` (a docs-and-tooling repo doesn't need
production-service compliance gates). What replaces it: every workflow carries its own
Verification phase, and the standing correctness gates are (a) `tools/`' validator runs clean
against real dev Firestore data, and (b) every rule in `presentations/`/`core/` cites what
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

- **Node/TypeScript** — anything touching Firestore, Postgres, or content data (validator,
  upload scripts, vocabulary dumpers). These arrive from `AMPM/scripts/` with proven
  `firebase-admin` patterns; new tools match `ampm-firestore-migration`'s TypeScript-strict
  precedent. Never port the validator to another language — a "faithful rewrite" is exactly
  the drift mechanism this repo exists to kill.
- **Python** — doc-graph upkeep only (index generation, rule-graph validation, profile
  lookup), mirroring `esc-ai-framework/tools/` so those utilities stay adaptable/reusable.

If the boundary ever blurs, consolidate by porting the (small) Python side — never the
content-data side.

---

## Active

| Workflow | What | Status |
|---|---|---|
| `active/bootstrap-content-framework.md` | Stand up this repo: extract core docs, presentation package, subject profiles, move pipeline tooling, persistence enforcement handoffs, ecosystem registration | Phases 0–1 done (scaffold; core extraction); Phase 2 in progress |

## Archive

_Empty — completed workflows move to `archive/` with a status header, same convention as
sibling repos._
