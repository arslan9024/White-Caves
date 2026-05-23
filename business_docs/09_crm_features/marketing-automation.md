# Marketing Automation — CRM Feature Specification

> **Status:** Planned  
> **Module Owner:** Fatima (Marketing Manager AI)  
> **Last Updated:** April 2026  
> **Priority:** High  
> **API Endpoints:** `/api/marketing`, `/api/campaigns`, `/api/content`

---

## Overview

The Marketing Automation module empowers the White Caves CRM with end-to-end marketing capabilities — from campaign creation and multi-channel distribution to lead nurturing workflows and ROI tracking. The system is purpose-built for Dubai real estate marketing with support for WhatsApp, portal syndication, and multilingual content.

### Purpose

Enable marketing teams and agents to create, execute, and measure marketing campaigns across email, WhatsApp, social media, and digital advertising — with automated workflows that nurture leads from initial contact to deal readiness.

### Business Value

- **Lead Generation**: Multi-channel campaigns capture leads from diverse sources
- **Conversion Improvement**: Automated nurturing keeps leads warm until deal-ready
- **Cost Reduction**: Automation replaces manual follow-ups and repetitive tasks
- **ROI Visibility**: Campaign-level ROI tracking ensures budget optimization
- **Brand Consistency**: Templates and content management ensure professional output
- **Scalability**: Automated workflows handle thousands of leads without additional headcount
- **Market Positioning**: SEO and content tools establish authority in Dubai real estate

---

## User Stories

### Marketing Manager Perspective

- **As a** marketing manager, **I want to** create email campaigns with professional templates, **so that** I maintain brand consistency
- **As a** marketing manager, **I want to** A/B test subject lines and content, **so that** I optimize open and click rates
- **As a** marketing manager, **I want to** schedule campaigns for optimal delivery times, **so that** I maximize engagement
- **As a** marketing manager, **I want to** see campaign ROI reports, **so that** I justify marketing spend
- **As a** marketing manager, **I want to** build landing pages without developer help, **so that** I launch campaigns faster
- **As a** marketing manager, **I want to** segment contacts by behavior and preferences, **so that** I send targeted messages

### Agent Perspective

- **As an** agent, **I want to** send property alerts to matched clients via email, **so that** I share relevant listings automatically
- **As an** agent, **I want to** send WhatsApp messages using approved templates, **so that** I engage clients on their preferred channel
- **As an** agent, **I want to** share listings on social media in one click, **so that** I promote properties efficiently
- **As an** agent, **I want to** see which clients opened my emails, **so that** I prioritize follow-up calls

### Owner / Manager Perspective

- **As an** owner, **I want to** track total marketing spend and ROI, **so that** I understand cost of acquisition
- **As a** manager, **I want to** see which lead sources produce the highest conversion, **so that** I allocate budget effectively
- **As a** manager, **I want to** ensure all marketing complies with RERA advertising rules, **so that** I avoid regulatory issues

---

## Email Campaign Management

### Campaign Types

| Type | Description | Use Case |
|------|-------------|----------|
| Newsletter | Regular market updates and company news | Monthly market report |
| Property alert | New listings matching client preferences | Automated matching |
| Drip campaign | Sequenced emails over time | Lead nurturing |
| Event invitation | Open house, launch events | Off-plan launches |
| Transactional | Payment receipts, lease reminders | System-triggered |
| Re-engagement | Target inactive contacts | Win-back campaigns |

### Template System

- **Template library**: 20+ pre-designed templates for real estate
- **Drag-and-drop editor**: Visual email builder with blocks (text, image, button, property card, map)
- **Property card widget**: Auto-populated property details with photo, price, features
- **Dynamic content**: Merge fields (client name, agent name, property details)
- **Mobile preview**: Real-time preview for mobile and desktop
- **HTML editor**: Raw HTML editing for advanced users
- **Template categories**: Sales, Leasing, Newsletter, Event, Transactional
- **Brand kit integration**: Auto-apply company colors, logo, fonts

### Scheduling & Delivery

- **Send now**: Immediate delivery
- **Schedule**: Date/time picker with timezone support
- **Smart send**: AI-optimized delivery time per recipient based on open history
- **Throttling**: Rate-limited delivery to avoid spam filters (configurable)
- **Time zone awareness**: Deliver based on recipient's timezone

