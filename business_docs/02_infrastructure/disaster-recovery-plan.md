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

---

## 11. Detailed Runbooks — Failure Scenarios with Shell Commands

### 11.1 Runbook: MongoDB Atlas Primary Failure

**Trigger:** Atlas primary node becomes unavailable; replica election in progress.
**Expected recovery (Atlas managed):** Automatic failover to secondary within **30 seconds**.

```bash
# Step 1: Detect — verify Atlas cluster state
curl -u "$ATLAS_PUB_KEY:$ATLAS_PRIV_KEY" \
  "https://cloud.mongodb.com/api/atlas/v1.0/groups/$ATLAS_PROJECT_ID/clusters/$CLUSTER_NAME" \
  | jq '.stateName, .mongoDBVersion'

# Step 2: Check replica set status from any connected host
mongosh "$MONGODB_URI" --eval "rs.status()" | grep -E '"name"|"health"|"state"'

# Step 3: If secondary not elected after 2 minutes — force new election
mongosh "$MONGODB_URI" --eval "rs.stepDown(60)"

# Step 4: Verify application reconnect (check API health)
curl -s https://api.whitecaves.ae/api/health | jq '.database'

# Step 5: Post-recovery — verify no data loss
mongosh "$MONGODB_URI" --eval "
  db.transactions.countDocuments({ createdAt: { \$gte: new Date(Date.now() - 3600000) } })
"

# Step 6: Alert stakeholders
# PagerDuty auto-fires; additionally notify #incidents Slack channel
```

**RTO Target:** < 5 minutes (Atlas auto-failover + app reconnect)
**RPO Target:** 0 (synchronous replication to secondary before acknowledgement)

---

### 11.2 Runbook: API Service Failure (All Instances Down)

**Trigger:** `/api/health` returns 5xx or times out; all pods crash-looping.

```bash
# Step 1: Check pod status
kubectl get pods -n whitecaves-prod -l app=whitecaves-api

# Step 2: View crash logs from failed pod
kubectl logs -n whitecaves-prod -l app=whitecaves-api --previous --tail=100

# Step 3: Describe pod for resource/scheduling issues
kubectl describe pod -n whitecaves-prod -l app=whitecaves-api

# Step 4a: If OOMKill — increase memory limit or restart to clear leak
kubectl set resources deployment whitecaves-api \
  -n whitecaves-prod \
  --limits=memory=2Gi --requests=memory=1Gi

# Step 4b: If bad deploy — rollback to last known-good deployment
kubectl rollout undo deployment/whitecaves-api -n whitecaves-prod
kubectl rollout status deployment/whitecaves-api -n whitecaves-prod

# Step 5: Verify recovery
kubectl get pods -n whitecaves-prod -l app=whitecaves-api
curl -s https://api.whitecaves.ae/api/health | jq '.'

# Step 6: If rollback insufficient — redeploy from last tagged production image
kubectl set image deployment/whitecaves-api \
  api=ghcr.io/whitecaves/api:LAST_GOOD_TAG \
  -n whitecaves-prod
```

**RTO Target:** < 15 minutes
**Vercel fallback:** If K8s unavailable, promote Vercel deployment (DNS switch: `api.whitecaves.ae` → Vercel endpoint)

---

### 11.3 Runbook: Redis Cache Failure

**Trigger:** Redis connection errors; session lookups failing; rate limit middleware errors.

```bash
# Step 1: Check Redis connectivity
redis-cli -h $REDIS_HOST -p 6379 -a $REDIS_PASSWORD ping

# Step 2: Check Redis memory and eviction
redis-cli -h $REDIS_HOST INFO memory | grep -E 'used_memory_human|maxmemory_human|mem_fragmentation'
redis-cli -h $REDIS_HOST INFO stats | grep evicted_keys

# Step 3: Graceful degradation — API falls back to in-memory rate limiting
# This is automatic if REDIS_URL unreachable — verify fallback is active:
curl -s https://api.whitecaves.ae/api/health | jq '.redis'

# Step 4: Flush and restart Redis (NON-PROD ONLY — destroys sessions)
redis-cli -h $REDIS_HOST FLUSHALL    # WARNING: clears all sessions

# Step 5: Production — restart Redis pod (data loss acceptable: Redis is ephemeral)
kubectl rollout restart deployment/redis -n whitecaves-prod

# Step 6: Rebuild Redis from MongoDB (WhatsApp session state)
node scripts/rebuild-redis-from-mongo.js --scope=whatsapp_sessions
```

**Note:** Redis failure does NOT cause data loss. It affects: rate limiting (degrades to in-memory), WhatsApp session routing (degrades to DB lookups), and caching (cold cache until rebuilt). MongoDB is the source of truth.

---

### 11.4 Runbook: CDN / Cloudflare Failure

**Trigger:** Cloudflare service disruption; DNS resolution failing; static assets not loading.

