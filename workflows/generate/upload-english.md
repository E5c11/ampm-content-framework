# Upload — DBE English HL (one lesson)

**Profile:** `subjects/dbe-english-hl.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used (English subset only —
profile).

> Do NOT enter plan mode. Run once per lesson (one exam question). Commit after Phase 4.
> Moved from `AMPM/workflows/generate/upload-english.md` (stub remains there).
> A lesson maps to one exam question; exam images are shown to the student, practice
> questions are fresh but exam-mirrored (`DESIGN-ENG-01`/`02`, `DESIGN-UNI-01`).

## Phase 0 (Paper 2 only) — `english_texts` maintenance

Required when uploading nov_p2 lessons for a new year; skip for P1/P3.

> **Not yet repointed.** `check-p2-videos.js` / `update-english-texts.js` still live in the
> AMPM repo and target Firestore `english_texts`. `english_texts` now lives in Postgres
> too, and the app reads it from there. Until these are ported: a `text_key` a question
> references must already be a row in the Postgres `english_texts` table, or the upload
> script's FK preflight rejects it. Check with
> `psql -c "SELECT id FROM english_texts ORDER BY id"`; a genuinely new prescribed text
> needs an `english_texts` row added (owner-gated, like other reference data). Tracked in
> `workflows/archive/repoint-authoring-to-postgres.md` (Out of scope).

Rules: `text_key` is per-text, never per-year; **for poetry lessons set `text_key` to the
actual poem's `english_texts` id** (e.g. `felix_randal`) — the old `"poetry"` marker is not
a real row and the FK preflight rejects it; retired texts get `is_active = false`, never
deleted.

## Required inputs

Lesson name (`"Question N: Description"`), exam question number, paper, year, order,
Paper 2 `text_key`, paper + memo PDFs, text label(s) + page(s) per label, question
page(s), memo page(s), YouTube ID (usually null).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): identify each TEXT and its exam label, its theme,
   each sub-question's type, and which sub-questions are text-extractable vs
   visual-dependent (skip visual-dependent). Confirm question count against the
   profile's section caps.
2. **Images** (pipeline Phase 1.5): question pages and each TEXT/extract extracted +
   uploaded **separately**, labels exactly as the exam names them (`PIPE-03`; profile).
   Shared-page crop rules (complete TEXTs, citation boundaries, `AND` divider excluded
   from both parts, distinct annexure filenames) are in this doc's Appendix.
3. **Lesson document** (pipeline Phase 2): English template — usually
   `has_video: false`; `text_key` set for P2; one `supplementary_materials` annexure
   entry per TEXT (or `"Poem"`; null for essays/P3).
4. **Questions** (pipeline Phase 3): counts + section rules per profile; each question
   self-contained with own `context_text` where the section requires; `type` is
   `definition`/`application`; presentation subset per profile; questions must not
   reference "the passage" or line numbers.
5. **Vocab dump** (pipeline Phase 3.5): `--subject english_hl`. English HL skills are real
   `skills` rows now (reuse against those; create with `tools/create-skill.js --subject
   english_hl` when nothing fits).
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to
   `add-<year>-<paper>-q<N>.js`; `subject: "english_hl"`; `aiExplanation` one entry **per
   practice question**, `marks: null`, solutions explain why distractors are wrong.
   Validate with `--curriculum` (HARD STOP) → `--dry-run` → upsert to dev → **commit**
   (`[Data] Add english_hl <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5): plus the English items — name format, question images
   contain no TEXT body/`AND`/extract headings, correct `supplementary_materials` shape
   per lesson type, `text_key` consistency lesson↔questions, `context_text` populated
   only where needed, True/False ≤20%.

---

## Appendix — extraction and lesson-structure detail (near-verbatim from AMPM)

### Paper 2 lesson slots (20/year) and Part 1/Part 2 splits

Each contextual question (Q7, Q9, Q11, Q13, Q15) produces two lessons — one per
extract — so each lesson has exactly one extract tab. Essay questions (Q1, Q6, Q8, Q10,
Q12, Q14) have `supplementary_materials: null`. Extract letter sequence is continuous
across the paper (2021: A/B=Q7 Dorian Gray, C/D=Q9 Life of Pi, E/F=Q11 Hamlet,
G/H=Q13 Othello, I/J=Q15 The Crucible) — verify against the actual paper.

Crop rules:
- Part 1 question image: starts below the first extract's closing citation
  (e.g. `[Act 1, Scene 3]`), ends above the `AND` line (the `AND` belongs to neither).
- Part 2 question image: starts below the second extract's closing citation.
- Extract images: include heading and closing citation; exclude the sub-questions.
- Poetry: poem as `"Poem"` annexure; questions cropped from where they begin
  (`--inspect` for the pt value).

### Shared-page rules (all papers)

1. Each TEXT must be complete (heading, body, source attribution) — expand the crop or
   include the next page if cut off.
2. Two TEXTs on one page: crop apart with `--inspect`; neither annexure contains the
   other's content.
3. Multi-page TEXTs: include all pages (`"3-4"` or a second spec).
4. TEXT + questions sharing a page: TEXT ends above the `QUESTIONS:` heading; question
   image starts at it.
5. Rename annexure files distinctly per label before upload
   (`annexure_text_a_1.png`, `annexure_g_1.png`) — Storage uses local filenames.

### Paper 1 section design rules

- **Q1 Comprehension (≤7)**: fully self-contained questions, own `context_text` (1–3
  fresh sentences, TEXT A's theme); mirror each exam sub-question's type (literal /
  inferential / device with identify→meaning→effect); no new question types.
- **Q2 Summary (2–4)**: fresh passage on TEXT C's theme; test sub-skills (main vs
  supporting, best paraphrase, redundancy) — not the full summary task.
- **Q3 Advertising (2–4)**: fresh written ad copy as `context_text`; text-extractable
  sub-questions only.
- **Q4 Media/Cartoons (2–4)**: fresh written dialogue/exchange as `context_text`;
  text-extractable only (reported speech, intention, language effect).
- **Q5 Language (≤7)**: self-contained `context_text` with the specific error/feature;
  same grammar skill + instruction format as the exam; no new grammar skills.

### Paper 3 structure (7 lessons/year)

Q1 Essay (essay theory: planning, structure, argument — not topic-specific; rotate
contextual examples if reusing arc theory across years) + one lesson per transactional
text type 2.1–2.6, named exactly as that year's paper (`"Question 2.3: Email"`);
questions cover that text type's format conventions. `context_text` used sparingly.
