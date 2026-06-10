---
description: 'Run one macro/huge-wave implementation from blocker identification to validated completion'
---

# Macro/Huge-wave Implementation Prompt

Execute a single macro/huge-wave bundle with this sequence:

1. Identify the highest-leverage blocker in current diagnostics.
2. Propose the largest dependency-safe bundled fix.
3. Apply coherent grouped code changes (3-6 modules when feasible).
4. Validate at file scope.
5. Validate at workspace scope.
6. Summarize delta only (what changed, what remains).

Constraints:

- No risky broad refactors unless strictly required.
- Keep naming/API conventions consistent with existing slice/service patterns.
- Do not update progress metrics without validation evidence.

Expected output:

- Changed files list
- Validation outputs (before/after)
- Next recommended macro/huge-wave

<!-- Inspired by awesome-copilot prompt/workflow conventions -->
