#!/usr/bin/env node
/**
 * Push one paper's lessons/questions from dev Cloud SQL to prod Cloud SQL, plus every
 * image they reference (dev media bucket -> prod media bucket).
 *
 * Prod is deliberately manually gated (PIPE-11) — this is that gate. Requires the
 * PG_*_PROD block in .env and a second Cloud SQL Auth Proxy running against prod:
 *   cloud-sql-proxy <PROD_PROJECT>:us-central1:ampm-backend --port 15433
 * (alongside the usual dev proxy on 15432 — both must be up at once.)
 *
 * Usage:
 *   node tools/push-paper-to-prod.js --subject maths --year 2019 --paper nov_p2 [--dry-run]
 *   node tools/push-paper-to-prod.js --subject maths --year 2019 --paper nov_p2 --publish
 *
 * Default mode copies dev -> prod with lessons/questions landing UNPUBLISHED
 * (is_published = false) so they can be spot-checked against the real prod app/API
 * before going live. Once verified, re-run with --publish to flip them live — that
 * step touches only rows already in prod, no dev read, no image work.
 *
 * What gets copied, in dependency order:
 *   1. curriculum_nodes (unit/topic/subtopic) referenced by this paper's questions —
 *      normally already in prod (shared across papers); created if missing.
 *   2. skills / tags referenced by this paper — same story, but for a paper's first
 *      prod push these are commonly missing wholesale.
 *   3. lessons (is_published forced false; views/upvotes/downvotes reset to 0)
 *   4. questions (is_published forced false)
 *   5. lesson_supplementary_materials (formula sheet, per-video study aids)
 *   6. lesson_ai_explanation_sub_questions
 *   7. question_skills / lesson_tags junction rows
 *
 * Every image URL under the dev bucket domain is downloaded and re-uploaded to the
 * prod bucket at the same object key (so the URL is a straight domain swap); an
 * object already present in the prod bucket is left alone (idempotent re-run, and
 * assets shared across lessons — e.g. the formula sheet — upload once).
 */

'use strict';

const { Pool } = require('pg');
const { Storage } = require('@google-cloud/storage');
const { pgConfig } = require('./lib/credentials');

const DEV_DOMAIN = 'https://media-dev.askmoreprepmore.app';
const PROD_DOMAIN = 'https://media.askmoreprepmore.app';
const DEV_BUCKET = 'media-dev.askmoreprepmore.app';
const PROD_BUCKET = 'media.askmoreprepmore.app';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : null;
}
const hasFlag = (name) => process.argv.includes(`--${name}`);

const subject = arg('subject');
const year = arg('year');
const paper = arg('paper');
const DRY_RUN = hasFlag('dry-run');
const PUBLISH = hasFlag('publish');

if (!subject || !year || !paper) {
  console.error(
    'Usage: node tools/push-paper-to-prod.js --subject <s> --year <y> --paper <p> [--dry-run] [--publish]',
  );
  process.exit(1);
}

// ── DB setup ─────────────────────────────────────────────────────────────────

const dev = new Pool({ ...pgConfig('dev'), max: 4 });
const prod = new Pool({ ...pgConfig('prod'), max: 4 });
const storage = new Storage();
const prodBucket = storage.bucket(PROD_BUCKET);

