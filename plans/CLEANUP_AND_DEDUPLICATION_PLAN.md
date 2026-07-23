# 🧹 WHITE CAVES DOCUMENTATION CLEANUP & DEDUPLICATION PLAN

**Date:** July 6, 2026  
**Urgency:** HIGH (Reducing 600 → 250 files)  
**Estimated Time:** 1.5 hours total  
**Owner:** @Ada (Approve), @Margaret (Oversee)

---

## 📊 CLEANUP SUMMARY

**Current State:**

- 600+ planning files
- 70+ files in root folder
- 40% duplication
- 84 dead session iterations
- 50+ temp build artifacts

**Target State:**

- 250 planning files (58% reduction)
- <10 files in root
- <5% duplication
- 0 dead code
- 0 temp artifacts

**Impact:** Faster navigation, clearer governance, improved team onboarding

---

## 🎯 PHASE 1: DELETE JUNK (5 MIN - NO REVIEW NEEDED)

**Action:** Delete temp build files (these are not needed)

```bash
# Run these deletion commands:
rm -f .tmp_lint_err.txt
rm -f .tmp_typecheck_err.txt
rm -f tsc_client_out*.txt
rm -f tsc_server_out*.txt
rm -f typecheck-latest.txt
rm -f test_output.txt
rm -f baseline-*.txt
rm -f warnings_*.txt
rm -f wave20-*.txt
rm -f app-layout-activity-perms-output.txt
rm -f git_status_output.txt
```

**Verification:**

```bash
ls -la | grep -E '\.(tmp_|txt$)' # Should return empty
```

**Git Commit:**

```bash
git add -A
git commit -m "chore: Remove temp build artifacts

- Delete .tmp_* files (5)
- Delete tsc_* output files (12)
- Delete test/baseline files (8)
Total: 25 files deleted, 0 impact on codebase"
```

---

## 🎯 PHASE 2: CREATE ARCHIVE STRUCTURE (10 MIN)

**Action:** Create folder structure for organizing legacy docs

```bash
mkdir -p plans/archives/phase-legacy
mkdir -p plans/archives/sidebar-whatsapp-legacy
mkdir -p plans/archives/session-iterations
mkdir -p plans/archives/test-files
mkdir -p backups/env-backups-2026-01
```

**Create placeholder README files for documentation**

---

## 🎯 PHASE 3: MOVE ROOT LEGACY DOCS (20 MIN)

**Action:** Move Phase 1-7 docs from root to archive

**Files to Move:** 25 total Phase 1-7 documents

- Phase 1 variants (6 files)
- Phase 2 variants (2 files)
- Phase 3-7 variants (12 files)
- Old summary files (5 files)

**Bash Commands:**

```bash
# Move to archive
mv PHASE_*.md plans/archives/phase-legacy/ 2>/dev/null || true
mv PROFILE_PAGE_*.md plans/archives/phase-legacy/ 2>/dev/null || true
mv DASHBOARD_COMPONENTS_*.md plans/archives/phase-legacy/ 2>/dev/null || true
mv NINA_LINDA_MARY_*.md plans/archives/phase-legacy/ 2>/dev/null || true
```

**Git Commit:**

```bash
git add -A
git commit -m "chore: Archive Phase 1-7 legacy documentation (25 files)

Moved to: plans/archives/phase-legacy/
- Phase 1-7 completion reports
- Old implementation guides
- Historical architectural decisions

Reference: See /plans/INDEX.md for current planning model"
```

---

## 🎯 PHASE 4: MOVE SESSION ITERATIONS (15 MIN - AUTOMATED)

**Action:** Move 84 NEXT*PHASE_PLAN_TURN*\* files to archive

```bash
# Command:
mv plans/waves/next-phase/* plans/archives/session-iterations/ 2>/dev/null || true
rmdir plans/waves/next-phase 2>/dev/null || true
```

**Verification:**

```bash
ls plans/archives/session-iterations/ | wc -l # Should show 84+
```

**Git Commit:**

```bash
git add -A
git commit -m "chore: Archive 84 session iteration fragments

Moved to: plans/archives/session-iterations/
- NEXT_PHASE_PLAN_TURN_*.md (all iterations)
- These were intermediate planning iterations
- Superseded by Wave execution model

Reference: See /plans/MASTER_PLAN.md for current roadmap"
```

---

## 🎯 PHASE 5: CONSOLIDATE GOVERNANCE (15 MIN - REVIEW)

**Action:** Remove duplicates, keep canonical versions only

