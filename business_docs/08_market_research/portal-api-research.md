# Portal API Research — PropertyFinder & Bayut

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Research findings on portal APIs for listing syndication

---

## 1. PropertyFinder

### Overview
PropertyFinder (propertyfinder.ae) is the largest property portal in the UAE with 12M+ monthly users. Integration is essential for maximum listing exposure.

### Partnership Requirements
- **Type:** Partner/Agency API — requires an account as a registered real estate agency
- **RERA:** Company must have valid RERA broker license (White Caves already has this)
- **Contract:** Sign a PropertyFinder Agency Partner Agreement
- **Contact:** partnerships@propertyfinder.ae

### API Access
- **Type:** XML feed (standard) or REST API (for premium partners)
- **Documentation:** Provided after partnership agreement signed
- **Authentication:** API key + partner ID

### Listing Syndication (XML Feed)
Standard integration uses an XML listing feed:
```xml
<properties>
  <property>
    <reference_number>WC-12345</reference_number>
    <operation_type>for-sale</operation_type>
    <property_type>villa</property_type>
    <price>2500000</price>
    <price_currency>AED</price_currency>
    <bedroom>3</bedroom>
    <bathroom>4</bathroom>
    <size>4200</size>
    <city>Dubai</city>
    <community>DAMAC Hills 2</community>
    <sub_community>Aknan</sub_community>
    <title_en>Spacious 3BR Villa with Pool</title_en>
    <description_en>...</description_en>
    <permit_number>RERA-1234567</permit_number>
    <agent_name>Ahmed Hassan</agent_name>
    <agent_license>BRN-12345</agent_license>
    <photos>
      <photo>https://cdn.whitecaves.ae/prop/12345/img1.jpg</photo>
    </photos>
  </property>
</properties>
```

### Lead Capture
- Inbound buyer leads from PropertyFinder delivered via webhook or email
- Webhook URL: `POST /api/webhooks/propertyfinder/leads`
- Lead includes: buyer name, email, phone, message, listing reference

### Fees (Approximate)
| Package | Annual Cost (AED) | Listings Limit |
|---------|-----------------|----------------|
| Basic | 5,000 – 15,000 | 50 listings |
| Pro | 20,000 – 50,000 | 500 listings |
| Premium | 80,000+ | Unlimited |
| Featured listing boost | 500–2,000/listing | Per listing |

### Integration Timeline
- Week 1: Sign partnership agreement
- Week 2: API credentials provisioned
- Week 3: Build XML feed generator from White Caves DB
- Week 4: Test feed with PropertyFinder sandbox
- Week 5: Go live, monitor sync

---

## 2. Bayut / Dubizzle

### Overview
Bayut.com and Dubizzle.com (merged under Dubizzle Group / OLX Group) are the second-largest UAE property portals. Combined reach: 8M+ monthly users.

### Partnership Requirements
- Same requirements as PropertyFinder (RERA license)
- Contact: agencies@bayut.com
- Bayut and Dubizzle managed through single partner account

### API Access
- **Type:** REST API or XML feed (similar to PropertyFinder)
- **Authentication:** API key + partner credentials

### Key Difference from PropertyFinder
- Bayut serves UAE primarily; Dubizzle serves UAE + broader MENA
- Bayut has stronger luxury market presence
- Dubizzle has broader audience including lower-mid market

### Integration
Same XML feed format as PropertyFinder (with Bayut-specific category fields).

### Lead Capture
- `POST /api/webhooks/bayut/leads`

---

## 3. Dubizzle Business (Commercial)

For commercial property, Dubizzle Business is the relevant portal.

---

## 4. Recommended Integration Approach

### Phase 1: XML Feed (Q3 2026)
1. Build a `PortalSyncService` in the backend that:
   - Generates a valid XML feed from the Properties DB
   - Includes only properties where: status = Available, permitNumber exists, minPhotos ≥ 3
   - Refreshes every hour
   - Hosted at: `GET /portal-feed/propertyfinder.xml` and `/portal-feed/bayut.xml`
2. Provide feed URL to both portals for polling
3. Monitor feed validation errors

### Phase 2: REST API Sync (Q4 2026)
1. Migrate to REST API for real-time status updates (available → reserved → sold)
2. Implement inbound lead webhook handlers
3. Auto-create lead in Clara CRM from portal inquiries
4. Sync responses: 201 Created, 200 Updated, 410 Gone (deleted)

---

## 5. Technical Architecture for Portal Sync

```
Properties DB (MongoDB)
        │
        ▼
PortalSyncService (Node.js)
├── generatePropertyFinderFeed()
│   └── Filter: status=available, permit valid, ≥3 photos
│   └── Transform to PropertyFinder XML schema
│   └── Cache for 1 hour
│
├── generateBayutFeed()
│   └── Same filter + Bayut-specific fields
│
├── syncPropertyStatus(propertyId, newStatus)
│   └── Called when property status changes (available → sold/rented)
│   └── Push update to both portals via REST API (real-time)
│
└── processInboundLead(source, payload)
    └── Maps portal lead to Clara CRM Lead schema
    └── Auto-assigns to responsible agent
    └── Source attribution: "PropertyFinder" | "Bayut"
```

---

## 6. Compliance Note

Per RERA Circular No. 4 of 2021:
- All listings on portals must include valid Trakheesi permit numbers
- Portal feed generator must enforce this — no permit = excluded from feed
- Portal feed must be updated within 24 hours of status change (AED 50,000 fine risk for advertising sold/rented properties)

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical Team
