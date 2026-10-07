# Upload — DBE Life Science (one lesson / real exam question or knowledge-area cluster)

**Profile:** `subjects/dbe-life-sciences.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{type}.md` per type used (Life Science subset only
— profile: `multiple_choice`, `multi_select`, `match`, `ordering`, `fitb`).

> Do NOT enter plan mode. Run once per lesson. Commit after Phase 4, per lesson.

Written retroactively, 2026-09-13, after `nov_p2` (15 lessons) was already fully
authored, reviewed, and pushed to prod without one — the same gap this session caught in
Business Studies before any lessons shipped. Recorded here so the pattern below is
followed deliberately on `june_p2` or any future Life Science paper, instead of being
re-derived (or silently varied) per session the way it was for `nov_p2`.

> **Paper 1 (authored 2026-10-07 — `nov_p1`, 16 lessons):** this doc was written for `nov_p2`. For `nov_p1`/`june_p1` the Section A
> clusters are *Human reproduction / Nervous system and senses / Endocrine and homeostasis / Plants*, the dominant mark type is
> explain/describe (→ `ordering`/`multi_select`, `DESIGN-LIFE-02`), diagrams are label-identification figures
> (`DESIGN-LIFE-03`), and graph-drawing / unit-bearing calculation / tabulation need decomposing (`DESIGN-LIFE-04`) — all in
> `subjects/dbe-life-sciences.md` § "Paper structure — Nov 2025 P1" and the `nov_p1` ledger entry. **Owner decisions 2026-10-07:**
> `text` is allowed for single canonical terms (gating the exam at 2.4.0 is accepted); P2 is not retrofitted.
> **`questions.type` is one of `application, calc, conversion, definition, fraction, interpretation, ordering, proof, ratio,
> reading, rounding`** — the validator does not check it, the upload preflight does.

## Required inputs

Lesson name (`"Question N.M (Description)"` or `"Question N (Knowledge Area)"` for
Section A clusters), which real exam question(s)/sub-question(s) this lesson covers,
paper, year, order, `nov_p2`'s exam + memo PDFs.

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): Section A's real Q1.1–1.5 (MCQ), 1.2 (biological
   terms), 1.3 (A/B/both/none) cluster by CAPS knowledge area (DNA, Meiosis, Genetics,
   Evolution — **not** left as one large mixed lesson the way Business Studies' own Q1
   had to be, because Life Science's sub-parts *do* cluster cleanly by strand; check the
   real paper's own sub-question topics before assuming either shape). Q1.4/1.5 and every
   Section B/C question are each one continuous scenario/diagram — one lesson each
   (`DESIGN-UNI-10` rule 1).
2. **Images** (pipeline Phase 1.5): extract into a **subject/paper-scoped local folder**,
   not a bare `temp/images/qN/` — `extract-exam-pages.py` does not clean its output
   directory first, and a bare `qN` name collided with a concurrent Chemistry session's
   stale files sharing the same paper/year during `nov_p2`'s own authoring (caught by
   comparing file mtimes before wiring URLs; eight directories had to be cleaned up after
   the fact). Verify each directory's file count against the expected question/memo page
   count *before* wiring URLs into the script, every time, not just when something looks
   wrong.
3. **Lesson document** (pipeline Phase 2): standard template. Multiple fresh practice
   questions in one lesson may share one `supplementary_material.image_urls` value
   (formula-sheet-style reuse) — each question must still stand alone unless the lesson
   is explicitly linked (`DESIGN-UNI-13`).
