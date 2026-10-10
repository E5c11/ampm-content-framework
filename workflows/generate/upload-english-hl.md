# Upload — DBE English HL (one lesson)

**Profile:** `subjects/dbe-english-hl.md` · **Shared rules:** `shared/language-subjects.md`, `shared/setwork.md` (P2) · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used (English subset only —
profile).

> Do NOT enter plan mode. Run once per lesson (one exam question). Commit after Phase 4.
> Moved from `AMPM/workflows/generate/upload-english.md` (stub remains there); renamed to `upload-english-hl.md` 2026-10-10 when `upload-english-fal.md` was added.
> **English FAL** has its own workflow (`upload-english-fal.md`) — do not use this one for it.
> A lesson maps to one exam question; exam images are shown to the student, practice
> questions are fresh but exam-mirrored (`LANG-EX-01`/`02`, `DESIGN-UNI-01`).

## Phase 0 (Paper 2 only) — `english_texts` check

Required when uploading nov_p2 lessons; skip for P1/P3. Rules: `shared/setwork.md`
(`SETWORK-TXT-01`–`04`, `SETWORK-SEC-01`). In short: every `text_key` must already be an
`english_texts` row (the upload script's FK preflight rejects unknown ones); reuse existing rows
(also across subjects); add a missing text first with `tools/create-english-text.js` (owner-gated);
retire with `--retire`; poetry `text_key` is the actual poem's id.

```bash
node tools/create-english-text.js --list
```

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
   reference "the passage" or line numbers. **Keyboard:** new papers (from 2026-10-10) declare `keyboard_type: "text"`
   (`LANG-KB-01`; the old English exemption in `KEYBOARD-04` ends for new papers), so the exam derives 2.4.1
   (`VER-09`/`VER-10`); answers must be typeable on `text` (`LANG-KB-02`/`03`).
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

## Appendix — where the extraction and design rules live

Moved 2026-10-10 into the shared docs (new papers only; existing papers retrofitted later):

| Was here | Now |
|---|---|
| Paper 2 lesson slots, Part 1/Part 2 splits, extract/poem crops | `shared/setwork.md` — `SETWORK-LES-03`, `SETWORK-IMG-01` |
| Shared-page rules (all papers) | `shared/language-subjects.md` — `LANG-IMG-02` |
| Paper 1 section design rules | `shared/language-subjects.md` — `LANG-SEC-01`–`05`, `LANG-CAP-01` |
| Paper 3 structure | `shared/language-subjects.md` — `LANG-WR-01`–`03`; HL slots in the profile |
