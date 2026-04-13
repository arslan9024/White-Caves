# AR/VR Design Tokens & Component Specifications

> **Last Updated**: April 14, 2026  
> **Purpose**: Design system tokens and component specs for AR/VR tour features  
> **Status**: Planned (Phase 1)

---

## Design Tokens for 3D/AR/VR Components

### Viewer Container Tokens
```typescript
export const arVrTokens = {
  // Viewer dimensions
  viewer: {
    minHeight: '400px',
    maxHeight: '80vh',
    borderRadius: '12px',
    aspectRatio: '16/9',
    mobileAspectRatio: '4/3',
    fullscreenZIndex: 9999,
  },

  // Loading state
  loading: {
    backgroundColor: 'var(--color-surface-secondary)',
    spinnerColor: 'var(--color-primary)',
    spinnerSize: '48px',
    overlayOpacity: 0.7,
    shimmerDuration: '1.5s',
  },

  // Tour navigation
  navigation: {
    hotspotSize: '40px',
    hotspotColor: 'var(--color-primary)',
    hotspotHoverScale: 1.2,
    hotspotPulseAnimation: '2s ease-in-out infinite',
    tooltipBackground: 'var(--color-surface-elevated)',
    tooltipShadow: 'var(--shadow-lg)',
    tooltipMaxWidth: '200px',
    arrowColor: 'var(--color-text-primary)',
    arrowSize: '32px',
  },

  // Controls bar
  controls: {
    height: '56px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    iconSize: '24px',
    iconColor: '#ffffff',
    iconActiveColor: 'var(--color-primary)',
    borderRadius: '28px',
    gap: '16px',
    padding: '0 24px',
  },

  // Room labels
  rooms: {
    labelBackground: 'rgba(0, 0, 0, 0.7)',
    labelColor: '#ffffff',
    labelFontSize: '14px',
    labelPadding: '6px 12px',
    labelBorderRadius: '20px',
  },

  // Floor plan overlay
  floorPlan: {
    width: '200px',
    height: '150px',
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: '8px',
    shadow: 'var(--shadow-xl)',
    position: 'bottom-right',
    margin: '16px',
    activeDotColor: 'var(--color-primary)',
    activeDotSize: '10px',
    inactiveDotColor: 'var(--color-text-tertiary)',
    inactiveDotSize: '6px',
  },
} as const;
```

### Color Tokens for Tour States
```typescript
export const tourStateColors = {
  // Tour status indicators
  available: {
    background: 'var(--color-success-light)',
    text: 'var(--color-success)',
    icon: '🟢',
    label: 'Virtual Tour Available',
  },
  processing: {
    background: 'var(--color-warning-light)',
    text: 'var(--color-warning)',
    icon: '🟡',
    label: 'Tour Processing',
  },
  unavailable: {
    background: 'var(--color-surface-secondary)',
    text: 'var(--color-text-tertiary)',
    icon: '⚪',
    label: 'No Tour Available',
  },
  premium: {
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
    text: '#ffffff',
    icon: '⭐',
    label: '3D Walkthrough',
  },
} as const;
```

---

## Component Specifications

### 1. VirtualTourViewer
```
Purpose: 360° panoramic image viewer using Pannellum.js
Dimensions: 100% width, 16:9 aspect ratio (4:3 on mobile)
Interactions: Click-drag to pan, scroll to zoom, click hotspots to navigate rooms

┌─────────────────────────────────────────────────┐
│                                                   │
│              [360° Panoramic View]                │
│                                                   │
│     ○ Kitchen        ○ Living Room               │
│                                                   │
│  ┌─────────────────────────────────┐             │
│  │ ◀  ●  ▶  🔍+  🔍-  ⛶  📐     │  <- Controls │
│  └─────────────────────────────────┘             │
│                           ┌──────┐               │
│                           │Floor │  <- Mini-map   │
│                           │Plan  │               │
│                           └──────┘               │
└─────────────────────────────────────────────────┘

Props:
  scenes: PannellumScene[]     // Array of 360° images with hotspot config
  initialScene: string         // ID of first scene to show
  autoRotate: boolean          // Slow auto-rotation (default: true)
  showFloorPlan: boolean       // Mini floor plan overlay (default: true)
  showControls: boolean        // Bottom control bar (default: true)
  onSceneChange: (id) => void  // Callback when user navigates to new room
  onFullscreen: () => void     // Callback on fullscreen toggle
```

