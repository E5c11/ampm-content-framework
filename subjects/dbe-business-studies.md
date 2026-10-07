---
id: AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY, AMPM-CONTENT-SUBJ-DBE-LIFE-SCIENCES]
tags: [subject, business-studies, dbe, profile]
---

# Subject Profile — DBE Business Studies (Papers 1 and 2)

**Paper 2** was drafted 2026-09-13 from a paper review (`Business Studies P2 Nov 2025`) plus the
relevant CAPS sections, then authored, reviewed and published (ledger below). **Paper 1 was
analysed 2026-10-07** from `Business Studies P1 Nov 2025` (paper + memo) and the full CAPS Grade 12
annual teaching plan — **analysed, not authored**: the P1 sections below are a first draft in the
same illustrative status P2 had before authoring. Business Studies' four CAPS topics are split 2+2
across its two papers: **P1 = Business Environment + Business Operation, P2 = Business Venture +
Business Role** — now confirmed against both real papers' own section headers, not just CAPS.

The **keyboard** guidance was rewritten 2026-10-07 for the 2.4.0 total-keyboard decision
(`core/keyboard-input.md` § Routing); the P2 ledger describes work done before that and keeps its
original wording as history. The headline finding for this subject: **P1 needs no typed answer at all, and
that is a hard requirement rather than a preference**, because declaring `text` on any P1 row would gate the
whole 2025 Nov exam at 2.4.0 — including the P2 content already live in prod (see § Keyboard).

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"business_studies"` — derived from the app's own `SubjectMapper.kt` fallback (`displayName.lowercase().replace(" ", "_")` — `"Business Studies"` → `"business_studies"`), the same no-constant-needed mechanism Geography/Life Science already rely on. **No `SubjectMapper.kt` change needed.** |
| Postgres tables | `lessons`, `questions` — `subject_id = "business_studies"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'business_studies'` — populated 2026-09-13 during `nov_p2` authoring (8 units, 21 topics, 6 subtopics, 25 skills; see Completed papers ledger). Reuse before creating (`PIPE-08`) |
| Papers | `nov_p2` (2025) — **fully authored 2026-09-13**, live in prod, see Completed papers ledger below. `nov_p1` (2025) — **sourced and analysed 2026-10-07, not authored**. Both Nov 2025 papers are **one exam for gating** (`VER-01`/`VER-09`). `june_p1`/`june_p2` presumed once June-diet papers are sourced |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ BUSINESS STUDIES _ GR 10-12 _ Web_0CA7.pdf` — Grade 12's four-topic weighting table at Section 2.1 (physical p. 8), Grade 12 Annual Teaching Plan at Section 3.2.6 (printed pp. 33–42; summary table at 3.2.5, p. 32). Both consulted for P2, and again for P1 on 2026-10-07 (Grade 12 Terms 1–3 content for legislation, HR, strategies, quality). Required in-session before authoring, not optional (Business Studies is content-based, see below) |
| **Source files** | P2: `files/Business Studies P2 Nov 2025 Eng.pdf` (question paper, 9pp, 150 marks), `... P2 Nov 2025 MG Eng.pdf` (marking guideline, 32pp). P1: `files/Business Studies P1 Nov 2025 Eng.pdf` (question paper, 10pp, 150 marks, 2 h), `... P1 Nov 2025 MG Eng.pdf` (marking guideline, 31pp) — all in `files/`, matching the other subjects' convention (P1 files staged in git, not yet committed) |
| `subjects` reference row | **Created in both dev and prod, 2026-09-13** — same `id`/`name`/`full_name`/`code`/`category`/`sort_order: 8`/`color: "#1971C2"`/`icon: "briefcase"`/`is_published: true` in both. **Dev**: `is_active: true`, `min_app_version: null`. **Prod**: created gated (`is_active: false`, `min_app_version: '3.0.0'`) so content could go live in prod's database ahead of the subject being visible; **flipped to `is_active: true`, `min_app_version: null` the same day, at the user's explicit follow-up request** — Business Studies is now fully live and visible to real users in prod, ahead of Paper 1 (see Still open). Direct Postgres inserts/updates each time (no tooling exists for this — every `tools/` reference to `subjects` is a read-only FK-existence check). |

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

## Paper structure (Nov 2025 P1, from paper review 2026-10-07)

**Identical shell to P2** — 150 marks, same three sections, same marks and choice rules (Q1 compulsory 30; Q2/Q3/Q4
answer any two, 40 each; Q5/Q6 answer any one, 40 each; only the first two Section B and first Section C answers are
marked), 2 h. The memo's notes to markers (preamble, § 14 Section B rules, § 15 essay rules) are word-for-word the same
framework as P2's, so every rule below about acceptance of alternatives and the LASO rubric carries over unchanged.

