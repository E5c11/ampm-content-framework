#!/usr/bin/env node
/**
 * Third pass of the Physical Sciences 2024 Nov retrofit (after the base script and its `-2-` pass). DEV ONLY.
 * The 9 P1 `steps` rows have bare-numeric answers, so by core/keyboard-input.md KEYBOARD-04 they declare 'scientific_math', not 'physics'
 * (their given-text markup is rendered, not typed). Only `keyboard_type` is written; `updated_at` is bumped (VER-04).
 *
 *   node scripts/fix-keyboard-retrofit-3-physics-2024-2026-10-05.js            # dry run
 *   node scripts/fix-keyboard-retrofit-3-physics-2024-2026-10-05.js --apply
 *
 * Desired state comes from the edited upload scripts; a row is touched only if its presentation, answer and metadata equal the script's and
 * its keyboard_type is still 'physics'. No --env: prod is not supported.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('../tools/lib/postgres');
const fv = require('../tools/lib/feature-versions');

const apply = process.argv.includes('--apply');
const SCRIPTS = fs.readdirSync(__dirname).filter((f) => /^add-physics-2024-nov-p1-.*\.js$/.test(f)).sort();
const show = (v) => JSON.stringify(v);

function questionsOf(file) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const m = src.match(/(?:const|let|var)\s+questions\s*=\s*(\[[\s\S]*?\]);/);
  // eslint-disable-next-line no-eval
  return eval(m[1].replace(/Date\.now\(\)/g, '1000000000000'));
}

async function main() {
  const pool = getPool('dev');
  const { rows } = await pool.query(
    `SELECT id, question, presentation_id, metadata, answer, keyboard_type FROM questions
      WHERE subject_id='physics' AND year_id='2024' AND paper_id='nov_p1' AND NOT is_deleted`);
  const byQ = new Map(rows.map((r) => [r.question, r]));
  const plan = []; let bad = 0;
  for (const file of SCRIPTS) {
    for (const q of questionsOf(file)) {
      if (q.presentation !== 'steps') continue;
      const label = `${file.replace('add-physics-2024-', '').replace('.js', '')} ${q.name}`;
      const r = byQ.get(q.question);
      if (!r) { console.error(`✗ ${label}: no dev row`); bad++; continue; }
      if (q.keyboard_type !== 'scientific_math') { console.error(`✗ ${label}: script declares ${q.keyboard_type}`); bad++; continue; }
      if (r.presentation_id !== 'steps' || show(r.answer) !== show(q.answer) || show(r.metadata) !== show(q.metadata)) { console.error(`✗ ${label}: content drifted`); bad++; continue; }
      if (r.keyboard_type !== 'physics') { console.error(`✗ ${label}: keyboard_type is ${r.keyboard_type}, not physics`); bad++; continue; }
      const a = fv.analyzeQuestion({ subject: q.subject, presentation: 'steps', keyboard_type: 'scientific_math', answer: q.answer, question: q.question, metadata: q.metadata });
      if (a.errors.length) { console.error(`✗ ${label}: invalid: ${a.errors.join('; ')}`); bad++; continue; }
      plan.push({ id: r.id, label });
      console.log(`✓ ${label}: keyboard_type physics -> scientific_math`);
    }
  }
  console.log(`\n${plan.length} rows ready, ${bad} problem(s).`);
  if (bad > 0) { process.exitCode = 1; console.log('Nothing written.'); return; }
  if (!apply) { console.log('Dry run — nothing written. Re-run with --apply.'); return; }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of plan) await client.query(`UPDATE questions SET keyboard_type='scientific_math', updated_at=now() WHERE id=$1`, [p.id]);
    await client.query('COMMIT');
    console.log(`Applied to dev: ${plan.length} rows (updated_at bumped).`);
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}
main().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(closePool);
