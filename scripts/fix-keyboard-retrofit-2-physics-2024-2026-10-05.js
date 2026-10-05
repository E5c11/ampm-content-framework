#!/usr/bin/env node
/**
 * Second pass of the Physical Sciences 2024 Nov retrofit (after fix-keyboard-retrofit-physics-2024-2026-10-05.js). DEV ONLY.
 *   - the 27 bare-numeric fitb rows go back to the basic keyboard: keyboard_type 'standard_math' (declare physics/chemistry only
 *     where the answer or its label needs something the basic keyboards cannot type — core/keyboard-input.md KEYBOARD-04);
 *   - the 9 P1 steps rows stay 'physics' (their given text now carries `_{…}` markup);
 *   - Unicode subscripts that sit on the SAME metadata line as a `_{…}` added by pass 1 become `_{…}` too, so no line mixes `pᵢ` and `p_{f}`.
 *
 *   node scripts/fix-keyboard-retrofit-2-physics-2024-2026-10-05.js            # dry run
 *   node scripts/fix-keyboard-retrofit-2-physics-2024-2026-10-05.js --apply
 *
 * Desired state is read from the edited upload scripts (the source of truth). A row is only touched if it is in exactly the state pass 1
 * left it (same answer/presentation, metadata = script metadata with the new markup reversed, keyboard physics/chemistry). `updated_at`
 * is bumped (VER-04). No --env: prod is not supported.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('../tools/lib/postgres');
const fv = require('../tools/lib/feature-versions');

const apply = process.argv.includes('--apply');
const SCRIPTS = fs.readdirSync(__dirname).filter((f) => /^add-physics-2024-nov-p[12]-.*\.js$/.test(f)).sort();
const TYPED = new Set(['fitb', 'steps']);
const show = (v) => JSON.stringify(v);

function questionsOf(file) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const m = src.match(/(?:const|let|var)\s+questions\s*=\s*(\[[\s\S]*?\]);/);
  // eslint-disable-next-line no-eval
  return eval(m[1].replace(/Date\.now\(\)/g, '1000000000000'));
}

// pass-2 markup -> the Unicode subscripts pass 1 left in dev
const reverse2 = (s) => s
  .replace(/Σp_\{i\}/g, 'Σpᵢ').replace(/W_\{net\}/g, 'Wₙₑₜ').replace(/ΔE_\{k\}/g, 'ΔEₖ').replace(/mv_\{i\}/g, 'mvᵢ')
  .replace(/v_\{s\}/g, 'vₛ').replace(/f_\{s\}/g, 'fₛ').replace(/F_\{net\}/g, 'Fₙₑₜ').replace(/Q_\{1\}Q_\{2\}/g, 'Q₁Q₂')
  .replace(/L_\{1\}/g, 'L₁').replace(/R_\{1\}/g, 'R₁');

async function main() {
  const pool = getPool('dev');
  const { rows } = await pool.query(
    `SELECT id, paper_id, question, presentation_id, metadata, answer, keyboard_type
       FROM questions WHERE subject_id='physics' AND year_id='2024' AND paper_id IN ('nov_p1','nov_p2') AND NOT is_deleted`);
  const byKey = new Map(rows.map((r) => [`${r.paper_id}|${r.question}`, r]));
  const plan = []; let bad = 0;
  for (const file of SCRIPTS) {
    for (const q of questionsOf(file)) {
      if (!TYPED.has(q.presentation)) continue;
      const label = `${file.replace('add-physics-2024-', '').replace('.js', '')} ${q.name} (${q.presentation})`;
      const r = byKey.get(`${q.paper}|${q.question}`);
      if (!r) { console.error(`✗ ${label}: no dev row`); bad++; continue; }
      const wantKb = q.presentation === 'steps' ? 'physics' : 'standard_math';
      if (q.keyboard_type !== wantKb) { console.error(`✗ ${label}: script declares ${q.keyboard_type}, expected ${wantKb}`); bad++; continue; }
      if (r.presentation_id !== q.presentation || show(r.answer) !== show(q.answer)) { console.error(`✗ ${label}: presentation/answer drifted`); bad++; continue; }
      if (!['physics', 'chemistry'].includes(r.keyboard_type)) { console.error(`✗ ${label}: keyboard_type is ${r.keyboard_type}, not the pass-1 state`); bad++; continue; }
      if (show(r.metadata) !== show(q.metadata.map(reverse2))) { console.error(`✗ ${label}: dev metadata is not the pass-1 text`); bad++; continue; }
      const a = fv.analyzeQuestion({ subject: q.subject, presentation: q.presentation, keyboard_type: wantKb, answer: q.answer, question: q.question, metadata: q.metadata });
      if (a.errors.length) { console.error(`✗ ${label}: invalid: ${a.errors.join('; ')}`); bad++; continue; }
      plan.push({ id: r.id, label, beforeKb: r.keyboard_type, afterKb: wantKb, beforeMeta: r.metadata, afterMeta: q.metadata });
    }
  }
  for (const p of plan) {
    const mc = show(p.beforeMeta) !== show(p.afterMeta);
    console.log(`✓ ${p.label}: keyboard_type ${p.beforeKb} -> ${p.afterKb}${mc ? `\n    metadata:\n      - ${show(p.beforeMeta)}\n      + ${show(p.afterMeta)}` : ''}`);
  }
  const nMeta = plan.filter((p) => show(p.beforeMeta) !== show(p.afterMeta)).length;
  const nKb = plan.filter((p) => p.beforeKb !== p.afterKb).length;
  console.log(`\n${plan.length} rows checked: ${nKb} keyboard changes, ${nMeta} metadata changes, ${bad} problem(s).`);
  if (bad > 0) { process.exitCode = 1; console.log('Nothing written.'); return; }
  if (!apply) { console.log('Dry run — nothing written. Re-run with --apply.'); return; }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of plan) {
      if (p.beforeKb === p.afterKb && show(p.beforeMeta) === show(p.afterMeta)) continue;
      await client.query('UPDATE questions SET keyboard_type=$2, metadata=$3, updated_at=now() WHERE id=$1', [p.id, p.afterKb, p.afterMeta]);
    }
    await client.query('COMMIT');
    console.log('Applied to dev (updated_at bumped on changed rows).');
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}
main().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(closePool);
