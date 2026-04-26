# Disaster Recovery Plan — White Caves Real Estate CRM

> **Last Updated:** April 2026
> **Version:** 1.0
> **Classification:** Internal — Confidential
> **Document Owner:** Engineering & Operations
> **Review Cadence:** Quarterly

---

## 1. Purpose & Scope

This document defines the disaster recovery (DR) strategy for the White Caves Real Estate CRM platform. It covers all production systems including the web application, API layer, database, caching layer, third-party integrations (WhatsApp, Firebase, Stripe), and associated data.

### In Scope

- MongoDB Atlas primary database (all 17 collections)
- Redis caching layer
- Vercel application deployment (frontend + serverless API)
- WhatsApp integration sessions (Nadia, Nina, Linda)
- Firebase Authentication state
- Stripe payment processing continuity
- DNS and SSL certificates
- Kubernetes / Docker infrastructure (alternative deployment)

### Out of Scope

- Third-party SaaS platform outages beyond our control (e.g., WhatsApp global outage)
- Client-side device failures
- Physical office infrastructure

---

## 2. Recovery Objectives

| Objective | Target | Justification |
|-----------|--------|---------------|
| **RPO** (Recovery Point Objective) | **1 hour** | Maximum acceptable data loss. MongoDB Atlas continuous backup with point-in-time recovery ensures sub-hour RPO. |
| **RTO** (Recovery Time Objective) | **4 hours** | Maximum acceptable downtime. Vercel instant rollback + MongoDB Atlas restore enables recovery within this window. |
| **MTPD** (Maximum Tolerable Period of Disruption) | **8 hours** | Beyond this, manual business processes must activate. |

### Recovery Tiers

| Tier | Systems | RPO | RTO | Priority |
|------|---------|-----|-----|----------|
| **Tier 1 — Critical** | MongoDB Atlas, Express API, Authentication | 1 hour | 2 hours | Highest |
| **Tier 2 — High** | React frontend, Redis cache, Stripe payments | 1 hour | 4 hours | High |
| **Tier 3 — Medium** | WhatsApp bots (Nadia/Nina/Linda), email notifications | 4 hours | 8 hours | Medium |
| **Tier 4 — Low** | Analytics dashboards, reporting, saved searches | 24 hours | 24 hours | Low |

---

## 3. Backup Strategy

### 3.1 MongoDB Atlas Backups

| Backup Type | Frequency | Retention | Storage |
|-------------|-----------|-----------|---------|
| **Continuous Backup** | Real-time oplog | 7 days (point-in-time) | Atlas Cloud |
| **Daily Snapshot** | Every 24 hours at 02:00 UTC | 30 days | Atlas Cloud |
| **Weekly Snapshot** | Every Sunday 02:00 UTC | 12 weeks | Atlas Cloud |
| **Monthly Snapshot** | 1st of month 02:00 UTC | 12 months | Atlas Cloud + offsite |
| **Manual Export** | Before major deployments | Indefinite | Encrypted S3 bucket |

**Point-in-Time Recovery:** Atlas continuous backup allows restoration to any second within the 7-day retention window, achieving sub-minute RPO for database tier.

### 3.2 Redis Cache

Redis is treated as ephemeral. No backup is performed. Cache is rebuilt on application startup from MongoDB data.

- **Recovery:** Cold restart populates cache through lazy-loading
- **Impact of loss:** Temporary performance degradation (< 30 minutes)
- **Docker volume:** `redis-data` persists across container restarts for warm cache

### 3.3 Application Code & Configuration

| Asset | Backup Method | Location |
|-------|--------------|----------|
| Source code | Git (GitHub) | GitHub repository with branch protection |
| Environment variables | Vercel encrypted secrets | Vercel dashboard + encrypted vault |
| Kubernetes secrets | Sealed Secrets / SOPS | Git repository (encrypted) |
| Docker images | Container registry | GitHub Container Registry |
| SSL certificates | cert-manager (auto-renewal) | Let's Encrypt + K8s secrets |
| Prisma schema | Git-versioned | `prisma/schema.prisma` |

