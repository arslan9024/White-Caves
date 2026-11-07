# 📋 AGENT UPGRADE V2 - QUICK REFERENCE GUIDE FOR MODULE LEADS

**For:** All 10 Module Leads | **Duration:** May 21 - Jun 9, 2026  
**Keep This Handy:** During daily operations

---

## 🎯 Your Module at a Glance

### Module Lead Responsibilities

```
┌─────────────────────────────────────────────────────────────────┐
│ DAILY MODULE LEAD DUTIES                                        │
├─────────────────────────────────────────────────────────────────┤
│ ✅ 08:00 — Launch all team members (assign Day's tasks)         │
│ ✅ 10:00 — Check-in on progress (quick sync with each agent)    │
│ ✅ 12:00 — Collect FEEDS_ACK confirmations from downstream      │
│ ✅ 14:00 — Mid-day metrics check (capacity, blockers)           │
│ ✅ 16:00 — Resolve any P2 blockers (escalate if needed)         │
│ ✅ 17:00 — Collect daily outputs & prepare handoffs             │
│ ✅ 17:30 — Commit & sync with @Margaret                         │
└─────────────────────────────────────────────────────────────────┘
```

### Your Team

| Module        | Lead      | Team Members                                    | Primary Skills                    |
| ------------- | --------- | ----------------------------------------------- | --------------------------------- |
| **Module 1**  | @Victoria | @Amina, @Hala, @Samira, @Rania, @Noor, @Basma   | Legal, Contracts, Tenancy         |
| **Module 2**  | @Sofia    | @Timnit, @Iman, @Sanaa, @Noura, @Reem, @Manal   | Compliance, DLD, Regulations      |
| **Module 3**  | @Booking  | @Maya, @Hedy, @Dina, @Layla, @Maha, @Salma      | Scheduling, Workflows, Automation |
| **Module 4**  | @Jaime    | @Anima, @Rachel, @Marissa, @Zainab, @Ghada      | Sales, Offers, Marketing          |
| **Module 5**  | @Invoice  | @Cassie, @Amal, @Yasmin, @Lina, @Fei-Fei, @Mary | Finance, Analytics, Valuation     |
| **Module 6**  | @Corinne  | @Annie, @Joelle, @Rania, @Huda, @Sanaa          | WhatsApp, AI, Communications      |
| **Module 7**  | @Rania    | @Corinne, @Annie, @Hedy, @Dina, @Basma          | Support, Maintenance, Escalation  |
| **Module 8**  | @Salma    | @Sanaa, @Manal, @Noor, @Hedy                    | Testing, QA, Accessibility        |
| **Module 9**  | @Joelle   | @Cassie, @Corinne, @Fei-Fei, @Anima             | AI, ML, Personalization           |
| **Module 10** | @Gwynne   | @Lisa, @Lila, @Radia, @Annie                    | DevOps, Infrastructure, Security  |

---

## 📝 Daily Task Assignment Template

### Morning Standup (08:00 - 08:30)

```markdown
## [Module X] — Daily Standup — [DATE]

### Team Assignment

- **@Agent1 — TASK:** [ACTION] [TARGET_FILE] → [EXPECTED_OUTPUT]
  - Status: 🚧 In Progress | Priority: High | Blocker: None
- **@Agent2 — TASK:** [ACTION] [TARGET_FILE] → [EXPECTED_OUTPUT]
  - Status: 🎯 Assigned | Priority: Medium | Blocker: Awaiting @Agent1

- **@Agent3 — TASK:** [ACTION] [TARGET_FILE] → [EXPECTED_OUTPUT]
  - Status: 🔧 Prep | Priority: High | Blocker: None

### Module Dependencies

- **CONSUMES ← [Other Module]:** [File] [Section] (arriving by 10:00)
- **FEEDS → [Other Module]:** [File] [Section] (delivering by 14:00)

### Capacity Target

- **Baseline:** [X]% → **Target Today:** [X+30]%
- **Agents Active:** [X]/[Total]
- **Expected Outputs:** [X] documents/tasks

### Escalation Watch

- 🟢 All Clear — No P1/P2 blockers anticipated
```

