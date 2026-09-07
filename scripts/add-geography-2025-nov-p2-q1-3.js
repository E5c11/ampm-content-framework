#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 1.3 (order 3)
 * Rural settlement issues: rural depopulation trend/impact, land reform (restitution vs
 * redistribution vs tenure reform, implementation models), strategies to address
 * depopulation after land reform.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q1-3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q1-3.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q1-3.js
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
  name: 'Question 1.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['rural_depopulation', 'land_reform'],
  question_image_urls: [`${IMG}/q3/question_1.png`, `${IMG}/q3/question_2.png`],
  memo_image_urls: [`${IMG}/q3/memo_1.png`],
  exam_question_marks: 15,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions (DESIGN-UNI-08: relational framing) ────────

const questions = [
  {
    name: 'Question 1',
    question: "A graph shows a country's rural population percentage falling steadily from 38% in 2016 to 24% in 2024. What social impact would this declining trend most likely have on the community that remains in rural areas?",
    metadata: [
      'Overcrowding of rural schools and clinics',
      'A shortage of young, working-age people to farm the land and support the community',
      'A sharp increase in rural land prices due to high demand',
      'An oversupply of rural housing causing prices to fall sharply',
      '',
    ],
    answer: ['A shortage of young, working-age people to farm the land and support the community', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['rural_depopulation_impact'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- People leaving rural areas are mostly working-age adults seeking jobs elsewhere.\n- The people and skills that remain behind are what the rural economy and community depend on.',
  },
  {
    name: 'Question 2',
    question: 'Match each land reform type to what distinguishes it.',
    metadata: [
      'A - Land restitution',
      'B - Land redistribution',
      'C - Land tenure reform',
      '1 - Returning specific land to people or their descendants who can prove it was taken from them under discriminatory laws',
      '2 - Making land more widely available to previously disadvantaged people, without requiring proof of prior dispossession',
      '3 - Securing the legal rights of people already living on or working land they do not formally own',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['land_reform_types'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Restitution is specifically about correcting a past, provable act of dispossession.\n- Redistribution is broader — it does not require proving the land was taken from that specific person.',
  },
  {
    name: 'Question 3',
    question: 'A community that received their land back through a restitution programme decides to keep ownership themselves but partner with an established commercial farming company, who brings capital, skills and market access, in exchange for a share of the profits. Which land restitution implementation model is this?',
    metadata: ['Full community takeover', 'Joint venture', 'Leaseback to the previous owner', 'Sale of the land to a new owner', ''],
    answer: ['Joint venture', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['land_reform_models'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The community keeps ownership (a stake) but shares operations and profit with an outside partner — that combination defines a joint venture.\n- A full takeover would mean the community runs the farm entirely alone.',
  },
  {
    name: 'Question 4',
    question: 'Select the strategies that would most effectively reduce rural depopulation after a land reform programme has taken place.',
    metadata: [
      'Creating local jobs through agri-processing facilities on the land',
      'Improving rural roads, transport links and other infrastructure',
      'Closing the local school to reduce municipal costs',
      'Providing skills training and financial support to new farmers',
      '',
    ],
    answer: [
      'Creating local jobs through agri-processing facilities on the land',
      'Improving rural roads, transport links and other infrastructure',
      'Providing skills training and financial support to new farmers',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['rural_depopulation_strategies'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Effective strategies give people reasons to stay: jobs, infrastructure, and the skills/support to make new land productive.\n- Cutting services (like closing a school) would push depopulation further, not reduce it.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.3.1',
      marks: 1,
      clues: '- Read the value directly off the 2024 bar in the graph.',
      approach: '- Locate 2024 on the horizontal axis and read the corresponding bar value.',
      solution: '1. The 2024 bar reads 31,18%.\n2. Answer: 31,18%',
    },
    {
      number: '1.3.2',
      marks: 1,
      clues: '- Compare the first bar (2017) to the last bar (2024) — is it rising or falling overall?',
      approach: '- Track the bar heights from 2017 through to 2024.',
      solution: '1. The bars decrease steadily from 34,66% (2017) to 31,18% (2024).\n2. Answer: Downward/decreasing trend',
    },
    {
      number: '1.3.3',
      marks: 4,
      clues: '- A shrinking rural population means fewer people to support local services, jobs and infrastructure.',
      approach: '- Link the declining trend to its knock-on social effects on those who remain.',
      solution: '1. Fewer people remaining means declining employment opportunities and a shrinking labour force.\n2. Services and facilities become harder to sustain with a smaller population base.\n3. Quality of life and infrastructure deteriorate as investment follows population.\n4. Any two well-explained impacts (e.g. loss of services, declining infrastructure, increased poverty) are accepted.',
    },
    {
      number: '1.3.4',
      marks: 2,
      clues: '- Restitution specifically means returning land — or compensating for it — to those it was taken from.',
      approach: '- Recall the definition of land restitution as a specific type of land reform.',
      solution: '1. Land restitution is the process of returning land to its rightful owners (or compensating them) after it was taken away under discriminatory laws.\n2. Answer: returning the land to its rightful owners / compensation for the land forcefully taken away',
    },
    {
      number: '1.3.5',
      marks: 1,
      clues: '- Look for the specific model named in the extract: how the Moletele community structured their restitution.',
      approach: "- Identify the phrase in the extract describing the community's choice of restitution approach.",
      solution: '1. The extract states the Moletele community "opted to take their land back."\n2. Answer: they opted to take their land back (full community ownership)',
    },
    {
      number: '1.3.6',
      marks: 6,
      clues: '- Strategies should address what a newly-restituted community needs to succeed and stay on the land.',
      approach: '- Consider what support (skills, finance, infrastructure, partnerships) helps a land reform beneficiary community remain productive and stay put.',
      solution: '1. Facilitate skills training and technical/financial support for new farmers.\n2. Create local employment opportunities and form business partnerships.\n3. Improve rural infrastructure and services.\n4. Any three well-explained strategies are accepted.',
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
