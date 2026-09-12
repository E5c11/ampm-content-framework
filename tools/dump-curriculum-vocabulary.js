#!/usr/bin/env node
/**
 * Dumps the current curriculum vocabulary (unit/topic/subtopic slugs + skill IDs) for a
 * subject to a local JSON file, so validate-questions.js can mechanically check a generated
 * question set's unit/topic/subtopic/skills values (PIPE-08 / PIPE-09).
 *
 * Reads from the backend's Cloud SQL Postgres (curriculum_nodes, skills) — the source of
 * truth since authoring moved off Firestore. Start the Auth Proxy first:
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432
 *
 * Run at the START of a generation session, before writing any questions — the validator
 * checks against this snapshot, not a live query. Re-run it if you add a curriculum row
 * mid-session (tools/create-curriculum-node.js / create-skill.js).
 *
 *   node tools/dump-curriculum-vocabulary.js [--env dev|prod] --subject math_lit|english_hl \
 *     --out temp/curriculum-vocab.json
 *
 * Subject allowlist below is deliberately explicit (not "any string") so a typo'd subject
 * fails loudly instead of silently dumping an empty vocabulary — add new subjects here as
 * their curriculum_nodes tables get populated.
 *
 * math_lit: curriculum_nodes IDs are flat slugs already. english_hl: topic/subtopic IDs are
 * namespaced under their parent (`unit__topic`, `unit__topic__subtopic`) because names
 * legitimately recur across units — the bare slug is the last `__`-separated segment.
 * Skills: `skills` rows for the subject (English HL skills are real rows now, not just
 * distinct usage across question docs as in the Firestore era).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('./lib/postgres');
const { bareUnitSlug } = require('./lib/curriculum');

const args = process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith('--')) acc[a.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  return acc;
}, {});

const env = args.env || args.project || 'dev'; // --project kept as an alias for older docs
const subject = args.subject || 'math_lit';
const outPath = args.out || 'temp/curriculum-vocab.json';

if (!['math_lit', 'english_hl', 'maths', 'geography', 'physics', 'life_science', 'history'].includes(subject)) {
  console.error('Usage: node tools/dump-curriculum-vocabulary.js [--env dev|prod] --subject math_lit|english_hl|maths|geography|physics|life_science|history [--out path]');
  process.exit(1);
}

// topic/subtopic bare name = last `__` segment; unit bare name also strips any subject prefix
const bareTopicSlug = (id) => id.split('__').pop();
const bareUnit = (id) => bareUnitSlug(subject, id);

async function main() {
  const pool = getPool(env);

  const { rows: nodes } = await pool.query(
    `SELECT id, type FROM curriculum_nodes WHERE subject_id = $1 AND is_deleted = false`,
    [subject],
  );
  const { rows: skillRows } = await pool.query(
    `SELECT id FROM skills WHERE subject_id = $1 AND is_deleted = false`,
    [subject],
  );

  const pick = (t, bare) =>
    [...new Set(nodes.filter((n) => n.type === t).map((n) => bare(n.id)))].sort();

  const vocab = {
    dumpedAt: new Date().toISOString(),
    project: env,
    subject,
    units: pick('unit', bareUnit),
    topics: pick('topic', bareTopicSlug),
    subtopics: pick('subtopic', bareTopicSlug),
    skills: [...new Set(skillRows.map((r) => r.id))].sort(),
  };

  const absOut = path.resolve(outPath);
  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, JSON.stringify(vocab, null, 2));

  console.log(
    `Dumped ${vocab.units.length} units, ${vocab.topics.length} topics, ` +
    `${vocab.subtopics.length} subtopics, ${vocab.skills.length} skills (${subject}, ${env}) to ${absOut}`,
  );
}

main()
  .catch((e) => {
    console.error('\n❌ dump failed:', e.message);
    console.error('   Is the Cloud SQL Auth Proxy running on the port in PG_PORT_' + env.toUpperCase() + '?');
    process.exitCode = 1;
  })
  .finally(closePool);
