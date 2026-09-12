#!/usr/bin/env node
/**
 * DBE History P2 — November 2025 — Question 6 (order 6)
 * The End of the Cold War and a New World Order — Glasnost, Perestroika and the
 * Collapse of the Soviet Union. Essay question, Section B.
 * DESIGN-HIST-02: no free-text essay input exists in the app — practice questions teach
 * the essay-argument skill objectively (thesis identification, evidence, PEEL structure)
 * plus fresh content-knowledge questions on the real historical period.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p2-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-history-2025-nov-p2-q6.js --dry-run
 *   node scripts/add-history-2025-nov-p2-q6.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────
// question_image_urls points at the shared Section B prompts page (uploaded once
// under q4/) — Q4/Q5/Q6 all share the same physical exam page.

const video = {
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'history',
  year: 2025,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['glasnost_perestroika', 'soviet_union_collapse', 'brics', 'essay_writing_skills'],
  question_image_urls: [`${IMG}/q4/question_1.png`],
  memo_image_urls: [`${IMG}/q6/memo_1.png`, `${IMG}/q6/memo_2.png`],
  exam_question_marks: 50,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Gorbachev became leader of the Soviet Union in [].',
    metadata: [
      'Year Gorbachev became Soviet leader: ',
      '[ ]',
    ],
    answer: ['1985', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'evidence_extraction',
    skills: ['extract_numeric_evidence_from_source'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- He introduced Perestroika the same year he took over.\n- Write the year only, as four digits.',
  },
  {
    name: 'Question 2',
    question: "Which of the following best defines 'Perestroika'?",
    metadata: [
      'A policy of political openness and transparency',
      'A policy of economic reconstruction, introducing limited private ownership into the Soviet economy',
      'A military alliance between the USSR and Eastern Europe',
      'A treaty ending the Cold War',
      '',
    ],
    answer: ['A policy of economic reconstruction, introducing limited private ownership into the Soviet economy', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'historical_terminology',
    skills: ['define_historical_term'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- 'Perestroika' is Russian for 'restructuring' — think about which part of Soviet life it restructured.",
  },
  {
    name: 'Question 3',
    question: "Which of the following best defines 'Glasnost'?",
    metadata: [
      'A policy of economic reconstruction',
      'A policy of openness and transparency, including reduced media censorship',
      'A trade agreement with the United States',
      'A programme to industrialise Soviet agriculture',
      '',
    ],
    answer: ['A policy of openness and transparency, including reduced media censorship', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'historical_terminology',
    skills: ['define_historical_term'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- 'Glasnost' is Russian for 'openness' — think about which freedoms it expanded.",
  },
  {
    name: 'Question 4',
    question: "Which of the following were direct consequences of Gorbachev's reforms, according to historical accounts?",
    metadata: [
      'Increased criticism of the government and of Gorbachev himself',
      'Job losses and rising inflation, leading to political dissatisfaction',
      'Nationalist movements in Soviet satellite states were emboldened',
      "The Soviet economy immediately became the strongest in the world",
      "The Communist Party's control over government was strengthened",
    ],
    answer: [
      'Increased criticism of the government and of Gorbachev himself',
      'Job losses and rising inflation, leading to political dissatisfaction',
      'Nationalist movements in Soviet satellite states were emboldened',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Three of these weakened Soviet stability; two describe the opposite of what actually happened.\n- Perestroika was poorly implemented, not an economic success story.",
  },
  {
    name: 'Question 5',
    question: 'Arrange these events in the order they happened.',
    metadata: [
      'The Berlin Wall falls',
      "Boris Yeltsin's Russia declares independence",
      'The Chernobyl disaster occurs',
      'Gorbachev becomes Soviet leader',
      'The Soviet Union is formally dissolved',
    ],
    answer: [
      'Gorbachev becomes Soviet leader',
      'The Chernobyl disaster occurs',
      'The Berlin Wall falls',
      "Boris Yeltsin's Russia declares independence",
      'The Soviet Union is formally dissolved',
    ],
    presentation: 'ordering',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'evidence_extraction',
    skills: ['sequence_historical_events'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Chernobyl happened early in Gorbachev\'s leadership, before either Glasnost or Perestroika had fully unfolded.\n- The Berlin Wall fell in 1989, before the USSR itself began to break apart in 1990-1991.',
  },
  {
    name: 'Question 6',
    question: 'What event is generally seen as symbolising the end of the Cold War?',
    metadata: [
      'The Chernobyl disaster',
      'The fall of the Berlin Wall in 1989',
      'Gorbachev winning the Nobel Peace Prize',
      'The Cuban Missile Crisis',
      '',
    ],
    answer: ['The fall of the Berlin Wall in 1989', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This event physically and symbolically ended the division between the communist East and capitalist West in Europe.',
  },
  {
    name: 'Question 7',
    question: "The essay question asks 'to what extent' Gorbachev's policies led to the Soviet collapse. Which thesis statement best matches this instruction?",
    metadata: [
      "Gorbachev's policies had nothing to do with the Soviet collapse",
      "Gorbachev's policies of Glasnost and Perestroika were, to a large extent, responsible for the Soviet collapse, though long-standing economic weaknesses and nationalist tensions also played a significant role",
      'The Soviet Union was a communist country until 1991',
      'This essay is about Gorbachev',
      '',
    ],
    answer: ["Gorbachev's policies of Glasnost and Perestroika were, to a large extent, responsible for the Soviet collapse, though long-standing economic weaknesses and nationalist tensions also played a significant role", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'essay_argumentation',
    skills: ['identify_a_strong_thesis_statement'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- 'To what extent' asks for a matter of degree, not an all-or-nothing answer.\n- A strong thesis acknowledges other contributing factors while still taking a clear position on the main one.",
  },
  {
    name: 'Question 8',
    question: 'Arrange these sentences into the correct order for one PEEL-structured body paragraph (Point, Evidence, Explanation, Link).',
    metadata: [
      "This loss of central control was a key factor that led directly to the USSR's dissolution in December 1991",
      "Glasnost's policy of increased openness ultimately weakened the Communist Party's grip on power",
      'This shows that openness, intended to modernise the system, instead exposed and accelerated its underlying weaknesses',
      'For example, reduced media censorship allowed open criticism of the government, while nationalist movements in the Soviet republics were emboldened to demand independence',
    ],
    answer: [
      "Glasnost's policy of increased openness ultimately weakened the Communist Party's grip on power",
      'For example, reduced media censorship allowed open criticism of the government, while nationalist movements in the Soviet republics were emboldened to demand independence',
      'This shows that openness, intended to modernise the system, instead exposed and accelerated its underlying weaknesses',
      "This loss of central control was a key factor that led directly to the USSR's dissolution in December 1991",
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'glasnost_perestroika_soviet_collapse',
    subtopic: 'essay_argumentation',
    skills: ['sequence_a_paragraph_structure'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Point states the claim; Evidence backs it with a specific example; Explanation says why the evidence matters; Link connects back to the essay\'s overall argument.\n- Look for the sentence that makes the broadest, most general claim first.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — essay guidance, one entry (real exam has
// no numbered sub-questions here) ─────────────────────────────────────────────────
// Derived from the official marking guideline (files/History P2 Nov 2025 MG Eng.pdf,
// pages 25-26): synopsis, main aspects, and the level-based rubric, summarised as
// guidance rather than a model essay (DESIGN-HIST-02 — no free-text essay exists here).

const aiExplanation = {
  sub_questions: [
    {
      number: '6',
      marks: 50,
      clues: "- The instruction is 'to what extent' — take a clear position on how much Gorbachev's own policies caused the collapse, while acknowledging other contributing factors.\n- Separate your evidence into background causes (pre-existing weaknesses) and the direct effects of Glasnost/Perestroika themselves.",
      approach: "- State your extent (e.g. 'to a large extent') in the introduction.\n- Cover the pre-existing weaknesses Gorbachev inherited, then Perestroika's effects, then Glasnost's effects, each as its own Point-Evidence-Explanation-Link paragraph.\n- End with the USSR's actual collapse as the outcome your evidence has been building toward.\n- Conclude by restating your extent and briefly weighing it against the other contributing factors.",
      solution: "1. Introduction: take a stance on the extent — Gorbachev's policies were, to a large/limited extent, responsible for the Soviet collapse.\n2. Background: the USSR inherited a weak, inefficient, corrupt system, crippled by the arms race, the war in Afghanistan, poor agriculture and the Chernobyl disaster (1986) — context Gorbachev did not create.\n3. Perestroika (1985): economic reconstruction allowing small-scale private ownership, reduced state control, and acceptance of some capitalist elements — poorly implemented, causing confusion, job losses and inflation.\n4. Glasnost: openness and reduced censorship allowed criticism of the government (including Gorbachev himself) and emboldened nationalist movements in the Soviet republics.\n5. Consequences: hardliners and liberals both turned against Gorbachev; the Berlin Wall fell (1989); by 1990 republics including Yeltsin's Russia declared independence; Gorbachev's own Federation of States proposal failed.\n6. Collapse: on 25 December 1991 the USSR was formally dissolved, the Communist Party disbanded, and the 15 republics became independent, joining the Commonwealth of Independent States — leaving the USA as the sole remaining superpower.\n7. Conclusion: weigh Gorbachev's reforms against the pre-existing structural weaknesses to justify the extent stated in the introduction.",
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
