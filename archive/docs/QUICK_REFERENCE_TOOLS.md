# Quick Reference: Developer Tools & Scripts

**White Caves Project**  
**Last Updated**: March 6, 2026

---

## 🚀 Essential Commands

### Development
```bash
# Start development server
npm run dev

# Start with both client and server
npm run dev:all

# Run backend only
npm run server

# Run frontend only
npm run client
```

### Testing
```bash
# Run all tests (watch mode)
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Open test UI
npm run test:ui
```

### Code Quality
```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format all code
npm run format

# Check if code is formatted
npm run format:check

# Security audit
npm run audit

# Fix security issues
npm run audit:fix
```

### Building
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Build for Vercel
npm run build:vercel
```

---

## 📋 Before Pushing Code

**Required pre-commit checklist**:
```bash
# 1. Fix linting issues
npm run lint:fix

# 2. Format code
npm run format

# 3. Run tests
npm run test:run

# 4. Check security
npm run audit

# 5. Verify build
npm run build

# Then commit
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

**One-liner**:
```bash
npm run lint:fix && npm run format && npm run test:run && npm run build
```

---

## 🔍 Common Debugging

### ESLint Issues

**View all issues:**
```bash
npm run lint
```

**Fix automatically:**
```bash
npm run lint:fix
```

**Common errors**:
- `no-unused-vars`: Variable declared but not used → delete or prefix with `_`
- `react-hooks/exhaustive-deps`: Missing dependency → add to dependency array
- `@typescript-eslint/no-explicit-any`: Using `any` type → use specific type

### Test Failures

**Run specific test file:**
```bash
npm run test src/store/authSlice.test.js
```

**Run tests matching pattern:**
```bash
npm run test -- auth
```

**Debug test:**
```bash
node --inspect-brk ./node_modules/.bin/vitest run
# Then open chrome://inspect in browser
```

### Build Errors

**Full build output:**
```bash
npm run build
```

**Common issues**:
- Missing imports → check file paths
- TypeScript errors → fix type definitions
- Large chunks warning → consider code splitting

---

## 📦 Dependency Management

**Check outdated packages:**
```bash
npm outdated
```

**Update to latest:**
```bash
npm update
```

**Install new package:**
```bash
npm install package-name
npm install --save-dev package-name  # dev dependency
```

**Remove unused packages:**
```bash
npm prune
```

---

## 🐛 Git Cheat Sheet

### Creating Features
```bash
# Update and create branch
git fetch origin develop
git checkout -b feature/my-feature origin/develop

# Do work and commit
git add .
git commit -m "feat: description"

# Push to GitHub
git push origin feature/my-feature
```

### Syncing with Latest
```bash
# Get latest changes
git fetch origin develop

# Rebase your work
git rebase origin/develop

# If conflicts, resolve then:
git add .
git rebase --continue
```

### Undoing Changes
```bash
# Undo uncommitted changes
git checkout -- .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo pushed commit
git revert <commit-hash>
```

---

## 🔐 Environment Variables

### Required for Development (`.env.local`)
```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your-key-here
VITE_STRIPE_PUBLISHABLE_KEY=your-key-here
```

### Never Commit
```
.env          # Local secrets
.env.local    # Local overrides
.env.*.local  # Environment-specific locals
```

---

## 🎯 File Locations

| What | Where |
|------|-------|
| Components | `src/components/` |
| Pages | `src/pages/` |
| Redux Store | `src/store/` |
| API Services | `src/services/` |
| Utils | `src/utils/` |
| Tests | `src/__tests__/` or `src/**/*.test.js` |
| Styles | `src/styles/` |
| Config | `vite.config.js`, `vitest.config.js` |

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Linux/macOS: Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
```

### Git Merge Conflicts
```bash
# Open file and manually resolve conflicts
# Then:
git add .
git commit -m "fix: merge conflicts"
```

### TypeScript Errors
```bash
# Check all TypeScript issues
npx tsc --noEmit

# Fix: Add proper type annotations
```

---

## 📞 Getting Help

**For questions**:
1. Check existing documentation in `archive/` for reference
2. Search in codebase: `grep -r "your-term" src/`
3. Check TypeScript definitions: hover in IDE
4. Review component PropTypes/interfaces

**Common patterns**:
- React components: `src/components/`
- Redux slices: `src/store/slices/`
- API calls: `src/services/`
- Tests: Next to source files with `.test.js`

---

## 📚 Documentation Files

- **MASTER_PLAN.md** - Overall project status and roadmap
- **PHASE_16_QUALITY_HARDENING.md** - Code quality & security details
- **DEVOPS_GIT_WORKFLOW.md** - Git workflow & deployment procedures
- **README.md** - Project overview and setup
- **archive/** - Historical documentation

---

**Print or bookmark this page!** 📌

*Last updated: March 6, 2026*
