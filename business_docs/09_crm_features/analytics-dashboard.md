# Analytics & Business Intelligence Dashboard — CRM Feature Specification

> **Status:** In Development  
> **Module Owner:** Aisha (Analytics Specialist AI)  
> **Last Updated:** April 2026  
> **Priority:** Critical  
> **API Endpoints:** `/api/analytics`, `/api/reports`, `/api/dashboards`

---

## Overview

The Analytics & Business Intelligence Dashboard provides real-time, role-based insights across every dimension of the real estate business — sales performance, financial health, marketing effectiveness, property portfolio, and agent productivity. The system is designed for data-driven decision-making at every level of the organization.

### Mobile View Purpose

Deliver actionable intelligence through interactive dashboards, automated reports, and AI-powered market insights — enabling executives to steer strategy, managers to optimize operations, and agents to maximize their performance.

### Business Value

- **Revenue Optimization**: Identify high-converting lead sources and top-performing agents
- **Operational Visibility**: Real-time KPIs eliminate guesswork and stale reports
- **Strategic Planning**: Market intelligence and trend analysis drive informed decisions
- **Performance Culture**: Transparent scorecards motivate agents and teams
- **Cost Efficiency**: Campaign ROI tracking ensures marketing budget is well spent
- **Compliance**: Audit-ready reports meet regulatory requirements
- **Time Savings**: Automated reports replace manual spreadsheet work

---

## User Stories

### Owner / Executive Perspective

- **As an** owner, **I want to** see a company-wide KPI dashboard, **so that** I understand business health at a glance
- **As an** owner, **I want to** compare quarterly performance year-over-year, **so that** I track growth trajectory
- **As an** owner, **I want to** drill down from company metrics to team to individual agent, **so that** I identify issues at any level
- **As an** owner, **I want to** receive automated weekly reports, **so that** I stay informed without logging in daily
- **As an** owner, **I want to** see market trends and demand forecasting, **so that** I make strategic decisions

### Manager Perspective

- **As a** manager, **I want to** see my team's pipeline and conversion metrics, **so that** I can coach effectively
- **As a** manager, **I want to** compare agent performance on a leaderboard, **so that** I recognize top performers
- **As a** manager, **I want to** track marketing campaign ROI, **so that** I allocate budget to effective channels
- **As a** manager, **I want to** monitor inventory aging, **so that** I address stale listings proactively
- **As a** manager, **I want to** build custom reports, **so that** I answer ad-hoc business questions

### Agent Perspective

- **As an** agent, **I want to** see my personal performance dashboard, **so that** I track my progress toward targets
- **As an** agent, **I want to** see my conversion funnel, **so that** I identify where I lose deals
- **As an** agent, **I want to** see which listings get the most views, **so that** I focus on high-interest properties
- **As an** agent, **I want to** see my commission earnings, **so that** I track my income

### Sales Agent / Leasing Agent Perspective

- **As a** sales agent, **I want to** see deal velocity metrics, **so that** I improve my sales cycle time
- **As a** leasing agent, **I want to** see occupancy rate trends, **so that** I understand rental market demand

---

## Executive Dashboard

### Company-Wide KPIs

| KPI               | Metric                  | Visualization           | Update Frequency |
| ----------------- | ----------------------- | ----------------------- | ---------------- |
| Total Revenue     | AED/USD amount          | Number card + sparkline | Real-time        |
| Deals Closed      | Count (MTD/QTD/YTD)     | Number card + trend     | Real-time        |
| Pipeline Value    | Total weighted pipeline | Number card             | Real-time        |
| Active Leads      | Count by stage          | Funnel chart            | Real-time        |
| Conversion Rate   | Leads → Deals %         | Percentage + trend      | Daily            |
| Avg. Deal Size    | AED/USD amount          | Number card + trend     | Daily            |
| Commission Earned | Total commissions       | Number card             | Daily            |
| Active Listings   | Count by status         | Donut chart             | Real-time        |
| Occupancy Rate    | Occupied / Total %      | Gauge chart             | Daily            |
| Agent Utilization | Active agents / Total   | Percentage              | Daily            |

### Executive Summary Widgets

- **Revenue waterfall chart**: Monthly revenue breakdown (new sales + rentals + renewals)
- **Deal pipeline funnel**: Leads → Qualified → Viewing → Offer → Negotiation → Closed
- **Geographic heatmap**: Revenue by Dubai community
- **Trend comparison**: Current period vs. previous period (selectable: MoM, QoQ, YoY)
- **Top deals table**: Largest 10 deals in period with agent name and status

---

## Sales Analytics

### Conversion Funnel

Tracks leads through every stage of the sales pipeline.

```
   Lead Captured         ████████████████████████████████████  1,250
   Contacted             ███████████████████████████████       1,020
   Qualified             ████████████████████████              780
   Viewing Scheduled     ██████████████████                    560
   Viewing Completed     ████████████████                      490
   Offer Submitted       ████████████                          370
   Negotiation           █████████                             280
   Closed Won            ██████                                185
   Closed Lost           ████                                  95
```

