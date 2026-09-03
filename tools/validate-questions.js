#!/usr/bin/env node
/**
 * Validates question sets before upserting to the backend's Postgres (`questions` table).
 *
 * Usage:
 *   # Validate questions array from an upload script:
 *   node tools/validate-questions.js --script scripts/add-maths-2019-nov-p1-q1-1.js
 *
 *   # Same, plus check unit/topic/subtopic/skills against a real curriculum snapshot
 *   # (dump one first: node tools/dump-curriculum-vocabulary.js --out temp/curriculum-vocab.json):
 *   node tools/validate-questions.js --script scripts/add-ml-2025-jun-p1-q1-1.js --curriculum temp/curriculum-vocab.json
 *
 *   # Validate ai_explanation data file:
 *   node tools/validate-questions.js --ai-exp scripts/ai-exp-data/ml-2025-jun-p1.js
 *
 * Exit code: 0 = all pass, 1 = violations found.
 */

'use strict';

const path = require('path');
const fs   = require('fs');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const scriptPath = flag('--script');
const aiExpPath  = flag('--ai-exp');
const curriculumPath = flag('--curriculum');

if (!scriptPath && !aiExpPath) {
  console.error('Usage:');
  console.error('  node tools/validate-questions.js --script <upload-script.js>');
  console.error('  node tools/validate-questions.js --ai-exp <ai-exp-data.js>');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

// The upload script is never executed here — its `questions` array is extracted from source
// (Date.now() stubbed, eval'd in isolation), so validation can't open a DB connection or
// write anything. The upload script itself also guards its run behind `require.main`.

function extractQuestionsFromSource(filePath) {
  const src = fs.readFileSync(path.resolve(filePath), 'utf8');
  // Find the `const questions = [...]` block via a sandboxed eval.
  const match = src.match(/(?:const|let|var)\s+questions\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return null;
  try {
    // Replace Date.now() with a static value so eval works.
    const normalized = match[1].replace(/Date\.now\(\)/g, '1000000000000');
    // eslint-disable-next-line no-eval
    return eval(normalized);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Validation rules
// ---------------------------------------------------------------------------

// answer array is always exactly 5 elements for these types
const FIXED_ANSWER_TYPES  = new Set(['fitb', 'fraction', 'multiple_choice', 'multi_select', 'equation']);
// metadata array is also exactly 5 elements for these types
const FIXED_METADATA_TYPES = new Set(['multiple_choice', 'multi_select']);
// metadata should be empty for these types
const EMPTY_METADATA_TYPES = new Set(['fraction', 'equation']);
const VARIABLE_LENGTH_TYPES = new Set(['ordering', 'match', 'steps']);
const ALL_TYPES = new Set([...FIXED_ANSWER_TYPES, ...VARIABLE_LENGTH_TYPES]);

const REQUIRED_FIELDS = ['name', 'question', 'metadata', 'answer', 'presentation', 'type', 'unit', 'topic', 'difficulty', 'xp', 'order'];

// Loaded once in main(), passed through to validateQuestion — null when --curriculum wasn't
// given, in which case the unit/topic/subtopic/skills existence checks are skipped entirely
// (backward compatible: this flag is optional, existing call sites without it still work).
let curriculumVocab = null;

function validateQuestion(q, index, allQuestions) {
  const label = q.name || `Question ${index + 1}`;
  const errors = [];
  const warn = msg => errors.push({ level: 'error', msg });

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (q[field] === undefined || q[field] === null || q[field] === '') {
      warn(`Missing required field: ${field}`);
    }
  }

  // ── Curriculum vocabulary existence (only when --curriculum was supplied) ─
  // Presence-only checks above never verify unit/topic/subtopic/skills are anything more
  // than a non-empty string — this is what actually catches "invented a new value inline and
  // never added it to math_lit_curriculum/math_lit_skills first" before it becomes 138 missing
  // reference rows discovered months later.
  if (curriculumVocab) {
    const subject = curriculumVocab.subject || 'math_lit';
    const curriculumCollection = subject === 'english_hl' ? 'english_lit_curriculum' : 'math_lit_curriculum';
    const skillsSource = subject === 'english_hl'
      ? 'existing english_questions skills[] usage (no separate skills collection for English)'
      : 'math_lit_skills';

    if (q.unit && !curriculumVocab.units.includes(q.unit)) {
      warn(`"unit" value "${q.unit}" not found in ${curriculumCollection} — add it there first (query "type == 'unit'"), don't just use it inline`);
    }
    if (q.topic && !curriculumVocab.topics.includes(q.topic)) {
      warn(`"topic" value "${q.topic}" not found in ${curriculumCollection} — add it there first (query "type == 'topic'"), don't just use it inline`);
    }
    if (q.subtopic && !curriculumVocab.subtopics.includes(q.subtopic)) {
      warn(`"subtopic" value "${q.subtopic}" not found in ${curriculumCollection} — add it there first (query "type == 'subtopic'"), don't just use it inline`);
    }
    if (Array.isArray(q.skills)) {
      for (const skill of q.skills) {
        if (!curriculumVocab.skills.includes(skill)) {
          warn(`skill "${skill}" not found in ${skillsSource} — add it there first, don't just use it inline`);
        }
      }
    }
  }

  const p = q.presentation;

  // Unknown presentation type
  if (p && !ALL_TYPES.has(p)) {
    warn(`Unknown presentation type: "${p}"`);
    return { label, errors };
  }

  // ── Array length rules ────────────────────────────────────────────────────

  if (p && FIXED_ANSWER_TYPES.has(p)) {
    if (!Array.isArray(q.answer) || q.answer.length !== 5) {
      warn(`answer must have exactly 5 elements for "${p}" (got ${Array.isArray(q.answer) ? q.answer.length : typeof q.answer})`);
    }
  }

  if (p && FIXED_METADATA_TYPES.has(p)) {
    if (!Array.isArray(q.metadata) || q.metadata.length !== 5) {
      warn(`metadata must have exactly 5 elements for "${p}" (got ${Array.isArray(q.metadata) ? q.metadata.length : typeof q.metadata})`);
    }
  }

  if (p && EMPTY_METADATA_TYPES.has(p)) {
    if (Array.isArray(q.metadata) && q.metadata.length > 0) {
      warn(`metadata should be an empty array [] for "${p}" (got ${q.metadata.length} element(s))`);
    }
  }

  if (p && VARIABLE_LENGTH_TYPES.has(p)) {
    if (!Array.isArray(q.metadata) || q.metadata.length === 0) {
      warn(`metadata must be a non-empty array for "${p}"`);
    }
    if (!Array.isArray(q.answer) || q.answer.length === 0) {
      warn(`answer must be a non-empty array for "${p}"`);
    }
  }

  // ordering: metadata and answer must be the same length
  if (p === 'ordering') {
    if (Array.isArray(q.metadata) && Array.isArray(q.answer) && q.metadata.length !== q.answer.length) {
      warn(`"ordering" metadata and answer must have the same length (metadata: ${q.metadata.length}, answer: ${q.answer.length})`);
    }
  }

  // ── No newlines in question field ─────────────────────────────────────────

  if (typeof q.question === 'string' && q.question.includes('\n')) {
    warn(`"question" field contains a newline (\\n) — must be a single flat string`);
  }

  // ── fitb / steps: "[ ]" must be its own element, never embedded ──────────

  if ((p === 'fitb' || p === 'steps') && Array.isArray(q.metadata)) {
    for (let i = 0; i < q.metadata.length; i++) {
      const el = String(q.metadata[i]);
      // Embedded blank: text + [ ] in the same string
      if (/\S/.test(el) && el.includes('[ ]') && el.trim() !== '[ ]') {
        warn(`metadata[${i}] has "[ ]" embedded inside a longer string ("${el}") — "[ ]" must be its own element`);
      }
      // "[]" (no space) is not a valid blank token — contract is "[ ]" only
      // (Inventory #5, 2026-07-15: the custom keyboard's inputCount() only counts
      // "[ ]", so a "[]" token renders a blank with no matching keyboard input).
      if (el.includes('[]')) {
        warn(`metadata[${i}] contains "[]" (no space) — the blank token is "[ ]" with a space, and only as its own element`);
      }
      // steps blanks are matched exactly (untrimmed) by the renderer and inputCount()
      if (p === 'steps' && el.trim() === '[ ]' && el !== '[ ]') {
        warn(`metadata[${i}] is a padded blank token (${JSON.stringify(el)}) — "steps" requires the exact string "[ ]" with no surrounding whitespace`);
      }
    }
  }

  // ── steps: question field must be plain instruction (no \frac or \sqrt) ──

  if (p === 'steps' && typeof q.question === 'string') {
    if (/\\frac\{|\\sqrt\{/.test(q.question)) {
      warn(`"steps" question field contains \\frac{} or \\sqrt{} — move the expression to metadata[0] as the first given step`);
    }
  }

  // ── fraction: answer[0] = numerator, answer[1] = denominator ─────────────

  if (p === 'fraction' && Array.isArray(q.answer)) {
    if (!q.answer[0] || !q.answer[1]) {
      warn(`"fraction" answer must have numerator at [0] and denominator at [1] — both are empty`);
    }
  }

  // ── clues format (if present) ─────────────────────────────────────────────

  if (q.clues !== undefined && q.clues !== null) {
    if (typeof q.clues !== 'string') {
      warn(`"clues" must be a string or null (got ${typeof q.clues})`);
    } else {
      const bullets = q.clues.split('\n');
      if (bullets.some(b => b && !b.startsWith('- '))) {
        warn(`"clues" lines must all start with "- " (found: "${bullets.find(b => b && !b.startsWith('- '))}")`);
      }
      if (bullets.length > 3) {
        warn(`"clues" has ${bullets.length} bullets — maximum is 3`);
      }
      if (q.clues.endsWith('\n')) {
        warn(`"clues" has a trailing newline`);
      }
    }
  }

  // ── approach format (if present) ─────────────────────────────────────────

  if (q.approach !== undefined && q.approach !== null) {
    if (typeof q.approach !== 'string') {
      warn(`"approach" must be a string or null (got ${typeof q.approach})`);
    } else {
      const bullets = q.approach.split('\n');
      if (bullets.some(b => b && !b.startsWith('- '))) {
        warn(`"approach" lines must all start with "- " (found: "${bullets.find(b => b && !b.startsWith('- '))}")`);
      }
      if (bullets.length < 2 || bullets.length > 4) {
        warn(`"approach" has ${bullets.length} bullet(s) — expected 2–4`);
      }
    }
  }

  // ── difficulty and exam_weight range ─────────────────────────────────────

  if (q.difficulty !== undefined && (q.difficulty < 1 || q.difficulty > 5)) {
    warn(`"difficulty" must be 1–5 (got ${q.difficulty})`);
  }
  if (q.exam_weight !== undefined && (q.exam_weight < 1 || q.exam_weight > 3)) {
    warn(`"exam_weight" must be 1–3 (got ${q.exam_weight})`);
  }

  return { label, errors };
}

function validateSet(questions) {
  const results = questions.map((q, i) => validateQuestion(q, i, questions));

  // ── Variety rule (across the whole set) ───────────────────────────────────

  const setErrors = [];
  const types = questions.map(q => q.presentation).filter(Boolean);
  const uniqueTypes = new Set(types);

  if (questions.length === 3 && uniqueTypes.size < 2) {
    setErrors.push(`Variety rule: 3-question set must use at least 2 different presentation types (only has: ${[...uniqueTypes].join(', ')})`);
  }
  if (questions.length >= 4 && uniqueTypes.size < 3) {
    setErrors.push(`Variety rule: 4+ question set must use at least 3 different presentation types (only has: ${[...uniqueTypes].join(', ')})`);
  }

  // ── Answer position distribution (index 0 max 10%) ──────────────────────
  // Checked at paper level by audit-firestore-questions.js — sample too small here.

  // ── True/False cap: ≤ 20% of the set ─────────────────────────────────────

  const tfCount = questions.filter(q =>
    q.presentation === 'multiple_choice' &&
    Array.isArray(q.metadata) &&
    q.metadata.filter(m => m !== '').length === 2 &&
    ['True', 'False'].every(v => q.metadata.includes(v))
  ).length;

  if (tfCount > 0 && tfCount / questions.length > 0.2) {
    setErrors.push(`True/False cap: ${tfCount}/${questions.length} questions are True/False — exceeds 20% limit`);
  }

  return { results, setErrors };
}

// ---------------------------------------------------------------------------
// AI explanation validation
// ---------------------------------------------------------------------------

function validateAiExp(data) {
  const allErrors = [];

  for (const [orderKey, entry] of Object.entries(data)) {
    const prefix = `Order ${orderKey}`;

    if (!Array.isArray(entry.sub_questions) || entry.sub_questions.length === 0) {
      allErrors.push({ label: prefix, msg: 'sub_questions must be a non-empty array' });
      continue;
    }

    for (const [i, sq] of entry.sub_questions.entries()) {
      const label = `${prefix} sub_question[${i}] (${sq.number || '?'})`;

      if (!sq.number) allErrors.push({ label, msg: 'Missing field: number' });
      if (!sq.marks)  allErrors.push({ label, msg: 'Missing field: marks' });

      // clues
      if (sq.clues === undefined || sq.clues === null) {
        allErrors.push({ label, msg: '"clues" is missing — set to null only if no meaningful hint can be given' });
      } else if (typeof sq.clues === 'string') {
        const bullets = sq.clues.split('\n');
        if (bullets.some(b => b && !b.startsWith('- '))) {
          allErrors.push({ label, msg: `"clues" lines must start with "- " (found: "${bullets.find(b => b && !b.startsWith('- '))}")` });
        }
        if (bullets.length > 3) {
          allErrors.push({ label, msg: `"clues" has ${bullets.length} bullets — max 3` });
        }
        if (sq.clues.endsWith('\n')) {
          allErrors.push({ label, msg: '"clues" has a trailing newline' });
        }
      }

      // approach
      if (sq.approach !== undefined && sq.approach !== null && typeof sq.approach === 'string') {
        const bullets = sq.approach.split('\n');
        if (bullets.some(b => b && !b.startsWith('- '))) {
          allErrors.push({ label, msg: `"approach" lines must start with "- " (found: "${bullets.find(b => b && !b.startsWith('- '))}")` });
        }
        if (bullets.length < 2 || bullets.length > 4) {
          allErrors.push({ label, msg: `"approach" has ${bullets.length} bullet(s) — expected 2–4` });
        }
      }

      // solution
      if (sq.solution !== undefined && sq.solution !== null && typeof sq.solution === 'string') {
        const lines = sq.solution.split('\n');
        if (!lines[0].match(/^\d+\.\s/)) {
          allErrors.push({ label, msg: `"solution" must start with a numbered step like "1. " (found: "${lines[0]}")` });
        }
      }
    }
  }

  return allErrors;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function report(label, errors) {
  if (errors.length === 0) {
    console.log(`  ✓  ${label}`);
  } else {
    console.log(`  ✗  ${label}`);
    for (const e of errors) {
      console.log(`       ${e.msg}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let totalErrors = 0;

if (curriculumPath) {
  const abs = path.resolve(curriculumPath);
  if (!fs.existsSync(abs)) {
    console.error(`Curriculum snapshot not found: ${abs}`);
    console.error('Dump one first: node tools/dump-curriculum-vocabulary.js --out ' + curriculumPath);
    process.exit(1);
  }
  curriculumVocab = JSON.parse(fs.readFileSync(abs, 'utf8'));
  console.log(`Checking curriculum vocabulary against snapshot dumped ${curriculumVocab.dumpedAt} (${curriculumVocab.project}) — re-dump if you've added new values since.`);
}

if (scriptPath) {
  console.log(`\nValidating questions in: ${scriptPath}\n`);

  const questions = extractQuestionsFromSource(scriptPath);
  if (!questions) {
    console.error('Could not extract "questions" array from script. Ensure it is declared as `const questions = [...]`.');
    process.exit(1);
  }

  // The pipeline writes Postgres now — an upload script still on firebase-admin is stale.
  const scriptSrc = fs.readFileSync(path.resolve(scriptPath), 'utf8');
  if (/firebase-admin|admin\.firestore\(/.test(scriptSrc)) {
    console.error('  ✗  Script still uses firebase-admin — copy the current tools/upload-script-template.js (writes Postgres via tools/lib).');
    totalErrors++;
  }

  const { results, setErrors } = validateSet(questions);

  for (const { label, errors } of results) {
    report(label, errors);
    totalErrors += errors.length;
  }

  if (setErrors.length > 0) {
    console.log('\n  Set-level issues:');
    for (const msg of setErrors) {
      console.log(`    ✗  ${msg}`);
      totalErrors++;
    }
  }
}

if (aiExpPath) {
  console.log(`\nValidating AI explanations in: ${aiExpPath}\n`);

  const abs = path.resolve(aiExpPath);
  if (!fs.existsSync(abs)) {
    console.error(`File not found: ${abs}`);
    process.exit(1);
  }

  let data;
  try {
    data = require(abs);
  } catch (e) {
    console.error(`Failed to load ${aiExpPath}: ${e.message}`);
    process.exit(1);
  }

  const errors = validateAiExp(data);

  // Group by label for clean output
  const byLabel = {};
  for (const e of errors) {
    if (!byLabel[e.label]) byLabel[e.label] = [];
    byLabel[e.label].push(e);
  }

  const allLabels = new Set([
    ...Object.keys(byLabel),
    ...Object.keys(data).map(k => `Order ${k}`),
  ]);

  for (const label of [...allLabels].sort()) {
    report(label, byLabel[label] || []);
    totalErrors += (byLabel[label] || []).length;
  }
}

console.log('');

if (totalErrors === 0) {
  console.log('All checks passed.\n');
  process.exit(0);
} else {
  console.log(`${totalErrors} violation(s) found. Fix before uploading.\n`);
  process.exit(1);
}
