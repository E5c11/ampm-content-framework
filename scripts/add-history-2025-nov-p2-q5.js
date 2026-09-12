#!/usr/bin/env node
/**
 * DBE History P2 — November 2025 — Question 5 (order 5)
 * The Coming of Democracy to South Africa and Coming to Terms with the Past —
 * The Negotiated Settlement, 1990-1994. Essay question, Section B.
 * DESIGN-HIST-02: no free-text essay input exists in the app — practice questions teach
 * the essay-argument skill objectively (thesis identification, evidence, PEEL structure)
 * plus fresh content-knowledge questions on the real historical period.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p2-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-history-2025-nov-p2-q5.js --dry-run
 *   node scripts/add-history-2025-nov-p2-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'history',
  year: 2025,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['negotiated_settlement', 'codesa', 'civil_resistance', 'essay_writing_skills'],
  question_image_urls: [`${IMG}/q4/question_1.png`],
  memo_image_urls: [`${IMG}/q5/memo_1.png`, `${IMG}/q5/memo_2.png`],
  exam_question_marks: 50,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Which event postponed the talks between the ANC and the National Party that had been scheduled for 31 March 1990?',
    metadata: [
      'The Boipatong Massacre',
      'The killing of defenceless demonstrators in Sebokeng',
      'The assassination of Chris Hani',
      'The Bisho Massacre',
      '',
    ],
    answer: ['The killing of defenceless demonstrators in Sebokeng', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
    subtopic: 'evidence_extraction',
    skills: ['sequence_historical_events'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This event happened before the Boipatong and Bisho Massacres, which came later in 1992.\n- Think about which violent incident directly delayed the very first round of talks.',
  },
  {
    name: 'Question 2',
    question: 'Nelson Mandela was released from prison on 11 February [].',
    metadata: [
      'Nelson Mandela was released from prison on 11 February ',
      '[ ]',
      '.',
    ],
    answer: ['1990', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
    subtopic: 'evidence_extraction',
    skills: ['extract_numeric_evidence_from_source'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This date opened the way to negotiations for a democratic South Africa.\n- Write the year only, as four digits.',
  },
  {
    name: 'Question 3',
    question: 'In the Groote Schuur Minute of 2 May 1990, what did the ANC and National Party commit themselves to?',
    metadata: [
      'Ending violence and negotiating',
      'Holding immediate elections',
      'Disbanding Umkhonto we Sizwe immediately',
      'Sharing power equally regardless of election results',
      '',
    ],
    answer: ['Ending violence and negotiating', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This was an early, general commitment made right at the start of formal talks, before any of the detailed constitutional negotiations.',
  },
  {
    name: 'Question 4',
    question: 'Which of the following are examples of violence that threatened to derail the negotiation process between 1990 and 1994?',
    metadata: [
      'The Boipatong Massacre',
      'The Bisho Massacre',
      'The assassination of Chris Hani',
      'The signing of the National Peace Accord',
      'The Groote Schuur Minute',
    ],
    answer: [
      'The Boipatong Massacre',
      'The Bisho Massacre',
      'The assassination of Chris Hani',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
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
    clues: '- Three of these are acts of violence; two are formal, non-violent negotiation milestones.\n- A "Minute" and an "Accord" are both agreements, not attacks.',
  },
  {
    name: 'Question 5',
    question: 'Arrange these milestones of the negotiation process in the order they happened.',
    metadata: [
      'Record of Understanding is signed',
      'CODESA 1 is held',
      'Pretoria Minute is signed',
      'National Peace Accord is signed',
      'Groote Schuur Minute is signed',
      'CODESA 2 fails',
    ],
    answer: [
      'Groote Schuur Minute is signed',
      'Pretoria Minute is signed',
      'National Peace Accord is signed',
      'CODESA 1 is held',
      'CODESA 2 fails',
      'Record of Understanding is signed',
    ],
    presentation: 'ordering',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
    subtopic: 'evidence_extraction',
    skills: ['sequence_historical_events'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The two "Minutes" came first, in 1990, followed by the Peace Accord in 1991.\n- CODESA 1 (Dec 1991) came before CODESA 2 (May 1992), which failed just months before the Record of Understanding (Sept 1992).',
  },
  {
    name: 'Question 6',
    question: 'Why did CODESA 2 (May 1992) fail to reach an agreement?',
    metadata: [
      'The ANC withdrew from negotiations entirely',
      'The parties could not agree on how power would be shared',
      'The National Party refused to attend',
      'International sanctions forced its collapse',
      '',
    ],
    answer: ['The parties could not agree on how power would be shared', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- CODESA 2 ended in deadlock over one specific constitutional issue, not a walkout by either side.',
  },
  {
    name: 'Question 7',
    question: "Which thesis statement best matches an essay required to 'critically discuss' whether the road to democracy (1990-1994) was purely a non-violent process of negotiation?",
    metadata: [
      'The road to democracy was completely peaceful throughout',
      'While 1990-1994 was driven by formal negotiations such as CODESA, it was also marked by serious violence, including the Boipatong and Bisho Massacres, which nearly derailed the process',
      'Nelson Mandela was released from prison in 1990',
      'There were many political parties involved in the negotiations',
      '',
    ],
    answer: ['While 1990-1994 was driven by formal negotiations such as CODESA, it was also marked by serious violence, including the Boipatong and Bisho Massacres, which nearly derailed the process', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
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
    clues: "- 'Critically discuss' means your thesis should weigh up both sides, not take a one-sided extreme position.\n- A fact on its own (a date, an event) is not a thesis — a thesis makes an arguable claim.",
  },
  {
    name: 'Question 8',
    question: 'Which of the following pieces of evidence would be relevant to include in an essay discussing BOTH the negotiated and violent aspects of the 1990-1994 period?',
    metadata: [
      'CODESA negotiations and the National Peace Accord',
      'The Boipatong and Bisho Massacres',
      'The assassination of Chris Hani',
      'The result of the 2019 general election',
      'The Cuban Missile Crisis of 1962',
    ],
    answer: [
      'CODESA negotiations and the National Peace Accord',
      'The Boipatong and Bisho Massacres',
      'The assassination of Chris Hani',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'coming_of_democracy',
    topic: 'negotiated_settlement_1990_1994',
    subtopic: 'essay_argumentation',
    skills: ['evaluate_a_counter_argument'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Relevant evidence must fall within the 1990-1994 period and directly relate to South Africa\'s negotiated settlement.\n- Two of these options are real historical events, but from the wrong period or the wrong country entirely.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — essay guidance, one entry (real exam has
// no numbered sub-questions here) ─────────────────────────────────────────────────
// Derived from the official marking guideline (files/History P2 Nov 2025 MG Eng.pdf,
// pages 23-24): synopsis, main aspects, and the level-based rubric, summarised as
// guidance rather than a model essay (DESIGN-HIST-02 — no free-text essay exists here).

const aiExplanation = {
  sub_questions: [
    {
      number: '5',
      marks: 50,
      clues: "- The instruction is 'critically discuss' — your essay needs to weigh up both the non-violent negotiations AND the violence, not argue only one side.\n- Organise your evidence chronologically or thematically (negotiation milestones vs. violent incidents).",
      approach: "- Take a critical stance: the period had genuine negotiation, but was seriously threatened by violence throughout.\n- Devote paragraphs to both the negotiation timeline (Minutes, Accords, CODESA) and the violent incidents (massacres, assassinations), following Point-Evidence-Explanation-Link in each.\n- Explicitly connect specific violent events to specific negotiation setbacks (e.g. how a massacre affected the talks).\n- Conclude by weighing which force — negotiation or violence — was ultimately more decisive, or that both were inseparable.",
      solution: "1. Introduction: take a critical stance — the road to democracy combined genuine, sustained negotiation with serious violence that repeatedly threatened to derail it.\n2. Non-violent negotiation evidence: Mandela's release (11 Feb 1990), the Groote Schuur Minute (2 May 1990, ending violence/negotiating), the Pretoria Minute (Aug 1990, ANC ends armed struggle), the National Peace Accord (14 Sept 1991), CODESA 1 (21 Dec 1991), the Declaration of Intent, and the Record of Understanding (26 Sept 1992, Sunset clause).\n3. Violent evidence: the Sebokeng killings that postponed the March 1990 talks, the Melrose House grenade attack (May 1990), CODESA 2's deadlock and Ventersdorp violence (May 1992), the Boipatong Massacre (June 1992), the Bisho Massacre (Sept 1992), the assassination of Chris Hani (April 1993), the AWB's storming of the World Trade Centre (June 1993), and further massacres (St James Church, Heidelberg Tavern, Bophuthatswana, Shell House) up to the 1994 election itself.\n4. Link the two: show how specific violence repeatedly interrupted or endangered specific negotiations (e.g. Sebokeng delaying talks, CODESA 2's collapse preceding renewed violence).\n5. Conclusion: weigh the two forces — negotiation ultimately succeeded (elections held 27-29 April 1994, Mandela becomes president of a Government of National Unity), but only by continuously managing and surviving serious violence, not despite its complete absence.",
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
