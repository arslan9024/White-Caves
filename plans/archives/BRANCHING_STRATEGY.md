# ?? White Caves - Branching Strategy Guide

## Overview

This repository uses a **Development-first Release Flow**.

- Daily coding and commits happen on `development` and short-lived feature branches.
- `main` is production release-only.
- Promotion from `development` to `main` occurs **once per month** in an approved release window.
- No routine direct commits to `main`.

---

## ??? Branch Structure

```
main (production, monthly release-only)
+-- development (daily integration branch)
    +-- feature/*
    +-- fix/*
    +-- refactor/*
    +-- docs/*
    +-- test/*
```

---

## ?? Daily Developer Workflow

1. **Start from development**

   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/add-user-profile
   ```

2. **Commit work to feature branch**

   ```bash
   git add .
   git commit -m "feat: Add user profile component"
   ```

3. **Rebase from development regularly**

   ```bash
   git checkout development
   git pull origin development
   git checkout feature/add-user-profile
   git rebase development
   ```

4. **Create PR to development**
   - PR target: `feature/*` ? `development`
   - Require review and green checks before merge.

5. **Cleanup after merge**
   ```bash
   git checkout development
   git pull origin development
   git branch -d feature/add-user-profile
   ```

---

## ?? Monthly Release Workflow (Only path to main)

1. **Prepare release from development**

   ```bash
   git checkout development
   git pull origin development
   npm run build
   ```

2. **Create monthly release PR**
   - PR target: `development` ? `main`
   - Title format: `Monthly Release: YYYY-MM`
   - Attach release notes + validation evidence.

3. **Required release gates**
   - Type check passes (`npx tsc --noEmit`)
   - Lint passes (`npm run lint`)
   - Build passes (`npm run build`)
   - Critical test suite passes

4. **After merge to main**
   - Deploy and verify production health.
   - Tag release (`vYYYY.MM.x`).

---

## ?? Hotfix Exception Policy

Direct work on `main` is allowed only for emergency production hotfixes.

Steps:

1. Create `hotfix/*` from `main`
2. Fix and deploy
3. Merge hotfix into `main`
4. **Mandatory:** back-merge hotfix into `development` immediately

---

## ?? Branch Naming Conventions

- `feature/[description]` - New features
- `fix/[description]` - Bug fixes
- `refactor/[description]` - Code refactoring
- `docs/[description]` - Documentation only
- `test/[description]` - Test additions/fixes
- `hotfix/[description]` - Emergency production fixes

Guidelines:

- lowercase with hyphens
- short and descriptive
- include ticket id when available (e.g., `feature/WC-231-lead-source-badge`)

---

## ? Policy Summary (Authoritative)

1. Commit daily to `development` (directly or via feature branches).
2. Merge to `main` once per month release window.
3. No routine direct commits to `main`.
4. Emergency hotfixes require back-merge to `development`.
