---
id: AMPM-CONTENT-CLOSED-FORM
type: guide
layer: shared
related: [AMPM-CONTENT-DESIGN, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-APP-VERSIONS]
tags: [content-based, closed-form, discursive, essay, graph, calculation, distractors, linked, keyboard]
provenance: created 2026-10-15 by extracting the subject-agnostic rules that recur across `subjects/dbe-economics.md` (`DESIGN-ECON-02`–`08`),
  `dbe-business-studies.md` (`DESIGN-BUS-02`–`05`), `dbe-life-sciences.md` (`DESIGN-LIFE-02`–`04`), `dbe-history.md` (`DESIGN-HIST-02`),
  `dbe-physics.md` / `dbe-chemistry.md` (`DESIGN-PHYS-03`) and `core/authoring-principles.md` (`DESIGN-MATH-02`/`04`), while profiling Agricultural Sciences; `CLOSED-FIG-03` added 2026-10-15 while profiling Accounting
  (its profile would otherwise have been a sixth copy). Wording is the existing rules' wording, merged — the originals stay valid as aliases.
---

# Closed-Form Subjects — Shared Authoring Rules

## Purpose and scope

The app has **no free-text grading and no drawing input**. A DBE paper, however, is marked mostly against point lists, drawn graphs, essays and
worked calculations. For any **content-based subject whose paper looks like that** — Economics, Business Studies, Life Sciences, History,
Geography, Agricultural Sciences, Tourism, and any later one of the same shape — the practice lessons convert each of those into questions the app can
present and mark. These rules are the common core; a subject profile (`subjects/{profile}.md`) states only what differs (paper structure,
curriculum units, the subject's own formulas, its own confusable pairs).

Load with `core/` and, for the relevant types, `presentations/`. Relational framing (`DESIGN-UNI-08`), the curriculum document (`DESIGN-UNI-09`),
linked vs. independent lessons (`DESIGN-UNI-13`), answer-cue rules (`DESIGN-UNI-15`/`16`) and the index-0 / True-False tallies (`DESIGN-UNI-05`/`06`)
stay in `core/` and apply on top. Procedural subjects (Maths, Math Lit, Physics, Chemistry) and Accounting keep their own profiles; the **figure** and
**calculation** rules below apply to them too.

### Applicability

Binding for papers authored from **2026-10-15**. Existing profiles still carry their own copies under their own IDs (`DESIGN-BUS-04`,
`DESIGN-ECON-03`, `DESIGN-LIFE-02` …). Those stay valid as aliases of the rule named in each heading below, and are repointed when each profile
is next edited. Where a profile's own wording is stricter, the profile wins.

---

## Discursive items → selection

### `CLOSED-DISC-01` — The memo's point list is the option set

`enforced_by: human-review` · was `DESIGN-BUS-02`, `DESIGN-ECON-02`, `DESIGN-LIFE-02`

Items marked against a non-exhaustive point list ("Any 2", "Accept any other correct relevant response") have **no canonical wording**, so there is no
string a typed answer could match and nothing a free-text box could grade. Never author them as open recall. Each ticked memo point becomes a
distinct option, and the practice question tests the *same reasoning with fresh content* (`DESIGN-UNI-01`/`02`), not the memo line.
Convert by what the mark is *for*:

| The memo is marking… | Present as |
|---|---|
| a sequence (digestion route, reflex arc, birth stages, business phases) | `ordering` of the memo's own steps (3–6 items; each wrong order a plausible misordering — `DESIGN-UNI-15`) |
| a set of correct statements | `multi_select`: memo points correct, *common misconceptions* as distractors |
| a cause-and-effect reason | `multiple_choice` whose distractors reverse direction (more/less, dilate/constrict, increase/decrease) |
| identify-from-a-scenario ("quote from the extract") | `multiple_choice`/`multi_select` over candidates from, and adjacent to, the scenario text |
| a letter ↔ meaning pairing (≤ 5 pairs) | `match` |

### `CLOSED-DISC-02` — "Name/Give/State any N" is a `multi_select` against the memo's list

`enforced_by: human-review` · was `DESIGN-BUS-04`, part of `DESIGN-ECON-02`

The memo lists more valid answers than N and accepts any. Correct options are a **subset** of the memo's list; distractors are plausible-but-wrong
items from the **same family** (for defensive strategies, an intensive or integration strategy; for "direct tax", an indirect tax; for plant
poisoning treatment, a measure that belongs to a parasite). A distractor must not be correct under another line of the memo. Do not require the
student to find every valid answer when the exam wants N ("mark the first TWO").

### `CLOSED-DISC-03` — Near-twin distractors come from the paper's own confusable pairs

`enforced_by: human-review` · was `DESIGN-BUS-05`

The confusion is often the skill (EEA vs LRA vs BCEA, MC vs MR, demand-pull vs cost-push, acute vs chronic vs pre-acute, Graafian follicle vs corpus
luteum). Write distractors from those pairs, in the same family and **the same length** (`MultipleChoice` renders uneven lengths worse; and see
`DESIGN-UNI-16`).

### `CLOSED-DISC-04` — "Give a reason for the answer to X" and "explain OTHER [X]" are linked

`enforced_by: human-review` · was `DESIGN-BUS-02` (linked bullet), `DESIGN-ECON-07`

The second sub-part depends on the first. Apply `DESIGN-UNI-13`'s test per lesson: either keep the pair in one **linked** lesson, with the second
item's correct set excluding whatever the first already named (a later item's correct option must never duplicate what an earlier item states), or
rebuild both as one self-contained `multiple_choice` + `multi_select` pair on a shared stem. A calculation and the item that interprets its sign
belong in the same lesson.