#### Funnel Metrics

| Metric                  | Calculation                                  | Purpose                       |
| ----------------------- | -------------------------------------------- | ----------------------------- |
| Stage conversion rate   | Entries to stage / Entries to previous stage | Identify drop-off points      |
| Overall conversion rate | Closed Won / Lead Captured                   | Measure end-to-end efficiency |
| Stage duration (avg.)   | Average days spent in each stage             | Identify bottlenecks          |
| Drop-off analysis       | % lost at each stage with reasons            | Improve process               |

### Deal Velocity

- **Average deal cycle**: Days from lead capture to close
- **Velocity by property type**: Apartments vs. villas vs. commercial
- **Velocity by price range**: Under 1M, 1–5M, 5–10M, 10M+
- **Velocity by agent**: Individual agent cycle times
- **Velocity trend**: Monthly trend of average deal cycle
- **Stalled deals**: Deals in same stage for > 14 days (configurable)

### Win/Loss Analysis

| Dimension        | Analysis                                                      |
| ---------------- | ------------------------------------------------------------- |
| By reason        | Top 10 loss reasons (price, location, competition, financing) |
| By competitor    | Which competitors won the deal                                |
| By source        | Win rate per lead source                                      |
| By agent         | Win rate per agent                                            |
| By property type | Win rate per type                                             |
| By community     | Win rate per area                                             |
| By time          | Win rate trend over time                                      |

---

## Marketing Analytics

### Lead Source Performance

| Source          | Leads | Qualified | Converted | Cost       | CPL    | CPA       |
| --------------- | ----- | --------- | --------- | ---------- | ------ | --------- |
| PropertyFinder  | 320   | 180       | 28        | AED 15,000 | AED 47 | AED 536   |
| Bayut           | 280   | 150       | 22        | AED 12,000 | AED 43 | AED 545   |
| Google Ads      | 200   | 90        | 12        | AED 18,000 | AED 90 | AED 1,500 |
| Facebook/IG     | 180   | 60        | 8         | AED 8,000  | AED 44 | AED 1,000 |
| Website Organic | 150   | 80        | 15        | AED 0      | AED 0  | AED 0     |
| Referrals       | 120   | 90        | 30        | AED 0      | AED 0  | AED 0     |
| Walk-in         | 50    | 35        | 12        | N/A        | N/A    | N/A       |
| WhatsApp        | 100   | 55        | 10        | AED 2,000  | AED 20 | AED 200   |

> CPL = Cost Per Lead; CPA = Cost Per Acquisition

### Campaign ROI Dashboard

- **Active campaigns**: List with status, budget, spend, results
- **Campaign comparison**: Side-by-side performance metrics
- **Attribution model**: First-touch, last-touch, multi-touch attribution
- **Budget utilization**: Spend vs. budget per campaign
- **ROI calculation**: (Revenue from campaign - Cost) / Cost × 100
- **Channel mix**: Pie chart of lead distribution by channel

### Channel Performance

- **Portal analytics**: Views, inquiries, conversion per portal
- **Digital ads**: Impressions, clicks, CTR, conversions, CPC
- **Social media**: Followers, engagement, leads generated
- **Email marketing**: Open rate, click rate, conversion rate
- **WhatsApp**: Delivery, read, response rates

---

## Financial Analytics

### Revenue Trends

- **Monthly revenue chart**: Bar chart with sales + rental revenue stacked
- **Revenue by type**: Sale commissions, rental commissions, management fees
- **Revenue by team**: Contribution of each team to total revenue
- **Revenue by community**: Geographic revenue distribution
- **Currency display**: AED primary, USD toggle

### Commission Tracking

| Metric                   | Description                           |
| ------------------------ | ------------------------------------- |
| Total commissions earned | Sum of all closed deal commissions    |
| Commission pipeline      | Expected commissions from pipeline    |
| Commission by agent      | Individual agent commission breakdown |
| Commission splits        | Agent/company split tracking          |
| Pending commissions      | Earned but not yet paid               |
| Commission trend         | Monthly commission trend (12 months)  |

### Expense Analysis

- **Operating expenses**: Office, salaries, marketing, technology
- **Marketing spend**: By channel and campaign
- **Cost per deal**: Total cost / Number of deals closed
- **Profit margins**: Revenue - Expenses by category
- **Budget vs. actual**: Variance reporting

---

## Property Analytics

### Inventory Health

| Metric                   | Description                            | Alert Threshold    |
| ------------------------ | -------------------------------------- | ------------------ |
| Total active listings    | Count of active properties             | N/A                |
| New listings (MTD)       | Properties listed this month           | < 10 = warning     |
| Average days on market   | Mean DOM for active listings           | > 90 = warning     |
| Inventory aging          | Distribution by DOM buckets            | > 50% over 60 days |
| Listings without inquiry | Properties with 0 inquiries in 30 days | Any = flag         |
| Price reduction rate     | % of listings with price drops         | > 30% = warning    |

