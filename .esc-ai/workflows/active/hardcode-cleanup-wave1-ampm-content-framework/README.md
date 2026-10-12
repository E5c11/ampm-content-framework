# hardcode-cleanup-wave1-ampm-content-framework

**Work type:** refactor

## Objective

Wave 1 prescribed-texts-model: backend-driven prescribed-text sections and capabilities, expand-only API rename (contracts 0.42.0, backend V84, app consumes and renames English* to Setwork*), content framework validator updates. Contracts first (human publishes between tasks), then backend and app in parallel; content framework independent. Read /home/emmanuel/StudioProjects/AMPM/plan/active/hardcoded-subject-cleanup.md first (settled decisions + your wave's section). Do not stop to ask questions. Do not push, merge, deploy or publish. Do not edit version.properties.

## Initiative

Part of initiative `hardcode-cleanup-wave1`.
Depends on: ampm-kmp/hardcode-cleanup-wave1-ampm-kmp

## Components

- `ampm-content-framework`

## Scope boundary

Expand-only: no DB table/column renames, no removal of old endpoints/fields, no keyboard or calculator inference removal (Wave 2), no Firebase mapping cleanup. Analytics event names and persisted names (Room tables, DataStore keys, deep links, saved selection keys) unchanged. Nothing published, deployed or pushed.

## Completion conditions

- ampm-contracts 0.42.0 (not published): PrescribedTextResponse, PrescribedTextSectionResponse, new paths, prescribedTextId next to deprecated englishTextId on Lesson and Question, JS wrappers, serialization tests.
- ampm-backend V84: prescribed_text_sections seeded, english_texts.subject_id, capability seeds (accents_af, calculator_basic, calculator_scientific), new endpoints, legacy /english-texts filtered to novel|play|poetry, lessons/questions emit both ids, updated_at bumped; tests pass; contracts dependency bumped only once 0.42.0 resolves.
- ampm-kmp: consumes the new endpoints; section label/order/selectable from backend metadata; EnglishPaper2Constants and the poetry special-case removed; accents via accents_af capability; English* renamed to Setwork*/PrescribedText* including the Gradle module; Room migration with schema JSON; old data keeps working; Final Gate (allTests, koverHtmlReport, detekt).
- ampm-content-framework: validator knows capabilities values and prescribed-text section ids and accepts prescribedTextId; its own tests pass; no content data changed.

## Rollout needs

Human publishes ampm-contracts 0.42.0 between the contracts task and the backend/app tasks. Backend V84 deploys to dev first, prod before the app release.
