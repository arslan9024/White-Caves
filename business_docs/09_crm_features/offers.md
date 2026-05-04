# Offers Management — Business Specification

**Owner:** @Jaime (Llama 3.1 70B — Groq Console)
**Status:** 🟡 STUB — awaiting @Jaime Task 1
**Target:** 12 sections
**API Route:** `/api/offers`
**Related:** properties, leads, leases, documents (MOU/LOI generation)

---

## Overview

The offers module manages the negotiation workflow between buyers/tenants and sellers/landlords. It tracks every offer, counter-offer, and final acceptance — then automatically triggers MOU/LOI document generation upon acceptance.

**Key Capabilities:**
- Offer submission from buyer or tenant side
- Counter-offer rounds with full history tracking
- Multi-offer comparison table (side-by-side for same property)
- Automated offer expiry (cron sets status = expired after validUntil)
- Offer acceptance triggers: MOU/LOI PDF generation + WhatsApp notifications to all parties
- Offer analytics: average offers per property, negotiation rounds, price vs asking ratio

---

## TODO — @Jaime Task 1

Paste the output from this prompt into the sections below:

```
@Jaime — DRAFT: offers.md → spec /api/offers route: offer schema (propertyId, buyerId or tenantId, agentId, offerPrice AED, offerType: purchase/lease, validUntil date, status: pending/countered/accepted/rejected/expired, conditions: mortgageSubject/cashPurchase/furnitureIncluded/subjectToNOC, counterOfferHistory array of {price, date, fromParty, notes}), offer workflow (buyer submits → agent presents to seller/landlord → counter offer round → acceptance → auto-generate MOU or LOI PDF), offer comparison table (multiple offers on same property: side-by-side price, conditions, buyer profile), automated expiry cron (set status=expired when validUntil passed), offer acceptance triggers (generate MOU PDF, WhatsApp notification to all parties, create RERA form task), offer analytics (average offers per property, average negotiation rounds, price achieved vs asking %).
```

## TODO — @Jaime Task 2

```
@Jaime — DRAFT: whatsapp-integration.md → spec Meta WhatsApp Business API: WABA setup checklist, message template categories (UTILITY/MARKETING/AUTHENTICATION) with examples, webhook handler spec (/api/webhooks/meta), 24-hour conversation window management, opt-in/opt-out database tracking, rate limits and pricing tiers.
```

## TODO — @Jaime Task 3

```
@Jaime — EXPAND: whatsapp-integration.md → add NinaChatbot conversation flows (property enquiry, maintenance submission, payment reminder), human handoff triggers, broadcast campaign rate limits, WhatsApp Business widget embed spec.
```
