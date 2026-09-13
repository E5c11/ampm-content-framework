---
id: AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY, AMPM-CONTENT-SUBJ-DBE-LIFE-SCIENCES]
tags: [subject, business-studies, dbe, profile]
---

# Subject Profile — DBE Business Studies (Paper 2)

Drafted 2026-09-13 from a paper review (`Business Studies P2 Nov 2025`) plus the relevant
CAPS sections, before any Business Studies content has been authored — same illustrative
status `dbe-chemistry.md`/`dbe-life-sciences.md` had at their own first draft, and same
motivating constraint: drafted deliberately *without* requiring any app change, per the
user's own call to make no app updates this close to prelims (see `physics-p2-prelims-
timeline` — prelims begin 2026-09-14). **Paper 2 only.** Business Studies' four CAPS
topics are split 2+2 across its two papers (see Identity/Curriculum units below); Paper 1
covers different topics entirely and will need its own paper review before this profile
can say anything about it.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"business_studies"` — not yet a live `subjects` row (see below); derived from the app's own `SubjectMapper.kt` fallback (`displayName.lowercase().replace(" ", "_")` — `"Business Studies"` → `"business_studies"`), the same no-constant-needed mechanism Geography/Life Science already rely on. **No `SubjectMapper.kt` change needed.** |
| Postgres tables | `lessons`, `questions` — `subject_id = "business_studies"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'business_studies'` — empty, no rows exist yet. Populate via `tools/create-curriculum-node.js` / `create-skill.js` (`PIPE-08`) once authoring starts |
| Papers | `nov_p2` (2025) reviewed for this draft, not yet authored. `june_p2` presumed once a June-diet paper is sourced |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ BUSINESS STUDIES _ GR 10-12 _ Web_0CA7.pdf` — Grade 12's four-topic weighting table at Section 2.1 (physical p. 8), Grade 12 Annual Teaching Plan at Section 3.2.6 (physical pp. 33 onward). Both consulted for this draft. Required in-session before authoring, not optional (Business Studies is content-based, see below) |
| **Source files** | `files/Business Studies P2 Nov 2025 Eng.pdf` (question paper, 9pp, 150 marks), `files/Business Studies P2 Nov 2025 MG Eng.pdf` (marking guideline, 32pp) — already in `files/`, matching the other subjects' convention |
| `subjects` reference row | **Does not exist yet** — confirmed by querying dev Postgres directly 2026-09-13 (`SELECT ... FROM subjects` returns no `business`-matching row; current rows: `math_lit`, `english_hl`, `maths`, `physics`, `life_science`, `geography`, `history`, `sort_order` 1–7). Needs an owner-gated insert before authoring can go further than typed drafts, same one-time step Geography's/Life Science's rows each needed — not part of the routine per-lesson upload pipeline, and **not an app-code change** (a `subjects` table row, not a release). Next free `sort_order` is 8. `is_active`/`min_app_version` should follow the same two-flag discipline `dbe-life-sciences.md` documents (both needed for full onboarding visibility on current app builds) — but per the user's own no-app-updates-before-prelims call, don't activate this in prod until after prelims regardless of when dev authoring happens. |

## Paper structure (Nov 2025 P2, from paper review)

**150 marks across 3 sections, 6 questions**, matching the paper's own mark/time table
exactly:

| Section | Question(s) | Choice | Marks | Shape |
|---|---|---|---|---|
| A (compulsory) | Q1 | — | 30 | Q1.1 MCQ (5×2), Q1.2 fill-in-the-word-from-list (5×2), Q1.3 match-the-column (5×2) |
| B | Q2 (Business Ventures), Q3 (Business Roles), Q4 (Miscellaneous — both topics) | answer ANY TWO of three | 40 each (80 total) | Direct/indirect short-structured items, 7–9 independent sub-questions per question, several built around a short scenario |
| C | Q5 (Investment: Insurance), Q6 (Human Rights/Inclusivity/Environmental) | answer ANY ONE of two | 40 each (only 40 counted) | Essay, each with 3–4 explicit bullet-point "aspects to include" |

Only the first two Section B questions and the first Section C question a candidate
answers get marked (per the paper's own instructions) — mirrors `DESIGN-UNI-10`'s
"independent cluster" shape at the *question* level, not just sub-question level: any
subset of the offered Section B/C content is a complete, valid selection, so authored
lessons should not assume a student needs all of Q2/Q3/Q4 or both Q5/Q6.

Real sub-question shape (Section B, representative): most items are one-off, topically
unrelated asks (list/name/explain/discuss on a single concept, 2–6 marks) — a much finer
grain than Life Science's or Geography's clustered MCQ blocks. A recurring paired pattern
worth naming directly: **"quote TWO from the scenario" immediately followed by "explain
OTHER \[aspects/causes/ways\]"** (Q2.6.1→2.6.2, Q3.3.1→3.3.2, Q3.5.1→3.5.2, Q4.8.1→4.8.2)
— the second sub-part is only correctly scoped if it excludes what the first already
named, a genuine `DESIGN-UNI-13` linked-lesson dependency, not just shared-scenario reuse.

## Keyboard — same shape Life Science/Geography already established, verified again here

`business_studies` isn't in `KeyboardResolver.resolve`'s routing table (`AMPM/feature/
watch/.../KeyboardResolver.kt` — confirmed by reading the current source 2026-09-13, not
assumed from the other profiles), so it resolves to `QuestionKeyboardType.None` — same as
Geography and Life Science, and **exactly the limitation the user already expected going
in**: `fitb`/`fraction` fall back to the device's real system keyboard (`suppressSystem
Keyboard = false` for `None`-routed subjects), but `FillInTheBlank.kt` always requests
`KeyboardType.Decimal` regardless of subject, so only a bare-numeric answer is reliably
typeable — no app change needed to ship that. `steps`/`equation` have no system-IME
fallback at all and are genuinely unanswerable for a `None`-routed subject; not relevant
here anyway (see below).

**Unlike Life Science, this constraint barely matters for Business Studies** — the real
paper's only arithmetic content (Q1.1.1, simple-interest calculation on a R30 000
investment) is already an MCQ, not a typed answer, and nothing in Sections B/C requires a
number as the expected response at all. **`DESIGN-BUS-01`** — `enforced_by: human-review`:
default to `multiple_choice` for any numeric-literacy content this subject needs,
matching the real exam's own evidenced shape, rather than introducing a `fitb` numeric
blank the exam itself never uses. If a future paper does require a typed numeric answer
(a percentage, a Rand amount), keep it bare-numeric per `KEYBOARD-02` with the `R`/`%`
token split out into `metadata` as a given, same as Physics's unit convention — but don't
assume this is needed until a paper actually evidences it.

## No physics/chemistry-style symbol problem — the real finding here

The user's question going in was whether Business Studies has anything like Physics'/
Chemistry's symbol-notation problems (subscripts, special glyphs, formula markup). **It
does not, and by a wide margin — this is the least symbol-dependent content-based subject
profiled so far.** Confirmed against the full Nov 2025 P2 paper and memo:

- No MathText markup, no fractions/roots/exponents anywhere in the source paper.
- The only quasi-symbolic tokens are the Rand sign (`R`, a plain ASCII letter, not a
  special character — `R30 000`, space-separated thousands, no decimal places) and `%` —
  both typeable on any keyboard and renderable as plain text, no `core/mathtext.md` rule
  implicated.
- Content is acronym-heavy (JSE, CSR, CSI, LRA, BCEA, EEA, COIDA, SDA, SWOT, PESTLE, King
  Code) but every one is a plain-text term, fine in `multiple_choice`/`match` option text
  with no rendering concern — this is a vocabulary-breadth issue for curriculum coverage,
  not a keyboard/markup one.
- The marking guideline's own preamble explicitly instructs markers to accept "a
  different expression," "another credible source," or "a different approach" as correct
  — i.e. **this subject has no single canonical correct phrasing to author a typed answer
  against**, which is a bigger authoring constraint than any symbol set would be (see
  `DESIGN-BUS-02` below).

## Essay questions (Section C) — same no-free-text approach as English HL Paper 3 / History Section B, and better-grounded than either

Yes — Business Studies can, and should, get essay-theory/strategy lessons the same way
`dbe-english-hl.md` (Paper 3, Q1 Essay) and `dbe-history.md` (`DESIGN-HIST-02`, Section
B) already do: no free-text essay input exists anywhere in the app, so the underlying
essay skill is taught **objectively**, via `multiple_choice`/`multi_select`/`ordering`
questions about how to plan and structure the essay — never by asking the student to
produce the essay itself.

**`DESIGN-BUS-03`** — `enforced_by: human-review`. One lesson per Section C question (Q5
Insurance, Q6 Human Rights/Inclusivity/Environmental — 2 lessons, vs. History's 3),
matching History's precedent: each lesson's practice set mixes (a) fresh content-recall/
application items on that essay's own bullet-point aspects (`DESIGN-BUS-02` handles these
— genuine CAPS sub-topics, not artificial splits) with (b) essay-strategy items grounded
directly in the marking guideline's own documented rubric, not an inferred one.

**Business Studies is unusually well-suited to this, more so than English/History**: the
Nov 2025 memo (§15.1–15.6) spells out an explicit, named **LASO rubric** for every
Section C essay — 32 marks for content (Introduction + one block per bullet aspect +
Conclusion) and 8 marks for "Insight," broken into four 2-mark components:

| Component | What it tests | Mechanical rule a question can test directly |
|---|---|---|
| **L**ayout | Is there a stated Introduction, per-aspect paragraphs, and a stated Conclusion? | The literal words "INTRODUCTION"/"CONCLUSION" must appear or layout marks are forfeited outright; a verbatim textbook definition used as the intro/conclusion earns nothing; content must not repeat between intro/body/conclusion |
| **A**nalysis/interpretation | Did the candidate break the prompt into headings/subheadings matching what's actually asked? | All of the prompt's given bullet aspects must become their own heading — this essay type hands the candidate its own outline (unlike History's open thesis prompts), so this skill is "faithfully turn the given bullets into structure," a more mechanical, more objectively-testable skill than History's implicit-thesis-identification one |
| **S**ynthesis | Are the facts actually relevant to what was asked? | ≥50% of the aspects answered with only relevant facts scores full marks; irrelevant/padding content scores partial or zero, independent of length |
| **O**riginality | Is there a real, current example (≤2 years old) in at least 2 of the aspects? | Distinguishes a bare textbook definition from an applied, dated, named real-world example — directly testable as multi-select ("which of these would earn an Originality mark?") |
| Also structural | — | The Introduction must address ≥2 of the essay's 4 aspects; the Conclusion must address ≥1 |

Worked examples of the objective item shapes this supports (no free text anywhere):
- `ordering`: sequence a sample essay's paragraph plan (Introduction → Aspect 1 → Aspect
  2 → Aspect 3 → Aspect 4 → Conclusion) against the actual bullet order the real prompt
  gives — teaches Analysis/interpretation directly.
- `multiple_choice`: "Which opening correctly earns Layout marks?" — one option states
  the word INTRODUCTION and addresses two aspects in the candidate's own words; distractors
  omit the word, quote a definition verbatim, or address only one aspect.
- `multi_select`: "Which of these would earn an Originality mark?" — correct options name
  a specific, dated (≤2 years), real business/law/event; distractors give a correct but
  generic, undated textbook definition.
- `multiple_choice`: mark-budget awareness — "Out of an essay's 40 marks, how many come
  from Insight rather than content?" (8) — helps a student allocate writing effort/time
  correctly, the same purpose English HL's/History's essay-strategy items serve.

Same `aiExplanation` convention as History's Section B: **one** guidance entry per lesson
(`marks: 40`), summarising the memo's own aspect breakdown and the LASO rubric as approach
guidance — never a model essay. `question`/`context_text`/options must never quote the
memo's actual model-answer prose verbatim (mirrors `DESIGN-BUS-02`'s no-canonical-wording
point) — paraphrase the *rubric mechanics*, which are fixed and citable, not the sample
content, which the memo itself says is only one of many acceptable answers.

## Allowed presentation types

`multiple_choice`, `multi_select`, `match`, `ordering` — illustrative until evidenced
against authored content, same caveat every first-draft profile carries. `ordering` is
expected to see real use here specifically for essay paragraph-structure sequencing
(`DESIGN-BUS-03`), beyond the general-purpose role it plays elsewhere. `fitb` stays
available only for the rare bare-numeric case per `DESIGN-BUS-01` (not load-bearing —
the real paper never needs it). `steps`/`equation`/`fraction` excluded: nothing in this
subject is procedural/algebraic in the way Maths/Physics/Chemistry are, independent of
the keyboard gap.

## Subject rules (beyond core)

- **`DESIGN-BUS-02` — the most heavily discursive content-based subject profiled so far,
  more than Geography/Life Sciences/History.** `enforced_by: human-review`. 110 of 150
  marks (Sections B + C) are indirect/essay questions marked against a non-exhaustive
  guideline that explicitly accepts alternate phrasing (see above) — there is no fixed
  string a typed answer could reliably match. Every one of these must decompose into
  `multiple_choice`/`multi_select`/`match`/`ordering` against the marking guideline's own
  *listed points* (each bullet/mark becomes a distinct option), never an open free-text
  recall — this extends `DESIGN-UNI-08`'s relational-framing rule with a stronger, more
  literal reason: it isn't just that rewording fails to create fresh work, it's that there
  is no canonical wording to author a match key against in the first place.
- **Essay questions (Q5/Q6) decompose along their own stated bullet points, which map
  directly onto CAPS's own topic subdivisions** — e.g. Q5's "insurance vs. assurance /
  three types of compulsory insurance / advantages of insurance / utmost good faith &
  insurable interest" are four separably-testable CAPS sub-topics already, not an
  artificial split invented for lesson-sizing. One lesson per essay question (not one
  lesson per bullet) mixing content items on these bullets with essay-strategy items —
  see `DESIGN-BUS-03` below for the full essay-lesson design.
- **"Quote from the scenario" sub-questions are closed-set, not open recall.** Q2.6.1,
  Q3.3.1, Q3.5.1, Q4.8.1 all ask the candidate to identify specific stated items from a
  short given scenario — model these as `multiple_choice`/`multi_select` over
  candidate items drawn from (and distractors adjacent to) the scenario text, not `fitb`
  free recall; there's no meaningful "typing" skill being tested here, unlike a genuinely
  open short-answer term.
- **Immediately-following "explain OTHER \[X\]" sub-questions are linked, per
  `DESIGN-UNI-13`.** The pairing named in the paper-structure section above (2.6.1→2.6.2,
  3.3.1→3.3.2, 3.5.1→3.5.2, 4.8.1→4.8.2) is a real dependency — the second sub-part's
  correct-option set must exclude whatever the first sub-part's authored correct answer
  already named, or the pair no longer tests what the real exam tests (avoiding
  repetition). Decide per lesson per `DESIGN-UNI-13`'s own test, but expect this shape to
  recur often in this subject specifically.
- **Section B/C's "answer ANY N of M" choice structure is itself a `DESIGN-UNI-10`-style
  independence signal** — Q2/Q3/Q4 (and Q5/Q6) are graded as alternatives, not a
  cumulative set. Don't author a lesson that assumes knowledge of, or references, another
  optional question's content; each of the six real questions should stand fully alone
  the way the exam itself requires.
- **Currency/percentage formatting**: `R` + space-separated thousands, no decimal comma
  (`R30 000`, not `R30,000` or `R30.000`) — follow the real paper's own convention in any
  given/context text or option text.

## Curriculum units (Grade 12, CAPS Section 2.1/3.2.6 — Business Venture + Business Role only, Paper 2's scope)

Four CAPS topics are each weighted 25% of the subject overall; Business Studies splits
them 2+2 across its two papers — **Business Venture** and **Business Role** are this
paper's scope (confirmed by the real paper's own section headers: Q2/Q5 "BUSINESS
VENTURES", Q3/Q6 "BUSINESS ROLES", Q4 both). Business Environment and Business Operation
belong to Paper 1 and are out of scope here — don't assume they carry over.

**Business Venture, Grade 12 annual-plan slice** (the fuller CAPS topic list also
includes Entrepreneurship, Business Plan, Forms of Ownership, Contracts, Business
Location — largely Grade 10/11 foundational content, recapped rather than newly
examined at Grade 12 per this paper's own evidence): **Management and Leadership**
(Term 2 — leadership styles/theories behind Q1.2.1, Q2.4, King Code links; management
criteria behind Q2.8, Q4.3); **Investment: Securities** and **Investment: Insurance**
(Term 3 — JSE/RSA Retail Savings Bonds behind Q2.3/Q2.7, insurance concepts/principles
behind Q2.2/Q5, non-insurable risks behind Q4.1); **Presentation of business
information** (Term 3 — multimedia-presentation factors behind Q2.6/Q4.5).

**Business Role, Grade 12 annual-plan slice**: **Ethics and professionalism** (Term 1 —
King Code principles behind Q3.3, professional/unprofessional practice behind Q1.1.3,
unethical pricing behind Q4.9); **Creative thinking** (Term 1, recap + Term 1 macro-
strategy problem-solving techniques — force-field analysis/Delphi technique/nominal group
technique behind Q1.2.4/Q3.7, problem-solving steps behind Q3.1, creativity-enabling
environment behind Q4.8); **Corporate social responsibility** and **Human Rights,
Inclusivity and Environmental issues** (Term 2 — CSR advantages behind Q3.6, CSI focus
areas behind Q4.6, socio-economic issues (HIV/Aids) behind Q1.1.5, human
rights/diversity/environment essay Q6); **Team performance and conflict management**
(Term 2 — team development stages behind Q1.1.4, team dynamics/diversity behind Q3.2/
Q4.7, communication behind Q3.4, grievances/conflict behind Q1.3.5/Q3.5).

(Illustrative only — the real, current curriculum-node set comes from the first
authoring session's vocabulary dump, `PIPE-08`, same as every other subject.)

## App-side status — no app change needed to author, unlike Life Science

Unlike Life Science (which needed its own keyboard-routing check before typed content was
safe), Business Studies needs **no app-side work at all** to start authoring within this
profile's constraints:

- **`SubjectMapper.kt`**: no change needed — the fallback branch resolves
  `"Business Studies"` → `"business_studies"` correctly (verified by reading the source
  2026-09-13).
- **`KeyboardResolver.kt`**: no route for `business_studies` — resolves to `None`, same as
  Geography/Life Science. Per `DESIGN-BUS-01`, this doesn't block anything this subject's
  real content actually needs (no `steps`/`equation` content, and the one numeric item
  evidenced is already MCQ-shaped).
- **`subjects` row**: does not exist yet (see Identity above) — a data-only insert, owner-
  gated the same way Geography's/English's rows were, not an app release. Can happen
  whenever the owner is ready; doesn't need to wait for the post-prelims app-fix window
  the way `dbe-life-sciences.md`'s keyboard-routing gap does.

## Still open

No lessons authored yet. `nov_p2` is reviewed only (this draft); authoring, validation,
upload, and a full `review-paper.md` pass all remain, same as every subject's own first
pass. `june_p2` unsourced. Paper 1 (Business Environment + Business Operation) needs its
own source files and its own profile section before it can be authored at all.
