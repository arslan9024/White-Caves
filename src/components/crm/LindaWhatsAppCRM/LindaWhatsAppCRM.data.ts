export interface LindaSessionItem {
  id: string;
  name: string;
  phone: string;
  role: 'MASTER' | 'SECONDARY' | 'AGENT';
  status: 'connected' | 'reconnecting' | 'disconnected';
  linkState: 'LINKED' | 'NOT LINKED';
  connState: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';
  savedProfile: boolean;
  messagesSent: number;
  messagesReceived: number;
  uptime: string;
  lastActivity: string;
}

export interface LindaCampaignItem {
  id: string;
  name: string;
  cluster: string;
  status: 'active' | 'paused' | 'scheduled' | 'completed';
  sent: number;
  total: number;
  rateLimit: string;
  nextBatch: string;
}

export interface LindaFeatureBadge {
  id: string;
  code: string;
  category: string;
  title: string;
  summary: string;
  uses: number;
}

export interface LindaPlaybookBadge {
  id: string;
  title: string;
  category: string;
  summary: string;
  steps: string[];
  uses: number;
}

export interface LindaOutreachOwnerRow {
  rowNumber: number;
  name: string;
  phone: string;
  project: string;
  unitNumber: string;
  bedrooms: string;
  status: 'Existing Chat' | 'Send Today' | 'Tomorrow' | 'Later' | 'Skipped';
  scheduledDate: string;
  gorahaVerified: boolean;
  archerTier: 'HOT' | 'WARM' | 'COLD';
}

export interface LindaConversationItem {
  id: string;
  contactName: string;
  phone: string;
  cluster: string;
  unit: string;
  intent: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'URGENT';
  confidence: number;
  gorahaSaved: boolean;
  maryMatch: string;
  lastMessage: string;
  timestamp: string;
}

export interface LindaPillarItem {
  id: string;
  name: string;
  upgrades: string;
  status: string;
  highlight: string;
}

export const INITIAL_LINDA_SESSIONS: LindaSessionItem[] = [
  {
    id: 'session-master-poweragent',
    name: '[MASTER] PowerAgent (White Caves HQ)',
    phone: '+971 50 576 0056',
    role: 'MASTER',
    status: 'connected',
    linkState: 'LINKED',
    connState: 'CONNECTED',
    savedProfile: true,
    messagesSent: 184,
    messagesReceived: 241,
    uptime: '14d 06h 42m',
    lastActivity: 'Just now',
  },
  {
    id: 'session-gorahabot',
    name: 'GorahaBot (Contact Verification & Sync)',
    phone: '+971 55 363 3545',
    role: 'SECONDARY',
    status: 'connected',
    linkState: 'LINKED',
    connState: 'CONNECTED',
    savedProfile: true,
    messagesSent: 96,
    messagesReceived: 112,
    uptime: '9d 18h 15m',
    lastActivity: '2m ago',
  },
  {
    id: 'session-omar',
    name: 'Omar Siddiqui — Senior Luxury Advisor',
    phone: '+971 50 111 0001',
    role: 'AGENT',
    status: 'connected',
    linkState: 'LINKED',
    connState: 'CONNECTED',
    savedProfile: true,
    messagesSent: 62,
    messagesReceived: 79,
    uptime: '7d 04h 11m',
    lastActivity: '5m ago',
  },
  {
    id: 'session-lena',
    name: 'Lena Petrov — Waterfront Specialist',
    phone: '+971 50 111 0002',
    role: 'AGENT',
    status: 'connected',
    linkState: 'LINKED',
    connState: 'CONNECTED',
    savedProfile: true,
    messagesSent: 47,
    messagesReceived: 58,
    uptime: '3d 12h 08m',
    lastActivity: '11m ago',
  },
  {
    id: 'session-ahmed',
    name: 'Ahmed Al Mansouri — Off-Plan & Villa Desk',
    phone: '+971 50 111 0003',
    role: 'AGENT',
    status: 'reconnecting',
    linkState: 'LINKED',
    connState: 'RECONNECTING',
    savedProfile: true,
    messagesSent: 19,
    messagesReceived: 24,
    uptime: '1d 02h 30m',
    lastActivity: '38m ago',
  },
];

