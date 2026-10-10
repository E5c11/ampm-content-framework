'use strict';
/**
 * Closed vocabularies for reference data that the backend stores as free-form strings
 * (shared/setwork.md SETWORK-CAP-01 / SETWORK-SEC-01). The database has no CHECK on either, so this
 * file is where an unknown value gets caught. Keep in step with the backend seed (V83 / V84).
 */

// subjects.capabilities values. Clients ignore unknown values; the framework does not.
const KNOWN_CAPABILITIES = ['setwork', 'accents_af', 'calculator_basic', 'calculator_scientific'];

// prescribed_text_sections ids (stored in english_texts.section). The first three are the only values
// builds <= 2.3.5 can decode; `/english-texts` filters everything else out for them.
const LEGACY_SECTIONS = ['novel', 'play', 'poetry'];
const KNOWN_SECTIONS = [...LEGACY_SECTIONS, 'short_stories'];

const SECTION_RE = /^[a-z][a-z0-9_]{0,31}$/;

/** Returns the capability strings that are not in KNOWN_CAPABILITIES (empty = all fine). */
function unknownCapabilities(capabilities) {
  return (capabilities || []).filter(c => !KNOWN_CAPABILITIES.includes(c));
}

/** The authored link to a prescribed text: `text_key`, or its alias `prescribedTextId`. Null when absent. */
function textKeyOf(obj) {
  return obj?.text_key ?? obj?.prescribedTextId ?? null;
}

module.exports = { KNOWN_CAPABILITIES, LEGACY_SECTIONS, KNOWN_SECTIONS, SECTION_RE, unknownCapabilities, textKeyOf };
