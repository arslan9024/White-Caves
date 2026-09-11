---
name: aegis-infinite-crucible
description: Executes the Protocol: Infinite Crucible for massive backlog generation and resolution via an autopilot loop.
triggers:
  - aegis:nova:protocol:infinite:crucible
---

# Protocol: Infinite Crucible 

This skill defines the strict continuous operations logic for **@Nova**. The mission is an infinite loop that finds, opens, and exhaustively solves batches of 1,000 GitHub issues without stopping.

## Phase 1: The Deep Hunt (1,000 Issues)
1. Initiate a deeply exhaustive scan across all modules, tests, architectures, and the AEGIS priorities.
2. Formulate exactly **1,000 highly critical issues**.
3. Group these issues into strict Milestones on GitHub.
4. Push all 1,000 issues to the LIVE GitHub repository using `gh issue create`.
5. Do **NOT** proceed to fixing until all 1,000 issues are fully opened on the live repository.

## Phase 2: The Solver Engine (Zero-Pending Loop)
1. Enter the Autopilot Loop ("solver engine").
2. Query GitHub for all open issues generated in Phase 1.
3. Solve issues **one by one** sequentially. No context length limits will be hit because issues are solved in strict isolation.
4. Run `gh issue close <id>` immediately upon successful validation.
5. Do **NOT** generate the Project Improvement Report during this phase.

## Phase 3: The Climax & Restart
1. Check GitHub via `gh issue list`. 
2. If (and ONLY if) there are **ZERO open issues** pending from the batch:
   - Generate the final `PROJECT_IMPROVEMENT_STATS.md` artifact detailing how the 1,000 issues improved the codebase.
   - Complete the Milestone on GitHub.
   - Immediately loop back to **Phase 1: The Deep Hunt** to find the next 1,000 issues.

## Execution Command
To check the status or continue/kickoff this protocol, the user will explicitly invoke:
`aegis:nova:protocol:infinite:crucible`
