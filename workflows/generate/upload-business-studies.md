# Upload — DBE Business Studies (one lesson / real exam question)

**Profile:** `subjects/dbe-business-studies.md` · **Skeleton:** `core/upload-pipeline.md`
(`AMPM-CONTENT-PIPELINE`) · **Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`,
`AMPM-CONTENT-AI-EXP`, `presentations/{multiple-choice,multi-select,match,ordering,fitb}.md`
(Business Studies subset only — profile).

> Do NOT enter plan mode. Run once per lesson (one real exam question — Q1, Q2, Q3, Q4,
> Q5, or Q6 of a paper — never split further; the profile's paper-structure section
> explains why Section B/C don't cluster the way Life Science's Q1 did). Commit after
> Phase 4, per lesson — never batch several lessons into one commit or one uninterrupted
> run; each commit is a checkpoint the user can review before the next lesson starts.

## Phase 0 — curriculum vocabulary plan (before writing any question)

Business Studies is a brand-new subject as of 2026-09-13 — every `unit`/`topic`/
`subtopic`/`skill` it needs starts out absent. `curriculum_nodes.id` is a **global**
primary key (`business_studies` is not in `NAMESPACED_SUBJECTS` — `tools/lib/
curriculum.js` — so its slugs must be globally unique, not just unique within the
subject):

```bash
node -e "
const { getPool, closePool } = require('./tools/lib/postgres');
(async () => {
  const pool = getPool('dev');
  const { rows } = await pool.query('SELECT id, type, name, subject_id FROM curriculum_nodes ORDER BY subject_id, type, id');
  console.log(JSON.stringify(rows, null, 1));
  await closePool('dev');
})();
"
```

- **Reuse across subjects, not just within Business Studies (`PIPE-08`'s conceptual-
  equivalence check, applied at global scope).** History's `essay_argumentation` and
  `evidence_extraction` subtopics are strong matches for Business Studies' own essay-
  strategy items (`DESIGN-BUS-03`) and "quote from the scenario" items respectively —
  reuse the existing row, don't create a Business-Studies-specific duplicate with the
  same meaning.
- **Keep subtopics coarse — this subject's own shape is closer to History's than to Life
  Science's.** History uses ~4 subtopics across 24 questions (skill-shape buckets:
  `evidence_extraction`, `essay_argumentation`, `historical_terminology`,
  `source_evaluation`); Life Science uses ~1 subtopic per question (fact-dense biology).
  Business Studies' content is discursive/skill-shaped like History, not fact-dense like
  Life Science — default to a small, reused subtopic set
  (`term_definition_recall`, `scenario_application`, `classification_and_criteria`,
  `sequencing_and_process`, plus the two reused History ones above) rather than minting a
  new subtopic per question.
- **Units** = the CAPS Grade-12 annual-plan topic (profile's Curriculum-units section):
  `management_and_leadership`, `investment_securities_and_insurance`,
  `presentation_of_business_information`, `ethics_and_professionalism`,
  `creative_thinking_and_problem_solving`,
  `corporate_social_responsibility_and_human_rights`,
  `team_performance_and_conflict_management`. **Topics** = the specific concept within
  that unit a question tests (e.g. `leadership_styles`, `management_success_criteria`
  under `management_and_leadership`) — create per-question as new concepts appear, reused
  across questions on the same concept.
- Create new rows with `tools/create-curriculum-node.js` / `create-skill.js` /
  `create-tag.js` (dev only) **before** writing them into any question, then re-dump
  (Phase 3.5) before validating.

## Required inputs

Lesson name (`"Question N"` — matches the real question number, `PIPE-07`), which real
question this lesson is built from, paper, year, order. No video (`has_video: false`,
`content_tier: 'free'`, `freemium_*: null`) and, for this first pass, no exam/memo images
(`question_image_urls: []`, `memo_image_urls: []`, `supplementary_materials: []`) — image
extraction is deferred to a later pass, same as it's fine to defer for any subject's
first authoring session; note this explicitly in the lesson's Phase 5 verification rather
than silently uploading placeholders.

## Phases (deltas on the pipeline skeleton)

1. **Analyse** (pipeline Phase 1): identify the real question's sub-parts, which CAPS
   unit/topic each belongs to (profile's Curriculum-units section), and — for Section B —
   which sub-parts follow the "quote TWO from the scenario" → "explain OTHER \[X\]"
   paired shape (`DESIGN-UNI-13` linked-lesson candidate, named in the profile's paper-
   structure section). For Section C (Q5/Q6), also identify the essay's own stated bullet
   aspects (they map directly onto separately-testable CAPS sub-topics — profile's
   `DESIGN-BUS-02` essay bullet).
2. **Images**: skipped this pass (see Required inputs).
3. **Lesson document** (pipeline Phase 2): standard template, `has_video: false`. Tags
   (`PIPE-06`) name the CAPS concepts covered (e.g. `leadership_styles`,
   `insurance_principles`), never a scenario wrapper.
4. **Questions** (pipeline Phase 3) — the Business-Studies-specific decisions:
   - **`DESIGN-BUS-01`**: default numeric-literacy content to `multiple_choice`, matching
     the real paper's own evidenced shape. Never author a `fitb` blank that needs a
     letter — this subject's `None`-routed keyboard only reliably types digits.
   - **`DESIGN-BUS-02`**: every discursive/indirect-question concept decomposes into
     `multiple_choice`/`multi_select`/`match`/`ordering` against the *marking
     guideline's own listed points* — never a `fitb` open-recall blank for a term, name,
     or phrase. There is no canonical phrasing to match against (the memo explicitly
     accepts alternate wording), so a typed free-text answer is unauthorable, not just
     undesirable.
   - **Quote-from-scenario pairs**: model the "quote" sub-part as `multiple_choice`/
     `multi_select` over items drawn from (and distractors adjacent to) a fresh scenario
     — reuse the `evidence_extraction` subtopic. The following "explain OTHER" sub-part
     must have a correct-option set that excludes whatever the quote sub-part's answer
     already named (`DESIGN-UNI-13`) — check this explicitly before finalizing the pair,
     it's easy to accidentally let the two overlap.
   - **`match`**: cap at 4 pairs (8 metadata elements) per question — `presentations/
     match.md`'s own comfortable-render limit — even where the real sub-question groups
     more than 4 terms; split across two `match` questions instead of exceeding it.
   - **`ordering`**: use where a real sub-part is genuinely sequential (problem-solving
     steps, a process) — not as a generic substitute for `multi_select`.
   - **`DESIGN-BUS-03`** (Q5/Q6 essay lessons only): one lesson per essay question. Mix
     content items on the essay's own bullet aspects (`DESIGN-BUS-02`) with LASO-rubric
     strategy items grounded in the real memo's §15.1–15.6 breakdown — an `ordering` item
     sequencing Introduction → each aspect → Conclusion; `multiple_choice`/`multi_select`
     items judging Layout/Analysis/Synthesis/Originality compliance (profile has worked
     examples). Reuse the `essay_argumentation` subtopic. Never quote the memo's actual
     model-answer prose — paraphrase the rubric mechanics, which are fixed and citable.
   - **Check the running MC index-0 tally *before* finalizing this lesson's question set,
     not after uploading** (`DESIGN-UNI-06`/`SCHEMA-TYPE-06`) — this is the mistake that
     cost Life Science a review-and-refix pass; count how many `multiple_choice`
     questions across *all lessons uploaded so far this paper* have their correct option
     at `metadata[0]`, and place this lesson's own correct answers accordingly so the
     cumulative paper-level rate stays under ~10%. Query it directly rather than
     estimating:
     ```bash
     node -e "
     const { getPool, closePool } = require('./tools/lib/postgres');
     (async () => {
       const pool = getPool('dev');
       const { rows } = await pool.query(\`
         SELECT count(*) FILTER (WHERE metadata->>0 = answer->>0) AS at_index_0, count(*) AS total
         FROM questions q JOIN lessons l ON q.lesson_id = l.id
         WHERE l.subject_id = 'business_studies' AND l.paper_id = 'nov_p2' AND l.year_id = '2025'
           AND q.presentation_id = 'multiple_choice'
       \`);
       console.log(rows[0]);
       await closePool('dev');
     })();
     "
     ```
5. **Vocab dump** (pipeline Phase 3.5): `--subject business_studies` (Auth Proxy
   running). Re-run after any Phase 0 addition mid-lesson.
6. **Upload script** (pipeline Phase 4): copy `tools/upload-script-template.js` (or an
   existing Business Studies lesson script as a structural starting point) to
   `scripts/add-business-studies-<year>-<paper>-q<N>.js`; `subject: "business_studies"`
   on every block. `aiExplanation`: one entry per real exam sub-question for Q1-Q4 where
   the practice set maps cleanly to numbered sub-parts; for Q5/Q6 essay lessons, **one**
   guidance entry (`marks: 40`, `number` = the question number as a string) summarising
   the memo's aspect breakdown + LASO rubric, matching `dbe-history.md`'s Section B
   convention exactly (no free-text model essay). Validate with `--curriculum` — HARD
   STOP (`PIPE-10`) — then `--dry-run`, inspect, then upsert to dev. **Commit**
   (`[Data] Add business_studies <year> <paper> Q<N> lesson and questions`).
7. **Verify** (pipeline Phase 5 checklist), plus: no `fitb` blank requires a letter
   (`DESIGN-BUS-01`); every discursive concept is answered via closed-form presentation,
   not open recall (`DESIGN-BUS-02`); every quote-from-scenario / explain-other pair
   actually excludes overlap; `match` questions ≤4 pairs; Q5/Q6 lessons carry no verbatim
   memo prose; the MC index-0 tally re-checked against the live DB (query above) is still
   under ~10% cumulative across every Business Studies lesson uploaded so far, not just
   this one.

## Why this doc exists now, not from the start

Written 2026-09-13, mid-session, after the user pointed out its absence and asked for it
before any further lessons upload — the same day Life Science's own lack of an
equivalent doc contributed to problems the user flagged from a prior session. Business
Studies genuinely has enough subject-specific deltas (three `DESIGN-BUS-*` rules, a
paired-question linked-lesson pattern, a documented essay rubric, a global-namespace
curriculum-vocabulary strategy) to justify one, unlike a subject that could get away with
the bare `core/upload-pipeline.md` skeleton. Lesson Q1 was authored, validated, and
uploaded to dev *before* this doc existed (`scripts/add-business-studies-2025-nov-p2-
q1.js`, committed) — it has a known MC index-0 overage (2 of that lesson's own
`multiple_choice` questions landed at index 0) caught mid-fix when this session paused to
write this doc instead. Re-check and fix Q1 against this doc's own Phase 4 checklist
before authoring Q2, rather than letting the overage compound into later lessons.
