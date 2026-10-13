'use strict';

/**
 * Upload scripts that legitimately keep typed rows WITHOUT a `keyboard_type` (core/keyboard-input.md KEYBOARD-04).
 *
 * Every typed question (fitb / fraction / steps / equation) must declare its keyboard — a missing declaration is a validator
 * ERROR. These scripts are the only exception: their exams are already LIVE in prod, in subjects with no keyboard of their own, and
 * their rows hold `keyboard_type = NULL` there. Checked 2026-10-07: all 21 undeclared rows are BARE-NUMERIC, so the honest
 * declaration would be `standard_math` — a released keyboard, which would NOT gate anything. They stay undeclared only because
 * retrofitting means updating live prod rows (a prod data change, bump `updated_at`) and, for History P2, because the owner decided
 * not to (subjects/dbe-history.md). Do not declare `text` on them: that would gate a live exam at 2.4.0 and hide published
 * content from older builds. The 2.4.0 app serves them with the Text keyboard (the total fallback in KeyboardResolver); older
 * builds keep the system keyboard. The validator prints a visible
 * "LEGACY ALLOWANCE" line for each row it lets through.
 *
 * Matching is by script file name, so re-uploading one of these exact scripts is still allowed; any NEW script is held to the rule.
 * When one of these exams is retrofitted (declare `text`, then gate via tools/apply-exam-gate.js, VER-09), delete its entry.
 * Do NOT add a script here to dodge the rule for new content.
 */
const LEGACY_UNDECLARED = {
  // 2026-10-07: 14 scripts, 21 typed rows (Geography 3, History 10, Life Sciences 8), all bare numeric. Physical Sciences scripts are NOT here:
  // they declare standard_math / scientific_math (released keyboards — no gate).
  'add-geography-2025-nov-p2-q1-2.js': 'live Geography 2025 Nov P2',
  'add-geography-2025-nov-p2-q3-1.js': 'live Geography 2025 Nov P2',
  'add-history-2025-nov-p2-q1.js': 'live History 2025 Nov P2',
  'add-history-2025-nov-p2-q2.js': 'live History 2025 Nov P2',
  'add-history-2025-nov-p2-q3.js': 'live History 2025 Nov P2',
  'add-history-2025-nov-p2-q4.js': 'live History 2025 Nov P2',
  'add-history-2025-nov-p2-q5.js': 'live History 2025 Nov P2',
  'add-history-2025-nov-p2-q6.js': 'live History 2025 Nov P2',
  'add-life-science-2025-nov-p2-q1-4-mitosis-meiosis.js': 'live Life Sciences 2025 Nov P2',
  'add-life-science-2025-nov-p2-q1-meiosis.js': 'live Life Sciences 2025 Nov P2',
  'add-life-science-2025-nov-p2-q2-3-pedigree.js': 'live Life Sciences 2025 Nov P2',
  'add-life-science-2025-nov-p2-q2-4-blood-groups.js': 'live Life Sciences 2025 Nov P2',
  'add-life-science-2025-nov-p2-q2-5-incomplete-dominance.js': 'live Life Sciences 2025 Nov P2',
  'add-life-science-2025-nov-p2-q3-2-hominid-brain-volume.js': 'live Life Sciences 2025 Nov P2',
};

// English HL papers authored before the shared language rules (2026-10-10, LANG-KB-01): the English exemption in KEYBOARD-04 ended,
// so these undeclared scripts are allow-listed until the HL retrofit (subjects/dbe-english-hl.md § Retrofit owed). Delete each entry
// when its paper is retrofitted (declare `text`, which derives 2.4.1 — VER-10). New HL scripts are NOT eligible.
Object.assign(LEGACY_UNDECLARED, {
  'add-english-hl-2025-nov-p1-q3.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p1-q5.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q10.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q11-1.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q12.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q13-1.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q13-2.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q14.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q15-1.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q15-2.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q2.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q3.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q4.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q5.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q7-1.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q8.js': 'English HL, authored before 2026-10-10 — retrofit owed',
  'add-english-hl-2025-nov-p2-q9-1.js': 'English HL, authored before 2026-10-10 — retrofit owed',
});

const legacyReason = (scriptPath) => LEGACY_UNDECLARED[require('path').basename(scriptPath || '')] || null;

module.exports = { LEGACY_UNDECLARED, legacyReason };
