# Upload — DBE Geography (one lesson / exam subsection)

**Profile:** `subjects/dbe-geography.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used (Geography subset only —
profile).

> Do NOT enter plan mode. Run once per lesson (one exam subsection, e.g. 1.1, 3.2).
> Commit after Phase 4.

## Phase 0 (Section B only) — `geography_maps` check

Required before authoring any Q3 (Geographical Skills) lesson; skip for Section A
(Q1/Q2).

Every `map_key` a lesson/question references must already be a row in the Postgres
`geography_maps` table (the upload script's FK preflight rejects unknown ones):

```bash
psql -c "SELECT id, name, map_type, scale, sheet_number, year FROM geography_maps ORDER BY year, sheet_number"
```

- **New map pair** → the `geography_maps` table, its migration, and a
  `tools/create-geography-map.js` script don't exist yet as of this paper (see subject
  profile). This is a blocking prerequisite for Section B — resolve it (migration +
  script, `ampm-backend`) before Phase 1.5 of a Q3 lesson, not mid-session.
- `map_key` is per-map-pair, not per-year — a future paper reusing the same sheet reuses
  the same key.

## Required inputs

Lesson name (`"Question N.M: Description"`), exam subsection number, paper, year, order,
Section B `map_key`, paper + memo PDFs, YouTube video ID/duration if a source exists for
Geography (unconfirmed — check before Phase 2; may ship `has_video: false`).

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): identify the subsection's exam stimulus type
   (extract/graph/table/infographic/photo for Section A; map-block reference for Section
   B), its theme, each sub-question's type, and which sub-questions are
   text/data-extractable vs. require free-text/free-drawing response (reframe the latter
   per profile — never skip the mark-weight silently).
2. **Images** (pipeline Phase 1.5): Section A extracts per-lesson visuals normally.
   Section B crops the relevant grid-block region from the shared topo/orthophoto map
   sheet — distinct filenames per lesson even though the source is shared. Recreated
   schematic diagrams (settlement shapes, land-use profiles, GIS layering sketches) are
   new assets, uploaded the same way.
3. **Lesson document** (pipeline Phase 2): standard template; `map_key` set only for
   Section B lessons, null for Section A.
4. **Questions** (pipeline Phase 3): fresh scenarios per `DESIGN-UNI-01` — Section A gets
   an entirely fresh stimulus on the same theme; Section B keeps the real map as the
   worked example but asks about different grid blocks/features/values than the real
   exam did. Presentation types restricted to `multiple_choice`, `multi_select`, `fitb`,
   `match`, `steps` per profile. Scale/ratio answers: two `fitb` blanks split on a literal
   `":"` token, never `fraction`. `type` is `definition`/`calc`/`interpretation`/
   `application`. Vocabulary reuse-before-creating against `curriculum_nodes`/`skills`
   (`subject_id = 'geography'`) (`PIPE-08`).
5. **Vocab dump** (pipeline Phase 3.5): `--subject geography` (Auth Proxy running).
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` to
   `add-<year>-<paper>-q<N>.js`; `subject: "geography"` on every block; `aiExplanation`
   per exam sub-question with real `marks`. Validate with `--curriculum` — HARD STOP
   (`PIPE-10`) — then `--dry-run` and upsert to dev. **Commit**
   (`[Data] Add geography <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: `map_key` set on every Section B
   lesson/question and null on every Section A one; image object keys under
   `exam_papers/dbe/geography/YYYY/<paper>/`; no real exam grid-block/feature/value
   reused verbatim in a Section B question's own data.
