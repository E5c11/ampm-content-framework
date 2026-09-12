---
id: AMPM-CONTENT-SUBJ-DBE-CHEMISTRY
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-PHYSICS]
tags: [subject, chemistry, physical-sciences, dbe, profile]
---

# Subject Profile — DBE Physical Sciences: Chemistry (Paper 2)

Drafted 2026-09-11 from a paper review (before any chemistry content existed) — the
`subjects/dbe-physics.md`-analogous profile that document's Identity section (line 24)
already called for: *"a `dbe-chemistry.md` paper-structure profile analogous to this
one."* Not yet evidenced against a fully authored paper (`dbe-physics.md`'s Completed
papers ledger is the model for what that evidencing pass looks like once this profile's
first paper ships). Sections below are illustrative until then; treat this the way
`dbe-physics.md` treated its own first draft — an open item flagged here is not
self-enforcing and must actually block authoring, not just be noted (see that doc's
MathText-scope section for what happens when one isn't acted on).

**Timeline note:** authored under prelims pressure (prelims start 2026-09-14) — see this
session's driving constraint. Anything not load-bearing for shipping correct, answerable
Chemistry content before then is deferred, not skipped silently.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"physics"` — **same `subject_id` as Physics**, per `dbe-physics.md`'s Identity table (line 24/32): Physical Sciences is one subject, one DB row; Physics (P1) and Chemistry (P2) are two papers under it. No new `subjects` row, no new subject-level app registration — this profile reuses everything `dbe-physics.md` already resolved at the app-integration layer (see App-side inheritance below). |
| Postgres tables | `lessons`, `questions` — `subject_id = "physics"`, same rows Physics writes into; distinguished by `paper` (`nov_p2` etc.), not by a separate subject. |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'physics'` — shared pool with Physics; Chemistry's nodes are additive, not a separate namespace. |
| Papers | `nov_p2` (Chemistry) being authored now. `june_p2` presumed to exist once a June-diet paper is sourced, same as Physics's `june_p1`. |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/CAPS FET PHYSICAL SCIENCE WEB.pdf` — same document as Physics (it's a single CAPS doc for the whole subject); Chemistry-relevant sections are 2.6 (Weighting of Topics) and Section 3's Grade 10–12 Chemistry topic tables (Organic Molecules/Matter & Materials, Chemical Change, Chemical Systems). |
| **Source files** | `files/Physical Sciences P2 Nov 2025 Eng.pdf` (question paper, 20pp incl. 4pp data sheets), `files/Physical Sciences P2 Nov 2025 MG Afr & Eng.pdf` (memo) — moved from `temp/` 2026-09-11, matching Physics's convention. |
| `subjects` reference row | **Already exists**, shared with Physics — `id: "physics"`, `name: "Physical Science"` (see `dbe-physics.md` line 32 for the full row and its 2026-07-09 provenance). Nothing to create here. |

## Paper structure / knowledge-area mapping (Nov 2025 P2, from paper review)

**150 marks across 9 questions**, CAPS knowledge areas map cleanly onto question ranges —
no `Q1`-style ambiguity to resolve the way Physics needed three attempts for, since this
paper's questions already group by knowledge area at the question level, not just within
Q1:

| Q | Marks | Knowledge area | CAPS topic |
|---|---|---|---|
| 1 (MCQ, 1.1–1.10) | 20 | Mixed — cluster by item, same principle as `dbe-physics.md`'s Q1 | 1.1–1.3 Organic Molecules; 1.4 Rate & Extent of Reaction; 1.5–1.6 Chemical Equilibrium; 1.7–1.8 Acids & Bases; 1.9–1.10 Electrochemistry — **5 clusters, 5 lessons**, not CAPS's 4 knowledge areas (Chemistry's Grade 12 curriculum has more topic granularity than Physics's) |
| 2 | 22 | Organic Molecules | naming, isomers, structural formulas, functional groups |
| 3 | 12 | Organic Molecules | homologous series, vapour pressure/boiling point, intermolecular forces |
| 4 | 17 | Organic Molecules (reactions) | reaction types, cracking, addition reactions |
| 5 | 20 | Rate & Extent of Reaction | rate definition, graph reading, average rate calc |
| 6 | 17 | Chemical Equilibrium | Le Chatelier, Kc calculations |
| 7 | 20 | Acids & Bases | Ka, conjugate acid/base, ampholytes, pH, titration |
| 8 | 11 | Electrochemistry | galvanic cells, cell notation, standard conditions |
| 9 | 11 | Electrochemistry | electrolytic cells, electrolytic refining |

