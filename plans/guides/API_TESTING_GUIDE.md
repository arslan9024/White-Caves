# Phase 2A API Endpoints Testing Guide

## Quick Reference - All 7 Endpoints

### 1. List Opportunities
```bash
curl -X GET "http://localhost:3000/api/sourcing/opportunities?status=initial_detection&minConfidence=75&page=1&limit=10"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "opportunities": [
    {
      "opportunityId": "opp-001",
      "ownerInfo": { "name": "Ahmed Al-Mazrouei", "phone": "+971501234567", "type": "direct_owner" },
      "propertyDetails": { "type": "villa", "location": "Dubai Marina", "bedrooms": 4, "price": 5000 },
      "confidenceScore": 92,
      "verificationStatus": "initial_detection",
      "completenessPercentage": 85
    }
  ]
}
```

---

### 2. Analyze Conversation
```bash
curl -X POST "http://localhost:3000/api/sourcing/analyze-conversation" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationData": "I have a 4BR villa in Dubai Marina available for 5000/month",
    "chatId": "1234567890"
  }'
```

**Response:**
```json
{
  "success": true,
  "chatId": "1234567890",
  "propertyDetected": true,
  "confidenceScore": 85,
  "extractedData": {
    "propertyType": "villa",
    "location": "Dubai Marina",
    "bedrooms": 4,
    "price": 5000
  },
  "ownerInfo": {
    "name": "Ahmed Al-Mazrouei",
    "phone": "+971501234567",
    "type": "direct_owner"
  },
  "suggestedAction": "create_opportunity"
}
```

---

### 3. Update Opportunity Status
```bash
curl -X PUT "http://localhost:3000/api/sourcing/opportunities/opp-001/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "newStatus": "partially_verified",
    "photosCount": 5,
    "notes": "Photos received and verified"
  }'
```

**Valid Status Values:**
- `initial_detection`
- `waiting_for_photos`
- `partially_verified`
- `fully_verified`
- `archived`
- `listed`

**Response:**
```json
{
  "success": true,
  "opportunity": {
    "opportunityId": "opp-001",
    "verificationStatus": "partially_verified",
    "photosCount": 5,
    "lastUpdated": "2026-01-17T14:35:00Z"
  }
}
```

---

### 4. Add Opportunity to Inventory
```bash
curl -X POST "http://localhost:3000/api/sourcing/opportunities/opp-001/add-to-inventory" \
  -H "Content-Type: application/json" \
  -d '{
    "additionalData": {
      "title": "Luxury Villa in Dubai Marina",
      "description": "Beautiful 4BR villa with swimming pool",
      "price": 5000,
      "bedrooms": 4,
      "location": "Dubai Marina"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "property": {
    "propertyId": "prop-1705516500000",
    "opportunityId": "opp-001",
    "title": "Luxury Villa in Dubai Marina",
    "price": 5000,
    "bedrooms": 4,
    "status": "active"
  }
}
```

---

### 5. Get Sourcing Statistics
```bash
curl -X GET "http://localhost:3000/api/sourcing/statistics?timeframe=week"
```

**Query Parameters:**
- `timeframe`: week, month, year (default: week)

**Response:**
```json
{
  "success": true,
  "statistics": {
    "timeframe": "week",
    "summary": {
      "totalOpportunities": 47,
      "newThisWeek": 12,
      "verified": 23,
      "inProcess": 18
    },
    "metrics": {
      "averageConfidenceScore": 82.5,
      "completenessPercentage": 74,
      "verificationRate": "49%",
      "conversionRate": "9%"
    },
    "topAreas": [
      { "area": "Dubai Marina", "count": 12, "confidence": 85 },
      { "area": "Downtown Dubai", "count": 8, "confidence": 79 }
    ]
  }
}
```

---

### 6. List All Owners
```bash
curl -X GET "http://localhost:3000/api/owners?status=active&page=1&limit=10"
```

