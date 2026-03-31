# Deployment Runbook — White Caves CRM Platform

> **Document ID:** WC-OPS-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Audience:** DevOps engineers, lead developers, on-call engineers

---

## 1. Overview

This runbook covers all deployment procedures for the White Caves CRM Platform: environment setup, routine deployments, hotfix deployments, rollbacks, and database migrations.

**Environments:**

| Environment | URL | Database | Deploy Trigger |
|-------------|-----|---------|----------------|
| Development | localhost | MongoDB local / Atlas Dev | Manual (`npm run dev`) |
| Staging | staging.whitecaves.ae | Atlas Staging cluster | Auto on PR merge to `main` |
| Production | whitecaves.ae | Atlas Production cluster | Manual (release tag push) |

---

## 2. Prerequisites

### Required Access
- GitHub repository access (write)
- Vercel account (frontend deployment)
- Railway/Render/AWS ECS access (API deployment)
- MongoDB Atlas access (admin — for migrations only)
- Environment variables for all three environments

### Required Tools
```bash
node --version   # Must be 20.x LTS
npm --version    # Must be 9.x+
git --version    # Any recent version
vercel --version # Vercel CLI: npm install -g vercel
```

---

## 3. Environment Variables

All deployments require the following environment variables set in the hosting platform (never in code).

### Backend (API Server)
```env
# Database
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>

# Authentication
JWT_SECRET=<256-bit random string — minimum 32 chars>

# Firebase Admin
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_PRIVATE_KEY=<private-key — with newlines escaped as \n>
FIREBASE_CLIENT_EMAIL=<service-account@project.iam.gserviceaccount.com>

# WhatsApp Cloud API
WHATSAPP_API_TOKEN=<Meta system user token>
WHATSAPP_PHONE_NUMBER_ID=<phone number ID from Meta dashboard>
WHATSAPP_WEBHOOK_SECRET=<HMAC secret — matches Meta dashboard>

# Email
SENDGRID_API_KEY=<sendgrid-api-key>
SMTP_FROM_EMAIL=noreply@whitecaves.ae
SMTP_FROM_NAME=White Caves Real Estate

# Payments
STRIPE_SECRET_KEY=<sk_live_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>

# Exchange Rate
EXCHANGE_RATE_API_KEY=<api-key>

# Application
NODE_ENV=production
PORT=3001
API_URL=https://api.whitecaves.ae

# Optional: Logging level
LOG_LEVEL=info
```

### Frontend (Vite build-time variables)
```env
VITE_API_URL=https://api.whitecaves.ae
VITE_FIREBASE_API_KEY=<firebase-web-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_STRIPE_PUBLISHABLE_KEY=<pk_live_...>
```

---

## 4. Routine Deployment Procedure

### 4.1 Frontend Deployment (Vercel)

**Automatic (recommended):**
1. Merge feature branch PR to `main`
2. Vercel auto-deploys to staging (preview URL per PR)
3. For production: push a release tag (`git tag v1.x.x && git push --tags`)
4. Vercel auto-promotes staging to production on tag

**Manual (if needed):**
```bash
cd /path/to/repo
git pull origin main
npm ci
npm run build
vercel deploy --prod   # Requires Vercel CLI + auth
```

### 4.2 Backend API Deployment (Railway/Render)

**Railway (recommended):**
1. Railway auto-deploys when `main` branch is updated
2. For production: use Railway's promote-to-production feature from staging
3. Monitor deployment logs in Railway dashboard

**Manual Docker deployment:**
```bash
# Build image
docker build -t whitecaves-api:latest .

# Tag and push to container registry
docker tag whitecaves-api:latest registry.example.com/whitecaves-api:v1.x.x
docker push registry.example.com/whitecaves-api:v1.x.x

# Deploy (update ECS service or equivalent)
aws ecs update-service --cluster whitecaves-prod --service api --force-new-deployment
```

### 4.3 Database Migration

Run Prisma migrations **before** deploying new application code that requires them:

```bash
# On local/staging — preview migration
npx prisma migrate dev --name <migration-name>

# On production (CI pipeline or admin console)
npx prisma migrate deploy

# Verify migration applied
npx prisma migrate status
```

⚠️ **IMPORTANT:** Always run migrations in a maintenance window if they involve column renames, drops, or large data transformations.

---

## 5. Hotfix Deployment Procedure

For critical bugs that must be patched immediately (P1 issues):

```bash
# 1. Create hotfix branch from the production tag
git checkout -b hotfix/v1.x.x-description v1.x.x

# 2. Make the minimal necessary fix
# ... edit files ...

# 3. Commit
git add .
git commit -m "fix: <description of the fix>"

# 4. Run tests locally
npm test

# 5. Create pull request to main AND merge to staging for smoke test
# ... create PR ...

# 6. After staging smoke test passes, tag and push
git tag v1.x.x+1
git push origin hotfix/v1.x.x-description --tags

# 7. Production auto-deploys from new tag
# 8. Monitor production for 30 minutes post-deploy
# 9. Close incident if stable
```

---

## 6. Rollback Procedure

### Frontend Rollback (Vercel)
```bash
# Option 1: Vercel dashboard → Deployments → select previous → Promote to Production
# Option 2: CLI
vercel rollback   # Reverts to previous deployment
```

### Backend API Rollback
```bash
# Option 1: Railway/Render dashboard → previous deployment → Redeploy

# Option 2: Docker
docker pull registry.example.com/whitecaves-api:<previous-tag>
# Redeploy previous image version via ECS/deployment platform

# Verify health after rollback
curl https://api.whitecaves.ae/health
```

### Database Rollback
⚠️ Database rollbacks are high-risk. Prefer forward-fix when possible.

```bash
# If migration must be rolled back (only for additive migrations)
npx prisma migrate resolve --rolled-back <migration-name>

# For destructive rollbacks, use point-in-time restore from Atlas backup
# MongoDB Atlas → Cluster → ... → Restore → Point in Time
# RTO: ~30 minutes; RPO: up to 1 hour
```

---

## 7. Deployment Verification Steps

After every production deployment:

```bash
# 1. Health check
curl -f https://api.whitecaves.ae/health
# Expected: {"status":"ok","db":"connected"}

# 2. Authentication check
curl -X POST https://api.whitecaves.ae/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@whitecaves.ae","password":"..."}'
# Expected: 200 with token

# 3. Properties endpoint
curl https://api.whitecaves.ae/api/properties?pageSize=3 \
  -H "Authorization: Bearer <token>"
# Expected: 200 with data array

# 4. Frontend loads
curl -f https://whitecaves.ae
# Expected: 200 HTML with <div id="root">

# 5. Monitor error rate for 15 minutes in observability dashboard
```

---

## 8. Scheduled Maintenance Window

- **When:** Every Sunday 02:00–04:00 UAE time (UTC+4)
- **Notification:** 48 hours before maintenance via WhatsApp broadcast to team
- **Tasks:** Database migrations, OS updates, certificate renewals, dependency updates
- **Rollback window:** 30 minutes after maintenance end

---

## 9. Contacts and Escalation

| Role | Contact | When to Call |
|------|---------|-------------|
| Lead Developer | [Name] | All deployments, technical issues |
| DevOps / Hosting | [Name/Provider support] | Infrastructure failures |
| MongoDB Atlas Support | support@mongodb.com | Database cluster issues |
| Vercel Support | vercel.com/support | Frontend deployment issues |
| Meta (WhatsApp) | developers.facebook.com | WhatsApp API outages |
| Managing Director | [Name] | P1 business impact |

---

**Document ID:** WC-OPS-001 | **Version:** 1.0 | **Date:** March 2026