| Section | Question | Marks | Topic split | Shape |
|---|---|---|---|---|
| A | Q1.1 | 10 | 5 MCQ | Act/sector/PESTLE/interviewer/PDCA — Q1.1.1 CPA, 1.1.2 technological factor, 1.1.3 secondary sector, 1.1.4 interviewer role, 1.1.5 PDCA "check" |
| A | Q1.2 | 10 | 5 fill-in from a 10-word list | `National Skills`, `threat`, `job description`, `selection`, `management` — closed set printed on the paper |
| A | Q1.3 | 10 | 5 match, 10 options A–J | B-BBEE, horizontal integration, employment contract, purchasing function, TQM — distractors are near-twins (D/I wealth distribution, A/F contract party, E/J integration aim) |
| B | Q2 "Business Environments" | 40 | all Business Environments | BCEA leave, SETAs, Porter, strategy evaluation, intensive strategies, NCA, B-BBEE ownership, diversification |
| B | Q3 "Business Operations" | 40 | all Business Operations | fringe benefits, placement, LRA, termination, quality control vs assurance, TQM, PR quality indicators |
| B | Q4 "Miscellaneous" | 40 | 4.1–4.5 BE (20), 4.6–4.9 BO (20) | defensive strategies, strategic management process, COIDA, PESTLE social, induction, UIF, quality circles |
| C | Q5 EEA essay | 40 | Business Environments (legislation) | 4 bullets: purpose / impact / compliance / penalties |
| C | Q6 HR essay | 40 | Business Operations (HR function) | 4 bullets: recruitment procedure / internal recruitment impact / interviewer role before interview / contract legal requirements |

Sections B and C are 110 of 150 marks, as in P2, and as in P2 they are discursive, marked against a non-exhaustive memo
(see `DESIGN-BUS-02`). P1's memo is mostly lists of ticked points ("Any other relevant answer…", "Mark the first FOUR
only") — **no canonical wording**, again.

**Paired sub-questions in P1 — which are really linked (`DESIGN-UNI-13`).** The pattern is the same "scenario quote → follow-up",
but P1 has more shapes than P2's single "quote → explain OTHER":

| Pair | Shape | Linked? |
|---|---|---|
| 2.3.1 → 2.3.2 | identify the force (rivalry) → "ONE **other** force" | **Yes, exclusion** — the memo explicitly says "Do not award marks for competitive rivalry". The follow-up's correct set must exclude the force the first sub-part names |
| 2.6.1 → 2.6.2 | quote TWO NCA ways from the scenario → "**other** ways" | **Yes, exclusion** — credit check and cooling-off period are taken; the second must offer different ways |
| 4.3.1 → 4.3.2 | quote TWO challenges → classify them into environments | **Yes, dependency** — the second works *on* the first's answers (exchange rates = macro, late workers = micro); natural `match`, and the first sub-part must supply exactly the items the second classifies |
| 3.3.1 → 3.3.2 | name the pay method (piecemeal) → LRA implications | No — different content from the same scenario; shared scenario only |
| 3.6.1 → 3.6.2 | quote TQM-cost ways → impact of poor TQM | No |
| 4.8.1 → 4.8.2 | name the TQM element → benefits of a QMS | No |

New P1 closed-set shapes worth knowing: **Q1.2 is multiple_choice or match, never `fitb`** (the answer is chosen from
a printed list, so a typed blank would be the same skill with a worse input); **4.3 is a two-column table to fill** →
`match`.

## Keyboard — same shape Life Science/Geography already established, verified again here

> **Superseded 2026-10-07 (read this first).** The app's keyboard decision is now total (2.4.0+, `core/keyboard-input.md` § Routing): there is no `None` / system-keyboard path for a lesson answer — undeclared
> content falls back to the Text keyboard (`steps`/`equation`: ScientificMath), and `keyboard_type: none` is ignored. **Every typed question declares `keyboard_type`** (`KEYBOARD-04`; a bare-numeric blank is
> `standard_math`, prose is `text` = 2.4.0 and gated). The analysis below describes the old (pre-2.4.0) behaviour and is kept as history.
>
> **Current guidance for this subject — `DESIGN-BUS-01` (revised 2026-10-07):**
>
> - **Owner decision 2026-10-07: gating the exam at 2.4.0 is accepted** (most students will update soon), same as Life Sciences. So `text` is permitted selectively, under `DESIGN-LIFE-01` rule 2's test below. **Default is still no typed question**, on the merits rather than the gate. Verified against P1 as well as P2: P1 has **no calculation, no unit, no symbol**, and no answer that is both short *and* canonical. Q1.2 (the only fill-in) is a pick-from-printed-list. Everything else is a list/explain/discuss item marked against a point list that accepts paraphrase — exactly what exact-string marking cannot credit.
> - **Why typed answers are rare here (`DESIGN-LIFE-01` rule 2):** a `text` row is only worth it for a single canonical term with every accepted spelling listed via `|`. Consequence if used: (1) **gating is per exam** (`VER-01`/`VER-09`) and 2025 Nov P1 + P2 are one exam. A single `text` row in P1 derives 2.4.0 and **gates P2 too — P2 is already live in prod**, so builds below 2.4.0 would stop receiving it on their next sync. The owner has accepted this (see above); after upload run `tools/apply-exam-gate.js` (`VER-09`), and `push-paper-to-prod.js` will refuse P1 until 2.4.0 is released and `LATEST_RELEASED` is bumped. (2) Candidates are few: `Piecemeal` (3.3.1) is a clean single word, but the other "name" items accept lists with variants (`Parental/Adoption/Commissioning parental/Paternity` leave, `retrenchment/divestiture/liquidation`) — all better as `multi_select`. (3) Acronym-heavy answers (`NSDS`, `SETA`, `CCMA`, `UIF`) have competing spellings and expansions.
> - **If a numeric blank is ever evidenced** (CAPS Term 3 names interest calculations and over/under-insurance calculations — a P2-side topic, and the Nov 2025 P2 simple-interest item was still an MCQ): `keyboard_type: 'standard_math'`, bare number, `R`/`%` split out into the `metadata` label per `KEYBOARD-02`. Released keyboard, **no gate**, safe on this exam.
> - **Do not rely on the fallback.** On 2.4.0+ an undeclared typed row would open the `Text` keyboard; that is a safety net (`KEYBOARD-04`), not a plan, and it is moot here because there are no typed rows. `validate-questions.js` errors on a missing declaration for any new Business Studies script — none are on the legacy allowlist (`tools/lib/legacy-keyboard-allowlist.js` covers Geography, History and Life Sciences scripts only).
> - **`steps` / `equation` / `fraction` stay excluded** for the existing reason (nothing procedural), not for the old keyboard reason — the `ScientificMath` fallback would now make them answerable, which is irrelevant for this subject.
> - **Net:** authoring needs no app change. Zero `text` rows keeps the exam at the floor and pushable now; any `text` row gates the exam at 2.4.0 and blocks the prod push until that release. Either is acceptable; just do it knowingly, and use `text` only where it clearly beats a choice item (Piecemeal, 3.3.1, is the one clean case).


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

