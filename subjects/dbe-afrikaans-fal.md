---
id: AMPM-CONTENT-SUBJ-DBE-AFRIKAANS-FAL
type: profile
layer: subjects
related: [AMPM-CONTENT-LANG, AMPM-CONTENT-SETWORK, AMPM-CONTENT-SUBJ-DBE-ENGLISH-FAL, AMPM-CONTENT-SUBJ-DBE-ENGLISH-HL, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, afrikaans-fal, dbe, profile, setwork, language, accents]
provenance: drafted 2026-10-17 from the Nov 2025 P1/P2/P3 papers and memos (P2 has no memo in `files/` — `…P2 Nov 2025 MG.pdf` is present but was not analysed beyond structure), the CAPS document (`files/afrikaans_fal/caps/`), and a read of the app's keyboard/capability code (AMPM `TextKeyboard.kt`, `QuestionsViewModel.kt`, `SubjectCapability.kt`). Nothing authored.
---

# Subject Profile — DBE Afrikaans First Additional Language (Papers 1–3)

> **Load with this profile:** `shared/language-subjects.md` (`AMPM-CONTENT-LANG`), `shared/setwork.md`
> (`AMPM-CONTENT-SETWORK`) and `subjects/dbe-english-fal.md` (the sibling — same paper shapes, same pipeline). This file records
> only what is specific to Afrikaans FAL. **Status (2026-10-17): Nov 2025 P1 authored on dev** (7 lessons / 32 questions, gated 2.4.1, emulator-reviewed — see Ledger); P2 and P3 not authored. First Afrikaans subject in the framework.
> The 2026-10-10 note "Afrikaans FAL may not be created this exam season" (`language-setwork-shared-rules`) still stands as a
> scheduling constraint — this profile is groundwork.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"afrikaans_fal"` |
| Postgres tables | `lessons`, `questions` (`subject_id = "afrikaans_fal"`); texts in `english_texts` (shared registry — table name is historical, `SETWORK-TXT-02`) |
| Papers | `nov_p1` Taal in konteks (80, 2 h), `nov_p2` Letterkunde (70, **2½ h in 2025** though CAPS says 2 h), `nov_p3` Skryf (100, 2½ h). P4 (oral, 50 of the 300) is school-assessed — **not authored** |
| Curriculum document (`DESIGN-UNI-09`) | `files/afrikaans_fal/caps/CAPS FET _ FAL _ AFRIKAANS GR 10-12 _ WEB_9455.pdf` (KABV) |
| Source files | Nov 2025 P1, P2, P3: paper + memo, in `files/afrikaans_fal/` (P2 paper is the `(R)` reissue). No other year or diet supplied |
| Workflow | `workflows/generate/upload-afrikaans-fal.md` (drafted 2026-10-17, unproven until the first lesson) |
| `subjects` row | **Exists on dev** (seeded by backend V84): `id afrikaans_fal`, `name "Afrikaans FAL"`, `code AFRIKAANS_FAL`, `category afrikaans_lessons`, `sort_order 9`, **`capabilities {accents_af}`**, `min_app_version` **null**. **Updated on dev 2026-10-17 at the owner's request: `capabilities {accents_af, setwork}`, `min_app_version 2.4.1`, `updated_at` bumped.** Prod not checked (proxy down 2026-10-17); prod row is owner-gated |
| Curriculum / skills | None yet (0 nodes on dev). Seed file to create: `tools/seeds/afrikaans-fal-curriculum.json`. Namespacing and the `afrikaans_fal_` unit prefix are already in `tools/lib/curriculum.js`; **skill ids must be prefixed `afrikaans_fal_`** (global PK) |

## The language — everything Afrikaans-specific

**Stimulus, questions, options, explanations and `aiExplanation` are all written in Afrikaans** (`LANG-CTX-01`). Authored question text
mirrors the paper's register: instruction verbs in CAPS (`VOLTOOI`, `KIES die KORREKTE ANTWOORD`, `Gee die MEERVOUD`), "uit dié tussen hakies",
"Skryf net die letter". Spelling follows the current *Afrikaanse Woordelys en Spelreëls* (AWS) — a spelling-testing item is only authored
where the AWS gives one correct form.

### Keyboard — how the accent screen is invoked

**Two independent switches, both required:**

1. **Per question:** every `fitb` declares `keyboard_type: "text"` (`LANG-KB-01`, `KEYBOARD-04`). This selects the Text keyboard (and derives
   2.4.1, `VER-10`). The app would route a bare `afrikaans_fal` question to Text anyway, but the declaration is mandatory regardless.
2. **Per subject:** the **accent row is shown only when the subject has the `accents_af` capability** (`QuestionsViewModel` reads
   `SubjectCapability.ACCENTS_AF` from the cached subjects list; `TextKeyboard(showAccents=…)`). Nothing in the question can request it.
   `afrikaans_fal` has the capability on dev. The accents are on the **second ("123") screen**, not the letters screen.

Keys on that screen: `Ê Ë É È Ô Ö` / `Û Ü Î Ï Ä ŉ` (test tags `text_key_Ê` …, `text_key_ŉ`; letters `text_key_<UPPER>`, `text_key_switch`, `text_key_done`).
No shift, no long-press; marking lower-cases both sides, **accents are significant** (`leë` ≠ `lee`, `LANG-KB-02`).

**What the keyboard cannot type — author around it:**

| Gap | Where it bites | Rule |
|---|---|---|
| **No `á í ó ú à â`** (acute/grave). CAPS §3.4 lists *klemtekens (akuut/gravis)* under *Skryftekens*, and the papers print them for emphasis (`Dán`, `ná`, `nét`, `jóú`, `sélf`, `nóg`) | A typed item that asks for a stress-marked word, or whose answer would carry one | **Avoid them when phrasing questions**: do not ask for a stress-marked word, and keep stress-marked words out of typed answers. Where a topic genuinely needs them (klemtekens), the item is **`multiple_choice`**. Stress marks are optional emphasis, so store the plain form (`na`, not `ná`) in any typed answer that happens to contain the word — that is correct spelling, not accent-stripping (`LANG-KB-02` forbids stripping *required* diacritics only) |
| `'n` vs `ŉ` (U+0149) | Any answer containing the article | Store ASCII `'n` (apostrophe key is on the screen). If a typed answer must contain it, list `'n\|ŉ` so a student pressing the `ŉ` key is not marked wrong |
| Curly apostrophes / `ꞌ` (U+A78C) | PDF text extraction produces odd apostrophes (`geleiꞌt`, `ꞌꞌlasꞌꞌ`) | Normalise to ASCII `'` in everything authored; never paste extracted text unchecked |
| `ŉ` has no uppercase | none — marking lower-cases | none |

