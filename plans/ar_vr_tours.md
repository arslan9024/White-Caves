# AR/VR Virtual Property Tours

**Status**: Planned  
**Priority**: Medium  
**Estimated Effort**: 40 hours  
**Depends On**: Property detail page, image upload system

---

## Objective

Offer immersive 3D virtual tours and AR property visualization to differentiate White Caves from competitors. Buyers can explore properties remotely — critical for international Dubai investors.

---

## Success Criteria

- [ ] 3D tour viewer loads in <3s on 4G connection
- [ ] Works on desktop (mouse drag), mobile (gyroscope), and VR headsets
- [ ] AR "place furniture" feature works on iOS Safari and Android Chrome
- [ ] Tour analytics: view count, avg time spent, hotspot clicks
- [ ] Integrated into PropertyDetailPage with fallback for unsupported browsers

---

## Technology Options

| Technology | Pros | Cons | Cost |
|-----------|------|------|------|
| **Matterport SDK** | Industry standard, agent-ready cameras | $70/mo per space | $$$ |
| **Three.js + React Three Fiber** | Free, full control, lightweight | Manual 3D modeling | Dev time |
| **WebXR API** | Native browser AR/VR | Limited safari support | Free |
| **model-viewer (Google)** | Simple `<model-viewer>` tag, AR built-in | Limited interactivity | Free |

**Recommendation**: Start with `model-viewer` for AR + `pannellum` for 360° tours (both free), then upgrade to Matterport for premium listings.

---

## Implementation Checklist

### Phase 1: 360° Virtual Tours (20h)
- [ ] Install `pannellum` (open-source 360° viewer) or `@photo-sphere-viewer/core`
- [ ] Create `VirtualTourViewer` component
  - [ ] Hotspot navigation between rooms
  - [ ] Fullscreen mode
  - [ ] Mini-map orientation
- [ ] Add `Property.virtualTourUrl` field to Prisma schema
- [ ] Upload pipeline for 360° images (equirectangular format)
- [ ] Integrate into `PropertyDetailPage` as a tab
- [ ] Mobile touch/gyroscope controls

### Phase 2: AR Furniture Placement (10h)
- [ ] Use Google `model-viewer` web component
- [ ] Create `ARFurniturePlacer` component
  - [ ] Catalog of furniture models (GLTF/GLB format)
  - [ ] "View in your space" button with WebXR AR
- [ ] 3D model asset pipeline (optimize for web: <5MB per model)
- [ ] Progressive enhancement: show static images on unsupported browsers

### Phase 3: Full VR Walkthrough (10h)
- [ ] WebXR integration for VR headsets (Meta Quest, etc.)
- [ ] Virtual staging: apply different interior designs
- [ ] Multiplayer viewing (agent + client in same virtual space)
- [ ] Analytics dashboard: time in room, areas of interest

---

## Dubai Market Context

- 60%+ of Dubai property buyers are international investors (source: DLD)
- Virtual tours reduce unnecessary physical viewings by 40%
- Competitors: Bayut has basic 360° photos; Property Finder has some Matterport
- Differentiation: White Caves can be first with AR furniture + VR walkthroughs
