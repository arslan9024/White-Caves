# Universal Navigation Architecture & Redirection Flowcharts

## 1. Authentication & Role Routing Flowchart

```
[ User Auth Handshake ]
         │
         ▼
 Is email === 'arslanmalikgoraha@gmail.com'?
         │
    ┌────┴────────────┐
   YES               NO
    │                 │
    ▼                 ▼
[ Force Level 5 ]  [ Evaluate Session Access Level ]
(LEVEL_5_MASTER)      │
    │                 ├──────────────┬──────────────┐
    ▼                 ▼              ▼              ▼
[ Full Access ]  [ Level 4/3 ]  [ Level 2 ]    [ Level 1 ]
 MD Cockpit      Exec / Lead     Broker Deck    Client Portal
```

---

## 2. Impersonation Context State Flowchart

```
[ MD Top Navbar Selector ] ──► (Selects Personnel ID)
                                        │
                                        ▼
                           [ WorkspaceContext State ]
                                        │
                         Update impersonatedUser Property
                                        │
                                        ▼
                           [ Component Re-render ]
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
   [ Variant 1: Master ]     [ Variant 2: Broker ]     [ Variant 3: Portal ]
```

---

## 3. Financial Approval Pipeline Flowchart

```
[ Agent Deal Close ] ──► [ AGENT_SUBMITTED ] ──► [ MANAGER_APPROVED ]
                                                          │
                                                          ▼
[ PAYMENT_RELEASED ] ◄── [ FINANCE_LOCKED ] ◄─── [ Ledger Lock ]
```