Required Afrikaans diacritics (`ê ë é è ô ö û ü î ï ä`) are all present, so no required word is untypeable. The validator's `text` inventory
(`tools/lib/feature-versions.js`) already includes exactly this set, and `resolveKeyboard('afrikaans_fal')` returns `text`. **It does not check
that the subject has `accents_af`** — a gap, see Open items.

### Typed answers — Afrikaans-specific cautions (`LANG-KB-03`, `LANG-ANS-01`)

- **The memo is lenient; the app is not.** P1 memo: "Eenwoord-antwoorde word as korrek aanvaar selfs al is die spelling verkeerd" and "Aanvaar
  dialektiese variasies". `fitb` is exact-match. So a `fitb` needs a **single AWS-correct form**; where several are genuinely valid
  list them with `|` (`skenkings|skenkinge`, `papnat|dolnat`); where spelling is ambiguous make it `multiple_choice`.
- **Compounds and linking sounds** (`afleweringswa`, CAPS "samestelling … verbindingsklanke"): one correct form only — author from the AWS, not from memory.
- **Syllable division** (`dank-baar-heid`): typed with the `-` key; hyphen is significant, so the question must say how to separate.
- **Sentence-level transformations** (past tense, passive, negation, reported speech, word order, conjunction-joining): a full sentence has too
  many valid wordings → `multiple_choice` or `ordering`, never `fitb` (`LANG-KB-03`). Single-word transformations (plural, diminutive,
  superlative, intensive form, compound, abbreviation spelled out, number in words, preposition) are `fitb`.
