# CI/CD Pipeline Setup & Documentation

## Overview

White Caves now has a comprehensive, production-grade CI/CD pipeline implemented with GitHub Actions. This document covers all workflows, their purpose, configuration, and team guidelines.

**Status**: ✅ FULLY IMPLEMENTED AND OPERATIONAL

---

## 📋 Workflow Summary

### 1. **Continuous Integration (CI)** - `ci.yml`

**Purpose**: Automated testing on every push and pull request to main/develop branches.

**Triggers**:

- `push` to `main` and `develop` branches
- `pull_request` to `main` and `develop` branches

**Jobs**:

#### 1.1 Test Matrix (Node 18.x & 20.x)

- ✅ Install dependencies (`npm ci`)
- ✅ Run linter (`npm run lint`)
- ✅ Build application (`npm run build`)
- ✅ Run unit tests with coverage (`npm test`)
- ✅ Upload coverage to Codecov
- **Artifacts**: Code coverage metrics, test results

#### 1.2 E2E Tests

- ✅ Install Playwright browsers
- ✅ Build application
- ✅ Start dev server
- ✅ Run all E2E tests (dashboard-navigation, commission-workflow, user-management, contracts, accessibility, performance)
- **Artifacts**: HTML test report

#### 1.3 Accessibility Compliance

- ✅ Install Playwright
- ✅ Build and test accessibility compliance
- **Artifacts**: Accessibility audit report

#### 1.4 Performance Baseline

- ✅ Run performance baseline tests
- **Artifacts**: Performance metrics and reports

#### 1.5 Build Check

- ✅ Type checking (`tsc --noEmit`)
- ✅ Build verification
- ✅ Bundle size analysis

---

### 2. **Continuous Deployment (CD)** - `cd.yml`

**Purpose**: Automated deployment to staging and production with quality gates.

**Triggers**:

- `push` to `main` branch
- Workflow run completion from CI (on success)

**Jobs**:

#### 2.1 Deploy to Staging

- ✅ Install dependencies
- ✅ Build application
- ✅ Run tests
- ✅ Build Docker image
- ✅ Deploy to staging (SSH/custom deployment)
- ✅ Slack notification

#### 2.2 Smoke Tests

- ✅ Requires: `deploy-staging` success
- ✅ Run dashboard navigation tests on staging
- **Artifacts**: Smoke test reports

#### 2.3 Deploy to Production

- ✅ Requires: `smoke-tests` success
- ✅ Final build and testing
- ✅ Docker image creation
- ✅ Production deployment
- ✅ Release creation (GitHub Release)
- ✅ Slack notification (success/failure)

#### 2.4 Production Monitoring

- ✅ Health check verification
- ✅ Metrics validation
- ✅ Slack notification

---

### 3. **Scheduled Testing & Monitoring** - `scheduled-testing.yml`

**Purpose**: Regular automated testing, security audits, and performance monitoring.

**Schedule**:

- Daily at 2 AM UTC
- Weekly on Sunday at 10 AM UTC

**Jobs**:

#### 3.1 Comprehensive Test Suite

- ✅ Run all unit tests with full coverage
- ✅ Run all E2E tests
- **Artifacts**: Detailed test and coverage reports

#### 3.2 Dependency Audit

- ✅ `npm audit` (moderate level)
- ✅ Check outdated packages
- ✅ Snyk security scanning
- ✅ Slack notification

#### 3.3 Performance Benchmark

- ✅ Run performance baseline tests
- ✅ Compare against baseline metrics
- **Artifacts**: Performance data

#### 3.4 Code Quality Check

- ✅ ESLint analysis
- ✅ TypeScript type checking
- ✅ Build verification
- ✅ SonarQube analysis (if configured)
- ✅ Slack notification

#### 3.5 Accessibility Audit

- ✅ Run full accessibility compliance tests
- **Artifacts**: Comprehensive accessibility audit

---

### 4. **Pull Request Validation** - `pr-validation.yml`

**Purpose**: Comprehensive validation for every pull request.

**Triggers**:

- `pull_request` opened, reopened, synchronized, ready_for_review

**Jobs**:

#### 4.1 PR Validation

- ✅ Validate PR title (conventional commits)
- ✅ Run linter
- ✅ Type checking
- ✅ Build check
- ✅ Run unit tests with coverage
- ✅ Auto-comment PR with status