---

## 🔄 Async Review Cycle (2-Hour Loop)

### Every 2 Hours

```
┌─────────────────────────────────────────────────────┐
│ SYNC PACKET COLLECTION (Every 2 hours)              │
├─────────────────────────────────────────────────────┤
│ MODULE LEAD ACTION:                                 │
│ 1. Collect agent updates (status + blockers)        │
│ 2. Check FEEDS_ACK confirmations from downstream    │
│ 3. Identify any P2/P3 blockers                      │
│ 4. Prepare YAML handoff packet (below)              │
│ 5. Send to @Margaret for consolidation              │
└─────────────────────────────────────────────────────┘
```

### YAML Handoff Packet Template

```yaml
MODULE_ID: 1
MODULE_NAME: 'Leasing & Tenancy'
MODULE_LEAD: '@Victoria'
TIMESTAMP: '2026-05-22T10:30Z'

CAPACITY:
  target_utilization: '85%'
  current_utilization: '72%'
  available_buffer: '13%'

AGENT_STATUS:
  - name: '@Amina'
    task: 'DRAFT intake forms'
    progress: '67%'
    status: '🚧 IN_PROGRESS'
    blocker: null

  - name: '@Hala'
    task: 'AUDIT translations'
    progress: '100%'
    status: '✅ COMPLETE'
    feeds_ack_pending: true

  - name: '@Noor'
    task: 'REVIEW criteria'
    progress: '0%'
    status: '⏸️ BLOCKED'
    blocker: 'Awaiting DLD API spec from Module 2'
    blocker_owner: '@Sofia'
    blocker_due: '2026-05-22T12:00Z'

OUTPUTS:
  completed: 3
  in_progress: 2
  blocked: 1
  completed_files:
    - path: 'business_docs/09_crm_features/intake-forms.md'
      sections: 8
      quality_score: 95

FEEDS_ACK:
  sent: 2
  confirmed: 1
  pending: 1
  downstream_modules: ['Module 3', 'Module 2']

BLOCKERS:
  p0: []
  p1: []
  p2:
    - id: 'BLK-001'
      severity: 'P2'
      description: 'Awaiting DLD API docs'
      owner: '@Sofia (Module 2)'
      due: '2026-05-22T12:00Z'
      impact: 'Blocks @Noor progress'

NEXT_WAVE_READINESS:
  ready_for_next_wave: true
  next_wave_tasks: 3
  estimated_completion: '2026-05-22T14:00Z'
```

---

## 🚨 Blocker Resolution Guide

### Quick Decision Tree

```
┌─ BLOCKER IDENTIFIED
│
├─ P0 (System Down / Critical)
│  ├─ STOP ALL WORK IMMEDIATELY
│  ├─ Call @Ada on emergency line
│  ├─ Activate rollback procedures
│  └─ Keep team on standby (est. 30 min fix)
│
├─ P1 (Major Impact / <1 hour to fix)
│  ├─ Notify @Margaret immediately
│  ├─ Shift team to backup tasks
│  ├─ @Ada coordinates resolution
│  └─ Resume normal work in 1 hour
│
├─ P2 (Moderate Impact / <4 hours to fix)
│  ├─ Notify @Margaret
│  ├─ Identify workaround if available
│  ├─ Continue lower-priority tasks
│  ├─ Re-check every 30 minutes
│  └─ Escalate to @Ada if not resolved in 2h
│
└─ P3 (Low Impact / <24 hours to fix)
   ├─ Log in daily standup
   ├─ Add to queue for next sprint
   └─ Continue normal work
```

### Common Blockers & Quick Fixes

