# Portal Listing Syndication — CRM Feature Specification

> **Status:** Planned
> **Module Owner:** Syndication Engine (server/services/portalSyndication/)
> **Last Updated:** May 2026
> **Priority:** High
> **API Endpoints:** `/api/syndication`, `/api/webhooks/propertyfinder`, `/api/webhooks/bayut`

---

## Overview

The Portal Syndication Engine pushes validated White Caves listings to Dubai's major property portals (PropertyFinder, Bayut, Dubizzle) and pulls inbound leads from those portals back into the CRM. All outbound listings must carry a valid Trakheesi permit number — syndication is blocked for listings missing or expired permits.

**Key Capabilities:**
- Automated listing push to PropertyFinder (XML feed + REST API)
- Automated listing push to Bayut/Dubizzle (XML feed via partner agreement)
- Real-time inbound lead capture from portal webhooks
- Feed error monitoring and retry queue
- Portal-specific field mapping and validation
- Syndication health dashboard for operations team

---

## User Stories

- As a **listing agent**, I want my property to go live on PropertyFinder and Bayut automatically when I publish it in the CRM, so that I maximise exposure without manual re-entry.
- As a **manager**, I want to see which listings failed syndication and why, so that I can fix issues quickly.
- As a **manager**, I want portal leads ingested into the CRM automatically, so that agents are notified and no enquiry is lost.
- As an **admin**, I want to configure which portals each listing is pushed to, so that I control spend.
- As a **compliance officer**, I want syndication blocked for listings without a valid Trakheesi permit, so that we avoid AED 50,000 RERA fines.

---

## Supported Portals

| Portal | Integration Type | Lead Delivery | Status |
|--------|-----------------|--------------|--------|
| PropertyFinder | XML feed (standard) + REST API (premium) | Webhook + email | Planned |
| Bayut | XML feed (partner agreement) | Webhook | Planned |
| Dubizzle | XML feed (partner agreement) | Email/Webhook | Planned |

---

## Data Model

### SyndicationProfile (per property)

```typescript
SyndicationProfile {
  propertyId: string;
  portals: {
    propertyFinder: { enabled: boolean; listingId?: string; lastSyncedAt?: Date; status: SyndicationStatus };
    bayut:          { enabled: boolean; listingId?: string; lastSyncedAt?: Date; status: SyndicationStatus };
    dubizzle:       { enabled: boolean; listingId?: string; lastSyncedAt?: Date; status: SyndicationStatus };
  };
  lastFeedGeneratedAt?: Date;
  feedErrors: SyndicationError[];
}

type SyndicationStatus = 'not_pushed' | 'live' | 'pending' | 'rejected' | 'expired' | 'paused';

SyndicationError {
  portal: string;
  errorCode: string;
  errorMessage: string;
  occurredAt: Date;
  resolved: boolean;
}
```

---

## Outbound Syndication — Listing Push

### Pre-Syndication Validation Gate

Before a listing is pushed to any portal, the system validates:

| Check | Rule | On Failure |
|-------|------|-----------|
| Trakheesi permit | `permitNumber` present and `permitExpiryDate` > today | Block syndication; set status `rejected`; alert agent |
| Agent BRN | `agent.reraRegistrationNumber` present | Block syndication; alert agent |
| Mandatory photos | Minimum 3 photos uploaded | Block with warning; agent can override |
| Price | `listingPrice > 0` | Block syndication |
| Description | `description.length >= 50` characters | Block with warning |
| Property type | Valid enum value from portal's property type list | Map to nearest portal equivalent |

### PropertyFinder XML Feed

The standard integration produces an XML feed at a publicly accessible URL refreshed every 4 hours:

```
GET https://cdn.whitecaves.ae/feeds/propertyfinder.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<properties>
  <property>
    <reference_number>WC-12345</reference_number>
    <operation_type>for-sale</operation_type>           <!-- for-sale | for-rent -->
    <property_type>villa</property_type>
    <price>2500000</price>
    <price_currency>AED</price_currency>
    <bedroom>3</bedroom>
    <bathroom>4</bathroom>
    <size>4200</size>                                    <!-- sqft -->
    <size_unit>sqft</size_unit>
    <city>Dubai</city>
    <community>DAMAC Hills 2</community>
    <sub_community>Aknan</sub_community>
    <title_en>Spacious 3BR Villa with Pool</title_en>
    <description_en>Premium villa with private pool...</description_en>
    <permit_number>RERA-1234567</permit_number>          <!-- Trakheesi permit — mandatory -->
    <agent_name>Ahmed Hassan</agent_name>
    <agent_license>BRN-12345</agent_license>
    <agent_email>ahmed@whitecaves.ae</agent_email>
    <agent_phone>+971501234567</agent_phone>
    <photos>
      <photo>https://cdn.whitecaves.ae/prop/12345/img1.jpg</photo>
      <photo>https://cdn.whitecaves.ae/prop/12345/img2.jpg</photo>
      <photo>https://cdn.whitecaves.ae/prop/12345/img3.jpg</photo>
    </photos>
    <amenities>
      <amenity>pool</amenity>
      <amenity>gym</amenity>
      <amenity>parking</amenity>
    </amenities>
    <floor>5</floor>
    <furnishing>furnished</furnishing>                  <!-- furnished | unfurnished | semi-furnished -->
    <completion_status>ready</completion_status>        <!-- ready | off-plan -->
  </property>
</properties>
```

### Bayut/Dubizzle XML Feed

Bayut and Dubizzle use a similar XML format but with portal-specific field names. The syndication service maintains a **field mapping table** per portal:

| White Caves Field | PropertyFinder | Bayut | Dubizzle |
|------------------|---------------|-------|---------|
| `listingPrice` | `<price>` | `<price>` | `<price>` |
| `propertyType` | `<property_type>` | `<property_type>` | `<category>` |
| `permitNumber` | `<permit_number>` | `<permit_number>` | `<permit_number>` |
| `bedrooms` | `<bedroom>` | `<bedroom>` | `<bedrooms>` |
| `buaSqft` | `<size>` | `<size>` | `<size>` |
| `communityName` | `<community>` | `<location>` | `<location>` |

### Feed Generation Service

```typescript
// server/services/portalSyndication/FeedGeneratorService.ts
class FeedGeneratorService {
  async generatePropertyFinderFeed(): Promise<string>;   // returns XML string
  async generateBayutFeed(): Promise<string>;
  async generateDubizzleFeed(): Promise<string>;
  async uploadFeedToCDN(portal: string, xml: string): Promise<string>;  // returns CDN URL
}
```

**Schedule:** Cron job every 4 hours; on-demand trigger when a listing is published or updated.

---

## Inbound Lead Capture — Portal Webhooks

### PropertyFinder Lead Webhook

PropertyFinder sends buyer enquiry leads to:
```
POST /api/webhooks/propertyfinder/leads
```

**Payload:**
```json
{
  "reference_number": "WC-12345",
  "buyer_name": "Sarah Johnson",
  "buyer_email": "sarah@example.com",
  "buyer_phone": "+971501234567",
  "message": "I'm interested in this property. Is it still available?",
  "portal": "propertyfinder",
  "enquiry_date": "2026-05-25T10:30:00Z"
}
```

**CRM Processing:**
1. Look up `reference_number` → find property → find assigned agent
2. Create lead record: `source: 'propertyfinder'`, `channel: 'portal'`
3. Assign to listing agent or round-robin if no assigned agent
4. Trigger WhatsApp notification to assigned agent
5. Send auto-acknowledgement WhatsApp/email to buyer within 2 minutes
6. Log inbound lead in analytics (portal attribution)

### Bayut Lead Webhook

```
POST /api/webhooks/bayut/leads
```

Similar payload format; field mapping handled by `LeadIngestionService`.

### Webhook Security

All portal webhook endpoints verify request authenticity:
- PropertyFinder: `X-PropertyFinder-Signature` HMAC-SHA256 header against shared secret
- Bayut: IP allowlist + `X-Bayut-Token` header
- All webhook handlers wrapped in `asyncHandler`; errors logged but always return HTTP 200 to avoid portal retry storms

---

## Feed Error Handling & Retry Queue

### Error Types

