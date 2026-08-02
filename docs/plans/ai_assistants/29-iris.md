# 29 — Iris · Virtual Staging & 3D Visualization AI

> **ID:** `iris`  
> **Department:** Technology / Marketing  
> **Title:** Virtual Staging & 3D Visualization AI  
> **Color:** `#EC4899` (Hot Pink)  
> **Avatar:** 🎨  
> **Phase:** Phase 10 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Property Manager, Marketing, Buyers (portal)

---

## 1. Overview

Iris brings **visual transformation technology** to White Caves property listings. She virtually stages empty properties (furnishing empty rooms with AI-generated furniture), creates 360° virtual tours from standard photos, generates 3D floor plan visualisations, and allows buyers to customise interior styles before purchasing. Iris dramatically increases engagement on listings and reduces the need for expensive physical staging.

---

## 2. Core Responsibilities

1. Virtual staging: transform empty room photos into furnished, styled rooms
2. 360° virtual tour creation from uploaded property photos
3. 3D floor plan generation from 2D architect plans
4. Interior style customisation: buyer switches between Modern, Classic, Arabian styles
5. Before/after comparison slider for staged listings
6. Property video montage generation (slideshow with Ken Burns effect + music)

---

## 3. Capabilities

| Capability | Description |
|---|---|
| AI virtual staging | Upload empty room image → Iris returns furnished version in 2–3 styles |
| Style themes | Modern, Classic, Arabian Luxury, Scandinavian, Minimalist |
| 360° tour builder | Upload 10+ equirectangular images → stitch into Matterport-like tour |
| 3D floor plan | Upload 2D PDF plan → generate interactive 3D walkaround |
| Style switcher | Buyer on portal can switch between furniture styles in real time |
| Before/after slider | Side-by-side empty vs staged view |
| Video generator | Property photo slideshow with automated captions and background music |
| Batch staging | Stage all rooms of a property in one job |
| Branded watermark | Company logo overlaid on all generated images |
| Download pack | All staged images + tour link delivered to agent as ZIP |

---

## 4. How It Works — End to End

### Step 1 — Upload
Agent uploads empty room photos via Mary's media management panel → tags images: `{ roomType: 'living_room', isStagingCandidate: true }`.

### Step 2 — Staging Job
Agent requests staging → `POST /api/iris/stage { propertyId, imageIds, style: 'modern', theme: 'luxury' }`. Job queued.

### Step 3 — AI Processing
`IrisService.stage(job)` calls the staging API (Stable Diffusion / Adobe Firefly / Midjourney API):
- Send base image + inpainting mask (Iris auto-generates room boundaries mask)
- Prompt: `"Luxury furnished [roomType] in [style] style with high-end finishes, natural light, ultra-realistic"`
- Receive generated image → store in Cloudinary

### Step 4 — Quality Check
Generated images passed to a CLIP similarity check (are they realistic and of the same room?). If score < 0.7 → retry with adjusted prompt. Max 3 retries.

### Step 5 — Delivery
Staged images saved to `property.stagedImages[]`. Agent notified via Nadia WhatsApp: "Your 4 staged images for [Property] are ready!"

### Step 6 — Portal Display
Listing page shows "Virtual Tour" tab + "Styled View" toggle. Buyer can switch styles in real-time (Iris returns multiple versions).

### Step 7 — 360° Tour
Agent uploads equirectangular 360° photos → `POST /api/iris/tour { propertyId, images }` → Iris stitches using Pannellum library → returns hosted tour URL → embedded in property detail page.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/iris/stage` | Create virtual staging job |
| GET | `/api/iris/stage/:jobId` | Get job status and results |
| POST | `/api/iris/tour` | Create 360° virtual tour |
| GET | `/api/iris/tour/:propertyId` | Get tour URL |
| POST | `/api/iris/floorplan` | Generate 3D floor plan |
| POST | `/api/iris/video` | Generate property video montage |
| GET | `/api/iris/styles` | List available staging styles |

---

## 6. Data Flows

- **Receives from:** Mary (property images), Agent uploads
- **Sends to:** Mary (staged image URLs stored on property), Olivia (staged images for marketing), Portal (360° tour embed), Nadia (completion notification)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Virtual tour viewer | `src/components/VirtualTourGallery/` | ✅ Exists (UI shell) |
| Style switcher | `src/pages/PropertyDetailPage.tsx` | 🔲 Planned |
| Before/after slider | Property listing | 🔲 Planned |
| Staging request panel | In Mary's media tab | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| IrisService | `server/services/IrisService.ts` | 🔲 Planned |
| Staging job queue | `server/jobs/stagingQueue.ts` | 🔲 Planned |
| AI staging API client | External API integration | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full management |
| `property_manager` | Request staging for any property |
| `agent` | Request staging for assigned properties |
| Buyers | View staged images and tours (portal) |

---

## 10. Implementation Checklist

- [ ] Register `iris` in `AI_ASSISTANTS_REGISTRY`
- [ ] Select and integrate staging AI API (Stable Diffusion API / Adobe Firefly)
- [ ] `IrisService.stage()` with retry logic
- [ ] Pannellum 360° tour integration
- [ ] 3D floor plan service
- [ ] Style switcher UI component on property detail page
- [ ] Before/after slider component
- [ ] Job queue system (bull queue or simple DB queue)
- [ ] Virtual tour gallery component wired to real tours

---

## 11. Dependencies

- AI staging API account (Stable Diffusion, Midjourney, or Adobe Firefly)
- Pannellum or Matterport SDK (360° tours)
- Cloudinary (image hosting)
- `VirtualTourGallery` component (exists, needs real tour data)

---

## 12. Future Enhancements

- AR furniture placement via mobile app (Phase 10)
- AI architect: suggest structural modifications to a property
- Real-time 3D walkthrough in browser using WebGL/Three.js
- Neighbourhood visualisation: show the view from the balcony using Google Earth
