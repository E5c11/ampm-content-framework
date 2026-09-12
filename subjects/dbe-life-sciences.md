---
id: AMPM-CONTENT-SUBJ-DBE-LIFE-SCIENCES
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY, AMPM-CONTENT-SUBJ-DBE-CHEMISTRY]
tags: [subject, life-sciences, dbe, profile]
---

# Subject Profile — DBE Life Sciences (Paper 2)

Drafted 2026-09-12 from a paper review (`Life Sciences P2 Nov 2025`) plus the relevant
CAPS sections, before any Life Sciences content has been authored — same illustrative
status `dbe-chemistry.md` had at its own first draft. **Paper 2 only.** Life Sciences is
a genuinely new subject (unlike Chemistry, which reused Physics's `subject_id`) — Paper 1
covers different CAPS strands entirely (Reproduction, Responding to the Environment,
Homeostasis — see Curriculum units below) and will need its own paper review before this
profile can say anything about it. Add a Paper 1 section when that paper is sourced and
reviewed; don't assume its shape from Paper 2 the way Physics/Chemistry's papers could
lean on each other.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"life_sciences"` — a real new subject, not a shared row. Matches the app's own `SubjectMapper.kt` fallback (`displayName.lowercase().replace(" ", "_")` — `"Life Sciences"` → `"life_sciences"`), the same mechanism Geography already relies on with no explicit constant of its own. **No `SubjectMapper.kt` change needed.** |
| Postgres tables | `lessons`, `questions` — `subject_id = "life_sciences"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'life_sciences'` — empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` (`PIPE-08`) |
| Papers | `nov_p2` (2025) reviewed for this draft, not yet authored. `june_p2` presumed once a June-diet paper is sourced. |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ LIFE SCIENCES _ GR 10-12 Web_2636.pdf` — Grade 12 content at Section 3.3 (physical pp. 59–70 of the PDF, printed page labels 54–65); Paper 2's own topic/weighting table at Section 4.5.3 (physical p. 78, printed page label 73). Both consulted for this draft. |
| **Source files** | `files/Life Sciences P2 Nov 2025 Eng.pdf` (question paper, 17pp, 150 marks), `files/Life Sciences P2 Nov 2025 MG Eng.pdf` (memo) — already in `files/`, matching the other subjects' convention. |
| `subjects` reference row | **Status not verified — check dev Postgres directly before assuming it doesn't exist** (the exact mistake `dbe-physics.md` flagged and corrected once already: don't assume an owner-gated insert is needed without checking). If it does need creating, a plausible row following Geography's (`color: "#82B420"`, `icon: "map"`) and Physics's (`color: "#12B886"`, `icon: "atom"`) precedent: `id: "life_sciences"`, `name: "Life Sciences"`, `code: "LIFE_SCIENCES"`, `category: "life_sciences_lessons"`, a distinct color/icon (e.g. a leaf/DNA-strand icon, a green distinct from Geography's) — proposal only, the actual insert is owner-gated, same as Geography's and Physics's rows were. |

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

## Keyboard — corrected finding, not the blocker it first looked like

`life_sciences` isn't in `KeyboardResolver.resolve`'s routing table (`AMPM/feature/watch/
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
  resolved type is `None`. Avoid both presentations entirely until `life_sciences` is
  added to the routing table (an app change, post-prelims per this session's call).

**`DESIGN-LIFE-01`** — `enforced_by: human-review`. Given the above:
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

## Allowed presentation types

Given `DESIGN-LIFE-01`: `multiple_choice`, `multi_select`, `match`, `ordering` carry most
of the typed-content risk (genotype/term recall). `fitb` stays available for the genuinely
numeric share of this paper (roughly a third of it, per the paper-structure table above —
percentages, counts, ratios). `steps`/`equation`/`fraction` excluded for now (keyboard
gap). Illustrative until evidenced against authored content, same caveat every other
subject profile carries at this stage.

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

## Curriculum units (Grade 12, CAPS Section 3.3 — Strands 1 and 4 only, Paper 2's scope)

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

(Illustrative only — the real, current curriculum-node set comes from the first
authoring session's vocabulary dump, `PIPE-08`, same as every other subject.)

## App-side status — genuinely new work needed, unlike Chemistry

Unlike Chemistry (which inherited everything from Physics's `subject_id`), Life Sciences
needs its own app-side check before it can be more than partially typed content:

- **`SubjectMapper.kt`**: no change needed — the fallback branch already resolves
  `"Life Sciences"` → `"life_sciences"` correctly (verified by reading the source, not
  assumed).
- **`KeyboardResolver.kt`**: no route for `life_sciences` — resolves to `None`. Per
  `DESIGN-LIFE-01` above, this blocks `steps`/`equation` and free-text `fitb` (but not
  bare-numeric `fitb`) until fixed. Deferred post-prelims per this session's call, same as
  the broader "no app changes before prelims" decision.
- **`min_app_version` gate**: not yet relevant — no content authored yet to gate. Revisit
  once the first lesson is ready to push, following Physics/Chemistry's established
  push-unpublished-then-publish pattern.
- **Note for whoever eventually fixes the keyboard gap**: Geography (`None`-routed, same
  as Life Sciences) already ships `fitb` content today — this session's code read found
  no evidence its answerability was ever confirmed on-device (no Phase 5 record in
  `dbe-geography.md`). Worth checking Geography too when this gets fixed, not just
  Life Sciences — flagged here since it surfaced during this session, not filed
  separately.

## Completed papers ledger

Nothing authored yet. `nov_p2` (2025) is reviewed for this draft only.