**Query Parameters:**
- `status`: active, prospect, inactive (default: active)
- `page`: pagination (default: 1)
- `limit`: results per page (default: 10)
- `sortBy`: createdAt, name, successScore (default: createdAt)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "owners": [
    {
      "relationshipId": "rel-001",
      "ownerProfile": {
        "name": "Ahmed Al-Mazrouei",
        "email": "ahmed@email.com",
        "reliabilityScore": 8.5
      },
      "properties": ["prop-001", "prop-002"],
      "engagementStatus": "active",
      "metrics": {
        "totalProperties": 2,
        "closedDeals": 1,
        "successScore": 8
      }
    }
  ]
}
```

---

### 7. Get Owner Profile
```bash
curl -X GET "http://localhost:3000/api/owners/rel-001"
```

**Response:**
```json
{
  "success": true,
  "owner": {
    "relationshipId": "rel-001",
    "ownerProfile": {
      "name": "Ahmed Al-Mazrouei",
      "email": "ahmed@email.com",
      "phone": "+971501234567",
      "reliabilityScore": 8.5
    },
    "properties": [
      {
        "propertyId": "prop-001",
        "type": "villa",
        "location": "Dubai Marina",
        "price": 5000,
        "status": "listed"
      }
    ],
    "interactionHistory": [
      { "date": "2026-01-15", "type": "message", "content": "Inquiry about villa rental" },
      { "date": "2026-01-14", "type": "call", "content": "Discussed property details" }
    ],
    "metrics": {
      "totalProperties": 2,
      "closedDeals": 1,
      "successScore": 8
    }
  }
}
```

---

## Integration Workflow

### Complete Sourcing Flow

1. **Monitor WhatsApp Conversations**
   ```
   WhatsAppWebIntegration.getConversations() → Chat list
   ```

2. **Analyze Each Conversation**
   ```
   POST /api/sourcing/analyze-conversation
   ↓
   Returns: propertyDetected, confidenceScore, extractedData
   ```

3. **Create Opportunity (if property detected)**
   ```
   PropertySourcingService.createOpportunityFromConversation()
   ↓
   Stores: PropertyOpportunity + OwnerRelationship records
   ```

4. **Request Photos/Verification**
   ```
   Status → "waiting_for_photos"
   Owner → Prompted via WhatsApp to send photos
   ```

5. **Update Verification Status**
   ```
   PUT /api/sourcing/opportunities/:id/verify
   ↓
   Status → "partially_verified" or "fully_verified"
   ```

6. **Convert to Inventory**
   ```
   POST /api/sourcing/opportunities/:id/add-to-inventory
   ↓
   Creates property in Mary inventory + adds sourcing metadata
   ```

7. **Track Owner Relationship**
   ```
   GET /api/owners/:id
   ↓
   Shows: property portfolio, interaction history, reliability score
   ```

---

## Testing with Postman

### Import Collection
```json
{
  "info": { "name": "Phase 2A Sourcing API" },
  "item": [
    {
      "name": "Get Opportunities",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/sourcing/opportunities?status=initial_detection&minConfidence=75"
      }
    },
    {
      "name": "Analyze Conversation",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/sourcing/analyze-conversation",
        "body": { "conversationData": "I have a 4BR villa in Dubai Marina for 5000/month", "chatId": "1234567890" }
      }
    },
    {
      "name": "Update Opportunity Status",
      "request": {
        "method": "PUT",
        "url": "{{baseUrl}}/api/sourcing/opportunities/opp-001/verify",
        "body": { "newStatus": "partially_verified", "photosCount": 5 }
      }
    },
    {
      "name": "Add to Inventory",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/sourcing/opportunities/opp-001/add-to-inventory",
        "body": { "additionalData": { "title": "Villa Dubai Marina", "price": 5000, "bedrooms": 4 } }
      }
    },
    {
      "name": "Get Statistics",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/sourcing/statistics?timeframe=week"
      }
    },
    {
      "name": "List Owners",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/owners?status=active&page=1&limit=10"
      }
    },
    {
      "name": "Get Owner Profile",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/owners/rel-001"
      }
    }
  ]
}
```

### Set Environment Variable
```json
{
  "baseUrl": "http://localhost:3000"
}
```

---

## Next Steps

1. ✅ API Endpoints Created (January 17)
2. ⏳ Connect to Real Database (Week 2)
   - Replace mock data with actual PropertyOpportunity queries
   - Implement real OwnerRelationship lookups
   - Use actual InventoryProperty creation
3. ⏳ Create Test Suite (Week 2)
   - Unit tests for each endpoint
   - Integration tests with database
   - E2E tests for complete workflows
4. ⏳ Deploy to Staging (Week 3)
   - Test with real WhatsApp data
   - Monitor performance
   - Gather feedback

---

**Created:** January 17, 2026  
**Status:** Ready for Integration Testing  
**Next Review:** January 24, 2026
