'use strict';
// Authoring helpers for Accounting 2025 Nov P1 (adapted from the Tourism generator; adds CLOSED-FIG-03 statement figures). Emits the standard add-*.js upload script per lesson (core/upload-pipeline.md Phase 4).
// Deterministic placement keeps the paper-level MC index-0 tally low (DESIGN-UNI-06) and multi-select correct options off the ends (DESIGN-UNI-16).

const SUBJECT = 'accounting';
const YEAR = 2025;
const PAPER = 'nov_p1';
const MC_POS = [2, 1, 3, 2, 3, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 3, 2, 1, 3, 0];
let mcCounter = 0;
const MS_POS = { 2: [[1, 3], [2, 3], [1, 2]], 3: [[1, 2, 3], [1, 3, 2], [2, 3, 1]] };
let msCounter = 0;

const pad = (arr, n) => { const a = arr.slice(); while (a.length < n) a.push(''); return a; };

// Section defaults per question
function base(o, order) {
  return {
    unit: o.unit, topic: o.topic, subtopic: o.subtopic || 'acc_term_recall', skills: [o.skill],
    difficulty: o.diff || 2, exam_weight: o.w || 2, xp: 10, order,
    syllabus: 'dbe', subject: SUBJECT, year: YEAR, paper: PAPER, type: o.type || 'application', ...(o.fig !== undefined ? { _fig: o.fig } : {}),
  };
}

// multiple choice: correct + 3 wrongs (or 2 wrongs → 3 options + pad). Options never exceed 4 real entries here.
function mc(q, correct, wrongs, o = {}) {
  const n = wrongs.length + 1;
  let pos = o.pos !== undefined ? o.pos : MC_POS[mcCounter++ % MC_POS.length];
  if (pos >= n) pos = n - 1 - (pos % 2 === 0 ? 0 : 0);
  const opts = wrongs.slice(); opts.splice(pos, 0, correct);
  return { q, o, make: (order) => ({ name: `Question ${order}`, question: q, metadata: pad(opts, 5), answer: pad([correct], 5), presentation: 'multiple_choice', ...base(o, order), ...(o.clues ? { clues: o.clues } : {}) }) };
}

// multi select: correct[] and wrong[] interleaved so no correct option is first or last
function ms(q, correct, wrong, o = {}) {
  const k = correct.length;
  const total = correct.length + wrong.length;
  const sets = MS_POS[k];
  let positions = sets ? sets[msCounter++ % sets.length] : null;
  let opts;
  if (total === 5 && positions) {
    opts = new Array(5).fill(null);
    positions.forEach((p, i) => { opts[p] = correct[i]; });
    let wi = 0; for (let i = 0; i < 5; i++) if (opts[i] === null) opts[i] = wrong[wi++];
  } else if (total === 4 && k === 2) {
    const p = [[1, 2], [1, 2]][0]; opts = new Array(4).fill(null); p.forEach((x, i) => { opts[x] = correct[i]; });
    let wi = 0; for (let i = 0; i < 4; i++) if (opts[i] === null) opts[i] = wrong[wi++];
  } else throw new Error('ms: unsupported shape ' + q);
  return { q, o, make: (order) => ({ name: `Question ${order}`, question: q, metadata: pad(opts, 5), answer: pad(correct, 5), presentation: 'multi_select', ...base(o, order), ...(o.clues ? { clues: o.clues } : {}) }) };
}

// match: pairs [[left,right],...] (≤4). left prefixes A.., right prefixes 1.. (right column is shuffled by the app; stored order is varied)
function mt(q, pairs, o = {}) {
  const L = pairs.map((p, i) => `${'ABCD'[i]} - ${p[0]}`);
  const rightOrder = pairs.map((_, i) => i);
  // rotate storage so the right column is not in matching order
  const rot = rightOrder.slice(1).concat(rightOrder[0]);
  const R = rot.map((idx, j) => `${j + 1} - ${pairs[idx][1]}`);
  const answer = pairs.map((_, i) => `${'ABCD'[i]}-${rot.indexOf(i) + 1}`);
  return { q, o, make: (order) => ({ name: `Question ${order}`, question: q, metadata: [...L, ...R], answer, presentation: 'match', ...base(o, order), ...(o.clues ? { clues: o.clues } : {}) }) };
}

// ordering: items given in correct order; stored in a deterministic scramble
function ord(q, items, o = {}) {
  const n = items.length;
  const perm = n === 3 ? [2, 0, 1] : n === 4 ? [2, 0, 3, 1] : n === 5 ? [3, 1, 4, 0, 2] : [4, 1, 5, 2, 0, 3];
  const meta = perm.map((i) => items[i]);
  return { q, o, make: (order) => ({ name: `Question ${order}`, question: q, metadata: meta, answer: items.slice(), presentation: 'ordering', ...base(o, order), ...(o.clues ? { clues: o.clues } : {}) }) };
}

// fill in the blank: tokens is the metadata array with '[ ]' markers; answers aligned to blanks; keyboard declared (KEYBOARD-04)
function fb(q, tokens, answers, keyboard, o = {}) {
  return { q, o, make: (order) => ({ name: `Question ${order}`, question: q, metadata: tokens, answer: pad(answers, 5), presentation: 'fitb', keyboard_type: keyboard, ...base(o, order), ...(o.clues ? { clues: o.clues } : {}), ...(o.case_sensitive ? { case_sensitive: true } : {}) }) };
}

