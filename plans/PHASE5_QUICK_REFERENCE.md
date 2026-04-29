# Phase 5 - Quick Reference Card

## 🚀 Most Used Commands

```bash
# Development
npm run dev:all              # Start everything
npm test                     # Run tests
npm run test:coverage        # Check coverage

# Docker
npm run docker:dev:build     # Start in Docker
npm run docker:down          # Stop Docker

# Deployment
git push origin main         # Deploy to production
npm run verify-deploy        # Check deployment
```

---

## 📂 Key File Locations

| What | Where |
|------|-------|
| Components | `src/components/WhatsApp/` |
| Custom Hooks | `src/hooks/whatsapp/` |
| Services | `src/services/whatsapp/` |
| Tests | `src/__tests__/` |
| E2E Tests | `src/__tests__/e2e/` |
| Docker Files | `docker-compose.*.yml` |
| CI/CD | `.github/workflows/ci-cd.yml` |
| Config | `vite.config.js`, `vitest.config.js` |

---

## 🧪 Testing Commands

```bash
# Run all tests
npm test                          # Watch mode
npm run test:run                  # Single run
npm run test:coverage             # With coverage
npm run test:ui                   # UI dashboard

# Specific tests
npm test useWhatsAppIntegration   # Single hook test
npm run test:api                  # API tests only
npm run test:e2e                  # E2E tests only
npm test -- --grep="Account"      # By pattern

# E2E specific
npm run test:e2e:headed           # Visible browser
npm run test:e2e:debug            # Debug mode
npx playwright test --headed      # Single test headed
npx playwright show-report        # View report
```

---

## 🐳 Docker Commands

```bash
# Start development
npm run docker:dev:build          # Build and start
npm run docker:logs               # View logs
npm run docker:down               # Stop all services

# Production
npm run docker:prod:build         # Production setup
docker ps                         # List containers
docker logs container-name        # View container logs

# Manual
docker-compose -f docker-compose.dev.yml up -d
docker-compose down
docker-compose logs -f
```

---

## 📊 Test Coverage

```bash
# Generate coverage report
npm run test:coverage

# View in browser
open coverage/index.html          # Mac
start coverage/index.html         # Windows
xdg-open coverage/index.html      # Linux

# View in terminal
npm test -- --reporter=text
```

---

## 🔗 Local URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| MongoDB | mongodb://localhost:27017 |
| Redis | redis://localhost:6379 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

---

## 🆘 Troubleshooting

### Tests Won't Start
```bash
npm install
npm test -- --clearCache
npm run docker:down && npm run docker:dev:build
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
VITE_PORT=5174 npm run dev
```

### Docker Issues
```bash
docker system prune -a           # Clean everything
docker-compose build --no-cache  # Rebuild
npm run docker:logs              # Check logs
```

### Tests Timing Out
```bash
npm test -- --testTimeout=30000
npx playwright test --timeout=30000
```

---

## 📚 Documentation

| Docs | Link | Read Time |
|------|------|-----------|
| Full Index | [PHASE5_INDEX.md](./PHASE5_INDEX.md) | 10 min |
| Quick Summary | [PHASE5_COMPLETION_SUMMARY.md](./PHASE5_COMPLETION_SUMMARY.md) | 10 min |
| Tests Guide | [RUNNING_TESTS_GUIDE.md](./RUNNING_TESTS_GUIDE.md) | 15 min |
| Deployment | [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md) | 20 min |
| Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) | 15 min |

---

## ✅ Pre-Commit Checklist

Before committing code:

```bash
npm run type-check        # TypeScript check
npm run lint              # ESLint
npm test                  # All tests
npm run build             # Build check
```

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] All tests passing: `npm test`
- [ ] Coverage >80%: `npm run test:coverage`
- [ ] Build succeeds: `npm run build`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Docker builds: `docker build -t app:latest .`
- [ ] Environment vars set
- [ ] Database backed up
- [ ] Monitoring configured
- [ ] Team notified

---

## 🎯 Common Tasks

### Add New Test
```bash
# 1. Create test file
touch src/__tests__/components/MyComponent.test.tsx

# 2. Write test
# Copy from existing test

# 3. Run test
npm test MyComponent

# 4. Check coverage
npm run test:coverage
```

### Deploy to Production
```bash
# 1. Ensure all tests pass
npm test

# 2. Build locally
npm run build

# 3. Commit and push
git add .
git commit -m "Feature: ..."
git push origin main

# 4. GitHub Actions deploys automatically
# View at: https://github.com/your-org/White-Caves/actions
```

