'use strict';
// node scripts/_gen/accounting-2024-p2/gen.js [lessonOrder ...]   — writes scripts/add-accounting-2024-nov-p2-lNN.js and prints the taxonomy used
const fs = require('fs');
const path = require('path');
const { emit, writeSpecs } = require('./lib');
const lessons = [];
for (const f of fs.readdirSync(__dirname).filter((x) => /^lessons-.*\.js$/.test(x)).sort()) lessons.push(...require('./' + f));
const only = process.argv.slice(2).map(Number);
const tax = { units: new Set(), topics: new Set(), subtopics: new Set(), skills: new Set(), tags: new Set() };
for (const L of lessons.sort((a, b) => a.order - b.order)) {
  const { file, src, questions, video } = emit(L);
  if (only.length === 0 || only.includes(L.order)) { fs.writeFileSync(path.join(__dirname, '..', '..', '..', file), src); writeSpecs(L, path.join(__dirname, '..', '..', '..')); }
  for (const q of questions) { tax.units.add(q.unit); tax.topics.add(q.unit + '|' + q.topic); tax.subtopics.add(q.unit + '|' + q.topic + '|' + q.subtopic); q.skills.forEach((s) => tax.skills.add(s)); }
  video.tags.forEach((t) => tax.tags.add(t));
}
if (process.env.TAX) console.log(JSON.stringify(Object.fromEntries(Object.entries(tax).map(([k, v]) => [k, [...v].sort()])), null, 1));
console.log(`generated ${lessons.length} lessons`);
