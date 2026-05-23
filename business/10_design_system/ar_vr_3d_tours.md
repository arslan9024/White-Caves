# AR/VR & 3D Tour Components — Design System Extension

> **Last Updated:** April 11, 2026
> **Purpose:** Define UI/UX components for AR/VR experiences and 3D virtual tours
> **Extends:** `/business_docs/10_design_system/`

---

## 1. Overview

Modern luxury real estate platforms require immersive property viewing experiences. This document defines the design system components for 3D virtual tours, 360° photography, AR furniture staging, and VR property walkthroughs.

---

## 2. 3D Virtual Tour Components

### 2.1 TourViewer Component

| Property        | Type       | Default   | Description                        |
| --------------- | ---------- | --------- | ---------------------------------- |
| `tourUrl`       | `string`   | required  | Matterport or custom tour URL      |
| `propertyId`    | `string`   | required  | Property ID for analytics tracking |
| `height`        | `string`   | `"600px"` | Viewer height                      |
| `showFloorPlan` | `boolean`  | `true`    | Show/hide floor plan overlay       |
| `showMinimap`   | `boolean`  | `true`    | Show/hide position minimap         |
| `autoRotate`    | `boolean`  | `false`   | Auto-rotate on load                |
| `startPosition` | `object`   | `null`    | Initial camera position            |
| `onLoad`        | `function` | `null`    | Callback when tour loads           |
| `onNavigate`    | `function` | `null`    | Callback on room change            |

```tsx
<TourViewer
  tourUrl="https://my.matterport.com/show/?m=abc123"
  propertyId="prop_001"
  height="600px"
  showFloorPlan={true}
  showMinimap={true}
/>
```

### 2.2 TourGallery Component

| Property    | Type                                | Default      | Description           |
| ----------- | ----------------------------------- | ------------ | --------------------- |
| `images`    | `Image[]`                           | required     | Property images array |
| `tourUrl`   | `string?`                           | `null`       | Optional 3D tour URL  |
| `panoramas` | `string[]`                          | `[]`         | 360° image URLs       |
| `videoUrl`  | `string?`                           | `null`       | Property video URL    |
| `layout`    | `"grid" \| "carousel" \| "masonry"` | `"carousel"` | Gallery layout        |

### 2.3 FloorPlanViewer Component

| Property       | Type              | Default  | Description                 |
| -------------- | ----------------- | -------- | --------------------------- |
| `floorPlanUrl` | `string`          | required | Floor plan image or SVG URL |
| `rooms`        | `Room[]`          | `[]`     | Interactive room hotspots   |
| `measurements` | `boolean`         | `true`   | Show room dimensions        |
| `interactive`  | `boolean`         | `true`   | Enable click-to-navigate    |
| `unit`         | `"sqft" \| "sqm"` | `"sqft"` | Measurement unit            |

---

## 3. 360° Photography Components

### 3.1 PanoramaViewer Component

Built on pannellum.js for lightweight 360° photo viewing.

| Property      | Type        | Default                | Description                    |
| ------------- | ----------- | ---------------------- | ------------------------------ |
| `imageUrl`    | `string`    | required               | Equirectangular 360° image URL |
| `hotspots`    | `Hotspot[]` | `[]`                   | Interactive hotspots with info |
| `autoRotate`  | `number`    | `2`                    | Auto-rotation speed (deg/sec)  |
| `compass`     | `boolean`   | `true`                 | Show compass widget            |
| `fullscreen`  | `boolean`   | `true`                 | Enable fullscreen button       |
| `initialView` | `object`    | `{ pitch: 0, yaw: 0 }` | Initial camera orientation     |

### 3.2 PanoramaTour Component

Multi-scene 360° tour with navigation between rooms.

| Property     | Type                          | Default     | Description                |
| ------------ | ----------------------------- | ----------- | -------------------------- |
| `scenes`     | `Scene[]`                     | required    | Array of 360° scenes       |
| `startScene` | `string`                      | first scene | Initial scene ID           |
| `transition` | `"fade" \| "swipe" \| "none"` | `"fade"`    | Scene transition animation |

---

## 4. AR Components (Augmented Reality)

### 4.1 ARFurnitureStaging Component

Virtual furniture staging using WebXR or 8th Wall SDK.

| Property           | Type                                               | Default    | Description                |
| ------------------ | -------------------------------------------------- | ---------- | -------------------------- |
| `roomImage`        | `string`                                           | required   | Base room image URL        |
| `furnitureCatalog` | `Furniture[]`                                      | `[]`       | Available furniture items  |
| `style`            | `"modern" \| "arabic" \| "minimalist" \| "luxury"` | `"modern"` | Default furniture style    |
| `onSave`           | `function`                                         | `null`     | Save staged configuration  |
| `budget`           | `object?`                                          | `null`     | Optional budget constraint |

