'use strict';

/**
 * Single source of truth, for tooling, of (a) which keyboard each question resolves to,
 * (b) which characters each keyboard can type, and (c) the first app version that could
 * type/render each of them. Human-readable counterparts: `core/keyboard-input.md` and
 * `core/app-feature-versions.md` — if those and this disagree, the APP wins (see the source-of-
 * truth list in keyboard-input.md), then fix this file and both docs together.
 *
 * Versions are real release tags from the AMPM repo (`git tag --contains <first commit>`),
 * not guesses.
 *
 * PLANNED capabilities (the physics / chemistry / text keyboards, the extra Maths keys, MathText
 * sub/superscript markup — everything in AMPM `plan/active/question-keyboards-and-exam-version-
 * gating.md`) are treated as AVAILABLE for authoring: they validate. Their `since` is `NEXT`,
 * "the next release, version not known until it is tagged". Content that depends on any of them
 * is DEV-ONLY until that release is tagged and the real version replaces `NEXT` here and in
 * `core/app-feature-versions.md` (`VER-05`/`VER-06`). `push-paper-to-prod.js` refuses to copy such
 * content to prod; `set-exam-gate.js` refuses `--min next`.
 */

// First Spring-backend build (`pre-2.0.0` builds read Firestore and never see Spring content),
// and the version the backend assumes for a request with no `X-App-Version` header.
const FLOOR = '2.0.0';

// "The next release" — a planned capability whose version number is not known until it is tagged.
const NEXT = 'next';

// ---------------------------------------------------------------------------
// Version helpers (same major*1_000_000 + minor*1_000 + patch code the backend stores)
// ---------------------------------------------------------------------------

function versionCode(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(v || '');
  return m ? Number(m[1]) * 1_000_000 + Number(m[2]) * 1_000 + Number(m[3]) : null;
}

const rank = (v) => (v === NEXT ? Infinity : versionCode(v));

/** Highest of the given versions; `NEXT` outranks every concrete version. */
function maxVersion(...versions) {
  let best = FLOOR;
  for (const v of versions) {
    if (v === null || v === undefined) continue;
    if (rank(v) > rank(best)) best = v;
  }
  return best;
}

// ---------------------------------------------------------------------------
// Keyboards
// ---------------------------------------------------------------------------

// Values the backend `questions.keyboard_type` column may hold (closed set, owned here and in
// core/keyboard-input.md — the DB has no CHECK on purpose, so adding one needs no migration).
const DECLARABLE_KEYBOARDS = ['none', 'standard_math', 'scientific_math', 'physics', 'chemistry', 'text'];

// Declared values a RELEASED build honours today. Anything else a released build ignores and
// falls back to subject inference, so a planned value is dev-only until its release.
const SHIPPED_DECLARABLE = new Set(['none', 'standard_math', 'scientific_math']);

const chars = (s, since) => Object.fromEntries([...s].map((c) => [c, since]));
const DIGITS = '0123456789';
const LATIN = 'abcdefghijklmnopqrstuvwxyz';

// First release whose QuestionsValidator.normalizeNumericString maps U+2212 -> '-' (fitb/steps only).
const MINUS_NORMALIZATION_SINCE = '2.2.0';

/**
 * Per-keyboard typeable characters with the first app version each became typeable.
 * No entry = no character constraint is modelled for that keyboard.
 */
