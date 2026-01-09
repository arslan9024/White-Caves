export const RELEASE_HISTORY = [
  {
    version: '2.5.1',
    date: '2026-01-08',
    type: 'patch',
    status: 'current',
    title: 'AI Assistants Complete',
    description: 'All 24 AI assistants deployed with full CRM dashboards',
    changes: [
      { type: 'feature', description: 'Added remaining 8 AI assistants (Cipher, Atlas, Hunter, Kairos, Maven, Sentinel, Vesta, Juno, Evangeline)' },
      { type: 'feature', description: 'Complete CRM dashboards for all assistants' },
      { type: 'improvement', description: 'Enhanced assistant data loader with caching' },
      { type: 'fix', description: 'Fixed sidebar navigation on mobile devices' }
    ],
    metrics: { filesChanged: 48, linesAdded: 12500, linesRemoved: 850 }
  },
  {
    version: '2.5.0',
    date: '2026-01-05',
    type: 'minor',
    status: 'previous',
    title: 'Technology Team Assistants',
    description: 'Hazel, Willow, and Henry join the technology department',
    changes: [
      { type: 'feature', description: 'Hazel: Frontend component library (47+ components)' },
      { type: 'feature', description: 'Willow: Backend API management (45+ endpoints)' },
      { type: 'feature', description: 'Henry: Event bus and workflow orchestration' },
      { type: 'feature', description: 'Design token system for programmatic styling' },
      { type: 'improvement', description: 'Enhanced theme support with CSS variables' }
    ],
    metrics: { filesChanged: 35, linesAdded: 8900, linesRemoved: 420 }
  },
  {
    version: '2.4.0',
    date: '2025-12-28',
    type: 'minor',
    status: 'previous',
    title: 'Compliance & HR Assistants',
    description: 'Laila and Nancy bring compliance and HR capabilities',
    changes: [
      { type: 'feature', description: 'Laila: KYC verification and AML monitoring' },
      { type: 'feature', description: 'Nancy: Employee directory and recruitment' },
      { type: 'feature', description: 'Compliance audit trail logging' },
      { type: 'improvement', description: 'Enhanced security for sensitive data' }
    ],
    metrics: { filesChanged: 28, linesAdded: 6200, linesRemoved: 380 }
  },
  {
    version: '2.3.0',
    date: '2025-12-22',
    type: 'minor',
    status: 'previous',
    title: 'Executive Intelligence',
    description: 'Zoe and Aurora provide strategic oversight',
    changes: [
      { type: 'feature', description: 'Zoe: Executive suggestion inbox with AI pipeline' },
      { type: 'feature', description: 'Aurora: CTO dashboard with system monitoring' },
      { type: 'feature', description: 'Cross-assistant communication via Henry events' },
      { type: 'feature', description: 'Confidential vault with dual-approval access' }
    ],
    metrics: { filesChanged: 42, linesAdded: 9800, linesRemoved: 520 }
  },
  {
    version: '2.2.0',
    date: '2025-12-15',
    type: 'minor',
    status: 'previous',
    title: 'DAMAC Integration',
    description: 'Massive inventory import and data tools',
    changes: [
      { type: 'feature', description: 'Imported 9,378 DAMAC Hills 2 properties' },
      { type: 'feature', description: 'Mary: Data tools suite (S3 fetcher, OCR, web harvester)' },
      { type: 'feature', description: 'Property inventory Redux state management' },
      { type: 'improvement', description: 'Enhanced property filtering and search' }
    ],
    metrics: { filesChanged: 32, linesAdded: 245000, linesRemoved: 150 }
  },
  {
    version: '2.1.0',
    date: '2025-12-10',
    type: 'minor',
    status: 'previous',
    title: 'Operations Team',
    description: 'Daisy, Theodora, and Olivia expand operations',
    changes: [
      { type: 'feature', description: 'Daisy: Leasing management with Ejari integration' },
      { type: 'feature', description: 'Theodora: Finance and payment tracking' },
      { type: 'feature', description: 'Olivia: Marketing automation and portal publishing' },
      { type: 'feature', description: 'Automated property sync across portals' }
    ],
    metrics: { filesChanged: 38, linesAdded: 7500, linesRemoved: 280 }
  },
  {
    version: '2.0.0',
    date: '2025-12-01',
    type: 'major',
    status: 'previous',
    title: 'AI Assistants Launch',
    description: 'First wave of AI assistants with sidebar navigation',
    changes: [
      { type: 'feature', description: 'AI Assistant architecture with Redux state' },
      { type: 'feature', description: 'Linda: WhatsApp CRM with 23+ agent management' },
      { type: 'feature', description: 'Nina: WhatsApp bot development' },
      { type: 'feature', description: 'Mary: Inventory management' },
      { type: 'feature', description: 'Clara: Lead pipeline management' },
      { type: 'feature', description: 'Sophia: Sales pipeline tracking' },
      { type: 'feature', description: 'Sidebar navigation with department grouping' }
    ],
    metrics: { filesChanged: 65, linesAdded: 15200, linesRemoved: 1200 }
  },
  {
    version: '1.5.0',
    date: '2025-11-15',
    type: 'minor',
    status: 'previous',
    title: 'WhatsApp Business',
    description: 'WhatsApp Business API integration',
    changes: [
      { type: 'feature', description: 'WhatsApp Business API integration' },
      { type: 'feature', description: 'QR code session management' },
      { type: 'feature', description: 'Message templates and quick replies' },
      { type: 'feature', description: 'Lead scoring from conversations' }
    ],
    metrics: { filesChanged: 24, linesAdded: 4800, linesRemoved: 320 }
  },
  {
    version: '1.4.0',
    date: '2025-12-01',
    type: 'minor',
    status: 'previous',
    title: 'Payment Expansion',
    description: 'Additional payment methods for UAE market',
    changes: [
      { type: 'feature', description: 'Mashreq NEOBiz bank integration' },
      { type: 'feature', description: 'Aani QR payment system' },
      { type: 'improvement', description: 'Enhanced payment tracking' }
    ],
    metrics: { filesChanged: 18, linesAdded: 2800, linesRemoved: 180 }
  },
  {
    version: '1.3.0',
    date: '2025-11-15',
    type: 'minor',
    status: 'previous',
    title: 'Document Management',
    description: 'Google Drive integration for contracts',
    changes: [
      { type: 'feature', description: 'Google Drive API integration' },
      { type: 'feature', description: 'Tenancy contract storage' },
      { type: 'feature', description: 'Interactive Dubai SVG map' },
      { type: 'feature', description: 'Agent performance analytics' }
    ],
    metrics: { filesChanged: 22, linesAdded: 3500, linesRemoved: 240 }
  },
  {
    version: '1.2.0',
    date: '2025-11-01',
    type: 'minor',
    status: 'previous',
    title: 'Tenancy System',
    description: 'Ejari-compliant tenancy agreements',
    changes: [
      { type: 'feature', description: 'Ejari-compliant contract generation' },
      { type: 'feature', description: 'Digital signature with React Signature Canvas' },
      { type: 'feature', description: 'Vercel Speed Insights integration' }
    ],
    metrics: { filesChanged: 28, linesAdded: 4200, linesRemoved: 350 }
  },
  {
    version: '1.1.0',
    date: '2025-10-15',
    type: 'minor',
    status: 'previous',
    title: 'Enhanced Search',
    description: 'Property comparison and saved searches',
    changes: [
      { type: 'feature', description: 'Property comparison tool' },
      { type: 'feature', description: 'Saved searches and favorites' },
      { type: 'feature', description: 'Invoice generation system' },
      { type: 'improvement', description: 'Enhanced property filters' }
    ],
    metrics: { filesChanged: 20, linesAdded: 3200, linesRemoved: 280 }
  },
  {
    version: '1.0.0',
    date: '2025-10-01',
    type: 'major',
    status: 'previous',
    title: 'Production Launch',
    description: 'Initial production release of White Caves platform',
    changes: [
      { type: 'feature', description: 'Property listings and search' },
      { type: 'feature', description: 'Firebase authentication with social login' },
      { type: 'feature', description: 'Role-based access control (24 roles)' },
      { type: 'feature', description: 'Sales and rental transaction workflows' },
      { type: 'feature', description: 'Stripe payment processing' },
      { type: 'feature', description: 'Dark/Light theme support' },
      { type: 'feature', description: 'Mobile responsive design' }
    ],
    metrics: { filesChanged: 120, linesAdded: 45000, linesRemoved: 0 }
  }
];

export const getCurrentVersion = () => RELEASE_HISTORY.find(r => r.status === 'current');
export const getMajorReleases = () => RELEASE_HISTORY.filter(r => r.type === 'major');
export const getRecentReleases = (count = 5) => RELEASE_HISTORY.slice(0, count);
export const getReleaseStats = () => ({
  totalReleases: RELEASE_HISTORY.length,
  majorReleases: RELEASE_HISTORY.filter(r => r.type === 'major').length,
  minorReleases: RELEASE_HISTORY.filter(r => r.type === 'minor').length,
  patches: RELEASE_HISTORY.filter(r => r.type === 'patch').length,
  totalLinesAdded: RELEASE_HISTORY.reduce((sum, r) => sum + r.metrics.linesAdded, 0),
  currentVersion: getCurrentVersion()?.version
});

export default { RELEASE_HISTORY, getCurrentVersion, getMajorReleases, getRecentReleases, getReleaseStats };