export const INITIAL_LINDA_CAMPAIGNS: LindaCampaignItem[] = [
  {
    id: 'camp-dh2-vardon',
    name: 'DAMAC Hills 2 — Vardon & Janusia Owner Sourcing',
    cluster: 'DAMAC Hills 2',
    status: 'active',
    sent: 142,
    total: 180,
    rateLimit: '12 msgs / hr (Humanized)',
    nextBatch: 'In 4 mins',
  },
  {
    id: 'camp-marina-penthouse',
    name: 'Dubai Marina Luxury Penthouse Investor Blast',
    cluster: 'Dubai Marina',
    status: 'active',
    sent: 64,
    total: 95,
    rateLimit: '10 msgs / hr (Humanized)',
    nextBatch: 'In 9 mins',
  },
  {
    id: 'camp-ejari-q3',
    name: 'Ejari Renewal & Rent Review Reminder — Q3',
    cluster: 'JVC & Business Bay',
    status: 'paused',
    sent: 88,
    total: 210,
    rateLimit: '15 msgs / hr',
    nextBatch: 'Paused by Admin',
  },
  {
    id: 'camp-ranches-valuation',
    name: 'Arabian Ranches 3 Villa Handover Valuation',
    cluster: 'Arabian Ranches 3',
    status: 'scheduled',
    sent: 0,
    total: 120,
    rateLimit: '12 msgs / hr',
    nextBatch: 'Tomorrow 10:00 GST',
  },
];

export const INITIAL_LINDA_FEATURES: LindaFeatureBadge[] = [
  { id: 'F1', code: '1.1', category: 'Sessions', title: 'Live Device Status Table', summary: 'Link State vs Connection State + Saved Profile', uses: 28 },
  { id: 'F2', code: '2.1', category: 'Sessions', title: '8-Digit Phone Pairing Code', summary: 'Headless phone number device linking', uses: 14 },
  { id: 'F3', code: '2.2', category: 'Sessions', title: 'QR Code Device Linking', summary: 'Terminal & visual QR code scan', uses: 19 },
  { id: 'F4', code: '1.19', category: 'Sessions', title: 'One-Step Master Restore', summary: 'Restore +971505760056 LocalAuth profile', uses: 9 },
  { id: 'F5', code: '1.16', category: 'Sessions', title: 'Session State Machine Recovery', summary: 'Auto-reconnect & browser cleanup', uses: 11 },
  { id: 'F6', code: '1.12', category: 'Sessions', title: 'GorahaBot Contact Verification', summary: 'Verify saved contact status in Goraha', uses: 32 },
  { id: 'F11', code: '8.1', category: 'Diagnostics', title: '12-Point Health Check Doctor', summary: 'Node, Chrome, Auth, Sheets, Write-back', uses: 41 },
  { id: 'F15', code: '3.1', category: 'Sheets & ETL', title: 'Organized Sheet Writer Engine', summary: '9-tab canonical Google Sheet layout', uses: 24 },
  { id: 'F19', code: '4.1', category: 'AI & NLP', title: 'Conversation Learning Engine', summary: 'Bayesian intent & entity extraction', uses: 37 },
  { id: 'F23', code: '5.1', category: 'Campaigns', title: 'Campaign Warm-Up & Spintax', summary: 'Anti-ban delay jitter + Gaussian typing', uses: 22 },
  { id: 'F27', code: '6.1', category: 'Security', title: 'RBAC & Command Guardrails', summary: 'Admin & Master whitelist enforcement', uses: 16 },
  { id: 'F30', code: '7.1', category: 'CRM Leads', title: 'Archer Lead Qualification Score', summary: '0-100 Hot/Warm/Cold real estate scoring', uses: 29 },
  { id: 'F34', code: '8.11', category: 'Conversations', title: 'WhatsApp Conversation Analyzer', summary: 'Full thread scanner & Mary opportunity tagger', uses: 34 },
  { id: 'F35', code: '9.1', category: 'Outreach', title: 'Area Owner Outreach Planner', summary: 'Daily/Monthly anti-ban budget & cluster planner', uses: 46 },
];

