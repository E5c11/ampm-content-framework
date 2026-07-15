# tools/

Content-pipeline tooling, moved from `AMPM/scripts/` (bootstrap Phase 3, 2026-07-15).
Language boundary per `workflows/README.md`: Node for anything touching
Firestore/Postgres/content data; Python for doc-graph upkeep only.

| Tool | What | Language |
|---|---|---|
| `validate-questions.js` | Validates a `questions` array in an upload script (`--script`), optionally against a curriculum snapshot (`--curriculum`), and ai_explanation data (`--ai-exp`). Exit 0 = pass. The pipeline's HARD STOP (`PIPE-10`). | Node |
| `dump-curriculum-vocabulary.js` | Dumps unit/topic/subtopic/skills vocabulary from dev/prod Firestore for the validator's `--curriculum` check (`PIPE-09`). | Node |
| `upload-exam-images.js` | Uploads extracted exam-page PNGs to Firebase Storage; prints ready-to-paste URL arrays (`PIPE-02`). | Node |
| `extract-exam-pages.py` | Extracts question/annexure/memo page images from exam PDFs; `--inspect` finds crop points. | Python |
| `upload-script-template.js` | Template for per-question-group upload scripts (pipeline Phase 4). Copy, fill, validate, run against dev. | Node |
| `lib/credentials.js` | Resolves service-account paths from `.env` / env vars. | Node |

Changes from the AMPM originals (validator otherwise as-is — never port it, see
`workflows/README.md`):
- `validate-questions.js`: added `"[]"` no-space blank-token rejection and the steps
  exact-`"[ ]"` check (Inventory #5 resolution, 2026-07-15).
- `dump-curriculum-vocabulary.js` / `upload-exam-images.js`: service-account paths now
  resolve via `lib/credentials.js` instead of a hardcoded `../.firebase/` relative path.

## Setup

```bash
npm install                     # firebase-admin for the two Firestore/Storage tools
cp .env.example .env            # then point the two vars at AMPM/.firebase/*.json
```

`.env` (untracked) holds absolute paths to the service-account files, which stay in
`AMPM/.firebase/`:

```
AMPM_FIREBASE_SA_DEV=/home/<user>/StudioProjects/AMPM/.firebase/<dev-sa>.json
AMPM_FIREBASE_SA_PROD=/home/<user>/StudioProjects/AMPM/.firebase/<prod-sa>.json
```

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
