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
  memo_image_urls: null, // no marking guideline sourced yet for this paper (subject profile, "Not yet sourced")
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
      'The TRC rejected the amnesty applications under the Promotion of National Unity and Reconciliation Act, ',
      '[ ]',
      ' of 1995.',
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
      'According to Source 2A, Farisani was detained without trial on ',
      '[ ]',
      ' separate occasions between 1977 and 1987.',
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
// Derived directly from Sources 2A-2D (no marking guideline sourced yet for this paper —
// subject profile flags this; answers below are grounded in the source text itself, since
// this paper's own sub-questions are largely direct source-comprehension items).

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 2,
      clues: "- Farisani's early activism organisations are named in the first sentence of Source 2A.\n- You need TWO organisation names, both within the Black Consciousness Movement.",
      approach: "- Re-read the first two sentences of Source 2A.\n- Identify the named organisations Farisani was a founding member of.",
      solution: "1. Source 2A states Farisani was 'a founding member of the Black People's Convention (BPC)'.\n2. It also states he 'co-founded the Black Evangelical Youth Organisation (BEYO)'.\n3. Answer: the Black People's Convention (BPC) and the Black Evangelical Youth Organisation (BEYO).",
    },
    {
      number: '2.1.2',
      marks: 3,
      clues: '- The types of abuse are listed together in the second paragraph of Source 2A.\n- You need any THREE distinct types.',
      approach: "- Scan the second paragraph of Source 2A for the list of abuses Farisani suffered during his incarcerations.\n- Select any three.",
      solution: '1. Source 2A states he was "subjected to brutal torture, including beatings, electric shocks and prolonged isolation".\n2. Any three of: beatings, electric shocks, prolonged isolation.',
    },
    {
      number: '2.1.3',
      marks: 2,
      clues: "- 'Prisoner of conscience' is a term used by Amnesty International for people detained purely for their beliefs, not for a crime.\n- Think about why Farisani was detained.",
      approach: '- Recall what "prisoner of conscience" means.\n- Apply this to Farisani\'s situation as described in the source.',
      solution: '1. Farisani was detained repeatedly without trial purely because of his outspoken political opposition to apartheid, not because he had committed any crime.\n2. Amnesty International uses "prisoner of conscience" specifically for people imprisoned for their beliefs or peaceful activism.\n3. Since his detention was a direct result of his activism rather than any criminal act, Amnesty International classified him this way and campaigned for his release.',
    },
    {
      number: '2.1.4',
      marks: 2,
      clues: '- Persecution involves being deliberately targeted and mistreated, usually over a sustained period.\n- Think about why the government kept detaining Farisani.',
      approach: "- Define 'persecution' in general terms.\n- Link it to the pattern of repeated detention and torture described in the source.",
      solution: "1. 'Persecution' means the sustained, hostile mistreatment of a person or group, typically because of their beliefs, identity or activities.\n2. In this context, persecution refers to the apartheid government's repeated detention, torture and harassment of Farisani because of his political opposition to the regime.",
    },
    {
      number: '2.2.1',
      marks: 2,
      clues: '- The names appear early in Source 2B, described as the authors of a letter.',
      approach: '- Re-read the opening lines of Source 2B for the names of the two implicated policemen.',
      solution: '1. Source 2B names "Mr JAM Silimela and Mr Magwaba, Venda Security Branch policemen".\n2. Answer: JAM Silimela and Magwaba.',
    },
    {
      number: '2.2.2',
      marks: 2,
      clues: "- Farisani says he doesn't hate the perpetrators, only wants the truth told.\n- Think about what tone this sets for his testimony.",
      approach: "- Consider what it means for a torture victim to say he does not hate his torturers.\n- Link this to the purpose of the TRC (truth and reconciliation, not revenge).",
      solution: "1. The statement suggests Farisani's testimony was not driven by a desire for revenge or hatred, but by a wish for honesty and accountability.\n2. This reflects the TRC's broader goal of reconciliation rather than punishment, and suggests his testimony can be seen as measured and credible rather than vengeful.",
    },
    {
      number: '2.2.3',
      marks: 2,
      clues: '- Ramaligela sang this while Farisani was being tortured with electric shocks.\n- Think about what mocking someone\'s religious faith during torture reveals about the torturer.',
      approach: "- Consider the context: this was said/sung during the torture itself.\n- Explain what mocking Farisani's faith suggests about the psychological tactics used.",
      solution: "1. The phrase was sung mockingly while Farisani was being tortured, using his religious faith (he was a pastor) against him.\n2. This suggests the Security Branch used psychological cruelty and humiliation, not just physical pain, to break down victims during interrogation.",
    },
    {
      number: '2.2.4',
      marks: 2,
      clues: '- Farisani is speaking about people who committed similar abuses but have not admitted to them.\n- Think about what "come back" implies about unresolved wrongdoing.',
      approach: '- Consider what Farisani is warning will happen if perpetrators do not confess.\n- Link this to the broader purpose of the TRC amnesty process.',
      solution: "1. Farisani is warning that perpetrators who do not honestly confess their crimes will not find genuine peace or resolution.\n2. This reflects the TRC's core principle: amnesty depended on full, truthful disclosure, and false or incomplete confessions would leave the underlying wrongs unresolved, likely to resurface.",
    },
    {
      number: '2.2.5',
      marks: 4,
      clues: '- This is direct first-hand oral testimony given under oath at an official hearing.\n- Consider how this differs from a second-hand or unofficial account.',
      approach: "- Identify who is speaking and in what setting.\n- Explain why first-hand testimony given at a formal, recorded hearing carries reliability.",
      solution: "1. Source 2B is Farisani's own first-hand account of what happened to him, given directly at an official TRC Human Rights Violation Committee hearing.\n2. Testimony given at a formal hearing, as part of the official TRC Final Report record, was recorded and scrutinised as part of a structured legal process.\n3. Farisani's own statement that he has no reason to lie about a named perpetrator (Ramaligela) supports the credibility of his account.\n4. This combination of first-hand experience and formal, recorded process makes it a reliable source for researching how the Committee dealt with his case.",
    },
    {
      number: '2.3.1',
      marks: 2,
      clues: '- Look at the opening lines of Source 2C for a direct statement about compliance with the Act.',
      approach: "- Re-read the first sentence of Source 2C.\n- Identify the exact wording showing the Committee accepted the applications met the Act's formal requirements.",
      solution: '1. Source 2C states: "The TRC Amnesty Committee is satisfied that the applications comply with the formal requirements of the Promotion of National Unity and Reconciliation Act, 1995".\n2. This direct quotation answers the question.',
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
      clues: "- 'Oral' means spoken, not written.\n- Contrast this with the applicants' written applications, also mentioned in the source.",
      approach: "- Define 'oral testimonies' using the word's meaning.\n- Distinguish it from the written applications mentioned alongside it in the source.",
      solution: "1. 'Oral testimonies' are spoken statements or evidence given by a witness or applicant, as opposed to written documents.\n2. In this context, they refer to what the three applicants said out loud when they testified at the TRC Amnesty Committee hearing, in addition to their written applications.",
    },
    {
      number: '2.3.4',
      marks: 2,
      clues: "- 'Full disclosure' was a legal requirement for amnesty under the Act.\n- Think about what failing this requirement means for the outcome of the applications.",
      approach: '- Recall that full disclosure of all relevant facts was a legal requirement for amnesty.\n- Explain the consequence of the Committee finding this requirement unmet.',
      solution: "1. Because the applicants did not make a full disclosure as required by section 20(1) of the Act, they failed to meet one of the Act's core legal requirements for amnesty.\n2. The conclusion is that their applications had to be rejected (FAIL), regardless of the political-objective requirement being met, since full disclosure was a separate, compulsory condition.",
    },
    {
      number: '2.4',
      marks: 4,
      clues: "- Look for specific details in Farisani's testimony (2B) that match the general pattern described in the TRC report (2C).",
      approach: "- Identify a specific torture method or detail Farisani describes in Source 2B.\n- Match it to the general pattern of methods the TRC report (Source 2C) says emerged consistently across victims.",
      solution: "1. Source 2B describes specific details such as electric shocks applied 'from the head to the toes and the thighs and even in my private parts', and being made to do press-ups and stand on his head.\n2. Source 2C confirms a consistent pattern across victims of 'electric shocks to their ear lobes and private parts' and 'instructions to do strenuous exercises'.\n3. Farisani's specific, first-hand account in Source 2B matches and supports the general pattern of abuse described in Source 2C, showing his case was part of a broader, consistent method of torture used by these applicants.",
    },
    {
      number: '2.5.1',
      marks: 4,
      clues: '- Dullah Omar is drawn oversized, looming over the scene.\n- The security policemen are drawn small, huddled together beneath him.',
      approach: '- Consider what size and positioning typically symbolise in a cartoon.\n- Apply this to both Dullah Omar and the group of security policemen.',
      solution: "1. (a) Dullah Omar is drawn very large and dominant, symbolising his authority and central role in exposing the truth about human rights abuses through the TRC.\n2. (b) The security policemen are drawn small and grouped together, symbolising their diminished, exposed and powerless position now that their crimes are being revealed.",
    },
    {
      number: '2.5.2',
      marks: 4,
      clues: "- Frame A is the police's official cover story; Frame B is what actually happened.\n- Compare the language and content of each frame.",
      approach: "- Summarise what Frame A claims happened.\n- Summarise what Frame B reveals actually happened.\n- Explain why the two accounts differ so sharply.",
      solution: "1. Frame A shows the official police version: that the prisoner 'slipped on soap, hit his head and died' — a claim of accidental death.\n2. Frame B reveals the real events: violence including a bag over the head, electric shocks to the testicles, and beating with an iron bar, ending in the prisoner's death.\n3. The two frames differ because Frame A is the false cover story the police originally gave to hide their crime, while Frame B is the true account exposed once the truth came out through the TRC process.",
    },
    {
      number: '2.6',
      marks: 8,
      clues: "- Draw on all four sources plus your own knowledge of the TRC process.\n- Aim for a short, structured paragraph, not a list.",
      approach: "- Identify Farisani's own suffering and activism (2A, 2B).\n- Identify what the TRC's investigation and decision revealed and required (2C).\n- Identify how the truth was publicly exposed and contrasted with the cover-up (2D).\n- Link these into one flowing paragraph answering 'why did the TRC reject the amnesty applications'.",
      solution: "1. Reverend Farisani was repeatedly detained and brutally tortured for his anti-apartheid activism, as shown by his own testimony and life story (Sources 2A, 2B).\n2. His first-hand account described consistent, severe torture methods including electric shocks, suffocation and forced exercises.\n3. The TRC's own investigation (Source 2C) found that the three applicants had continually downplayed their role, even though the evidence of multiple victims showed a consistent pattern of the same torture methods.\n4. Because the applicants failed to make a full disclosure of all relevant facts, as required by section 20(1) of the Act, the Committee rejected their applications.\n5. Source 2D's cartoon captures this outcome, contrasting the police's false cover story with the truth the TRC ultimately exposed.",
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
