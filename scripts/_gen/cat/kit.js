'use strict';
// Question-option helpers for the CAT lesson data (units, skills and subtopics are the CAT vocabulary; profile § Curriculum units).
const U = {
  SYS: 'systems_technologies', NET: 'network_technologies', INT: 'internet_technologies',
  IM: 'information_management', SOC: 'social_implications', SD: 'solution_development',
};
const mk = (skill, subtopic, type) => (unit, topic, x = {}) => ({
  unit, topic, skill, subtopic, diff: x.d ?? 2, w: x.w ?? 2, type: x.type || type,
  ...(x.clues ? { clues: x.clues } : {}), ...(x.fig !== undefined ? { fig: x.fig } : {}),
});
module.exports = {
  U,
  rec: mk('recall_cat_term', 'cat_term_recall', 'definition'),
  cls: mk('classify_cat_concept', 'cat_classification', 'application'),
  cau: mk('explain_cat_cause_and_effect', 'cat_cause_and_effect', 'application'),
  app: mk('apply_cat_concept_to_scenario', 'cat_scenario_application', 'application'),
  dat: mk('interpret_cat_stimulus', 'cat_data_interpretation', 'interpretation'),
  seq: mk('sequence_cat_process', 'cat_sequencing', 'ordering'),
};
