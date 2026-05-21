---
description: 'Run one micro-wave implementation from blocker identification to validated completion'
---

# Micro-wave Implementation Prompt

Execute a single micro-wave with this sequence:

1. Identify the highest-leverage blocker in current diagnostics.
2. Propose the smallest safe fix.
3. Apply code changes.
4. Validate at file scope.
5. Validate at workspace scope.
6. Summarize delta only (what changed, what remains).

Constraints:

- No broad refactors unless strictly required.
- Keep naming/API conventions consistent with existing slice/service patterns.
- Do not update progress metrics without validation evidence.

Expected output:

- Changed files list
- Validation outputs (before/after)
- Next recommended micro-wave

<!-- Inspired by awesome-copilot prompt/workflow conventions -->