const KEYBOARD_CHARS = {
  standard_math: { ...chars(DIGITS + '.-', FLOOR) },

  scientific_math: {
    ...chars(DIGITS + '.+×÷()=π' + 'θ√≤≥∴∵≠∈ℤ', FLOOR),
    // The minus key emitted U+2212 until b3e7a8ed0 (first in v2.2.0); the ASCII '-' every stored
    // answer uses was therefore NOT typeable on this keyboard before 2.2.0.
    '-': '2.2.0',
    // x / y / ^ / % were added in the same commit (v2.2.0).
    ...chars('xy^%', '2.2.0'),
    // PLANNED — the Maths variant of ScientificKeyboard (initiative 4a, merged to AMPM `dev`, unreleased; decisions
    // D13/D14): `;` on Numbers; Symbols `< > ≤ ≥ ≠ / ° ∠ Δ θ π / , ! ∞ → ± / ∈ √ ^ ∴ %`; the ABC tab (a-z with a
    // one-shot shift for A-Z, plus the sin/cos/tan/log function keys). Everything else the old inventory listed
    // here ([ ] ' ∩ ∪ Σ σ Ω μ ε α β _ { }, ln lim nCr nPr x-bar) is NOT on this keyboard — the Physics/Chemistry
    // variants (4d/4e) will own the sub/superscript keys and Greek letters.
    ...chars(';<>,!°∠Δ∞→±', NEXT),
    ...chars(LATIN.replace(/[xy]/g, '') + LATIN.toUpperCase(), NEXT),
  },

  // Legacy subject-inferred English keyboard (QWERTY + apostrophe + space; keys emit upper case,
  // marking lower-cases both sides). NOT a declarable value — `text` supersedes it (BLA-58).
  english: { ...chars(LATIN + "' ", FLOOR) },

  // PLANNED (BLA-58): QWERTY + second screen — digits, punctuation, and (Afrikaans only) accents.
  text: {
    ...chars(LATIN + LATIN.toUpperCase() + DIGITS + ' .,;:!?\'"-()/&%', NEXT),
    ...chars('êëéèôöûüîïäŉÊËÉÈÔÖÛÜÎÏÄ', NEXT),
  },
  // physics / chemistry: planned, layout not designed -> no character constraint modelled.
};

// Multi-letter keys on scientific_math that type a whole token.
const SCIENTIFIC_TOKENS = {
  sin: FLOOR, cos: FLOOR, tan: FLOOR, log: FLOOR,
};

/**
 * Mirror of AMPM `KeyboardResolver.resolve(subject, presentation, declared)` plus the planned
 * declared values. The app wins if they ever disagree — re-read
 * `feature/watch/.../questions/ui/KeyboardResolver.kt`.
 * Returns: none | standard_math | scientific_math | english | physics | chemistry | text.
 */
function resolveKeyboard(subject, presentation, declared) {
  if (declared && DECLARABLE_KEYBOARDS.includes(declared)) return declared;
  switch ((subject || '').toLowerCase()) {
    case 'english_hl': return 'english';
    case 'math_lit': return 'standard_math';
    case 'maths':
    case 'physics':
      return presentation === 'equation' || presentation === 'steps' ? 'scientific_math' : 'standard_math';
    default: return 'none';
  }
}

// ---------------------------------------------------------------------------
// Answer -> typed characters
// ---------------------------------------------------------------------------

/** `|` separates accepted alternatives; any ONE being typeable is enough. */
function alternativesOf(answer) {
  return String(answer).split('|').map((s) => s.trim()).filter(Boolean);
}

/**
 * One alternative on one keyboard: the minimum version at which it's fully typeable (`NEXT` if it
 * needs a planned key), and `missing` = the first character that is not on the keyboard at all
 * (then `version` is null).
 */
function typeabilityOf(text, keyboard, opts = {}) {
  const table = KEYBOARD_CHARS[keyboard];
  if (!table) return { version: FLOOR, missing: null }; // none / physics / chemistry — not modelled
  let version = FLOOR;
  let lower = keyboard === 'english' ? text.toLowerCase() : text;
  // U+2212 (true minus) in a STORED answer: the app's normalizeNumericString converts it to ASCII '-'
  // before comparing, but only for fitb/steps (not fraction) and only from v2.2.0 (b3e7a8ed0).
  if (lower.includes('−') && opts.normalizesMinus) {
    lower = lower.replace(/−/g, '-');
    version = maxVersion(version, MINUS_NORMALIZATION_SINCE);
  }
  // Stored ',' is normalised to '.' before comparing (QuestionsValidator: fitb, fraction and steps all
  // do `.replace(',', '.')` on BOTH sides), so SA decimal commas ("8,6") are typed as "8.6".
  if (lower.includes(',') && opts.normalizesComma) lower = lower.replace(/,/g, '.');
  let i = 0;
  while (i < lower.length) {
    const tokenHit = keyboard === 'scientific_math'
      ? Object.keys(SCIENTIFIC_TOKENS).find((t) => lower.startsWith(t, i))
      : null;
    if (tokenHit) { version = maxVersion(version, SCIENTIFIC_TOKENS[tokenHit]); i += tokenHit.length; continue; }
    const ch = lower[i];
    if (!(ch in table)) return { version: null, missing: ch };
    version = maxVersion(version, table[ch]);
    i += 1;
  }
  return { version, missing: null };
}