| Blocker                  | Cause                   | Quick Fix                   | Escalate If                |
| ------------------------ | ----------------------- | --------------------------- | -------------------------- |
| Awaiting upstream doc    | Dependency not ready    | Ask Module Lead for ETA     | ETA > 2 hours              |
| FEEDS_ACK not confirmed  | Downstream agent missed | Direct message + 5 min ping | No response in 15 min      |
| API/Tool down            | System issue            | Try alternative tool        | Both options down          |
| Missing context          | Requirement unclear     | Request 5-min clarification | Still unclear after 10 min |
| Conflicting requirements | Cross-module mismatch   | Message both module leads   | No agreement in 20 min     |

---

## 📊 Capacity Tracking

### Daily Capacity Formula

```
Current Capacity % = (Completed Tasks / Target Tasks) × 100

Target Tasks Today = (Baseline Tasks × Expected Capacity Multiplier)

For Module 1 (Leasing):
- Baseline: 5 documents/day
- May 21 target (150% capacity): 7-8 docs
- May 25 target (200% capacity): 10 docs
- Jun 1 target (280% capacity): 14 docs
- Jun 8 target (300% capacity): 15 docs

✅ MEETING TARGET → Keep momentum
⚠️ 10-20% SHORT → Activate overflow protocols
🚨 >20% SHORT → Escalate to @Margaret
```

### Mid-Day Check-In (14:00)

```markdown
## MODULE 1 CAPACITY CHECK — 14:00 Status

Date: 2026-05-22 | Lead: @Victoria | Target: 150%

| Agent   | AM Output | PM Target | On Track?    |
| ------- | --------- | --------- | ------------ |
| @Amina  | 2 docs    | 1 doc     | ✅           |
| @Hala   | 1 doc     | 1 doc     | ✅           |
| @Samira | 1 doc     | 1 doc     | ✅           |
| @Rania  | 1 doc     | 0.5 doc   | ✅           |
| @Noor   | 0 docs    | 1 doc     | 🟡 (Blocked) |

**Current Pace:** 6/7 target outputs = 86% ✅  
**Unblock Action:** Need DLD spec from @Sofia by 15:00  
**Contingency:** @Noor can start REVIEW task instead while blocked

**Projected EOD:** 7 total docs (150% target) ✅
```

---

## 🎯 End of Day Sync (17:00 - 17:30)

### Final Checklist

- [ ] All agents finished for the day
- [ ] All completed outputs collected
- [ ] FEEDS_ACK confirmations from downstream modules received
- [ ] All blockers for tomorrow identified and noted
- [ ] Tomorrow's queue prepared for 08:00 launch
- [ ] Metrics logged in daily summary
- [ ] Git commits prepared with module prefix: `[Module-X]`

### Final Sync Packet to @Margaret

```markdown
## MODULE 1 EOD REPORT — May 22, 2026

**DELIVERABLES COMPLETED:**

- ✅ Intake form specification (14 sections)
- ✅ Tenancy agreement template (PDF ready)
- ✅ Translation gap audit (5 issues found + resolved)
- ✅ Support escalation matrix (15 scenarios)

**FEEDS_ACK CONFIRMATIONS:**

- ✅ Module 3 (@Booking) confirmed intake schedule dependencies
- ✅ Module 2 (@Sofia) confirmed compliance requirements
- ⏳ Module 7 (@Rania) still reviewing support matrix (due 18:00)

**BLOCKERS FOR TOMORROW:**

- 🟡 P2: Awaiting enhanced compliance spec from @Sofia (due 08:00 May 23)
- 🟡 P3: Need access to legacy contract templates (low priority)

**CAPACITY METRICS:**

- Current: 150% (7/7 target outputs) ✅
- Agents at capacity: 6/7
- 1 agent slightly underutilized (due to blocker)

**NEXT DAY READINESS:**

- Queue prepared: 10 tasks for May 23
- Upstream dependencies ready: Yes (Module 2 spec expected 08:00)
- Team morale: Excellent ⭐⭐⭐⭐⭐

**SIGNATURE:**
@Victoria — Module 1 Lead
2026-05-22 17:30 UTC
```

---

## 🔗 Cross-Module Coordination

