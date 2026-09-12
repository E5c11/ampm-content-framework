# Review Uploaded Paper — Claude Code Session Runner

> **Runs from the AMPM repo root.** The capture harness and its scripts
> (`scripts/review-build-manifest.js`, `scripts/review-capture.js`,
> `scripts/patch-question.js`) live in `AMPM/scripts/` and drive the emulator / the app.
> Presentation contracts for the review criteria: this repo's `presentations/{type}.md`.

## Status — harness fully repointed

All three scripts are done, dev-verified, and (render-only) run clean end-to-end.

- `scripts/review-build-manifest.js` / `scripts/patch-question.js` — repointed to Cloud SQL
  (2026-09-03). See their headers in `AMPM/scripts/`.
- `scripts/review-capture.js` — rewired 2026-09-03 to navigate by `testTag`/`resource-id`
  (`AMPM` commit `06685d9b7` shipped the tags) instead of coordinate swipes + `content-desc`
  string matching. **It uses exactly 3 tags, all from `AMPM/wiki/lesson/questions-pane.md`
  § Automation selectors** — `lesson_questions_pane` (pager root — gates readiness),
  `question_maths_tools_fab` (opens the per-question supplementary/maths-tools sheet),
  `question_next_button` (`PagerDotNavRow`'s within-video next button, advances). Grep the
  script for `^const TAG_` to get the exact current list rather than trusting this prose if
  it drifts. **Verified live** against a real emulator with real dev content (maths 2019
  nov_p1, then the physics 2025 nov_p1 paper, 2026-09-10): `lesson_questions_pane` correctly
  gates readiness, `question_next_button` correctly advances — confirmed by the captured
  screenshots showing genuinely different questions per step, matching the manifest.
  `AMPM/wiki/lesson/presentation/{type}.md` (per-presentation-type input/interaction
  selectors) is **not used by this script** — those tags exist for a future
  render+answer-feedback pass that actually fills in and submits answers; this capture is
  render-only (see below) and never needs them.

This capture is **render-only** (screenshots + the supplementary sheet) — it doesn't submit
answers. The per-presentation-type input tags exist for a future render+answer-feedback pass
if you want it; not wired in here.

**Phase 5 (Verify Answerability) is IN PROGRESS**, built and first-used 2026-09-12
(see that phase below for the why and the full detail). `scripts/review-capture-answers.js`
exists and covers `fitb`; `equation`/`steps` still need a `MathInputState`-aware typing
path (fraction mode etc.), not yet built — those two presentation types still only get
the Phase 1–4 data/render checks for now. **Two hard-won prerequisites before trusting a
Phase 5 run**, both detailed in Phase 5 below, not repeated here: (1) warm the app's
local cache via normal navigation first, or an unrelated app bug makes the wrong
(system) keyboard appear and produces a false defect; (2) the submit selector depends on
which keyboard is actually showing — checking only for `question_submit_button` silently
misses the custom-keyboard case entirely. Full submission-mechanism reference now lives
in `AMPM/wiki/lesson/systems/keyboard-system.md`'s "Submitting an answer" section —
that's the source of truth for both selectors and keyboard-resolution rules; this doc
only points to it, so the two docs can't drift apart on the same facts.

**Setup:** `AMPM/.env` needs a `PG_*_DEV` block (`AMPM/.env.example`) for Phases 1 & 4 — same
Auth Proxy convention as this repo's tooling. Password:
`gcloud secrets versions access latest --secret=AMPM_DB_PASSWORD --project=ampm-b9661`.

---

## Overview

Repeatable process for reviewing an already-uploaded paper in a Claude Code CLI session
with a running Android emulator. Run once per paper (or re-run per lesson).

The run, end to end:

1. **Fetch** the paper's lessons + questions into a local manifest; sanity-check counts.
2. **Capture** — navigate the app to *every* question and screenshot it (initial + scrolled
   + any supplementary sheet). All questions, not just suspect ones — render and crop checks
   need a screenshot of each.
3. **Review** — for each question, read the data *and its screenshot together*; classify
   **PASS** / **AUTO_FIX** / **FLAG**.
4. **Act** — AUTO_FIX → patch it in **dev** now (confident fixes only). FLAG → into the
   report, untouched. PASS → logged.
5. **Verify Answerability** (typed-answer presentations only — `fitb`/`equation`/`steps`;
   **not yet built**, see Status) — actually type each stored `answer` through the app's
   real keyboard and confirm it validates. Distinct risk from Phases 2–4: a question can
   render perfectly and hold a correct `answer` string and still be unanswerable if the
   keyboard available for that subject/presentation has no way to produce it.
6. **Report + hand off** — counts, the auto-fix table, every flagged item with reason +
   screenshot path (Phases 2–4), plus the answerability results once Phase 5 exists. The
   human resolves flagged items. **Prod is never touched in this run.**

---

## Required Inputs

| Input | Value |
|-------|-------|
| Subject | `math_lit` \| `maths` \| `english_hl` \| `geography` \| `physics` — this list is illustrative, not enforced by the script (`review-build-manifest.js` takes the subject as a plain positional arg, no allowlist); any `subject_id` with rows in `lessons` works. Update this row when a new subject's first paper is authored, so it doesn't read as unsupported. |
| Syllabus | e.g. `dbe` |
| Year | e.g. `2021` |
| Paper | e.g. `nov_p1` |
| Environment | **dev Cloud SQL** (always review dev first) — `ampm-b9661:us-central1:ampm-backend` |
| Cloud SQL Auth Proxy | running: `cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432` |
| Emulator | Running and unlocked (`adb devices` shows one device), dev app installed (`com.esma.ampm.dev`) |

---

## Phase 1 — Fetch Paper Data

```bash
node scripts/review-build-manifest.js <subject> <syllabus> <year> <paper>
# → temp/review/<paper>_<year>/manifest.json
```

Manifest shape: `{ subject, syllabus, year, paper, paperId, lessons: [{ videoId (lesson
UUID), order, name, questions: [{ id (UUID), order, name, question, textSnippet, contextText,
presentation, type, metadata, answer, clues, difficulty, examWeight, unit, topic, subtopic
(resolved curriculum **names**, not ids), supplementaryLabel, supplementaryType,
supplementaryImageUrls }] }] }`. Carries everything Phase 3 needs — no second query.

> Verify the lesson count and per-lesson question counts look plausible before proceeding.
> `metadata` comes back as a Postgres array — `[]` for `fraction`/`equation`, never null.

---

## Phase 2 — Capture Screenshots

```bash
node scripts/review-capture.js temp/review/<paper>_<year>/manifest.json [--lessons 1,2,3]
```

Per lesson it deep-links to each lesson (`/video/<videoId>?subject=&syllabus=`), then per
question saves under `temp/review/<paper>_<year>/screenshots/lesson_<order>/`:

- `q<n>.png` — initial view
- `q<n>_scroll.png` — after scrolling to reveal all options
- `q<n>_diagram.png` — supplementary-material sheet, if the question has one

> If a screenshot is black or shows the wrong screen, re-run the capture for that lesson
> (`--lessons <order>`). The emulator must be unlocked and the app not in a broken state.
> Navigation selectors actually in use: `AMPM/wiki/lesson/questions-pane.md` § Automation
> selectors (see Status above for the exact 3 tags). `AMPM/wiki/lesson/presentation/
> {type}.md`'s selectors are not wired into `review-capture.js` — not a gap to fix, just
> not needed by a render-only capture.

---

## Phase 3 — Review Each Question

Read each question's data alongside its screenshot; classify PASS / AUTO_FIX / FLAG.

### Logic checks (data only)

- [ ] **Answer correctness:** work the question independently; does `answer` hold the
      correct value for this stimulus?
- [ ] **Correct-answer placement:** `multiple_choice` correct answer never at `metadata`
      index 0 (`SCHEMA-TYPE-06`); every `answer` value appears verbatim in `metadata`
      (`SCHEMA-TYPE-02`).
- [ ] **Array contracts** hold for the type (`SCHEMA-ARR-01..06`, `core/question-schema.md`).
- [ ] **Context-text sufficiency** (English): answerable from `context_text` (+ shared
      stimulus) alone — no external knowledge.
- [ ] **Distractors plausible** — a matric student should have to think.
- [ ] **Instruction format matches section** (English): Q1/Q5 quote the inline stimulus
      (never "the passage"/line numbers); Q2–Q4 fresh stimulus in `context_text`; Paper 2
      answerable from the prescribed-text context; Paper 3 about text-type conventions.
- [ ] **DBE Grade 12 level:** cognitive demand matches `difficulty` (`SCHEMA-CAL-03`).
- [ ] **`fitb` answer coverage:** `|`-separated alternatives where multiple phrasings valid.
- [ ] **Curriculum resolves:** manifest `unit`/`topic`/`subtopic` are real names, not null,
      for any subject that has a curriculum (the upload FK preflight guarantees the FK is
      valid — a null here means the question genuinely has no unit/topic/subtopic set).

### Render checks (screenshot + data)

- [ ] **Math renders — reads like a textbook/exam, not raw markup:** no `\frac`/`\sqrt`
      visible as literal text, AND no `Variable_subscript` underscore notation visible as
      literal text (`F_net`, `p_i` — `MATHTEXT-06`). The bar is "would a matric student
      reading this recognize normal textbook notation," not "did the validator pass."
      Missed entirely in the 2026-09-10 physics review (all instances marked PASS,
      rationalized as "expected/current behavior" since `core/mathtext.md`'s scope hadn't
      been extended to physics yet at review time) — caught only by the user reading a
      live screenshot. An underscore rendering literally is always a defect, never
      "expected," regardless of what any doc's scope currently says.
- [ ] **Text readable:** no overflow or clipping.
- [ ] **Presentation matches UI:** per `presentations/{type}.md` renderer contract — chips
      for `multiple_choice`, input for `fitb`, num/denom for `fraction`, draggable items for
      `ordering`, columns for `match`, equation field for `equation`, step inputs for `steps`.
- [ ] **`steps` completability** (missed entirely in the 2026-09-10 physics review — 5
      questions all marked PASS despite being unanswerable): re-deriving the stored
      `answer` independently is not enough. Look at the *given* rows only (everything in
      `metadata` that isn't `"[ ]"`) and ask: with just those + the question text, does a
      student have exactly one defensible thing to type per blank? Consecutive blanks
      with no given row between/after them, or an expected answer that's a full sentence
      rather than a short value, is a FLAG/AUTO_FIX-worthy defect, not a pass — see
      `presentations/steps.md`'s pitfalls section for the corrected pattern.
- [ ] **`steps` numbering reads as one coherent line per real step** (a second, separate
      defect from completability above, caught the same day *after* a completability fix
      had already landed and been re-verified live — passing one check doesn't mean the
      other passed). Every `metadata` row, given or blank, gets its own numbered "Step N"
      with no merging. Read the numbered rows top to bottom as a student would: does each
      number correspond to one real unit of working? A label row immediately followed by
      a blank immediately followed by a unit row — e.g. "Step 3: r =", "Step 4: [blank]",
      "Step 5: Ω" — is three fake steps for one real line ("r = ___ Ω") and is a defect,
      not a pass, even though the blank itself is perfectly typeable and correctly graded.
- [ ] **`context_text` visible** above the question when non-null.
- [ ] **Images resolve** — `https://media-dev.askmoreprepmore.app/...` renders, not a broken
      placeholder.

### Image-crop checks (screenshot only)

- [ ] Supplementary images not cut off at top/bottom.
- [ ] Not over-cropped (e.g. section heading lost).
- [ ] Legible at screen size — flag blurry/small images.

---

## Phase 4 — Classify and Act

| Classification | Condition | Action |
|---|---|---|
| **PASS** | All checks pass | Log as reviewed |
| **AUTO_FIX** | Clear, unambiguous error, known correct value | Patch in **dev** via `patch-question.js` |
| **FLAG** | Ambiguous / needs human judgement | Report with reason + screenshot; **do not touch** |

**Safe AUTO_FIX:** wrong `answer` value (confident), correct answer at index 0 (rotate),
missing `|` alternative, obvious `context_text` typo, a `question`/`clues` rendering
defect with a clear content-level fix (e.g. rephrasing to avoid a markup pattern the
renderer misinterprets — see the chemistry nov_p2 review, 2026-09-12: `E°(Ag⁺/Ag)`, a
standalone slash-pair alone in its own parens right after `E°`, rendered as a stacked
math fraction instead of plain text; fixed by rephrasing to "The Ag⁺/Ag half-cell has
E° = ... V" so the pair is never isolated in its own parens).

**After patching a question that was already viewed once in this app-data lifetime,
`am force-stop` is NOT enough to see the fix** — the app caches lesson/question content
locally and re-navigating to an already-visited lesson shows the stale pre-patch text,
even after force-stopping. Confirmed live 2026-09-12: two different patches to the same
question both appeared to "not work" on re-capture, purely because the screenshot was
of cached content, not the new dev-DB value. Fix: `adb shell pm clear
com.esma.ampm.dev` (full app-data wipe) before re-running `review-capture.js` on a
lesson you just patched — this forces a real refetch. Cheap to do unconditionally
after any AUTO_FIX, before trusting a re-capture as verification.

**Always FLAG:** answer arguable / interpretation-dependent, uncertain curriculum
alignment, crop uncertain without the source PDF, equation itself possibly wrong.

```bash
# Targets dev Cloud SQL `questions`; dev-only by construction (no --env flag, no prod path).
# Whitelisted fields: answer, metadata, context_text, question, clues, difficulty,
# exam_weight, unit, topic, subtopic (patch the *_id FK columns — Postgres rejects an id
# that isn't a real curriculum_nodes row), skills (replaces the question_skills junction,
# not a column — pass the full new skill-id list, not a diff).
node scripts/patch-question.js \
  --id <question_uuid> \
  --field answer \
  --value '["correct answer", "", "", "", ""]' \
  --confirm        # omit for a dry run (prints old → new, writes nothing)
```

---

## Phase 5 — Verify Answerability (typed-answer types only) — IN PROGRESS

**Why this exists, separately from Phases 2–4:** every review so far (maths, physics,
chemistry) has checked that a stored `answer` is *correct* and that the question
*renders* cleanly, but never that a student can actually *produce* that answer on the
keyboard the app gives them for that subject. `DESIGN-CHEM-01`/`KEYBOARD-01`/`-02`-style
rules are supposed to guarantee this at authoring time, but authoring-time intent isn't
the same as a confirmed observation — the same gap class as the render bugs Phase 3 was
extended to catch after they shipped unnoticed. Scope this to **`fitb`, `equation`,
`steps` only** — the only presentations with a typed input at all; `multiple_choice`/
`multi_select`/`match`/`ordering` are selection-based and already fully covered by
Phase 3's data-level checks (answer verbatim in `metadata`, no keyboard involved).

**Not folded into Phase 2's capture**: rendering and answerability are different failure
surfaces (a broken render vs. a missing keyboard key vs. an app-side validation bug),
and conflating them would muddy PASS/FLAG classification. Keep this as its own capture +
review + act pass over the same manifest, run after Phase 4 so any AUTO_FIX from the
render pass is already live.

**⚠ Prerequisite, found the hard way 2026-09-12 — warm the app's local cache via normal
navigation before running this phase, every time.** Phase 5 deep-links straight to a
question the same way Phase 2 does. If that lesson's video row isn't already cached
locally (a freshly-cleared app, or any lesson never opened this app-data lifetime), an
unrelated app bug (`LoadQuestionsWithContextUseCase.loadVideoContext()` — Room-only, no
fallback fetch, falls back to `VideoContext.UNKNOWN` on a miss) makes the **system**
keyboard appear instead of the subject's real custom keyboard — indistinguishable from a
genuine missing-key content defect unless you know to check for it. Real users hit this
same bug only via direct `/video/{id}` deep links (shared links, `RemoteTriggered`
notifications) — not the everyday Home → Subject → Lesson path, since the Library screen
(`ObserveVideoLibraryUseCase`) always warms the whole subject's cache first. **Fix for
this phase: before running it, navigate through the app normally into that subject's
Library/Courses screen once** (real taps or an equivalent driven flow — a raw deep link
does not count, that's the exact path that doesn't warm the cache) **so every lesson's
video row is cached, then Phase 5's deep-links land on an already-warm cache** and
reflect the real per-subject keyboard, not this unrelated bug. (The app bug itself is
tracked separately — accepted risk for now, scheduled before the next release; not a
Phase 5 problem to route around every time once it's fixed.)

**Built:** `scripts/review-capture-answers.js` (`fitb` only so far — `equation`/`steps`
need `MathInputState`-aware typing, e.g. fraction-mode entry, not just key-by-key text;
not yet extended). For each `fitb` question:

1. Navigates to it (reuse Phase 2's deep-link) — after the cache-warming prerequisite
   above.
2. Taps the input (`question_fitb_input_$index`, `presentations/fitb.md`), which
   triggers the subject's actual keyboard (custom or system, per
   `wiki/lesson/systems/keyboard-system.md`'s resolution rules).
3. Types the stored `answer` (first `|`-alternative only, for now) key-by-key via
   `maths_key_$label` taps — never `adb shell input text`, which bypasses the in-app
   keyboard entirely and would validate nothing about what a student can actually press.
4. Submits — **the correct selector depends on which keyboard is active; see
   `wiki/lesson/systems/keyboard-system.md`'s "Submitting an answer" section for the
   full matrix, not repeated here.** In short: custom keyboard →
   `content-desc="Submit answer"` on the keyboard's own Done key; system keyboard →
   `testTag("question_submit_button")`. Getting this wrong looks exactly like
   `NO_SUBMIT_BUTTON` even when typing worked perfectly — cost real time before being
   traced to the wrong selector for the keyboard mode actually in play, not a real defect.
5. Reads `question_feedback_correct`/`_incorrect`/`_partial`/`_revealed` and screenshots
   the result.

**Review criteria:**

- [ ] Every character in `answer` (and each `|`-alternative) has a key on the keyboard
      actually presented — a missing key is a hard FLAG, not an AUTO_FIX (it's a content
      design error: this answer should never have been authored as typeable for this
      keyboard, per the subject's `KEYBOARD-*` rules — fix is to change presentation
      type, not the answer string).
- [ ] Typing the exact stored `answer` and submitting shows the correct-answer state.
      A stored-correct `answer` that the app marks wrong is **always FLAG** — likely an
      app-side validation bug (normalization mismatch, etc.), never something
      `patch-question.js` should paper over by changing the answer to whatever the app
      happens to accept.
- [ ] For `fitb`/`steps` numeric answers: does the app's numeric normalization
      (`"540"` == `"540.00"`, `,`→`.`) actually cover the format this paper's answers are
      stored in (DBE papers use `,` as decimal separator throughout)?

**Act:** AUTO_FIX space here is much smaller than Phases 2–4 — most findings will be
FLAG (either a design error needing a presentation-type change, which is a bigger edit
than `patch-question.js`'s whitelist covers, or a suspected app bug). Only patch
directly when the fix is obviously answer-string-level (e.g. an untried `|` alternative
for an equivalent valid phrasing).

---

## Phase 6 — Write Report + Hand Off

`temp/review/<paper>_<year>/report.md`: summary counts (reviewed / passed / auto-fixed /
flagged) for Phases 2–4, a separate answerability summary for Phase 5 once it exists,
the auto-fix table (lesson, Q#, field, old → new), and every flagged item with its
reason, screenshot path, and suggested action.

> Give the report to the user. The human resolves flagged items. **Prod is a separate,
> later, human-gated step** — never updated as part of this run.

---

## Checklist

- [ ] Cloud SQL Auth Proxy up; `adb devices` shows one running emulator
- [ ] All lessons present in the manifest; counts plausible
- [ ] Screenshot captured for every question (no black frames)
- [ ] Every question reviewed against all logic, render, and crop criteria
- [ ] Auto-fixes applied to **dev only**, confident cases only
- [ ] `pm clear com.esma.ampm.dev` before re-capturing any lesson you just patched
- [ ] Answerability verified for every `fitb`/`equation`/`steps` question (Phase 5, once
      built) — until then, note in the report that this paper's typed-answer questions
      have not had keyboard-level verification
- [ ] Report written; flagged items handed to the human before any prod update