### A/B Testing

| Testable Element | Options | Sample Split |
|-----------------|---------|-------------|
| Subject line | Up to 5 variants | 10–50% per variant |
| Sender name | Agent name vs. company name | 50/50 |
| Content | Two content versions | 50/50 |
| Send time | Two delivery times | 50/50 |
| CTA button | Text/color variations | 50/50 |

- **Winner criteria**: Open rate, click rate, or conversion rate
- **Auto-winner**: Automatically send winning variant to remaining contacts
- **Statistical significance**: Wait for 95% confidence before declaring winner
- **Duration**: Configurable test duration (4 hours to 7 days)

### Email Analytics

| Metric | Description |
|--------|-------------|
| Delivered | Successfully delivered emails |
| Open rate | Unique opens / Delivered × 100 |
| Click rate | Unique clicks / Delivered × 100 |
| Click-to-open rate | Unique clicks / Unique opens × 100 |
| Bounce rate | Bounced / Sent × 100 (hard + soft) |
| Unsubscribe rate | Unsubscribes / Delivered × 100 |
| Conversion rate | Conversions (inquiry, viewing) / Delivered × 100 |
| Revenue attributed | Revenue from campaign-generated leads |

---

## WhatsApp Marketing

### WhatsApp Business API Integration

- **Official API**: Integration via WhatsApp Business API (not unofficial tools)
- **Template messages**: Pre-approved message templates for outbound communication
- **Rich media**: Photos, videos, PDFs, location sharing
- **Interactive messages**: Button replies, list messages, quick replies
- **Catalog sharing**: Share property listings as WhatsApp catalog items

### Template Management

| Template Type | Example | Approval |
|--------------|---------|----------|
| Property alert | "Hi {{name}}, new listing in {{area}}: {{property_title}} - AED {{price}}" | Meta-approved |
| Viewing confirmation | "Your viewing for {{property}} is confirmed on {{date}} at {{time}}" | Meta-approved |
| Payment reminder | "Reminder: Your rent of AED {{amount}} is due on {{date}}" | Meta-approved |
| Follow-up | "Hi {{name}}, following up on our conversation about {{property}}" | Meta-approved |
| Market update | "{{month}} market report for {{area}} is ready. View here: {{link}}" | Meta-approved |

### Bulk Messaging

- **Contact selection**: Filter-based audience selection from CRM
- **Personalization**: Dynamic fields populated per contact
- **Scheduling**: Schedule bulk sends for optimal times
- **Rate limiting**: Comply with WhatsApp API rate limits
- **Delivery tracking**: Sent, delivered, read status per message
- **Opt-in management**: Track and respect contact opt-in/out status

### Opt-In Management

- **Double opt-in**: Confirmation message before adding to broadcast list
- **Opt-out handling**: Automatic removal on "STOP" keyword
- **Consent tracking**: Log opt-in source, date, and method
- **Re-opt-in**: Process for contacts to re-subscribe
- **Compliance**: Aligned with UAE Telecommunications Regulatory Authority (TRA) rules

---

## Lead Nurturing Workflows

### Workflow Builder

- **Visual workflow designer**: Drag-and-drop canvas with triggers, actions, and conditions
- **Trigger types**: Form submission, lead created, status change, time-based, behavior-based
- **Action types**: Send email, send WhatsApp, assign agent, update field, create task, add tag
- **Condition types**: If/then branching, wait, split test, score check

### Pre-Built Workflow Templates

#### New Lead Nurturing (Sales)

```
Trigger: New lead created (source: website)
  │
  ├── Immediate: Send welcome email with agent profile
  │
  ├── Wait 1 hour: Send WhatsApp with top 3 matching properties
  │
  ├── Wait 1 day: AI checks engagement
  │   │
  │   ├── Opened email? → Send "Schedule a Viewing" email
  │   │
  │   └── No open? → Resend with different subject line
  │
  ├── Wait 3 days: Send market insights email for preferred area
  │
  ├── Wait 7 days: Agent task — "Call lead for status check"
  │
  ├── Wait 14 days: Check lead status
  │   │
  │   ├── Active? → Continue nurturing
  │   │
  │   └── Cold? → Move to re-engagement workflow
  │
  └── Wait 30 days: Survey email — "Still looking for property?"
```

