---
name: gwynne-git-lifecycle
description: Authoritative Git lifecycle, protected branch management, PR merge protocol, and clean branch pruning SOP for @Gwynne (DevOps & CI/CD Lead).
---

# @Gwynne — Standard Operating Procedure: Git Lifecycle & Protected Branch Merge Protocol

As **@Gwynne**, DevOps & CI/CD Deployment Lead for White Caves Real Estate and AEGIS, you are responsible for maintaining a clean, stable repository topology where `main` remains the single, uncompromised source of truth.

---

## 1. Protected Branch Architecture & Inviolable Rules

### The Golden Rule
> **Direct pushes to `main` (`git push origin main`) are PERMANENTLY BLOCKED by GitHub branch protection hooks (`GH006`).**

GitHub enforces:
1. **Pull Request Required:** All commits entering `main` MUST originate from an approved Pull Request.
2. **Required Status Checks Must Pass:** The 6 mandatory CI check suites must complete with `success` before merge authorization is granted.

Attempting to run `git push origin main` will always result in:
```text
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: - Changes must be made through a pull request.
remote: - 3 of 6 required status checks have not succeeded.
```

---

## 2. The 5-Step Complete Merge & Consolidation Protocol

Follow these exact steps to incorporate all active branches into `main` and prune stale branches cleanly across local and remote.

### Step 1: Pre-flight Quality & Typecheck Verification
Before pushing any code, verify local stability:
```bash
# 1. Typecheck validation
npx tsc --noEmit --skipLibCheck

# 2. Key test suite validation
npm test -- src/pages/auth/SignInPage.test.tsx
npm test -- src/components/layout/__tests__/UniversalComponents.test.tsx
```

### Step 2: Linear Rebase of the Branch Stack
When working with stacked PRs (e.g., child PR #2539 based on parent PR #2538):
```bash
# 1. Ensure parent branch is committed and pushed
git checkout feature/corporate-departments-hierarchy-complete
git push origin feature/corporate-departments-hierarchy-complete

# 2. Rebase child branch onto updated parent
git checkout copilot/fix-review-comment-4437412058
git rebase feature/corporate-departments-hierarchy-complete

# 3. Push rebased child with lease
git push origin copilot/fix-review-comment-4437412058 --force-with-lease
```

### Step 3: Monitor CI Status Check Rollup
Verify check runs on GitHub without needing the `gh` CLI:
```powershell
# Query commit status checks directly via GitHub REST API
$sha = (git rev-parse HEAD)
Invoke-RestMethod -Uri "https://api.github.com/repos/arslan9024/White-Caves/commits/$sha/check-runs" | 
  Select-Object -ExpandProperty check_runs | 
  Select-Object name, status, conclusion
```
All required checks must show `status: completed` and `conclusion: success`.

### Step 4: Merge PRs into Remote `main`
Once checks turn green:
1. Navigate to the GitHub repository:
   - **PR #2538:** Merge `feature/corporate-departments-hierarchy-complete` into `main`.
   - **PR #2539:** Merge `copilot/fix-review-comment-4437412058` into `main`.
2. Confirm both PRs are marked as **Merged**.

### Step 5: Synchronize Local `main` and Prune All Other Branches
Once remote `main` contains all merged commits:
```bash
# 1. Checkout and fast-forward local main
git checkout main
git fetch origin main
git pull origin main

# 2. Verify local main matches remote main
git log -n 5 --oneline

# 3. Delete merged local branches
git branch -D feature/corporate-departments-hierarchy-complete
git branch -D copilot/fix-review-comment-4437412058
git branch -D fix-pat-removal
git branch -D master
git branch -D pr-2537

# 4. Delete remote feature branches (only after confirming merge)
git push origin --delete feature/corporate-departments-hierarchy-complete
git push origin --delete copilot/fix-review-comment-4437412058

# 5. Prune all remote tracking references
git remote prune origin

# 6. Verify only main remains
git branch -a
```

---

## 3. Disaster Recovery & Rollback Protocols

- If a merge creates unintended regressions, use `git reset --hard origin/main` to restore local state to remote parity.
- Never use `git push --force` against `main`. Always use `--force-with-lease` on feature branches.
- Use `git stash` and `git stash pop` cautiously; always inspect unstaged diffs before continuing.
