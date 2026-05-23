# 🟠 Incomplete Features — Partially Built but Not Functional

> **Phase assignments**: Phases 2, 4, 6, 7  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: High — these features have UI shells but no working backend

---

## Item 6 — No Job Scheduler / Cron

**Phase**: Phase 6  
**Current state**: No scheduler library in `package.json`. Automated tasks (rent reminders, lead score batch updates, permit expiry warnings) have route code but are never triggered automatically.

### What Needs Doing
- [ ] Install `node-cron` and types: `npm install node-cron @types/node-cron`
- [ ] Create `server/services/SchedulerService.ts` — registers all cron jobs at server startup
- [ ] Daily job: auto-unpublish properties with expired RERA permits
- [ ] Daily job: batch-rescore all leads (`LeadScoringService.batchRescore()`)
- [ ] Monthly job: auto-generate `RentPayment` records for active leases
- [ ] Day-5/10/15/25 jobs: WhatsApp rent reminders and late-fee escalation (Phase 5 dependency)
- [ ] Weekly job: regenerate `sitemap.xml` from live property data
- [ ] Add job execution logging to `Activity` model so the Audit Log shows cron history

### Acceptance Criteria
- Server starts → all cron jobs register without error
- Daily RERA check runs at 02:00 UTC and unpublishes expired properties
- Batch lead scoring runs at 03:00 UTC and updates `Lead.score` + `LeadScoreHistory`
- Cron job activity is visible in the Activity model with `type: 'system'`

---

## Item 7 — Document Generation — No Real PDF Engine

**Phase**: Phase 7  
**Current state**: Document routes exist in `server/routes/documents.ts`. No `pdfkit`, `puppeteer`, or `exceljs` in `package.json`. Reports and contracts cannot be downloaded.

### What Needs Doing
- [ ] Install: `npm install puppeteer exceljs pdfkit @types/pdfkit`
- [ ] Create `server/services/DocumentService.ts` with methods:
  - `generateContractPDF(contractId)` — renders a signed tenancy agreement to PDF
  - `generateAgentCommissionStatement(agentId, month)` — agent PDF with company letterhead
  - `generateMonthlyPLReport(month)` — P&L summary PDF
  - `exportLeadsToExcel(filters)` — filtered leads as `.xlsx`
  - `exportPropertiesToExcel(filters)` — property inventory as `.xlsx`
- [ ] Store generated files temporarily in `/tmp/` and stream to client with `Content-Disposition: attachment`
- [ ] Add `GET /api/documents/contract/:id/pdf` route
- [ ] Add `GET /api/documents/commission/:agentId/pdf` route
- [ ] Add `GET /api/reports/leads/excel` route
- [ ] Wire export buttons in CRM tabs to the new routes

### Acceptance Criteria
- Managing director clicks "Export Leads" → downloads `.xlsx` with all leads matching current filter
- Managing director opens a contract and clicks "Download PDF" → receives a formatted PDF with company logo
- Files are never stored permanently on disk — all streaming responses

---

## Item 8 — Email Service — Triggers Not Wired

**Phase**: Phase 4  
**Files**: `server/services/emailService.ts`, Resend SDK already installed

### Problem
`resend` is installed and `emailService.ts` exists with a `sendEmail()` wrapper, but most domain events never trigger an email. Critical notifications are silently dropped.

### What Needs Doing
- [ ] Create HTML email templates in `server/templates/email/` using Handlebars (install `handlebars`):
  - `welcome.hbs` — new user registered
  - `lead-assigned.hbs` — lead assigned to an agent
  - `viewing-confirmed.hbs` — viewing appointment confirmed
  - `viewing-reminder.hbs` — 24h before viewing
  - `offer-received.hbs` — owner notified of new offer
  - `contract-signed.hbs` — all parties notified
  - `rent-reminder.hbs` — tenant rent due in 7 days
  - `kyc-approved.hbs` — client KYC verification approved
- [ ] Wire each template to the corresponding route/service event:
  - After `POST /api/leads` → `emailService.send('lead-assigned', assignedAgent)`
  - After `POST /api/viewings` → `emailService.send('viewing-confirmed', lead + agent)`
  - After KYC status changes to `verified` → `emailService.send('kyc-approved', client)`
- [ ] Add email delivery status to `Activity` model
- [ ] Add `RESEND_API_KEY` to production env and document in `DEPLOYMENT_GUIDE.md`

### Acceptance Criteria
- New lead assigned to agent → agent receives email within 60 seconds
- Viewing booked → both agent and lead receive confirmation email
- All email templates render correctly in Gmail, Outlook, and Apple Mail

---

## Item 9 — Landlord / Tenant Portal — Phase 2 In Progress

**Phase**: Phase 2  
**Files**: `src/pages/landlord/`, `src/pages/tenant/`

### Problem
Portal page shells exist but most actions are UI-only with no real backend data. Landlords cannot view their actual properties, tenants cannot see their real lease or payment history.

### What Needs Doing

