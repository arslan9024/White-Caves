#!/bin/bash

# Sidebar Enhancement Implementation Verification Script
# Checks that all Phase 4 sidebar enhancements are properly implemented

echo "=================================================="
echo "Phase 4 Sidebar Enhancement Verification"
echo "=================================================="
echo ""

ERRORS=0
SUCCESS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
  local filepath=$1
  local description=$2
  
  if [ -f "$filepath" ]; then
    echo -e "${GREEN}✓${NC} Found: $description"
    echo "  Path: $filepath"
    ((SUCCESS++))
  else
    echo -e "${RED}✗${NC} Missing: $description"
    echo "  Path: $filepath"
    ((ERRORS++))
  fi
  echo ""
}

check_import() {
  local filepath=$1
  local search_term=$2
  local description=$3
  
  if grep -q "$search_term" "$filepath" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Found: $description"
    echo "  File: $filepath"
    ((SUCCESS++))
  else
    echo -e "${RED}✗${NC} Missing: $description"
    echo "  File: $filepath"
    ((ERRORS++))
  fi
  echo ""
}

# ==================== Check New Files ====================
echo "========== NEW FILES =========="
echo ""

check_file "src/utils/sidebarIconMap.ts" "Department Icon Mapping"
check_file "src/components/sidebars/RelationalLeftSidebar/SidebarSearch.tsx" "SidebarSearch Component"
check_file "src/components/sidebars/RelationalRightSidebar/AssistantCard.tsx" "AssistantCard Component"

# ==================== Check Documentation ====================
echo "========== DOCUMENTATION =========="
echo ""

check_file "SIDEBAR_ENHANCEMENT_GUIDE.md" "Comprehensive Implementation Guide"
check_file "PHASE_4_SIDEBAR_VISUAL_SUMMARY.md" "Visual Summary & Architecture"

# ==================== Check Tests ====================
echo "========== TESTS =========="
echo ""

check_file "test/sidebar-enhancements.test.ts" "Sidebar Enhancements Test Suite"

# ==================== Check Imports ====================
echo "========== IMPORTS IN UPDATED FILES =========="
echo ""

check_import "src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx" "SidebarSearch" "SidebarSearch imported in RelationalLeftSidebar"
check_import "src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx" "getDepartmentIcon" "getDepartmentIcon imported in RelationalLeftSidebar"
check_import "src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx" "useState" "useState imported for search state"
check_import "src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx" "useMemo" "useMemo imported for search filtering"

check_import "src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx" "AssistantCard" "AssistantCard imported in RelationalRightSidebar"
check_import "src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx" "useState" "useState imported for collapsible state"

# ==================== Check Features ====================
echo "========== FEATURE IMPLEMENTATION =========="
echo ""

check_import "src/utils/sidebarIconMap.ts" "DEPARTMENT_ICONS" "Department Icons constant defined"
check_import "src/utils/sidebarIconMap.ts" "getDepartmentIcon" "getDepartmentIcon function defined"
check_import "src/utils/sidebarIconMap.ts" "ASSISTANT_STATUS_COLORS" "Status colors defined"
check_import "src/utils/sidebarIconMap.ts" "getStatusColor" "getStatusColor function defined"
check_import "src/utils/sidebarIconMap.ts" "getStatusLabel" "getStatusLabel function defined"

check_import "src/components/sidebars/RelationalLeftSidebar/SidebarSearch.tsx" "React" "SidebarSearch React import"
check_import "src/components/sidebars/RelationalLeftSidebar/SidebarSearch.tsx" "styled-components" "SidebarSearch styled-components"

check_import "src/components/sidebars/RelationalRightSidebar/AssistantCard.tsx" "React" "AssistantCard React import"
check_import "src/components/sidebars/RelationalRightSidebar/AssistantCard.tsx" "styled-components" "AssistantCard styled-components"
check_import "src/components/sidebars/RelationalRightSidebar/AssistantCard.tsx" "AssistantCardProps" "AssistantCard Props interface defined"

# ==================== Check State Management ====================
echo "========== STATE MANAGEMENT =========="
echo ""

check_import "src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx" "searchQuery" "Search query state in LeftSidebar"
check_import "src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx" "filteredDepartments" "Filtered departments state in LeftSidebar"

check_import "src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx" "expandedSections" "Collapsible sections state in RightSidebar"
check_import "src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx" "toggleSection" "Toggle section handler in RightSidebar"

# ==================== Check Styling ====================
echo "========== STYLING & COMPONENTS =========="
echo ""

check_import "src/components/sidebars/RelationalLeftSidebar/SidebarSearch.tsx" "SearchInput" "SearchInput styled component"
check_import "src/components/sidebars/RelationalLeftSidebar/SidebarSearch.tsx" "SearchContainer" "SearchContainer styled component"

check_import "src/components/sidebars/RelationalRightSidebar/AssistantCard.tsx" "CardWrapper" "CardWrapper styled component"
check_import "src/components/sidebars/RelationalRightSidebar/AssistantCard.tsx" "StatusDot" "StatusDot styled component"
check_import "src/components/sidebars/RelationalRightSidebar/AssistantCard.tsx" "NotificationBadge" "NotificationBadge styled component"

check_import "src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx" "CollapsibleSectionHeader" "CollapsibleSectionHeader styled component"
check_import "src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx" "CollapsibleContent" "CollapsibleContent styled component"

# ==================== Summary ====================
echo ""
echo "=================================================="
echo "VERIFICATION SUMMARY"
echo "=================================================="
echo -e "${GREEN}✓ Passed: $SUCCESS${NC}"
echo -e "${RED}✗ Failed: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ All sidebar enhancements verified!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please review the missing items above.${NC}"
  exit 1
fi
