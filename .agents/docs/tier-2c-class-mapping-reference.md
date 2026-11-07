# Tier 2C Consolidation Class Mapping Reference
**Quick lookup guide for all duplicate classes across 10 files**

---

## 🎯 CONSOLIDATION CLASS MAPPINGS

### GROUP 1: HEADERS (Extract First)

**CURRENT PATTERN:** Multiple `.header-*` variations  
**CONSOLIDATE TO:** `.shared-header`, `.shared-header h1/h2`, `.shared-header-subtitle`

| Original File | Original Classes | Maps To |
|---|---|---|
| AIAssistantHub.css | `.hub-header`, `.header-left h1`, `.header-right`, `.header-left p` | `.shared-header` + children |
| AgentsDashboard.css | `.dashboard-header`, `.dashboard-header h1`, `.header-subtitle` | `.shared-header` + h1, subtitle |
| AICommandCenter.css | `.command-center-header`, `.header-left`, `.command-center-title`, `.command-center-subtitle` | `.shared-header` |
| AuroraCTODashboard.css | `.aurora-header`, `.header-left`, `.header-info h2/p`, `.header-right` | `.shared-header` |
| WebDataHarvester.css | `.harvester-header`, `.header-info h3/span` | `.shared-header` |

---

### GROUP 2: STAT CARDS & STATS (Critical - 4+ occurrences)

**CURRENT PATTERN:** `.stat-card`, `.stat-value`, `.stat-label`, `.stat-icon`  
**CONSOLIDATE TO:** `.shared-stat-card`, `.shared-stat-value`, `.shared-stat-label`, `.shared-stat-icon`

| Original File | Original Classes | Maps To | Line Range |
|---|---|---|---|
| AIAssistantHub.css | `.stat-card`, `.stat-icon`, `.stat-info`, `.stat-value`, `.stat-label`, `.stat-item` | `.shared-stat-*` | 36-74 |
| AICommandCenter.css | `.quick-stats-bar` (4 col grid stat display) | `.shared-quick-stats-bar.grid` | 68-73 |
| AgentsDashboard.css | `.stat`, `.stat-value`, `.stat-label` | `.shared-stat-item`, `.shared-stat-value`, `.shared-stat-label` | 143-153 |
| AuroraCTODashboard.css | `.quick-stat`, `.quick-stat.healthy/.degraded/.down/.info`, `.stat-value`, `.stat-label` | `.shared-quick-stat`, `.shared-stat-value` | 121-134 |
| PropertyMatrix.css | (implied in design) | (reference point) | - |

---

### GROUP 3: STATUS BADGES (Critical - 4+ occurrences with variants)

**CURRENT PATTERN:** `.status-badge.*`, `.health-badge.*`, `.agent-status*`  
**CONSOLIDATE TO:** `.shared-badge-status.*`, `.shared-badge-health.*`

| Original File | Original Classes | Variants | Maps To |
|---|---|---|---|
| PropertyMatrix.css | `.status-badge` | `.status-rented`, `.status-available`, `.status-unknown` | `.shared-badge-status.success/.info/.neutral` |
| PropertyDetailsCard.css | `.status-badge` | `.rented`, `.available`, `.sold`, `.reserved` | `.shared-badge-status.*` (4 variants) |
| AuroraCTODashboard.css | `.status-badge` | (inline badge on card) | `.shared-badge-status` |
| AIAssistantSelector.css | `.health-badge` | `.optimal`, `.degraded`, `.offline` | `.shared-badge-health.*` (3 variants) |
| AIAssistantHub.css | `.status-dot` | `.optimal`, `.degraded`, `.offline` | `.shared-status-dot.*` (3 variants) |
| AgentsDashboard.css | `.agent-status` | `.online`, `.offline` | `.shared-badge-status.online/.offline` |

**Full Status Badge Mapping:**
```
Available/Available-for-Rent → .shared-badge-status.success (green)
Rented → .shared-badge-status.success (green)
Occupied → .shared-badge-status.success (green)
Sold → .shared-badge-status.error (red)
Reserved/Pending → .shared-badge-status.warning (yellow)
Unknown/Vacant/Looks-Vacant → .shared-badge-status.neutral (gray)
Online → .shared-badge-status.success (green)
Offline → .shared-badge-status.error (red)
Optimal (health) → .shared-badge-health.optimal (green)
Degraded (health) → .shared-badge-health.degraded (yellow)
Offline (health) → .shared-badge-health.offline (red)
```

---

### GROUP 4: BUTTONS (Critical - 5+ variations)

**CURRENT PATTERN:** `.nav-btn`, `.action-btn`, `.tab-btn`, `.control-btn`, `.toggle-btn`, `.view-btn`, `.open-btn`, `.favorite-btn`  
**CONSOLIDATE TO:** `.shared-nav-btn`, `.shared-btn-primary`, `.shared-btn-secondary`, `.shared-icon-btn`

