---
id: AMPM-CONTENT-SUBJ-DBE-PHYSICS
type: profile
layer: subjects
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE]
tags: [subject, physics, physical-sciences, dbe, profile]
---

# Subject Profile — DBE Physical Sciences: Physics (Paper 1)

Not yet authored against a real session — drafted from a paper review of `temp/Physical
Sciences P1 Nov 2025 Eng.pdf` + `temp/CAPS FET PHYSICAL SCIENCE WEB.pdf`, 2026-09-09.
Treat every paper-structure claim below as illustrative until the first authoring session
confirms it — the same caveat `dbe-geography.md` carried for its first paper.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"physics"` — **Physics is Paper 1 only.** DBE Physical Sciences' Paper 2 is Chemistry (Matter & Materials / Chemical Systems / Chemical Change knowledge areas) — a separate future subject profile (`dbe-chemistry.md`), not covered here. |
| Postgres tables | `lessons`, `questions` — `subject_id = "physics"` |
| Curriculum sources | `curriculum_nodes` / `skills` where `subject_id = 'physics'` — empty until the first authoring session populates them. Reuse before `tools/create-curriculum-node.js` / `create-skill.js` (`PIPE-08`) |
| Vocabulary dump | `node tools/dump-curriculum-vocabulary.js --subject physics --out temp/curriculum-vocab.json` (Auth Proxy running) |
| Not authored | display names/colours — resolved from the reference tables by JOIN |
| Papers | `nov_p1` (physics). `june_p1` presumed to exist once a June-diet paper is sourced. No `p2` — see subject/syllabus note above. |
| **Curriculum document (`DESIGN-UNI-09`)** | Not strictly required every session — physics is procedural like Maths (see Subject rules below) — but `files/CAPS FET PHYSICAL SCIENCE WEB.pdf` is the source for the curriculum-unit breakdown below and should be consulted for topic scope/grade placement, especially for the recall-item relational framing. |
| **Source files** | `files/Physical Sciences P1 Nov 2025 Eng.pdf` (question paper), `files/Physical Sciences P1 Nov 2025 MG Afr & Eng.pdf` (memo — sourced 2026-09-09), `files/CAPS FET PHYSICAL SCIENCE WEB.pdf` (curriculum). `temp/Physical Sciences P2 Nov 2025 MG Afr & Eng.pdf` is Paper 2/Chemistry — confirmed by its own title page, out of scope for this profile, left in `temp/` rather than moved to `files/`. |
| **New `subjects` reference row needed** | `id: "physics"`, `name` TBD (`"Physics"` vs. `"Physical Sciences P1"` — decide against actual app usage, cf. English HL's paper-named split), `color: "#6561A4"` (`Indigo400` in `AMPM/core/designsystem/.../theme/Colour.kt` — unclaimed by any current subject, same sourcing approach Geography used for `GreenLime`), icon TBD. Owner-gated insert, same as Geography's row. |

## Allowed presentation types

Proposed, pending confirmation in the first authoring session — physics is procedural
like Maths, so all eight are plausible (unlike Geography's evidenced 5-type
restriction): `fitb`, `multiple_choice`, `steps`, `match`, `ordering`, `multi_select`,
`fraction`, `equation`. The sampled 2025 Nov P1 paper leans heavily on
`multiple_choice` (including "which combination of statements is correct" items —
encode as a normal MC with combo options, not `multi_select`) and `fitb`/`steps` for
calculations; `equation`/`fraction` look rare (no ratio or symbolic-expression answers
observed in this paper) but aren't excluded.

Question `type` vocabulary (extends Maths's, minus `fraction`/`proof`, plus
`interpretation` borrowed from Geography for diagram/graph reading): `definition`,
`calc`, `application`, `interpretation`. `interpretation` = reading a circuit/graph/
field diagram and stating what it shows or predicting a qualitative change (e.g. "how
will the brightness of bulb Y be affected?") — distinct from `calc` (numeric work) and
`application` (apply a law/relationship to a new scenario).

## Subject rules (beyond core)

- **Mostly procedural, like Maths — but recall items need Geography's
  relational-framing treatment.** Most of this paper is calculation (`DESIGN-UNI-01`
  freshness is satisfied by varying the numbers; no `DESIGN-UNI-09` curriculum-document
  requirement per session). But pure recall sub-questions — "define impulse," "state
  Newton's second law," "describe an electric field" — have the same
  small-fixed-answer-space problem `DESIGN-UNI-08` identifies for Geography: a reworded
  restatement of the definition is trivially answered by a student who memorised our
  version too. Apply `DESIGN-UNI-08`'s relational framing to *these specific
  sub-questions only* (e.g. test the relationship between impulse and momentum change,
  or between the four Doppler-effect source/observer-motion cases, rather than isolated
  "define X") — consult the CAPS document for the definition's surrounding
  relationships when writing these.
- **Numeric answers carry units — never bare numbers** (`DESIGN-PHYS-01`,
  `enforced_by: human-review`). Every `calc`-type numeric answer must be dimensionally
  complete. Round per the source paper's own instruction (this paper: "round off FINAL
  numerical answers to a minimum of TWO decimal places") — same spirit as
  `DESIGN-MATH-01` but physics adds the unit and scientific-notation cases:
  - Integer/decimal formatting rules from `DESIGN-MATH-01` apply unchanged (no
    thousand separators, `.` not `,`, minimum necessary decimal places beyond the
    paper's stated minimum).
  - Scientific notation: `"3.00 x 10^8"` style consistent with the data sheet's own
    notation — confirm the exact renderer-safe serialization before the first upload
    (open item, see MathText note below).
- **`fitb` unit placement — the unit is a static label, never part of the matched
  answer** (`DESIGN-PHYS-02`, mirrors `SCHEMA-TYPE-04`'s `HH:MM` split and Geography's
  ratio-token split). Put the numeric blank and the unit as separate `metadata` tokens
  so matching never depends on unit spelling/symbol variants:
  ```js
  metadata: ["a = ", "[ ]", " m·s⁻²"],
  answer: ["9.80", "", "", "", ""],
  ```
- **Graph questions: decompose, same principle as `DESIGN-MATH-02`**
  (`DESIGN-PHYS-03`). Never ask for free-hand sketching. This paper's graphs
  (velocity-time, momentum vs. contact-time, frequency vs. velocity,
  generator voltage-time, photoelectric E_k(max) vs. 1/λ) break into: read/calculate a
  specific value (gradient, intercept, asymptote) → `fitb`; identify the correct
  shape/graph among options → `multiple_choice`; predict how a changed variable shifts
  the graph → `application`/`interpretation` `multiple_choice`, never "sketch the new
  graph."
- **Diagrams needed beyond Maths's geometry/Cartesian-graph set** (`DESIGN-PHYS-04`).
  This paper's diagrams span several categories the pipeline hasn't built templates for
  yet — expect the first few sessions to spend real time here before it's routine:
  free-body diagrams (force vectors on a block/crate), circuit diagrams (cells,
  resistors, switches, ammeters/voltmeters, sometimes multi-loop), electric field
  patterns around point charges, energy-level diagrams, and the AC-generator/motor
  sketch. Same decision test as Maths (could the student attempt the question without
  the figure?) and the same recreation approach as Geography's schematic figures
  (SVG→PNG or matplotlib, new invented values, never the real exam's numbers) — this is
  the main area where physics needs more new pieces than Maths did.
- **Circuit-analysis and force-diagram questions decompose like Euclidean geometry
  proofs** (`DESIGN-PHYS-05`, same shape as `DESIGN-MATH-04`): don't ask for a full
  written circuit analysis or free-body diagram from scratch in one question. Break
  into "what is the reading on ammeter X?" (`fitb`), "identify all forces acting"
  (`match` or `multi_select`), "which statement about how Y is affected is correct?"
  (`multiple_choice`).
- **`steps` is a first-class choice for numeric multi-step calculations, not just
  symbolic proof completion.** `QuestionsValidator.kt`'s `STEPS` branch used to be
  exact-string-only (no numeric tolerance), which made it a trap for physics's
  "calculate the reading on A1" style numeric substitution work — fixed this session
  (see App-side fixes below) so numeric `steps` blanks now get the same `"9.8"` ==
  `"9.80"` / comma-decimal tolerance `fitb` has, while symbolic blanks stay
  exact-match. Prefer `steps` over one big `fitb` when the working itself (not just
  the final number) is the thing being tested — e.g. Q8's "calculate the emf" chain of
  substitutions.

## App-side keyboard/calculator routing — resolved 2026-09-09

Physics was an unrecognized subject string in three places in `AMPM` (`~/StudioProjects/
AMPM`), each falling through to a wrong/missing default — fixed this session, before any
physics content existed to expose the bug in production:

- `SubjectMapper.kt` — added `PHYSICS_FIRESTORE = "physics"` (matches this profile's
  `subject_id`).
- `KeyboardResolver.kt` (`feature/watch/.../questions/ui/`) — `resolve()` and
  `resolveSubjectDefault()` were falling to `QuestionKeyboardType.None` (no custom
  keyboard at all) for physics; now routed the same as Maths (`ScientificMath` for
  `equation`/`steps`, `StandardMath` for everything else). The file's own doc comment
  already anticipated this: *"Add new subjects (e.g. Physics) by extending this resolver
  only."*
- `SubjectKeyboardType.kt` — `toSubjectKeyboardType()` was falling to `Default`, which
  left `calculatorType` `null` (`QuestionsViewModel.kt`) and **suppressed the on-screen
  calculator entirely** — a real problem given the paper explicitly permits "a
  non-programmable calculator." Now maps `"physics"`/`"physical sciences"` to
  `SubjectKeyboardType.Maths`, reusing the full `MathsCalculatorBottomSheet`.
- Fixed two existing unit tests that had locked in the old (wrong) behaviour
  (`SubjectKeyboardTypeTest.kt`, `KeyboardResolverTest.kt`), and added physics-specific
  cases to both plus `QuestionsValidatorTest.kt`. `:feature:watch:testDebugUnitTest`
  passes. Not yet committed in `AMPM` — do that alongside/after this profile.

## MathText scope — still open

`core/mathtext.md` currently scopes itself to `maths` and `math_lit` only. Physics needs
subscripted variable names (v_i, v_f, E_k(max), F_net) and the data sheet's own notation
conventions (`·` as the SI unit separator, `×`/`x` for scientific notation) at minimum —
extend `MATHTEXT` scope to include `physics` before the first authoring session. The
keyboard-routing fix above means physics now gets the same *input* keyboard as Maths;
whether `\frac`/`\sqrt` *display* correctly and whether subscripts need new markup is a
separate, still-open rendering question — confirm against the actual renderer.

## Formula sheet (every paper)

Same pattern as Maths: a data sheet is attached to every DBE Physical Sciences paper —
here it's **3 pages** (physical constants; motion/force/work-energy-power/waves
formulae; electrostatics/circuits/AC formulae), not Maths's single page. Extract once
per paper, upload once, reuse the same Storage URL(s) in every video's
`supplementary_materials` as `{ type: "formula_sheet", label: "Formula Sheet",
image_urls: [...] }` (3 URLs).

## Per-question supplementary material

Same decision test as Maths: could a student attempt the question without the figure?
No → include. Yes but it helps → include. Adds nothing → omit. Unlike Maths, this
paper's diagrams are almost always load-bearing scenario setup (the object/circuit/
charge configuration the question is *about*), not optional aids — expect most physics
questions to need one. `supplementary_material: { type: "diagram"|"circuit"|"graph"|
"table", label, image_urls }`. Storage path:
`question_supplementary/{subject}/{year}/{paper}/q{order}/{type}_{index}.png`.

## Curriculum units (reference until a curriculum collection exists)

From CAPS's Grade 10-12 "Overview of topics" table (Section 2.4) — NSC papers draw
cumulatively across all three grades, not just Grade 12, so a unit's CAPS grade
placement doesn't cap which grade's paper can examine it:

**Mechanics:** `vectors_and_scalars` (G10), `motion_1d` (G10), `vectors_2d` (G11),
`newtons_laws` (G11), `momentum_impulse` (G12), `vertical_projectile_motion` (G12),
`work_energy_power` (G12).
**Waves, Sound & Light:** `doppler_effect` (G12) — the only Grade 12 waves topic
examinable on P1 physics; earlier grades' transverse pulses/waves/sound/EM-radiation
content (G10) and geometrical optics (G11) also remain in scope cumulatively.
**Electricity & Magnetism:** `electrostatics` (G10/G11 — Coulomb's law, electric
field), `electric_circuits` (G10 series-parallel → G12 internal resistance),
`electrodynamics` (G12 — generators, motors, AC).
**Matter & Materials:** `optical_phenomena` (G12 — photoelectric effect only; the rest
of this knowledge area is Paper 2/Chemistry, out of scope).

(Illustrative only — the real, current set comes from the Phase 3.5 vocabulary dump
once a first session populates it, `PIPE-08`.)

## Completed papers ledger

None yet — first paper to author: DBE 2025 Nov P1.
