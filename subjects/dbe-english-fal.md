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
> from 2026-10-10 — there is nothing to retrofit here). **Status (2026-10-10):** Nov 2025 is complete on dev: P1 (5 lessons /
> 26 questions), P2 (12 / 59) and P3 (8 / 41) — 25 lessons, 126 questions — gated 2.4.1 and emulator-reviewed (every question
> rendered; every typed answer passes on the Text keyboard). Nov 2024 is also complete on dev (P1 5 lessons / 25 questions, P2 12 / 57, P3 8 / 41 — 25 lessons, 123 questions), gated 2.4.1 and emulator-reviewed (27/27 typed answers pass). The May–June 2025 papers are not authored. Nothing is in prod.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"english_fal"` |
| Postgres tables | `lessons`, `questions` (`subject_id = "english_fal"`); texts in `english_texts` (shared registry, `SETWORK-TXT-02`) |
| Papers | `nov_p1` Language in Context (80, 2 h), `nov_p2` Literature (70), `nov_p3` Writing (100). P4 (oral) is school-assessed — **not authored**. June-diet papers presumed `june_p1/p2/p3` once sourced |
| Curriculum document (`DESIGN-UNI-09`) | `files/CAPS FET _ FAL _ ENGLISH GR 10-12 _ WEB_65DC.pdf` |
| Source files | Nov 2025 P1, P2, P3: paper + memo (all six present in `files/`). May–June 2025 P2 and P3: paper only (no memo) — usable for analysis, not for answer keys. No June P1 |
| Workflow | `workflows/generate/upload-english-fal.md` |
| `subjects` reference row | **Exists on dev** (created 2026-10-10 at the owner's request): `id english_fal`, `name "English FAL"`, `full_name "English First Additional Language"`, `code ENGLISH_FAL`, `category english_lessons`, `sort_order 10`, `color #5C7CFA`, `icon book`, **`capabilities {setwork}`**, **`min_app_version 2.4.1`** (`SETWORK-CAP-01`, `SETWORK-GATE-01`, `VER-10`). Prod does not have it — owner-gated, after V83 and the 2.4.1 release. The 3 papers are the global `nov_p1/p2/p3` rows |
| Curriculum / skills | On dev (2026-10-10): 10 units, 66 topics, 141 subtopics, 61 skills (`subject_id = 'english_fal'`). Seed: `tools/seeds/english-fal-curriculum.json` via `tools/seed-curriculum.js`; the file now also holds the subtopics and skills the authored lessons use. Dump with `--subject english_fal`; reuse before creating (`LANG-CUR-01`) |
| Not authored | display names/colours — from the `subjects`/`papers` tables |

## Gating — everything is 2.4.1

English FAL declares `keyboard_type: "text"` on every `fitb` (`LANG-KB-01`), which makes each exam derive
**2.4.1** (`VER-10`), and the subject row is gated at 2.4.1. Author to **dev only**: V83 is not on prod, the
app change is not released, and a text with the new `short_stories` section value breaks older builds'
English-texts sync (`SETWORK-GATE-01`). Prod needs V83 first, then the app release, then
`push-paper-to-prod.js`. Do not create texts with `short_stories` on prod early.

Two things to know when testing FAL on a device or emulator:
- A build below 2.4.1 does not receive the exam from the library, but deep links still open lessons. Apply the exam gate
  (`apply-exam-gate.js`) after a review pass, not before, if the review build predates the gate.
- FAL and HL share `nov_p2`, and the app stores text picks under `{year}_{paper}_{section}` with no subject — so a FAL pick
  or deep link overwrites HL's picks for the same year (and HL's lessons then disappear from the list). Tracked as **BLA-62**
  (with the related "poetry lessons vanish after choosing texts" bug). Reset the picks in the app when switching subjects
  during a review.

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
  memo gives marks only for substantiation, never for YES/NO or TRUE/FALSE. This shape informs the `aiExplanation`
  only — **practice questions do not mirror these items.**
- **Practice questions follow the HL Paper 2 pattern (`SETWORK-LES-05`):** `context_text` null; fresh targets from
  elsewhere in the text (plot order, roles and relationships, settings, themes, genre, vocabulary); never the exam's own
  statements ("X is a supportive person") nor the memo's answers; 4–6 per lesson, ≥3 presentation types. Each script
  header records the factual basis per question (`BK` book knowledge to verify · `P` printed in the paper ·
  `M` memo · `PT` vocabulary/title). The 37 `BK`-led P2 questions need a subject-expert check against the books.