#### Lease Renewal Nurturing

```
Trigger: Lease expiring in 90 days
  │
  ├── Day 0: Email tenant — "Your lease is expiring in 90 days"
  │
  ├── Day 7: WhatsApp — "Would you like to renew? Tap to discuss"
  │
  ├── Day 30: Email — "60 days remaining. Renewal terms available"
  │
  ├── Day 45: Agent task — "Call tenant about renewal"
  │
  ├── Day 60: Email — "30 days remaining. Act now to secure renewal"
  │
  └── Day 75: Urgent — "15 days remaining. Final renewal reminder"
```

#### Post-Deal Follow-Up (Sales)

```
Trigger: Deal closed-won
  │
  ├── Immediate: Congratulations email with next steps
  │
  ├── Day 7: "How's your new property?" check-in email
  │
  ├── Day 30: Request Google review + referral request
  │
  ├── Day 90: Market update for their area
  │
  ├── Day 180: "6-month check-in" email with area price trends
  │
  └── Day 365: Anniversary email + investment portfolio review offer
```

### Workflow Analytics

- Active contacts in each workflow
- Completion rate per workflow
- Drop-off point analysis
- Email/WhatsApp engagement within workflow
- Conversion rate (workflow entry → deal)

---

## Social Media Integration

### Supported Platforms

| Platform | Features | Posting | Analytics |
|----------|----------|---------|-----------|
| Instagram | Feed, Stories, Reels | ✅ Scheduled | ✅ Engagement |
| Facebook | Feed, Stories | ✅ Scheduled | ✅ Engagement |
| LinkedIn | Feed, Articles | ✅ Scheduled | ✅ Engagement |
| TikTok | Videos | 🔜 Planned | 🔜 Planned |
| X (Twitter) | Posts | ✅ Scheduled | ✅ Engagement |

### Post Scheduler

- **Content calendar**: Monthly view of all scheduled posts
- **Multi-platform**: Post to multiple platforms simultaneously
- **Media library**: Centralized image/video storage for reuse
- **Caption templates**: Pre-written captions for property posts
- **Hashtag suggestions**: AI-suggested hashtags for Dubai real estate
- **Optimal timing**: AI-recommended posting times per platform
- **Approval workflow**: Manager approves posts before scheduling

### One-Click Property Sharing

- **From listing page**: "Share on Social" button
- **Auto-format**: Property details formatted per platform specs
- **Image selection**: Choose from listing photos
- **UTM tracking**: Automatic UTM parameters for lead attribution
- **Short links**: Branded short URLs for tracking

### Performance Tracking

| Metric | Description |
|--------|-------------|
| Impressions | Total content views |
| Engagement rate | (Likes + Comments + Shares) / Impressions |
| Follower growth | Net new followers per period |
| Click-through rate | Link clicks / Impressions |
| Lead attribution | Leads generated from social posts |
| Top-performing content | Ranked by engagement |

---

## Landing Page Builder

### Page Types

| Type | Purpose | Template |
|------|---------|----------|
| Property showcase | Single property marketing | Photo gallery + details + contact form |
| Agent profile | Agent personal branding | Bio + listings + testimonials + contact |
| Project launch | Off-plan project marketing | Project overview + payment plans + register interest |
| Market report | Thought leadership | Report content + lead capture |
| Open house RSVP | Event registration | Event details + date/time + register form |
| Area guide | Community marketing | Area info + listings + lifestyle content |

### Builder Features

- **Drag-and-drop editor**: Visual page builder with sections and blocks
- **Responsive design**: Auto-responsive for mobile/tablet/desktop
- **Custom domains**: Publish on branded subdomains
- **SEO optimization**: Meta titles, descriptions, OG tags configurable
- **Form builder**: Custom lead capture forms with field mapping to CRM
- **Analytics**: Page views, form submissions, conversion rate
- **A/B testing**: Test different page versions
- **Integration**: Auto-create leads in CRM from form submissions

---

## SEO Tools

### On-Page SEO

- **Meta tag management**: Title, description, OG tags per page
- **Structured data**: Schema.org RealEstateListing markup
- **XML sitemap**: Auto-generated and submitted to search engines
- **Canonical URLs**: Proper canonical tags to avoid duplicate content
- **Image alt tags**: Auto-suggested alt text for property images
- **Internal linking**: Suggested links between related properties and area guides