```bash
# Step 1: Check Cloudflare status
curl -s https://www.cloudflarestatus.com/api/v2/status.json | jq '.status.description'

# Step 2: Test direct-to-origin (bypass CDN)
curl -I --resolve "whitecaves.ae:443:$ORIGIN_IP" https://whitecaves.ae/ \
  -H "CF-Bypass-Cache: 1"

# Step 3: If Cloudflare down — switch DNS to direct origin (TTL: 60s)
# In Cloudflare DNS: change record type from PROXIED (orange cloud) to DNS-ONLY (grey cloud)
# Update in Cloudflare dashboard OR via API:
curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$CF_RECORD_ID" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"whitecaves.ae","content":"$ORIGIN_IP","proxied":false}'

# Step 4: Verify direct access works
curl -I https://whitecaves.ae/

# Step 5: Monitor Cloudflare status; re-enable proxy when resolved
```

**RTO Target:** < 10 minutes (DNS propagation ~60 seconds with low TTL)

---

### 11.5 Runbook: Database Restore from Backup

```bash
# Step 1: List available Atlas backups
curl -u "$ATLAS_PUB_KEY:$ATLAS_PRIV_KEY" \
  "https://cloud.mongodb.com/api/atlas/v1.0/groups/$ATLAS_PROJECT_ID/clusters/$CLUSTER_NAME/backup/snapshots" \
  | jq '.results[] | {id: .id, createdAt: .createdAt, storageSizeBytes: .storageSizeBytes}'

# Step 2: Initiate Point-in-Time Restore (to specific timestamp)
curl -X POST -u "$ATLAS_PUB_KEY:$ATLAS_PRIV_KEY" \
  "https://cloud.mongodb.com/api/atlas/v1.0/groups/$ATLAS_PROJECT_ID/clusters/$CLUSTER_NAME/backup/restoreJobs" \
  --header "Content-Type: application/json" \
  --data '{
    "deliveryType": "pointInTime",
    "targetClusterName": "'"$RESTORE_CLUSTER_NAME"'",
    "targetGroupId": "'"$ATLAS_PROJECT_ID"'",
    "oplogTs": '"$RESTORE_EPOCH_SECONDS"',
    "oplogInc": 1
  }'

# Step 3: Monitor restore job progress
RESTORE_JOB_ID=<job_id_from_step_2>
while true; do
  STATUS=$(curl -s -u "$ATLAS_PUB_KEY:$ATLAS_PRIV_KEY" \
    "https://cloud.mongodb.com/api/atlas/v1.0/groups/$ATLAS_PROJECT_ID/clusters/$CLUSTER_NAME/backup/restoreJobs/$RESTORE_JOB_ID" \
    | jq -r '.status')
  echo "Restore status: $STATUS"
  [ "$STATUS" = "COMPLETED" ] && break
  sleep 30
done

# Step 4: Verify restored data
mongosh "$RESTORED_CLUSTER_URI" --eval "
  print('Transactions:', db.transactions.countDocuments({}));
  print('Properties:', db.properties.countDocuments({}));
  print('Leads:', db.leads.countDocuments({}));
  print('Users:', db.users.countDocuments({}));
"

# Step 5: Run post-restore integrity checks
node scripts/dr/verify-restore-integrity.js --cluster=$RESTORED_CLUSTER_URI

# Step 6: If verified — cut over traffic to restored cluster
# Update MONGODB_URI env var in Vercel/K8s and redeploy
```

---

## 12. Escalation Contact Tree

### 12.1 On-Call Escalation Chain

| Level | Role | Contact Method | Response SLA |
|-------|------|---------------|-------------|
| **L1** | On-call Engineer | PagerDuty (auto-alert) | 5 minutes |
| **L2** | Backend Lead (@Mira) | WhatsApp + PagerDuty escalation | 15 minutes |
| **L3** | CTO / Chief Architect (@Ada) | WhatsApp + direct call | 30 minutes |
| **L4** | Managing Director | WhatsApp + direct call | 60 minutes |
| **L5** | MongoDB Atlas Support | https://support.mongodb.com (Premier) | Per SLA tier |
| **L5** | Vercel Support | https://vercel.com/support (Pro) | 4 business hours |
| **L5** | Cloudflare Support | https://dash.cloudflare.com/support (Pro) | 4 business hours |

### 12.2 Incident Classification → Escalation

| Severity | Criteria | L1 Action | L2 Escalate If | L3 Escalate If |
|----------|---------|-----------|---------------|----------------|
| **P1** (Critical) | API down; data loss; security breach | Immediate page | Not resolved in 15 min | Not resolved in 30 min |
| **P2** (High) | Degraded performance; partial outage | Alert + investigate | Not resolved in 1 hour | Not resolved in 3 hours |
| **P3** (Medium) | Non-critical feature failure | Ticket + investigate | Not resolved in 1 business day | N/A |

### 12.3 External Vendor Contacts

| Vendor | Service | Contact | Account ID |
|--------|---------|---------|-----------|
| MongoDB Atlas | Database | support.mongodb.com + `security@whitecaves.ae` forwards | Store in 1Password vault |
| Vercel | Hosting | vercel.com/support | Store in 1Password vault |
| Cloudflare | CDN / DNS | dash.cloudflare.com | Store in 1Password vault |
| Meta / WhatsApp | WhatsApp Business API | developers.facebook.com/support | Store in 1Password vault |
| Firebase (Google) | Auth | firebase.google.com/support | Store in 1Password vault |