### Price Trends

- **Community price index**: Average price per sq ft by community (time series)
- **Price range distribution**: Histogram of listing prices
- **Rent vs. sale price correlation**: Yield analysis by area
- **Price change history**: Track all price modifications
- **Comparison**: Current vs. 3 months ago vs. 12 months ago

### Area Performance

| Area           | Active Listings | Avg. Price/sqft | Avg. DOM | Inquiries | Conversion |
| -------------- | --------------- | --------------- | -------- | --------- | ---------- |
| Dubai Marina   | 45              | AED 1,850       | 32       | 340       | 12%        |
| Downtown Dubai | 38              | AED 2,400       | 28       | 420       | 15%        |
| Palm Jumeirah  | 22              | AED 3,100       | 45       | 180       | 8%         |
| JVC            | 65              | AED 950         | 22       | 510       | 18%        |
| Business Bay   | 42              | AED 1,650       | 35       | 290       | 11%        |

---

## Agent Performance Scorecards

### Individual Scorecard

| Metric              | Target         | Actual   | % Achieved | Trend |
| ------------------- | -------------- | -------- | ---------- | ----- |
| Leads contacted     | 50/month       | 42       | 84%        | ↑     |
| Viewings conducted  | 20/month       | 18       | 90%        | ↑     |
| Deals closed        | 5/month        | 3        | 60%        | ↓     |
| Revenue generated   | AED 500K/month | AED 380K | 76%        | →     |
| Avg. response time  | < 5 min        | 8 min    | 63%        | ↓     |
| Client satisfaction | 4.5/5          | 4.2/5    | 93%        | →     |
| Listings active     | 15             | 12       | 80%        | ↑     |
| Commission earned   | AED 75K/month  | AED 57K  | 76%        | →     |

### Team Leaderboard

- **Ranked by**: Revenue, deals closed, conversion rate (selectable)
- **Time period**: Weekly, Monthly, Quarterly, Annual
- **Visualization**: Bar chart with agent photos
- **Gamification**: Badges for achievements (e.g., "Top Closer", "Speed Demon")
- **Historical ranking**: Position change vs. previous period

### Activity Metrics

| Activity             | Tracked | Benchmark |
| -------------------- | ------- | --------- |
| Calls made           | ✅      | 20/day    |
| Emails sent          | ✅      | 15/day    |
| WhatsApp messages    | ✅      | 25/day    |
| Viewings conducted   | ✅      | 1/day     |
| Listings created     | ✅      | 2/week    |
| Follow-ups completed | ✅      | 10/day    |
| Proposals sent       | ✅      | 3/week    |
| Client meetings      | ✅      | 5/week    |

### Performance Alerts

- Agent below 50% of monthly target by mid-month
- Response time exceeding SLA for 3+ consecutive leads
- Zero activity for 2+ business days
- Conversion rate below team average for 2+ months

---

## Market Intelligence

### Area Trends

- **Transaction volume**: Monthly transactions by community (DLD data)
- **Price movement**: Monthly price index change by area
- **Supply vs. demand**: New listings vs. inquiries ratio
- **Emerging areas**: Communities with highest growth rates
- **Seasonal patterns**: Monthly/quarterly demand patterns

### Competitor Pricing

- **Price comparison**: Average listing price vs. competitor agencies (per community)
- **Listing volume**: Number of active listings vs. competitors
- **Market share estimate**: Based on portal listings and DLD transactions
- **Positioning map**: Price vs. volume scatter plot

### Demand Forecasting

- **AI-powered prediction**: 3-month demand forecast by area and property type
- **Confidence interval**: Low/mid/high prediction bands
- **Influencing factors**: Visa changes, expo effects, interest rates, seasonality
- **Recommended actions**: AI-generated strategy suggestions

---

## Custom Report Builder

### Report Creation

- **Drag-and-drop interface**: Select metrics, dimensions, and filters
- **Data sources**: Leads, deals, properties, agents, finances, marketing
- **Metric library**: 100+ pre-defined metrics available
- **Custom calculations**: Create computed fields (e.g., Revenue - Expenses)
- **Grouping**: Group by any dimension (agent, team, area, type, time)
- **Filters**: Multi-criteria filtering with AND/OR logic

### Visualization Options

| Chart Type   | Best For                      | Interactive             |
| ------------ | ----------------------------- | ----------------------- |
| Bar chart    | Comparisons across categories | ✅ Click to drill down  |
| Line chart   | Trends over time              | ✅ Hover for values     |
| Pie / Donut  | Composition / distribution    | ✅ Click to filter      |
| Funnel       | Conversion processes          | ✅ Click per stage      |
| Heatmap      | Geographic or matrix data     | ✅ Hover for values     |
| Table        | Detailed tabular data         | ✅ Sort, filter, export |
| KPI card     | Single metric highlight       | ✅ Click for detail     |
| Gauge        | Progress toward target        | ❌ Static               |
| Scatter plot | Correlation analysis          | ✅ Hover for values     |
| Waterfall    | Sequential value changes      | ✅ Hover for values     |

