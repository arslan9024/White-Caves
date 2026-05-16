# Flowcharts Template (Mermaid Required)

## 1. Process Flowchart

```mermaid
flowchart TD
  A[Start] --> B[Input]
  B --> C{Validation?}
  C -->|Yes| D[Process]
  C -->|No| E[Error Handling]
  D --> F[Persist]
  F --> G[Notify]
  G --> H[End]
  E --> H
```

## 2. Sequence Diagram

```mermaid
sequenceDiagram
  participant U as User
  participant FE as Frontend
  participant API as Backend API
  participant DB as Database
  participant OBS as Observability

  U->>FE: Trigger action
  FE->>API: Request
  API->>DB: Read/Write
  DB-->>API: Result
  API->>OBS: Emit metrics/logs
  API-->>FE: Response
  FE-->>U: UI update
```

## 3. Failure/Retry Map

- Failure mode:
- Retry policy:
- Fallback path:
- Human handoff trigger:

## 4. Compliance Branches

- Compliance checkpoint IDs:
- Approval nodes:
- Audit trail fields:
