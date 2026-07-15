'use strict';
/**
 * Resolves Firebase service-account paths for this repo's tools.
 *
 * Per workflows/README.md + .gitignore: service-account JSON files stay in
 * AMPM/.firebase/ and are referenced by absolute path from a local, untracked
 * .env at this repo's root:
 *
 *   AMPM_FIREBASE_SA_DEV=/abs/path/to/dev-service-account.json
 *   AMPM_FIREBASE_SA_PROD=/abs/path/to/prod-service-account.json
 *
 * Real environment variables take precedence over .env.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function loadDotEnv() {
  const envPath = path.join(REPO_ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

function serviceAccountPath(project) {
  loadDotEnv();
  const key = project === 'prod' ? 'AMPM_FIREBASE_SA_PROD' : 'AMPM_FIREBASE_SA_DEV';
  const p = process.env[key];
  if (!p) {
    console.error(`${key} is not set. Create a .env at the repo root pointing at the ` +
      `service-account JSON in AMPM/.firebase/ (see tools/README.md).`);
    process.exit(1);
  }
  if (!fs.existsSync(p)) {
    console.error(`${key} points at a missing file: ${p}`);
    process.exit(1);
  }
  return p;
}

module.exports = { serviceAccountPath };
