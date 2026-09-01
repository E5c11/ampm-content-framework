'use strict';
/**
 * Maps the authored/logical content shape (the "video" + "questions" + "aiExplanation"
 * blocks in an upload script — the shape core/question-schema.md and core/ai-explanation.md
 * describe, and tools/validate-questions.js checks) into rows for the backend's Cloud SQL
 * `questions` / `lessons` / … tables.
 *
 * Column lists and field mappings were written from the live dev schema (temp/schema/*.txt,
 * Phase 0) and cross-checked against ampm-firestore-migration/src/transform/*.ts — Phase 0
 * confirmed those column lists still match the live schema exactly.
 *
 * Pure functions, no DB access. Audit convention: created_at/updated_at = now, is_deleted =
 * false, is_published = true, published_at = now (D7). `deleted_at` is never written (stays
 * NULL). See workflows/active/repoint-authoring-to-postgres.md (Phase 2 / Phase 3).
 */

const {
  lessonUuid,
  questionUuid,
  subQuestionUuid,
  supplementaryMaterialUuid,
} = require('./uuid');

const CONTENT_TIERS = ['free', 'plus', 'pro'];

// ─── Column lists (order matters — upsertRow maps positionally) ───────────────

const LESSONS_COLUMNS = [
  'id', 'subject_id', 'syllabus_id', 'year_id', 'paper_id', 'series_id', 'name',
  'freemium_url', 'freemium_video_id', 'premium_url', 'thumbnail_url', 'has_video',
  'content_tier', 'sort_order', 'duration_seconds', 'xp', 'views', 'upvotes', 'downvotes',
  'questions_count', 'question_image_urls', 'memo_image_urls', 'exam_question_marks',
  'ai_model', 'ai_generated_at', 'ai_version', 'ai_reviewed', 'ai_input_tokens',
  'ai_output_tokens', 'ai_avg_rating', 'ai_rating_count', 'english_text_id',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at',
];

const QUESTIONS_COLUMNS = [
  'id', 'lesson_id', 'name', 'question', 'answer', 'presentation_id', 'question_type_id',
  'metadata', 'syllabus_id', 'subject_id', 'year_id', 'paper_id', 'sort_order', 'xp',
  'unit_id', 'topic_id', 'subtopic_id', 'difficulty', 'exam_weight', 'clues',
  'english_text_id', 'supplementary_material_type', 'supplementary_material_label',
  'supplementary_material_image_urls', 'context_text',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at',
];

const QUESTION_SKILLS_COLUMNS = ['question_id', 'skill_id'];
const LESSON_TAGS_COLUMNS = ['lesson_id', 'tag_id'];

const LESSON_SUPPLEMENTARY_MATERIALS_COLUMNS = [
  'id', 'lesson_id', 'type', 'label', 'image_urls', 'sort_order',
  'created_at', 'updated_at', 'is_deleted', 'deleted_at',
];