| Original File | Original Classes | Appears | Maps To |
|---|---|---|---|
| AIAssistantHub.css | `.nav-btn`, `.nav-btn:hover`, `.nav-btn.active`, `.open-btn` | 1x primary + 1x action | `.shared-nav-btn` + `.shared-btn-primary` |
| AIAssistantSelector.css | `.favorite-btn`, `.favorite-btn:hover`, `.favorite-btn.active` | 1x | `.shared-icon-btn` |
| AICommandCenter.css | `.toggle-btn`, `.toggle-btn:hover`, `.toggle-btn.active`, `.header-action` | 2x | `.shared-icon-btn` |
| AgentsDashboard.css | `.action-btn`, `.action-btn:hover`, `.view-btn`, `.view-btn.active` | 2x | `.shared-btn-primary` + `.shared-icon-btn` |
| AuroraCTODashboard.css | `.tab-btn`, `.tab-btn:hover`, `.tab-btn.active`, `.range-btn`, `.refresh-btn` | 3x | `.shared-nav-btn` + `.shared-btn-primary` |
| PropertyMatrix.css | `.view-btn`, `.view-btn:hover` | 1x | `.shared-icon-btn` |
| WebDataHarvester.css | `.control-btn`, `.control-btn.primary`, `.control-btn.danger`, `.import-btn` | 2x | `.shared-btn-primary` + `.shared-btn-danger` |

**Button Type Mapping:**
```
.nav-btn / .tab-btn / .range-btn → .shared-nav-btn
.action-btn / .header-action → .shared-btn-primary
.toggle-btn / .view-btn / .control-btn (secondary) → .shared-icon-btn
.control-btn.primary / .import-btn / .open-btn → .shared-btn-primary
.control-btn.danger / .favorite-btn → .shared-icon-btn (with color override)
```

---

### GROUP 5: CARDS & CONTAINERS (High priority - 3+ occurrences)

**CURRENT PATTERN:** `.agent-card`, `.assistant-card`, `.app-card`, `.health-card`  
**CONSOLIDATE TO:** `.shared-card`, `.shared-card-header`, `.shared-card-footer`

| Original File | Original Classes | Maps To | Line Range |
|---|---|---|---|
| AIAssistantHub.css | `.assistant-card`, `.assistant-card:hover`, `.card-footer` | `.shared-card` + `.shared-card-footer` | 161-253 |
| AgentsDashboard.css | `.agent-card`, `.agent-card:hover` | `.shared-card` | 91-109 |
| AuroraCTODashboard.css | `.app-card`, `.app-card:hover`, `.app-header`, `.app-info` | `.shared-card` | 367-395 |
| PropertyDetailsCard.css | `.property-details-card`, `.card-header` | `.shared-card` + `.shared-card-header` | 1-22 |

---

### GROUP 6: AVATARS (High impact - 3+ occurrences)

**CURRENT PATTERN:** `.avatar*`, `.agent-avatar`, `.owner-avatar`, `.assistant-avatar`  
**CONSOLIDATE TO:** `.shared-avatar`, `.shared-avatar.small`, `.shared-avatar.large`

| Original File | Original Classes | Size | Maps To |
|---|---|---|---|
| AIAssistantHub.css | `.assistant-avatar` | 48px | `.shared-avatar` |
| AIAssistantSelector.css | `.avatar-icon`, `.item-avatar` | 40px, 48px | `.shared-avatar.small`, `.shared-avatar` |
| AgentsDashboard.css | `.agent-avatar` | 60px | `.shared-avatar.large` |
| AuroraCTODashboard.css | `.aurora-avatar`, `.app-icon` | 56px, 48px | `.shared-avatar`, `.shared-avatar` |
| PropertyDetailsCard.css | `.owner-avatar` | 40px | `.shared-avatar.small` |
| OwnerDetailDrawer.css | `.owner-avatar` | 56px | `.shared-avatar.large` |

---

### GROUP 7: LIST ITEMS (Medium priority - 3+ occurrences)

**CURRENT PATTERN:** `.assistant-item`, `.owner-item`, `.property-item`, `.contact-item`  
**CONSOLIDATE TO:** `.shared-list-item`

| Original File | Original Classes | Maps To | Line Range |
|---|---|---|---|
| AIAssistantSelector.css | `.assistant-item`, `.item-left`, `.item-info`, `.item-name`, `.item-title` | `.shared-list-item` + children | 102-166 |
| PropertyDetailsCard.css | `.owner-item`, `.owner-info`, `.owner-name`, `.owner-contacts` | `.shared-list-item` + children | 127-159 |
| OwnerDetailDrawer.css | `.property-item`, `.property-item-info`, `.property-pnumber` | `.shared-list-item` + children | 106-146 |
| OwnerDetailDrawer.css | `.contact-item` | `.shared-list-item` | 88-101 |

---

### GROUP 8: SEARCH INPUTS (Medium priority - 2-3 occurrences)

**CURRENT PATTERN:** `.search-box`, `.matrix-search`, `.search-input`  
**CONSOLIDATE TO:** `.shared-search-input`

