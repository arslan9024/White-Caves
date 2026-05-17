.PHONY: help install dev build test coverage lint clean deploy deploy-vercel deploy-docker deploy-staging verify-production serve

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help:
	@echo "$(GREEN)White Caves Dashboard - Deployment Commands$(NC)"
	@echo "============================================="
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@echo "  make dev                - Start development server"
	@echo "  make install            - Install dependencies"
	@echo "  make clean              - Clean build artifacts"
	@echo ""
	@echo "$(YELLOW)Testing & Quality:$(NC)"
	@echo "  make test               - Run all tests"
	@echo "  make coverage           - Run tests with coverage"
	@echo "  make lint               - Run ESLint"
	@echo "  make type-check         - Run TypeScript checks"
	@echo ""
	@echo "$(YELLOW)Build & Deployment:$(NC)"
	@echo "  make build              - Build for production"
	@echo "  make serve              - Serve production build locally"
	@echo "  make verify-production  - Verify production readiness"
	@echo ""
	@echo "$(YELLOW)Deploy:$(NC)"
	@echo "  make deploy             - Deploy to production (choose option)"
	@echo "  make deploy-vercel      - Deploy to Vercel"
	@echo "  make deploy-docker      - Deploy with Docker"
	@echo "  make deploy-staging     - Deploy to staging"
	@echo ""

# Installation
install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✅ Dependencies installed$(NC)"

# Development
dev:
	@echo "$(GREEN)Starting development server...$(NC)"
	npm run dev

# Testing
test:
	@echo "$(GREEN)Running all tests...$(NC)"
	npm run test:run
	@echo "$(GREEN)✅ Tests complete$(NC)"

coverage:
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	npm run test:coverage
	@echo "$(GREEN)✅ Coverage report generated$(NC)"

lint:
	@echo "$(GREEN)Running ESLint...$(NC)"
	npm run lint
	@echo "$(GREEN)✅ Linting complete$(NC)"

type-check:
	@echo "$(GREEN)Running TypeScript type check...$(NC)"
	npm run type-check
	@echo "$(GREEN)✅ Type checking complete$(NC)"

# Build
build: test lint type-check
	@echo "$(GREEN)Building for production...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Production build complete$(NC)"
	@echo "$(YELLOW)📊 Build artifacts:$(NC)"
	@ls -lh dist/ | head -10

# Clean
clean:
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -rf .next/
	rm -rf coverage/
	@echo "$(GREEN)✅ Cleanup complete$(NC)"

# Serve
serve: build
	@echo "$(GREEN)Serving production build...$(NC)"
	npm run preview

# Verification
verify-production:
	@echo "$(GREEN)Verifying production readiness...$(NC)"
	@echo "$(YELLOW)Checking build...$(NC)"
	@[ -d "dist" ] && echo "$(GREEN)✅ Build directory exists$(NC)" || echo "$(RED)❌ Build directory missing$(NC)"
	@echo "$(YELLOW)Checking package.json...$(NC)"
	@[ -f "package.json" ] && echo "$(GREEN)✅ package.json exists$(NC)" || echo "$(RED)❌ package.json missing$(NC)"
	@echo "$(YELLOW)Checking dependencies...$(NC)"
	npm list --depth=0 | head -20
	@echo "$(GREEN)✅ Production verification complete$(NC)"

# Deployment
deploy: build verify-production
	@echo "$(GREEN)Preparing for deployment...$(NC)"
	@echo ""
	@echo "$(YELLOW)Choose deployment method:$(NC)"
	@echo "  1. make deploy-vercel    - Deploy to Vercel (Recommended)"
	@echo "  2. make deploy-docker    - Deploy with Docker"
	@echo "  3. make deploy-staging   - Deploy to staging"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Review DEPLOYMENT_CHECKLIST.md"
	@echo "  2. Run: make deploy-vercel  (or your chosen method)"
	@echo "  3. Monitor: Check Sentry and analytics"
	@echo ""

deploy-vercel: verify-production
	@echo "$(GREEN)Deploying to Vercel...$(NC)"
	@echo "$(YELLOW)Checking for Vercel CLI...$(NC)"
	@which vercel > /dev/null || npm install -g vercel
	@echo "$(GREEN)Starting Vercel deployment...$(NC)"
	vercel --prod
	@echo "$(GREEN)✅ Deployment to Vercel initiated$(NC)"
	@echo "$(YELLOW)Monitor at: https://vercel.com/dashboard$(NC)"

deploy-docker: verify-production
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -t white-caves:latest .
	@echo "$(GREEN)✅ Docker image built$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Test locally: docker run -p 3000:3000 white-caves:latest"
	@echo "  2. Tag image: docker tag white-caves:latest <registry>/white-caves:latest"
	@echo "  3. Push: docker push <registry>/white-caves:latest"
	@echo "  4. Deploy to your container orchestration platform"
	@echo ""

deploy-staging: build
	@echo "$(GREEN)Deploying to staging environment...$(NC)"
	@echo "$(YELLOW)Checking staging environment...$(NC)"
	@[ -n "$$STAGING_URL" ] && echo "$(GREEN)✅ Staging URL: $$STAGING_URL$(NC)" || echo "$(YELLOW)⚠️  STAGING_URL not set$(NC)"
	@echo "$(GREEN)Starting staging deployment...$(NC)"
	@echo "$(YELLOW)Build ready at: dist/$(NC)"
	@echo "$(YELLOW)Deploy these files to your staging server$(NC)"
	@echo ""
	@echo "$(YELLOW)Instructions:$(NC)"
	@echo "  1. Copy dist/ to staging server"
	@echo "  2. Run database migrations"
	@echo "  3. Verify all endpoints"
	@echo "  4. Run smoke tests"
	@echo "  5. Approve for production"

# Phony targets
.PHONY: help install dev build test coverage lint clean deploy serve verify-production