- Numbers in words: `twintig`, `sewe-en-twintig` (hyphens as the memo prints them) — one form only.

## Gating

Everything is **2.4.1** (text keyboard on every `fitb`, `VER-10`); with `setwork` added the subject row also carries `min_app_version 2.4.1`.
2.4.1 is covered by the 2.5.0 release, so the remaining prod preconditions are backend V83/V84 on prod (verify), the `subjects` row on prod
(owner), and the `accents_af` + `setwork` values on it. **Dev only until then.** Same BLA-62 text-pick caveat as English FAL for P2 testing.

## Allowed presentation types

`multiple_choice`, `multi_select`, `fitb`, `ordering`, `match` only (as the English language subjects). Question `type`: `definition` / `application`.
**Mix differs from English FAL:** P1 Section C is dominated by one-word grammar transformations, so `fitb` is the *primary* type there; the
sentence-level items and all open "motiveer / verduidelik" items are `multiple_choice`.

## Paper 1 — Taal in konteks (80 marks)

| Exam question | Marks | Items (Nov 2025) | Notes |
|---|---|---|---|
| Afdeling A Q1 Leesbegrip — Teks A artikel + Teks B grafiese teks | 30 | 1.1–1.16 (Teks A, 16 items), 1.17–1.22 (Teks B, 6 items) | Fill-in-from-paragraph (1.1), "kies uit dié tussen hakies" (1.4/1.18/1.20), matching (1.10), many open items. Visual-dependent: 1.16, 1.17–1.19, 1.21–1.22 largely depend on the photo/graph (`LANG-EX-03`) |
| Afdeling B Q2 Opsomming — Teks C | 10 | **seven wenke in own full sentences, ≤70 words** | Selection + rewording only (`LANG-SEC-02`); the written summary is not marked. Memo splits 7 facts + 3 language |
| Afdeling C Q3 Advertensie — Teks D | 10 | 3.1–3.9 | Includes spelling correction (3.1) and number-in-words (3.6) — both one-word, typed |
| Afdeling C Q4 Strokiesprent — Teks E | 10 | 4.1–4.7 | Mostly panel-dependent; 4.5 reported speech and 4.6 infinitive are sentence-level (MC) |
| Afdeling C Q5 Artikel en prent — Teks F, G | 20 | 5.1.1–5.1.14 (article, one skill per item), 5.2.1–5.2.6 (picture) | **14 of 20 are one-word or one-form grammar items (the other 6 are sentence rewrites)** — the richest typed-answer material in any language profile |

Lessons (proposal, applying the 2026-10-14 "3–4 questions per lesson, split along the exam's subsections" rule): Q1 Teks A, Q1 Teks B,
Q2, Q3, Q4, **Q5.1 (split in three) and Q5.2** → **7 lessons per year as first proposed; Q5.1 is now three lessons (5.1.1–5.1.5, 5.1.6–5.1.10, 5.1.11–5.1.14) under `DESIGN-UNI-17` → 9 lessons per year.** Name in Afrikaans as the paper prints it (`LANG-WR-01`): `"Vraag 3: Advertensie"`,
`"Vraag 5.1: Artikel"`. Labels `"Teks A"` … `"Teks G"` (`LANG-IMG-01`). Skills tested in Q5 and the exam's phrasing (e.g. *Verdeel … in LETTERGREPE*,
*HOMONIEM*, *INTENSIEWE VORM*) must stay within what the exam section tests (`LANG-EX-02`).

## Paper 2 — Letterkunde (setwork; 70 marks, answer TWO of four sections)

