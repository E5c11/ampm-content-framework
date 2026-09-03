# Upload — DBE Math Lit (one question group)

**Profile:** `subjects/dbe-math-lit.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-MATHTEXT`, `AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used.

> Do NOT enter plan mode. Run once per question group (Q1.1, Q1.2, …). Commit after
> Phase 4. Moved from `AMPM/workflows/generate/upload-math-lit.md` (stub remains there).

## Required inputs

YouTube Video ID + duration (`temp/youtube_video_data.csv`, match title on
year/paper/question), paper question number, `order` (sequential across the full paper),
year, paper key, paper + memo PDFs. Collections and denormalized values: profile.

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): identify concepts, curriculum unit, difficulty,
   2–5 tags — maths concepts only, never scenario wrappers (`PIPE-06`).
2. **Images** (pipeline Phase 1.5): annexures are common; watch for rotated landscape
   pages and shared pages (`--inspect`).
3. **Video document** (pipeline Phase 2): standard template — all field values per
   profile + pipeline reference tables; `xp: 50`.
4. **Questions** (pipeline Phase 3): 2–4 questions, fresh scenarios (`DESIGN-UNI-01`),
   FITB ≤65% paper-wide (`DESIGN-ML-01`), non-trivial answers (`DESIGN-ML-02`),
   vocabulary reuse-before-creating against `curriculum_nodes` / `skills`
   (`subject_id = 'math_lit'`) (`PIPE-08`).
5. **Vocab dump** (pipeline Phase 3.5): `--subject math_lit` (Auth Proxy running).
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to
   `add-<year>-<paper>-q<N>.js`; `subject: "math_lit"` on every block; `aiExplanation`
   per exam sub-question with real `marks`. Validate with `--curriculum` — HARD STOP
   (`PIPE-10`) — then `--dry-run` and upsert to dev. **Commit**
   (`[Data] Add math_lit <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: image object keys under
   `exam_papers/dbe/math_lit/YYYY/<paper>/`; annexure completeness.
