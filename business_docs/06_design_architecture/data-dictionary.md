# Data Dictionary — White Caves CRM Platform

> **Document ID:** WC-DD-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Purpose:** Single reference for every data field in the system — definitions, types, validation rules, and business meaning.

---

## User

| Field | Type | Required | Validation | Business Meaning |
|-------|------|----------|-----------|-----------------|
| `id` | ObjectId | Auto | — | Unique system identifier |
| `email` | String | Yes | Valid email format; unique | User's login email |
| `name` | String | No | Max 100 chars | Full display name |
| `photoUrl` | String | No | Valid URL | Profile photo URL |
| `role` | String | Yes | Enum (see roles) | System access role |
| `phone` | String | No | E.164 format preferred | Contact phone number |
| `department` | String | No | Free text | Organisational department |
| `status` | String | Yes | active \| inactive \| pending_approval | Account status |
| `passwordHash` | String | No | bcrypt hash | Null = social auth only |
| `firebaseUid` | String | No | Unique | Firebase UID for OAuth |
| `createdAt` | DateTime | Auto | — | Account creation timestamp |
| `updatedAt` | DateTime | Auto | — | Last modification timestamp |

**Role Enum Values:**
`owner`, `admin`, `manager`, `agent`, `viewer`, `finance`, `compliance`, `hr`, `marketing`, `leasing`, `leasing_agent`, `landlord`, `tenant`, `buyer`, `seller`, `legal`, `developer`, `pa`, `receptionist`, `senior_agent`, `junior_agent`, `intern`

---

## Property

| Field | Type | Required | Validation | Business Meaning |
|-------|------|----------|-----------|-----------------|
| `id` | ObjectId | Auto | — | Unique property ID |
| `title` | String | Yes | 5–200 chars | Listing headline |
| `description` | String | No | Max 5,000 chars | Marketing description |
| `type` | String | Yes | Enum | Property category |
| `status` | String | Yes | Enum | Current listing status |
| `price` | Float | Yes | > 0 | Asking price in AED |
| `bedrooms` | Int | Yes | 0–20 (0 = studio) | Number of bedrooms |
| `bathrooms` | Int | Yes | 0–20 | Number of bathrooms |
| `sqft` | Int | Yes | > 0 | Total built-up area (sq ft) |
| `location` | String | Yes | Max 200 chars | Address or area description |
| `area` | String | No | Max 100 chars | Community/neighbourhood name |
| `amenities` | String[] | No | Each max 50 chars | List of features |
| `images` | String[] | No | Valid URLs | Property photos |
| `featured` | Boolean | No | Default false | Show in featured listing |
| `agentName` | String | No | Max 100 chars | Responsible listing agent |
| `reraPermitNumber` | String | No | RERA format | RERA listing permit |
| `reraPermitExpiry` | DateTime | No | Future date | Permit expiry date |
| `dldReference` | String | No | Unique | DLD transaction reference |
| `userId` | ObjectId | Yes | Valid user ID | Owning/assigned agent |

**Type Enum:** `apartment`, `villa`, `penthouse`, `commercial`, `land`, `townhouse`, `studio`, `hotel_apartment`

**Status Enum:** `draft`, `available`, `reserved`, `sold`, `rented`, `off_market`, `pending_listing`

---

## Lead

| Field | Type | Required | Validation | Business Meaning |
|-------|------|----------|-----------|-----------------|
| `id` | ObjectId | Auto | — | Unique lead ID |
| `name` | String | Yes | 2–100 chars | Lead's full name |
| `email` | String | No | Valid email | Lead's email (optional) |
| `phone` | String | No | E.164 format | Lead's phone (WhatsApp-compatible) |
| `company` | String | No | Max 100 chars | Employer or company name |
| `status` | String | Yes | Enum | Current pipeline stage |
| `source` | String | Yes | Enum | How the lead was acquired |
| `budget` | Float | No | > 0 | Client's budget in AED |
| `score` | Int | Yes | 0–100 | AI-calculated lead score |
| `notes` | String | No | Max 5,000 chars | Free-text internal notes |
| `tags` | String[] | No | Each max 50 chars | Classification tags |
| `lastContact` | DateTime | No | Any | Timestamp of most recent contact |
| `assignedToId` | ObjectId | No | Valid user ID | Assigned sales agent |
| `createdById` | ObjectId | No | Valid user ID | Agent who created the lead |
| `propertyId` | ObjectId | No | Valid property ID | Property of interest |

**Status Enum:** `new`, `contacted`, `qualified`, `hot`, `warm`, `cold`, `negotiating`, `won`, `lost`, `on_hold`

**Source Enum:** `whatsapp`, `website`, `phone`, `referral`, `marketing`, `direct`, `property_finder`, `bayut`, `walk_in`, `exhibition`, `social_media`, `developer_referral`

**Score Calculation Factors:**
- Budget provided: +20
- Timeline urgent (< 3 months): +30
- Timeline medium (3–6 months): +15
- Property interest specified: +15
- Phone provided: +10
- Email provided: +5
- Repeat contact (> 2 activities): +10
- Score decrements: no activity for 14 days: -10; status=cold: -20

---

## Commission

| Field | Type | Required | Validation | Business Meaning |
|-------|------|----------|-----------|-----------------|
| `id` | ObjectId | Auto | — | Unique commission ID |
| `amount` | Float | Yes | > 0 | Commission amount in AED |
| `percentage` | Float | No | 1–10 | % of transaction value |
| `status` | String | Yes | Enum | Approval/payment stage |
| `type` | String | Yes | Enum | Type of commission |
| `notes` | String | No | Max 1,000 chars | Admin notes |
| `paidAt` | DateTime | No | Date only if paid | When commission was paid |
| `agentId` | ObjectId | Yes | Valid user ID | Earning agent |
| `leadId` | ObjectId | No | Valid lead ID | Source lead |
| `propertyId` | ObjectId | No | Valid property ID | Source property |

