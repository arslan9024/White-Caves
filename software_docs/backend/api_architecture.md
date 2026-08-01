# RUP Backend API Architecture Specification

**Document Class:** BE-ARCH-001  
**Module:** Consolidated Express Server & Data Access Layer  
**Version:** 2026.08-BE-V1  
**Owner:** @Mira (Backend Lead) + @Ruchi (Systems Engineer)  
**Status:** ✅ Active — Strict Enforcement  

---

## 1. Consolidated Express Topology (`server/`)

All backend server assets are unified inside the `/server` root directory:

- `/server/config/`: Singleton Prisma Client DB connection manager.
- `/server/controllers/`: Pure REST API controllers (`auth.controller.ts`, `property.controller.ts`, `lease.controller.ts`).
- `/server/middleware/`: Auth verification, Zod request body validation, and Founder Level 5 Master access guards.
- `/server/routes/`: Route definitions (`/api/v1/properties`, `/api/v1/leads`, `/api/v1/ejari`).

---

## 2. Founder Level 5 Master Bypass Security Contract

- Profile matching `arslanmalikgoraha@gmail.com` automatically bypasses RBAC permission checks and resolves `accessLevel: 5` (`LEVEL_5_MASTER`).
- Bypasses rate limits and auto-hydrates 100-user, 100-property, and 12-department mock ledgers in local memory context.
