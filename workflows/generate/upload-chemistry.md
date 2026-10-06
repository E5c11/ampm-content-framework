# Upload — DBE Physical Sciences: Chemistry P2 (one lesson)

**Profile:** `subjects/dbe-chemistry.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used. `AMPM-CONTENT-MATHTEXT`
already extended to `subject: "physics"` (covers Chemistry's given-text rendering;
`MATHTEXT-09`–`-11` say which fields render markup and which subscript rule applies).
**`core/keyboard-input.md`** (`KEYBOARD-04`, the `chemistry` keyboard's inventory, and its
"Typed answers on the chemistry keyboard" spelling rules) governs every question's presentation and
keyboard choice below — read it before Phase 3, not during it. **One authoring track (decision
2026-10-06):** every new Chemistry paper is authored for the `chemistry` keyboard; anything that uses
it is gated at 2.4.0 automatically (`VER-09`, last section). `DESIGN-CHEM-01` (the old "no typed blank
may need a letter/subscript/charge" rule) is **history** — see the profile.

> Do NOT enter plan mode. Run once per lesson. Commit after Phase 4.

## Phase 0 — Lesson granularity decision (`DESIGN-UNI-10`)

For `nov_p2` this is **already resolved** in the profile's "Paper structure /
knowledge-area mapping" table — Q1's ten MCQs cluster into 5 knowledge-area lessons
(`-part1` through `-part5`), Q2–Q9 each stand alone as one lesson (13 lessons total).
Use that table directly; don't re-derive it per lesson. For a future paper without a
table like this yet, apply the same test physics uses: sub-parts sharing one continuous
scenario/compound-set → one lesson; an independent MCQ block → cluster by the paper's own
knowledge-area grouping (checked against `files/CAPS FET PHYSICAL SCIENCE WEB.pdf`,
Section 2.6 and Section 3's Chemistry topic tables), not one lesson for the whole block.

Same downstream cost as physics if this is wrong: lesson/question IDs are deterministic
from `(paper, order)` (`tools/lib/uuid.js`) — reusing an `order` for a differently-shaped
lesson orphans the old rows' children unless explicitly `DELETE`d first.

## Required inputs

Exam question number(s) this lesson covers (per the profile's table or a fresh Phase 0
call), year, paper, paper-wide `order`, paper + memo PDFs (`files/Physical Sciences P2
Nov 2025 Eng.pdf`, `files/Physical Sciences P2 Nov 2025 MG Afr & Eng.pdf`).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): curriculum unit/topic/subtopic per the profile's
   curriculum-units section — reuse before creating (`PIPE-08`). For each real
   sub-question, decide up front (feeds both Phase 3 and Phase 2):
   - **Typed or not** — decide per sub-question which assessment is *better*, not which is
     possible: a typed answer with proper notation (formula, ion with charge, state symbol,
     balanced or half equation, IUPAC name — typeable on the `chemistry` keyboard) when recalling or
     writing it **is** the skill; `multiple_choice`/`match`/`multi_select`/`ordering` where choosing or
     classifying is the better assessment; a bare-numeric blank for a calculation; a structural formula
     is **never typed** (an image to identify with `multiple_choice`/`match`). That decides the
     presentation family before you draft anything.
   - **Content-based or procedural** (profile's "Subject rules", first bullet) — Organic
     Molecules naming/classification (Q1.1–1.3, Q2, Q3) is fixed-fact: needs
     `DESIGN-UNI-08` relational framing, not a reworded compound, or a student who
     memorized the real answer trivially gets the practice one too. Rate/Equilibrium/
     Acids&Bases/Electrochemistry calculations (Q5–Q9) are procedural like Physics —
     varying the numbers is real freshness there. Decide per sub-question, not once per
     lesson.
   Note real per-sub-question marks from the memo (feeds `ai_explanation` and Phase 3's
   practice-question count) and which sub-parts need a recreated diagram (cell setup,
   Maxwell-Boltzmann curve — `DESIGN-CHEM-01`'s diagram-needed list in the profile).

2. **Images** (pipeline Phase 1.5): formula sheet **4 pages, once per paper** (physical
   constants + formulae Tables 1–2; periodic table Table 3; standard reduction
   potentials in *both* orderings, Table 4A and 4B — upload both, they're different
   images with the same data), reused in every lesson's `supplementary_materials`. Real
   exam page(s) via `--question-pages`; memo pages via `--memo-pages`. Same
   multi-lesson-per-page cropping care as physics if a source page is shared across
   this paper's 5-way Q1 split.
   **Structural formulas are mandatory, not judgment-call**, wherever the source paper
   draws one (e.g. Q2's compound table) — a structural formula cannot be typed on any keyboard, so the
   image is the only representation of that compound; use `type: "structure"` (new
   value, extends physics's `"diagram"|"circuit"|"graph"|"table"` set). Everything else
   (cell diagrams, graphs, reaction-vessel diagrams) uses the same no-figure-
   attemptability judgment call as physics — see the profile's "Per-question
   supplementary material" section for the worked list. Upload via
   `tools/upload-question-supplementary.js` to `question_supplementary/` — path stays
   under `subject: "physics"` (shared `subject_id`), disambiguated by the `nov_p2`
   paper segment, same as physics's own P1 paths.

3. **Video document** (pipeline Phase 2): standard template + 4-page formula-sheet
   entry. `name` reflects the Phase 0 shape — `"Question N"` for a standalone lesson
   (Q2–Q9), `"Question N.a–N.b"` for a clustered MCQ part (Q1's 5 clusters).

4. **Questions** (pipeline Phase 3): fresh scenarios per `DESIGN-UNI-01`, with
   `DESIGN-UNI-08` relational framing **required, not optional**, for the content-based
   sub-parts flagged in Phase 1. **Typed answers on the chemistry keyboard.** Prefer a typed answer with proper notation
   where it makes a better question than multiple choice or a bare number: formulae, ions with
   charges, state symbols, balanced and half equations, names. Keep multiple choice where it is the
   better assessment. Structural formulas stay images, never typed content.
   **Keyboard declaration (`KEYBOARD-04`).** Every typed Chemistry question declares
   `keyboard_type: 'chemistry'` — **unless the answer is purely numeric**, then it stays
   `'standard_math'` (`fitb`) / `'scientific_math'` (`steps`). Formula, symbol and ion answers set
   **`case_sensitive: true`** (`Co` ≠ `CO`, `SCHEMA-CS-01`); numeric, word and name answers leave it off.
   Store answers as markup with **no spaces** (`H_{2}O`, `Fe^{3+}`, `SO_{4}^{2-}`, `NaCl(aq)`,
   `HCℓ` with U+2113) and use `|` alternatives for every accepted spelling (`fitb` only — `steps` has
   none). The exact marking rules (what is normalised, which spellings match, IUPAC names, whole
   equations, what is still unverified on device) are in `core/keyboard-input.md` § "Typed answers on
   the chemistry (and physics) keyboard". A typed equation is a `fitb` (one blank per missing species is
   preferred), not the `equation` presentation. Numbers in scientific notation stay a bare mantissa with
   the power of ten in the label (`MATHTEXT-11`). The `question` text ends with the blank-slot marker
   `[]` (rendered `___`, the answer box below it — `FITB-03`); this is intended.
   Numeric answers: unit as a static `fitb` label, never folded into the matched value
   (`DESIGN-PHYS-02` pattern, same split here); round to the paper's own instruction
   (minimum two decimal places). Graphs (concentration-vs-time, Maxwell-Boltzmann)
   decompose the same way physics's do — read a value → `fitb`; identify a shift/shape
   → `multiple_choice`; never ask to redraw (the source paper's Q5.3.5 literally does;
   decompose it instead). **Practice-question count scales with the real sub-part
   count** (`DESIGN-UNI-11`) — check the sub-part breakdown before calling the set
   complete. Presentation variety (`DESIGN-UNI-07`) — expect a heavier
   `multiple_choice`/`match`/`multi_select` mix than physics wherever choosing or classifying is the
   better assessment, but typed notation answers are now first-class (see the typed-answers rules above). Before finalizing each
   `clues` field, check it doesn't state, compute, or (for definitional MC) name the
   answer verbatim (`AIEXP-03` — `validate-questions.js`'s non-blocking `⚠`, treat every
   hit as a real rewrite — this is exactly the bug that hit Q1/Q2 of part1: two
   questions testing the same fact from the same angle reads as similar even without a
   literal leak, so also eyeball adjacent questions in the set for topical overlap, not
   just each question in isolation).

5. **Vocab dump** (pipeline Phase 3.5): `--subject physics` (shared `subject_id` —
   same command as physics, not a separate chemistry dump). Re-dump after creating any
   new curriculum node/skill mid-session.

6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to
   `add-physics-<year>-<paper>-q<N>[-part<M>].js` — filename keeps the `physics` prefix
   (matches `subject: "physics"` throughout the script), same convention part1 already
   established; there is no `add-chemistry-*` naming track. `aiExplanation` has one
   entry per real exam sub-question, `marks` from the memo. Validate with `--curriculum`
   — HARD STOP (`PIPE-10`) — then `--dry-run`, then upsert to dev (Cloud SQL Auth Proxy
   must be running: `cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432`).
   **Commit** (`[Data] Add chemistry <year> <paper> Q<N> lesson and questions`).

7. **Verify** (pipeline Phase 5 checklist), plus: every numeric answer's unit is a
   metadata label, not folded into the matched value; formula sheet on every video, all
   4 pages including both Table 4A/4B orderings; no `⚠` clue-leak warning left
   unresolved, and no two questions in the same lesson testing the same fact from the
   same angle; every typed question's `keyboard_type` follows `KEYBOARD-04` and `validate-questions.js` raises no
   keyboard error; every formula/symbol `fitb` answer sets `case_sensitive: true`; structural-formula images present
   wherever the source paper draws one; image URLs resolve
   (`curl -o /dev/null -w "%{http_code}"`); if this lesson shares a source exam page
   with another (Q1's 5-way split), spot-check both images show only their own content.
   Update `subjects/dbe-chemistry.md`'s Completed papers ledger (currently empty).

**Retrofitting an already-uploaded paper**: `core/keyboard-input.md` `KEYBOARD-06` (not a re-generation; a
`chemistry` keyboard or markup makes the exam `2.4.0`, and an exam already live in prod is not
retrofitted before the release is tagged). Worked example: `scripts/fix-keyboard-retrofit-physics-2024-2026-10-05.js`.

## How a new or retrofitted paper gets its gate (`VER-09`, `core/app-feature-versions.md`)

The last step of every upload **and** of every retrofit — the exam's minimum app version is *derived*, never typed:

1. `node tools/derive-exam-min.js scripts/add-physics-<year>-<session>-*.js` — all papers of the exam (this workflow's P1 and P2 scripts share the glob).
2. `node tools/apply-exam-gate.js --env dev --subject physics --year <YYYY> --session november` — dry run: shows the exam's derived minimum, each paper's
   minimum, the gate it would write, and how many published questions it would hide from older builds. Read it, then re-run with `--apply`.
   (Upload scripts built from `tools/upload-script-template.js` run this automatically after a real dev upload; a retrofit fix script does not — run it yourself.)
3. The result is per **exam** (subject + syllabus + year + session): if one paper needs 2.4.0, its sibling paper is gated at 2.4.0 too, and **no** paper of the exam goes
   to prod until 2.4.0 is tagged and `LATEST_RELEASED` is bumped (`push-paper-to-prod.js` refuses the whole exam, `VER-08`). At the floor nothing is written.
