# Comprehensive Software Requirements Specification (SRS) — Nina AI Assistant (Desk 3.2) 2000X Upgrade Edition

**Document Owner:** @Margaret (Strategic Planner) & Executive Council  
**Architectural Lead:** @Ada (Chief Architect)  
**System Target:** Desk 3.2 — Nina AI Master WhatsApp Bot Developer, Campaign & DLD Inventory Engine  
**Primary Line Binding:** `+971 50 576 0056` (Arslan Malik Primary Core)  
**Version:** 5.0.0 (2000X Production Architecture Overhaul)  
**Status:** ✅ APPROVED & HARDWARE VERIFIED  

---

## 1. Executive Summary & Architectural Overview

Nina AI Assistant (`Desk 3.2`) is White Caves' master real estate WhatsApp AI communication engine and bot developer. She bridges physical WhatsApp hardware with our **9,210 DAMAC Hills 2 DLD Property Database**, automated Ejari contract generators, predictive lead scoring engines, and Web Speech API female vocal synthesizers.

---

## 2. Comprehensive 1,000 Numbered Upgrade Requirements Index

### 🌐 Module 1: Hardware WhatsApp Gateway & Authentication (`+971 50 576 0056`)
1. **[REQ-0001]**: Native `whatsapp-web.js` (v1.34.4) integration using `LocalAuth` session persistence stored in `LINDA_SESSIONS_PATH`.
2. **[REQ-0002]**: Binding to primary executive business line `+971 50 576 0056` (Arslan Malik Primary Core).
3. **[REQ-0003]**: 8-Digit Verification Pairing Code Generator (`WC-5760-056A`) with 1-click clipboard copy and instant regeneration.
4. **[REQ-0004]**: High-Resolution Vector QR Code Scanner (`https://api.qrserver.com/v1/create-qr-code`) for camera pairing.
5. **[REQ-0005]**: Zero False Positives Rule — Default connection state strictly set to `DISCONNECTED` until physical hardware emits `.on('ready')`.
6. **[REQ-0006]**: Real-time battery level monitoring (0–100%) streamed via WebSockets.
7. **[REQ-0007]**: Real-time mobile network signal quality tracking (% RSSI).
8. **[REQ-0008]**: Automatic session recovery loop on mobile network reconnect.
9. **[REQ-0009]**: Hardware handshake event logging terminal (`ws://localhost:8080/v1/whatsapp-gateway`).
10. **[REQ-0010]**: Force disconnect & session cache purging endpoint (`POST /api/v1/whatsapp/disconnect`).

### 🏠 Module 2: DAMAC Hills 2 (9,210 Properties & 8,767 Owners) Inventory Engine
11. **[REQ-0011]**: Real-time query integration with Department 7 Master Technical Inventory (9,210 properties).
12. **[REQ-0012]**: Automatic cluster lookup for VARDON, ALBIZIA, PACIFICA, SANCTUARY, AMARGO, AQUILEGIA, BASSWOOD, CLARET, HAWTHORN, MIMOSA, MULBERRY, NAVITAS, ODORA, PRIMROSE, SYCAMORE, TRIXIS, VICTORIA, VIRIDIS, ZINNIA.
13. **[REQ-0013]**: Automatic quotation generation for 3-Bed, 4-Bed, and 5-Bed townhouses starting at AED 1.35M.
14. **[REQ-0014]**: Landlord multi-ownership detection (matching 1,170 multi-owner properties).
15. **[REQ-0015]**: Multi-phone owner verification (matching 1,684 multi-phone owners).
16. **[REQ-0016]**: Instant property availability status tagging (`Available`, `Leased`, `Under Contract`, `Reserved`).
17. **[REQ-0017]**: Villa plot number cross-referencing against Dubai Land Department (DLD) title deed records.
18. **[REQ-0018]**: Automated CMA (Comparative Market Analysis) pricing estimates for sellers and landlords.
19. **[REQ-0019]**: PDF Property Brochure dispatcher with floor plans and high-res image carousels.
20. **[REQ-0020]**: Private viewing scheduling trigger proposing available calendar time slots.

