# tools/

Content-pipeline tooling, moved from `AMPM/scripts/` (bootstrap Phase 3, 2026-07-15).
Language boundary per `workflows/README.md`: Node for anything touching
Firestore/Postgres/content data; Python for doc-graph upkeep only.

| Tool | What | Language |
|---|---|---|
| `validate-questions.js` | Validates a `questions` array in an upload script (`--script`), optionally against a curriculum snapshot (`--curriculum`), and ai_explanation data (`--ai-exp`). Exit 0 = pass. The pipeline's HARD STOP (`PIPE-10`). | Node |
| `dump-curriculum-vocabulary.js` | Dumps unit/topic/subtopic/skills vocabulary from Cloud SQL (`curriculum_nodes`, `skills`) for the validator's `--curriculum` check (`PIPE-09`). Needs the Auth Proxy. | Node |
| `create-curriculum-node.js` | Creates one `curriculum_nodes` row (unit/topic/subtopic) — the "create it first" step of `PIPE-08`. | Node |
| `create-skill.js` | Creates one `skills` row — `PIPE-08`. | Node |
| `create-tag.js` | Creates one `tags` row (lesson `tags` FK to it — `PIPE-06`). | Node |
| `upload-exam-images.js` | Uploads extracted exam-page PNGs to Firebase Storage; prints ready-to-paste URL arrays (`PIPE-02`). | Node |
| `extract-exam-pages.py` | Extracts question/annexure/memo page images from exam PDFs; `--inspect` finds crop points. | Python |
| `upload-script-template.js` | Template for per-question-group upload scripts (pipeline Phase 4). Copy, fill, validate, run against dev. | Node |
| `pg-smoke.js` | Read-only check that the Postgres write layer reaches Cloud SQL through the Auth Proxy; prints the Flyway head. | Node |
| `lib/credentials.js` | Resolves Firebase service-account paths and the Cloud SQL `pgConfig(env)` from `.env` / env vars. | Node |
| `lib/postgres.js` | Lazy shared `pg.Pool` for the content-write tooling. | Node |
| `lib/upsert.js` | `upsertRow()` — re-runnable `INSERT … ON CONFLICT DO UPDATE`. | Node |
| `lib/uuid.js` | Deterministic authored-content UUIDs (namespace pinned; disjoint from Track A's). | Node |
| `lib/content-rows.js` | Maps the authored logical shape → Postgres rows (`lessons`/`questions`/…). | Node |
| `lib/curriculum.js` | `curriculum_nodes` ID conventions (flat for math_lit, namespaced for english_hl). | Node |

Changes from the AMPM originals (validator otherwise as-is — never port it, see
`workflows/README.md`):
- `validate-questions.js`: added `"[]"` no-space blank-token rejection and the steps
  exact-`"[ ]"` check (Inventory #5 resolution, 2026-07-15).
- `dump-curriculum-vocabulary.js` / `upload-exam-images.js`: service-account paths now
  resolve via `lib/credentials.js` instead of a hardcoded `../.firebase/` relative path.

## Setup

```bash
npm install                     # pg + uuid (Postgres writes) + firebase-admin (Firestore reads)
cp .env.example .env            # fill the Firebase SA paths and the PG_PASSWORD_DEV value
```

`.env` (untracked) holds:
- absolute paths to the Firebase service-account files (stay in `AMPM/.firebase/`) — still
  used by `dump-curriculum-vocabulary.js` until Phase 4 of
  `workflows/active/repoint-authoring-to-postgres.md`;
- the Cloud SQL connection (`PG_*_DEV`). Password:
  `gcloud secrets versions access latest --secret=AMPM_DB_PASSWORD --project=ampm-b9661`.

**Any tool that writes Postgres needs the Cloud SQL Auth Proxy running first:**

```bash
cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432
node tools/pg-smoke.js          # confirms it's reachable
```

Never connect to Cloud SQL directly — always through the proxy (`PG_HOST_DEV=127.0.0.1`,
`PG_PORT_DEV` = the proxy's `--port`).

Python: `extract-exam-pages.py` needs `PyMuPDF` (`pip install pymupdf`), same as when it
lived in AMPM.

## Not moved (stays in AMPM)

- Historical `add-*.js` upload scripts — provenance record of uploaded content (owner
  decision 2; retirement note in AMPM's `content-framework-support.md`).
- Paper-review harness (`fetch-paper-data.js`, `review-capture.sh`,
  `patch-question.js`, `check-video.js`) — drives the app/emulator;
  `workflows/generate/review-paper.md` runs from the AMPM repo root.
- `check-p2-videos.js` / `update-english-texts.js` — app-collection maintenance
  (`english_texts`), invoked from the English upload workflow's Phase 0.
