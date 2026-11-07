# Phase 6 — Compliance & Regulatory

> **Priority**: #6 (after Phase 5)
> **Goal**: Full UAE RERA/KYC/AML/PDPL compliance automation — no manual compliance checks
> **Prerequisite**: Phase 5 (Lease module) for property permit enforcement; ComplyAdvantage contract for AML
> **Status**: 🔲 Not Started
> **Detailed context**: See [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md#phase-6--compliance--regulatory-after-phase-5)

---

## Why This Is Phase 6

UAE real estate is heavily regulated. RERA permits, Ejari registrations, KYC/AML checks, and PDPL
data privacy compliance are legal requirements — not optional features. Non-compliance can result in
fines, permit revocations, or reputational damage. This phase implements automated enforcement so
agents cannot accidentally violate regulations.

---

## External Dependencies

| Dependency              | Owner          | Notes                                                     |
| ----------------------- | -------------- | --------------------------------------------------------- |
| ComplyAdvantage API key | Business/Legal | For AML/PEP/Sanctions screening                           |
| Multer file upload      | Internal       | `npm install multer @types/multer`                        |
| node-cron               | Internal       | `npm install node-cron @types/node-cron` (if not Phase 5) |
| S3/Cloud Storage        | DevOps         | AWS S3 or Vercel Blob for document storage                |
| PDPL legal review       | Legal team     | Before deploying consent management                       |

---

## What Already Exists ✅

| Item                        | Location                                     | Status                |
| --------------------------- | -------------------------------------------- | --------------------- |
| Laila Compliance CRM        | `src/components/crm/LailaComplianceCRM_NEW/` | ✅ UI exists          |
| `Document` Prisma model     | `prisma/schema.prisma`                       | ✅ Exists             |
| `Lease.ejariContractNumber` | `prisma/schema.prisma`                       | ✅ Via Phase 5        |
| Compliance routes           | `server/routes/compliance.ts`                | ✅ Basic routes exist |

---

## What Needs To Be Done 🚧

### 6.1 — RERA Permit Enforcement

- [ ] Verify `Property` model has `permitNumber` and `permitExpiryDate` fields; add if missing
- [ ] Validation middleware on `POST /api/properties` + `PATCH /api/properties/:id`: block `status = "listed"` if `permitNumber` is missing
- [ ] Cron job (daily 06:00 UAE): query properties where `permitExpiryDate < today` → set `status = "permit_expired"`
- [ ] Cron job (daily 06:00 UAE): query properties where `permitExpiryDate < today + 30 days` → create warning Activity record
- [ ] Laila compliance dashboard: "RERA Alerts" tab listing expiring/expired permits
- [ ] Install `node-cron` if not installed by Phase 5: `npm install node-cron @types/node-cron`

---

### 6.2 — KYC Document Upload Workflow

- [ ] Install Multer: `npm install multer @types/multer`
- [ ] File upload middleware: `server/middleware/upload.ts` — accept PDF/JPG/PNG, max 10MB
- [ ] Cloud storage integration: `server/services/StorageService.ts` — upload to S3 or Vercel Blob
- [ ] KYC endpoints:
  ```
  POST /api/clients/:id/kyc/upload  — upload document (passport, Emirates ID, proof of funds)
  GET  /api/clients/:id/kyc         — list uploaded KYC documents with status
  PATCH /api/clients/:id/kyc/:docId — update KYC status (under_review, verified, rejected)
  ```
- [ ] `Document` model fields: `clientId`, `type` (passport/eid/proof_of_funds), `url`, `status` (pending/under_review/verified/rejected), `reviewedBy`, `reviewedAt`
- [ ] Block `Transaction` creation when `Client.kycStatus !== 'verified'`
- [ ] Laila KYC tab: list clients needing KYC review, one-click approve/reject

---

### 6.3 — AML Screening

- [ ] Create `server/services/AMLService.ts` — wraps ComplyAdvantage API
- [ ] `AMLService.screenClient(client)` — POST to ComplyAdvantage `/searches` endpoint
- [ ] Store result in `Client.amlStatus` and `Client.amlLastChecked`
- [ ] Auto-screen on client creation: trigger from `POST /api/clients` after DB save
- [ ] PEP/Sanctions match: if result contains a match, set `amlStatus = "flagged"`, create Activity record, send alert to Laila inbox
- [ ] Laila AML tab: list flagged clients, SAR (Suspicious Activity Report) workflow
  - SAR form: client name, reason, description, attachments
  - Submit → create `Document` record of type `sar`, set `Client.amlStatus = "sar_filed"`

---

### 6.4 — PDPL Consent Management

- [ ] Add consent checkbox to all data-collection forms (contact form, lead form, signup)
- [ ] New `Consent` Prisma model:
  ```prisma
  model Consent {
    id        String   @id @default(auto()) @map("_id") @db.ObjectId
    userId    String   @db.ObjectId
    date      DateTime @default(now())
    version   String   // consent policy version number
    purpose   String   // marketing, data_processing, etc.
    ipAddress String?
    granted   Boolean  @default(true)
  }
  ```
- [ ] Store consent record on form submission: `POST /api/consent`
- [ ] Opt-out: `PATCH /api/consent/:userId/revoke` — set `granted = false`, stop marketing communications
- [ ] Right of access: `GET /api/users/:id/data-export` — return all user data as JSON (for download)
- [ ] Account deletion: `DELETE /api/users/:id` — soft delete, zero out PII fields, keep anonymized records for 7 years (per UAE law)

---

### 6.5 — Image Upload & CDN (General)

- [ ] Property image upload: `POST /api/properties/:id/images` — accepts multipart, stores in cloud storage
- [ ] Return CDN URL, store in `Property.images[]`
- [ ] Image optimization pipeline: resize to 1920px max width, convert to WebP, generate 400px thumbnail
- [ ] Delete image: `DELETE /api/properties/:id/images/:imageId`
- [ ] Use in MaryInventoryCRM: "Upload Images" button on property detail

---

### 6.6 — Auto-Generated Sitemap

- [ ] Install `sitemap` package: `npm install sitemap`
- [ ] Daily cron job: generate `/public/sitemap.xml` from all published properties
  - Static pages: home, /properties, /about, /contact, /careers
  - Dynamic: `/properties/:id` for each active property
- [ ] Ping Google Search Console on regeneration

---

## Definition of Done — Phase 6

- [ ] Properties cannot be listed without a RERA permit number
- [ ] RERA cron runs daily and auto-flags expired permits in Laila dashboard
- [ ] KYC documents can be uploaded for clients; status flows through pending → verified/rejected
- [ ] Transactions are blocked when client KYC is not verified
- [ ] AML screening runs automatically on client creation (requires ComplyAdvantage API key)
- [ ] PDPL consent is captured on all data-collection forms
- [ ] Property images can be uploaded and stored in cloud storage
- [ ] Sitemap is auto-generated daily
- [ ] Tests pass: `npx vitest run`
- [ ] Build passes: `npm run build`

---

## Next Phase After This

Once Phase 6 is complete, move to **[PHASE_7_ANALYTICS.md](./PHASE_7_ANALYTICS.md)** — Analytics, Portal Syndication & Financial Exports.
