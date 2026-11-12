# White Caves — Local Development Environment Setup Guide

> **Document**: `LOCAL-DEV-ENVIRONMENT-SETUP.md`
> **Version**: `1.1.0`
> **Last Updated**: `2026-11-13`
> **Author**: AEGIS Sovereign Orchestrator
> **Purpose**: Complete disaster recovery guide to rebuild the White Caves local development environment from scratch on a new laptop or after a system wipe.

---

## 1. Prerequisites

### Software Requirements

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v22 LTS` | Runtime for Frontend, Server, and AEGIS toolchains |
| **Git** | Latest | Version control |
| **VS Code / Antigravity** | Latest | IDE with multi-root workspace support |
| **Cloudflare `cloudflared`** | Latest | Tunnel to expose local server to the internet |
| **MongoDB** | `7.x` or **MongoDB Atlas** | Database engine |
| **Docker** (optional) | Latest | Containerized MongoDB or production builds |

### GitHub Repositories

| Repository | URL | Purpose |
| :--- | :--- | :--- |
| **White-Caves-Frontend** | `https://github.com/arslan9024/White-Caves-Frontend.git` | React/Vite/Tailwind CRM frontend, deployed to **Vercel** |
| **White-Caves-Server** | `https://github.com/arslan9024/White-Caves-Server.git` | Express/Prisma/WebSocket backend, runs on **Laptop via Cloudflare Tunnel** |
| **Aegis-Sterling** | `https://github.com/arslan9024/Aegis-Sterling.git` | Sovereign AI Orchestrator Core, multi-agent squads, protocol matrices, and knowledge base |

### Accounts & Services

| Service | Purpose |
| :--- | :--- |
| **Vercel** | Frontend hosting & automatic deployments on push |
| **Cloudflare** | DNS management + Tunnel for laptop-hosted backend |
| **MongoDB Atlas** | Cloud-hosted MongoDB (or run locally) |
| **GitHub** | Source code hosting, CI/CD via GitHub Actions |

---

## 2. Master Directory Structure

```text
C:\Users\<USERNAME>\Documents\antigravity\
│
├── White-Caves\                           <-- 🏢 Master Company Folder (NOT a Git repo)
│   │
│   ├── White-Caves-Frontend\              <-- 🌐 [Git Repo A] -> Vercel
│   │   ├── src\                           <-- React components, pages, Redux store
│   │   ├── public\                        <-- Static assets, favicon, manifest
│   │   ├── .agents\                       <-- AEGIS runtime configs, skills, docs
│   │   ├── .github\                       <-- GitHub Actions workflows
│   │   ├── vite.config.js                 <-- Vite build configuration
│   │   ├── vercel.json                    <-- Vercel deployment settings
│   │   ├── tsconfig.json                  <-- TypeScript configuration
│   │   ├── package.json                   <-- Frontend-only dependencies
│   │   └── index.html                     <-- SPA entry point
│   │
│   ├── White-Caves-Server\                <-- ⚙️ [Git Repo B] -> Laptop / Cloudflare
│   │   ├── server\                        <-- Express routes, controllers, middleware
│   │   │   ├── bootstrap\                 <-- Server lifecycle, auth, middleware init
│   │   │   ├── config\                    <-- CORS, env, connection pool, pagination
│   │   │   ├── controllers\               <-- REST API controllers (leads, properties, leases)
│   │   │   ├── middleware\                <-- RBAC, KYC, audit logging, CSRF, auth
│   │   │   ├── routes\                    <-- Express route declarations
│   │   │   ├── services\                  <-- Business logic, AI, WhatsApp engines
│   │   │   ├── models\                    <-- Legacy Mongoose models (DEPRECATED -> Prisma)
│   │   │   └── websocket\                 <-- Realtime WebSocket channels
│   │   ├── prisma\                        <-- MongoDB Prisma schema, seeds, migrations
│   │   │   ├── schema.prisma              <-- Single source of truth for DB models
│   │   │   ├── seed.ts                    <-- Development seed data
│   │   │   └── migrations\                <-- Schema migration history
│   │   ├── scripts\                       <-- Cloudflare tunnel, watchdog, validation
│   │   │   ├── start-tunnel.ps1           <-- Cloudflare Tunnel runner
│   │   │   └── server-watchdog.ps1        <-- Auto-restart on crash
│   │   ├── k8s\                           <-- Kubernetes deployment manifests
│   │   ├── helm\                          <-- Helm chart for orchestrated deployments
│   │   ├── prometheus\                    <-- Monitoring & alerting rules
│   │   ├── Dockerfile.prod                <-- Production container build
│   │   ├── nginx.conf                     <-- Reverse proxy configuration
│   │   ├── nginx.prod.conf                <-- Production nginx config
│   │   ├── nodemon.json                   <-- Dev hot-reload configuration
│   │   ├── tsconfig.json                  <-- Server TypeScript configuration
│   │   └── package.json                   <-- Backend-only dependencies
│   │
│   ├── Aegis-Sterling\                    <-- 🛡️ [Git Repo C] -> AEGIS AI Orchestrator Core
│   │   ├── core\                          <-- Autonomous agent loop & runtime engine
│   │   ├── engines\                       <-- Specialized intelligence engines
│   │   ├── extensions\                    <-- Copilot, IDE & tooling extensions
│   │   ├── knowledge\                     <-- Vector corpora, real estate rules, DLD/RERA SOPs
│   │   ├── projects\                      <-- Multi-wave tracking & delivery manifests
│   │   ├── shared\                        <-- Shared contracts, types & utilities
│   │   ├── squads\                        <-- Departmental multi-agent workforce definitions
│   │   └── README.md                      <-- Aegis-Sterling sovereign architecture docs
│   │
│   ├── White-Caves-Mobile\                <-- 📱 [Git Repo D] Future Mobile App (React Native/Flutter)
│   │
│   ├── secrets\                           <-- 🔐 Central Secrets Vault (Git-Ignored)
│   │   ├── .env                           <-- Master environment variables
│   │   ├── database.env                   <-- MongoDB connection strings
│   │   ├── firebase.env                   <-- Firebase service account keys
│   │   ├── google.env                     <-- Google OAuth & API credentials
│   │   ├── linda-bot.env                  <-- WhatsApp Linda bot credentials
│   │   ├── crm.env                        <-- CRM-specific API keys
│   │   ├── meta-cloud.env                 <-- Meta Cloud API (WhatsApp Business)
│   │   ├── goraha-key.json                <-- Google service account key
│   │   └── README.md                      <-- Secrets documentation
│   │
│   ├── .gitignore                         <-- 🛡️ Protects secrets/ from any accidental commit
│   └── White-Caves.code-workspace         <-- 🚀 Master multi-root workspace file (joins all repos)
│
└── silly-borg\                            <-- ⚡ Independent project (separate)
```