**Status Enum:** `pending`, `approved`, `paid`, `cancelled`, `disputed`

**Type Enum:** `sale`, `rental`, `referral`, `bonus`, `override`

**Business Rules:**
- Minimum commission: AED 1 (no upper limit)
- Only `manager`, `finance`, or `owner` roles can approve
- Once `paid`, cannot be edited
- Duplicate prevention: same `agentId + leadId + propertyId` checked

---

## Transaction

| Field | Type | Required | Validation | Business Meaning |
|-------|------|----------|-----------|-----------------|
| `id` | ObjectId | Auto | — | Unique transaction ID |
| `type` | String | Yes | Enum | Type of real estate transaction |
| `status` | String | Yes | Enum | Current deal stage |
| `amount` | Float | Yes | > 0 | Transaction value in AED |
| `closingDate` | DateTime | No | Any | Actual or expected close date |
| `notes` | String | No | Max 5,000 chars | Deal notes |
| `documents` | String[] | No | Valid URLs | Supporting documents |
| `propertyId` | ObjectId | No | Valid property ID | Property being transacted |
| `leadId` | ObjectId | No | Valid lead ID | Associated lead/buyer |
| `agentId` | ObjectId | No | Valid user ID | Handling agent |

**Type Enum:** `sale`, `rental`, `lease`, `off_plan`, `commercial_sale`, `commercial_lease`

**Status Enum:** `draft`, `pending`, `in_progress`, `under_offer`, `spa_signed`, `deposit_received`, `completed`, `cancelled`, `fallen_through`

---

## Activity

| Field | Type | Required | Validation | Business Meaning |
|-------|------|----------|-----------|-----------------|
| `id` | ObjectId | Auto | — | Unique activity ID |
| `type` | String | Yes | Enum | Category of activity |
| `action` | String | Yes | Enum | Specific action performed |
| `description` | String | Yes | Max 2,000 chars | Human-readable description |
| `metadata` | JSON | No | Object | Structured additional data |
| `userId` | ObjectId | No | Valid user ID | User who performed action |
| `leadId` | ObjectId | No | Valid lead ID | Related lead (if any) |

**Type Enum:** `lead`, `property`, `deal`, `commission`, `agent`, `client`, `system`, `compliance`

**Action Enum:** `created`, `updated`, `deleted`, `status_changed`, `note_added`, `call`, `email`, `visit`, `viewing`, `offer_made`, `document_uploaded`, `assigned`, `reassigned`

---

## Tenant

| Field | Type | Required | Validation | Business Meaning |
|-------|------|----------|-----------|-----------------|
| `id` | ObjectId | Auto | — | Unique tenant ID |
| `name` | String | Yes | 2–100 chars | Tenant full name |
| `email` | String | No | Valid email | Tenant email |
| `phone` | String | No | E.164 | Contact phone |
| `nationality` | String | No | ISO country code | Used for KYC classification |
| `emiratesId` | String | No | UAE EID format | UAE residents only |
| `status` | String | Yes | Enum | Tenancy status |
| `moveInDate` | DateTime | No | Any | Actual move-in date |
| `moveOutDate` | DateTime | No | After moveIn | Actual/planned move-out |
| `monthlyRent` | Float | No | > 0 | Agreed monthly rent (AED) |
| `deposit` | Float | No | > 0 | Security deposit (AED) |
| `ejariNumber` | String | No | Ejari format | Ejari registration number |
| `kycStatus` | String | No | Enum | KYC verification stage |
| `propertyId` | ObjectId | No | Valid property ID | Rented property |

**Status Enum:** `inquiry`, `applied`, `approved`, `active`, `inactive`, `eviction_notice`, `vacated`

**KYC Status Enum:** `not_started`, `pending_documents`, `under_review`, `verified`, `rejected`, `expired`

---

## Business Term Glossary

| Term | Definition |
|------|-----------|
| **AED** | UAE Dirham — the only operational currency in the system |
| **BRN** | Broker Registration Number — unique RERA license ID for agents |
| **DAMAC Hills 2** | Primary community/development in White Caves portfolio |
| **DLD** | Dubai Land Department — government body overseeing property transactions |
| **Ejari** | Arabic for "my rent" — mandatory tenancy contract registration system |
| **EDD** | Enhanced Due Diligence — deeper KYC for high-risk AML profiles |
| **FIU** | Financial Intelligence Unit — UAE AML regulator for SAR filings |
| **Hot Lead** | Score ≥ 80 or status = "hot"; highest priority prospect |
| **Lead Score** | 0–100 AI-calculated value reflecting probability of conversion |
| **NOC** | No Objection Certificate — required from developer for property transfers |
| **Off-plan** | Property sold before construction completion |
| **Pipeline Value** | Sum of transaction amounts in active stages |
| **RERA** | Real Estate Regulatory Agency — Dubai property regulator |
| **SAR** | Suspicious Activity Report — mandatory AML disclosure to FIU |
| **SPA** | Sales and Purchase Agreement — binding sale contract |
| **Title Deed** | DLD-issued document proving property ownership |
| **Viewing** | Scheduled property tour arranged for a lead |
| **WABA** | WhatsApp Business Account — Meta account for WhatsApp API access |

---

**Document ID:** WC-DD-001 | **Version:** 1.0 | **Date:** March 2026
