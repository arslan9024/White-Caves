# Dubai Property Inventory Database Schema Specification

> **White Caves Real Estate LLC** — Enterprise Data Model  
> **Schema Version**: 2026.05 | **Total Fields**: 32 Standardized Attributes  
> **ORM Engine**: Prisma 6.2 / MongoDB Schema Interface

---

## 📋 Complete 32-Field Attribute Definition Table

| # | Attribute Name | Data Type | Database Key | Required | Description & Validation Rules |
|---|----------------|-----------|--------------|----------|--------------------------------|
| 1 | Property ID | String | `id` | Yes | Unique ID format: `prop-001` |
| 2 | Listing Title | String | `title` | Yes | English title e.g. "Luxury 4BR Villa" |
| 3 | Title (Arabic) | String | `titleArabic` | No | Arabic translated title |
| 4 | Community Name | String | `community` | Yes | Index field e.g. "DAMAC Hills 2" |
| 5 | Sub-Community | String | `subCommunity` | No | e.g. "Akoya Oxygen / Vardon" |
| 6 | Building Name | String | `buildingName` | No | Tower / Building identification |
| 7 | Developer Name | String | `developer` | Yes | Emaar, DAMAC, Nakheel, Sobha |
| 8 | Property Type | Enum | `propertyType` | Yes | `Villa`, `Apartment`, `Townhouse`, `Penthouse`, `Off-Plan`, `Commercial` |
| 9 | Off-Plan Status | Enum | `offPlanStatus` | No | `Pre-Launch`, `Under Construction`, `Handover Ready`, `Ready` |
| 10 | Completion Date | String | `completionDate` | No | Format: `YYYY-MM` e.g. "2026-12" |
| 11 | Price (AED) | Float | `priceAED` | Yes | Base currency in AED |
| 12 | Price (USD) | Float | `priceUSD` | Yes | Computed: `priceAED * 0.27` |
| 13 | Price (EUR) | Float | `priceEUR` | Yes | Computed: `priceAED * 0.25` |
| 14 | Price (GBP) | Float | `priceGBP` | Yes | Computed: `priceAED * 0.22` |
| 15 | Rental Frequency | Enum | `rentalFrequency` | No | `Yearly`, `Monthly`, `Short-Term` |
| 16 | Service Charge | Float | `serviceChargePerSqftAED` | No | AED per sqft annually (e.g. 15.5) |
| 17 | Bedroom Count | Integer | `beds` | Yes | `0` for Studio, `1`-`8` |
| 18 | Bathroom Count | Integer | `baths` | Yes | `1`-`10` |
| 19 | Built-Up Area | Integer | `sqft` | Yes | Living space square footage |
| 20 | Plot Size | Integer | `plotSizeSqft` | No | Land size for villas |
| 21 | Floor Number | Integer | `floorNumber` | No | Building floor level |
| 22 | Furnishing Status | Enum | `furnishingStatus` | Yes | `Furnished`, `Unfurnished`, `Semi-Furnished` |
| 23 | Dedicated Parking | Integer | `parkingSpaces` | Yes | Number of garage spaces |
| 24 | View Description | Enum | `viewType` | No | `Burj Khalifa`, `Sea / Palm View`, `Golf Course`, `Community`, `Canal View` |
| 25 | Property Status | Enum | `status` | Yes | `Available`, `Leased`, `Sold`, `UnderMaintenance`, `Reserved` |
| 26 | RERA Permit No. | String | `reraPermitNumber` | Yes | Mandatory Trakheesi Permit |
| 27 | Title Deed Number | String | `titleDeedNumber` | No | Official DLD Registration ID |
| 28 | Makani Number | String | `makaniNumber` | No | Dubai Municipality 10-digit Code |
| 29 | DEWA Premises Code| String | `dewaPremisesNumber` | No | 9-digit Utility Premises ID |
| 30 | Madmoun QR URL | String | `madmounQrCodeUrl` | No | DLD mandatory advertising QR |
| 31 | Primary Photo URL | String | `imageUrl` | No | CDN image link |
| 32 | Assigned Broker | String | `assignedBrokerId` | No | FK to User table |

---

## 🛠️ TypeScript Interface Contract

```typescript
export type PropertyType = 'Villa' | 'Apartment' | 'Townhouse' | 'Penthouse' | 'Off-Plan' | 'Commercial';
export type PropertyStatus = 'Available' | 'Leased' | 'Sold' | 'UnderMaintenance' | 'Reserved';
export type FurnishingStatus = 'Furnished' | 'Unfurnished' | 'Semi-Furnished';
export type ViewType = 'Burj Khalifa' | 'Sea / Palm View' | 'Golf Course' | 'Community' | 'Canal View';

export interface Property {
  id: string;
  title: string;
  titleArabic?: string;
  community: string;
  subCommunity?: string;
  buildingName?: string;
  developer: string;
  propertyType: PropertyType;
  offPlanStatus?: 'Pre-Launch' | 'Under Construction' | 'Handover Ready' | 'Ready';
  completionDate?: string;
  priceAED: number;
  priceUSD: number;
  priceEUR: number;
  priceGBP: number;
  rentalFrequency?: 'Yearly' | 'Monthly' | 'Short-Term';
  serviceChargePerSqftAED?: number;
  beds: number;
  baths: number;
  sqft: number;
  plotSizeSqft?: number;
  floorNumber?: number;
  furnishingStatus: FurnishingStatus;
  parkingSpaces: number;
  viewType?: ViewType;
  status: PropertyStatus;
  reraPermitNumber: string;
  titleDeedNumber?: string;
  makaniNumber?: string;
  dewaPremisesNumber?: string;
  madmounQrCodeUrl?: string;
  imageUrl?: string;
  assignedBrokerId?: string;
}
```