### Report Scheduling

| Feature    | Options                                              |
| ---------- | ---------------------------------------------------- |
| Frequency  | Daily, Weekly, Monthly, Quarterly                    |
| Delivery   | Email (PDF/Excel), Portal notification               |
| Recipients | Individual users, Teams, Custom lists                |
| Time       | Configurable delivery time                           |
| Conditions | Send only if data meets criteria (e.g., revenue > 0) |

### Export Options

- **PDF**: Formatted report with charts and branding
- **Excel**: Raw data with pivot-ready formatting
- **CSV**: Plain data export
- **Google Sheets**: Direct export to linked sheet
- **API**: Programmatic access to report data

## Mobile Analytics View

### Purpose

Give managers and executives a compact, touch-friendly analytics experience on phones and tablets without losing the critical KPIs.

### Mobile Layout Requirements

- 2-column KPI card grid on phones, 3-column on tablets, 4-column on desktop
- Primary cards: revenue, pipeline value, active leads, conversion rate, deals closed
- Thumb-friendly filter drawer with area, date range, source, and agent selectors
- Sticky period switcher for MTD / QTD / YTD / 12M views
- Compact sparkline row for revenue, leads, and conversion

### Offline / Low-Connectivity Behavior

- Last loaded dashboard snapshot cached locally for read-only fallback
- Show stale-data banner when live feed is unavailable
- Queue refresh request and recover automatically when connection returns
- Disable destructive actions while offline

### Mobile View Acceptance Criteria

- Mobile dashboard loads without horizontal scrolling at 375px width
- Filters remain reachable by keyboard and touch
- KPI cards retain readable labels and trend direction on small screens
- Offline fallback clearly indicates when data is stale

## Export API Workflow

### Export Workflow Purpose

Allow finance and leadership users to export reports asynchronously without blocking the UI or risking oversized downloads.

### API Contract

- `POST /api/analytics/export`
- `GET /api/analytics/export/:jobId`
- `GET /api/analytics/export/:jobId/download`

### Export Rules

- Async job returns a `jobId` immediately
- Maximum 50,000 rows per export request
- Supported formats: CSV, Excel, PDF
- Download URLs expire after a short, configurable window
- Export activity is recorded in the audit trail

### Export Security / Safety

- Role-based access control enforced before job creation
- File downloads require ownership or elevated access
- Export jobs sanitize filters to prevent injection in query builders

### Export Acceptance Criteria

- Large exports are processed asynchronously
- Users can check status while the job is running
- Completed exports are downloadable exactly once or until expiry
- Export requests appear in audit logs with user and timestamp

---

## Real-Time Data Feeds

### WebSocket Architecture

```
┌────────────┐     WebSocket      ┌──────────────┐
│  Dashboard │◀──────────────────▶│  WS Server   │
│  (Browser) │                    │  (Socket.IO)  │
└────────────┘                    └──────────────┘
                                         │
                                         │ Pub/Sub
                                         ▼
                                  ┌──────────────┐
                                  │  Event Bus   │
                                  │  (Redis)     │
                                  └──────────────┘
                                         ▲
                          ┌──────────────┼──────────────┐
                          │              │              │
                   ┌──────────┐   ┌──────────┐   ┌──────────┐
                   │  Lead    │   │  Deal    │   │ Property │
                   │  Service │   │  Service │   │  Service │
                   └──────────┘   └──────────┘   └──────────┘
```

### Live-Updating Metrics

| Metric          | Update Trigger    | Latency     |
| --------------- | ----------------- | ----------- |
| Pipeline value  | Deal stage change | < 2 seconds |
| Lead count      | New lead created  | < 2 seconds |
| Revenue         | Deal closed       | < 2 seconds |
| Active listings | Status change     | < 5 seconds |
| Agent activity  | Action logged     | < 5 seconds |
| Inquiry count   | New inquiry       | < 2 seconds |

### Real-Time Notifications

- Deal closed → Celebration animation on team dashboard
- Large deal (> AED 5M) → Company-wide notification
- New lead assigned → Agent dashboard flash
- Target achieved → Badge animation

---

## Data Visualization Specifications

### Chart Library

Built on a modern charting library (Recharts / Chart.js) with White Caves design system tokens.

### Color Palette

| Purpose   | Color     | Usage                          |
| --------- | --------- | ------------------------------ |
| Primary   | `#2563EB` | Primary metrics, active series |
| Success   | `#16A34A` | Positive trends, targets met   |
| Warning   | `#F59E0B` | Approaching threshold          |
| Danger    | `#DC2626` | Negative trends, overdue       |
| Secondary | `#6B7280` | Secondary data series          |
| Accent 1  | `#8B5CF6` | Third data series              |
| Accent 2  | `#EC4899` | Fourth data series             |
| Neutral   | `#E5E7EB` | Backgrounds, grid lines        |

### Responsive Charts