| Original File | Original Classes | Maps To | Line Range |
|---|---|---|---|
| AgentsDashboard.css | `.search-box`, `.search-box input`, `.search-box:focus-within` | `.shared-search-input` | 48-74 |
| PropertyMatrix.css | `.matrix-search`, `.matrix-search input` | `.shared-search-input` | 18-30 |
| AIAssistantSelector.css | `.dropdown-search`, `.search-input` | `.shared-search-input` | 49-58 |

---

### GROUP 9: SECTION TITLES (Medium priority - 3+ occurrences)

**CURRENT PATTERN:** `.section-title`, `.section-header`, `.sidebar-title`  
**CONSOLIDATE TO:** `.shared-section-title`

| Original File | Original Classes | Maps To | Line Range |
|---|---|---|---|
| PropertyDetailsCard.css | `.section-title` | `.shared-section-title` | 49-58 |
| OwnerDetailDrawer.css | `.drawer-section h3` | `.shared-section-title` | 68-70 |
| AICommandCenter.css | `.sidebar-title` | `.shared-section-title` | 132-138 |

---

### GROUP 10: PROGRESS BARS (Low priority - 1-2 occurrences)

**CURRENT PATTERN:** `.progress-bar`, `.progress-fill`  
**CONSOLIDATE TO:** `.shared-progress-bar`, `.shared-progress-fill`

| Original File | Original Classes | Maps To | Line Range |
|---|---|---|---|
| WebDataHarvester.css | `.progress-bar`, `.progress-fill` | `.shared-progress-*` | 239-244 |
| AuroraCTODashboard.css | `.progress-bar`, `.progress-fill`, `.mini-progress`, `.mini-fill` | `.shared-progress-*` | 209-224 |

---

## 📋 EXTRACTION SEQUENCE (Recommended Order)

### Wave 1: Foundation (30 mins)
- ✅ GROUP 1: Headers (5-10 mins)
- ✅ GROUP 2: Stats (5-10 mins)
- ✅ GROUP 3: Badges (10-15 mins)

### Wave 2: Components (1 hour)
- GROUP 4: Buttons (10-15 mins)
- GROUP 5: Cards (10-15 mins)
- GROUP 6: Avatars (5-10 mins)

### Wave 3: Remaining (45 mins)
- GROUP 7: List Items (10-15 mins)
- GROUP 8: Search Inputs (5 mins)
- GROUP 9: Section Titles (5 mins)
- GROUP 10: Progress Bars (5 mins)

---

## 🔍 QUICK FIND TABLE

**Looking for where a class appears?**

| Class Pattern | Files | Count | Priority |
|---|---|---|---|
| `.stat-*` | AIAssistantHub, AICommandCenter, AgentsDashboard, AuroraCTODashboard | 4 | 🔴 CRITICAL |
| `.status-badge` | PropertyMatrix, PropertyDetailsCard, AuroraCTODashboard, + variants | 4+ | 🔴 CRITICAL |
| `.header-*` | AIAssistantHub, AgentsDashboard, AICommandCenter, AuroraCTODashboard, WebDataHarvester | 5 | 🔴 CRITICAL |
| Button patterns | AIAssistantHub, AIAssistantSelector, AICommandCenter, AgentsDashboard, AuroraCTODashboard, PropertyMatrix, WebDataHarvester | 7 | 🔴 CRITICAL |
| `.avatar-*` | AIAssistantHub, AIAssistantSelector, AgentsDashboard, AuroraCTODashboard, PropertyDetailsCard, OwnerDetailDrawer | 6 | 🟠 HIGH |
| `.list-item`, `.item-*` | AIAssistantSelector, PropertyDetailsCard, OwnerDetailDrawer | 3 | 🟡 MEDIUM |
| `.section-title` | PropertyDetailsCard, OwnerDetailDrawer, AICommandCenter | 3 | 🟡 MEDIUM |
| `.search-*` | AgentsDashboard, PropertyMatrix, AIAssistantSelector | 3 | 🟡 MEDIUM |
| `.progress-*` | WebDataHarvester, AuroraCTODashboard | 2 | 🟢 LOW |

---

## ✨ CONSOLIDATION BENEFITS

| Metric | Before | After | Improvement |
|---|---|---|---|
| Total CSS Size (10 files) | ~106 KB | ~88-90 KB | -16-18 KB (-15%) |
| Lines to Maintain | 2,275 | ~1,400 unique | -875 lines (-38%) |
| Duplicate Classes | ~40-50 classes | 0 duplicates | 100% elimination |
| Maintenance Points | 10 locations | 3-4 shared files | -60-70% faster updates |
| Design System Ready | No | Yes | Foundation established |
| Developer Learning Curve | High (many patterns) | Low (shared classes) | Easier onboarding |

---

## 🚀 VALIDATION CHECKLIST

After each consolidation group, verify:

- [ ] No CSS parsing errors in build
- [ ] No visual regressions in affected components
- [ ] Classes correctly mapped to shared files
- [ ] Hover/active states working correctly
- [ ] Responsive behavior preserved
- [ ] Dark mode variants functional
- [ ] File size reduced as expected
- [ ] Build time improved (if possible)

---

*Last updated: March 8, 2026 | Ready for Phase 2 extraction*
