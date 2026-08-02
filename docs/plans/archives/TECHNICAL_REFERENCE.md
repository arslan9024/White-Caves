# 📖 TECHNICAL REFERENCE

## API Documentation, Data Models, Services & Developer Guide

**Last Updated:** March 12, 2026  
**Scope:** Complete API reference, database models, service interfaces, type definitions

---

## 🔌 API ENDPOINT REFERENCE

### Base URL

```
Development:  http://localhost:5000/api
Staging:      https://staging-api.whitecaves.app/api
Production:   https://api.whitecaves.app/api
```

### Authentication

All endpoints require JWT token in `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

**Tokens expire after:** 24 hours  
**Refresh token expires after:** 30 days

---

## 👤 AUTHENTICATION API

### Register User

```
POST /auth/register

Request:
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "agent|seller|buyer|tenant"
}

Response (201 Created):
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "agent",
    "createdAt": "2026-03-12T10:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

### Login

```
POST /auth/login

Request:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200 OK):
{
  "user": { ... },
  "tokens": { ... }
}

Error (401 Unauthorized):
{
  "error": "Invalid credentials",
  "code": "AUTH_001"
}
```

### Social Login

```
POST /auth/login/social

Request:
{
  "provider": "google|apple|facebook|linkedin",
  "idToken": "<provider_id_token>"
}

Response (200 OK):
{
  "user": { ... },
  "tokens": { ... },
  "isNewUser": false
}
```

### UAE Pass Login

```
POST /auth/login/uae-pass

Request:
{
  "authorizationCode": "<code_from_uae_pass>",
  "redirectUri": "https://app.whitecaves.app/auth/callback"
}

Response (200 OK):
{
  "user": { ... },
  "tokens": { ... }
}
```

### Refresh Token

```
POST /auth/refresh

Request:
{
  "refreshToken": "eyJhbGc..."
}

Response (200 OK):
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 86400
}
```

### Logout

```
POST /auth/logout

Request:
{
  "refreshToken": "eyJhbGc..."
}

Response (200 OK):
{
  "message": "Logged out successfully"
}
```

---

## 🏠 PROPERTIES API

### List Properties

```
GET /properties?page=1&limit=20&city=Dubai&type=apartment&priceMin=500000

Query Parameters:
- page: int (default: 1)
- limit: int (default: 20, max: 100)
- city: string (optional)
- type: apartment|villa|townhouse (optional)
- priceMin: number (optional)
- priceMax: number (optional)
- bedrooms: int (optional)
- bathrooms: int (optional)
- sortBy: price|created|popularity (default: created)
- order: asc|desc (default: desc)

Response (200 OK):
{
  "data": [
    {
      "id": "prop_123",
      "title": "Luxury Apartment in Downtown Dubai",
      "description": "...",
      "type": "apartment",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 1200,
      "city": "Dubai",
      "location": { "lat": 25.2048, "lng": 55.2708 },
      "price": 2500000,
      "images": ["url1", "url2"],
      "virtualTour": "https://...",
      "amenities": ["gym", "pool", "parking"],
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Property Detail

```
GET /properties/{id}

Response (200 OK):
{
  "id": "prop_123",
  "title": "Luxury Apartment in Downtown Dubai",
  "description": "...",
  "type": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "city": "Dubai",
  "location": { "lat": 25.2048, "lng": 55.2708 },
  "price": 2500000,
  "images": ["url1", "url2"],
  "virtualTour": "https://...",
  "amenities": ["gym", "pool", "parking"],
  "owner": {
    "id": "user_123",
    "name": "John Doe",
    "phone": "+971123456789",
    "email": "john@example.com"
  },
  "createdAt": "2026-03-01T10:00:00Z"
}
```

### Create Property

```
POST /properties

Request:
{
  "title": "Luxury Apartment in Downtown Dubai",
  "description": "Beautiful 2BR apartment with sea view",
  "type": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "city": "Dubai",
  "location": { "lat": 25.2048, "lng": 55.2708 },
  "price": 2500000,
  "images": ["url1", "url2"],
  "virtualTour": "https://...",
  "amenities": ["gym", "pool", "parking"]
}

Response (201 Created):
{
  "id": "prop_123",
  "title": "Luxury Apartment in Downtown Dubai",
  ... (all fields)
}

Error (400 Bad Request):
{
  "error": "Missing required field: title",
  "code": "VALIDATION_001"
}
```

### Update Property

```
PUT /properties/{id}