/** Best (lowest-version) typeable alternative among the answer's `|` alternatives. */
function bestTypeability(answer, keyboard, opts = {}) {
  const alts = alternativesOf(answer);
  if (alts.length === 0) return { version: FLOOR, missing: null };
  let best = null;
  for (const alt of alts) {
    const t = typeabilityOf(alt, keyboard, opts);
    if (best === null) { best = t; continue; }
    if (t.missing !== null) continue;
    if (best.missing !== null || rank(t.version) < rank(best.version)) best = t;
  }
  return best;
}

// ---------------------------------------------------------------------------
// Other feature gates (markup / presentation)
// ---------------------------------------------------------------------------

// Every presentation type shipped in a tag before the 2.0.0 Spring floor (steps/equation/
// ScientificMath v1.6.0, fraction v1.1.2, the keyboards v1.2.0), so none raises an exam minimum.
// Kept explicit so a NEW presentation type has to add a row here.
const PRESENTATION_SINCE = {
  multiple_choice: FLOOR, multi_select: FLOOR, fitb: FLOOR, ordering: FLOOR,
  fraction: FLOOR, match: FLOOR, equation: FLOOR, steps: FLOOR,
};

// Subjects whose question text is rendered by MathText (core/mathtext.md); English is not.
const MATHTEXT_SUBJECTS = new Set(['maths', 'math_lit', 'physics']);

// Sub/superscript MathText markup (`_{..}` / `^{..}`) — decision D4, planned for the next release
// (BLA-21 item 5d). Valid to author; dev-only until tagged.
const MARKUP = [
  { id: 'mathtext-subscript', re: /_\{[^}]*\}/, since: NEXT },
  { id: 'mathtext-superscript', re: /\^\{[^}]*\}/, since: NEXT },
];

// ---------------------------------------------------------------------------
// Per-question analysis — shared by validate-questions.js and push-paper-to-prod.js
// ---------------------------------------------------------------------------

/**
 * Analyses one AUTHORED-shape question ({subject, presentation, keyboard_type, answer, question,
 * metadata}). Returns `{ errors, warnings, requires }`:
 *  - `errors`   — real defects (unknown keyboard, unanswerable, an answer that cannot be typed)
 *  - `warnings` — advisory (system-IME numeric-only caveat)
 *  - `requires` — `[{version, reason}]` the app version each dependency needs (`NEXT` = planned)
 */
