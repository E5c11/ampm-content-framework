# Upload — DBE History (one lesson / real exam question)

**Profile:** `subjects/dbe-history.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{multiple-choice,multi-select,match,ordering,
fitb}.md` (History subset only — profile).

> Do NOT enter plan mode. Run once per lesson (one real exam question — Q1–Q3 Section A
> source-based, Q4–Q6 Section B essay). Commit after Phase 4, per lesson.

Written retroactively, 2026-09-13, after `nov_p2` (Section A + Section B, 6 lessons) was
already fully authored, validated, and reviewed without one — same gap this session
caught in Business Studies before any lessons shipped. Recorded here so this pattern is
followed deliberately on the next History paper.

## Required inputs

Lesson name (`"Question N"`), which real exam question this lesson is built from, paper,
year, order, the paper + marking-guideline PDFs. **Source the marking guideline, not just
the question paper, before writing `aiExplanation`** — `nov_p2`'s memo was sourced
mid-session and several official answers differed from what a close reading of the
sources alone would produce (a quote's accepted sentence wasn't the first plausible one
in the same source; an "oral testimonies" reference resolved to a different person's
testimony than the obvious one; an accepted reasoning point required a demographic angle
no close-reading would surface). Treat the memo as required before Phase 3, not
optional supporting material.

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): Section A (Q1–Q3) is source-based — identify each
   sub-question's skill (quote/identify evidence, define a term in context, explain an
   inference, comment on source reliability/limitations/usefulness, explain symbolism,
   compare sources for corroboration) and its real mark. Section B (Q4–Q6) is one essay
   prompt each, no source material — plan straight into `DESIGN-HIST-02` (below), one
   lesson per prompt. **Full paper is 300 marks of question bank for a 150-mark sitting**
   (a candidate answers a subset) — author all six real questions regardless; don't
   assume only the exam-day subset needs content.
2. **Images**: Section A's sources render as extracted exam-page images per lesson.
   Section B's three essay prompts (Q4/Q5/Q6) commonly share **one** exam page (all three
   prompts printed together) — upload once, reuse the URL across all three lessons, same
   pattern as a shared formula sheet; each still gets its own memo-page extract.
3. **Lesson document** (pipeline Phase 2): standard template, `has_video: false` (no
   video source exists for History; `ExamPaperScreen`/`WatchNavigation.kt` already route
   any `has_video: false` lesson through the generic no-video screen — no app change
   needed for routing).
4. **Questions** (pipeline Phase 3) — the History-specific decisions:
   - **`DESIGN-HIST-03`** (keyboard, app-limitation-driven, `enforced_by: human-review`):
     History has no `KeyboardResolver.kt` route (`None`), and `FillInTheBlank.kt` never
     threads a text-capable `keyboardType` through — **no `fitb` blank may require a
     letter.** Reserve `fitb` for genuinely numeric/date answers (a year, a count, a
     percentage). Any name/term/quoted-phrase/place answer — most of this paper's natural
     short-answer shape — goes to `multiple_choice`/`multi_select`/`match` instead.
   - Section A's final sub-question in each real question (e.g. 1.6/2.6/3.6, "write a
     paragraph using the sources and your own knowledge") is a synthesis mini-essay, not
     a short-answer item — same no-free-text problem as Section B, resolved the same way:
     decompose into an objective item testing the same synthesis skill (`multi_select`:
     which claims the sources actually support; `ordering`: sequence the argument's
     causal structure) — never a written paragraph.
   - **`DESIGN-HIST-02`** (Section B essay lessons, Q4–Q6): no free-text essay input
     exists anywhere in the app. Each lesson's practice set mixes fresh content-knowledge
     items (real historical facts about the period — freely reworkable, general
     knowledge, not exam-owned source material) with essay-strategy items (thesis
     identification: which option is the strongest thesis statement; PEEL
     paragraph-structure sequencing via `ordering`) grounded in the real memo's own
     synopsis/main-aspects framing — never ask the student to produce the essay itself.
   - `aiExplanation.sub_questions` carries **one** guidance entry per Section B lesson
     (`marks` = the question's real total, synopsis/main-aspects/rubric summarised as
     approach guidance, not a model essay) rather than per-sub-question entries, since
     the real exam has no numbered sub-parts there.
   - **Check the running MC index-0 tally across the whole paper before finalizing a
     lesson**, not after uploading (`DESIGN-UNI-06`) — `nov_p2` needed a deliberate
     correction pass (placing 2 of 13 new Section B `multiple_choice` questions at index
     0) after Section A alone landed at a flat 0%; check the live cumulative count
     (`SELECT ... FROM questions q JOIN lessons l ...` filtered to
     `subject_id = 'history'`) rather than eyeballing a single lesson's own set.
5. **Vocab dump** (pipeline Phase 3.5): `--subject history`.
6. **Upload script** (pipeline Phase 4): `subject: "history"` on every block. Validate
   with `--curriculum` — HARD STOP (`PIPE-10`) — then `--dry-run` and upsert to dev.
   **Commit** (`[Data] Add history <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist, run via `review-paper.md` against the live
   emulator, not render-only screenshots), plus: no `fitb` blank requires a letter
   (`DESIGN-HIST-03`); every Section B lesson's `aiExplanation` is a single guidance entry
   with the question's real total marks; MC index-0 tally re-checked live against the
   whole paper, not just this lesson's own set; long-text `ordering`/`multi_select`
   options (PEEL-paragraph sentences, thesis-statement options) render without clipping —
   `nov_p2`'s Section B review passed clean on this the first time, but it's exactly the
   kind of thing render-only review misses if skipped.

## `subjects` row / app-side status (already resolved for `nov_p2`, re-check if stale)

`subject_id = "history"` (matches `SubjectMapper.kt`'s fallback — no app code change).
`history` has no `KeyboardResolver.kt` route (`None`) — load-bearing per `DESIGN-HIST-03`
above (numeric-only `fitb`), but not blocking (no `steps`/`equation` content in this
subject at all). `subjects` row already exists (`color: "#B8860B"`, `icon: "landmark"`,
`min_app_version: null` — falls back to `is_active`) — don't re-create it.