| Section | `section` value | Exam questions (Nov 2025) | Choice |
|---|---|---|---|
| A Roman | `novel` | Q1 *Kringe in 'n Bos* (Dalene Matthee); Q2 *Die Ongelooflike Avonture van Hanna Hoekom*; Q3 *Meeulanders* (Esta Steyn); Q4 *Lien se Lankstaanskoene* (Derick van der Walt) | **one of four** |
| B Drama | `play` | Q5 *Poppie – Die Drama* (Elsa Joubert & Sandra Kotzé); Q6 *Paljas* (Chris Barnard); Q7 *Fiela se Kind – Die Drama* (Dalene Matthee) | **one of three** |
| C Kortverhale | `short_stories` | Q8.1 "Kom ons stuur vir Tasu" (Maretha Maartens, 18); Q8.2 "Opdrag" (Rike Olivier, 17) | **both** |
| D Gedigte | `poetry` | Q9.1 "Krisis" (Elizabeth Eybers, 17); Q9.2 "Ken jy die see …" (Uys Krige, 18) | **both** |

- **Slots per year: 7 questions × 2 extracts (Teks A/B …) + 2 stories × 2 + 2 poems × 2 = 22 lessons** (`SETWORK-LES-03`; the stories and poems are split in two along their sub-question ranges under `DESIGN-UNI-17`, each has about nine distinct skills), none of them essay lessons. Extract
  labels run continuously (`Teks A` … `Teks N` for Q1–Q7, then the story and poem texts); poems `"Poem"` as English FAL.
- **Choice is much wider than English FAL** (4 novels, 3 plays vs 2 + 2). A student studies one novel and one play, so a given text only serves the
  students who chose it, yet every text needs coverage (`SETWORK-LES-02`). Scope decision owed — see Open items.
- Sub-question shape: 1.1 is a "voltooi die paragraaf" fill-in of 4 words (4 marks), then literal, inferential and device items, quotes with
  "kies tussen hakies", A–D MCQs, and a short substantiated opinion. **Practice questions follow `SETWORK-LES-05`** (fresh targets, `context_text` null,
  factual-basis `BK/P/M/PT` per question in the script header) — the same HL/FAL pattern. Book knowledge claims need a subject-expert check.
- **Texts (`SETWORK-TXT-03`): only titles printed in a supplied paper may be registered.** The 11 titles above are the whole supplied set. The
  National Literature Catalogue is not supplied; the CAPS says only "uit die Nasionale Letterkunde-katalogus" (Gr 12: 10 poems, etc.). Register them
  `section` `novel` / `play` / `short_stories` / `poetry`, ids snake_case of the title (`kringe_in_n_bos`, `poppie_die_drama`, `krisis`, …), authors as printed.
  `short_stories` rows must not reach prod before 2.4.1 is confirmed (the tool refuses).
- Poems and extracts carry Afrikaans typography the PDF extracts badly (apostrophes, `''` quote pairs, line numbers in the margin) — check each crop.

## Paper 3 — Skryf (100 marks, lessons per task)

| Section | Question | Marks | Words | Nov 2025 options |
|---|---|---|---|---|
| A Opstel | Q1 — one of 8 (5 titles + 3 pictures) | 50 | 250–300 | e.g. "Dít het ek by my maat(s) geleer", "Vryheid" |
| B Lang transaksionele teks | Q2 — one of 4 | 30 | 120–150 | 2.1 Vriendskaplike brief, 2.2 Dekbrief (formele brief + CV), 2.3 Huldeblyk, 2.4 Informele toespraak |
| C Kort transaksionele teks | Q3 — one of 3 | 20 | 80–100 | 3.1 Uitnodigingskaartjie, 3.2 Dagboekinskrywings, 3.3 Rigtingaanwysings |

Same structure as English FAL P3, with the essay split in two under `DESIGN-UNI-17` (1.1–1.5 title topics, 1.6–1.8 picture topics) → **9 lessons/year**, named as the paper names them (`"Vraag 2.2: Dekbrief"`). Rubric weights (memo): opstel
Inhoud en beplanning 30 / Taal, styl en redigering 15 / Struktuur 5; long text 18 + 12; short text 12 + 8 — state as plain facts, never invent scoring.
Afrikaans conventions to teach (`LANG-WR-03`, CAPS §3.3 text-type table): formal vs informal register (`u`/`jy`), aanhef and afsluiting for letters,
huldeblyk (formal, volle name, date of birth/death, family), toespraak (openings/closings), diary (date, first person), directions (imperative, bullet points
**in full sentences** — exam instruction), CV + cover letter. The P3 instruction "Vermy sms-taal" is a testable convention.