- **Desktop**: Full interactive charts with hover tooltips
- **Tablet**: Simplified charts, touch-friendly tooltips
- **Mobile**: Condensed charts, swipe between metrics
- **Print**: Optimized for A4 landscape PDF export

---

## Role-Based Dashboard Views

### Access Matrix

| Dashboard Section   | Owner  | Manager | Agent  | Sales Agent | Leasing Agent |
| ------------------- | ------ | ------- | ------ | ----------- | ------------- |
| Executive summary   | ✅ All | ✅ Team | ❌     | ❌          | ❌            |
| Sales analytics     | ✅ All | ✅ Team | ✅ Own | ✅ Own      | ❌            |
| Rental analytics    | ✅ All | ✅ Team | ✅ Own | ❌          | ✅ Own        |
| Financial analytics | ✅ All | ✅ Team | ✅ Own | ✅ Own      | ✅ Own        |
| Property analytics  | ✅ All | ✅ Team | ✅ Own | ✅ Own      | ✅ Own        |
| Agent scorecards    | ✅ All | ✅ Team | ✅ Own | ✅ Own      | ✅ Own        |
| Marketing analytics | ✅ All | ✅ Team | ❌     | ❌          | ❌            |
| Market intelligence | ✅ All | ✅ All  | ✅ All | ✅ All      | ✅ All        |
| Custom reports      | ✅ All | ✅ Team | ✅ Own | ✅ Own      | ✅ Own        |
| Report builder      | ✅     | ✅      | ❌     | ❌          | ❌            |

### Data Scoping Rules

- **Owner**: Sees all company data across all teams and agents
- **Manager**: Sees data for their team's agents and own data
- **Agent / Sales Agent / Leasing Agent**: Sees only their own data
- **Shared data**: Market intelligence is accessible to all roles
- **Report builder**: Restricted to Owner and Manager roles

---

## Historical Comparison

### Time Period Comparisons

| Comparison                 | Format                                 | Available For |
| -------------------------- | -------------------------------------- | ------------- |
| Month-over-Month (MoM)     | Current month vs. previous month       | All metrics   |
| Quarter-over-Quarter (QoQ) | Current quarter vs. previous quarter   | All metrics   |
| Year-over-Year (YoY)       | Current year vs. same period last year | All metrics   |
| Custom range               | Any two date ranges                    | All metrics   |
| Rolling average            | 3/6/12 month rolling avg.              | Trend metrics |

### Comparison Visualizations

- **Side-by-side bar chart**: Two periods compared per metric
- **Overlay line chart**: Current vs. previous period trends
- **Variance table**: Metric, Previous, Current, Change %, Direction
- **Sparkline indicators**: Mini trend charts in metric cards

### Benchmarking

- **Internal benchmark**: Agent vs. team average vs. company average
- **Historical benchmark**: Current vs. best period vs. worst period
- **Target benchmark**: Actual vs. target with gap analysis
- **Market benchmark**: Company performance vs. market indicators (where available)

---

## Acceptance Criteria

### Executive Dashboard

- [ ] Dashboard loads within 5 seconds with all widgets populated
- [ ] Real-time updates via WebSocket reflect within 2 seconds
- [ ] All KPI cards display correct values matching database queries
- [ ] Drill-down navigation works from company → team → agent level
- [ ] Currency toggle switches all financial metrics between AED and USD

### Sales Analytics

- [ ] Conversion funnel displays accurate counts per stage
- [ ] Deal velocity calculations match manual verification
- [ ] Win/loss analysis correctly categorizes by all dimensions
- [ ] Stalled deal alerts trigger at configured thresholds

### Agent Scorecards

- [ ] Target vs. actual metrics match HR-configured targets
- [ ] Leaderboard rankings update in real-time
- [ ] Performance alerts fire for below-threshold agents
- [ ] Historical comparison shows correct period data

### Custom Reports

- [ ] Report builder supports all listed data sources and metrics
- [ ] Drag-and-drop interface works on desktop browsers
- [ ] Scheduled reports deliver on time via configured channels
- [ ] Export generates correct data in all supported formats (PDF, Excel, CSV)
- [ ] Saved reports persist and load correctly

### Real-Time Data

- [ ] WebSocket connection establishes within 3 seconds
- [ ] Automatic reconnection on connection loss (with exponential backoff)
- [ ] Live updates appear without page refresh
- [ ] Concurrent users (50+) do not degrade performance

### Role-Based Access

- [ ] Owner sees all company data
- [ ] Manager sees only team data
- [ ] Agent sees only own data
- [ ] Unauthorized dashboard sections are hidden (not just disabled)
- [ ] API enforces same access rules as UI

---

## Technical Notes

### API Endpoints

