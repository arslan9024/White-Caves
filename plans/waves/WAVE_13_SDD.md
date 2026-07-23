# Wave 13 — System Design Document (SDD)

**Wave:** 13  
**Focus:** Real-Time & Media (Socket.io + Image Upload + Virtual Tour)  
**Status:** ✅ Complete  
**Date:** 2026-05-24  
**Owners:** @Socket + @Cloudinary + @Pannellum + @Mira + @Katherine  
**Entry Gate:** Wave 12 green + readiness specs from @Socket/@Cloudinary/@Pannellum + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

## Scope

- Item 12: Real-time notifications via Socket.io
- Item 11: Property image upload pipeline
- Item 10: Virtual tour/VR integration

---

## Architecture

1. Socket gateway with JWT-authenticated connections and user-room delivery.
2. Storage service abstraction for media upload and transformation.
3. Virtual tour component using `pannellum-react`, lazy loaded.

---

## Free-Agent Spec Ownership

| Agent       | Model              | Spec Output                                                       |
| ----------- | ------------------ | ----------------------------------------------------------------- |
| @Socket     | Llama 3.1 70B Groq | `business_docs/09_crm_features/wave-13-realtime-notifications.md` |
| @Cloudinary | DeepSeek V3        | `business_docs/09_crm_features/wave-13-media-upload.md`           |
| @Pannellum  | Gemini 2.0 Flash   | `business_docs/09_crm_features/wave-13-virtual-tour.md`           |

---

## Validation Commands

```bash
npm run typecheck
npm run build
npm run plans:validate
```
