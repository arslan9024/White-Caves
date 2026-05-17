# Property Listing Flow

# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-PROP-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Operations Department (Mary — Inventory & Data Manager)
> **Scope:** Property creation through RERA verification, publishing, and deactivation

---

## 1. Complete Property Lifecycle

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                   PROPERTY LIFECYCLE STATES                        │
  │                                                                     │
  │  DRAFT → UNDER_REVIEW → RERA_VERIFIED → PUBLISHED → UNDER_OFFER   │
  │       → SOLD/LEASED                                                 │
  │  (Alternative paths: REJECTED, SUSPENDED, EXPIRED, DELISTED)       │
  └─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Property Creation Flow

```
Agent opens "Add Property" in CRM
          │
          ▼
  Property Form — Required Fields:
  ┌────────────────────────────────────────────────────────────┐
  │ Title         │ "3BR Villa — DAMAC Hills 2, Pacifica"      │
  │ Type          │ Villa / Townhouse / Apartment / Commercial  │
  │ Status        │ For Sale / For Rent / Off-plan              │
  │ Price         │ AED amount (sale) or AED/year (rent)        │
  │ Area          │ sq ft / sq m                               │
  │ Bedrooms      │ 1–10+ / Studio                             │
  │ Bathrooms     │ 1–8+                                       │
  │ Community     │ DAMAC Hills 2 / JVC / Business Bay / etc.  │
  │ Address       │ Unit, building, community, Dubai            │
  │ RERA Permit # │ Required before publishing (Phase 5)        │
  │ DLD Number    │ For ready properties                        │
  │ Agent         │ Assigned from staff list                    │
  └────────────────────────────────────────────────────────────┘
          │
          ├── Incomplete required fields → Validation errors inline
          │
          ▼
  Optional Fields:
  │ Description   │ Marketed copy (max 2000 chars)             │
  │ Features      │ Pool / Gym / Parking / Balcony / etc.      │
  │ Floor plan    │ URL or upload                              │
  │ Video tour    │ YouTube / Vimeo link                       │
  │ Furnishing    │ Furnished / Unfurnished / Part-furnished    │
  │ Availability  │ Ready to move / Off-plan delivery date      │
          │
          ▼
  POST /api/properties
  Status set to: DRAFT
  Activity logged: "Property created"
```

---

## 3. Media Upload Flow

```
Agent uploads property photos
          │
          ▼
  File validation (each file):
  ├── Max size: 10MB per image
  ├── Format: JPG, PNG, WebP only
  ├── Min dimensions: 800×600px
  ├── Max count: 50 photos per listing
  └── MIME type check (not just extension)
          │
          ├── Validation fails → Error shown per file
          │
          ▼
  [Phase 2: Multer + S3/Cloud Storage]
  Upload to cloud storage bucket:
  /properties/{propertyId}/photos/{timestamp}-{filename}
          │
          ▼
  Image optimization pipeline (Phase 2):
  ├── Auto-resize: 1920px max width (hero)
  ├── Thumbnail: 400×300px
  ├── WebP conversion (50–70% size reduction)
  └── CDN URL generated
          │
          ▼
  Photo ordering:
  ├── Agent can drag-and-drop to reorder
  └── First photo = listing thumbnail (hero image)
          │
          ▼
  360° / Virtual Tour link (optional):
  ├── YouTube / Matterport / custom 360° URL
  └── AR staging assets uploaded (Phase 7)
```

---

## 4. RERA Verification Flow (Phase 5)

