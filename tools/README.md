# tools/

Content-pipeline tooling. Language boundary per `workflows/README.md`: Node for anything
touching Postgres / GCS / content data; Python for doc-graph upkeep only.

| Tool | What | Language |
|---|---|---|
| `validate-questions.js` | Validates a `questions` array in an upload script (`--script`), optionally against a curriculum snapshot (`--curriculum`), and ai_explanation data (`--ai-exp`). Exit 0 = pass. The pipeline's HARD STOP (`PIPE-10`). | Node |
| `dump-curriculum-vocabulary.js` | Dumps unit/topic/subtopic/skills vocabulary from Cloud SQL (`curriculum_nodes`, `skills`) for the validator's `--curriculum` check (`PIPE-09`). Needs the Auth Proxy. | Node |
| `create-curriculum-node.js` | Creates one `curriculum_nodes` row (unit/topic/subtopic) — the "create it first" step of `PIPE-08`. | Node |
| `create-skill.js` | Creates one `skills` row — `PIPE-08`. | Node |
| `create-tag.js` | Creates one `tags` row (lesson `tags` FK to it — `PIPE-06`). | Node |
| `upload-exam-images.js` | Uploads extracted exam-page PNGs to the media bucket (`media-dev.askmoreprepmore.app`, ADC auth); prints ready-to-paste URL arrays (`PIPE-02`). | Node |
| `extract-exam-pages.py` | Extracts question/annexure/memo page images from exam PDFs; `--inspect` finds crop points. | Python |
| `upload-script-template.js` | Template for per-question-group upload scripts (pipeline Phase 4). Copy, fill, validate, run against dev. | Node |
| `pg-smoke.js` | Read-only check that the Postgres write layer reaches Cloud SQL through the Auth Proxy; prints the Flyway head. | Node |
| `lib/credentials.js` | Resolves the Cloud SQL `pgConfig(env)` from `.env` / env vars. | Node |
| `lib/postgres.js` | Lazy shared `pg.Pool` for the content-write tooling. | Node |
| `lib/upsert.js` | `upsertRow()` — re-runnable `INSERT … ON CONFLICT DO UPDATE`. | Node |
| `lib/uuid.js` | Deterministic authored-content UUIDs (namespace pinned; disjoint from Track A's). | Node |
| `lib/content-rows.js` | Maps the authored logical shape → Postgres rows (`lessons`/`questions`/…). | Node |
| `lib/curriculum.js` | `curriculum_nodes` ID conventions (flat for math_lit, namespaced for english_hl). | Node |

The validator's own rules are never ported/reworded (see `workflows/README.md`) — it added
`"[]"` no-space blank-token rejection + the `steps` exact-`"[ ]"` check (Inventory #5,
2026-07-15) and a "still on firebase-admin" guard (repoint Phase 6, 2026-09-03).

## Setup

```bash
npm install                     # pg, uuid, @google-cloud/storage
cp .env.example .env            # fill PG_PASSWORD_DEV
```

`.env` (untracked) holds the Cloud SQL connection (`PG_*_DEV`). Password:
`gcloud secrets versions access latest --secret=AMPM_DB_PASSWORD --project=ampm-b9661`.
Image upload authenticates with ADC (`gcloud auth application-default login`).

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