// lesson: { order, name, marks, tags[], qpages, mpages, subs:[{number,marks,clues,approach,solution}], qs:[...] }
function lesson(L) { return L; }

function urls(order, nq, nm) {
  const b = `https://media-dev.askmoreprepmore.app/exam_papers/dbe/${SUBJECT}/${YEAR}/${PAPER}/q${order}`;
  return { q: Array.from({ length: nq }, (_, i) => `${b}/question_${i + 1}.png`), m: Array.from({ length: nm }, (_, i) => `${b}/memo_${i + 1}.png`) };
}

function figUrl(order, idx) {
  return `https://media-dev.askmoreprepmore.app/question_supplementary/${SUBJECT}/${YEAR}/${PAPER}/q${order}/table_${idx + 1}.png`;
}

// ── statement figure helpers (CLOSED-FIG-03) ─────────────────────────────────
const fmt = (n) => (n < 0 ? '(' : '') + String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (n < 0 ? ')' : '');
const blank = (letter) => ({ blank: letter });
// Serialise a lesson's figure specs for render_statement.py; asserts every spec has a title and rows.
function writeSpecs(L, root) {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(root, 'temp', 'images', SUBJECT, String(YEAR), PAPER, 'specs');
  fs.mkdirSync(dir, { recursive: true });
  (L.figs || []).forEach((spec, i) => {
    if (!spec.title || !spec.rows || !spec.cols) throw new Error(`Lesson ${L.order} figure ${i}: needs title, cols, rows`);
    fs.writeFileSync(path.join(dir, `q${String(L.order).padStart(2, '0')}_table_${i + 1}.json`), JSON.stringify(spec, null, 1));
  });
}

function emit(L) {
  const u = urls(L.order, L.qpages, L.mpages);
  const questions = L.qs.map((x, i) => x.make(i + 1));
  for (const q of questions) {
    if (q._fig !== undefined) {
      const spec = L.figs[q._fig];
      if (!spec) throw new Error(`Lesson ${L.order}: question references missing figure ${q._fig}`);
      q.supplementary_material = { type: 'table', label: spec.title, image_urls: [figUrl(L.order, q._fig)] };
      delete q._fig;
    }
  }
  const video = {
    name: L.name, syllabus: 'dbe', subject: SUBJECT, year: YEAR, paper: PAPER, order: L.order, content_tier: 'free', has_video: false,
    xp: L.marks, tags: L.tags, question_image_urls: u.q, memo_image_urls: u.m, exam_question_marks: L.marks, supplementary_materials: L.supp || [],
  };
  const ai = {
    sub_questions: L.subs, model: 'claude-sonnet-5-5', generated_at: '__NOW__', version: 2, reviewed: false,
    input_tokens: 0, output_tokens: 0, avg_rating: null, rating_count: null,
  };
  const nn = String(L.order).padStart(2, '0');
  const file = `scripts/add-accounting-2025-nov-p1-l${nn}.js`;
  const j = (x) => JSON.stringify(x, null, 2).replace('"__NOW__"', 'Date.now()');
  const src = `#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — ${L.name} (order ${L.order})
 * ${L.covers}
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script ${file} --curriculum temp/curriculum-vocab-accounting.json
 *   node ${file} --dry-run
 *   node ${file}
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = ${j(video)};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = ${j(questions)};

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = ${j(ai)};

// ─── Upload ──────────────────────────────────────────────────────────────────

async function preflightReferenceIds(pool) {
  const used = referenceIdsUsed(video, questions);
  const missing = [];
  for (const [table, ids] of Object.entries(used)) {
    if (ids.length === 0) continue;
    const { rows } = await pool.query(\`SELECT id FROM \${table} WHERE id = ANY($1)\`, [ids]);
    const present = new Set(rows.map((r) => r.id));
    for (const id of ids) if (!present.has(id)) missing.push({ table, id });
  }
  if (missing.length > 0) {
    console.error('\\n❌ Missing reference rows (create them before uploading — PIPE-08):');
    for (const m of missing) console.error(\`   \${m.table}: \${m.id}\`);
    process.exit(1);
  }
}

async function upload() {
  const { lessonId, rows } = buildContentRows(video, questions, aiExplanation);
  const pool = getPool(ENV);

  if (!DRY_RUN) await preflightReferenceIds(pool);

  const byTable = {};
  for (const spec of rows) {
    await upsertRow(spec, spec.row, { dryRun: DRY_RUN, env: ENV });
    byTable[spec.table] = (byTable[spec.table] ?? 0) + 1;
  }

  console.log(\`\\n\${DRY_RUN ? '[dry-run] ' : ''}✅ lesson \${lessonId} (\${ENV})\`);
  for (const [t, n] of Object.entries(byTable)) console.log(\`   \${t}: \${n}\`);

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
`;
  return { file, src, questions, video };
}

// AI explanation sub-question: bullets for clues/approach, numbered lines for the solution (AIEXP-03/04)
function ex(number, marks, clues, approach, solution) {
  return { number, marks, clues: clues.map((c) => `- ${c}`).join('\n'), approach: approach.map((c) => `- ${c}`).join('\n'), solution: solution.map((c, i) => `${i + 1}. ${c.replace(/^\d+\.\s*/, '')}`).join('\n') };
}

module.exports = { mc, ms, mt, ord, fb, lesson, emit, ex, fmt, blank, writeSpecs, figUrl };