### Technical SEO

- **Page speed optimization**: Lazy loading, image compression, code splitting
- **Mobile-first indexing**: Mobile-optimized rendering for all pages
- **Core Web Vitals**: Monitor LCP, FID, CLS metrics
- **Robots.txt management**: Configurable crawl directives
- **Redirect management**: 301/302 redirect rules for moved pages
- **SSL/HTTPS**: All pages served over HTTPS

### Content SEO

- **Keyword research integration**: Suggested keywords for property descriptions
- **Content scoring**: SEO quality score for listings and blog posts
- **Competitor keyword tracking**: Monitor ranking for target keywords
- **Local SEO**: Google Business Profile integration, area-specific landing pages
- **Multilingual SEO**: Arabic and English content with hreflang tags

---

## Content Management

### Blog / Market Reports

- **Blog editor**: Rich text editor with image embedding and formatting
- **Content templates**: Pre-structured templates for market reports, area guides, how-to guides
- **Author profiles**: Link blog posts to agent profiles
- **Categories & tags**: Organize content for discovery and SEO
- **Publishing workflow**: Draft → Review → Published → Archived
- **Scheduled publishing**: Set future publish dates
- **RSS feed**: Auto-generated feed for syndication

### Content Types

| Type | Frequency | Author | Purpose |
|------|-----------|--------|---------|
| Monthly market report | Monthly | Marketing team | Thought leadership, SEO |
| Area guide | Per community | Marketing + agent | Local expertise, lead gen |
| How-to guide | Bi-weekly | Marketing | Buyer/tenant education |
| Agent spotlight | Monthly | Marketing | Agent branding |
| Property feature | As needed | Agent | Premium listing promotion |
| Market commentary | Weekly | AI-assisted | Topical insights, SEO |

### AI Content Assistance (Fatima AI)

- **Description generator**: Auto-generate property descriptions from listing data
- **Blog post drafts**: AI-generated first drafts from topic and keywords
- **Subject line suggestions**: Multiple options for email campaigns
- **Social media captions**: Platform-optimized captions
- **Translation**: English ↔ Arabic content translation
- **Tone adjustment**: Professional, casual, luxury, investment-focused

---

## Analytics Integration

### Google Analytics 4

- **Tracking setup**: GA4 property configured for all CRM web pages
- **Event tracking**: Property views, form submissions, phone clicks, WhatsApp clicks
- **Conversion goals**: Lead capture, viewing booking, contact form
- **E-commerce tracking**: Deal value tracking for ROI calculation
- **Audience integration**: Import GA4 audiences for campaign targeting

### Facebook / Meta Pixel

- **Pixel installation**: Meta Pixel on all landing pages and property pages
- **Standard events**: ViewContent, Lead, Contact, Schedule, CompleteRegistration
- **Custom audiences**: Retargeting audiences based on page visits
- **Lookalike audiences**: Find similar prospects based on converter profiles
- **Conversion API**: Server-side event tracking for accuracy

### Additional Integrations

| Platform | Integration Type | Purpose |
|----------|-----------------|---------|
| Google Ads | Conversion tracking | PPC campaign ROI |
| LinkedIn Insight Tag | Conversion tracking | B2B campaign tracking |
| Hotjar | Heatmaps, session recording | UX optimization |
| Google Search Console | SEO performance | Organic search tracking |
| Google Tag Manager | Tag management | Centralized tracking setup |

---

## Contact Segmentation

### Segmentation Criteria

| Dimension | Filter Options |
|-----------|---------------|
| Property interest | Sale / Rent / Off-plan |
| Property type | Apartment, Villa, Townhouse, Commercial, etc. |
| Budget range | Custom ranges (e.g., AED 500K–1M) |
| Preferred location | Community / Sub-community |
| Lead source | Portal, Organic, Referral, Social, Paid |
| Lead status | New, Contacted, Qualified, Viewing, Negotiation |
| Engagement level | Hot, Warm, Cold (based on activity score) |
| Last activity | Days since last interaction |
| Nationality | Country of origin |
| Language | English, Arabic, Hindi, etc. |
| Agent assigned | Specific agent or unassigned |
| Tags | Custom tags applied to contacts |

