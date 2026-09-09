# Upload — DBE Physical Sciences: Physics P1 (one lesson)

**Profile:** `subjects/dbe-physics.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used. `AMPM-CONTENT-MATHTEXT`
not yet in scope for physics — still an open item in the profile, check before relying
on it.

> Do NOT enter plan mode. Run once per lesson — which is *not* always one per exam
> question for physics; see Phase 0. Commit after Phase 4.

## Phase 0 — Lesson granularity decision (`DESIGN-UNI-10`)

Required before Phase 1, every lesson, not assumed from the previous one:

- Do this exam question's sub-parts share one continuous scenario/diagram/given-values
  set (later parts build on earlier ones, or all reference the same figure)? → **One
  lesson**, bundle all sub-parts (this is the common case — Q2 onward on the 2025 Nov
  P1 paper were all this shape).
- Is it a block of independent items instead (an MCQ section, each item an unrelated
  mini-scenario)? → **Cluster by the exam's own thematic ordering**, checked against
  the CAPS document's topic/weighting breakdown (`files/CAPS FET PHYSICAL SCIENCE
  WEB.pdf`, Section 2.6) — not one lesson for the whole block, not one lesson per item.
  (Q1's ten MCQs clustered into 4 lessons by CAPS knowledge area — see the profile's
  "Paper structure" section for the full worked example and the two wrong shapes tried
  first.)

Getting this wrong is expensive to unwind (Q1 needed two full rebuilds) because lesson/
question/sub-question IDs are deterministic from `(paper, order)` alone
(`tools/lib/uuid.js`) — reusing an `order` for a differently-shaped lesson leaves the
old rows' children orphaned-but-attached unless explicitly `DELETE`d first (no
soft-delete tooling exists for a full lesson yet).

## Required inputs

Exam question number(s) this lesson covers (per the Phase 0 decision), year, paper,
paper-wide `order` (recompute downstream orders if inserting a lesson), paper + memo
PDFs (`files/`).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): curriculum unit/topic/subtopic per the profile's
   unit tables — reuse before creating (`PIPE-08`); note which sub-parts need a
   recreated diagram (free-body/circuit/field/energy-level — `DESIGN-PHYS-04`); note
   real per-sub-question marks from the memo (feeds both `ai_explanation` and Phase 3's
   practice-question count).
2. **Images** (pipeline Phase 1.5): formula sheet once per paper (3 pages — physical
   constants; motion/force/work-energy-power/waves; electrostatics/circuits/AC),
   reused in every video's `supplementary_materials`. Real exam page(s) via
   `--question-pages`; memo pages via `--memo-pages`. **If several lessons share one
   exam page** (per the Phase 0 clustering decision), crop precisely — don't trust
   `--inspect`'s band-scan output alone on dense/short-lined content, extract
   overlapping test slices (`--question-pages "N:end=X"` / `"N:start=X:end=Y"`) and
   visually narrow until each slice holds exactly one lesson's content (see the
   profile's page-5 case study for the exact technique). Recreated schematic diagrams
   (new assets, never real-exam extracts) are generated (matplotlib/SVG→PNG) and
   uploaded via `tools/upload-question-supplementary.js` to `question_supplementary/`
   — distinct from `upload-exam-images.js`'s `exam_papers/` tree.
3. **Video document** (pipeline Phase 2): standard template + formula-sheet entry.
   `name` reflects the Phase 0 shape — `"Question N"` for a bundled long-form question,
   `"Question N.a–N.b"` (or a single `"Question N.a"`) for a clustered MCQ part.
4. **Questions** (pipeline Phase 3): fresh scenarios per `DESIGN-UNI-01`. Recall-only
   sub-parts ("state the law," "define X") get `DESIGN-UNI-08`-style relational
   framing, not a literal reword. Numeric answers: unit as a static `fitb` label, never
   part of the matched value (`DESIGN-PHYS-02`); round per the paper's own instruction
   (`DESIGN-PHYS-01`). Graphs, circuits, and free-body diagrams decompose — never ask
   for free-hand drawing or a full analysis from scratch (`DESIGN-PHYS-03`/`05`).
   `steps` is a first-class choice for numeric multi-step working, not just symbolic
   proof (its `QuestionsValidator.kt` branch now has `fitb`-style numeric tolerance).
   **Practice-question count scales with the real sub-part count** (`DESIGN-UNI-11`) —
   check the sub-part breakdown before calling the set complete, don't default to a
   flat number; a single-item clustered part stays at ~2. Presentation variety
   (`DESIGN-UNI-07`). Before finalizing each `clues` field, check it doesn't state,
   compute, or (for definitional MC) name the answer verbatim (`AIEXP-03` —
   `validate-questions.js` flags a likely leak with a non-blocking `⚠`, treat every
   hit as a real rewrite).
5. **Vocab dump** (pipeline Phase 3.5): `--subject physics` (Auth Proxy running).
   Re-dump after creating any new curriculum node/skill mid-session.
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to
   `add-physics-<year>-<paper>-q<N>[-part<M>].js` (the `-part<M>` suffix only for a
   Phase-0-clustered MCQ part); `subject: "physics"` throughout. `aiExplanation` has
   **one entry per real exam sub-question** (not per practice question), `marks` from
   the memo. Validate with `--curriculum` — HARD STOP (`PIPE-10`) — then `--dry-run`,
   then upsert to dev. **Commit**
   (`[Data] Add physics <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: every numeric answer's unit is
   present as a metadata label, not folded into the matched value; formula sheet on
   every video; no `⚠` clue-leak warning left unresolved; image URLs resolve
   (`curl -o /dev/null -w "%{http_code}"`); if this lesson shares a source exam page
   with another lesson, spot-check both images show only their own content, no
   cross-lesson bleed. Update the profile's completed-papers ledger.
