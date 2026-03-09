# TIER 2B: Quick Reference - CSS Classes for Consolidation

**Document:** Quick lookup guide for class names and consolidation mapping  
**Generated:** March 8, 2026  
**Purpose:** Fast identification of what to consolidate and where

---

## TABLE 1: Header Component Classes (Remove & Consolidate)

| Component | Clara | Linda | Mary | Nancy | Nina | Olivia | Pattern | Action |
|-----------|-------|-------|------|-------|------|--------|---------|--------|
| **Header Container** | `.clara-header` | `.linda-header` | `.mary-header` | `.nancy-header` | `.nina-header` | (in automation panels) | FLEX, justify-between, padding 16-20px | ➜ `.crm-header` |
| **Avatar** | `.clara-avatar` | `.linda-avatar` | `.mary-avatar` | `.nancy-avatar` | `.nina-avatar` | (in panels) | 48px × 48px, flex center | ➜ `.crm-header__avatar` |
| **Title H2** | `.clara-details h2` | `.linda-details h2` | `.mary-details h2` | `.nancy-details h2` | `.nina-details h2` | (in panels) | font-size 18px, weight 700 | ➜ `.crm-header__title` |
| **Status** | `.clara-status` | `.linda-status` | `.mary-status` | `.nancy-status` | `.nina-status` | (none) | opacity 0.9, padding 4px 12px | ➜ `.crm-header__status` |
| **Status Active** | (none) | `.active::before` | (none) | `.active` variant | `.active` variant | (none) | bg rgba green | ➜ `.crm-header__status.active` |
| **Actions Container** | `.clara-actions` | `.linda-actions` | `.mary-actions` | (implicit flex) | (implicit flex) | (none) | display flex, gap 8-10px | ➜ `.crm-header__actions` |

**Exact REGEX to find all instances:**
```regex
(\.clara-header|\.linda-header|\.mary-header|\.nancy-header|\.nina-header|\.clara-avatar|\.linda-avatar|\.mary-avatar|\.nancy-avatar|\.nina-avatar)
```

**Estimated removal:** ~2,640 bytes total (440 bytes × 6 files)

---

## TABLE 2: Card Container Classes (Remove & Consolidate)

| Component | Clara | Linda | Mary | Nancy | Nina | Olivia | Bytes | Target Class |
|-----------|-------|-------|------|-------|------|--------|-------|---|
| **Card Base** | `.lead-card` | `.conversation-item` | `.stat-card` | `.job-card` | `.bot-card` | `.automation-panel` | 150/each | `.crm-card` |
| **Card Hover** | `:hover` styles | `:hover` styles | `:hover` styles | `:hover` styles | `:hover` styles | `:hover` styles | 75/each | `.crm-card:hover` |
| **Card Selected** | (implicit) | `.selected` | (implicit) | (implicit) | `.selected` | (implicit) | 65/each | `.crm-card.selected` |
| **Card Background** | var(--bg-secondary) | var(--bg-secondary) | var(--bg-card) | var(--bg-secondary) | var(--bg-secondary) | var(--bg-secondary) | — | Use CSS vars |
| **Card Border** | 1px solid border-color | 1px solid border-color | 1px solid border-color | 1px solid border-color | 1px solid border-color | 1px solid border-color | — | Use CSS vars |
| **Card Padding** | 16px | 14px | 16px | 1.25rem | 1.25rem | 1rem 1.25rem | — | Normalize to 1rem |
| **Card Radius** | 12px | implicit | 12px | 12px | 12px | 12px | — | Normalize to 12px |

**Consolidation Priority:** 🔴 HIGH (appears 6 times)  
**Estimated removal:** ~1,500 bytes total (250 bytes × 6 files)

---

## TABLE 3: Status Badge Classes (Remove & Consolidate)

### Clara Badges
| Badge Type | Class Name | Colors | Line Count |
|---|---|---|---|
| Lead Status: Qualified | `.lead-card-status.qualified` | bg: #dcfce7, color: #16a34a | 3 |
| Lead Status: Interested | `.lead-card-status.interested` | bg: #dbeafe, color: #2563eb | 3 |
| Lead Status: Contacted | `.lead-card-status.contacted` | bg: #fef3c7, color: #f59e0b | 3 |
| Lead Status: Lost | `.lead-card-status.lost` | bg: #fee2e2, color: #ef4444 | 3 |
| Task Priority: High | `.task-priority.high` | bg: #fee2e2, color: #ef4444 | 3 |
| Task Priority: Medium | `.task-priority.medium` | bg: #fef3c7, color: #f59e0b | 3 |
| Task Priority: Low | `.task-priority.low` | bg: #dcfce7, color: #16a34a | 3 |

