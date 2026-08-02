# Tech Replacement Rules & Local Mock Fallback Specification

## 1. Scope & Objective

This document governs technology replacement, upgrade protocols, and local mock fallback mechanisms across the 12 functional domains of White Caves Real Estate LLC. It ensures zero-downtime offline execution and credit preservation during agentic coding sessions.

---

## 🎨 Brand Palette Compliance

- Primary Red (`#EF4444`): Fallback active status indicators, technology deprecation notices.
- Pure White (`#FFFFFF`): Service mapping cards and mock data containers.
- Slate Text (`#1E293B`): Library package names and protocol headers.

---

## 🔗 Inter-Linked Navigation References

- [Engineering Manifest](../core_engineering_manifest.md) — Core engineering guidelines, RUP phases, and tech stack parameters.

---

## 2. 12-Domain Fallback Mapping Ledger

| Domain | Cloud Production Service | Local Mock Fallback | Fallback Trigger Condition |
|---|---|---|---|
| **01. Lead Ingestion** | Webhook API / Portal Aggregator | `mockLeads` (`src/mocks/departmentData.ts`) | Portal network timeout > 3000ms |
| **02. Geospatial Maps** | Google Maps JS API (`#EF4444` pins) | Leaflet / CartoDB tiles fallback | API key quota exhaustion |
| **03. WhatsApp Messaging**| Nadia WhatsApp Gateway | Local Queue Ticker (`whatsappQueue.js`) | Offline / Development mode |
| **04. Multi-Currency FX** | Central Bank Exchange API | Cached Exchange Rates (4-hr TTL) | HTTP 5xx error / Offline |
| **05. Database Layer** | MongoDB Atlas Cluster | Prisma Local Singleton (`server/db.ts`) | MongoDB connectivity lost |
| **06. PDF Contract Export**| Cloud Printing Service | In-Memory `pdf-lib` Synthesizer | Production printer offline |
| **07. Search Engine** | Vector Embeddings | Local `FloatingSearchPill` (`Ctrl+K`) | Search service offline |
| **08. Auth Gateway** | Firebase Auth SSO | `FounderGuard` Short-Circuit (`arslanmalikgoraha@gmail.com`)| Auth handshake failure |
| **09. Ejari Renewal** | DLD Smart Portal API | Local Form 12 Stepper (`Form12Eviction.tsx`) | DLD API sandbox fallback |
| **10. AI Voice/Call Hub** | External Voice Server | Local Ticker Engine (`Zoe` / `Nadia` avatars) | Voice API rate-limited |
| **11. Property Inventory** | Enterprise Inventory API | `companyMasterLedger.json` (9,378 units)| API endpoint unreachable |
| **12. Financial Accounting**| Corporate ERP System | Multi-Currency Integer-Cents Math | ERP connection offline |
