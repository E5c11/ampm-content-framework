---
id: AMPM-CONTENT-SUBJ-DBE-ENGLISH-HL
type: profile
layer: subjects
related: [AMPM-CONTENT-LANG, AMPM-CONTENT-SETWORK, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, english-hl, dbe, profile]
---

# Subject Profile — DBE English Home Language

> **Shared rules (2026-10-10).** The subject-agnostic English HL rules now live in
> `shared/language-subjects.md` (`AMPM-CONTENT-LANG`: theme/structure, `context_text`, fitb-vs-MC,
> section design, writing paper, image labels, keyboards) and `shared/setwork.md`
> (`AMPM-CONTENT-SETWORK`: `text_key`, `english_texts`, sections, picker, gating). **Load both with
> this profile.** This file keeps only what is specific to English HL. The shared rules bind papers
> authored from 2026-10-10; papers already authored are **retrofitted later** — see § Retrofit owed.

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

## Capabilities

`subjects.capabilities = {setwork}` (V83, seeded). Its Paper 2 uses the setwork screen; the
picker is derived from lessons' `text_key` (`SETWORK-CAP-01`). Sections in use: `novel`, `play`,
`poetry`.

## Curriculum hierarchy quirks

8 units (`comprehension`, `summary`, `language`, `poetry`, `drama`, `novel`,
`transactional_writing`, `essay_writing` — illustrative, query per session). Namespacing and
vocabulary dumps: `LANG-CUR-01`.

## Lesson structure per paper (HL's instance of `LANG-CAP-01` / `LANG-WR-01` / `SETWORK-LES-03`)

- **Paper 1** — 5 lessons/year, one per exam question: Q1 Comprehension (≤7 questions),
  Q2 Summary (2–4), Q3 Advertising (2–4), Q4 Media/Cartoons (2–4), Q5 Language (≤7). Section design
  rules: `LANG-SEC-01`–`05`.
- **Paper 2** — 20 lessons/year for a 5-poetry + 5-prescribed-pair paper; contextual questions
  (Q7, Q9, Q11, Q13, Q15) split into Part 1/Part 2 lessons (one extract tab each); essay questions
  (Q1, Q6, Q8, Q10, Q12, Q14) have `supplementary_materials: null`. Texts, keys, sections, extract
  crops: `shared/setwork.md`. Phase 0 of `workflows/generate/upload-english-hl.md`.
- **Paper 3** — 7 lessons/year: Q1 Essay + one lesson per transactional text type (2.1–2.6, named
  exactly as that year's paper names them) — `LANG-WR-01`.

## Image labels (HL specifics)

Paper 1 `"Text A"`–`"Text G"` (`LANG-IMG-01`); Paper 2 contextual `"Extract A"`… continuous across
the paper, poetry `"Poem"` (`SETWORK-IMG-01`); essay lessons and Paper 3 `supplementary_materials: null`.

## Keyboard — new papers declare `text` (changed 2026-10-10)

The released English keyboard types `A`–`Z`, `'` and space only (`core/keyboard-input.md`) and cannot
be declared. **From 2026-10-10 a new English HL paper declares `keyboard_type: "text"`**
(`LANG-KB-01`), so the exam derives **2.4.1** and is gated per exam (`VER-09`/`VER-10`). English HL is
no longer exempt from `KEYBOARD-04`: the validator errors on an undeclared typed row, except the 17
pre-rules scripts on the legacy allowlist (delete each entry when its paper is retrofitted). Undeclared
existing papers keep the legacy English keyboard; `KEYBOARD-01` still blocks punctuation/digits for them.

## Retrofit owed

Existing HL papers (2021, 2022, 2024, 2025 Nov; all of P1/P2/P3 that are on dev or prod) predate the
shared rules. Known gaps against them, to be retrofitted later (`KEYBOARD-06`; never touch a live
prod paper without the owner): (1) `keyboard_type` undeclared, trailing-full-stop/digit answers
(`core/app-feature-versions.md` § ledger); (2) `DESIGN-ENG-*` IDs → `LANG-*` in notes; (3) anything
in P2 whose `text_key` is the old `"poetry"` marker or disagrees between lesson and questions
(`SETWORK-LES-01`). Audit before retrofitting; do not assume these are all present.
