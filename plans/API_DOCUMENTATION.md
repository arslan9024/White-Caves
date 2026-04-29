# White Caves Real Estate API Documentation

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Status:** Production Ready ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Base URLs](#base-urls)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [Chatbot Endpoints](#chatbot-endpoints)
6. [Agent Management](#agent-management)
7. [Notification Endpoints](#notification-endpoints)
8. [Dashboard Endpoints](#dashboard-endpoints)
9. [Examples](#examples)
10. [Rate Limiting](#rate-limiting)

---

## Overview

The White Caves Real Estate API provides a comprehensive set of endpoints for managing AI-powered real estate operations. The API supports:

- **Conversational AI:** Process natural language queries for property search
- **Agent Matching:** Intelligent assignment of leads to optimal agents
- **Notifications:** Multi-channel delivery (email, SMS, push)
- **Analytics:** Real-time dashboard metrics and market trends
- **Lead Scoring:** Automatic qualification of leads

### Key Features

✅ **RESTful API Design** - Standard HTTP methods and status codes  
✅ **OpenAPI 3.0 Compliant** - Full specification available at `/openapi.json`  
✅ **JWT Authentication** - Secure Bearer token-based access  
✅ **Rate Limiting** - 1000 requests/minute per API key  
✅ **Webhook Support** - Real-time event notifications  
✅ **Comprehensive Logging** - Full audit trail of all operations  

---

## Base URLs

| Environment | URL | Use Case |
|------------|-----|----------|
| **Development** | `http://localhost:5000/api` | Local development and testing |
| **Staging** | `https://staging.whitecaves.com/api` | Pre-production testing |
| **Production** | `https://api.whitecaves.com` | Live operations |

---

## Authentication

All API requests require authentication using a JWT Bearer token.

### Getting an Access Token

```bash
curl -X POST https://api.whitecaves.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Using the Token

Include the token in the `Authorization` header:

```bash
curl -X GET https://api.whitecaves.com/api/dashboard/data \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Token Expiration

- Tokens expire after 1 hour of inactivity
- Refresh tokens available for 7 days
- Implement automatic token refresh in your client

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource does not exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error occurred |
| `503` | Service Unavailable | Service temporarily unavailable |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/chatbot/message",
    "traceId": "550e8400-e29b-41d4-a716-446655440000",
    "details": [
      {
        "field": "conversationId",
        "issue": "Required field missing"
      }
    ]
  }
}
```

---

## Chatbot Endpoints

### POST /chatbot/message

Process a user message through the AI chatbot.

**Parameters:**
```json
{
  "conversationId": "string (required)",
  "userMessage": "string (required)",
  "language": "en | ar (required)"
}
```

**Example Request:**
```bash
curl -X POST https://api.whitecaves.com/api/chatbot/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv-2024-001",
    "userMessage": "I need a 2-bedroom apartment in Marina with 1.5M budget",
    "language": "en"
  }'
```

**Response (200 OK):**
```json
{
  "conversationId": "conv-2024-001",
  "botResponse": "I found 5 apartments matching your criteria in Marina...",
  "confidence": 0.95,
  "intent": "property_search",
  "entities": [
    {
      "type": "bedroom",
      "value": "2",
      "confidence": 0.99
    },
    {
      "type": "location",
      "value": "Marina",
      "confidence": 0.98
    },
    {
      "type": "budget",
      "value": "1500000",
      "confidence": 0.92
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /chatbot/conversations/{conversationId}/history

Retrieve the complete conversation history.

**Query Parameters:**
- `limit` (integer, default: 50) - Maximum messages to retrieve
- `offset` (integer, default: 0) - Number of messages to skip

**Example Request:**
```bash
curl -X GET "https://api.whitecaves.com/api/chatbot/conversations/conv-2024-001/history?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
[
  {
    "conversationId": "conv-2024-001",
    "userMessage": "Hi, I'm looking for a property",
    "timestamp": "2024-01-15T10:00:00Z",
    "language": "en"
  },
  {
    "conversationId": "conv-2024-001",
    "userMessage": "In Marina area",
    "timestamp": "2024-01-15T10:05:00Z",
    "language": "en"
  }
]
```

### POST /chatbot/conversations/{conversationId}/score-lead

Calculate the quality score for a lead based on conversation engagement.

**Example Request:**
```bash
curl -X POST https://api.whitecaves.com/api/chatbot/conversations/conv-2024-001/score-lead \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "conversationId": "conv-2024-001",
  "score": 85,
  "reasoning": "High engagement, clear property preferences, realistic budget",
  "nextAction": "Assign to agent for follow-up"
}
```

---

## Agent Management

### POST /agents/assign

Assign the best matching agent for a lead.

**Parameters:**
```json
{
  "lead": {
    "conversationId": "string",
    "specifications": {
      "propertyType": "apartment",
      "bedrooms": 2
    },
    "location": {
      "emirate": "Dubai",
      "community": "Marina"
    },
    "pricing": {
      "budget": 1500000
    }
  },
  "preferences": {
    "agentPreference": "optional-agent-id"
  }
}
```

**Example Request:**
```bash
curl -X POST https://api.whitecaves.com/api/agents/assign \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lead": {
      "conversationId": "conv-2024-001",
      "specifications": {"propertyType": "apartment"},
      "location": {"emirate": "Dubai"},
      "pricing": {"budget": 1500000}
    }
  }'
```

**Response (200 OK):**
```json
{
  "agentId": "agent-123",
  "agent": {
    "_id": "agent-123",
    "name": "Ahmed Al Mansouri",
    "email": "ahmed@whitecaves.com",
    "phone": "+971501234567",
    "expertise": {
      "propertyTypes": ["apartment", "villa"],
      "locations": ["Dubai", "Marina"]
    },
    "activeDeals": 3,
    "maxCapacity": 10,
    "performance": {
      "closingRate": 0.78
    }
  },
  "matchScore": 0.92,
  "reason": "Specialist in Marina, high closing rate, available capacity"
}
```

### GET /agents/{agentId}

Get detailed information about a specific agent.

**Example Request:**
```bash
curl -X GET https://api.whitecaves.com/api/agents/agent-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notification Endpoints

### POST /notifications/send

Send a notification to a user via email, SMS, or push.

**Parameters:**
```json
{
  "userId": "string (required)",
  "type": "email|sms|push (required)",
  "title": "string",
  "message": "string (required)"
}
```

**Example Request:**
```bash
curl -X POST https://api.whitecaves.com/api/notifications/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-456",
    "type": "email",
    "title": "New Property Listing",
    "message": "Luxury apartment available in Marina"
  }'
```

**Response (200 OK):**
```json
{
  "_id": "notif-789",
  "userId": "user-456",
  "type": "email",
  "title": "New Property Listing",
  "message": "Luxury apartment available in Marina",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### GET /notifications/user/{userId}

Get notification history for a user.

**Query Parameters:**
- `limit` (integer, default: 50) - Maximum notifications to retrieve
- `type` (string, optional) - Filter by type (email, sms, push)

---

## Dashboard Endpoints

### GET /dashboard/data

Retrieve comprehensive dashboard metrics and analytics.

**Example Request:**
```bash
curl -X GET https://api.whitecaves.com/api/dashboard/data \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "totalLeads": 1250,
  "activeConversations": 45,
  "closedDeals": 87,
  "revenue": 45500000,
  "topAgents": [
    {
      "_id": "agent-123",
      "name": "Ahmed Al Mansouri",
      "activeDeals": 8,
      "closingRate": 0.78
    }
  ],
  "recentProperties": [...],
  "marketTrends": {
    "averagePricePerSqft": 2500,
    "trend": "up"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /dashboard/analytics

Get market analytics and trends.

**Query Parameters:**
- `period` (string) - week, month, quarter, year (default: month)

---

## Examples

### Complete Workflow: Lead Management

**1. Start Conversation**
```bash
# User initiates chat with property search query
curl -X POST https://api.whitecaves.com/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv-2024-001",
    "userMessage": "I want a 2BR apartment in Marina",
    "language": "en"
  }'
```

**2. Check Lead Quality**
```bash
# Score the lead based on conversation
curl -X POST https://api.whitecaves.com/api/chatbot/conversations/conv-2024-001/score-lead \
  -H "Authorization: Bearer $TOKEN"
```

**3. Assign to Agent**
```bash
# Automatically assign to best agent
curl -X POST https://api.whitecaves.com/api/agents/assign \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lead": {"conversationId": "conv-2024-001"}
  }'
```

**4. Send Notification**
```bash
# Notify agent of new lead
curl -X POST https://api.whitecaves.com/api/notifications/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "agent-123",
    "type": "email",
    "message": "New high-quality lead assigned to you"
  }'
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse.

**Limits:**
- 1000 requests per minute per API key
- 10,000 requests per hour
- 100,000 requests per day

**Headers Returned:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705319400
```

When rate limit is exceeded:
```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

---

## Webhook Support

Receive real-time notifications for important events.

**Supported Events:**
- `conversation.completed` - When conversation ends
- `lead.scored` - When lead quality score calculated
- `agent.assigned` - When agent assigned to lead
- `notification.sent` - When notification delivered
- `deal.closed` - When deal finalized

**Setting Up Webhooks:**
```bash
curl -X POST https://api.whitecaves.com/api/webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourapp.com/webhooks/whitecaves",
    "events": ["conversation.completed", "lead.scored"]
  }'
```

---

## API Client Libraries

Official client libraries available for:
- **JavaScript/TypeScript** - `@whitecaves/api-client`
- **Python** - `whitecaves-sdk`
- **Java** - `whitecaves-java-client`
- **Go** - `github.com/whitecaves/go-sdk`

---

## Support

- **Documentation:** https://docs.whitecaves.com
- **Status Page:** https://status.whitecaves.com
- **Support Email:** api-support@whitecaves.com
- **Community Forum:** https://community.whitecaves.com

---

## API Changelog

### v1.0.0 (January 2026)
- ✅ Initial release
- ✅ All core endpoints implemented
- ✅ OpenAPI 3.0 specification published
- ✅ Production-ready with comprehensive testing

---

**Last Updated:** January 15, 2026  
**Maintained By:** White Caves Engineering Team
