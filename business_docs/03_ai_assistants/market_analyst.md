# Market Analyst Bot — AI Assistant Profile

> **Assistant Name**: Maven  
> **Category**: Analytics & Intelligence  
> **Created**: April 14, 2026  
> **Status**: Planned (Phase 1)

---

## Overview
Maven is an AI-powered market research and analytics assistant specialized in the Dubai real estate market. Maven aggregates internal CRM data, public market trends, and competitor pricing to deliver actionable insights for agents, managers, and executives.

---

## Personality & Communication Style
- **Tone**: Insightful, confident, data-backed
- **Voice**: Executive advisor — "Dubai Marina 2BR prices are up 8.2% YoY. Our agency closed 15% above market average. Here's what I recommend for Q2."
- **Response Format**: Charts + bullet points + recommendations. Always leads with the key insight.
- **Emoji Usage**: Moderate — uses 📈 📉 🏘️ 💰 🗓️ for visual clarity

---

## Core Capabilities

### 1. Market Intelligence Reports

| Report Type | Frequency | Data Sources | Output |
|------------|-----------|--------------|--------|
| **Area Price Trends** | Weekly | Internal DB + DXBInteract | Average $/sqft by area |
| **Inventory Heatmap** | Daily | Listings DB | Areas with high/low supply |
| **Agent Performance** | Monthly | CRM data | Revenue, close rate, response time |
| **Commission Forecast** | Monthly | Pipeline + historical | Expected commission revenue |
| **Competitor Pricing** | Weekly | External scraping | Are we priced right? |
| **Lead Funnel** | Daily | Leads + Conversions | Where are leads dropping off? |

### 2. Dubai Market Zones Coverage

| Zone Tier | Areas | Average Price (2BR, 2026) |
|-----------|-------|--------------------------|
| **Ultra-Premium** | Palm Jumeirah, Emirates Hills, DIFC | AED 3-15M |
| **Premium** | Dubai Marina, JBR, Downtown, Business Bay | AED 1.5-4M |
| **Mid-Range** | JVC, JLT, Sports City, Production City | AED 700K-1.5M |
| **Emerging** | Dubai South, Dubailand, Tilal Al Ghaf | AED 500K-1.2M |
| **Off-Plan Focus** | Emaar Beachfront, Dubai Creek, Dubai Hills Phase 3 | Varies |

### 3. Key Metrics Tracked

```typescript
interface MarketMetrics {
  // Price Metrics
  avgPriceSqft: number;          // AED per sqft by area
  priceChangeYoY: number;        // Year-over-year %
  priceChangeMoM: number;        // Month-over-month %
  medianTransactionValue: number; // AED

  // Volume Metrics
  totalTransactions: number;     // DLD registered
  offPlanVsReady: number;        // Ratio (0-1)
  rentalYield: number;           // % gross annual
  daysOnMarket: number;          // Average listing duration

  // Agency Metrics (Internal)
  activeListings: number;        // Our inventory count
  newLeadsThisWeek: number;      // Inbound leads
  conversionRate: number;        // Lead → Client %
  avgDealSize: number;           // AED per closed deal
  totalCommission: number;       // Earned this period
}
```

### 4. Automated Insights
Maven auto-generates plain-English insights such as:
- "🏘️ **Dubai Marina 2BR** listings dropped 12% this week but demand stayed flat → expect price bump"
- "📈 Your lead-to-viewing conversion rate improved from 23% to 31% after implementing the WhatsApp follow-up sequence"
- "💰 **Commission alert**: You're on track for AED 450K this quarter, 18% above target"
- "⚠️ **Warning**: 7 leads went cold this week (no contact in 5+ days). Recommended: send re-engagement message via Nadia"

---

## Data Infrastructure

### Internal Data Sources
| Source | Model | Key Fields |
|--------|-------|-----------|
| Properties | `Property` | type, price, area, sqft, status, listedAt |
| Leads | `Lead` | score, source, assignedAgent, convertedAt |
| Commissions | `Commission` | amount, status, transactionDate |
| Agents | `User` (role=agent) | performance metrics |
| Conversations | `Conversation` | channel, sentiment, responseTime |

### External Data Sources
| Source | API | Data Available |
|--------|-----|---------------|
| **Dubai Land Department** | DXBInteract API | Transaction volumes, price indices |
| **REIDIN** | Subscription API | Historical prices, rental indices |
| **PropertyFinder Market Data** | Public pages | Area guides, market reports |
| **Google Trends** | Public API | Search demand by area |

---

## Integration Points

### Dashboard Widgets
```typescript
// MarketInsightsWidget — Dashboard card showing top 3 insights
// PriceTrendsChart — Line chart: price/sqft over 12 months by area
// AgentScorecard — Performance comparison table
// CommissionForecast — Bar chart: actual vs projected revenue
// LeadFunnelChart — Funnel: impressions → views → leads → clients
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/market-overview` | High-level market metrics |
| GET | `/api/analytics/area/:areaId/trends` | Area-specific price trends |
| GET | `/api/analytics/agent/:agentId/performance` | Agent scorecard |
| GET | `/api/analytics/commission/forecast` | Revenue forecast |
| GET | `/api/analytics/insights` | AI-generated insights (top 10) |
| POST | `/api/analytics/report/generate` | Custom report builder |

### Report Distribution
- **In-app**: Dashboard widgets + dedicated analytics page
- **Email**: Weekly digest to all agents, monthly executive report
- **WhatsApp**: Daily highlight via Nadia ("Good morning! Here's your market update 📊")
- **PDF export**: Branded reports for client presentations

---

## Implementation Phases

### Phase 1: Internal Analytics (15h)
- Dashboard widgets using internal CRM data (properties, leads, commissions)
- Agent performance scorecards
- Commission forecasting (simple linear projection)

### Phase 2: Market Intelligence (20h)
- Integration with DXBInteract/REIDIN for external market data
- Area price trend charts
- Inventory heatmap

### Phase 3: AI Insights (15h)
- Natural language insight generation (OpenAI API)
- Automated anomaly detection (unusual price/volume changes)
- Predictive analytics (when will this lead close? expected price in 6 months?)

---

## Success Metrics
- **Report generation**: < 5 seconds for any analytics query
- **Insight accuracy**: > 85% of AI insights rated "useful" by agents
- **Decision impact**: 20% improvement in pricing accuracy (list price vs sale price gap)
- **Adoption**: 70% of agents check analytics dashboard daily within 60 days
- **Revenue attribution**: Agents using Maven close 15% more deals (controlled study after 90 days)
