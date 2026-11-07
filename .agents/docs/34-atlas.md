# 34 — Atlas · Development & Project Intelligence

> **ID:** `atlas`  
> **Department:** Intelligence  
> **Title:** Development & Project Intelligence  
> **Color:** `#6366F1` (Indigo)  
> **Avatar:** 🗺️  
> **Phase:** Phase 7 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Investment Manager, Senior Sales Agent

---

## 1. Overview

Atlas is the **off-plan market intelligence engine**. He analyses new development launches, tracks developer track records, monitors project approval status in DLD, identifies gaps in current supply (under-served areas or property types), and evaluates which new projects White Caves should focus on for brokerage or investment. Atlas is the research engine that feeds Vesta (project tracking) and informs Clara/Sophia's off-plan sales strategies.

---

## 2. Core Responsibilities

1. Track all UAE off-plan project launches: developer, location, units, pricing, launch date
2. Evaluate developer track records: delivery on time %, quality scores, cancellation history
3. Gap analysis: identify areas/unit types with insufficient supply relative to demand
4. Investment potential scoring for each project (ROI estimate at handover)
5. Integration with DLD's Oqood registration system (off-plan unit pre-registrations)
6. Alert on new project launches relevant to White Caves' focus areas

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Project register | All active off-plan projects in Dubai: name, developer, area, type, units, status |
| Developer profiles | Track record: on-time delivery %, quality rating, complaints, projects completed |
| Launch alerts | New project matching White Caves focus areas → immediate notification to MD |
| Gap analysis | Area X has 500 demand signals and only 2 new supply projects → opportunity score |
| ROI estimator | Expected price at handover vs launch price → estimated investor profit % |
| DLD Oqood tracker | Units pre-registered vs total launched — demand velocity indicator |
| Market timing signals | Best time to enter a project: early launch pricing vs closer-to-handover |
| Competitor project activity | Which agencies are marketing which projects |

---

## 4. How It Works — End to End

### Step 1 — Data Collection
Weekly cron: `AtlasService.collectProjects()`:
- Scrape developer websites (DAMAC, Emaar, Nakheel, etc.) for new launches
- Parse DLD Oqood data for new unit registrations
- Check Bayut/PF "New Projects" section

### Step 2 — Project Registration
For each new project found: `POST /api/atlas/projects { name, developer, area, units, priceRange, launchDate, handoverDate, paymentPlan }`.

### Step 3 — Developer Scoring
`AtlasService.scoreDeveloper(developerId)`:
- On-time delivery rate (historical projects)
- Average quality complaints
- Financial stability (public info)
- Returns: `{ score: 0–100, rating: 'excellent' | 'good' | 'average' | 'risky' }`

### Step 4 — Gap Analysis
`AtlasService.gapAnalysis(area)`:
- Demand: Cipher's demand index for the area
- Supply: count of projects under construction delivering units in next 24 months
- Gap score = demand / supply ratio → high ratio = opportunity

### Step 5 — ROI Estimate
`AtlasService.estimateROI(project)`:
- Current launch price per sqft
- Cipher's forecast: expected price per sqft at handover date
- Estimated appreciation = (forecast - launch) / launch × 100
- Add rental yield from Cipher for the area/type

### Step 6 — Alerts
New project in White Caves focus area (Dubai Hills, Marina, JVC, Business Bay, DAMAC Hills 2) → `POST /api/notifications { type: 'new_project', ... }` → Nadia WhatsApp to MD: "🆕 New Launch: [Project] by [Developer] in [Area] — [N] units from AED X."

### Step 7 — Brokerage Decision
MD reviews Atlas brief → decides: take project to portfolio (White Caves becomes broker) → Olivia creates marketing campaign → Clara receives leads → Vesta set up project tracking.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/atlas/projects` | List all off-plan projects |
| POST | `/api/atlas/projects` | Add project |
| GET | `/api/atlas/developers` | Developer profiles with scores |
| GET | `/api/atlas/gap-analysis` | Area gap analysis results |
| GET | `/api/atlas/projects/:id/roi` | ROI estimate for a project |
| GET | `/api/atlas/oqood/:projectId` | Oqood registration velocity |
| GET | `/api/atlas/opportunities` | Top opportunities ranked by score |

---

## 6. Data Flows

- **Receives from:** Cipher (area demand + pricing data), DLD Oqood (external), Developer websites (scraped)
- **Sends to:** Vesta (project tracking for White Caves clients), Olivia (project marketing campaigns), Clara (off-plan leads), Zoe (opportunity alerts)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Atlas intelligence dashboard | `src/components/owner/ai/AtlasCRM/` | 🔲 Planned |
| Project pipeline board | Inside dashboard | 🔲 Planned |
| Developer scorecard | Inside dashboard | 🔲 Planned |
| Opportunity map | Map overlay showing gap scores | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| AtlasService | `server/services/AtlasService.ts` | 🔲 Planned |
| Project scraper | `server/jobs/projectScraperJob.ts` | 🔲 Planned |
| Oqood client | `server/integrations/OqoodClient.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full + brokerage decision |
| `investment_manager` | Full read + ROI estimates |
| `senior_agent` | Project data read-only |

---

## 10. Implementation Checklist

- [ ] Register `atlas` in `AI_ASSISTANTS_REGISTRY`
- [ ] Off-plan project model + CRUD
- [ ] Developer model + scoring
- [ ] Gap analysis computation (requires Cipher)
- [ ] ROI estimator
- [ ] Weekly project scraper cron
- [ ] New project alert system
- [ ] Opportunity ranking

---

## 11. Dependencies

- Cipher (area price/demand data)
- DLD Oqood API (external)
- `node-cron` (weekly scraper)
- Vesta (project tracking handoff)

---

## 12. Future Enhancements

- Zoning change detection (DLD master plan API)
- Infrastructure project impact modelling (new metro lines → area appreciation)
- Pre-launch allocation tracking for off-plan units
- Automated DLD feasibility report generation
