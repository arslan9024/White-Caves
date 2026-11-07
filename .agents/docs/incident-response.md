# Incident Response Plan — White Caves CRM Platform

> **Document ID:** WC-IRP-001  
> **Version:** 1.0  
> **Date:** March 2026

---

## 1. Overview

This document defines how to detect, respond to, and recover from system incidents. It ensures rapid, consistent response to minimize business impact.

---

## 2. Incident Severity Levels

| Level | Name | Description | Response Time | Example |
|-------|------|-------------|---------------|---------|
| **P1** | Critical | System fully down or data loss | Acknowledge within 15 min; resolve within 2 hours | Login broken for all users; database unreachable |
| **P2** | High | Core feature non-functional | Acknowledge within 1 hour; resolve within 8 hours | Lead creation failing; WhatsApp inbox not loading |
| **P3** | Medium | Non-critical feature degraded | Resolve within next business day | Export failing; filter not working |
| **P4** | Low | Minor issue / cosmetic | Resolve within next sprint | Wrong label text; alignment issue |

---

## 3. Incident Detection

### Automated Detection (configured in monitoring tools)
- **API error rate** > 1% over 5-minute window → P2 alert
- **API response time** p95 > 3 seconds → P2 alert
- **API health endpoint** failing → P1 alert
- **MongoDB connection failure** → P1 alert
- **CPU usage** > 90% for 5 minutes → P2 alert
- **Memory usage** > 85% for 5 minutes → P2 alert
- **SSL certificate expiry** < 14 days → P2 alert

### Manual Detection
- Business user reports system issue via WhatsApp/phone
- Developer observes error in logs
- CI/CD pipeline failure triggers investigation

---

## 4. Incident Response Workflow

```
[INCIDENT DETECTED]
        │
        ▼
[ACKNOWLEDGE]
│ On-call engineer acknowledges alert within SLA
│ Post in #incidents Slack/WhatsApp channel:
│   "🚨 P[x] INCIDENT — [time] — [brief description]
│    Owner: [your name] — Investigating"
        │
        ▼
[TRIAGE]
│ Confirm the issue is real (not a false positive)
│ Determine severity (P1–P4)
│ For P1/P2: notify Manager/Owner immediately
        │
        ▼
[INVESTIGATE]
│ Check logs (server logs, browser console, MongoDB logs)
│ Check monitoring dashboard (API health, DB metrics)
│ Check recent deployments (was anything deployed in last 2 hours?)
│ Check third-party status pages (Meta, MongoDB Atlas, Vercel)
        │
        ▼
[MITIGATE]
│ Apply immediate workaround if available:
│   - Rollback last deployment (if deployment caused it)
│   - Restart API server (if OOM or deadlock)
│   - Scale up (if capacity issue)
│   - Disable failing feature via feature flag
        │
        ▼
[RESOLVE]
│ Root cause identified and fixed
│ Fix deployed (or scheduled for next business day for P3/P4)
│ Verification: health checks pass, error rate normal
        │
        ▼
[POST-INCIDENT]
│ Update #incidents channel: "✅ RESOLVED — [time] — [resolution summary]"
│ For P1/P2: complete post-mortem within 48 hours
│ For P3/P4: add to known issues list
```

---

## 5. Runbooks for Common Incidents

### INC-001: API Returns 500 for All Requests

**Symptoms:** Health endpoint returns 500; all API calls fail.

**Investigation steps:**
```bash
# Check API server logs
railway logs --service api
# or: kubectl logs <pod> --tail=100

# Check database connection
curl https://api.whitecaves.ae/health

# Check MongoDB Atlas status: cloud.mongodb.com → Alerts
```

**Common causes + fixes:**
1. Database connection string wrong (check `DATABASE_URL` env var)
2. MongoDB Atlas cluster paused (re-activate in Atlas dashboard)
3. Out-of-memory crash (increase container memory or fix memory leak)
4. Bad deployment (rollback to previous version — see deployment-runbook.md)
5. Missing required env variable after config change (check startup logs)

**Escalate to:** Lead Developer if not resolved in 30 minutes