**Update 2026-10-04 — `keyboard_type` and the planned `text` keyboard.** Nothing above changes for
content published today. What's new: questions can now declare a `keyboard_type` (`core/keyboard-input.md`),
and a general-purpose `text` keyboard (Linear BLA-58: QWERTY + a second screen for punctuation/digits) is
specified to replace this system-IME fallback — but it is **not built**, so until it ships `business_studies` typed
blanks stay bare-numeric. `validate-questions.js` now enforces this: it **warns** on any non-numeric `fitb`
answer under a `None`-routed subject and **errors** on `steps`/`equation` there (`KEYBOARD-01`).

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
  Code; **P1 adds** CPA, NCA, NSDS, SETA, B-BBEE, UIF, TQM, PDCA, CCMA, FICA, SAQA) but every one is a plain-text term, fine in `multiple_choice`/`match` option text
  with no rendering concern — this is a vocabulary-breadth issue for curriculum coverage,
  not a keyboard/markup one.
- The marking guideline's own preamble explicitly instructs markers to accept "a
  different expression," "another credible source," or "a different approach" as correct
  — i.e. **this subject has no single canonical correct phrasing to author a typed answer
  against**, which is a bigger authoring constraint than any symbol set would be (see
  `DESIGN-BUS-02` below).

**P1 confirms all of this** (checked 2026-10-07 against the full paper and memo): no MathText, no numbers to compute, no
units. New formatting facts P1 adds: legislation is cited as `Name (ABBR), 1995 (Act 66 of 1995)` — follow the paper's own
form in option text — and the paper uses `/` freely inside memo alternatives (`Annual/Sick`, `Power of buyers/Bargaining
power of buyers`). **Re-apply the isolated-slash-in-parentheses rule from the P2 review** (a `( A/B )` alone renders as a
stacked fraction; see ledger) — P1's Act citations are a new place that pattern could appear by accident, e.g. don't write
`(EEA/BEE)`.

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

**Applies to both papers, and verified identical in P1's memo (2026-10-07, § 15.1–15.11 and the Q5/Q6 breakdown
tables).** Only the *content* sub-maxima differ between essays; the LASO 8 marks and the structural rules do not:

| Essay | Intro | Bullet 1 | Bullet 2 | Bullet 3 | Bullet 4 | Concl. | Insight |
|---|---|---|---|---|---|---|---|
| P2 Q5 (Insurance) | 2 | Insurance vs assurance 12 | Compulsory insurance types 16 | Advantages 10 | Principles 8 | 2 | 8 |
| P2 Q6 (Rights/environment) | 2 | Health & safety duties 12 | Dealing with three human rights 12 | Protecting environment 10 | Age/disability 12 | 2 | 8 |
| **P1 Q5 (EEA)** | 2 | Purpose 10 | Impact 14 | Compliance 12 | Penalties 10 | 2 | 8 |
| **P1 Q6 (HR)** | 2 | Recruitment procedure 10 | Impact of internal recruitment 14 | Interviewer's pre-interview role 10 | Contract legal requirements 12 | 2 | 8 |