### Important Phone Numbers (Internal WhatsApp/Slack)

- **@Ada (Emergency)** — P0 blockers only
- **@Margaret (Primary)** — All sync + metrics
- **Other Module Leads:**
  - Module 1: @Victoria | Module 2: @Sofia | Module 3: @Booking
  - Module 4: @Jaime | Module 5: @Invoice | Module 6: @Corinne
  - Module 7: @Rania | Module 8: @Salma | Module 9: @Joelle | Module 10: @Gwynne

### Communication Cadence

| Time      | Action              | Participants                       |
| --------- | ------------------- | ---------------------------------- |
| **08:00** | Module launch       | Module Lead + all team members     |
| **10:00** | 2h sync packet      | Module Lead + @Margaret            |
| **12:00** | Cross-module sync   | All 10 Module Leads + @Margaret    |
| **14:00** | Capacity check      | Module Leads (self-check)          |
| **16:00** | Blocker review      | @Margaret + blocked Module Lead    |
| **17:00** | EOD handoff         | Module Lead + @Margaret            |
| **17:30** | Daily consolidation | @Margaret (aggregates all modules) |

---

## 💡 Pro Tips for Module Leads

### ✅ Success Patterns

1. **Start Strong:** Launch tasks early (08:00 exactly), not late
2. **Communicate Early:** Flag blockers within 5 minutes, not hours
3. **Review Async:** Let downstream modules review while your team continues
4. **Celebrate Wins:** Acknowledge agent achievements in standup
5. **Escalate Fast:** P0/P1 blockers need @Ada within 30 minutes

### ⚠️ Common Pitfalls to Avoid

1. ❌ Waiting for 100% certainty before assigning tasks (just assign, iterate)
2. ❌ Hoarding agents for lower-priority work (optimize capacity daily)
3. ❌ Not flagging blockers until they're critical (flag early!)
4. ❌ Micromanaging agents (trust your team, focus on coordination)
5. ❌ Skipping sync calls with @Margaret (even 2 minutes helps)

### 🎯 High-Capacity Execution Principles

**Throughput Over Perfection:**

- Ship 90% complete docs quickly, iterate with FEEDS_ACK feedback
- Don't wait for perfection, continuous improvement via handoffs

**Parallel Before Sequential:**

- Always try to run tasks in parallel, not one after another
- If one agent is blocked, shift to parallel work, not wait

**Escalate Early:**

- Flag P2 blockers at 30 min, not at 2 hours
- @Margaret needs time to coordinate with other module leads

**Celebrate Feedback:**

- FEEDS_ACK from downstream is validation, not failure
- Use it to improve continuously

---

## 📚 Additional Resources

- **Full Upgrade Details:** [AGENT_SKILLS_UPGRADE_V2.md](./AGENT_SKILLS_UPGRADE_V2.md)
- **Implementation Checklist:** [AGENT_UPGRADE_IMPLEMENTATION_CHECKLIST.md](./AGENT_UPGRADE_IMPLEMENTATION_CHECKLIST.md)
- **AGENTS.md Master File:** [AGENTS.md](./AGENTS.md)
- **Copilot Instructions:** [copilot-instructions.md](./.github/copilot-instructions.md)

---

## 📞 Quick Help

**"How do I resolve a blocker?"**  
→ Use the Decision Tree above. For P0/P1, message @Margaret immediately.

**"What if I'm falling behind on capacity?"**  
→ Message @Margaret for dependency injection (pull output from upstream module).

**"How do I communicate with other modules?"**  
→ Use YAML handoff packets (template above) sent to @Margaret every 2 hours.

**"What if downstream module hasn't confirmed FEEDS_ACK?"**  
→ Check in at 30-min mark. If still pending at 1 hour, escalate to @Margaret.

**"Can I change task assignments mid-day?"**  
→ Yes! If blocker appears, shift to backup task. Update @Margaret in next sync packet.

---

**Last Updated:** May 21, 2026  
**Version:** 1.0  
**Status:** Ready for Daily Use
