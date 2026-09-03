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
| Postgres tables | `lessons`, `questions`, `english_texts` — `subject_id = "english_hl"` |
| Curriculum sources | `curriculum_nodes` where `subject_id = 'english_hl'` — IDs namespaced `unit__topic__subtopic`; author bare slugs, `content-rows.js` namespaces. `skills` rows where `subject_id = 'english_hl'` (real rows now, a free-form verb-phrase vocabulary — reuse before `tools/create-skill.js`) |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject english_hl --out temp/curriculum-vocab.json` (Auth Proxy running) |
| Not authored | display names/colours — resolved from the `subjects`/`papers` reference tables by JOIN |
| Papers | `nov_p1` (Language in Context), `nov_p2` (Literature), `nov_p3` (Writing) |

## Allowed presentation types

`multiple_choice`, `multi_select`, `fitb`, `ordering`, `match` **only** — `fraction`,
`equation`, `steps` are not used. MathText does not apply. Question `type`:
`definition` or `application` only.

## Extra document fields

- `context_text` on questions — short inline stimulus (1–3 fresh sentences) or null
  (`DESIGN-ENG-03`). Rendered in a card above the question text.
- `text_key` on Paper 2 lessons **and** their questions — a real `english_texts` id
  (`"hamlet"`, `"felix_randal"`, …); null for Papers 1/3. Per-text, not per-year. The old
  `"poetry"` marker is not a row — name the actual poem. FK-preflighted.
- Lessons usually have no video: `has_video: false`, `freemium_*: null`,
  `duration_seconds: null`, `marks: null` in `aiExplanation` entries.

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
  sets are authored **once per text** — check `english_texts` for the id first
  (`psql -c "SELECT id, section, is_active FROM english_texts ORDER BY section, id"`). A new
  prescribed text needs a row (`tools/create-english-text.js`); a retired one gets
  `--retire` (`is_active = false`, never deleted). Phase 0 of `workflows/generate/upload-english.md`.
  Poetry lessons use the actual poem's id, not a `poetry` marker.
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