| Method | Endpoint                               | Description              |
| ------ | -------------------------------------- | ------------------------ |
| GET    | `/api/analytics/executive`             | Executive dashboard data |
| GET    | `/api/analytics/sales`                 | Sales analytics          |
| GET    | `/api/analytics/sales/funnel`          | Conversion funnel data   |
| GET    | `/api/analytics/sales/velocity`        | Deal velocity metrics    |
| GET    | `/api/analytics/marketing`             | Marketing performance    |
| GET    | `/api/analytics/marketing/campaigns`   | Campaign analytics       |
| GET    | `/api/analytics/financial`             | Financial summary        |
| GET    | `/api/analytics/financial/commissions` | Commission details       |
| GET    | `/api/analytics/properties`            | Property analytics       |
| GET    | `/api/analytics/properties/pricing`    | Price trend data         |
| GET    | `/api/analytics/agents/:id/scorecard`  | Agent scorecard          |
| GET    | `/api/analytics/agents/leaderboard`    | Agent rankings           |
| GET    | `/api/analytics/market`                | Market intelligence      |
| GET    | `/api/analytics/market/forecast`       | AI demand forecast       |
| POST   | `/api/reports`                         | Create custom report     |
| GET    | `/api/reports`                         | List saved reports       |
| GET    | `/api/reports/:id`                     | Get report data          |
| PUT    | `/api/reports/:id`                     | Update report config     |
| DELETE | `/api/reports/:id`                     | Delete report            |
| POST   | `/api/reports/:id/schedule`            | Schedule report          |
| GET    | `/api/reports/:id/export`              | Export report data       |

### Performance Requirements

- Dashboard initial load: < 5 seconds (95th percentile)
- Widget data refresh: < 2 seconds
- Report generation: < 10 seconds for up to 100K rows
- Export generation: < 30 seconds for up to 500K rows
- WebSocket latency: < 2 seconds from event to display
- Concurrent dashboard users: Support 50+ simultaneous sessions

### Data Aggregation Strategy

- **Real-time metrics**: Computed on-demand from live database
- **Daily aggregates**: Pre-computed nightly for historical charts
- **Monthly snapshots**: Stored for YoY comparison performance
- **Cache layer**: Redis cache with 5-minute TTL for dashboard widgets
- **Query optimization**: Materialized views for complex aggregations

### AI Integration

- **Aisha (Analytics Specialist)**: Generates insights, anomaly detection, forecast narratives
- **Omar (Financial Advisor)**: Provides financial analysis commentary and recommendations
- **Nadia (Market Researcher)**: Supplies market intelligence and competitive analysis
- **Rashid (Strategy)**: Translates analytics into strategic recommendations

---

## Dependencies

- Charting library (Recharts or Chart.js)
- WebSocket server (Socket.IO)
- Redis (pub/sub and caching)
- PDF generation service (Puppeteer or PDFKit)
- Excel generation library (ExcelJS)
- Google Maps API (geographic heatmaps)
- DLD API (market transaction data)
- Exchange rate API (AED/USD conversion)

---

## Future Enhancements

- Predictive analytics using machine learning models
- Natural language query interface ("Show me revenue by area last quarter")
- Automated insight generation (AI detects and narrates anomalies)
- Mobile-native dashboard app
- Embedded analytics for landlord and tenant portals
- Integration with external BI tools (Power BI, Tableau, Looker)
- Voice-activated dashboard queries via AI assistants
- Benchmark data sharing consortium with partner agencies

---

## Mobile Analytics View Specification

> @Cassie — DeepSeek V3 (FREE) | Workstream C expansion

### Overview

The mobile analytics view provides a streamlined, thumb-friendly version of all dashboards, optimized for on-the-go access by agents, managers, and executives. All core KPIs are visible without horizontal scrolling.

### Screen Hierarchy

| Screen              | Primary KPIs                                       | Actions                    |
| ------------------- | -------------------------------------------------- | -------------------------- |
| Home (mobile)       | Today's leads, Today's revenue, Open tasks         | Quick-add lead, Call agent |
| My Performance      | Personal pipeline, Conversion %, Commission earned | Filter by period           |
| Team View (Manager) | Team leaderboard, Pipeline total, Alerts           | Drill into agent           |
| Portfolio (Owner)   | Occupancy %, MRR, Vacant units                     | View map, Export           |
| Campaigns           | Active campaigns, Cost today, Leads generated      | Pause/resume               |

### UX Constraints

- Max 3 KPI cards per mobile screen (no horizontal scroll)
- Charts: bar + donut only on mobile (no complex scatter or heat-maps)
- All filters collapse into a bottom sheet (iOS/Android pattern)
- Touch targets ≥ 44px (WCAG 2.5.5)
- Offline mode: last-cached data shown with "Refreshed X min ago" badge

### Data Refresh Policy

| Tier                                 | Refresh Interval                   | Push Notification         |
| ------------------------------------ | ---------------------------------- | ------------------------- |
| Real-time KPIs (leads, pipeline)     | Every 30 seconds (WebSocket)       | On alert threshold breach |
| Financial KPIs (revenue, commission) | Every 5 minutes                    | On daily target reached   |
| Campaign analytics                   | Every 15 minutes                   | On budget 80% consumed    |
| Historical charts                    | On-demand (manual pull-to-refresh) | Never (background)        |

