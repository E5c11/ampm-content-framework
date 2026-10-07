---
id: AMPM-CONTENT-SUBJ-DBE-LIFE-SCIENCES
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY, AMPM-CONTENT-SUBJ-DBE-CHEMISTRY]
tags: [subject, life-sciences, dbe, profile]
---

# Subject Profile — DBE Life Sciences (Papers 1 and 2)

**Paper 2** was drafted 2026-09-12 from a paper review (`Life Sciences P2 Nov 2025`) plus CAPS, and has since been
authored, reviewed and published (ledger below). **Paper 1** was analysed and **authored 2026-10-07** from `Life Sciences P1 Nov 2025`
(paper + memo) plus CAPS Section 3.3 / 4.5.3 (16 lessons / 76 questions / 150 marks on dev — see the ledger; not yet reviewed on
the emulator, not in prod). The two papers share no CAPS strands (P1 = Reproduction, Responding to the Environment,
Endocrine, Homeostasis, plants; P2 = DNA, Meiosis, Genetics, Evolution, Human evolution), and P1 is a different
*kind* of paper: far more explain/describe prose and labelled-anatomy diagrams (see "Paper structure — Nov 2025 P1").
Life Sciences is a genuinely new subject (unlike Chemistry, which reused Physics's `subject_id`) — don't assume one
paper's shape from the other.

The **keyboard** guidance was rewritten 2026-10-07 for the 2.4.0 total-keyboard decision (`core/keyboard-input.md`
§ Routing); the P2 ledger describes work done *before* that and keeps its original wording as history.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"life_science"` (**singular** — confirmed against the live `subjects` row 2026-09-12; an earlier draft of this profile used `"life_sciences"` throughout, wrongly, before checking — fixed everywhere, including the upload scripts). Matches the app's own `SubjectMapper.kt` fallback (`displayName.lowercase().replace(" ", "_")` — `"Life Science"` → `"life_science"`), the same mechanism Geography already relies on with no explicit constant of its own. **No `SubjectMapper.kt` change needed.** |
| Postgres tables | `lessons`, `questions` — `subject_id = "life_science"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'life_science'` — empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` (`PIPE-08`) |
| Papers | `nov_p2` (2025) **authored, published** (ledger). `nov_p1` (2025) **authored on dev 2026-10-07, not reviewed, not in prod**. `june_p1`/`june_p2` presumed once June-diet papers are sourced. Both Nov 2025 papers are **one exam for gating** (`VER-01`/`VER-09`): P1 uses `text`, so the exam is gated at **2.4.0 on dev** (`exam_versions`), which also gates P2 (see Keyboard). |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ LIFE SCIENCES _ GR 10-12 Web_2636.pdf` — Grade 12 content at Section 3.3 (physical pp. 59–70 of the PDF, printed page labels 54–65); both papers' topic/weighting tables at Section 4.5.3 (physical p. 78, printed page label 73). P1 content: Strand 2 (Human Reproduction, Responding to the Environment, Endocrine, Homeostasis, plants) and Strand 1 Meiosis/Reproduction in Vertebrates — same section, earlier pages. Both consulted. |
| **Source files** | P2: `files/Life Sciences P2 Nov 2025 Eng.pdf` (question paper, 17pp, 150 marks), `... MG Eng.pdf` (memo). P1: `files/Life Sciences P1 Nov 2025 Eng.pdf` (16pp, 150 marks, 2½ h), `files/Life Sciences P1 Nov 2025 MG Eng.pdf` (memo, 9pp) — both staged in git, not yet committed at time of writing. |
| `subjects` reference row | **Already exists** — `id: "life_science"`, `name: "Life Science"`, `full_name: "Life Science"`, `code: "LIFE_SCIENCE"`, `category: "life_science_lessons"`, `sort_order: 5`, `color: "#E64980"`, `icon: "flask"`, `is_published: true` — confirmed by querying dev Postgres directly 2026-09-12 (this profile originally, wrongly, assumed it needed creating — same mistake `dbe-physics.md` already flagged once; check the DB before assuming). Pre-staged ahead of any content, same as Geography's and Physics's rows were. **`is_active` was `false` until this session** (why it wasn't showing as an onboarding option) — set to `true` 2026-09-12 at the user's request, along with `min_app_version` set from unset to `"1.0.0"` (the user's own call: current app builds read `min_app_version` for the subject gate, but older builds still read `is_active`, so both needed setting for it to show up everywhere). Unlike Physics/Chemistry's version gates, this is not currently hiding the subject from any app build — no lesson content exists yet regardless. |

## Paper structure / knowledge-area mapping (Nov 2025 P2, from paper review)

**150 marks across 3 questions**, matching CAPS's own Grade 12 Paper 2 weighting table
(Section 4.5.3) closely enough to use as the authoring reference:

| CAPS topic (Section 4.5.3) | Weighting | This paper's questions |
|---|---|---|
| DNA: Code of Life | 19% (27 marks) | Q1.1.1–1.1.2, Q1.1.6–1.1.7 (DNA replication diagram), Q1.2 (partial), Q1.5 (protein synthesis), Q2.2 (DNA fingerprinting) |
| Meiosis | 7% (12 marks) | Q1.1.8–1.1.9 (dihybrid cross via meiosis), Q1.3.1/1.3.3, Q1.4 (mitosis/meiosis diagram), Q2.1 (sex chromosomes, crossing over, non-disjunction) |
| Genetics and Inheritance | 30% (45 marks) | Q1.1.4–1.1.5, Q1.1.10, Q1.2 (partial), Q1.3.2, Q2.3 (pedigree), Q2.4 (blood-group graph), Q2.5 (palomino coat-colour genetics) |
| Evolution through Natural Selection | 15% (23 marks) | Q1.1.3 (punctuated equilibrium), Q3.3 (ratite speciation/reproductive isolation), Q3.4 (fruit-fly natural-selection experiment) |
| Human evolution | 29% (43 marks) | Q3.1 (comparative anatomy), Q3.2 (hominid brain-volume table) |

Real question structure:

| Q | Marks | Content |
|---|---|---|
| 1.1 (MCQ, 1.1.1–1.1.10) | 20 | Mixed cluster across all four strands above — same principle as `dbe-physics.md`/`dbe-chemistry.md`'s Q1 |
| 1.2 (biological terms, 9 items) | 9 | Short typed/selected term across DNA, genetics, evolution |
| 1.3 (A/B/both/none, 3 items) | 6 | Meiosis, genetics, classification |
| 1.4 (mitosis/meiosis diagram) | 8 | One shared 5-cell diagram, 6 sub-questions |
| 1.5 (protein synthesis diagram) | 7 | One shared diagram, 5 sub-questions |
| 2.1 (sex chromosomes/meiosis) | 11 | One diagram, 6 chained sub-questions (2.1.4(a)/(b)/(c) genuinely sequential) |
| 2.2 (DNA fingerprinting) | 9 | Gel/band diagram, forensics + paternity testing |
| 2.3 (pedigree, CADASIL) | 9 | 4-generation pedigree diagram |
| 2.4 (blood-group graph) | 9 | Bar graph, codominance |
| 2.5 (palomino horse genetics) | 12 | Incomplete dominance, biotechnology, genetic cross |
| 3.1 (human evolution anatomy) | 12 | No figure — comparative-anatomy reasoning |
| 3.2 (hominid brain volume table) | 13 | Table (not diagram) |
| 3.3 (ratite speciation) | 12 | World distribution map |
| 3.4 (fruit-fly natural selection) | 13 | Experimental setup diagram + two population graphs |

Marks sum to 150, matching the paper total.

Applying `DESIGN-UNI-10`: each of Q1.1, Q1.2, Q1.3 clusters by knowledge area within the
MCQ/short-answer block (rule 2); Q1.4, Q1.5, Q2.1–Q2.5, Q3.1–Q3.4 are each one continuous
scenario/diagram (rule 1) — likely **~11–14 lessons** depending on how finely Q1.1–1.3 is
split by knowledge area, same shape Chemistry's Q1 needed. Confirm the actual split when
authoring starts, per `DESIGN-UNI-10`'s own "check the curriculum document, don't just
eyeball it" instruction.

## Paper structure — Nov 2025 P1 (from paper/memo/CAPS analysis, 2026-10-07)

**150 marks, 2½ h, 3 questions of 50 marks each** (A = Q1, B = Q2, Q3 is the second half of B — the memo's own
totals: Section A 50, Section B 100). CAPS Section 4.5.3 Paper 1 weighting:

| CAPS topic (4.5.3, Paper 1) | CAPS marks | This paper's questions |
|---|---|---|
| Meiosis | 11 | only as gametogenesis: Q1.2.3 (oogenesis), Q2.2.3 (spermatogenesis — "diploid cells … meiosis … haploid") |
| Reproduction in Vertebrates | 6 | Q2.1 (precocial/altricial from % yolk table) |
| Human Reproduction | 31 | Q1.1.2, 1.1.5–1.1.8, 1.2.1/1.2.3/1.2.5/1.2.6, 1.3.1, Q2.2 (male system), Q2.3 (endometrium/menstrual cycle) |
| Responding to the environment (humans) | 40 | Q1.1.3, 1.2.2, 1.2.4, 1.3.2, Q1.5 (neuron), Q3.1 (astigmatism), Q3.2 (nervous system/reflex), Q3.3 (accommodation), Q3.4 (ear) |
| Human endocrine system | 15 | Q1.1.1, 1.1.4, Q2.5 (growth hormone investigation), Q3.5 (insulin) |
| Homeostasis in humans | 11 | Q1.1.10, 1.2.8, Q2.4 (thermoregulation), Q3.5 (diabetes) |
| Responding to the environment (plants) | 11 | Q1.1.9, 1.2.7, 1.3.3, Q1.4 (auxin/ABA/GA diagrams) |
| Human impact (Grade 11 content) | 25 | **none — no question at all this year.** Don't infer it is absent from the syllabus: 25 CAPS marks. |

Real question structure (marks verified to sum 50/50/50):

| Q | Marks | Content |
|---|---|---|
| 1.1 (MCQ, 1.1.1–1.1.10) | 20 | Mixed cluster; four MCQs carry a figure (reproductive system 1.1.5–1.1.6, sperm 1.1.8) or a table (1.1.3) |
| 1.2 (biological terms, 8 items) | 8 | Typed term in the real exam — progesterone, cataracts, oogenesis, blind spot, ovulation, chorion, abscisic acid, homeostasis |
| 1.3 (A only / B only / both / none) | 6 | Same format as P2 Q1.3 |
| 1.4 (plant-hormone diagrams A/B/C) | 8 | One shared 3-diagram figure, 6 items; letters, tropism names |
| 1.5 (neuron diagram A–F) | 8 | One figure, 8 items: type, parts by letter, function→letter, disorder |
| 2.1 (yolk % table, birds) | 8 | Table; explain/name/reason, chained 2.1.2→2.1.3 |
| 2.2 (male system diagram) | 11 | Letter **and** name (both marked), scrotum role, "name and describe" spermatogenesis |
| 2.3 (endometrium thickness table) | 14 | Hormone explanations, **draw a bar graph (6 marks)**, chained 2.3.2→2.3.3 |
| 2.4 (arteriole diagrams X/Y/Z) | 6 | Thermoregulation; 2.4.2→2.4.3 chained by diagram letter |
| 2.5 (ISS growth-hormone investigation) | 11 | Variables, validity, **calculation with unit** (25 × 0,028 = 0,7 mg), conclusion |
| 3.1 (astigmatism diagrams) | 8 | Eye parts, cornea appearance, effect on vision, treatment |
| 3.2 (nervous system diagrams) | 13 | Brain parts by letter+name, **6-mark reflex-arc description** (D → cord → E) |
| 3.3 (no stimulus) | 5 | "Describe how the eye accommodates for distant vision" — pure recall, 5-mark sequence |
| 3.4 (ear diagram) | 14 | Parts, fluid-filled parts, balance restoration (5), NIHL (2+3) |
| 3.5 (insulin graph, 3 persons) | 10 | Graph reading, **tabulate two differences (5)**, name the treatment, explain energy lack |

**What differs from P2, and why it matters for authoring:**

- **Prose, not selection, is the dominant mark type.** By my tally ~64 of Sections B+C's 100 marks are
  explain/describe/"name and describe"/tabulate answers scored against **point lists with "Any n" and a
  compulsory-mark rule** (e.g. 2.1.1 `Compulsory mark* 1 + Any 2`; 2.2.3 `Compulsory mark* 1 + Any 4`; 3.2.3 "Any 6"
  of 8 points). The memo's own principle 4/5/6/7 penalise wrong format (paragraph for a table, flow chart for a
  description). None of that is typeable-and-checkable in a `fitb` (exact-string marking) — see `DESIGN-LIFE-02`.
- **Diagrams are label-identification figures** (eye, ear, neuron, male/female systems, brain, arteriole, plant
  seedlings), not P2's analytical figures (pedigree, gel, bar graph). P2's escape hatch — re-express the scenario as
  text — works poorly for "identify part C": the figure *is* the question. See `DESIGN-LIFE-03`.
- **Three skills with no P2 analogue:** drawing a graph (Q2.3.4, 6 marks), a unit-bearing calculation (Q2.5.4, unit
  marked separately — memo principle 15), and tabulating (Q3.5.3). Each must be decomposed (`DESIGN-LIFE-04`).
- **Two-answer memo entries:** Q3.5.2 accepts "Three/nine" — the graph is the authority for the meal count, and the text
  extract of this PDF cannot settle it. Read the figure (page 16) before authoring anything that depends on it, and
  never carry an ambiguous memo line into a fresh question.
- **Repeated across this paper:** letter-**and**-name answers (2.2.1, 3.2.2) and A/B/both/none (1.3) are the
  standard shapes — the first is `match` (letters ↔ names) or `multiple_choice` of "letter – name" pairs.

Applying `DESIGN-UNI-10`: Q1.1–1.3 clusters by knowledge area (34 marks): **Human reproduction** 16 (1.1.2, 1.1.5–
1.1.8, 1.2.1/3/5/6, 1.3.1), **Nervous system and senses** 6 (1.1.3, 1.2.2, 1.2.4, 1.3.2), **Endocrine and homeostasis**
7 (1.1.1, 1.1.4, 1.1.10, 1.2.8), **Plants** 5 (1.1.9, 1.2.7, 1.3.3); Q1.4, Q1.5 and each of Q2.1–2.5, Q3.1–3.5 are their own
scenario → **16 lessons as authored** (Q3.3 has no stimulus and could have merged with Q3.1 — both eye — it was kept separate; decide
at authoring). **`DESIGN-UNI-13` candidates (genuinely chained):** Q2.1 (2.1.2→2.1.3), Q2.3 (2.3.2→2.3.3), Q2.4 (2.4.2→2.4.3);
everything else is independent. Confirm against the curriculum document, not by eyeballing (`DESIGN-UNI-09`).

## Keyboard — current rule (2.4.0 total keyboard; re-verified 2026-10-07)

**Verified in AMPM `dev` (1ca3581ef, `KeyboardResolver.kt` + `TextKeyboard.kt`) — the app wins if this drifts.**
`KeyboardResolver.resolve` is now **total**: declared `keyboard_type` → subject table → fallback (`ScientificMath` for
`steps`/`equation`, otherwise `Text`). `life_science` has no subject entry, so undeclared content falls to `Text`; the system
keyboard is never used for a lesson answer on 2.4.0+, and `keyboard_type: none` is ignored (validator **errors** on it).
**Every typed question declares `keyboard_type`** (`KEYBOARD-04`): bare-numeric blank → `standard_math` (released, **no gate**);
prose → `text` (2.4.0, **gates the exam**). Nothing is left to the fallback.

**What the `text` keyboard can type** (read from `TextKeyboard.kt`): letters A–Z (no shift, keys emit uppercase, marking is
case-insensitive), a space key, and on the second screen `0–9 . , ; : ! ? ' " ( ) - / & %`. **Not typeable:** `+ = < > ×
÷ ° → ·`, subscripts/superscripts (`Xʳ`, `Iᴬ`), any non-ASCII letter outside the Afrikaans-only accents. Marking
(`QuestionsValidator.kt`, per `core/keyboard-input.md` § Marking): trim, lower-case, `,`→`.`, trailing `. , ; ! ?` stripped
(2.4.0), `|` separates accepted alternatives, **exact string otherwise** — no stemming, no synonym credit.

**`DESIGN-LIFE-01` — revised 2026-10-07.** `enforced_by: human-review` (the validator enforces the declaration; it cannot tell
a number from a word). Supersedes the 2026-09-12 version, which was written for the pre-2.4.0 numeric-only system keyboard.
1. **Numeric `fitb`** (percentages, counts, ratios with the literal `":"` token, mass/volume/time values) →
   `keyboard_type: 'standard_math'`; unit in the `metadata` label (`KEYBOARD-02`). Released, no gate.
2. **`text` is permitted, selectively,** for a **single canonical term** — one word, or a fixed two-word term whose spelling
   is not contested (`cornea`, `synapse`, `thyroid gland`, `yellow spot|fovea|macula`) — with every accepted spelling listed via `|`
   (`LH|luteinising hormone|luteinizing hormone`; DBE itself uses UK spelling). Anything paraphrasable (explanations, "describe",
   reasons, conclusions) stays `multiple_choice`/`multi_select`/`match`/`ordering` — exact-string marking cannot credit the memo's
   "any n" point lists. Prefer a choice item whenever the term has plausible variants a Grade 12 would legitimately write
   (`blind spot` / `optic disc`, `sensory neuron` / `afferent neuron`, `geotropism` / `gravitropism`, `multiple sclerosis` / `MS`).
3. **Gating — owner decision 2026-10-07: accepted.** A `text` row derives **2.4.0**; the gate is **per exam** (`VER-01`/`VER-09`) and
   2025 Nov P1 + P2 are one exam, so P1 gates P2 too on dev (done: `exam_versions` `life_science / dbe / 2025 / november = 2.4.0`).
   Consequences to keep in mind: when this exam reaches prod, builds below 2.4.0 stop receiving it on their next sync (the live P2
   included, rows already on a device stay); `push-paper-to-prod.js` refuses P1 until 2.4.0 is tagged and `LATEST_RELEASED`
   (currently `2.3.2`) is bumped (`VER-06`/`VER-08`) — so **do not push P1 to prod before the release**. Use `text` only where a
   canonical term genuinely beats a choice item (P1 uses it five times, one per cluster at most).
4. Genotype/allele answers that need a superscript can't be typed on any keyboard → `multiple_choice`/`multi_select`
   (unchanged from P2; mostly irrelevant to P1).
5. `steps`/`equation`/`fraction`: not used in either paper. The 2.4.0 `ScientificMath` fallback would make them *answerable*
   but they have no natural Life Sciences use — Q2.5.4's calculation is a one-blank `fitb`.

**Phase 5 / review tooling.** `review-capture-answers.js` gained a system-keyboard path for `None`-routed subjects
(2026-09-12). A declared `standard_math` `fitb` is typed through the custom keyboard's own test tags, so Phase 5 should now
run through the custom keyboard like Physics — **verify on the first P1 review**; a `MISSING_KEY` would be a tooling bug,
not an answerability pass.

**P2 legacy status — not a template.** The six P2 scripts with `fitb` (`add-life-science-2025-nov-p2-q1-meiosis.js`,
`...q1-4-mitosis-meiosis.js`, `...q2-3-pedigree.js`, `...q2-4-blood-groups.js`, `...q2-5-incomplete-dominance.js`,
`...q3-2-hominid-brain-volume.js`; 8 rows, **all bare numeric**) declare no `keyboard_type` and are on
`tools/lib/legacy-keyboard-allowlist.js` (validator prints `LEGACY ALLOWANCE` per row). The honest declaration is
`standard_math` — released, no gate — and retrofitting means updating live prod rows, which is the owner's call
(`KEYBOARD-06`). **Owner decision 2026-10-07: P2 is NOT retrofitted** — it stays as shipped (all new content follows the
new format; the exam gate, if needed, is set to 2.4.0 rather than reworking P2). Once the 2.4.0 app ships they simply
get the `Text` keyboard, where digits and `.` remain typeable. **Never copy a P2 script as the starting point for a new one**
(start from `tools/upload-script-template.js` and declare `keyboard_type` on every `fitb`); delete the allowlist entries if the
rows are ever retrofitted.

### Pre-2.4.0 analysis — history, kept because the ledger below refers to it

*Everything from here to "Allowed presentation types" describes the `None`-routed behaviour that applied until 2.4.0. It is
correct for released builds (latest tag 2.3.2) and explains why the P2 content is shaped as it is; it is no longer the rule for
new content.*

`life_science` isn't in `KeyboardResolver.resolve`'s routing table (`AMPM/feature/watch/
.../KeyboardResolver.kt`), so it resolves to `QuestionKeyboardType.None` — same as
Geography. Initially assumed this made every typed blank unanswerable; **verified false
by reading the actual composables**, not by trusting `core/keyboard-input.md`'s old
wording (now corrected there too, 2026-09-12). The real behavior splits by presentation
type:

- **`fitb`/`fraction`** (`DynamicTextInput`/`RoundedTextBox` in `TextInputs.kt`): when
  `suppressSystemKeyboard = false` (true for any `None`-routed subject), these fall back
  to a **real, focusable system text field** — the device's own on-screen keyboard opens.
  But `FillInTheBlank.kt` never overrides the `keyboardType` param, so it's always
  requested as `KeyboardType.Decimal`. **A bare-numeric answer is fully typeable today,
  no app change needed.** A free-text letter answer is not reliably typeable — whether a
  decimal-mode system keyboard exposes a letters toggle varies by device/IME and isn't
  something to author against.
- **`steps`/`equation`** (`EquationInput.kt`): genuinely unanswerable for a `None`-routed
  subject — this composable has no system-IME fallback at all, it's "driven entirely by
  the [custom] keyboard via ViewModel," and `LessonView.kt` renders nothing when the
  resolved type is `None`. Avoid both presentations entirely until `life_science` is
  added to the routing table (an app change, post-prelims per this session's call).

**`DESIGN-LIFE-01` (original 2026-09-12 wording, superseded above)** — `enforced_by: human-review`. Given the above:
1. `fitb` blanks must be bare-numeric (percentages, chromosome/genotype counts, mass/
   volume changes, brain-volume percentage increase, ratio splits with the literal `":"`
   token per Geography's own pattern) — same discipline `KEYBOARD-02` already recommends
   generally, just load-bearing here rather than a preference.
2. Never use `fitb` for a plain biological-term/name answer (the Q1.2 "give the
   biological term" shape) — use `multiple_choice`/`match` instead. This is a difference
   from Geography (which never needed term-recall as `fitb` in the first place, so never
   hit this).
3. Genotype/allele answers needing a superscript character (`Xʳ`, `Iᴬ`/`Iᴮ`) can't be
   typed on *any* keyboard, custom or system — same shape as Chemistry's `DESIGN-CHEM-01`.
   Use `multiple_choice`/`multi_select` with candidate genotypes as options, same as the
   real exam's own Q1.1.5/1.1.8 already do. Plain double-letter genotypes without
   superscripts (`BbTt`) are fine typed.
4. `steps`/`equation` presentations: don't use for this subject until the app-side
   routing gap is fixed. Genetics-ratio "show your working" content (Q2.5.4's "use a
   genetic cross to show the expected phenotypic ratio") decomposes into `multiple_choice`
   (which gametes) + `fitb` numeric (final ratio, `":"`-split) instead, same as
   Chemistry's equation-decomposition approach.

**Before authoring the first lesson**: upload a couple of trial `fitb` questions to dev
and check them on the emulator (this session's own suggestion) — code-reading confirms
what *should* happen, not what actually renders on-device. Treat this section as
verified-by-code, not yet verified-by-device, until that check runs.

**Update 2026-10-04 — `keyboard_type` and the planned `text` keyboard.** Nothing above changes for
content published today. What's new: questions can now declare a `keyboard_type` (`core/keyboard-input.md`),
and a general-purpose `text` keyboard (Linear BLA-58: QWERTY + a second screen for punctuation/digits) is
specified to replace this system-IME fallback — but it is **not built**, so until it ships `life_science` typed
blanks stay bare-numeric. `validate-questions.js` now enforces this: it **warns** on any non-numeric `fitb`
answer under a `None`-routed subject and **errors** on `steps`/`equation` there (`KEYBOARD-01`).

## Allowed presentation types

Illustrative until evidenced against authored P1 content (P2's set below is evidenced — see the ledger).

- **P2 (evidenced):** `multiple_choice`, `multi_select`, `match`, `ordering` for term/genotype recall; `fitb` only for the
  numeric share (~a third of P2: percentages, counts, ratios).
- **P1 (proposed):** the same four selection types carry nearly everything — Q1.1–1.3 are native `multiple_choice`/
  `multi_select`; letter-and-name items (2.2.1, 3.2.2) are `match`; the 4-option A/B/both/none items are `multiple_choice`;
  sequence descriptions (reflex arc 3.2.3, accommodation 3.3, balance 3.4.3, spermatogenesis 2.2.3) are **`ordering`** plus
  `multi_select` for "which statements are correct" (`DESIGN-LIFE-02`). `fitb` is **numeric only** and rare in P1 (Q2.5.4
  `0.7` mg, table/graph readings such as an endometrium thickness or a meal count) → `standard_math`.
- `steps`/`equation`/`fraction`: unused. `text` `fitb`: see `DESIGN-LIFE-01` rule 2/3 (default off for P1).

## Subject rules (beyond core)

- **Content-based subject (`DESIGN-UNI-08`/`09`), more heavily than Chemistry.** Named
  explicitly alongside Geography/Chemistry/History in `core/authoring-principles.md`
  line 116. Almost all of this paper's non-numeric content is classificatory/definitional
  (biological terms, evolution facts, structure identification) — relational framing and
  actual CAPS consultation are required per-question, not a fallback for the harder cases
  the way they can be for Chemistry's more procedural half (Rate/Equilibrium/
  Electrochemistry). The genuinely procedural share here is narrower: percentage/ratio
  calculations (Q2.4.3, Q3.2.4) and the natural-selection experiment's variable
  identification (Q3.4.1–3.4.3).
- **`DESIGN-UNI-13` (linked vs. independent lessons) — this subject is exactly why that
  rule got written down.** The real paper's own sub-questions chain constantly (Q2.1.4(b)
  "the phase during which the process named in QUESTION 2.1.4(a) takes place";
  Q2.3.3(a)/(b) phenotype then genotype of the *same* individual). A lesson built from
  Q2.1 is a strong linked-lesson candidate; a lesson built from Q1.4 (six independent
  "identify part"/"which diagram shows X" questions against one shared diagram, no
  sub-question builds on another's *result*) should stay independent. Decide per lesson,
  per `DESIGN-UNI-13`'s own test — don't default either way.
- **Diagrams are the dominant content shape, far more than Chemistry or Physics.** Of the
  14 real sub-questions, only Q3.1 (comparative anatomy) has no figure at all. New
  `supplementary_material.type` values will be needed beyond Chemistry's `"structure"`
  and Physics's `"diagram"|"circuit"|"graph"|"table"` set — at minimum a pedigree
  diagram and a DNA-fingerprint/gel-band diagram. The client only renders the image and
  doesn't branch on `type`, so naming these is free — pick a convention when the first
  lesson needing one is authored (e.g. `"pedigree"`, `"gel"`) rather than retrofitting
  later.
- **Freshness is harder for diagram questions than numeric ones** (`DESIGN-UNI-01`). Cell/
  meiosis/pedigree diagrams don't have Chemistry's condensed-text-notation escape hatch —
  they're inherently pictorial. A fresh version needs either new label assignments on a
  regenerated diagram or a different organism/scenario, not just new numbers.
- **Genetic crosses and pedigrees: decompose, never ask to draw** (mirrors
  `DESIGN-PHYS-03`/`DESIGN-MATH-04`'s graph/proof decomposition). "Use a genetic cross to
  show the expected phenotypic ratio" (Q2.5.4) has no typed or select-from-options
  equivalent for the full working — break into gamete-identification (`multiple_choice`)
  and final-ratio (`fitb`, numeric, `":"`-split) sub-questions instead.
- **Shared-diagram reuse**: multiple fresh practice questions in one lesson may point at
  the identical `supplementary_material.image_urls` value (established pattern, same as
  Physics/Chemistry's formula-sheet reuse) — each question must still stand on its own
  given the figure (`DESIGN-UNI-02` default) unless the lesson is explicitly authored as
  linked (`DESIGN-UNI-13`).
- **Numeric answers carry units where the real exam does** (extends `DESIGN-PHYS-01`) —
  `mℓ` (brain volume), `%`, counts with no unit (chromosome number). Round per whatever
  instruction this paper's own front matter specifies (none of the general "round to two
  decimal places" instructions seen in Physics/Chemistry appeared in this P2's
  instructions page — check per-question, don't assume it applies here by default).

### Paper 1 rules (added 2026-10-07 — proposed, not yet evidenced against authored content)

- **`DESIGN-LIFE-02` — explain/describe/"name and describe" items become selection, not typing.** `enforced_by: human-review`.
  The memo marks these against point lists (`Any 4`, `Compulsory mark* 1 + Any 2`), which exact-string `fitb` cannot credit and
  which a free-text box in this app cannot grade at all. Convert by what the mark is *for*: a **sequence** (reflex arc,
  accommodation, balance restoration, vasodilation chain, sound to impulse) → `ordering` of the memo's own steps (3–6 items;
  keep every wrong-order distractor a plausible misordering, not a different pathway); a **set of correct statements** →
  `multi_select` with the memo points as correct options and *common misconceptions* as distractors (e.g. for accommodation:
  "ciliary muscles contract", "suspensory ligaments slacken", "lens becomes more convex" — each genuinely the
  mirror-image error, not nonsense); a **cause-and-effect reason** (2.4.3, 3.1.3, 3.5.5) → `multiple_choice` whose distractors reverse
  direction (more/less, dilate/constrict). The practice question should test the *same reasoning with fresh content*
  (`DESIGN-UNI-01`/`02`: another arteriole scenario, another sense organ, another hormone), not re-ask the memo line.
- **`DESIGN-LIFE-03` — label-identification diagrams.** `enforced_by: human-review`. (a) A fresh version of "identify part C"
  needs a **real anatomical figure** — and the P2 practice of re-expressing a figure as a text scenario defeats the skill here.
  Two honest options: reuse the exam page via `question_image_urls` as the lesson's *real-question* anchor (already the
  pipeline's convention), and for the **fresh practice questions** either (i) ask the part by *function* with no figure
  (relational framing, `DESIGN-UNI-08`: "which structure stores sperm until they mature?" → options) or (ii) generate a clean
  schematic (matplotlib/SVG→PNG, lettered labels) via `tools/upload-question-supplementary.js`. P2's generated diagrams
  (pedigree, gel, bar graph) were simple geometry; an eye, ear or neuron is not — if a generated anatomy figure is not
  clearly correct on inspection, drop to option (i). Never wire a figure whose labels you have not cross-checked against the
  question text (the P2 gel-label bug, ledger). (b) The standard shared-figure reuse rules from P2 apply.
  (c) **A letter-bearing question must say which figure and which letter exists** — the real paper's "diagram X/Y/Z" and
  "parts A–F" are meaningless without the picture, so a question that depends on a figure always carries `supplementary_material`.
- **`DESIGN-LIFE-04` — the three skills with no typed equivalent.** `enforced_by: human-review`.
  *Drawing a graph (Q2.3.4, 6 marks):* never ask to draw. The memo marks six criteria — **T**ype, **C**aption (both variables),
  **L**abels + unit, **S**cale/equal bars, **P**lotting (1–4 / all 5). Decompose into `multiple_choice` (which graph type suits
  discrete categories vs. a continuous variable — memo penalises histogram/line for a bar-graph request), `multi_select`
  ("which of these must a caption/axis include"), and a numeric `fitb` for a plotted value (`13` mm at day 21).
  *Unit-bearing calculation (Q2.5.4):* a one-blank `fitb` `standard_math`, answer bare `0.7`, **unit in the label** (`mg`).
  The memo allocates a separate mark to the unit (principle 15), which a bare-numeric blank cannot test — add a
  `multiple_choice` for the unit (mg / g / mℓ / mg per kg), as Physics' decomposition does. Decimal comma in the paper
  (`0,028`) is stored with `.` (`,`→`.` is also normalised at marking). *Tabulating (Q3.5.3):* `match` (difference ↔ treatment)
  or a `multiple_choice` over completed 2-row tables; the "table + any 2×2" mark structure is not reproduced.
- **Experiment/investigation items (Q2.5.1–2.5.3, 2.5.5)** — dependent variable, three constants, purpose of the control
  group, conclusion — are the most procedural part of P1 and decompose cleanly: `multiple_choice`/`multi_select` over named
  variables of a *fresh* experiment (different organism/hormone), with distractors from the independent variable and from
  uncontrolled factors. Same shape as P2 Q3.4.1–3.4.3.
- **Source data is part of the question, so copy it exactly.** Q2.1's yolk table, Q2.3's endometrium table and Q3.5's graph
  carry the answers; a transcription slip silently changes a memo answer. Cross-check every number against the paper image
  before wiring (`DESIGN-UNI-02`), and keep each fresh question self-sufficient given its own table/figure.
- **SA spelling in stored options and `|` alternatives:** the paper uses UK forms (`oestrogen`, `aqueous humour`,
  `gravitropism`/`geotropism`, `adrenalin`). Options display exactly as the exam writes them; any `text` alternatives list the US
  variant too (`DESIGN-LIFE-01` rule 2).

## Curriculum units (Grade 12, CAPS Section 3.3)

### Paper 2 scope — Strands 1 and 4

**Strand 1 — DNA: Code of Life** (Term 1, 2½ weeks): DNA location/structure/replication
(Watson-Crick-Franklin-Wilkins), genes/non-coding DNA, RNA (types, transcription,
translation, genetic code). **Meiosis** (Term 1, 2 weeks): purpose, gamete production,
genetic variation (crossing-over, random segregation), non-disjunction/Down's syndrome.

**Strand 1 (continued) — Genetics and Inheritance** (Term 2, 4 weeks): Mendel's genes/
alleles/dominant-recessive; monohybrid and dihybrid crosses (complete and incomplete
dominance, codominance); sex chromosomes and sex-linked alleles (haemophilia, colour
blindness); mutations (harmless/harmful, disorders, chromosomal aberrations, natural
selection link); genetic engineering (stem cells, GMOs, cloning); mitochondrial DNA and
genetic lineage tracing; **paternity testing and DNA fingerprinting (forensics)** — the
exact CAPS phrase behind this paper's Q2.2.

**Strand 4 — Evolution by Natural Selection** (Term 3, 2 weeks): origin-of-ideas history
(Lamarckism, Darwinism, Punctuated Equilibrium — directly behind Q1.1.3); artificial vs.
natural selection; variation/gene pool/selection pressure; speciation (biological species
concept, geographic isolation, reproductive isolation mechanisms — directly behind Q3.3).

**Strand 4 (continued) — Human Evolution** (Term 3–4, 4 weeks total): anatomical evidence
(bipedalism — foramen magnum, pelvis, spine; jaw/dentition/prognathism — directly behind
Q3.1); genetic evidence (mitochondrial DNA, Out of Africa hypothesis); hominid genera
(*Ardipithecus*, *Australopithecus*, *Homo* — directly behind Q3.2's brain-volume table);
South African fossil sites (Cradle of Humankind — Sterkfontein, Kromdraai, Malapa,
Makapansgat, Taung, etc.); alternative explanations (Creationism, Intelligent Design,
Literalism, Theistic evolution) — noted in CAPS as examinable content, not seen in this
particular paper.

### Paper 1 scope — Strands 1 (Meiosis, vertebrate reproduction) and 2 (Life Processes in Plants and Animals) — added 2026-10-07

*Read from the CAPS Grade 12 content tables (physical pp. 59–70); the PDF's table layout extracts out of order, so
topic/content pairings below are checked against the 4.5.3 weighting table, not trusted from the extract alone.*

**Strand 1 — Meiosis** (Term 1, 1 week) and **Reproduction in Vertebrates** (Term 1, ½ week): strategies of animal
reproduction (external/internal fertilisation, ovipary/ovovivipary/vivipary, amniotic egg; **precocial vs. altricial** development and parental
care — directly behind Q2.1). **Human Reproduction** (Term 1, 3 weeks): structure of male and female systems; puberty; gametogenesis
(spermatogenesis/oogenesis, "relate briefly to meiosis, no individual stage names" — Q2.2.3, Q1.2.3); **menstrual cycle with
emphasis on hormonal control** (Q2.3); fertilisation, zygote→blastocyst, **implantation, placenta and its role**, gestation
(Q1.1.2, 1.1.5–1.1.6, 1.2.6).

**Strand 2 — Responding to the Environment: humans** (Term 2, 4 weeks): the nervous system (CNS with meninges, cerebrum, cerebellum, corpus callosum,
medulla oblongata and spinal cord; PNS and autonomic system — location and functions only; **reflex arc** and synapses; sensory/motor
neuron structure; injuries; **Alzheimer's disease and multiple sclerosis** — behind Q1.5.4; effects of drugs, linked to Grade 11 — Q1.5, Q3.2); receptors — **eye** (structure, binocular vision,
**accommodation, pupil reflex**; short/long-sightedness, **astigmatism**, **cataracts** — Q3.1, Q3.3, Q1.2.2/1.2.4, Q1.3.2) and **ear**
(structure, hearing and balance; deafness, grommets; **noise-induced loss** is the brief's own illustration — Q3.4). CAPS limits
sensory content to "details of the structure of the eye and ear (only)".

**Human endocrine system** (Term 3, 1½ weeks): pituitary (TSH, FSH, LH, prolactin, growth hormone), thyroid (thyroxin), pancreas
(insulin, glucagon), adrenal (adrenalin, aldosterone), gonads, hypothalamus (ADH); **negative-feedback** examples TSH–thyroxin, insulin–glucagon,
diabetes; disorders from hormone under/over-secretion (Q1.1.1, 1.1.4, Q2.5, Q3.5). **Homeostasis in humans** (Term 3, 1 week):
negative feedback for glucose, CO₂, water and salts; **thermoregulation** — skin, sweating, vasodilation/vasoconstriction (Q1.1.10, 1.2.8, Q2.4).

**Responding to the Environment: plants** (Term 3, 1 week): plant hormones (**auxins, gibberellins, abscisic acid**), geotropism and
phototropism, growth regulation by auxins, weed control by growth hormones, **plant defence — chemicals, thorns** (Q1.1.9, 1.2.7,
1.3.3, Q1.4). **Human impact** (Grade 11 content re-examined, Term 4, 2½ weeks, 25 CAPS marks): not in the Nov 2025 paper; leave
the curriculum nodes unauthored until a paper asks for them, but expect it in other years/June papers.


(Illustrative only — the real, current curriculum-node set comes from the first
authoring session's vocabulary dump, `PIPE-08`, same as every other subject.)

## App-side status — genuinely new work needed, unlike Chemistry

Unlike Chemistry (which inherited everything from Physics's `subject_id`), Life Sciences
needs its own app-side check before it can be more than partially typed content:

- **`SubjectMapper.kt`**: no change needed — the fallback branch already resolves
  `"Life Science"` → `"life_science"` correctly (verified by reading the source, not
  assumed).
- **`KeyboardResolver.kt`** (re-read 2026-10-07, AMPM `dev` 1ca3581ef): still no subject route for `life_science`,
  but resolution is now total — declared type → subject → fallback (`Text`; `ScientificMath` for `steps`/`equation`), so the
  old "blocks `steps`/`equation` and free-text `fitb`" gap is closed **on 2.4.0+**. No app change is needed for P1; on builds before
  2.4.0 the old behaviour stands (decimal-only system keyboard). 2.4.0 is **not yet tagged** (`LATEST_RELEASED = 2.3.2`).
- **`subjects` row `is_active`/`min_app_version`**: the row itself was already pre-staged
  (`is_published: true`) but `is_active` was `false` — the actual reason it wasn't
  showing as an onboarding option, not a missing row. Fixed 2026-09-12: `is_active` set
  to `true`, `min_app_version` set from unset to `"1.0.0"` (user's own call — current app
  builds gate on `min_app_version`, older builds still read `is_active`, both needed
  setting). Unlike Physics/Chemistry's version gates, this doesn't currently hide
  anything from any app build — there's no lesson content yet regardless.
- **Geography's `fitb` answerability** (flagged 2026-09-12, no Phase 5 record) is superseded by the total fallback; recheck it on
  the first 2.4.0 emulator pass rather than treating it as an open Life Sciences item.
- **Open app bug that P1 will hit harder:** the floating "view diagram" button overlapping the last option's wrapped text on
  questions with `supplementary_material` (ledger, below). P1's label-identification figures put a `supplementary_material` on
  most lessons — re-test after any app fix, and keep final options short until then.

## Completed papers ledger

**`nov_p1` (2025) — authored and uploaded to dev, 2026-10-07.** 16 lessons, 76 practice questions, 150/150 marks; verified
directly against dev Postgres (every lesson `is_published`, `questions_count` = rows, 79 `lesson_ai_explanation_sub_questions` =
the real sub-question count, every question has unit/topic/subtopic + a skill, every `fitb` declares a keyboard, all 43 image URLs
200). Scripts `scripts/add-life-science-2025-nov-p1-*.js`, one commit per lesson. **`review-paper.md` run 2026-10-07 on a 2.4.0-dev01
build: 76/76 PASS (1 cosmetic flag), Phase 5 15/15 (see below). Nothing is in prod.**

| Order | Lesson | Marks | Qs | Presentations |
|---|---|---|---|---|
| 1 | Question 1 (Human Reproduction) | 16 | 8 | multiple_choice, ordering, match, multi_select, fitb (text) |
| 2 | Question 1 (Nervous System and Senses) | 6 | 4 | multiple_choice, match, fitb (text) |
| 3 | Question 1 (Endocrine System and Homeostasis) | 7 | 4 | multiple_choice, multi_select, ordering, fitb (text) |
| 4 | Question 1 (Plant Responses) | 5 | 3 | multiple_choice, multi_select |
| 5 | Question 1.4 (Plant Hormones and Tropisms) | 8 | 5 | multiple_choice, match, multi_select, ordering |
| 6 | Question 1.5 (Structure of a Neuron) | 8 | 5 | multiple_choice, match, fitb (text), ordering |
| 7 | Question 2.1 (Egg Yolk and Parental Care in Birds) | 8 | 4 | multiple_choice, fitb (standard_math), multi_select |
| 8 | Question 2.2 (Male Reproductive System and Spermatogenesis) | 11 | 5 | match, multiple_choice, fitb (standard_math), ordering, multi_select |
| 9 | Question 2.3 (Menstrual Cycle and the Endometrium) | 14 | 5 | multiple_choice, fitb (standard_math), multi_select — generated bar graph |
| 10 | Question 2.4 (Thermoregulation) | 6 | 4 | multiple_choice, ordering, multi_select |
| 11 | Question 2.5 (Hormone Investigation) | 11 | 6 | multiple_choice, multi_select, fitb (standard_math) |
| 12 | Question 3.1 (Eye Structure and Astigmatism) | 8 | 4 | match, multiple_choice, multi_select, fitb (text) |
| 13 | Question 3.2 (Central Nervous System and Reflex Arc) | 13 | 5 | match, ordering, multiple_choice, multi_select |
| 14 | Question 3.3 (Accommodation of the Eye) | 5 | 3 | ordering, multi_select, multiple_choice |
| 15 | Question 3.4 (Structure of the Ear, Hearing and Balance) | 14 | 6 | match, ordering, multi_select, multiple_choice |
| 16 | Question 3.5 (Insulin, Glucose and Diabetes) | 10 | 5 | fitb (standard_math), multiple_choice, match, multi_select — generated line graph |

Paper totals: 32 multiple_choice (3 with the correct option at index 0 = 9%, `DESIGN-UNI-06`), 16 multi_select, 10 fitb (5 `text`,
5 `standard_math`), 9 match, 9 ordering; no True/False (`DESIGN-UNI-05`).

What this pass decided or found (beyond the rules above):
- **Q3.3 split off from Q3.1** (16 lessons, not the 14–15 first proposed): it is its own numbered question with no stimulus, and
  the real-exam page crop (`question_pages "14:start=655"`) isolates it cleanly. Q2.1/Q2.2 and Q3.2/Q3.3 share a page each — cropped
  with `--question-pages "9:end=455"` / `"9:start=455"` and `"14:end=655"` / `"14:start=655"`; memo pages are whole pages.
- **Q3.5.2's "Three/nine"** was settled from the figure: person A's insulin line peaks three times (08:00, 14:00, 20:00), so three
  meals. The aiExplanation says three.
- **Diagrams:** no anatomical figure was generated. Every label-identification question (reproductive system, sperm, neuron, eye, ear,
  brain, arteriole, plant seedlings) is asked by function/consequence with no figure (`DESIGN-LIFE-03` option (i)); the real exam
  pages carry the figures via `question_image_urls`. Two generated matplotlib graphs with fresh data (Q2.3 bar graph, Q3.5 glucose
  line graph) were uploaded as `question_supplementary/life_science/2025/nov_p1/q{9,16}/graph_1.png`.
- **Drawing/tabulating/prose were decomposed per `DESIGN-LIFE-02`/`04`:** Q2.3.4's bar graph → reading a fresh graph + the memo's
  own criteria as a multi_select; Q2.5.4's calculation → numeric `fitb` + a separate unit question; Q3.5.3's table → a `match`
  of treatment patterns; every "describe" sequence (reflex arc, accommodation, sound, ADH, phototropism, cold response, spermatogenesis)
  → `ordering`.
- **Curriculum rows created** (dev): unit `life_processes_plants_animals`; topics `human_reproduction`,
  `reproduction_in_vertebrates`, `responding_to_environment_humans`, `human_endocrine_system`, `homeostasis_in_humans`,
  `responding_to_environment_plants`; 76 subtopics, 76 skills, 45 tags. Vocabulary snapshot: `temp/curriculum-vocab-life-science-p1.json`
  (subject-and-paper-scoped); images: `temp/images/life_science/nov_p1/q{N}/` (scoped, no stale-directory collision this time).
- **Gotcha — `questions.type` is a closed FK set the validator does not check:** `application, calc, conversion, definition,
  fraction, interpretation, ordering, proof, ratio, reading, rounding` (`question_types`). Invented values (`sequence`,
  `relational`) pass `validate-questions.js` and fail the upload preflight with "Missing reference rows: question_types".
  Sequences use `ordering`; relational matching uses `application`.
- **Authored via a generator**, not by hand: a spec-per-lesson → script generator kept outside the repo
  (scratchpad). The committed scripts are the source of truth; edit them directly, not a regenerated copy.

**Review — `review-paper.md` Phases 1–5, 2026-10-07 (build 2.4.0-dev01; report `AMPM/temp/review/life_science_nov_p1_2025/report.md`).**
All 76 questions captured and reviewed: 76 PASS, 0 AUTO_FIX, 1 cosmetic FLAG (lesson 14's exam-page crop is mostly blank; not fixed — the
bucket's one-year cache makes a same-key re-upload slow to show). Long `match` labels, 6-item sentence `ordering`, 5-option `multi_select` and
both generated graphs (opened in the diagram sheet) all render fully. **Phase 5: all 10 `fitb` answered through the real keyboard, 15/15
typed runs correct** — 5 `text` questions / 11 alternatives (including the multi-word `luteinising hormone`, `thyroid gland`, `yellow spot`
via the space key) and 5 `standard_math` questions. This is the first on-device evidence that the `text` keyboard types Life Sciences terms
end to end. Selection types were reviewed for render and data, not driven to a submitted answer. Tooling: `review-capture-answers.js` only knows
`maths_key_*`; a separate runner was used for the text keyboard (tags `text_key_<UPPERCASE|digit|punct>`, `text_key_space`, `text_key_switch`;
submit = content-desc "Submit answer") — worth folding into that script (an AMPM-repo change, not made here).

**Next for P1:** tag 2.4.0, bump `LATEST_RELEASED`, `push-paper-to-prod.js` for P1 (VER-08 pushes the exam), set the prod gate before publishing
(`VER-03`).

**`nov_p2` (2025) — complete, 2026-09-12.** All 15 lessons authored, validated, and
upserted to dev (Cloud SQL); verified directly against the `lessons` table — 150/150
marks, 79 practice questions, question counts matching `questions_count` exactly.

| Lesson | Order | Marks | Questions | Presentations used |
|---|---|---|---|---|
| Question 1 (DNA: Code of Life) | 1 | 11 | 7 | multiple_choice, multi_select, match |
| Question 1 (Meiosis) | 2 | 8 | 6 | multiple_choice, multi_select, fitb |
| Question 1 (Genetics and Inheritance) | 3 | 12 | 7 | multiple_choice, multi_select, match |
| Question 1 (Evolution) | 4 | 4 | 4 | multiple_choice, match, multi_select |
| Question 1.4 (Mitosis and Meiosis) | 5 | 8 | 6 | fitb, ordering, multiple_choice, multi_select |
| Question 1.5 (Protein Synthesis) | 6 | 7 | 5 | ordering, multiple_choice, multi_select |
| Question 2.1 (Meiosis and Sex Chromosomes) | 7 | 11 | 6 | multiple_choice, multi_select, match |
| Question 2.2 (DNA Fingerprinting) | 8 | 9 | 5 | multiple_choice, multi_select, ordering |
| Question 2.3 (Pedigree Analysis) | 9 | 9 | 5 | multiple_choice, fitb, multi_select |
| Question 2.4 (Blood Group Inheritance) | 10 | 9 | 4 | multiple_choice, fitb, multi_select |
| Question 2.5 (Incomplete Dominance and Selective Breeding) | 11 | 12 | 5 | multiple_choice, multi_select, fitb |
| Question 3.1 (Human Evolution: Comparative Anatomy) | 12 | 12 | 4 | multi_select, multiple_choice, match |
| Question 3.2 (Hominid Brain Volume) | 13 | 13 | 5 | fitb, ordering, multiple_choice |
| Question 3.3 (Speciation and Reproductive Isolation) | 14 | 12 | 5 | match, multiple_choice, multi_select |
| Question 3.4 (Natural Selection Experiment) | 15 | 13 | 5 | match, multi_select, multiple_choice |

150/150 marks covered (matches the paper total), across Section A (Q1's 4 knowledge-
area clusters + Q1.4 + Q1.5, 50 marks / 6 lessons), Section B (Q2.1-2.5, 50 marks / 5
lessons), Section C (Q3.1-3.4, 50 marks / 4 lessons) — 15 lessons total (the profile's
earlier "~11-14 lessons" estimate landed close, actual count 15).

**Diagram strategy — resolved without generated images, same shape as Chemistry's
structural-formula finding but broader.** Every real sub-question flagged as diagram-
heavy in this profile's "Images/diagrams/graphs" discussion (mitosis/meiosis cell
diagrams, protein synthesis, sex-chromosome diagram, DNA-fingerprint gel, pedigree,
blood-group bar graph, world distribution map, experimental setup + population graphs)
turned out to be fully testable as a **text-described scenario** instead — the same
escape hatch Chemistry validated for structural formulas, extended further here. No
`supplementary_material` (per-question generated diagrams) was used in any of the 15
lessons — that part really was skipped this pass, not a discovery that diagrams are
never needed. A future pass could still add real generated diagrams to strengthen
fidelity, particularly for the most inherently visual content (mitosis/meiosis phase
diagrams, pedigrees).

**Exam-page images (`question_image_urls`/`memo_image_urls`) — extracted and uploaded
after all**, once the user asked directly why they weren't showing up in the app.
`extract-exam-pages.py` (whole-page crops, no `--inspect` fine-tuning needed — this
paper's page boundaries were clean) + `upload-exam-images.js` run for all 15 orders
against `files/Life Sciences P2 Nov 2025 Eng.pdf` / `... MG Eng.pdf`. For the four
knowledge-area-cluster lessons (order 1-4), whose real sub-items are scattered
non-contiguously across pages 3/4/5/6, `--question-pages` took a comma-separated page
list (e.g. `"3,4,6"`) in one call rather than needing per-item crops.

**Hit the exact stale-directory gotcha `dbe-chemistry.md` already documented, and it
still bit — worth noting it recurs across subjects, not just within one.**
`extract-exam-pages.py` doesn't clean its output directory first, and
`upload-exam-images.js` uploads every `memo_N.png` present, not just the ones from the
current run. Eight of the bare `temp/images/q2/`..`q9/` directories (order 2-9) still
held stale `memo_N.png` files from an unrelated Sep 9/11 session (Chemistry's own
authoring, same bare-`qN` collision the other ledger flagged) — these got silently
uploaded to the `life_science` GCS path alongside the correct files, caught by comparing
file timestamps inside each directory before wiring any URLs into the scripts. Fixed:
deleted the stale local files (identified by pre-today mtime) and the resulting stray
GCS objects (`gcloud storage rm` — `gsutil rm` itself failed with a credential/signature
mismatch in this environment, `gcloud storage rm` worked instead), then re-verified
every directory's file count against the expected question/memo page count per lesson
before wiring URLs into the scripts. All 15 lessons' `question_image_urls`/
`memo_image_urls` spot-checked resolving (200) after the fix. **Reinforces the other
ledger's own advice**: a subject/paper-scoped local folder name (not bare `qN`) would
have prevented this outright — worth actually adopting that convention next time rather
than re-catching the same class of bug by inspection.

**`DESIGN-LIFE-01` held up in practice**: every `fitb` used across all 15 lessons is
bare-numeric (chromosome/gamete counts, percentages, ratio counts); every genotype/term-
recall answer went to `multiple_choice`/`multi_select`/`match` instead of typed input,
confirmed live-testable on the emulator (see below). `steps`/`equation`/`fraction` were
not used anywhere in this paper.

**`DESIGN-UNI-13` (linked lessons) exercised once**: `Question 2.1 (Meiosis and Sex
Chromosomes)` (order 7) is authored linked — its Question 2 ("the process described in
the previous question") and Question 3 ("the process described in Question 1")
deliberately reference Question 1's result, mirroring the real exam's own 2.1.4(a)/(b)/(c)
chain. Every other lesson is independent.

**Live-tested on the emulator, 2026-09-12** (before the full paper existed — only the
first 3 lessons at the time): subject visibility, lesson loading, and all four
presentation types used in this paper (`multiple_choice`, `multi_select`, `match`,
`fitb`) all confirmed working via `adb`, including the specific `fitb` answerability
question this profile's keyboard section predicted from code alone. `ordering` was
authored later (lessons 5+) and has not yet been live-tested — same status as
everything else added after that check, pending the full `review-paper.md` run the user
plans to do once the whole paper was uploaded (now true).

**`subjects` row activated this session**: `is_active` was `false` (the actual reason
Life Science wasn't showing as an onboarding option — the row itself already existed,
pre-staged); set to `true`, and `min_app_version` set from unset to `"1.0.0"` (user's own
call — current app builds gate on `min_app_version`, older builds still read
`is_active`, both needed setting). See "App-side status" above for the fuller account.

**Full package completed, 2026-09-12 (second pass, after the first pass shipped
incomplete)** — the initial pass stopped at lessons/questions only, missing the pieces
every other subject's papers ship with; caught when the user pointed out nothing was
reviewable without them. Closed out properly:

- **Curriculum vocabulary snapshot**: dumped via `tools/dump-curriculum-vocabulary.js
  --subject life_science --out temp/curriculum-vocab-life-science.json` (a
  subject-scoped filename, not the shared default `temp/curriculum-vocab.json` — the
  first dump attempt silently got overwritten by a concurrent session's own dump for a
  different subject before this was caught, same collision class as the image-directory
  bug below). All 15 scripts re-validated clean against it with `--curriculum`.
- **`aiExplanation` content**: real, populated `sub_questions[]` in every one of the 15
  scripts — 84 entries total, each explaining the **actual real exam sub-question**
  using the real memo's own data (not the fresh practice scenario in the same lesson),
  per `AIEXP-06`'s intent. Format-checked programmatically against `AIEXP-03/04/05`
  (bullet counts/prefixes, numbered solution steps) — caught and fixed 14 sub-questions
  with a single-bullet `approach` field (rule requires 2-4). Caught and fixed one real
  content bug during a self-review pass: the Hominid Brain Volume lesson's
  `aiExplanation` had been grounded in the fresh practice question's fictional species
  data instead of the real exam's actual species/values (Ardipithecus ramidus 350 mL,
  Australopithecus africanus 461 mL, Homo habilis 609 mL, Homo erectus 959 mL, Homo
  sapiens 1330 mL, 3 genera, 118.39% increase) — worth flagging as the specific failure
  mode to watch for whenever a lesson's fresh scenario replaces a real diagram/dataset:
  the aiExplanation must still describe the *real* sub-question, not the substitute.
- **Generated diagrams**: 7 real images (matplotlib, not text-description substitutes)
  created and wired as per-question `supplementary_material` across 6 lessons — a DNA
  nucleotide structure (order 1 Q7), a mitosis-vs-meiosis-I chromosome-pairing
  comparison (order 5 Q4), a sex-chromosome diagram with structure A/region P labeled
  (order 7 Q4), a DNA-fingerprint gel (order 8 Q2), a pedigree diagram (order 9, all 5
  questions — the whole lesson's family scenario), a blood-group bar graph (order 10
  Q1-2), and an antibiotic-resistance-over-generations graph (order 15 Q4). Each
  diagram's data was cross-checked against its question's own text before wiring — two
  mismatches caught this way: the DNA-fingerprinting gel's suspect labels (1/2/3 vs. the
  question's A/B/C) and which suspect showed the exact match. Uploaded via
  `tools/upload-question-supplementary.js` (`question_supplementary/life_science/2025/
  nov_p2/q{order}/{type}_{index}.png`), all URLs spot-checked resolving (200), all
  wired via literal URL strings per that tool's own documented gotcha (never a shared
  `const` reference — `validate-questions.js` evals the `questions` array in isolation).
  Not every diagram-flagged question got a real image — the ones left as text-described
  scenarios (protein synthesis, human evolution anatomy, hominid brain volume table,
  speciation/world map, DNA replication) were judged answerable without one; this is a
  narrower, more deliberate scope than "every diagram-shaped question," not an
  oversight — revisit if a future review disagrees.
- All 15 lessons re-uploaded to dev after each addition; final state verified directly
  against Postgres (`questions.supplementary_material_type/label`,
  `lesson_ai_explanation_sub_questions` row counts) rather than trusted from script
  output alone.

**Full `review-paper.md` run (Phases 1-5) — CLOSED CLEAN, 2026-09-12.** All 15 lessons /
79 questions captured and reviewed. Report: `AMPM/temp/review/life_science_nov_p2_2025/
report.md`. Found and resolved a real `fitb` layout defect this paper's longer labels
exposed (2 of 8 `fitb` questions were completely unanswerable past a label-length
threshold, the other 6 had a character-wrapping display bug) — root-caused in
`FillInTheBlank.kt` (fixed single-line `Row`, no wrap support), mitigated by moving
descriptive text into `question` (wraps fine at any length) and reducing `metadata` to a
minimal `"= [ ]"` completion across all 8 `fitb` questions, then re-verified via a second
Phase 5 pass after a full cache clear — all 8 now PASS end-to-end (render, type, submit,
validate correct). One open app-bug remains, independent of content: a floating
"view diagram" button overlaps the last answer option's wrapped text on some
`match`/`multiple_choice`/`multi_select` questions with `supplementary_material` — needs
an app-side fix, not a content change. Also fixed two pieces of shared review tooling
while running this: `review-build-manifest.js`'s output path now scopes by subject
(it previously collided with and partially overwrote a concurrent Chemistry review
sharing the same paper/year — caught, Chemistry's actual `report.md`/`answer-
results.json` were untouched), and `review-capture-answers.js` now supports Phase 5 for
`None`-routed subjects (life_science, geography) via a system-keyboard fallback — it
previously only knew how to type through a custom in-app keyboard, which doesn't exist
for this subject.

**Pushed to prod, unpublished — 2026-09-12** (`tools/push-paper-to-prod.js --subject
life_science --year 2025 --paper nov_p2`, no `--publish`): 15 lessons / 79 questions,
150/150 marks, plus 84 new curriculum_nodes, 79 skills, 21 tags, 84
`lesson_ai_explanation_sub_questions`, and all 46 referenced images (exam pages +
generated diagrams), mirrored from dev. Verified directly against prod Postgres (not
just the script's own output): all lesson/question rows `is_published = false`;
spot-checked image URLs on the prod bucket resolve (200).

**Subject activated in prod by the user, 2026-09-12**: `is_active` set to `true`,
`min_app_version` set to `'1.8.9'` (superseding the `'3.0.0'` this profile earlier
assumed was still current — confirms this doc's own warning to re-check the value
fresh, not trust a prior snapshot). This made the subject selectable in the app before
its content was published, surfacing as "Life Science shows up but has no content" —
expected given the paper was still unpublished at that point, not a bug.

**Published — 2026-09-12** (`--publish`, same command, no dev read): all 15 lessons and
79 questions now `is_published = true` in prod, verified directly against Postgres
(`bool_and(is_published)` over both tables). Fully live for real users now that the
subject is both active and its content published — no further gate blocking visibility.

**Still open**: `june_p2` once sourced, same as every other subject. The diagram-FAB
overlap app bug (above) is unresolved and independent of any subject's content.
