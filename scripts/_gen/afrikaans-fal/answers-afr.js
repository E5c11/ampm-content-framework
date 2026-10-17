// ADB-based ANSWER-ENTRY verification for custom-keyboard `fitb` rows — the multi-keyboard sibling of
// review-capture-answers.js (Phase 5 of ampm-content-framework's workflows/generate/review-paper.md,
// "Phase 5 addendum").
//
// Differences from review-capture-answers.js:
//   - handles the `text` keyboard (text_key_<LETTER>, text_key_space, text_key_done) as well as maths_key_<char>;
//   - handles several blanks per question (question_fitb_input_0..N-1, retapped per blank);
//   - runs EVERY `|` alternative, relaunching the lesson and tapping back to the question for each one;
//   - has NO system-keyboard fallback: a row with no custom keyboard reports NO_CUSTOM_KEYBOARD (a KEYBOARD-04 defect for a declared row).
// Still fitb only (equation/steps are skipped). A PASS proves the stored answer matches itself, not that it is right — verify numbers by hand.
// Same cold-cache prerequisite as review-capture-answers.js. Written on the Tourism 2025 Nov P1 review (2026-10-15).
//
// Usage: node scripts/review/review-capture-answers-text.js <manifest.json> [--lessons 1,2,3]
// Writes <manifest dir>/answer-results.json and answer-screenshots/lesson_<n>/q<n>_{typed,result}_a<alt>.png
// ADB-based per-question ANSWER-ENTRY verification for paper review — Phase 5 of
// ampm-content-framework's workflows/generate/review-paper.md ("Verify Answerability").
//
// Unlike review-capture.js (render-only), this actually taps the fitb input, types the
// stored `answer` through the app's real on-screen keyboard (never adb `input text`,
// which would bypass the keyboard component entirely and prove nothing about what a
// student can press), taps Submit, and reads the resulting feedback testTag to
// determine PASS/FAIL. Scoped to `fitb` only for now (no `equation`/`steps` support yet
// — see TODO below); `multiple_choice`/`multi_select`/`match`/`ordering` are Ordering
// need no keyboard and are already covered by review-paper.md Phase 3's data checks.
//
// Selectors used (verified against source 2026-09-12, now the source of truth in
// wiki/lesson/systems/keyboard-system.md's "Submitting an answer" section — this
// script's own submit-detection logic must stay in sync with that doc, not drift):
//   question_fitb_input_$index   — the blank's input field (fitb.md)
//   maths_key_$label             — each digit/decimal key, label = literal value ("0".."9", ".", "-")
//   question_submit_button       — inline "Check" button, ONLY present when the system
//                                  keyboard is active for this question (suppressSystemKeyboard
//                                  == false) — e.g. english_hl, or a subject before its
//                                  keyboard type resolves.
//   content-desc "Submit answer" — the custom keyboard's own Done key, used instead of the
//                                  above whenever a custom keyboard is active (maths, math_lit,
//                                  physics/chemistry) — no testTag exists for this key.
//   question_feedback_correct / _incorrect / _partial / _revealed — result state
//
// IMPORTANT — cold-cache prerequisite: if the app's local cache has never seen this
// lesson's video before (fresh install, or any lesson not yet opened this app-data
// lifetime), an unrelated app bug makes the SYSTEM keyboard appear instead of the
// subject's real custom keyboard, which looks exactly like a missing-key content defect.
// Navigate through the app's Library/Courses screen normally at least once before
// running this script — see review-paper.md Phase 5 for the full explanation. This
// script cannot detect that condition itself; a MISSING_KEY result may mean either a
// real content defect or an unwarmed cache — check which before treating it as a finding.
//
// Usage:
//   node scripts/review/review-capture-answers.js <manifest.json> [--lessons 1,2,3]
//
// Writes temp/review/<paperId>/answer-results.json and
// temp/review/<paperId>/answer-screenshots/lesson_<order>/q<n>_{typed,result}.png

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGE = 'com.esma.ampm.dev';
const ACTIVITY = `${PACKAGE}/com.esma.ampm.MainActivity`;

