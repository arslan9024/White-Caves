# WAVE_01_FLOWCHARTS

## Process Flow

```mermaid
flowchart TD
  A[Researcher Preflight] --> B[Docs 1000% Validation]
  B --> C[SDD + Flowcharts + Readiness Packet]
  C --> D{Readiness >= 92%?}
  D -->|No| E[Back to Free Agents]
  D -->|Yes| F[@Ada Approval]
  F --> G[Premium Coding Wave 3-5 Modules]
  G --> H[Test Rollout + Verification]
  H --> I[Daily Tracker + Quota Log]
```

## Sequence

```mermaid
sequenceDiagram
  participant R as Researcher
  participant M as @Margaret
  participant A as @Ada
  participant C as Senior Coders
  participant Q as QA

  R->>M: Preflight packet + risk/dependency map
  M->>A: Readiness packet + score
  A->>C: Approval phrase (if >=92%)
  C->>Q: Implementation wave build
  Q-->>M: Verification report
  M-->>A: Daily quota usage + wave closure
```
