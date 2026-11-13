# AEGIS Living Book Authoring & Continuous Chronicler Constitution (`AEG-BOOK-001`)

> **Governing Laws:** `TURING-BOOK-011` | `TURING-LAW-000` | `TURING-SEPARATION-010`  
> **Master Chroniclers:** `@Victoria` (Dept 09 - Living Book Chronicler), `@Aurora` (CTO), and `@Zoe` (COO)  
> **Target Tree Schema:** 12-Level Sovereign Knowledge Tree (`src/components/ZoeFeatures/WhiteCavesBook/treeTypes.ts`)

---

## 1. The Fundamental Law of Two Tomes (`LAW-BOOK-SEPARATION`)

Every piece of living knowledge in the White Caves ecosystem must be committed to its canonical Book:

### Book 1: `book-01-white-caves` ("The Book of White Caves")

- **Domain:** Dubai Real Estate Brokerage, Prop-Tech Business, and Client Living Chronicles.
- **Strictly Contains:**
  1. White Caves Corporate Vision, Leadership Mandate, and Brand Identity.
  2. 12 Brokerage Floor SOPs (Luxury Secondary Sales, Off-Plan Corridors, Residential Leasing, Commercial Underwriting, Facilities Management, Revenue & Finance, Performance Marketing, Client Experience, Governance, DLD/RERA Compliance, Conveyancing, and Market Intelligence).
  3. Dubai Land Department (DLD) Regulations, Trakheesi Permits, Ejari Lifecycle, and Rental Calculator Indices.
  4. UAE FTA 5% VAT on Commissions, 9% Corporate Tax Reserves, and Escrow Accounts.
  5. Client Experience, VIP Onboarding, and High-Net-Worth Portfolios.
- **Prohibited in Book 1:** Internal AI agent orchestration laws, subagent prompt engineering, Vitest/Playwright test suites, and Crucible loop shell scripts.

### Book 2: `book-02-aegis` ("The Book of AEGIS")

- **Domain:** Sovereign Multi-Agent AI Engine, Autonomous Architecture & Mathematical Invariants.
- **Strictly Contains:**
  1. The 42 Sovereign Protocols (`AEG-001` through `AEG-042`).
  2. Turing Zero-Waste Credit & Sub-Second Velocity Laws (`TURING-LAW-000`).
  3. Executive Council (`@Ada`, `@Grace`, `@Aurora`, `@Margaret`, `@Zoe`, `@Nova`, `@Elena`).
  4. Track 1 (108 Engineering Nodes across 12 Tech Depts) and Track 2 (120 Business Supervisors).
  5. Protocol: Infinite Crucible & Autonomous Ouroboros Loops (`aegis:ouroboros`).
  6. Phase Chronicles, Wave Sprints, and Knowledge Compaction Transcripts.
- **Prohibited in Book 2:** Unrelated property listings, landlord lease agreements, and individual customer CRM data.

---

## 2. The 12-Level Mathematical Tree Invariant (`LAW-BOOK-12-LEVELS`)

All chapters must be strictly authored using TypeScript objects adhering to `treeTypes.ts`. Never commit unstructured markdown dumps.

```
Level 0:  Master Sovereign Corpus (Universe Root)
  ↳ Level 1:  Project Library (lib-01-enterprise)
    ↳ Level 2:  Tome / Book (book-01-white-caves | book-02-aegis)
      ↳ Level 3:  Volume (e.g. Volume I: Brokerage Operations)
        ↳ Level 4:  Canto (e.g. Canto 1: Department Floor Playbooks)
          ↳ Level 5:  Chapter (e.g. Chapter 01: Luxury Sales SOP)
            ↳ Level 6:  Sub-Chapter (Sub-Module / Functional Area)
              ↳ Level 7:  Section (Targeted domain rule)
                ↳ Level 8:  Topic (Specific operational procedure)
                  ↳ Level 9:  Leaf Artifact (Single-purpose file, code contract, or law)
                    ↳ Level 10: Paragraph (Structured prose with mathFormulas / codeBlocks)
                      ↳ Level 11: Sentence (Atomic truth proposition, statutoryInvariant flag)
                        ↳ Level 12: Line Item (Token coordinate, code line, or statutory constant)
```

### Prohibited Artifacts:

- **No Generic Placeholders:** Never use `"Section: General Overview"`, `"Topic: General Overview"`, or `"Artifact: General Overview"`. Every node must possess a concrete domain title.
- **No Truncated Strings:** Every sentence and line item must be a complete, human-readable proposition.

---

## 3. Autonomous Autopilot Continuous Chronicling Trigger (`LAW-BOOK-OUROBOROS`)

Whenever any agent, developer, or autopilot loop executes:

1. **Architectural Change:** Any new slice, API route, protocol, or statutory rule MUST be chronicled into the relevant Chapter Node (`.ts`) before concluding the wave.
2. **Sub-60-Token Coordinate Query Test:** Run `npx vitest run src/components/ZoeFeatures/WhiteCavesBook/treeQueryEngine.test.ts` to ensure all newly added nodes resolve in under 60 tokens.
3. **Dual Sync:** When editing a TSX Chapter Node, update the corresponding HTML chronicler chapter in `.agents/book-white-caves/` so both Zoe AI Assistant and human developers have synchronized, interactive access.
