// Feature catalog for Zoe Executive CRM

export interface ExecutiveFeature {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const ZOE_EXECUTIVE_FEATURES: ExecutiveFeature[] = [
  {
    id: 'strategic_inbox',
    name: 'Strategic Inbox',
    description: 'AI-powered suggestion management system',
    category: 'core'
  },
  {
    id: 'calendar_management',
    name: 'Calendar Management',
    description: 'Executive meeting scheduling and tracking',
    category: 'productivity'
  },
  {
    id: 'task_delegation',
    name: 'Task Delegation',
    description: 'Priority task assignment and tracking',
    category: 'productivity'
  },
  {
    id: 'executive_team',
    name: 'Executive Team',
    description: 'Team member availability and status',
    category: 'collaboration'
  },
  {
    id: 'intelligence_reports',
    name: 'Intelligence Reports',
    description: 'Cross-department reporting and analytics',
    category: 'analytics'
  }
];