Marks sum to 150, matching the paper total — same cross-check `dbe-physics.md`'s ledger
used to confirm nothing was missed.

**Chemical Systems (fertilizer/chemical-industry, 3.5% CAPS weight) isn't examined in
this particular paper** — none of Q1–Q9 touch it. Don't assume it's out of scope for
Chemistry generally; it just didn't come up in this specific Nov 2025 sitting (CAPS
Section 3, "Chemical Industry" term-3 content, is the source if/when a future paper needs
it).

Applying `DESIGN-UNI-10` (bundle sub-parts sharing one continuous scenario into one
lesson; otherwise cluster independent items by the exam's own thematic ordering):
**Q2–Q9 each become one lesson** (each is one continuous scenario/compound-set), **Q1
becomes 5 lessons** (one per knowledge-area cluster above), for **13 lessons total** —
same shape as Physics's P1 (13 lessons from Q1's 4-way split + Q2–Q10).

## Keyboard constraint — the reason this profile needed its own discussion first

**No app change required to author Chemistry** — `KeyboardResolver.resolve()`
(`AMPM/.../KeyboardResolver.kt`) keys purely on the literal subject string
`SubjectMapper.PHYSICS_FIRESTORE = "physics"`, which Chemistry shares with Physics.
Physics's 2026-09-09 fix (routing `"physics"` to `ScientificMath`/`StandardMath` instead
of falling through to `None`, and enabling the Maths calculator) already covers every
Chemistry question — there is no separate Chemistry entry to add.

**But that's exactly the problem, not a convenience**: Chemistry gets the *same*
character set as Physics (`core/keyboard-input.md`'s `ScientificMath`/`StandardMath`
inventories — digits, `x`/`y`/`θ`, `sin cos tan π √ log`, no other letters, no
subscripts, no `Ω Δ μ`), and a large share of this paper's actual answers need things
that set has no slot for:

- **Structural formulas** (Q2.2.4, Q2.3.1, Q3.3.1, Q4.1.5, Q4.2.3) — not typeable at all,
  any keyboard; DBE's own paper expects hand-drawing, which has no app equivalent.
- **IUPAC names** (Q2.2.1–2.2.3, Q3.3.2, Q4.1.1) — need letters beyond `x`/`y`.
- **Chemical equations with subscripts/state symbols/charges** (Q1.4, Q1.7–1.10, Q7.1.5,
  Q8.3) — `H₂O`, `(aq)`, `Fe³⁺`, `→` all need characters absent from both keyboards.
- **Formulae/names as short answers** (Q4.1.2, Q4.1.4, Q7.1.2, Q9's ion/electrode
  identifications) — same letter-set problem as IUPAC names.

Against that, a real share of the paper *is* bare-numeric and fits the existing
keyboards fine: Q2.3.2 (volume calc), Q5.2.2 (rate calc), Q6.2.3 (mass at equilibrium),
Q7.2.1/7.2.2 (concentration/moles), Q8.4 (mass), Q9.2.3 (mass change) — each resolves to
a plain number, several already carrying units the way `DESIGN-PHYS-01` requires.

**`DESIGN-CHEM-01`** — `enforced_by: human-review`, extends `core/keyboard-input.md`'s
`KEYBOARD-01`/`KEYBOARD-02` with a Chemistry-specific reading: **no typed answer
(`fitb`/`equation`/`steps` blank) may require a structural formula, IUPAC name, chemical
equation, or any answer containing a letter beyond `x`/`y`/`θ` or a subscript/charge**.
Use `multiple_choice`/`multi_select`/`match`/`ordering` for all of those instead (present
structural formulas as images — given, never typed; match names to structures; select the
correct equation/ion from options). Reserve typed blanks for the bare-numeric calc
questions above, same discipline `KEYBOARD-02` already established for Physics. This is a
content-authoring rule, not an app limitation to work around — see
[[keyboard-type-as-data-idea]] (deferred, not this session) for the longer-term
alternative of a question-level keyboard field, which wouldn't remove this constraint
anyway since no chemistry-notation keyboard component exists yet either.

## Allowed presentation types (illustrative, not yet evidenced against authored content)