- **"Triumph in the Face of Adversity"** has no source beyond the extract, title and memo — questions on it are limited
  to those (narrator, title meaning, conversation order, themes of the title).
- **Extract labels:** `Extract A`… as the paper prints them (`SETWORK-IMG-01`); poems `"Poem"`.
- **Paper structure differs from HL:** HL's 20/year (5 poems + 5 pairs + essays) does not apply.

### Texts seen in the supplied papers (SETWORK-TXT-03: only titles from the papers)

| Text | Author | `section` | Where seen | `english_texts` on dev |
|---|---|---|---|---|
| *Cry, the Beloved Country* | Alan Paton | `novel` | Nov 2025 Q1, May–Jun 2025 Q1 | `cry_the_beloved_country` ✓ |
| *Strange Case of Dr Jekyll and Mr Hyde* | Robert Louis Stevenson | `novel` | Nov 2025 Q2, May–Jun 2025 Q2 | `strange_case_of_dr_jekyll_and_mr_hyde` ✓ |
| *Macbeth* | William Shakespeare | `play` | Nov 2025 Q3, May–Jun 2025 Q3 | `macbeth` ✓ |
| *My Children! My Africa!* | Athol Fugard | `play` | Nov 2025 Q4, May–Jun 2025 Q4 | `my_children_my_africa` ✓ |
| "Triumph in the Face of Adversity" | Kedibone Seku | `short_stories` | Nov 2025 Q5.1 | `triumph_in_the_face_of_adversity` ✓ |
| "Eveline" | James Joyce | `short_stories` | Nov 2025 Q5.2 | `eveline` ✓ |
| "The Girl Who Can" | Ama Ata Aidoo | `short_stories` | May–Jun 2025 Q5.1 | not created |
| "A Bag of Sweets" | Agnes Sam | `short_stories` | May–Jun 2025 Q5.2 | not created |
| "Inversnaid" | Gerard Manley Hopkins | `poetry` | Nov 2025 Q6.1 | `inversnaid` ✓ |
| "What Life Is Really Like" | Beverly Rycroft | `poetry` | May–Jun 2025 Q6.1 | not created |
| "You Laughed and Laughed and Laughed" | Gabriel Okara | `poetry` | May–Jun 2025 Q6.2 | not created |
| "Sonnet 73" | William Shakespeare | `poetry` | Nov 2025 Q6.2 | `sonnet_73` ✓ |

Before adding any more, **`node tools/create-english-text.js --list` — FAL reuses an existing row** (`SETWORK-TXT-02`); a
text HL already has is not created again (HL's seven poems and four plays/novels are different texts, so no overlap
arose in 2025). Ids: snake_case of the title. Authors are the printed ones. **The real prescribed list is the DBE
National Literature Catalogue, which is not supplied — until it is, only titles printed in a supplied paper or memo may
be added** (owner decision 2026-10-10); a text FAL students might choose that is not in these papers is simply not
covered yet. Rows were written with `prescribed_years ["2025"]` (a record only). `create-english-text.js` accepts
`short_stories` and refuses to write it to prod until 2.4.1.

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
type appears in both Section B and Section C of a future paper. Format conventions per text type (`LANG-WR-03`): imperative
for instructions, salutations/sign-offs for e-mail, stage directions in brackets for dialogue, no marks for
illustration on a flyer. Lessons carry `supplementary_materials: null`; word-count targets and the
three-part essay rubric (content/planning 30, language/style/editing 15, structure 5) are stated as plain
facts in explanations, never invented scoring.