function analyzeQuestion(q) {
  const errors = [];
  const warnings = [];
  const requires = [];
  const need = (version, reason) => requires.push({ version, reason });
  const p = q.presentation;

  if (p && PRESENTATION_SINCE[p] !== undefined) need(PRESENTATION_SINCE[p], `presentation ${p}`);

  const declared = q.keyboard_type ?? null;
  if (declared !== null) {
    if (!DECLARABLE_KEYBOARDS.includes(declared)) {
      errors.push(`"keyboard_type" "${declared}" is not a known keyboard (one of: ${DECLARABLE_KEYBOARDS.join(', ')}, or omit for subject inference)`);
    } else if (!SHIPPED_DECLARABLE.has(declared)) {
      need(NEXT, `keyboard ${declared}`);
    }
  }

  const typed = p === 'fitb' || p === 'fraction' || p === 'steps' || p === 'equation';
  if (typed) {
    const keyboard = resolveKeyboard(q.subject, p, declared);
    if (keyboard === 'none') {
      if (p === 'steps' || p === 'equation') {
        errors.push(`"${p}" resolves to NO keyboard for subject "${q.subject}" — it is unanswerable (no system-IME fallback); declare a keyboard_type or pick another presentation`);
      } else if (Array.isArray(q.answer)) {
        const nonNumeric = q.answer.filter((a) => a && !/^-?[0-9]+([.,][0-9]+)?$/.test(String(a).trim()));
        if (nonNumeric.length > 0) {
          warnings.push(`resolves to the system keyboard (no custom keyboard for "${q.subject}"), which forces a decimal-mode IME — only bare-numeric answers are reliably typeable (non-numeric: ${nonNumeric.map((a) => JSON.stringify(a)).join(', ')})`);
        }
      }
    } else if (p !== 'equation' && Array.isArray(q.answer)) {
      // equation answers are a canonical serialization, not typed characters (SCHEMA-TYPE-03)
      const slots = p === 'fraction' ? q.answer.slice(0, 2) : q.answer;
      slots.forEach((a, i) => {
        if (a === undefined || a === null || String(a).trim() === '') return;
        const t = bestTypeability(a, keyboard, {
          normalizesMinus: p === 'fitb' || p === 'steps',
          normalizesComma: p === 'fitb' || p === 'fraction' || p === 'steps',
        });
        if (t.missing !== null) {
          errors.push(`answer[${i}] ${JSON.stringify(a)} cannot be typed on the ${keyboard} keyboard: "${t.missing}" is not a key (KEYBOARD-01)`);
        } else {
          need(t.version, `answer[${i}] ${JSON.stringify(a)} on ${keyboard}`);
        }
      });
    }
  }

  // case_sensitive (D15, off by default): fitb stops lower-casing both sides, so `Co` and `CO` differ. Backend V82 / contracts
  // 0.40.0 / app, unreleased -> NEXT. Only meaningful when the student can TYPE both cases, and only changes fitb
  // (steps/equation already compare case-sensitively).
  if (q.case_sensitive !== undefined && q.case_sensitive !== null) {
    if (typeof q.case_sensitive !== 'boolean') {
      errors.push('"case_sensitive" must be true or false');
    } else if (q.case_sensitive === true) {
      need(NEXT, 'case_sensitive flag');
      const kb = resolveKeyboard(q.subject, p, declared);
      if (p === 'steps' || p === 'equation') {
        warnings.push('"case_sensitive" has no effect on steps/equation — they already compare case-sensitively');
      } else if (p === 'fitb' && !['scientific_math', 'physics', 'chemistry'].includes(kb)) {
        errors.push(`"case_sensitive" needs a keyboard that can type both cases; this question resolves to "${kb}" (the English/text/number keyboards cannot) — declare keyboard_type scientific_math, physics or chemistry`);
      } else if (p !== 'fitb' && p !== 'steps' && p !== 'equation') {
        warnings.push(`"case_sensitive" is ignored for ${p} questions`);
      }
    }
  }

  const markupText = [q.question, ...(Array.isArray(q.metadata) ? q.metadata : [])].filter((x) => typeof x === 'string');
  for (const m of MARKUP) {
    if (markupText.some((t) => m.re.test(t))) need(m.since, m.id);
  }

  // Plain `_` (D16): MathText lowers ONE letter or number after it (`x_1`, `T_n`) or a parenthesised group; anything
  // longer needs braces. `F_net` would render as F, subscript n, then "et" — an error, not a style point. Scoped to the
  // MathText subjects: other subjects' text may contain a literal underscore.
  if (MATHTEXT_SUBJECTS.has((q.subject || '').toLowerCase())) {
    if (markupText.some((t) => /_[A-Za-z]{2,}/.test(t))) {
      errors.push('"_" followed by two or more letters is not a subscript in plain form (it would lower only the first letter): write _{net}, or use one letter/number (x_1, T_n)');
    } else if (markupText.some((t) => /_([A-Za-z0-9]|\()/.test(t))) {
      need(NEXT, 'mathtext-plain-subscript');
    }
  }

  return { errors, warnings, requires };
}

/** True when any requirement is a planned (not-yet-tagged) capability — i.e. dev-only content. */
const dependsOnNext = (requires) => requires.some((r) => r.version === NEXT);

module.exports = {
  FLOOR,
  NEXT,
  DECLARABLE_KEYBOARDS,
  SHIPPED_DECLARABLE,
  KEYBOARD_CHARS,
  PRESENTATION_SINCE,
  MARKUP,
  versionCode,
  maxVersion,
  resolveKeyboard,
  alternativesOf,
  typeabilityOf,
  bestTypeability,
  analyzeQuestion,
  dependsOnNext,
};
