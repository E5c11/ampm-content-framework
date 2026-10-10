---
id: AMPM-CONTENT-LANG
type: guide
layer: shared
related: [AMPM-CONTENT-DESIGN, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-SETWORK, AMPM-CONTENT-PIPELINE]
tags: [language, english, afrikaans, hl, fal, comprehension, summary, writing, keyboard]
provenance: created 2026-10-10 by extracting the subject-agnostic rules from `subjects/dbe-english-hl.md`, `core/authoring-principles.md` (`DESIGN-ENG-01`–`05`) and the Paper 1/Paper 3 + shared-page appendix of `workflows/generate/upload-english.md`, ahead of English FAL. Old IDs survive as aliases (see § Alias table).
---

# Language Subjects — Shared Authoring Rules

## Purpose and scope

Rules for any **language subject**: English HL, English FAL, Afrikaans FAL, and any later
language (Afrikaans HL, isiZulu, …). A language paper tests reading, summary, language
structure and writing against texts printed in the exam; the practice lessons mirror that.
These rules are the common core — a subject profile (`subjects/{profile}.md`) states only
what differs (paper list, section caps that deviate, curriculum units, the language itself).

Prescribed-text (setwork) papers are a separate concern: `shared/setwork.md`
(`AMPM-CONTENT-SETWORK`). Load both for a subject that has Paper 2-style literature.

### Applicability — new papers only (2026-10-10)

Every rule here binds **all papers authored from 2026-10-10**. Papers already authored
(English HL 2021, 2022, 2024, 2025 Nov …) predate these rules and are **retrofitted
later**; until then a validator or review finding against a pre-existing paper that traces
to a rule below is a known retrofit item, not an error to fix in passing. Never edit a live
(prod) paper to satisfy this doc without the owner's go-ahead (`KEYBOARD-06`).

---

## Exam mirroring

### `LANG-EX-01` — Theme rule

`enforced_by: human-review` · was `DESIGN-ENG-01`

Keep the same topic/theme as that year's exam text. Fresh stimulus is independently
authored but stays in the same world — different sentences, different quotes, same theme.
Exam content itself is never reused (`DESIGN-UNI-01`).

### `LANG-EX-02` — Structure rule

`enforced_by: human-review` · was `DESIGN-ENG-02`

Each practice question mirrors the *type* of the corresponding exam sub-question — same
instruction style, same mark implication, same cognitive skill. No new question types, and
for language-structure questions no grammar skill the exam section does not test.

### `LANG-EX-03` — Visual-dependent sub-questions are skipped

`enforced_by: human-review`

A sub-question whose answer depends on seeing a picture, layout, font or cartoon panel
(rather than on printed words) is not authored — practice questions must be answerable from
the question image(s) plus `context_text`. Record each skipped sub-question in the
Phase 1 analysis so the gap is visible.

---

## Stimulus and answers

### `LANG-CTX-01` — `context_text` usage

`enforced_by: human-review` · was `DESIGN-ENG-03`

Use `context_text` for a short inline stimulus (1–3 fresh sentences) when the question
needs its own independent passage; it renders in a card above the question text. Set it to
`null` when the question draws on `supplementary_materials` texts or stands alone. The
stimulus is written in the subject's own language (Afrikaans FAL stimulus is Afrikaans).
A question must not refer to "the passage", "the text above" or line numbers — a student
may meet it out of order, away from the exam page (`DESIGN-UNI-02`).

### `LANG-ANS-01` — `fitb` vs multiple choice

`enforced_by: human-review` · was `DESIGN-ENG-04`

Only use `fitb` when the answer is a specific, matchable string. Use `multiple_choice` for
open-ended questions ("explain the effect", "discuss", "comment on") — valid phrasings are
too varied to enumerate. Where several short answers are genuinely valid, separate them
with `|` in the answer element (`"private|secret|discreet"`). Write answers in standard
sentence case (matching is case-insensitive). Never pad a `fitb` with alternatives to catch
paraphrase — if you need that, the question is open-ended.

### `LANG-ANS-02` — Distractor explanations

`enforced_by: validator, human-review` · was a profile note (`AIEXP-05`)

Every `aiExplanation` solution gives the correct answer **and why each distractor is wrong**
(`core/ai-explanation.md`). One entry per practice question; `marks: null`.

### `LANG-ANS-03` — True/False ceiling

`enforced_by: human-review`

True/False questions are at most 20% of a lesson's set and test one rule or fact each
(`MC-*`). Prefer a four-option `multiple_choice` with plausible distractors.

