# Upload — DBE Afrikaans FAL (one lesson)

**Profile:** `subjects/dbe-afrikaans-fal.md` · **Shared rules:** `shared/language-subjects.md`
(`AMPM-CONTENT-LANG`), `shared/setwork.md` (`AMPM-CONTENT-SETWORK`, Paper 2) · **Sibling:** `workflows/generate/upload-english-fal.md`
(same sequencing — this doc holds only the Afrikaans deltas) · **Skeleton:** `core/upload-pipeline.md` (`AMPM-CONTENT-PIPELINE`) ·
**Rules:** `AMPM-CONTENT-SCHEMA`, `AMPM-CONTENT-DESIGN`, `AMPM-CONTENT-AI-EXP`, `core/keyboard-input.md`, `core/app-feature-versions.md`,
`presentations/{type}.md` per type used (mc, multi-select, fitb, ordering, match).

> Do NOT enter plan mode. Run once per lesson (one exam question or sub-section; for Paper 2 one extract of a pair, one story or one poem).
> Commit after Phase 4. **Dev only.** Every Afrikaans FAL exam derives 2.4.1 and the subject row is gated at 2.4.1 (`VER-10`); never push to
> prod until backend V83/V84 are on prod, the prod `subjects` row exists with `accents_af` + `setwork`, and the owner agrees (`SETWORK-GATE-01`).
> **Nothing has been authored yet — the first lesson is a pilot:** after it, correct this doc.

## Phase -1 — Preconditions (once per session)

1. Proxy running (`cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432`).
2. The `afrikaans_fal` `subjects` row on dev has `capabilities ⊇ {accents_af, setwork}` and `min_app_version = 2.4.1`:
   `psql -c "SELECT id, capabilities, min_app_version FROM subjects WHERE id='afrikaans_fal'"`. Set 2026-10-17. If wrong, **stop and hand it
   to the owner** (reference-data write). `accents_af` is what shows the accent row — without it a typed `ê` is unanswerable.
3. Curriculum: seed file `tools/seeds/afrikaans-fal-curriculum.json` **does not exist yet** — the first session creates it from the unit table in the
   profile (model: `tools/seeds/english-fal-curriculum.json`; unit ids `afrikaans_fal_<unit>`), then
   `node tools/seed-curriculum.js --file tools/seeds/afrikaans-fal-curriculum.json --apply`. Dump for the validator:
   `node tools/dump-curriculum-vocabulary.js --subject afrikaans_fal --out temp/curriculum-vocab-afrikaans-fal.json`. Skill ids are global —
   prefix them `afrikaans_fal_`. Reuse before create (`LANG-CUR-01`).
4. Devices: Afrikaans, English FAL and English HL setwork picks share the `{year}_{paper}_{section}` key (BLA-62) — reset picks when switching subjects.

## Phase 0 (Paper 2 only) — texts

Rules: `SETWORK-TXT-01`–`04`, `SETWORK-SEC-01`. **Scope: all texts are covered** (owner, 2026-10-17, `SETWORK-LES-02`).

```bash
node tools/create-english-text.js --list                      # registry — reuse before create
node tools/create-english-text.js --id kringe_in_n_bos --name "Kringe in 'n Bos" --author "Dalene Matthee" --section novel
```

- **Known gap:** the tool has no `--subject` option, yet `english_texts.subject_id` is populated (`english_hl`, `english_fal`). Before the first
  Afrikaans text, find out how the others were set or extend the tool; the Afrikaans rows should carry `subject_id = 'afrikaans_fal'`. Verify with
  `SELECT id, subject_id FROM english_texts`.
- Only titles printed in a supplied paper/memo may be added (`SETWORK-TXT-03`); put the source paper in the commit message. The Nov 2025 P2 set:
  novels *Kringe in 'n Bos*, *Die Ongelooflike Avonture van Hanna Hoekom*, *Meeulanders*, *Lien se Lankstaanskoene*; plays (`--section play`)
  *Poppie – Die Drama*, *Paljas*, *Fiela se Kind – Die Drama*; stories "Kom ons stuur vir Tasu", "Opdrag"; poems "Krisis", "Ken jy die see …".
  Authors as printed. Ids are snake_case of the title with ASCII only (`kringe_in_n_bos`, `ken_jy_die_see`).
- `--section`: `novel`, `play` (never `drama`), `poetry`, `short_stories` (refused on prod until 2.4.1 is released).

## Required inputs

Lesson name (Afrikaans, as the paper prints it), exam question number (P2: question + part), paper, year, order, `text_key` (P2), paper + memo PDFs,
text/extract labels and pages, question pages, memo pages, YouTube ID (usually null). Source status is in the profile.

## Phases (deltas on the pipeline skeleton)

