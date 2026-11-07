# DevOps & Git Workflow Guide

**White Caves Project**  
**Version**: 1.0  
**Date**: March 6, 2026

---

## 📚 Table of Contents

1. [Git Workflow](#git-workflow)
2. [Commit Standards](#commit-standards)
3. [Branch Management](#branch-management)
4. [Code Quality Checks](#code-quality-checks)
5. [Deployment Pipeline](#deployment-pipeline)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)

---

## Git Workflow

### Standard Development Flow

```
main (production)
  ↓
develop (staging)
  ↓
feature/* (feature work)
bugfix/* (bug fixes)
chore/* (maintenance)
```

### Daily Workflow

#### 1. Start New Feature
```bash
# Update develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/commission-tracking

# Make changes
git add .
git commit -m "feat: implement commission tracking module"

# Push and create PR
git push origin feature/commission-tracking
```

#### 2. Work on Existing Feature
```bash
# Sync with latest develop
git fetch origin
git rebase origin/develop

# Make changes
git add .
git commit -m "feat: add commission calculations logic"

# Push updates
git push origin feature/commission-tracking
```

#### 3. Merge to Develop
```bash
# Verify tests pass locally
npm run test:run
npm run lint:fix
npm run format

# Create Pull Request on GitHub
# - Title: feat: commission tracking module
# - Description: (reference issues, outline changes)
# - Link PR in task tracker

# After review approval
git checkout develop
git pull origin develop
git merge feature/commission-tracking
git push origin develop

# Delete feature branch
git branch -d feature/commission-tracking
git push origin --delete feature/commission-tracking
```

#### 4. Release to Production
```bash
# When develop is ready for production
git checkout main
git pull origin main

# Merge from develop
git merge develop
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin main
git push origin v1.1.0

# Alert team of deployment
```

---

## Commit Standards

### Format

Use **Conventional Commits** format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build, dependencies, or configuration changes
- **ci**: CI/CD pipeline changes

### Scope
The area of the codebase affected:
- `auth`, `commission`, `freelancer`, `api`, `ui`, `test`, etc.

### Examples

**Good Commits**:
```
feat(commission): add commission calculation engine
fix(auth): resolve JWT token expiration issue
chore(deps): upgrade React to 18.3
test(api): add integration tests for payment endpoints
docs: update README with setup instructions
```

**Bad Commits**:
```
fixed stuff
update
asdf
changes made
```

---

## Branch Management

### Branch Naming Convention

```
feature/<feature-name>      # New features
bugfix/<bug-name>           # Bug fixes
chore/<task-name>           # Maintenance tasks
refactor/<module-name>      # Refactoring work
docs/<doc-name>             # Documentation
hotfix/<issue-name>         # Emergency fixes
```

### Protection Rules for `main`

1. ✅ Require pull request reviews before merging
2. ✅ Require status checks to pass before merging
3. ✅ Require branches to be up to date before merging
4. ✅ Require code reviews from CODEOWNERS
5. ✅ Dismiss stale pull request approvals

### Develop Branch Rules

1. ✅ Require at least 1 approval
2. ✅ Run automated tests
3. ✅ Allow merging without review approval (for urgent fixes)

---

## Code Quality Checks

### Pre-Commit Checks (Local)

**Before pushing ANY commit:**
```bash
# 1. Run linter
npm run lint

# 2. Apply auto-fixes
npm run lint:fix

# 3. Format code
npm run format

# 4. Run tests
npm run test:run

# 5. Check security
npm audit

# 6. Build verification
npm run build
```

### All-in-One Quality Check

Create alias in `.bashrc` or `.zshrc`:
```bash
alias pre-commit='npm run lint:fix && npm run format && npm run test:run && npm audit'
```

Then use:
```bash
pre-commit
git add .
git commit -m "..."
```

### Automated GitHub Actions (CI/CD)

Triggers on:
- **Push to `main`**: Run all checks + deploy to production
- **Push to `develop`**: Run all checks + deploy to staging
- **Pull Request**: Run tests + lint + build

---

## Deployment Pipeline

### Development Environment
```bash
npm run dev
# Runs on http://localhost:5000
```

### Staging
```bash
git checkout develop
git pull
npm ci
npm run build
npm run start
# Deployed to staging URL
```

### Production
```bash
git checkout main
git pull
npm ci
npm run build
npm start
# Deployed to production URL
```

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables
3. Auto-deploy on `main` push
4. Preview deployments for PRs

---

## Rollback Procedures

### Quick Rollback (Last 30 Minutes)

```bash
# Revert last commit
git revert HEAD
git push origin main

# OR reset locally
git reset --hard HEAD~1
git push origin main --force-with-lease
```

### Full Rollback (Last Release)

```bash
# Find previous release tag
git tag -l
git log --oneline | head -20

# Checkout previous version
git checkout v1.0.0

# Create hotfix branch
git checkout -b hotfix/rollback-to-v1.0.0

# Push hotfix
git push origin hotfix/rollback-to-v1.0.0

# Create PR, review, merge to main
```

### Database Rollback

```bash
# List migrations
npx prisma migrate status

# Rollback to previous state
npx prisma migrate reset
# or specific migration
npx prisma migrate resolve --rolled-back <migration-name>
```

---

## Troubleshooting

### "Branch has conflicts"

```bash
# Fetch latest develop
git fetch origin develop

# Rebase on latest develop
git rebase origin/develop

# Resolve conflicts in editor, then:
git add .
git rebase --continue
git push origin <branch> --force-with-lease
```

### "Accidentally committed to main"

```bash
# Create a new branch from current position
git branch feature/accidental-work

# Reset main to previous state
git reset --hard origin/main

# Switch to the new branch with your work
git checkout feature/accidental-work

# Push as feature branch
git push origin feature/accidental-work
```

### "Forgot to create a feature branch"

```bash
# Create branch from current commit
git branch feature/my-feature

# Reset current branch to develop
git fetch origin develop
git reset --hard origin/develop

# Switch to feature branch
git checkout feature/my-feature
```

### "Need to undo a force push"

```bash
# Check reflog
git reflog

# Find the commit you want to restore
# Restore it
git reset --hard <commit-hash>
git push origin <branch> --force-with-lease
```

### "Merge PR closed by mistake"

```bash
# Find the merge commit
git log --oneline | grep "Merge pull"

# Revert the merge
git revert -m 1 <merge-commit-hash>
git push origin main
```

---

## Team Standards

### Code Review Checklist

When reviewing PRs, verify:
- ✅ Follows commit standards
- ✅ Tests added for new features
- ✅ ESLint passes (no warnings)
- ✅ Prettier formatting applied
- ✅ No security vulnerabilities
- ✅ Documentation updated
- ✅ No breaking changes (or documented)

### Merge Process

1. **Create PR** with clear title and description
2. **Wait for Checks**: All CI tests must pass
3. **Request Review**: Assign 2+ reviewers
4. **Address Comments**: Update code as requested
5. **Approvals**: Need ≥2 approvals before merge
6. **Merge**: Use "Squash and Merge" for cleaner history
7. **Delete Branch**: Clean up feature branch

---

## Environment Variables

### Required `.env.local`
```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=...
```

### Required Production `.env`
```
DB_URL=...
FIREBASE_ADMIN_SDK=...
STRIPE_SECRET_KEY=...
JWT_SECRET=...
```

**Never commit `.env` to git!** Use `.env.example` instead:
```
/.env
/.env.local
/.env.*.local
```

---

## Useful Git Commands

```bash
# Stash work in progress
git stash
git stash pop

# Interactive rebase (squash commits)
git rebase -i origin/develop

# Cherry-pick a commit
git cherry-pick <commit-hash>

# Check what changed
git diff main develop

# Amend last commit (before push)
git commit --amend --no-edit

# View recent commits with changes
git log --stat -n 5

# Find who changed a line
git blame src/file.js

# List all branches with last commit
git branch -v
```

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [GitHub Issues & Pull Requests](https://docs.github.com/en/github/managing-your-work-on-github)
- [Semantic Versioning](https://semver.org/)

---

**Prepared by**: Architecture Team  
**Last Updated**: March 6, 2026  
**Next Review**: Phase 17