export const INITIAL_LINDA_PLAYBOOKS: LindaPlaybookBadge[] = [
  { id: 'P1', title: 'Morning System & Session Readiness', category: 'Daily Ops', summary: 'Verify 12/12 Doctor, Master session, and Goraha stats', steps: ['1.1', '8.1', '1.12'], uses: 19 },
  { id: 'P2', title: 'Link or Restore Master PowerAgent', category: 'Recovery', summary: 'Restore saved LocalAuth profile or pair via 8-digit code', steps: ['1.19', '2.1', '1.1'], uses: 8 },
  { id: 'P3', title: 'Area Owner Outreach Daily Batch', category: 'Outreach', summary: 'Filter cluster owners and queue safe daily new-chat batch', steps: ['9.1', '8.11', '5.1'], uses: 27 },
  { id: 'P4', title: 'Deep Conversation & Lead Extraction', category: 'AI & CRM', summary: 'Scan active WhatsApp threads and score hot seller/buyer leads', steps: ['8.11', '4.1', '7.1'], uses: 21 },
  { id: 'P5', title: 'Organized Google Sheet Master Sync', category: 'Sheets & ETL', summary: 'Validate service account, run ETL, and write Master View', steps: ['3.1', '8.1'], uses: 15 },
  { id: 'P6', title: 'Safe Reconnect & Zombie Lock Cleanup', category: 'Recovery', summary: 'Clean Chromium SingletonLock and restart disconnected bots', steps: ['1.16', '8.1'], uses: 12 },
];

export const INITIAL_OUTREACH_OWNERS: LindaOutreachOwnerRow[] = [
  { rowNumber: 2, name: 'Tariq Al Gergawi', phone: '+971504418920', project: 'DAMAC Hills 2 - Vardon', unitNumber: 'VRD-312', bedrooms: '3BR Villa', status: 'Existing Chat', scheduledDate: 'Active Thread', gorahaVerified: true, archerTier: 'HOT' },
  { rowNumber: 3, name: 'Nadia Al Rostamani', phone: '+971528831044', project: 'DAMAC Hills 2 - Vardon', unitNumber: 'VRD-108', bedrooms: '4BR TH', status: 'Send Today', scheduledDate: 'Today (Batch #1)', gorahaVerified: true, archerTier: 'HOT' },
  { rowNumber: 4, name: 'Vikram Mehta', phone: '+971559102381', project: 'DAMAC Hills 2 - Janusia', unitNumber: 'JAN-204', bedrooms: '3BR TH', status: 'Send Today', scheduledDate: 'Today (Batch #1)', gorahaVerified: true, archerTier: 'WARM' },
  { rowNumber: 5, name: 'Elena Sorokina', phone: '+971582194002', project: 'DAMAC Hills 2 - Janusia', unitNumber: 'JAN-419', bedrooms: '4BR Villa', status: 'Send Today', scheduledDate: 'Today (Batch #2)', gorahaVerified: false, archerTier: 'HOT' },
  { rowNumber: 6, name: 'Faisal Bin Sulayem', phone: '+971503391827', project: 'DAMAC Hills 2 - Symfonia', unitNumber: 'SYM-115', bedrooms: '3BR TH', status: 'Send Today', scheduledDate: 'Today (Batch #2)', gorahaVerified: true, archerTier: 'WARM' },
  { rowNumber: 7, name: 'Sanaa Al Maktoum', phone: '+971567729104', project: 'DAMAC Hills 2 - Akoya', unitNumber: 'AKO-502', bedrooms: '5BR Villa', status: 'Tomorrow', scheduledDate: 'Tomorrow 10:30 GST', gorahaVerified: true, archerTier: 'HOT' },
  { rowNumber: 8, name: 'Richard Sterling', phone: '+971509981234', project: 'Dubai Marina - Marina Gate', unitNumber: 'MG2-3401', bedrooms: '3BR Apt', status: 'Existing Chat', scheduledDate: 'Active Thread', gorahaVerified: true, archerTier: 'HOT' },
  { rowNumber: 9, name: 'Huda Kattan Family Trust', phone: '+971543219870', project: 'Arabian Ranches 3 - Sun', unitNumber: 'SUN-218', bedrooms: '4BR Villa', status: 'Tomorrow', scheduledDate: 'Tomorrow 11:15 GST', gorahaVerified: true, archerTier: 'HOT' },
];