---

### INC-002: Login Not Working for All Users

**Symptoms:** 401 errors from `/api/auth/login`; users cannot access the system.

**Investigation steps:**
```bash
# Test login endpoint manually
curl -X POST https://api.whitecaves.ae/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"known-user@whitecaves.ae","password":"..."}'
```

**Common causes + fixes:**
1. `JWT_SECRET` env variable changed (restore original secret — CRITICAL: changing this invalidates all existing tokens)
2. Firebase credentials expired/rotated (update `FIREBASE_PRIVATE_KEY`)
3. Rate limit triggered (IP blocked — reset rate limit or increase limit temporarily)
4. Database unreachable (see INC-001)

---

### INC-003: WhatsApp Messages Not Delivering

**Symptoms:** Outbound WhatsApp messages not sending; inbound messages not appearing.

**Investigation steps:**
1. Check Meta System Status: metastatus.com
2. Check API token expiry in Meta Business Dashboard
3. Check webhook is registered and receiving events
4. Check `WHATSAPP_API_TOKEN` env var
5. Check `WHATSAPP_PHONE_NUMBER_ID` env var

**Common causes + fixes:**
1. Meta system user token expired (generate new token in Meta Business Suite)
2. Phone number quality rating dropped (check Meta dashboard; resolve by reviewing message quality)
3. Webhook URL changed after deployment (re-register webhook in Meta dashboard)
4. Template messages rejected (submit new templates; use text messages temporarily)

---

### INC-004: Vercel Frontend Returns 404 or Blank Page

**Investigation steps:**
1. Check Vercel deployment status: vercel.com/dashboard
2. Check if latest deployment succeeded
3. Test staging URL to confirm if it's deployment-specific

**Fix:** Re-trigger deployment or roll back via Vercel dashboard.

---

### INC-005: Slow API Response Times (> 3 seconds)

**Investigation steps:**
```bash
# Check MongoDB slow query log (Atlas → Performance Advisor)
# Check API server CPU/memory metrics
# Identify which endpoint is slow (check APM/monitoring)
```

**Common causes + fixes:**
1. Missing database index on a new query (add index in Prisma schema + run migration)
2. N+1 query bug in new code (add `include` to Prisma query or add aggregation)
3. High traffic spike (scale up API containers)
4. MongoDB Atlas tier too small (upgrade cluster tier)

---

## 6. Post-Mortem Template (P1 and P2)

```markdown
# Incident Post-Mortem: [Incident ID]
**Date:** [Date]
**Duration:** [Start time] – [End time] = [X hours Y minutes]
**Severity:** P[1/2]
**Reported by:** [Name]
**Incident owner:** [Name]

## Summary
[2-3 sentence description of what happened]

## Timeline
- [HH:MM] — [Event]
- [HH:MM] — [Event]

## Root Cause
[Technical description of the root cause]

## Impact
- Users affected: [count/percentage]
- Features affected: [list]
- Business impact: [e.g., no new leads could be created for 3 hours]
- Data loss: [Yes/No — description]

## Resolution
[What was done to resolve the incident]

## Action Items
| Action | Owner | Due Date |
|--------|-------|---------|
| | | |

## Lessons Learned
[What did we learn; what will we do differently]
```

---

## 7. Data Breach Incident Response

If a security breach is suspected (unauthorised data access):

1. **CONTAIN**: Immediately revoke all API keys and JWT tokens (rotate `JWT_SECRET`)
2. **ASSESS**: Determine what data was potentially accessed and how many users are affected
3. **NOTIFY UAEDP**: If personal data of UAE residents is involved, notify within **72 hours** (PDPL requirement)
4. **NOTIFY AFFECTED USERS**: If high risk to their rights, notify individuals promptly
5. **DOCUMENT**: Create detailed incident report
6. **REPORT TO RERA**: If real estate transaction data was compromised
7. **LEGAL REVIEW**: Engage legal counsel immediately for any breach involving AML/KYC data

---

**Document ID:** WC-IRP-001 | **Version:** 1.0 | **Date:** March 2026
