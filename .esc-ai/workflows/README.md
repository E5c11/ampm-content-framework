---
schema_version: 1
policy: {}
---

# Workflows — ampm-content-framework Policy

This directory holds this repository's own workflow tracking: active and archived task work. It does not duplicate `esc-ai-execution-framework`'s or `esc-ai-architecture-framework`'s instructions — see [`../INSTRUCTIONS.md`](../INSTRUCTIONS.md) for those, and the architecture framework's Gap Protocol (in its `INSTRUCTIONS.md`) for what to do when framework coverage is missing.

**This is a generated starting skeleton, not a finished policy.** Fill in before treating this repository as fully onboarded:

- Project-specific framework extension: does this repository have one (e.g. `<project>-backend-framework`)? If so, declare it under `policy.extension` in the frontmatter above (`id`, `precedence`) and describe its precedence over the generic architecture framework here.
- Workflow naming/location rules specific to this repository, if any beyond the default `.esc-ai/workflows/active|archive/` convention.
- Where active business roadmaps live, if separate from `.esc-ai/workflows/active/`.
- Repository-specific final gates and commit conventions — list them under `policy.final_gates`/`policy.commit_conventions` in the frontmatter above.
- Deployment or environment constraints that don't belong in a generic framework.
- Any other exception specific to this repository that cannot be generalized into either framework.
