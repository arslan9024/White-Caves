# White Caves Real Estate LLC — Software Engineering Documentation (Master Index)

> **Document ID:** WC-SWE-INDEX  
> **Version:** 2.26.0  
> **Classification:** Technical Architecture — Sovereign Standard  
> **Governing Technical Authority:** @Aurora (CTO Architecture) & @Ada (Chief Architect)  
> **Interactive Viewers:** Available as interactive TSX/HTML in **Aurora AI Command Studio** (`src/data/auroraSoftwareDocsRegistry.ts`)

---

## 🏛️ Structure of Software Documentation (`docs/software_docs/`)

This directory contains markdown specifications optimized for machine reading, automated agents, and continuous LLM training across 10 specialized software engineering domains:

| Directory | Document Title | Primary Module | Specification Focus |
|---|---|---|---|
| [`01_srs/`](./01_srs/srs_specification.md) | **Software Requirements Specification** | `aurora_srs` | IEEE 830 / ISO 29148 requirements across 12 departments |
| [`02_sdd/`](./02_sdd/sdd_system_design.md) | **System Design Document (SDD)** | `aurora_sad` | High-level & low-level component designs |
| [`03_architecture/`](./03_architecture/architecture_standard.md) | **4-Way Component Standard** | `architecture` | View (`.tsx`), Logic (`.logic.ts`), Style, and Locales |
| [`04_api_contracts/`](./04_api_contracts/api_specification.md) | **REST API Contracts & Endpoints** | `aurora_api` | High-throughput sub-10ms Express endpoints |
| [`05_rbac_matrix/`](./05_rbac_matrix/rbac_specification.md) | **Level 1–7 RBAC Security Matrix** | `rbac` | Sovereign Level 7 access control to public client roles |
| [`06_deduplication/`](./06_deduplication/deduplication_engine.md) | **Deduplication & Optimization** | `dedup` | Algorithmic $\mathcal{O}(n^2) \rightarrow \mathcal{O}(n)$ acceleration protocol |
| [`07_sqa_testing/`](./07_sqa_testing/sqa_testing_matrix.md) | **SQA & Vitest Automated Matrices** | `testing` | 100% Green test gates, Playwright E2E, Lighthouse |
| [`08_devops_cicd/`](./08_devops_cicd/devops_runbook.md) | **DevOps, Docker & CI/CD** | `devops` | Automated build pipelines, Brotli streams, PM2 cluster |
| [`09_pwa_offline/`](./09_pwa_offline/pwa_specification.md) | **PWA Workbox & Offline Cache** | `pwa` | Service Worker lifecycle, offline catalog sync |
| [`10_waves_roadmap/`](./10_waves_roadmap/waves_backlog.md) | **Waves 12–23 Implementation** | `waves` | Modular sprint execution and engineering milestones |

---

## 🤖 Dual-Representation Standard (Machine Markdown + Human TSX/HTML)

- **Machine & Agent Consumption (`.md`):** Located here in `docs/software_docs/` and `docs/business_docs/` for clean AST parsing, semantic search, and prompt injection.
- **Human User Experience (`.tsx` / HTML):** Rendered with interactive typography, filters, syntax highlighting, and collapsible nodes inside:
  - **Zoe AI Executive Business Viewer:** [`src/data/zoeBusinessDocsRegistry.ts`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/data/zoeBusinessDocsRegistry.ts)
  - **Aurora AI CTO Software Viewer:** [`src/data/auroraSoftwareDocsRegistry.ts`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/data/auroraSoftwareDocsRegistry.ts)
