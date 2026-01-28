# 🌿 White Caves - Branching Strategy Guide

## Overview
This repository uses a **GitHub Flow + Department Branches** strategy for organized, efficient development.

---

## 🏗️ Branch Structure

```
main (production-ready, always deployable)
├── dev/frontend      - UI/UX development
├── dev/backend       - API & server logic
├── dev/testing       - QA & test automation
├── dev/devops        - Deployment & infrastructure
└── dev/documentation - Docs & planning
    └── feature/* (short-lived feature branches)
```

---

## 📦 Department Branches

### **dev/frontend**
**Scope:** UI/UX development
- React components (`src/components/`)
- Pages and routing (`src/pages/`)
- Styling and themes (`src/styles/`)
- Frontend utilities and hooks

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS

---

### **dev/backend**
**Scope:** API and server-side logic
- Express routes (`server/routes/`)
- API controllers and middleware
- Database models and migrations (`prisma/`)
- Backend utilities and services

**Tech Stack:** Node.js, Express, Prisma, PostgreSQL

---

### **dev/testing**
**Scope:** Quality assurance and testing
- E2E tests (`e2e/`, `cypress/`)
- Unit tests (`test/`)
- Integration tests
- Test utilities and fixtures

**Tech Stack:** Playwright, Cypress, Jest, Vitest

---

### **dev/devops**
**Scope:** Infrastructure and deployment
- Docker configurations
- CI/CD workflows (`.github/workflows/`)
- Deployment scripts (`deploy.sh`)
- Environment configurations

**Tech Stack:** Docker, Vercel, GitHub Actions

---

### **dev/documentation**
**Scope:** Documentation and planning
- README updates
- API documentation (`openapi/`)
- Project plans (`plans/`)
- Implementation guides

---

## 🔄 Workflow

### For Individual Developers

1. **Start a new feature**
   ```bash
   # Checkout the appropriate department branch
   git checkout dev/frontend
   git pull origin dev/frontend
   
   # Create your feature branch
   git checkout -b feature/add-user-profile
   ```

2. **Work on your feature**
   ```bash
   # Make commits as you work
   git add .
   git commit -m "feat: Add user profile component"
   ```

3. **Keep your branch updated**
   ```bash
   # Regularly sync with department branch
   git checkout dev/frontend
   git pull origin dev/frontend
   git checkout feature/add-user-profile
   git rebase dev/frontend
   ```

4. **Create a Pull Request**
   - Push your feature branch
   ```bash
   git push origin feature/add-user-profile
   ```
   - Open PR: `feature/add-user-profile` → `dev/frontend`
   - Request review from team members
   - Address feedback and update

5. **After Merge**
   ```bash
   # Clean up local branch
   git checkout dev/frontend
   git pull origin dev/frontend
   git branch -d feature/add-user-profile
   ```

---

### For Team Leads / Release Managers

**Merging to Main (Production)**

1. **Ensure department branch is ready**
   ```bash
   git checkout dev/frontend
   git pull origin dev/frontend
   
   # Run tests
   npm run test
   npm run build
   ```

2. **Create PR to main**
   - Open PR: `dev/frontend` → `main`
   - Title: `Release: Frontend updates - [brief description]`
   - Include changelog of features

3. **After merge to main**
   - Vercel automatically deploys
   - Monitor deployment logs
   - Verify production

---

## 🎯 Branch Naming Conventions

### Feature Branches
- `feature/[description]` - New features
  - Example: `feature/add-payment-gateway`
- `fix/[description]` - Bug fixes
  - Example: `fix/sidebar-alignment`
- `refactor/[description]` - Code refactoring
  - Example: `refactor/optimize-api-calls`
- `docs/[description]` - Documentation only
  - Example: `docs/update-readme`
- `test/[description]` - Test additions/fixes
  - Example: `test/add-e2e-auth-flow`

### Guidelines
- Use lowercase with hyphens
- Be descriptive but concise
- Include issue number if applicable: `feature/123-add-search`

---

## 📝 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples
```bash
feat(auth): Add JWT authentication
fix(sidebar): Resolve navigation bug
docs(readme): Update installation instructions
test(api): Add unit tests for user endpoints
```

---

## 🚀 Deployment Flow

```
Feature Branch → Department Branch → Main → Production (Vercel)
```

1. **Development**: Work in feature branches
2. **Integration**: Merge to department branch
3. **Staging**: Department branches act as integration testing
4. **Production**: Merge department branch to `main`
5. **Auto-Deploy**: Vercel deploys `main` automatically

---

## 🛡️ Best Practices

### DO ✅
- Keep feature branches small and focused
- Sync with department branch regularly
- Write descriptive commit messages
- Add tests for new features
- Update documentation
- Request code reviews
- Delete branches after merge
- Test locally before pushing

### DON'T ❌
- Commit directly to `main`
- Create long-lived feature branches (>1 week)
- Merge without code review
- Push broken code
- Commit secrets or credentials
- Mix multiple concerns in one PR
- Force push to shared branches

---

## 🔧 Useful Git Commands

### Branch Management
```bash
# View all branches
git branch -a

# Switch to department branch
git checkout dev/frontend

# Create and switch to new feature branch
git checkout -b feature/new-feature

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Staying Updated
```bash
# Update your local main
git checkout main
git pull origin main

# Update department branch
git checkout dev/frontend
git pull origin dev/frontend

# Rebase your feature branch
git checkout feature/my-feature
git rebase dev/frontend
```

### Resolving Conflicts
```bash
# If conflicts during rebase
git rebase dev/frontend

# Fix conflicts in files, then:
git add .
git rebase --continue

# Or abort and try merge instead:
git rebase --abort
git merge dev/frontend
```

---

## 📊 PR Guidelines

### Creating a Pull Request
1. **Title**: Clear and descriptive
   - ✅ `feat: Add user authentication with JWT`
   - ❌ `Updated files`

2. **Description**: Include
   - What changed
   - Why it changed
   - How to test
   - Screenshots (for UI changes)
   - Related issues

3. **Reviewers**: Assign appropriate team members

4. **Labels**: Use labels for categorization
   - `frontend`, `backend`, `bug`, `enhancement`, etc.

### Reviewing Pull Requests
- Check code quality
- Verify tests pass
- Test locally if needed
- Provide constructive feedback
- Approve only when confident

---

## 🎓 Quick Reference

| Action | Command |
|--------|---------|
| Start new feature | `git checkout dev/[dept] && git checkout -b feature/name` |
| Update branch | `git pull origin dev/[dept]` |
| Commit changes | `git commit -m "type: description"` |
| Push feature | `git push origin feature/name` |
| Sync with department | `git rebase dev/[dept]` |
| View status | `git status` |
| View branches | `git branch -a` |

---

## 🆘 Getting Help

**Common Issues:**

1. **Merge conflicts**
   - Pull latest changes from department branch
   - Resolve conflicts manually
   - Test before committing

2. **Accidental commits to wrong branch**
   ```bash
   git reset HEAD~1  # Undo last commit
   git stash         # Save changes
   git checkout correct-branch
   git stash pop     # Apply changes
   ```

3. **Need to update feature branch**
   ```bash
   git checkout feature/my-feature
   git rebase dev/frontend
   ```

---

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Project Documentation](./docs/)

---

**Last Updated:** 2026-01-24 13:30:54  
**Maintained by:** White Caves Development Team