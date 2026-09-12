#!/usr/bin/env node
/**
 * DBE History P2 — November 2025 — Question 1 (order 1)
 * Civil Resistance, 1970s-80s: South Africa — COSATU worker mobilisation.
 * Source-based question (Sources 1A-1D): DESIGN-HIST-01 (same real sources as worked
 * example, fresh interpretive-angle practice questions); DESIGN-HIST-03 (fitb numeric-only).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p2-q1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-history-2025-nov-p2-q1.js --dry-run
 *   node scripts/add-history-2025-nov-p2-q1.js
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
  name: 'Question 1',
  syllabus: 'dbe',
  subject: 'history',
  year: 2025,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['cosatu', 'trade_union_mobilisation', 'civil_resistance', 'source_reliability'],
  question_image_urls: [`${IMG}/q1/question_1.png`, `${IMG}/q1/question_2.png`],
  memo_image_urls: [`${IMG}/q1/memo_1.png`, `${IMG}/q1/memo_2.png`, `${IMG}/q1/memo_3.png`, `${IMG}/q1/memo_4.png`],
  exam_question_marks: 50,
  supplementary_materials: [
    { type: 'source', label: 'Source 1A', image_urls: [`${IMG}/q1/annexure_1A.png`] },
    { type: 'source', label: 'Source 1B', image_urls: [`${IMG}/q1/annexure_1B.png`] },
    { type: 'source', label: 'Source 1C', image_urls: [`${IMG}/q1/annexure_1C.png`] },
    { type: 'source', label: 'Source 1D', image_urls: [`${IMG}/q1/annexure_1D.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────
// Fresh interpretive-angle questions on the SAME real sources (DESIGN-HIST-01) — different
// facts/angles than the real exam's own 1.1-1.6, never its stems or marks.

const questions = [
  {
    name: 'Question 1',
    question: "In Source 1B, CCAWUSA is described as 'an affiliate' of COSATU. What does 'affiliate' mean in this context?",
    metadata: [
      'A trade union that is legally banned from operating',
      'A member union that is formally joined to a larger federation',
      'A rival union competing against COSATU for members',
      'A government department that regulates trade unions',
      '',
    ],
    answer: ['A member union that is formally joined to a larger federation', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'historical_terminology',
    skills: ['define_historical_term'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- An affiliate keeps its own identity but belongs to a bigger organisation.\n- Look at how CCAWUSA related to COSATU as a whole in Source 1B's introduction.",
  },
  {
    name: 'Question 2',
    question: "According to Source 1A, COSATU's total membership in November 1985 was about [] workers.",
    metadata: [
      'Total membership: ',
      '[ ]',
      ' workers',
    ],
    answer: ['500000', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'evidence_extraction',
    skills: ['extract_numeric_evidence_from_source'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The exact figure is stated directly in the first paragraph of Source 1A.\n- Write the number only, no spaces or commas.',
  },
  {
    name: 'Question 3',
    question: 'According to Source 1C, [] young recruits, including the author, formed a line at the top of the stairs leading to the station platform.',
    metadata: [
      'Number of young recruits: ',
      '[ ]',
    ],
    answer: ['14', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'evidence_extraction',
    skills: ['extract_numeric_evidence_from_source'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The number of recruits is stated near the start of the second paragraph of Source 1C.\n- Write the number only.',
  },
  {
    name: 'Question 4',
    question: 'Source 1B shows workers marching under a CCAWUSA banner at a COSATU rally. What does the presence of this specific union banner suggest about how COSATU itself was structured?',
    metadata: [
      'COSATU had no formal structure and consisted of loosely connected individuals',
      'COSATU was a federation made up of many separate, sector-specific member unions',
      'COSATU banned its member unions from displaying their own identities',
      'COSATU replaced all smaller unions with one single national union',
      '',
    ],
    answer: ['COSATU was a federation made up of many separate, sector-specific member unions', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'evidence_extraction',
    skills: ['infer_organisational_structure_from_evidence'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- CCAWUSA represented one specific industry (commercial and catering workers).\n- Think about what it means for COSATU to have many different industry unions marching under their own banners at the same rally.',
  },
  {
    name: 'Question 5',
    question: "Which of the following are valid reasons for a historian to treat Source 1C's account of the March 1987 clash with caution?",
    metadata: [
      "It was written by a former member of the Riot Squad describing his own unit's actions",
      'It is a memoir, based on personal memory rather than a contemporaneous record',
      "It gives only the police officers' side of the confrontation, not the strikers' perspective",
      'It does not mention that COSATU members were on strike',
      'It was published in a language other than English',
    ],
    answer: [
      "It was written by a former member of the Riot Squad describing his own unit's actions",
      'It is a memoir, based on personal memory rather than a contemporaneous record',
      "It gives only the police officers' side of the confrontation, not the strikers' perspective",
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'source_evaluation',
    skills: ['evaluate_source_reliability'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Ask who wrote this account, and what personal stake he had in how the clash is portrayed.\n- A memoir is written well after the events it describes, from memory.',
  },
  {
    name: 'Question 6',
    question: 'Arrange these events from Source 1D in the order they happened.',
    metadata: [
      'The building was handed over to the Security Branch',
      'Security Branch members started a fire on the eighth floor',
      'A shooting incident involving Riot Unit members occurred',
      'Filing cabinets and documents were thrown from the balconies',
      'Policemen raided and secured COSATU House',
    ],
    answer: [
      'A shooting incident involving Riot Unit members occurred',
      'Policemen raided and secured COSATU House',
      'The building was handed over to the Security Branch',
      'Filing cabinets and documents were thrown from the balconies',
      'Security Branch members started a fire on the eighth floor',
    ],
    presentation: 'ordering',
    type: 'interpretation',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'evidence_extraction',
    skills: ['sequence_historical_events'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Source 1D describes the raid as a sequence: first securing the building, then the demolition, then the fire.\n- Re-read the source's paragraph order carefully - it's telling the story roughly chronologically.",
  },
  {
    name: 'Question 7',
    question: 'Match each source to the perspective from which it was written.',
    metadata: [
      'A - Source 1A',
      'B - Source 1C',
      'C - Source 1D',
      'D - Source 1B',
      '1 - An external journalist reporting on COSATU',
      "2 - A former Riot Squad officer describing his own unit's actions",
      "3 - A former Security Branch officer describing his own unit's actions",
      '4 - A compiled historical photograph, captured by an independent photographer',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'application',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'source_evaluation',
    skills: ['compare_source_authorship_perspective'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Two of these sources were written by former apartheid security members describing their own units.\n- Source 1A names its author's profession in its own introduction.",
  },
  {
    name: 'Question 8',
    question: 'Based on the footnote in Source 1D, what was STRATCOM?',
    metadata: [
      'An official police unit responsible for training new recruits',
      'A trade union representing apartheid-era security branch officers',
      'A secret apartheid-era unit that carried out propaganda, disinformation and violence against anti-apartheid activists',
      'A court structure that granted amnesty to security police',
      '',
    ],
    answer: ['A secret apartheid-era unit that carried out propaganda, disinformation and violence against anti-apartheid activists', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'civil_resistance_1970s_80s',
    topic: 'cosatu_worker_mobilisation',
    subtopic: 'historical_terminology',
    skills: ['define_historical_term'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- The definition is given directly in the footnote below Source 1D.\n- STRATCOM stands for 'Strategic Communication'.",
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question ───
// Aligned against the official marking guideline (files/History P2 Nov 2025 MG Eng.pdf,
// pages 7-10), sourced 2026-09-12. Superseded an earlier source-text-only derivation —
// several sub-questions' accepted answers differ meaningfully from a plain close-reading
// (e.g. 1.1.3, 1.3, 1.4.3, 1.5.2, 1.6's own-knowledge points).

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 2,
      clues: '- Look at the opening sentence of Source 1A.\n- The exact phrase you need is a direct quotation, not a paraphrase.',
      approach: "- Re-read the first sentence of Source 1A.\n- Identify the exact words that describe COSATU's size/status relative to other black worker organisations.\n- Copy the phrase exactly as it appears, in quotation marks.",
      solution: '1. Source 1A states "more than 33 unions joined together" to form COSATU.\n2. It also describes COSATU as having "a total membership of some 500 000 workers".\n3. Either quoted phrase answers the question.',
    },
    {
      number: '1.1.2',
      marks: 2,
      clues: "- Break the phrase into its two parts: 'non-parliamentary' and 'opposition group'.\n- Think about groups that oppose government policy from outside the formal political system.",
      approach: "- Identify what 'parliamentary' means (operating through formal government/legislature).\n- Combine this with 'opposition' (actively opposing government policy).\n- Write an own-words definition combining both ideas.",
      solution: "1. A non-parliamentary opposition group is an organisation or political party that is not a member of parliament.\n2. In this context, it refers to groups fighting against apartheid, dedicated to overthrowing the white government (by force, in the case of the ANC referred to in the source).",
    },
    {
      number: '1.1.3',
      marks: 2,
      clues: "- 'Allied itself to the aims, if not formally to the structures' means COSATU agreed with the ANC's goals without becoming an official part of it.\n- Think about what this reveals about how COSATU's own focus had broadened.",
      approach: "- Note the distinction the source draws between 'aims' and 'structures'.\n- Explain what sharing an organisation's aims implies about COSATU's own political focus, not just its relationship to the ANC.",
      solution: "1. This shows COSATU no longer focused only on labour issues, but also on the wider struggle for liberation, just like the ANC.\n2. COSATU and the banned African National Congress shared the same political objective/mandate/goal of ending apartheid in South Africa.\n3. It also suggests COSATU believed in the aims of the Freedom Charter.",
    },
    {
      number: '1.1.4',
      marks: 4,
      clues: '- Consider both what the source says about the economy and workforce, and what you know about labour-law changes and political conditions in this period.',
      approach: "- Use the source's own evidence (many workers in industries/factories/plants).\n- Add outside knowledge (trade unions made legal after political parties were banned; heightened political activism in the 1980s; shop stewards recruiting workers).\n- Combine any two distinct reasons for four marks.",
      solution: "1. There were many workers in industries, large factories and industrial plants, giving unions a large base to organise.\n2. Trade unions were made legal and could organise meetings after political parties were banned, giving them room to grow.\n3. It was easy for them to mobilise and hold meetings because the 1980s were generally a period of heightened political activism/consciousness/growing worker militancy against repression.\n4. They had union representatives (shop stewards) who recruited more workers and acted as a mouthpiece for the workers.\n5. Workers who felt exploited joined trade unions in greater numbers.\n6. Any two of these reasons, explained, answer the question.",
    },
    {
      number: '1.2.1',
      marks: 2,
      clues: "- 1 May is International Workers' Day (May Day).\n- Consider why choosing that specific date for a rally sends a message.",
      approach: '- Identify what 1 May represents internationally.\n- Explain why COSATU deliberately chose that date for this rally.',
      solution: "1. Workers in South Africa joined workers worldwide in celebrating/commemorating International Workers' Day.\n2. It united workers throughout the world in the struggle for their rights, linking COSATU's own struggle to a global movement.",
    },
    {
      number: '1.2.2',
      marks: 2,
      clues: "- 'Forward' suggests continued momentum.\n- 'Workers' struggle' links back to opposition to apartheid labour laws specifically.",
      approach: "- Explain what the word 'forward' implies about the movement's direction.\n- Connect 'the workers' struggle' directly to resisting the apartheid government's labour laws.",
      solution: "1. It indicates the commitment of, and a call for, workers to fight against the apartheid government's repressive labour laws.\n2. 'Forward' signals continued momentum and determination to keep pushing that struggle onward.",
    },
    {
      number: '1.2.3',
      marks: 2,
      clues: '- The clenched fist is a well-known protest gesture.\n- Think about what it communicates about unity and defiance against a specific target.',
      approach: '- Recall what a raised clenched fist commonly symbolises in protest movements.\n- Apply this specifically to the struggle against apartheid labour laws.',
      solution: "1. It was a symbol of liberation and of the workers' struggle.\n2. It shows the unity and determination of workers in their struggle against the apartheid government's repressive labour laws.\n3. It symbolises the power that the workers had against the apartheid government.",
    },
    {
      number: '1.3',
      marks: 4,
      clues: '- Match specific claims in Source 1A to specific visual details in Source 1B, point for point, rather than a general comparison.',
      approach: '- Take a specific fact from Source 1A (union count, membership size, industrialisation).\n- Find the specific matching visual detail in Source 1B.\n- Pair them explicitly.',
      solution: "1. Source 1A states COSATU became the largest federation of more than 33 unions, and Source 1B shows CCAWUSA as one of the unions affiliated to COSATU.\n2. Source 1A states COSATU had a membership of some 500 000 workers, and Source 1B shows a large crowd of workers attending the rally.\n3. Source 1A indicates South Africa was the most industrialised country (many workers), and Source 1B shows a large number of CCAWUSA members who worked in industries.\n4. Any two of these paired comparisons, explained, answer the question.",
    },
    {
      number: '1.4.1',
      marks: 1,
      clues: "- The name of the campaign is stated directly in Source 1C's introduction.",
      approach: "- Re-read the introduction above Source 1C for the name of the campaign COSATU was conducting.",
      solution: "1. Source 1C's introduction states COSATU members were conducting a 'living wage' campaign.\n2. Answer: the living wage campaign.",
    },
    {
      number: '1.4.2',
      marks: 2,
      clues: '- A grievance is a specific complaint or cause for protest.\n- Think about what COSATU members felt aggrieved about, against the apartheid labour system specifically.',
      approach: "- Define 'grievances' in general terms.\n- Apply the definition to COSATU's specific complaints against apartheid labour laws/wages.",
      solution: "1. Grievances are the complaints/demands/issues that COSATU members had against the apartheid government's labour laws and/or for better wages.\n2. These demands showed the strikers' resentment of, and rejection of, the apartheid government by unions affiliated to COSATU.",
    },
    {
      number: '1.4.3',
      marks: 3,
      clues: "- Look at the second paragraph of Source 1C, describing the strikers' approach and the recruits' reaction to it.\n- You need any THREE separate quoted details.",
      approach: "- Scan the second paragraph for language directly describing sound, sight or fear.\n- Select three distinct quoted phrases from the accepted list.",
      solution: "1. 'The thunder of political jingles being sung in the deep angry voices …'\n2. '… 300 strikers resonated down the tunnel and up the stairway towards us'\n3. '… the sound almost scared the life out of me'\n4. 'Then they appeared at the bottom of the stairs and swung in our directions'\n5. 'It was a terrifying sight'\n6. 'They were armed with knobkerries, whips, knives and a whole variety of vicious weapons'\n7. Any three of these quotations are acceptable.",
    },
    {
      number: '1.4.4',
      marks: 4,
      clues: '- Consider who wrote this source, how experienced he was, and how the language itself reads.',
      approach: "- Identify the author's role and level of experience.\n- Note the tone/language used.\n- Note that this is a memoir, not a contemporaneous record.",
      solution: "1. The source is limited because it is only the perspective of a member of the East Rand Riot Unit.\n2. It is one-sided/biased/propaganda against the strikers.\n3. It is a version from a young, inexperienced recruit.\n4. The language used is exaggerated, e.g. 'the thunder of political jingles', 'the mob in hand-to-hand fighting', 'blood all over me'.\n5. The source is a memoir, and some of the information might have been forgotten, distorted, or selected before publication.\n6. Any two of these limitations, explained, answer the question.",
    },
    {
      number: '1.5.1',
      marks: 2,
      clues: '- The opening sentence of Source 1D links the raid to an earlier event.',
      approach: "- Identify what happened just before the raid, according to the source's opening sentence.",
      solution: "1. Source 1D states the raid followed 'a shooting incident involving members of the Riot Unit'.\n2. After this shooting incident, policemen raided and secured COSATU House before handing it to the Security Branch.",
    },
    {
      number: '1.5.2',
      marks: 4,
      clues: '- Think about both the SCALE of the destruction and the police\'s underlying MOTIVE for it.',
      approach: '- Note that such force had never been seen before in South Africa.\n- Note that the goal seems to have been to eliminate COSATU itself, not just search the building.\n- Characterise the behaviour itself (reckless, unjustified).',
      solution: "1. Such brutal force by the Riot Unit/Security Branch had never been seen in South Africa before.\n2. Everything in and out of the building was destroyed.\n3. The police wanted to shut down/eliminate the federation and its activities/destroy COSATU entirely, not merely search the premises.\n4. The behaviour of the police was reckless, immoral, criminal, unethical and unjustified.\n5. Any two of these, explained, answer the question.",
    },
    {
      number: '1.5.3',
      marks: 4,
      clues: '- The second paragraph of Source 1D lists several separate destructive actions, each its own distinct fact.',
      approach: '- Scan the second and third paragraphs and pick out four distinct destructive actions.',
      solution: "1. Filing cabinets filled with documents and records rained down like confetti from the balconies.\n2. Office equipment was smashed.\n3. Personal computers were tossed out of the windows and over the balconies into the courtyard.\n4. Video monitors and an expensive security system were destroyed.\n5. What wasn't smashed or broken was stolen.\n6. The printing machine's plates and control panel were smashed.\n7. The printing machine had been completely destroyed.\n8. Cars in the basement had likewise been seriously damaged.\n9. Security Branch members started a fire.\n10. Any four of these are acceptable.",
    },
    {
      number: '1.5.4',
      marks: 2,
      clues: '- Think about what the Security Branch was trying to hide or protect by delaying the firefighters.\n- The fire was deliberately started, according to the source.',
      approach: "- Consider the Security Branch's motive for starting the fire in the first place.\n- Link this to why they would want to delay firefighters reaching it, or to avoid implicating themselves.",
      solution: "1. Security Branch members did not want the firefighters to stop the fire, to ensure that everything in COSATU House was destroyed — a delaying tactic to let the fire spread.\n2. The police also did not want to implicate themselves or wanted to cover their tracks regarding who started the fire.",
    },
    {
      number: '1.6',
      marks: 8,
      clues: "- Draw on all four sources plus your own knowledge of COSATU's history and the wider anti-apartheid trade union movement.\n- Aim for a short, structured paragraph, not a list.",
      approach: "- Take at least one point from each source (1A's growth and alliances, 1C's living wage campaign and police response, 1D's raid and demolition).\n- Add own-knowledge points beyond the sources (rival unions, repression of leaders, community support).\n- Link these into one flowing paragraph.",
      solution: "1. More than 33 workers' unions decided to affiliate to COSATU, increasing the federation's membership, and ANC/UDF supporters aligned themselves with COSATU (Source 1A).\n2. Unfair new labour laws motivated domestic and farm workers to join COSATU (Source 1A), while community groups and students also supported COSATU (own knowledge).\n3. COSATU's living wage campaign was clamped down on by the East Rand Riot Unit, which confronted the striking mob and dispersed them (Source 1C).\n4. Strong leadership within workplaces, such as shop stewards, was silenced, and the apartheid government/Special Branch tortured, silenced or killed some COSATU leaders (own knowledge).\n5. The police raided COSATU House, and the Special Branch demolished the building, destroyed office equipment and records, set it on fire, and hindered firefighters from extinguishing it (Source 1D).\n6. The government also backed rival unions, such as UWUSA (aligned with the IFP), to counter COSATU's formation and influence (own knowledge).\n7. Together, these show a range of responses from worker/community mobilisation to escalating state violence and counter-organisation.",
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
