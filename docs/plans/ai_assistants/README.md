# White Caves — AI Assistants Planning Hub

> **Folder:** `plans/ai_assistants/`  
> **Last Updated:** April 2026  
> **Total Assistants:** 40  
> **Canonical Master Plan:** [`../MASTER_PLAN.md`](../MASTER_PLAN.md)

---

## Purpose

This folder is the **single planning source of truth** for all 40 White Caves AI assistants. Each assistant has a dedicated file describing:

- What it does (overview + core responsibilities)
- Full capability list
- How it works — step-by-step flow from trigger to output
- API endpoints it uses or owns
- Data flows (receives from / sends to other assistants)
- Frontend components
- Backend services
- Access control (which roles can see / use it)
- Implementation checklist (what's done, what's pending)
- Dependencies on external services or other assistants
- Future enhancements

---

## Assistant Registry — All 40

### 🔵 Executive (1)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 01 | `zoe` | Zoe | Executive Assistant & Strategic Intelligence | ✅ In Code |

### 🔴 Sales (6)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 02 | `clara` | Clara | Leads CRM Manager | ✅ In Code |
| 03 | `sophia` | Sophia | Sales Pipeline Manager | ✅ In Code |
| 04 | `hunter` | Hunter | Lead Prospecting AI | ✅ In Code |
| 05 | `kairos` | Kairos | Luxury Concierge & VIP Experience | 🔲 Planned |
| 06 | `archer` | Archer | Lead Scoring Engine | 🔲 Planned |
| 07 | `prism` | Prism | AI Property Matching Engine | 🔲 Planned |

### 🟢 Operations (6)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 08 | `mary` | Mary | Inventory CRM Manager | ✅ In Code |
| 09 | `daisy` | Daisy | Leasing & Tenant Manager | ✅ In Code |
| 10 | `nancy` | Nancy | HR Manager | ✅ In Code |
| 11 | `sentinel` | Sentinel | Property Monitoring AI | ✅ In Code |
| 12 | `juno` | Juno | Smart Community & Facilities Manager | 🔲 Planned |
| 13 | `vesta` | Vesta | Project & Snagging Coordinator | 🔲 Planned |

### 🟡 Finance (3)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 14 | `theodora` | Theodora | Finance Director | ✅ In Code |
| 15 | `maven` | Maven | Investment Strategy & Portfolio Optimizer | 🔲 Planned |
| 16 | `sage` | Sage | Mortgage & Financing Advisor | 🔲 Planned |

### 🟣 Communications (5)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 17 | `nadia` | Nadia | WhatsApp Meta Cloud API Manager | ✅ In Code |
| 18 | `linda` | Linda | WhatsApp LocalAuth Bot Manager | ✅ In Code |
| 19 | `nina` | Nina | WhatsApp NLP Engine & Bot Intelligence | ✅ In Code |
| 20 | `echo` | Echo | Client Communication History & Timeline | 🔲 Planned |
| 21 | `mira` | Mira | Multilingual Translation Engine | 🔲 Planned |

### ⚖️ Compliance & Legal (3)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 22 | `laila` | Laila | Compliance Officer (KYC/AML/RERA) | ✅ In Code |
| 23 | `evangeline` | Evangeline | Legal Risk Analyst | ✅ In Code |
| 24 | `rex` | Rex | Regulatory Document Verifier | 🔲 Planned |

### 🔧 Technology (5)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 25 | `aurora` | Aurora | CTO & Systems Architect | ✅ In Code |
| 26 | `hazel` | Hazel | Elite Frontend Engineer | ✅ In Code |
| 27 | `willow` | Willow | Elite Backend Engineer | ✅ In Code |
| 28 | `henry` | Henry | Record Keeper & Timeline Master | 🔲 Planned |
| 29 | `iris` | Iris | Virtual Staging & 3D Visualization AI | 🔲 Planned |

### 🎨 Marketing (3)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 30 | `olivia` | Olivia | Marketing & Automation Manager | ✅ In Code |
| 31 | `apex` | Apex | Agent Performance Coach | 🔲 Planned |
| 32 | `halo` | Halo | Client Satisfaction & NPS Tracker | 🔲 Planned |

### 🔮 Intelligence (5)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 33 | `cipher` | Cipher | Predictive Market Analyst | 🔲 Planned |
| 34 | `atlas` | Atlas | Development & Project Intelligence | 🔲 Planned |
| 35 | `oracle` | Oracle | Market Analyst Bot | 🔲 Planned |
| 36 | `flux` | Flux | Real-Time Market Data Feed | 🔲 Planned |
| 37 | `nova` | Nova | New Development & Off-Plan Tracker | 🔲 Planned |

### 🤖 AI Engine (4)

| # | ID | Name | Title | Status |
|---|---|---|---|---|
| 38 | `quill` | Quill | Document Generator Engine | 🔲 Planned |
| 39 | `lumen` | Lumen | Visual Analytics & Reporting Engine | 🔲 Planned |
| 40 | `crest` | Crest | Property Valuation Engine | 🔲 Planned |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ In Code | Registered in `src/store/slices/aiAssistant/registry.ts`, UI components exist |
| 🚧 In Progress | Partially implemented |
| 🔲 Planned | Designed here; not yet in code registry |

---

## Department Summary

| Department | Count | Assistants |
|---|---|---|
| Executive | 1 | Zoe |
| Sales | 6 | Clara, Sophia, Hunter, Kairos, Archer, Prism |
| Operations | 6 | Mary, Daisy, Nancy, Sentinel, Juno, Vesta |
| Finance | 3 | Theodora, Maven, Sage |
| Communications | 5 | Nadia, Linda, Nina, Echo, Mira |
| Compliance/Legal | 3 | Laila, Evangeline, Rex |
| Technology | 5 | Aurora, Hazel, Willow, Henry, Iris |
| Marketing | 3 | Olivia, Apex, Halo |
| Intelligence | 5 | Cipher, Atlas, Oracle, Flux, Nova |
| AI Engine | 3 | Quill, Lumen, Crest |
| **Total** | **40** | |

---

## Implementation Phases

| Phase | Assistants |
|---|---|
| Phase 3 (CRM — Now) | Archer (lead scoring), Quill (docs), Henry (audit log) |
| Phase 4 (WhatsApp) | Nina (bot), Nadia (Meta), Linda (LocalAuth), Echo (history) |
| Phase 5 (Lease) | Maven, Sage, Vesta |
| Phase 6 (Compliance) | Rex, Laila enhancements |
| Phase 7 (Analytics) | Oracle, Cipher, Flux, Lumen, Crest |
| Phase 8 (Arabic) | Mira (multilingual) |
| Phase 9 (RBAC) | Apex, Halo |
| Phase 10 (PWA) | Atlas, Nova, Kairos, Juno, Prism, Iris |

---

## File Index

| File | Assistant | Department |
|------|-----------|------------|
| [01-zoe.md](./01-zoe.md) | Zoe | Executive |
| [02-clara.md](./02-clara.md) | Clara | Sales |
| [03-sophia.md](./03-sophia.md) | Sophia | Sales |
| [04-hunter.md](./04-hunter.md) | Hunter | Sales |
| [05-kairos.md](./05-kairos.md) | Kairos | Sales |
| [06-archer.md](./06-archer.md) | Archer | Sales / AI Engine |
| [07-prism.md](./07-prism.md) | Prism | Sales / AI |
| [08-mary.md](./08-mary.md) | Mary | Operations |
| [09-daisy.md](./09-daisy.md) | Daisy | Operations |
| [10-nancy.md](./10-nancy.md) | Nancy | Operations |
| [11-sentinel.md](./11-sentinel.md) | Sentinel | Operations |
| [12-juno.md](./12-juno.md) | Juno | Operations |
| [13-vesta.md](./13-vesta.md) | Vesta | Operations |
| [14-theodora.md](./14-theodora.md) | Theodora | Finance |
| [15-maven.md](./15-maven.md) | Maven | Finance |
| [16-sage.md](./16-sage.md) | Sage | Finance |
| [17-nadia.md](./17-nadia.md) | Nadia | Communications |
| [18-linda.md](./18-linda.md) | Linda | Communications |
| [19-nina.md](./19-nina.md) | Nina | Communications |
| [20-echo.md](./20-echo.md) | Echo | Communications |
| [21-mira.md](./21-mira.md) | Mira | Communications |
| [22-laila.md](./22-laila.md) | Laila | Compliance |
| [23-evangeline.md](./23-evangeline.md) | Evangeline | Legal |
| [24-rex.md](./24-rex.md) | Rex | Compliance |
| [25-aurora.md](./25-aurora.md) | Aurora | Technology |
| [26-hazel.md](./26-hazel.md) | Hazel | Technology |
| [27-willow.md](./27-willow.md) | Willow | Technology |
| [28-henry.md](./28-henry.md) | Henry | Technology |
| [29-iris.md](./29-iris.md) | Iris | Technology |
| [30-olivia.md](./30-olivia.md) | Olivia | Marketing |
| [31-apex.md](./31-apex.md) | Apex | Marketing |
| [32-halo.md](./32-halo.md) | Halo | Marketing |
| [33-cipher.md](./33-cipher.md) | Cipher | Intelligence |
| [34-atlas.md](./34-atlas.md) | Atlas | Intelligence |
| [35-oracle.md](./35-oracle.md) | Oracle | Intelligence |
| [36-flux.md](./36-flux.md) | Flux | Intelligence |
| [37-nova.md](./37-nova.md) | Nova | Intelligence |
| [38-quill.md](./38-quill.md) | Quill | AI Engine |
| [39-lumen.md](./39-lumen.md) | Lumen | AI Engine |
| [40-crest.md](./40-crest.md) | Crest | AI Engine |
