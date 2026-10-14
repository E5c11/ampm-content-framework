#!/usr/bin/env node
/**
 * Audit of answer-giveaway cues in uploaded content (DESIGN-UNI-15 / DESIGN-UNI-16; review-paper.md Phase 3).
 * Reads dev Cloud SQL (Auth Proxy on PG_PORT_DEV). Read-only.
 *
 *   node tools/audit-answer-cues.js --subject economics [--year 2025] [--paper nov_p1] [--json]
 *
 * Reports, per paper:
 *   - multiple_choice: how often the CORRECT option is the strictly longest option (chance is ~25%; DESIGN-UNI-16 caps it at 30%),
 *     and every question where it is longest by a clear margin (>= 1.25x the longest distractor, or >= 25 characters more)
 *   - ordering: every item that carries a structural/positional label (DESIGN-UNI-15), e.g. "Introduction ...", "Conclusion ...", "First ...".
 * Exit code 1 when any hard finding exists (margin cases or labelled ordering items) or the paper-level longest-rate is above the cap.
 */
'use strict';
const { getPool, closePool } = require('./lib/postgres');
const { optionLengthFinding, orderingLabelFinding, multiSelectLengthFinding, LONGEST_RATE_CAP } = require('./lib/answer-cues');

const a = process.argv.slice(2).reduce((acc, x, i, arr) => { if (x.startsWith('--')) acc[x.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true; return acc; }, {});
if (!a.subject) { console.error('Usage: node tools/audit-answer-cues.js --subject <id> [--year YYYY] [--paper nov_p1] [--json]'); process.exit(1); }

(async () => {
  const pool = getPool('dev');
  const params = [a.subject]; let where = 'q.subject_id = $1 AND q.is_deleted = false';
  if (a.year) { params.push(a.year); where += ` AND q.year_id = $${params.length}`; }
  if (a.paper) { params.push(a.paper); where += ` AND q.paper_id = $${params.length}`; }
  const { rows } = await pool.query(`SELECT q.year_id, q.paper_id, l.sort_order AS lesson, l.name AS lesson_name, q.sort_order AS qn, q.presentation_id AS p, q.question, q.metadata, q.answer
    FROM questions q JOIN lessons l ON l.id = q.lesson_id WHERE ${where} ORDER BY q.year_id, q.paper_id, l.sort_order, q.sort_order`, params);
  const papers = {};
  for (const r of rows) {
    const k = `${r.year_id} ${r.paper_id}`; const P = (papers[k] = papers[k] || { mc: 0, longest: 0, margin: [], ordering: [], ms: 0, msLong: [] });
    if (r.p === 'multiple_choice') {
      const f = optionLengthFinding(r.metadata, r.answer[0]);
      if (f) { P.mc++; if (f.longest) P.longest++; if (f.margin) P.margin.push({ lesson: r.lesson, qn: r.qn, correctLen: f.correctLen, maxOther: f.maxOther, q: r.question.slice(0, 80) }); }
    } else if (r.p === 'multi_select') {
      const f = multiSelectLengthFinding(r.metadata, r.answer); if (f) { P.ms++; if (f.flag) P.msLong.push({ lesson: r.lesson, qn: r.qn, ratio: f.ratio.toFixed(2), q: r.question.slice(0, 70) }); }
    } else if (r.p === 'ordering') {
      const bad = orderingLabelFinding(r.metadata); if (bad.length) P.ordering.push({ lesson: r.lesson, qn: r.qn, items: bad });
    }
  }
  let hard = 0;
  for (const [k, P] of Object.entries(papers)) {
    const rate = P.mc ? P.longest / P.mc : 0; const over = rate > LONGEST_RATE_CAP;
    console.log(`\n${a.subject} ${k}: ${P.mc} multiple_choice, correct option is the longest in ${P.longest} (${(100 * rate).toFixed(0)}%${over ? ` — ABOVE the ${100 * LONGEST_RATE_CAP}% cap` : ''}); ${P.margin.length} by a clear margin; ${P.msLong.length}/${P.ms} multi_select where the correct options are clearly longer; ${P.ordering.length} ordering question(s) with positional labels`);
    for (const m of P.margin) console.log(`   LENGTH  L${m.lesson} Q${m.qn}: correct ${m.correctLen} chars vs longest distractor ${m.maxOther} — ${m.q}`);
    for (const m of P.msLong) console.log(`   MS-LEN  L${m.lesson} Q${m.qn}: correct options average ${m.ratio}x the length of the wrong ones — ${m.q}`);
    for (const o of P.ordering) console.log(`   LABEL   L${o.lesson} Q${o.qn}: ${o.items.map((i) => JSON.stringify(i)).join(' | ')}`);
    hard += P.margin.length + P.ordering.length + P.msLong.length + (over ? 1 : 0);
  }
  await closePool('dev');
  if (hard) { console.log(`\n${hard} finding(s).`); process.exit(1); }
  console.log('\nNo answer-cue findings.');
})().catch((e) => { console.error(e.message); process.exit(1); });