---

## 3. Step-by-Step Setup on a New Laptop

### Step 1: Install Prerequisites

```powershell
# Install Node.js 22 LTS (via official installer or nvm-windows)
winget install OpenJS.NodeJS.LTS

# Install Git
winget install Git.Git

# Install Cloudflare Tunnel
winget install Cloudflare.cloudflared

# Install VS Code or Antigravity IDE
winget install Google.Antigravity
```

### Step 2: Configure Git Identity

```bash
git config --global user.name "Arslan Malik"
git config --global user.email "53433036+arslan9024@users.noreply.github.com"
```

### Step 3: Create the Master Directory Structure

```powershell
# Create the master company folder
New-Item -ItemType Directory -Path "C:\Users\$env:USERNAME\Documents\antigravity\White-Caves" -Force

# Create the central secrets vault
New-Item -ItemType Directory -Path "C:\Users\$env:USERNAME\Documents\antigravity\White-Caves\secrets" -Force

# Create the mobile app placeholder
New-Item -ItemType Directory -Path "C:\Users\$env:USERNAME\Documents\antigravity\White-Caves\White-Caves-Mobile" -Force
```

### Step 4: Clone the Repositories

```powershell
cd "C:\Users\$env:USERNAME\Documents\antigravity\White-Caves"

# 1. Clone Frontend
git clone https://github.com/arslan9024/White-Caves-Frontend.git

# 2. Clone Backend Server
git clone https://github.com/arslan9024/White-Caves-Server.git

# 3. Clone Aegis-Sterling (AI Orchestrator)
git clone https://github.com/arslan9024/Aegis-Sterling.git
```

### Step 5: Install Dependencies

```powershell
# Frontend dependencies
cd White-Caves-Frontend
npm install

# Backend dependencies
cd ..\White-Caves-Server
npm install

# Generate Prisma Client
npx prisma generate
```

### Step 6: Restore Secrets

> [!CAUTION]
> Secrets are **never** stored in Git. You must manually restore them from your secure backup (password manager, encrypted USB, or cloud vault).

