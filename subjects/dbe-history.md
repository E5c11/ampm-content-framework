---
id: AMPM-CONTENT-SUBJ-DBE-HISTORY
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, history, dbe, profile]
---

# Subject Profile — DBE History (Papers 1 and 2)

Drafted 2026-09-12 from a paper review of `files/History P2 Nov 2025 Eng.pdf` +
`files/History P2 Nov 2025 Addendum Eng.pdf`; Paper 2 was then fully authored and reviewed
(see the ledger). **Paper 1 added 2026-10-07** — read and analysed against the CAPS document
(`files/caps_fet_history_gr_10-12_web_1.pdf`) and the three P1 source files, **not yet
authored**. This reverses the 2026-09-12 founder decision that scoped the profile to Paper 2
only; the two papers are different CAPS topics under one subject, so one profile covers both.
Everything marked *P1* below comes from paper/memo/CAPS analysis, not an upload session —
treat it as unverified until a P1 lesson ships, the same evidencing discipline
`dbe-chemistry.md` and `dbe-geography.md` used. The two papers agree on the whole structural
shape (see *Paper structure*), which confirms that shape is DBE History's, not P2's quirk.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"history"` |
| Postgres tables | `lessons`, `questions` — `subject_id = "history"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'history'` — empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject history --out temp/curriculum-vocab.json` (Auth Proxy running) |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/caps_fet_history_gr_10-12_web_1.pdf` — required in-session before authoring, not optional (`DESIGN-UNI-08` names History as a content-based subject). Covers both papers. **P2:** the Grade 12 topic tables for Civil Resistance (1970s–80s), Coming of Democracy/TRC, and End of the Cold War/New World Order. **P1 (read 2026-10-07):** §3.3 Grade 12 — Topic 1 *The Cold War* (origins; case studies China/Vietnam), Topic 2 *Independent Africa* (Congo, Tanzania; Africa in the Cold War — Angola), Topic 3 *Civil society protests 1950s to 1970s* (US Civil Rights; Black Power); and §4.4.5 *Allocation of content per question paper*, which gives each paper's six question foci. Verify exact CAPS page numbers in-session |
| **Source files** | P2: `files/History P2 Nov 2025 Eng.pdf` (question paper, 9pp), `files/History P2 Nov 2025 Addendum Eng.pdf` (source material, 14pp), `files/History P2 Nov 2025 MG Eng.pdf` (marking guideline, 26pp — sourced 2026-09-12, after Q1–Q3 were first authored; see ledger). P1: `files/History P1 Nov 2025 Eng.pdf` (9pp), `files/History P1 Nov 2025 Addendum Eng.pdf` (14pp), `files/History P1 Nov 2025 MG Eng.pdf` (27pp) — **all three in hand before any authoring**, so the P2 mid-session memo rewrite does not repeat |
| `subjects` reference row | **Already exists** — created 2026-09-12 with the P2 session (`id: "history"`, `color: "#B8860B"`, `icon: "landmark"`, `min_app_version: null`; see ledger). Nothing to insert for P1 |
| Papers | `nov_p2` (Nov 2025) authored. `nov_p1` (Nov 2025) analysed 2026-10-07, not authored. `june_p1`/`june_p2` presumed once a June paper is sourced |
| **CAPS exam outline agrees with the real papers** | Unlike Geography (whose CAPS outline is out of date), History's CAPS §4.4.5 matches the 2025 papers exactly: each paper 150 marks / 3 h, six questions × 50, three source-based + three essay, a candidate answers three (at least one of each kind, third free). CAPS also fixes each question's **focus** per paper (§4.4.5) — use that to bound scope, and the paper to see emphasis |

## Paper structure — Nov 2025 P2 (from paper review)

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

## Paper structure — Nov 2025 P1 (*P1*, from paper/memo/CAPS analysis, 2026-10-07)

Same skeleton as P2: **six 50-mark questions, a candidate answers three** (at least one
source-based and one essay; the third free), so 150 marks on a script and **300 marks of
content in the question bank** — the "check coverage against 300, not 150" rule above applies
unchanged. Instructions 4.1/4.2 on the paper and CAPS §4.4.5 say the same thing.

| Q | Section | Marks | CAPS topic → question focus | Real 2025 content | Sources |
|---|---|---|---|---|---|
| 1 | A | 50 | Cold War → *origins, Cold War in Europe, Cuban crisis* | Policy of containment and 1947 tensions: Churchill's Iron Curtain speech, Truman Doctrine/Marshall Plan, Molotov Plan/COMECON | 1A speech extract · 1B cartoon (SJ Ray, *Kansas City Star*, 13 Mar 1947) · 1C journal extract (Burk) · 1D book extract (McLean) |
| 2 | A | 50 | Independent Africa → *Africa in the Cold War* (Angola) | Why the USA entered the Angolan Civil War from 1975: CIA covert support (IAFEATURE) for FNLA/UNITA against the MPLA | 2A book extract (Guta) · 2B book extract (Stiff) · 2C interview (Gleijeses/Hultslander) · 2D cartoon (L Silva, 1993) |
| 3 | A | 50 | Civil society protests 1950s–70s → *Civil Rights and Black Power* | MLK Jr's non-violent approach in the 1960s: Gandhi's influence, riots vs militant non-violence, sit-ins, Malcolm X/Baldwin's criticism | 3A article extract (Risen) · 3B King's own words (Walton) · 3C photograph (sit-in, Jackson MS, 28 May 1963) · 3D interview (Clark–King) |
| 4 | B | 50 | Cold War → *China **or** Vietnam* (candidates choose) | Viet Cong tactics 1962–75 — "agree?" | none |
| 5 | B | 50 | Independent Africa → *successes and challenges of the Congo and Tanzania* | Mobutu's political/economic/social/cultural policies — "critically discuss: a dismal failure" | none |
| 6 | B | 50 | Civil society protests → *Civil Rights and Black Power* | Black Power Movement — "to what extent was it successful" | none |

**Decision: author all six as separate lesson groups, `order` 1–6, `paper: nov_p1`** — same
reasoning and same `DESIGN-UNI-10` application as P2 (one lesson per real question; each
Section A question's four sources are one continuous scenario ending in a cross-source 8-mark
synthesis, so rule 1 bundles them). **6 lessons, 8 practice questions each** is the starting
estimate, as P2. Section A sub-part counts (counting `(a)`/`(b)` as separate): **Q1 18, Q2 18,
Q3 18** — each sums to exactly 50 marks (checked 2026-10-07 against the paper), so the
per-lesson `aiExplanation.sub_questions` entries should total 50 as P2's did.

**Skeleton inside every Section A question** (P1 Q1–Q3 all follow it, and P2's did): four
sources → one or two extraction items per source (L1) → interpretation / definition items (L2) →
one reliability-or-usefulness-or-limitations item on a text source (L3: 1.1.5, 2.1.4, 3.2.5) →
one cross-source "how does A support B" item (L3: 1.3, 2.5, 3.4) → the 8-mark paragraph (`x.6`).
Every Section A question has exactly one visual source: a cartoon in Q1 (1B) and Q2 (2D), a
photograph in Q3 (3C). The others are text.

**Scope guard — what P1 CAPS covers that 2025 did not examine.** CAPS defines scope; the paper
defines emphasis. Do not author these speculatively, and do not read their absence from one
paper as exclusion:
- Q1 focus lists the Berlin Crises (1949–61), NATO/Warsaw Pact and the **Cuban crisis**; 2025 asked
  only containment/Marshall/Molotov. (Q1 *background* only — don't treat 2025's slice as the whole
  of "origins".)
- Q4: **China** is the year-alternate to Vietnam ("examined each year as an option to Vietnam").
- Q5: **Tanzania** (African socialism, Nyerere/*ujamaa*) — CAPS says the Congo/Tanzania case studies
  are "comparative … not meant to be separately examined", yet 2025 set the Congo alone.
- Q3/Q6: Montgomery bus boycott, Birmingham, Selma, Little Rock, March on Washington, and the
  Topic 3 introduction (women's liberation, peace movements) are CAPS content; 2025 examined
  King's non-violence and Black Power only.

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

**P1 item formats and how they map** (*P1*, proposed — not yet uploaded). The memo tags every
sub-question with its skill and cognitive level (`[Extraction of evidence from Source 1A – L1]`
etc.; see *Marking-guideline vocabulary*) — use those tags as the item's skill classification:

| P1 exam item | Examples | Maps to |
|---|---|---|
| Extract / "quote" evidence (L1) | 1.1.1, 1.4.2, 1.4.3, 1.5.2, 2.1.2, 2.2.1–2.2.3, 2.3.1, 2.3.4, 3.1.2, 3.2.1, 3.2.3, 3.5.1, 3.5.2 | `multiple_choice` (one item) / `multi_select` (TWO or THREE) over **verbatim phrases**: correct ones from the real source, distractors from *another part of the same source or a neighbouring source* — never invented quotations (`DESIGN-HIST-01`) |
| Define / explain a term (L1–L2) | Iron Curtain 1.1.3, satellite states 1.5.3, self-determination 2.2.5, covert action 2.3.2, non-violent mass protests 3.1.3, racial justice 3.2.4 | `multiple_choice` best-definition; distractors are real neighbouring terms (Iron Curtain vs. containment vs. sphere of influence), not nonsense |
| Interpret / comment on what is implied (L2) | 1.1.2, 1.1.4, 1.4.4, 1.5.4, 2.1.3, 2.2.4, 2.3.3, 3.1.4, 3.2.2, 3.5.3 | `multiple_choice` / `multi_select`: which inferences does the source actually support |
| Cartoon / photograph reading (L2) | 1.2.1(a)(b), 1.2.2, 2.4.2(a)(b), 3.3.1(a)(b), 3.3.2 | `multiple_choice` with the image in `supplementary_materials`; options describe the symbolism / intention |
| Reliability, usefulness, limitations (L3) | 1.1.5 reliable, 2.1.4 limitations, 3.2.5 useful | `multiple_choice` / `multi_select` over provenance features. **Freshness angle (`DESIGN-HIST-01`): ask the verdict the exam did *not*** — limitations of 1A (a Cold War warning speech by a former PM, delivered in the USA), usefulness of 2A, reliability of 3B — grounded in the same provenance line printed above each source |
| Cross-source support (L3) | 1.3 (1A↔1B), 2.5 (2A↔2D), 3.4 (3A↔3C) | `match` (claim in source X ↔ corroborating detail in source Y) or `multi_select`. Practice questions should pair a **different** two sources from the same set (e.g. 1C↔1D, 2B↔2C) |
| Accept-any-two / `(any 2 x 2)` items | most L2/L3 items | the memo lists 3–6 acceptable points and takes any N — a `multi_select` of the genuinely supported points beats a single-answer `multiple_choice` for the same marks |
| Numeric / date | 22 million dollars, $41,7 million of $100 million, 1946/1947/1949/1963/1971/1968 | `fitb` with `keyboard_type: 'standard_math'` (*Keyboard* below); store the decimal comma as `.` |
| 8-mark paragraph (`x.6`) | 1.6, 2.6, 3.6 | `DESIGN-HIST-02` — `multi_select` of source-supported claims / `ordering` of the causal chain; each memo "aspect" carries its provenance tag `(Source 1B)` or `(own knowledge)` |

**What each source's own-knowledge points are** (*P1*, the memo expects these beyond the
source — they cannot be derived from reading): Q1 — the Domino Theory, the Molotov Plan
intensifying tensions; Q2 — South Africa's capitalist interest, access to Angola's natural
resources, a capitalist regional order; Q3 — King wanting integration, King protecting the
image of African Americans. Items on these are knowledge items, not source-comprehension items:
tag them `type: definition`/`application` per the *Allowed presentation types* section, not
`interpretation`.

## Essay questions (Section B) — no free-text writing, same as English HL Paper 3

**`DESIGN-HIST-02`** — `enforced_by: human-review`. No free-text/essay input exists in
the app (the same constraint English HL Paper 3 and Geography's Section B map-skills
already resolved this way — `dbe-english-hl.md`, `dbe-geography.md`). Section B's three
prompts have no source material at all — teach the underlying essay-argument skill
objectively via `multiple_choice`/`multi_select`/`ordering`: identifying or sequencing
supporting evidence for a line of argument, distinguishing a strong thesis from a weak
one, structuring a paragraph (topic sentence → evidence → analysis → link), evaluating
a counter-argument. Never ask the student to produce the essay itself.

**P1 essays (*P1*)** — three prompts, one exam page (all three print on p.9, so the
upload-once, reuse-the-URL pattern from P2 applies), no sources. What makes them useful
practice material under `DESIGN-HIST-02` is that **each uses a different instruction word and
the memo expects a different stance**:

| Q | Prompt shape | Memo's expected stance | Essay-strategy item it supports |
|---|---|---|---|
| 4 Vietnam | "Do you **agree** …?" | Take a side (agree *or* disagree) and defend it | Which thesis sentence takes a clear line vs. hedges |
| 5 Congo | "**Critically discuss** …" | The memo's introduction says *some successes as well as some failures* — a balanced, evaluative stance; and its elaboration tags each point "(success)"/"(failure)" | Sort Mobutu policies into success/failure; why a one-sided "dismal failure" thesis under-scores |
| 6 Black Power | "**To what extent** …" | Take a stance on *greater or lesser extent*; memo tags points "(great extent)" | Which evidence supports "greater extent"; calibrating a claim |

Content-knowledge practice items are free to be fresh (general historical knowledge, per
`DESIGN-HIST-02`): Viet Cong tactics (guerrilla warfare, tunnels, the Ho Chi Minh Trail), US
escalation (Gulf of Tonkin, Rolling Thunder, Operation Ranch Hand — see cautions), Vietnamisation; Mobutu's
Zaireanisation, Authenticité, the MPR one-party state, retrocession; the origins of Black Power,
Malcolm X, Carmichael, the Black Panther Party. The memo's seven-level matrix (content × presentation,
marks 0–50) is approach guidance for `aiExplanation`, not something to reproduce as an item.

## Keyboard — numeric blanks `standard_math`; `text` allowed for single-token words (from 2.4.0)

**Where this stands (re-verified 2026-10-07; the app wins — re-check `KeyboardResolver.kt`).**

*Original finding, 2026-09-12 (still true of released builds).* History had no `KeyboardResolver`
entry, so a `fitb` fell to `QuestionKeyboardType.None` — the system keyboard — and `FillInTheBlank.kt`
requested `KeyboardType.Decimal`: numeric-only. On any **released** build (latest tag 2.3.2) the 10
History `fitb` live on prod still behave that way.

*What changed 2026-10-07 (AMPM branch `feature/keyboard-always-custom`, `d302da0a6`/`ed135fee6`,
`workflows/active/keyboard-always-custom.md` — not yet in `dev` when checked).* `KeyboardResolver.resolve`
becomes **total**: declared `keyboard_type` → subject → fallback (`ScientificMath` for `steps`/`equation`,
otherwise `Text`). `None` is deleted; the system keyboard is never used for a lesson answer. So a History
`fitb` that declares nothing starts getting `Text` — nothing may be left to inference (`KEYBOARD-04`).

**`DESIGN-HIST-03` — revised 2026-10-07 (twice).** `enforced_by: human-review` (the validator enforces the
declaration; it cannot tell a word from a number).

1. **Every typed History question declares `keyboard_type`.** Numeric answers (year, count, dollar figure,
   percentage; `.` as decimal mark, so `$41,7 million` is stored `41.7`; unit in a `metadata` label,
   `KEYBOARD-02`) → **`standard_math`**. Words → **`text`** (rule 2).
2. **`text` is permitted** (owner decision 2026-10-07: the 2.4.0 requirement is acceptable, a release is due
   within days). Consequences to accept knowingly: any `text` question derives **2.4.0**, the gate is **per
   exam** (`VER-01`/`VER-09`), so the whole 2025 exam (P1 **and** the live P2) is gated on dev, and
   `push-paper-to-prod.js` refuses both until 2.4.0 is tagged and `LATEST_RELEASED` is bumped
   (`KEYBOARD-05`, `VER-06`/`VER-08`). Run `apply-exam-gate.js` after upload (`VER-09`). **Stay selective —
   the assessment-quality reason for objective formats is unchanged:** `fitb` marking is exact-string
   (case-insensitive, trailing punctuation stripped, `|` alternatives) while the memo's answers are
   paraphrasable ("any 1 x 2 … any other relevant response"). Use `text` only for a **single-token answer
   with a canonical spelling** (`COMECON`, `Gandhi`, `Zaire`, `Kinshasa`, a named plan), list accepted
   spellings with `|`, no spaces beyond what the `text` keyboard types, and keep everything
   definition/quotation/explanation-shaped as `multiple_choice`/`multi_select`/`match`/`ordering`.
   Multi-word names are fine (the `text` keyboard has a space key) but multiply the spelling variants —
   prefer a choice item.
3. Mixed lessons are fine: each question declares its own keyboard.

**P2 is deliberately NOT retrofitted — owner decision 2026-10-07; it is a known, accepted
deviation, not a template.** None of the six `scripts/add-history-2025-nov-p2-q{1..6}.js` declares
`keyboard_type` (checked 2026-10-07), and `backfill-keyboard-types.js` skipped History as a
`None`-routed subject, so the dev rows and the ≈10 live prod rows are `NULL` and will stay so. Every
P2 `fitb` answer is bare numeric, so once the always-custom resolver ships those rows resolve to the
fallback `Text` keyboard, where digits and `.` remain typeable — they keep working, they just get a
bigger keyboard than needed. What this means for everyone after:

- **Never copy a P2 History script as the starting point for a new one.** Start from
  `tools/upload-script-template.js` and add `keyboard_type` to every `fitb` (`standard_math` for
  numbers, `text` for a permitted single-token word). The P2 scripts are the *content* precedent
  (source handling, `aiExplanation` shape, image paths), not the *schema* precedent.
- **Re-running a P2 script will fail `validate-questions.js`** (`KEYBOARD-04` is an error). Do not
  re-run them, and do not "fix" them by loosening the rule; if one ever has to change, patch the
  rows with `patch-question.js` and declare the keyboard in that same change.
- **P2 is not evidence for the keyboard rules.** Anything this profile says about declarations comes
  from `KEYBOARD-04` and the P1 analysis; P2's `fitb` never declared anything.
- **Exam gate unaffected:** P2's rows being `NULL` adds nothing to the exam's derived minimum; only P1
  (or later) `text` questions do. Under `VER-08` P2 still sits behind the exam-level gate if any
  sibling uses `text`.
- Every future History paper (`nov_p1`, `june_p1`, `june_p2`, later years) is authored to the
  rules above from its first script.

**Phase 5 / review tooling.** The 2026-09-12 ledger note below ("`review-capture-answers.js`
can't drive the system keyboard, so every History `fitb` came back `MISSING_KEY`") is a
property of the *old* `None` path. A declared `standard_math` `fitb` is typed through the
custom keyboard's own `maths_key_<label>` test tags, so Phase 5 should be able to run
end-to-end for History `fitb` once it is declared — verify on the first P1 review rather than
assuming; if it still reports `MISSING_KEY`, that is a tooling bug, not an answerability pass.

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
by `DESIGN-HIST-03`'s restriction of `fitb` to numbers and rare single-token words — this paper's natural
short-answer shape (define, quote, name, explain symbolism, comment on reliability) is
almost entirely textual. `fitb` reserved for the minority of genuinely numeric
sub-questions (years, counts, percentages). No MathText; `fraction`/`equation`/`steps`
not used — nothing in this subject is symbolic/numeric-procedural. Question `type`
vocabulary: `definition`, `interpretation` (source reading, reusing Geography's sense
of the term rather than inventing a new one), `application` (synthesis/argument
evaluation).

*P1 analysis finds nothing that needs another type* — the six P1 item shapes map onto the
same five presentations (`multiple_choice`, `multi_select`, `match`, `ordering`, `fitb`; table
under *Source-based questions*). Every `fitb` declares `keyboard_type: 'standard_math'`
(*Keyboard* above).

## Subject rules (beyond core)

- **Content-based subject (`DESIGN-UNI-08`)**, explicitly named there alongside
  Geography/Life Sciences/Chemistry. Historical facts (causes, dates, key figures,
  sequences of events) have a small fixed answer space — reword-only freshness doesn't
  satisfy `DESIGN-UNI-01`. Prefer relational framing (causal chains, comparison between
  periods/movements, "what changed between X and Y") grounded in the curriculum
  document (`DESIGN-UNI-09`).
- **Marking-guideline vocabulary (*P1* memo; P2's uses the same).** `(2 x 1)` = two facts at
  1 mark each; `(any 2 x 2)` = the memo lists more acceptable points than needed — any two earn
  2 marks each; `(1 x 2)` = one point, 2 marks. **`[Extraction … – L1]`, `[Interpretation … – L2]`,
  `[Determining the reliability/usefulness/limitations … – L3]`, `[Comparison of evidence … – L3]`,
  `[Interpretation, evaluation and synthesis – L3]`** tag each item's skill and cognitive level
  (weights 30 % L1 / 40 % L2 / 30 % L3, CAPS §4.3.2). "Any other relevant response" = the list is
  illustrative, so a practice item's *correct* option must be a listed point or an equally
  well-evidenced one, and a distractor must be genuinely **not** supported by the source.
  Extraction items are marked on the **quoted evidence**, not on a paraphrase (the memo's
  answers are verbatim, with ellipses) — an objective reframe is "pick the verbatim phrase",
  never "pick the idea". The 8-mark paragraph is marked on a 3-level holistic rubric
  (0–2 / 3–5 / 6–8) and each memo "aspect" is tagged with its source or `(own knowledge)`;
  the 50-mark essay on a 7-level content × presentation matrix (0–50).
- **Memo-vs-source cautions (*P1*).** Practice questions are fresh and must be true history —
  don't import the memo's wording where it is loose:
  - **Q4 Vietnam essay memo.** It calls the Tet Offensive "a success for the Viet Cong" and says
    more than 80 cities were "taken over"; Tet is usually taught as a military failure for the
    Viet Cong and a political/psychological turning point — frame practice items on the
    *political impact*, not on territory held. It places the *Search and Destroy* policy as a
    "response to Tet", but Search and Destroy operations began in 1965–66, before it. It calls
    napalm a "gas" (it is an incendiary) and equates **Vietnamisation** with WHAM ("winning
    hearts and minds"), which was a separate pacification programme. Keep Vietnamisation =
    Nixon's withdrawal-and-handover policy.
  - **Spelling.** The memo writes "Bobby Searle" and "Angela Davies" — Bobby **Seale**, Angela
    **Davis**; "Mobuto" appears in CAPS for Mobutu. Use the correct spellings in stems and
    options, and don't offer a misspelling as a distractor.
  - **Paper stems vs sources.** 2.3.4 says "[Senator] Clarke", Source 2C says "Clark". Source 1B's
    caption/introduction says the cartoon depicts **President Truman**, but the drawn figure is
    the Uncle Sam hat-and-goatee personification of the USA — in a cartoon-reading practice item
    ask what the figure *represents* (the United States) rather than asserting it is Truman. The
    paper's 1.2.1(a) describes the dark mass as "a bear/wolf"; it is labelled "COMMUNIST
    INFILTRATION AND DICTATORSHIP THREATS" with onion domes (Kremlin) — safe wording is
    "the communist threat".
  - **Decimal comma.** The paper writes `$41,7 million` and `22 million dollars`; store `.`
    in answers, follow the source's own form in displayed stems.
- **One source set per lesson (`DESIGN-HIST-01` across lessons).** Q2's Source 2B is about Mobutu
  and Zaire, Q2's 2A mentions Vietnam — which are also the Q5 and Q4 essay topics. Keep a lesson's
  practice questions pinned to *its own* four sources (source-based) or its own topic (essay)
  so the six lessons don't duplicate each other's facts; link in tags, not in content.
- Tags: historical concepts/events/figures only, never invented scenario wrappers —
  same discipline as Geography's `PIPE-06`.

## Curriculum units (reference until a curriculum collection exists)

From this paper's own three Section A / three Section B topics, all Grade 12 CAPS
content: `civil_resistance_1970s_80s` (COSATU, Black Consciousness Movement, crisis of
apartheid), `coming_of_democracy` (negotiations 1990–94, TRC/coming to terms with the
past), `end_of_cold_war_new_world_order` (1989 events, Gorbachev/Glasnost/Perestroika,
BRICS/Global North–South realignment). Illustrative only — the real set comes from the
Phase 3.5 vocabulary dump once a first session populates it (`PIPE-08`), same as every
other subject. (The P2 set above has since been populated by the `nov_p2` session — dump it
before authoring P1.)

*P1* adds three units — **`cold_war`**, **`independent_africa`**, **`civil_society_protests_1950s_70s`**
(named to stay distinct from P2's `civil_resistance_1970s_80s`, CAPS Topic 4, which is a
different topic — don't merge them). CAPS Grade 12 topics to hang topics/subtopics from (names
are CAPS's; slugs are flat per the vocabulary dump):

| Unit | CAPS topics → worth a node |
|---|---|
| `cold_war` | Origins (spheres of interest, satellite states, containment: Truman Doctrine, Marshall Plan, **Molotov Plan/COMECON**, Berlin Crises, NATO/Warsaw Pact, Cuban crisis, "who was to blame?"); Extension — Vietnam (stages 1957–75, guerrilla warfare, US escalation, withdrawal) and China (alternate) |
| `independent_africa` | Ideas that influenced independent states; Congo (Lumumba, Mobutu — political/economic/social/cultural policies); Tanzania (African socialism); Africa in the Cold War — Angola (colonialism and independence, MPLA/FNLA/UNITA, USA/USSR/Cuba/China/South Africa involvement, Cuito Cuanavale) |
| `civil_society_protests_1950s_70s` | US Civil Rights Movement (King and Gandhi's influence, civil disobedience: boycott/sit-ins/marches, gains); Black Power (reasons, Black Panther Party, Carmichael, Malcolm X, gains); conclusion — progress made |

Cross-paper nodes are likely (`DESIGN-UNI-09` — *check the dump first*): P2's
`end_of_cold_war_new_world_order` and P1's `cold_war` are different CAPS topics (1 vs 6) under
one theme; reuse a node only where it is genuinely the same concept (e.g. *Domino Theory*,
*containment*), never to merge the units.

## Completed papers ledger

**`nov_p1` — authored and uploaded to dev, 2026-10-07; emulator review and prod push still open.**
All 6 lessons (3 source-based, 3 essay), `order` 1–6, 51 practice questions, validated
(`--curriculum`, 0 errors, 0 warnings, derived minimum 2.0.0) and upserted to dev Cloud SQL, one
commit per lesson (`dc19588`…`a8a8eaf`). Verified in Postgres: 6 lessons / 51 questions all
published, every `fitb` declares `keyboard_type = 'standard_math'`, no `\n` in any stem,
every question has unit/topic/subtopic, `aiExplanation` sums to 50 marks per lesson (18 entries
for each of Q1–Q3, one for each of Q4–Q6) so **300/300 marks of the question bank covered**.
All 36 image URLs (question pages, memo pages, 12 source images) return 200 and are distinct
objects (no `question_N.png` collision — each source was renamed `annexure_<label>.png` before upload).

| Lesson | Order | Real sub-Qs | Marks | Practice Qs | Presentations used |
|---|---|---|---|---|---|
| Question 1 (Cold War — containment, 1947) | 1 | 1.1.1–1.6 (18) | 50 | 9 | multiple_choice, multi_select, fitb, match, ordering |
| Question 2 (Independent Africa — USA in Angola) | 2 | 2.1.1–2.6 (18) | 50 | 9 | multiple_choice, multi_select, fitb, match, ordering |
| Question 3 (Civil society — King's non-violence) | 3 | 3.1.1–3.6 (18) | 50 | 9 | multiple_choice, multi_select, fitb, match, ordering |
| Question 4 (Cold War — Vietnam, essay) | 4 | 4 (essay) | 50 | 8 | multiple_choice, multi_select, fitb, match, ordering |
| Question 5 (Independent Africa — Mobutu, essay) | 5 | 5 (essay) | 50 | 8 | multiple_choice, multi_select, fitb, match, ordering |
| Question 6 (Civil society — Black Power, essay) | 6 | 6 (essay) | 50 | 8 | multiple_choice, multi_select, fitb, match, ordering |

**Keyboard outcome.** The paper was authored with `text` permitted (owner accepted the 2.4.0 gate)
but **no question needed it**: every typed blank is a year, a count or a computed figure (1946, 6, 22,
58.3, 3, 1965, 1971, 1966), declared `standard_math`. Consequently the 2025 exam derives the floor
(2.0.0), `apply-exam-gate.js` wrote nothing, and P1 is not held behind the 2.4.0 release. The upload
script's post-upload gate step confirmed it ("derived minimum is the floor — no gate needed").

**`DESIGN-UNI-06` tally for `nov_p1`:** 2 of 20 `multiple_choice` questions have the correct answer at
`metadata` index 0 (10 %, exactly at the cap — Q1's Domino Theory item and Q4's thesis item). A paper
total, tracked separately from P2's 2 of 28.

**What was new in the authoring, worth reusing.**
- **Curriculum rows are per (unit, topic, subtopic), not flat.** `create-curriculum-node.js` derives a
  hierarchical id, so the same subtopic slug (`evidence_extraction`) must be created once under *each*
  topic that uses it — 26 subtopic rows for 6 topics. The vocabulary dump collapses them to bare slugs,
  which hides this; the upload's FK preflight is what catches a missing one. Each create call opens its
  own connection (~5 s), so a batch of ~50 rows (3 units, 6 topics, 26 subtopics, 5 skills, 24 tags) runs
  for several minutes — run it in the background.
- **`validate-questions.js` extracts `const questions = [...]` by regex and evals it in isolation**, so the
  array must be a pure literal (no helper calls, no outer constants, no `];` inside a string). The six
  scripts were generated from compact Python definitions that emit literal arrays; the generator is not
  kept in the repo — the scripts are the source of truth, as for every other paper.
- **Fresh angles actually used (`DESIGN-HIST-01`).** Verdict-reversal on source evaluation (limitations of
  1A, usefulness of 2C, reliability caution on 2D/3B rather than the exam's own reliability/limitations
  items); attribution items (match each quotation to its source; match each speaker in 3D); chronology
  items built from the source introductions; cross-source pairings the exam did not ask (1C↔1D, 2B↔2C);
  a real calculation (2B: $100 m requested vs $41,7 m authorised → 58.3).
- **Memo cautions applied.** Practice items on Tet are framed on political impact; Vietnamisation is kept
  distinct from "winning hearts and minds"; Seale/Davis spelled correctly; Source 1B is described as a
  figure representing the USA, not asserted to be Truman.

**Still open for `nov_p1`:** (1) the emulator full-paper review (`review-paper.md`) — not run; in
particular confirm on the first `fitb` that a declared `standard_math` History question drives through
Phase 5 (this profile's *Keyboard* section predicts it should); (2) the prod push
(`push-paper-to-prod.js`; the exam is at the floor so nothing blocks it, but it is owner-gated data
mutation); (3) the P2 `keyboard_type` non-retrofit stays as documented.

**`nov_p2` Section A (Q1–Q3) — complete, 2026-09-12.** All 3 lessons authored,
validated, and upserted to dev (Cloud SQL); image URLs spot-checked resolving (200)
with no cross-lesson bleed. `subjects` reference row created this session (`id:
"history"`, `color: "#B8860B"`, `icon: "landmark"`, `min_app_version: null` — confirmed
against `ObserveAvailableSubjectsUseCase.kt` that `null` falls back to `isActive`, the
same state Maths/Math Lit/English HL/Geography are already live in).

| Lesson | Order | Real sub-Qs | Marks | Practice Qs | Presentations used |
|---|---|---|---|---|---|
| Question 1 (Civil Resistance — COSATU) | 1 | 1.1.1–1.6 (17) | 50 | 8 | multiple_choice, fitb, multi_select, ordering, match |
| Question 2 (Coming of Democracy — TRC/Farisani) | 2 | 2.1.1–2.6 (17) | 50 | 8 | multiple_choice, fitb, multi_select, match |
| Question 3 (End of Cold War — BRICS) | 3 | 3.1.1–3.6 (16) | 50 | 8 | multiple_choice, fitb, ordering |

150/300 marks of the full question bank covered (Section A only — see Paper structure's
"150 vs 300" note; Section B's three essay questions, Q4–Q6, are still open). Each
`aiExplanation.sub_questions` entry maps 1:1 to a real numbered exam sub-question with
its real marks (Geography's convention, not English's `marks: null` one, since these
sub-questions have real mark allocations).

**Marking guideline sourced mid-session, 2026-09-12 (`files/History P2 Nov 2025 MG Eng.pdf`) — all three lessons' `ai_explanation` rewritten against it, not left on the
first source-text-only derivation.** Worth naming explicitly because several official
answers differ from what a plain close-reading of the sources alone would produce, not
just in wording:
- 2.3.1's accepted quote is the source's *political-objective* sentence, not the
  formal-compliance sentence immediately before it in the same source — both are true
  statements in Source 2C, only one is the memo's accepted answer.
- 2.3.3's "oral testimonies" refers to the amnesty *applicants'* testimony in Source 2C,
  not Farisani's own testimony in Source 2B — an easy source-mixup this paper's own
  wording invites, since both sources involve someone testifying.
- 3.4.3's accepted reasoning includes the Global North's *ageing/declining* population
  vs. BRICS+'s workforce advantage — a demographic angle no amount of close-reading the
  sources produces, since neither source states it explicitly.
- 1.6/2.6/3.6's own-knowledge points (UWUSA as a rival, government-aligned union
  countering COSATU; the New Development Bank as an IMF/World Bank alternative;
  Thailand's interest in joining BRICS) aren't derivable from the sources at all —
  genuine outside historical knowledge the memo expects, not source comprehension.

**Second image-collision bug hit and fixed this session, same root cause as the first
(see below), different files.** The memo PDF's own extracted pages are also named
`question_N.png` by `extract-exam-pages.py` — uploading them as-is a second time
overwrote the real exam question pages again. Fixed the same way: rename to
`memo_N.png` before calling the upload tool. **Generalise this lesson beyond History:**
`extract-exam-pages.py` always names output `question_N.png` regardless of source
(exam page, addendum source, or memo page) — any extraction whose content isn't
literally "the question paper" needs a rename pass before upload, every time, for every
subject using this tool.

**`DESIGN-HIST-01` in practice — every practice question stays pinned to the real
source, tests an angle the exam's own sub-questions didn't.** E.g. Q1's practice set
never repeats "quote evidence COSATU was the largest federation" (the exam's own 1.1.1)
but asks about the same Source 1A's total-membership figure, and about a completely
different source (1C's recruit count) the exam's 1.1–1.6 never turned into a discrete
fact-extraction item. One genuinely fresh cross-source find this session: Source 3A
lists five countries joining BRICS on 1 January 2024, but the real exam's own 3.1.4 says
"six new countries" — Source 3D's footnote resolves this (Argentina had already
withdrawn before that date), which became Q3's own Question 5, a corroboration item
the real exam never asks.

**`DESIGN-HIST-03` in practice — `fitb` stayed numeric-only across all 24 practice
questions,** used for dates/counts/percentages/one calculated value (Q3's Question 3:
computing the percentage-point change between 1995 and 2023 from Source 3C's graph,
genuine relational work per `DESIGN-UNI-08`, not just extraction). Every
name/term/quoted-phrase question went to `multiple_choice`/`multi_select`/`match`
instead, confirming the profile's prediction that `fitb` would be a minority
presentation for this subject.

**`DESIGN-UNI-06` running tally, Section A only:** 0 of 15 `multiple_choice` questions
across these 3 lessons have their correct answer at `metadata` index 0 (0%), well under
the ~10% cap but drifting toward the "never index 0" pattern the 2026-09-12 revision
specifically warned against — deliberately place one at index 0 in a future lesson to
correct this, don't let it compound further.

**Real per-question images extracted per source, not per exam question** — 4 separate
`supplementary_materials` entries per lesson (`Source 1A`–`1D` etc.), each its own GCS
object (`exam_papers/dbe/history/2025/nov_p2/q{N}/annexure_{label}.png`), matching
`PIPE-03`'s "one entry per labeled TEXT/extract" rule.

**Local tooling gotcha hit this session, now avoided — same failure family as
Chemistry's `temp/images/qN/` collision, but on the *destination* side this time.**
`tools/upload-exam-images.js` routes purely on local filename prefix
(`question_`/`annexure_`/`memo_`), and `tools/extract-exam-pages.py` always names its
output `question_N.png` regardless of what it conceptually contains. Extracting each of
Q1's 4 sources into separate directories (each producing a file literally named
`question_1.png`) and uploading them with `--supplementary-type source` did **not**
route them to an annexure path — every one landed on the exact same `question_1.png`
object key, silently overwriting each other and the real exam page. **Fix: after
extraction, copy/rename each source's PNG to a uniquely-named `annexure_<label>.png`
before calling the upload tool, one file per invocation.** Caught immediately via a
post-upload `curl` HTTP-200 sweep across all 6 expected URLs per lesson (not just
checking the tool's own success output) — applied correctly from Q2 onward, and the Q1
corruption was caught and fixed (re-uploaded the real exam pages, then re-uploaded each
source under its own unique filename) before the lesson was written to Postgres.

**Full-paper review — CLOSED CLEAN, 2026-09-12** (`workflows/generate/review-paper.md`,
report at `AMPM/temp/review/nov_p2_2025/report.md`): all 3 lessons / 24 questions
captured on emulator and reviewed against their screenshots. 21 PASS, 7 AUTO_FIX (all
one defect class), 0 FLAG.

**AUTO_FIX — every `fitb` question was unanswerable or degraded, one root cause.**
User-reported: "the fitb is not working, the text seems to be too much and it's hiding
the fitb." `FillInTheBlank.kt` renders `metadata` tokens in a single `Row` that does
**not** wrap — every one of this paper's 7 `fitb` questions had a `metadata`
prefix/suffix token that duplicated the entire `question` sentence, instead of the
short residual label `presentations/fitb.md`'s own worked example actually uses
(`"2.5 hours = "`, not a restated sentence). A long prefix wraps into a tall multi-line
`Text` that pushes the blank input off-screen entirely (6 of 7 — genuinely
unanswerable); a long suffix after a short prefix instead overflows off-screen unseen
without hiding the input (1 of 7 — degraded, not blocking). Fixed by shortening every
fitb `metadata` token, patched live via `patch-question.js`, verified via `pm clear` +
re-capture (all 7 confirmed rendering correctly), and updated the source-of-truth
scripts to match so a re-run doesn't revert it. Documented generally in
`presentations/fitb.md` since the root cause applies to any subject's `fitb`, not just
History's. **Lesson for future lessons: never restate the full question sentence in
`fitb` metadata — always author it as a short label, from the start.**

**Phase 5 (answerability) run, with a caveat: the tool itself can't drive the system
keyboard yet.** (Update 2026-10-07: this is a property of the old system-keyboard path — see the Keyboard section; it should not recur once `fitb` declares `standard_math`.) `scripts/review-capture-answers.js` only types via Compose
`maths_key_$label` tags, which don't exist for a `None`-keyboard subject (Geography,
History) — the system IME is a real Android keyboard outside the app's Compose tree.
All 7 `fitb` questions came back `MISSING_KEY` on every character, which looked like a
hard failure but wasn't: the `_typed.png` screenshots show each input correctly
focused (cursor visible) with a real system keyboard genuinely open. Verified
answerable by screenshot instead of by the tool's own PASS/FAIL signal. Documented as a
tooling gap in `review-paper.md`'s Phase 5 section (a `None`-keyboard subject's
`MISSING_KEY` result needs the same screenshot-based sanity check from now on, not a
tool fix — that's a separate task for whoever next needs Phase 5 automated end-to-end
for Geography or History).

## Section B — complete, 2026-09-12

**All 3 essay lessons (Q4–Q6) authored, validated, and upserted to dev.** Same
`DESIGN-HIST-01`-style discipline extended to essay questions per `DESIGN-HIST-02`: no
free-text essay input exists in the app, so each lesson's 8 practice questions mix
fresh content-knowledge items (real historical facts about the period — Biko/BCM,
1990–1994 negotiations, Glasnost/Perestroika — freely reworkable since this is general
historical knowledge, not exam-owned source material) with essay-strategy items
(thesis identification, PEEL paragraph-structure sequencing) grounded in the real
memo's own synopsis/main-aspects framing.

| Lesson | Order | Marks | Practice Qs | Presentations used |
|---|---|---|---|---|
| Question 4 (Civil Resistance — Biko/BCM) | 4 | 50 | 8 | multiple_choice, fitb, multi_select, ordering |
| Question 5 (Coming of Democracy — Negotiated Settlement) | 5 | 50 | 8 | multiple_choice, fitb, multi_select, ordering |
| Question 6 (End of Cold War — Glasnost/Perestroika) | 6 | 50 | 8 | fitb, multiple_choice, multi_select, ordering |

300/300 marks of the full question bank now covered (Section A + Section B — see Paper
structure's "150 vs 300" note; a student attempts 150 of these on the day). Q4/Q5/Q6
share one uploaded exam page (all three prompts appear together on it, same
once-per-paper reuse pattern as a formula sheet); each has its own 2-page memo extract.
`aiExplanation` carries **one** guidance entry per lesson (`marks: 50`, synopsis/
main-aspects/rubric summarised from the real memo as approach guidance, not a model
essay) rather than per-sub-question entries, since the real exam has no numbered
sub-parts here — just one essay prompt.

**`DESIGN-UNI-06` index-0 correction applied as planned:** 2 of the new 13
`multiple_choice` questions across Section B were deliberately placed with their
correct answer at `metadata` index 0 (Q4's Question 2, Q5's Question 3), correcting the
0%-across-Section-A drift noted earlier. Combined running tally: 2 of 28
`multiple_choice` questions at index 0 (7.1%), under the ~10% cap and no longer flat 0%.

**Full-paper review — CLOSED CLEAN, 2026-09-12** (`workflows/generate/review-paper.md`):
all 24 Section B questions captured and reviewed against their screenshots. 24 PASS, 0
AUTO_FIX, 0 FLAG — no repeat of the Section A fitb defect (Section B's one `fitb` per
lesson used short metadata correctly from the start), and the new long-text ordering/
multi_select chips (PEEL-paragraph sentences, thesis-statement options) all render
fully without clipping or overflow.

**Concurrent-session collision, second instance this paper — now at the review-tooling
layer, not just the upload layer.** A separate concurrent Claude Code session
(reviewing `life_science`'s own `nov_p2` paper) was actively driving the *same*
emulator via `adb` at the same time, causing `review-capture.js` to intermittently fail
with "null root node returned by UiTestAutomationBridge" and wiping the shared
`AMPM/temp/review/nov_p2_2025/` scratch directory (manifest, screenshots, report — all
gitignored, no real data lost, but the working files were gone mid-review). That
session had already independently patched `review-build-manifest.js` to namespace its
output directory by subject (`temp/review/<subject>_<paper>_<year>/`), which is what
this session's manifest rebuild picked up automatically (`history_nov_p2_2025/`
instead of the shared `nov_p2_2025/`) — no further tooling fix needed here. **Lesson:
if another session might be reviewing a different subject's paper concurrently, expect
`temp/review/` collisions on the old un-namespaced path, and check `ps aux` for another
`review-capture.js`/`review-build-manifest.js` process before assuming a uiautomator
error is a genuine device problem** — it may just be two sessions fighting over one
emulator.

**Update 2026-10-07:** the always-custom-keyboard commit message (AMPM `d302da0a6`) counts 10 History `fitb` live on prod, so P2 has evidently been pushed since this note was written — re-check read-only before relying on it (`KEYBOARD-06` step 0). The prod-push item below is therefore likely done. The `keyboard_type` retrofit is intentionally not being done (*Keyboard* above).

**Still open:** `june_p2` once sourced. Not yet done: dev live-testing's Phase 5
answerability pass for Section B specifically (Section A's already-documented
system-keyboard tooling gap applies equally here — Section B's `fitb` questions were
verified by render/focus screenshot, not by the tool's own PASS signal), and the prod
push (dev review is now clean for the *whole* paper — Section A + Section B — so this
is the next real step, not blocked on anything further being authored).