## Curriculum units (from CAPS §3.4 — seed file to be created)

| Unit | Exam home | CAPS source (topics) |
|---|---|---|
| `leesbegrip` | P1 A | literal/inferential/evaluative reading, vocabulary in context, figurative language, graphic texts |
| `opsomming` | P1 B | main vs supporting points, own-words rewording, point form |
| `visuele_tekste` | P1 C Q3–Q4 | advertensie, strokiesprent, kritiese taalbewustheid |
| `woordeskat` | P1 C | betekenisleer en figuurlike taal (sinonieme, antonieme, homonieme, idiome …), woordvorming (voor-/agtervoegsels, samestelling, afleiding), klankleer en spelling (lettergrepe, afkortings), skryftekens |
| `sinstrukture` | P1 C | selfstandige naamwoorde (meervoud, verkleining, geslag), byvoeglike naamwoorde (trappe, intensiewe vorme), voorsetsels, werkwoorde/tye, voegwoorde, ontkenning, aktief/passief, direkte/indirekte rede, woordorde, leestekens |
| `kritiese_taalbewustheid` | P1 C | gevoels-/manipulerende taal, vooroordeel, aannames, konnotasie, seleksie en weglating, skrywer se standpunt |
| `roman` / `drama` / `kortverhale` / `gedigte` | P2 | per-genre (karakter, intrige, tema, ruimte, stylmiddele …); texts identified by `text_key` |
| `opstel` / `transaksionele_tekste` | P3 | as English FAL (types: vriendskaplike brief, formele brief + CV, huldeblyk, toespraak, uitnodiging, dagboek, rigtingaanwysings, plus CAPS list: resensie, verslag, agenda/notule, advertensie, instruksies, poskaart, vorm) |

Unit ids `afrikaans_fal_<unit>`; topic/subtopic ids `…__topic__subtopic`. Slugs are my proposal (English slugs in `english-fal-curriculum.json` as the model) —
the seed file must be written and run by the first authoring session (`seed-curriculum.js` refuses without the subject row; it exists).

## Lesson shape and conventions

As `subjects/dbe-english-fal.md` §Lesson shape: `has_video: false`, `freemium_*` null; `aiExplanation` one entry per real exam sub-question with real
marks (`AIEXP-08`) — for P1 Q1 that is 22 entries for Teks A + B, and for Q5 the 1-mark items one each; `text_key` on every P2 lesson and question
(`SETWORK-LES-01`); essay and P3 lessons `supplementary_materials: null`. `aiExplanation` text is Afrikaans.

## Open items

1. **Subject row** — dev done (2026-10-17). Prod: owner creates/updates it after V83/V84 are verified there, with `accents_af` and `setwork`.
2. **Texts tool — resolved 2026-10-17:** `tools/create-english-text.js --subject afrikaans_fal` now records `english_texts.subject_id`; the 11 Nov 2025 titles are registered on dev with `prescribed_years ["2025"]`.
3. **Tooling gap — accent capability check:** no tool verifies that a subject whose typed answers contain `ê ë …` has `accents_af`; nor does the
   `text` inventory distinguish subjects. A preflight (subject capabilities include `accents_af` when an answer needs an accent) would prevent
   an unanswerable question on a build with a stale subjects cache. Note the app reads capabilities from the **cached** subjects list; `hasCapability` is `false` until loaded.
4. **Scope of P2 — decided 2026-10-17: cover all texts** (every novel, play, story and poem), per `SETWORK-LES-02`.
5. **Memo gaps** — P2 memo is present but not analysed here; only Nov 2025 exists, no 2024 or May–June papers; no P4.
6. **Subject-expert review** — Afrikaans spelling (AWS), the BK-led P2 questions and every multiple-choice distractor set need a first-language-level check; this
   author's Afrikaans is not a substitute for it.
