# hardcode-cleanup-wave2-ampm-content-framework

**Work type:** refactor

## Objective

Wave 2 keyboard-inference-removal: content framework requires keyboard_type and extends the text backfill script (agent writes, HUMAN runs on dev then prod); the app task must NOT run until the human has verified prod has 0 NULL typed-input keyboard_type, then deletes subject-based keyboard/calculator inference. Read /home/emmanuel/StudioProjects/AMPM/plan/active/hardcoded-subject-cleanup.md first (settled decisions + your wave's section). Do not stop to ask questions. Do not push, merge, deploy or publish. Do not edit version.properties.

## Initiative

Part of initiative `hardcode-cleanup-wave2`.

## Components

- `ampm-content-framework`

## Scope boundary

Content framework: validator + backfill script only, the agent does NOT run the backfill against any database. App: only run after the human reports prod has 0 NULL typed-input keyboard_type.

## Completion conditions

- Validator rejects typed-input questions without keyboard_type; backfill script sets text for English/Afrikaans/other text subjects (dry-run default, idempotent, never overwrites, leaves updated_at alone) with tests.
- App: KeyboardResolver has no subject inference (declared else Text, ScientificMath for equation/steps); calculator type from calculator_* capabilities; Afrikaans accents from capability only; old EnglishKeyboard removed; Final Gate passes.

## Rollout needs

Human runs the backfill on dev then prod and verifies 0 NULL before the app task is run.
