#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 5.10–5.20: Poppie — Die Drama — Teks J
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks J l.8
 *   Q2: P: Teks J l.17-18
 *   Q3: P: Teks J
 *   Q4: P: Teks J l.14-19
 *   Q5: P: Teks J
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q10.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q10.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q10.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Lesson document ─────────────────────────────────────────────────────────

const video = {
  "name": "Vraag 5: Poppie – Die Drama (5.10–5.20)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dramatic_techniques",
    "character_analysis",
    "contextual_questions"
  ],
  "text_key": "poppie_die_drama",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q10/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q10/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q10/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q10/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q10/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks J",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q10/annexure_teks_j_1.png"
      ]
    }
  ]
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 1",
    "text_key": "poppie_die_drama",
    "order": 1,
    "context_text": null,
    "question": "Watter stylfiguur kom voor in: \"Kort daarna het moeilikheid by Poppie se deur kom aanklop\"?",
    "metadata": [
      "vergelyking",
      "hiperbool",
      "personifikasie",
      "klanknabootsing",
      ""
    ],
    "answer": [
      "personifikasie",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "identifiseer_stylfiguur",
    "skills": [
      "afrikaans_fal_identifiseer_stylfiguur"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Moeilikheid kan nie werklik aanklop nie.\n- Aan wat word 'n menslike handeling gegee?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "poppie_die_drama",
    "order": 2,
    "context_text": null,
    "question": "Wat beteken: \"daar het hierdie tyd 'n groot eensaamheid en verlange in Poppie se hart gekom\"?",
    "metadata": [
      "Poppie het gevoel sy het te veel mense om haar.",
      "Poppie het baie alleen gevoel en haar gesin gemis.",
      "Poppie het gevoel sy moet haar kinders straf.",
      "Poppie het gevoel sy het haar huis verloor.",
      ""
    ],
    "answer": [
      "Poppie het baie alleen gevoel en haar gesin gemis.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "betekenis_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan hoe Poppie ver van haar gesin bly.\n- Wat voel 'n mens as jy iemand mis?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "poppie_die_drama",
    "order": 3,
    "context_text": null,
    "question": "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.",
    "metadata": [
      "Stone ontvang en lees Poppie se brief.",
      "Tata-ka-Bonsile stuur veertig rand.",
      "Poppie praat met bitterheid dat almal huise het.",
      "Stone gaan na twee weke weer huis toe.",
      ""
    ],
    "answer": [
      "Poppie praat met bitterheid dat almal huise het.",
      "Stone gaan na twee weke weer huis toe.",
      "Stone ontvang en lees Poppie se brief.",
      "Tata-ka-Bonsile stuur veertig rand.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "volgorde_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_rangskik_gebeure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Volg die uittreksel van bo na onder.\n- Die geld word aan die einde genoem."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "poppie_die_drama",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor die uittreksel is ONWAAR?",
    "metadata": [
      "Die meisie is 'n weeskind.",
      "Die mense het damage-geld gevra.",
      "Tata-ka-Bonsile het veertig rand gestuur.",
      "Bonsile en die meisie was saam in st. 10.",
      ""
    ],
    "answer": [
      "Bonsile en die meisie was saam in st. 10.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "onwaar_stelling",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- In watter standerd was Bonsile en die meisie?\n- Toets elke stelling teen Stone se woorde."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "poppie_die_drama",
    "order": 5,
    "context_text": null,
    "question": "Kies TWEE temas wat in die uittreksel na vore kom.",
    "metadata": [
      "Eensaamheid en verlange na familie",
      "Die voordele van sportdeelname vir jong mense by die skool",
      "Ouers se verantwoordelikheid vir hulle kinders se dade",
      "Hoe om 'n huis te bou en dit mooi te versier",
      ""
    ],
    "answer": [
      "Eensaamheid en verlange na familie",
      "Ouers se verantwoordelikheid vir hulle kinders se dade",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "tema_en_boodskap",
    "subtopic": "temas_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Hoe voel Poppie, en wat gebeur met Bonsile?\n- Twee opsies pas by die uittreksel."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.10",
      "marks": 4,
      "clues": "- Dink aan hoe Poppie se werk in die Kaap verloop het.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Poppie het by die garage gewerk en by die Union Kollege geleer (dit kan eerste of laaste wees).\n2. Poppie het inslaapwerk by die kwekery gekry.\n3. Poppie het agt pond 'n maand by Mrs Scobie verdien.\n4. Mrs Swanepoel het Poppie gehelp om haar pas reg te kry."
    },
    {
      "number": "5.11",
      "marks": 1,
      "clues": "- Dink aan Stone se werk en blyplek.",
      "approach": "- Soek een gebeurtenis",
      "solution": "1. Stone het in 'n steenhuis in die bachelor-quarters gaan bly of nagskof begin werk."
    },
    {
      "number": "5.12",
      "marks": 1,
      "clues": "- By wie het Kindjie en Fezi gaan bly?",
      "approach": "- Gee 'n feit wat die stelling weerlê",
      "solution": "1. Hulle het by Mosie gaan bly."
    },
    {
      "number": "5.13",
      "marks": 1,
      "clues": "- Hoe voel Poppie oor die ander se lewens?",
      "approach": "- Verduidelik hoekom jy jammer voel",
      "solution": "1. Dit is hartseer as jy voel niemand mis jou nie; Poppie is eensaam terwyl almal sonder haar regkom."
    },
    {
      "number": "5.14",
      "marks": 1,
      "clues": "- Wat beteken dit om jou eie pad te loop?",
      "approach": "- Toets elke opsie",
      "solution": "1. B (hy het sy eie reëls gemaak en gevolg)."
    },
    {
      "number": "5.15",
      "marks": 1,
      "clues": "- Wie moet help as 'n kind iemand skade berokken?",
      "approach": "- Verduidelik waarom jy kan identifiseer",
      "solution": "1. As jou kind skade berokken het, moet jy help; jou familie se naam en eer is op die spel."
    },
    {
      "number": "5.16.1",
      "marks": 1,
      "clues": "- Waarvoor staan die mans op?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. partydig vir die meisie omdat haar geleenthede weggeneem is."
    },
    {
      "number": "5.16.2",
      "marks": 1,
      "clues": "- Wie praat vir die meisie?",
      "approach": "- Gee een rede",
      "solution": "1. Iemand moes namens haar praat want sy was 'n weeskind en niemand anders sou vir haar veg nie."
    },
    {
      "number": "5.17.1",
      "marks": 1,
      "clues": "- Kan 'n spoor loop?",
      "approach": "- Kies die stylfiguur",
      "solution": "1. personifikasie."
    },
    {
      "number": "5.17.2",
      "marks": 1,
      "clues": "- Wat beteken die vetgedrukte woorde?",
      "approach": "- Verduidelik in jou eie woorde",
      "solution": "1. Die skuldige (die pa van die kind) bly in Poppie se huis; dit is haar seun."
    },
    {
      "number": "5.18",
      "marks": 1,
      "clues": "- Wat moes Poppie na Stone se dood doen?",
      "approach": "- Soek die direkte gevolg",
      "solution": "1. Poppie moes gaan werk en alleenouer wees."
    },
    {
      "number": "5.19",
      "marks": 2,
      "clues": "- Wat het Poppie besef?",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Haar kinders moes nou hulle eie keuses maak.\n2. Sy het besef sy kon nie meer doen nie en dat alles die Here se wil is."
    },
    {
      "number": "5.20",
      "marks": 1,
      "clues": "- Hoe het familiebesluite Poppie beïnvloed?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Jakkie se verkeerde dade het Poppie se kinders en ma betrek."
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
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
