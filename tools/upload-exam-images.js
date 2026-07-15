#!/usr/bin/env node
/**
 * Upload exam paper images to Firebase Storage and print the resulting download URLs.
 *
 * Usage:
 *   node tools/upload-exam-images.js \
 *     --syllabus dbe \
 *     --subject math_lit \
 *     --year 2016 \
 *     --paper nov_p1 \
 *     --order 1 \
 *     --dir temp/images/q1/ \
 *     [--project dev|prod]          # defaults to dev
 *
 * Storage paths:
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/q{order}/question_{n}.png
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/q{order}/annexure_{n}.png
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/q{order}/memo_{n}.png
 *
 * Shared annexures (uploaded once, referenced in multiple documents):
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/annexures/{filename}
 *   Pass --shared-annexure to use this path instead.
 *
 * Supplementary material type/label (defaults to annexure for backwards compat):
 *   --supplementary-type  annexure|formula_sheet|data_sheet|reading_passage  (default: annexure)
 *   --supplementary-label "Annexure"|"Formula Sheet"|...                      (default: Annexure)
 *
 * Output:
 *   Prints a ready-to-paste JS snippet with the URLs for the Firestore document.
 */

const admin = require('firebase-admin');
const fs    = require('fs');
const path  = require('path');

// ── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : null;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

const syllabus             = getArg('syllabus');
const subject              = getArg('subject');
const year                 = getArg('year');
const paper                = getArg('paper');
const order                = getArg('order');
const dir                  = getArg('dir');
const sharedAnnexure       = hasFlag('shared-annexure');
const supplementaryType    = getArg('supplementary-type') || 'annexure';
const supplementaryLabel   = getArg('supplementary-label') || 'Annexure';
const project              = getArg('project') || 'dev';

if (!syllabus || !subject || !year || !paper || !order || !dir) {
  console.error('Usage: node upload-exam-images.js --syllabus <s> --subject <s> --year <y> --paper <p> --order <n> --dir <path> [--project dev|prod] [--supplementary-type <type>] [--supplementary-label <label>]');
  process.exit(1);
}

// ── Firebase init ────────────────────────────────────────────────────────────

const { serviceAccountPath } = require('./lib/credentials');

const PROJECTS = {
  dev:  { bucket: 'ampm-b9661.firebasestorage.app' },
  prod: { bucket: 'ampm-prod-3c0f6.firebasestorage.app' },
};

if (!PROJECTS[project]) {
  console.error(`Unknown project "${project}". Use dev or prod.`);
  process.exit(1);
}

if (!admin.apps.length) {
  const { bucket: bucketName } = PROJECTS[project];
  admin.initializeApp({
    credential:    admin.credential.cert(require(serviceAccountPath(project))),
    storageBucket: bucketName,
  });
}

const bucket = admin.storage().bucket();
console.log(`Project: ${project} (${PROJECTS[project].bucket})`);

// ── Upload ───────────────────────────────────────────────────────────────────

const baseStoragePath = `exam_papers/${syllabus}/${subject}/${year}/${paper}`;

async function uploadFile(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  const file = bucket.file(storagePath);
  await file.makePublic();
  const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
  return url;
}

async function uploadImageGroup(prefix, storageDirPath) {
  const files = fs.readdirSync(dir)
    .filter(f => f.startsWith(prefix) && f.endsWith('.png'))
    .sort();

  if (files.length === 0) return null;

  const urls = [];
  for (const filename of files) {
    const localPath   = path.join(dir, filename);
    const storagePath = `${storageDirPath}/${filename}`;
    console.log(`  uploading ${filename} → ${storagePath}`);
    const url = await uploadFile(localPath, storagePath);
    urls.push(url);
    console.log(`  ✓ ${url}`);
  }
  return urls;
}

async function main() {
  const questionDir  = `${baseStoragePath}/q${order}`;
  const annexureDir  = sharedAnnexure
    ? `${baseStoragePath}/annexures`
    : `${baseStoragePath}/q${order}`;

  const results = {};

  console.log('\nUploading question images...');
  const questionUrls = await uploadImageGroup('question_', questionDir);
  if (questionUrls) results.question_image_urls = questionUrls;

  console.log('\nUploading supplementary images...');
  const annexureUrls = await uploadImageGroup('annexure_', annexureDir);
  if (annexureUrls) {
    results.supplementary_materials = [
      { type: supplementaryType, label: supplementaryLabel, image_urls: annexureUrls }
    ];
  }

  console.log('\nUploading memo images...');
  const memoUrls = await uploadImageGroup('memo_', questionDir);
  if (memoUrls) results.memo_image_urls = memoUrls;

  // ── Print ready-to-paste snippet ──────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────');
  console.log('Paste into your Firestore upload script:');
  console.log('─────────────────────────────────────────────');
  for (const [key, urls] of Object.entries(results)) {
    console.log(`  ${key}: ${JSON.stringify(urls)},`);
  }
  console.log('─────────────────────────────────────────────\n');
}

main().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
