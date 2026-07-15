---
id: AMPM-CONTENT-SUBJ-DBE-ENGLISH-HL
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, english-hl, dbe, profile]
---

# Subject Profile — DBE English Home Language

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"english_hl"` |
| Collections | lessons: `english_videos`, questions: `english_questions`, texts: `english_texts` |
| Curriculum sources | `english_lit_curriculum` (unit/topic/subtopic; created 2026-07-14). **No skills collection** — `skills` is a free-form verb-phrase vocabulary governed by reuse against existing `english_questions` `skills[]` usage |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --project dev --subject english_hl --out temp/curriculum-vocab.json` |
| Denormalized values | `subject_name: "English HL"`, `subject_full_name: "English Home Language"`, `subject_color: "#1565C0"`, `subject_category: "english_videos"`, paper color `"#1976D2"` |
| Papers | `nov_p1` (Language in Context), `nov_p2` (Literature), `nov_p3` (Writing) |

## Allowed presentation types

`multiple_choice`, `multi_select`, `fitb`, `ordering`, `match` **only** — `fraction`,
`equation`, `steps` are not used. MathText does not apply. Question `type`:
`definition` or `application` only.

## Extra document fields

- `context_text` on questions — short inline stimulus (1–3 fresh sentences) or null
  (`DESIGN-ENG-03`). Rendered in a card above the question text.
- `text_key` on Paper 2 lessons **and** their questions (e.g. `"hamlet"`, `"poetry"`);
  null for Papers 1/3. Per-text, not per-year (`"hamlet"`, never `"hamlet_2024"`).
- Lessons usually have no video: `has_video: false`, `freemium_*: null`,
  `duration_seconds: null`, `marks: null` in `ai_explanation` entries.

## Curriculum hierarchy quirks

8 units (`comprehension`, `summary`, `language`, `poetry`, `drama`, `novel`,
`transactional_writing`, `essay_writing` — illustrative, query per session).
Topic/subtopic doc IDs are namespaced per unit (`${unit}__${topic}`,
`${unit}__${topic}__${subtopic}`) because topic names legitimately recur across units;
the bare name a question needs is the last `__` segment.

## Lesson structure per paper

- **Paper 1** — 5 lessons/year, one per exam question: Q1 Comprehension (≤7 questions),
  Q2 Summary (2–4), Q3 Advertising (2–4), Q4 Media/Cartoons (2–4), Q5 Language (≤7).
  Section-by-section design rules (fresh passage vs `context_text`, visual-dependent
  sub-questions skipped) live in `workflows/generate/upload-english.md`.
- **Paper 2** — 20 lessons/year for a 5-poetry + 5-prescribed-pair paper; contextual
  questions split into Part 1/Part 2 lessons (one extract tab each). Prescribed-text
  sets are authored **once per text** — check Firestore for the `text_key` first.
  Paper 2 uploads require the `english_texts` maintenance pass (Phase 0 of the upload
  workflow: `check-p2-videos.js` → `update-english-texts.js`; `poetry` is special-cased,
  never added; retired texts get `active: false`, never deleted).
- **Paper 3** — 7 lessons/year: Q1 Essay + one lesson per transactional text type
  (2.1–2.6, named exactly as that year's paper names them).

## Image extraction quirks

Labels must match the exam's own naming exactly (`PIPE-03`): Paper 1 `"Text A"`–`"Text
G"`; Paper 2 contextual `"Extract A"`… (alphabetical sequence continuous across the
whole paper — verify against the actual paper); Paper 2 poetry `"Poem"`; essay lessons
and Paper 3: `supplementary_materials: null`. `question_image_urls` contains only the
numbered-question pages — never TEXT/extract body, `AND` dividers, or extract headings.
Crop rules (citation boundaries, Part 1/2 splits) live in
`workflows/generate/upload-english.md`.

## Answer conventions

- FITB answers in sentence case; `|`-separated alternatives for multiple valid answers
  (`DESIGN-ENG-04`).
- `ai_explanation` solutions include the correct answer **and why distractors are
  wrong** (`AIEXP-05`).
- Theme + structure rules (`DESIGN-ENG-01`/`02`): same theme as the year's exam text,
  same sub-question types, all-new content.
