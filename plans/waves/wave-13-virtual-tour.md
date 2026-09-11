# Wave 13: Virtual Tour Integration

## 1. Overview
We utilize **Pannellum** to render 360° virtual tours for luxury properties. The viewer is embedded directly into the property detail page.

## 2. VR Route Contract
- **Endpoint**: `GET /api/v1/properties/:id/virtual-tour`
- **Payload**:
  ```json
  {
    "provider": "pannellum",
    "panoramaUrl": "https://res.cloudinary.com/...",
    "hotSpots": [
      {
        "pitch": 14.1,
        "yaw": 1.5,
        "type": "info",
        "text": "Italian Marble Countertops"
      }
    ]
  }
  ```

## 3. Lazy Loading & Fallback Behavior
- The Pannellum iframe/canvas is **lazy-loaded** via an IntersectionObserver. It only initializes when scrolled into view.
- **Fallback**: If the user's device does not support WebGL, or if the panorama URL is missing, a static fallback image gallery is displayed instead.