### 3.4 Third-Party Service Data

| Service | Backup Responsibility | Recovery Method |
|---------|----------------------|-----------------|
| Firebase Auth | Google Cloud (managed) | Firebase Admin SDK export/import |
| Stripe | Stripe (managed) | API-based reconciliation |
| WhatsApp sessions | Local authentication state | Re-authentication via QR scan (Linda) |

---

## 4. Disaster Scenarios & Failover Procedures

### 4.1 Scenario: MongoDB Atlas Outage

**Detection:** Health check endpoint `/health` returns database connection failure; Atlas alerts trigger.

**Procedure:**

1. **Immediate (0–15 min):** Confirm outage via Atlas status page and internal monitoring
2. **Triage (15–30 min):** Determine scope — single node, replica set, or regional outage
3. **Failover (30 min–2 hours):**
   - Atlas automatic failover promotes secondary to primary (< 30 seconds for replica set)
   - If regional outage: initiate cross-region restore from latest snapshot
   - Enable application-level read-only mode via feature flag
4. **Recovery (2–4 hours):** Restore from point-in-time backup to new cluster if necessary
5. **Validation:** Run data integrity checks against last known good transaction IDs

### 4.2 Scenario: Vercel Platform Outage

**Detection:** Uptime monitoring alerts; users report inaccessibility.

**Procedure:**

1. **Immediate (0–15 min):** Confirm via Vercel status page
2. **Failover (15 min–1 hour):**
   - Update DNS to point to fallback Docker/Kubernetes deployment
   - Deploy latest Docker image: `docker-compose -f docker-compose.prod.yml up -d`
   - Verify Nginx reverse proxy routes traffic correctly
3. **Communication:** Notify users via email and WhatsApp broadcast
4. **Recovery:** Revert DNS when Vercel resumes; verify deployment parity

### 4.3 Scenario: Redis Cache Failure

**Detection:** Application logs show Redis connection errors; response times spike.

**Procedure:**

1. Application automatically falls back to direct MongoDB queries (graceful degradation built into cache middleware)
2. Restart Redis container: `docker restart white-caves-redis`
3. If persistent: provision new Redis instance, update `REDIS_URL` environment variable
4. Cache rebuilds automatically through lazy-loading patterns

### 4.4 Scenario: WhatsApp Integration Failure

**Detection:** Linda health endpoint `/api/linda/health` returns disconnected status; Nadia webhook delivery failures.

**Procedure:**

1. **Nadia (Cloud API):** Check Meta Business Suite for API status; verify webhook URL and token
2. **Linda (Local Client):** Re-authenticate WhatsApp session via QR code scan
3. **Nina (AI Engine):** Restart intent classification service
4. **Fallback:** Route incoming messages to manual agent queue; activate SMS fallback channel
5. **Communication:** Inform agents via dashboard notification

### 4.5 Scenario: Firebase Authentication Outage

**Detection:** Login failures spike; Firebase status dashboard shows degradation.

**Procedure:**

1. JWT tokens already issued remain valid for 7-day expiry window
2. Disable new social login flows; enable email/password-only authentication via local JWT
3. Existing sessions continue functioning without Firebase dependency
4. Monitor Firebase status; re-enable social auth when restored

### 4.6 Scenario: Complete Infrastructure Failure

**Detection:** All monitoring systems report failures simultaneously.

**Procedure:**

1. **Activate war room** — Engineering lead, DevOps, and stakeholders
2. **Assess scope** — ISP, cloud provider, or internal misconfiguration
3. **Deploy to alternate region:**
   - Provision new MongoDB Atlas cluster in alternate region (eu-west-1 or ap-south-1)
   - Restore from latest offsite backup
   - Deploy application via Docker Compose on alternate cloud provider
   - Update DNS records (TTL should be pre-set to 300 seconds)
