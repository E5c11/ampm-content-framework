#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 9 (order 12)
 * Electrodynamics: an AC generator operating a fan. One continuous scenario across
 * 9.1-9.5 — bundled per DESIGN-UNI-10.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q9.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q9.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';
const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['ac_generator', 'dc_motor'],
  question_image_urls: [`${PAPER}/q9/question_1.png`],
  memo_image_urls: [`${PAPER}/q9/memo_1.png`, `${PAPER}/q9/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following correctly describes the rms potential difference of an AC source?',
    metadata: [
      'The average potential difference over one full cycle.',
      'The maximum potential difference reached during one cycle.',
      'The DC potential difference that would dissipate the same amount of power in a resistor as the AC source does.',
      'Half of the maximum potential difference.',
      '',
    ],
    answer: ['The DC potential difference that would dissipate the same amount of power in a resistor as the AC source does.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['rms_potential_difference'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The average of a full AC cycle is actually zero — rms is defined differently, via an equivalent heating/power effect.\n- Think in terms of comparing AC to an equivalent constant (DC) source.',
  },
  {
    name: 'Question 2',
    question:
      'A simplified AC generator coil rotates between two magnet poles. At a particular instant, the induced current in the coil (as viewed from outside the coil) flows from left to right through the near side of the coil. If the magnet on the left of the coil is a SOUTH pole, what is the polarity of the magnet on the right?',
    metadata: ['North', 'South', 'Cannot be determined', 'Neither — it must be non-magnetic', ''],
    answer: ['North', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['generator_polarity'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Magnetic field lines cross the gap between the two magnets, pointing away from one pole and toward the other.\n- The two magnets facing each other must have opposite poles for a uniform field to exist between them.',
  },
  {
    name: 'Question 3',
    question:
      'Complete the working to find the cost of operating a circuit for 2 hours. An AC generator produces a maximum potential difference of 200 V across a resistance of 50 Ω; electricity costs R2.50 per kWh.',
    metadata: ['V_rms = V_max/√2 = 200/√2 = 141.42 V', '[ ]', '[ ]', '[ ]'],
    answer: ['P_ave = V_rms²/R = (141.42)²/50 = 400 W', 'E = P_ave × Δt = 0.4 kW × 2 h = 0.8 kWh', 'Cost = E × tariff = 0.8 × 2.50 = R2.00'],
    presentation: 'steps',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['ac_power_cost_calculation'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- First find V_rms from V_max, then use P_ave = V_rms²/R.\n- Convert power to kW and multiply by the time in hours to get energy in kWh, then multiply by the tariff.',
  },
  {
    name: 'Question 4',
    question:
      'A generator’s induced-emf-vs-time graph is a sine curve. If the coil’s speed of rotation is doubled (with all else unchanged), how will the new graph compare to the original?',
    metadata: [
      'Same amplitude, same period.',
      'Bigger amplitude, half the period.',
      'Smaller amplitude, double the period.',
      'Same amplitude, double the period.',
      '',
    ],
    answer: ['Bigger amplitude, half the period.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['generator_graph_interpretation'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Peak EMF is proportional to the rotational speed — think about what doubling speed does to the peak value.\n- A faster rotation completes each cycle in less time.',
  },
  {
    name: 'Question 5',
    question: 'Match each generator component to the type of generator it is used in.',
    metadata: [
      'A - Two continuous slip rings',
      'B - A split-ring commutator',
      '1 - AC generator',
      '2 - DC generator',
    ],
    answer: ['A-1', 'B-2'],
    presentation: 'match',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_motor_commutator',
    skills: ['commutator_function'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- One component maintains continuous contact throughout each rotation; the other switches contacts every half-turn.\n- Switching the connection every half-turn is what keeps the output current flowing in one direction only.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1', marks: 2,
      clues: '- rms is defined by an equivalent heating/power effect, not a simple average.\n- Compare it to an equivalent constant (DC) source.',
      approach: '- Recall that the average of a sine wave over a full cycle is zero, so rms can’t simply mean "average."\n- State it in terms of an equivalent DC value that produces the same power/heating effect.',
      solution: '1. The rms potential difference is the AC potential difference/voltage that produces/dissipates the same amount of energy as an equivalent DC potential difference/voltage.',
    },
    {
      number: '9.2', marks: 2,
      clues: '- Use the right-hand rule (or the motor/generator effect) with the given current direction and rotation to find the field direction between the poles.\n- Field lines always point away from one pole and toward the opposite pole — work out which pole must be on the right for the field to point the way you found.',
      approach: '- Apply the appropriate hand rule to the coil’s current direction and motion to find the field direction.\n- Match the field direction to the polarity of magnet Z.',
      solution: '1. N (North).',
    },
    {
      number: '9.3', marks: 5,
      clues: '- First find V_rms from V_max, then use P_ave = V_rms²/R.\n- Convert power to kW, multiply by time in hours, then by the tariff.',
      approach: '- Calculate V_rms = V_max/√2.\n- Calculate average power: P_ave = V_rms²/R.\n- Calculate energy used: E = P_ave × Δt (converted to kWh).\n- Multiply by the tariff to get the cost.',
      solution: '1. V_rms = 311.11/√2 = 219.99 V\n2. P_ave = V_rms²/R = (219.99)²/60 = 806.59 W = 0.80659 kW\n3. E = Pave × Δt = 0.80659 × 1.5 = 1.21 kWh\n4. Cost = E × tariff = 1.21 × 3.33 = R4.03',
    },
    {
      number: '9.4', marks: 3,
      clues: '- Speed of rotation affects both the peak EMF (amplitude) and how quickly each cycle completes (period).\n- Doubling speed affects these two properties in specific, opposite ways.',
      approach: '- Recall that peak EMF is proportional to rotational speed — doubling speed doubles the amplitude.\n- Recall that a faster rotation completes each cycle in less time — doubling speed halves the period.\n- Sketch the new graph with these two changes.',
      solution: '1. Graph B (doubled speed) has double the amplitude of graph A.\n2. Graph B has half the period of graph A.\n3. Both remain a correctly-shaped sine/cosine curve.',
    },
    {
      number: '9.5', marks: 1,
      clues: '- The structural difference between an AC and DC generator is in how the rotating coil connects to the external circuit.',
      approach: '- Identify the component responsible for reversing the connection every half-turn in a DC generator.',
      solution: '1. Replace the slip rings with a split-ring commutator.',
    },
  ],
  model: 'claude-sonnet-5', generated_at: Date.now(), version: 2, reviewed: false,
  input_tokens: 0, output_tokens: 0, avg_rating: null, rating_count: null,
};

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
  upload().catch((err) => { console.error('\n❌ Upload failed:', err.message); process.exitCode = 1; }).finally(closePool);
}
