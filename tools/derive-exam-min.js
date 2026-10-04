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
 * they make the exam's minimum `next-release`, meaning DEV ONLY until that release is tagged.
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
  const v = m[1] === 'next-release' ? fv.NEXT : m[1];
  versions.push(v);
  if (v === fv.NEXT || fv.versionCode(v) > fv.versionCode(fv.FLOOR)) {
    raisers.push(`${v === fv.NEXT ? 'next-release' : v}  ${path.basename(file)}`);
  }
}

if (versions.length === 0) process.exit(1);
const exam = fv.maxVersion(...versions);

console.log(`Scripts checked: ${versions.length}/${files.length}`);
for (const line of raisers) console.log(`  raises the minimum: ${line}`);
if (exam === fv.NEXT) {
  console.log('\nExam minimum app version: next-release — depends on planned capabilities (version set when tagged).');
  console.log('DEV ONLY: do not push this exam to prod, and do not gate it, until that release is tagged and the');
  console.log('real version replaces `NEXT` in tools/lib/feature-versions.js + core/app-feature-versions.md (VER-06).');
} else {
  console.log(`\nExam minimum app version: ${exam}${exam === fv.FLOOR ? ' (the Spring floor — no gate needed)' : ''}`);
  if (exam !== fv.FLOOR) {
    console.log('Apply (dry run first, no --apply):');
    console.log(`  node tools/set-exam-gate.js --env dev --subject <id> --year <YYYY> --session <june|november> --min ${exam}`);
  }
}
process.exit(exitCode);
