# English FAL authoring generators

Session generators that wrote the 2025 Nov FAL upload scripts (`scripts/add-english-fal-2025-nov-p*-q*.js`). Kept for provenance and as a
starting point for the next paper; they are NOT part of the pipeline and contain hard-coded paths from the authoring session
(scratchpad, `/tmp/claude-1000/...counts.json`). Adapt paths before re-running. `answers*.py` drive the Text keyboard on the emulator
(`text_key_<LETTER>`, `text_key_switch`, `text_key_done`) and poll for `question_feedback_*`.