### `CLOSED-DISC-05` — Alternative-choice structure means independence

`enforced_by: human-review` · was `DESIGN-BUS-02` (last bullet)

Where the exam says "answer ANY N of M questions" they are graded as alternatives, not a cumulative set. A lesson must not assume, or refer to,
another optional question's content (`DESIGN-UNI-10`).

## Section A short-question formats

### `CLOSED-A-01` — DBE Section A item formats → presentation

`enforced_by: human-review` · extracted 2026-10-15 from Agricultural Sciences, Life Sciences, Economics and Tourism, which all print the same five formats

| Section A format | Present as |
|---|---|
| A–D multiple choice (incl. "(i)–(iv) choose the CORRECT combination") | `multiple_choice`; prefer `multi_select` when the learning is "which of these apply" rather than the lettered-combo trick |
| A only / B only / both / none | `multiple_choice` with those four fixed options (counts toward the index-0 tally — `DESIGN-UNI-06`) |
| "Give ONE word/term" **from a printed list** | `multiple_choice` — the list (or a same-family subset) is the option set; typing it adds nothing |
| "Give ONE word/term" with **no** list | `multiple_choice`/`multi_select`, or a single-term `fitb` only under `CLOSED-KB-01` |
| "Choose the correct word(s) from those in brackets" | `multiple_choice` with the two bracket words as the options |
| "Change the UNDERLINED word" | `multiple_choice` on the replacement (`CLOSED-KB-01` item 5) |
| Column A ↔ lettered Column B (≤ 5 pairs) | `match`; if Column B is pictures, supply fresh images or text-described items — never the exam's own pictures |

Never copy the exam's answer-lettering instruction ("write only the letter", "e.g. 1.1.21 D") into the stem. Section A mixes the later topics: cluster by
topic to feed the Section B–E lessons (`DESIGN-UNI-10`).

## Essays and unmarked long answers

### `CLOSED-ESSAY-01` — Decompose along the memo's headings; never ask for the essay

`enforced_by: human-review` · was `DESIGN-BUS-03`, `DESIGN-ECON-06`, `DESIGN-HIST-02`

No free-text/essay input exists. One lesson per essay question (not per bullet), mixing (a) **content items** on the essay's own memo headings
(`CLOSED-DISC-01`) with (b) **essay-strategy items** grounded in the subject's own *printed* rubric (LASO for Business Studies, the Economics
introduction/body/conclusion mark budget, History's instruction-word stance). Good objective shapes: `ordering` an essay plan; `multiple_choice`
"which introduction earns the mark"; `multi_select` of conclusion ingredients; a `multiple_choice` mark-budget question. The essay's bullets map
onto CAPS sub-topics already — use them, don't invent a split. Never quote the memo's model-answer prose. **If a paper has no essay (Agricultural
Sciences), this rule is simply unused.**

## Drawn work → supplied figure

### `CLOSED-FIG-01` — "Draw a graph / diagram / Punnett square" is never asked; its marking scheme is tested

`enforced_by: human-review` · was `DESIGN-ECON-03`, `DESIGN-LIFE-04`, `DESIGN-PHYS-03`, `DESIGN-MATH-02`/`04`

The app has no drawing input. Memos publish the scheme (Economics: 4 of 8 marks for labelled axes, labelled curves, the key area; Life Sciences:
**T**ype, **C**aption, **L**abels + unit, **S**cale, **P**lotting). Supply a **generated figure carrying the data the real question asked the
student to plot**, then test what the drawing assessed:

- *which graph type suits this data* (`multiple_choice` — discrete categories vs. continuous variable; memo penalises the wrong type);
- *which criteria a correct graph must show* (`multi_select`: title/caption naming both variables, labelled axes **with units**, equal scale, a
  legend where two series are combined);
- *a value read off the figure* (`fitb` numeric, `standard_math`), *the highest/lowest/turning point* (`multiple_choice`);
- *which label belongs at X / which curve is Y / where is the loss area* (`multiple_choice`/`multi_select`); curve ↔ meaning as `match` (≤ 4 pairs);
- the reasoning chain behind a drawn result as `ordering`.

