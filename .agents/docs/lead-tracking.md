# Lead Tracking & Pipeline Management

**Status**: Production Ready ✅  
**Last Updated**: February 2026  
**Priority**: High  
**Completion**: 100%

---

## Overview

Lead Tracking is the engine that drives the sales process. It transforms prospects into opportunities and tracks them through the complete sales pipeline from initial contact to deal closure.

### Purpose

Provide agents and managers with visibility into the sales pipeline, enabling effective forecasting, opportunity management, and revenue tracking.

### Business Value

- **Pipeline Visibility**: Know where opportunities stand at every moment
- **Sales Forecasting**: Predict revenue based on pipeline stage distribution
- **Efficiency**: Focus efforts on high-value opportunities
- **Accountability**: Track each lead's journey and agent performance
- **Revenue Intelligence**: Understand what converts and what doesn't

---

## User Stories

### Agent Perspective

- **As an** agent, **I want to** add new leads quickly, **so that** I capture opportunities immediately
- **As an** agent, **I want to** see my pipeline of active opportunities, **so that** I prioritize follow-ups
- **As an** agent, **I want to** update lead status as I progress through the sale, **so that** managers know where I am
- **As an** agent, **I want to** see recommended properties for each lead, **so that** I can show relevant options
- **As an** agent, **I want to** track all interactions with a lead, **so that** I remember context for next conversation

### Manager Perspective

- **As a** manager, **I want to** see team pipeline overview, **so that** I can forecast revenue
- **As a** manager, **I want to** drill down into individual pipelines, **so that** I can coach agents
- **As a** manager, **I want to** identify stalled leads, **so that** I can intervene early
- **As a** manager, **I want to** see which agents have lowest conversion rates, **so that** I can provide coaching

### Executive Perspective

- **As an** executive, **I want to** see company-wide pipeline, **so that** I can forecast company revenue
- **As an** executive, **I want to** understand pipeline health, **so that** I can make strategic decisions
- **As an** executive, **I want to** identify bottlenecks, **so that** I can allocate resources effectively

---

## Key Capabilities

### Lead Creation & Management

- **Create** leads from multiple sources (web form, walk-in, referral, import)
- **Capture** lead information automatically
- **Link** leads to clients in system
- **Archive** dead/inactive leads
- **Reopen** archived leads if client reactivates

### Pipeline Management

- **Visual Pipeline**: Kanban board showing leads by stage
- **Drag-and-Drop**: Move leads between stages
- **Stage Tracking**: See how long leads stay in each stage
- **Source Tracking**: Know where each lead came from
- **Conversion Rates**: See conversion % for each stage

### Lead Scoring

- **Automatic Scoring**: Based on engagement and profile
- **Hot/Warm/Cold**: Visual indicators of lead quality
- **AI Recommendations**: Next best action suggestions
- **Priority Ranking**: Most promising leads highlighted
- **Scoring Explanation**: See why lead got its score

### Activity Tracking

- **Log Interactions**: Calls, emails, meetings, messages
- **Schedule Follow-ups**: Set reminders for next action
- **Activity Timeline**: Chronological history of all touchpoints
- **Auto-logging**: Email, call, and message integration
- **Activity Stats**: How many touches per lead per stage

### Lead Qualification

- **Qualification Criteria**: Budget, timeline, motivation
- **BANT Check**: Budget, Authority, Need, Timeline
- **Custom Questions**: Ask qualifying questions
- **Disqualification Reasons**: Track why leads were lost
- **Requalification**: Re-engage disqualified leads

### Status Workflow

```
New Lead (just created)
    ↓
Lead Qualification (BANT assessment)
    ↓
Initial Interest (shows interest, no property yet)
    ↓
Property Viewing (scheduled viewing)
    ↓
Active Negotiation (discussing terms)
    ↓
Offer Submitted (formal offer made)
    ↓
Deal Closed (contract signed)
    ↓
Dead Lead (didn't convert - archived)
```

---

## User Interface

### Lead Pipeline Dashboard

**Screen**: Pipeline Overview  
**Key Elements**:

- **Kanban Board**: Columns for each pipeline stage
- **Lead Cards**: Visual summary of each lead
- **Card Summary**: Lead name, property, value, next action
- **Color Coding**: Hot (red), Warm (yellow), Cold (blue)
- **Metrics**: Count and total value per stage
- **Filter Options**: By agent, source, score, property type

### Lead Detail View

**Screen**: Lead Profile  
**Key Sections**:

- **Lead Info**: Name, contact, source, created date
- **Qualification**: BANT assessment, lead score, quality indicator
- **Timeline**: All interactions chronologically
- **Pipeline Status**: Current stage and time in stage
- **Property Preferences**: Desired locations, types, budget
- **Next Action**: Scheduled follow-up and details
- **Notes**: Internal notes and history

### Lead Creation Form

**Screen**: New Lead  
**Form Sections**:

- **Contact Information**: Name, phone, email, location
- **Lead Source**: Where did this lead come from?
- **Property Preferences**: What are they looking for?
- **Estimated Budget**: What can they spend?
- **Timeline**: When do they need to buy/rent?
- **Initial Notes**: Any relevant context?
- **Interested Properties**: Quick link to relevant listings

### Pipeline Analytics Dashboard

