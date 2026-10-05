#!/usr/bin/env node
/**
 * Derives each exam's minimum app version from the rows in the database and writes it to `exam_versions` (VER-02/VER-04):
 * never hand-typed, idempotent, and a no-op when the derived minimum is the floor (VER-07). Run it as the last step after
 * uploading or retrofitting a paper (the generation workflows say so), or over a whole subject.
 *
 *   node tools/apply-exam-gate.js --env dev --subject physics --year 2024 --session november     # dry run (default)
 *   node tools/apply-exam-gate.js --env dev --subject physics --year 2024 --session november --apply
 *   node tools/apply-exam-gate.js --env dev --all                                                 # report every exam
 *
 * The gate is per EXAM (subject + syllabus + year + session): one paper that needs a newer build gates its sibling papers
 * too. Writing a gate also sets `updated_at = now()` on the exam's lessons and questions (the delta-sync trap, VER-04).
 * Raising a gate hides the exam from builds below it on their next sync; rows already on a device stay (VER-03) — the report
 * says how many published questions are affected. Prod: only gates <= LATEST_RELEASED are written, and --i-know-this-is-prod is
 * required; an exam above it is REFUSED (content for unreleased builds does not go to prod).
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { applyExamGates } = require('./lib/exam-gate');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : null; };
const has = (n) => args.includes(n);

const env = flag('--env') || 'dev';
const filter = { subject: flag('--subject'), syllabus: flag('--syllabus'), year: flag('--year'), session: flag('--session') };
const apply = has('--apply');

function usage(msg) {
  if (msg) console.error(`error: ${msg}\n`);
  console.error('Usage: node tools/apply-exam-gate.js --env dev|prod (--all | --subject <id> [--syllabus dbe] [--year <YYYY>] [--session <june|november>]) [--apply]');
  process.exit(1);
}
if (!['dev', 'prod'].includes(env)) usage('--env must be dev or prod');
if (!has('--all') && !filter.subject) usage('give --subject (optionally --year/--session) or --all');
if (apply && env === 'prod' && !has('--i-know-this-is-prod')) usage('prod changes need --i-know-this-is-prod (owner-gated)');

(async () => {
  console.log(`env: ${env}   ${apply ? 'APPLY' : 'dry run (nothing written; add --apply)'}\n`);
  const results = await applyExamGates(getPool(env), { env, filter: has('--all') ? {} : filter, apply });
  const set = results.filter((r) => r.plan.action === 'set').length;
  const refused = results.filter((r) => r.plan.action === 'refuse').length;
  console.log(`\n${results.length} exams: ${set} ${apply ? 'gated' : 'would be gated'}, ${refused} refused (prod, unreleased).`);
  if (refused > 0) process.exitCode = 1;
})().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(closePool);