---

## Section design (Paper 1-type, Language in Context)

Section **shapes** below are common to every language paper; which sections a given paper
has, and the mark weights, are the profile's. Caps are an instance of `DESIGN-UNI-11`.

### `LANG-CAP-01` — Default section caps

`enforced_by: human-review` · was `DESIGN-ENG-05`

| Section archetype | Max questions |
|---|---|
| Comprehension (one or two reading texts) | 7 |
| Summary | 2–4 |
| Visual text — advertisement | 2–4 |
| Visual text — cartoon / media | 2–4 |
| Language structures and conventions / editing | 7 |
| Writing paper — any one lesson | 7 |

A profile may tighten or loosen a cap with a reason (e.g. a section worth fewer marks in
that language). A lesson that bundles more real sub-questions earns more practice; never
fewer than one practice question per real, text-extractable sub-part (`DESIGN-UNI-11`).

### `LANG-SEC-01` — Comprehension

`enforced_by: human-review`

Fully self-contained questions, each with its own `context_text` (1–3 fresh sentences, on
the exam text's theme — `LANG-EX-01`). Mirror each exam sub-question's type: literal,
inferential, or device (identify → meaning → effect). Questions that depend on a graphic or
on layout are skipped (`LANG-EX-03`).

### `LANG-SEC-02` — Summary

`enforced_by: human-review`

A fresh passage on the exam summary text's theme. Test the sub-skills (main vs supporting
idea, best paraphrase, redundancy, selecting points), not the full summary task — the
student's own written summary cannot be marked. A FAL summary that asks for a list of N
points tests point-selection and rewording, not paragraph writing.

### `LANG-SEC-03` — Advertisement

`enforced_by: human-review`

Fresh **written** advert copy as `context_text`; text-extractable sub-questions only
(`LANG-EX-03`). Persuasive devices, target audience, word choice, intention.

### `LANG-SEC-04` — Cartoon / media

`enforced_by: human-review`

Fresh written dialogue or exchange as `context_text`; text-extractable sub-questions only
(reported speech, intention, effect of language, tone).

### `LANG-SEC-05` — Language structures and editing

`enforced_by: human-review`

`context_text` carries the specific error or feature, self-contained. Same grammar skill and
instruction format as the exam section; no new grammar skills. Edit/correct questions:
exactly one error per blank so the answer is unambiguous (`LANG-ANS-01`).

---

## Writing paper (Paper 3-type)

### `LANG-WR-01` — Lesson per writing task

`enforced_by: human-review`

One **essay** lesson plus one lesson **per transactional text type** the paper offers, each
named exactly as that year's paper names it (`"Question 2.3: Email"`). The paper's own
sections decide the count (HL: essay + six types; FAL: essay + longer transactional types
+ shorter transactional types — the profile records the exact slots). Where the paper
contains the same text type in more than one section, the lessons are distinct and say which
section they cover.

### `LANG-WR-02` — Essay lessons teach technique

`enforced_by: human-review`

Essay lessons cover planning, structure and argument — not a topic-specific answer. Rotate
contextual examples when reusing the same arc theory across years. Essay and writing
lessons carry `supplementary_materials: null` (except where a visual prompt is part of the
question, which is shown on the question image, not an annexure).

### `LANG-WR-03` — Format conventions per text type

`enforced_by: human-review`

Transactional-text lessons test the format conventions of that text type (layout, register,
salutations/sign-offs, required components) with a conventions-based question set; use
`context_text` sparingly.

---

## Images and extraction

### `LANG-IMG-01` — Labels match the exam

`enforced_by: human-review` · `PIPE-03`

Annexure labels are exactly the exam's own: reading texts `"Text A"`, `"Text B"` … in the
paper's own lettering. Essay and writing lessons: `supplementary_materials: null`.
`question_image_urls` holds only the numbered-question pages — never the TEXT body, `AND`
dividers, or extract headings.

### `LANG-IMG-02` — Shared-page crop rules

`enforced_by: human-review`

1. Each TEXT must be complete (heading, body, source attribution) — widen the crop or add
   the next page if cut off.
2. Two TEXTs on one page: crop apart with `--inspect`; neither annexure contains the
   other's content.
3. Multi-page TEXTs: include all pages (`"3-4"` or a second spec).
4. TEXT + questions sharing a page: the TEXT ends above the `QUESTIONS:` heading; the
   question image starts at it.
5. Rename annexure files distinctly per label before upload (`annexure_text_a_1.png`,
   `annexure_g_1.png`) — Storage uses the local filename.