(Every essay's bullets total 46 against a 32-mark ceiling for content — the memo's "Max 32" caps facts, so a lesson must not imply a
candidate needs to cover every listed point.) Two memo-level points worth item shapes of their own: the Layout and Analysis
rules say marks are forfeited for missing the literal words INTRODUCTION/CONCLUSION, and **Layout is still awarded if the
candidate misreads the question** (§ 15.8) — a good "which mark can still be earned?" multiple_choice. P1 also shows that
the **bullet verbs differ per aspect** (Outline / Discuss / Explain / Advise) and the memo's depth expectation follows the
verb (§ 12.1–12.2: outline/advise = short, discuss/explain = fact + explanation) — directly testable as `match` of verb to
expected depth, and the one essay-strategy idea P1 gives that P2's essays did not foreground.

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

**P1 lessons: one per essay, again (`DESIGN-BUS-03`)** — Q5 (EEA: purpose, impact, compliance, penalties — the EEA's
discriminatory-act list is in CAPS Term 1) and Q6 (HR: recruitment procedure, internal recruitment, interviewer's
pre-interview role, contract requirements). Content items on Q6 overlap Q1.1.4, Q1.2.3–1.2.4 and Q4.6 (interview/selection
vocabulary): that is expected recurring content, not a reason to merge lessons — each lesson stands alone
(`DESIGN-UNI-10`).

Same `aiExplanation` convention as History's Section B: **one** guidance entry per lesson
(`marks: 40`), summarising the memo's own aspect breakdown and the LASO rubric as approach
guidance — never a model essay. `question`/`context_text`/options must never quote the
memo's actual model-answer prose verbatim (mirrors `DESIGN-BUS-02`'s no-canonical-wording
point) — paraphrase the *rubric mechanics*, which are fixed and citable, not the sample
content, which the memo itself says is only one of many acceptable answers.

## Allowed presentation types

`multiple_choice`, `multi_select`, `match`, `ordering` — evidenced for P2 (ledger), illustrative for P1 until authored. `ordering` is
expected to see real use here specifically for essay paragraph-structure sequencing
(`DESIGN-BUS-03`), beyond the general-purpose role it plays elsewhere. `fitb` stays
available only for the rare bare-numeric case per `DESIGN-BUS-01` (`standard_math`, not load-bearing — neither real
paper needs it; P1 uses **no `fitb` and no `text`**). `steps`/`equation`/`fraction` excluded: nothing in this
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
- **`DESIGN-BUS-04` — P1's "name/give any N" and "outline" items are `multi_select` against the memo's own point list, with the memo's
  "mark the first N only" as the guard.** `enforced_by: human-review`. P1 has many (2.1 four leave types, 3.1 four fringe benefits,
  4.1 two defensive strategies): the memo lists more valid answers than N and accepts any. Model as `multi_select` where the
  correct options are a subset of the memo's list and distractors are plausible-but-wrong items from the *same* family (e.g. for
  defensive strategies, an intensive or integration strategy — CAPS keeps these four families apart, and they are the exact
  confusion Q2.5/Q2.8/Q4.1 test). Don't require the student to pick all valid answers when the exam only wants N.
- **`DESIGN-BUS-05` — near-twin options are the P1 Section A hazard, so write distractors from the paper's own pairs.**
  `enforced_by: human-review`. Q1.3's B-BBEE definition vs its "few individuals" distractor, EEA vs LRA vs NCA vs CPA (Q1.1.1), and
  contract-with-employee vs contract-with-union are genuinely confusable, which is the skill. Keep distractors in the same
  family and the same length (`MultipleChoice` wrap bug in Still open makes uneven lengths visually worse here).
- **Currency/percentage formatting**: `R` + space-separated thousands, no decimal comma
  (`R30 000`, not `R30,000` or `R30.000`) — follow the real paper's own convention in any
  given/context text or option text.

## Curriculum units — Paper 1 (Business Environment + Business Operation), added 2026-10-07

Source: CAPS Grade 12 annual teaching plan (3.2.6, printed pp. 33–42) and the summary table at 3.2.5. Mapped question by
question against the Nov 2025 P1 paper:

**Business Environment** — *Macro environment: impact of recent legislation* (Term 1, 3 weeks): Skills Development Act + NSDS/SETAs
(Q1.2.1, Q2.2), LRA (Q3.3.2, Q1.3.3), EEA (Q5 essay), BCEA (Q2.1), COIDA (Q4.4), B-BBEE incl. ownership pillar (Q1.3.1, Q2.7),
NCA (Q1.1.1 distractor, Q2.6), CPA (Q1.1.1). CAPS asks for nature, purpose, advantages/disadvantages, rights, compliance, penalties
and (EEA) the listed discriminatory acts — those are the five angles Q5 tests. *Macro environment: business strategies* (Term 1,
3 weeks): SWOT/PESTLE (Q1.1.2, Q1.2.2, Q4.5), Porter's Five Forces (Q2.3), the strategy process — formulation, implementation,
evaluation (Q2.4, Q4.2) — and the strategy families: **integration** (Q1.3.2), **intensive** (Q2.5), **diversification** (Q2.8),
**defensive** (Q4.1). *Business sectors and their environments* (Term 2, 1 week): the three sectors and three environments, and how
much control a business has over each (Q1.1.3, Q4.3).

