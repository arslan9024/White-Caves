export const PROJECT_OVERVIEW = {
  name: 'White Caves Real Estate Platform',
  tagline: 'AI-Powered Luxury Real Estate in Dubai',
  version: '2.5.1',
  phase: 'Production',
  launchDate: '2025-10-01',
  lastUpdate: '2026-01-09',
  
  description: 'Comprehensive real estate platform for Dubai luxury market featuring 24 AI assistants, 9,378+ property inventory, and end-to-end transaction management.',
  
  team: {
    total: 45,
    executives: 4,
    directors: 10,
    staff: 31,
    aiAssistants: 24
  },
  
  metrics: {
    properties: 9378,
    users: 2500,
    transactions: 520,
    revenue: 'AED 425M',
    services: 35,
    departments: 10
  },
  
  techStack: {
    frontend: ['React 18', 'Redux Toolkit', 'Vite 7.3', 'React Router v6', 'Framer Motion', 'Lucide Icons', 'CSS Modules'],
    backend: ['Express.js', 'Node.js 20', 'Mongoose ODM', 'JWT Auth', 'RESTful API'],
    database: ['MongoDB Atlas', 'Firebase Auth', 'PostgreSQL (Neon)'],
    integrations: ['Stripe', 'WhatsApp Business API', 'Google Calendar', 'Google Drive', 'Google Maps', 'Vercel Speed Insights', 'GitHub API'],
    devops: ['Replit', 'Nix', 'Git', 'ESLint', 'Vitest'],
    aiFeatures: ['Intent Classification', 'Lead Scoring', 'Smart Assignment', 'Chatbot Automation', 'Market Prediction']
  },
  
  infrastructure: {
    hosting: 'Replit Deployments',
    database: 'MongoDB Atlas M10',
    cdn: 'Cloudflare',
    monitoring: 'Vercel Speed Insights',
    uptime: '99.97%',
    avgResponseTime: '85ms'
  },
  
  compliance: {
    rera: 'Certified',
    dataProtection: 'UAE PDPL Compliant',
    pci: 'PCI-DSS Level 1',
    accessibility: 'WCAG 2.1 AA'
  }
};

export const PROJECT_TIMELINE = [
  { date: '2025-06-01', milestone: 'Project Kickoff', status: 'completed' },
  { date: '2025-07-15', milestone: 'Core Platform Development', status: 'completed' },
  { date: '2025-08-30', milestone: 'Property Management Module', status: 'completed' },
  { date: '2025-09-15', milestone: 'Payment Integration (Stripe)', status: 'completed' },
  { date: '2025-10-01', milestone: 'Production Launch v1.0', status: 'completed' },
  { date: '2025-10-30', milestone: 'AI Assistants Phase 1 (8)', status: 'completed' },
  { date: '2025-11-15', milestone: 'WhatsApp Business Integration', status: 'completed' },
  { date: '2025-12-01', milestone: 'AI Assistants Phase 2 (16)', status: 'completed' },
  { date: '2025-12-20', milestone: 'DAMAC Inventory Integration', status: 'completed' },
  { date: '2026-01-05', milestone: 'AI Assistants Complete (24)', status: 'completed' },
  { date: '2026-01-10', milestone: 'Organization Dashboard', status: 'in_progress' },
  { date: '2026-02-01', milestone: 'Mobile App Launch', status: 'planned' },
  { date: '2026-03-01', milestone: 'UAE Pass Integration', status: 'planned' }
];

export default { PROJECT_OVERVIEW, PROJECT_TIMELINE };
