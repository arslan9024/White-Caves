#!/bin/bash
# Deployment Validation Script for White Caves Inventory System
# Validates all critical systems before staging deployment
# Run: bash scripts/validate-deployment.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  WHITE CAVES INVENTORY SYSTEM - DEPLOYMENT VALIDATION      ║"
echo "║  Checking all critical systems and configurations         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

SUCCESS=0
FAILED=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_item() {
  local name=$1
  local command=$2
  local required=$3
  
  echo -n "Checking $name... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    ((SUCCESS++))
  else
    if [ "$required" = "required" ]; then
      echo -e "${RED}✗ FAILED${NC}"
      ((FAILED++))
    else
      echo -e "${YELLOW}⚠ WARNING${NC}"
      ((WARNINGS++))
    fi
  fi
}

# 1. NODE.JS & NPM
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. ENVIRONMENT & DEPENDENCIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_item "Node.js installed" "node --version" "required"
check_item "npm installed" "npm --version" "required"
check_item "package.json exists" "[ -f package.json ]" "required"
check_item "node_modules installed" "[ -d node_modules ]" "required"

# 2. KEY DEPENDENCIES
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. KEY DEPENDENCIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_item "express installed" "npm list express 2>/dev/null | grep express" "required"
check_item "mongoose installed" "npm list mongoose 2>/dev/null | grep mongoose" "required"
check_item "express-rate-limit installed" "npm list express-rate-limit 2>/dev/null | grep rate-limit" "required"
check_item "express-validator installed" "npm list express-validator 2>/dev/null | grep validator" "required"

# 3. APPLICATION FILES
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. APPLICATION FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_item "Server entry point" "[ -f server/index.js ]" "required"
check_item "Validation middleware" "[ -f server/middleware/validation.js ]" "required"
check_item "Rate limiting middleware" "[ -f server/middleware/rateLimiting.js ]" "required"
check_item "Cache layer" "[ -f server/lib/cache.js ]" "required"
check_item "Inventory routes" "[ -f server/routes/inventory.routes.js ]" "optional"

# 4. ENVIRONMENT CONFIGURATION
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. ENVIRONMENT CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_item ".env file exists" "[ -f .env ] || [ -f .env.staging ] || [ -f .env.example ]" "optional"
check_item ".gitignore configured" "grep -q node_modules .gitignore 2>/dev/null" "optional"

# 5. BUILD & TEST
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. BUILD & TEST CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_item "Vite config present" "[ -f vite.config.js ]" "optional"
check_item "Vitest config present" "[ -f vitest.config.js ]" "optional"
check_item "npm build script" "npm run build 2>&1 | head -1" "optional"

# 6. INVENTORY SYSTEM SPECIFIC
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. INVENTORY SYSTEM MODULES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_item "PropertySourcingService" "[ -f src/services/PropertySourcingServices.js ]" "required"
check_item "ConversationAnalyzer" "[ -f src/services/ConversationAnalyzer.js ]" "required"
check_item "WhatsAppIntegration" "[ -f src/services/WhatsAppWebIntegration.js ]" "optional"

# SUMMARY
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  VALIDATION SUMMARY"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${GREEN}✓ Passed: $SUCCESS${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ DEPLOYMENT READY${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Set environment variables: cp .env.staging .env"
  echo "  2. Install dependencies: npm install"
  echo "  3. Run tests: npm test -- --run"
  echo "  4. Start server: npm run server"
  exit 0
else
  echo -e "${RED}✗ DEPLOYMENT BLOCKED - Fix ${FAILED} error(s) above${NC}"
  exit 1
fi
