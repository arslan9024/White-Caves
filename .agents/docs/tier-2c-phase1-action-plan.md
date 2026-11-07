# Tier 2C Phase 1 Quick Action Plan
**READY-TO-EXECUTE | PHASE 1: Shared Components Base Creation**

---

## 🎯 OBJECTIVES (Phase 1)
Create 3 new shared CSS files as foundation for consolidation of top 3 high-impact files.

**Estimated Time:** 30 minutes  
**Risk Level:** MINIMAL  
**Prerequisite:** None - These are new files

---

## 📋 TASK BREAKDOWN

### TASK 1: Create `src/styles/shared-components-base.css`
**Time:** 15 minutes

**Classes to Include:**

```css
/* HEADERS */
.shared-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 24px;
  flex-wrap: wrap;
}

.shared-header h1,
.shared-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.shared-header-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* CARDS & CONTAINERS */
.shared-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.shared-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.shared-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  border-radius: 12px 12px 0 0;
}

.shared-card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
  margin-top: auto;
}

/* BUTTONS */
.shared-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.shared-btn-primary {
  background: var(--primary-color);
  color: white;
}

.shared-btn-primary:hover {
  filter: brightness(1.1);
}

.shared-btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.shared-btn-secondary:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
}

.shared-icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.shared-icon-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

/* NAV/TAB BUTTONS */
.shared-nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.shared-nav-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.shared-nav-btn.active {
  background: var(--primary-color);
  color: white;
}

/* AVATAR/ICON DISPLAY */
.shared-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-weight: 700;
}

.shared-avatar.small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 14px;
}

.shared-avatar.large {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  font-size: 20px;
}

/* LIST ITEMS */
.shared-list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.shared-list-item:hover {
  border-color: var(--primary);
  background: rgba(220, 38, 38, 0.05);
}

.shared-list-item.selected {
  background: var(--primary-light);
  border-color: var(--primary);
}

/* SEARCH INPUT */
.shared-search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  flex: 1;
  transition: border-color 0.2s;
}

.shared-search-input:focus-within {
  border-color: var(--primary-color);
}

.shared-search-input input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}

.shared-search-input input::placeholder {
  color: var(--text-tertiary);
}

/* SECTION HEADER */
.shared-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.shared-section-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: auto;
}
```

---

### TASK 2: Create `src/styles/shared-badges.css`
**Time:** 10 minutes

**Classes to Include:**

```css
/* BASE BADGE */
.shared-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

/* STATUS BADGES */
.shared-badge-status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.shared-badge-status.success,
.shared-badge-status.rented,
.shared-badge-status.available,
.shared-badge-status.online {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.shared-badge-status.warning,
.shared-badge-status.degraded,
.shared-badge-status.reserved {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.shared-badge-status.error,
.shared-badge-status.offline,
.shared-badge-status.sold {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.shared-badge-status.info,
.shared-badge-status.available-for-rent {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.shared-badge-status.neutral,
.shared-badge-status.unknown {
  background: rgba(107, 114, 128, 0.15);
  color: #6b7280;
}

/* HEALTH BADGES */
.shared-badge-health {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.shared-badge-health.optimal {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.shared-badge-health.degraded {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.shared-badge-health.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* CUSTOM BADGES */
.shared-badge-primary {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.shared-badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.shared-badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.shared-badge-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* TAG BADGES */
.shared-tag {
  display: inline-block;
  padding: 4px 8px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 11px;
  text-transform: capitalize;
}

/* DOT INDICATOR */
.shared-status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.shared-status-dot.optimal {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.shared-status-dot.degraded {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.shared-status-dot.offline {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

/* ENVIRONMENT BADGES */
.shared-badge-env {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.shared-badge-env.production {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.shared-badge-env.staging {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.shared-badge-env.development {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

/* ICON BADGES */
.shared-badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
}
```

---

### TASK 3: Create `src/styles/shared-stats.css`
**Time:** 5 minutes

**Classes to Include:**

```css
/* STAT CARD */
.shared-stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--card-bg);
  border-radius: 12px;
  flex: 1;
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid var(--border-color);
}

.shared-stat-card.alert {
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.02);
}

/* STAT ICON */
.shared-stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

/* STAT INFO CONTAINER */
.shared-stat-info {
  display: flex;
  flex-direction: column;
}

/* STAT VALUE */
.shared-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0;
}

.shared-stat-value.small {
  font-size: 18px;
}

.shared-stat-value.large {
  font-size: 28px;
}

/* STAT LABEL */
.shared-stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

/* STAT ITEM (in grid) */
.shared-stat-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
}

.shared-stat-item.with-divider {
  border-right: 1px solid var(--border-color);
  padding-right: 16px;
}

/* QUICK STAT (inline) */
.shared-quick-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex: 1;
  min-width: 180px;
}

.shared-quick-stat.healthy { color: #10b981; }
.shared-quick-stat.degraded { color: #f59e0b; }
.shared-quick-stat.down { color: #ef4444; }
.shared-quick-stat.info { color: #3b82f6; }

/* QUICK STATS BAR */
.shared-quick-stats-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.shared-quick-stats-bar.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* STAT ROW */
.shared-stat-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

/* METRIC ROW */
.shared-metric {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shared-metric-label {
  width: 60px;
  font-size: 12px;
  color: var(--text-secondary);
}

.shared-metric-value {
  width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 500;
}

.shared-progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.shared-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}
```

---

## ✅ EXECUTION STEPS

### Step 1: Create Files
```bash
# Create new shared CSS directory if needed
mkdir -p src/styles

# Create three new shared files with content above
# File 1: src/styles/shared-components-base.css
# File 2: src/styles/shared-badges.css
# File 3: src/styles/shared-stats.css
```

### Step 2: Import in Main CSS
Add to `src/styles/index.css` or main stylesheet:
```css
@import './shared-components-base.css';
@import './shared-badges.css';
@import './shared-stats.css';
```

### Step 3: Verify Build
```bash
npm run build
# Check for no errors
```

---

## 📊 SUCCESS CRITERIA

✅ All 3 new files created without errors  
✅ Build completes successfully  
✅ No CSS parsing errors  
✅ Files are ready for Phase 2 consolidation

---

## ⏱️ TIMING REFERENCE
- **Task 1 (base):** 15 mins
- **Task 2 (badges):** 10 mins
- **Task 3 (stats):** 5 mins
- **Setup & build:** 5 mins
- **Buffer/Testing:** 5 mins
- **TOTAL:** ~40 mins (safely within 30-min estimate with margin)

---

## 🚀 NEXT: Phase 2 Starts After Phase 1 Complete
Once Phase 1 is complete, proceed to extract and consolidate:
1. AIAssistantHub.css (Priority #1)
2. AgentsDashboard.css (Priority #2)
3. AIAssistantSelector.css (Priority #3)

**See:** Tier_2C_Consolidation_Analysis.md for detailed extraction instructions

---

*Ready to execute Phase 1 immediately*
