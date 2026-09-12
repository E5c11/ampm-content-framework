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
| `syllabus` / `subject` | `"dbe"` / `"life_science"` (**singular** — confirmed against the live `subjects` row 2026-09-12; an earlier draft of this profile used `"life_sciences"` throughout, wrongly, before checking — fixed everywhere, including the upload scripts). Matches the app's own `SubjectMapper.kt` fallback (`displayName.lowercase().replace(" ", "_")` — `"Life Science"` → `"life_science"`), the same mechanism Geography already relies on with no explicit constant of its own. **No `SubjectMapper.kt` change needed.** |
| Postgres tables | `lessons`, `questions` — `subject_id = "life_science"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'life_science'` — empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` (`PIPE-08`) |
| Papers | `nov_p2` (2025) reviewed for this draft, not yet authored. `june_p2` presumed once a June-diet paper is sourced. |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET _ LIFE SCIENCES _ GR 10-12 Web_2636.pdf` — Grade 12 content at Section 3.3 (physical pp. 59–70 of the PDF, printed page labels 54–65); Paper 2's own topic/weighting table at Section 4.5.3 (physical p. 78, printed page label 73). Both consulted for this draft. |
| **Source files** | `files/Life Sciences P2 Nov 2025 Eng.pdf` (question paper, 17pp, 150 marks), `files/Life Sciences P2 Nov 2025 MG Eng.pdf` (memo) — already in `files/`, matching the other subjects' convention. |
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

## Keyboard — corrected finding, not the blocker it first looked like

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
  `"Life Science"` → `"life_science"` correctly (verified by reading the source, not
  assumed).
- **`KeyboardResolver.kt`**: no route for `life_science` — resolves to `None`. Per
  `DESIGN-LIFE-01` above, this blocks `steps`/`equation` and free-text `fitb` (but not
  bare-numeric `fitb`) until fixed. Deferred post-prelims per this session's call, same as
  the broader "no app changes before prelims" decision.
- **`subjects` row `is_active`/`min_app_version`**: the row itself was already pre-staged
  (`is_published: true`) but `is_active` was `false` — the actual reason it wasn't
  showing as an onboarding option, not a missing row. Fixed 2026-09-12: `is_active` set
  to `true`, `min_app_version` set from unset to `"1.0.0"` (user's own call — current app
  builds gate on `min_app_version`, older builds still read `is_active`, both needed
  setting). Unlike Physics/Chemistry's version gates, this doesn't currently hide
  anything from any app build — there's no lesson content yet regardless.
- **Note for whoever eventually fixes the keyboard gap**: Geography (`None`-routed, same
  as Life Science) already ships `fitb` content today — this session's code read found
  no evidence its answerability was ever confirmed on-device (no Phase 5 record in
  `dbe-geography.md`). Worth checking Geography too when this gets fixed, not just
  Life Science — flagged here since it surfaced during this session, not filed
  separately.

## Completed papers ledger

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

**Still open**: `june_p2` once sourced, same as every other subject. The full
`review-paper.md` run (Phases 1-6, screenshot-based render/logic/crop review against
the actual app) is the user's own next step, not run as part of this session — nothing
above substitutes for that review, it only ensures there's a complete package to review
in the first place.