async function upsert(pool, table, columns, conflictColumns, rows) {
  if (rows.length === 0) return 0;
  const updateColumns = columns.filter((c) => !conflictColumns.includes(c));
  const conflictAction =
    updateColumns.length > 0
      ? `DO UPDATE SET ${updateColumns.map((c) => `${c} = EXCLUDED.${c}`).join(', ')}`
      : 'DO NOTHING';
  for (const row of rows) {
    const values = columns.map((c) => row[c]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const sql =
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) ` +
      `ON CONFLICT (${conflictColumns.join(', ')}) ${conflictAction}`;
    if (DRY_RUN) continue;
    await pool.query(sql, values);
  }
  return rows.length;
}

// ── Image mirroring ──────────────────────────────────────────────────────────

const uploadedThisRun = new Set();

function objectPathFromUrl(url) {
  return url.startsWith(DEV_DOMAIN) ? url.slice(DEV_DOMAIN.length + 1) : null;
}

function toProdUrl(url) {
  const path = objectPathFromUrl(url);
  return path ? `${PROD_DOMAIN}/${path}` : url;
}

async function mirrorImage(url) {
  const objectPath = objectPathFromUrl(url);
  if (!objectPath) return; // not a dev-bucket URL (e.g. a YouTube thumbnail) — leave as-is
  if (uploadedThisRun.has(objectPath)) return;
  uploadedThisRun.add(objectPath);

  const file = prodBucket.file(objectPath);
  const [exists] = await file.exists();
  if (exists) return;

  if (DRY_RUN) {
    console.log(`  [dry-run] would upload ${objectPath}`);
    return;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await file.save(buffer, { metadata: { cacheControl: 'public, max-age=31536000' } });
  console.log(`  uploaded ${objectPath}`);
}

function collectUrls(row, fields) {
  return fields.flatMap((f) => row[f] || []).filter(Boolean);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function publishOnly() {
  const l = await prod.query(
    `UPDATE lessons SET is_published = true, published_at = now()
     WHERE subject_id = $1 AND year_id = $2 AND paper_id = $3 AND is_deleted = false`,
    [subject, year, paper],
  );
  const q = await prod.query(
    `UPDATE questions SET is_published = true, published_at = now()
     WHERE subject_id = $1 AND year_id = $2 AND paper_id = $3 AND is_deleted = false`,
    [subject, year, paper],
  );
  console.log(`Published ${l.rowCount} lessons and ${q.rowCount} questions in prod.`);
}

async function main() {
  if (PUBLISH) {
    await publishOnly();
    return;
  }

  console.log(`${DRY_RUN ? '[dry-run] ' : ''}Pushing ${subject}/${year}/${paper} dev -> prod\n`);

  // Every row below is genuinely new to prod, even though its content was authored in dev
  // days/weeks ago — stamp created_at/updated_at as of THIS push, not copied from dev.
  // The app's incremental sync (LessonRepository/QuestionRepository.findPublished) is keyed
  // on updated_at: a copied-verbatim old timestamp makes a brand-new prod row invisible to
  // any client whose last sync checkpoint is more recent than that timestamp.
  const NOW = new Date();

  const lessonsRes = await dev.query(
    `SELECT * FROM lessons WHERE subject_id = $1 AND year_id = $2 AND paper_id = $3 AND is_deleted = false ORDER BY sort_order`,
    [subject, year, paper],
  );
  const lessons = lessonsRes.rows;
  if (lessons.length === 0) throw new Error('No matching lessons found in dev — check --subject/--year/--paper.');
  const lessonIds = lessons.map((l) => l.id);
  console.log(`lessons: ${lessons.length}`);

  const questionsRes = await dev.query(
    `SELECT * FROM questions WHERE lesson_id = ANY($1) AND is_deleted = false ORDER BY lesson_id, sort_order`,
    [lessonIds],
  );
  const questions = questionsRes.rows;
  const questionIds = questions.map((q) => q.id);
  console.log(`questions: ${questions.length}`);

  const suppRes = await dev.query(
    `SELECT * FROM lesson_supplementary_materials WHERE lesson_id = ANY($1) AND is_deleted = false`,
    [lessonIds],
  );
  const subQRes = await dev.query(
    `SELECT * FROM lesson_ai_explanation_sub_questions WHERE lesson_id = ANY($1) AND is_deleted = false`,
    [lessonIds],
  );
  const skillLinksRes = await dev.query(
    `SELECT DISTINCT skill_id FROM question_skills WHERE question_id = ANY($1)`,
    [questionIds],
  );
  const tagLinksRes = await dev.query(
    `SELECT DISTINCT tag_id FROM lesson_tags WHERE lesson_id = ANY($1)`,
    [lessonIds],
  );
  const skillIds = skillLinksRes.rows.map((r) => r.skill_id);
  const tagIds = tagLinksRes.rows.map((r) => r.tag_id);
  const curriculumIds = [
    ...new Set(questions.flatMap((q) => [q.unit_id, q.topic_id, q.subtopic_id]).filter(Boolean)),
  ];

  // ── 0. lookup tables (question_types / question_presentations) ──
  // Small, closed vocabularies — just mirror whichever rows this paper's questions use.
  const lookupCols = ['id', 'name', 'created_at', 'updated_at', 'is_deleted', 'deleted_at', 'is_published', 'published_at'];
  const typeIds = [...new Set(questions.map((q) => q.question_type_id).filter(Boolean))];
  const presentationIds = [...new Set(questions.map((q) => q.presentation_id).filter(Boolean))];
  for (const [table, ids] of [['question_types', typeIds], ['question_presentations', presentationIds]]) {
    const devRows = await dev.query(`SELECT * FROM ${table} WHERE id = ANY($1)`, [ids]);
    const prodExisting = await prod.query(`SELECT id FROM ${table} WHERE id = ANY($1)`, [ids]);
    const prodIds = new Set(prodExisting.rows.map((r) => r.id));
    const missing = devRows.rows
      .filter((r) => !prodIds.has(r.id))
      .map((r) => ({ ...r, created_at: NOW, updated_at: NOW }));
    await upsert(prod, table, lookupCols, ['id'], missing);
    console.log(`${table}: ${missing.length} created (${prodIds.size} already present)`);
  }

  // ── 1. curriculum_nodes (create only what's missing in prod) ──
  const curDev = await dev.query(`SELECT * FROM curriculum_nodes WHERE id = ANY($1)`, [curriculumIds]);
  const curProdExisting = await prod.query(`SELECT id FROM curriculum_nodes WHERE id = ANY($1)`, [curriculumIds]);
  const curProdIds = new Set(curProdExisting.rows.map((r) => r.id));
  const curMissing = curDev.rows
    .filter((r) => !curProdIds.has(r.id))
    .sort((a, b) => (a.unit_id ? 1 : 0) + (a.topic_id ? 1 : 0) - ((b.unit_id ? 1 : 0) + (b.topic_id ? 1 : 0)))
    .map((r) => ({ ...r, created_at: NOW, updated_at: NOW }));
  const curCols = ['id', 'type', 'name', 'subject_id', 'description', 'unit_id', 'topic_id',
    'created_at', 'updated_at', 'is_deleted', 'deleted_at', 'is_published', 'published_at'];
  await upsert(prod, 'curriculum_nodes', curCols, ['id'], curMissing);
  console.log(`curriculum_nodes: ${curMissing.length} created (${curProdIds.size} already present)`);

  // ── 2. skills / tags (create only what's missing in prod) ──
  const skillsDev = await dev.query(`SELECT * FROM skills WHERE id = ANY($1)`, [skillIds]);
  const skillsProdExisting = await prod.query(`SELECT id FROM skills WHERE id = ANY($1)`, [skillIds]);
  const skillsProdIds = new Set(skillsProdExisting.rows.map((r) => r.id));
  const skillsMissing = skillsDev.rows
    .filter((r) => !skillsProdIds.has(r.id))
    .map((r) => ({ ...r, created_at: NOW, updated_at: NOW }));
  const skillCols = ['id', 'name', 'description', 'subject_id', 'created_at', 'updated_at',
    'is_deleted', 'deleted_at', 'is_published', 'published_at'];
  await upsert(prod, 'skills', skillCols, ['id'], skillsMissing);
  console.log(`skills: ${skillsMissing.length} created (${skillsProdIds.size} already present)`);

  const tagsDev = await dev.query(`SELECT * FROM tags WHERE id = ANY($1)`, [tagIds]);
  const tagsProdExisting = await prod.query(`SELECT id FROM tags WHERE id = ANY($1)`, [tagIds]);
  const tagsProdIds = new Set(tagsProdExisting.rows.map((r) => r.id));
  const tagsMissing = tagsDev.rows
    .filter((r) => !tagsProdIds.has(r.id))
    .map((r) => ({ ...r, created_at: NOW, updated_at: NOW }));
  const tagCols = ['id', 'name', 'subject_id', 'created_at', 'updated_at',
    'is_deleted', 'deleted_at', 'is_published', 'published_at'];
  await upsert(prod, 'tags', tagCols, ['id'], tagsMissing);
  console.log(`tags: ${tagsMissing.length} created (${tagsProdIds.size} already present)`);

  // ── 3. Images — mirror every dev-bucket URL this paper references ──
  console.log('\nMirroring images to prod bucket...');
  const allUrls = new Set();
  for (const l of lessons) collectUrls(l, ['question_image_urls', 'memo_image_urls']).forEach((u) => allUrls.add(u));
  for (const q of questions) collectUrls(q, ['supplementary_material_image_urls']).forEach((u) => allUrls.add(u));
  for (const s of suppRes.rows) collectUrls(s, ['image_urls']).forEach((u) => allUrls.add(u));
  for (const url of allUrls) await mirrorImage(url);
  console.log(`images: ${allUrls.size} referenced, ${uploadedThisRun.size} object paths processed`);

  // ── 4. lessons ──
  const lessonCols = ['id', 'subject_id', 'syllabus_id', 'year_id', 'paper_id', 'series_id', 'name',
    'freemium_url', 'freemium_video_id', 'premium_url', 'thumbnail_url', 'has_video', 'content_tier',
    'sort_order', 'duration_seconds', 'xp', 'views', 'upvotes', 'downvotes', 'questions_count',
    'question_image_urls', 'memo_image_urls', 'exam_question_marks', 'created_at', 'updated_at',
    'is_deleted', 'deleted_at', 'english_text_id', 'is_published', 'published_at', 'ai_model',
    'ai_generated_at', 'ai_version', 'ai_reviewed', 'ai_input_tokens', 'ai_output_tokens',
    'ai_avg_rating', 'ai_rating_count'];
  const lessonRows = lessons.map((l) => ({
    ...l,
    views: 0,
    upvotes: 0,
    downvotes: 0,
    question_image_urls: (l.question_image_urls || []).map(toProdUrl),
    memo_image_urls: (l.memo_image_urls || []).map(toProdUrl),
    is_published: false,
    published_at: null,
    created_at: NOW,
    updated_at: NOW,
  }));
  await upsert(prod, 'lessons', lessonCols, ['id'], lessonRows);
  console.log(`\nlessons: ${lessonRows.length} upserted (unpublished)`);

  // ── 5. questions ──
  const questionCols = ['id', 'lesson_id', 'name', 'question', 'answer', 'presentation_id',
    'question_type_id', 'metadata', 'syllabus_id', 'subject_id', 'year_id', 'paper_id', 'sort_order',
    'xp', 'unit_id', 'topic_id', 'subtopic_id', 'difficulty', 'exam_weight', 'clues', 'created_at',
    'updated_at', 'is_deleted', 'deleted_at', 'english_text_id', 'is_published', 'published_at',
    'supplementary_material_type', 'supplementary_material_label', 'supplementary_material_image_urls',
    'context_text'];
  const questionRows = questions.map((q) => ({
    ...q,
    supplementary_material_image_urls: q.supplementary_material_image_urls
      ? q.supplementary_material_image_urls.map(toProdUrl)
      : q.supplementary_material_image_urls,
    is_published: false,
    published_at: null,
    created_at: NOW,
    updated_at: NOW,
  }));
  await upsert(prod, 'questions', questionCols, ['id'], questionRows);
  console.log(`questions: ${questionRows.length} upserted (unpublished)`);

  // ── 6. lesson_supplementary_materials ──
  const suppCols = ['id', 'lesson_id', 'type', 'label', 'image_urls', 'sort_order',
    'created_at', 'updated_at', 'is_deleted', 'deleted_at'];
  const suppRows = suppRes.rows.map((s) => ({
    ...s, image_urls: (s.image_urls || []).map(toProdUrl), created_at: NOW, updated_at: NOW,
  }));
  await upsert(prod, 'lesson_supplementary_materials', suppCols, ['id'], suppRows);
  console.log(`lesson_supplementary_materials: ${suppRows.length} upserted`);

  // ── 7. lesson_ai_explanation_sub_questions ──
  const subQCols = ['id', 'lesson_id', 'number', 'marks', 'clues', 'approach', 'solution',
    'sort_order', 'created_at', 'updated_at', 'is_deleted', 'deleted_at'];
  const subQRows = subQRes.rows.map((r) => ({ ...r, created_at: NOW, updated_at: NOW }));
  await upsert(prod, 'lesson_ai_explanation_sub_questions', subQCols, ['id'], subQRows);
  console.log(`lesson_ai_explanation_sub_questions: ${subQRows.length} upserted`);

  // ── 8. junction rows ──
  const qsRes = await dev.query(`SELECT question_id, skill_id FROM question_skills WHERE question_id = ANY($1)`, [questionIds]);
  await upsert(prod, 'question_skills', ['question_id', 'skill_id'], ['question_id', 'skill_id'], qsRes.rows);
  console.log(`question_skills: ${qsRes.rows.length} upserted`);

  const ltRes = await dev.query(`SELECT lesson_id, tag_id FROM lesson_tags WHERE lesson_id = ANY($1)`, [lessonIds]);
  await upsert(prod, 'lesson_tags', ['lesson_id', 'tag_id'], ['lesson_id', 'tag_id'], ltRes.rows);
  console.log(`lesson_tags: ${ltRes.rows.length} upserted`);

  console.log(
    `\n${DRY_RUN ? '[dry-run] nothing written.' : 'Done.'} Lessons/questions are UNPUBLISHED in prod.` +
    `\nSpot-check against prod, then run with --publish to go live:` +
    `\n  node tools/push-paper-to-prod.js --subject ${subject} --year ${year} --paper ${paper} --publish`,
  );
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await dev.end(); await prod.end(); });