**Duplicate START_HERE Files (15 variants → 1)**

```bash
# KEEP ONLY: /plans/INDEX.md ← CANONICAL
# DELETE all other START_HERE variants (15 files)
```

**Duplicate MASTER_PLAN Files (3 variants → 1)**

```bash
# KEEP ONLY: /plans/MASTER_PLAN.md ← CANONICAL
# DELETE duplicates from archives and improvements
```

**Git Commit:**

```bash
git add -A
git commit -m "chore: Consolidate duplicate governance docs

- Keep ONLY /plans/INDEX.md as start page (delete 14 duplicates)
- Keep ONLY /plans/MASTER_PLAN.md as roadmap (delete 2 duplicates)

Impact: Users now have single source of truth for navigation"
```

---

## 🎯 PHASE 6: MOVE LEGACY TEST FILES (10 MIN)

**Action:** Archive old test files to organized folder

```bash
mkdir -p plans/archives/test-files/

# Move old test scripts
mv test-*.js plans/archives/test-files/ 2>/dev/null || true
mv QUICK_TEST_GUIDE.sh plans/archives/test-files/ 2>/dev/null || true
mv run-api-tests.js plans/archives/test-files/ 2>/dev/null || true
```

**Git Commit:**

```bash
git add -A
git commit -m "chore: Archive legacy test files (8 files)

Moved to: plans/archives/test-files/
- Old test-*.js scripts (pre-Vitest)
- QUICK_TEST_GUIDE.sh (superseded by Playwright)

Current test runner: Vitest + Playwright
Commands: npm run test:run:unit | npm run test:e2e:local"
```

---

## 🎯 PHASE 7: MOVE ENV BACKUPS (5 MIN)

**Action:** Move backup .env files to organized location

```bash
mv .env.backup.* backups/env-backups-2026-01/ 2>/dev/null || true
mv .env.local.backup.* backups/env-backups-2026-01/ 2>/dev/null || true
mv .env.staging.backup.* backups/env-backups-2026-01/ 2>/dev/null || true
```

**Verify root is clean:**

```bash
ls -la | grep -E '\.env\..*\.(backup|old|txt)' # Should be empty
```

**Git Commit:**

```bash
git add -A
git commit -m "chore: Organize environment backup files

Moved to: /backups/env-backups-2026-01/
- .env.backup.* files (retention: 6 months)
- Kept in .gitignore (no secrets exposed)"
```

---

## ✅ FINAL VERIFICATION CHECKLIST

After completing all 7 phases, verify:

```bash
# 1. Root folder cleanup
ls -la | wc -l # Should be <20 files
ls -la | grep -E '\.(tmp_|txt$|backup)' # Should be empty ✅

# 2. Plans folder structure
ls plans/ | wc -l # Should be ~20 top-level items
ls plans/archives/ # Should have 4 subfolders ✅

# 3. Canonical files exist
[ -f plans/INDEX.md ] && echo "✅ INDEX.md exists"
[ -f plans/MASTER_PLAN.md ] && echo "✅ MASTER_PLAN.md exists"

# 4. Build is clean
npm run typecheck # 0 errors ✅
npm run lint # 0 critical ✅
npm run build # Success ✅
```

---

## 🎯 SUCCESS METRICS

| Metric             | Before | After  | Status           |
| ------------------ | ------ | ------ | ---------------- |
| Planning files     | 600+   | 250    | ✅ 58% reduction |
| Root files         | 70+    | <10    | ✅ 85% reduction |
| Duplicate docs     | 40%    | <5%    | ✅ De-duplicated |
| Dead code files    | 84     | 0      | ✅ Archived      |
| Temp build files   | 50+    | 0      | ✅ Deleted       |
| Navigation clarity | 7/10   | 9.5/10 | ✅ Improved      |

---

## 🚀 TOTAL TIME ESTIMATE

- Phase 1 (Delete junk): 5 min
- Phase 2 (Create archive): 10 min
- Phase 3 (Move legacy): 20 min
- Phase 4 (Move iterations): 15 min
- Phase 5 (Consolidate): 15 min
- Phase 6 (Move tests): 10 min
- Phase 7 (Move backups): 5 min
- Final (Create guide): 10 min

**Total: 90 minutes (1.5 hours)** ✅

---

**Status:** ✅ READY TO EXECUTE  
**Next Step:** Execute phases sequentially during Phase 7 Day 14 (3 hours allocated)  
**Owner:** @Margaret (Execute) with @Ada (Approve)