export const INITIAL_LINDA_CONVERSATIONS: LindaConversationItem[] = [
  {
    id: 'conv-1',
    contactName: 'Tariq Al Gergawi',
    phone: '+971 50 441 8920',
    cluster: 'DAMAC Hills 2 — Vardon',
    unit: 'VRD-312 (3BR Villa)',
    intent: 'Owner Willing to Sell / List Exclusively',
    sentiment: 'POSITIVE',
    confidence: 94,
    gorahaSaved: true,
    maryMatch: 'Matched 3 cash buyers in White Caves VIP pool (AED 1.85M)',
    lastMessage: 'Yes, the tenant vacates next month. Send me the Form A listing agreement.',
    timestamp: '2 mins ago',
  },
  {
    id: 'conv-2',
    contactName: 'Richard Sterling',
    phone: '+971 50 998 1234',
    cluster: 'Dubai Marina — Marina Gate 2',
    unit: 'MG2-3401 (3BR Full Marina View)',
    intent: 'Viewing Request & Cash Offer Discussion',
    sentiment: 'URGENT',
    confidence: 91,
    gorahaSaved: true,
    maryMatch: 'Mary Inventory #MRN-3401 — Asking AED 6.4M (Vacant on Transfer)',
    lastMessage: 'Can Omar meet my advisor at Marina Gate tomorrow at 4 PM for inspection?',
    timestamp: '8 mins ago',
  },
  {
    id: 'conv-3',
    contactName: 'Nadia Al Rostamani',
    phone: '+971 52 883 1044',
    cluster: 'DAMAC Hills 2 — Vardon',
    unit: 'VRD-108 (4BR Townhouse)',
    intent: 'Rent Valuation & Ejari Renewal Inquiry',
    sentiment: 'POSITIVE',
    confidence: 87,
    gorahaSaved: true,
    maryMatch: 'Victoria Ejari Desk + Mary Comparative Rental Yield 7.8%',
    lastMessage: 'What is the current RERA rental index increase for 4BR in Vardon?',
    timestamp: '19 mins ago',
  },
];

export const LINDA_10_PILLARS: LindaPillarItem[] = [
  { id: 'Pillar I', name: 'Anti-Ban, Humanization & Traffic Shaping', upgrades: '20/20', status: 'ACTIVE', highlight: 'Gaussian typing 42 WPM, Spintax v3, Asia/Dubai budget guard' },
  { id: 'Pillar II', name: 'Multi-Session Resilience & Chromium Lifecycle', upgrades: '20/20', status: 'ACTIVE', highlight: 'Link vs Conn state separation, SingletonLock reaper, 1.19 Restore' },
  { id: 'Pillar III', name: 'Google Sheets Two-Way Sync & ETL Pipeline', upgrades: '20/20', status: 'ACTIVE', highlight: 'OrganizedSheetWriter 9-tab schema, RowValidationGate, WriteBack' },
  { id: 'Pillar IV', name: 'Conversational AI, NLP & Real Estate Brain', upgrades: '20/20', status: 'ACTIVE', highlight: 'Bilingual EN/AR intent classifier, Mary inventory match, Archer score' },
  { id: 'Pillar V', name: 'Campaigns, Drip Sequences & Broadcast Engine', upgrades: '20/20', status: 'ACTIVE', highlight: 'AreaOwnerOutreachPlanner (F35), cluster filter, pause/resume API' },
  { id: 'Pillar VI', name: 'Security, Privacy, Compliance & Governance', upgrades: '20/20', status: 'ACTIVE', highlight: 'UAE TDRA/DLD compliance, PII log redaction, RBAC whitelist' },
  { id: 'Pillar VII', name: 'Observability, Telemetry & Visual Operations', upgrades: '20/20', status: 'ACTIVE', highlight: 'Pinned 4-panel terminal, live SSE/metrics, 12-point Doctor' },
  { id: 'Pillar VIII', name: 'Data Persistence, Caching & State Management', upgrades: '20/20', status: 'ACTIVE', highlight: 'Session registry, FeatureCatalog usage tracker, Outreach ledger' },
  { id: 'Pillar IX', name: 'CRM, Webhook & Omnichannel Integrations', upgrades: '20/20', status: 'ACTIVE', highlight: 'Nina -> Linda -> Clara -> Henry event bus + Goraha verification' },
  { id: 'Pillar X', name: 'Developer Experience, Testing & DevOps', upgrades: '20/20', status: 'ACTIVE', highlight: '200/200 Upgrades verified, zero-downtime hot reload' },
];