### Dynamic Segments

- **Auto-updating**: Contacts move in/out of segments as data changes
- **Combination logic**: AND/OR conditions across multiple criteria
- **Exclusion rules**: Exclude contacts matching specific criteria
- **Size estimation**: Preview segment size before creating campaign
- **Segment overlap analysis**: See contacts appearing in multiple segments

### Segment Actions

- Send email campaign to segment
- Send WhatsApp broadcast to segment
- Assign segment to nurturing workflow
- Export segment as CSV
- Create lookalike audience from segment

---

## Marketing Budget & ROI Reporting

### Budget Management

- **Budget allocation**: Set monthly/quarterly budget per channel
- **Spend tracking**: Log actual spend per campaign and channel
- **Budget alerts**: Notifications at 50%, 80%, and 100% of budget
- **Forecast**: Projected spend based on current run rate
- **Approval workflow**: Large campaign budgets require manager approval

### ROI Dashboard

| Metric | Calculation | View |
|--------|-------------|------|
| Total marketing spend | Sum of all campaign costs | Number card |
| Cost per lead (CPL) | Total spend / Total leads generated | By channel chart |
| Cost per acquisition (CPA) | Total spend / Total deals from marketing | By channel chart |
| Marketing ROI | (Revenue attributed - Spend) / Spend × 100 | Percentage + trend |
| Customer lifetime value (CLV) | Average revenue per client over time | Number card |
| Payback period | Time to recoup marketing investment | By campaign |

### Attribution Models

| Model | Description | Best For |
|-------|-------------|----------|
| First-touch | Credit to first interaction | Brand awareness campaigns |
| Last-touch | Credit to last interaction before conversion | Direct response campaigns |
| Linear | Equal credit to all touchpoints | Balanced view |
| Time-decay | More credit to recent interactions | Long sales cycles |
| Data-driven | AI-weighted based on actual impact | Mature data (6+ months) |

---

## Acceptance Criteria

### Email Campaigns

- [ ] Campaign creation wizard guides through all steps
- [ ] Template editor renders correctly on email clients (Gmail, Outlook, Apple Mail)
- [ ] A/B test delivers to configured sample sizes
- [ ] Scheduled campaigns send at the specified time (±1 minute)
- [ ] Analytics update within 1 hour of campaign send
- [ ] Unsubscribe links function and remove contacts immediately

### WhatsApp Marketing

- [ ] Template messages are submitted to Meta for approval
- [ ] Bulk messages respect rate limits and opt-in status
- [ ] Delivery, read, and response statuses track correctly
- [ ] Opt-out keyword ("STOP") removes contact from list automatically
- [ ] Rich media (photos, PDFs) sends and displays correctly

### Lead Nurturing

- [ ] Workflow triggers fire within 5 minutes of trigger event
- [ ] Wait steps execute at the correct time (±5 minutes)
- [ ] Conditions evaluate correctly based on current contact data
- [ ] Contacts can exist in multiple workflows simultaneously
- [ ] Workflow analytics show accurate funnel metrics

### Social Media

- [ ] Posts publish to all selected platforms at scheduled time
- [ ] Media uploads meet platform-specific requirements
- [ ] UTM parameters are appended to all shared links
- [ ] Engagement metrics sync within 6 hours of posting

### Landing Pages

- [ ] Pages render correctly on mobile, tablet, and desktop
- [ ] Form submissions create leads in the CRM within 30 seconds
- [ ] Page load time under 3 seconds (LCP)
- [ ] SEO meta tags render correctly for social sharing

### Budget & ROI

- [ ] Budget alerts fire at configured thresholds
- [ ] ROI calculations match manual verification
- [ ] Attribution models produce logical credit distribution
- [ ] Reports can be exported as PDF and Excel

---