#### Landlord Portal
- [ ] `GET /api/landlord/properties` — return properties where `userId === authenticatedUser.id`
- [ ] `GET /api/landlord/tenants` — return tenants in the landlord's properties
- [ ] `GET /api/landlord/income` — rental income summary (sum of `RentPayment.amount` grouped by month)
- [ ] `GET /api/landlord/maintenance` — maintenance requests for their properties
- [ ] `POST /api/landlord/maintenance/:id/approve` — approve or reject maintenance spend
- [ ] Wire `LandlordDashboard.tsx` to live API endpoints, replacing mock data

#### Tenant Portal
- [ ] `GET /api/tenant/lease` — return active lease for the authenticated tenant
- [ ] `GET /api/tenant/payments` — rent payment history
- [ ] `GET /api/tenant/maintenance` — their maintenance requests
- [ ] `POST /api/tenant/maintenance` — submit new maintenance request
- [ ] `GET /api/tenant/documents` — download lease PDF
- [ ] Wire `TenantDashboard.tsx` to live API endpoints

### Acceptance Criteria
- Landlord logs in → sees only their properties and real tenant list
- Tenant logs in → sees their current lease details, next payment due date, and payment history
- Both portals work on mobile (375px)

---

## Item 10 — Virtual Tour / VR — UI Only

**Phase**: Phase 7  
**Files**: `src/components/property/VirtualTour.tsx`, `src/components/property/VirtualTourGallery.tsx`

### Problem
Virtual tour components exist but render a placeholder. No 360° viewer library is integrated. Luxury buyers expect immersive property tours.

### What Needs Doing
- [ ] Evaluate and choose viewer: **Pannellum** (open source, iframe) or **Matterport SDK** (requires Matterport subscription)
- [ ] For Pannellum (recommended free option): `npm install pannellum-react`
- [ ] Update `VirtualTour.tsx` to use `<Pannellum>` component with a 360° equirectangular image URL
- [ ] Add `virtualTourUrl` field to Property Prisma model (stores equirectangular image URL or Matterport ID)
- [ ] Add virtual tour upload in the Property creation/edit form
- [ ] Show "Virtual Tour" badge on property cards when `virtualTourUrl` is set
- [ ] Lazy-load the Pannellum library (heavy — split from main bundle)

### Acceptance Criteria
- Property with a 360° image → "Take Virtual Tour" button opens a full-screen interactive panorama
- User can pan, tilt, and zoom the 360° view
- Pannellum bundle is not loaded on pages where no virtual tour exists
- Works on mobile touch (pinch-to-zoom)

---

## Item 11 — Property Image Upload — No Cloud Storage

**Phase**: Phase 6  
**Current state**: Property model has `images: String[]` (stores URLs) but no upload endpoint exists. Agents add image URLs manually — no file upload capability.

### What Needs Doing
- [ ] Install `multer` and `@aws-sdk/client-s3` (or Cloudinary SDK): `npm install multer @types/multer @aws-sdk/client-s3`
- [ ] Create `server/services/StorageService.ts` — wraps S3/Cloudinary upload, returns CDN URL
- [ ] `POST /api/properties/:id/images` — multipart upload endpoint, accepts up to 20 images (10MB each)
- [ ] Auto-generate WebP thumbnail at 800×600 and full image at 1920×1280
- [ ] Store returned CDN URLs in `property.images` array via Prisma update
- [ ] `DELETE /api/properties/:id/images/:imageIndex` — remove an image
- [ ] Add drag-and-drop image uploader component to the Property create/edit form
- [ ] Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to env docs

### Acceptance Criteria
- Agent uploads 10 photos → all stored on Cloudinary with WebP optimization
- Property detail page loads images with the `srcset` serving the correct size per viewport
- Upload UI shows progress bar and error if file exceeds 10MB

---

## Item 12 — Notifications System — No Real-Time Delivery

**Phase**: Phase 4  
**Files**: `src/store/slices/notificationSlice.ts`, `server/routes/notifications.ts`

### Problem
The notification slice exists and the REST API stores notifications in MongoDB, but there is no real-time push. Users only see notifications when they manually refresh or poll. In a CRM, instant notification is critical (new lead, offer received, etc.).

### What Needs Doing
- [ ] Install `socket.io` and `socket.io-client`: `npm install socket.io socket.io-client`
- [ ] Initialize Socket.io server alongside Express in `server/index.ts`
- [ ] Authenticate socket connections using the existing JWT middleware
- [ ] Create `server/services/NotificationService.ts` — wraps `io.to(userId).emit('notification', payload)`
- [ ] Call `NotificationService.push()` from all key events:
  - New lead created → notify assigned agent
  - New offer received → notify property owner
  - Viewing confirmed → notify agent + lead
  - Commission paid → notify agent
  - Maintenance request submitted → notify property manager
- [ ] Update `notificationSlice.ts` to connect to Socket.io and append incoming notifications
- [ ] Show notification dot on the bell icon in real time without page refresh

### Acceptance Criteria
- Agent receives a browser notification badge within 2 seconds of a new lead being assigned
- Notification bell shows count without page refresh
- Closing and reopening the browser: unread notifications persist (stored in DB)
- Works on mobile browsers
