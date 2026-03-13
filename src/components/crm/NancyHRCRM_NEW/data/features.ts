// Nancy HR CRM Features Catalog

export interface NancyFeature {
  name: string;
  category: string;
  status: string;
  description: string;
  sourceFiles?: string[];
  capabilities: string[];
  nextMilestone?: string;
}

export const NANCY_FEATURES: NancyFeature[] = [
  {
    name: 'Employee Directory',
    category: 'Workforce Management',
    status: 'active',
    description: 'Comprehensive employee database with search, filtering, department grouping, and detailed profiles.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Employee profiles', 'Department filter', 'Search & sort', 'Status tracking']
  },
  {
    name: 'Job Board Management',
    category: 'Talent Acquisition',
    status: 'active',
    description: 'Create and manage job postings with requirements, salary ranges, and application tracking.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Job creation', 'Requirements list', 'Salary management', 'Status control']
  },
  {
    name: 'Applicant Tracking System',
    category: 'Talent Acquisition',
    status: 'active',
    description: 'Track job applicants through the hiring pipeline with AI-powered scoring and status management.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Pipeline stages', 'AI scoring', 'Resume storage', 'Communication tools']
  },
  {
    name: 'Attendance Monitoring',
    category: 'Workforce Management',
    status: 'active',
    description: 'Track employee attendance with monthly reports, late arrival tracking, and absence management.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Attendance tracking', 'Leave balance', 'Late tracking', 'Monthly reports']
  },
  {
    name: 'Performance Reviews',
    category: 'Performance',
    status: 'active',
    description: 'Performance evaluation system with scoring, star ratings, and metric visualization.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Score visualization', 'Star ratings', 'Metric breakdown', 'Historical data']
  },
  {
    name: 'Leave Management',
    category: 'Workforce Management',
    status: 'beta',
    description: 'Employee leave request system with balance tracking and approval workflows.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Leave requests', 'Balance tracking', 'Approval workflow', 'Calendar view'],
    nextMilestone: 'Add manager approval flow'
  },
  {
    name: 'Department Analytics',
    category: 'Analytics',
    status: 'active',
    description: 'Department-level metrics including headcount, performance averages, and turnover rates.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Headcount analysis', 'Performance metrics', 'Turnover tracking', 'Cost analysis']
  },
  {
    name: 'Onboarding Workflow',
    category: 'Talent Acquisition',
    status: 'planned',
    description: 'Automated onboarding process with document collection, training assignments, and checklist tracking.',
    capabilities: ['Document collection', 'Training modules', 'Checklist tracking', 'Mentor assignment'],
    nextMilestone: 'Design onboarding flow'
  },
  {
    name: 'Payroll Integration',
    category: 'Integrations',
    status: 'planned',
    description: 'Integration with payroll systems for salary management and compensation tracking.',
    capabilities: ['Salary sync', 'Bonus tracking', 'Tax calculations', 'Pay slip generation'],
    nextMilestone: 'Select payroll provider'
  },
  {
    name: 'Employee Self-Service',
    category: 'Workforce Management',
    status: 'planned',
    description: 'Self-service portal for employees to update info, request leave, and view payslips.',
    capabilities: ['Profile updates', 'Leave requests', 'Document access', 'Payslip viewing'],
    nextMilestone: 'Design employee portal'
  }
];
