#!/usr/bin/env node
/**
 * One-off backfill — DBE Maths (Pure Mathematics) curriculum.
 *
 * The 100 `maths` questions in `questions` were imported with NULL unit/topic/subtopic
 * because no Maths `curriculum_nodes` existed to point at (Track A cascade-null). Every one
 * was, however, authored with a unit/topic/subtopic — recoverable from the 30
 * `AMPM/scripts/add-maths-2019-nov-p{1,2}-*.js` scripts. This tool:
 *
 *   1. creates the reconciled Maths curriculum tree in `curriculum_nodes`
 *      (IDs `maths_<unit>`, `maths_<unit>__<topic>`, `maths_<unit>__<topic>__<subtopic>` —
 *      the `maths_` prefix keeps unit slugs like `probability` from colliding with Math Lit's
 *      flat scheme; see tools/lib/curriculum.js),
 *   2. backfills `questions.unit_id/topic_id/subtopic_id` for all 100 maths questions,
 *      matched by (paper_id, lesson.name, sort_order),
 *   3. also fixes the 7 questions currently pointing at Math Lit's `probability` /
 *      `basic_probability` nodes (wrong subject).
 *
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432    (first)
 *   node tools/backfill-maths-curriculum.js --dry-run        # inspect
 *   node tools/backfill-maths-curriculum.js                  # dev
 *   node tools/backfill-maths-curriculum.js --env prod       # after dev is verified
 *
 * Idempotent (upsert on id; the question UPDATE is a straight SET). Written published.
 *
 * Reconciliation vs. the raw authored tags — one change only:
 *   number_patterns: `series_sum` was used as BOTH a topic and a subtopic. It is kept as a
 *   subtopic (sum of an arithmetic / geometric series); the single question tagged
 *   `series_sum > telescoping_series` is reassigned to `arithmetic_sequence > telescoping_series`.
 * Everything else is exactly as authored. Subtopic names that recur under >1 topic
 * (`finding_equation`, `series_sum`) are disambiguated by the namespaced IDs.
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');
const { nodeId, parentIds } = require('./lib/curriculum');

const SUBJECT = 'maths';
const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';

const titleCase = (slug) =>
  slug.split('_').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');

// Display-name overrides where plain title-case reads badly (topic or subtopic slug -> name).
const NAME_OVERRIDE = {
  '3d_trig': '3D Trigonometry',
  co_interior_angles: 'Co-interior Angles',
  deriving_n: 'Deriving n',
  differentiate_wrt_parameter: 'Differentiate w.r.t. a Parameter',
  solving_f_equals_fprime: "Solving f(x) = f'(x)",
  x_intercepts: 'x-intercepts',
  power_rule_surds: 'Power Rule with Surds',
  simple_interest_with_bonus: 'Simple Interest with Bonus',
  fundamental_counting_with_restriction: 'Fundamental Counting Principle with a Restriction',
};

// ── Unit display names (hand-written; DBE Maths P1/P2 structure) ──────────────
const UNIT_NAMES = {
  algebra_equations: 'Algebra and Equations',
  number_patterns: 'Number Patterns, Sequences and Series',
  functions_graphs: 'Functions and Graphs',
  finance: 'Financial Mathematics',
  calculus: 'Differential Calculus',
  probability: 'Probability and Counting',
  statistics: 'Statistics',
  analytical_geometry: 'Analytical Geometry',
  trigonometry: 'Trigonometry',
  euclidean_geometry: 'Euclidean Geometry',
};

// ── Per-question curriculum, from the authored scripts (paper | lesson | qOrder) ──
// [unit, topic, subtopic]
const AUTHORED = {
  'nov_p1|Question 1.1|1': ['algebra_equations', 'quadratic', 'factorization'],
  'nov_p1|Question 1.1|2': ['algebra_equations', 'quadratic', 'quadratic_formula'],
  'nov_p1|Question 1.1|3': ['algebra_equations', 'inequalities', 'quadratic_inequality'],
  'nov_p1|Question 1.1|4': ['algebra_equations', 'surds', 'surd_equations'],
  'nov_p1|Question 1.2 & 1.3|1': ['algebra_equations', 'simultaneous', 'simultaneous_linear_quadratic'],
  'nov_p1|Question 1.2 & 1.3|2': ['algebra_equations', 'simultaneous', 'simultaneous_linear_quadratic'],
  'nov_p1|Question 1.2 & 1.3|3': ['algebra_equations', 'factors_and_multiples', 'prime_factorization'],
  'nov_p1|Question 2.1|1': ['number_patterns', 'quadratic_sequence', 'extending_the_sequence'],
  'nov_p1|Question 2.1|2': ['number_patterns', 'quadratic_sequence', 'general_term'],
  'nov_p1|Question 2.1|3': ['number_patterns', 'quadratic_sequence', 'finding_term_number'],
  'nov_p1|Question 2.1|4': ['number_patterns', 'quadratic_sequence', 'minimum_term'],
  'nov_p1|Question 2.2|1': ['number_patterns', 'geometric_sequence', 'series_sum'],
  'nov_p1|Question 2.2|2': ['number_patterns', 'geometric_sequence', 'inequality_term_number'],
  'nov_p1|Question 2.2|3': ['number_patterns', 'geometric_sequence', 'inequality_term_number'],
  // reconciled: authored `series_sum > telescoping_series` -> `arithmetic_sequence > telescoping_series`
  'nov_p1|Question 3|1': ['number_patterns', 'arithmetic_sequence', 'telescoping_series'],
  'nov_p1|Question 3|2': ['number_patterns', 'arithmetic_sequence', 'series_sum'],
  'nov_p1|Question 3|3': ['number_patterns', 'arithmetic_sequence', 'series_application'],
  'nov_p1|Question 4|1': ['functions_graphs', 'parabola', 'finding_equation'],
  'nov_p1|Question 4|2': ['functions_graphs', 'parabola', 'range'],
  'nov_p1|Question 4|3': ['functions_graphs', 'parabola', 'tangent_and_lines'],
  'nov_p1|Question 4|4': ['functions_graphs', 'hyperbola', 'finding_equation'],
  'nov_p1|Question 5|1': ['functions_graphs', 'exponential', 'finding_base'],
  'nov_p1|Question 5|2': ['functions_graphs', 'logarithm', 'inverse_function'],
  'nov_p1|Question 5|3': ['functions_graphs', 'exponential', 'graph_interpretation'],
  'nov_p1|Question 5|4': ['functions_graphs', 'exponential', 'exponential_equations'],
  'nov_p1|Question 6.1|1': ['finance', 'compound_interest', 'simple_interest_with_bonus'],
  'nov_p1|Question 6.1|2': ['finance', 'compound_interest', 'compound_monthly'],
  'nov_p1|Question 6.1|3': ['finance', 'compound_interest', 'investment_comparison'],
  'nov_p1|Question 6.2|1': ['finance', 'annuity_present_value', 'number_of_payments'],
  'nov_p1|Question 6.2|2': ['finance', 'annuity_future_value', 'future_value_of_extra_payments'],
  'nov_p1|Question 6.2|3': ['finance', 'annuity_present_value', 'deriving_n'],
  'nov_p1|Question 7|1': ['calculus', 'first_principles', 'linear_function'],
  'nov_p1|Question 7|2': ['calculus', 'differentiation_rules', 'power_rule_surds'],
  'nov_p1|Question 7|3': ['calculus', 'differentiation_rules', 'differentiate_wrt_parameter'],
  'nov_p1|Question 7|4': ['calculus', 'differentiation_rules', 'perpendicular_to_tangent'],
  'nov_p1|Question 8|1': ['calculus', 'cubic_analysis', 'function_value'],
  'nov_p1|Question 8|2': ['calculus', 'cubic_analysis', 'x_intercepts'],
  'nov_p1|Question 8|3': ['calculus', 'cubic_analysis', 'maximum_value'],
  'nov_p1|Question 9 (Part 1)|1': ['calculus', 'cubic_analysis', 'solving_f_equals_fprime'],
  'nov_p1|Question 9 (Part 1)|2': ['calculus', 'cubic_analysis', 'stationary_points'],
  'nov_p1|Question 9 (Part 1)|3': ['calculus', 'cubic_analysis', 'distance_between_derivative_graphs'],
  'nov_p1|Question 9 (Part 2)|1': ['calculus', 'differentiation_rules', 'second_derivative'],
  'nov_p1|Question 9 (Part 2)|2': ['calculus', 'cubic_analysis', 'vertical_distance_between_derivatives'],
  'nov_p1|Question 9 (Part 2)|3': ['calculus', 'cubic_analysis', 'inequality_involving_derivative'],
  'nov_p1|Question 10|1': ['probability', 'basic_probability', 'equally_likely_outcomes'],
  'nov_p1|Question 10|2': ['probability', 'basic_probability', 'consecutive_events'],
  'nov_p1|Question 10|3': ['probability', 'basic_probability', 'sample_space_size'],
  'nov_p1|Question 11|1': ['probability', 'basic_probability', 'independent_events'],
  'nov_p1|Question 11|2': ['probability', 'basic_probability', 'complementary_events'],
  'nov_p1|Question 11|3': ['probability', 'counting_principles', 'fundamental_counting_with_restriction'],
  'nov_p1|Question 11|4': ['probability', 'counting_principles', 'counting_with_restriction'],
  'nov_p2|Question 1|1': ['statistics', 'regression', 'prediction'],
  'nov_p2|Question 1|2': ['statistics', 'regression', 'correlation_coefficient'],
  'nov_p2|Question 1|3': ['statistics', 'regression', 'interpretation'],
  'nov_p2|Question 2|1': ['statistics', 'data_handling', 'frequency_table'],
  'nov_p2|Question 2|2': ['statistics', 'data_handling', 'modal_class'],
  'nov_p2|Question 2|3': ['statistics', 'data_handling', 'ogive'],
  'nov_p2|Question 3|1': ['analytical_geometry', 'straight_lines', 'gradient'],
  'nov_p2|Question 3|2': ['analytical_geometry', 'straight_lines', 'equation_of_line'],
  'nov_p2|Question 3|3': ['analytical_geometry', 'straight_lines', 'inclination_angle'],
  'nov_p2|Question 3|4': ['analytical_geometry', 'straight_lines', 'parallelogram'],
  'nov_p2|Question 4|1': ['analytical_geometry', 'circles', 'equation_of_circle'],
  'nov_p2|Question 4|2': ['analytical_geometry', 'circles', 'centre_and_radius'],
  'nov_p2|Question 4|3': ['analytical_geometry', 'circles', 'tangent_to_circle'],
  'nov_p2|Question 4|4': ['analytical_geometry', 'circles', 'line_and_circle'],
  'nov_p2|Question 5.1 - 5.3|1': ['trigonometry', 'trig_identities', 'simplification'],
  'nov_p2|Question 5.1 - 5.3|2': ['trigonometry', 'trig_identities', 'double_angle'],
  'nov_p2|Question 5.1 - 5.3|3': ['trigonometry', 'trig_identities', 'double_angle'],
  'nov_p2|Question 5.4|1': ['trigonometry', 'trig_equations', 'trig_equation_solution'],
  'nov_p2|Question 5.4|2': ['trigonometry', 'trig_equations', 'minimum_value'],
  'nov_p2|Question 5.4|3': ['trigonometry', 'trig_equations', 'general_solution'],
  'nov_p2|Question 6|1': ['trigonometry', 'trig_graphs', 'range'],
  'nov_p2|Question 6|2': ['trigonometry', 'trig_graphs', 'decreasing_interval'],
  'nov_p2|Question 6|3': ['trigonometry', 'trig_graphs', 'period'],
  'nov_p2|Question 7|1': ['trigonometry', '3d_trig', 'trig_ratios'],
  'nov_p2|Question 7|2': ['trigonometry', '3d_trig', 'cosine_rule'],
  'nov_p2|Question 7|3': ['trigonometry', '3d_trig', 'area_of_triangle'],
  'nov_p2|Question 8.1|1': ['euclidean_geometry', 'circle_geometry', 'cyclic_quadrilateral'],
  'nov_p2|Question 8.1|2': ['euclidean_geometry', 'circle_geometry', 'cyclic_quadrilateral'],
  'nov_p2|Question 8.1|3': ['euclidean_geometry', 'circle_geometry', 'cyclic_quadrilateral'],
  'nov_p2|Question 8.1|4': ['euclidean_geometry', 'straight_lines', 'co_interior_angles'],
  'nov_p2|Question 8.2.1|1': ['euclidean_geometry', 'similarity', 'conditions_for_similarity'],
  'nov_p2|Question 8.2.1|2': ['euclidean_geometry', 'similarity', 'similar_triangles'],
  'nov_p2|Question 8.2.1|3': ['euclidean_geometry', 'similarity', 'similar_triangles'],
  'nov_p2|Question 8.2.2|1': ['euclidean_geometry', 'similarity', 'similar_triangles'],
  'nov_p2|Question 8.2.2|2': ['euclidean_geometry', 'circle_geometry', 'concyclic_points'],
  'nov_p2|Question 8.2.2|3': ['euclidean_geometry', 'circle_geometry', 'concyclic_points'],
  'nov_p2|Question 9 (Part A)|1': ['euclidean_geometry', 'circle_geometry', 'angle_at_centre'],
  'nov_p2|Question 9 (Part A)|2': ['euclidean_geometry', 'circle_geometry', 'angle_at_centre'],
  'nov_p2|Question 9 (Part A)|3': ['euclidean_geometry', 'circle_geometry', 'proof'],
  'nov_p2|Question 9 (Part B)|1': ['euclidean_geometry', 'circle_geometry', 'tangent_chord_angle'],
  'nov_p2|Question 9 (Part B)|2': ['euclidean_geometry', 'circle_geometry', 'tangent_chord_angle'],
  'nov_p2|Question 9 (Part B)|3': ['euclidean_geometry', 'circle_geometry', 'proof'],
  'nov_p2|Question 10.1|1': ['euclidean_geometry', 'proportionality', 'proportionality_theorem'],
  'nov_p2|Question 10.1|2': ['euclidean_geometry', 'proportionality', 'proportionality_theorem'],
  'nov_p2|Question 10.1|3': ['euclidean_geometry', 'proportionality', 'proportionality_theorem'],
  'nov_p2|Question 10.2|1': ['euclidean_geometry', 'circle_geometry', 'tangents_from_external_point'],
  'nov_p2|Question 10.2|2': ['euclidean_geometry', 'circle_geometry', 'tangents_from_external_point'],
  'nov_p2|Question 10.2|3': ['euclidean_geometry', 'circle_geometry', 'cyclic_quadrilateral'],
  'nov_p2|Question 10.2|4': ['euclidean_geometry', 'similarity', 'similar_triangles_ratio'],
};

// ── Derive the node set from AUTHORED ────────────────────────────────────────
function buildNodes() {
  const units = new Set();
  const topics = new Map();    // "unit topic" -> {unit, topic}
  const subs = new Map();      // "unit topic sub" -> {unit, topic, sub}
  for (const [u, t, s] of Object.values(AUTHORED)) {
    units.add(u);
    topics.set(`${u} ${t}`, { unit: u, topic: t });
    subs.set(`${u} ${t} ${s}`, { unit: u, topic: t, sub: s });
  }
  const rows = [];
  for (const u of units) {
    rows.push({ type: 'unit', parts: { unit: u }, name: UNIT_NAMES[u] || titleCase(u) });
  }
  for (const { unit, topic } of topics.values()) {
    rows.push({ type: 'topic', parts: { unit, topic }, name: NAME_OVERRIDE[topic] || titleCase(topic) });
  }
  for (const { unit, topic, sub } of subs.values()) {
    rows.push({ type: 'subtopic', parts: { unit, topic, subtopic: sub }, name: NAME_OVERRIDE[sub] || titleCase(sub) });
  }
  return rows;
}

const NODE_COLUMNS = [
  'id', 'type', 'name', 'subject_id', 'description', 'unit_id', 'topic_id',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at',
];

async function main() {
  const pool = getPool(ENV);
  const now = new Date();

  // 1. curriculum_nodes — units, then topics, then subtopics (self-FK order)
  const nodes = buildNodes();
  const order = { unit: 0, topic: 1, subtopic: 2 };
  nodes.sort((a, b) => order[a.type] - order[b.type]);
  let nodeCount = 0;
  for (const n of nodes) {
    const id = nodeId(SUBJECT, n.parts);
    const { unit_id, topic_id } = parentIds(SUBJECT, n.type, n.parts);
    await upsertRow(
      { table: 'curriculum_nodes', columns: NODE_COLUMNS, conflictColumns: ['id'] },
      {
        id, type: n.type, name: n.name, subject_id: SUBJECT, description: null, unit_id, topic_id,
        created_at: now, updated_at: now, is_deleted: false, is_published: true, published_at: now,
      },
      { dryRun: DRY_RUN, env: ENV },
    );
    nodeCount++;
  }
  console.log(`${DRY_RUN ? '[dry-run] ' : ''}curriculum_nodes upserted: ${nodeCount} (${nodes.filter((n) => n.type === 'unit').length} units, ${nodes.filter((n) => n.type === 'topic').length} topics, ${nodes.filter((n) => n.type === 'subtopic').length} subtopics)`);

  // 2. backfill questions.unit_id/topic_id/subtopic_id
  //
  // Env-tolerant: this environment may hold only a subset of the 30 authored lessons (prod
  // has the 15 nov_p1 lessons but not nov_p2). A lesson that isn't present here is *skipped*,
  // not an error. A lesson that IS present but whose question row doesn't line up is a real
  // UNMATCHED and fails the run.
  const { rows: presentLessons } = await pool.query(
    `SELECT DISTINCT paper_id, name FROM lessons l
      WHERE EXISTS (SELECT 1 FROM questions q WHERE q.lesson_id = l.id AND q.subject_id = 'maths')`,
  );
  const lessonKey = (p, n) => `${p}|${n}`;
  const present = new Set(presentLessons.map((r) => lessonKey(r.paper_id, r.name)));

  let updated = 0;
  let skipped = 0;
  const unmatched = [];
  for (const [key, [u, t, s]] of Object.entries(AUTHORED)) {
    const [paper, lessonName, qOrder] = key.split('|');
    const unitId = nodeId(SUBJECT, { unit: u });
    const topicId = nodeId(SUBJECT, { unit: u, topic: t });
    const subId = nodeId(SUBJECT, { unit: u, topic: t, subtopic: s });
    if (!present.has(lessonKey(paper, lessonName))) { skipped++; continue; }
    if (DRY_RUN) {
      console.log(`[dry-run] ${paper} / ${lessonName} / q${qOrder}  ->  ${unitId} | ${topicId} | ${subId}`);
      updated++;
      continue;
    }
    const { rowCount } = await pool.query(
      `UPDATE questions q
          SET unit_id = $1, topic_id = $2, subtopic_id = $3, updated_at = now()
         FROM lessons l
        WHERE q.lesson_id = l.id
          AND q.subject_id = 'maths'
          AND l.paper_id = $4
          AND l.name = $5
          AND q.sort_order = $6`,
      [unitId, topicId, subId, paper, lessonName, Number(qOrder)],
    );
    if (rowCount === 1) updated++;
    else unmatched.push(`${key} (lesson present, matched ${rowCount})`);
  }
  console.log(
    `${DRY_RUN ? '[dry-run] ' : ''}questions backfilled: ${updated}` +
    (skipped ? `, skipped ${skipped} (lesson not in ${ENV})` : ''),
  );
  if (unmatched.length) {
    console.error('UNMATCHED (lesson present but question row did not line up):');
    unmatched.forEach((m) => console.error('  ' + m));
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((e) => { console.error('\n❌', e.message); process.exitCode = 1; }).finally(closePool);
}
