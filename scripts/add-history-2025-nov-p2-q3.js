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
  memo_image_urls: null, // no marking guideline sourced yet for this paper (subject profile, "Not yet sourced")
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
// Derived directly from Sources 3A-3D (no marking guideline sourced yet for this paper —
// subject profile flags this; answers below are grounded in the source text itself, since
// this paper's own sub-questions are largely direct source-comprehension items).

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
      solution: '1. Source 3A names "Russia, Brazil and China" (foreign affairs ministers) "and the minister of defence of India".\n2. Answer: Russia, Brazil, China and India.',
    },
    {
      number: '3.1.3',
      marks: 2,
      clues: "- A summit is a high-level meeting, usually between heads of state or top leaders.\n- Contrast this with an ordinary ministerial meeting.",
      approach: "- Define 'summit' using its general meaning.\n- Note the level of leader typically involved.",
      solution: "1. A 'summit' is a formal meeting between heads of state, government, or other top-level leaders to discuss important matters.\n2. It is distinguished from lower-level meetings (such as the 2006 ministerial meeting) by the seniority of the representatives involved.",
    },
    {
      number: '3.1.4',
      marks: 4,
      clues: '- Consider how many countries BRICS now includes, and what this means for its collective size and influence.\n- Think about the term "BRICS+" and what a larger group can achieve that a smaller one cannot.',
      approach: '- Note which countries joined and what resources/regions they represent (e.g. energy-rich Gulf states).\n- Explain how this expands BRICS\'s combined economic and political weight.',
      solution: "1. The addition of Egypt, Iran, the UAE, Saudi Arabia and Ethiopia significantly increases BRICS's combined population, economic output and geographic reach, including major energy-producing nations.\n2. This expansion strengthens BRICS's ability to challenge Western-led international institutions and to promote a multi-polar world order, as stated in Source 3A.\n3. It also broadens BRICS's influence across the Middle East and North/East Africa, regions not previously represented in the group.",
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
      clues: "- The source itself defines this term in brackets right after it is first used.\n- Think about which currency BRICS wants to move away from.",
      approach: "- Locate where 'de-dollarisation' first appears in Source 3B.\n- Use the bracketed explanation given immediately after it.",
      solution: "1. Source 3B explains de-dollarisation as replacing the US dollar in international trade with an independent payment system using BRICS member currencies.\n2. This is intended to reduce the impact of Western (especially US) sanctions on BRICS members.",
    },
    {
      number: '3.2.3',
      marks: 2,
      clues: '- The reason is given directly in the third paragraph of Source 3B.',
      approach: '- Re-read the paragraph about the agricultural sector for the stated reason.',
      solution: "1. Source 3B states BRICS wants to create an independent grain trading system to increase its negotiating power in grain prices and to combat sanctions imposed by the United States and its G7 partners.",
    },
    {
      number: '3.2.4',
      marks: 4,
      clues: '- Think about what "diminished US influence" would mean for other countries and institutions that currently rely on US-led systems.',
      approach: "- Explain what reduced US influence over global trade/finance would mean in practice.\n- Link this to a shift toward a more multi-polar international order.",
      solution: "1. Diminished US influence would weaken Washington's ability to use economic tools such as sanctions and dollar-based trade to pressure other countries.\n2. Other nations, especially in the Global South, would gain more room to trade and cooperate independently of US-led systems.\n3. This would push the world toward a more multi-polar order, with power more evenly distributed between the Global North and Global South, rather than concentrated in the US and its allies.",
    },
    {
      number: '3.3.1',
      marks: 4,
      clues: '- Compare the labelled percentages for each bloc across the three years shown (1995, 2010, 2023).',
      approach: "- Read the G7's percentage in each of the three years and describe the trend.\n- Read BRICS's percentage in each of the three years and describe the trend.",
      solution: "1. (a) The G7's share of global GDP steadily declined, from 44.9% in 1995 to 34.3% in 2010 to 29.6% in 2023.\n2. (b) BRICS's share of global GDP steadily increased, from 16.9% in 1995 to 26.6% in 2010 to 32.1% in 2023 — overtaking the G7's share by 2023.",
    },
    {
      number: '3.3.2',
      marks: 4,
      clues: "- China is one of the BRICS countries shown in the graph.\n- Think about how one country's growth can lift the whole bloc's global standing.",
      approach: "- Note that China is the largest economy within BRICS.\n- Explain how its GDP growth contributes to BRICS's overall rising share of global GDP, and what this means for global power balance.",
      solution: "1. China's rapid economic growth from 1995 to 2023 was the single largest contributor to BRICS's overall share of global GDP rising from 16.9% to 32.1%.\n2. This growth gives China (and by extension BRICS) far greater economic leverage and influence in global trade and finance.\n3. It implies a significant shift in global economic power away from the traditionally dominant G7 nations toward China and the wider Global South.",
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
      solution: "1. Source 3D states BRICS+ countries are critical of the 'rules-based' international order established by the US during the Bretton Woods era, which they see as benefitting the West (especially the US) over the Global South.",
    },
    {
      number: '3.4.3',
      marks: 2,
      clues: '- Think about what such a large share of global GDP and population means for BRICS+\'s collective economic and political weight.',
      approach: "- Explain why a bloc with over a third of global GDP and nearly half the world's population becoming serious about de-dollarisation would worry US leaders.",
      solution: "1. A bloc controlling 35% of world GDP and 45% of the world's population has enormous potential economic weight.\n2. If such a large bloc successfully reduced its reliance on the US dollar, it would significantly weaken US economic leverage and the dollar's position as the world's dominant reserve currency.\n3. This represents a direct long-term threat to US global economic and political influence.",
    },
    {
      number: '3.4.4',
      marks: 4,
      clues: '- Think about who is speaking (a senior US political figure) and in what setting (a public campaign speech).',
      approach: "- Consider the value of hearing directly from Trump himself on this topic.\n- Consider any limitations of a campaign speech as a source.",
      solution: "1. The source is useful because it is a direct, first-hand quotation from Trump himself, giving unfiltered insight into how a senior US leader personally viewed the BRICS+ threat.\n2. However, it has limitations: campaign speeches are often exaggerated or aimed at a domestic political audience, so the tone and claims may not fully reflect calm, considered US policy.\n3. Overall it is useful for showing Trump's personal reaction and rhetoric, but should be checked against more formal policy sources for balance.",
    },
    {
      number: '3.5',
      marks: 4,
      clues: '- Look for a numeric/statistical claim in Source 3D that the graph in Source 3C can visually confirm.',
      approach: "- Identify a specific claim Source 3D makes about BRICS's economic weight.\n- Match it to the actual data shown in Source 3C's graph.",
      solution: "1. Source 3D claims BRICS+ countries form 35% of the world's GDP, a claim of growing economic weight relative to the West.\n2. Source 3C's graph provides supporting evidence for this trend, showing BRICS's share of global GDP rising from 16.9% in 1995 to 32.1% in 2023, overtaking the G7's declining share.\n3. The graph's hard data backs up Source 3D's concern that BRICS's economic weight is now large enough to challenge the existing US/G7-led balance of power.",
    },
    {
      number: '3.6',
      marks: 8,
      clues: '- Draw on all four sources plus your own knowledge of global power shifts.\n- Aim for a short, structured paragraph, not a list.',
      approach: "- Identify BRICS's growth and expansion (3A).\n- Identify its strategic challenges to Western economic dominance (3B).\n- Identify the hard data showing the shift in global GDP share (3C).\n- Identify how this is perceived as a direct threat by US leaders (3D).\n- Link these into one flowing paragraph.",
      solution: "1. BRICS has grown from a small four-country grouping in 2006 into a much larger bloc, adding South Africa in 2011 and five more countries in 2024 (Source 3A).\n2. It is actively pursuing strategies such as de-dollarisation and an independent payment system to reduce Western economic leverage over its members (Source 3B).\n3. This shift is measurable: BRICS's share of global GDP rose from 16.9% in 1995 to 32.1% in 2023, overtaking the G7's declining share (Source 3C).\n4. US leaders, including Trump, view this expansion and de-dollarisation drive as a direct threat to American economic and political influence, given BRICS+'s huge share of world GDP and population (Source 3D).\n5. Together, these sources show BRICS's expansion genuinely threatens to shift the global balance of power away from the Global North toward the Global South.",
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
