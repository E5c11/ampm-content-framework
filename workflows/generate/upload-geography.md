# Upload — DBE Geography (one lesson / exam subsection)

**Profile:** `subjects/dbe-geography.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used (Geography subset only —
profile).

> Do NOT enter plan mode. Run once per lesson (one exam subsection, e.g. 1.1, 3.2).
> Commit after Phase 4.

## Phase 0 (Section B only) — no maps

Maps are not available in this system, so **no Q3 question may depend on one** (profile,
*Subject rules*). Before authoring any Q3 lesson, decide for each real sub-question how
its technique can be taught from invented, fully stated data, and rewrite any item that
only works with the sheet (grid blocks, spot heights, "evidence from the map") into a
self-contained scenario. `map_key` stays **null** on every lesson and question; do not
touch `geography_maps`.

## Required inputs

Lesson name (`"Question N.M: Description"`), exam subsection number, paper, year, order,
paper + memo PDFs, YouTube video ID/duration if a source exists for
Geography (unconfirmed — check before Phase 2; may ship `has_video: false`).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): identify the subsection's exam stimulus type
   (extract/graph/table/infographic/photo for Section A; map-block reference for Section
   B), its theme, each sub-question's type, and which sub-questions are
   text/data-extractable vs. require free-text/free-drawing response (reframe the latter
   per profile — never skip the mark-weight silently).
2. **Images** (pipeline Phase 1.5): Section A extracts per-lesson visuals normally.
   Section B uses only the booklet's own pages (instructions, formulas, GIS sketch,
   photographs) — never a map sheet. Recreated
   schematic diagrams (settlement shapes, land-use profiles, GIS layering sketches) are
   new assets, uploaded the same way.
3. **Lesson document** (pipeline Phase 2): standard template; `map_key` is null on every lesson.
4. **Questions** (pipeline Phase 3): fresh scenarios per `DESIGN-UNI-01` — Section A gets
   an entirely fresh stimulus on the same theme; Section B teaches the technique on invented, fully
   stated data — no question may depend on a map, grid block or map feature. Presentation types restricted to `multiple_choice`, `multi_select`, `fitb`,
   `match`, `steps` per profile. **Every `fitb`/`steps`/`equation`/`fraction` declares
   `keyboard_type`** (`KEYBOARD-04`, validator error): `standard_math` for numeric `fitb`,
   `scientific_math` for numeric `steps`; no typed words (use MC/multi-select). Scale/ratio answers: two `fitb` blanks split on a literal
   `":"` token, never `fraction`. `type` is `definition`/`calc`/`interpretation`/
   `application`. Vocabulary reuse-before-creating against `curriculum_nodes`/`skills`
   (`subject_id = 'geography'`) (`PIPE-08`).
5. **Vocab dump** (pipeline Phase 3.5): `--subject geography` (Auth Proxy running).
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to
   `add-<year>-<paper>-q<N>.js`; `subject: "geography"` on every block; `aiExplanation`
   per exam sub-question with real `marks`. Validate with `--curriculum` — HARD STOP
   (`PIPE-10`) — then `--dry-run` and upsert to dev. **Commit**
   (`[Data] Add geography <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: `map_key` null on every lesson/question
   and no question referring to a map, grid block or "on the map"; image object keys under
   `exam_papers/dbe/geography/YYYY/<paper>/`; no real exam value reused verbatim in a
   Section B question's own data.
