'use strict';
/** Shared answer-cue checks (DESIGN-UNI-15 / DESIGN-UNI-16). Used by validate-questions.js and audit-answer-cues.js. */

// Paper-level cap on how often the correct option may be the strictly longest one. Chance with four options is 25%.
const LONGEST_RATE_CAP = 0.3;
// multi_select: average length of the correct options over the wrong ones.
const MS_RATIO_CAP = 1.3;

// Positional/structural labels that give an ordering item's position away (DESIGN-UNI-15).
const ORDERING_LABEL = /^\s*(introduction|intro|conclusion|body|main part|additional part|main body|opening|closing)\b|\b(first(ly)?|second(ly)?|third(ly)?|finally|lastly|last of all|at the end|to begin with|to start with|to finish|to conclude|finish with|start with|begin with|end with)\b|^\s*(step\s*\d+|\d+[.)])\s/i;

/** For a multiple_choice question: how the correct option compares in length with the distractors. null if not applicable. */
function optionLengthFinding(metadata, correct) {
  const opts = (metadata || []).filter((m) => m && m.trim() !== '');
  if (opts.length < 3 || !correct || !opts.includes(correct)) return null;
  const others = opts.filter((o) => o !== correct);
  const maxOther = Math.max(...others.map((o) => o.length));
  const c = correct.length;
  const longest = c > maxOther;
  // Numbers, years and other very short options carry no length cue.
  if (maxOther < 20 && c < 20) return { longest: false, margin: false, correctLen: c, maxOther };
  const margin = longest && (c >= 1.25 * maxOther || c - maxOther >= 25);
  return { longest, margin, correctLen: c, maxOther };
}

/** Items of an ordering question that carry a positional/structural label. */
function orderingLabelFinding(metadata) {
  return (metadata || []).filter((m) => m && ORDERING_LABEL.test(m));
}

/** multi_select: the correct options must not be clearly longer than the wrong ones on average. */
function multiSelectLengthFinding(metadata, answer) {
  const opts = (metadata || []).filter((m) => m && m.trim() !== '');
  const correct = (answer || []).filter((m) => m && m.trim() !== '');
  const wrong = opts.filter((o) => !correct.includes(o));
  if (correct.length < 1 || wrong.length < 1) return null;
  const avg = (a) => a.reduce((s, x) => s + x.length, 0) / a.length;
  const ratio = avg(correct) / avg(wrong);
  return { ratio, flag: ratio >= MS_RATIO_CAP && avg(correct) >= 25 };
}

module.exports = { multiSelectLengthFinding, MS_RATIO_CAP, LONGEST_RATE_CAP, ORDERING_LABEL, optionLengthFinding, orderingLabelFinding };
