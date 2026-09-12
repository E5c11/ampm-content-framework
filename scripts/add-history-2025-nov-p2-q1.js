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
  memo_image_urls: null, // no marking guideline sourced yet for this paper (subject profile, "Not yet sourced")
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
      "According to Source 1A, COSATU's total membership in November 1985 was about ",
      '[ ]',
      ' workers.',
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
      'According to Source 1C, ',
      '[ ]',
      ' young recruits, including the author, formed a line at the top of the stairs leading to the station platform.',
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
// Derived directly from Sources 1A-1D (no marking guideline sourced yet for this paper —
// subject profile flags this; answers below are grounded in the source text itself, since
// this paper's own sub-questions are largely direct source-comprehension items).

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 2,
      clues: '- Look at the opening sentence of Source 1A.\n- The exact phrase you need is a direct quotation, not a paraphrase.',
      approach: "- Re-read the first sentence of Source 1A.\n- Identify the exact words that describe COSATU's size/status relative to other black worker organisations.\n- Copy the phrase exactly as it appears, in quotation marks.",
      solution: '1. Source 1A states COSATU was formed when "more than 33 unions joined together".\n2. It then describes COSATU as "the largest federation (grouping) of black workers in South African history, with a total membership of some 500 000 workers".\n3. Either phrase, quoted directly, answers the question.',
    },
    {
      number: '1.1.2',
      marks: 2,
      clues: "- Break the phrase into its two parts: 'non-parliamentary' and 'opposition group'.\n- Think about groups that oppose government policy from outside the formal political system.",
      approach: "- Identify what 'parliamentary' means (operating through formal government/legislature).\n- Combine this with 'opposition' (actively opposing government policy).\n- Write an own-words definition combining both ideas.",
      solution: "1. 'Parliamentary' refers to formal government structures such as elected legislatures.\n2. 'Non-parliamentary' therefore means operating outside those formal government structures.\n3. An 'opposition group' actively challenges or resists government policy.\n4. Combined: a non-parliamentary opposition group is an organisation that opposes government policy from outside formal political/government structures, rather than through Parliament.",
    },
    {
      number: '1.1.3',
      marks: 2,
      clues: "- 'Allied itself to the aims, if not formally to the structures' means COSATU agreed with the ANC's goals without becoming an official part of it.\n- Think about what this reveals about how radical/political COSATU's stance had become.",
      approach: "- Note the distinction the source draws between 'aims' and 'structures'.\n- Explain what sharing an organisation's aims without joining its structures implies about COSATU's political position.",
      solution: "1. The statement shows that COSATU supported the ANC's goal of overthrowing white minority rule, even though it was not formally/organisationally part of the ANC.\n2. This implies COSATU had moved beyond purely workplace/labour concerns into direct political opposition to the apartheid government.\n3. It also suggests COSATU risked being seen by the state as linked to a banned organisation, given the ANC's exiled and outlawed status at the time.",
    },
    {
      number: '1.1.4',
      marks: 4,
      clues: '- Consider both what the source says about the economy, and what you know about labour legislation changes in this period.\n- Think about the numbers of workers involved and the industries mentioned.',
      approach: '- Use the source\'s own evidence (economy\'s dependence on black labour, size of the black workforce in mining/textiles/steel).\n- Add outside knowledge (e.g. 1979 Wiehahn Commission reforms legalised black trade unions, giving them formal bargaining power).\n- Link the two: legal recognition plus economic leverage produced stronger unions.',
      solution: "1. From the source: South Africa's modern economy had become increasingly dependent on black labour and skills, in industries such as mining, textiles and steel, giving unions real economic leverage through the threat of large-scale strikes.\n2. From own knowledge: the 1979 Wiehahn Commission reforms legally recognised black trade unions for the first time, allowing them to register, bargain, and organise openly.\n3. Together, legal recognition and the apartheid economy's growing reliance on black workers gave trade unions both the right and the practical power to organise and grow stronger through the 1980s.",
    },
    {
      number: '1.2.1',
      marks: 2,
      clues: '- 1 May is International Workers\' Day (May Day).\n- Consider why choosing that specific date for a rally sends a message.',
      approach: '- Identify what 1 May represents internationally.\n- Explain why COSATU deliberately chose that date for this rally.',
      solution: "1. 1 May is International Workers' Day (May Day), a globally recognised day for celebrating and mobilising the labour movement.\n2. By holding the rally on this date, COSATU symbolically linked its own struggle to the wider international workers' movement.\n3. It also used the day to publicly demonstrate its scale and unity to the apartheid government.",
    },
    {
      number: '1.2.2',
      marks: 2,
      clues: "- 'Forward' suggests continued progress/momentum.\n- 'Workers' struggle' links back to the broader anti-apartheid resistance, not just workplace issues.",
      approach: "- Explain what the word 'forward' implies about the movement's direction.\n- Connect 'the workers' struggle' to the broader fight against apartheid, not only labour conditions.",
      solution: "1. 'Forward' implies determination to keep advancing the movement rather than back down.\n2. 'The workers' struggle' frames the fight as an ongoing, collective battle linked to the wider anti-apartheid resistance, not just a dispute over wages or conditions.\n3. Together, the slogan is a rallying call for workers to keep mobilising and pushing the struggle onward.",
    },
    {
      number: '1.2.3',
      marks: 2,
      clues: '- The clenched fist is a well-known protest gesture.\n- Think about what it communicates about unity and defiance.',
      approach: '- Recall what a raised clenched fist commonly symbolises in protest movements.\n- Apply this to what the workers in the photograph are communicating.',
      solution: "1. A raised clenched fist is an internationally recognised symbol of resistance, defiance, unity and solidarity.\n2. In this photograph, it shows the workers' collective determination and refusal to back down against the apartheid government.\n3. It also expresses solidarity among the different unions and workers present at the rally.",
    },
    {
      number: '1.3',
      marks: 4,
      clues: "- Look for a link between what 1A describes in words and what 1B shows in the photograph.\n- COSATU's scale/mobilisation described in 1A should be visible in 1B.",
      approach: '- Identify a specific claim in Source 1A about COSATU\'s size, strength or mobilisation.\n- Match it to visual evidence in Source 1B that shows the same thing happening.',
      solution: "1. Source 1A states COSATU had a total membership of some 500 000 workers and describes it as seeking 'the political high ground' in a mass struggle against white rule.\n2. Source 1B's photograph visually supports this by showing a massive crowd of workers packed into a stadium, carrying a large banner and raising clenched fists.\n3. The huge, organised crowd in the photograph is direct visual proof of the scale of mass mobilisation that Source 1A describes in words.",
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
      clues: '- A grievance is a specific complaint or cause for protest.\n- Think about what COSATU members felt aggrieved about.',
      approach: "- Define 'grievances' in general terms.\n- Apply the definition to COSATU's specific complaints against the apartheid government/employers.",
      solution: "1. A 'grievance' is a formal complaint or a real or perceived cause for complaint or resentment.\n2. In this context, COSATU's grievances were their complaints about unfair wages, working conditions and treatment of black workers under apartheid, which drove them to strike.\n3. The Riot Squad member (author) admits he neither understood nor cared about these grievances, showing the gap between strikers' and police's perspectives.",
    },
    {
      number: '1.4.3',
      marks: 3,
      clues: '- Look at the second paragraph of Source 1C for words describing fear.\n- You need three separate quoted details.',
      approach: "- Scan the second paragraph for language directly describing the recruits' emotional/physical state.\n- Select three distinct quoted phrases.",
      solution: "1. 'the sound almost scared the life out of me'\n2. 'It was a terrifying sight'\n3. 'armed with knobkerries, whips, knives and a whole variety of vicious (dangerous) weapons'\n4. Any three direct quotations describing the recruits' fear or the threat they faced are acceptable.",
    },
    {
      number: '1.4.4',
      marks: 4,
      clues: '- Consider who wrote this source and when.\n- Think about whose perspective is missing.',
      approach: "- Identify the author's role and relationship to the events described.\n- Explain how this affects the reliability/completeness of the account.\n- Note what is missing from the account.",
      solution: "1. Source 1C is a memoir written by a former Riot Squad member describing his own unit's clash with COSATU strikers, so he has a personal interest in presenting his side sympathetically.\n2. As a memoir, it relies on personal memory recorded years after the events, which can be selective or inaccurate.\n3. It gives only the police perspective and omits the strikers' own experience of the clash.\n4. It also contains the author's own admission of not understanding or caring about the strikers' grievances, suggesting limited insight into their motives.",
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
      clues: '- Look at the scale and nature of the destruction described in the second paragraph.\n- Think about how this compares to normal police conduct.',
      approach: '- List the specific destructive acts described in Source 1D.\n- Use own knowledge of the scale of state repression to explain why this went beyond anything seen before.',
      solution: "1. Source 1D describes filing cabinets and documents thrown from balconies, office equipment smashed, computers thrown out of windows, the security system destroyed, and items not destroyed simply stolen.\n2. This was not a targeted search but the wholesale destruction of an entire ten-storey building and its contents.\n3. The scale and totality of the destruction, attributed to 'accumulated rage and frustration' vented on the building, went far beyond a normal police raid or search, making it 'unprecedented and unparalleled' in the source's own words.",
    },
    {
      number: '1.5.3',
      marks: 4,
      clues: '- The second paragraph of Source 1D lists several separate destructive actions.',
      approach: '- Scan the second paragraph and pick out four distinct actions.',
      solution: '1. Filing cabinets and documents thrown from balconies.\n2. Office equipment smashed.\n3. Personal computers, video monitors and the security system thrown out or destroyed.\n4. Items not destroyed were stolen, and the printing machine in the basement was smashed.\n5. Any four of these are acceptable.',
    },
    {
      number: '1.5.4',
      marks: 2,
      clues: '- Think about what the Security Branch was trying to hide or protect by delaying the firefighters.\n- The fire was deliberately started, according to the source.',
      approach: "- Consider the Security Branch's motive for starting the fire in the first place.\n- Link this to why they would want to delay firefighters reaching the actual source.",
      solution: '1. Since Security Branch members had deliberately started the fire themselves, they likely wanted it to burn for as long as possible to destroy more evidence and documents.\n2. Misleading the firefighters about the fire\'s real location would delay it being extinguished, maximising the damage.\n3. It may also have been an attempt to disguise or downplay their own role in deliberately starting the fire.',
    },
    {
      number: '1.6',
      marks: 8,
      clues: '- Draw on all four sources plus your own knowledge of COSATU\'s history.\n- Aim for a short, structured paragraph, not a list.',
      approach: "- Identify one or two key responses shown in each source (formation/scale, rallies, police repression, state demolition).\n- Link these into a flowing paragraph that answers 'what were the different responses'.\n- Keep to roughly 8 lines/80 words.",
      solution: "1. COSATU mobilised at a massive scale, growing into the largest federation of black unions with roughly 500 000 members (Source 1A).\n2. It organised public rallies and mass action, such as the 1 May 1986 COSATU rally, to demonstrate unity and push the workers' struggle forward (Source 1B).\n3. The apartheid state responded with violent repression, using riot police to clash with strikers during actions like the March 1987 living wage campaign (Source 1C).\n4. State security forces escalated further, raiding and completely demolishing COSATU House in April 1987 to try to crush the organisation (Source 1D).\n5. Together, these sources show COSATU's responses ranged from mass, organised mobilisation to enduring escalating state violence and repression.",
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
