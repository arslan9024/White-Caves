// Sophia Sales CRM feature catalog

export interface SalesFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
}

export const SOPHIA_SALES_FEATURES: SalesFeature[] = [
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline',
    description: 'Visualize sales stages and deal progression',
    category: 'CRM',
    status: 'active'
  },
  {
    id: 'deal-tracking',
    name: 'Deal Tracking',
    description: 'Track individual deals and negotiations',
    category: 'CRM',
    status: 'active'
  },
  {
    id: 'lead-assignment',
    name: 'Lead Assignment',
    description: 'Assign leads to sales agents automatically',
    category: 'Organization',
    status: 'active'
  },
  {
    id: 'sales-forecasting',
    name: 'Sales Forecasting',
    description: 'Predict revenue and sales outcomes',
    category: 'Analytics',
    status: 'active'
  },
  {
    id: 'agent-performance',
    name: 'Agent Performance',
    description: 'Track agent KPIs and conversion rates',
    category: 'Analytics',
    status: 'active'
  },
  {
    id: 'deal-history',
    name: 'Deal History',
    description: 'Complete history of deals and interactions',
    category: 'Organization',
    status: 'active'
  },
  {
    id: 'win-loss-analysis',
    name: 'Win/Loss Analysis',
    description: 'Analyze successful and lost deals',
    category: 'Analytics',
    status: 'active'
  },
  {
    id: 'commission-tracking',
    name: 'Commission Tracking',
    description: 'Calculate and track agent commissions',
    category: 'CRM',
    status: 'active'
  }
];
