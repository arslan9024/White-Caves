# Software Improvement & Technical Replacement Ledger — White Caves Real Estate

> **System Mandate**: 12-Domain Technical Replacement Matrix, Component Refactoring Guidelines, and Fallback Execution Protocol.  
> **Brand Palette**: White Caves Red (`#EF4444`) | Crisp White (`#FFFFFF`) | Deep Slate Gray (`#1E293B`)  
> **Architecture Pattern**: View-Logic-Style Isolation (`*.tsx` presentation shell, `*.logic.ts` hooks & state, `*.style.ts` styles & flex containers).

---

## 🔱 Fallback Execution Protocol (Local Offline Safety)

To ensure zero-downtime development and 100% offline feature unmasking:
1. **Database Fallback Circuit**: If MongoDB/Prisma/DLD REST endpoints experience connection latency (>500ms) or drop offline during local testing passes, all live network modules MUST gracefully fall back to local high-fidelity synthetic mock datasets (`src/mocks/` and `src/data/`).
2. **Media Asset Resilience**: Unsplash real estate CDN image URLs with zero-copyright attributes are hardcoded as primary fallback image nodes for all 100 property units (DAMAC Hills 2 cluster) and 100 employee profiles.
3. **Founder Landing Override**: If the active user profile matches `arslanmalikgoraha@gmail.com`, force-inject `accessLevel: 5` (`LEVEL_5_MASTER`), bypassing token checks to land on `ProfilePage.tsx` before unmasking `UnifiedWorkspaceLayout.tsx`.

---

## 📊 12-Domain Structural Replacement Matrix

| # | Corporate Domain | Legacy Component / Tech | Upgrade Direction & Refactor Rule | Target Fallback Dataset |
|---|------------------|------------------------|-----------------------------------|-------------------------|
| 1 | **Residential Brokerage Sales Hub** | Ad-hoc lead lists, legacy drag handlers | 4-Column Drag-and-Drop Lead Control Grid, View-Logic-Style isolated components | `mockLeads`, `mockAgents` |
| 2 | **Strategic Off-Plan & Development** | Static table displays | Interactive Project Launch Carousel, Tier Matrices, SPA Generator | `mockOffPlanProjects` |
| 3 | **Commercial Real Estate & Investment** | Raw text metrics | Asset Yield Comparator, ROI Heatmaps, Multi-Currency Treasury | `mockCommercialAssets` |
| 4 | **Portfolio Management & Leasing** | Manual Ejari forms | Automated Ejari Contract Lifecycles, PDC Cheque Tracker, Form 7/12 Notices | `mockTenancies`, `mockPDCs` |
| 5 | **Asset Management & Facilities (DH2 Hub)** | Basic inventory lists | High-Density 9,378-Unit Property Matrix, Cluster Tiles, Work Order Kanban | `mockDH2Units` (100 units) |
| 6 | **Revenue, Finance & Treasury** | Manual commission math | Automated 4-Step Approval Flow (Agent ➔ Manager ➔ Finance ➔ Paid), FTA VAT Export | `mockTransactions`, `mockInvoices` |
| 7 | **Performance Marketing & Lead Acquisition** | Disconnected ad metrics | Marketing ROI Scoreboard, Campaign Publisher, Email Nurture Sequence Builder | `mockCampaigns` |
| 8 | **Corporate Comms & Client Experience** | Unmonitored messaging | Nadia WhatsApp Pool Monitor, Real-Time Response SLA Ticker | `mockWhatsAppConversations` |
| 9 | **Executive Office & Strategy** | Split navigation layouts | Unified Workspace Layout, Global Cross-Department Aggregator, Telemetry Cockpit | `mockExecutiveStats` |
| 10 | **Regulatory Affairs & RERA Compliance** | Static checklists | Interactive RERA/DLD Compliance Tracker, Permit Verification Modal | `mockRERAItems` |
| 11 | **Conveyancing & Transaction Management** | Paper form tracking | Digital Signature Collection Flow, Form 6 Lease Log, Escrow Monitor | `mockConveyancingDeals` |
| 12 | **Technology, AI & Market Intelligence** | Raw console logs | AI Assistant Avatar Hub, Sentinel Predictive Pricing Map, IoT Sensor Heatmap | `mockAIAgents`, `mockIoTSensors` |

---

## 🧱 View-Logic-Style Isolation Architecture

All React components MUST follow the 3-file container structure:

```
src/components/shared/CavesButton/
├── CavesButton.tsx       <-- Pure Presentation Shell (The Graphic View)
├── CavesButton.logic.ts   <-- Event Triggers & React Hooks (The Logic)
└── CavesButton.style.ts   <-- CSS Modules & Component Styling (The Style)
```

### 1. `*.tsx` (Pure Presentation Shell)
- Pure graphic interface using brand tokens (`#EF4444`, `#FFFFFF`, `#1E293B`).
- Zero business calculations or state manipulation math.
- Accepts props exclusively from `*.logic.ts`.

### 2. `*.logic.ts` (React Controller Hook)
- Houses `useState`, `useEffect`, `useReducer`, and dispatch utilities.
- Maps synthetic fallback datasets if live APIs fail.
- Exposes typed props and handler callbacks to the view.

### 3. `*.style.ts` (Isolated Component Styles)
- Contains Styled-Components or CSS Modules with hardware-accelerated layouts.
- Focus borders, 0.2s smooth transitions, and brand palette variables.
