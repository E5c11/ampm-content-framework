'use strict';
/**
 * Deterministic UUIDs for content authored directly into Postgres.
 *
 * `lessons`/`questions` have only a UUID primary key — no `firestore_id` column, no natural
 * unique constraint (verified against the live schema, Phase 0). Deriving the UUID from a
 * stable natural key makes re-running an upload script an upsert rather than a duplicate.
 *
 * The namespace is fixed forever and is DISTINCT from ampm-firestore-migration's Track A
 * namespace (b7e13cf0-...), so content authored here and content bulk-imported from
 * Firestore can never collide on an ID.
 * See workflows/active/repoint-authoring-to-postgres.md (D6).
 *
 * Name conventions (paperPath = "{syllabus}/{subject}/{year}/{paper}"):
 *   lesson                  lesson:{paperPath}#{order}
 *   question                question:{lessonUuid}#{questionOrder}
 *   sub-question             subq:{lessonUuid}#{number}          e.g. "1.1.1"
 *   supplementary material   supp:{lessonUuid}#{index}
 */

const { v5: uuidv5 } = require('uuid');

const AUTHORED_NAMESPACE = '84ee2362-8773-41f9-9d93-22a735709e72';

/** UUIDv5 of `name` under the pinned authored-content namespace. */
function authoredUuid(name) {
  return uuidv5(name, AUTHORED_NAMESPACE);
}

const lessonUuid = (paperPath, order) => authoredUuid(`lesson:${paperPath}#${order}`);
const questionUuid = (lessonId, questionOrder) => authoredUuid(`question:${lessonId}#${questionOrder}`);
const subQuestionUuid = (lessonId, number) => authoredUuid(`subq:${lessonId}#${number}`);
const supplementaryMaterialUuid = (lessonId, index) => authoredUuid(`supp:${lessonId}#${index}`);

module.exports = {
  AUTHORED_NAMESPACE,
  authoredUuid,
  lessonUuid,
  questionUuid,
  subQuestionUuid,
  supplementaryMaterialUuid,
};
