#!/usr/bin/env node
/**
 * Derives an EXAM's minimum app version from all of its upload scripts (D7: derived, never
 * hand-set). `validate-questions.js` derives one number per script; an exam (one subject/year/
 * session, every paper) is gated as a unit, so its minimum is the highest of its scripts'.
 *
 *   node tools/derive-exam-min.js scripts/add-physics-2025-nov-*.js
 *
 * Prints the per-script minimums that raise the exam above the floor, then the exam's result,
 * then the command that applies it. Exit 1 only if a script fails validation. Planned capabilities
 * (the physics/chemistry/text keyboards, the extra Maths keys, sub/superscript markup) are valid:
 * they make the exam's minimum the next release's version (NEXT_RELEASE), meaning DEV ONLY until it is tagged.
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const fv = require('./lib/feature-versions');

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith('--'));
if (files.length === 0) {
  console.error('Usage: node tools/derive-exam-min.js <upload-script.js> [...]');
  process.exit(1);
}

let exitCode = 0;
const versions = [];
const raisers = [];

for (const file of files) {
  const r = spawnSync('node', [path.join(__dirname, 'validate-questions.js'), '--script', file], { encoding: 'utf8' });
  const m = /Derived minimum app version: (\S+)/.exec(r.stdout);
  if (r.status !== 0 || !m) {
    console.error(`✗ ${file}: validation failed or no derived version\n${r.stdout.split('\n').filter((l) => /✗|violation/.test(l)).join('\n')}`);
    exitCode = 1;
    continue;
  }
  const v = m[1];
  versions.push(v);
  if (fv.versionCode(v) > fv.versionCode(fv.FLOOR)) {
    raisers.push(`${v}  ${path.basename(file)}`);
  }
}

if (versions.length === 0) process.exit(1);
const exam = fv.maxVersion(...versions);

console.log(`Scripts checked: ${versions.length}/${files.length}`);
for (const line of raisers) console.log(`  raises the minimum: ${line}`);
console.log(`\nExam minimum app version: ${exam}${exam === fv.FLOOR ? ' (the Spring floor — no gate needed)' : ''}`);
if (fv.isUnreleased(exam)) {
  console.log(`UNRELEASED (latest released is ${fv.LATEST_RELEASED}): DEV ONLY — do not push this exam to prod until ${exam} is tagged and`);
  console.log('LATEST_RELEASED in tools/lib/feature-versions.js is bumped (VER-06).');
}
if (exam !== fv.FLOOR) {
  console.log('Gate it on dev (derives from the database rows; dry run first, then --apply):');
  console.log('  node tools/apply-exam-gate.js --env dev --subject <id> --year <YYYY> --session <june|november>');
}
process.exit(exitCode);
