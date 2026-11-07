# 04. REST API Contracts & Microsecond Endpoint Specification

> **Document Code:** DOC-SWE-04  
> **Module ID:** `aurora_api`  
> **Category:** Backend API Contracts  
> **Primary Authority:** @Mira (Backend & API Lead)  
> **Human Interactive Viewer:** [`src/data/auroraSoftwareDocsRegistry.ts` (Item Code: DOC-SWE-04)](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/data/auroraSoftwareDocsRegistry.ts)

---

## 1. API Architecture Overview
All White Caves REST API endpoints follow the `/api/v1/` prefix standard, utilizing JSON payload contracts over TLS 1.3 with standard HTTP status codes and compressed streaming (Gzip / Brotli).

## 2. Core API Endpoints

### 2.1 Properties & Inventory
- `GET /api/v1/properties`: Query 9,378 active listings with filter criteria (cluster, price, bedrooms, ROI).
- `GET /api/v1/properties/:id/vr`: Fetch 360° WebGL panoramic assets and room coordinate meshes.

### 2.2 Sovereign Executive & Approvals
- `POST /api/v1/approvals/sign`: Apply Level 7 Founder Digital Seal (*Arslan Malik*).
- `GET /api/v1/escrow/audit`: Retrieve Law No. 8 escrow trust balances (Emirates NBD & FAB).

### 2.3 1-12-108 Multi-Agent Mesh
- `POST /api/v1/kanban/tasks`: Dispatch new directive to the 4-stage Kanban pipeline.
- `POST /api/v1/agents/:id/dispatch`: Dispatch prompt to a specific supervisor with 15-minute SLA enforcement.