### Debug Test
```bash
# For unit tests
node --inspect-brk node_modules/vitest/vitest.mjs run --inspect-brk

# For E2E tests
npm run test:e2e:debug

# Or use VS Code debugger
# Press F5 with proper launch.json
```

### Update Dependencies
```bash
npm outdated                      # Check outdated
npm update                        # Update all
npm install package@latest        # Update specific

npm test                          # Verify nothing broke
npm run build                     # Test build
```

---

## 🔐 Security Quick Checks

```bash
# No secrets in code
grep -r "password\|secret\|key\|token" src/
# Should return only comments/docs

# Dependency vulnerabilities
npm audit                         # Check
npm audit fix                     # Fix automatically

# Code quality
npm run lint                      # Check lint
npm run type-check                # Check types
```

---

## 📱 View Test Reports

```bash
# Coverage report
npm run test:coverage
open coverage/index.html

# Playwright HTML report
npx playwright show-report

# Vitest UI
npm run test:ui
# Opens http://localhost:51204
```

---

## 🤝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm test
npm run build

# Commit
git commit -m "feat: description"

# Push
git push origin feature/my-feature

# Create PR on GitHub
# After review and approval, merge

# GitHub Actions automatically deploys to staging
# Manual approval needed for production
```

---

## 📞 Getting Help

1. **Check Documentation**
   - [PHASE5_INDEX.md](./PHASE5_INDEX.md) - Navigation
   - [RUNNING_TESTS_GUIDE.md](./RUNNING_TESTS_GUIDE.md) - Testing
   - [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md) - Deployment

2. **Search Code**
   - Similar tests exist, copy the pattern
   - Check component examples in `src/components/`
   - Look at hook examples in `src/hooks/`

3. **Ask Team**
   - Slack: #development
   - Email: dev-team@example.com
   - Office hours: [time/date]

---

## 💡 Pro Tips

### Speed Up Tests
```bash
npm test -- --run --reporter=tap   # Faster reporter
npm test -- useWhatsApp             # Only matching tests
npm run test:e2e -- --workers=4    # Parallel E2E
```

### Faster Docker Builds
```bash
docker build --cache-from white-caves:latest .
# Use buildkit for better caching
DOCKER_BUILDKIT=1 docker build .
```

### Development Mode
```bash
npm run dev:all

# Separate terminals for better logs
npm run server          # Terminal 1
npm run client          # Terminal 2
npm run test:watch     # Terminal 3
```

### View Live Changes
```bash
npm run test:watch          # Tests update live
npm run test:ui             # Visual UI updates
npm run dev                 # Frontend hot reload
```

---

## 🎓 Learning Resources

- **Jest**: https://jestjs.io/
- **Vitest**: https://vitest.dev/
- **React Testing**: https://testing-library.com/
- **Playwright**: https://playwright.dev/
- **Docker**: https://docker.com/
- **GitHub Actions**: https://github.com/features/actions

---

## 📝 Notes

- All tests should pass before committing
- Coverage should remain >80%
- Deployment happens automatically on merge to main
- Monitor Grafana after deployment
- Keep environment variables secure

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Run all tests | 10 min |
| Build Docker image | 3 min |
| Deploy to staging | 5 min |
| Deploy to production | 5 min |
| Run E2E tests | 5 min |
| Check coverage | 2 min |
| Single test | <1 min |

---

**For detailed documentation, see [PHASE5_INDEX.md](./PHASE5_INDEX.md)**

**Last Updated**: January 2024 | **Version**: 1.0.0
├── api/                 # API endpoint tests
└── e2e/                 # End-to-end tests
```

---

## 🐳 Docker Quick Commands

### Development
```bash
npm run docker:dev:build      # Build and start
npm run docker:logs           # View logs
npm run docker:down           # Stop services
npm run docker:test           # Run tests in Docker
```

### Production
```bash
npm run docker:prod:build     # Build production
docker-compose -f docker-compose.prod.yml up -d
npm run docker:logs
npm run docker:down
```

### Common Docker Tasks
```bash
# View running containers
docker ps

# View specific logs
docker logs -f white-caves_app_1

# Execute command in container
docker exec white-caves_app_1 npm run seed

# Restart service
docker restart white-caves_app_1
```

---

## 🚀 Deployment Flow

### Local → Docker → Production

1. **Local Development**
   ```bash
   npm run dev:all
   npm test
   ```

2. **Docker Testing**
   ```bash
   npm run docker:dev:build
   npm run docker:test
   ```

