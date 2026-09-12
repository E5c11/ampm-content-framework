---
id: AMPM-CONTENT-SUBJ-DBE-HISTORY
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, history, dbe, profile]
---

# Subject Profile — DBE History (Paper 2)

Drafted 2026-09-12 from a paper review of `files/History P2 Nov 2025 Eng.pdf` +
`files/History P2 Nov 2025 Addendum Eng.pdf`, before any History content exists. **Paper 2
only, by founder decision 2026-09-12** — one profile doc covers History going forward, but
Paper 1 (a different set of CAPS topics under the same subject) is explicitly out of scope
for now, not just unsourced. Sections below are illustrative until a first paper is fully
authored and reviewed, the same evidencing discipline `dbe-chemistry.md` and
`dbe-geography.md` used for their own first drafts.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"history"` |
| Postgres tables | `lessons`, `questions` — `subject_id = "history"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'history'` — empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject history --out temp/curriculum-vocab.json` (Auth Proxy running) |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/caps_fet_history_gr_10-12_web_1.pdf` — required in-session before authoring, not optional (`DESIGN-UNI-08` names History as a content-based subject). Covers both papers; the Grade 12 topic tables for Civil Resistance (1970s–80s), Coming of Democracy/TRC, and End of the Cold War/New World Order are the P2-relevant sections — verify exact CAPS section numbers in-session, not assumed from this note |
| **Source files** | `files/History P2 Nov 2025 Eng.pdf` (question paper, 9pp), `files/History P2 Nov 2025 Addendum Eng.pdf` (source material, 14pp) |
| **Not yet sourced** | No marking guideline (memo) exists for this paper, unlike Chemistry/Geography's `... MG ...` files. Needed before authoring official answer keys or the synthesis-paragraph sub-questions' accepted-answer shape — treat as a session blocker until sourced, same severity as a missing curriculum document |
| `subjects` reference row | **Not yet created** — needs the same owner-gated direct insert as `geography`/`physics`'s rows before any authoring session (not something this framework creates itself) |
| Papers | `nov_p2` (Nov 2025) profiled now. `june_p2` presumed to exist once sourced, same pattern as every other subject |

## Paper structure (Nov 2025 P2, from paper review)

**150 marks on any one student's script, but 300 marks of content across the full
question bank — the defining structural difference from every subject profiled so
far.** The paper is SIX questions, and a student answers only THREE:

- **SECTION A — source-based** (Q1–Q3, 50 marks each): each question is built around
  four named sources (`1A`–`1D`, `2A`–`2D`, `3A`–`3D`) with 5–6 numbered sub-questions.
- **SECTION B — essay** (Q4–Q6, 50 marks each): a single essay prompt each, no sources,
  no sub-parts.
- Exam rule: at least one question from each section, the third question free choice
  from either.

| Q | Section | Marks | Topic | Sources |
|---|---|---|---|---|
| 1 | A | 50 | Civil Resistance 1970s–80s SA — COSATU worker mobilisation | 1A–1D: text extracts + a rally photograph |
| 2 | A | 50 | Coming of Democracy / TRC — Farisani amnesty case | 2A–2D: text extracts + a two-frame editorial cartoon |
| 3 | A | 50 | End of Cold War / New World Order — BRICS expansion | 3A–3D: text extracts + a GDP-share graph |
| 4 | B | 50 | Crisis of Apartheid in the 1980s (Biko/BCM) | none — essay only |
| 5 | B | 50 | Negotiated settlement, 1990–1994 | none |
| 6 | B | 50 | Gorbachev's Glasnost/Perestroika and Soviet collapse | none |

**Decision: author all six as separate lesson groups regardless of the exam's own
choice structure** — same reasoning every other subject already applies (cover the
curriculum comprehensively; a student practicing doesn't know in advance which three
they'll pick on the day, and the six topics are independent). The "marks covered ==
paper total" completeness cross-check other profiles use needs restating here: check
authored coverage against **300** (the full question bank), not the 150 a single
script carries.

Applying `DESIGN-UNI-10`: each Section A question's sub-parts share one continuous
four-source scenario, and the final sub-question in every case (see below) synthesizes
across *all four* sources — rule 1 (bundle), one lesson per question, not per source.
Each Section B question is a single self-contained prompt — rule 1 trivially, one
lesson per question. **6 lessons total** — the smallest lesson count of any subject
profiled so far, but each is unusually large (50 real marks; Section A lessons carry
~13–15 real sub-parts). `DESIGN-UNI-11` implies a correspondingly large practice set —
likely 8–10 practice questions per Section A lesson (compare Chemistry's largest
lesson: 22 marks → 5 practice questions).

## Source-based questions (Section A) — sources are real, fixed historical record

Sources here are real primary/secondary historical material — actual quoted testimony,
a real photograph, a real editorial cartoon, a real GDP graph. Inventing a "fresh"
quote or image and presenting it as historical fact would fabricate a false historical
record — a categorically worse failure than a plain `DESIGN-UNI-01` violation. Model
this on **English HL Paper 2's prescribed-text pattern**, not Geography's fresh-extract
pattern (agreed 2026-09-12, since Geography's content is generic scenario that *can* be
invented, and History's specific historical record can't):

- **`DESIGN-HIST-01` — same real source, fresh interpretive angle.** `enforced_by:
  human-review`. The real exam source — already the worked example under `DESIGN-UNI-01`'s
  existing allowance — is also what practice questions in that lesson are about, never a
  fabricated substitute. Freshness is satisfied the way English HL's prescribed texts
  satisfy it: genuinely new questions about the same real, fixed material — different
  parts of the source not already used by the exam's own numbered sub-questions,
  different analytical angles (reliability/utility to a historian, point of view,
  corroboration against another source in the same set, inference, contextualization) —
  never the exam's own stems or marks reused verbatim. Store a `source_key`-style
  reference, the same shape as English's `text_key`; whether that's a new reference
  table or a reuse of the existing image/supplementary-material path is a decision to
  make once a second paper is sourced and the reuse shape is clearer (`dbe-geography.md`
  used the same "wait for evidence" discipline for `geography_maps`).
- This paper's own sub-questions already model the reusable *skill* vocabulary well:
  quote/identify evidence, define a term in context, explain an inference, comment on a
  source's reliability/limitations/usefulness to a historian, explain symbolism
  (cartoons), compare two sources for corroboration. These map onto
  `multiple_choice`/`multi_select`/`match` far more than `fitb` — see the keyboard
  constraint below.
- **The final sub-question in every Section A question** (e.g. 1.6/2.6/3.6: "write a
  paragraph of about EIGHT lines … using the relevant sources and your own knowledge")
  is a synthesis mini-essay, not a short-answer item — same no-free-text-equivalent
  problem as Section B, resolved the same way (`DESIGN-HIST-02` below): decompose into
  an objective-format question testing the same synthesis skill (e.g. `multi_select`:
  which of these claims the sources actually support; `ordering`: sequence the
  argument's causal/logical structure), never asked as a written paragraph.

## Essay questions (Section B) — no free-text writing, same as English HL Paper 3

**`DESIGN-HIST-02`** — `enforced_by: human-review`. No free-text/essay input exists in
the app (the same constraint English HL Paper 3 and Geography's Section B map-skills
already resolved this way — `dbe-english-hl.md`, `dbe-geography.md`). Section B's three
prompts have no source material at all — teach the underlying essay-argument skill
objectively via `multiple_choice`/`multi_select`/`ordering`: identifying or sequencing
supporting evidence for a line of argument, distinguishing a strong thesis from a weak
one, structuring a paragraph (topic sentence → evidence → analysis → link), evaluating
a counter-argument. Never ask the student to produce the essay itself.

## Keyboard constraint — `fitb` is numeric-only for this subject (app limitation)

Investigated 2026-09-12 in `ampm-kmp` (`AMPM/.../KeyboardResolver.kt`): History has no
entry in `KeyboardResolver.resolve()`, so it falls through to `else ->
QuestionKeyboardType.None` — the real OS system keyboard, same as Geography gets today.
**That looks like the safe default but isn't, for `fitb` specifically**:
`FillInTheBlank.kt` never threads a `keyboardType` through to `DynamicTextInput`
(`core/designsystem/.../TextInputs.kt`), whose own default is `KeyboardType.Decimal` —
numeric-only, no letters, on any platform. Never surfaced before because English's
`fitb` uses its own custom `EnglishKeyboard` component (bypasses this path entirely)
and Geography's `fitb` answers happen to already be purely numeric (scale ratios).

**Decision 2026-09-12 — content-side constraint, no app fix scoped for now:**

- **`DESIGN-HIST-03`** — `enforced_by: human-review`, extends `core/keyboard-input.md`'s
  `KEYBOARD-01`/`KEYBOARD-02` the same way `DESIGN-CHEM-01` did for Chemistry's own
  app-limitation-driven constraint: **no `fitb` blank in History may require a letter.**
  Reserve `fitb` for genuinely numeric/date answers this paper's own sub-questions
  already show plenty of (a year — "when did the first BRIC summit take place?", a
  count — "name the FOUR countries", a percentage — GDP share figures). Any answer that
  is a name, term, quoted phrase, or place — the majority of this paper's natural
  short-answer shape — uses `multiple_choice`/`multi_select`/`match` instead (e.g.
  "define the term X" becomes a best-definition multiple-choice; "quote evidence that
  Y" becomes select-the-correct-quote from options).
- This is a real, narrow app gap, not a permanent design preference — revisit if the
  app-side fix (threading a text-capable `KeyboardType` from `KeyboardResolver` down to
  `DynamicTextInput`) is ever scoped. Until then, treat it as load-bearing the same way
  `DESIGN-CHEM-01` is: a content-authoring rule that must actually block a letter-based
  `fitb` from shipping, not just a note.

## App-side navigation — no separate work needed

Investigated 2026-09-12 in `ampm-kmp` (`~/StudioProjects/AMPM`, `dev`). `ExamPaperScreen`
(`feature/exam-paper`) is already a fully generic, subject-agnostic no-video/
paper-as-primary-content screen, and `WatchNavigation.kt` already routes any subject's
`hasVideo: false` lesson there today (Maths/Physics/Chemistry lessons without a video
already use it). English is the *only* subject that bypasses this generic path — one
hardcoded check in `CoursesNavigation.kt` (`subject ==
SubjectMapper.ENGLISH_HL_FIRESTORE`) — because English alone needs prescribed-text
switching (`text_key`, the "Switch your [section] text?" dialog). History has nothing
to switch between (sources are fixed per sitting, not swapped between recurring
texts) — author lessons with `has_video: false` and they flow through the existing
generic screen automatically. **No app code to write for routing.**

`min_app_version` gating (`subjects.min_app_version`) is also already fully wired
end-to-end (see `dbe-chemistry.md`/`dbe-physics.md`'s own use of it) and available if a
rollout gate is ever wanted, but — unlike Chemistry/Physics — nothing here actually
requires a client fix first, so it's optional rollout hygiene, not a blocking gate.

## Allowed presentation types (illustrative, not yet evidenced against authored content)

Expect `multiple_choice`/`multi_select`/`match`/`ordering` to dominate, driven directly
by `DESIGN-HIST-03`'s numeric-only `fitb` constraint — this paper's natural
short-answer shape (define, quote, name, explain symbolism, comment on reliability) is
almost entirely textual. `fitb` reserved for the minority of genuinely numeric
sub-questions (years, counts, percentages). No MathText; `fraction`/`equation`/`steps`
not used — nothing in this subject is symbolic/numeric-procedural. Question `type`
vocabulary: `definition`, `interpretation` (source reading, reusing Geography's sense
of the term rather than inventing a new one), `application` (synthesis/argument
evaluation).

## Subject rules (beyond core)

- **Content-based subject (`DESIGN-UNI-08`)**, explicitly named there alongside
  Geography/Life Sciences/Chemistry. Historical facts (causes, dates, key figures,
  sequences of events) have a small fixed answer space — reword-only freshness doesn't
  satisfy `DESIGN-UNI-01`. Prefer relational framing (causal chains, comparison between
  periods/movements, "what changed between X and Y") grounded in the curriculum
  document (`DESIGN-UNI-09`).
- Tags: historical concepts/events/figures only, never invented scenario wrappers —
  same discipline as Geography's `PIPE-06`.

## Curriculum units (reference until a curriculum collection exists)

From this paper's own three Section A / three Section B topics, all Grade 12 CAPS
content: `civil_resistance_1970s_80s` (COSATU, Black Consciousness Movement, crisis of
apartheid), `coming_of_democracy` (negotiations 1990–94, TRC/coming to terms with the
past), `end_of_cold_war_new_world_order` (1989 events, Gorbachev/Glasnost/Perestroika,
BRICS/Global North–South realignment). Illustrative only — the real set comes from the
Phase 3.5 vocabulary dump once a first session populates it (`PIPE-08`), same as every
other subject.
