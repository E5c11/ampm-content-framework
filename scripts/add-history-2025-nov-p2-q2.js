#!/usr/bin/env node
/**
 * DBE History P2 — November 2025 — Question 2 (order 2)
 * The Coming of Democracy to South Africa and Coming to Terms with the Past —
 * TRC amnesty hearings: Reverend Farisani.
 * Source-based question (Sources 2A-2D): DESIGN-HIST-01 (same real sources as worked
 * example, fresh interpretive-angle practice questions); DESIGN-HIST-03 (fitb numeric-only).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p2-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-history-2025-nov-p2-q2.js --dry-run
 *   node scripts/add-history-2025-nov-p2-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'history',
  year: 2025,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['truth_and_reconciliation_commission', 'human_rights_violations', 'apartheid_era_torture', 'source_reliability'],
  question_image_urls: [`${IMG}/q2/question_1.png`, `${IMG}/q2/question_2.png`],
  memo_image_urls: [`${IMG}/q2/memo_1.png`, `${IMG}/q2/memo_2.png`, `${IMG}/q2/memo_3.png`, `${IMG}/q2/memo_4.png`, `${IMG}/q2/memo_5.png`],
  exam_question_marks: 50,
  supplementary_materials: [
    { type: 'source', label: 'Source 2A', image_urls: [`${IMG}/q2/annexure_2A.png`] },
    { type: 'source', label: 'Source 2B', image_urls: [`${IMG}/q2/annexure_2B.png`] },
    { type: 'source', label: 'Source 2C', image_urls: [`${IMG}/q2/annexure_2C.png`] },
    { type: 'source', label: 'Source 2D', image_urls: [`${IMG}/q2/annexure_2D.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────
// Fresh interpretive-angle questions on the SAME real sources (DESIGN-HIST-01) — different
// facts/angles than the real exam's own 2.1-2.6, never its stems or marks.

const questions = [
  {
    name: 'Question 1',
    question: "Source 2A says Farisani 'co-founded' the Black Evangelical Youth Organisation (BEYO). What does 'co-founded' mean in this context?",
    metadata: [
      'He was the only person responsible for starting the organisation',
      'He was one of several people who together established the organisation from its beginning',
      'He took over leadership of an organisation someone else had already started',
      'He financially supported an organisation without being involved in its activities',
      '',
    ],
    answer: ['He was one of several people who together established the organisation from its beginning', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
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
    clues: '- BEYO had four people named as founders in Source 2A, including Farisani.\n- Think about what it means to build something together from the start, versus alone.',
  },
  {
    name: 'Question 2',
    question: 'The TRC rejected the amnesty applications under the Promotion of National Unity and Reconciliation Act, [] of 1995.',
    metadata: [
      'Act number: ',
      '[ ]',
      ' of 1995',
    ],
    answer: ['34', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
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
    clues: "- The Act number appears in brackets right after the Act's full name in Source 2C.\n- Write the number only.",
  },
  {
    name: 'Question 3',
    question: 'According to Source 2A, Farisani was detained without trial on [] separate occasions between 1977 and 1987.',
    metadata: [
      'Number of detentions: ',
      '[ ]',
    ],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
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
    clues: '- The number of detentions is stated in the second paragraph of Source 2A.\n- Write the number only, as a digit.',
  },
  {
    name: 'Question 4',
    question: 'According to Source 2C, which of the following torture methods did the applicants use against their victims?',
    metadata: [
      "Pouring water over the victims' heads using a bag",
      'Applying electric shocks to the ear lobes and private parts',
      'Pulling hair from various parts of the body',
      'Forcing victims to sign false written confessions',
      'Denying victims access to food for several days',
    ],
    answer: [
      "Pouring water over the victims' heads using a bag",
      'Applying electric shocks to the ear lobes and private parts',
      'Pulling hair from various parts of the body',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
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
    clues: "- The methods are listed together in Source 2C's third paragraph.\n- Not every option listed here actually appears in the source — check each one carefully.",
  },
  {
    name: 'Question 5',
    question: "Source 2A is an extract from Reverend Farisani's funeral programme. Which of the following is most likely a limitation of using this type of source to research his political activism?",
    metadata: [
      'A funeral programme cannot include any factual biographical information',
      'A funeral programme is always written by the government',
      'A funeral programme is usually written to honour and celebrate the person who died, so it may present only favourable details',
      'A funeral programme is only used once and then destroyed',
      '',
    ],
    answer: ['A funeral programme is usually written to honour and celebrate the person who died, so it may present only favourable details', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
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
    clues: '- Think about the purpose a funeral programme serves, and for whom it is written.\n- Compare this purpose to a source like Source 2C, an official TRC report.',
  },
  {
    name: 'Question 6',
    question: 'Match each source to the type of document it is.',
    metadata: [
      'A - Source 2A',
      'B - Source 2B',
      'C - Source 2C',
      'D - Source 2D',
      "1 - A funeral programme commemorating Farisani's life",
      '2 - Oral testimony given at a TRC hearing',
      '3 - An official TRC report on an amnesty decision',
      '4 - A political cartoon published in a book',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'application',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
    subtopic: 'source_evaluation',
    skills: ['compare_source_authorship_perspective'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Each source names or implies where it came from in its own introduction.\n- Source 2D is described as being "by J Shapiro" and taken "from the book".',
  },
  {
    name: 'Question 7',
    question: "Source 2D's Frame A shows the police claiming the prisoner 'slipped on soap' and died accidentally, while Frame B reveals the real torture methods used. How does Source 2C support Frame B rather than Frame A's version of events?",
    metadata: [
      'Source 2C confirms that the applicants were found not guilty of any wrongdoing',
      'Source 2C independently confirms consistent torture methods (electric shocks, water, hair-pulling) across multiple victims, contradicting the accident story',
      "Source 2C proves that Frame A's account was written by Dullah Omar himself",
      'Source 2C shows that no torture ever took place during apartheid',
      '',
    ],
    answer: ['Source 2C independently confirms consistent torture methods (electric shocks, water, hair-pulling) across multiple victims, contradicting the accident story', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
    subtopic: 'evidence_extraction',
    skills: ['corroborate_evidence_across_sources'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Source 2C describes a consistent pattern of methods across several separately-tortured victims.\n- Ask which frame of the cartoon that consistent pattern actually matches.",
  },
  {
    name: 'Question 8',
    question: "In Source 2D, Dullah Omar's hat is labelled 'TOP DULLAH' and is drawn large enough to contain both speech frames. What does this exaggerated hat most likely symbolise?",
    metadata: [
      'That Dullah Omar personally invented the torture methods described',
      "Dullah Omar's authority and central role in overseeing the TRC's uncovering of the truth",
      'That Dullah Omar was a security policeman before becoming Minister of Justice',
      'That the hat was a genuine piece of TRC evidence',
      '',
    ],
    answer: ["Dullah Omar's authority and central role in overseeing the TRC's uncovering of the truth", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'coming_of_democracy',
    topic: 'trc_amnesty_farisani',
    subtopic: 'source_evaluation',
    skills: ['interpret_political_cartoon_symbolism'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'history',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Note Dullah Omar's real-life role: former Minister of Justice, responsible for the TRC.\n- Think about why a cartoonist would draw one figure's hat large enough to hold both frames of speech.",
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question ───
// Aligned against the official marking guideline (files/History P2 Nov 2025 MG Eng.pdf,
// pages 11-15), sourced 2026-09-12. Superseded an earlier source-text-only derivation —
// several sub-questions' accepted answers differ meaningfully (2.3.1 quoted the wrong
// sentence entirely; 2.3.3's "oral testimonies" refers to the applicants' testimony in
// 2C, not Farisani's testimony in 2B; 2.4/2.5 needed the memo's specific point-for-point
// pairings, not a general comparison).

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 2,
      clues: "- Farisani's early activism organisations are named in the first sentence of Source 2A.\n- You need TWO organisation names, both within the Black Consciousness Movement.",
      approach: "- Re-read the first two sentences of Source 2A.\n- Identify the named organisations Farisani was a founding member of.",
      solution: "1. Source 2A names the Black People's Convention (BPC).\n2. Source 2A names the Black Evangelical Youth Organisation (BEYO).",
    },
    {
      number: '2.1.2',
      marks: 3,
      clues: '- The types of abuse are listed together in the second paragraph of Source 2A.\n- You need any THREE distinct types.',
      approach: "- Scan the second paragraph of Source 2A for the list of abuses Farisani suffered during his incarcerations.\n- Select any three.",
      solution: '1. Brutal torture.\n2. Beatings.\n3. Electric shocks.\n4. Prolonged isolation.\n5. Any three of these are acceptable.',
    },
    {
      number: '2.1.3',
      marks: 2,
      clues: "- 'Prisoner of conscience' is a term used by Amnesty International for people detained purely for their beliefs, not for a crime.\n- Think about the injustice of his imprisonment, and the international response to it.",
      approach: '- Explain that his imprisonment was wrong because it targeted his political beliefs, not any crime.\n- Note the international solidarity/pressure this attracted.',
      solution: "1. The injustices meted out against Farisani due to his political beliefs were wrong.\n2. The apartheid government imprisoned him because he held political views that were not tolerated by the state in which he lived — he was imprisoned for the peaceful expression of his political beliefs.\n3. This meant pledging solidarity with prisoners like Farisani who suffered physical abuse and were restricted solely for their stance against apartheid, and putting pressure on the apartheid government over the abuses suffered.",
    },
    {
      number: '2.1.4',
      marks: 2,
      clues: '- Persecution involves being deliberately targeted and mistreated, usually over a sustained period, because of who someone is or what they believe.',
      approach: "- Define 'persecution' in general terms.\n- Note it can apply to beliefs, dissent, or other forms of identity, not only politics.",
      solution: "1. Persecution is the cruel or unfair treatment of people because of their beliefs.\n2. It includes the harassment of people who hold dissenting views, or unfair treatment of a person on the basis of gender/sexual orientation/political beliefs.",
    },
    {
      number: '2.2.1',
      marks: 2,
      clues: '- The names appear early in Source 2B, described as the authors of a letter, plus a third policeman named later in the source.',
      approach: '- Re-read Source 2B for the names of the Venda Security Branch policemen Farisani implicates.',
      solution: '1. Mr JAM Silimela.\n2. Mr Magwaba.\n3. Ramaligela.\n4. Any two of these names are acceptable.',
    },
    {
      number: '2.2.2',
      marks: 2,
      clues: "- Farisani says he doesn't hate the perpetrators, only wants the truth told.\n- Think about the TRC's own goal of reconciliation through truth-telling, not revenge.",
      approach: "- Consider what it means for a torture victim to say he does not hate his torturers.\n- Link this directly to the TRC's stated objectives.",
      solution: "1. Farisani was showing willingness to restore relations with his torturers in a spirit of reconciliation, provided they reveal the truth.\n2. Farisani was longing for the truth in his quest to find closure, and did not show any vengeance or hatred towards his perpetrators.\n3. His words are premised on the primary objectives set out by the TRC in its attempt to reconcile the nation through truth-telling/restorative justice.",
    },
    {
      number: '2.2.3',
      marks: 2,
      clues: "- Ramaligela sang this while Farisani was being tortured with electric shocks.\n- Think about what mocking someone's faith is meant to achieve, and what it reveals about the police's own sense of power.",
      approach: "- Consider the context: this was said/sung during the torture itself.\n- Explain the psychological goal behind mocking Farisani's faith.\n- Note what this reveals about the security police's attitude toward their own power.",
      solution: "1. Ramaligela was mocking Farisani's religious beliefs to create psychological distress and completely break him down.\n2. The use of pretence and dishonest methods of interrogation was meant to erode Farisani's confidence in his own faith.\n3. The security police believed they had all the power and could not be challenged by an individual — the tactics were brutal and inhumane.",
    },
    {
      number: '2.2.4',
      marks: 2,
      clues: '- Think about the TRC\'s own legal requirement of "full disclosure" for amnesty, and what happens if that requirement isn\'t met.',
      approach: "- Link the statement directly to the TRC's amnesty process, not just a general moral point about honesty.\n- Explain the consequence of perpetrators not disclosing everything.",
      solution: "1. If there is no full disclosure, perpetrators will continue to commit human rights abuses.\n2. Perpetrators of human rights abuses should disclose the whole truth in their quest to find closure and to prevent further prosecutions.\n3. The truth shall set them free, so that they will not be haunted by further prosecutions.",
    },
    {
      number: '2.2.5',
      marks: 4,
      clues: '- This is direct first-hand oral testimony given under oath at an official hearing.\n- Consider whether other sources in this set back up the same account.',
      approach: "- Identify who is speaking and in what official setting.\n- Note where the testimony was formally published.\n- Check whether it can be corroborated against other sources in this question.",
      solution: "1. The testimony contains first-hand information from Farisani regarding how he was tortured during his detention and interrogation.\n2. It is from testimony Reverend Farisani presented to the TRC Human Rights Violation Committee hearings held on 4 October 1996 in Venda.\n3. The testimony is published in the TRC Final Report.\n4. His testimony regarding torture can be corroborated with other sources, e.g. Sources 2A and 2C.",
    },
    {
      number: '2.3.1',
      marks: 2,
      clues: "- Look for the specific sentence in Source 2C about the applicants' POLITICAL OBJECTIVE, not the sentence about formal/procedural compliance.",
      approach: "- Re-read the first paragraph of Source 2C carefully — it contains two separate findings; you need the one about political objective specifically.",
      solution: '1. Source 2C states: "… finds that all the acts in respect of which amnesty is sought by the applicants were committed with a political objective as required by the Act."\n2. This direct quotation answers the question.',
    },
    {
      number: '2.3.2',
      marks: 3,
      clues: '- The three applicants are named together in the second paragraph of Source 2C.',
      approach: '- Re-read the second paragraph of Source 2C for the three named applicants.',
      solution: '1. Source 2C names "T Nesamari, P Managa and M Ramaligela" as the three applicants.',
    },
    {
      number: '2.3.3',
      marks: 2,
      clues: "- In Source 2C's context, the 'oral testimonies' being referred to are given by the AMNESTY APPLICANTS (the perpetrators), not by Farisani.\n- Contrast this with their separate written applications, also mentioned in the source.",
      approach: "- Note who is testifying in Source 2C specifically: the three policemen applying for amnesty.\n- Define 'oral testimonies' as their spoken account, given as part of their amnesty bid.",
      solution: "1. Oral testimonies are the spoken/verbal accounts given by the policemen/perpetrators who tortured Farisani (or any victim) in order to plead for amnesty.\n2. They are the first-hand memories/accounts given by the amnesty applicants relating to the human rights abuses committed, given in their quest for amnesty.",
    },
    {
      number: '2.3.4',
      marks: 2,
      clues: "- 'Full disclosure' was a legal requirement for amnesty under the Act.\n- Think about what failing this requirement means for the outcome of the applications.",
      approach: '- Recall that full disclosure of all relevant facts was a legal requirement for amnesty.\n- Explain the consequence of the Committee finding this requirement unmet.',
      solution: "1. The applicants did not tell the whole truth, as was expected by the TRC Act (Act 34 of 1995).\n2. The testimonies given by the applicants were not sufficient to make them qualify for amnesty.",
    },
    {
      number: '2.4',
      marks: 4,
      clues: '- Match specific torture details in Source 2B to specific matching details in Source 2C, point for point, rather than a general comparison.',
      approach: '- Take a specific torture method Farisani describes in Source 2B.\n- Find the matching general pattern described in Source 2C.\n- Pair them explicitly; a shared named perpetrator also counts.',
      solution: "1. Source 2B mentions the bag pulled over Farisani's head to torture him, and Source 2C highlights the use of a bag filled with water — both sources highlight the use of a bag as a torture method used by the security police.\n2. Source 2B refers to the press-ups/'stand on my head' Farisani had to perform, and Source 2C highlights the strenuous exercises victims were instructed to do.\n3. Source 2B refers to the kicking meted out against Farisani, and Source 2C refers to vicious assaults victims had to endure — both highlight how Farisani was assaulted.\n4. Source 2B refers to the electric devices tied over his ears, and Source 2C mentions electric shocks applied to the ear lobes.\n5. Both sources mention Ramaligela was responsible for human rights violations committed against Farisani.\n6. Any two of these paired comparisons, explained, answer the question.",
    },
    {
      number: '2.5.1',
      marks: 4,
      clues: '- (a) Dullah Omar\'s real-life role was Minister of Justice, responsible for the TRC.\n- (b) Look at the police\'s facial expressions and body language (e.g. sweating) in the cartoon.',
      approach: '- (a) Link his size/prominence in the cartoon to his real institutional role over the TRC.\n- (b) Read the police\'s drawn expression/reaction as a sign of their emotional state.',
      solution: "1. (a) As Minister of Justice, Dullah Omar was responsible for the TRC; the Minister/government is shown exposing the acts of violence committed by the police under apartheid, ensuring truth-telling as the mandate of the TRC is achieved.\n2. (b) The sweating of the police suggests they were anxious about the truth being revealed; their facial expressions suggest fear of being implicated in human rights violations. They represent the apartheid government.",
    },
    {
      number: '2.5.2',
      marks: 4,
      clues: "- Frame A is the police's own version of events; Frame B is what the cartoon shows really happened.",
      approach: "- State plainly what each frame represents in relation to the truth.",
      solution: "1. Frame A refers to the security policemen's version of hiding the truth.\n2. Frame B reveals the hidden human rights violations committed by the security policemen.",
    },
    {
      number: '2.6',
      marks: 8,
      clues: "- Draw on all four sources plus your own knowledge of the TRC process and its legal requirements.\n- Aim for a short, structured paragraph, not a list.",
      approach: "- Note that Farisani's own testimony (2B) undermines the applicants' political-objective claim.\n- Use the TRC's own finding on full disclosure (2C).\n- Use the cartoon's exposure of the cover-up (2D).\n- Add an own-knowledge point about why the perpetrators resisted full disclosure.",
      solution: "1. Reverend Farisani presented his testimony at the TRC regarding the torture he suffered at the hands of the security policemen (Source 2B).\n2. Farisani's testimony suggests the policemen's brutal interrogation was unrelated to any genuine political motive that could qualify them for amnesty, and that vicious interrogation methods were used to compel a false confession (Source 2B).\n3. The Committee was not satisfied that the three applicants had made a full disclosure of all relevant facts, as required by section 20(1) of the Act (Source 2C).\n4. The three applicants played down their role and involvement in the assault and torture of victims who were tortured separately, even though the victims' testimonies were consistent and showed brutal methods that the Committee could not accept as compatible with the applicants' account (Source 2C).\n5. The cartoon highlights that the apartheid security policemen did not always tell the truth, and that the TRC did not grant them amnesty as a result (Source 2D) — the security policemen wanted to evade accountability rather than make a full disclosure.\n6. The security policemen likely also did not want to implicate their own superiors in the torture of Reverend Farisani (own knowledge).",
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
