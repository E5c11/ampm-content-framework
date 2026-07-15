#!/usr/bin/env node
/**
 * Dumps the current curriculum vocabulary (units/topics/subtopics + skills) to a local JSON
 * file, so validate-questions.js can mechanically check a generated question set's
 * unit/topic/subtopic/skills values against what's actually in Firestore -- instead of relying
 * on a hardcoded, driftable list embedded in a workflow doc.
 *
 * Run this at the START of a generation session (Phase 0), before writing any questions --
 * the validator (--curriculum flag) checks against this snapshot, not a live query, so a
 * stale snapshot mid-session would silently pass values that were just added by a *different*
 * session. Re-run it if you suspect the vocabulary changed since you last dumped it.
 *
 * --subject math_lit (default): units/topics/subtopics from math_lit_curriculum
 *   (doc.id is the bare slug already, no unit-namespacing needed), skills from math_lit_skills.
 * --subject english_hl: units/topics/subtopics from english_lit_curriculum. Doc IDs there are
 *   namespaced per-parent (`${unit}__${topic}` / `${unit}__${topic}__${subtopic}`) because
 *   several topic/subtopic names legitimately recur under more than one unit -- the bare name
 *   is the last `__`-separated segment. There is no english_lit_skills collection: English's
 *   `skills` field is a per-question array with its own vocabulary (not curriculum-node-backed),
 *   so its "existing vocabulary" is the distinct skills[] values already used across
 *   english_questions docs -- matching upload-english.md's documented reuse-before-creating
 *   convention.
 *
 * Usage:
 *   node tools/dump-curriculum-vocabulary.js --project dev|prod --subject math_lit|english_hl --out temp/curriculum-vocab.json
 */

const args = process.argv.slice(2).reduce((acc, arg, i, arr) => {
  if (arg.startsWith('--')) acc[arg] = arr[i + 1] || true;
  return acc;
}, {});

const project = args['--project'] || 'dev';
const subject = args['--subject'] || 'math_lit';
const outPath = args['--out'] || 'temp/curriculum-vocab.json';

if (subject !== 'math_lit' && subject !== 'english_hl') {
  console.error('Usage: node tools/dump-curriculum-vocabulary.js --project dev|prod --subject math_lit|english_hl [--out path]');
  process.exit(1);
}

const { serviceAccountPath } = require('./lib/credentials');

const admin = require('firebase-admin');
if (!admin.apps.length) {
  const serviceAccount = require(serviceAccountPath(project));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

const fs = require('fs');
const path = require('path');

async function dumpMathLit() {
  const curriculumSnap = await db.collection('math_lit_curriculum').get();
  const units = new Set();
  const topics = new Set();
  const subtopics = new Set();

  curriculumSnap.docs.forEach((doc) => {
    const data = doc.data();
    if (data.type === 'unit') units.add(doc.id);
    if (data.type === 'topic') topics.add(doc.id);
    if (data.type === 'subtopic') subtopics.add(doc.id);
  });

  const skillsSnap = await db.collection('math_lit_skills').get();
  const skills = new Set(skillsSnap.docs.map((doc) => doc.id));

  return { units, topics, subtopics, skills };
}

async function dumpEnglishHl() {
  const curriculumSnap = await db.collection('english_lit_curriculum').get();
  const units = new Set();
  const topics = new Set();
  const subtopics = new Set();

  curriculumSnap.docs.forEach((doc) => {
    const data = doc.data();
    const parts = doc.id.split('__');
    if (data.type === 'unit') units.add(parts[0]);
    if (data.type === 'topic') topics.add(parts[1]);
    if (data.type === 'subtopic') subtopics.add(parts[2]);
  });

  const questionsSnap = await db.collection('english_questions').get();
  const skills = new Set();
  questionsSnap.docs.forEach((doc) => {
    const data = doc.data();
    if (Array.isArray(data.skills)) {
      data.skills.forEach((s) => skills.add(s));
    }
  });

  return { units, topics, subtopics, skills };
}

async function main() {
  const { units, topics, subtopics, skills } = subject === 'english_hl'
    ? await dumpEnglishHl()
    : await dumpMathLit();

  const vocab = {
    dumpedAt: new Date().toISOString(),
    project,
    subject,
    units: [...units].sort(),
    topics: [...topics].sort(),
    subtopics: [...subtopics].sort(),
    skills: [...skills].sort(),
  };

  const absOut = path.resolve(outPath);
  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, JSON.stringify(vocab, null, 2));

  console.log(`Dumped ${units.size} units, ${topics.size} topics, ${subtopics.size} subtopics, ${skills.size} skills (${subject}) to ${absOut}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
