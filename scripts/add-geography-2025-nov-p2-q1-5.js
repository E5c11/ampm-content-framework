#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 1.5 (order 5)
 * Urban settlement issues: urban blight/decay causes and consequences, municipal
 * service-delivery challenges, and urban renewal's economic impact. 1.5.4's real exam
 * sub-question is an 8-mark extended paragraph with no presentation-type equivalent —
 * reframed as an objective question testing the same reasoning (subject profile rule).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q1-5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q1-5.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q1-5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2025/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['urban_blight', 'urban_renewal'],
  question_image_urls: [`${IMG}/q5/question_1.png`],
  memo_image_urls: [`${IMG}/q5/memo_1.png`, `${IMG}/q5/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions (DESIGN-UNI-08: relational framing) ────────

const questions = [
  {
    name: 'Question 1',
    question: 'Match each stage of the urban decline and renewal cycle to what happens at that stage.',
    metadata: [
      'A - Decline begins',
      'B - Decline continues unchecked',
      'C - Urban renewal intervenes',
      '1 - Property owners stop maintaining buildings and start neglecting the area',
      '2 - Businesses close down and the municipality stops responding to complaints',
      '3 - Investment returns, buildings are restored, and property values start recovering',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'urban_blight_and_renewal',
    skills: ['urban_blight_decline_renewal_cycle'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Decline is a process, not a single event — neglect leads to closure, which leads to further neglect.\n- Renewal reverses the cycle rather than just stopping it.',
  },
  {
    name: 'Question 2',
    question: 'Select TWO social causes that typically contribute to urban blight/decay.',
    metadata: [
      'Property owners neglecting or abandoning their buildings instead of maintaining them',
      'Rising crime and a sense of insecurity that discourages new investment',
      'A city building new parks and public spaces in the area',
      'A well-funded municipality upgrading services in the area',
      '',
    ],
    answer: [
      'Property owners neglecting or abandoning their buildings instead of maintaining them',
      'Rising crime and a sense of insecurity that discourages new investment',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'urban_blight_and_renewal',
    skills: ['urban_blight_causes'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Blight is driven by neglect and factors that discourage investment, not by improvements.\n- New parks and service upgrades are the opposite of decay — they are signs of investment, not causes of decline.',
  },
  {
    name: 'Question 3',
    question: 'A municipality has limited its response to repeated reports of urban decay in a certain suburb for over a decade. Which of the following is the most likely reason for this continued inaction?',
    metadata: [
      'The suburb has too much political influence for the municipality to act',
      'Competing budget priorities and limited municipal resources',
      'There is no legal mechanism that allows a municipality to address urban decay',
      'Urban decay always resolves itself over time without any intervention',
      '',
    ],
    answer: ['Competing budget priorities and limited municipal resources', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'urban_blight_and_renewal',
    skills: ['municipal_service_delivery_challenges'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Municipalities often have to choose between many competing needs with a limited budget.\n- Decay does not resolve on its own — it tends to worsen without deliberate intervention.',
  },
  {
    name: 'Question 4',
    question: 'Select the outcomes that represent a positive economic impact of urban renewal on a previously neglected area.',
    metadata: [
      'Increased property values attract new investment into the area',
      'More local jobs are created during and after redevelopment',
      'Every existing low-income resident is guaranteed to benefit equally from the changes',
      'Municipal tax revenue from the area increases as property values rise',
      '',
    ],
    answer: [
      'Increased property values attract new investment into the area',
      'More local jobs are created during and after redevelopment',
      'Municipal tax revenue from the area increases as property values rise',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'urban_blight_and_renewal',
    skills: ['urban_renewal_impact'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Renewal genuinely raises investment, jobs and tax revenue — but it does not automatically guarantee equal benefit for every existing resident (a real concern with gentrification).\n- Pick only the outcomes that are a direct, reliable economic result of renewal.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5.1',
      marks: 1,
      clues: '- Look for visible signs of neglect in the photograph: building condition, cleanliness, upkeep.',
      approach: '- Identify one visible feature in the photograph that signals decay.',
      solution: '1. The photograph shows neglected/dilapidated buildings, graffiti, and litter.\n2. Answer: any one — e.g. neglected buildings, broken windows, graffiti, litter',
    },
    {
      number: '1.5.2',
      marks: 2,
      clues: '- Social causes relate to people and behaviour, not physical/economic conditions directly.',
      approach: '- Recall social (not economic) causes of urban blight.',
      solution: '1. Unemployment and poverty reduce residents\' ability to maintain the area.\n2. Landlords lose interest in upgrading buildings, and illegal occupation can follow.\n3. Answer: any two — e.g. unemployment, poverty, abandoned buildings, illegal occupation',
    },
    {
      number: '1.5.3',
      marks: 4,
      clues: '- Think about what limits a municipality\'s ability to act: money, capacity, competing priorities, legal ownership issues.',
      approach: '- Suggest realistic constraints that would stop a municipality from addressing decay despite complaints.',
      solution: '1. Lack of finances or mismanagement of available funds.\n2. Other, more urgent municipal priorities competing for the same budget.\n3. Buildings being privately owned limits direct municipal action.\n4. Any two well-explained reasons are accepted.',
    },
    {
      number: '1.5.4',
      marks: 8,
      clues: '- Urban renewal\'s economic impact works through investment, jobs, and the local multiplier effect.',
      approach: '- Explain how restoring a decayed area attracts business, spending and investment, and how that ripples through the local economy.',
      solution: "1. Urban renewal attracts new businesses, investors and customers back to the area.\n2. This creates jobs directly (construction, new businesses) and indirectly through the multiplier effect.\n3. Rising property values increase municipal tax revenue, which can fund further improvements.\n4. Upskilling of local workers and improved infrastructure further strengthen the local economy.\n5. Any four well-explained economic benefits are accepted.",
    },
  ],
  model: 'claude-sonnet-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

// ─── Upload ──────────────────────────────────────────────────────────────────

async function preflightReferenceIds(pool) {
  const used = referenceIdsUsed(video, questions);
  const missing = [];
  for (const [table, ids] of Object.entries(used)) {
    if (ids.length === 0) continue;
    const { rows } = await pool.query(`SELECT id FROM ${table} WHERE id = ANY($1)`, [ids]);
    const present = new Set(rows.map((r) => r.id));
    for (const id of ids) if (!present.has(id)) missing.push({ table, id });
  }
  if (missing.length > 0) {
    console.error('\n❌ Missing reference rows (create them before uploading — PIPE-08):');
    for (const m of missing) console.error(`   ${m.table}: ${m.id}`);
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

  console.log(`\n${DRY_RUN ? '[dry-run] ' : ''}✅ lesson ${lessonId} (${ENV})`);
  for (const [t, n] of Object.entries(byTable)) console.log(`   ${t}: ${n}`);
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
