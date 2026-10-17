'use strict';
// Creates the CAT curriculum vocabulary (units/topics/subtopics/skills/tags) needed by the lesson data, idempotently, dev only.
// Node ids are global (flat) — refuses to touch an id another subject already owns.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { getPool, closePool } = require('../../../tools/lib/postgres');
const lessons = [];
const { lessonDir } = require('./lib');
for (const f of fs.readdirSync(lessonDir()).filter((x) => /^lessons-.*\.js$/.test(x)).sort()) lessons.push(...require(path.join(lessonDir(), f)));
const root = path.join(__dirname, '..', '..', '..');
const title = (s) => s.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const SUBJ = 'cat';

(async () => {
  const units = new Set(), topics = new Map(), subs = new Map(), skills = new Set(), tags = new Set();
  const { emit } = require('./lib');
  for (const L of lessons) {
    const { questions, video } = emit(L);
    for (const q of questions) {
      units.add(q.unit); if (!topics.has(q.topic)) topics.set(q.topic, q.unit);
      if (!subs.has(q.subtopic)) subs.set(q.subtopic, { unit: q.unit, topic: q.topic });
      q.skills.forEach((s) => skills.add(s));
    }
    video.tags.forEach((t) => tags.add(t));
  }
  const pool = getPool('dev');
  const owner = async (table, id) => (await pool.query(`SELECT subject_id FROM ${table} WHERE id=$1`, [id])).rows[0]?.subject_id;
  const jobs = [];
  for (const u of units) jobs.push({ table: 'curriculum_nodes', id: u, args: ['tools/create-curriculum-node.js', '--subject', SUBJ, '--type', 'unit', '--slug', u, '--name', title(u)] });
  for (const [t, u] of topics) jobs.push({ table: 'curriculum_nodes', id: t, args: ['tools/create-curriculum-node.js', '--subject', SUBJ, '--type', 'topic', '--unit', u, '--slug', t, '--name', title(t)] });
  for (const [s, p] of subs) jobs.push({ table: 'curriculum_nodes', id: s, args: ['tools/create-curriculum-node.js', '--subject', SUBJ, '--type', 'subtopic', '--unit', p.unit, '--topic', p.topic, '--slug', s, '--name', title(s)] });
  for (const s of skills) jobs.push({ table: 'skills', id: s, args: ['tools/create-skill.js', '--subject', SUBJ, '--id', s, '--name', title(s)] });
  for (const t of tags) jobs.push({ table: 'tags', id: t, args: ['tools/create-tag.js', '--subject', SUBJ, '--id', t, '--name', title(t)] });
  let created = 0, skipped = 0, clash = [];
  for (const j of jobs) {
    const o = await owner(j.table, j.id);
    if (o && o !== SUBJ) { clash.push(`${j.table}:${j.id} (owned by ${o})`); continue; }
    if (o === SUBJ) { skipped++; continue; }
    const r = spawnSync('node', j.args, { cwd: root, encoding: 'utf8' });
    if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); }
    created++;
  }
  console.log(`created ${created}, already present ${skipped}`);
  if (clash.length) { console.log('CLASHES (rename these in the lesson data):\n  ' + clash.join('\n  ')); }
  await closePool('dev');
})();