### Linda Badges
| Badge Type | Class Name | Colors | Line Count |
|---|---|---|---|
| Unread Count | `.unread-badge` | bg: #25D366, color: white | 7 |
| Priority Badge | `.priority-badge` | custom per type | 5 |
| Status Online | `.status-dot.online` | bg: #22c55e | 3 |
| Status Offline | `.status-dot.offline` | bg: #9ca3af | 3 |
| Status Away | `.status-dot.away` | bg: var(--color-warning) | 3 |

### Mary Badges
| Badge Type | Class Name | Colors | Line Count |
|---|---|---|---|
| Status Badge | `.status-badge` | semantic colors | 4 |
| Featured Badge | `.featured-badge` | gradient amber-orange | 6 |
| Type Badge | `.type-badge` | bg: #e5e7eb, color: #6b7280 | 5 |
| Purpose: Sale | `.purpose-badge.sale` | bg: #dcfce7, color: #16a34a | 3 |
| Purpose: Rent | `.purpose-badge.rent` | bg: #dbeafe, color: #2563eb | 3 |

### Nancy Badges
| Badge Type | Class Name | Colors | Line Count |
|---|---|---|---|
| Department Badge | `.dept-badge` | bg: tertiary, color: secondary | 5 |
| Job Status | `.job-status` | semantic colors | 4 |
| Requirement Tag | `.requirement-tag` | bg: tertiary, color: secondary | 3 |
| Requirement More | `.requirement-tag.more` | bg/color pink | 3 |

### Nina Badges
| Badge Type | Class Name | Colors | Line Count |
|---|---|---|---|
| Connected Badge | `.status-badge.connected` | bg: #dcfce7, color: #10b981 | 3 |
| Disconnected Badge | `.status-badge.disconnected` | bg: #fee2e2, color: #ef4444 | 3 |
| Pending Badge | `.status-badge.pending` | bg: #fef3c7, color: #f59e0b | 3 |

### Olivia Badges
| Badge Type | Class Name | Colors | Line Count |
|---|---|---|---|
| Connected Status | `.connection-status.connected` | bg: success-15, color: success | 3 |
| Disconnected Status | `.connection-status.disconnected` | bg: error-15, color: error | 3 |
| Demand: High | `.demand-badge.high` | bg: warning-15, color: warning | 3 |
| Demand: Very High | `.demand-badge.very-high` | bg: error-15, color: error | 3 |
| Demand: Stable | `.demand-badge.stable` | bg: success-15, color: success | 3 |
| Sold Out | `.sold-out-badge` | bg: error-15, color: error | 3 |
| Available | `.available-badge` | bg: success-15, color: success | 3 |

**Total Badge Classes:** 51 instances  
**Consolidation Priority:** 🔴 HIGH (appears 6 times with ~7 variants each)  
**Estimated removal:** ~3,120 bytes total (520 bytes × 6 files)

**Consolidated Mapping:**
```
.lead-card-status.qualified → .crm-badge.success
.lead-card-status.interested → .crm-badge.info
.lead-card-status.contacted → .crm-badge.warning
.lead-card-status.lost → .crm-badge.danger
.task-priority.high → .crm-badge.danger
.task-priority.medium → .crm-badge.warning
.task-priority.low → .crm-badge.success
.unread-badge → .crm-badge.primary
.status-dot.online → .crm-badge.online
.status-dot.offline → .crm-badge.offline
.status-badge.connected → .crm-badge.online
.status-badge.disconnected → .crm-badge.offline
.status-badge.pending → .crm-badge.warning
.demand-badge.high → .crm-badge.warning
.demand-badge.very-high → .crm-badge.danger
.demand-badge.stable → .crm-badge.success
.connection-status.connected → .crm-badge.online
.connection-status.disconnected → .crm-badge.offline
```

---

## TABLE 4: Action Button Classes (Remove & Consolidate)