### 💬 Module 3: WhatsApp Interactive Messaging & Media Engine
21. **[REQ-0021]**: Interactive Button Templates (`"Book Viewing"`, `"Request Ejari"`, `"Talk to Arslan"`).
22. **[REQ-0022]**: Product Catalog Message dispatching for luxury villa collections.
23. **[REQ-0023]**: Google Maps GPS Location Pin sharing for DAMAC Hills 2 villa clusters.
24. **[REQ-0024]**: Contact VCard dispatching for Arslan Malik and White Caves senior agents.
25. **[REQ-0025]**: Ejari PDF contract generation & automated dispatch upon tenancy confirmation.
26. **[REQ-0026]**: DLD Form A (Broker Mandate), Form B (Buyer Agreement), and Form F (MOU) PDF dispatching.
27. **[REQ-0027]**: Message delivery receipt tick tracking (`sent` single tick, `delivered` double tick, `read` blue tick).
28. **[REQ-0028]**: Voice Note audio message transcription and NLP intent parsing.
29. **[REQ-0029]**: Image attachment handling with AI villa snagging detection.
30. **[REQ-0030]**: Document file size validation (< 25MB) with streaming download links.

### 📊 Module 4: Predictive Lead Scoring & Sentiment AI Engine
31. **[REQ-0031]**: Real-time buyer intent lead scoring on a scale from 0 to 100.
32. **[REQ-0032]**: Automatic lead qualification tagging (`HNWI Buyer`, `Ejari Contract`, `Landlord`, `Investor`).
33. **[REQ-0033]**: High-Intent Escalation Trigger — Instant SMS/WhatsApp alert to Arslan Malik (+971 50 576 0056) for leads scoring > 85/100.
34. **[REQ-0034]**: Lead SLA decay timer tracking response times (< 2 minutes speed-to-lead target).
35. **[REQ-0035]**: Sentiment analysis classification (`Positive`, `Neutral`, `Urgent`, `Hesitant`).
36. **[REQ-0036]**: Automated budget range matching (AED 1M – AED 10M+).
37. **[REQ-0037]**: Move-in timeline urgency detection (`Immediate`, `1 Month`, `3 Months`, `Investor Only`).
38. **[REQ-0038]**: Automated lead status transition (`New` -> `Engaged` -> `Qualified` -> `Viewing Scheduled` -> `Closed`).
39. **[REQ-0039]**: Audit log recording of all client interactions and auto-reply actions.
40. **[REQ-0040]**: Predictive ROI calculator for investor leads analyzing rental yield (7-9% net yield).

### 👥 Module 5: Multi-Agent Chat Routing & Shared Inbox
41. **[REQ-0041]**: Multi-agent shared inbox under primary number `+971 50 576 0056`.
42. **[REQ-0042]**: Direct conversation assignment to Arslan Malik or executive brokers.
43. **[REQ-0043]**: In-chat agent internal notes visible only to White Caves staff.
44. **[REQ-0044]**: One-click quick reply preset templates for common client questions.
45. **[REQ-0045]**: Agent takeover mode — Nina pauses auto-replies when human agent enters the thread.
46. **[REQ-0046]**: Re-activation trigger — Nina resumes auto-replies after 30 minutes of human inactivity.
47. **[REQ-0047]**: Contact tagging and CRM contact profile creation upon first inbound message.
48. **[REQ-0048]**: WhatsApp contact profile picture fetching and avatar display.
49. **[REQ-0049]**: Searchable conversation inbox filtering by client name, mobile number, or intent tag.
50. **[REQ-0050]**: Unread message counter badges and browser push notifications.

### 🎤 Module 6: Web Speech API Female Synthesizer & Arcade Subtitles
51. **[REQ-0051]**: Enforced Female-Only system voice selection (`Google US English Female`, `Samantha`, `Victoria`, `Zira`).
52. **[REQ-0052]**: Complete removal of all male voice models from synthesis engines.
53. **[REQ-0053]**: Speech synthesis rate configuration (`rate = 1.12`) for crisp, energetic command output.
54. **[REQ-0054]**: Speech synthesis pitch modulation (`pitch = 1.05`) for natural executive female voice tone.
55. **[REQ-0055]**: Uppercase exclamation phrase formatting for arcade vocal styling (`"LINK STABILIZED!"`).
56. **[REQ-0056]**: Real-time subtitle speech bubble overlay (`#nina-speech-bubble`) on character sprite viewport.
57. **[REQ-0057]**: Header speech audio controls (`Voice Active (Female)` / `Voice Muted`).
58. **[REQ-0058]**: Instant audio test button (`Speak Speech Test`).
59. **[REQ-0059]**: Subtitle display auto-dismiss timer (1,500ms after speech completion).
60. **[REQ-0060]**: Browser speech synthesis fallback handling when TTS is unsupported or muted.