```
Property status: DRAFT
Agent submits for review
          │
          ▼
  RERA Permit validation:
  ├── Has RERA permit number been entered? Required for publishing
  ├── [Phase 5] API call to RERA portal to verify permit:
  │   GET https://api.rera.gov.ae/permits/{permitNumber}
  │   Response: { valid: true, expiryDate, propertyDetails }
  │
  ├── Permit valid → Status: RERA_VERIFIED
  ├── Permit expired → Block publish: "RERA permit expired. Renew before publishing."
  ├── Permit not found → Block publish: "RERA permit not found. Verify number."
  └── Permit belongs to different property → Block: "Permit mismatch."
          │
          ▼
  Internal review:
  ├── Content check: description quality, minimum 5 photos
  ├── Price sanity check: within ±30% of community average
  └── Duplicate check: same address / same RERA permit already listed
          │
          ├── Issues found → Status: REJECTED (reasons noted for agent)
          │
          ▼
  Status: RERA_VERIFIED
  Manager approval required for:
  ├── Off-plan properties
  ├── Properties above AED 10M
  └── New property types (first of a kind in community)
          │
          ├── Manager approves → Status: PUBLISHED
          ├── Manager requests changes → Status: DRAFT (comments added)
```

---

## 5. Property Publishing Flow

```
Status: RERA_VERIFIED → PUBLISHED
          │
          ▼
  Listing goes live on whitecaves.ae
  ├── Property page generated (SEO-optimised URL)
  │   /properties/3br-villa-damac-hills-2-pacifica-12345
  ├── Structured data (JSON-LD) for Google property rich snippet
  ├── OG tags for social sharing
  └── Listed on homepage "Featured Properties" (if selected)
          │
          ▼
  Agent notification: "Your listing is now live"
          │
          ▼
  Portal syndication (Phase 8):
  ├── PropertyFinder XML feed updated (every 4 hours)
  ├── Bayut JSON feed updated (every 4 hours)
  └── Feed includes: title, price, photos, location, RERA permit
          │
          ▼
  Lead capture enabled:
  ├── "Enquire Now" button → website lead form → /api/leads
  ├── "WhatsApp Agent" button → wa.me link with property pre-fill
  └── Portal leads: webhook → /api/leads (Phase 8)
          │
          ▼
  Analytics tracking:
  ├── Page views tracked
  ├── Enquiry rate tracked
  └── Portal impression data imported (Phase 8)
```

---

## 6. Property Status Transitions

```
           DRAFT
          ─────────────────────────────────────────────────────
          → UNDER_REVIEW (agent submits for review)
          → REJECTED (manager rejects with reason)

          RERA_VERIFIED
          ─────────────────────────────────────────────────────
          → PUBLISHED (manager approves)

          PUBLISHED
          ─────────────────────────────────────────────────────
          → UNDER_OFFER (offer received, agent marks)
          → SUSPENDED (RERA permit expired — auto or manual)
          → DELISTED (agent/manager removes from market)
          → EXPIRED (listing age > 90 days, no refresh)

          UNDER_OFFER
          ─────────────────────────────────────────────────────
          → SOLD (sale completed)
          → LEASED (lease signed)
          → PUBLISHED (offer fell through)

          SOLD / LEASED
          ─────────────────────────────────────────────────────
          → ARCHIVED (read-only, historical record)
```

---

## 7. Property Search & Matching

```
Lead created / qualified
          │
          ▼
  Sophia (AI) auto-matches properties:
  Criteria: budget ±20%, bedrooms, property type, area preference
          │
          ▼
  Match list sent to agent in CRM
  Agent selects properties for viewing
          │
          ▼
  Lead ↔ Property relationship:
  lead.suggestedProperties[] = [propertyId1, propertyId2, ...]
  agent can add/remove from list
          │
          ▼
  Viewing scheduled → Appointment model:
  { leadId, propertyId, agentId, scheduledAt, status }
```

---

## 8. Property Deactivation Flow