Copy your backed-up secret files into `C:\...\White-Caves\secrets\`:

- `.env` — Master environment variables
- `database.env` — MongoDB connection string (`DATABASE_URL`)
- `firebase.env` — Firebase credentials
- `google.env` — Google OAuth keys
- `linda-bot.env` — WhatsApp bot credentials
- `goraha-key.json` — Google service account

### Step 7: Create the Root .gitignore

```powershell
@"
# Root Ignore (Central Directory)
secrets/
*.env
*.env.local
node_modules/
.DS_Store
Thumbs.db
dist/
build/
coverage/
*.log
"@ | Out-File -FilePath "C:\Users\$env:USERNAME\Documents\antigravity\White-Caves\.gitignore" -Encoding utf8
```

### Step 8: Open the Multi-Root Workspace

Double-click or open via IDE:
```
C:\Users\<USERNAME>\Documents\antigravity\White-Caves\White-Caves.code-workspace
```

This loads **🌐 Frontend**, **⚙️ Server**, **🛡️ Aegis-Sterling**, and **📱 Mobile** side-by-side in your editor.

---

## 4. Running the Development Environment

### Start the Backend Server

```powershell
cd White-Caves-Server
npm run dev
```

Server runs on `http://localhost:5000`.

### Start the Cloudflare Tunnel

```powershell
cd White-Caves-Server
npm run tunnel:start
```

This maps `https://api.yourdomain.com` → `http://localhost:5000`.

### Start the Frontend Dev Server

```powershell
cd White-Caves-Frontend
npm run dev
```

Frontend runs on `http://localhost:5173` with Vite HMR.

### Environment Variable Linking

The Frontend connects to the Backend via this environment variable in `.env.local`:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 5. Deployment Topology

```text
┌─────────────────────────┐
│   Developer Laptop      │
│                         │
│  ┌───────────────────┐  │
│  │ White-Caves-Server │  │     Cloudflare Tunnel
│  │ localhost:5000     │──│──────────────────────────► https://api.yourdomain.com
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ Aegis-Sterling     │  │     Local Sovereign AI Engine
│  │ Orchestrator Mesh │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ MongoDB            │  │     (Local Docker or MongoDB Atlas Cloud)
│  │ localhost:27017    │  │
│  └───────────────────┘  │
└─────────────────────────┘

┌─────────────────────────┐
│   Vercel Edge CDN       │
│                         │
│  ┌───────────────────┐  │     Git Push triggers auto-deploy
│  │ White-Caves-       │  │
│  │ Frontend           │──│──────────────────────────► https://app.whitecaves.ae
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## 6. Key Architecture Decisions (Reference)

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| **Monorepo vs Multi-Repo** | Multi-Repo | Frontend deploys to Vercel; Backend runs on laptop; Aegis-Sterling governs AI mesh. Separate repos = zero merge conflicts, independent CI/CD, faster builds. |
| **ORM** | Prisma (Primary) | 180+ controllers already using Prisma. Auto-generated TypeScript types. Mongoose is deprecated and marked for removal. |
| **Database** | MongoDB | Schema defined in `prisma/schema.prisma` with `provider = "mongodb"`. |
| **Backend Hosting** | Laptop + Cloudflare Tunnel | Zero cloud hosting cost. WhatsApp bots, WebSockets, and long-running cron jobs need persistent processes that Vercel serverless cannot support. |
| **Frontend Hosting** | Vercel | Automatic deploys on `git push`, global CDN, zero-config for Vite/React. |
| **AI Orchestration** | Aegis-Sterling Repo | Independent repository for autonomous agent mesh, prompt matrix, and real estate knowledge bases. |
| **Secrets Management** | Central `secrets/` folder at root | Single source of truth shared by Frontend and Server. Git-ignored at every level. |
| **Workspace** | VS Code / Antigravity Multi-Root `.code-workspace` | All repos visible in one editor window with independent Git tracking per folder. |

---

## 7. Checklist for New Laptop Setup

- [ ] Install Node.js 22 LTS, Git, Cloudflare `cloudflared`
- [ ] Configure Git identity (`user.name`, `user.email`)
- [ ] Create master folder structure (`White-Caves/`)
- [ ] Clone `White-Caves-Frontend` from GitHub
- [ ] Clone `White-Caves-Server` from GitHub
- [ ] Clone `Aegis-Sterling` from GitHub
- [ ] Run `npm install` in Frontend and Server repos
- [ ] Run `npx prisma generate` in Server repo
- [ ] Restore `secrets/` folder from secure backup
- [ ] Create root `.gitignore`
- [ ] Open `White-Caves.code-workspace`
- [ ] Verify Frontend dev server starts (`npm run dev`)
- [ ] Verify Backend server starts (`npm run dev`)
- [ ] Verify Cloudflare Tunnel connects (`npm run tunnel:start`)
- [ ] Verify Frontend can reach Backend API via tunnel URL
