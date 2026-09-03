#!/usr/bin/env node
/**
 * Upload extracted exam-page PNGs to the AMPM media bucket and print the resulting URLs
 * (pipeline Phase 1.5, PIPE-02).
 *
 * Auth: Application Default Credentials (`gcloud auth application-default login`). No
 * service-account JSON, no Auth Proxy — this talks to GCS directly.
 *
 * Usage:
 *   node tools/upload-exam-images.js \
 *     --syllabus dbe --subject math_lit --year 2016 --paper nov_p1 \
 *     --order 1 --dir temp/images/q1/ \
 *     [--project dev]                 # only 'dev' supported until prod is provisioned
 *     [--supplementary-type annexure --supplementary-label "Annexure"]
 *     [--shared-annexure]
 *
 * Object keys (unchanged from the Firebase-Storage era, so migrated + newly-authored
 * content share one layout):
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/q{order}/question_{n}.png
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/q{order}/annexure_{n}.png
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/q{order}/memo_{n}.png
 *   exam_papers/{syllabus}/{subject}/{year}/{paper}/annexures/{filename}   (--shared-annexure)
 *
 * The bucket is uniform-bucket-level-access + already world-readable, so there is no
 * per-object "make public" step. Files are served at
 *   https://media-dev.askmoreprepmore.app/<objectKey>
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

// ── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const syllabus = getArg('syllabus');
const subject = getArg('subject');
const year = getArg('year');
const paper = getArg('paper');
const order = getArg('order');
const dir = getArg('dir');
const sharedAnnexure = hasFlag('shared-annexure');
const supplementaryType = getArg('supplementary-type') || 'annexure';
const supplementaryLabel = getArg('supplementary-label') || 'Annexure';
const project = getArg('project') || 'dev';

if (!syllabus || !subject || !year || !paper || !order || !dir) {
  console.error(
    'Usage: node upload-exam-images.js --syllabus <s> --subject <s> --year <y> --paper <p> ' +
    '--order <n> --dir <path> [--project dev] [--supplementary-type <t>] [--supplementary-label <l>]',
  );
  process.exit(1);
}

// ── Bucket ───────────────────────────────────────────────────────────────────

const BUCKETS = {
  dev: 'media-dev.askmoreprepmore.app',
  // prod: 'media.askmoreprepmore.app'  — owner-gated, not provisioned yet
};
const DOMAINS = {
  dev: 'https://media-dev.askmoreprepmore.app',
};

if (!BUCKETS[project]) {
  console.error(`Unknown/unsupported --project "${project}". Only 'dev' is available.`);
  process.exit(1);
}

const storage = new Storage();
const bucket = storage.bucket(BUCKETS[project]);
console.log(`Project: ${project} (gs://${BUCKETS[project]})`);

// ── Upload ───────────────────────────────────────────────────────────────────

const baseStoragePath = `exam_papers/${syllabus}/${subject}/${year}/${paper}`;

async function uploadFile(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  return `${DOMAINS[project]}/${storagePath}`;
}

async function uploadImageGroup(prefix, storageDirPath) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.png'))
    .sort();
  if (files.length === 0) return null;

  const urls = [];
  for (const filename of files) {
    const storagePath = `${storageDirPath}/${filename}`;
    console.log(`  uploading ${filename} → ${storagePath}`);
    const url = await uploadFile(path.join(dir, filename), storagePath);
    urls.push(url);
    console.log(`  ✓ ${url}`);
  }
  return urls;
}

async function main() {
  const questionDir = `${baseStoragePath}/q${order}`;
  const annexureDir = sharedAnnexure ? `${baseStoragePath}/annexures` : `${baseStoragePath}/q${order}`;

  const results = {};

  console.log('\nUploading question images...');
  const questionUrls = await uploadImageGroup('question_', questionDir);
  if (questionUrls) results.question_image_urls = questionUrls;

  console.log('\nUploading supplementary images...');
  const annexureUrls = await uploadImageGroup('annexure_', annexureDir);
  if (annexureUrls) {
    results.supplementary_materials = [
      { type: supplementaryType, label: supplementaryLabel, image_urls: annexureUrls },
    ];
  }

  console.log('\nUploading memo images...');
  const memoUrls = await uploadImageGroup('memo_', questionDir);
  if (memoUrls) results.memo_image_urls = memoUrls;

  console.log('\n─────────────────────────────────────────────');
  console.log('Paste into your upload script (Phase 2 data):');
  console.log('─────────────────────────────────────────────');
  for (const [key, val] of Object.entries(results)) {
    console.log(`  ${key}: ${JSON.stringify(val)},`);
  }
  console.log('─────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