const SUB_QUESTIONS_COLUMNS = [
  'id', 'lesson_id', 'number', 'marks', 'clues', 'approach', 'solution', 'sort_order',
  'created_at', 'updated_at', 'is_deleted', 'deleted_at',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function paperPath(x) {
  return `${x.syllabus}/${x.subject}/${x.year}/${x.paper}`;
}

/** english_lit_curriculum node IDs are namespaced under their parent (`unit__topic`,
 *  `unit__topic__subtopic`); math_lit's are flat. A question stores the bare names. */
function curriculumIds(q) {
  const namespaced = q.subject === 'english_hl';
  const unit = q.unit || null;
  const topic = q.topic ? (namespaced ? `${q.unit}__${q.topic}` : q.topic) : null;
  const subtopic = q.subtopic
    ? namespaced
      ? `${q.unit}__${q.topic}__${q.subtopic}`
      : q.subtopic
    : null;
  return { unit_id: unit, topic_id: topic, subtopic_id: subtopic };
}

function audit(now) {
  return {
    created_at: now,
    updated_at: now,
    is_deleted: false,
    is_published: true,
    published_at: now,
  };
}

function childAudit(now) {
  return { created_at: now, updated_at: now, is_deleted: false, deleted_at: null };
}

function requireContentTier(video) {
  if (video.content_tier) {
    if (!CONTENT_TIERS.includes(video.content_tier)) {
      throw new Error(`lesson "${video.name}": content_tier must be one of ${CONTENT_TIERS.join('/')}, got "${video.content_tier}"`);
    }
    return video.content_tier;
  }
  if (video.is_premium === false) return 'free'; // legacy authored shape
  throw new Error(`lesson "${video.name}": set content_tier to one of ${CONTENT_TIERS.join('/')}`);
}

// ─── Row builders ────────────────────────────────────────────────────────────

/** @returns {{ lessonId: string, rows: {table:string, columns:string[], conflictColumns:string[], row:object}[] }} */
function buildContentRows(video, questions, aiExplanation, now = new Date()) {
  if (!aiExplanation || typeof aiExplanation !== 'object') {
    throw new Error('aiExplanation block is required (core/ai-explanation.md AIEXP-01)');
  }
  const pp = paperPath(video);
  const lessonId = lessonUuid(pp, video.order);
  const rows = [];

  // lessons
  rows.push({
    table: 'lessons',
    columns: LESSONS_COLUMNS,
    conflictColumns: ['id'],
    row: {
      id: lessonId,
      subject_id: video.subject,
      syllabus_id: video.syllabus,
      year_id: String(video.year),
      paper_id: video.paper,
      series_id: video.series ?? null,
      name: video.name,
      freemium_url: video.freemium_url ?? null,
      freemium_video_id: video.freemium_video_id ?? null,
      premium_url: video.premium_url ?? null,
      thumbnail_url: video.thumbnail_url ?? null,
      has_video: video.has_video ?? (video.freemium_url != null),
      content_tier: requireContentTier(video),
      sort_order: video.order,
      duration_seconds: video.duration_seconds ?? 0,
      xp: video.xp,
      views: video.views ?? 0,
      upvotes: video.upvotes ?? 0,
      downvotes: video.downvotes ?? 0,
      questions_count: questions.length,
      question_image_urls: video.question_image_urls ?? null,
      memo_image_urls: video.memo_image_urls ?? null,
      exam_question_marks: video.exam_question_marks ?? null,
      ai_model: aiExplanation.model,
      ai_generated_at: new Date(aiExplanation.generated_at),
      ai_version: aiExplanation.version,
      ai_reviewed: aiExplanation.reviewed ?? false,
      ai_input_tokens: aiExplanation.input_tokens ?? 0,
      ai_output_tokens: aiExplanation.output_tokens ?? 0,
      ai_avg_rating: aiExplanation.avg_rating ?? null,
      ai_rating_count: aiExplanation.rating_count ?? 0,
      english_text_id: video.text_key ?? null,
      ...audit(now),
    },
  });

  // lesson_tags
  for (const tagId of video.tags ?? []) {
    rows.push({
      table: 'lesson_tags',
      columns: LESSON_TAGS_COLUMNS,
      conflictColumns: ['lesson_id', 'tag_id'],
      row: { lesson_id: lessonId, tag_id: tagId },
    });
  }

  // lesson_supplementary_materials
  (video.supplementary_materials ?? []).forEach((m, i) => {
    rows.push({
      table: 'lesson_supplementary_materials',
      columns: LESSON_SUPPLEMENTARY_MATERIALS_COLUMNS,
      conflictColumns: ['id'],
      row: {
        id: supplementaryMaterialUuid(lessonId, i),
        lesson_id: lessonId,
        type: m.type,
        label: m.label,
        image_urls: m.image_urls,
        sort_order: i,
        ...childAudit(now),
      },
    });
  });

  // lesson_ai_explanation_sub_questions
  (aiExplanation.sub_questions ?? []).forEach((sq, i) => {
    rows.push({
      table: 'lesson_ai_explanation_sub_questions',
      columns: SUB_QUESTIONS_COLUMNS,
      conflictColumns: ['id'],
      row: {
        id: subQuestionUuid(lessonId, sq.number),
        lesson_id: lessonId,
        number: String(sq.number),
        marks: sq.marks ?? null,
        clues: sq.clues,
        approach: sq.approach,
        solution: sq.solution,
        sort_order: i,
        ...childAudit(now),
      },
    });
  });

  // questions + question_skills
  for (const q of questions) {
    const questionId = questionUuid(lessonId, q.order);
    const supp = q.supplementary_material ?? null;
    rows.push({
      table: 'questions',
      columns: QUESTIONS_COLUMNS,
      conflictColumns: ['id'],
      row: {
        id: questionId,
        lesson_id: lessonId,
        name: q.name,
        question: q.question,
        answer: q.answer,
        presentation_id: q.presentation,
        question_type_id: q.type,
        metadata: q.metadata ?? [], // [] is legitimate — never NULL (V64, PERSIST-01)
        syllabus_id: q.syllabus,
        subject_id: q.subject,
        year_id: String(q.year),
        paper_id: q.paper,
        sort_order: q.order,
        xp: q.xp,
        ...curriculumIds(q),
        difficulty: q.difficulty,
        exam_weight: q.exam_weight,
        clues: q.clues ?? null,
        english_text_id: q.text_key ?? null,
        supplementary_material_type: supp?.type ?? null,
        supplementary_material_label: supp?.label ?? null,
        supplementary_material_image_urls: supp?.image_urls ?? null,
        context_text: q.context_text ?? null,
        ...audit(now),
      },
    });
    for (const skillId of q.skills ?? []) {
      rows.push({
        table: 'question_skills',
        columns: QUESTION_SKILLS_COLUMNS,
        conflictColumns: ['question_id', 'skill_id'],
        row: { question_id: questionId, skill_id: skillId },
      });
    }
  }

  return { lessonId, rows };
}

/**
 * Every reference-table ID a payload depends on, grouped by table — for the upload script's
 * preflight FK check (fail loud before writing, per this repo's reuse-before-creating norm).
 */
function referenceIdsUsed(video, questions) {
  const ids = {
    subjects: new Set(), syllabuses: new Set(), years: new Set(), papers: new Set(),
    series: new Set(), tags: new Set(), question_presentations: new Set(),
    question_types: new Set(), curriculum_nodes: new Set(), skills: new Set(),
    english_texts: new Set(),
  };
  ids.subjects.add(video.subject);
  ids.syllabuses.add(video.syllabus);
  ids.years.add(String(video.year));
  ids.papers.add(video.paper);
  if (video.series) ids.series.add(video.series);
  if (video.text_key) ids.english_texts.add(video.text_key);
  for (const t of video.tags ?? []) ids.tags.add(t);
  for (const q of questions) {
    ids.question_presentations.add(q.presentation);
    ids.question_types.add(q.type);
    if (q.text_key) ids.english_texts.add(q.text_key);
    const c = curriculumIds(q);
    for (const v of [c.unit_id, c.topic_id, c.subtopic_id]) if (v) ids.curriculum_nodes.add(v);
    for (const s of q.skills ?? []) ids.skills.add(s);
  }
  return Object.fromEntries(Object.entries(ids).map(([k, v]) => [k, [...v]]));
}

module.exports = {
  CONTENT_TIERS,
  LESSONS_COLUMNS,
  QUESTIONS_COLUMNS,
  QUESTION_SKILLS_COLUMNS,
  LESSON_TAGS_COLUMNS,
  LESSON_SUPPLEMENTARY_MATERIALS_COLUMNS,
  SUB_QUESTIONS_COLUMNS,
  paperPath,
  curriculumIds,
  buildContentRows,
  referenceIdsUsed,
};
