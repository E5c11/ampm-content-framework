'use strict';
/**
 * Curriculum-node ID conventions, shared by content-rows.js (question unit/topic/subtopic
 * FKs) and create-curriculum-node.js.
 *
 * `curriculum_nodes.id` is a global primary key, so IDs must be unique across every subject.
 *
 * - math_lit: flat slug — `percentages`, `probability`. (Its unit/topic/subtopic slugs
 *   happened to be globally unique; kept as-is.)
 * - english_hl: `unit__topic`, `unit__topic__subtopic`; unit is the bare slug
 *   (`comprehension`). Namespaced because topic/subtopic names recur across units.
 * - maths: same `__` namespacing AND a `maths_` prefix on the unit, because a bare Maths
 *   unit slug (`probability`, `statistics`, …) collides with Math Lit's flat scheme —
 *   `maths_probability`, `maths_probability__basic_probability__independent_events`.
 *
 * Verified against live dev curriculum_nodes (english_hl: Phase 4; maths:
 * tools/backfill-maths-curriculum.js, 2026-09-03).
 */

const NAMESPACED_SUBJECTS = new Set(['english_hl', 'maths']);
// Subjects whose bare unit slug isn't globally unique and needs a prefix.
const UNIT_PREFIX = { maths: 'maths_' };

/** The `curriculum_nodes.id` of the unit node for `subject` / bare `unit` slug. */
function unitId(subject, unit) {
  return (UNIT_PREFIX[subject] || '') + unit;
}

/** The bare unit slug from a unit-node id (inverse of unitId). */
function bareUnitSlug(subject, unitNodeId) {
  const p = UNIT_PREFIX[subject];
  return p && unitNodeId.startsWith(p) ? unitNodeId.slice(p.length) : unitNodeId;
}

/** The `curriculum_nodes.id` for a node, given its subject and the bare slug path to it. */
function nodeId(subject, { unit, topic, subtopic }) {
  const flat = !NAMESPACED_SUBJECTS.has(subject);
  const u = unitId(subject, unit);
  if (subtopic != null) return flat ? subtopic : `${u}__${topic}__${subtopic}`;
  if (topic != null) return flat ? topic : `${u}__${topic}`;
  return u;
}

/** `{ unit_id, topic_id }` self-FK values for a node of the given `type`. */
function parentIds(subject, type, { unit, topic }) {
  if (type === 'unit') return { unit_id: null, topic_id: null };
  if (type === 'topic') return { unit_id: nodeId(subject, { unit }), topic_id: null };
  return {
    unit_id: nodeId(subject, { unit }),
    topic_id: nodeId(subject, { unit, topic }),
  };
}

/** `{ unit_id, topic_id, subtopic_id }` for a question referencing bare slugs. */
function questionCurriculumIds(subject, { unit, topic, subtopic }) {
  return {
    unit_id: unit ? nodeId(subject, { unit }) : null,
    topic_id: topic ? nodeId(subject, { unit, topic }) : null,
    subtopic_id: subtopic ? nodeId(subject, { unit, topic, subtopic }) : null,
  };
}

module.exports = { NAMESPACED_SUBJECTS, UNIT_PREFIX, unitId, bareUnitSlug, nodeId, parentIds, questionCurriculumIds };
