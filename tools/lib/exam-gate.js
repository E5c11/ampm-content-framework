'use strict';

/**
 * Exam gates — derive an exam's minimum app version FROM THE ROWS in a database and write it to `exam_versions`.
 * (core/app-feature-versions.md VER-01..VER-07.) Shared by `tools/apply-exam-gate.js`, `tools/set-exam-gate.js`
 * and the upload-script template. Nothing here takes a hand-typed version except `writeExamGate`, which the manual
 * `set-exam-gate.js` calls.
 *
 * The unit is the EXAM = (subject, syllabus, year, session) — every paper of that sitting, never one paper (VER-01).
 * So one paper that needs 2.4.0 gates its sibling paper too.
 */

const fv = require('./feature-versions');

const KEY = (e) => `${e.subject}|${e.syllabus}|${e.year}|${e.session}`;

/**
 * Derives every exam (or the ones matching `filter` = {subject, syllabus, year, session}) from the questions in `pool`.
 * Returns [{subject, syllabus, year, session, papers: {paper_id: {questions, published}}, derived, raising, existing,
 * publishedQuestions, errors}] where `derived` is the highest version any question needs (never below the floor).
 */
async function deriveExams(pool, filter = {}) {
  const where = ['NOT q.is_deleted'];
  const params = [];
  const add = (col, v) => { if (v) { params.push(v); where.push(`${col} = $${params.length}`); } };
  add('q.subject_id', filter.subject); add('q.syllabus_id', filter.syllabus); add('q.year_id', filter.year); add('p.session', filter.session);

  const { rows } = await pool.query(
    `SELECT q.name, q.subject_id, q.syllabus_id, q.year_id, q.paper_id, p.session, q.presentation_id, q.keyboard_type,
            q.case_sensitive, q.answer, q.question, q.metadata, q.is_published
       FROM questions q JOIN papers p ON p.id = q.paper_id WHERE ${where.join(' AND ')}`, params);

  const { rows: gateRows } = await pool.query('SELECT subject_id, syllabus_id, year_id, session, min_app_version FROM exam_versions');
  const existing = new Map(gateRows.map((g) => [`${g.subject_id}|${g.syllabus_id}|${g.year_id}|${g.session}`, g.min_app_version]));

  const exams = new Map();
  for (const q of rows) {
    const key = `${q.subject_id}|${q.syllabus_id}|${q.year_id}|${q.session}`;
    let e = exams.get(key);
    if (!e) {
      e = { subject: q.subject_id, syllabus: q.syllabus_id, year: q.year_id, session: q.session, papers: {}, requires: [], errors: [], publishedQuestions: 0 };
      exams.set(key, e);
    }
    const paper = (e.papers[q.paper_id] ||= { questions: 0, published: 0, derived: fv.FLOOR });
    paper.questions += 1;
    if (q.is_published) { paper.published += 1; e.publishedQuestions += 1; }
    const a = fv.analyzeQuestion({
      subject: q.subject_id, presentation: q.presentation_id, keyboard_type: q.keyboard_type ?? null,
      case_sensitive: q.case_sensitive === true ? true : undefined, answer: q.answer, question: q.question, metadata: q.metadata,
    });
    e.requires.push(...a.requires.map((r) => ({ ...r, paper: q.paper_id })));
    paper.derived = fv.maxVersion(paper.derived, ...a.requires.map((r) => r.version));
    a.errors.forEach((m) => e.errors.push(`${q.name} (${q.paper_id}): ${m}`));
  }

  return [...exams.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, e]) => ({
    ...e,
    derived: fv.maxVersion(...e.requires.map((r) => r.version)),
    raising: [...new Map(e.requires.filter((r) => fv.versionCode(r.version) > fv.versionCode(fv.FLOOR)).map((r) => [`${r.reason}|${r.paper}`, r])).values()],
    existing: existing.get(key) ?? null,
  }));
}

/**
 * What should happen to this exam's gate in `env`? Pure.
 *  action: 'none' (derived minimum is the floor — VER-07), 'ok' (gate already equals it), 'set', 'refuse' (prod, unreleased).
 */
function planGate(exam, env) {
  const floor = fv.versionCode(fv.FLOOR);
  if (fv.versionCode(exam.derived) <= floor) {
    return { action: 'none', min: null, note: exam.existing ? `derived minimum is the floor but a gate ${exam.existing} exists — left alone (clear it with set-exam-gate.js --clear if it is not wanted)` : 'derived minimum is the floor — no gate needed (VER-07)' };
  }
  if (env === 'prod' && fv.isUnreleased(exam.derived)) {
    return { action: 'refuse', min: exam.derived, note: `derived minimum ${exam.derived} is above the latest released version ${fv.LATEST_RELEASED} — never gated or pushed to prod until the release is tagged and LATEST_RELEASED is bumped` };
  }
  if (exam.existing === exam.derived) return { action: 'ok', min: exam.derived, note: `gate already ${exam.derived}` };
  return { action: 'set', min: exam.derived, note: `gate ${exam.existing ?? '(none)'} -> ${exam.derived}` };
}