```
Property needs to be removed from market
          │
          ├── Reason: SOLD
          │   ├── Agent marks "Mark as Sold"
          │   ├── Status → SOLD
          │   ├── Portal feeds updated (property removed) within 4h
          │   └── Listing page shows "Sold" badge
          │
          ├── Reason: LEASED
          │   ├── Agent marks "Mark as Leased"
          │   ├── Status → LEASED
          │   └── Tenant record linked to property
          │
          ├── Reason: RERA Permit Expired (auto)
          │   ├── [Cron job — Phase 2] checks expiry daily
          │   ├── Status → SUSPENDED
          │   ├── Agent notified: "Listing suspended — RERA permit expired"
          │   └── Portal feeds remove listing
          │
          └── Reason: Agent/Manager decision
              ├── Agent / Manager clicks "Delist"
              ├── Reason required: [Price adjustment | Off market | Sold privately | Other]
              └── Status → DELISTED
```

---

## 9. Off-Plan Property Flow

```
Off-plan project data received from developer (DAMAC, Emaar, etc.)
          │
          ▼
  Bulk import via CSV or API:
  ├── Developer name
  ├── Project name
  ├── Unit list (type, floor, price, delivery date)
  ├── Payment plan (10/90, 60/40, post-handover)
  └── Floor plans + renders
          │
          ▼
  Properties created with type: OFF_PLAN
  Delivery date set as "Available From"
          │
          ▼
  Off-plan microsite generated (Phase 8):
  /developments/damac-hills-2-lagoon-views
  (dedicated landing page with full project info)
          │
          ▼
  Developer registration forms:
  ├── Form A: Agency authority to market
  ├── Form F: Off-plan sale agreement
  └── RERA no-objection certificate
          │
          ▼
  Published → Portal syndication with off-plan schema
```

---

## 10. DAMAC Hills 2 Inventory Context

| Metric              | Value                          |
| ------------------- | ------------------------------ |
| Total units managed | 9,378+                         |
| Property types      | Villas, townhouses, apartments |
| Price range         | AED 1.2M – 4M+                 |
| Rental yield        | 7–8% gross                     |
| Primary developer   | DAMAC Properties               |
| Location            | Dubailand, Dubai               |
| Access              | Al Ain Road (E66)              |

---

**Document Owner:** Operations Department (Mary)
**Related:** `business_docs/09_crm_features/property-management.md`, `business/08_compliance/rera-compliance-checklist.md`

---

## 8. Property Photography Standards

High-quality photos are the #1 factor in listing performance. RERA also prohibits misleading or AI-generated photos presented as real.

### 8.1 Photography Brief

| Specification  | Standard                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------ |
| Camera         | DSLR or mirrorless, full-frame preferred (Sony A7, Canon R5, iPhone 14 Pro minimum)        |
| Lens           | 16–24mm wide angle for rooms; 50mm for details                                             |
| Resolution     | Minimum 3,000px on longest edge (JPEG, high quality)                                       |
| Format         | JPEG (primary) + RAW backup                                                                |
| Lighting       | All lights on; curtains/blinds open; natural light preferred                               |
| Time of day    | Morning for east-facing units; afternoon for west-facing; golden hour for exterior         |
| Minimum photos | 15 photos for apartments; 25 for villas                                                    |
| Maximum photos | 50 (portal limit; CRM stores unlimited)                                                    |
| Staging        | Property clean, tidy, depersonalised (no family photos visible in KYC-exposed photos)      |
| Prohibited     | AI-generated photos presented as real; extreme HDR that misrepresents space; virtual views |

### 8.2 Required Shots per Property Type

**Apartment (minimum 15 shots):**

```
REQUIRED:                                     RECOMMENDED:
☐ Living room (corner wide angle)             ☐ Living room (feature wall)
☐ Dining area                                 ☐ Kitchen close-up (counters, appliances)
☐ Master bedroom                              ☐ Built-in wardrobe
☐ Master bathroom                             ☐ Second bedroom
☐ Kitchen (wide angle)                        ☐ Guest bathroom
☐ Balcony / terrace                           ☐ Laundry area
☐ View from balcony                           ☐ Utility / storage
☐ Building exterior                           ☐ Lobby / common areas
☐ Parking space                               ☐ Pool / gym
```

**Villa (minimum 25 shots):**