### 2. ARModelViewer
```
Purpose: AR furniture/object placement using <model-viewer>
Dimensions: Same container as VirtualTourViewer
Interactions: Pinch to rotate, AR button to launch camera, tap to place

┌─────────────────────────────────────────────────┐
│                                                   │
│           [3D Model Preview]                     │
│                                                   │
│          ╔══════════╗                            │
│          ║  🪑 Sofa  ║  <- 3D object            │
│          ╚══════════╝                            │
│                                                   │
│   ┌──────────────────┐  ┌───────────────┐       │
│   │  👁️ View in AR    │  │  📱 QR Code   │       │
│   └──────────────────┘  └───────────────┘       │
│                                                   │
│   Rotate: drag  |  Zoom: pinch  |  AR: tap      │
└─────────────────────────────────────────────────┘

Props:
  modelSrc: string             // URL to .glb/.gltf 3D model
  posterSrc: string            // Fallback image while loading
  arEnabled: boolean           // Show AR button (default: true)
  showQrCode: boolean          // QR for mobile AR (desktop only)
  cameraControls: boolean      // Enable orbit controls (default: true)
  environmentImage: string     // HDR environment map for lighting
  onArStart: () => void        // Callback when AR session starts
```

### 3. TourBadge
```
Purpose: Small badge on property cards indicating tour availability
Dimensions: Inline badge (auto width × 28px height)

Variants:
┌────────────────────┐
│ 🟢 Virtual Tour    │  <- available (subtle green)
└────────────────────┘
┌────────────────────┐
│ ⭐ 3D Walkthrough   │  <- premium (gradient)
└────────────────────┘
┌────────────────────┐
│ 🟡 Coming Soon     │  <- processing
└────────────────────┘

Props:
  status: 'available' | 'premium' | 'processing' | 'unavailable'
  compact: boolean             // Icon-only mode for small cards
  onClick: () => void          // Navigate to tour
```

---

## Asset Requirements

### 360° Photo Specifications
| Property | Specification |
|----------|--------------|
| Format | Equirectangular JPEG |
| Resolution | 8192 × 4096 px (8K) recommended |
| File size | < 5MB per scene (compressed) |
| Color space | sRGB |
| Scenes per property | 5-10 (every room + balcony + view) |

### 3D Model Specifications
| Property | Specification |
|----------|--------------|
| Format | glTF 2.0 (.glb preferred) |
| Poly count | < 100K triangles per model |
| File size | < 10MB per model |
| Textures | PBR materials (metallic-roughness) |
| Scale | Real-world meters |

---

## Responsive Behavior

| Breakpoint | Viewer Height | Controls | Floor Plan |
|-----------|--------------|----------|-----------|
| Desktop (≥1024px) | 80vh (max) | Full bar | Visible |
| Tablet (768-1023px) | 60vh | Full bar | Hidden |
| Mobile (< 768px) | 50vh | Compact (icons only) | Hidden |
| Fullscreen | 100vh | Overlay (auto-hide) | Corner mini |

---

## Accessibility

- Keyboard navigation: Arrow keys for panning, +/- for zoom, Tab for hotspots, Escape for exit
- Screen reader: "Virtual tour of 2-bedroom apartment in Dubai Marina. 8 rooms available. Currently viewing: Living Room."
- Reduced motion: Disable auto-rotate, reduce hotspot animations
- High contrast: Hotspot outlines use `2px solid` in high-contrast mode
