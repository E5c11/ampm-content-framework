---
id: AMPM-CONTENT-SETWORK
type: guide
layer: shared
related: [AMPM-CONTENT-LANG, AMPM-CONTENT-DESIGN, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-PERSISTENCE]
tags: [setwork, prescribed-texts, english-texts, paper-2, literature, capability, picker]
provenance: created 2026-10-10 from the setwork-capabilities work (ampm-contracts 0.41.0; ampm-backend V83 on dev, not prod; app change merged to dev, not released) plus the Paper 2 material previously in `subjects/dbe-english-hl.md` and `workflows/generate/upload-english.md` (Phase 0 and the Paper 2 appendix).
---

# Setwork — Prescribed-Text Subjects

## Purpose and scope

A **setwork** subject has prescribed texts (novels, plays, short stories, poems) that the
student studies across the year and is examined on in a literature paper. The app gives
such a subject a custom screen and a text picker; this doc says what content must carry for
that to work. It is subject-agnostic: English HL today, English FAL and Afrikaans FAL next,
anything with prescribed texts later. Language-paper rules (comprehension, summary,
writing, keyboards) are in `shared/language-subjects.md`.

Binding for papers authored from **2026-10-10**; existing HL Paper 2 lessons are retrofitted
later (see `LANG` § Applicability). Where a rule below conflicts with how an HL Paper 2
already on dev was authored, the existing paper stands until its retrofit.

---

## The capability

**`SETWORK-CAP-01`** — `enforced_by: renderer`, owner-gated reference data

`subjects.capabilities` is a `TEXT[]` (backend V83, contracts 0.41.0
`SubjectResponse.capabilities`). The value **`setwork`** means "this subject has prescribed
texts and uses the setwork screen". Clients ignore values they don't know. Before this,
the screen was hardcoded to `english_hl`, `nov_p2` and sections `novel`/`drama`; none of
that is true any more:

- The screen is chosen by the subject's `setwork` capability, never by subject id.
- A Paper 2 needs the picker **if its lessons carry a `text_key`** — derived, not declared.
- The picker's sections come from the sections of the texts those lessons reference. There
  is no `nov_p2` or novel-plus-drama assumption.

A setwork subject that lacks the capability silently falls into the generic lesson screen.
Setting the capability on a `subjects` row is a reference-data write — hand it to the owner
(like creating the subject). `english_hl` is seeded `{setwork}`; `english_fal` and
`afrikaans_fal` need it added when their rows are created.

---

## Texts — the `english_texts` table

The table is named for English but is the single prescribed-text registry; lessons and
questions FK to it through `english_text_id` (authored as `text_key`). Columns: `id`, `name`,
`author`, `section`, `is_active`, `prescribed_years` (a record only).

**`SETWORK-TXT-01`** — `text_key` is per text, never per year or per marker. `enforced_by: db-constraint`
(FK) and validator preflight.
`"hamlet"`, `"cry_the_beloved_country"`, `"felix_randal"`. The old `"poetry"` marker is not
a row: a poetry lesson names the actual poem. Short stories, each its own text row, are
named the same way — the story, not `"short_stories"`.

**`SETWORK-TXT-02`** — Reuse before create. `enforced_by: human-review`
A text is one row regardless of how many subjects prescribe it. If English FAL and English
HL both prescribe *Macbeth* it is **one** `english_texts` row and both subjects' lessons
carry the same `text_key` (decision 2026-10-10). The picker is scoped by *the lessons a
paper actually has*, so FAL students see only the texts FAL lessons reference. Check first:
`psql -c "SELECT id, name, section, is_active FROM english_texts ORDER BY section, id"`.
Never create `macbeth_fal`. If a different edition or a different poem set truly differs,
that is a different text.

**`SETWORK-TXT-03`** — Titles come from a verifiable source. `enforced_by: human-review`
Use the title as printed in the exam paper or memo. The DBE National Literature Catalogue
(the real prescribed list) is not in CAPS; **until it is supplied, only titles that appear
in an exam paper or memo may be added** — do not infer a prescribed text from memory, and do
not backfill the catalogue by guessing. Record the source paper in the commit message when
adding a text.

**`SETWORK-TXT-04`** — Retire, never delete. `enforced_by: tooling`
`tools/create-english-text.js --retire <id>` sets `is_active = false`; its lessons stay in
the DB. `--reinstate` brings one back. `is_active` means "on the current prescribed list".

### Sections

**`SETWORK-SEC-01`** — `section` is a free-form string (VARCHAR(32) since V83; the contracts
enum is gone). `enforced_by: human-review`, tooling (`create-english-text.js` currently
limits it to `novel | play | poetry` — see Open items)

| Value | Used for | App label |
|---|---|---|
| `novel` | prescribed novel | Novel |
| `play` | prescribed drama | Drama |
| `poetry` | prescribed poems (seen poems) | Poetry |
| `short_stories` | prescribed short stories (FAL) | Short stories |

A new section value is lowercase snake_case, at most 32 characters, and used consistently
for every text in that section. Do not coin a new value where one above fits (`drama` is
not a value — it is `play`).

