# Copilot Instructions Section 12: Plan-First Mandatory Gate

**Inserted:** After section 11 (line 166) in `.github/copilot-instructions.md`

---

## 12) PLAN-FIRST MANDATORY GATE (Credit Efficiency — Effective July 8, 2026)

### Workflow: 5-Phase Plan-Driven Development (500-600 credits per wave vs. 1,400 traditional)

**Phase 1 – Discovery (50 credits)**

- Identify 5+ examples from codebase or user research
- Document: problem, root causes, current pain points
- Define business value and success metrics

**Phase 2 – Design (30-50 credits)**

- Create specification with diagrams, pseudocode, acceptance criteria
- Include 2+ design patterns / examples from codebase
- Get stakeholder sign-off

**Phase 3 – Templates (30 credits)**

- Generate 80%+ ready-to-use code
- Include TypeScript interfaces, examples, test stubs
- Document copy-paste instructions

**Phase 4 – Implementation (300-500 credits)**

- Copy-paste templates and customize per acceptance criteria
- Run type checks and build validation
- Integrate with existing patterns

**Phase 5 – Verification (50 credits)**

- Test acceptance criteria + integration points
- Documentation + examples for team adoption
- Success metrics measured

### Enforcement Conditions (BLOCKED if not met)

1. **No coding without approval** - Spec must exist and be approved
2. **Templates ≥80%** - Reduced implementation risk and faster delivery
3. **Discovery ≥5 examples** - Pattern grounding in actual codebase
4. **Success metrics defined** - Clear KPIs before implementation
5. **Risk mitigation documented** - Known issues + fallback plans

### Allowed Exceptions

1. **Emergency fixes** - P0 production bugs (requires @Ada approval)
2. **Maintenance patches** - No UX changes, internal refactoring only
3. **Configuration only** - Non-code updates (ENV vars, JSON configs)
4. **Testing additions** - Pure test code, no feature code
5. **Documentation** - README, guides, API docs, no implementation

### Approval Gates

✅ Discovery findings complete (5+ examples)  
✅ Design specification approved by PM/Architect  
✅ Ready-code templates 80%+ complete  
✅ All tests passing before merge  
✅ Verification sign-off from QA/Designer

### Credit Savings

- **Traditional approach:** 1,400 credits (code → debug → refactor)
- **Plan-first approach:** 480-600 credits (plan → template → implement)
- **Savings:** 60-65% credit reduction
- **Payoff:** ROI 3-4 weeks of planning = 6+ months of savings

---

**Status:** ACTIVE for all coding waves
