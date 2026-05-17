#!/bin/bash

# Production Verification Script
# Verifies all critical systems before deploying to production

echo "================================================"
echo "🚀 WHITE CAVES PRODUCTION VERIFICATION"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check and report
check_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1${NC}"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}❌ $1${NC}"
    ((CHECKS_FAILED++))
  fi
}

echo "📋 CHECKING BUILD & CODE QUALITY"
echo "================================="

# Check Node version
node --version | grep -E "v1[6-9]" > /dev/null
check_status "Node.js version (16+)"

# Check npm version
npm --version | grep -E "[1-9][0-9]" > /dev/null
check_status "npm version (10+)"

# Check package.json exists
[ -f "package.json" ]
check_status "package.json exists"

# Check TypeScript build
npm run type-check > /dev/null 2>&1
check_status "TypeScript compilation clean"

# Check linting
npm run lint > /dev/null 2>&1
check_status "ESLint passed"

# Check tests
npm run test:run > /dev/null 2>&1
check_status "Unit tests passing"

echo ""
echo "📊 CHECKING BUILD ARTIFACTS"
echo "============================="

# Check if build succeeds
npm run build > /dev/null 2>&1
check_status "Production build succeeds"

# Check dist directory exists
[ -d "dist" ]
check_status "dist/ directory created"

# Check bundle size
if [ -d "dist" ]; then
  SIZE=$(du -sh dist | cut -f1)
  echo -e "${GREEN}✅ Bundle size: $SIZE${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ dist/ directory not found${NC}"
  ((CHECKS_FAILED++))
fi

echo ""
echo "🔒 CHECKING SECURITY"
echo "===================="

# Check for hardcoded secrets
grep -r "password\|secret\|api_key" src/ --exclude-dir=node_modules | grep -v "console.log\|comment\|example" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "${GREEN}✅ No hardcoded secrets found${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ Potential hardcoded secrets detected${NC}"
  ((CHECKS_FAILED++))
fi

# Check .env files are gitignored
grep ".env" .gitignore > /dev/null 2>&1
check_status ".env files in .gitignore"

# Check dependencies for vulnerabilities
npm audit > /dev/null 2>&1
check_status "npm audit clean"

echo ""
echo "📈 CHECKING PERFORMANCE"
echo "======================="

# Check main entry point exists
[ -f "src/main.tsx" ] || [ -f "src/main.ts" ] || [ -f "src/index.tsx" ] || [ -f "src/index.ts" ]
check_status "Entry point exists"

# Check public assets
[ -d "public" ]
check_status "Public assets directory"

# Check config files
[ -f "vite.config.js" ]
check_status "Vite configuration"

[ -f "tsconfig.json" ]
check_status "TypeScript configuration"

echo ""
echo "📚 CHECKING DOCUMENTATION"
echo "========================="

[ -f "README.md" ]
check_status "README.md exists"

[ -f "DEPLOYMENT.md" ]
check_status "DEPLOYMENT.md exists"

[ -f "ARCHITECTURE.md" ]
check_status "ARCHITECTURE.md exists"

echo ""
echo "🔧 CHECKING ENVIRONMENT"
echo "======================"

[ -f ".env.example" ] || [ -f ".env.local" ]
check_status "Environment configuration ready"

# Check if database connection info available
grep -i "database\|postgres\|mongo" .env.example > /dev/null 2>&1 || [ -f "DATABASE_CONNECTION_GUIDE.md" ]
check_status "Database setup documented"

echo ""
echo "================================================"
echo "📊 VERIFICATION SUMMARY"
echo "================================================"
echo ""
echo -e "${GREEN}✅ Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Failed: $CHECKS_FAILED${NC}"

TOTAL=$((CHECKS_PASSED + CHECKS_FAILED))
PERCENTAGE=$((CHECKS_PASSED * 100 / TOTAL))

echo ""
echo "Overall Score: $PERCENTAGE% ($CHECKS_PASSED/$TOTAL)"

echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL CHECKS PASSED - READY FOR PRODUCTION${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  SOME CHECKS FAILED - REVIEW REQUIRED${NC}"
  exit 1
fi