Expect a heavier `multiple_choice`/`match`/`multi_select` mix than Physics's P1, driven
directly by `DESIGN-CHEM-01`: naming/structure/equation questions that Physics would
rarely need this treatment for are Chemistry's majority content (Q2–Q4, most of Q1).
`steps` remains the right fit for the paper's genuine multi-step numeric work (Q6.2.3,
Q7.2.1–2.2, Q9.2.3), same as Physics's momentum/circuit calculations. `fraction`/
`equation` presentations: same "not excluded, just unconfirmed" status as Physics — the
paper's equation-heavy questions (Q1.9–1.10, Q7.1.5, Q8.3) are exactly where they'd be
useful for e.g. a bare-numeric follow-on, but the underlying chemical notation is out of
scope for any typed input regardless of presentation type (`DESIGN-CHEM-01`).

## Subject rules (beyond core)

- **Inverse of Physics's procedural default — Chemistry is a content-based subject
  for a real chunk of itself** (`DESIGN-UNI-08` names Chemistry explicitly alongside
  Geography/Life Sciences/History). Organic Molecules content (functional groups,
  isomer types, IUPAC naming, homologous-series classification — Q1.1–1.3, Q2, Q3) is
  fixed-fact/classificatory: rewording "identify the functional group of X" with a
  different compound doesn't satisfy `DESIGN-UNI-01` freshness, since a student who
  memorized the real answer trivially gets the reworded one too. These need
  `DESIGN-UNI-08`'s relational framing (test a transformation/hierarchy/progression, or
  synthesis of ≥2 facts) grounded in CAPS's own framing — `DESIGN-UNI-09`'s curriculum-
  document consultation is **required** here, not optional the way it is for Physics.
  The rest of Chemistry (Rate & Extent of Reaction, Chemical Equilibrium, Acids & Bases,
  Electrochemistry calculations — Q5–Q9) is genuinely procedural like Physics/Maths:
  varying the numbers is real freshness there. Decide per-question which regime applies
  before drafting practice questions, not once per paper.
- **Numeric answers carry units** (extends `DESIGN-PHYS-01` unchanged) — `mol`,
  `mol·dm⁻³`, `g`, `kJ·mol⁻¹`, `kPa` in place of Physics's mechanics/circuit units. Round
  per this paper's own instruction ("round off FINAL numerical answers to a minimum of
  TWO decimal places" — identical wording to P1).
- **`fitb` unit placement** — same split-token pattern as `DESIGN-PHYS-02`, unit as a
  separate `metadata` token, never inside the matched `answer`.
- **Graph questions decompose** — same as `DESIGN-PHYS-03`. This paper's graphs
  (concentration-vs-time for rate, Maxwell-Boltzmann distribution) break into: read a
  specific value → `fitb`; identify/predict the correct curve shift → `multiple_choice`;
  never "redraw the graph" (Q5.3.5 in the source paper literally asks this — decompose it
  rather than reproducing the free-hand instruction).
- **Diagrams needed**: reaction-mixture syringe/container diagrams, galvanic/electrolytic
  cell set-ups (electrodes, voltmeter, electrolyte labels), Maxwell-Boltzmann curves,
  concentration-vs-time graphs. Same decision test as Physics (`DESIGN-PHYS-04`): could
  the student attempt the question without the figure?
- **Structural formulas are images, never typed** (`DESIGN-CHEM-01` above) — when a
  question's *given* material includes a structural formula (e.g. Q2's compound table),
  render it as an image the same way Physics/Geography render diagrams, not as inline
  text/MathText.

## Formula sheet (every paper)