### 4.2 ARPropertyOverlay Component

Overlay property information when pointing camera at a building.

| Property           | Type         | Default  | Description                            |
| ------------------ | ------------ | -------- | -------------------------------------- |
| `properties`       | `Property[]` | required | Nearby properties with GPS coordinates |
| `maxDistance`      | `number`     | `500`    | Maximum distance in meters             |
| `showPrice`        | `boolean`    | `true`   | Show price overlay                     |
| `showAvailability` | `boolean`    | `true`   | Show availability status               |

---

## 5. VR Components (Virtual Reality)

### 5.1 VRTourExperience Component

Full VR walkthrough using WebXR API.

| Property        | Type                           | Default    | Description                    |
| --------------- | ------------------------------ | ---------- | ------------------------------ |
| `modelUrl`      | `string`                       | required   | 3D model URL (glTF/GLB)        |
| `vrMode`        | `"immersive" \| "inline"`      | `"inline"` | VR mode type                   |
| `controllers`   | `boolean`                      | `true`     | Enable VR controllers          |
| `teleportation` | `boolean`                      | `true`     | Enable teleport navigation     |
| `lighting`      | `"day" \| "night" \| "custom"` | `"day"`    | Scene lighting                 |
| `onInteraction` | `function`                     | `null`     | Callback for user interactions |

---

## 6. Shared UI Elements

### 6.1 TourBadge Component

Badge displayed on property listing cards to indicate tour availability.

| Variant      | Icon | Label             | Color               |
| ------------ | ---- | ----------------- | ------------------- |
| `3d-tour`    | 🏠   | "3D Tour"         | `--color-primary`   |
| `360-photo`  | 📷   | "360°"            | `--color-secondary` |
| `vr-ready`   | 🥽   | "VR Ready"        | `--color-accent`    |
| `ar-staging` | 🪑   | "Virtual Staging" | `--color-success`   |
| `video`      | 🎬   | "Video Tour"      | `--color-info`      |

### 6.2 TourControls Component

Unified control bar for all tour types.

| Control    | Icon | Action                             |
| ---------- | ---- | ---------------------------------- |
| Fullscreen | ⛶    | Toggle fullscreen                  |
| Floor Plan | 📐   | Toggle floor plan overlay          |
| Share      | 🔗   | Copy tour link / send via WhatsApp |
| Favorite   | ❤️   | Save to favorites                  |
| Schedule   | 📅   | Book in-person viewing             |
| AR Mode    | 📱   | Switch to AR (if supported)        |
| VR Mode    | 🥽   | Switch to VR (if supported)        |

---

## 7. Design Tokens for Tour Components

```css
/* Tour Component Tokens */
--tour-viewer-bg: var(--color-neutral-900);
--tour-viewer-border-radius: var(--radius-lg);
--tour-viewer-shadow: var(--shadow-xl);
--tour-controls-bg: rgba(0, 0, 0, 0.7);
--tour-controls-color: var(--color-white);
--tour-controls-height: 48px;
--tour-hotspot-color: var(--color-primary-500);
--tour-hotspot-size: 24px;
--tour-hotspot-pulse: var(--animation-pulse);
--tour-badge-font: var(--font-caption);
--tour-badge-padding: var(--spacing-xs) var(--spacing-sm);
--tour-loading-spinner: var(--color-primary-400);
--tour-panorama-drag-cursor: grab;
--tour-panorama-dragging-cursor: grabbing;
```

---

## 8. Accessibility (WCAG AAA Compliance)

| Requirement             | Implementation                                              |
| ----------------------- | ----------------------------------------------------------- |
| **Keyboard Navigation** | Tab through hotspots, arrow keys for rotation               |
| **Screen Reader**       | `aria-label` on all interactive elements, room descriptions |
| **High Contrast**       | Controls meet 7:1 contrast ratio (WCAG AAA)                 |
| **Motion Sensitivity**  | `prefers-reduced-motion` disables auto-rotate               |
| **Alternative Content** | Static images + text descriptions for non-WebGL browsers    |
| **Focus Indicators**    | Visible focus ring on all interactive tour elements         |
| **Skip Navigation**     | "Skip to tour controls" link before viewer                  |

---

## 9. Performance Requirements

