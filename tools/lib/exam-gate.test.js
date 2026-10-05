#!/usr/bin/env node
'use strict';
/**
 * Tests for the exam-level prod-push decision and gate planning (pure functions, no database):
 *   node tools/lib/exam-gate.test.js
 * Optional live demonstration against DEV rows (read-only; prod is NOT queried — prod presence is supplied by hand):
 *   node tools/lib/exam-gate.test.js --demo physics 2024 november nov_p2 --prod-papers none
 *   node tools/lib/exam-gate.test.js --demo physics 2023 november nov_p1 --prod-papers nov_p2
 */
const assert = require('assert');
const fv = require('./feature-versions');
const { examPushDecision, planGate } = require('./exam-gate');

const exam = (papers, existing = null) => {
  const derived = fv.maxVersion(...Object.values(papers));
  return {
    subject: 'physics', syllabus: 'dbe', year: '2024', session: 'november', existing, derived, raising: [], errors: [], publishedQuestions: 10,
    papers: Object.fromEntries(Object.entries(papers).map(([id, v]) => [id, { questions: 5, published: 5, derived: v }])),
  };
};
const D = (e, paper, prod, allowPartial = false) => examPushDecision({ exam: e, paper, prodPapers: prod === null ? null : new Set(prod), allowPartial });

function run() {
  const REL = fv.LATEST_RELEASED, NXT = fv.NEXT_RELEASE;
  assert.ok(fv.isUnreleased(NXT) && !fv.isUnreleased(REL));

  // 2024 shape: P1 needs 2.4.0, P2 is at the floor, nothing in prod -> BOTH papers refused, even P2 alone
  const e24 = exam({ nov_p1: NXT, nov_p2: fv.FLOOR });
  assert.strictEqual(D(e24, 'nov_p2', []).decision, 'refuse');
  assert.strictEqual(D(e24, 'nov_p1', []).decision, 'refuse');
  // the override does NOT lift an unreleased dependency, and says so
  const o = D(e24, 'nov_p2', [], true);
  assert.strictEqual(o.decision, 'refuse');
  assert.ok(o.reasons.join(' ').includes('does not apply to unreleased'));

  // 2023 shape: everything at the floor, P2 already in prod -> pushing P1 is allowed
  const e23 = exam({ nov_p1: fv.FLOOR, nov_p2: fv.FLOOR });
  assert.strictEqual(D(e23, 'nov_p1', ['nov_p2']).decision, 'allow');
  // partial exam (releasable, but a sibling on dev is neither in prod nor being pushed) -> refused, override allows and is named
  assert.strictEqual(D(e23, 'nov_p1', []).decision, 'refuse');
  const ov = D(e23, 'nov_p1', [], true);
  assert.strictEqual(ov.decision, 'allow');
  assert.ok(ov.report.join('\n').includes('--allow-partial-exam'));
  // prod unknown -> only the minimum rule applies, and the report says so
  const u = D(e23, 'nov_p1', null);
  assert.strictEqual(u.decision, 'allow');
  assert.ok(u.report.join('\n').includes('unknown'));
  // once the release is tagged (LATEST_RELEASED bumped) the same 2024 exam would pass: simulate with a released-range exam
  assert.strictEqual(D(exam({ nov_p1: '2.3.0', nov_p2: fv.FLOOR }), 'nov_p1', ['nov_p2']).decision, 'allow');

  // gate planning
  assert.strictEqual(planGate(e23, 'dev').action, 'none');                       // VER-07: floor -> nothing
  assert.deepStrictEqual([planGate(e24, 'dev').action, planGate(e24, 'dev').min], ['set', NXT]);
  assert.strictEqual(planGate(exam({ nov_p1: NXT, nov_p2: fv.FLOOR }, NXT), 'dev').action, 'ok');   // idempotent
  assert.strictEqual(planGate(e24, 'prod').action, 'refuse');                    // prod never above LATEST_RELEASED
  assert.strictEqual(planGate(exam({ nov_p1: '2.2.0' }), 'prod').action, 'set');  // a released version is fine on prod
  console.log('exam-gate tests: all passed');
}

async function demo(subject, year, session, paper, prodArg) {
  const { getPool, closePool } = require('./postgres');
  const { deriveExams } = require('./exam-gate');
  try {
    const [e] = await deriveExams(getPool('dev'), { subject, year, session });
    const prod = prodArg === 'none' ? [] : prodArg.split(',');
    console.log(D(e, paper, prod).report.join('\n'));
  } finally { await closePool(); }
}

const i = process.argv.indexOf('--demo');
if (i !== -1) {
  const [subject, year, session, paper] = process.argv.slice(i + 1);
  const pp = process.argv.indexOf('--prod-papers');
  demo(subject, year, session, paper, pp !== -1 ? process.argv[pp + 1] : 'none').catch((e) => { console.error(e.message); process.exitCode = 1; });
} else run();
