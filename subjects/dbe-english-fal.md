---
id: AMPM-CONTENT-SUBJ-DBE-ENGLISH-FAL
type: profile
layer: subjects
related: [AMPM-CONTENT-LANG, AMPM-CONTENT-SETWORK, AMPM-CONTENT-SUBJ-DBE-ENGLISH-HL, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, english-fal, dbe, profile, setwork, language]
provenance: drafted 2026-10-10 from the Nov 2025 P1/P2/P3 papers and memos, the May–June 2025 P2/P3 papers, and the setwork-capabilities work (ampm-contracts 0.41.0, backend V83, app change merged to dev).
---

# Subject Profile — DBE English First Additional Language (Papers 1–3)

> **Load with this profile:** `shared/language-subjects.md` (`AMPM-CONTENT-LANG`) and
> `shared/setwork.md` (`AMPM-CONTENT-SETWORK`). They carry the rules; this file records only what is
> specific to English FAL. Binding from the first FAL paper (the shared rules apply to all papers authored
> from 2026-10-10 — there is nothing to retrofit here). **Nothing is authored yet** (status: drafted, 2026-10-10).

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"english_fal"` |
| Postgres tables | `lessons`, `questions` (`subject_id = "english_fal"`); texts in `english_texts` (shared registry, `SETWORK-TXT-02`) |
| Papers | `nov_p1` Language in Context (80, 2 h), `nov_p2` Literature (70), `nov_p3` Writing (100). P4 (oral) is school-assessed — **not authored**. June-diet papers presumed `june_p1/p2/p3` once sourced |
| Curriculum document (`DESIGN-UNI-09`) | `files/CAPS FET _ FAL _ ENGLISH GR 10-12 _ WEB_65DC.pdf` |
| Source files | Nov 2025 P1, P2, P3: paper + memo (all six present in `files/`). May–June 2025 P2 and P3: paper only (no memo) — usable for analysis, not for answer keys. No June P1 |
| Workflow | `workflows/generate/upload-english-fal.md` |
| `subjects` reference row | Owner-gated. Must carry **`capabilities = {setwork}`**, **`min_app_version = 2.4.1`** (`SETWORK-CAP-01`, `SETWORK-GATE-01`, `VER-10`) and 3 papers. Check whether the dev row already exists before asking for it (other profiles wrongly assumed they needed to create theirs) |
| Curriculum / skills | `curriculum_nodes`, `skills` where `subject_id = 'english_fal'` — empty until the first session. Dump (`--subject english_fal` — the dumper's subject whitelist must be extended first), reuse before creating (`LANG-CUR-01`) |
| Not authored | display names/colours — from the `subjects`/`papers` tables |

## Gating — everything is 2.4.1

English FAL declares `keyboard_type: "text"` on every `fitb` (`LANG-KB-01`), which makes each exam derive
**2.4.1** (`VER-10`), and the subject row is gated at 2.4.1. Author to **dev only**: V83 is not on prod, the
app change is not released, and a text with the new `short_stories` section value breaks older builds'
English-texts sync (`SETWORK-GATE-01`). Prod needs V83 first, then the app release, then
`push-paper-to-prod.js`. Do not create texts with `short_stories` on prod early.

## Allowed presentation types

`multiple_choice`, `multi_select`, `fitb`, `ordering`, `match` only — as English HL. `fraction`, `equation`,
`steps` are not used. Question `type`: `definition` or `application` only. FAL is the weaker-language track,
so `fitb` answers are single words or short fixed phrases that can be typed from the stimulus
(`LANG-KB-03`); anything open-ended is `multiple_choice` (`LANG-ANS-01`).

## Paper 1 — Language in Context (5 lessons/year)

| Lesson | Exam question | Marks | Cap |
|---|---|---|---|
| Q1 Comprehension | TEXT A + TEXT B, 1.1–1.12 (includes a **visuals** sub-question on TEXT B) | 30 | ≤7 |
| Q2 Summary | TEXT C — "list SEVEN points", ≤70 words, point form | 10 | 2–4 |
| Q3 Advertisement | TEXT D (visual ad) | 10 | 2–4 |
| Q4 Cartoon | TEXT E | 10 | 2–4 |
| Q5 Language and editing | 5.1 TEXT F (passage with deliberate errors); 5.2 TEXT G (poster/graphic, sentence combining etc.) | 20 | ≤7 |

Rules: `LANG-SEC-01`–`05`, `LANG-CAP-01`. FAL specifics:
- **Texts A–G** are labelled exactly as the paper (`Text A` … `Text G`) (`LANG-IMG-01`).
- **Visual sub-questions** (Q1.10–1.12, most of Q3/Q4) depend on pictures; skip those per `LANG-EX-03`
  and record what was skipped.
- **Summary is a list of seven points**, not a paragraph (`LANG-SEC-02`); test selecting the seven distinct
  points and rewording, not the 70-word count.
- **Editing (Q5.1)**: one error per blank; errors are spelling/concord/word choice, answer typed from the
  corrected text — keep the corrected word short (`LANG-SEC-05`, `LANG-KB-03`).
- Section C (Language) is three exam questions (3, 4, 5) worth 40, two of them visual.

## Paper 2 — Literature (setwork; 12 lessons/year)

CAPS: **answer TWO of four sections** — A Novel, B Drama, C Short stories, D Poetry — 35 marks each, one
question (two extracts or two poems) per section. A candidate may not answer more than one question on the
same genre. Every question requires **both** parts (1.1 and 1.2).

| Section | `section` value | Questions | Lessons/year |
|---|---|---|---|
| A Novel | `novel` | Q1 *Cry, the Beloved Country*; Q2 *Strange Case of Dr Jekyll and Mr Hyde* | 4 (Part 1/Part 2 each) |
| B Drama | `play` (app label "Drama") | Q3 *Macbeth*; Q4 *My Children! My Africa!* | 4 |
| C Short stories | `short_stories` | Q5 — two stories per paper | 2 |
| D Poetry | `poetry` | Q6 — two seen poems per paper | 2 |

Total **12 lessons a year**, none of them essay lessons — FAL has no long-form literature question
(`SETWORK-LES-03`), so every P2 lesson has an extract/poem annexure. Every P2 lesson and its questions carry
`text_key` (`SETWORK-LES-01`).

- **Sub-question shape (Nov 2025 memo):** 1.1.1 is a four-part matching/(a)–(d) item (4 marks), then short
  literal, inferential, device and "explain/discuss" items, ending with a 3-mark substantiated opinion. The
  memo says marks are given only for substantiation, never for YES/NO or TRUE/FALSE. Practice questions:
  `match`/`multiple_choice` for the (a)–(d) shape, `multiple_choice` for open items, `fitb` only for a
  single typeable word (a name, a device — `Metaphor`, `Personification`).
- **Extract labels:** `Extract A`… as the paper prints them (`SETWORK-IMG-01`); poems `"Poem"`.
- **Paper structure differs from HL:** HL's 20/year (5 poems + 5 pairs + essays) does not apply.

### Texts seen in the supplied papers (SETWORK-TXT-03: only titles from the papers)

| Text | Author | `section` | Where seen |
|---|---|---|---|
| *Cry, the Beloved Country* | Alan Paton | `novel` | Nov 2025 Q1, May–Jun 2025 Q1 |
| *Strange Case of Dr Jekyll and Mr Hyde* | Robert Louis Stevenson | `novel` | Nov 2025 Q2, May–Jun 2025 Q2 |
| *Macbeth* | William Shakespeare | `play` | Nov 2025 Q3, May–Jun 2025 Q3 |
| *My Children! My Africa!* | Athol Fugard | `play` | Nov 2025 Q4, May–Jun 2025 Q4 |
| "Triumph in the Face of Adversity" | Kedibone Seku | `short_stories` | Nov 2025 Q5.1 |
| "Eveline" | James Joyce | `short_stories` | Nov 2025 Q5.2 |
| "The Girl Who Can" | Ama Ata Aidoo | `short_stories` | May–Jun 2025 Q5.1 |
| "A Bag of Sweets" | Agnes Sam | `short_stories` | May–Jun 2025 Q5.2 |
| "Inversnaid" | Gerard Manley Hopkins | `poetry` | Nov 2025 Q6.1 |
| "What Life Is Really Like" | Beverly Rycroft | `poetry` | May–Jun 2025 Q6.1 |
| "You Laughed and Laughed and Laughed" | Gabriel Okara | `poetry` | May–Jun 2025 Q6.2 |
| "Sonnet 73" | William Shakespeare | `poetry` | Nov 2025 Q6.2 |

Before adding any of these, **query `english_texts` — FAL reuses an existing row** (`SETWORK-TXT-02`); a text
HL already has is not created again. Ids: snake_case of the title (`cry_the_beloved_country`,
`inversnaid`, `eveline`). Authors are the printed ones. **The real prescribed list is the DBE National Literature
Catalogue, which is not supplied — until it is, only the titles above may be added** (owner decision
2026-10-10); a text FAL students might choose that is not in these papers is simply not covered yet.
`create-english-text.js` must be extended to accept `short_stories` before the first short-story row (see
`shared/setwork.md` § Open items).

## Paper 3 — Writing (lessons per task; 100 marks)

| Section | Question | Marks | Words | Nov 2025 options |
|---|---|---|---|---|
| A Essay | Q1 — **choose one of 8** (5 titles/quotes + 3 pictures; the picture topics need a title the candidate writes) | 50 | 250–300 | e.g. "The story behind my smile", "It gets easier" |
| B Longer transactional | Q2 — choose one | 30 | 120–150 | 2.1 E-mail, 2.2 Review, 2.3 Dialogue, 2.4 Speech |
| C Shorter transactional | Q3 — choose one | 20 | 80–100 | 3.1 Flyer, 3.2 WhatsApp message, 3.3 Instructions |

May–June 2025 uses other options (e.g. minutes, speech, diary entry), so **lessons are per text type**,
named exactly as that year's paper (`"Question 2.1: E-mail"`, `"Question 3.2: WhatsApp message"`) per
`LANG-WR-01`. One essay lesson (`Question 1: Essay`) teaching planning, structure, the five essay types
(narrative, descriptive, reflective, discursive, argumentative — the memo's own list) and, separately, how to
interpret a picture topic (`LANG-WR-02`). Section B and C text types are distinct lessons even when the same
type (e.g. a speech) appears in both years. Format conventions per text type (`LANG-WR-03`): imperative for
instructions, salutations/sign-offs for e-mail, stage directions in brackets for dialogue, no marks for
illustration on a flyer. Lessons carry `supplementary_materials: null`; word-count targets and the
three-part essay rubric (content/planning 30, language/style/editing 15, structure 5) are stated as plain
facts in explanations, never invented scoring.

## Lesson shape and conventions

- Lessons have no video: `has_video: false`, `freemium_*: null`, `duration_seconds: null`, `marks: null`
  in `aiExplanation` entries (`LANG-LES-01`).
- One `aiExplanation` entry **per practice question**; solutions explain why distractors are wrong
  (`LANG-ANS-02`).
- `context_text` per `LANG-CTX-01`; theme and structure per `LANG-EX-01`/`02`.
- Naming: `"Question N: Description"` (the HL form), e.g. `"Question 1: Comprehension"`,
  `"Question 5: Language and Editing Skills"`; P2: `"Question 1.1: Cry, the Beloved Country"` /
  `"…1.2…"` (Part 1/Part 2).
- Image extraction: `LANG-IMG-01`/`02`, `SETWORK-IMG-01`.

## Curriculum units (proposed 2026-10-10 from CAPS §3.2–3.4; approved, not yet in the DB)

Source of truth for the seed: `tools/seeds/english-fal-curriculum.json` (10 units, 61 topics; ids
`english_fal_<unit>` and `english_fal_<unit>__<topic>`). Seed with
`node tools/seed-curriculum.js --file tools/seeds/english-fal-curriculum.json --apply` once the subject row exists
(dry run by default). Subtopics are **not** seeded — create them per lesson from the real sub-questions
(`create-curriculum-node.js --subject english_fal`).

| Unit | Exam home | Topics |
|---|---|---|
| `comprehension` | P1 Q1 | literal_comprehension, inferential_reading, vocabulary_in_context, figurative_language, author_purpose_and_attitude, evaluative_reading, text_features_and_visuals |
| `summary` | P1 Q2 | main_vs_supporting_points, paraphrase_and_own_words, point_form_conventions |
| `visual_texts` | P1 Q3, Q4 | advertising_language, cartoon_analysis, critical_language_awareness |
| `language` | P1 Q5 | parts_of_speech, word_level_vocabulary, verb_tenses, concord, modals_and_conditionals, passive_and_reported_speech, sentence_construction, punctuation_and_spelling, editing |
| `novel` / `drama` / `short_stories` / `poetry` | P2 §A–§D | per-genre topics (character, plot, theme, devices, tone …); individual texts are identified by `text_key`, not by topic |
| `essay_writing` | P3 §A | essay_types, planning_and_structure, picture_prompts, language_style_and_editing |
| `transactional_writing` | P3 §B, §C | one topic per text type (email, formal_letter, speech, dialogue, book_review, magazine_article, flyer, whatsapp_message, instructions, diary_entry, minutes, agenda, report) |

`visual_texts` is new relative to HL (the advert and cartoon test viewing/critical-language skills, not editing). The unit
slug is `drama`, not `play` (`play` is only the `english_texts` section value). Language topics follow CAPS §3.4 at
coarse grain; the detail goes in subtopics.

**Skills:** `skills.id` is a **global primary key** (checked on dev 2026-10-10) — unlike HL's 253 existing skill ids, FAL
skill ids must be prefixed `english_fal_` (e.g. `english_fal_identify_figure_of_speech`) or they will collide with HL.

## Open items before the first lesson

1. Owner: `subjects` row for `english_fal` with `capabilities = {setwork}`, `min_app_version = 2.4.1`, 3 papers.
2. ~~Tooling~~ done 2026-10-10: `dump-curriculum-vocabulary.js` knows `english_fal`; `create-english-text.js` accepts
   `short_stories` (and `--list`; refuses non-legacy sections on prod until 2.4.1); `lib/curriculum.js` namespaces
   FAL units with an `english_fal_` prefix (the node id is a global key); the validator checks `SETWORK-LES-01`.
   Still open: nothing sets/checks `subjects.min_app_version`.
3. Source files: a memo for May–June 2025 P2/P3; June-diet P1 (optional).
4. ~~Curriculum units~~ — settled above; blocked only on the subject row (item 1).
5. **Dev state checked 2026-10-10:** there is **no `english_fal` row** in `subjects` on dev (`afrikaans_fal` exists, `capabilities = {}`,
   `min_app_version` null); no FAL curriculum nodes or skills; `english_texts` holds only HL texts (no *Macbeth*, so every FAL text is
   a new row except any HL later adds). Row template (copy HL's): `id english_fal`, `name "English FAL"`, `full_name "English First
   Additional Language"`, `code ENGLISH_FAL`, `category english_lessons`, `is_active`, `capabilities {setwork}`,
   `min_app_version 2.4.1`; colour/icon/sort_order are the owner's call.
