#!/usr/bin/env node
/**
 * One-off content retrofit — Physical Sciences 2024 Nov P1 (Physics) and P2 (Chemistry): declare the new
 * `physics` / `chemistry` keyboards on every typed question and move the parenthesised-subscript workaround
 * (`p(f)`, `V(ext)`) to `_{…}` markup in the given text of the typed questions. DEV ONLY.
 *
 *   node scripts/fix-keyboard-retrofit-physics-2024-2026-10-05.js            # dry run: shows before/after
 *   node scripts/fix-keyboard-retrofit-physics-2024-2026-10-05.js --apply
 *
 * The desired state is read from the (already edited) upload scripts scripts/add-physics-2024-nov-p{1,2}-*.js, so
 * the scripts stay the source of truth. Each script question is matched to its dev row by (paper, question text)
 * and the row must still have the same presentation and answer, and its metadata must match what the script had
 * before this retrofit up to the markup substitutions below — otherwise the script refuses to touch it. Only
 * `keyboard_type` and `metadata` are written; `updated_at` is bumped (VER-04: clients delta-sync on it).
 * There is deliberately no --env: prod is not supported (the content depends on NEXT features, VER-05).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('../tools/lib/postgres');
const fv = require('../tools/lib/feature-versions');

const apply = process.argv.includes('--apply');
const SCRIPTS = fs.readdirSync(__dirname).filter((f) => /^add-physics-2024-nov-p[12]-.*\.js$/.test(f)).sort();
const TYPED = new Set(['fitb', 'steps', 'equation', 'fraction']);
const OLD_KEYBOARDS = new Set([null, 'standard_math', 'scientific_math']); // backfill / inference values

function questionsOf(file) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const m = src.match(/(?:const|let|var)\s+questions\s*=\s*(\[[\s\S]*?\]);/);
  // eslint-disable-next-line no-eval
  return eval(m[1].replace(/Date\.now\(\)/g, '1000000000000'));
}

// Reverse of the markup substitutions: what the metadata looked like before this retrofit.
const unmark = (s) => s
  .replace(/Σp_\{f\}/g, 'Σp(f)').replace(/v_\{P\}/g, 'v(P)').replace(/W_\{F\}/g, 'W(F)').replace(/W_\{f\}/g, 'W(f)')
  .replace(/v_\{f\}/g, 'v(f)').replace(/f_\{L\}/g, 'f(L)').replace(/λ_\{L\}/g, 'λ(L)').replace(/F_\{NW\}/g, 'F(NW)')
  .replace(/F_\{MW\}/g, 'F(MW)').replace(/V_\{R1\}/g, 'V(R₁)').replace(/V_\{ext\}/g, 'V(ext)');

const show = (v) => JSON.stringify(v);

async function main() {
  const pool = getPool('dev');
  const { rows } = await pool.query(
    `SELECT id, paper_id, question, presentation_id, metadata, answer, keyboard_type, case_sensitive
       FROM questions WHERE subject_id='physics' AND year_id='2024' AND paper_id IN ('nov_p1','nov_p2') AND NOT is_deleted`);
  const byKey = new Map(rows.map((r) => [`${r.paper_id}|${r.question}`, r]));

  const plan = []; let bad = 0;
  for (const file of SCRIPTS) {
    for (const q of questionsOf(file)) {
      if (!TYPED.has(q.presentation)) continue;
      const label = `${file.replace('add-physics-2024-', '').replace('.js', '')} ${q.name} (${q.presentation})`;
      const r = byKey.get(`${q.paper}|${q.question}`);
      if (!r) { console.error(`✗ ${label}: no dev row with this question text`); bad++; continue; }
      const expectKb = q.paper === 'nov_p1' ? 'physics' : 'chemistry';
      if (q.keyboard_type !== expectKb) { console.error(`✗ ${label}: script declares ${q.keyboard_type}, expected ${expectKb}`); bad++; continue; }
      if (r.presentation_id !== q.presentation || show(r.answer) !== show(q.answer)) { console.error(`✗ ${label}: presentation/answer drifted`); bad++; continue; }
      if (!OLD_KEYBOARDS.has(r.keyboard_type)) { console.error(`✗ ${label}: keyboard_type is already ${r.keyboard_type}`); bad++; continue; }
      if (show(r.metadata) !== show(q.metadata.map(unmark))) {
        if (r.keyboard_type === expectKb) { /* handled above */ }
        console.error(`✗ ${label}: dev metadata is not the pre-retrofit text`); bad++; continue;
      }
      const a = fv.analyzeQuestion({ subject: q.subject, presentation: q.presentation, keyboard_type: q.keyboard_type, case_sensitive: undefined, answer: q.answer, question: q.question, metadata: q.metadata });
      if (a.errors.length) { console.error(`✗ ${label}: would be invalid:\n    ${a.errors.join('\n    ')}`); bad++; continue; }
      // physics/chemistry have no modelled character set yet, so check the bare-numeric claim here.
      const alts = q.answer.filter(Boolean).flatMap((x) => x.split('|'));
      if (!alts.every((x) => /^-?[0-9]+(\.[0-9]+)?$/.test(x))) { console.error(`✗ ${label}: answer is not bare numeric: ${show(alts)}`); bad++; continue; }
      plan.push({ id: r.id, label, beforeKb: r.keyboard_type, afterKb: expectKb, beforeMeta: r.metadata, afterMeta: q.metadata });
    }
  }

  for (const p of plan) {
    const metaChanged = show(p.beforeMeta) !== show(p.afterMeta);
    console.log(`✓ ${p.label}: keyboard_type ${p.beforeKb} -> ${p.afterKb}${metaChanged ? `\n    metadata:\n      - ${show(p.beforeMeta)}\n      + ${show(p.afterMeta)}` : ''}`);
  }
  console.log(`\n${plan.length} rows ready (${plan.filter((p) => show(p.beforeMeta) !== show(p.afterMeta)).length} with metadata markup), ${bad} problem(s).`);
  if (bad > 0) { process.exitCode = 1; console.log('Nothing written.'); return; }
  if (!apply) { console.log('Dry run — nothing written. Re-run with --apply.'); return; }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of plan) {
      await client.query('UPDATE questions SET keyboard_type=$2, metadata=$3, updated_at=now() WHERE id=$1', [p.id, p.afterKb, p.afterMeta]);
    }
    await client.query('COMMIT');
    console.log(`Applied to dev: ${plan.length} questions updated (updated_at bumped).`);
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(closePool);
