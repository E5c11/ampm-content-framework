#!/usr/bin/env node
/**
 * Upload a per-question supplementary figure (recreated diagram, generated graph/table
 * image, …) to the media bucket and print the `supplementary_material` value to paste
 * into a question doc (pipeline Phase 3/4).
 *
 * Distinct from `upload-exam-images.js`, which uploads real exam-page extracts to
 * `exam_papers/...` for the *lesson*-level `question_image_urls` /
 * `supplementary_materials` (plural — annexures/formula sheets shared across the
 * lesson). This tool is for a single *question*'s own `supplementary_material`
 * (singular — one `{type, label, image_urls}` value on that question's row), for a
 * newly-generated asset (SVG→PNG diagram, matplotlib graph) that was never part of the
 * source exam PDF. Documented path convention (subject profiles, e.g. dbe-maths.md /
 * dbe-physics.md) that had no uploader until now:
 *   question_supplementary/{subject}/{year}/{paper}/q{order}/{type}_{index}.png
 *
 * Auth: Application Default Credentials (same as upload-exam-images.js). No Auth Proxy.
 *
 * Usage:
 *   node tools/upload-question-supplementary.js \
 *     --subject physics --year 2025 --paper nov_p1 --order 2 \
 *     --type diagram --files temp/images/q2-supp/force_diagram.png \
 *     [--project dev]
 *
 * --files accepts a comma-separated list — pass several for a multi-image
 * supplementary_material (image_urls is always an array, even for one file).
 *
 * When pasting the printed value into a question doc: use the literal URL string, not a
 * shared `const` reference (e.g. `${SUPP}/...`). tools/validate-questions.js extracts
 * and evals the `questions` array in isolation from the rest of the upload script, so a
 * question-level field referencing an outer `const` fails with "<name> is not defined"
 * (found 2026-09-09, physics Q2's free-body diagram — the first question-level
 * supplementary_material any script had used).
 */

'use strict';

const path = require('path');
const { Storage } = require('@google-cloud/storage');

const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : null;
};

const subject = getArg('subject');
const year = getArg('year');
const paper = getArg('paper');
const order = getArg('order');
const type = getArg('type');
const label = getArg('label') || null;
const filesArg = getArg('files');
const project = getArg('project') || 'dev';

if (!subject || !year || !paper || !order || !type || !filesArg) {
  console.error(
    'Usage: node upload-question-supplementary.js --subject <s> --year <y> --paper <p> ' +
    '--order <n> --type <diagram|circuit|graph|table|shape> --files <path[,path...]> ' +
    '[--label "<label>"] [--project dev]',
  );
  process.exit(1);
}

const BUCKETS = {
  dev: 'media-dev.askmoreprepmore.app',
  // prod: 'media.askmoreprepmore.app' — owner-gated, not provisioned yet
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

const baseStoragePath = `question_supplementary/${subject}/${year}/${paper}/q${order}`;

async function uploadFile(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  return `${DOMAINS[project]}/${storagePath}`;
}

async function main() {
  const files = filesArg.split(',').map((f) => f.trim());
  const urls = [];

  console.log(`\nUploading ${files.length} supplementary image(s)...`);
  for (let i = 0; i < files.length; i++) {
    const ext = path.extname(files[i]) || '.png';
    const storagePath = `${baseStoragePath}/${type}_${i + 1}${ext}`;
    console.log(`  uploading ${files[i]} → ${storagePath}`);
    const url = await uploadFile(files[i], storagePath);
    urls.push(url);
    console.log(`  ✓ ${url}`);
  }

  console.log('\n─────────────────────────────────────────────');
  console.log('Paste into the question doc (Phase 3 data):');
  console.log('─────────────────────────────────────────────');
  const material = { type, label, image_urls: urls };
  console.log(`  supplementary_material: ${JSON.stringify(material)},`);
  console.log('─────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