| Error Code | Description | Auto-Retry |
|-----------|-------------|-----------|
| `PERMIT_MISSING` | No Trakheesi permit on listing | No — agent must add permit |
| `PERMIT_EXPIRED` | Permit expiry date in past | No — agent must renew permit |
| `PHOTO_MINIMUM` | Fewer than 3 photos | Warning only — does not block |
| `PORTAL_TIMEOUT` | Portal CDN/API not responding | Yes — 3 retries with exponential backoff |
| `PORTAL_REJECTED` | Portal validation failure (field value invalid) | No — agent review required |
| `FEED_UPLOAD_FAILED` | CDN upload failed | Yes — 5 retries |

### Retry Queue

```typescript
SyndicationJob {
  id: string;
  propertyId: string;
  portal: 'propertyfinder' | 'bayut' | 'dubizzle';
  jobType: 'publish' | 'update' | 'withdraw';
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'abandoned';
  attempts: number;
  maxAttempts: number;           // 3 for portal errors; 5 for CDN errors
  nextRetryAt?: Date;
  lastError?: string;
  createdAt: Date;
  completedAt?: Date;
}
```

Retry schedule (exponential backoff): 5 min → 15 min → 60 min → abandon + alert.

---

## Syndication Health Dashboard

Located in CRM Analytics module (`/crm/syndication`):

| Widget | Description |
|--------|-------------|
| Live Listings by Portal | Count of active listings per portal with last-sync time |
| Failed Listings | Table of listings with syndication errors, grouped by error type |
| Leads by Portal (MTD) | Bar chart: leads received from each portal this month |
| Feed Last Refreshed | Timestamp of last successful feed upload per portal |
| Permit Expiry Alerts | Listings with permits expiring within 30 days |

**Role Access:** Manager, Owner/Admin only.

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/syndication/push/:propertyId` | Manager+ | Manually trigger syndication for a listing |
| `POST` | `/api/syndication/withdraw/:propertyId` | Manager+ | Remove listing from all portals |
| `GET` | `/api/syndication/status/:propertyId` | Agent+ | Get syndication status per portal |
| `GET` | `/api/syndication/errors` | Manager+ | List all unresolved syndication errors |
| `POST` | `/api/syndication/retry/:jobId` | Manager+ | Manually retry a failed job |
| `GET` | `/api/syndication/feeds/propertyfinder` | Internal | Serve XML feed |
| `GET` | `/api/syndication/feeds/bayut` | Internal | Serve XML feed |
| `POST` | `/api/webhooks/propertyfinder/leads` | Public (signed) | Inbound lead from PropertyFinder |
| `POST` | `/api/webhooks/bayut/leads` | Public (signed) | Inbound lead from Bayut |

---

## Partnership Onboarding Requirements

Before syndication goes live, the following must be completed per portal:

### PropertyFinder
- [ ] White Caves Agency Partner Agreement signed
- [ ] RERA broker license submitted to PropertyFinder
- [ ] API key + partner ID received from PropertyFinder
- [ ] Feed URL registered in PropertyFinder partner portal
- [ ] Lead webhook URL registered: `POST https://api.whitecaves.ae/api/webhooks/propertyfinder/leads`
- [ ] Test listing validated in PropertyFinder sandbox

### Bayut
- [ ] Bayut agency onboarding completed (business team contact)
- [ ] XML feed access credentials received
- [ ] Feed URL registered with Bayut
- [ ] Webhook URL confirmed with Bayut technical team

### Dubizzle
- [ ] Dubizzle agency partnership confirmed
- [ ] Feed format and submission method agreed (XML or email delivery)

---

## Acceptance Criteria

- [ ] Publishing a listing with valid permit triggers feed regeneration within 5 minutes
- [ ] Listing without permit returns `PERMIT_MISSING` error; listing not pushed to any portal
- [ ] Expired permit auto-withdraws listing from all portals within 1 hour of expiry
- [ ] Inbound PropertyFinder lead creates CRM lead record within 60 seconds of webhook receipt
- [ ] Webhook HMAC signature verification rejects invalid requests with HTTP 401
- [ ] Feed regeneration cron runs every 4 hours; health dashboard shows last-refresh timestamp
- [ ] Failed syndication jobs appear in health dashboard; manager can retry manually
- [ ] Withdrawing a listing from CRM sends withdrawal record in next feed cycle
