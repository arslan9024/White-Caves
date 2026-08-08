# Wave 13 — Virtual Tour: pannellum-react Integration Plan

<!-- markdownlint-disable MD032 MD040 MD060 -->

**Drafted by:** @Pannellum  
**Model:** Gemini 2.0 Flash  
**Status:** ✅ READY (retrospective spec for implemented Wave 13)  
**Last Updated:** 2026-05-25  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM Wave 13 virtual tour feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend media/UX reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

CONSUMES←@Cloudinary: `business_docs/09_crm_features/wave-13-media-upload.md#http-routes`  
FEEDS→@Marissa: `business_docs/06_design_architecture/ui-ux-specification.md#virtual-tour`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-13-virtual-tour.md`

---

## 1. Overview

Virtual tours allow prospective buyers and tenants to explore property interiors via an interactive 360° panoramic viewer embedded directly in the property listing page. The implementation uses `pannellum-react` as the viewer component, loaded lazily to avoid increasing the initial bundle.

---

## 2. Component Architecture

```
PropertyDetailPage
  └── VirtualTourSection (lazy-loaded)
      └── React.lazy(() => import('@/components/property/VirtualTourViewer'))
          └── pannellum-react <Pannellum> component
```

### 2.1 Lazy Loading

```typescript
const VirtualTourViewer = React.lazy(() =>
  import('@/components/property/VirtualTourViewer')
);

// Wrapped in Suspense with a skeleton placeholder
<Suspense fallback={<VirtualTourSkeleton />}>
  <VirtualTourViewer panoramaUrl={property.virtualTourUrl} />
</Suspense>
```

---

## 3. VirtualTourViewer Component

### 3.1 Props

```typescript
interface VirtualTourViewerProps {
  panoramaUrl: string;       // URL to equirectangular 360° JPEG/PNG
  title?: string;            // overlay title (property name)
  autoLoad?: boolean;        // default true
  showFullscreen?: boolean;  // default true
  hotspots?: Hotspot[];      // optional clickable tour points
}

interface Hotspot {
  pitch: number;
  yaw: number;
  type: 'info' | 'scene';
  text?: string;
  sceneId?: string;
}
```

### 3.2 pannellum-react Configuration

```tsx
<Pannellum
  width="100%"
  height="500px"
  image={panoramaUrl}
  pitch={10}
  yaw={180}
  hfov={110}
  autoLoad={autoLoad}
  showFullscreenCtrl={showFullscreen}
  hotspots={hotspots}
  onLoad={() => setLoaded(true)}
  onError={(err) => setError(err)}
/>
```

---

## 4. Fallback Behaviour

| Condition | Behaviour |
|-----------|-----------|
| `panoramaUrl` is `null` / empty | Component not rendered; property page shows "No virtual tour available" notice |
| pannellum fails to load image (404, CORS) | `onError` callback triggers `<VirtualTourError>` fallback with "Tour temporarily unavailable" message |
| JavaScript disabled / SSR | Component excluded from SSR via `React.lazy`; standard photo gallery shown |
| Reduced-motion preference | Auto-rotation disabled; manual navigation only |

---

## 5. Dependency Note

> **Peer dependency conflict:** `pannellum-react@1.2.4` declares `react@^16` as a peer dependency, which conflicts with the project's React 18.  
> **Resolution:** Install with `npm install --legacy-peer-deps`. The library is functionally compatible with React 18; the peer warning is a false positive.

---

## 6. Property Data Model Extension

The `Property` model requires a `virtualTourUrl` field:

```prisma
model Property {
  // ... existing fields
  virtualTourUrl  String?    // URL to 360° panorama image
}
```

**Admin upload flow:**
1. Agent uploads equirectangular panorama via CRM property edit form
2. Image stored via `StorageService` (or direct URL entry for external Matterport links)
3. `virtualTourUrl` saved to property record
4. Listing page detects non-null `virtualTourUrl` and renders `VirtualTourSection`

---

## 7. Performance Considerations

| Concern | Mitigation |
|---------|-----------|
| Large panorama images (5–15MB typical) | Lazy-loaded component; progressive loading via pannellum built-in |
| First interaction delay | `autoLoad={false}` renders a "Click to explore" overlay; loads on click |
| Bundle size | `pannellum-react` is ~180KB gzipped; isolated in a separate async chunk |
| Mobile performance | Component renders at `height: 300px` on `< 768px` breakpoint |

---

## 8. Virtual Tour Route (Backend)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/properties/:id/virtual-tour` | `agent` | Set `virtualTourUrl` (upload or URL) |
| `DELETE` | `/api/properties/:id/virtual-tour` | `agent` | Remove virtual tour link |

---

## 9. Acceptance Criteria

- [x] `pannellum-react` installed via `--legacy-peer-deps`
- [x] Component lazy-loaded with `React.lazy` + `Suspense`
- [x] Loads panorama from `virtualTourUrl` stored on property record
- [x] Graceful fallback when URL is null or image fails to load
- [x] Fullscreen button functional in desktop browsers
- [x] Mobile viewport renders at reduced height (300px)
- [x] No SSR error (component excluded from server render pass)