### Acceptance Criteria

- [ ] Mobile dashboard loads within 2 seconds on 4G
- [ ] All KPI cards render without horizontal scroll on 375px width (iPhone SE)
- [ ] Offline mode shows stale-data banner when no network
- [ ] Pinch-to-zoom disabled on charts (prevents accidental navigation)
- [ ] Native share button available on every chart (PNG export)

---

## Scheduled Report Delivery Matrix

> @Cassie — DeepSeek V3 (FREE)

### Report Catalogue

| Report Name                | Audience          | Frequency                      | Delivery         | Format      |
| -------------------------- | ----------------- | ------------------------------ | ---------------- | ----------- |
| Executive Weekly Briefing  | Owner / MD        | Every Sunday 7:00 AM           | Email + WhatsApp | PDF         |
| Team Pipeline Snapshot     | Sales Manager     | Every Monday 8:00 AM           | Email            | PDF         |
| Agent Commission Statement | Individual Agent  | 1st of each month              | Email + Portal   | PDF         |
| Property Vacancy Alert     | Manager + Owner   | Daily (if vacancy > threshold) | WhatsApp         | Message     |
| Marketing ROI Summary      | Marketing Manager | Every Friday 6:00 PM           | Email            | Excel + PDF |
| Landlord Portfolio Report  | Landlord          | Monthly (configurable day)     | Email + Portal   | PDF         |
| Cash Flow Forecast         | Finance / Owner   | Weekly (Wednesday)             | Email            | Excel       |
| Lease Expiry Digest        | Property Manager  | Every Monday 7:00 AM           | Email            | PDF         |
| Custom Ad-Hoc Report       | Any role          | On-demand                      | Portal download  | Excel / PDF |

### Report Builder Configuration

| Parameter     | Options                                                 |
| ------------- | ------------------------------------------------------- |
| Date range    | Today, This week, This month, This quarter, YTD, Custom |
| Filters       | Agent, Team, Property type, Area, Lead source, Status   |
| Grouping      | By agent, by property, by area, by channel, by period   |
| Chart types   | Bar, Line, Donut, Table, Heat-map                       |
| Delivery time | Any time (HH:MM), timezone-aware (GST)                  |
| Recipients    | Individual, Team, Role-group, External email            |

### Scheduling API Specification

```
POST /api/reports/schedule
{
  "reportType": "executive_weekly | pipeline_snapshot | commission | custom",
  "schedule": {
    "frequency": "daily | weekly | monthly | once",
    "dayOfWeek": 0-6,          // 0 = Sunday
    "hour": 7,
    "timezone": "Asia/Dubai"
  },
  "filters": { ... },
  "recipients": ["email@domain.com"],
  "format": "pdf | excel | both",
  "active": true
}
```

### Acceptance Criteria

- [ ] Reports delivered within 5 minutes of scheduled time
- [ ] Failed delivery retried 3× with 10-minute intervals
- [ ] All reports use AED as primary currency (USD as secondary)
- [ ] Unsubscribe link in every automated email (GDPR/UAE PDPL)
- [ ] Report history stored 24 months; downloadable from portal

---

## Data Export API Specification

> @Cassie — DeepSeek V3 (FREE)

### Export Endpoints

| Endpoint                      | Description               | Auth Required | Rate Limit  |
| ----------------------------- | ------------------------- | ------------- | ----------- |
| `GET /api/export/leads`       | Export leads with filters | ✅ Manager+   | 100 req/day |
| `GET /api/export/properties`  | Export property inventory | ✅ Manager+   | 100 req/day |
| `GET /api/export/commissions` | Export commission records | ✅ Finance    | 50 req/day  |
| `GET /api/export/agents`      | Export agent performance  | ✅ Manager+   | 50 req/day  |
| `GET /api/export/financials`  | Full P&L export           | ✅ Owner only | 10 req/day  |
| `POST /api/export/custom`     | Custom SQL-safe query     | ✅ Owner only | 5 req/day   |

### Query Parameters

```
GET /api/export/leads?
  startDate=2026-01-01
  &endDate=2026-05-31
  &agentId=agent_abc123
  &status=hot,warm
  &source=property_finder,whatsapp
  &format=csv           // csv | excel | json
  &columns=name,phone,status,assignedAgent,createdAt
  &limit=10000          // max 50,000 rows
  &timezone=Asia/Dubai
```

### Export Format Specifications

| Format | Content-Type                                                        | Notes                                             |
| ------ | ------------------------------------------------------------------- | ------------------------------------------------- |
| CSV    | `text/csv`                                                          | UTF-8 with BOM (for Arabic names in Excel)        |
| Excel  | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | Headers in row 1; data from row 2                 |
| JSON   | `application/json`                                                  | Paginated (cursor-based); max 1,000 rows/response |

### Security Requirements