const TAG_QUESTIONS_PANE = 'lesson_questions_pane';
const TAG_NEXT_QUESTION = 'question_next_button';
const TAG_SUBMIT = 'question_submit_button';

// TODO: equation/steps use a structured MathInputState, not a plain string typed
// key-by-key into one input — need a different attempt function (fraction mode, symbol
// tab switching) before those can be added here. Not built; fitb only for now.
const SUPPORTED_PRESENTATIONS = ['fitb'];
const KNOWN_TYPED_PRESENTATIONS = ['fitb', 'equation', 'steps'];

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
}
function adbShell(cmd) {
  return sh(`adb shell "${cmd}"`);
}
function sleep(ms) {
  execSync(`sleep ${(ms / 1000).toFixed(2)}`);
}
function dumpUI() {
  adbShell('uiautomator dump /sdcard/window_dump.xml');
  return sh('adb exec-out cat /sdcard/window_dump.xml');
}

function findBoundsByTag(xml, tag) {
  const re = new RegExp(`resource-id="[^"]*${tag}"[^>]*bounds="\\[(\\d+),(\\d+)\\]\\[(\\d+),(\\d+)\\]"`);
  const m = xml.match(re);
  if (!m) return null;
  const [, x1, y1, x2, y2] = m.map(Number);
  return { x1, y1, x2, y2, cx: Math.round((x1 + x2) / 2), cy: Math.round((y1 + y2) / 2) };
}

function hasTag(xml, tag) {
  return xml.includes(`resource-id="`) && new RegExp(`resource-id="[^"]*${tag}"`).test(xml);
}

// Icon-only keyboard keys (Done/Next/Backspace) carry no testTag, only a stable
// contentDescription — see wiki/lesson/systems/keyboard-system.md's Automation
// selectors table (values are the English-locale stringResource text).
function findBoundsByContentDesc(xml, desc) {
  const re = new RegExp(`content-desc="${escapeForRegex(desc)}"[^>]*bounds="\\[(\\d+),(\\d+)\\]\\[(\\d+),(\\d+)\\]"`);
  const m = xml.match(re);
  if (!m) return null;
  const [, x1, y1, x2, y2] = m.map(Number);
  return { x1, y1, x2, y2, cx: Math.round((x1 + x2) / 2), cy: Math.round((y1 + y2) / 2) };
}

function tap(x, y) {
  adbShell(`input tap ${x} ${y}`);
}
function screencap(outPath) {
  execSync(`adb exec-out screencap -p > "${outPath}"`);
}

function launchLesson(videoId, subject, syllabus) {
  adbShell(`am force-stop ${PACKAGE}`);
  const uri = `https://askmoreprepmore.com/video/${videoId}?subject=${subject}&syllabus=${syllabus}`;
  adbShell(`am start -W -a android.intent.action.VIEW -d '${uri}' -n ${ACTIVITY}`);
}

function waitForTag(tag, timeoutMs = 30000, intervalMs = 1000) {
  const start = Date.now();
  let xml = '';
  while (Date.now() - start < timeoutMs) {
    xml = dumpUI();
    if (findBoundsByTag(xml, tag)) return xml;
    sleep(intervalMs);
  }
  console.warn(`    WARNING: timed out waiting for "${tag}" to render`);
  return xml;
}

// Escape a single character for safe embedding in the tag regex (findBoundsByTag builds
// a RegExp from the tag string — "." and "-" are regex metacharacters).
function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
}

function feedbackState(xml) {
  if (hasTag(xml, 'question_feedback_correct')) return 'CORRECT';
  if (hasTag(xml, 'question_feedback_incorrect')) return 'INCORRECT';
  if (hasTag(xml, 'question_feedback_partial')) return 'PARTIAL';
  if (hasTag(xml, 'question_feedback_revealed')) return 'REVEALED';
  return 'NO_FEEDBACK';
}

