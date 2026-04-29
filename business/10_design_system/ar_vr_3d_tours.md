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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tourUrl` | `string` | required | Matterport or custom tour URL |
| `propertyId` | `string` | required | Property ID for analytics tracking |
| `height` | `string` | `"600px"` | Viewer height |
| `showFloorPlan` | `boolean` | `true` | Show/hide floor plan overlay |
| `showMinimap` | `boolean` | `true` | Show/hide position minimap |
| `autoRotate` | `boolean` | `false` | Auto-rotate on load |
| `startPosition` | `object` | `null` | Initial camera position |
| `onLoad` | `function` | `null` | Callback when tour loads |
| `onNavigate` | `function` | `null` | Callback on room change |

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `images` | `Image[]` | required | Property images array |
| `tourUrl` | `string?` | `null` | Optional 3D tour URL |
| `panoramas` | `string[]` | `[]` | 360° image URLs |
| `videoUrl` | `string?` | `null` | Property video URL |
| `layout` | `"grid" \| "carousel" \| "masonry"` | `"carousel"` | Gallery layout |

### 2.3 FloorPlanViewer Component

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `floorPlanUrl` | `string` | required | Floor plan image or SVG URL |
| `rooms` | `Room[]` | `[]` | Interactive room hotspots |
| `measurements` | `boolean` | `true` | Show room dimensions |
| `interactive` | `boolean` | `true` | Enable click-to-navigate |
| `unit` | `"sqft" \| "sqm"` | `"sqft"` | Measurement unit |

---

## 3. 360° Photography Components

### 3.1 PanoramaViewer Component

Built on pannellum.js for lightweight 360° photo viewing.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `imageUrl` | `string` | required | Equirectangular 360° image URL |
| `hotspots` | `Hotspot[]` | `[]` | Interactive hotspots with info |
| `autoRotate` | `number` | `2` | Auto-rotation speed (deg/sec) |
| `compass` | `boolean` | `true` | Show compass widget |
| `fullscreen` | `boolean` | `true` | Enable fullscreen button |
| `initialView` | `object` | `{ pitch: 0, yaw: 0 }` | Initial camera orientation |

### 3.2 PanoramaTour Component

Multi-scene 360° tour with navigation between rooms.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `scenes` | `Scene[]` | required | Array of 360° scenes |
| `startScene` | `string` | first scene | Initial scene ID |
| `transition` | `"fade" \| "swipe" \| "none"` | `"fade"` | Scene transition animation |

---

## 4. AR Components (Augmented Reality)

### 4.1 ARFurnitureStaging Component

Virtual furniture staging using WebXR or 8th Wall SDK.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `roomImage` | `string` | required | Base room image URL |
| `furnitureCatalog` | `Furniture[]` | `[]` | Available furniture items |
| `style` | `"modern" \| "arabic" \| "minimalist" \| "luxury"` | `"modern"` | Default furniture style |
| `onSave` | `function` | `null` | Save staged configuration |
| `budget` | `object?` | `null` | Optional budget constraint |

### 4.2 ARPropertyOverlay Component

Overlay property information when pointing camera at a building.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `properties` | `Property[]` | required | Nearby properties with GPS coordinates |
| `maxDistance` | `number` | `500` | Maximum distance in meters |
| `showPrice` | `boolean` | `true` | Show price overlay |
| `showAvailability` | `boolean` | `true` | Show availability status |

---

## 5. VR Components (Virtual Reality)

### 5.1 VRTourExperience Component

Full VR walkthrough using WebXR API.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `modelUrl` | `string` | required | 3D model URL (glTF/GLB) |
| `vrMode` | `"immersive" \| "inline"` | `"inline"` | VR mode type |
| `controllers` | `boolean` | `true` | Enable VR controllers |
| `teleportation` | `boolean` | `true` | Enable teleport navigation |
| `lighting` | `"day" \| "night" \| "custom"` | `"day"` | Scene lighting |
| `onInteraction` | `function` | `null` | Callback for user interactions |

---

## 6. Shared UI Elements

### 6.1 TourBadge Component

Badge displayed on property listing cards to indicate tour availability.

| Variant | Icon | Label | Color |
|---------|------|-------|-------|
| `3d-tour` | 🏠 | "3D Tour" | `--color-primary` |
| `360-photo` | 📷 | "360°" | `--color-secondary` |
| `vr-ready` | 🥽 | "VR Ready" | `--color-accent` |
| `ar-staging` | 🪑 | "Virtual Staging" | `--color-success` |
| `video` | 🎬 | "Video Tour" | `--color-info` |

### 6.2 TourControls Component

Unified control bar for all tour types.

| Control | Icon | Action |
|---------|------|--------|
| Fullscreen | ⛶ | Toggle fullscreen |
| Floor Plan | 📐 | Toggle floor plan overlay |
| Share | 🔗 | Copy tour link / send via WhatsApp |
| Favorite | ❤️ | Save to favorites |
| Schedule | 📅 | Book in-person viewing |
| AR Mode | 📱 | Switch to AR (if supported) |
| VR Mode | 🥽 | Switch to VR (if supported) |

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

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard Navigation** | Tab through hotspots, arrow keys for rotation |
| **Screen Reader** | `aria-label` on all interactive elements, room descriptions |
| **High Contrast** | Controls meet 7:1 contrast ratio (WCAG AAA) |
| **Motion Sensitivity** | `prefers-reduced-motion` disables auto-rotate |
| **Alternative Content** | Static images + text descriptions for non-WebGL browsers |
| **Focus Indicators** | Visible focus ring on all interactive tour elements |
| **Skip Navigation** | "Skip to tour controls" link before viewer |

---

## 9. Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tour load time | <3 seconds | First meaningful paint |
| 360° image load | <2 seconds | Per panorama scene |
| Frame rate | ≥30 FPS | During tour navigation |
| Memory usage | <200MB | Peak during VR mode |
| Mobile support | iOS 15+, Android 10+ | Device compatibility |
| Bundle size | <150KB (viewer) | Gzipped JavaScript |

---

## Sources

- [Matterport SDK Documentation](https://matterport.github.io/showcase-sdk/)
- [Pannellum Documentation](https://pannellum.org/documentation/)
- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [Three.js Documentation](https://threejs.org/docs/)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
