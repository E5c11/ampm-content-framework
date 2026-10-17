#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 9.2–9.3: Networks, ethical use, BYOD and a video that will not open (order 18)
 * Question 9.2.1–9.2.3 and 9.3.1–9.3.2 — choosing a network type and medium, ethical use of a network, disadvantages of BYOD and fixing a video that does not respond.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l18.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l18.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l18.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 9.2–9.3: Networks, ethical use, BYOD and a video that will not open",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "network_types",
    "network_media",
    "ethical_network_use",
    "byod",
    "video_file_problems"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q18/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q18/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q18/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q18/memo_2.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each network type to the description that fits it.",
    "metadata": [
      "A - LAN",
      "B - WAN",
      "C - PAN",
      "D - WLAN",
      "1 - Computers spread over a large geographic area, such as the internet",
      "2 - Devices around one person, such as a phone and earphones",
      "3 - A local network in which devices connect wirelessly",
      "4 - Computers in a small area such as a lab or a school"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "network_technologies",
    "topic": "network_types",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- Think about how far apart the computers are.\n- The first letter of each term is a clue."
  },
  {
    "name": "Question 2",
    "question": "A lab has ten computers in a room with a lot of electrical interference. Which connection medium is best and why?",
    "metadata": [
      "Wi-Fi, because it is not affected by electrical interference",
      "Radio waves, because they never lose their signal strength over distance",
      "Copper cable, because it cannot be affected by any interference",
      "Fibre optic cable, because electrical interference does not affect it",
      ""
    ],
    "answer": [
      "Fibre optic cable, because electrical interference does not affect it",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "network_technologies",
    "topic": "network_media",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Which TWO actions help a club make sure that its network is used ethically?",
    "metadata": [
      "Share one password with all club members",
      "Give each user a unique log-in and a strong password",
      "Give every member full administrator access",
      "Set different access rights for different users",
      "Keep the network policy secret from members"
    ],
    "answer": [
      "Give each user a unique log-in and a strong password",
      "Set different access rights for different users",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "network_technologies",
    "topic": "network_policies",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Which TWO are disadvantages of letting learners bring their own devices (BYOD)?",
    "metadata": [
      "Every learner gets faster internet automatically",
      "The school has to buy every device itself",
      "Personal devices may be stolen",
      "Devices may not work with the club's software",
      "Viruses cannot spread over the network"
    ],
    "answer": [
      "Personal devices may be stolen",
      "Devices may not work with the club's software",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "network_technologies",
    "topic": "byod",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 5",
    "question": "A video file does not respond when a learner opens it. Which TWO actions could solve the problem?",
    "metadata": [
      "Delete the operating system and start again",
      "Update or reinstall the video player",
      "Convert the file to another video format",
      "Disconnect the monitor cable and reconnect it",
      "Increase the screen brightness to the maximum"
    ],
    "answer": [
      "Update or reinstall the video player",
      "Convert the file to another video format",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "troubleshooting",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.2.1",
      "marks": 1,
      "clues": "- A WAN covers a large area.\n- The computers are in a school lab.",
      "approach": "- Compare the area of the computers with the area a WAN serves.",
      "solution": "1. The computers are in a small geographic area (the school lab)."
    },
    {
      "number": "9.2.2",
      "marks": 2,
      "clues": "- Choose a medium and give a reason.\n- One mark for the medium and one for the motivation.",
      "approach": "- Pick wireless or wired and justify it.",
      "solution": "1. Name a wired or wireless connection.\n2. Give a reason: wireless gives less clutter, easy addition of devices and mobility; wired is less prone to interference, stable in speed, and fibre optic has no electrical interference."
    },
    {
      "number": "9.2.3",
      "marks": 2,
      "clues": "- Ethical use means using the network responsibly.\n- Think about log-ins and policies.",
      "approach": "- Explain two ways to ensure it.",
      "solution": "1. Any two: unique log-in with strong passwords, different access rights or reviewed permissions, regular password changes, clearly informing members of network policies and data usage."
    },
    {
      "number": "9.3.1",
      "marks": 2,
      "clues": "- BYOD means learners bring their own devices.\n- Think about security and compatibility.",
      "approach": "- State two disadvantages for the club.",
      "solution": "1. Any two: devices can be stolen, compatibility problems, distractions from apps or games, malware spreading over the network, difficulty controlling data usage, not all learners have a device, security cannot be enforced on all devices, network bottleneck, access to sensitive data."
    },
    {
      "number": "9.3.2",
      "marks": 2,
      "clues": "- The video file does not respond.\n- Think about the software that plays it and the file format.",
      "approach": "- State two ways to resolve it.",
      "solution": "1. Any two: update or re-install software, close unused tasks, restart the device, use another video player, update codecs, or convert to another video format."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
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