/**
 * Attempt one fitb question (single-blank only — none of this paper's questions have more).
 *
 * Two typing paths, chosen by whether a custom in-app keyboard actually opened:
 *   - Custom keyboard present (maths/math_lit/physics/chemistry): tap each `maths_key_$ch`
 *     key in turn — this is the only faithful way to test a grid the student must press.
 *   - No custom keyboard (subject resolves to QuestionKeyboardType.None, e.g. life_science,
 *     geography — core/keyboard-input.md): the blank falls back to a real, focusable system
 *     text field (`DynamicTextInput`/`RoundedTextBox` in TextInputs.kt render a genuine
 *     BasicTextField when suppressSystemKeyboard is false). There is no key grid to press,
 *     so `adb shell input text` is the legitimate equivalent here — it's not bypassing an
 *     in-app keyboard component (there isn't one), it's driving the same real, focused text
 *     field a physical/Bluetooth keyboard or the system IME would. Added 2026-09-12 when
 *     this script's original custom-keyboard-only path would have reported every character
 *     of every life_science fitb answer as MISSING_KEY — indistinguishable from a real
 *     content defect unless this distinction is made explicitly.
 */
function keyTag(ch, xml) {
  if (/resource-id="[^"]*text_key_/.test(xml)) {
    if (ch === ' ') return 'text_key_space';
    return `text_key_${ch.toUpperCase()}`;
  }
  return `maths_key_${ch}`;
}

function attemptFitb(q, lessonDir, n, altIndex = 0) {
  const blanks = q.metadata.filter((m) => m.trim() === '[ ]').length;
  const alts = (i) => (q.answer[i] || '').split('|');
  const missing = [];
  let keyboard = 'none';
  for (let b = 0; b < blanks; b++) {
    let xml = dumpUI();
    const input = findBoundsByTag(xml, `question_fitb_input_${b}`);
    if (!input) return { status: 'NO_INPUT_FOUND', blank: b };
    tap(input.cx, input.cy);
    sleep(700);
    xml = dumpUI();
    keyboard = /resource-id="[^"]*text_key_/.test(xml) ? 'text' : /resource-id="[^"]*maths_key_/.test(xml) ? 'maths' : 'none';
    if (keyboard === 'none') return { status: 'NO_CUSTOM_KEYBOARD', blank: b };
    const raw = alts(b)[Math.min(altIndex, alts(b).length - 1)];
    let onSecond = false;
    for (const ch of raw) {
      const needSecond = !(/[A-Za-z]/.test(ch) || ch === ' ');
      if (needSecond !== onSecond) {
        const sw = findBoundsByTag(xml, 'text_key_switch');
        if (!sw) { missing.push('<switch>'); break; }
        tap(sw.cx, sw.cy); sleep(500); xml = dumpUI(); onSecond = needSecond;
      }
      const key = findBoundsByTag(xml, escapeForRegex(keyTag(ch, xml)));
      if (!key) { missing.push(ch); continue; }
      tap(key.cx, key.cy);
      sleep(200);
    }
  }
  screencap(path.join(lessonDir, `q${n}_typed_a${altIndex}.png`));
  if (missing.length) return { status: 'MISSING_KEY', missingChars: missing, keyboard };
  let xml = dumpUI();
  const done = findBoundsByTag(xml, keyboard === 'text' ? 'text_key_done' : 'maths_key_done') || findBoundsByContentDesc(xml, 'Submit answer') || findBoundsByTag(xml, TAG_SUBMIT);
  if (!done) return { status: 'NO_SUBMIT_MECHANISM_FOUND', keyboard };
  tap(done.cx, done.cy);
  sleep(1200);
  xml = dumpUI();
  for (let t = 0; t < 4 && feedbackState(xml) === 'NO_FEEDBACK'; t++) { sleep(1000); xml = dumpUI(); }
  screencap(path.join(lessonDir, `q${n}_result_a${altIndex}.png`));
  const feedback = feedbackState(xml);
  return { status: feedback === 'CORRECT' ? 'PASS' : 'FAIL', feedback, keyboard, alt: altIndex, typed: q.answer.filter(Boolean) };
}