4. **Target recovery:** 4 hours maximum
5. **Post-recovery:** Full data reconciliation and integrity audit

---

## 5. Communication Plan

### 5.1 Internal Escalation Matrix

| Severity | Response Time | Notification Channel | Escalation |
|----------|-------------|---------------------|------------|
| **P1 — Critical** (full outage) | 15 minutes | Phone + WhatsApp group | Engineering Lead → CTO → CEO |
| **P2 — Major** (partial outage) | 30 minutes | WhatsApp group + Email | Engineering Lead → CTO |
| **P3 — Minor** (degraded) | 1 hour | Email + Slack | On-call engineer → Engineering Lead |
| **P4 — Low** (cosmetic) | 4 hours | Ticket system | Standard sprint process |

### 5.2 External Communication

| Audience | Channel | Timing | Template |
|----------|---------|--------|----------|
| Active agents | Dashboard banner + WhatsApp | Within 30 min of P1/P2 | "Service Disruption Notice" |
| Landlords & tenants | Email notification | Within 1 hour of P1 | "Service Update" |
| RERA / regulatory | Formal written notice | Within 24 hours if data affected | Compliance template |
| General public | Status page | Continuous updates | Automated status page |

### 5.3 Status Page

Maintain a public status page at `status.whitecaves.ae` displaying:

- Current system status (Operational / Degraded / Major Outage)
- Individual component status (API, Database, WhatsApp, Payments)
- Incident timeline with updates every 30 minutes during active incidents
- Historical uptime metrics

---

## 6. Dubai Real Estate Compliance During Outages

### 6.1 RERA Compliance Continuity

The Dubai Real Estate Regulatory Agency (RERA) mandates specific compliance obligations that must be maintained even during system outages:

| Obligation | Normal Process | DR Fallback |
|------------|---------------|-------------|
| **Transaction records** | Digital in MongoDB | Paper-based forms; data entry upon recovery |
| **Ejari registration** | API integration | Manual Ejari portal submission |
| **Agent licensing** | System-tracked expiry | Spreadsheet tracking during outage |
| **Commission disclosure** | Automated in CRM | Manual disclosure documentation |
| **DLD fee collection** | Stripe integration | Manual bank transfer with receipt |
| **Tenancy contract registration** | Digital lease management | Manual contract filing |

### 6.2 Business Continuity Measures

1. **Paper-based fallback forms** are maintained for lead capture, viewing schedules, and offer documentation
2. **Agent mobile phones** retain WhatsApp chat history independent of CRM
3. **Monthly compliance data export** stored in encrypted offsite backup ensures regulatory data availability
4. **Designated compliance officer** maintains manual RERA reporting capability
5. **Bank account access** independent of CRM for emergency commission disbursements

---

## 7. DR Testing Schedule

### 7.1 Test Calendar

| Test Type | Frequency | Duration | Participants |
|-----------|-----------|----------|-------------|
| **Tabletop Exercise** | Quarterly | 2 hours | Engineering + Operations + Management |
| **Database Restore Test** | Monthly | 1 hour | DBA + DevOps |
| **Failover Simulation** | Bi-annually | 4 hours | Full engineering team |
| **Full DR Drill** | Annually | 8 hours | All departments |
| **Backup Verification** | Weekly (automated) | 15 minutes | Automated + DevOps review |

### 7.2 Test Procedures

**Monthly Database Restore Test:**

1. Select a random point-in-time within the last 7 days
2. Restore to a staging cluster
3. Run data integrity validation scripts
4. Compare record counts against production
5. Verify all 17 collections restored correctly
6. Document restoration time and any anomalies
7. Destroy test cluster

**Bi-Annual Failover Simulation:**

