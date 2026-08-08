# Wave 34 — Flowcharts

**Wave:** 34  
**Status:** planned  
**Date:** 2026-08-07

---

## 1) Software Canon Reconciliation Flow

```mermaid
flowchart TD
    A[Inventory software docs] --> B[Identify overlapping architecture files]
    B --> C[Compare against runtime truth and repo policy]
    C --> D[Classify active historical superseded]
    D --> E[Rewrite root indexes and manifests]
    E --> F[Reconcile database and RBAC design layers]
    F --> G[Publish architecture crosswalk artifacts]
    G --> H[Sync planning trackers]
```

## 2) Architecture Truth Model

```mermaid
flowchart LR
    R[Requirements engineering] --> U[Use cases]
    U --> D[Software design docs]
    D --> A[ADR decisions]
    D --> C[API contract catalog]
    C --> T[Traceability and future implementation]
```

## 3) Review Sequence

1. Software-doc root index and manifests
2. Database architecture family
3. RBAC architecture family
4. Folder-structure and navigation canon
5. Architecture companion artifacts
6. Tracker synchronization
