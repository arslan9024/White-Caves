# RUP UI Navigation & Role Routing Flowcharts

**Document Class:** FE-FLOW-001  
**Module:** User Navigation & Access Level Hydration  
**Version:** 2026.08-FLOW-V1  
**Owner:** @Marissa (UX Researcher) + @Tracy (Responsive Expert)  
**Status:** ✅ Active — Master Architecture  

---

## 1. Top Navigation & Global Search Flow

```
[ User Action: Open Browser ]
             │
             ▼
[ UnifiedWorkspaceLayout.tsx (Fixed Header top: 0, z-index: 1000) ]
             │
             ├──► [ TopNavbar.tsx (Logo, User Avatar, Level Badge) ]
             │
             └──► [ FloatingSearchPill.tsx (Fixed top: 80px) ]
                         │
                         ▼ (Click / ⌘K)
              [ Framer Motion Global Search Modal ]
                         │
                         ├──► Search DAMAC Hills 2 Properties
                         ├──► Search Ejari Contracts & Form 7 Notices
                         └──► Search Leads & 108 Squad Supervisors
```

---

## 2. 3-Variant Role-Filtered Hydration Flow

```
                  [ User Authentication Handshake ]
                                  │
                                  ▼
                    [ Check Session Email / Role ]
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
   [ Email = arslan... ]    [ AccessLevel 2 / 3 ]   [ AccessLevel 1 ]
   [ LEVEL_5_MASTER ]       [ Broker / Agent ]      [ Client / Tenant ]
            │                     │                     │
            ▼                     ▼                     ▼
   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
   │ VARIANT 1 DECK  │   │ VARIANT 2 DECK  │   │ VARIANT 3 DECK  │
   ├─────────────────┤   ├─────────────────┤   ├─────────────────┤
   │ • 12 Depts      │   │ • My Active     │   │ • My Ejari      │
   │ • 4-Col Kanban  │   │   Assigned Leads│   │   Lease Contract│
   │ • 15-min Timers │   │ • Personal      │   │ • Form 7 Notice │
   │ • Apex Podiums  │   │   Calendar      │   │ • Maintenance   │
   │ • 9,378 Units   │   │ • Target Gauge  │   │   Ticket Logs   │
   └─────────────────┘   └─────────────────┘   └─────────────────┘
```