A 6-mark drawing item becomes **3–4 practice questions on one shared figure** (`DESIGN-UNI-14`). Genetic crosses and Punnett squares decompose the
same way: gametes of each parent (`multiple_choice`), offspring genotypes (`multi_select`), the fraction/percentage showing the trait
(`fitb` numeric or `multiple_choice`), expected number from N offspring (`fitb` numeric). Never display the filled square when the question is
*about* the square.

### `CLOSED-FIG-02` — Generated figures: mechanics and guards

`enforced_by: human-review` (validator checks only that the URL string is literal) · was `DESIGN-LIFE-03`, `DESIGN-ECON-05`, Maths `gen-*-figures.py`

- Generate with matplotlib (or SVG→PNG) under `temp/images/{subject}/{year}/{paper}/q{N}/`; upload with `tools/upload-question-supplementary.js`
  (`question_supplementary/{subject}/{year}/{paper}/q{order}/{type}_{index}.png`) and paste the printed value into the question doc as a **literal
  URL string**, never a `const` reference (the validator evals the `questions` array in isolation).
- **Fresh data** (`DESIGN-UNI-01`): different values, categories, months, organisms; never the exam's own table or image as the practice stimulus.
  The real paper's images attach to the lesson only as the exam reference (`question_image_urls`, `memo_image_urls`, `PIPE-03`).
  Invented data is labelled illustrative and never given a fabricated attribution ("Adapted from SARB Quarterly Bulletin").
- **A figure never contains the answer** (`feedback-clues-never-leak-answer`): no value labels on bars the question asks the student to read, no
  annotation naming the process, organism or term being identified. Check each stem against its figure before upload.
- **Cross-check every label and number** against the question text before wiring (the Life Sciences gel-label bug). A generated anatomy figure
  (eye, ear, neuron, reproductive tract) that is not clearly correct on inspection is **dropped**, falling back to asking the part by *function*
  with no figure (relational framing, `DESIGN-UNI-08`).
- **A question that depends on a figure always carries `supplementary_material`.** "Diagram X/Y/Z" and "parts A–F" are meaningless without it.
  Several questions in one lesson may point at the same `image_urls`; each must still stand alone given the figure (`DESIGN-UNI-02`) unless the
  lesson is authored as linked (`DESIGN-UNI-13`).
- **Source data is part of the question, so copy it exactly** when a real exam table/graph is the stimulus (`DESIGN-UNI-02`); a transcription slip
  silently changes the memo answer.
- `supplementary_material.type` is free-form — the client only renders the image. Reuse `"graph"`, `"diagram"`, `"table"`, `"structure"`,
  `"pedigree"`, `"gel"`; pick a name once and keep it.

### `CLOSED-FIG-03` — A statement, table or ledger with lettered blanks: one figure, one `fitb`, at most three independent blanks

`enforced_by: human-review` · was `DESIGN-ACC-01`–`03` (Accounting, 2026-10-15; owner pattern)

The app has no table-entry presentation and does not need one. Where the paper asks the student to *complete* a grid (financial statement, ledger,
reconciliation, results table, budget, itinerary costing), show the grid as a **generated figure** (`CLOSED-FIG-02`) with the cells to be found
**highlighted and lettered A, B, C**, and answer them with one numeric `fitb`:

```js
question: "Calculate the three missing amounts (A, B and C) in the statement shown.",
supplementary_material: { type: "table", label: "<the exam's own heading>", image_urls: ["<literal URL>"] },
metadata: ["A = ", "[ ]", " B = ", "[ ]", " C = ", "[ ]"],
answer: ["84740", "250000", "774500", "", ""],
presentation: "fitb", keyboard_type: "standard_math"
```

- **Letters, not "block"/"box".** The highlight carries the letter inside it (readable without colour; single high-contrast fill, palette checked
  with `validate_palette.js`), and the `metadata` labels repeat the letters.
- **At most three blanks per `fitb`.** The schema allows five (`FITB-02`), but marking is all-or-nothing and does not say which blank failed, so more
  blanks make a miss uninformative. One blank is fine and often best. `enforced_by: human-review`.
- **Blanks are independent.** B is never computed from A (a slip in A would fail both with no signal). A figure that feeds the next goes in a later
  question of a **linked** lesson (`DESIGN-UNI-13`). A balancing figure may be a blank only if everything it balances against is given.
- **Anchor every blank**: show the surrounding figures so each blank has one defensible value (the same defect as consecutive `steps` blanks).
- **Large grids are split by section**, one linked lesson per section, with the whole grid legible; if text is unreadable at phone width on the
  emulator, crop the figure to the section. One generated grid may serve several questions, each lettering a different part.
