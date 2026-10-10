# Upload — DBE English FAL (one lesson)

**Profile:** `subjects/dbe-english-fal.md` · **Shared rules:** `shared/language-subjects.md`
(`AMPM-CONTENT-LANG`), `shared/setwork.md` (`AMPM-CONTENT-SETWORK`, Paper 2) · **Skeleton:**
`core/upload-pipeline.md` (`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`,
`AMPM-CONTENT-DESIGN`, `AMPM-CONTENT-AI-EXP`, `core/keyboard-input.md`, `core/app-feature-versions.md`,
`presentations/{type}.md` per type used (mc, multi-select, fitb, ordering, match).

> Do NOT enter plan mode. Run once per lesson (one exam question, or one extract of a pair for Paper 2).
> Commit after Phase 4. Companion to `upload-english-hl.md`; the design rules are shared, so this doc holds
> only the FAL sequencing and deltas.
> **Dev only.** Every FAL exam derives 2.4.1 and the subject row is gated at 2.4.1 (`VER-10`); never push
> to prod until 2.4.1 is tagged, backend V83 is on prod, and the subject row exists there (`SETWORK-GATE-01`).

## Phase -1 — Preconditions (once per session)

1. Proxy running (`cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432`).
2. The `english_fal` `subjects` row exists on dev with `capabilities ⊇ {setwork}` and
   `min_app_version = 2.4.1`: `psql -c "SELECT id, capabilities, min_app_version FROM subjects WHERE id='english_fal'"`.
   If missing or wrong, **stop and hand it to the owner** (reference-data write).
3. Curriculum vocabulary dumped for the subject: `node tools/dump-curriculum-vocabulary.js --subject english_fal
   --out temp/curriculum-vocab-english-fal.json`. Empty on the first session — create units/topics/subtopics with
   `tools/create-curriculum-node.js --subject english_fal` (bare slugs; ids come out as
   `english_fal_<unit>__<topic>__<subtopic>`). Units and topics are seeded once from
   `tools/seeds/english-fal-curriculum.json` (`tools/seed-curriculum.js`). Skill ids are global, so prefix them
   `english_fal_` (`tools/create-skill.js --subject english_fal --id english_fal_<slug>`).

## Phase 0 (Paper 2 only) — texts

Rules: `SETWORK-TXT-01`–`04`, `SETWORK-SEC-01`.

```bash
node tools/create-english-text.js --list                      # registry — reuse before create
node tools/create-english-text.js --id eveline --name "Eveline" --author "James Joyce" --section short_stories
```

- A text HL already has is **reused**, never duplicated (`SETWORK-TXT-02`).
- Only titles printed in a supplied paper/memo may be added until the National Literature Catalogue is
  supplied (`SETWORK-TXT-03`) — put the source paper in the commit message.
- `--section`: `novel`, `play` (never `drama`), `poetry`, `short_stories`. The tool refuses `--env prod` for
  `short_stories`.
- Poems and short stories are their own rows; `text_key` is the story/poem id, never a section marker.

## Required inputs

Lesson name, exam question number (P2: question + part, e.g. 5.2), paper, year, order, `text_key` (P2),
paper + memo PDFs, text/extract labels and pages, question pages, memo pages, YouTube ID (usually null).
Source status per paper is in the profile.

## Phases (deltas on the pipeline skeleton)

1. **Analyse** — per paper:
   - **P1**: TEXT A–G labels; mark each sub-question text-extractable or visual-dependent (`LANG-EX-03`).
     Q1 ≤7, Q2 2–4, Q3 2–4, Q4 2–4, Q5 ≤7 (`LANG-CAP-01`).
   - **P2**: one lesson per extract (1.1/1.2, 2.1/2.2 … 5.1/5.2) and per poem (6.1/6.2). Identify the
     (a)–(d) matching item, device items, and the 3-mark substantiated opinion; the memo gives marks only for
     substantiation (never YES/NO).
   - **P3**: Q1 essay lesson; one lesson per Q2 and Q3 text type, named exactly as the paper (`LANG-WR-01`).
2. **Images** — `LANG-IMG-01`/`02` (shared pages), `SETWORK-IMG-01` (extract labels continuous across the paper:
   Nov 2025 = A/B Q1, C/D Q2, E/F Q3, G/H Q4, I/J Q5; poems `"Poem"`). Essay and P3 lessons:
   `supplementary_materials: null`.
3. **Lesson document** — `has_video: false` (`LANG-LES-01`); `text_key` on every P2 lesson, null on P1/P3.
4. **Questions** — `type` definition/application; presentations per profile; fresh content
   (`DESIGN-UNI-01`), exam-mirrored (`LANG-EX-01`/`02`); `context_text` per `LANG-CTX-01`; typed answers one
   short word/phrase (`LANG-KB-03`). **Every `fitb` declares `keyboard_type: "text"`** (`LANG-KB-01`).
   P2 questions carry the lesson's `text_key` (`SETWORK-LES-01` — the validator checks it).
5. **Vocab dump** — as Phase -1 step 3 (re-dump after creating nodes/skills).
6. **Upload script** — copy `tools/upload-script-template.js` to `add-english-fal-<year>-<paper>-q<N>.js`
   (`subject: "english_fal"`; P2: `q<N>-<part>`); `aiExplanation` one entry per **real exam
   sub-question** with its real marks (`AIEXP-08`; `LANG-ANS-02`). Validate with `--curriculum` (HARD STOP) →
   `--dry-run` → upsert to dev → **commit** (`[Data] Add english_fal <year> <paper> Q<N> lesson and questions`).
7. **Verify** — pipeline Phase 5 plus: name format, image contents (no TEXT body/`AND`/extract headings),
   `supplementary_materials` shape per lesson type, `text_key` agreement, `context_text` only where needed,
   True/False ≤20%.
8. **Gate** (once per exam, after its last script) — `node tools/derive-exam-min.js scripts/add-english-fal-<year>-<session>-*.js`
   should print **2.4.1**; `node tools/apply-exam-gate.js --env dev --subject english_fal --year <YYYY>
   --session november` (dry run, then `--apply`; `VER-09`).

## Notes

- English FAL answers are typed from short stimulus words; where more than one phrasing is valid use
  `multiple_choice` (`LANG-ANS-01`) — the keyboard has no shift and case is never significant.
- The oral (P4) is not authored.