**4 pages** for Chemistry P2 (vs. Physics's 3): physical constants + formulae (Table 1–2),
the periodic table (Table 3), and standard reduction potentials in two orderings
(Table 4A by increasing oxidising-agent strength, Table 4B by increasing reducing-agent
strength — same data, sorted both ways, both need uploading). Same extract-once-per-paper,
reuse-URL pattern as Physics.

## Per-question supplementary material

Same decision test as Physics/Maths: could a student attempt the question without the
figure? But Chemistry splits that test into two cases Physics didn't need to
distinguish, because `DESIGN-CHEM-01` already forces one of them:

- **Mandatory — structural formulas are given content, not an aid.** Wherever the source
  paper draws a structure (Q2's compound table A/B/G, any question that identifies/
  names/compares a compound by its structure), the image isn't optional supplementary
  material judged by "does it help" — it's the only way that compound is represented at
  all, since `DESIGN-CHEM-01` bars typing a structural formula. No image means the
  question cannot be asked. Use `type: "structure"` (new, extends Physics's
  `"diagram"|"circuit"|"graph"|"table"` set).
- **Judgment-call — everything else**, same as Physics: cell diagrams (Q8 galvanic,
  Q9 electrolytic — could a student reconstruct anode/cathode/electrode labels from text
  alone? no, include), graphs (Q1.5, Q5.2, Q5.3 — reading a specific value or curve
  shape off the figure is the question itself, include), reaction-vessel diagrams (Q2.3's
  syringe — mostly flavour, the volumes are already given in text; include only if it
  disambiguates the set-up, omit if purely decorative). Apply the same
  no-figure-attemptability test Physics/Maths use for this group; don't default to
  "include" just because the source paper has an image.

`supplementary_material: { type: "structure"|"diagram"|"circuit"|"graph"|"table", label,
image_urls }`. Storage path: same convention as Physics —
`question_supplementary/{subject}/{year}/{paper}/q{order}/{type}_{index}.png` (subject
stays `physics` per the shared `subject_id`, so `q{order}` needs to be unambiguous
against Physics's own P1 paths — the existing `{year}/{paper}/` segments already handle
this, since `paper` is `nov_p2` not `nov_p1`).

## Curriculum units (reference until a curriculum collection exists)

From CAPS Section 3's Grade 10–12 Chemistry topic tables — cumulative across grades like
Physics, so Grade 12 papers can examine any grade's chemistry content:

**Organic Molecules (Matter & Materials, Chem portion):** `organic_molecular_structures`
(functional groups, saturated/unsaturated, isomers — G12), `organic_naming` (IUPAC — G12),
`physical_properties_organic` (boiling point, intermolecular forces — G12),
`organic_reactions` (substitution, elimination, addition, cracking — G12).
**Chemical Change — Rate & Extent of Reaction:** `reaction_rate_factors` (concentration,
surface area, temperature, catalyst — G12), `collision_theory` (G12).
**Chemical Change — Chemical Equilibrium:** `equilibrium_constant_kc` (G12),
`le_chateliers_principle` (G12).
**Chemical Change — Acids & Bases:** `acid_base_reactions`, `ka_kb_ph_calculations`,
`conjugate_acid_base_pairs` (G12) — some conceptual grounding (Grade 11 acid-base
definitions) may be assumed prerequisite, not separately examinable content here.
**Chemical Change — Electrochemistry:** `galvanic_cells`, `electrolytic_cells`,
`standard_electrode_potentials` (G12).
**Chemical Systems:** `chemical_industry` (fertilizer/NPK — G12) — not examined in this
particular paper (see Paper structure note above) but in scope generally.

(Illustrative only — the real, current set comes from the Phase 3.5 vocabulary dump once
a first session populates it, `PIPE-08`, same as Physics.)

## Completed papers ledger

**`nov_p2` — complete, 2026-09-11.** All 13 lessons authored, validated, and upserted to
dev (Cloud SQL); image URLs spot-checked resolving (200) with no cross-lesson bleed.

| Lesson | Order | Real sub-Qs | Marks | Practice Qs | Presentations used |
|---|---|---|---|---|---|
| Question 1.1–1.3 (Organic Molecules) | 1 | 1.1–1.3 | 6 | 5 | multiple_choice, multi_select, match |
| Question 1.4 (Rate & Extent of Reaction) | 2 | 1.4 | 2 | 2 | multiple_choice |
| Question 1.5–1.6 (Chemical Equilibrium) | 3 | 1.5–1.6 | 4 | 3 | multiple_choice, multi_select |
| Question 1.7–1.8 (Acids & Bases) | 4 | 1.7–1.8 | 4 | 3 | multiple_choice, ordering |
| Question 1.9–1.10 (Electrochemistry) | 5 | 1.9–1.10 | 4 | 3 | multiple_choice, multi_select |
| Question 2 (Organic Molecules — naming/isomers) | 6 | 9 | 22 | 5 | multiple_choice, match, multi_select, fitb |
| Question 3 (Organic Molecules — physical properties) | 7 | 8 | 12 | 4 | multiple_choice, multi_select, ordering |
| Question 4 (Organic Molecules — reactions/cracking) | 8 | 10 | 17 | 4 | multi_select, multiple_choice, fitb |
| Question 5 (Rate & Extent of Reaction) | 9 | 10 | 20 | 5 | multi_select, fitb, multiple_choice |
| Question 6 (Chemical Equilibrium) | 10 | 6 | 17 | 4 | multi_select, multiple_choice, fitb |
| Question 7 (Acids & Bases) | 11 | 7 | 20 | 5 | multiple_choice, multi_select, fitb |
| Question 8 (Electrochemistry — galvanic) | 12 | 4 | 11 | 4 | multi_select, multiple_choice, fitb |
| Question 9 (Electrochemistry — electrolytic) | 13 | 4 | 11 | 4 | multi_select, multiple_choice, fitb |

150/150 marks covered (matches the paper total). Formula sheet (4 pages,
`q0/question_1–4.png`) uploaded once during part 1, reused unchanged across all 13
lessons — the once-per-paper, reuse-URL pattern from
`workflows/generate/upload-chemistry.md` Phase 2 holds for the whole paper, not just Q1.

**`DESIGN-CHEM-01`'s structural-formula-image requirement — resolved without generated
diagrams.** Q2–Q4 (the Organic Molecules questions) needed structures/naming/reactions
extensively, but every fresh practice question used *unambiguous condensed structural
formulas as given text* (e.g. `CH₃CH(CH₃)CH₂CH₂OH`) — the same technique the real exam
itself uses for compounds that don't need a drawn structure (C/D/E/F in Q2's own table).
No compound in this paper's fresh practice set needed branching/connectivity too complex
for condensed notation, so **no `type: "structure"` supplementary material was actually
needed** — the mandatory-image path in this profile's "Per-question supplementary
material" section remains correct policy but wasn't exercised this session. A future
paper whose fresh scenarios need genuinely ambiguous structures (e.g. two isomers only
distinguishable by a 2D diagram) will need actual generated images; note this as still
untested, not resolved.