| Component | Clara | Linda | Mary | Nancy | Nina | Olivia | Bytes Each | Target |
|-----------|-------|-------|------|-------|------|--------|-----------|--------|
| **Base Button** | `.card-action-button` | `.chat-action-btn` | `.action-btn` | `.icon-btn` | `.bot-action-btn` | `.action-btn` | 160 | `.crm-action-btn` |
| **Button Hover** | `:hover` | `:hover` | `:hover` | `:hover` | `:hover` | `:hover` | 80 | `.crm-action-btn:hover` |
| **Button Danger Variant** | `.danger:hover` | (none) | `.delete:hover` | `.danger:hover` | (none) | (secondary) | 60 | `.crm-action-btn.danger` |
| **Button Primary Variant** | (none) | (none) | (none) | (none) | `.start` | `.primary` | 70 | `.crm-action-btn.primary` |
| **Button View Variant** | (implicit) | (implicit) | `.view:hover` | (implicit) | (refresh) | (none) | 50 | `.crm-action-btn.view` |
| **Button Edit Variant** | (implicit) | (implicit) | `.edit:hover` | (implicit) | (settings) | (none) | 50 | `.crm-action-btn.edit` |

**Consolidation Priority:** 🟠 MEDIUM-HIGH (appears 6 times)  
**Estimated removal:** ~1,800 bytes total (300 bytes × 6 files)

---

## TABLE 5: Stat Card Classes (Remove & Consolidate)

| Component | Clara | Linda | Mary | Nancy | Nina | Olivia | Line Count | Target |
|-----------|-------|-------|------|-------|------|--------|-----------|--------|
| **Stat Card Container** | `.insight-card` | (implicit in stats) | `.stat-card` | `.stat-card` | (implicit) | `.insight-card` | 8-10 lines | `.crm-stat-card` |
| **Stat Value (Number)** | `.insight-value` | `.stat-value` | `.stat-value` | `.stat-num` | (in details) | `.insight-value` | 3-4 lines | `.crm-stat-value` |
| **Stat Label (Text)** | `.insight-title` | `.stat-label` | `.stat-label` | `.stat-text` | (in details) | `.insight-label` | 3-4 lines | `.crm-stat-label` |
| **Stat Change (Trend)** | `.insight-change` | (none) | (none) | (none) | (none) | `.insight-change` | 4-5 lines | `.crm-stat-change` |

**Consolidation Priority:** 🟠 MEDIUM (appears 5 times)  
**Estimated removal:** ~1,400 bytes total (280 bytes × 5 files)

---

## TABLE 6: Tab Navigation Classes (Remove & Consolidate)

| Component | Clara | Linda | Mary | Nancy | Nina | Olivia | Bytes | Target |
|-----------|-------|-------|------|-------|------|--------|-------|--------|
| **Tab Container** | `.clara-tabs-nav` | (implicit in layout) | (implicit) | `.nancy-tabs` | `.nina-tabs` | (panel-based) | 60 | `.crm-tabs` |
| **Tab Button** | `.tab-nav-button` | (implicit) | (implicit) | `.nancy-tab` | `.nina-tab` | (implicit) | 150 | `.crm-tab` |
| **Tab Active State** | `.active` | (implicit) | (implicit) | `.active` | `.active` | (implicit) | 80 | `.crm-tab.active` |
| **Tab Hover State** | (implicit) | (implicit) | (implicit) | (implicit) | `:hover:not(.active)` | (implicit) | 80 | `.crm-tab:hover` |
| **Scrollbar Styling** | `::-webkit-scrollbar` | (implicit) | (implicit) | (implicit) | (implicit) | (implicit) | 50 | Consolidate |

**Consolidation Priority:** 🟠 MEDIUM (appears 5 times)  
**Estimated removal:** ~1,550 bytes total (310 bytes × 5 files)

---

## CONSOLIDATED CLASS REFERENCE

### New Base Classes (crm-base.css)

```css
/* Headers */
.crm-header { }
.crm-header__avatar { }
.crm-header__title { }
.crm-header__status { }
.crm-header__status.active { }
.crm-header__actions { }

/* Cards */
.crm-card { }
.crm-card:hover { }
.crm-card.selected { }

/* Badges - Semantic */
.crm-badge { }
.crm-badge.success { }
.crm-badge.warning { }
.crm-badge.danger { }
.crm-badge.info { }
.crm-badge.neutral { }
.crm-badge.online { }
.crm-badge.offline { }
.crm-badge.pending { }

/* Buttons */
.crm-action-btn { }
.crm-action-btn:hover { }
.crm-action-btn.danger { }
.crm-action-btn.primary { }
.crm-action-btn.view { }
.crm-action-btn.edit { }

/* Stats */
.crm-stat-card { }
.crm-stat-value { }
.crm-stat-label { }
.crm-stat-change { }
.crm-stat-change.positive { }
.crm-stat-change.negative { }

/* Tabs */
.crm-tabs { }
.crm-tab { }
.crm-tab.active { }
.crm-tab:hover { }
```

