#!/usr/bin/env node
/**
 * Upload-script template — pipeline Phase 4 (AMPM-CONTENT-PIPELINE).
 *
 * Copy to add-<subject>-<year>-<paper>-q<N>.js, fill the three data blocks, then:
 *   1. node tools/validate-questions.js --script <this file> [--curriculum temp/curriculum-vocab.json]
 *      — HARD STOP: do not upload until it exits 0 (PIPE-10).
 *   2. node <this file>          — runs against DEV only (PIPE-11).
 *
 * Collection names come from the subject profile (subjects/{profile}.md):
 *   math_lit:   math_videos    / math_questions
 *   maths:      maths_videos   / maths_questions
 *   english_hl: english_videos / english_questions
 */

'use strict';

const admin = require('firebase-admin');
const { serviceAccountPath } = require('./lib/credentials');

const VIDEOS_COLLECTION = 'CHANGE_ME_videos';
const QUESTIONS_COLLECTION = 'CHANGE_ME_questions';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath('dev'))),
  });
}

const db = admin.firestore();

// ─── Phase 2 data ────────────────────────────────────────────────────────────

const video = {
  // Full field template: subject profile + AMPM-CONTENT-PIPELINE reference tables.
};

// ─── Phase 3 data ────────────────────────────────────────────────────────────

const questions = [
  // Per AMPM-CONTENT-SCHEMA + presentations/{type}.md. video: "PLACEHOLDER" here;
  // replaced with the real doc ID below.
];

// ─── AI explanation (generated in the Claude Code session, AMPM-CONTENT-AI-EXP) ──

const aiExplanation = {
  sub_questions: [
    // { number, marks, clues, approach, solution } — formats per AIEXP-02..05.
  ],
  model: 'CHANGE_ME',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

// ─── Upload ──────────────────────────────────────────────────────────────────

async function upload() {
  console.log('🎬 Uploading video...');
  const videoRef = await db.collection(VIDEOS_COLLECTION).add({ ...video, ai_explanation: aiExplanation });
  console.log('  ✓ Created video:', videoRef.id);

  await videoRef.update({ questions_count: questions.length });

  console.log('❓ Uploading questions...');
  const batch = db.batch();
  questions.forEach(q => {
    const ref = db.collection(QUESTIONS_COLLECTION).doc();
    batch.set(ref, { ...q, video: videoRef.id });
  });
  await batch.commit();
  console.log('  ✓ Created', questions.length, 'question(s)');

  console.log('\n✅ Done. Video ID:', videoRef.id);
  process.exit(0);
}

upload().catch(err => {
  console.error('\n❌ Upload failed:', err.message);
  process.exit(1);
});
