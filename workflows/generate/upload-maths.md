# Upload — DBE Mathematics (one question group)

**Profile:** `subjects/dbe-maths.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-MATHTEXT`, `AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used.

> Do NOT enter plan mode. Run once per question group. Commit after Phase 4. Moved from
> `AMPM/workflows/generate/upload-maths.md` (stub remains there).

## Required inputs

Same as math-lit (YouTube ID, question number, order, year, paper key, paper + memo
PDFs). Collections and denormalized values: profile.

## Phases (deltas on the pipeline skeleton)

1. **Analyse**: curriculum unit/topic per the profile's unit tables; note graph/diagram/
   formula-sheet dependence; 2–5 concept tags.
2. **Images**: **formula sheet once per paper** (last page), reused in every video's
   `supplementary_materials` (profile); inline diagrams captured with `--question-pages`;
   separate-page diagrams as annexures.
3. **Video document**: standard template + formula-sheet entry on every video.
4. **Questions**: 2–4, fresh scenarios; MathText markup in question/metadata strings;
   **per-question `clues` required** (profile); per-question `supplementary_material`
   when the decision test says so (profile — matplotlib/SVG generation);
   graph-decomposition, interval-constrained trig, decomposed proofs, expression-answer
   MCQ preference, P2 topic variety (`DESIGN-MATH-02`…`06`).
5. **Vocab dump**: skip — no Maths `curriculum_nodes` rows yet; validator runs without
   `--curriculum` (profile).
6. **Upload script**: copy `tools/upload-script-template.js` to
   `add-maths-<year>-<paper>-q<N>.js`; `subject: "maths"`. Validate (HARD STOP) →
   `--dry-run` → upsert to dev → **commit**
   (`[Data] Add maths <year> <paper> Q<N> lesson and questions`).

   > **Known limitation:** the validator still requires `unit`/`topic` on every question,
   > but the upload script's FK preflight rejects any `curriculum_nodes` slug that doesn't
   > exist — and there are no Maths curriculum rows yet. Until the Maths curriculum lands,
   > either create the needed nodes first (`tools/create-curriculum-node.js --subject
   > maths …`) or hold Maths authoring. Tracked in
   > `workflows/archive/repoint-authoring-to-postgres.md` (Out of scope).
7. **Verify**: pipeline checklist plus the Maths items — clues format on every question,
   formula sheet on every video, MathText markup (no plain `/` or bare `√`), `equation`
   canonical answers, `steps` contracts, trig intervals, decomposed graphs. Update the
   profile's completed-papers ledger.