---

## Lessons and questions

**`SETWORK-LES-01`** — Carry the key on both. `enforced_by: validator`
Every lesson on a setwork literature paper carries `text_key`, and so do **all** of its
questions, with the same value. A language-in-context or writing paper's lessons have
`text_key: null`. A literature lesson with a null `text_key` makes the paper's picker
disappear for that lesson.

**`SETWORK-LES-02`** — Authored once per text, by text. `enforced_by: human-review`
Lesson sets are built per prescribed text so that every text a student might have chosen has
coverage. Do not assume the student's choice of texts: an "answer any two of four sections"
paper (FAL) means every option's text still needs its lessons. A text that appears in the
exam in several years accumulates lessons; check for existing coverage to avoid duplicates.

**`SETWORK-LES-03`** — Slots. `enforced_by: human-review`
Per paper, per year:
- **Contextual question on an extract pair** → two lessons (Part 1 / Part 2), one extract
  tab each.
- **Essay / long-form literature question** (where the paper has one — HL does, FAL does
  not) → one lesson, `supplementary_materials: null`.
- **Poetry** → one lesson per poem, the poem as a `"Poem"` annexure, `text_key` the poem's
  own id.
Slot counts per paper are the profile's (HL: 20/year; FAL: derived from the paper's
sections — it has no essay slots).

**`SETWORK-LES-04`** — Contextual sub-parts. `enforced_by: human-review`
Multi-part sub-questions ((a)–(d) or 1.1.1–1.1.5) are bundled in the lesson per
`DESIGN-UNI-10`/`11`: each real sub-part gets about one fresh practice question. Questions
are about the text's themes, characters, devices and structure and never reproduce the
extract (`DESIGN-UNI-01`). A `fitb` answer must be typeable on the subject's keyboard
(`LANG-KB-01`/`02`); character names with apostrophes and diacritics are fine on `text`.

---

## Images and labels

**`SETWORK-IMG-01`** — Extract labels and crops. `enforced_by: human-review`

- Contextual extracts are labelled `"Extract A"`, `"Extract B"` … in the paper's own
  sequence, **continuous across the whole paper** — verify against the actual paper. (HL 2021:
  A/B = Q7 Dorian Gray, C/D = Q9 Life of Pi, E/F = Q11 Hamlet, G/H = Q13 Othello,
  I/J = Q15 The Crucible.) Use whatever lettering the paper prints.
- Poetry: a single `"Poem"` annexure; question cropped from where the questions begin
  (`--inspect` for the pt value).
- Part 1 question image: below the first extract's closing citation (e.g. `[Act 1, Scene 3]`),
  ending above the `AND` line — the `AND` belongs to neither part.
- Part 2 question image: below the second extract's closing citation.
- Extract images: include heading and closing citation; exclude the sub-questions.
- Shared-page rules apply (`LANG-IMG-02`).

---

## Release gating

**`SETWORK-GATE-01`** — `enforced_by: human-review` (subject gate); exam gate by tooling (`VER-10`)

- `subjects.min_app_version = 2.4.1` on every **new** setwork language subject (English FAL,
  Afrikaans FAL …): the build with the capability-driven screen, derived picker, and
  free-form sections. Older builds decode the new payloads fine but **a text with a new
  section value breaks their English-texts sync**, so:
  - do not publish a text with a new section value (`short_stories`) to prod before 2.4.1;
  - keep the subject gated until then;
  - prod `ampm-backend` must have V83 before the app release.
- Current state (2026-10-10): V83 is on dev only; the app change is merged to dev, not
  released; no `english_fal` or `afrikaans_fal` content exists; `afrikaans_fal` is on dev
  but not on prod.
- A new setwork *paper* for a subject already live (English HL) adds no subject gate; only
  its content-derived exam gate (`VER-09`), which is 2.4.1 once it declares `text` (`VER-10`) —
  and no new section value until 2.4.1.

---

## Authoring checklist — a setwork lesson

1. Subject row has `capabilities ⊇ {setwork}` (owner-gated).
2. Every text the paper references exists in `english_texts` (`SETWORK-TXT-02`); new ones
   have a source paper (`SETWORK-TXT-03`) and a section value from the table.
3. Lesson and all its questions carry the same `text_key` (`SETWORK-LES-01`).
4. Extract labels continuous, crops per `SETWORK-IMG-01`.
5. Language rules for the question set: `shared/language-subjects.md`.
6. Gate: `SETWORK-GATE-01` before any prod step.

## Open items

- ~~`create-english-text.js` limited sections~~ — done 2026-10-10: any snake_case value, `--list`,
  and it refuses a non-legacy section (`short_stories`) on prod until 2.4.1.
- ~~Validator `SETWORK-LES-01`~~ — done 2026-10-10 (one text_key per script, on lesson and every question).
  It does not cross-check the section value of the referenced text.
- `english_texts` is English-named but is meant to be the registry for Afrikaans setworks too;
  renaming it is a backend change to schedule later. Afrikaans FAL may not be created this exam
  season (owner, 2026-10-10), so nothing depends on it yet.
