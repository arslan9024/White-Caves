# Managing Director Ghost Session Impersonation Matrix

> **Document Class:** Functional Use Case  
> **Repository Path:** `software_docs/03_use_cases/md_impersonation_matrix.md`  
> **Actor:** Managing Director / Founder (`LEVEL_5_MASTER`)

---

## 🎯 Use Case Overview

The Managing Director requires zero-friction ability to inspect and operationalize the workspace viewport of any agent, manager, or executive across all 12 corporate departments without invalidating security credentials or logging out.

---

## 📋 Step-Sequence Execution Flow

1. **Pre-Condition**: Actor authenticated with `accessLevel: 5` (`LEVEL_5_MASTER` badge active).
2. **Actor Action**: MD selects target agent profile from `TopNavbar` impersonation dropdown (`data-testid="md-impersonation-panel"`).
3. **System Response**: `useWorkspace()` context intercepts change and sets `impersonatedUser` state.
4. **State Transition**: App viewport re-renders using target user's RBAC role and departmental permissions while maintaining MD override capability.
5. **Visual Cue**: Red notification banner (`#EF4444`) renders at top of viewport: `"IMPERSONATING: [Agent Name] ([Role]) — Click to Revert"`.
6. **Post-Condition**: MD can audit active pipeline, approve pending deals, or troubleshoot agent issues in real-time.
7. **Reversion Action**: Clicking "Revert to MD Master View" clears `impersonatedUser` and restores pure LEVEL 5 master view.
