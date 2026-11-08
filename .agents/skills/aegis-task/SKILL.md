---
name: aegis-task
description: Executes an AEGIS V5.0 sovereign task under TURING-LAW-000 and TURING-ROOT-007. Activated via `/aegis-task` or `aegis:task`.
triggers:
  - "/aegis-task"
  - "aegis:task"
---

# AEGIS V5.0 Sovereign Task Execution Protocol

When this skill is invoked (via `/aegis-task <feature_description>` or direct mention), you MUST operate as the Sovereign Orchestrator Council (`@Ada`, `@Aurora`, `@Grace`, `@Gwynne`, `@Rachel_QA`) and execute the user's requested update following this strict, zero-waste protocol.

## Step 0: Council Activation & Invariants
- **TURING-LAW-000 (Zero AI Credit Waste):**
  - Run all independent tool calls in a **single parallel batch** per turn.
  - Never dump entire large files into context. Use surgical line reads (`StartLine`/`EndLine`).
  - Zero-token deterministic scripts first (Node/PowerShell) for mechanical edits.
  - Test only the touched module/test (`< 2s`), never the full 500-file suite.
  - Output ultra-concise summaries with zero filler prose. Hard limit `<= 15,000` tokens per task.
- **TURING-ROOT-007 (Strict .agents/ Encapsulation):**
  - Project root must stay pristine. No `docs/`, `plans/`, `strategies/` in the root.
- **Design Invariants:**
  - White Caves Luxury Palette: Red (`#EF4444`), Slate (`#0F172A`), Pure White (`#FFFFFF`).
  - Context Triad: Redux slice (Theme, Language, Currency) (`AEG-003`/`041`).
  - File Size Ceiling: `< 350` lines per file (`AEG-042`).

---

## Step 1: Pre-flight Health & Dedup Check
Execute in parallel or sequentially before touching code:
```powershell
node .agents/orchestrator/aegis-engine.js health
node .agents/orchestrator/aegis-engine.js dedup
```

---

## Step 2: Implementation
Implement the requested feature/UI update in the appropriate department domain:
- **Core Backend:** Dept 04 (Backend), Dept 05 (Prisma DB), Dept 06 (API Gateway)
- **Luxury UI/UX & i18n:** Dept 02 (UI Primitives), Dept 09 (Design), Dept 10 (i18n/RTL)
- **Mobile & Vision OCR:** Dept 03 (Mobile), Dept 11 (Vision OCR)
- **SQA, SecOps & CI/CD:** Dept 01 (Orchestration), Dept 07 (SecOps), Dept 08 (DevOps), Dept 12 (SQA)

Ensure:
1. No files exceed 350 lines.
2. RTL compatibility (`dir="rtl"`, bidirectional layouts) if modifying UI.
3. Strict TypeScript with zero `any` leaks.

---

## Step 3: Targeted Verification (< 2 seconds)
Locate and run ONLY the specific Vitest test file covering the touched code:
```powershell
npx vitest run <path/to/touched_test.test.ts>
```
If a test does not exist for the new logic, create or update a co-located test and verify it passes in `< 2s`.

---

## Step 4: Git Sync & Push
Verify workspace hygiene before staging:
```powershell
git status --porcelain
git add <touched_files>
git commit -m "feat(dept-XX): <concise conventional summary of changes>"
git push origin main
```

---

## Step 5: Sovereign Completion Summary
Provide a concise, bulleted report:
- **Files Modified / Created** (with line counts)
- **Targeted Test Results** (passes, duration)
- **Git Commit Hash & Branch**
- Zero conversational fluff.
