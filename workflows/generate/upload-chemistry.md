# Upload — DBE Physical Sciences: Chemistry P2 (one lesson)

**Profile:** `subjects/dbe-chemistry.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used. `AMPM-CONTENT-MATHTEXT`
already extended to `subject: "physics"` (covers Chemistry's given-text rendering — no
open item here, unlike physics's own doc). **`DESIGN-CHEM-01`** (the profile's keyboard
constraint) governs every question's presentation choice below — read the profile's
"Keyboard constraint" section before Phase 3, not during it.

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
   - **Typeable or not** (`DESIGN-CHEM-01`) — bare-numeric calc, or does the real answer
     need a structural formula / IUPAC name / equation / subscript / charge? That
     decides the presentation family before you draft anything.
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
   draws one (e.g. Q2's compound table) — `DESIGN-CHEM-01` bars typing them, so the
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
   sub-parts flagged in Phase 1. `DESIGN-CHEM-01` gates presentation choice for every
   question: no typed blank (`fitb`/`equation`/`steps`) may require a letter beyond
   `x`/`y`/`θ` or a subscript/charge — use `multiple_choice`/`multi_select`/`match`/
   `ordering` instead, and present structural formulas as given images, never as typed
   or MathText content. Reserve typed blanks for genuinely bare-numeric answers only.
   Numeric answers: unit as a static `fitb` label, never folded into the matched value
   (`DESIGN-PHYS-02` pattern, same split here); round to the paper's own instruction
   (minimum two decimal places). Graphs (concentration-vs-time, Maxwell-Boltzmann)
   decompose the same way physics's do — read a value → `fitb`; identify a shift/shape
   → `multiple_choice`; never ask to redraw (the source paper's Q5.3.5 literally does;
   decompose it instead). **Practice-question count scales with the real sub-part
   count** (`DESIGN-UNI-11`) — check the sub-part breakdown before calling the set
   complete. Presentation variety (`DESIGN-UNI-07`) — expect a heavier
   `multiple_choice`/`match`/`multi_select` mix than physics, that's `DESIGN-CHEM-01`
   working as intended, not a gap to fill with more `fitb`. Before finalizing each
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
   same angle; every non-bare-numeric question uses `multiple_choice`/`multi_select`/
   `match`/`ordering`, never a typed blank needing a letter beyond `x`/`y`/`θ` or a
   subscript/charge (`DESIGN-CHEM-01` spot check); structural-formula images present
   wherever the source paper draws one; image URLs resolve
   (`curl -o /dev/null -w "%{http_code}"`); if this lesson shares a source exam page
   with another (Q1's 5-way split), spot-check both images show only their own content.
   Update `subjects/dbe-chemistry.md`'s Completed papers ledger (currently empty).
