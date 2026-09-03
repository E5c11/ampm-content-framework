'use strict';
/**
 * Curriculum-node ID conventions, shared by content-rows.js (question unit/topic/subtopic
 * FKs) and create-curriculum-node.js.
 *
 * math_lit: `curriculum_nodes.id` is the flat slug (`percentages`).
 * english_hl: topic/subtopic IDs are namespaced under their parent
 *   (`comprehension__evaluative_reading`, `comprehension__evaluative_reading__conclusion_evaluation`)
 *   because names legitimately recur across units. Unit IDs are always the flat slug.
 * Verified against live dev curriculum_nodes (Phase 0 / Phase 4).
 */

const NAMESPACED_SUBJECTS = new Set(['english_hl']);

/** The `curriculum_nodes.id` for a node, given its subject and the bare slug path to it. */
function nodeId(subject, { unit, topic, subtopic }) {
  const flat = !NAMESPACED_SUBJECTS.has(subject);
  if (subtopic != null) return flat ? subtopic : `${unit}__${topic}__${subtopic}`;
  if (topic != null) return flat ? topic : `${unit}__${topic}`;
  return unit; // unit IDs are flat for every subject
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

module.exports = { NAMESPACED_SUBJECTS, nodeId, parentIds, questionCurriculumIds };