---

## MIGRATION SCRIPT - Find & Replace Mapping

**For ClaraLeadsCRM.css:**
```
.clara-header → .crm-header
.clara-avatar → .crm-header__avatar
.clara-details h2 → .crm-header__title
.clara-status → .crm-header__status
.clara-actions → .crm-header__actions
.lead-card → .crm-card
.lead-card-status.qualified → .crm-badge.success
.lead-card-status.interested → .crm-badge.info
.lead-card-status.contacted → .crm-badge.warning
.lead-card-status.lost → .crm-badge.danger
.task-priority.high → .crm-badge.danger
.task-priority.medium → .crm-badge.warning
.task-priority.low → .crm-badge.success
.card-action-button → .crm-action-btn
.insight-card → .crm-stat-card
.insight-value → .crm-stat-value
.insight-title → .crm-stat-label
.insight-change → .crm-stat-change
.tab-nav-button → .crm-tab
```

**For LindaWhatsAppCRM.css:**
```
.linda-header → .crm-header
.linda-avatar → .crm-header__avatar
.linda-details h2 → .crm-header__title
.linda-status → .crm-header__status
.linda-actions → .crm-header__actions
.conversation-item → .crm-card
.unread-badge → .crm-badge.numeric
.status-dot.online → .crm-badge.online
.status-dot.offline → .crm-badge.offline
.status-dot.away → .crm-badge.warning
.chat-action-btn → .crm-action-btn
```

(Continue similar pattern for Mary, Nancy, Nina, Olivia...)

---

## IMPLEMENTATION CHECKLIST

**Phase 1: Create crm-base.css**
- [ ] Create file at `src/styles/crm-base.css`
- [ ] Copy header component architecture
- [ ] Copy card component patterns
- [ ] Copy badge system (10+ variants)
- [ ] Copy action button styles
- [ ] Copy stat card styles
- [ ] Copy tab navigation styles
- [ ] Add CSS variables for theme colors
- [ ] Test in browser for visual regression

**Phase 2: Update ClaraLeadsCRM.css**
- [ ] Add `@import url('../../../styles/crm-base.css');` at top
- [ ] Remove ~1,840 bytes of duplicate styles
- [ ] Update class selectors using mapping above
- [ ] Add Clara-specific color gradient overrides
- [ ] Test rendering in localhost:5000
- [ ] Verify all interactive states work

**Phase 3: Update LindaWhatsAppCRM.css**
- [ ] Add import statement
- [ ] Remove ~1,620 bytes of duplicates
- [ ] Update class selectors
- [ ] Test WhatsApp-specific features
- [ ] Verify message styling intact

**Phase 4: Update MaryInventoryCRM.css**
- [ ] Add import statement
- [ ] Remove ~1,840 bytes of duplicates
- [ ] Update class selectors
- [ ] Test table and form styling
- [ ] Verify property cards display correctly

**Phase 5: Update NancyHRCRM.css**
- [ ] Add import statement
- [ ] Remove ~1,780 bytes of duplicates
- [ ] Update class selectors
- [ ] Test HR-specific components
- [ ] Verify all 5-column stats grid works

**Phase 6: Update NinaWhatsAppBotCRM.css**
- [ ] Add import statement
- [ ] Remove ~1,440 bytes of duplicates
- [ ] Update class selectors
- [ ] Test bot management features
- [ ] Verify terminal and code views intact

**Phase 7: Update OliviaMarketingCRM.css**
- [ ] Add import statement
- [ ] Remove ~1,650 bytes of duplicates
- [ ] Update class selectors
- [ ] Test marketing-specific features
- [ ] Verify automation panels working

**Phase 8: Final Testing**
- [ ] Run visual regression test on all 6 CRM modules
- [ ] Check dark theme application
- [ ] Verify responsive breakpoints
- [ ] CSS coverage audit
- [ ] Performance metrics

**Phase 9: Commit**
- [ ] Create detailed commit message
- [ ] Reference TIER_2B_CSS_CONSOLIDATION_ANALYSIS.md
- [ ] Include before/after metrics
- [ ] Push to main branch

---

**Generated:** March 8, 2026  
**For:** Tier 2B CSS Consolidation Phase 4.6  
**Status:** Ready for Implementation