## Technical Notes

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/:id` | Campaign details |
| PUT | `/api/campaigns/:id` | Update campaign |
| POST | `/api/campaigns/:id/send` | Send/schedule campaign |
| GET | `/api/campaigns/:id/analytics` | Campaign analytics |
| POST | `/api/campaigns/:id/ab-test` | Configure A/B test |
| GET | `/api/marketing/templates` | List email templates |
| POST | `/api/marketing/templates` | Create template |
| GET | `/api/marketing/segments` | List segments |
| POST | `/api/marketing/segments` | Create segment |
| GET | `/api/marketing/segments/:id/contacts` | Segment contacts |
| GET | `/api/marketing/workflows` | List workflows |
| POST | `/api/marketing/workflows` | Create workflow |
| PUT | `/api/marketing/workflows/:id` | Update workflow |
| POST | `/api/marketing/workflows/:id/activate` | Activate workflow |
| GET | `/api/marketing/whatsapp/templates` | List WhatsApp templates |
| POST | `/api/marketing/whatsapp/broadcast` | Send bulk WhatsApp |
| GET | `/api/marketing/social/calendar` | Social media calendar |
| POST | `/api/marketing/social/post` | Schedule social post |
| GET | `/api/marketing/budget` | Budget overview |
| POST | `/api/marketing/budget/allocate` | Allocate budget |
| GET | `/api/marketing/roi` | ROI report |
| GET | `/api/content/blog` | List blog posts |
| POST | `/api/content/blog` | Create blog post |
| GET | `/api/content/pages` | List landing pages |
| POST | `/api/content/pages` | Create landing page |

### Role-Based Access

| Feature | Owner | Manager | Agent | Sales Agent | Leasing Agent |
|---------|-------|---------|-------|-------------|---------------|
| Create campaigns | ✅ | ✅ | ❌ | ❌ | ❌ |
| Send to all contacts | ✅ | ✅ | ❌ | ❌ | ❌ |
| Send to own contacts | ✅ | ✅ | ✅ | ✅ | ✅ |
| View campaign analytics | ✅ | ✅ | ✅ Own | ✅ Own | ✅ Own |
| Manage workflows | ✅ | ✅ | ❌ | ❌ | ❌ |
| Build landing pages | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage SEO | ✅ | ✅ | ❌ | ❌ | ❌ |
| Publish blog content | ✅ | ✅ | ❌ | ❌ | ❌ |
| Budget management | ✅ | ✅ | ❌ | ❌ | ❌ |
| View ROI reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| Share on social (own) | ✅ | ✅ | ✅ | ✅ | ✅ |
| WhatsApp (own contacts) | ✅ | ✅ | ✅ | ✅ | ✅ |

### AI Integration

- **Fatima (Marketing Manager)**: Campaign strategy, content generation, audience suggestions
- **Aisha (Analytics)**: Campaign performance analysis and optimization recommendations
- **Noor (Client Relations)**: Personalization suggestions based on client behavior
- **Hassan (Property Specialist)**: Property description and feature highlight generation

### RERA Advertising Compliance

- All marketing materials must include RERA broker license number
- Off-plan project advertising requires RERA project permit number
- Property prices must be accurate and match registered listing price
- "Sold" or "Rented" properties must be removed from advertising within 48 hours
- System enforces compliance checks before campaign distribution

### Integration Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Campaign    │────▶│  Queue       │────▶│  Email Provider  │
│  Service     │     │  (Bull/Redis)│     │  (SendGrid)      │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                    │
       │                    ├──────────▶ WhatsApp Business API
       │                    │
       │                    └──────────▶ Social Media APIs
       │
       ▼
┌─────────────┐
│  Analytics   │◀──── Webhook callbacks (opens, clicks, bounces)
│  Service     │
└─────────────┘
```

---

## Dependencies

- Email delivery: SendGrid or AWS SES
- WhatsApp: WhatsApp Business API (via 360dialog or official)
- Social media: Meta Graph API, LinkedIn API, X API
- SMS: Twilio or MessageBird
- Landing pages: Custom builder or integration with Webflow
- Analytics: Google Analytics 4, Meta Pixel
- Queue: Bull + Redis (campaign processing)
- Image CDN: Cloudinary or imgix (email image hosting)
- URL shortener: Branded short links service

---

## Future Enhancements

- AI-powered campaign optimization (auto-adjust audiences, timing, content)
- Predictive lead scoring integration with campaign targeting
- Video email support
- Interactive email (AMP for Email)
- Influencer marketing management
- Podcast/webinar hosting integration
- Customer data platform (CDP) integration
- Cross-channel journey mapping and visualization
- Automated competitor ad monitoring
- Voice marketing (automated calling campaigns)