7. **English `aiExplanation` (idea, 2026-10-17, not scheduled):** for non-HL (FAL) subjects, offer an English version of the AI explanations the student can switch to. Needs an app update (language toggle) and a contract/schema field for the second language; until then explanations are Afrikaans only. Applies equally to English FAL's counterpart concerns and other FAL subjects.
8. **Workflow doc** — `upload-afrikaans-fal.md` drafted; correct it after the pilot lesson.

## Ledger — Nov 2025 (2026-10-17)

| Paper | Lessons | Questions | Notes |
|---|---|---|---|
| `nov_p1` | 9 (Q1 Teks A, Q1 Teks B, Q2, Q3, Q4, Q5.1 ×3 by item range, Q5.2) | 41 (5/4/4/4/5/5/5/4/5) | `aiExplanation` one entry per real printed number (24+6+10+10+10+5+5+4+6 = 80 marks); 2.4.1 gate on dev; all 17 typed answers pass on the Text keyboard on the 2.4.1-dev01 emulator (incl. every `\|` alternative, `kliënte`, `20`, `va-kan-sie`) |

- Scripts `scripts/add-afrikaans-fal-2025-nov-p1-q1..7.js`; generator and review runner in `scripts/_gen/afrikaans-fal/` (hard-coded scratchpad/AMPM paths — adapt before reuse). Curriculum seed `tools/seeds/afrikaans-fal-curriculum.json` (6 units, 24 topics, 32 subtopics, 32 skills on dev).
- **Review gotcha:** AMPM's `review-capture-answers-text.js` taps keys on whichever screen is showing and never presses `text_key_switch`, so digits, hyphens and accents report `MISSING_KEY`. `answers-afr.js` switches screens (letters ↔ 123) per character; the accent keys' tags are `text_key_Ê` … (upper-case label). Poll for `question_feedback_*` (~1 s).
- **Validator rules hit on first run:** `exam_weight` must be 1–3; the correct MC option may not be clearly the longest (DESIGN-UNI-16) — Afrikaans distractors must be padded to similar length. Question names are `Vraag N`.
- **Q5.1 split (2026-10-17, `DESIGN-UNI-17`):** the first upload put all 14 one-skill items in one 5-question lesson and left nine skills unpractised; it was split into three lessons (orders 6–8, Q5.2 moved to order 9), every one of the 14 skills now has a practice question. The old lessons 6 and 7 were cleaned on dev (child rows soft-deleted / join rows removed) before the re-upload.
- Prod: nothing pushed. The prod `afrikaans_fal` row still needs `setwork` and 2.4.1 (owner).

### Ledger — Nov 2025 Paper 2 (2026-10-17)

| Part | Lessons | Questions | Notes |
|---|---|---|---|
| Novels Q1–Q4 | 8 (two extracts each: Teks A–H) | 40 | Part 1 = fill-in · tone · inner conflict · match · identify; Part 2 = device · meaning · order · false statement · themes |
| Dramas Q5–Q7 | 6 (Teks I–N) | 30 | same pattern; toneelaanwysings replace "device" in Teks N |
| Short stories 8.1, 8.2 | 4 (Teks O ×2, Teks P ×2) | 19 | each story split at its sub-question midpoint |
| Poems 9.1, 9.2 | 4 (Krisis ×2, Ken jy die see ×2) | 19 | annexure label `"Poem"` |

- **Total 22 lessons / 108 questions**; `aiExplanation` one entry per printed sub-question with the memo's marks (35 per question; 8.1 = 18, 8.2 = 17, 9.1 = 17, 9.2 = 18).
- **Facts policy:** no book knowledge was used. Every fact (names, events, quotes) is printed in the extract/poem tab, the exam paper or the memo (basis `P`/`M`/`X` in each script header; `X` = taken from the other half of the same exam question, asked as a different item). The BK expert check listed for English FAL is therefore not needed here, but the Afrikaans language check is.
- **Review (emulator 2.4.1-dev01):** all 108 questions rendered with the right question pages and extract tab; **14/14 typed answers pass** on the Text keyboard (including `kusvoëls` on the accent screen, `57` on the digits screen, `weird maria`, and the three `|` alternatives of `klowe|afgrond|moeras`). MCQ/multi-select/match/ordering submissions were not exercised.
- Generators: `scripts/_gen/afrikaans-fal/gen_afr_2025_p2_{novels,plays,stories_poems}.py`, crop plan `extract_p2.py`. Orders 15–18 reuse earlier image keys and carry a `v2_` file-name suffix (immutable image keys).
- **Known weaknesses to check with the team:** fresh targets lean on the extract and the exam's other half rather than the whole book (no BK), so deep-book coverage per text is thin; ordering/theme items re-use facts the exam asks in another format.