| Metric          | Target               | Measurement            |
| --------------- | -------------------- | ---------------------- |
| Tour load time  | <3 seconds           | First meaningful paint |
| 360° image load | <2 seconds           | Per panorama scene     |
| Frame rate      | ≥30 FPS              | During tour navigation |
| Memory usage    | <200MB               | Peak during VR mode    |
| Mobile support  | iOS 15+, Android 10+ | Device compatibility   |
| Bundle size     | <150KB (viewer)      | Gzipped JavaScript     |

---

## Sources

- [Matterport SDK Documentation](https://matterport.github.io/showcase-sdk/)
- [Pannellum Documentation](https://pannellum.org/documentation/)
- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [Three.js Documentation](https://threejs.org/docs/)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)

---

## 10. AR Furniture Staging Specification

### 10.1 ARFurnitureStager Component

```typescript
interface FurnitureModel {
  id: string;
  name: string;
  category: 'sofa' | 'bed' | 'dining' | 'accent' | 'outdoor' | 'kitchen';
  style: 'modern' | 'contemporary' | 'traditional' | 'minimalist';
  dimensions: {
    width: number; // cm
    depth: number; // cm
    height: number; // cm
  };
  modelUrl: string; // .glb or .gltf URL
  thumbnailUrl: string;
  color?: string; // hex
}

interface ARFurnitureStagerProps {
  roomId: string;
  propertyId: string;
  initialFurniture?: PlacedFurniture[];
  onStagingComplete?: (furniture: PlacedFurniture[]) => void;
}
```

### 10.2 Furniture Catalog Structure

| Category               | Items     | 3D Format        | Avg File Size |
| ---------------------- | --------- | ---------------- | ------------- |
| Sofas & seating        | 15 models | GLB (compressed) | 2–5 MB        |
| Beds & bedroom         | 12 models | GLB              | 3–8 MB        |
| Dining tables & chairs | 10 sets   | GLB              | 2–6 MB        |
| Office & study         | 8 models  | GLB              | 1–3 MB        |
| Outdoor / terrace      | 8 models  | GLB              | 2–4 MB        |
| Accent / décor         | 20 items  | GLB              | 0.5–1 MB      |

### 10.3 Supported 3D Formats and Pipeline

| Format                                  | Support           | Notes                                 |
| --------------------------------------- | ----------------- | ------------------------------------- |
| **GLB** (GL Transmission Format Binary) | ✅ Primary        | Compressed; single file; fastest load |
| **GLTF** (GL Transmission Format)       | ✅ Secondary      | JSON + assets; easier to edit         |
| **OBJ**                                 | ⚠️ Convert to GLB | Not web-optimal; convert at import    |
| **FBX**                                 | ⚠️ Convert to GLB | Use Blender or three.js converter     |

**Conversion pipeline:** Blender → GLTF export → gltf-pipeline compress → upload to S3

### 10.4 Placement Algorithm

```
Device: iOS (ARKit) / Android (ARCore)
1. Camera stream → Surface detection algorithm
2. Detected planes rendered as semi-transparent grid
3. User taps plane → furniture placed at tap position
4. User gestures:
   ├── One finger drag: move furniture on plane
   ├── Two finger rotate: spin furniture around Y axis
   ├── Two finger pinch: scale 80–120% of real size
   └── Long press: remove furniture
5. Collision detection: prevent furniture overlap
6. Staging saved: array of {modelId, x, y, z, rotation} → CRM
```

### 10.5 Supported Devices

| Platform              | Technology | Min Version                          | Notes                                           |
| --------------------- | ---------- | ------------------------------------ | ----------------------------------------------- |
| iOS                   | ARKit      | iOS 14+ (iPhone 6s+)                 | Best quality AR plane detection                 |
| Android               | ARCore     | Android 8.0+ (Pixel 3+, Samsung S8+) | Slightly less precise                           |
| Desktop / unsupported | Fallback   | All                                  | Static 360° room view with 2D furniture overlay |

### 10.6 Performance Budget

| Metric                  | Target                        |
| ----------------------- | ----------------------------- |
| AR session start time   | < 3 seconds                   |
| Furniture model load    | < 2 seconds per model         |
| AR frame rate           | ≥ 30 FPS on mid-range devices |
| Max simultaneous models | 8 (performance limit)         |
| Session battery usage   | < 15% per 10-minute session   |

---

## 11. VR Walkthrough Specification

### 11.1 WebXR Integration

White Caves uses the WebXR Device API for browser-based VR walkthroughs:

```typescript
// Check WebXR support
const isVRSupported = async (): Promise<boolean> => {
  if (!navigator.xr) return false;
  return await navigator.xr.isSessionSupported('immersive-vr');
};

// Enter VR session
const enterVR = async (renderer: THREE.WebGLRenderer) => {
  const session = await navigator.xr.requestSession('immersive-vr', {
    requiredFeatures: ['local-floor'],
    optionalFeatures: ['bounded-floor', 'hand-tracking'],
  });
  renderer.xr.setSession(session);
};
```

### 11.2 Compatible VR Headsets

| Headset             | Support                | Navigation                                       |
| ------------------- | ---------------------- | ------------------------------------------------ |
| Meta Quest 2 & 3    | ✅ Primary             | Controller point-and-click + joystick locomotion |
| Meta Quest Pro      | ✅                     | Hand tracking + controller                       |
| HTC Vive / Vive Pro | ✅                     | Controller teleportation                         |
| Valve Index         | ✅                     | Controller + finger tracking                     |
| Samsung Gear VR     | ⚠️ Legacy              | Gaze-based navigation                            |
| Google Cardboard    | ⚠️ Minimal             | Gaze + single click                              |
| Non-VR devices      | Fallback to 360° video | Mouse/touch drag navigation                      |

### 11.3 Navigation Controls

| Method                        | Devices          | Description                                   |
| ----------------------------- | ---------------- | --------------------------------------------- |
| Point-and-click teleportation | VR controllers   | Aim + trigger to teleport to room             |
| Joystick locomotion           | Meta Quest       | Left thumbstick moves; right thumbstick turns |
| Gaze navigation               | Mobile/Cardboard | Look at hotspot for 2 seconds → activate      |
| Mouse drag                    | Desktop fallback | Click + drag to look around                   |
| Keyboard                      | Desktop          | WASD = walk; mouse = look                     |

### 11.4 Performance Requirements

| Mode              | FPS Target | Resolution        |
| ----------------- | ---------- | ----------------- |
| VR (Meta Quest 3) | 90 FPS     | 2064×2208 per eye |
| VR (Meta Quest 2) | 72 FPS     | 1832×1920 per eye |
| 360° video        | 60 FPS     | 4K (3840×2160)    |
| Mobile 360°       | 30 FPS     | 2K (2560×1440)    |

### 11.5 Bandwidth Requirements

| Quality          | Bandwidth | Adaptive Fallback                        |
| ---------------- | --------- | ---------------------------------------- |
| VR (4K textures) | 25+ Mbps  | Auto-reduce to 2K if bandwidth < 10 Mbps |
| 360° HD          | 10 Mbps   | Auto-reduce to 1K if bandwidth < 5 Mbps  |
| 360° Standard    | 5 Mbps    | JPEG 360° + loading indicator            |

---

## 12. Virtual Staging Workflow

### 12.1 End-to-End Process

```
STEP 1: Photography Requirements
├── Camera: Full-frame DSLR or mirrorless (Sony A7, Canon 5D, iPhone 14 Pro+)
├── Lens: 16–24mm wide angle (capture full room)
├── Tripod: Mandatory — straight vertical shots, consistent height (1.2m)
├── Lighting: Natural light preferred; all lights on for evening shots
├── Angles: Minimum 3 shots per room: corner wide, window wall, feature wall
└── Coverage: Every room, kitchen, bathrooms, terrace/balcony, building exterior

STEP 2: Photo Upload to CRM
├── Agent uploads via CRM property media section
├── Max file size: 20MB per photo (JPEG, min 3000px wide)
├── AI auto-checks: exposure, blur, horizon level, minimum resolution
└── Rejected photos flagged with specific reason

STEP 3: Virtual Staging Style Selection
├── Select: Modern / Contemporary / Traditional / Minimalist / Scandinavian
├── Optional: colour palette preference (neutral / warm / cool)
└── Optional: occupant type hint (family / couple / professional / investor)

STEP 4: AI Staging Generation
├── Service API: Homestyler API or REimagineHome API
├── Processing time: 30–90 seconds per image
├── Output: staged JPEG at original resolution
└── Variants: 2 style variants generated automatically

STEP 5: Quality Control
├── Compliance officer reviews: no misleading staging (no fake sea view added)
├── Agent reviews: furniture proportions realistic; room use accurate
├── MD approves premium listings before publishing staged photos
└── Disclosure: All virtually staged photos labelled "Virtually Staged"

STEP 6: Storage & Delivery
├── S3 path: /properties/{propertyId}/virtual-staging/{originalFilename}_staged.jpg
├── CDN delivery: CloudFront (< 2s load time globally)
├── Listing display: carousel shows original + staged (toggle button)
└── Portal syndication: both versions available; agent chooses which to submit
```

### 12.2 RERA Disclosure Requirement

RERA prohibits misleading property advertisements. All virtually staged images must:

- Display the label "Virtually Staged" or "Artist's Impression" on the image
- Not modify structural features (cannot add or remove windows, walls)
- Not misrepresent room size (no exaggerated wide-angle manipulation)
- Not add views that don't exist from the property (no fake sea views)

---

## 13. Virtual Tour Analytics

### 13.1 Events to Track

| Event                  | Trigger                                | Properties Tracked                         |
| ---------------------- | -------------------------------------- | ------------------------------------------ |
| `tour_started`         | User clicks "3D Tour"                  | propertyId, source (listing/search/direct) |
| `tour_room_entered`    | User navigates to a room               | roomName, timeInPrevRoom                   |
| `tour_hotspot_clicked` | User clicks info hotspot               | hotspotType, roomName, hotspotContent      |
| `tour_time_spent`      | User exits tour                        | totalDuration, roomsVisited, hotspotClicks |
| `tour_completed`       | User finishes full tour                | completionRate (% of rooms visited)        |
| `tour_to_enquiry`      | User clicks "Enquire" from within tour | conversionFromTour=true, propertyId        |
| `ar_session_started`   | User enters AR mode                    | deviceType, furniturePlaced=0              |
| `furniture_placed`     | User places AR furniture               | furnitureCategory, placementCount          |
| `vr_session_started`   | User enters VR mode                    | headsetType, browserDetected               |

### 13.2 Key Metrics Dashboard

| Metric               | Calculation                       | Target              |
| -------------------- | --------------------------------- | ------------------- |
| Tour start rate      | tour_started / listing_views      | > 25%               |
| Avg time in tour     | AVG(totalDuration)                | > 3 minutes         |
| Tour completion rate | Rooms visited / total rooms       | > 70%               |
| Tour-to-enquiry rate | tour_to_enquiry / tour_started    | > 15%               |
| AR engagement rate   | ar_session_started / tour_started | > 10% (mobile only) |

### 13.3 A/B Test Design

**Hypothesis:** Listings with 3D virtual tours have higher enquiry conversion rate than listings with photos only.

```
Test setup:
- Group A (control): Property listings without 3D tour
- Group B (variant): Same listings with 3D tour embedded
- Metric: Primary = enquiry submission rate; Secondary = viewing request rate
- Duration: 4 weeks (minimum 100 listings per group)
- Success threshold: Group B enquiry rate > Group A by ≥ 20%
```

---

## 14. Accessibility in Immersive Experiences

### 14.1 WCAG 2.1 AA Compliance for Virtual Tours

| Requirement                      | Implementation                                                                         | Status              |
| -------------------------------- | -------------------------------------------------------------------------------------- | ------------------- |
| Alternative text per room        | `aria-label="Living room: open plan, marble floors, Dubai skyline view"` on each scene | ⏳ Phase 7          |
| Keyboard navigation in 360°      | Arrow keys = rotate view; Tab = next hotspot; Enter = activate hotspot                 | ⏳ Phase 7          |
| Caption support for audio guides | WebVTT captions on any narrated tour audio                                             | ⏳ Phase 7          |
| Reduced motion option            | `prefers-reduced-motion: reduce` → disable auto-rotation; static entry                 | ✅ CSS media query  |
| High contrast for floor plans    | Floor plan viewer: high contrast mode toggle (black lines on white)                    | ⏳ Phase 7          |
| Screen reader description        | Each room has structured description accessible to VoiceOver / TalkBack                | ⏳ Phase 7          |
| No seizure-inducing content      | No rapid flashing in transitions (WCAG 2.3.1 — Three Flashes)                          | ✅ Design guideline |
| Skip navigation                  | "Skip to property details" link before tour viewer                                     | ⏳ Phase 7          |

### 14.2 Inclusive Design Considerations

- **Colour blindness:** Floor plans use patterns + labels, not colour alone to distinguish room types
- **Motor impairment:** All tour controls accessible with single switch scanning (desktop)
- **Vestibular disorders:** Warning before VR mode ("VR can cause motion sickness — take breaks if needed")
- **Low-bandwidth users:** Detect connection speed → offer "Low Quality Tour" option automatically

---

**Document Owner:** Design (@Una — CSS Specialist, @Lea — UI Engineer) + Technology (@Aurora — Platform Lead)
**Version History:** v1.0 April 2026 (initial); v2.0 April 2026 (added AR, VR, staging, analytics, accessibility sections)
**Review Cycle:** Quarterly or when new immersive technology standards emerge
**Related Documents:**

- `business/10_design_system/internationalization_tokens.md`
- `business/08_market_research/technology_upgrades.md`
- WebXR Device API: developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API
