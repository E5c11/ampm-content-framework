#!/usr/bin/env node
/**
 * DBE History P2 — November 2025 — Question 3 (order 3)
 * The End of the Cold War and a New World Order, 1989 to the Present —
 * BRICS expansion and the Global North/South balance of power.
 * Source-based question (Sources 3A-3D): DESIGN-HIST-01 (same real sources as worked
 * example, fresh interpretive-angle practice questions); DESIGN-HIST-03 (fitb numeric-only).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p2-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-history-2025-nov-p2-q3.js --dry-run
 *   node scripts/add-history-2025-nov-p2-q3.js
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

const video = {
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'history',
  year: 2025,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['brics', 'global_north_south_relations', 'de_dollarisation', 'source_reliability'],
  question_image_urls: [`${IMG}/q3/question_1.png`, `${IMG}/q3/question_2.png`],
  memo_image_urls: [`${IMG}/q3/memo_1.png`, `${IMG}/q3/memo_2.png`, `${IMG}/q3/memo_3.png`, `${IMG}/q3/memo_4.png`, `${IMG}/q3/memo_5.png`],
  exam_question_marks: 50,
  supplementary_materials: [
    { type: 'source', label: 'Source 3A', image_urls: [`${IMG}/q3/annexure_3A.png`] },
    { type: 'source', label: 'Source 3B', image_urls: [`${IMG}/q3/annexure_3B.png`] },
    { type: 'source', label: 'Source 3C', image_urls: [`${IMG}/q3/annexure_3C.png`] },
    { type: 'source', label: 'Source 3D', image_urls: [`${IMG}/q3/annexure_3D.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────
// Fresh interpretive-angle questions on the SAME real sources (DESIGN-HIST-01) — different
// facts/angles than the real exam's own 3.1-3.6, never its stems or marks.

const questions = [
  {
    name: 'Question 1',
    question: "According to Source 3A, which country's representative at the first 2006 BRIC meeting held a different government role from the other three countries' representatives?",
    metadata: ['Russia', 'Brazil', 'China', 'India', ''],
    answer: ['India', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
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
    clues: '- Source 3A names the government role of each representative at the first meeting.\n- Three countries sent their ministers of foreign affairs — one sent a different minister.',
  },
  {
    name: 'Question 2',
    question: 'According to Source 3A, the first BRIC summit (as opposed to the 2006 ministerial meeting) took place in Yekaterinburg, Russia, on 16 June [].',
    metadata: [
      'According to Source 3A, the first BRIC summit (as opposed to the 2006 ministerial meeting) took place in Yekaterinburg, Russia, on 16 June ',
      '[ ]',
      '.',
    ],
    answer: ['2009', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
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
    clues: '- The summit date is stated in the second paragraph of Source 3A.\n- Write the year only, as four digits.',
  },
  {
    name: 'Question 3',
    question: "According to Source 3C, BRICS's share of global GDP grew from 16.9% in 1995 to 32.1% in 2023 - an increase of [] percentage points.",
    metadata: [
      "According to Source 3C, BRICS's share of global GDP grew from 16.9% in 1995 to 32.1% in 2023 - an increase of ",
      '[ ]',
      ' percentage points.',
    ],
    answer: ['15.2', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
    subtopic: 'evidence_extraction',
    skills: ['calculate_change_from_data'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Both figures are labelled directly on the graph's 1995 and 2023 bars.\n- Subtract the earlier figure from the later one.",
  },
  {
    name: 'Question 4',
    question: "In Source 3B, BRICS's ambition to influence the global energy market by including energy-rich nations is compared to which existing organisation?",
    metadata: [
      'The United Nations (UN)',
      'The World Trade Organisation (WTO)',
      'OPEC (Organisation of the Petroleum Exporting Countries)',
      'The International Monetary Fund (IMF)',
      '',
    ],
    answer: ['OPEC (Organisation of the Petroleum Exporting Countries)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
    subtopic: 'evidence_extraction',
    skills: ['identify_evidence_from_a_source'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- The comparison is made directly in Source 3B's second paragraph, discussing energy-rich new members.",
  },
  {
    name: 'Question 5',
    question: 'Source 3A lists five countries (Egypt, Iran, the UAE, Saudi Arabia and Ethiopia) that joined BRICS on 1 January 2024. Which of the following, based on Source 3D\'s footnote, helps explain why a sixth country might originally have been expected to join too?',
    metadata: [
      'China refused to allow a sixth country to join',
      'Argentina had already withdrawn from BRICS+ after a change in government, before the 1 January 2024 date',
      'The sixth country failed to pay its membership fees',
      "The United Nations blocked the sixth country's application",
      '',
    ],
    answer: ['Argentina had already withdrawn from BRICS+ after a change in government, before the 1 January 2024 date', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
    subtopic: 'evidence_extraction',
    skills: ['corroborate_evidence_across_sources'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Look at Source 3D's *BRICS+ footnote for a country that is mentioned as no longer part of the group.\n- Think about the timing: did this happen before or after 1 January 2024?",
  },
  {
    name: 'Question 6',
    question: "According to Source 3D, BRICS+ countries make up [] % of the world's population.",
    metadata: [
      "According to Source 3D, BRICS+ countries make up ",
      '[ ]',
      "% of the world's population.",
    ],
    answer: ['45', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
    subtopic: 'evidence_extraction',
    skills: ['extract_numeric_evidence_from_source'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- The population figure is given alongside the GDP figure in Source 3D's second paragraph.\n- Write the number only, no % sign.",
  },
  {
    name: 'Question 7',
    question: "According to the footnote in Source 3D, what does it mean 'to hedge your bets'?",
    metadata: [
      'To commit fully to one option no matter the risk',
      'To avoid committing oneself when faced with a difficult choice, protecting against making the wrong one',
      'To bet money on the outcome of an election',
      "To follow the United States' foreign policy unconditionally",
      '',
    ],
    answer: ['To avoid committing oneself when faced with a difficult choice, protecting against making the wrong one', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
    subtopic: 'historical_terminology',
    skills: ['define_historical_term'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- The definition is given directly in the footnote below Source 3D.",
  },
  {
    name: 'Question 8',
    question: 'Arrange these BRICS milestones, drawn from Source 3A, in the order they happened.',
    metadata: [
      'Five new countries join BRICS',
      'First BRIC ministerial meeting held in New York',
      'South Africa joins, forming BRICS',
      'First BRIC summit held in Yekaterinburg',
    ],
    answer: [
      'First BRIC ministerial meeting held in New York',
      'First BRIC summit held in Yekaterinburg',
      'South Africa joins, forming BRICS',
      'Five new countries join BRICS',
    ],
    presentation: 'ordering',
    type: 'interpretation',
    unit: 'end_of_cold_war_new_world_order',
    topic: 'brics_expansion_new_world_order',
    subtopic: 'evidence_extraction',
    skills: ['sequence_historical_events'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Source 3A tells this history in chronological paragraphs, from the first 2006 meeting through to 2024.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question ───
// Aligned against the official marking guideline (files/History P2 Nov 2025 MG Eng.pdf,
// pages 16-20), sourced 2026-09-12. Superseded an earlier source-text-only derivation —
// 3.1.4/3.2.4/3.4.3/3.4.4/3.5/3.6 needed the memo's specific accepted points (UN
// collaboration leverage, Global North's ageing population vs BRICS+'s workforce, the
// New Development Bank, Thailand's interest in joining), several of which a plain
// close-reading of the sources alone would not have produced.

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1.1',
      marks: 1,
      clues: "- The date is stated in the first sentence of Source 3A.",
      approach: '- Re-read the opening sentence of Source 3A for the exact date.',
      solution: '1. Source 3A states the first meeting in the BRIC format took place "on 20 September 2006".\n2. Answer: 20 September 2006.',
    },
    {
      number: '3.1.2',
      marks: 4,
      clues: '- The four countries are named together in the first paragraph of Source 3A.',
      approach: '- Re-read the first paragraph for the four countries whose ministers attended.',
      solution: '1. Russia.\n2. Brazil.\n3. China.\n4. India.',
    },
    {
      number: '3.1.3',
      marks: 2,
      clues: "- A summit is a high-level meeting, usually between heads of government.\n- Contrast this with an ordinary ministerial meeting.",
      approach: "- Define 'summit' using its general meaning.\n- Note the level of leader typically involved.",
      solution: "1. A summit is a high-level meeting/conference of heads of government.",
    },
    {
      number: '3.1.4',
      marks: 4,
      clues: '- Think about BRICS\'s political leverage (e.g. at the United Nations) as well as its economic weight.\n- Consider what "more inclusive" and "equal trading partner" mean for the Global North\'s own position.',
      approach: '- Note the political/diplomatic angle (UN collaboration, recognition as an equal partner), not only the economic angle.\n- Combine any two distinct points for four marks.',
      solution: "1. It helped strengthen BRICS countries to challenge the Global North/the balance of power, and neutralised the Global North's domination.\n2. It provided more BRICS members to collaborate at the United Nations.\n3. It offered support and development (political, economic and social) to members of Third World countries (the Global South).\n4. It directly threatened the Global North to recognise the Global South as an equal trading partner.\n5. It made BRICS more inclusive.\n6. Any two of these, explained, answer the question.",
    },
    {
      number: '3.2.1',
      marks: 2,
      clues: '- The three strategic initiatives are listed together in the first paragraph of Source 3B.\n- You need any TWO of the three.',
      approach: '- Re-read the first paragraph of Source 3B for the list of initiatives.',
      solution: '1. Source 3B lists: an AI governance framework, an independent economic system, and regional security coalitions.\n2. Any two of these three are acceptable.',
    },
    {
      number: '3.2.2',
      marks: 2,
      clues: "- The source itself defines this term in brackets right after it is first used.\n- Think about which currency BRICS wants to move away from, and what replaces it.",
      approach: "- Locate where 'de-dollarisation' first appears in Source 3B.\n- Use the bracketed explanation given immediately after it.",
      solution: "1. De-dollarisation is the reduction of dependence on the US dollar in global trade by BRICS member states.\n2. It involves the increased use of local BRICS currencies as a substitute for the dollar in international trade transactions, and the establishment of an international payment system not reliant on dollar payments.",
    },
    {
      number: '3.2.3',
      marks: 2,
      clues: '- The reason is given directly in the third paragraph of Source 3B.',
      approach: '- Re-read the paragraph about the agricultural sector for the stated reason.',
      solution: "1. To create an independent grain trading system.\n2. This would increase the organisation's negotiating power in grain prices and help combat sanctions by the United States and its G7 partners.",
    },
    {
      number: '3.2.4',
      marks: 4,
      clues: '- Think about what "diminished US influence" would mean both for global trade rules and for the Global South\'s own standing.',
      approach: "- Explain what reduced US leadership of the Global North/de-dollarisation would mean for the US's world position.\n- Link this to a narrowing of the gap between developed and developing countries.",
      solution: "1. The US would lose its position as leader of the Global North through de-dollarisation, and the Global North would surrender its dominant position in the world.\n2. This would open doors for a shift in global leadership.\n3. Free trade under a changed order would narrow the economic gap between underdeveloped and developed countries.\n4. It would give the Global South a meaningful role in sharing political and economic spheres in the world.\n5. Any two of these, explained, answer the question.",
    },
    {
      number: '3.3.1',
      marks: 4,
      clues: '- Compare the labelled percentages for each bloc across the three years shown (1995, 2010, 2023), and think about what the trend itself implies, not just the numbers.',
      approach: "- Describe the G7's trend and what it implies about its influence.\n- Describe BRICS's trend and what it implies about its influence.",
      solution: "1. (a) The G7's GDP share noted a steady decline, meaning shrinking influence, and the gap between the G7 and developing countries was narrowing.\n2. (b) BRICS's GDP share noted a steady increase between 1995 and 2023, meaning growing influence — China and India in particular contributed more to economic development in BRICS countries.",
    },
    {
      number: '3.3.2',
      marks: 4,
      clues: "- China is one of the BRICS countries shown in the graph.\n- Think about China's position within BRICS specifically, not only its effect on the world generally.",
      approach: "- Describe the shape of China's growth (gradual/steady).\n- Explain what this positions China as, both within BRICS and globally.",
      solution: "1. It represents a gradual/steady rise in GDP.\n2. This positions China as a leader within the BRICS countries.\n3. It implies China is an emerging global power.\n4. It also implies China is challenging the dominance of the USA.\n5. Any two of these, explained, answer the question.",
    },
    {
      number: '3.4.1',
      marks: 1,
      clues: '- Trump is speaking about countries considering an alternative to the US dollar.',
      approach: '- Re-read the introduction to Source 3D for who this speech was aimed at.',
      solution: '1. Source 3D states Trump was referring to BRICS+ countries.\n2. Answer: BRICS+ (countries).',
    },
    {
      number: '3.4.2',
      marks: 2,
      clues: '- The reason is stated directly in the first paragraph of Source 3D.',
      approach: "- Re-read the first paragraph for BRICS+ countries' view of the Bretton Woods-era order.",
      solution: "1. BRICS+ countries are critical of the 'rules-based' international order, established by the United States.\n2. They see it as benefitting the West (especially the United States) over the emerging Global South.",
    },
    {
      number: '3.4.3',
      marks: 2,
      clues: "- Think beyond GDP alone: consider what BRICS+'s POPULATION size means, especially compared to the Global North's own demographic trend.",
      approach: "- Link the GDP figure to a threat to Global North economic dominance/the dollar.\n- Link the population figure specifically to the Global North's ageing/declining population, and to BRICS+'s workforce advantage.",
      solution: "1. The GDP of BRICS+ represents an emerging economic power and a threat to the economic dominance of the Global North, including a possible threat to the dominance of the US dollar in international trade if de-dollarisation proceeds.\n2. The substantial population of BRICS+ is a threat because the population of the Global North is generally ageing and in decline in many countries, while the large population of BRICS+ represents a large workforce that can fuel economic growth.",
    },
    {
      number: '3.4.4',
      marks: 4,
      clues: '- Think about who is speaking, in what role, and how the timing of the speech connects to actual BRICS developments.',
      approach: "- Note Trump's specific role and position at the time of the speech.\n- Note the timing relative to BRICS's own recent expansion.",
      solution: "1. It is part of a speech delivered by Trump at a campaign rally when he felt threatened by BRICS's expansion — it gives insight into Trump's own perspective.\n2. Trump gave the speech as president-elect of the USA and the leading figure of the Global North, worried about the growth of the Global South.\n3. Trump addressed the rally soon after six new members had joined BRICS.\n4. It highlights how Trump was concerned about de-dollarisation by BRICS+.",
    },
    {
      number: '3.5',
      marks: 4,
      clues: '- Match specific claims in Source 3D to specific data/details in Source 3C\'s graph, point for point.',
      approach: '- Pair the graph\'s declining-G7/rising-BRICS trend with Source 3D\'s de-dollarisation claim.\n- Pair the graph\'s specific percentage with Source 3D\'s own percentage claim.\n- Pair the graph\'s named leading countries with Source 3D\'s mention of US-China tension.',
      solution: "1. Source 3C shows the declining G7 economic power, and Source 3D refers to BRICS countries leaving the dollar (de-dollarisation).\n2. Source 3C shows BRICS's GDP increasing to 32.1% over time, and Source 3D indicates BRICS countries formed 35% of the world's GDP — both sources show BRICS's GDP forming over 30% of the world's GDP.\n3. Source 3C shows the USA and China as the dominating leaders for the G7 and BRICS respectively, and Source 3D refers to a trade war between China and the USA as dominating powers.\n4. Any two of these paired comparisons, explained, answer the question.",
    },
    {
      number: '3.6',
      marks: 8,
      clues: '- Draw on all four sources plus your own knowledge of BRICS institutions and its wider international appeal.\n- Aim for a short, structured paragraph, not a list.',
      approach: "- Identify BRICS's founding purpose and expansion (3A).\n- Identify its strategic economic challenges to the West (3B).\n- Add own-knowledge institutional detail (the New Development Bank; other countries interested in joining).\n- Identify how Trump/the USA perceives this as a threat (3D).\n- Link these into one flowing paragraph.",
      solution: "1. The expansion of BRICS members from BRIC to BRICS+ was meant to challenge the Global North, since BRICS was created to focus on emerging markets and developing countries in the Global South (Source 3A).\n2. A priority of BRICS+ is to promote the formation of a multi-polar world order and strengthen global security, rejecting unilateral coercive measures used by the West — BRICS is seen as a way to counter-balance the economic dominance of the G7 (Source 3A, own knowledge).\n3. BRICS is challenging the international order through an AI governance framework, an independent economic system and regional security coalitions, aiming at de-dollarisation and diminishing the effect of Western sanctions, including an energy partnership and an independent grain trading system (Source 3B).\n4. BRICS created the New Development Bank (NDB) as an alternative to Western financial institutions like the IMF and World Bank, and other countries, such as Thailand, have shown interest in joining, which would further upset the existing global order (own knowledge).\n5. De-dollarisation is recognised as a threat by Donald Trump/the USA, given that BRICS+ countries form 35% of the world's GDP and 45% of the world's population, and possible sanctions or tariffs by Trump could ironically consolidate China's leadership of BRICS+ and lead to more innovation and integration among the Global South (Source 3D).",
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