function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    console.error('Usage: node scripts/review/review-capture-answers-text.js <manifest.json> [--lessons 1,2,3]');
    process.exit(1);
  }

  const lessonsArgIndex = process.argv.indexOf('--lessons');
  const onlyLessons = lessonsArgIndex !== -1
    ? process.argv[lessonsArgIndex + 1].split(',').map(Number)
    : null;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const outDir = path.dirname(manifestPath);
  const baseDir = path.join(outDir, 'answer-screenshots');
  const results = [];

  for (const lesson of manifest.lessons) {
    if (onlyLessons && !onlyLessons.includes(lesson.order)) continue;

    const typedQuestions = lesson.questions.filter((q) => KNOWN_TYPED_PRESENTATIONS.includes(q.presentation));
    if (typedQuestions.length === 0) continue;

    console.log(`Lesson ${lesson.order} (${lesson.name}) - ${lesson.videoId}`);
    launchLesson(lesson.videoId, manifest.subject, manifest.syllabus);
    waitForTag(TAG_QUESTIONS_PANE);

    const lessonDir = path.join(baseDir, `lesson_${lesson.order}`);
    fs.mkdirSync(lessonDir, { recursive: true });

    for (let i = 0; i < lesson.questions.length; i++) {
      const q = lesson.questions[i];
      const n = i + 1;

      if (KNOWN_TYPED_PRESENTATIONS.includes(q.presentation)) {
        if (!SUPPORTED_PRESENTATIONS.includes(q.presentation)) {
          console.log(`  Q${n} [${q.presentation}] - SKIPPED (not yet supported by this script)`);
          results.push({ lesson: lesson.order, q: n, id: q.id, presentation: q.presentation, status: 'SKIPPED_UNSUPPORTED' });
        } else {
          console.log(`  Q${n} [${q.presentation}] - attempting answer "${q.answer[0]}"`);
          const maxAlt = Math.max(...q.answer.map((a) => (a || '').split('|').length));
          for (let alt = 0; alt < maxAlt; alt++) {
            if (alt > 0) { // relaunch and return to this question for the next alternative
              launchLesson(lesson.videoId, manifest.subject, manifest.syllabus);
              waitForTag(TAG_QUESTIONS_PANE);
              for (let k = 0; k < i; k++) { const nx = findBoundsByTag(dumpUI(), TAG_NEXT_QUESTION); if (nx) { tap(nx.cx, nx.cy); sleep(1500); } }
            }
            const result = attemptFitb(q, lessonDir, n, alt);
            const missingNote = result.missingChars ? ` (missing: ${result.missingChars.join(',')})` : '';
            console.log(`    alt ${alt} -> ${result.status}${missingNote}`);
            results.push({ lesson: lesson.order, q: n, id: q.id, presentation: q.presentation, ...result });
          }
        }
      }

      if (i < lesson.questions.length - 1) {
        const xml = dumpUI();
        const next = findBoundsByTag(xml, TAG_NEXT_QUESTION);
        if (!next) {
          console.warn(`    WARNING: "${TAG_NEXT_QUESTION}" not found, stopping lesson early`);
          break;
        }
        tap(next.cx, next.cy);
        sleep(1500);
      }
    }
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'answer-results.json'), JSON.stringify(results, null, 2));

  console.log('\nSummary:');
  const counts = {};
  for (const r of results) counts[r.status] = (counts[r.status] || 0) + 1;
  for (const [status, count] of Object.entries(counts)) console.log(`  ${status}: ${count}`);
  console.log(`\nWritten ${path.join(outDir, 'answer-results.json')}`);
}

main();