Request:
{
  "price": 2400000,
  "bedrooms": 2,
  ... (any updatable fields)
}

Response (200 OK):
{
  "id": "prop_123",
  ... (updated data)
}
```

### Delete Property

```
DELETE /properties/{id}

Response (204 No Content)

Error (404 Not Found):
{
  "error": "Property not found",
  "code": "PROPERTY_001"
}
```

### Search Properties

```
GET /properties/search?query=downtown&filter=available

Query Parameters:
- query: string (search title/description)
- filter: available|sold|rented (optional)

Response (200 OK):
{
  "data": [ ... ],
  "totalResults": 25
}
```

### Compare Properties

```
GET /properties/compare?ids=prop_1,prop_2,prop_3

Response (200 OK):
{
  "properties": [
    {
      "id": "prop_1",
      "title": "...",
      "price": 2500000,
      ... (key fields for comparison)
    }
  ]
}
```

---

## 👥 LEADS API

### List Leads

```
GET /leads?page=1&limit=20&status=new&assignedTo=user_123

Query Parameters:
- page: int
- limit: int
- status: new|contacted|qualified|negotiating|lost
- assignedTo: user_id (optional)
- source: website|phone|referral|whatsapp
- sortBy: created|lastContact|score

Response (200 OK):
{
  "data": [
    {
      "id": "lead_123",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "phone": "+971123456789",
      "preferredType": "apartment",
      "budget": 2500000,
      "status": "new",
      "score": 85,
      "assignedTo": {
        "id": "user_123",
        "name": "John Agent"
      },
      "source": "website",
      "createdAt": "2026-03-12T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Get Lead Detail

```
GET /leads/{id}

Response (200 OK):
{
  "id": "lead_123",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+971123456789",
  "preferredType": "apartment",
  "budget": 2500000,
  "status": "new",
  "score": 85,
  "notes": [
    {
      "text": "Interested in Downtown Dubai properties",
      "createdBy": "user_123",
      "createdAt": "2026-03-12T10:15:00Z"
    }
  ],
  "interactions": [
    {
      "type": "call|email|whatsapp",
      "date": "2026-03-12T10:00:00Z",
      "notes": "..."
    }
  ],
  "assignedTo": { ... },
  "createdAt": "2026-03-12T10:00:00Z"
}
```

### Create Lead

```
POST /leads

Request:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+971123456789",
  "preferredType": "apartment",
  "budget": 2500000,
  "source": "website"
}

Response (201 Created):
{
  "id": "lead_123",
  ... (all fields)
}
```

### Update Lead

```
PUT /leads/{id}

Request:
{
  "status": "qualified",
  "assignedTo": "user_456",
  "score": 90
}

Response (200 OK):
{
  "id": "lead_123",
  ... (updated data)
}
```

### Assign Lead

```
POST /leads/{id}/assign

Request:
{
  "agentId": "user_456"
}

Response (200 OK):
{
  "id": "lead_123",
  "assignedTo": {
    "id": "user_456",
    "name": "John Agent"
  }
}
```

### Score Lead (AI)

```
POST /leads/{id}/score

Response (200 OK):
{
  "leadId": "lead_123",
  "score": 85,
  "scoreBreakdown": {
    "budget": 75,
    "engagement": 85,
    "fit": 90,
    "timeline": 80
  },
  "recommendation": "High quality lead - immediate follow-up recommended"
}
```

---

## 💰 COMMISSIONS API

### List Commissions

```
GET /commissions?page=1&limit=20&status=pending&agentId=user_123

Query Parameters:
- page: int
- limit: int
- status: pending|approved|paid|rejected
- agentId: user_id (optional)
- startDate: ISO date (optional)
- endDate: ISO date (optional)
- sortBy: amount|date|dueDate

Response (200 OK):
{
  "data": [
    {
      "id": "comm_123",
      "agentId": "user_123",
      "transactionId": "trans_456",
      "amount": 125000,
      "rate": 5,
      "status": "pending",
      "dueDate": "2026-03-31",
      "paidDate": null,
      "notes": "Property: Downtown Apartment",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ],
  "pagination": { ... },
  "summary": {
    "totalCommissions": 500000,
    "pendingCommissions": 125000,
    "paidCommissions": 375000,
    "averageRate": 4.8
  }
}
```

### Get Commission Detail

```
GET /commissions/{id}

Response (200 OK):
{
  "id": "comm_123",
  "agentId": "user_123",
  "agentName": "John Agent",
  "transactionId": "trans_456",
  "transactionDetails": {
    "propertyId": "prop_123",
    "propertyTitle": "Downtown Apartment",
    "buyerId": "user_789",
    "sellerId": "user_456",
    "transactionDate": "2026-03-01T10:00:00Z",
    "transactionAmount": 2500000
  },
  "amount": 125000,
  "rate": 5,
  "calculationBreakdown": {
    "transactionAmount": 2500000,
    "rate": 5,
    "amount": 125000,
    "taxes": 6250,
    "netAmount": 118750
  },
  "status": "pending",
  "dueDate": "2026-03-31",
  "paidDate": null,
  "paymentMethod": "bank_transfer",
  "paymentDetails": {
    "accountHolder": "John Agent",
    "accountNumber": "****1234",
    "bankCode": "AE123"
  },
  "notes": "Payment pending approval",
  "createdAt": "2026-03-01T10:00:00Z"
}
```

### Create Commission

```
POST /commissions

Request:
{
  "agentId": "user_123",
  "transactionId": "trans_456",
  "amount": 125000,
  "rate": 5,
  "dueDate": "2026-03-31",
  "notes": "Property: Downtown Apartment"
}

Response (201 Created):
{
  "id": "comm_123",
  ... (all fields)
}
```

### Calculate Commission

```
POST /commissions/calculate

Request:
{
  "transactionAmount": 2500000,
  "rate": 5
}

Response (200 OK):
{
  "transactionAmount": 2500000,
  "rate": 5,
  "amount": 125000,
  "taxes": 6250,
  "netAmount": 118750
}
```

### Approve Commission

```
PUT /commissions/{id}/approve

Request:
{
  "approvedBy": "user_admin",
  "notes": "Approved"
}

Response (200 OK):
{
  "id": "comm_123",
  "status": "approved",
  "approvedAt": "2026-03-12T10:00:00Z"
}
```

### Mark as Paid

```
PUT /commissions/{id}/paid

Request:
{
  "paidDate": "2026-03-15",
  "paymentMethod": "bank_transfer",
  "transactionNumber": "TXN12345"
}

Response (200 OK):
{
  "id": "comm_123",
  "status": "paid",
  "paidDate": "2026-03-15T10:00:00Z"
}
```

### Generate Commission Report

```
GET /commissions/report?startDate=2026-01-01&endDate=2026-03-31&agentId=user_123

Response (200 OK):
{
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "agentId": "user_123",
  "agentName": "John Agent",
  "totalTransactions": 12,
  "totalAmount": 625000,
  "totalCommissions": 31250,
  "averageCommissionRate": 5,
  "commissionsByStatus": {
    "pending": 10000,
    "approved": 15000,
    "paid": 6250
  },
  "transactions": [ ... ]
}
```

---

## 📊 ANALYTICS API

### Dashboard Metrics

```
GET /analytics/dashboard?period=month

Query Parameters:
- period: day|week|month|year

Response (200 OK):
{
  "period": "month",
  "metrics": {
    "totalProperties": 250,
    "newProperties": 45,
    "totalLeads": 180,
    "newLeads": 35,
    "closedDeals": 12,
    "totalRevenue": 450000,
    "commissionsPaid": 25000
  },
  "trends": {
    "propertiesGrowth": 15,    // percentage
    "leadsGrowth": 20,
    "revenueGrowth": 18
  },
  "topPerformers": [
    {
      "agentId": "user_123",
      "name": "John Agent",
      "closedDeals": 5,
      "revenue": 150000
    }
  ]
}
```

### Property Analytics

```
GET /analytics/properties?cityFilter=Dubai

Response (200 OK):
{
  "totalListings": 250,
  "averagePrice": 2400000,
  "priceRange": {
    "min": 500000,
    "max": 10000000
  },
  "byType": {
    "apartment": 120,
    "villa": 80,
    "townhouse": 50
  },
  "byCity": {
    "Dubai": 150,
    "Abu Dhabi": 80,
    "Sharjah": 20
  },
  "avgTimeToSell": 45  // days
}
```

### Lead Analytics

```
GET /analytics/leads

Response (200 OK):
{
  "totalLeads": 800,
  "statusBreakdown": {
    "new": 200,
    "contacted": 150,
    "qualified": 300,
    "negotiating": 100,
    "lost": 50
  },
  "conversionRate": 37.5,  // percentage
  "avgTimeToQualify": 8,   // days
  "scoreDistribution": {
    "high": 200,
    "medium": 400,
    "low": 200
  },
  "sourceBreakdown": {
    "website": 400,
    "phone": 200,
    "referral": 150,
    "whatsapp": 50
  }
}
```

---

## 🗂️ DATABASE MODELS

### User Model

```typescript
interface User {
  id: string;
  email: string;
  password: string; // bcrypt hashed
  firstName: string;
  lastName: string;
  phone: string;
  profileImage: string;
  role: Role; // enum: admin|manager|agent|seller|buyer|tenant
  permissions: Permission[];

  // Profile info
  company: string;
  designation: string;
  bio: string;

  // Account settings
  language: string; // ar|en
  timezone: string;
  theme: 'light' | 'dark';
  notificationPreferences: NotificationPreferences;

  // Status
  isActive: boolean;
  isVerified: boolean;
  lastLogin: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // soft delete
}
```

### Property Model

```typescript
interface Property {
  id: string;

  // Basic info
  title: string;
  description: string;
  type: 'apartment' | 'villa' | 'townhouse' | 'land' | 'commercial';
  status: 'available' | 'sold' | 'rented' | 'draft';

  // Location
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;

  // Details
  bedrooms: number;
  bathrooms: number;
  area: number; // sq ft
  yearBuilt: number;
  floorNumber?: number;
  totalFloors?: number;

  // Pricing
  price: number;
  pricePerSqFt: number;
  currency: 'AED' | 'USD' | 'EUR';

  // Media
  images: string[];
  virtualTourUrl?: string;
  floorPlanUrl?: string;

  // Features & amenities
  amenities: string[];
  features: string[];

  // Ownership
  ownerId: string; // Reference to User
  agentId: string; // Reference to User

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Lead Model

```typescript
interface Lead {
  id: string;

  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Preference
  preferredPropertyType: string;
  budget: number;
  location: string;
  timeline: string; // immediate|1-3months|3-6months|flexible

  // Status
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'lost' | 'converted';
  score: number; // 0-100, AI calculated

  // Assignment
  assignedTo?: string; // Reference to User (Agent)

  // Interaction
  source: 'website' | 'phone' | 'referral' | 'whatsapp' | 'email';
  interactions: {
    type: 'call' | 'email' | 'whatsapp' | 'meeting';
    date: Date;
    notes: string;
  }[];

  // Notes
  notes: {
    text: string;
    createdBy: string;
    createdAt: Date;
  }[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  deletedAt?: Date;
}
```

### Commission Model

```typescript
interface Commission {
  id: string;

  // Reference
  agentId: string; // Reference to User
  transactionId: string; // Reference to Transaction

  // Amount
  amount: number;
  rate: number; // percentage
  status: 'pending' | 'approved' | 'paid' | 'rejected';

  // Dates
  dueDate: Date;
  paidDate?: Date;

  // Payment
  paymentMethod?: 'bank_transfer' | 'check' | 'cash' | 'credit';
  paymentDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankCode: string;
  };

  // Notes
  notes: string;
  rejectionReason?: string;
  approvedBy?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔑 KEY CONCEPTS

### Role Hierarchy

```
Admin (Full access)
├── Manager (Team management)
├── Agent (Lead/Property management)
├── Seller (Own properties)
├── Buyer (Lead features)
└── Tenant (Basic access)
```

### Permission Model

```typescript
type Permission =
  | 'VIEW_PROPERTIES'
  | 'CREATE_PROPERTY'
  | 'EDIT_PROPERTY'
  | 'DELETE_PROPERTY'
  | 'VIEW_LEADS'
  | 'CREATE_LEAD'
  | 'ASSIGN_LEAD'
  | 'VIEW_COMMISSIONS'
  | 'APPROVE_COMMISSION'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_USERS'
  | 'MANAGE_ROLES';
```

### Error Codes

```
AUTH_001: Invalid credentials
AUTH_002: Token expired
AUTH_003: Unauthorized access
VALIDATION_001: Missing required field
VALIDATION_002: Invalid email format
PROPERTY_001: Property not found
PROPERTY_002: Invalid property type
LEAD_001: Lead not found
LEAD_002: Lead already assigned
COMMISSION_001: Commission not found
COMMISSION_002: Insufficient funds
DB_001: Database connection error
```

---

**This reference is your developer guide. Bookmark it, use it daily, and keep it updated!**