3. **Production Build**
   ```bash
   npm run build
   docker build -t white-caves:v1.0.0 .
   ```

4. **Push & Deploy**
   ```bash
   # GitHub Actions handles this automatically
   git push origin main
   # Pipeline runs: test → build → deploy
   ```

---

## 📊 Environment Variables

### Development (.env.development)
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://mongodb:27017/white-caves-dev
JWT_SECRET=dev-secret
LOG_LEVEL=debug
```

### Production (.env.production)
```env
VITE_API_URL=https://api.whitecaves.com
VITE_ENVIRONMENT=production
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb+srv://user:pass@cluster...
JWT_SECRET=<secure-secret>
LOG_LEVEL=info
```

---

## 🔧 Common Operations

### Database Operations
```bash
# Seed database
npm run seed:small      # 20 records
npm run seed:large      # 200 records

# Database backup
mongodump --uri="<connection-string>" --out=backup

# Database restore
mongorestore --uri="<connection-string>" backup
```

### Code Quality
```bash
npm run type-check      # TypeScript check
npm run lint            # ESLint
npm run build           # Build app
```

### Monitoring
```bash
# View logs
docker-compose logs -f app

# Check health
curl http://localhost:3000/health

# Prometheus metrics
http://localhost:9090

# Grafana dashboards
http://localhost:3001
```

---

## 🔍 Debugging

### Unit Tests
```bash
npm test -- --watch useWhatsAppIntegration
npm test -- --testNamePattern="Account"
```

### E2E Tests
```bash
npm run test:e2e:headed        # Visible browser
npm run test:e2e:debug         # Step through
npx playwright test --grep "Account"
```

### Application
```bash
# View logs
npm run docker:logs

# Debug in VS Code
# Use launch.json configuration
# Set breakpoints and run: Debug > JavaScript Debug Terminal

# Node inspector
node --inspect-brk server/index.js
# Open: chrome://inspect
```

---

## 📈 Performance Monitoring

### Key Metrics to Watch
- **Request Latency**: Target <200ms (p95)
- **Error Rate**: Target <0.1%
- **CPU Usage**: Target <70%
- **Memory Usage**: Target <80%
- **Database Connections**: Healthy if <50% of pool

### Check Status
```bash
# Container stats
docker stats

# Application metrics
curl http://localhost:3000/metrics | head -50

# Database performance
mongo <connection> --eval "db.currentOp()"
```

---

## 🆘 Troubleshooting

### Tests Failing
```bash
# Clear cache
npm test -- --clearCache

# Restart services
npm run docker:down
npm run docker:dev:build

# Check logs
npm run docker:logs
```

### Docker Won't Start
```bash
# Check ports
lsof -i :5173
lsof -i :3000
lsof -i :27017

# Clear Docker cache
docker system prune -a

# Rebuild
npm run docker:dev:build --no-cache
```

### Database Issues
```bash
# Check connection
mongo "<connection-string>"

# Restart database
docker restart white-caves_mongodb_1

# Check logs
docker logs white-caves_mongodb_1
```

### Memory Issues
```bash
# Check usage
docker stats

# Increase limits
# Edit docker-compose.yml
# Add: mem_limit: 4g