```
REQUIRED:                                     RECOMMENDED:
All apartment shots plus:                     ☐ Garden (all angles)
☐ Ground floor reception / living             ☐ Private pool (if any)
☐ All bedrooms (minimum 3)                    ☐ Study/office
☐ All bathrooms                               ☐ Maid's room
☐ Family living area                          ☐ Laundry
☐ Entrance foyer                              ☐ Garage interior
☐ Rear garden / BBQ area                      ☐ Roof terrace (if any)
☐ Front of property (kerb appeal)             ☐ Community park/amenity nearby
```

### 8.3 Photo Editing Standards

- **Allowed:** Basic exposure correction, minor saturation boost, straighten horizon
- **Not allowed:** Adding objects not present, changing wall colours, removing furniture, extending room size, adding views
- **RERA rule:** Photos must represent the property as it exists — not as it could look

---

## 9. Listing Copy (Property Description) Standards

Quill (Document Generator AI) can generate listing copy from structured data. Human review required before publish.

### 9.1 Listing Description Structure

```
[HEADLINE] — 8–12 words
  Must include: property type + community + key USP
  Example: "Stunning 4-Bed Villa with Private Pool — DAMAC Hills 2"

[OPENING PARAGRAPH] — 3–4 sentences
  Cover: size, type, location, brief atmosphere
  Example: "This exceptional 4-bedroom villa in the prestigious Pelham community
  of DAMAC Hills 2 spans 4,200 sqft of beautifully designed living space.
  Located on a quiet street backing onto the golf course, this home offers
  both luxury and privacy in one of Dubai's most sought-after family
  communities."

[PROPERTY FEATURES] — bullet list
  • Bedrooms: [X] beds + maids
  • Bathrooms: [X] ensuite + [X] guest
  • Total area: [X] sqft (BUA) / [X] sqft (plot)
  • Floor: [X] / [X] (apartments) or G+[X] (villas)
  • Parking: [X] spaces
  • View: [community/golf course/pool/park/skyline]
  • Condition: [ready to move / vacant / rented / tenanted until MONTH YEAR]
  • Furnishing: [fully furnished / part furnished / unfurnished]

[COMMUNITY SECTION] — 2–3 sentences
  Describe the community: amenities, lifestyle, nearby schools/supermarkets/hospitals

[DEVELOPER / BUILDING INFO]
  Developer: [Name] | Year built: [Year] | Service charge: [AED/sqft/year]

[CALL TO ACTION]
  "Contact [Agent Name] today to arrange a private viewing."
```

### 9.2 Forbidden Phrases

RERA and White Caves prohibit:

- "Sea view" unless the property has a genuine sea view (satellite verified)
- "Motivated seller" without seller's written consent
- Fabricated urgency: "Only 1 unit remaining" (if not true)
- Price claims not backed by DLD data: "Best price per sqft in Dubai"
- "Negotiable" without seller's confirmed agreement to negotiate

---

## 10. Portal Syndication Quality Checklist

Before syncing any listing to PropertyFinder / Bayut:

```
MANDATORY (listing rejected by portal if missing):
☐ Valid Trakheesi permit number (not expired)
☐ Agent BRN
☐ Company ORN
☐ Minimum 10 photos (PF requirement), 8 photos (Bayut)
☐ Description minimum 200 words (PF)
☐ Accurate price (within 5% of market; misleading price = RERA violation)
☐ Property type and bedrooms accurately stated

STRONGLY RECOMMENDED:
☐ Floor plan uploaded (boosts ranking by 20–30% on PF)
☐ Video walkthrough link
☐ Virtual tour URL (Matterport)
☐ All amenities accurately listed
☐ Community image
```

---

**Document Owner:** Sales Department (Sophia + Compliance Laila)
**Version History:** v1.0 April 2026; v2.0 April 2026 (photography standards, copy standards, portal checklist)
**Related:** `business/08_compliance/rera-compliance-checklist.md`, `business/09_operations/partnership-framework.md`