- All exports logged to audit trail with `exportedBy`, `exportedAt`, `rowCount`, `filters`
- PII fields (phone, email) masked for non-Finance roles (show last 4 digits only)
- Export tokens expire after 15 minutes (pre-signed URL pattern)
- Bulk export (>5,000 rows) runs as background job; download link emailed when ready

### Acceptance Criteria

- [ ] CSV exports open correctly in Excel with Arabic names (UTF-8 BOM)
- [ ] Large exports (>5K rows) processed as background jobs without HTTP timeout
- [ ] Audit log entry created for every export event
- [ ] PII masking applied for non-Finance/non-Owner roles
- [ ] Rate limiting enforced per endpoint per user

---

## KPI Ownership & Accountability Map

> @Cassie — DeepSeek V3 (FREE)

### KPI Registry

| KPI                        | Definition                                   | Formula                                            | Owner (AI) | Owner (Human)     | Refresh   | Target           |
| -------------------------- | -------------------------------------------- | -------------------------------------------------- | ---------- | ----------------- | --------- | ---------------- |
| Lead Conversion Rate       | % of leads that close to deal                | Closed deals / Total leads × 100                   | Clara      | Sales Manager     | Daily     | ≥ 8%             |
| Average Days to Close      | Mean days from lead creation to deal close   | Σ(close date − create date) / closed deals         | Clara      | Sales Manager     | Weekly    | ≤ 45 days        |
| Agent Activity Score       | Weighted calls + messages + viewings         | (Calls × 1) + (Messages × 0.5) + (Viewings × 3)    | Zoe        | Branch Manager    | Daily     | ≥ 50/week        |
| Occupancy Rate             | % of managed units with active tenant        | Active leases / Total managed units × 100          | Mary       | Property Manager  | Daily     | ≥ 90%            |
| Vacancy Duration (Avg)     | Mean days unit is vacant between tenants     | Σ(new lease start − prev lease end) / count        | Flux       | Property Manager  | Weekly    | ≤ 21 days        |
| Commission per Agent       | Total gross commission / Agent headcount     | Gross commission / Active agents                   | Theodora   | MD / Owner        | Monthly   | ≥ AED 50K/month  |
| Marketing CAC              | Cost per acquired client (closed)            | Total marketing spend / Closed leads               | Nova       | Marketing Manager | Monthly   | ≤ AED 4,200      |
| Pipeline Coverage          | Pipeline value vs. monthly target            | Total pipeline / Monthly revenue target            | Clara      | Sales Manager     | Weekly    | ≥ 3×             |
| NPS (Client)               | Net Promoter Score from post-close surveys   | % Promoters − % Detractors                         | Beacon     | MD                | Quarterly | ≥ 8.0            |
| RERA License Expiry (Days) | Days until each agent's RERA license expires | Expiry date − Today                                | Atlas      | HR Manager        | Daily     | Alert at 60 days |
| MRR Growth                 | Month-over-month recurring revenue growth    | (This month MRR − Last month MRR) / Last month MRR | Theodora   | Owner             | Monthly   | ≥ 5%/month       |
| Portal ROI                 | Revenue generated per AED spent on portals   | Revenue attributed / Portal spend                  | Nova       | Marketing Manager | Monthly   | ≥ 4×             |

### Dashboard Ownership Assignments

| Dashboard                 | Primary Owner (AI) | Human Reviewer     | Review Cadence |
| ------------------------- | ------------------ | ------------------ | -------------- |
| Executive Summary         | Zoe                | Owner / MD         | Daily          |
| Sales Pipeline            | Clara              | Sales Manager      | Daily          |
| Agent Performance         | Zoe + Atlas        | Branch Manager     | Weekly         |
| Marketing Analytics       | Nova               | Marketing Manager  | Weekly         |
| Financial Summary         | Theodora           | Finance / Owner    | Monthly        |
| Property Portfolio        | Mary + Flux        | Property Manager   | Daily          |
| Landlord Portal Analytics | Omar               | Property Manager   | Monthly        |
| Compliance & RERA         | Atlas              | Compliance Officer | Weekly         |

### Alert Thresholds

| Metric               | Warning (🟡) | Critical (🔴) | Action Required              |
| -------------------- | ------------ | ------------- | ---------------------------- |
| Lead response time   | > 2 hours    | > 8 hours     | Re-assign to available agent |
| Vacancy rate         | > 12%        | > 20%         | Marketing + price review     |
| Pipeline coverage    | < 4×         | < 2×          | Emergency lead generation    |
| RERA expiry          | 60 days      | 30 days       | HR initiates renewal         |
| Budget consumed      | 70%          | 90%           | Manager approval for overage |
| Agent activity score | < 40/week    | < 20/week     | Coaching plan initiated      |

### Acceptance Criteria

- [ ] All KPIs have formula, target, and owner assigned before dashboard goes live
- [ ] Alert emails sent within 2 minutes of threshold breach
- [ ] KPI definitions reviewed quarterly and approved by Owner
- [ ] Every dashboard has a "Last Updated" timestamp visible to user
- [ ] KPI ownership map exportable as PDF for management review