1. **Analyse** — per paper:
   - **P1** (proposed 7 lessons): Q1 Teks A, Q1 Teks B, Q2 Opsomming, Q3 Advertensie, Q4 Strokiesprent, **Q5.1 Artikel, Q5.2 Prent**. Mark each
     sub-question text-extractable or visual-dependent (`LANG-EX-03`) and record the skipped ones. 3–4 practice questions per lesson, 5 only if a concept
     would go uncovered (2026-10-14 rule); Q5 items are mostly one-word skills — cover the **skills** (plural, verkleining, trappe, samestelling, voorsetsel,
     lettergrepe, afkorting, intensiewe vorm, homoniem …) across the lesson, not each item.
   - **P2** (18 lessons/year): per extract (`Teks A/B` of each of Q1–Q7), per story (8.1, 8.2), per poem (9.1, 9.2). Note the 1.1 "voltooi die paragraaf"
     fill-in, device items and the short substantiated opinion. The memo marks only substantiation, never JA/NEE or WAAR/ONWAAR.
   - **P3** (8 lessons): Q1 Opstel; one lesson per Q2 type (2.1–2.4) and Q3 type (3.1–3.3), named as the paper names them (`LANG-WR-01`).
2. **Images** — `LANG-IMG-01`/`02`, `SETWORK-IMG-01`. Labels `Teks A` … (continuous across P2: `Teks A`–`Teks N` for Q1–Q7, then stories and poems); poems `"Poem"`.
   Essay and P3 lessons: `supplementary_materials: null`. Rename annexure files uniquely per label. **Check every crop for PDF-extraction damage and stray
   margin line numbers; crops stop above `EN` dividers and `TOTAAL AFDELING` lines.**
3. **Lesson document** — `has_video: false` (`LANG-LES-01`); `text_key` on every P2 lesson, null on P1/P3. Name format: `"Vraag 3: Advertensie"`,
   `"Vraag 5.1: Artikel"`, `"Vraag 1.1: Kringe in 'n Bos"`, `"Vraag 2.2: Dekbrief"`.
4. **Questions** — `type` definition/application; presentations mc, multi-select, fitb, ordering, match; fresh content (`DESIGN-UNI-01`), exam-mirrored
   (`LANG-EX-01`/`02`); `context_text` per `LANG-CTX-01`, **in Afrikaans**. Every `fitb` declares `keyboard_type: "text"` (`LANG-KB-01`). Typed-answer rules:
   - **Avoid `á í ó ú à â`** (not on the keyboard) in typed answers *and* in how a question is phrased; a topic that needs them (klemtekens) is
     `multiple_choice`. Plain form in answers (`na`, not `ná`). Required diacritics `ê ë é è ô ö û ü î ï ä` are fine and **significant** — never store a stripped spelling.
   - Article `'n`: ASCII apostrophe only; if it must be typed write `'n|ŉ`. Normalise PDF-extracted apostrophes (`ꞌ`, `’`) to `'`.
   - Exact match, not memo leniency: one AWS-correct form, or `|` alternatives for genuinely valid variants. Ambiguous spelling or sentence-level rewrites → `multiple_choice`/`ordering`.
   - Syllable divisions: tell the student the separator is `-`. Numbers in words: one form only.
   - P2 practice questions: fresh targets, `context_text` null, factual-basis `BK/P/M/PT` per question in the script header (`SETWORK-LES-05`); `text_key` on every question.
   - P3: conventions-based fresh scenarios (`LANG-WR-03`); images are the task, the marker instructions + marking points, and the rubric page.
5. **Vocab dump** — as Phase -1 step 3 (re-dump after creating nodes/skills).
6. **Upload script** — copy `tools/upload-script-template.js` to `scripts/add-afrikaans-fal-<year>-<paper>-q<N>.js` (`subject: "afrikaans_fal"`; P2 `q<N>-<part>`);
   `aiExplanation` **in Afrikaans**, one entry per real exam sub-question with its real marks (`AIEXP-08`; `LANG-ANS-02`) — P1 Q1 Teks A has 16 entries, Q5 one per 1-mark item.
   Validate with `--curriculum` (HARD STOP) → `--dry-run` → upsert to dev → **commit** (`[Data] Add afrikaans_fal <year> <paper> Q<N> lesson and questions`).
7. **Verify** — pipeline Phase 5 plus: name format, image contents, `supplementary_materials` shape, `text_key` agreement, `context_text` only where needed,
   True/False ≤20%, and an **accent-keyboard check on the emulator** (below).
8. **Gate** (once per exam) — `node tools/derive-exam-min.js scripts/add-afrikaans-fal-<year>-<session>-*.js` should print **2.4.1**;
   `node tools/apply-exam-gate.js --env dev --subject afrikaans_fal --year <YYYY> --session november` (dry run, then `--apply`; `VER-09`). Apply after the
   review pass if the review build predates 2.4.1.

## Review — typed answers on the emulator

Runners use test tags: letters `text_key_<UPPER>`, space `text_key_space`, screen switch `text_key_switch`, done `text_key_done`, accents
`text_key_Ê` `Ë` `É` `È` `Ô` `Ö` `Û` `Ü` `Î` `Ï` `Ä` and `text_key_ŉ` (second screen only). Poll for `question_feedback_*` (~1 s). Rebuild the answer manifest from the DB
before each run. Confirm at least one accented answer (`leë`, `môre`) types and passes — that proves `accents_af` reached the build; if the accent row is missing,
the build's subjects list is stale or the capability is absent.

## Notes

- The oral (P4) is not authored. Only Nov 2025 exists in `files/`.
- Afrikaans spelling follows the AWS; a first-language reviewer must check spelling, distractors and the BK-led P2 questions before any prod push.
- Idea, not scheduled: English `aiExplanation` for non-HL subjects (profile Open item 7).
