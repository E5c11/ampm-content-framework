#!/usr/bin/env node
/**
 * DBE History P2 — November 2025 — Question 4 (order 4)
 * Civil Resistance, 1970s-80s: South Africa — The Crisis of Apartheid in the 1980s
 * (Biko / Black Consciousness Movement). Essay question, Section B.
 * DESIGN-HIST-02: no free-text essay input exists in the app — practice questions teach
 * the essay-argument skill objectively (thesis identification, evidence, PEEL structure)
 * plus fresh content-knowledge questions on the real historical period.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p2-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-history-2025-nov-p2-q4.js --dry-run
 *   node scripts/add-history-2025-nov-p2-q4.js
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
// question_image_urls points at the shared Section B prompts page (q4/question_1.png,
// uploaded once) — Q4/Q5/Q6 all share the same physical exam page.

const video = {
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'history',
  year: 2025,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['black_consciousness_movement', 'soweto_uprising', 'civil_resistance', 'essay_writing_skills'],
  question_image_urls: [`${IMG}/q4/question_1.png`],
  memo_image_urls: [`${IMG}/q4/memo_1.png`, `${IMG}/q4/memo_2.png`],
  exam_question_marks: 50,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────
// DESIGN-UNI-01 fresh scenario for the content-knowledge items (Q1-Q6) — real history,
// freely reworkable relationally (DESIGN-UNI-08), never the exam's own essay stem.
// DESIGN-HIST-02 essay-strategy items (Q7-Q8) teach thesis/structure objectively.

const questions = [
  {
    name: 'Question 1',
    question: "What historical event directly created the 'political vacuum' that Black Consciousness philosophy filled from the late 1960s?",
    metadata: [
      'The Sharpeville Massacre of 1960 alone',
      'The banning of the ANC and PAC and imprisonment of their leaders in 1960',
      'The Soweto Uprising of 1976',
      'The assassination of Hendrik Verwoerd',
      '',
    ],
    answer: ['The banning of the ANC and PAC and imprisonment of their leaders in 1960', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Black Consciousness emerged specifically to fill a gap left by the removal of existing liberation organisations.\n- Think about what happened to the ANC and PAC in 1960.',
  },
  {
    name: 'Question 2',
    question: "SASO (South African Students' Organisation) was formed in 1968 by black students breaking away from which existing organisation?",
    metadata: [
      'The National Union of South African Students (NUSAS)',
      'The African National Congress (ANC)',
      "The Black People's Convention (BPC)",
      'The Pan Africanist Congress (PAC)',
      '',
    ],
    answer: ['The National Union of South African Students (NUSAS)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- SASO was formed by black students who felt an existing, mostly white-led student organisation did not represent their interests.\n- The organisation they broke away from is a national student union, not a political party.',
  },
  {
    name: 'Question 3',
    question: 'Which of the following organisations were directly inspired by, or aligned with, Black Consciousness philosophy?',
    metadata: [
      "South African Students' Organisation (SASO)",
      'South African Students Movement (SASM)',
      "Black People's Convention (BPC)",
      'Black Allied Workers Union (BAWU)',
      'United Democratic Front (UDF)',
    ],
    answer: [
      "South African Students' Organisation (SASO)",
      'South African Students Movement (SASM)',
      "Black People's Convention (BPC)",
      'Black Allied Workers Union (BAWU)',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Four of these five organisations were founded on, or grew out of, Black Consciousness philosophy directly.\n- One of these was only formed in 1983, as a broad non-racial front against a specific government reform — think about whether it fits the same BC lineage as the others.',
  },
  {
    name: 'Question 4',
    question: 'SASO was formed in [].',
    metadata: [
      'Year SASO was formed: ',
      '[ ]',
    ],
    answer: ['1968', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
    subtopic: 'evidence_extraction',
    skills: ['extract_numeric_evidence_from_source'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- SASO was formed the same year it broke away from NUSAS.\n- Write the year only, as four digits.',
  },
  {
    name: 'Question 5',
    question: 'Arrange these events in the order they happened.',
    metadata: [
      "Black People's Convention (BPC) is formed",
      'The Soweto Uprising begins',
      'SASO breaks away from NUSAS',
      'The ANC and PAC are banned, their leaders imprisoned',
    ],
    answer: [
      'The ANC and PAC are banned, their leaders imprisoned',
      'SASO breaks away from NUSAS',
      "Black People's Convention (BPC) is formed",
      'The Soweto Uprising begins',
    ],
    presentation: 'ordering',
    type: 'interpretation',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
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
    clues: '- The 1960 bannings created the vacuum Black Consciousness later filled.\n- Student organisation came before a broader political convention; the Soweto Uprising came last, in 1976.',
  },
  {
    name: 'Question 6',
    question: 'What specific government policy directly triggered the 1976 Soweto Uprising?',
    metadata: [
      'The Group Areas Act',
      'The compulsory use of Afrikaans as a medium of instruction in schools',
      'The Bantu Education Act of 1953',
      'The Pass Laws',
      '',
    ],
    answer: ['The compulsory use of Afrikaans as a medium of instruction in schools', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
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
    clues: "- The Bantu Education Act was already 23 years old by 1976 — it set up the unequal system, but wasn't the immediate spark.\n- Think about the specific 1975 circular requiring a particular language in schools.",
  },
  {
    name: 'Question 7',
    question: 'Which of the following is the strongest thesis statement for an essay arguing that Black Consciousness revived resistance to apartheid?',
    metadata: [
      'Black Consciousness was an idea some people had in the 1970s',
      'By instilling black pride and inspiring organisations like SASO and the BPC, Black Consciousness philosophy directly revived organised resistance to apartheid from the late 1960s',
      'Apartheid was a bad system that many people resisted',
      'This essay will discuss Black Consciousness',
      '',
    ],
    answer: ['By instilling black pride and inspiring organisations like SASO and the BPC, Black Consciousness philosophy directly revived organised resistance to apartheid from the late 1960s', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
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
    clues: '- A strong thesis takes a clear stance and previews the specific evidence that will support it.\n- The other options are either too vague, off-topic, or just announce the topic without arguing anything.',
  },
  {
    name: 'Question 8',
    question: 'Arrange these sentences into the correct order for one PEEL-structured body paragraph (Point, Evidence, Explanation, Link).',
    metadata: [
      'This renewed sense of identity and pride was the foundation on which organised political resistance, such as SASO and the BPC, could later be built',
      'This shows that the psychological impact of Black Consciousness went beyond politics, reshaping how black South Africans saw themselves',
      'Black Consciousness philosophy empowered black South Africans to reject feelings of inferiority imposed by apartheid',
      'For example, the philosophy encouraged people to reject skin-lightening products and embrace natural hairstyles as a rejection of white beauty standards',
    ],
    answer: [
      'Black Consciousness philosophy empowered black South Africans to reject feelings of inferiority imposed by apartheid',
      'For example, the philosophy encouraged people to reject skin-lightening products and embrace natural hairstyles as a rejection of white beauty standards',
      'This shows that the psychological impact of Black Consciousness went beyond politics, reshaping how black South Africans saw themselves',
      'This renewed sense of identity and pride was the foundation on which organised political resistance, such as SASO and the BPC, could later be built',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'civil_resistance_1970s_80s',
    topic: 'black_consciousness_movement',
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
// pages 21-22): synopsis, main aspects, and the level-based rubric, summarised as
// guidance rather than a model essay (DESIGN-HIST-02 — no free-text essay exists here).

const aiExplanation = {
  sub_questions: [
    {
      number: '4',
      marks: 50,
      clues: '- Take a clear stance (agree or disagree) in your introduction, not a neutral summary.\n- Group your evidence into themes: the political vacuum, the BC philosophy itself, the organisations it inspired, and its effect on the 1976 Soweto Uprising.',
      approach: "- State your stance in the introduction and preview the main themes you'll use to support it.\n- Devote one paragraph per theme, each following Point-Evidence-Explanation-Link.\n- Draw evidence from across the whole period (1960s political vacuum through to the 1976 uprising), not just one moment.\n- Conclude by directly restating how the evidence supports your stance.",
      solution: "1. Introduction: take a stance — the philosophy of Biko and the Black Consciousness Movement did revive resistance to apartheid from the 1960s to the 1970s.\n2. Background: the banning of the ANC and PAC in 1960, and the imprisonment of their leaders, created a political vacuum.\n3. Black Consciousness philosophy: instilled self-belief, self-confidence and pride, and rejected the internalised inferiority apartheid tried to impose (e.g. rejecting skin-lightening products, embracing natural hairstyles).\n4. Organisational impact: inspired SASO (1968, breaking from NUSAS), SASM (1972) and the BPC (1972, uniting students, churches, communities and trade unions), and unions such as BAWU (linked to the 1973 Durban strikes).\n5. Mobilisation of students: SASO and SASM exposed black students to BC ideals, contributing to the formation of the Soweto Students Representative Council and the resistance to Bantu Education/Afrikaans instruction that fed into the 1976 Soweto Uprising.\n6. Community and media impact: BC-inspired community self-reliance programmes (e.g. after Biko's banishment) and sympathetic media such as The World newspaper.\n7. Conclusion: sum up how this evidence, across politics, identity, organisation and mobilisation, supports the stance taken in the introduction.",
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
