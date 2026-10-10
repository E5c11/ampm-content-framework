#!/usr/bin/env node
'use strict';
/** Tests for the setwork vocabulary helpers (pure): node tools/lib/setwork-vocabulary.test.js */
const assert = require('assert');
const v = require('./setwork-vocabulary');

assert.deepStrictEqual(v.unknownCapabilities(['setwork', 'accents_af', 'calculator_basic', 'calculator_scientific']), []);
assert.deepStrictEqual(v.unknownCapabilities(['setwork', 'telepathy']), ['telepathy']);
assert.deepStrictEqual(v.unknownCapabilities(null), []);
assert.ok(v.KNOWN_SECTIONS.includes('short_stories') && !v.LEGACY_SECTIONS.includes('short_stories'));
assert.ok(v.SECTION_RE.test('short_stories') && !v.SECTION_RE.test('Drama'));
assert.strictEqual(v.textKeyOf({ text_key: 'a', prescribedTextId: 'b' }), 'a');
assert.strictEqual(v.textKeyOf({ prescribedTextId: 'b' }), 'b');
assert.strictEqual(v.textKeyOf({}), null);
console.log('setwork-vocabulary: ok');
