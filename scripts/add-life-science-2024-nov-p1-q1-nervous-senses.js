#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 1 (Nervous System and Senses) (order 2)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2): the nervous-system, eye and ear items of Q1 — 1.1.5 (reflex arc), 1.1.6
 * (accommodation), 1.1.9 (round window), 1.1.10 (balance pathway), 1.2.2 (autonomic NS), 1.2.3 (cristae), 1.2.4 (stapes),
 * 1.2.6 (cochlea), 1.3.2 (medulla), 1.3.3 (blind spot). 16 marks. Independent lesson; each practice question tests one
 * relationship (DESIGN-UNI-08) with a fresh scenario, no figure (DESIGN-LIFE-03 option (i)).
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q1-nervous-senses.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q1-nervous-senses.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q1-nervous-senses.js
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
  "name": "Question 1 (Nervous System and Senses)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 80,
  "tags": [
    "nervous_system",
    "sense_organs",
    "ear_structure",
    "eye_structure",
    "reflex_arc"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q2/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q2/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q2/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 16
};

const questions = [
  {
    "name": "Question 1",
    "question": "A person touches a hot pot and pulls the hand away before feeling pain. Arrange the parts of this reflex arc in the order in which the impulse passes through them.",
    "metadata": [
      "Motor neuron",
      "Receptor in the skin of the finger",
      "Muscle in the arm",
      "Interneuron in the spinal cord",
      "Sensory neuron"
    ],
    "answer": [
      "Receptor in the skin of the finger",
      "Sensory neuron",
      "Interneuron in the spinal cord",
      "Motor neuron",
      "Muscle in the arm"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "reflex_arc_pathway",
    "skills": [
      "sequence_reflex_arc_pathway"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The impulse starts where the stimulus is detected and ends at the effector.\n- The spinal cord connects incoming and outgoing neurons."
  },
  {
    "name": "Question 2",
    "question": "A student looks up at a distant mountain and then down at a map in her hands. Which changes take place in her eyes as she focuses on the map?",
    "metadata": [
      "Ciliary muscles relax, suspensory ligaments become taut, lens becomes less convex",
      "Ciliary muscles contract, suspensory ligaments become taut, lens becomes less convex",
      "Ciliary muscles relax, suspensory ligaments slacken, lens becomes more convex",
      "Ciliary muscles contract, suspensory ligaments slacken, lens becomes more convex",
      ""
    ],
    "answer": [
      "Ciliary muscles contract, suspensory ligaments slacken, lens becomes more convex",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "accommodation_structure_states",
    "skills": [
      "predict_accommodation_structure_states"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Light from a near object needs to be bent more.\n- Work out what the muscles must do for the lens to change shape."
  },
  {
    "name": "Question 3",
    "question": "Match each part of the ear to the most likely result if it were damaged.",
    "metadata": [
      "A - Ossicles fused together",
      "B - Round window unable to bulge",
      "C - Cristae damaged",
      "D - Organ of Corti damaged",
      "1 - Pressure waves in the cochlea cannot be released",
      "2 - Vibrations in the cochlea are not converted into impulses",
      "3 - Vibrations are not passed from the eardrum to the oval window",
      "4 - Changes in the speed and direction of head movement go undetected"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "ear_damage_consequences",
    "skills": [
      "match_ear_part_to_damage_consequence"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Decide whether each part transmits vibrations, releases pressure, or contains receptors.\n- Receptors in the cochlea serve hearing, those in the semicircular canals serve balance."
  },
  {
    "name": "Question 4",
    "question": "A person standing still tilts her head to one side. Which receptors detect this change, and which part of the brain interprets the impulses to keep her balanced?",
    "metadata": [
      "Cristae in the semicircular canals; cerebellum",
      "Maculae in the utriculus and sacculus; cerebellum",
      "Maculae in the utriculus and sacculus; cerebrum",
      "Organ of Corti in the cochlea of the inner ear; cerebrum",
      ""
    ],
    "answer": [
      "Maculae in the utriculus and sacculus; cerebellum",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "balance_receptor_pathway",
    "skills": [
      "identify_balance_receptor_and_brain_region"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- One set of balance receptors responds to head position, another to movement.\n- One part of the brain coordinates balance and muscle activity."
  },
  {
    "name": "Question 5",
    "question": "When a person is frightened, the heart beats faster and the pupils dilate without any conscious decision. Which part of the nervous system brings about these changes?",
    "metadata": [
      "The somatic nervous system",
      "The parasympathetic section of the autonomic nervous system",
      "The sympathetic section of the autonomic nervous system",
      "The cerebrum of the central nervous system",
      ""
    ],
    "answer": [
      "The sympathetic section of the autonomic nervous system",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "sympathetic_parasympathetic_roles",
    "skills": [
      "identify_autonomic_section_from_response"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The response is involuntary and prepares the body for action.\n- The two sections of this system have opposite effects."
  },
  {
    "name": "Question 6",
    "question": "Match each part of the brain to the most likely effect of damage to it.",
    "metadata": [
      "A - Medulla oblongata",
      "B - Cerebellum",
      "C - Corpus callosum",
      "D - Cerebrum",
      "1 - The two cerebral hemispheres cannot share information",
      "2 - Irregular breathing and heart rate",
      "3 - Loss of memory and of voluntary movement",
      "4 - Loss of balance and poorly coordinated movement"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "brain_damage_consequences",
    "skills": [
      "match_brain_region_to_damage_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Recall the main function of each part first.\n- Damage removes that function."
  },
  {
    "name": "Question 7",
    "question": "Light from the tip of a pencil falls exactly on the point where the optic nerve leaves the eyeball. Why is the tip of the pencil not seen?",
    "metadata": [
      "There are no rods or cones there, so no impulses are generated",
      "The cones there are stimulated only by bright coloured light",
      "The lens cannot focus light onto that part of the retina at all",
      "The impulses from that point are sent to the cerebellum instead",
      ""
    ],
    "answer": [
      "There are no rods or cones there, so no impulses are generated",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "blind_spot_explanation",
    "skills": [
      "explain_blind_spot"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- An image is seen only if photoreceptors produce impulses.\n- Consider what the optic nerve takes up at this point."
  },
  {
    "name": "Question 8",
    "question": "Name the tube that connects the middle ear to the pharynx and keeps the air pressure equal on both sides of the eardrum.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "Eustachian tube|eustachian|auditory tube|eustachian tubes",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "eustachian_tube_term",
    "skills": [
      "name_eustachian_tube"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- It opens when you swallow or yawn, which is why your ears pop in an aeroplane."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- A reflex arc starts at a receptor and ends at an effector.\n- Check the order of the two types of neuron.",
      "approach": "- Find the options that start with the receptor.\n- Check that the sensory neuron comes before the motor neuron.",
      "solution": "1. The thorn stimulates pain receptors in the skin.\n2. A sensory neuron carries the impulse to the spinal cord, and a motor neuron carries it to the leg muscle (the effector).\n3. The answer is D."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- The ball is far away, so light rays from it are almost parallel.\n- X is the ciliary muscle, Y the suspensory ligament and Z the lens.",
      "approach": "- Decide whether the eye needs strong or weak refraction for a distant object.\n- Work out the state of the ciliary muscle, then the ligaments, then the lens.",
      "solution": "1. For distant vision the ciliary muscles relax.\n2. The suspensory ligaments become taut and pull on the lens.\n3. The lens becomes less convex, so the answer is C."
    },
    {
      "number": "1.1.9",
      "marks": 2,
      "clues": "- A is the eardrum and C is the tube that leads down to the pharynx.\n- Excess pressure waves in the cochlea have to escape somewhere.",
      "approach": "- Identify parts A, B and C on the diagram.\n- Recall which membrane of the inner ear bulges outward to absorb the pressure waves.",
      "solution": "1. A is the eardrum, B is the round window and C is the Eustachian tube.\n2. Pressure waves in the fluid of the cochlea are absorbed when the round window (B) bulges outward into the middle ear.\n3. The answer is C."
    },
    {
      "number": "1.1.10",
      "marks": 2,
      "clues": "- E comes from the semicircular canals and J from the cochlea.\n- Balance is coordinated in a different part of the brain from hearing.",
      "approach": "- Identify which branch carries balance impulses.\n- Follow the auditory nerve (F) to the part of the brain that coordinates balance.",
      "solution": "1. Balance impulses start in the semicircular canals (E).\n2. They travel along the auditory nerve (F) to the cerebellum (H).\n3. The answer is B: E → F → H."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- This part works without conscious control.",
      "approach": "- Recall the divisions of the peripheral nervous system.\n- Name the one with sympathetic and parasympathetic sections.",
      "solution": "1. The autonomic nervous system controls involuntary actions.\n2. It has a sympathetic and a parasympathetic section."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- They are found in the ampullae of the semicircular canals.",
      "approach": "- Separate the balance receptors that sense head position from those that sense movement.\n- Name the receptors that respond to changes in speed and direction.",
      "solution": "1. The cristae are in the ampullae at the base of the semicircular canals.\n2. They detect changes in the speed and direction of head movement."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- It is the last of the three small bones of the middle ear.",
      "approach": "- List the ossicles in order from the eardrum.\n- Name the one that touches the oval window.",
      "solution": "1. The ossicles are the hammer, anvil and stirrup.\n2. The stirrup (stapes) passes vibrations to the oval window."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- It is the coiled, fluid-filled part of the inner ear used for hearing.",
      "approach": "- Recall the parts of the inner ear.\n- Name the one that contains the hearing receptors.",
      "solution": "1. The organ of Corti contains the hearing receptors.\n2. It is located in the cochlea."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- Heart rate is an involuntary activity.\n- Consider what the corpus callosum connects.",
      "approach": "- Recall the function of the corpus callosum.\n- Recall the function of the medulla oblongata.\n- Decide which of them controls heart rate.",
      "solution": "1. The corpus callosum connects the two cerebral hemispheres.\n2. The medulla oblongata controls involuntary actions such as heart rate and breathing.\n3. The answer is B only."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- One option is part of the retina and the other is at the front of the eye.\n- Consider where the optic nerve leaves the eye.",
      "approach": "- Check whether each structure is on the retina.\n- Check which one lacks photoreceptors.",
      "solution": "1. The blind spot is where the optic nerve leaves the retina, and it has no rods or cones.\n2. The cornea is the transparent front of the eye, not part of the retina.\n3. The answer is A only."
    }
  ],
  model: 'claude-opus-5-5',
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