# Restart
npm run docker:down
npm run docker:dev:build
```

---

## 📋 Deployment Checklist

### Before Deployment
- [ ] `npm test` - All tests pass
- [ ] `npm run test:coverage` - Coverage >80%
- [ ] `npm run build` - Build succeeds
- [ ] `npm run type-check` - No TypeScript errors
- [ ] `npm run lint` - No linting issues
- [ ] `.env.production` - Variables set
- [ ] Database backup created
- [ ] Team notified

### During Deployment
- [ ] Push to main branch
- [ ] Monitor GitHub Actions
- [ ] Verify staging deployment
- [ ] Approve production deployment
- [ ] Monitor application logs

### After Deployment
- [ ] Check health endpoint
- [ ] Verify key features work
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Gather team feedback

---

## 📚 File Structure Reference

### Test Files
```
src/__tests__/
├── setupTests.ts                      # Jest config
├── utils/testUtils.tsx                # Helpers
├── hooks/
│   ├── useWhatsAppIntegration.test.ts
│   ├── useWhatsAppConversations.test.ts
│   └── useWhatsAppAnalytics.test.ts
├── components/
│   ├── AccountLink.test.tsx
│   └── ChatInterface.test.tsx
├── services/whatsapp.service.test.ts
├── api/whatsapp-api.test.ts
└── e2e/whatsapp-dashboard.spec.ts
```

### Configuration Files
```
Root/
├── .github/workflows/ci-cd.yml        # GitHub Actions
├── docker-compose.dev.yml             # Dev environment
├── docker-compose.prod.yml            # Prod environment
├── Dockerfile                         # Image definition
├── playwright.config.ts               # E2E config
├── vitest.config.js                   # Unit test config
└── tsconfig.json                      # TypeScript config
```

### Documentation
```
Root/
├── PHASE5_TESTING_DEPLOYMENT_GUIDE.md
├── RUNNING_TESTS_GUIDE.md
├── COMPLETE_DEPLOYMENT_GUIDE.md
├── PHASE5_COMPLETION_SUMMARY.md
└── PHASE5_QUICK_REFERENCE.md (this file)
```

---

## 🎯 Key Commands by Role

### Developer
```bash
# Daily workflow
npm run dev:all             # Start everything
npm run test:watch         # Run tests in watch mode
npm run lint               # Check code
npm run build              # Build for production
```

### QA/Tester
```bash
# Testing
npm run test               # Run all tests
npm run test:coverage      # Check coverage
npm run test:e2e           # Run E2E tests
npm run docker:dev:build   # Test in Docker
```

### DevOps/SRE
```bash
# Deployment
npm run docker:prod:build  # Build production image
docker push registry/white-caves:v1.0.0
npm run docker:logs        # Monitor logs
npm run docker:down        # Stop services

# Monitoring
docker stats              # Resource usage
curl http://localhost:3000/health  # Health check
```

---

## 🔗 Important Links

### Local URLs
- Frontend: http://localhost:5173
- API: http://localhost:3000
- API Docs: http://localhost:3000/api-docs
- MongoDB: mongodb://localhost:27017
- Redis: redis://localhost:6379
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

### Production URLs
- Frontend: https://whitecaves.com
- API: https://api.whitecaves.com
- Metrics: https://monitoring.whitecaves.com:9090
- Dashboards: https://monitoring.whitecaves.com:3001

### Documentation
- [Testing Guide](./RUNNING_TESTS_GUIDE.md)
- [Deployment Guide](./COMPLETE_DEPLOYMENT_GUIDE.md)
- [API Documentation](./API_TESTING_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)

---

## ⏱️ Typical Timelines

### Local Development
- Setup: 5 minutes
- Test run: 2 minutes
- Build: 1 minute
- Docker start: 2 minutes

### Deployment
- Build: 5 minutes
- Tests: 15 minutes
- Docker build: 10 minutes
- Deploy: 5 minutes
- Health check: 2 minutes
- **Total: ~40 minutes**

### Rollback
- Decision: <5 minutes
- Rollback: <5 minutes
- Health check: <5 minutes
- **Total: ~15 minutes**

---

## 📞 Getting Help

### Common Issues & Solutions

| Issue | Command | Notes |
|-------|---------|-------|
| Tests fail | `npm test -- --clearCache` | Clear Jest cache |
| Port in use | `lsof -i :3000` | Check what's using port |
| Docker won't start | `docker system prune -a` | Clean Docker state |
| Out of memory | `docker stats` | Check container limits |
| Build fails | `npm install` | Reinstall dependencies |
| TypeScript errors | `npm run type-check` | Run type checker |

### Escalation Path
1. Check documentation (this file)
2. Search logs: `docker logs <container>`
3. Check GitHub Issues
4. Ask team lead
5. Contact DevOps team

---

## 🎓 Learning Path

### New to Project?
1. Read [README.md](./README.md)
2. Run `npm run dev:all`
3. Explore [ARCHITECTURE.md](./ARCHITECTURE.md)
4. Review test files in `src/__tests__/`
5. Read [RUNNING_TESTS_GUIDE.md](./RUNNING_TESTS_GUIDE.md)

### Want to Deploy?
1. Review [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md)
2. Understand CI/CD in [.github/workflows/ci-cd.yml](./.github/workflows/ci-cd.yml)
3. Test locally: `npm run docker:dev:build`
4. Practice rollback: `git revert HEAD`
5. Get approval before production push

### Want to Add Tests?
1. Read [RUNNING_TESTS_GUIDE.md](./RUNNING_TESTS_GUIDE.md)
2. Review existing tests in `src/__tests__/`
3. Copy test template for new test file
4. Run `npm run test:watch` while developing
5. Ensure coverage >80%

---

**Last Updated**: January 2024
**Version**: Phase 5 - Complete
**Status**: Production Ready