**Screen**: Pipeline Metrics  
**Key Visualizations**:

- **Stage Distribution**: Pie chart of leads per stage
- **Value by Stage**: Revenue forecast by stage
- **Conversion Funnel**: % conversion at each stage
- **Avg Time per Stage**: How long leads typically spend
- **Source Performance**: Which sources convert best
- **Agent Comparison**: Performance relative to team

---

## Business Rules

### Lead Scoring Formula

```
Base Score: 0 points

Engagement Factor (0-30 points):
- 1 interaction: 10 points
- 3+ interactions: 20 points
- Property viewed: 10 points
- Offer submitted: 30 points

Profile Quality (0-40 points):
- Budget confirmed: 10 points
- Timeline clear: 10 points
- Authority to decide: 10 points
- Needs identified: 10 points

Behavior Factor (0-30 points):
- Reached out to us: 10 points
- Repeat interactions: 10 points
- Active in last 30 days: 10 points
- Responded same day: 10 points

TOTAL SCORE: 0-100 points
```

### Stage Duration Guidelines

- **New Lead**: 0-3 days (qualify or disqualify)
- **Initial Interest**: 3-7 days (identify properties)
- **Property Viewing**: 7-14 days (schedule and conduct)
- **Negotiation**: 14-30 days (price discussion)
- **Offer Submitted**: 5-14 days (waiting for decision)
- **Max Duration**: 90 days before archive if no activity

### Disqualification Criteria

A lead is disqualified if:

- Budget is unclear and not provided after 3 requests
- Timeline is 12+ months in the future with no urgency
- Lead becomes unresponsive for 30+ days
- Lead explicitly states they're not proceeding
- Lead has contradictory requirements (impossible match)

### Lead Assignment Rules

- **Auto-assign**: By agent availability and specialization
- **Manual assign**: Manager overrides auto-assignment
- **Transfer**: Can transfer between agents with manager approval
- **Shared**: Team leads can share with team members

---

## Integration Points

### With Other CRM Features

- **Clients**: Leads become clients when they close a deal
- **Properties**: Match leads to properties based on preferences
- **Commissions**: Track commission earned when lead converts
- **Reporting**: Feed into agent and business analytics

### With External Systems

- **Email**: Auto-log emails in timeline
- **Calendar**: Sync scheduled viewings and meetings
- **SMS/WhatsApp**: Track messages in activity timeline
- **Web Forms**: Import leads from website form submissions
- **Homepage Search**: Capture and tag source as `homepage_search` for attribution workflows
- **CRM Sync**: Share data with external CRM if needed

---

## Module Traceability (Phase 23)

- **Primary UI Surface**: `ClaraLeadsCRM_NEW`
- **Primary Flow**: source capture -> qualification -> stage transitions -> close/loss reporting
- **Core Rule**: every lead must retain immutable source attribution and stage-history records

---

## Metrics & KPIs

### Agent Metrics

- **Total Leads**: Count of all leads managed
- **Active Leads**: Leads in active stages (not closed/dead)
- **Conversion Rate**: % of leads that convert to deals
- **Sales Cycle Length**: Days from new lead to closed deal
- **Lead Quality**: % of leads that score 70+

### Pipeline Health Metrics

- **Pipeline Value**: Total $ of all opportunities
- **Stage Distribution**: % of leads in each stage
- **Avg Deal Size**: Average value when deals close
- **Forecast Accuracy**: Actual vs. predicted revenue
- **Velocity**: Leads per month entering pipeline

### Engagement Metrics

- **Avg Interactions per Lead**: Touches before conversion
- **First Response Time**: How quickly agents respond
- **Follow-up Timeliness**: % of follow-ups done on time
- **Engagement Rate**: % of leads with recent activity

---

## FAQ

**Q: Can I see leads from before they joined my team?**  
A: Yes, all historical leads are visible for context. Owned by original agent unless transferred.

**Q: What happens to leads if an agent leaves?**  
A: Leads can be reassigned to another agent. Commission still goes to original agent if they close.

**Q: Can leads be in multiple stages?**  
A: No, each lead is in exactly one stage. Progress through stages as you advance the opportunity.

**Q: How do I identify the most promising leads?**  
A: Sort by Lead Score (highest first) for AI-ranked opportunities. Score 80+ are very hot.

**Q: Can I customize the pipeline stages?**  
A: Contact admin. Standard pipeline is optimized, custom stages require configuration.

**Q: What if a lead comes back after being disqualified?**  
A: You can reactivate archived leads. They restart at "Initial Interest" stage.

---

## Change Log

| Version | Date     | Changes              |
| ------- | -------- | -------------------- |
| 1.0     | Feb 2026 | Initial launch       |
|         |          | Core pipeline stages |
|         |          | Lead scoring         |
|         |          | Activity tracking    |
|         |          | Conversion analytics |
|         |          | Production-ready     |

---

## Next Steps

- ✅ Core features complete
- ⏳ Predictive analytics (Q2 2026)
- ⏳ Mobile lead management (Q2 2026)
- ⏳ AI-powered lead generation (Q3 2026)

---

**For Implementation Details**: See `/plans/ARCHITECTURE.md`  
**For Integration Help**: Contact development team  
**For Questions**: Email product or sales team