New curriculum nodes created this session (none existed pre-Chemistry): unit
`chemical_change`, topics `reaction_rate`/`chemical_equilibrium`/`acids_bases`/
`electrochemistry`, ~30 subtopics, ~35 skills, ~15 tags — see
`tools/dump-curriculum-vocabulary.js` output for the live set. `organic_molecules`
(topic) and `matter_materials` (unit) were reused from Physics, not recreated.

**Live-testing correction:** part 1's Q1 and Q2 practice questions both originally tested
primary-alcohol-oxidation functional groups with near-identical stems — caught on dev
live-testing, Q1 rewritten to an esterification scenario instead (`45120f1`). Worth an
explicit eyeball pass across a lesson's questions for topical overlap, not just
per-question `AIEXP-03` leak checks — applied throughout the rest of this session (e.g.
Q3's ordering question needed a second AIEXP-03 fix for naming an answer item inside its
own clue, not a leak of the *answer value* itself but the same failure family).

**Local tooling gotcha hit this session, now avoided:** `temp/images/q3/`, `q4/` etc.
already existed from Physics P1's own authoring (same bare `qN` folder names, unrelated
content) — a first extraction into `temp/images/q3/` for this paper's Q3 silently picked
up 3 stale Physics P1 memo pages alongside the new crop, and `upload-exam-images.js`
uploaded all of them to Chemistry's GCS path before the mismatch was caught (fixed by
deleting the 3 stray objects). Every extraction from Q4 onward used a
`temp/images/chem_q{N}/` prefix instead. **If reusing this pattern for a future paper,
always use a subject/paper-scoped local folder name, never bare `qN`** — the GCS
destination path is controlled entirely by `--order`, but the local folder's file list is
whatever's already sitting there, stale content included.

**Full-paper review — CLOSED CLEAN, 2026-09-12** (`workflows/generate/review-paper.md`,
report at `AMPM/temp/review/nov_p2_2025/report.md`): all 13 lessons / 51 questions
captured on emulator and reviewed against their screenshots. 48 PASS, 3 AUTO_FIX (all
the same `E°(X/Y)` fraction-rendering defect — an electrode-couple value written as a
standalone slash-pair in its own parens right after `E°` rendered as a stacked math
fraction instead of plain text; fixed in dev and in the source scripts by rephrasing to
"The X/Y half-cell has E° = ... V"), 0 FLAG. Every other rendering check passed clean:
chemistry-specific Unicode (subscripts, `ℓ`, `⇌`, `Δ`, cell-notation `|`/`||`) all render
correctly, every presentation type matches its renderer contract. This is the first
live-device evidence for `dbe-chemistry.md`'s Chemistry-specific sections (keyboard
constraint, presentation mix) beyond part 1 alone — Q2 through Q9 are now confirmed
live-tested, not just part 1.