- Typed values are bare numbers (`CLOSED-FMT-01`, `CLOSED-KB-01`): no thousands space, `R`, `%`; negatives as `-`; units in the label.

## Calculations

### `CLOSED-CALC-01` — Fresh numbers, one unknown, final value typed, method taught in the explanation

`enforced_by: human-review` · was `DESIGN-ECON-04`, `DESIGN-LIFE-04`, `DESIGN-PHYS-01`

- No real exam figure appears in a practice question (`DESIGN-UNI-01`). Keep the **structure** the memo shows (formula → substitute → compute →
  interpret) and make the common slip a distractor (raw difference instead of dividing by ΔQ; forgetting to convert moisture % to dry matter).
- The practice item is a one-blank `fitb` on the **final** value; formula and substitution live in the AI explanation (`core/ai-explanation.md`).
  Where the memo accepts several methods, do not hard-wire one in a `steps` row — give the formula as context and blank only the arithmetic.
- **Units go in the `metadata` label, never the typed value** (`KEYBOARD-02`). If the memo awards a separate mark for the unit, add a
  `multiple_choice` for it (`mg / g / mℓ / mg per kg`).
- **Store the memo's own tolerance.** Many memos accept `4,9 / 5` or "accept ± 0,1". Read each calculation memo for an OR before fixing the stored
  answer; list every accepted form with `|` and state the required rounding in the stem. Never store a stricter value than the memo marks.
- A calculation followed by a decision from the sign ("increase or decrease?") is a follow-up `multiple_choice` in the same lesson (`CLOSED-DISC-04`).

## Typed answers

### `CLOSED-KB-01` — Type a bare number or one unambiguous term; use selection for anything paraphrasable

`enforced_by: validator` (declaration) + `human-review` (judgement) · was `DESIGN-LIFE-01`, `DESIGN-HIST-03`, `DESIGN-BUS` keyboard notes

Marking is exact string after trim, lower-case, `,`→`.`, trailing `. , ; ! ?` stripped; `|` separates accepted alternatives; no stemming and no
synonym credit (`core/keyboard-input.md` § Marking). Therefore:

1. Every typed `fitb` declares `keyboard_type` (`KEYBOARD-04`): a bare number → `standard_math`; a single canonical term → `text`. 2.4.0 is the authoring
   baseline (`VER-11`), so the derived gate is never a reason to avoid `text`; run `apply-exam-gate.js` after upload as usual (`VER-09`). Whether to type or
   select is decided by rules 2–3 below (marking merit), not by the gate.
2. Use `text` only where the answer is **one unambiguous word**. If the memo marks "any 1 of N" or gives slash alternatives (`Snout/lips/teeth`),
   convert to `multiple_choice`/`multi_select`, or list **every** memo-accepted form with `|`, **including the US/UK spelling variant** (`oestrogen`
   | `estrogen`). Options display exactly as the exam writes them (SA/UK spelling).
3. **Case-bearing answers cannot be typed.** The `text` keyboard emits uppercase, so genotypes/alleles (`Dd`/`DD`/`dd`) and any answer that
   differs only by case are `multiple_choice`/`multi_select`/`match`.
4. **A ratio colon is not on `standard_math`.** Ask for one number ("the second number in 1 : x"), or split into two numeric blanks; a multi-term
   ratio (1 : 2 : 1) is a `multiple_choice`.
5. "Change the underlined word" has no native shape (the underline is lost in text): present it as a `multiple_choice` — "which replacement makes the
   statement true" — with wrong replacements from the same concept family.
6. Acronym-heavy content is fine in option text; a typed answer is the full term unless the paper's own instruction says otherwise.

## Formatting

### `CLOSED-FMT-01` — Number and currency conventions

`enforced_by: human-review` · was `DESIGN-ECON-08`, `DESIGN-BUS` formatting

`R` + space-separated thousands (`R1 000`, `62 869`; not `R1,000`); **decimal comma in prose and option text** (`0,5`), stored `.` in typed
values; negatives with an ASCII hyphen-minus (`-197`, never U+2212 — `core/keyboard-input.md` Gotcha); currency and percentage tokens never inside a
typed answer. An isolated `(A/B)` renders as a stacked fraction — avoid it in option text. Legislation and programmes keep the paper's form
(`Broad-Based Black Economic Empowerment (B-BBEE)`).

## Paper-level checks (pointer, not a new rule)

Run the paper-level index-0 tally (`DESIGN-UNI-06`, ≤ ~10%) and the True/False cap (`DESIGN-UNI-05`) across **all lessons of a paper**, not per
lesson. A fixed-order four-option item (A only / B only / both / none) skews index placement — count it. Sentence-length options are where the
"longest option is right" cue appears (`DESIGN-UNI-16`); run `tools/audit-answer-cues.js` before upload.
