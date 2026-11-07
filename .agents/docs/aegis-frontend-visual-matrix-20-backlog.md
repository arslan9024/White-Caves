# Front-End Visual Matrix — 95% Layout Optimization Specification

> **Document ID:** WC-FE-VISUAL-MATRIX-95  
> **Milestone:** Milestone 25 (Wave 48)  
> **Target:** 78% Layout Debt -> 95%+ Visual & Architectural Excellence  
> **Authority:** Arslan Malik Bashir Ahmad (Managing Director & Founder)  
> **Total Targeted Issues:** 20 Concrete Deliverables  

---

## 🎨 Z-Index Token Layering Architecture

| Token Name | Z-Index Value | Layer Purpose & Elements |
|---|---|---|
| `Z_INDEX.CANVAS` | `0` | Background grid, ambient gradient mesh, particle effects |
| `Z_INDEX.CONTENT` | `10` | Main page cards, tables, dashboard widgets, text flow |
| `Z_INDEX.HEADER` | `40` | Sticky top navigation bar, luxury brand masthead |
| `Z_INDEX.BOTTOM_DOCK` | `50` | Symmetrical floating widget bar (AI Zoe, WhatsApp, Quick Actions) |
| `Z_INDEX.MODAL` | `70` | Organogram tree modal, Kanban task creator, mortgage calculator |
| `Z_INDEX.TOAST` | `90` | Global alerts, compliance notifications, status popups |
| `Z_INDEX.SOVEREIGN` | `100` | MD Sovereign Seal signoff portal, emergency security shield |

---

## 📋 20 Front-End Visual Matrix Issues

| Issue # | Code | Title | Priority | Scope |
|---|---|---|---|---|
| **#1** | `VISUAL-01` | **Universal Layout Shell Container Architecture & Global Theme Synchronization** | `CRITICAL` | Implement UniversalVisualMatrixShell.tsx wrapping all views to manage binary Light/Dark state and eliminate nested layout duplication. |
| **#2** | `VISUAL-02` | **Strict Z-Index Token Hierarchy System (z-0 to z-100 Architecture)** | `CRITICAL` | Create src/styles/zIndexTokens.ts standardizing Canvas(0), Content(10), Header(40), BottomDock(50), Modals(70), Toast(90), SovereignPortal(100). |
| **#3** | `VISUAL-03` | **Bottom Symmetrical Floating Widget Dock Consolidation** | `CRITICAL` | Consolidate disparate floating buttons into BottomSymmetricalDock.tsx with unified spacing, responsive pill geometry, and collision avoidance. |
| **#4** | `VISUAL-04` | **ClickToChat & AI Assistant Floating Trigger Deduplication** | `HIGH` | Merge standalone WhatsApp button and Zoe AI assistant floating icon into a single, unified dual-mode launcher. |
| **#5** | `VISUAL-05` | **Dark/Light Binary Theme Flash Elimination & CSS Token Harmonization** | `HIGH` | Eliminate Flash of Unstyled Content (FOUC) on theme toggle and bind CSS variables to Dark Sovereign Slate (#0F172A) and Pure White (#FFFFFF). |
| **#6** | `VISUAL-06` | **Mobile Bottom Action Drawer & Touch Gesture Isolation** | `HIGH` | Harden mobile navigation drawer with strict touch swipe-to-dismiss gestures and prevent body scrolling when open. |
| **#7** | `VISUAL-07` | **Organogram & Kanban Modal Overlay Z-Index Hierarchy Hardening** | `HIGH` | Ensure AIOrganogramTree modal and DepartmentTaskKanban directives render cleanly above all navigation layers with backdrop blur. |
| **#8** | `VISUAL-08` | **Navigation Header Sticky Backdrop Glassmorphism & Elevation Sync** | `MEDIUM` | Apply unified backdrop-filter blur(16px) with dynamic scroll elevation shadows to prevent content peeking. |
| **#9** | `VISUAL-09` | **Multi-Stage Statutory Approval Modal Viewport Centering & Isolation** | `HIGH` | Isolate MultiStageApprovalModal in dedicated React Portal with focus trap and escape-key listener. |
| **#10** | `VISUAL-10` | **UAE Mortgage Calculator & Currency Switcher Floating Dock Integration** | `MEDIUM` | Dock UAEMortgageCalculatorModal and CurrencySelector triggers symmetrically in bottom widget bar. |
| **#11** | `VISUAL-11` | **3D WebGL Virtual Tour Fullscreen Layering & Control Trap Elimination** | `HIGH` | Guarantee VirtualTourModal WebGL viewport takes full z-60 priority without cutting off executive floating controls. |
| **#12** | `VISUAL-12` | **Global Toast & Alert Notification Stacking Engine** | `HIGH` | Implement z-90 Toast portal preventing alert notifications from overlapping interactive dialogs or bottom bars. |
| **#13** | `VISUAL-13` | **Dynamic Luxury Day/Night Color Palette Harmonization** | `MEDIUM` | Harmonize gold/bronze luxury accents (#D97706 / #F59E0B) across both Dark Sovereign and Light Luxury modes. |
| **#14** | `VISUAL-14` | **Arabic RTL Mirroring for Floating Widgets & Bottom Symmetrical Dock** | `HIGH` | Calibrate RTL positioning coordinates (right vs left) for all floating triggers when Arabic language is active. |
| **#15** | `VISUAL-15` | **High-DPI Retina Luxury Asset Scaling & Icon Geometry Normalization** | `MEDIUM` | Enforce standard 24px/32px icon grid and SVG viewboxes across all 12 corporate department representations. |
| **#16** | `VISUAL-16` | **CSS-in-JS vs Global CSS Deduplication & Redundant Style Purging** | `HIGH` | Prune duplicate styled-component definitions and consolidate global typography tokens into index.css. |
| **#17** | `VISUAL-17` | **Cumulative Layout Shift (CLS < 0.01) & First Contentful Paint (FCP < 0.8s) Optimization** | `CRITICAL` | Reserve aspect-ratio boxes for hero media and dynamic charts to guarantee zero layout shifting. |
| **#18** | `VISUAL-18` | **Vitest Visual Component Layer Isolation & Z-Index Unit Test Suite** | `HIGH` | Write automated unit tests asserting z-index values, theme toggle transitions, and modal portal mounts. |
| **#19** | `VISUAL-19` | **Playwright Visual Collision & Floating Widget E2E Test Suite** | `HIGH` | Automate Playwright visual regression tests checking for zero element overlap on mobile (375px) and desktop (1440px). |
| **#20** | `VISUAL-20` | **95% Front-End Layout Quality Gate & MD Sovereign Seal Production Signoff** | `CRITICAL` | Verify overall layout health surpasses 95% threshold with zero open UI defects and MD Sovereign Founder signoff. |