4. **Questions** (pipeline Phase 3) — the Life-Science-specific decisions:
   - **`DESIGN-LIFE-01`** (revised 2026-10-07): every typed `fitb` declares `keyboard_type` (`KEYBOARD-04`) —
     `'standard_math'` for a bare number (percentages, counts, mass, ratio splits with a literal `":"`; released, no
     gate), `'text'` for a **single canonical term** with accepted spellings listed via `|` (2.4.0 — gates the exam,
     accepted). Anything paraphrasable (explain/describe/reason) is `multiple_choice`/`multi_select`/`match`/`ordering`.
     `steps`/`equation`/`fraction` stay excluded as a *content* decision. The app's fallback (Text) is a safety net, not a
     plan — see `core/keyboard-input.md`. Never copy a P2 script as a template (they predate `KEYBOARD-04`).
   - Genotype/allele answers needing a superscript (`Xʳ`, `Iᴬ`) can't be typed on any
     keyboard — always `multiple_choice`/`multi_select` with candidate genotypes as
     options, never `fitb`.
   - **`DESIGN-UNI-13` (linked lessons)**: use where the real paper's own sub-questions
     genuinely chain (e.g. "the phase during which the process named in QUESTION
     2.1.4(a) takes place") — decide per lesson, don't default either way. A
     shared-diagram lesson with independently-answerable sub-parts stays independent.
   - Genetic crosses/pedigrees: decompose into `multiple_choice` (which gametes) +
     `fitb` numeric (final ratio, `":"`-split) — never ask the student to "draw" or
     produce the cross itself, mirroring Physics/Maths's own proof/graph decomposition.
   - Diagram-heavy sub-questions are often fully testable as a **text-described
     scenario** instead of a generated image — check whether this is sufficient before
     assuming a diagram is required; `nov_p2` shipped its first pass with zero generated
     diagrams this way, adding 7 real ones only in a later pass for the most inherently
     visual content (pedigrees, gel bands, chromosome pairing).
   - **Check the aiExplanation's own grounding**: when a lesson's fresh practice scenario
     replaces the real exam's dataset (e.g. fictional species instead of the memo's real
     hominid brain-volume figures), the `aiExplanation.sub_questions` entry must still
     describe the **real** exam sub-question and its real data — not the fictional
     practice scenario in the same lesson. Caught once as a real content bug in `nov_p2`
     (Hominid Brain Volume lesson); re-check explicitly, don't assume the two naturally
     stay in sync.
5. **Vocab dump** (pipeline Phase 3.5): `--subject life_science --out temp/curriculum-
   vocab-life-science.json` — a **subject-scoped filename**, not the shared default
   `temp/curriculum-vocab.json`. A first `nov_p2` dump attempt used the shared default and
   was silently overwritten by a concurrent session dumping a different subject before it
   was read — same collision class as the image-directory gotcha above.
6. **Upload script** (pipeline Phase 4): `subject: "life_science"` on every block.
   `aiExplanation.sub_questions` — real, populated entries grounded in the actual memo
   data for every real sub-question in the lesson (84 entries across `nov_p2`'s 15
   lessons) — check bullet counts against `AIEXP-03`/`04` (a single-bullet `approach`
   under-counts; rule requires 2–4). Validate with `--curriculum` against the
   subject-scoped snapshot — HARD STOP (`PIPE-10`) — then `--dry-run` and upsert to dev.
   **Commit** (`[Data] Add life_science <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: exam-page images
   (`question_image_urls`/`memo_image_urls`) actually extracted and wired, not skipped
   silently — `nov_p2`'s first authoring pass shipped lessons/questions only and needed a
   second pass once the user asked why images weren't showing; **run `review-paper.md`
   (Phases 1–5) against the live emulator before considering a paper done** — it found a
   real `FillInTheBlank.kt` layout defect (longer Life Science labels triggered a
   character-wrap bug that made 2 of 8 `fitb` questions completely unanswerable)
   render-only review would never have caught; the fix was moving descriptive text into
   `question` (wraps at any length) and reducing `metadata` to a minimal `"= [ ]"`
   completion.

## `subjects` row / app-side status (already resolved for `nov_p2`, re-check if stale)

`subject_id = "life_science"` (matches `SubjectMapper.kt`'s fallback — no app code
change). `life_science` has no subject keyboard of its own: on 2.4.0+ builds an undeclared typed
input falls back to Text (`steps`/`equation`: ScientificMath) — a safety net; builds before 2.4.0 give
`fitb` the decimal-only system keyboard and cannot answer `steps`/`equation`. Declare `keyboard_type`. `subjects` row already exists and is live in prod
(`is_active: true`, `min_app_version: '1.8.9'`) — don't re-create it.