### Ledger — Nov 2025 Paper 3 (2026-10-17)

| Lessons | Questions | Notes |
|---|---|---|
| 9: `Vraag 1: Opstel (1.1–1.5)`, `Vraag 1: Opstel (1.6–1.8)`, 2.1 Vriendskaplike brief, 2.2 Dekbrief, 2.3 Huldeblyk, 2.4 Informele toespraak, 3.1 Uitnodigingskaartjie, 3.2 Dagboekinskrywings, 3.3 Rigtingaanwysings | 45 (5 each) | conventions-based (`LANG-WR-03`): order the parts, typed term, register/tone, features, purpose; every fact printed in the paper's instructions or the memo's marking guidelines (no invented scoring); `context_text` null, `supplementary_materials` null |

- **Images:** question image = the section instructions plus the task; memo images = the task's marking points plus the matching rubric page(s) (essay rubric pp. 19–20, long text p. 21, short text p. 22).
- `aiExplanation`: one entry per real task with its marks (essay lessons: one 50-mark entry per topic, `ai_choice` — the candidate answers one); text types one 30/20-mark entry each.
- **Review (emulator 2.4.1-dev01):** all 45 questions rendered (no annexure tab by design); **12/12 typed attempts pass** (`250`, `30`, `80`, `leestekens`, `uwe`, `verlede|verlede tyd`, `groet`, `datum|dag`, `bevelsin|bevelsinne`).
- Generator `scripts/_gen/afrikaans-fal/gen_afr_2025_p3.py`, crop plan `extract_p3.py`.
- Overall Nov 2025 on dev: **40 lessons / 194 questions** (P1 9/41, P2 22/108, P3 9/45).

- **P3 crop fix (2026-10-17):** the first cut of `Vraag 1: Opstel (1.1–1.5)` included the "Kies EEN van die volgende prente…" instruction that belongs to 1.6–1.8, so 1.6–1.8 showed pictures with no instructions. The instruction block starts at y=321 on page 3; lessons 1–2 were re-cut at y=318 and re-uploaded as `…_v2_…` files (immutable image keys). Check each lesson's image at a section boundary, not just the lesson's own content.

### Prod push — Nov 2025 (2026-10-17, owner-authorised)

- **Prod reference data:** `subjects` row `afrikaans_fal` created (`capabilities {accents_af, setwork}`, `min_app_version 2.4.1`, copied from dev minus the dev-only `hosted`/`syllabus_ids` columns that prod lacks, backend V84); the 11 `english_texts` rows created with `--subject afrikaans_fal` (the `short_stories` guard passed because 2.5.0 carries 2.4.1).
- **Papers:** `push-paper-to-prod.js` for `nov_p1`, `nov_p2`, `nov_p3` with `--allow-partial-exam` (the partial-exam guard fires when pushing one paper at a time; all three were pushed back to back). Lessons/questions landed **unpublished**: 40 lessons, 194 questions, 215+62+15 AI sub-questions, 208 image URLs all 200 on `media.askmoreprepmore.app`.
- **Exam gate:** applied on prod (`apply-exam-gate.js --env prod --apply`): `exam_versions` afrikaans_fal / dbe / 2025 / november = **2.4.1**; `updated_at` bumped on 40 lessons and 194 questions.
- **Pre-push check found a dev bug:** P1 lesson 5 listed `memo_3.png`, which does not exist (the memo has two pages). Fixed in the generator (`m=2`) and the dev row, then P1 was re-pushed. Run a HEAD check over every referenced image URL before a push.
- **Not yet done:** `--publish` (flip live) for each paper — held for the owner's go-ahead after the team and first-language Afrikaans review.