Extract-specific crops (setwork extracts, Part 1/Part 2 splits, poems) live in
`shared/setwork.md` (`SETWORK-IMG-01`).

---

## Curriculum and lesson shape

### `LANG-CUR-01` — Curriculum vocabulary

`enforced_by: validator` (`--curriculum`)

Each language subject has its own units; IDs are namespaced `unit__topic__subtopic` because
topic names recur across units — author bare slugs, `content-rows.js` namespaces them, and
the name a question needs is the last `__` segment. Dump before authoring
(`dump-curriculum-vocabulary.js --subject <id>`), reuse a `skills` row before creating one
(`tools/create-skill.js --subject <id>`). Skills are subject-scoped rows but `skills.id` and
`curriculum_nodes.id` are **global primary keys**: a second language subject prefixes both with its
subject id (`english_fal_…` — units via `tools/lib/curriculum.js` `UNIT_PREFIX`; skill ids by hand).
A skill phrase may be reused across subjects only by creating a differently-prefixed row for each.

### `LANG-LES-01` — Language lessons usually have no video

`enforced_by: human-review`

`has_video: false`, `freemium_*: null`, `duration_seconds: null`, `marks: null` in
`aiExplanation` entries.

---

## Typed answers — keyboards and gating

### `LANG-KB-01` — Typed answers declare `text`

`enforced_by: validator` (`KEYBOARD-04`), `human-review`

Every `fitb` in a paper authored from 2026-10-10 declares `keyboard_type`. For a language
subject that is **`text`** (QWERTY + a digits/punctuation screen). The legacy `English`
keyboard (letters `A–Z`, `'`, space) is not a declarable value, and **no language subject
is exempt any more** — `english_hl` was the one legacy exemption in `KEYBOARD-04`; it is
gone (validator updated 2026-10-10; the 17 pre-rules HL scripts sit on the legacy allowlist
until retrofitted). A language subject declaring `text` derives **2.4.1** (`VER-10`), so a new
`english_hl` paper is gated per exam at 2.4.1, not 2.4.0. Old undeclared HL papers keep working.

### `LANG-KB-02` — Only type what the keyboard has

`enforced_by: validator` (`KEYBOARD-01`)

The `text` keyboard has no shift and no long-press; case is never significant. Afrikaans
(and any language with diacritics) shows its accent screen only for questions of that
language: `ê ë é è ô ö û ü î ï ä ŉ`. Accents are **significant** in marking (`leë` ≠ `lee`) —
store the accented spelling; never store an accent-stripped answer to make typing easier. A
trailing `. , ; ! ?` is stripped on both sides, so do not rely on it either way.

### `LANG-KB-03` — Keep typed answers short and unambiguous

`enforced_by: human-review`

A typed answer is one word or a short fixed phrase a student can spell from the stimulus.
If a correct answer would be a sentence, or has several valid wordings, make it
`multiple_choice` (`LANG-ANS-01`). Digits in an answer (a year, a figure) are allowed on
`text` — but the question must make the form unambiguous (`1999`, not `'99`).

### `LANG-GATE-01` — New language subjects are gated at 2.4.1

`enforced_by: tooling` (`feature-versions.js` `LANGUAGE_RELEASE`; the subject gate itself is `human-review`, `VER-10`)

A **new** language subject (English FAL, Afrikaans FAL, anything after) is gated by its
`subjects.min_app_version = 2.4.1`, the first build that has the setwork capability, the
free-form text section and the text-keyboard fixes for the new languages. This is the
*subject* gate; exam gates derived from content (`VER-09`) still apply on top, and the
higher of the two wins. A new paper in a language subject that already ships to older
builds (English HL) is gated by the **exam** gate only — and since it declares `text`, that
derives **2.4.1** too (`VER-10`). Net effect: every new language paper needs 2.4.1.
Do not push the subject, its texts, or its lessons to prod until 2.4.1 is tagged and
`ampm-backend` V83 is on prod (`SETWORK-GATE-01`).

---

## Alias table — old IDs

Old IDs remain valid references; rewrite them to the new ID when a doc is next touched.

| Old ID | New ID |
|---|---|
| `DESIGN-ENG-01` | `LANG-EX-01` |
| `DESIGN-ENG-02` | `LANG-EX-02` |
| `DESIGN-ENG-03` | `LANG-CTX-01` |
| `DESIGN-ENG-04` | `LANG-ANS-01` |
| `DESIGN-ENG-05` | `LANG-CAP-01` |
