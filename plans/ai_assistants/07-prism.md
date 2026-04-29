# 07 — Prism · AI Property Matching Engine

> **ID:** `prism`  
> **Department:** Sales / AI  
> **Title:** AI Property Matching Engine  
> **Color:** `#6366F1` (Indigo)  
> **Avatar:** 💎  
> **Phase:** Phase 10 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** All agents, Managing Director, Buyers (read-only via portal)

---

## 1. Overview

Prism is the **intelligent property matchmaker**. Given a buyer's requirements (budget, bedrooms, area preference, lifestyle needs), Prism searches Mary's inventory and returns a ranked list of the best-matching properties with a match-score percentage and a natural-language explanation of why each property was selected. Prism powers both the agent's search tool and the buyer-facing property portal.

---

## 2. Core Responsibilities

1. Accept buyer preference profiles and translate them into structured search queries
2. Score every property in the inventory against the preference profile
3. Return ranked results with match percentage and explanation
4. Power the "Similar Properties" widget on property detail pages
5. Learn from feedback: if buyer rejects a match, lower its score for similar buyers
6. Feed recommendations to Kairos for VIP shortlisting

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Preference parsing | Parse natural-language preferences ("2-bed with sea view under 2M") |
| Match scoring | Multi-factor: price (30%), location (25%), size (20%), features (15%), view (10%) |
| Ranked results | Top 10 matches with % score and reason card |
| Explanation card | "95% match — within budget, 3-bed, sea view, Dubai Marina" |
| Similar properties | "You may also like" widget on property detail page |
| Rejection learning | Agent marks a recommendation as rejected → lowers weight for that factor |
| Saved searches | Buyer can save a preference profile for re-query later |
| Portfolio mode | Investor provides budget → Prism returns optimised multi-property portfolio |

---

## 4. How It Works — End to End

### Step 1 — Preference Input
Agent fills in buyer preference form: `{ budgetMax: 2000000, bedrooms: 2, areas: ['Dubai Marina'], mustHaves: ['sea_view'], niceToHaves: ['gym', 'pool'] }`.
Or buyer types in natural language → Nina parses it → returns structured preference object.

### Step 2 — Inventory Query
Prism queries Mary's inventory via `GET /api/properties?price_max=2000000&bedrooms=2&area=Dubai Marina`.

### Step 3 — Scoring
For each returned property, `PrismService.score(property, preferences)`:
- Price distance: `1 - (property.price / preferences.budgetMax)` → normalised 0–1 → × 30
- Area match: exact match → 25, adjacent area → 12, different → 0
- Bedroom match: exact → 20, ±1 → 10, ±2 → 5
- Features: each `mustHave` met → +7.5 (15 total); each `niceToHave` met → +2.5
- View: `sea_view` requested + present → +10

### Step 4 — Rank & Return
Properties sorted by descending score. Top 10 returned with score, match explanation, and property card data.

### Step 5 — Presentation
Results rendered as property cards with match % badge (colour: green ≥ 80%, amber 60–79%, red < 60%). Agent shares link or WhatsApp shortlist to buyer.

### Step 6 — Feedback Loop
Buyer or agent marks "Not interested" on a card → `PATCH /api/prism/feedback { propertyId, reason }` → Prism adjusts preference weights (e.g., "actual budget lower" or "prefers Jumeirah").

### Step 7 — Re-Query
Buyer portal has a "Refresh matches" button → re-runs Prism with updated preferences.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/prism/match` | Match properties to a preference profile |
| GET | `/api/prism/similar/:propertyId` | Find similar properties to a given listing |
| POST | `/api/prism/feedback` | Record match feedback (rejected/liked) |
| POST | `/api/prism/saved-searches` | Save a preference profile |
| GET | `/api/prism/saved-searches` | List saved searches for a buyer |

---

## 6. Data Flows

- **Receives from:** Mary (full property inventory), Clara (buyer profile from lead), Nina (parsed natural-language preferences)
- **Sends to:** Kairos (VIP shortlists), Olivia (recommended listings for campaigns), Buyer portal (property results)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Prism search panel | `src/components/crm/PrismSearch/` | 🔲 Planned |
| Match result cards | Inside search panel | 🔲 Planned |
| Similar properties widget | `src/components/PropertyDetailPage/` | 🔲 Planned |
| Saved searches list | Buyer portal | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| PrismService | `server/services/ai/PrismService.ts` | 🔲 Planned |
| Feedback store | `server/routes/prism.ts` | 🔲 Planned |
| Saved searches | `server/routes/prism.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full access + feedback analytics |
| `agent` | Full matching + feedback |
| `buyer` (portal) | Read-only results, save searches |

---

## 10. Implementation Checklist

- [ ] Register `prism` in `AI_ASSISTANTS_REGISTRY`
- [ ] `PrismService.ts` — matching and scoring algorithm
- [ ] Match endpoint (`POST /api/prism/match`)
- [ ] Similar properties endpoint
- [ ] Feedback endpoint + weight adjustment logic
- [ ] Saved searches (user-linked)
- [ ] Match result UI card with % badge
- [ ] Natural language preference parsing via Nina
- [ ] Tests: `PrismService.test.ts`

---

## 11. Dependencies

- Mary (inventory data source)
- Nina (natural language parsing)
- Buyer portal (Phase 2 landlord/tenant model extended to buyers)

---

## 12. Future Enhancements

- OpenAI embeddings for semantic property matching ("near the beach" → area map)
- Image similarity matching ("I like the style of this kitchen")
- Virtual staging preview of selected properties (Iris)
- Portfolio optimisation for investors: max yield across budget