1. Simulate Vercel outage by blocking DNS resolution
2. Execute DNS failover to Docker/K8s deployment
3. Verify all API endpoints respond correctly
4. Test WhatsApp webhook routing to backup URL
5. Measure actual RTO against 4-hour target
6. Document findings and update procedures

---

## 8. Data Restoration Procedures

### 8.1 MongoDB Atlas Point-in-Time Restore

```
1. Navigate to Atlas Console → Clusters → Backup → Restore
2. Select "Point in Time" restore type
3. Choose target timestamp (within 7-day continuous backup window)
4. Select destination: same cluster (overwrite) or new cluster
5. Initiate restore — estimated time: 30 minutes per 10 GB
6. Update DATABASE_URL if restoring to new cluster
7. Run prisma db push to verify schema alignment
8. Validate data integrity across all 17 collections
```

### 8.2 Snapshot Restore

```
1. Atlas Console → Clusters → Backup → Snapshots
2. Select desired snapshot (daily/weekly/monthly)
3. Choose restore target cluster
4. Initiate restore
5. Apply oplog entries from snapshot time to target time (if needed)
6. Verify indexes are rebuilt (90+ indexes across all collections)
```

### 8.3 Application Rollback

```
1. Vercel Dashboard → Deployments → select last known good deployment
2. Click "Promote to Production" for instant rollback
3. Alternative: git revert to last stable tag, push to trigger redeploy
4. For K8s: kubectl rollout undo deployment/white-caves-app
5. Verify /health endpoint returns 200
6. Confirm all API routes respond correctly
```

### 8.4 Post-Restoration Validation Checklist

- [ ] All 17 MongoDB collections present with correct document counts
- [ ] User authentication functional (JWT + Firebase)
- [ ] Property listings load correctly with images
- [ ] Lead management CRUD operations working
- [ ] WhatsApp integration connected (Linda health check green)
- [ ] Transaction records match pre-disaster state
- [ ] Commission calculations accurate
- [ ] Lease and tenant data intact
- [ ] Redis cache rebuilt and serving requests
- [ ] Rate limiting functional
- [ ] RBAC permissions enforced correctly

---

## 9. Roles & Responsibilities

| Role | Responsibility |
|------|---------------|
| **Incident Commander** | Overall coordination; declares and closes incidents |
| **Engineering Lead** | Technical decision-making; directs recovery actions |
| **DevOps Engineer** | Executes infrastructure recovery procedures |
| **Database Administrator** | Database restore and validation |
| **Security Officer** | Assesses data breach implications; regulatory notification |
| **Communications Lead** | Internal/external stakeholder communication |
| **Compliance Officer** | RERA and UAE PDPL compliance during outage |

---

## 10. Document Maintenance

| Action | Frequency | Owner |
|--------|-----------|-------|
| Full document review | Quarterly | Engineering Lead |
| Contact list update | Monthly | Operations Manager |
| Procedure validation | After each DR test | DevOps Engineer |
| Regulatory compliance update | As regulations change | Compliance Officer |
| Architecture change impact assessment | Per deployment | Engineering Lead |

---

## Appendix A: Emergency Contacts

*Maintained separately in encrypted internal vault. Access restricted to Incident Commander and Engineering Lead.*

## Appendix B: Recovery Runbook Quick Reference

| System | Recovery Command / Action |
|--------|--------------------------|
| Vercel rollback | Vercel Dashboard → Promote previous deployment |
| MongoDB restore | Atlas Console → Backup → Restore (PIT or snapshot) |
| Redis restart | `docker restart white-caves-redis` |
| K8s rollback | `kubectl rollout undo deployment/white-caves-app` |
| DNS failover | Update A record to backup IP (TTL: 300s) |
| WhatsApp re-auth | Linda admin panel → Scan QR code |
| SSL renewal | cert-manager auto-renews; manual: `certbot renew` |

---

*This document is reviewed quarterly and after every DR test or significant infrastructure change. All team members with on-call responsibilities must read and acknowledge this document annually.*
