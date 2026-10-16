'use strict';
// Authoring helpers for Agricultural Sciences 2024 Nov P2 (adapted from scripts/_gen/accounting-p2/lib.js). Emits the standard add-*.js upload
// script per lesson (core/upload-pipeline.md Phase 4). Deterministic placement keeps the paper-level MC index-0 tally low (DESIGN-UNI-06)
// and multi-select correct options off the ends (DESIGN-UNI-16).

const SUBJECT = 'agricultural_sciences';
const YEAR = 2024;
const PAPER = 'nov_p2';
const MC_POS = [2, 1, 3, 2, 3, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 3, 2, 1, 3, 2, 1, 3, 2, 1, 0];
let mcCounter = 0;
const MS_POS = { 2: [[1, 3], [2, 3], [1, 2]], 3: [[1, 2, 3], [1, 3, 2], [2, 3, 1]] };
let msCounter = 0;

const U = { AMM: 'agricultural_management_and_marketing', PF: 'production_factors', GEN: 'basic_agricultural_genetics' };
const pad = (arr, n) => { const a = arr.slice(); while (a.length < n) a.push(''); return a; };

function base(o, order) {
  return {
    type: o.type || 'application', unit: U[o.unit] || o.unit, topic: o.topic, subtopic: o.subtopic || 'agri_term_recall', skills: [o.skill],
    difficulty: o.diff || 2, exam_weight: o.w || 2, xp: 10, order,
    syllabus: 'dbe', subject: SUBJECT, year: YEAR, paper: PAPER, ...(o.fig !== undefined ? { _fig: o.fig } : {}),
  };
}
const tail = (o) => (o.clues ? { clues: o.clues.map((c) => `- ${c}`).join('\n') } : {});

// multiple choice: correct + 3 wrongs
function mc(q, correct, wrongs, o = {}) {
  const n = wrongs.length + 1;
  let pos = o.pos !== undefined ? o.pos : MC_POS[mcCounter++ % MC_POS.length];
  if (pos >= n) pos = n - 1;
  const opts = wrongs.slice(); opts.splice(pos, 0, correct);
  return { make: (order) => ({ name: `Question ${order}`, question: q, metadata: pad(opts, 5), answer: pad([correct], 5), presentation: 'multiple_choice', ...base(o, order), ...tail(o) }) };
}

// multi select: 5 options, 2 or 3 correct, never first or last
function ms(q, correct, wrong, o = {}) {
  const k = correct.length;
  if (correct.length + wrong.length !== 5 || !MS_POS[k]) throw new Error('ms: needs 5 options with 2 or 3 correct — ' + q);
  const positions = MS_POS[k][msCounter++ % MS_POS[k].length];
  const opts = new Array(5).fill(null);
  positions.forEach((p, i) => { opts[p] = correct[i]; });
  let wi = 0; for (let i = 0; i < 5; i++) if (opts[i] === null) opts[i] = wrong[wi++];
  return { make: (order) => ({ name: `Question ${order}`, question: q, metadata: opts, answer: pad(correct, 5), presentation: 'multi_select', ...base(o, order), ...tail(o) }) };
}

// match: pairs [[left,right],...] (≤4); right column stored rotated
function mt(q, pairs, o = {}) {
  const rights = pairs.map((p) => p[1]);
  if (new Set(rights).size !== rights.length) throw new Error('mt: duplicate right-column labels — ' + q);
  const L = pairs.map((p, i) => `${'ABCD'[i]} - ${p[0]}`);
  const rot = pairs.map((_, i) => i).slice(1).concat(0);
  const R = rot.map((idx, j) => `${j + 1} - ${pairs[idx][1]}`);
  const answer = pairs.map((_, i) => `${'ABCD'[i]}-${rot.indexOf(i) + 1}`);
  return { make: (order) => ({ name: `Question ${order}`, question: q, metadata: [...L, ...R], answer, presentation: 'match', ...base(o, order), ...tail(o) }) };
}

// ordering: items in correct order; stored scrambled
function ord(q, items, o = {}) {
  const n = items.length;
  const perm = n === 3 ? [2, 0, 1] : n === 4 ? [2, 0, 3, 1] : n === 5 ? [3, 1, 4, 0, 2] : [4, 1, 5, 2, 0, 3];
  return { make: (order) => ({ name: `Question ${order}`, question: q, metadata: perm.map((i) => items[i]), answer: items.slice(), presentation: 'ordering', ...base(o, order), ...tail(o) }) };
}

// fill in the blank: label then one blank; keyboard declared (KEYBOARD-04)
function fb(q, label, answer, keyboard, o = {}) {
  return { make: (order) => ({ name: `Question ${order}`, question: q, metadata: [label, '[ ]'], answer: pad([answer], 5), presentation: 'fitb', keyboard_type: keyboard, ...base(o, order), ...tail(o) }) };
}

// AI explanation sub-question: bullets for clues/approach, numbered solution lines (AIEXP-03/04)
function ex(number, marks, clues, approach, solution) {
  return { number, marks, clues: clues.map((c) => `- ${c}`).join('\n'), approach: approach.map((c) => `- ${c}`).join('\n'), solution: solution.map((c, i) => `${i + 1}. ${c}`).join('\n') };
}

function urls(order, nq, nm) {
  const b = `https://media-dev.askmoreprepmore.app/exam_papers/dbe/${SUBJECT}/${YEAR}/${PAPER}/q${order}`;
  return { q: Array.from({ length: nq }, (_, i) => `${b}/question_${i + 1}.png`), m: Array.from({ length: nm }, (_, i) => `${b}/memo_${i + 1}.png`) };
}
const figUrl = (order, type) => `https://media-dev.askmoreprepmore.app/question_supplementary/${SUBJECT}/${YEAR}/${PAPER}/q${order}/${type}_1.png`;

// lesson: { order, name, covers, marks, tags[], qpages, mpages, fig?: {type, label}, subs: [...ex], qs: [...] }
function emit(L) {
  const u = urls(L.order, L.qpages, L.mpages);
  const questions = L.qs.map((x, i) => x.make(i + 1));
  for (const q of questions) {
    if (q._fig !== undefined) {
      if (!L.fig) throw new Error(`Lesson ${L.order}: question uses a figure but the lesson has none`);
      q.supplementary_material = { type: L.fig.type, label: L.fig.label, image_urls: [figUrl(L.order, L.fig.type)] };
      delete q._fig;
    }
  }
  const video = {
    name: L.name, syllabus: 'dbe', subject: SUBJECT, year: YEAR, paper: PAPER, order: L.order, content_tier: 'free', has_video: false,
    xp: L.marks, tags: L.tags, question_image_urls: u.q, memo_image_urls: u.m, exam_question_marks: L.marks, supplementary_materials: [],
  };
  const ai = {
    sub_questions: L.subs, model: 'claude-sonnet-5-5', generated_at: '__NOW__', version: 2, reviewed: false,
    input_tokens: 0, output_tokens: 0, avg_rating: null, rating_count: null,
  };
  const nn = String(L.order).padStart(2, '0');
  const file = `scripts/add-agricultural-sciences-${YEAR}-nov-p2-l${nn}.js`;
  const j = (x) => JSON.stringify(x, null, 2).replace('"__NOW__"', 'Date.now()');
  const src = `#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November ${YEAR} — ${L.name} (order ${L.order})
 * ${L.covers} Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 * Generated by scripts/_gen/agri-2024-p2/gen.js.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script ${file} --curriculum temp/curriculum-vocab-agricultural-sciences-p2-2024.json
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

module.exports = { mc, ms, mt, ord, fb, ex, emit };
