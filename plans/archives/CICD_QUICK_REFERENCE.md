# CI/CD Quick Reference for Developers

## 🚀 Before You Push

### Pre-commit Checklist

- [ ] Code follows ESLint rules (`npm run lint`)
- [ ] All tests pass locally (`npm test`)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] PR title follows conventional commits format

### Conventional Commits Cheat Sheet

```
feat(scope):     Add new feature
fix(scope):      Fix a bug
docs(scope):     Update documentation
style(scope):    Format/style changes
refactor(scope): Restructure code
perf(scope):     Improve performance
test(scope):     Add/fix tests
chore(scope):    Build/dev dependencies
```

**Good Examples**:

- ✅ `feat(commission): add calculator component`
- ✅ `fix(dashboard): resolve infinite scroll bug`
- ✅ `docs: update API documentation`
- ✅ `refactor(utils): simplify helper functions`

**Bad Examples**:

- ❌ `fixed stuff`
- ❌ `Update`
- ❌ `Changes made`
- ❌ `WIP: new feature`

---

## 📊 Workflow Status Indicators

### Green ✅

All checks passed. Safe to merge and deploy.

### Red ❌

Something failed. Check logs and fix before proceeding.

### Yellow ⚠️

Warnings present. Review and ensure acceptable before merging.

### Skipped ⏭️

Test skipped due to conditions (e.g., draft PR).

---

## 🔍 Where to Check Results

### GitHub Actions

1. Go to repository → Actions tab
2. Find your workflow run
3. Click to expand jobs
4. Review failed steps and logs

### PR Comments

- ✅ Coverage changes
- ✅ Build status
- ✅ Size information
- ✅ E2E test results link

### Artifacts

1. In workflow run → Artifacts section
2. Download for detailed reports (html, json)
3. Artifacts kept for 7-90 days

### Slack

Notifications sent to #deployments channel:

- Build status
- Test results
- Deployment updates
- Security alerts

---

## 🆘 Quick Troubleshooting

### "Build failed in CI but works locally"

```bash
# Try this locally first:
rm -rf node_modules dist
npm ci
npm run build
npm test
```

### "TypeScript error in CI only"

- Check file paths (avoid backslashes)
- Verify all imports use correct aliases
- Run: `npx tsc --noEmit`

### "E2E tests timeout"

- Wait for dev server: `npm run dev`
- Then in another terminal: `npx playwright test`

### "Coverage below threshold"

1. Check coverage report: `npm test -- --coverage`
2. Add tests for new code
3. Update coverage config if needed

---

## 📈 Performance Tips

### Speed Up CI

- Minimize dependencies
- Remove unused code/files
- Keep test files focused
- Use proper caching strategies

### Speed Up Builds

- Use code splitting
- Enable tree-shaking
- Optimize imports
- Run: `npm run build -- --watch`

---

## 🔐 Security Checklist

- [ ] No secrets in code or commits
- [ ] No hardcoded API keys
- [ ] Dependencies up-to-date
- [ ] npm audit clean (no high/critical issues)
- [ ] TypeScript strict mode enforced

### If You Accidentally Commit a Secret

1. Immediately rotate the secret
2. Force-push to remove from history
3. Notify team and security
4. Update GitHub Secrets

---

## 📋 Common Commands

```bash
# Local validation before push
npm run lint
npm test
npx tsc --noEmit
npm run build

# Run E2E tests locally
npm run dev &          # Start server in background
npx playwright test    # Run all tests
npx playwright test --ui  # Interactive mode

# Check coverage
npm test -- --coverage

# Update snapshots
npm test -- -u

# Type checking
npx tsc --noEmit

# Linting with fixes
npm run lint -- --fix
```

---

## 🎯 PR Workflow

### 1. Before Creating PR

```bash
git checkout develop
git pull origin develop
git checkout -b feat/your-feature

# Make your changes...

npm run lint --fix     # Auto-fix style issues
npm test              # Run tests
npm run build         # Verify build
```

### 2. Commit with Conventional Format

```bash
git add .
git commit -m "feat(module): add awesome feature"
```

### 3. Create PR

- Title must match conventional commits format
- Add description of changes
- Link related issues
- Request reviewers

### 4. Wait for CI

- All checks must pass (green ✅)
- Coverage must be at threshold
- E2E tests must pass
- No TypeScript errors

### 5. Address Review Comments

- Run tests again
- Push fixes
- CI runs automatically

### 6. Merge & Deploy

- Squash and merge (recommended)
- Delete branch
- CD automatically deploys to staging
- Smoke tests validate
- Automatic production deployment

---

## 📞 Getting Help

1. **Check Workflow Logs**: GitHub Actions → Your PR → Details
2. **Review Test Output**: Artifacts section in workflow run
3. **Consult Team**: Post in #dev-help channel
4. **Read Docs**: CICD_SETUP_DOCUMENTATION.md
5. **Local Testing**: Run commands locally to debug

---

## ⚡ Pro Tips

### Enable Notifications

1. Go to GitHub → Settings
2. Notifications → Custom
3. Select workflow notifications

### Watch Repository Status

1. GitHub → Watch repository
2. Select "Custom"
3. Check "Actions" checkbox

### Sync Fork (if working with fork)

```bash
git fetch upstream
git rebase upstream/main
git push origin main --force-with-lease
```

### Speed Up Feedback Loop

- Commit smaller changes
- Run full checks locally first
- Use interactive debugging with `--ui` flag
- Keep branches short-lived

---

## 🚨 Important Notes

⚠️ **Never**:

- Force push to main/develop
- Bypass failed tests
- Commit environment secrets
- Ignore TypeScript errors
- Skip coverage requirements

✅ **Always**:

- Run full test suite locally
- Follow naming conventions
- Keep commits focused
- Add tests for new code
- Review logs before pushing again

---

**Last Updated**: Session 9
**Version**: 1.0
**Status**: ✅ Active