**Business Operation** — *Human Resources function* (Term 1, 2 weeks, plus Grade 10/11 recap): recruitment and selection procedure,
interviewing and the interviewer's duties (Q1.1.4, Q6), job analysis → job description/specification (Q1.2.3), selection and
placement (Q1.2.4, Q3.2), employment contracts and termination (Q1.3.3, Q3.4, Q6), salary determination — piecemeal and time-related
(Q3.3.1), employee benefits — pension, medical, fringe (Q3.1) — induction (Q4.6), UIF (Q4.7), skills development. *Quality of
performance within business functions* (Term 2, 1 week, plus recap): the quality concept; TQM elements — continuous skills
development, total client satisfaction, continuous improvement of processes — (Q1.3.5, Q3.6, Q3.7, Q4.8), quality control vs quality
assurance (Q3.5), quality circles (Q4.9), PDCA (Q1.1.5), quality indicators of the public relations function (Q3.8), and the
purchasing function (Q1.3.4). Several of these are **Grade 10/11 recap content that CAPS flags examinable** ("'recap' … means the
content is also examinable") — don't assume a P1 question stays inside the Grade 12-only slice.

Not in P1 despite being Grade 12 CAPS: Business Venture/Business Role strands (P2), *Forms of ownership* beyond a recap (Term 3,
P2 side), *Presentation* (P2 Q2.6/Q4.5). Authors should tag by CAPS topic, not by P1/P2, since the curriculum is shared — `PIPE-08`
means P1 will reuse the existing 8 units / 21 topics first (e.g. creative thinking, ethics sit under P2's nodes) and only create
what's genuinely missing.

(Illustrative only — the real node set comes from the first P1 authoring session's vocabulary dump, `PIPE-08`.)

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

*(Re-checked 2026-10-07 against `core/keyboard-input.md` and `core/app-feature-versions.md`: still true for P1, and
more strongly — see § Keyboard. `KeyboardResolver.kt` is now total, so even the "resolves to `None`" bullet below is
superseded; it is moot because nothing is typed.)*

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
- **`subjects` row**: **created 2026-09-13** (see Identity above) — a data-only insert,
  not an app release, done directly at the user's request since no tooling exists for it.

## Completed papers ledger

**`nov_p2` (2025) — complete, 2026-09-13.** All 6 lessons authored, validated (`tools/
validate-questions.js --curriculum`), and upserted to dev (Cloud SQL); verified directly
against the `lessons`/`questions` tables — 230 marks (full question bank, a candidate
answers a subset: Section A compulsory + 2 of Section B's 3 + 1 of Section C's 2, same
"full bank vs. exam-day subset" shape as `dbe-history.md`'s own paper), 55 practice
questions.

| Lesson | Order | Marks | Questions | Presentations used |
|---|---|---|---|---|
| Question 1 (Section A — mixed compulsory items) | 1 | 30 | 9 | multiple_choice, multi_select, match |
| Question 2 (Business Ventures) | 2 | 40 | 10 | multiple_choice, multi_select, ordering |
| Question 3 (Business Roles) | 3 | 40 | 9 | ordering, multi_select, multiple_choice |
| Question 4 (Miscellaneous — both topics) | 4 | 40 | 9 | multi_select, match, multiple_choice |
| Question 5 (Investment: Insurance essay) | 5 | 40 | 9 | multiple_choice, multi_select, ordering |
| Question 6 (Human Rights/Inclusivity/Environmental essay) | 6 | 40 | 9 | multiple_choice, multi_select, ordering |

**`aiExplanation` corrected to `AIEXP-08`, 2026-09-13 (same day, follow-up).** Q1–Q4's
`aiExplanation.sub_questions` were originally authored against the lesson's own fresh
practice questions (numbered `"1"`–`"9"`/`"10"`/`"11"` by practice order, `marks: null`)
— wrong, per a new framework rule (`AIEXP-08`, `core/ai-explanation.md`) written the same
day specifically because of this mistake: `sub_questions[]` must always be the **real
exam's own numbered sub-questions**, real marks, with `clues`/`approach`/`solution`
genuinely derived from the **real memo's actual answer** — a guided-solution companion to
the actual past paper, decoupled entirely from whatever the lesson's fresh practice
questions test. Regenerated against the real exam/memo (`files/Business Studies P2 Nov
2025 Eng.pdf`/`... MG Eng.pdf`): Q1 now carries 15 entries (`1.1.1`–`1.3.5`, 2 marks
each, 30 total), Q2 carries 9 (`2.1`–`2.8`, 40 total), Q3 carries 9 (`3.1`–`3.7`, 40
total), Q4 carries 11 (`4.1`–`4.9`, 40 total) — 44 entries, replacing the old 37, plus
Q5/Q6's 2 already-correct essay entries (46 total across the paper). Old rows had to be
explicitly `DELETE`d from dev Postgres, not just superseded by the upsert — this table's
deterministic UUID is keyed on `(lesson_id, number)` (`tools/lib/content-rows.js`), so
changing `number` from the old scheme to the real one produces entirely new row IDs
rather than overwriting the old ones; re-running the upload script alone would have left
both sets coexisting (confirmed live: 37 stale + new rows present until the explicit
delete). **Worth knowing for any future `aiExplanation` renumbering in any subject**, not
Business-Studies-specific. English HL's own already-published content still uses the
pre-`AIEXP-08` convention and has not been reconciled — a separate future pass.

**Curriculum vocabulary**: 8 units, 21 topics, 6 subtopics, 25 skills created via
`tools/create-curriculum-node.js`/`create-skill.js` (dev), reusing conceptual matches
where they already existed under a different subject's namespace (`curriculum_nodes.id`
is a **global** PK — `business_studies` isn't in `NAMESPACED_SUBJECTS`, so slugs had to be
checked across all subjects, not just within this one). Subtopics deliberately kept coarse
(skill-shape buckets: `term_definition_recall`, `scenario_application`,
`classification_and_criteria`, `sequencing_and_process`, `scenario_evidence_identification`,
`essay_structure_and_argumentation`) rather than one-per-question — this subject's content
is discursive/skill-shaped like History, not fact-dense like Life Science, so History's
coarse convention was followed, not Life Science's fine-grained one.

**`DESIGN-BUS-02` held up in practice**: every discursive concept (leadership styles,
insurance principles, King Code, CSR, human rights, diversity) went to `multiple_choice`/
`multi_select`/`match`/`ordering`, never open `fitb` recall. `DESIGN-BUS-01` held too:
zero letter-based `fitb` anywhere in the paper — the one arithmetic concept the real paper
has (simple interest) was represented as an MCQ, matching the real exam's own shape,
exactly as the profile predicted before authoring started.

**`DESIGN-UNI-13` linked pairs exercised three times**: Q2's leadership-styles scenario
(quote → explain-other), Q2's multimedia-presentation scenario (quote → explain-other),
Q3's King Code scenario (quote → explain-other), and Q4's creative-thinking-environment
scenario (quote → explain-other) — four total, each checked explicitly so the second
sub-part's correct option set excludes the first's. Q3's conflict-scenario pair
(quote causes → recommend a resolution) was *not* linked in the exclusion sense — the
second sub-part is a different category of answer (a remedy, not more causes), so no
overlap risk existed there; worth noting as the one paired-scenario shape that didn't need
the exclusion check, in case it recurs.

**MC index-0 distribution (`DESIGN-UNI-06`/`SCHEMA-TYPE-06`) — the one real mistake this
session made, and the direct reason `workflows/generate/upload-business-studies.md` exists
now.** Q1 originally shipped with 2 of 5 `multiple_choice` questions at `metadata[0]`,
caught only after upload, mid-fix, when the session paused to write the generate doc
instead of continuing blind. Fixed and re-verified (0/5) before Q2 started. Every
subsequent lesson checked the live cumulative tally against Postgres *before* finalizing
its own question set, per the generate doc's own instruction — final tally: **1 of 32
`multiple_choice` questions at index 0 (3.1%)**, comfortably under the ~10% cap, with
room to place more at index 0 in a future paper without approaching the limit.

**Presentation-type variety rule caught twice** (`tools/validate-questions.js`'s
"4+ question set needs ≥3 presentation types" check): Q2's first draft used only
`multiple_choice`/`multi_select` — added an `ordering` item (investment decision process)
that also happened to cover the real Q2.1 content ("factors to consider when making
investment decisions") the draft had otherwise dropped for space. Worth the general
lesson: the variety rule can double as a nudge toward content this subject's fine-grained
Section B otherwise makes easy to skip.

**Exam/memo images extracted and wired, 2026-09-13 (second pass, at the user's request
after viewing the dev app with none wired).** All 6 lessons' `question_image_urls`/
`memo_image_urls` populated from `files/Business Studies P2 Nov 2025 Eng.pdf`/`... MG
Eng.pdf`, uploaded to `media-dev.askmoreprepmore.app`, all URLs spot-checked resolving
(200). Two genuinely shared boundaries handled:
- **Question paper page 9**: Q5 and Q6's essay prompts are printed on the same physical
  page — extracted and uploaded once (under Q5), the identical URL reused directly in
  Q6's script rather than re-extracting, same convention `dbe-history.md`'s Q4/Q5/Q6
  already established for a shared prompts page.
- **Memo pages 12 and 17**: genuine two-question boundaries (Q2/Q3 and Q3/Q4 each end/
  start partway down one physical page) — split via `extract-exam-pages.py`'s
  `N:start=Y`/`N:end=Y` page-spec syntax, y-coordinates found from a density scan of the
  rendered page (a blank gap between the prior question's mark-breakdown table and the
  next question's heading), verified by visual inspection of both resulting crops that
  neither bleeds into the other's content.

**Full `review-paper.md` run against the live emulator — CLOSED CLEAN, 2026-09-13**
(`workflows/generate/review-paper.md` Phases 1-4; Phase 5 explicitly does not apply —
this paper has zero `fitb`/`equation`/`steps` questions, every one of its 55 questions is
selection-based). All 55 questions checked at the data level (0 issues: `answer` verbatim
in `metadata`, `match` ≤4 pairs with correct prefix format, `ordering` answers a genuine
permutation not stored pre-solved, curriculum resolved on every question, no `\n` in any
`question` field); MC index-0 tally unchanged at 1/32 (3.1%). Render checks sampled 13 of
55 questions' live screenshots across all 6 lessons and all 4 presentation types used,
weighted toward the longest/highest-risk text (the two essay lessons' 5-6-item `ordering`
sequences, the longest `match`/`multi_select` option text) — a sample, not full 55/55
visual coverage, noted honestly rather than overclaimed.

Found and fixed one real defect this way: **Lesson 5 (Question 5) Q9**'s `question` field
had `"...(Layout, Analysis/interpretation, Synthesis, Originality combined)..."` — a
slash-pair isolated alone in its own parentheses, which rendered as a stacked math
fraction instead of plain text. **Exactly the same defect class `review-paper.md` already
documents from Chemistry's `E°(Ag⁺/Ag)` incident** (2026-09-12) — the second time this
specific pattern has bitten a subject with no MathText content of its own. Fixed by
rephrasing to `"(Layout, Analysis and Interpretation, Synthesis, Originality)"`, which
removes the slash and, as a bonus, matches the marking guideline's own literal component
name more closely than the original. Patched via `patch-question.js` (dev only), `pm
clear com.esma.ampm.dev`'d, re-captured, re-verified rendering clean. Scanned all 55
questions for the same isolated-slash-in-parens pattern programmatically — this was the
only occurrence; the paper's other slash uses (`HIV/Aids`, `investment/insurance`,
`investment/financing`, `health/safety`) are free-flowing in sentences, not isolated in
parens, and didn't trigger it. Zero FLAGs.

**One observation, not a FLAG**: every lesson's video area shows "Video ID not
available" (expected — `has_video: false`). Functionally harmless in every screenshot
sampled, but not independently verified against whether this matches History's/
Geography's/Life Science's own `has_video: false` rendering or indicates something
Business-Studies-specific about routing — a code-level question, out of this review's
scope, worth someone checking directly against `dbe-history.md`'s "App-side navigation"
claim before assuming it's fine.

**Follow-up verification pass, same day, after the above — found a real `multiple_choice`
render defect the first pass's sample didn't happen to hit.** The first pass weighted its
13-question render sample toward `ordering`/`match`/`multi_select` (the longest-text
presentations); re-checking specifically for `multiple_choice` checkbox/label alignment
surfaced a genuine defect, confirmed twice visually (Lesson 5 Q1 "What is the key
difference between insurance and assurance?", Lesson 4 Q9 rural pricing) and once more
via a live `uiautomator dump` for numeric proof: **when one `multiple_choice` option
wraps to 3 lines while its neighbours wrap to 2, the option's own row container does not
grow to fit the extra line.** Live-dumped bounds for Lesson 5 Q1's four options: row
heights `126px, 129px, 126px, 126px` — the 3-line option (`"Insurance covers uncertain
events; assurance covers..."`) got only 129px, 3px more than its 2-line neighbours,
nowhere near the ~189px three lines actually need. The next option's row (and its
checkbox) still starts immediately after that insufficient height, so the 3-line option's
overflowing third line visually lands on top of the next option's checkbox — a checkbox
that then reads as "belonging" to the wrong line. Confirmed absent when all four options
wrap to the same line count (Lesson 1 Q4, team-development stages — evenly spaced,
correctly aligned).

**This is an app-side renderer bug (`MultipleChoice.kt`'s per-option row sizing), not a
content defect, and not Business-Studies-specific** — it will reproduce for any subject's
`multiple_choice` question whose options wrap to an uneven number of lines, which this
paper's discursive, prose-heavy distractors hit often. **FLAGged, not AUTO_FIXed**: no
`patch-question.js` field fixes the layout; forcing every option to the same line count by
shortening text would be a content compromise for an app bug, not a real fix, and
wouldn't help any other subject hitting the same layout. Needs someone to size each
option row to its own measured content height (or restructure so checkbox+label are
measured together per option, not two independently-stacked elements) before this paper
or any subject with similarly uneven `multiple_choice` option lengths ships to prod.
`~/StudioProjects/AMPM/temp/review/business_studies_nov_p2_2025/report.md` has the fuller
write-up (that file also re-covers Phases 1-3's already-clean logic checks for a
consolidated single reference, superseding the first pass's report file of the same
name — the git-tracked ledger here, not that gitignored file, is the durable record).

Also found while investigating the above: the **"Paper Review" button visible at the
bottom of a lesson's practice pager is disabled/greyed out until all of that lesson's
practice questions are completed** — plausibly where `question_image_urls`/
`memo_image_urls` (the real exam page + memo) actually render, but not confirmed, since
reaching it means actually answering all 9 questions, out of a render-only capture's
scope. Resolves the open item above about where exam/memo images surface in-app — likely
answer, not a confirmed one.

**Pushed to prod and published, 2026-09-13** (`tools/push-paper-to-prod.js --subject
business_studies --year 2025 --paper nov_p2`, then `--publish`): 6 lessons / 55 questions
/ 230 marks, plus 35 new curriculum_nodes, 25 skills, 18 new tags, 46
`lesson_ai_explanation_sub_questions`, and all 35 referenced images, mirrored from dev to
the prod bucket. Verified directly against prod Postgres (not just script output): all 6
lessons and 55 questions `is_published = true`; spot-checked image URLs on the prod
bucket resolve (200).

**`subjects` row created directly in prod, initially kept inactive** — `is_active:
false`, `min_app_version: '3.0.0'` (a version no current build had reached, so it acted
as a hard gate independent of `is_active`), same `sort_order: 8`/`color`/`icon` as dev.

**Activated in prod the same day, at the user's explicit follow-up request** —
`is_active: true`, `min_app_version: null`. Business Studies is now genuinely live and
visible to real users in prod, ahead of Paper 1 being authored — the original plan to
wait until both papers were ready was superseded by this direct instruction, not an
oversight.

**`nov_p1` (2025) — authored to dev, 2026-10-07; not reviewed on the emulator, not in prod.** 6 lessons / 58 practice
questions / 230 marks (Q1 30 + Q2–Q6 40 each), validated with `--curriculum`, upserted to dev, one commit per lesson
(`78527c5` is Q1), images wired in a final commit. Verified against Postgres: 24 `multiple_choice` questions with **2 at
index 0 (8.3%)**, 26 `multi_select`, 5 `match`, 3 `ordering`; **zero typed rows** (`keyboard_type` null on all 58), so no `text`,
no exam gate row, floor version — pushable once reviewed.

| Lesson | Marks | Questions | Presentations |
|---|---|---|---|
| Question 1 (Section A mix) | 30 | 9 | multiple_choice, multi_select, match |
| Question 2 (Business Environments) | 40 | 10 | multiple_choice, multi_select, match |
| Question 3 (Business Operations) | 40 | 10 | multi_select, multiple_choice, match |
| Question 4 (Miscellaneous) | 40 | 11 | multi_select, ordering, match, multiple_choice |
| Question 5 (EEA essay) | 40 | 9 | multiple_choice, multi_select, ordering |
| Question 6 (HR essay) | 40 | 9 | multi_select, multiple_choice, ordering |

New vocabulary created in dev for P1 (this session): 5 units, 27 topics, 5 skills (`explain_legislation_provision`,
`analyse_business_environment`, `explain_business_strategy`, `explain_hr_procedure`, `explain_quality_management_concept`),
23 tags; subtopics all reused (the existing six). Linked pairs authored as profiled: 2.3 and 2.6 as exclusion pairs, 4.3 as a
quote-three-challenges → `match` classification pair (three challenges, not the exam's two, so all three environments appear).
`aiExplanation` follows `AIEXP-08` (real sub-question numbers and marks: 15 / 10 / 10 / 11 / 1 / 1 entries). Q6's question
image is Q5's (shared page 10, same convention as P2). **Not done:** the `review-paper.md` emulator run; prod push (`push-paper-to-prod.js`
for `nov_p1` — expect no gate, since no `text` rows).

## Still open

**Paper 1 (2026-10-07):** authored to dev (ledger above); remaining: emulator review, then prod push. The authoring checklist used: (1) use the generate
doc `workflows/generate/upload-business-studies.md` (currently modified in the working tree — read its current state, don't
assume it matches the P2-era text); (2) check the live MC index-0 tally before finalizing each lesson (`DESIGN-UNI-06`, P2 ended
at 1/32 = 3.1%; the cap is paper-level, ~10%); (3) typed rows are rare and every one declares `keyboard_type` (`text` or `standard_math`); if any `text`, run `apply-exam-gate.js` and expect the prod push to wait for 2.4.0; (4) wire exam/memo
images (shared page boundaries expected at Q5/Q6 prompts again — page 10 holds both essays); (5) `aiExplanation` per `AIEXP-08`:
the real exam's own numbered sub-questions with the memo's real answers; (6) a full `review-paper.md` run, Phase 5 skipped as in P2.

`june_p1`/`june_p2` unsourced. **Business
Studies is live in prod with Paper 2 only**, so a real user browsing it today sees a
subject with no Paper 1 content yet, not a bug, just the current genuine state until
Paper 1 is authored. The "Video ID not
available" placeholder is worth a quick cross-subject check but isn't blocking. **The
`multiple_choice` checkbox/row-sizing bug above is a real, cross-subject app defect** —
someone needs to fix `MultipleChoice.kt` (or wherever its option rows are laid out) before
this paper, or any subject with uneven-length `multiple_choice` options, ships to prod;
not blocking further Business Studies authoring (Paper 1, `june_p2`) since it's a
rendering issue independent of content correctness. Confirming exactly what "Paper
Review" unlocks (likely the exam-page/memo viewer) is a quick follow-up, not urgent.