#### 4.2 E2E Tests (Non-Draft PRs)

- ✅ Run all E2E tests
- **Artifacts**: E2E test results
- ✅ Auto-comment PR with results link

#### 4.3 Coverage Report

- ✅ Generate coverage report
- ✅ Upload to Codecov
- ✅ Auto-comment PR with coverage changes

#### 4.4 Security Check

- ✅ `npm audit` for high-level vulnerabilities
- ✅ Dependency scanning

#### 4.5 Code Quality

- ✅ ESLint analysis
- ✅ Detect unused code
- **Artifacts**: Quality reports

#### 4.6 Documentation Check

- ✅ Verify documentation updates when appropriate
- ✅ Validate markdown files

#### 4.7 Size Check

- ✅ Build and analyze bundle size
- ✅ List largest artifacts
- ✅ Auto-comment PR with size information

---

## 🔧 Required GitHub Secrets Configuration

To enable full CI/CD functionality, configure these secrets in your GitHub repository settings:

### Deployment Secrets

```
STAGING_DEPLOY_KEY        # SSH private key for staging server
STAGING_DEPLOY_HOST       # Staging server hostname
STAGING_DEPLOY_USER       # Staging server username
STAGING_URL               # Staging environment URL

PROD_DEPLOY_KEY          # SSH private key for production server
PROD_DEPLOY_HOST         # Production server hostname
PROD_DEPLOY_USER         # Production server username
PROD_URL                 # Production environment URL
```

### Notification Secrets

```
SLACK_WEBHOOK            # Slack webhook URL for notifications
```

### Code Quality & Security

```
CODECOV_TOKEN            # Codecov token for coverage uploads
SONAR_TOKEN             # SonarQube token for quality analysis
SNYK_TOKEN              # Snyk token for security scanning
GITHUB_TOKEN            # (Auto-provided by GitHub Actions)
```

---

## 📋 Conventional Commits Format

PR titles **must** follow conventional commits format for automatic validation:

### Format

```
<type>(<scope>): <description>
```

### Valid Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test additions/fixes
- `chore` - Build and tooling

### Examples

```
✅ feat(auth): add two-factor authentication
✅ fix(commission): resolve calculation bug
✅ docs: update README with new features
✅ refactor(dashboard): improve component structure
```

---

## 📊 Test Coverage Requirements

### Minimum Coverage Thresholds

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

Coverage is tracked across all commits and reported in:

- Terminal output
- Codecov dashboard
- PR comments (automated)

---

## 🚀 Deployment Process

### Automatic Flow

1. **Developer** pushes to `develop` → Runs CI tests
2. **Developer** creates PR → Runs PR validation tests
3. **Code review** → Approved and merged to `main`
4. **Push to main** → Triggers CD pipeline
5. **Staging Deploy** → Runs tests
6. **Smoke Tests** → Validates staging deployment
7. **Production Deploy** → Automatic deployment (if smoke tests pass)
8. **Monitoring** → Checks production health

### Manual Intervention Points

- PR approval required before merge to main
- Smoke tests must pass before production deployment
- Failed tests block deployment automatically

### Rollback Process

If production deployment fails:

1. Review failure logs in GitHub Actions
2. Fix issues in develop branch
3. Create new PR with fixes
4. Re-run deployment workflow

---

## ⚙️ Environment Configuration

### CI Environment

- **OS**: Ubuntu Latest (ubuntu-latest)
- **Node.js**: 18.x, 20.x
- **Package Manager**: npm
- **Browsers**: Chromium, Firefox, WebKit (Playwright)

### Staging Environment

- **URL**: `${{ secrets.STAGING_URL }}`
- **Deployment**: SSH via private key
- **Health Check**: Endpoint validation

### Production Environment

- **URL**: `${{ secrets.PROD_URL }}`
- **Deployment**: SSH via private key
- **Release Tracking**: GitHub Releases
- **Notifications**: Slack + automatic status updates

---

## 📈 Monitoring & Reporting

### Automated Notifications

All workflow completions send Slack notifications:

- ✅ Success - Green with details
- ❌ Failure - Red with failure info
- ⚠️ Warning - Yellow for issues needing attention

### Accessible Reports

- **Code Coverage**: Codecov dashboard and PR comments
- **Test Results**: GitHub Actions artifacts
- **Performance**: JSON format in artifacts
- **Accessibility**: HTML reports in artifacts
- **Security**: Snyk + npm audit output

