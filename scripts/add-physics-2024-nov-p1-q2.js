#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 2 (order 5)
 * Static and kinetic friction: crate pulled by a hanging mass over a pulley; coefficient of static friction; acceleration from a graph.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q2.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q2.js
 */

'use strict';


const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2024/nov_p1';
const FORMULA_SHEET = {
  type: 'formula_sheet',
  label: 'Formula Sheet',
  image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
};

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 5, // after Q1 parts 1-4 (orders 1-4)
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['static_friction', 'kinetic_friction', 'newtons_second_law', 'free_body_diagram'],
  question_image_urls: [`${PAPER}/q2/question_1.png`],
  memo_image_urls: [`${PAPER}/q2/memo_1.png`, `${PAPER}/q2/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A 20 kg crate rests on a rough floor. The coefficient of static friction is 0.5. A horizontal push of 40 N is applied, and the crate does NOT move. What is the magnitude of the static frictional force on the crate?',
    metadata: ['98 N', '58 N', '0 N', '40 N', ''],
    answer: ['40 N', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'static_friction',
    skills: ['static_friction', 'force_balance'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- μₛN gives the MAXIMUM static friction. It is not the friction that acts at every moment.\n- The crate stays at rest, so the net horizontal force is zero.',
  },
  {
    name: 'Question 2',
    question:
      'A crate on a rough horizontal table is tied to a light string that runs horizontally over a pulley to a hanging mass. The crate is JUST ABOUT to start moving. Select ALL the horizontal forces acting ON THE CRATE.',
    metadata: [
      'Kinetic friction, directed away from the pulley',
      'Tension in the string, directed towards the pulley',
      'Weight of the hanging mass, directed towards the pulley',
      'Maximum static friction, directed away from the pulley',
      'Normal force, directed away from the pulley',
    ],
    answer: [
      'Tension in the string, directed towards the pulley',
      'Maximum static friction, directed away from the pulley',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'free_body_diagrams',
    skills: ['free_body_diagram', 'force_identification', 'static_friction'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Only forces exerted ON the crate belong on its diagram. The hanging mass pulls on the string, and the string pulls on the crate.\n- The crate is not sliding yet, so think about which type of friction acts.',
  },
  {
    name: 'Question 3',
    question:
      'A 6.4 kg crate on a rough horizontal table is connected over a frictionless pulley to a mass hanger. Mass pieces are added one at a time. The crate just begins to slide when the total hanging mass reaches 2.8 kg. Calculate the coefficient of static friction between the crate and the table.',
    metadata: ['μₛ = ', '[ ]'],
    answer: ['0.44|0.438', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'static_friction',
    skills: ['static_friction', 'force_balance', 'normal_force'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Just before sliding, the tension equals the hanging weight AND equals the maximum static friction.\n- The normal force on the crate on a horizontal table is its own weight.',
  },
  {
    name: 'Question 4',
    question:
      'A crate on a rough horizontal table is pulled by a string over a pulley to a mass hanger, and mass pieces are added one at a time. A graph of the crate’s acceleration against the hanging mass stays at zero until a certain hanging mass is reached, and only then rises. At the moment the crate starts to move, the weight of the hanging mass is equal to which force?',
    metadata: [
      'The kinetic frictional force on the crate',
      'The maximum static frictional force on the crate',
      'The gravitational force on the crate',
      'The normal force on the crate',
      '',
    ],
    answer: ['The maximum static frictional force on the crate', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'static_friction',
    skills: ['graph_interpretation', 'static_friction', 'force_balance'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- While the acceleration is zero, the crate is at rest and the forces on it are balanced.\n- Static friction grows to match the pull, up to a limit. What is that limit called?',
  },
  {
    name: 'Question 5',
    question:
      'A 5 kg crate on a rough horizontal table is connected by a light string over a frictionless pulley to a 4 kg hanging mass. The coefficient of kinetic friction is 0.30. Complete the working to calculate the magnitude of the acceleration of the crate.',
    metadata: [
      'For the crate: T − fₖ = ma, so T − (0.30)(5)(9.8) = 5a',
      'For the hanging mass: mg − T = ma, so (4)(9.8) − T = 4a',
      'Add the two equations: 39.2 − 14.7 = 9a, so a (in m·s⁻², to two decimal places):',
      '[ ]',
    ],
    answer: ['2.72'],
    presentation: 'steps',
    keyboard_type: 'physics',
    type: 'calc',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'kinetic_friction', 'net_force'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Adding the two equations cancels the tension T.\n- Divide the result by the total mass that is being accelerated.',
  },
  {
    name: 'Question 6',
    question:
      'A heavy book is placed inside a crate that rests on a rough horizontal table. How does the MAXIMUM static frictional force on the crate change?',
    metadata: [
      'It stays the same, because μₛ does not change',
      'It increases, because the normal force on the crate increases',
      'It decreases, because the crate is now harder to accelerate',
      'It increases, because μₛ increases with the mass of the crate',
      '',
    ],
    answer: ['It increases, because the normal force on the crate increases', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'static_friction',
    skills: ['static_friction', 'normal_force'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- fₛ(max) = μₛN. Which of these two factors does the book change?\n- μₛ depends only on the two surfaces in contact.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1',
      marks: 2,
      clues: '- Static friction acts on an object that is NOT moving.\n- What does it oppose, and in which direction does it act?',
      approach: '- Say what static friction opposes: the tendency of motion.\n- Say what kind of object it acts on: a stationary one.\n- Say how it is directed: parallel to the surface.',
      solution: '1. Static friction is the force that opposes the tendency of motion of a stationary object relative to a surface.\n2. It acts parallel to the surface.\n3. Key words that must be present: "opposes the tendency of motion", "stationary object", "relative/parallel to a surface".',
    },
    {
      number: '2.2',
      marks: 2,
      clues: '- Only HORIZONTAL forces are asked for.\n- The crate is about to move towards the pulley. What pulls it that way, and what holds it back?',
      approach: '- Draw the crate as a dot.\n- Draw the tension in the string pointing towards the pulley.\n- Draw maximum static friction pointing the opposite way. Label both arrows.',
      solution: '1. Tension (T or F(string)): horizontal, towards the pulley.\n2. Static friction (fₛ or fₛ(max)): horizontal, away from the pulley, opposing the tendency to move.\n3. Each force earns 1 mark for the arrow and label. Showing the vertical forces (w, N) is not penalised.',
    },
    {
      number: '2.3.1',
      marks: 4,
      clues: '- From the graph, the crate starts moving when the hanging mass is 4.2 kg.\n- At that moment the tension equals the hanging weight and also equals fₛ(max).',
      approach: '- For the hanging mass at rest: T = mg = (4.2)(9.8).\n- For the crate just before moving: T = fₛ(max) = μₛN = μₛ(8.5)(9.8).\n- Solve for μₛ.',
      solution: '1. Hanging mass (at rest): T = mg = (4.2)(9.8) = 41.16 N.\n2. Crate (just about to move): T − fₛ(max) = 0, so fₛ(max) = T.\n3. fₛ(max) = μₛN = μₛ(8.5)(9.8).\n4. μₛ(8.5)(9.8) = 41.16.\n5. μₛ = 0.49.',
    },
    {
      number: '2.3.2',
      marks: 5,
      clues: '- Point Y is at a hanging mass of 7.4 kg, so the crate is now sliding and kinetic friction acts.\n- Write Fnet = ma for the crate and for the hanging mass separately.',
      approach: '- Crate: T − μₖmg = ma, so T − (0.40)(8.5)(9.8) = 8.5a.\n- Hanging mass: mg − T = ma, so (7.4)(9.8) − T = 7.4a.\n- Add the equations to eliminate T and solve for a.',
      solution: '1. Crate: T − fₖ = ma, so T − (0.40)(8.5)(9.8) = 8.5a, giving T − 33.32 = 8.5a.\n2. Hanging mass: mg − T = ma, so (7.4)(9.8) − T = 7.4a, giving 72.52 − T = 7.4a.\n3. Adding: 72.52 − 33.32 = 15.9a, so 39.2 = 15.9a.\n4. a = 2.47 m·s⁻², so Y = 2.47 m·s⁻².\n5. (Check: T = 72.52 − 7.4(2.47) = 54.32 N.)',
    },
    {
      number: '2.4',
      marks: 2,
      clues: '- fₛ(max) = μₛN.\n- Adding the block changes one of these two factors.',
      approach: '- Note that μₛ depends only on the surfaces, so it does not change.\n- The extra 5 kg increases the weight of the crate and so the normal force.\n- Since fₛ(max) is proportional to N, decide the effect.',
      solution: '1. INCREASES.\n2. Reason: the normal force on the crate increases (its mass and weight increase), and fₛ(max) = μₛN, so fₛ(max) is directly proportional to N.',
    },
  ],
  model: 'claude-opus-5-5',
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