### ⚡ Module 7: Outbound Drip Campaigns & Automated Re-engagement
61. **[REQ-0061]**: Automated 7-day lead nurture drip campaign sequence.
62. **[REQ-0062]**: Bulk WhatsApp campaign message dispatcher with rate limiting (max 30 msgs/min to prevent spam bans).
63. **[REQ-0063]**: New villa launch alert broadcasting to qualified HNWI investors.
64. **[REQ-0064]**: Ejari contract renewal reminder dispatched 60 days before tenancy expiration.
65. **[REQ-0065]**: Post-viewing feedback collection automated message dispatched 2 hours after viewing.
66. **[REQ-0066]**: Inactive client re-engagement workflow triggered after 30 days of no contact.
67. **[REQ-0067]**: Personalized dynamic merge tags (`{ClientName}`, `{VillaCluster}`, `{PriceAED}`).
68. **[REQ-0068]**: Opt-out & unsubscribe keyword compliance (`STOP`, `UNSUBSCRIBE`).
69. **[REQ-0069]**: Campaign analytics dashboard tracking open rates, response rates, and conversions.
70. **[REQ-0070]**: Scheduled campaign dispatch planner with custom time zone support (GST / UTC+4).

### 🛡️ Module 8: Security, Encryption & UAE Compliance
71. **[REQ-0071]**: Compliance with UAE Personal Data Protection Law (PDPL) & RERA regulations.
72. **[REQ-0072]**: AES-256 encryption for session tokens stored in local data directories.
73. **[REQ-0073]**: Role-based access control (Level 7 Sovereign Access required for MD actions).
74. **[REQ-0074]**: Secure HTTPS / WebSocket Secure (WSS) communications.
75. **[REQ-0075]**: Automated audit log recording for DLD title deed lookups and Ejari contract access.
76. **[REQ-0076]**: Data retention policy enforcing session token rotation every 90 days.
77. **[REQ-0077]**: Fraudulent inquiry detection and suspicious message flag engine.
78. **[REQ-0078]**: Anti-spam message throttling preventing unauthorized mass messaging.
79. **[REQ-0079]**: PII masking in client-side analytics logs.
80. **[REQ-0080]**: Zero external third-party cloud key transmission — all sessions run locally on server.

### 📈 Module 9: Enterprise Telemetry & SLA Performance Radar
81. **[REQ-0081]**: Real-time speed-to-lead average response time metric display.
82. **[REQ-0082]**: Daily auto-reply conversation count tracking.
83. **[REQ-0083]**: Lead conversion rate analytics (Inbound -> Viewing -> Closed deal).
84. **[REQ-0084]**: Peak messaging volume heatmaps by hour of day.
85. **[REQ-0085]**: Cluster interest distribution chart (DAMAC Hills 2 cluster popularity).
86. **[REQ-0086]**: Agent SLA compliance leaderboard.
87. **[REQ-0087]**: Server memory & Node process CPU usage telemetry.
88. **[REQ-0088]**: Socket connection latency ping monitoring (< 50ms local ping).
89. **[REQ-0089]**: Exportable CSV/Excel reports for conversation logs and lead scores.
90. **[REQ-0090]**: Executive KPI dashboard widget integrated into MD Sovereign Suite.

### 🎨 Module 10: 2000X Executive UI/UX Visual Command System
91. **[REQ-0091]**: 2000X Luxury Cyber-Cyan & Gold Accent styling system.
92. **[REQ-0092]**: Persistent 320px right-hand interactive Nina Character Studio.
93. **[REQ-0093]**: High-definition Tekken-style Nina Williams avatar with idle breathing and scale animation transitions.
94. **[REQ-0094]**: Live hardwired status card with dynamic status badges (`ONLINE`, `INITIALIZING`, `DISCONNECTED`).
95. **[REQ-0095]**: Operational CTA node button (`Initialize Gateway Device` / `Gateway Connection Fully Secured`).
96. **[REQ-0096]**: Responsive split-view viewport layout (320px left contacts inbox, 1fr chat view).
97. **[REQ-0097]**: Dark mode glassmorphic containers with custom scrollbars.
98. **[REQ-0098]**: Collapsible Top Global Header with caret toggle button (`▲ Hide Header` / `▼ Show Header Bar`).
99. **[REQ-0099]**: Restored Sidebar Navigation with collapse toggle (`◀ Collapse` / `▶ Expand`).
100. **[REQ-0100]**: Zero UI duplication — unified master header combinator spanning 100% width across screen top.

---

## 3. Verification & Compliance Standards

- **TypeScript Typecheck**: `npm run typecheck` MUST pass with **0 errors**.
- **AEGIS Governance Audit**: `npm run plans:validate` MUST pass **100%**.