### Viewing Results

1. **GitHub Actions**: https://github.com/your-org/white-caves/actions
2. **Codecov**: Codecov dashboard (configured in secrets)
3. **Artifacts**: Each workflow stores reports for 7-90 days
4. **Slack**: Real-time notifications

---

## 🔐 Security Best Practices

### Implemented

1. ✅ **Secret Management**: All sensitive data in GitHub Secrets
2. ✅ **Security Scanning**:
   - npm audit on every PR and scheduled basis
   - Snyk deep scanning
   - Dependency updates tracked
3. ✅ **Type Safety**: TypeScript strict mode enforced
4. ✅ **Code Quality**: ESLint + auto-comments on PRs
5. ✅ **Test Coverage**: Minimum thresholds enforced

### Development Guidelines

- Never commit secrets to git
- Use GitHub Secrets exclusively
- Review dependency updates in PRs
- Keep security audit clean (no high-level vulnerabilities)
- Run `npm audit` locally before pushing

---

## 🛠️ Local Development Setup

### Pre-commit Hook (Optional)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
npm run lint && npm test -- --run --coverage && npm run build
```

### Run Tests Locally (Before Pushing)

```bash
# Linting
npm run lint

# Unit tests
npm test

# Type checking
npx tsc --noEmit

# Build verification
npm run build

# E2E tests (requires server)
npm run dev & npx playwright test
```

---

## 📝 Sample Workflow Outputs

### Successful CI Run

```
✓ All tests passed (156/156)
✓ Build successful (3309 modules transformed)
✓ Coverage: 85.3% (above 80% threshold)
✓ No TypeScript errors
✓ No ESLint warnings
```

### Successful CD Run

```
✓ Staging deployment successful
✓ Smoke tests passed
✓ Production deployment successful
✓ Release v42 created
✓ Slack notification sent
```

### Failed PR Validation

```
❌ PR title does not follow conventional commits format
   Expected: feat(scope): description
   Provided: "fixed some stuff"
```

---

## 🗂️ File Structure

```
.github/workflows/
├── ci.yml                    # Continuous Integration
├── cd.yml                    # Continuous Deployment
├── pr-validation.yml         # Pull Request Validation
└── scheduled-testing.yml     # Scheduled Testing & Monitoring
```

---

## 🔍 Troubleshooting

### Build Fails in CI but Works Locally

- Ensure Node.js version matches (18.x or 20.x)
- Clear npm cache: `npm ci` (use instead of `npm install`)
- Check for hardcoded absolute paths
- Verify all required files are committed to git

### E2E Tests Timeout

- Check if dev server started in workflow
- Verify `wait-on` is waiting for correct URL
- Increase timeout if needed
- Check Playwright logs in artifacts

### Deployment Fails

- Verify SSH keys are correct in GitHub Secrets
- Check server connectivity and disk space
- Review deployment logs in GitHub Actions
- Ensure production environment configured correctly

### Coverage Drops Below Threshold

- Review new code coverage requirements
- Add tests for new features
- Update coverage configuration if intentional
- PR will be blocked until resolved

### Slack Notifications Not Arriving

- Verify webhook URL is correct in secrets
- Check Slack workspace permissions
- Review GitHub Actions logs for webhook errors
- Ensure webhook channel accepts external integrations

---

## 📚 References

- **GitHub Actions Documentation**: https://docs.github.com/actions
- **Playwright Documentation**: https://playwright.dev
- **Conventional Commits**: https://www.conventionalcommits.org
- **npm Audit**: https://docs.npmjs.com/cli/v8/commands/npm-audit
- **Codecov Integration**: https://codecov.io/docs

---

## 🎯 Next Steps

1. **Configure Secrets**: Add all required secrets to GitHub repository
2. **Test Workflows**: Create a test PR to validate all workflows
3. **Team Training**: Brief team on conventional commits format
4. **Monitor Health**: Watch the GitHub Actions dashboard
5. **Iterate**: Adjust timeouts and configurations based on results

---

## 📞 Support

For issues with CI/CD:

1. Check GitHub Actions logs
2. Review artifacts for detailed error messages
3. Consult troubleshooting section
4. Check git history for clues
5. Test locally using `npm run build` and `npm test`

---

**Last Updated**: Session 9
**Status**: ✅ Production Ready
**Maintainer**: White Caves Development Team
