#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 3.2 (Central Nervous System and Reflex Arc) (order 13)
 *
 * Real Q3.2 (13 marks) is a brain + spinal-cord cross-section figure with: name the branch (CNS), letter-and-name of the cerebrum /
 * cerebellum / medulla by function, and a 6-mark description of the reflex pathway from D to E. One lesson (DESIGN-UNI-10 rule 1).
 * Fresh practice questions test the parts by function and consequence with no figure (DESIGN-LIFE-03 option (i)); the 6-mark prose
 * description becomes an ordering plus a reflex-features multi_select (DESIGN-LIFE-02). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q3-2-nervous-system-reflex.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q3-2-nervous-system-reflex.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q3-2-nervous-system-reflex.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const video = {
  "name": "Question 3.2 (Central Nervous System and Reflex Arc)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "central_nervous_system",
    "reflex_arc",
    "brain_regions"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q13/memo_1.png"
  ],
  "exam_question_marks": 13
};

const questions = [
  {
    "name": "Question 1",
    "question": "Match each part of the central nervous system to its function.",
    "metadata": [
      "A - Cerebrum",
      "B - Cerebellum",
      "C - Medulla oblongata",
      "D - Corpus callosum",
      "1 - Conscious thought and the control of voluntary muscle movements",
      "2 - Maintains balance and coordinates movement",
      "3 - Controls involuntary processes such as breathing and heart rate",
      "4 - Connects the left and right halves of the brain"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "brain_region_functions",
    "skills": [
      "match_brain_region_to_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Separate the parts that control voluntary actions from those that control automatic ones."
  },
  {
    "name": "Question 2",
    "question": "A person touches a hot plate and pulls their hand away before feeling any pain. Arrange the pathway of the impulse in the correct order.",
    "metadata": [
      "A sensory neuron carries the impulse to the spinal cord through the dorsal root",
      "Receptors in the skin detect the heat",
      "An interneuron passes the impulse to a motor neuron across synapses",
      "The effector muscle contracts and the hand is withdrawn",
      "The motor neuron carries the impulse out of the spinal cord through the ventral root"
    ],
    "answer": [
      "Receptors in the skin detect the heat",
      "A sensory neuron carries the impulse to the spinal cord through the dorsal root",
      "An interneuron passes the impulse to a motor neuron across synapses",
      "The motor neuron carries the impulse out of the spinal cord through the ventral root",
      "The effector muscle contracts and the hand is withdrawn"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "reflex_arc_pathway",
    "skills": [
      "sequence_reflex_arc_pathway"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The impulse travels from the receptor, through the spinal cord, to the effector."
  },
  {
    "name": "Question 3",
    "question": "Which of the following make up the central nervous system?",
    "metadata": [
      "The brain and the cranial nerves",
      "The spinal cord and the spinal nerves",
      "The spinal nerves and the autonomic nerves",
      "The brain and the spinal cord",
      ""
    ],
    "answer": [
      "The brain and the spinal cord",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "cns_composition",
    "skills": [
      "identify_cns_components"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The peripheral nervous system consists of the nerves that connect the central nervous system to the rest of the body."
  },
  {
    "name": "Question 4",
    "question": "After an accident, a man's spinal cord is completely severed in his lower back. Why can he no longer feel or move his legs?",
    "metadata": [
      "Impulses can no longer travel between his brain and his legs through the spinal cord",
      "His cerebrum has stopped producing impulses",
      "His legs no longer contain any receptors or muscles",
      "His cerebellum can no longer secrete hormones",
      ""
    ],
    "answer": [
      "Impulses can no longer travel between his brain and his legs through the spinal cord",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "spinal_cord_injury_effect",
    "skills": [
      "predict_effect_of_spinal_cord_damage"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The spinal cord is the pathway that joins the brain to the body below the injury."
  },
  {
    "name": "Question 5",
    "question": "Which of the following are features of a reflex action?",
    "metadata": [
      "It is a rapid response",
      "It is involuntary, so it does not need conscious thought",
      "It is processed in the spinal cord without waiting for the cerebrum",
      "It is controlled by the cerebrum, so it is slow",
      "It does not involve any neurons"
    ],
    "answer": [
      "It is a rapid response",
      "It is involuntary, so it does not need conscious thought",
      "It is processed in the spinal cord without waiting for the cerebrum",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "reflex_action_features",
    "skills": [
      "identify_reflex_action_features"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A reflex protects the body, so speed matters more than deliberate thought."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- The figure shows the brain and the spinal cord together.",
      "approach": "- Recall which parts form the central nervous system.",
      "solution": "1. The brain and spinal cord together form the central nervous system."
    },
    {
      "number": "3.2.2(a)",
      "marks": 2,
      "clues": "- This part sits at the back of the brain below the main hemispheres.\n- Give both the letter and the name.",
      "approach": "- Recall which brain region controls balance and coordination.\n- Find it on the diagram.",
      "solution": "1. Balance and coordination are controlled by the cerebellum.\n2. It is labelled B."
    },
    {
      "number": "3.2.2(b)",
      "marks": 2,
      "clues": "- This part joins the brain to the spinal cord.\n- Give both the letter and the name.",
      "approach": "- Recall which region controls breathing.\n- Find it at the base of the brain.",
      "solution": "1. Breathing is controlled by the medulla oblongata.\n2. It is labelled C."
    },
    {
      "number": "3.2.2(c)",
      "marks": 2,
      "clues": "- This is the largest part of the brain and controls voluntary actions.\n- Give both the letter and the name.",
      "approach": "- Recall which region controls skeletal muscles.\n- Find the large upper part of the brain.",
      "solution": "1. Voluntary control of skeletal muscles is the role of the cerebrum.\n2. It is labelled A."
    },
    {
      "number": "3.2.3",
      "marks": 6,
      "clues": "- Start with the neuron that carries the impulse towards the spinal cord.\n- D is where impulses enter the cord and E is where they leave.",
      "approach": "- Name the neuron and root that carry the impulse into the spinal cord.\n- State how the impulse is passed to the next neuron.\n- Name the neuron and root that carry it out.\n- State what the impulse finally reaches.",
      "solution": "1. The impulse is transmitted by the sensory neuron.\n2. It enters the spinal cord through the dorsal root of the spinal nerve.\n3. It passes to the interneuron and then to the motor neuron.\n4. The impulse is passed on by synaptic contact.\n5. It leaves the cord through the ventral root.\n6. It reaches the effector, which brings about the reflex action."
    }
  ],
  model: 'claude-sonnet-5-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions. Dev only; idempotent; the gate is per EXAM, so it covers P2 too.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
