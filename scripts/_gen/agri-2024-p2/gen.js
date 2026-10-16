'use strict';
// node scripts/_gen/agri-2024-p2/gen.js [lessonOrder ...]   — writes scripts/add-agricultural-sciences-2024-nov-p2-lNN.js
// TAX=1 prints the taxonomy (units/topics/subtopics/skills/tags) used, for the PIPE-08 vocabulary check.
// Checks each lesson's exam image counts against temp/images/.../q<order>/ (extract.sh) and its marks against the paper total.
const fs = require('fs');
const path = require('path');
const { emit } = require('./lib');
const ROOT = path.join(__dirname, '..', '..', '..');
const lessons = [];
for (const f of fs.readdirSync(__dirname).filter((x) => /^lessons-.*\.js$/.test(x)).sort()) lessons.push(...require('./' + f));
const only = process.argv.slice(2).map(Number);
const tax = { units: new Set(), topics: new Set(), subtopics: new Set(), skills: new Set(), tags: new Set() };
let marks = 0; let nq = 0;
for (const L of lessons.sort((a, b) => a.order - b.order)) {
  const dir = path.join(ROOT, 'temp', 'images', 'agricultural_sciences', '2024', 'nov_p2', `q${L.order}`);
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const q = files.filter((f) => /^question_\d+\.png$/.test(f)).length; const m = files.filter((f) => /^memo_\d+\.png$/.test(f)).length;
    if (q !== L.qpages || m !== L.mpages) throw new Error(`Lesson ${L.order}: images on disk q${q}/m${m}, lesson says q${L.qpages}/m${L.mpages}`);
  }
  const subMarks = L.subs.reduce((s, x) => s + x.marks, 0);
  if (subMarks !== L.marks) throw new Error(`Lesson ${L.order}: sub-question marks ${subMarks} ≠ lesson marks ${L.marks}`);
  const { file, src, questions, video } = emit(L);
  if (only.length === 0 || only.includes(L.order)) fs.writeFileSync(path.join(ROOT, file), src);
  for (const q of questions) { tax.units.add(q.unit); tax.topics.add(q.unit + '|' + q.topic); tax.subtopics.add(q.subtopic); q.skills.forEach((s) => tax.skills.add(s)); }
  video.tags.forEach((t) => tax.tags.add(t));
  marks += L.marks; nq += questions.length;
}
if (process.env.TAX) console.log(JSON.stringify(Object.fromEntries(Object.entries(tax).map(([k, v]) => [k, [...v].sort()])), null, 1));
console.log(`generated ${lessons.length} lessons, ${nq} questions, ${marks} marks`);