---

## 13. Dubai Data Centre Requirements

### 13.1 UAE Data Residency Mandate

All personal data, financial records, and AML/KYC data **must remain within the UAE** per:
- **Federal Decree-Law No. 45 of 2021** (PDPL), Article 22: cross-border data transfer requires equivalent protection or Standard Contractual Clauses (SCC)
- **CBUAE AML Guidelines**: financial records must be accessible within UAE jurisdiction
- **RERA**: property transaction records must be maintained within UAE

### 13.2 Data Centre Locations

| Service | Primary Region | DR Region | Notes |
|---------|---------------|----------|-------|
| MongoDB Atlas | **UAE_NORTH** (Abu Dhabi) | **ME_SOUTH_1** (Bahrain) | Bahrain DR requires SCC with MongoDB Inc. |
| Vercel | UAE / Europe-West | Europe-West fallback | Vercel does not guarantee UAE-only for serverless |
| Cloudflare | Global edge (GDPR framework) | — | PII not stored on Cloudflare edge |
| S3 Backup | **me-south-1** (Bahrain) | — | Closest UAE-adjacent AWS region |
| Redis | In-cluster (UAE compute) | Ephemeral — rebuilt from Atlas | No cross-border transfer |

### 13.3 Vercel Compliance Note

Vercel serverless functions may execute in European regions. **PII must not be stored in Vercel function memory beyond the request lifecycle.** The API is stateless; all PII lives in MongoDB Atlas (UAE North) only.

If UAE-only compute is required for regulatory reasons, migrate API to:
1. **AWS UAE region** (`me-central-1`, launched 2022) — EC2/ECS compute
2. **Azure UAE North** (Abu Dhabi) — AKS compute

---

## 14. RERA Notification Requirements During Outages

### 14.1 RERA Notification Obligations

While RERA does not mandate a specific technology SLA, licensed brokers using a CRM must ensure:

| Obligation | Source | Threshold | Action Required |
|-----------|--------|-----------|----------------|
| Ejari system unavailability | RERA circular | Any planned downtime > 4 hours | Notify RERA operations team via official channel |
| DLD API downtime | DLD mandate | Cannot process transactions | Manual paper-based fallback; log all pending transactions |
| Transaction data inaccessibility | RERA | > 24 hours | Report to RERA technology compliance team |
| Tenant data breach | PDPL Art. 44 + RERA | Any breach | TDRA notification within 72 hours; RERA within 24 hours |

### 14.2 Outage Communication Template (RERA)

```
TO: rera.tech@rera.gov.ae
SUBJECT: [White Caves LLC] System Outage Notification — [DATE]
BROKERAGE NAME: White Caves Real Estate LLC
RERA BROKER NO: [RERA Broker Registration Number]
OUTAGE START: [ISO timestamp GST]
AFFECTED SYSTEMS: [CRM / Ejari Integration / DLD Integration]
IMPACT: [Describe: e.g., unable to generate Ejari contracts]
ESTIMATED RESOLUTION: [Time]
PENDING TRANSACTIONS AFFECTED: [Count]
CONTACT: [CTO name, direct mobile]
```

---

## 15. Quarterly DR Drill Calendar — 2026

| Quarter | Date | Type | Scope | Owner | Success Criteria |
|---------|------|------|-------|-------|-----------------|
| Q1 2026 | **March 15, 2026** | MongoDB Atlas failover test | Simulate primary node failure; verify auto-failover < 30s | Backend Lead (@Mira) | [ ] Failover < 30s; [ ] Zero data loss; [ ] App reconnects automatically |
| Q2 2026 | **June 14, 2026** | Full API restore drill | Restore API from last production snapshot to staging; verify all endpoints | DevOps (@Gwynne) | [ ] API restored in < 15 min; [ ] All health checks pass |
| Q3 2026 | **September 13, 2026** | Database PIT restore | Execute Point-in-Time restore to 24 hours ago on isolated cluster; verify data integrity | DBA (@Barbara) | [ ] Restore completes in < 2 hours; [ ] Row counts match expected; [ ] Integrity script passes |
| Q4 2026 | **December 6, 2026** | Full DR simulation (all systems) | Simulate: API down + DB failover + CDN bypass + RERA notification | CTO | [ ] All RTO/RPO targets met; [ ] All runbooks executed without errors; [ ] Post-drill report published within 48 hours |

**DR Drill Process:**
1. Announce drill date 2 weeks in advance in #engineering Slack
2. Execute drill in isolated staging environment where possible
3. For Atlas tests, use test project cluster — never on production Atlas cluster
4. Document results in `docs/dr-drill-results/YYYY-QN.md`
5. Update this runbook with any findings within 5 business days
6. Share summary with CTO + Managing Director

---

*This document is reviewed quarterly and after every DR test or significant infrastructure change. All team members with on-call responsibilities must read and acknowledge this document annually. RERA notification templates must be reviewed with legal counsel annually.*