/** Writes (or, with min === null, clears) the gate and bumps updated_at on the exam's lessons and questions, in one transaction (VER-04). */
async function writeExamGate(pool, exam, min) {
  const EXAM = [exam.subject, exam.syllabus, exam.year, exam.session];
  const WHERE = (alias) => `${alias}.subject_id = $1 AND ${alias}.syllabus_id = $2 AND ${alias}.year_id = $3 AND p.session = $4 AND NOT ${alias}.is_deleted`;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (min === null) {
      await client.query('DELETE FROM exam_versions WHERE subject_id=$1 AND syllabus_id=$2 AND year_id=$3 AND session=$4', EXAM);
    } else {
      await client.query(
        `INSERT INTO exam_versions (subject_id, syllabus_id, year_id, session, min_app_version) VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (subject_id, syllabus_id, year_id, session) DO UPDATE SET min_app_version = EXCLUDED.min_app_version, updated_at = now()`,
        [...EXAM, min]);
    }
    const l = await client.query(`UPDATE lessons l SET updated_at = now() FROM papers p WHERE p.id = l.paper_id AND ${WHERE('l')}`, EXAM);
    const q = await client.query(`UPDATE questions q SET updated_at = now() FROM papers p WHERE p.id = q.paper_id AND ${WHERE('q')}`, EXAM);
    await client.query('COMMIT');
    return { lessons: l.rowCount, questions: q.rowCount };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/** Human-readable report for one exam + its plan. */
function describe(exam, plan) {
  const out = [`${exam.subject} ${exam.syllabus} ${exam.year} ${exam.session}: derived ${exam.derived} — ${plan.note}`];
  const papers = Object.entries(exam.papers).sort(([a], [b]) => a.localeCompare(b));
  out.push(`    papers: ${papers.map(([id, p]) => `${id} (${p.questions} questions, needs ${p.derived})`).join('; ')}`);
  for (const r of exam.raising.slice(0, 4)) out.push(`    needs ${r.version}: ${r.reason} [${r.paper}]`);
  if (plan.action === 'set' && exam.publishedQuestions > 0) {
    const gated = fv.versionCode(plan.min);
    out.push(`    NOTE: ${exam.publishedQuestions} published questions — builds below ${plan.min} stop receiving this exam on their NEXT sync (rows already on a device stay). Every paper of the exam is gated, including papers that need only the floor.`);
    void gated;
  }
  for (const m of exam.errors.slice(0, 5)) out.push(`    DEFECT: ${m}`);
  return out.join('\n');
}

/**
 * Derive + (optionally) apply. `apply` false = report only (the default everywhere). Returns the per-exam results.
 * `onlyIfNew` skips exams whose plan would not change anything.
 */
async function applyExamGates(pool, { env = 'dev', filter = {}, apply = false, log = console.log } = {}) {
  const exams = await deriveExams(pool, filter);
  const results = [];
  for (const exam of exams) {
    const plan = planGate(exam, env);
    log(describe(exam, plan));
    let written = null;
    if (apply && plan.action === 'set') {
      written = await writeExamGate(pool, exam, plan.min);
      log(`    APPLIED: gate ${plan.min}; updated_at bumped on ${written.lessons} lessons and ${written.questions} questions.`);
    }
    results.push({ exam, plan, written });
  }
  if (exams.length === 0) log('no exams match.');
  return results;
}

/**
 * The exam-level prod-push decision (VER-08). Pure. `exam` is a `deriveExams` result (dev rows), `paper` the paper being pushed,
 * `prodPapers` the papers of this exam already in prod (a Set, or null = not known), `allowPartial` the --allow-partial-exam flag.
 *  - REFUSE when the EXAM's minimum (max over ALL its papers on dev) is above LATEST_RELEASED — even if `paper` itself is
 *    releasable. The override never lifts this: it is not for unreleased dependencies.
 *  - REFUSE a partial exam (a sibling paper on dev that is neither in prod nor `paper`) unless `allowPartial`.
 * Returns {decision: 'allow'|'refuse', reasons: [...], report: [lines]} — the report is printed in every run, dry-run included.
 */
function examPushDecision({ exam, paper, prodPapers = null, allowPartial = false }) {
  const devPapers = Object.keys(exam.papers).sort();
  const inProd = (id) => (prodPapers ? (prodPapers.has(id) ? 'yes' : 'no') : 'unknown (prod not queried)');
  const report = [
    `exam ${exam.subject} ${exam.syllabus} ${exam.year} ${exam.session} — pushing ${paper}`,
    ...devPapers.map((id) => `  ${id}: on dev (${exam.papers[id].questions} questions), in prod: ${inProd(id)}, derived minimum ${exam.papers[id].derived}`),
    `  exam-level minimum (max of all papers on dev): ${exam.derived}   LATEST_RELEASED: ${fv.LATEST_RELEASED}`,
  ];
  const reasons = [];
  if (fv.isUnreleased(exam.derived)) {
    const blockers = devPapers.filter((id) => fv.isUnreleased(exam.papers[id].derived)).map((id) => `${id} needs ${exam.papers[id].derived}`);
    reasons.push(`the exam needs ${exam.derived}, above the latest released ${fv.LATEST_RELEASED} (${blockers.join('; ')}) — the gate is per exam, so no paper of it goes to prod until the release is tagged and LATEST_RELEASED is bumped (VER-05/VER-08)${allowPartial ? '; --allow-partial-exam does not apply to unreleased dependencies' : ''}`);
  }
  const missing = prodPapers ? devPapers.filter((id) => id !== paper && !prodPapers.has(id)) : [];
  if (missing.length > 0) {
    if (allowPartial) report.push(`  OVERRIDE --allow-partial-exam in effect: prod will hold only part of the exam (sibling(s) on dev but not in prod: ${missing.join(', ')})`);
    else reasons.push(`partial exam: sibling paper(s) ${missing.join(', ')} are on dev but not in prod; push the exam's papers together, or pass --allow-partial-exam if a sibling is deliberately held back (VER-01)`);
  }
  const decision = reasons.length === 0 ? 'allow' : 'refuse';
  report.push(`  decision: ${decision.toUpperCase()}${reasons.map((r) => `\n    - ${r}`).join('')}`);
  return { decision, reasons, report };
}

module.exports = { deriveExams, planGate, writeExamGate, describe, applyExamGates, examPushDecision, KEY };