**As built for Nov 2025 (8 lessons, `order` 1–8):** `Question 1: Essay` (6 practice questions: planning, writing
process order, essay-type features, picture-topic duties, word limit, rubric weighting); then 2.1 E-mail, 2.2 Review,
2.3 Dialogue, 2.4 Speech, 3.1 Flyer, 3.2 WhatsApp Message, 3.3 Instructions (5 each: required parts, ordering,
register/openings, a features multi-select, one typed term). Images: the question image is the section
instructions plus the task (two crops of one page); the memo images are the section's marker instructions, that task's
marking points and the rubric page. `aiExplanation` has one entry per real task (the essay lesson has 1.1–1.8 at 50
marks each). Review topic slug `review` was added under `transactional_writing` (the seed's `book_review` is for books).

## Lesson shape and conventions

- Lessons have no video: `has_video: false`, `freemium_*: null`, `duration_seconds: null` (`LANG-LES-01`).
- `aiExplanation`: one entry **per real exam sub-question** with its real marks and printed number
  (`AIEXP-08`, `LANG-ANS-02`) — e.g. P1 Q1 has 17 entries (1.1.1 … 1.12), the summary has one (`"2"`, 10 marks).
  Where an item has lettered parts under one printed number (P2: 1.1.2 (a)+(b)), use **one entry for that number with the
  total marks**; the only exception is P1 5.1.1(a)–(d), where each part prints its own `(1)` and gets its own entry.
- `context_text` per `LANG-CTX-01`; theme and structure per `LANG-EX-01`/`02`.
- Naming: `"Question N: Description"` (the HL form), e.g. `"Question 1: Comprehension"`,
  `"Question 5: Language and Editing Skills"`; P2: `"Question 1.1: Cry, the Beloved Country"` /
  `"…1.2…"` (Part 1/Part 2).
- Image extraction: `LANG-IMG-01`/`02`, `SETWORK-IMG-01`.

## Curriculum units (from CAPS §3.2–3.4; seeded on dev 2026-10-10)

Source of truth for the seed: `tools/seeds/english-fal-curriculum.json` (10 units, topics, and the subtopics and
skills used by the authored lessons; ids `english_fal_<unit>`, `english_fal_<unit>__<topic>`,
`english_fal_<unit>__<topic>__<subtopic>`). Re-run
`node tools/seed-curriculum.js --file tools/seeds/english-fal-curriculum.json --apply` after the generator adds new
subtopics/skills (dry run by default; refuses without the subject row). Further subtopics can also be created
per lesson with `create-curriculum-node.js --subject english_fal`.

| Unit | Exam home | Topics |
|---|---|---|
| `comprehension` | P1 Q1 | literal_comprehension, inferential_reading, vocabulary_in_context, figurative_language, author_purpose_and_attitude, evaluative_reading, text_features_and_visuals |
| `summary` | P1 Q2 | main_vs_supporting_points, paraphrase_and_own_words, point_form_conventions |
| `visual_texts` | P1 Q3, Q4 | advertising_language, cartoon_analysis, critical_language_awareness |
| `language` | P1 Q5 | parts_of_speech, word_level_vocabulary, verb_tenses, concord, modals_and_conditionals, passive_and_reported_speech, sentence_construction, punctuation_and_spelling, editing |
| `novel` / `drama` / `short_stories` / `poetry` | P2 §A–§D | per-genre topics (character, plot, theme, devices, tone …); individual texts are identified by `text_key`, not by topic |
| `essay_writing` | P3 §A | essay_types, planning_and_structure, picture_prompts, language_style_and_editing |
| `transactional_writing` | P3 §B, §C | one topic per text type (email, formal_letter, speech, dialogue, review, book_review, magazine_article, flyer, whatsapp_message, instructions, diary_entry, minutes, agenda, report) |

`visual_texts` is new relative to HL (the advert and cartoon test viewing/critical-language skills, not editing). The unit
slug is `drama`, not `play` (`play` is only the `english_texts` section value). Language topics follow CAPS §3.4 at
coarse grain; the detail goes in subtopics.

**Skills:** `skills.id` is a **global primary key** (checked on dev 2026-10-10) — unlike HL's 253 existing skill ids, FAL
skill ids must be prefixed `english_fal_` (e.g. `english_fal_identify_figure_of_speech`) or they will collide with HL.

## Open items

1. **Subject-expert review** of the `BK`-led P2 questions (37 of 59) against the books; flagged per question in each script
   header (`SETWORK-LES-05`).
2. **Subject-level gate tooling:** nothing sets or checks `subjects.min_app_version`; the prod-push refusal is exam-level only
   (`VER-10`). The row's 2.4.1 was set by hand.
3. **Prod:** blocked until app 2.4.1 is tagged and backend V83 is on prod; then the owner creates the `subjects` row
   there, followed by `push-paper-to-prod.js` per paper. Create the `short_stories` texts on prod only after 2.4.1.
4. **App bugs affecting FAL review and use:** BLA-62 (picks not subject-scoped; poetry lessons hidden after a pick). Cosmetic: the
   Subjects header shows "English Fal" (title-cased id) while the row says "English FAL".
5. **Not authored:** May–June 2025 P2/P3 (no memos supplied — needed for `aiExplanation`) and P1; June-diet P1 is not in `files/`.
6. **Vocabulary note:** the dumped vocabulary includes unused early subtopics from the first P2 attempt; harmless, delete if
   they confuse a later dump.

## Ledger — Nov 2025 (2026-10-10)

| Paper | Lessons | Questions | Notes |
|---|---|---|---|
| `nov_p1` | 5 (Q1–Q5) | 26 | aiExplanation per real sub-question (AIEXP-08); MC answer positions 1/4/4/3 |
| `nov_p3` | 8 (Q1 essay; 2.1 E-mail, 2.2 Review, 2.3 Dialogue, 2.4 Speech; 3.1 Flyer, 3.2 WhatsApp Message, 3.3 Instructions) | 41 | Conventions-based fresh scenarios, `context_text` null, `supplementary_materials` null; aiExplanation one entry per real task (1.1–1.8 at 50, 2.x at 30, 3.x at 20); question images are the task text, memo images are the task's marking points plus the rubric page |
| `nov_p2` | 12 (1.1, 1.2 … 6.1, 6.2) | 59 | Extracts A–J + two poems; `text_key` on lesson and questions; HL pattern: `context_text` null, fresh targets, factual basis (BK/P/M/PT) per question in each script header; 20 MCQs at positions 2/6/6/6 |

- **Texts created on dev (`english_texts`, 2026-10-10, `prescribed_years` ["2025"]):** `cry_the_beloved_country`,
  `strange_case_of_dr_jekyll_and_mr_hyde` (novel); `macbeth`, `my_children_my_africa` (play);
  `triumph_in_the_face_of_adversity`, `eveline` (short_stories); `inversnaid`, `sonnet_73` (poetry). Titles from the Nov 2025
  paper; prod must **not** receive the `short_stories` rows before 2.4.1 (`create-english-text.js` refuses).
- **Review (emulator 2.4.1-dev01, `testTag` driven):** every question of P1, P2 and P3 rendered; typed answers pass on the Text
  keyboard — P1 7/7, P2 13/13 (after the rework), P3 8/8. A first-run miss was the runner reading feedback too early
  (`question_feedback_*` can take ~1 s), so runners must poll. `review-capture-answers.js` only knows `maths_key_*`; Text keyboard
  keys are `text_key_<LETTER>`, `text_key_switch` (digits/punctuation), `text_key_done`. MCQ, multi-select and match submissions were
  not exercised (no harness support).
- **Authoring lessons:** (1) practice stimulus must not quote the exam extract — write fresh text, even for matching items;
  (2) multi-part exam items with lettered parts are one `aiExplanation` entry per printed number with the item's total marks;
  (3) every 4+ question set needs ≥3 presentation types (validator `Variety rule`); (4) extract/poem question images must stop
  above the `AND` divider and the `TOTAL SECTION` line — check the last 200 px of each crop.

- **P2 rework (2026-10-10):** the first P2 set reused the exam's own statements and memo answers and added `context_text`; it
  was replaced with the HL pattern (`SETWORK-LES-05`). Highest-risk `BK` claims: Napoleon Letsitsi's role and Kumalo on the
  mountain (*Cry*), Hyde's rooms in Soho and the cabinet door (*Jekyll*), Ernest's
  death (*Eveline*). A review sheet can be regenerated from the script headers into `temp/review/` (gitignored).
  Re-uploading a lesson with fewer questions leaves the old row published — soft-delete it (Q4.2 had a stale Q5).

## Ledger — Nov 2024 (2026-10-11)

| Paper | Lessons | Questions | Notes |
|---|---|---|---|
| `nov_p1` | 5 | 25 | TEXT A AI article, B reading infographic, C getting active, D Sinutab ad, E Dennis the Menace, F braai, G Google |
| `nov_p2` | 12 | 57 | New texts: *The Wind and a Boy* (Bessie Head, `short_stories`), *The Slave Dealer* (Pringle) and *Hard to Find* (Jojo) (`poetry`); other texts reused with new lessons per year |
| `nov_p3` | 8 | 41 | Essay (child on a swing, robot cooking, galloping horse); 2.1 Letter of Application, 2.2 Magazine Article, 2.3 Obituary, 2.4 Dialogue; 3.1 Poster, 3.2 Diary Entries, 3.3 Instructions |

- Generators for both years live in `scripts/_gen/english-fal/` (2024: `gen_fal_2024_p{1,2,3}.py` + `fal2024_common.py`).
- Authoring gotchas found: annexure files must have unique names across labels in one lesson (a P1 upload overwrote Text A with Text B until renamed);
  a new tag (`diary_entry`) must exist before upload; MCQ index-0 share for 2024 is 7 of 51 (~14%, above the ~10% target);
  review runners read answers from a DB-built manifest — rebuild it (proxy running) before every run or stale answers produce false failures.
- A 2025 P2 question ("Mr M teaches English") was replaced 2026-10-11: the 2024 paper shows English is Isabel's favourite subject and nothing says Mr M teaches it.
