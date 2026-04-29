export const PROJECT_ROADMAP = {
  phases: [
    {
      id: 'phase-1',
      name: 'Foundation',
      description: 'Core platform development and initial launch',
      status: 'completed',
      startDate: '2025-06-01',
      endDate: '2025-10-01',
      progress: 100,
      milestones: [
        { name: 'Project Setup', status: 'completed', date: '2025-06-01' },
        { name: 'Core Architecture', status: 'completed', date: '2025-06-15' },
        { name: 'Authentication System', status: 'completed', date: '2025-07-01' },
        { name: 'Property Management', status: 'completed', date: '2025-07-30' },
        { name: 'Transaction Workflows', status: 'completed', date: '2025-08-30' },
        { name: 'Payment Integration', status: 'completed', date: '2025-09-15' },
        { name: 'Production Launch v1.0', status: 'completed', date: '2025-10-01' }
      ],
      deliverables: [
        'Property listing and search',
        'User authentication (Firebase)',
        'Role-based access control',
        'Sales and rental workflows',
        'Stripe payment processing',
        'Dark/Light theme support',
        'Mobile responsive design'
      ]
    },
    {
      id: 'phase-2',
      name: 'AI Integration',
      description: 'AI assistants and automation capabilities',
      status: 'completed',
      startDate: '2025-10-01',
      endDate: '2025-12-31',
      progress: 100,
      milestones: [
        { name: 'AI Architecture Design', status: 'completed', date: '2025-10-05' },
        { name: 'First 8 AI Assistants', status: 'completed', date: '2025-10-30' },
        { name: 'WhatsApp Integration', status: 'completed', date: '2025-11-15' },
        { name: 'Lead Scoring Engine', status: 'completed', date: '2025-11-30' },
        { name: 'Next 8 AI Assistants', status: 'completed', date: '2025-12-01' },
        { name: 'DAMAC Inventory Import', status: 'completed', date: '2025-12-20' },
        { name: 'Executive Intelligence', status: 'completed', date: '2025-12-31' }
      ],
      deliverables: [
        '16 AI assistants deployed',
        'WhatsApp Business API integration',
        'AI-powered lead scoring',
        'Smart agent assignment',
        'Chatbot automation (Nina)',
        '9,378 DAMAC properties imported',
        'Executive suggestion inbox (Zoe)'
      ]
    },
    {
      id: 'phase-3',
      name: 'Enterprise Features',
      description: 'Complete AI suite and organization management',
      status: 'in_progress',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      progress: 65,
      milestones: [
        { name: 'Final 8 AI Assistants', status: 'completed', date: '2026-01-08' },
        { name: 'Organization Structure', status: 'in_progress', date: '2026-01-10' },
        { name: 'Services Registry (35)', status: 'in_progress', date: '2026-01-12' },
        { name: 'Workflow Visualizations', status: 'in_progress', date: '2026-01-15' },
        { name: 'Employee Directory', status: 'pending', date: '2026-01-18' },
        { name: 'Demo Mode', status: 'pending', date: '2026-01-25' },
        { name: 'Phase 3 Complete', status: 'pending', date: '2026-01-31' }
      ],
      deliverables: [
        'All 24 AI assistants complete',
        'Organization chart visualization',
        '35 services with flowcharts',
        'Department dashboards',
        'Employee management',
        'Interactive demo mode',
        'Olivia → HomePage loop'
      ]
    },
    {
      id: 'phase-4',
      name: 'Mobile & Expansion',
      description: 'Mobile apps and advanced integrations',
      status: 'planned',
      startDate: '2026-02-01',
      endDate: '2026-06-30',
      progress: 0,
      milestones: [
        { name: 'Mobile App Development', status: 'planned', date: '2026-02-01' },
        { name: 'UAE Pass Integration', status: 'planned', date: '2026-03-01' },
        { name: 'iOS App Launch', status: 'planned', date: '2026-03-15' },
        { name: 'Android App Launch', status: 'planned', date: '2026-04-01' },
        { name: 'AR Property Tours', status: 'planned', date: '2026-04-15' },
        { name: 'Voice Assistant', status: 'planned', date: '2026-05-15' },
        { name: 'Phase 4 Complete', status: 'planned', date: '2026-06-30' }
      ],
      deliverables: [
        'React Native mobile app',
        'UAE Pass digital ID',
        'Biometric authentication',
        'Push notifications',
        'AR property tours',
        'Voice-based search',
        'Offline capabilities'
      ]
    }
  ],
  
  currentPhase: 'phase-3',
  overallProgress: 72,
  
  upcomingMilestones: [
    { name: 'Organization Structure Complete', date: '2026-01-12', daysAway: 3 },
    { name: 'Services Registry Complete', date: '2026-01-15', daysAway: 6 },
    { name: 'Demo Mode Launch', date: '2026-01-25', daysAway: 16 }
  ],
  
  blockers: [],
  
  risks: [
    { id: 'R1', description: 'WhatsApp API rate limits', severity: 'low', mitigation: 'Implemented queuing system' },
    { id: 'R2', description: 'DAMAC inventory sync delays', severity: 'low', mitigation: 'Automated daily sync' }
  ]
};

export const getPhaseById = (id) => PROJECT_ROADMAP.phases.find(p => p.id === id);
export const getCurrentPhase = () => getPhaseById(PROJECT_ROADMAP.currentPhase);
export const getCompletedPhases = () => PROJECT_ROADMAP.phases.filter(p => p.status === 'completed');
export const getPendingMilestones = () => PROJECT_ROADMAP.phases.flatMap(p => p.milestones.filter(m => m.status !== 'completed'));

export default { PROJECT_ROADMAP, getPhaseById, getCurrentPhase, getCompletedPhases, getPendingMilestones };