**Phase 5 (answerability) also run and clean: all 8 `fitb` questions in this paper
(the only typed-answer presentation used) were actually typed through the app's real
custom keyboard and submitted through the real app mechanism — all 8 confirmed
`CORRECT`.** Along the way, surfaced a real app bug (unrelated to this paper's content:
`LoadQuestionsWithContextUseCase.loadVideoContext()` has no fallback fetch on a Room
cache miss, so a `/video/{id}` deep link into a never-opened lesson shows the system
keyboard instead of the subject's real one) — scoped to the deep-link entry point only
(shared links / admin-triggered notifications), confirmed the everyday Home → Subject →
Library → Lesson path is unaffected, and confirmed nothing in the app currently
generates such a link for Physical Science. **Founder-accepted risk 2026-09-12** (one
week of prelims left, not this week's priority subject) — fix scheduled before the
pre-finals release, not blocking this paper. Full mechanism now documented in
`AMPM/wiki/lesson/systems/keyboard-system.md`'s "Submitting an answer" section.

The app bug above is now logged in `AMPM/workflows/bugs-tracking.md` (Scoped section),
founder-accepted risk, fix scheduled before the pre-finals release.

**Pushed to prod, unpublished — 2026-09-12** (`tools/push-paper-to-prod.js --subject
physics --year 2025 --paper nov_p2`, no `--publish`): 13 lessons / 51 questions, plus 39
new curriculum_nodes / 46 skills / 20 tags and all 48 referenced images, mirrored from
dev. Verified in prod: all lesson/question rows `is_published = false`; spot-checked
image URLs on the prod bucket resolve (200). **No live-user exposure regardless of
publish state** — prod's `physics` subjects row still carries `min_app_version =
'2.1.2'` (set 2026-09-10 for Physics P1, confirmed still live 2026-09-12), which
hard-excludes the *entire* Physical Sciences subject from `GET /v1/content/subjects`
and `GET /v1/content/subjects/{id}` for every client — chemistry inherits this
automatically via the shared `subject_id`. **Published — 2026-09-12** (`--publish`, same command, no dev read): all 13 lessons and
51 questions now `is_published = true` in prod, verified directly. Fully live in prod's
database, ready to serve — still invisible to every client, re-confirmed
`min_app_version = '2.1.2'` unchanged on the `physics` subjects row after publishing.
**To actually go live for students:** `UPDATE subjects SET min_app_version = NULL WHERE
id = 'physics'` (prod), once a release containing the app-side keyboard/MathText fixes
has shipped — same gate physics's own P1 paper is still waiting on. Nothing further to
push for this paper once that day comes.

**Still open:** June-diet paper (`june_p2`) once sourced, same as Physics's `june_p1`.

## App-side inheritance — no separate work needed

Everything `dbe-physics.md`'s "App-side keyboard/calculator routing" and "App-version
gate" sections resolved is keyed on the subject string `"physics"`, which Chemistry
shares:

- **Keyboard/calculator routing**: already fixed (2026-09-09, `AMPM` commit `d0dd7adfa`)
  — `ScientificMath`/`StandardMath` keyboards and the Maths calculator both resolve
  correctly for any `subject: "physics"` row, Chemistry's included. Nothing to add here;
  `DESIGN-CHEM-01` above is a content-authoring constraint given what that keyboard *can*
  produce, not a gap in the routing itself.
- **MathText scope**: already extended to `physics` (2026-09-10, `MATHTEXT-06`) — covers
  Chemistry's given-text rendering (subscripts, fractions) with no further app change.
- **App-version gate** (`subjects.min_app_version`): Chemistry ships under the *same*
  `subjects` row as Physics (`id: "physics"`), so it inherits whatever gate state that row
  is in at push time — see `dbe-physics.md`'s "App-version gate" section for the current
  value and history before any Chemistry prod push. **Re-check that value fresh, don't
  assume it from this doc** — it changes over time (e.g. cleared once a release
  containing the app-side fixes ships) and a stale assumption here would be exactly the
  kind of drift `dbe-physics.md` itself warns against.
