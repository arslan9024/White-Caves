# NOC Express Pathfinder Logic Algorithm Specification

> **Algorithm Code:** `ALG-CONVEY-04`  
> **Associated Department:** Conveyancing & Transaction Management (`conveyancing`)  
> **Mathematical Model:** Graph-Based Pathfinding Analysis Calculating Corporate Processing Delays Across Master Developers  
> **Cross-Linked SDD Reference:** `../02_software_design/tech_replacement_rules.md`  

---

## 1. Overview & Objective

The NOC Express Pathfinder Logic determines optimal processing pathways for Developer No Objection Certificates (NOCs) required prior to DLD title transfer office scheduling.

---

## 2. Graph Delay Protocol & Weight Formula

The total path processing time \( T_{\text{NOC}} \) across developer verification nodes \( N_i \) is calculated as:

$$T_{\text{NOC}} = \sum_{i=1}^{k} d(N_i, N_{i+1}) + \delta_{\text{service\_charge}} + \delta_{\text{inspection}}$$

Where:
- \( d(N_i, N_{i+1}) \): Directed edge weight representing standard developer processing duration (hours).
- \( \delta_{\text{service\_charge}} \): Delay penalty if outstanding master developer service fees exist (\( +48 \) hours).
- \( \delta_{\text{inspection}} \): Delay penalty if physical property modification inspection is required (\( +24 \) hours).

---

## 3. Master Developer Processing Benchmark Matrix

| Developer Entity | Portal Webhook Support | Base Processing Hours | Expedited NOC Lead Time |
| :--- | :--- | :--- | :--- |
| **EMAAR Properties** | Direct Webhook API | 24 Hours | 4 Hours (Express Route) |
| **DAMAC Properties** | Webhook + Trustee Portal | 48 Hours | 12 Hours |
| **NAKHEEL Properties** | Document Portal | 72 Hours | 24 Hours |
| **SOBHA Realty** | Direct API | 24 Hours | 6 Hours |

---

## 4. TypeScript Graph Pathfinder Implementation

```typescript
export interface NocPathRequest {
  developerName: string;
  hasOutstandingServiceFees: boolean;
  requiresModificationInspection: boolean;
}

export interface NocPathResult {
  estimatedHoursToIssue: number;
  isExpressRouteAvailable: boolean;
  recommendedSteps: string[];
}

export function calculateNocPath(req: NocPathRequest): NocPathResult {
  let baseHours = 48;
  if (req.developerName.toUpperCase().includes('EMAAR')) baseHours = 24;
  else if (req.developerName.toUpperCase().includes('NAKHEEL')) baseHours = 72;

  let feePenalty = req.hasOutstandingServiceFees ? 48 : 0;
  let inspectionPenalty = req.requiresModificationInspection ? 24 : 0;

  const totalHours = baseHours + feePenalty + inspectionPenalty;

  return {
    estimatedHoursToIssue: totalHours,
    isExpressRouteAvailable: !req.hasOutstandingServiceFees,
    recommendedSteps: [
      '1. Verify zero balance on master community portal',
      '2. Ingest Ejari & seller title deed copy',
      '3. Issue digital NOC application payload',
      '4. Schedule DLD Trustee Office transfer slot',
    ],
  };
}
```
