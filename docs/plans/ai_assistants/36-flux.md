# 36 — Flux · Real-Time Market Data Feed

> **ID:** `flux`  
> **Department:** Intelligence  
> **Title:** Real-Time Market Data Feed & News Monitor  
> **Color:** `#EF4444` (Red)  
> **Avatar:** ⚡  
> **Phase:** Phase 7 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Senior Agents, Intelligence Team

---

## 1. Overview

Flux is the **real-time market pulse monitor** for White Caves. While Cipher does deep historical analysis and Oracle presents it, Flux watches the market in real time — breaking news about Dubai real estate, economic policy changes, interest rate decisions, project launches, and regulatory announcements. He filters the noise and delivers only high-signal alerts that require immediate business response.

---

## 2. Core Responsibilities

1. Monitor UAE real estate news feeds in real time (RSS, Google News, WAM, Khaleej Times)
2. Monitor Dubai Land Department official communications and RERA circulars
3. Monitor Central Bank of UAE interest rate decisions
4. Classify news by relevance to White Caves business
5. Alert MD and relevant team members for high-impact news within 15 minutes
6. Provide a curated daily digest of all relevant market news

---

## 3. Capabilities

| Capability | Description |
|---|---|
| News feed monitoring | 15+ RSS feeds: DLD, RERA, WAM, Gulf News Property, Khaleej Times Business |
| Relevance filtering | AI-scored relevance to White Caves (0–100); only > 60 surfaced |
| Category tagging | Tags: Regulation, Interest Rate, New Launch, Infrastructure, Investment, Visa Policy |
| Breaking alert | Score ≥ 85 → immediate WhatsApp to MD (< 15 min from publication) |
| Business impact rating | Each article tagged: Opportunity / Risk / Neutral |
| Daily digest | 08:00 daily summary: top 5 relevant news items |
| Full archive | Searchable archive of all market news with tags |
| Competitor activity | Monitor when major agencies announce new partnerships or projects |
| Social listening | Track real estate hashtags on Twitter/X and LinkedIn (sentiment) |
| Regulatory tracker | Cumulative log of all RERA/DLD regulatory changes affecting WC operations |

---

## 4. How It Works — End to End

### Step 1 — Feed Polling
Cron every 15 minutes: `FluxService.pollFeeds()` → fetch each RSS URL → parse new items since last check → deduplicate by URL and title hash.

### Step 2 — Relevance Scoring
For each new article: `FluxService.score(article)`:
- Rule-based: mentions "DAMAC Hills 2" (+20), "Dubai real estate" (+15), "RERA" (+15), "DLD" (+15)
- GPT-4 scoring for complex articles: "Rate relevance to a Dubai real estate agency on a 0–100 scale"
- Final score = weighted average

### Step 3 — Impact Classification
If `score >= 60`: `FluxService.classify(article)`:
- "Interest rate" in title/body → `category: 'interest_rate'`, `impact: 'high'`
- "New project" → `category: 'new_launch'`, notify Atlas
- "Visa changes" → `category: 'visa_policy'`, `impact: 'high'`
- "Market correction" → `category: 'regulation'`, `impact: 'critical'`

### Step 4 — Alert Dispatch
If `score >= 85`:
- `POST /api/notifications { type: 'market_alert', severity: 'high', headline: '...', summary: '...', url: '...' }`
- Nadia sends WhatsApp to MD: "⚡ Breaking: [Headline] — [Summary]. Source: [URL]"

### Step 5 — Atlas Notification
If `category === 'new_launch'`: Flux calls `AtlasService.triggerProjectCheck(article.content)` → Atlas scrapes the mentioned project.

### Step 6 — Daily Digest
08:00 cron: `FluxService.generateDailyDigest()` → top 5 articles by score from last 24 hours → generates WhatsApp/email digest → Nadia sends to MD and senior agents.

### Step 7 — Archive and Search
All articles stored (regardless of score) in `NewsArticle` collection. `GET /api/flux/search?q=golden+visa` → full-text search across archive.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/flux/feed` | Latest market news (filtered, ranked) |
| GET | `/api/flux/alerts` | Recent breaking alerts |
| GET | `/api/flux/digest/today` | Today's news digest |
| GET | `/api/flux/search` | Full-text search of news archive |
| GET | `/api/flux/regulatory` | Regulatory change log |
| POST | `/api/flux/feeds` | Add new RSS feed source |
| GET | `/api/flux/feeds` | List monitored feeds |

---

## 6. Data Flows

- **Receives from:** RSS feeds (WAM, DLD, RERA, Gulf News, etc.), Twitter/X API, LinkedIn API
- **Sends to:** Nadia (breaking alerts), Atlas (new project signals), Cipher (regulatory/macro context), Zoe (market briefing cards)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Flux news dashboard | `src/components/owner/ai/FluxCRM/` | 🔲 Planned |
| News feed | Relevance-sorted article list | 🔲 Planned |
| Regulatory log | Chronological RERA/DLD changes | 🔲 Planned |
| Daily digest card | On CRM home page | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| FluxService | `server/services/FluxService.ts` | 🔲 Planned |
| Feed poller cron | `server/jobs/fluxPollerJob.ts` | 🔲 Planned (15-min) |
| News model | Prisma `NewsArticle` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full + feed config |
| `senior_agent` | Read news feed + digest |
| `agent` | Daily digest only |

---

## 10. Implementation Checklist

- [ ] Register `flux` in `AI_ASSISTANTS_REGISTRY`
- [ ] RSS feed parser (`rss-parser` npm package)
- [ ] 15-minute polling cron
- [ ] Rule-based relevance scoring
- [ ] GPT-4 relevance scoring for ambiguous articles
- [ ] Impact classification
- [ ] Breaking alert → Nadia WhatsApp
- [ ] Daily digest email + WhatsApp
- [ ] News archive + full-text search
- [ ] Feed management UI

---

## 11. Dependencies

- `rss-parser` npm package
- GPT-4 API (Phase 7)
- Nadia (alert delivery)
- Atlas (new project signal handoff)

---

## 12. Future Enhancements

- Social media monitoring (Twitter/X API for UAE RE sentiment)
- Competitor agency activity monitoring
- AI-generated business impact summary for each article
- Briefing podcast: AI-generated 5-minute audio market brief
