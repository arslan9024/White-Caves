/**
 * Department Content Data — Static configuration for all departments
 * Extracted from DepartmentContentPanel.tsx for maintainability
 *
 * Each department defines: name, icon, color, gradient, description,
 * key metrics, and a service catalogue with stats & quick actions.
 */

import {
  FileText, Download, Plus, Settings, TrendingUp, Users, AlertCircle,
  Clock, CheckCircle, Activity, Briefcase, BarChart3, MessageSquare,
  type LucideIcon,
} from 'lucide-react';

// ── Type Definitions ────────────────────────────────────────────────────

export interface MetricItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ActionItem {
  label: string;
  icon: LucideIcon;
}

export interface ServiceStat {
  label: string;
  value: string;
}

export interface ServiceContent {
  description: string;
  stats: ServiceStat[];
  actions: ActionItem[];
}

export interface DepartmentContent {
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  description: string;
  metrics: MetricItem[];
  services: Record<string, ServiceContent>;
}

// ── Department Data ─────────────────────────────────────────────────────

export const DEPARTMENT_CONTENT: Record<string, DepartmentContent> = {
  operations: {
    name: 'Operations',
    icon: 'Building2',
    color: '#3B82F6',
    bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    description: 'Manage inventory, properties, assets, and operational data',
    metrics: [
      { label: 'Total Properties', value: '9,378', change: '+12%', trend: 'up' },
      { label: 'Assets Under Management', value: '12,450', change: '+5%', trend: 'up' },
      { label: 'Operational Health', value: '98%', change: 'Optimal', trend: 'stable' },
      { label: 'Data Accuracy', value: '99.8%', change: '+2%', trend: 'up' },
    ],
    services: {
      'Inventory Management': {
        description: 'Manage All Property Inventory',
        stats: [
          { label: 'Indexed Properties', value: '9,378' },
          { label: 'Active Listings', value: '4,250' },
          { label: 'Pending Review', value: '145' },
        ],
        actions: [
          { label: 'View Inventory', icon: FileText },
          { label: 'Import Data', icon: Download },
          { label: 'Add Property', icon: Plus },
        ],
      },
      'Properties': {
        description: 'Property Management & Tracking',
        stats: [
          { label: 'Total Properties', value: '9,378' },
          { label: 'Residential', value: '5,420' },
          { label: 'Commercial', value: '3,958' },
        ],
        actions: [
          { label: 'View Properties', icon: FileText },
          { label: 'Search', icon: Activity },
          { label: 'New Property', icon: Plus },
        ],
      },
      'Asset Tracking': {
        description: 'Track Assets & Equipment',
        stats: [
          { label: 'Total Assets', value: '12,450' },
          { label: 'Deployed', value: '11,200' },
          { label: 'In Maintenance', value: '1,250' },
        ],
        actions: [
          { label: 'Asset Registry', icon: FileText },
          { label: 'Maintenance Log', icon: Clock },
          { label: 'Schedule Maintenance', icon: Plus },
        ],
      },
      'Data Management': {
        description: 'Data Tools & Extraction',
        stats: [
          { label: 'Data Records', value: '145,320' },
          { label: 'Last Updated', value: 'Today' },
          { label: 'Accuracy Rate', value: '99.8%' },
        ],
        actions: [
          { label: 'Data Tools', icon: BarChart3 },
          { label: 'Export Data', icon: Download },
          { label: 'OCR Extraction', icon: FileText },
        ],
      },
    },
  },
  finance: {
    name: 'Finance',
    icon: 'DollarSign',
    color: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    description: 'Manage financial operations, invoicing, and accounting',
    metrics: [
      { label: 'Total Revenue', value: 'AED 2.4M', change: '+18%', trend: 'up' },
      { label: 'Outstanding Invoices', value: 'AED 340K', change: '-8%', trend: 'down' },
      { label: 'Payment Rate', value: '94%', change: '+3%', trend: 'up' },
      { label: 'Budget Utilization', value: '76%', change: 'On Track', trend: 'stable' },
    ],
    services: {
      'Invoicing': {
        description: 'Invoice Management & Generation',
        stats: [
          { label: 'Total Invoices', value: '1,245' },
          { label: 'Paid', value: '1,170' },
          { label: 'Pending', value: '75' },
        ],
        actions: [
          { label: 'Create Invoice', icon: Plus },
          { label: 'View All', icon: FileText },
          { label: 'Send Reminders', icon: MessageSquare },
        ],
      },
      'Payment Tracking': {
        description: 'Track Payments & Collections',
        stats: [
          { label: 'Received This Month', value: 'AED 340K' },
          { label: 'Pending Payments', value: 'AED 95K' },
          { label: 'Average Collection Days', value: '7 days' },
        ],
        actions: [
          { label: 'Payment Log', icon: FileText },
          { label: 'Send Invoice', icon: MessageSquare },
          { label: 'Record Payment', icon: Plus },
        ],
      },
      'Financial Reports': {
        description: 'Generate & View Financial Reports',
        stats: [
          { label: 'Profit Margin', value: '32%' },
          { label: 'Revenue This Month', value: 'AED 890K' },
          { label: 'Expenses', value: 'AED 605K' },
        ],
        actions: [
          { label: 'View Reports', icon: BarChart3 },
          { label: 'Export P&L', icon: Download },
          { label: 'Schedule Report', icon: Clock },
        ],
      },
      'Budget Analysis': {
        description: 'Budget Planning & Analysis',
        stats: [
          { label: 'Total Budget', value: 'AED 2M' },
          { label: 'Spent', value: 'AED 1.52M' },
          { label: 'Remaining', value: 'AED 480K' },
        ],
        actions: [
          { label: 'View Budget', icon: BarChart3 },
          { label: 'Create Budget', icon: Plus },
          { label: 'Budget vs Actual', icon: TrendingUp },
        ],
      },
    },
  },
  sales: {
    name: 'Sales',
    icon: 'TrendingUp',
    color: '#10B981',
    bgGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    description: 'Manage leads, negotiations, and deal tracking',
    metrics: [
      { label: 'Active Leads', value: '342', change: '+24%', trend: 'up' },
      { label: 'Conversion Rate', value: '18%', change: '+4%', trend: 'up' },
      { label: 'Deals in Progress', value: '67', change: '+12%', trend: 'up' },
      { label: 'Sales Pipeline', value: 'AED 18.5M', change: '+22%', trend: 'up' },
    ],
    services: {
      'Lead Management': {
        description: 'Track & Manage Leads',
        stats: [
          { label: 'Total Leads', value: '342' },
          { label: 'Qualified', value: '145' },
          { label: 'In Conversation', value: '89' },
        ],
        actions: [
          { label: 'Add Lead', icon: Plus },
          { label: 'View All Leads', icon: Users },
          { label: 'Lead Analytics', icon: BarChart3 },
        ],
      },
      'Negotiations': {
        description: 'Manage Deal Negotiations',
        stats: [
          { label: 'Active Negotiations', value: '34' },
          { label: 'At Final Stage', value: '8' },
          { label: 'Avg Negotiation Time', value: '14 days' },
        ],
        actions: [
          { label: 'View Negotiations', icon: Briefcase },
          { label: 'Add Negotiation', icon: Plus },
          { label: 'Task List', icon: FileText },
        ],
      },
      'Deal Tracking': {
        description: 'Track Deals & Closures',
        stats: [
          { label: 'Deals This Month', value: '12' },
          { label: 'Value Closed', value: 'AED 4.2M' },
          { label: 'Pending Closure', value: '8' },
        ],
        actions: [
          { label: 'Deal Pipeline', icon: TrendingUp },
          { label: 'New Deal', icon: Plus },
          { label: 'Win/Loss Analysis', icon: BarChart3 },
        ],
      },
      'Commission Tracking': {
        description: 'Track Commissions & Payouts',
        stats: [
          { label: 'Total Commission', value: 'AED 620K' },
          { label: 'Pending Payout', value: 'AED 145K' },
          { label: 'This Month', value: 'AED 89K' },
        ],
        actions: [
          { label: 'Commission Log', icon: FileText },
          { label: 'Calculate Commission', icon: BarChart3 },
          { label: 'Payout Report', icon: Download },
        ],
      },
    },
  },
  marketing: {
    name: 'Marketing',
    icon: 'Megaphone',
    color: '#EC4899',
    bgGradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    description: 'Manage campaigns, content, and marketing analytics',
    metrics: [
      { label: 'Active Campaigns', value: '12', change: '+3', trend: 'up' },
      { label: 'Email Subscribers', value: '45.2K', change: '+8%', trend: 'up' },
      { label: 'Social Followers', value: '87.3K', change: '+15%', trend: 'up' },
      { label: 'Lead Generation', value: '342/mo', change: '+24%', trend: 'up' },
    ],
    services: {
      'Campaigns': {
        description: 'Create & Manage Campaigns',
        stats: [
          { label: 'Active Campaigns', value: '12' },
          { label: 'Completed', value: '56' },
          { label: 'Avg ROI', value: '4.2x' },
        ],
        actions: [
          { label: 'Create Campaign', icon: Plus },
          { label: 'View Campaigns', icon: BarChart3 },
          { label: 'Campaign Analytics', icon: TrendingUp },
        ],
      },
      'Content': {
        description: 'Content Management',
        stats: [
          { label: 'Published Posts', value: '234' },
          { label: 'Total Views', value: '125.4K' },
          { label: 'Avg Engagement', value: '8.3%' },
        ],
        actions: [
          { label: 'Create Content', icon: Plus },
          { label: 'Content Library', icon: FileText },
          { label: 'Performance', icon: BarChart3 },
        ],
      },
      'Analytics': {
        description: 'Marketing Analytics & Reporting',
        stats: [
          { label: 'Website Visits', value: '23.4K' },
          { label: 'Conversion Rate', value: '3.2%' },
          { label: 'Customer Acquisition Cost', value: 'AED 245' },
        ],
        actions: [
          { label: 'View Analytics', icon: BarChart3 },
          { label: 'Custom Report', icon: Download },
          { label: 'Trends Analysis', icon: TrendingUp },
        ],
      },
      'Lead Generation': {
        description: 'Lead Generation Tools',
        stats: [
          { label: 'Leads This Month', value: '342' },
          { label: 'Lead Quality Score', value: '7.8/10' },
          { label: 'Conversion Rate', value: '18%' },
        ],
        actions: [
          { label: 'Lead Dashboard', icon: Users },
          { label: 'Create Form', icon: Plus },
          { label: 'Lead Scoring', icon: TrendingUp },
        ],
      },
    },
  },
  communications: {
    name: 'Communications',
    icon: 'MessageSquare',
    color: '#8B5CF6',
    bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    description: 'Manage messages, emails, and notifications',
    metrics: [
      { label: 'Messages Today', value: '847', change: '+34%', trend: 'up' },
      { label: 'Email Sent', value: '2,340', change: '+12%', trend: 'up' },
      { label: 'Response Time', value: '2.3h', change: '-40%', trend: 'down' },
      { label: 'Customer Sat.', value: '9.2/10', change: '+0.8', trend: 'up' },
    ],
    services: {
      'Messages': {
        description: 'Internal & External Messages',
        stats: [
          { label: 'Unread', value: '34' },
          { label: 'Today', value: '847' },
          { label: 'Response Rate', value: '96%' },
        ],
        actions: [
          { label: 'View Messages', icon: MessageSquare },
          { label: 'New Message', icon: Plus },
          { label: 'Message Templates', icon: FileText },
        ],
      },
      'Emails': {
        description: 'Email Management',
        stats: [
          { label: 'Sent Today', value: '245' },
          { label: 'Open Rate', value: '42%' },
          { label: 'Click Rate', value: '8.3%' },
        ],
        actions: [
          { label: 'View Emails', icon: FileText },
          { label: 'Send Email', icon: Plus },
          { label: 'Email Analytics', icon: BarChart3 },
        ],
      },
      'Templates': {
        description: 'Message & Email Templates',
        stats: [
          { label: 'Email Templates', value: '32' },
          { label: 'Message Templates', value: '18' },
          { label: 'Most Used', value: 'Welcome Series' },
        ],
        actions: [
          { label: 'View Templates', icon: FileText },
          { label: 'Create Template', icon: Plus },
          { label: 'Template Analytics', icon: BarChart3 },
        ],
      },
      'Notifications': {
        description: 'Notification Management',
        stats: [
          { label: 'Sent Today', value: '1,203' },
          { label: 'Delivery Rate', value: '99.3%' },
          { label: 'Open Rate', value: '76%' },
        ],
        actions: [
          { label: 'Send Notification', icon: Plus },
          { label: 'Notification Log', icon: FileText },
          { label: 'Notification Analytics', icon: BarChart3 },
        ],
      },
    },
  },
  executive: {
    name: 'Executive',
    icon: 'Globe',
    color: '#D4AF37',
    bgGradient: 'linear-gradient(135deg, #D4AF37 0%, #991B1B 100%)',
    description: 'Strategic oversight, KPIs, executive reports, and board insights',
    metrics: [
      { label: 'Revenue YTD', value: 'AED 24.8M', change: '+32%', trend: 'up' },
      { label: 'Growth Rate', value: '18.5%', change: '+4.2%', trend: 'up' },
      { label: 'Market Share', value: '12.3%', change: '+2.1%', trend: 'up' },
      { label: 'Profitability', value: '28%', change: '+5%', trend: 'up' },
    ],
    services: {
      'Strategic Overview': {
        description: 'Company Vision & Strategy',
        stats: [
          { label: 'Fiscal Year Goals', value: '8/10' },
          { label: 'Strategic Initiatives', value: '12 Active' },
          { label: 'Executive KPIs', value: '42 Tracked' },
        ],
        actions: [
          { label: 'Strategic Dashboard', icon: BarChart3 },
          { label: 'Board Summary', icon: FileText },
          { label: 'Strategic Plan', icon: Briefcase },
        ],
      },
      'KPIs': {
        description: 'Key Performance Indicators',
        stats: [
          { label: 'Total KPIs', value: '42' },
          { label: 'On Target', value: '38' },
          { label: 'At Risk', value: '4' },
        ],
        actions: [
          { label: 'View KPIs', icon: BarChart3 },
          { label: 'KPI Trends', icon: TrendingUp },
          { label: 'Create KPI', icon: Plus },
        ],
      },
      'Reports': {
        description: 'Executive Reports & Dashboards',
        stats: [
          { label: 'Monthly Reports', value: '24' },
          { label: 'Board Reports', value: '8' },
          { label: 'Quarterly Reviews', value: '6' },
        ],
        actions: [
          { label: 'View Reports', icon: BarChart3 },
          { label: 'Generate Report', icon: Plus },
          { label: 'Export Reports', icon: Download },
        ],
      },
      'Insights': {
        description: 'Business Intelligence & Insights',
        stats: [
          { label: 'Insights Generated', value: '156' },
          { label: 'Actionable Items', value: '42' },
          { label: 'Implemented', value: '35' },
        ],
        actions: [
          { label: 'View Insights', icon: Activity },
          { label: 'AI Analysis', icon: TrendingUp },
          { label: 'Trend Reports', icon: BarChart3 },
        ],
      },
    },
  },
  compliance: {
    name: 'Compliance',
    icon: 'Lock',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    description: 'Regulatory compliance, audits, policies, and documentation',
    metrics: [
      { label: 'Compliance Score', value: '98.5%', change: '+1.2%', trend: 'up' },
      { label: 'Audit Status', value: 'Passed', change: 'All Clear', trend: 'stable' },
      { label: 'Open Issues', value: '3', change: '-5', trend: 'down' },
      { label: 'Policy Updates', value: '12', change: '+3 pending', trend: 'up' },
    ],
    services: {
      'Regulations': {
        description: 'Regulatory Requirements & Standards',
        stats: [
          { label: 'Active Regulations', value: '24' },
          { label: 'Compliant', value: '23' },
          { label: 'In Review', value: '1' },
        ],
        actions: [
          { label: 'View Regulations', icon: FileText },
          { label: 'Compliance Checklist', icon: CheckCircle },
          { label: 'Status Report', icon: BarChart3 },
        ],
      },
      'Audits': {
        description: 'Audit Tracking & Management',
        stats: [
          { label: 'Annual Audits', value: '4' },
          { label: 'Completed', value: '4' },
          { label: 'Findings Resolved', value: '98%' },
        ],
        actions: [
          { label: 'View Audits', icon: FileText },
          { label: 'Schedule Audit', icon: Clock },
          { label: 'Audit Reports', icon: BarChart3 },
        ],
      },
      'Policies': {
        description: 'Company Policies & Procedures',
        stats: [
          { label: 'Total Policies', value: '34' },
          { label: 'Current Version', value: '2.1' },
          { label: 'Under Review', value: '2' },
        ],
        actions: [
          { label: 'View Policies', icon: FileText },
          { label: 'Create Policy', icon: Plus },
          { label: 'Approval Workflow', icon: CheckCircle },
        ],
      },
      'Documentation': {
        description: 'Compliance Documentation',
        stats: [
          { label: 'Documents', value: '245' },
          { label: 'Archived', value: '180' },
          { label: 'Active', value: '65' },
        ],
        actions: [
          { label: 'Document Repository', icon: FileText },
          { label: 'Upload Document', icon: Plus },
          { label: 'Search Documents', icon: Activity },
        ],
      },
    },
  },
  technology: {
    name: 'Technology',
    icon: 'Code',
    color: '#06B6D4',
    bgGradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    description: 'Systems management, integration, technical support, and development',
    metrics: [
      { label: 'System Uptime', value: '99.8%', change: '+0.1%', trend: 'up' },
      { label: 'API Health', value: 'Excellent', change: 'All Services', trend: 'stable' },
      { label: 'Incident Tickets', value: '8', change: '-12', trend: 'down' },
      { label: 'Deployment Cycles', value: '24/mo', change: '+6', trend: 'up' },
    ],
    services: {
      'Systems': {
        description: 'Infrastructure & System Management',
        stats: [
          { label: 'Servers Active', value: '42' },
          { label: 'Database Clusters', value: '8' },
          { label: 'API Gateways', value: '4' },
        ],
        actions: [
          { label: 'System Status', icon: Activity },
          { label: 'Monitoring Dashboard', icon: BarChart3 },
          { label: 'Performance Metrics', icon: TrendingUp },
        ],
      },
      'Integration': {
        description: 'System Integration & APIs',
        stats: [
          { label: 'Active Integrations', value: '18' },
          { label: 'API Endpoints', value: '156' },
          { label: 'Integration Health', value: '99.2%' },
        ],
        actions: [
          { label: 'API Documentation', icon: FileText },
          { label: 'Integration Manager', icon: Settings },
          { label: 'Test Integration', icon: CheckCircle },
        ],
      },
      'Support': {
        description: 'Technical Support & Ticketing',
        stats: [
          { label: 'Open Tickets', value: '8' },
          { label: 'Avg Resolution Time', value: '2.4 hours' },
          { label: 'Satisfaction Rate', value: '96%' },
        ],
        actions: [
          { label: 'Support Tickets', icon: FileText },
          { label: 'Create Ticket', icon: Plus },
          { label: 'Knowledge Base', icon: Activity },
        ],
      },
      'Development': {
        description: 'Development & Feature Releases',
        stats: [
          { label: 'Active Projects', value: '6' },
          { label: 'Completed Sprints', value: '34' },
          { label: 'Feature Pipeline', value: '28 Items' },
        ],
        actions: [
          { label: 'Project Dashboard', icon: Briefcase },
          { label: 'Sprint Board', icon: BarChart3 },
          { label: 'Release Notes', icon: FileText },
        ],
      },
    },
  },
  legal: {
    name: 'Legal',
    icon: 'Scale',
    color: '#7C3AED',
    bgGradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    description: 'Contracts, agreements, legal compliance, and documentation',
    metrics: [
      { label: 'Active Contracts', value: '156', change: '+12', trend: 'up' },
      { label: 'Contract Value', value: 'AED 145M', change: '+22%', trend: 'up' },
      { label: 'Legal Cases', value: '2', change: '-3', trend: 'down' },
      { label: 'Compliance Status', value: '100%', change: 'All Clear', trend: 'stable' },
    ],
    services: {
      'Contracts': {
        description: 'Contract Management & Execution',
        stats: [
          { label: 'Active Contracts', value: '156' },
          { label: 'Pending Signature', value: '8' },
          { label: 'Expiring Soon', value: '12' },
        ],
        actions: [
          { label: 'View Contracts', icon: FileText },
          { label: 'New Contract', icon: Plus },
          { label: 'Contract Analysis', icon: BarChart3 },
        ],
      },
      'Agreements': {
        description: 'Service Agreements & Terms',
        stats: [
          { label: 'Master Agreements', value: '24' },
          { label: 'Service Agreements', value: '89' },
          { label: 'Updated This Year', value: '18' },
        ],
        actions: [
          { label: 'View Agreements', icon: FileText },
          { label: 'Create Agreement', icon: Plus },
          { label: 'Template Library', icon: Briefcase },
        ],
      },
      'Compliance': {
        description: 'Legal Compliance & Regulations',
        stats: [
          { label: 'Regulatory Requirements', value: '28' },
          { label: 'Compliant Items', value: '28' },
          { label: 'Last Audit', value: 'Passed' },
        ],
        actions: [
          { label: 'Compliance Dashboard', icon: BarChart3 },
          { label: 'Audit Trail', icon: Activity },
          { label: 'Regulatory Updates', icon: Plus },
        ],
      },
      'Documentation': {
        description: 'Legal Documents & Records',
        stats: [
          { label: 'Legal Documents', value: '432' },
          { label: 'Archived', value: '356' },
          { label: 'Active', value: '76' },
        ],
        actions: [
          { label: 'Document Archive', icon: FileText },
          { label: 'Upload Document', icon: Plus },
          { label: 'Legal Search', icon: Activity },
        ],
      },
    },
  },
  leasing: {
    name: 'Leasing',
    icon: 'KeySquare',
    color: '#E31E24',
    bgGradient: 'linear-gradient(135deg, #E31E24 0%, #B91C1C 100%)',
    description: 'End-to-end lease lifecycle: leads, viewings, offers, contracts, PDC, and P&L',
    metrics: [
      { label: 'Active Leases', value: '—', change: 'Live', trend: 'stable' },
      { label: 'Monthly Recurring Revenue', value: 'AED —', change: 'MRR', trend: 'stable' },
      { label: 'Pending Offers', value: '—', change: 'Awaiting decision', trend: 'stable' },
      { label: 'Leases Expiring (90d)', value: '—', change: 'Renewal pipeline', trend: 'stable' },
    ],
    services: {
      'Leasing Pipeline': {
        description: '10-Stage Leasing Kanban — Lead Acquisition → P&L',
        stats: [
          { label: 'Leads in Pipeline', value: '—' },
          { label: 'Active Stage', value: 'Stage 1–10' },
          { label: 'Conversions', value: '—' },
        ],
        actions: [
          { label: 'View Pipeline', icon: Activity },
          { label: 'New Lead', icon: Plus },
          { label: 'Pipeline Report', icon: BarChart3 },
        ],
      },
      'Active Leases': {
        description: 'All active tenancy agreements with Ejari status',
        stats: [
          { label: 'Active Leases', value: '—' },
          { label: 'Ejari Registered', value: '—' },
          { label: 'Expiring in 30 days', value: '—' },
        ],
        actions: [
          { label: 'View Leases', icon: FileText },
          { label: 'New Lease', icon: Plus },
          { label: 'Expiry Report', icon: Clock },
        ],
      },
      'Viewing Calendar': {
        description: 'Schedule and track property viewings for leasing prospects',
        stats: [
          { label: 'Scheduled Viewings', value: '—' },
          { label: 'Completed This Month', value: '—' },
          { label: 'No-Shows', value: '—' },
        ],
        actions: [
          { label: 'Book Viewing', icon: Plus },
          { label: 'View Calendar', icon: Clock },
          { label: 'Viewing Report', icon: BarChart3 },
        ],
      },
      'Offer Management': {
        description: 'Lease offers — pending, countered, accepted, rejected',
        stats: [
          { label: 'Pending Offers', value: '—' },
          { label: 'Accepted', value: '—' },
          { label: 'Countered', value: '—' },
        ],
        actions: [
          { label: 'Create Offer', icon: Plus },
          { label: 'View All Offers', icon: FileText },
          { label: 'Offer Analytics', icon: TrendingUp },
        ],
      },
      'Contract Center': {
        description: 'RERA-compliant tenancy contracts, addenda, and Ejari registration',
        stats: [
          { label: 'Contracts Generated', value: '—' },
          { label: 'Ejari Registered', value: '—' },
          { label: 'Addenda', value: '—' },
        ],
        actions: [
          { label: 'Generate Contract', icon: FileText },
          { label: 'Upload Signed PDF', icon: Download },
          { label: 'Register Ejari', icon: CheckCircle },
        ],
      },
      'PDC Tracker': {
        description: 'Post-dated cheque schedule — standard Dubai payment method',
        stats: [
          { label: 'PDC Cheques Total', value: '—' },
          { label: 'Cleared', value: '—' },
          { label: 'Bounced', value: '—' },
        ],
        actions: [
          { label: 'Add PDC Entry', icon: Plus },
          { label: 'View PDC Schedule', icon: FileText },
          { label: 'Send Reminder', icon: MessageSquare },
        ],
      },
      'Leasing P&L Report': {
        description: 'Revenue, commissions, expenses, and net profit per lease',
        stats: [
          { label: 'MRR (AED)', value: '—' },
          { label: 'Commission Earned', value: '—' },
          { label: 'Net Profit', value: '—' },
        ],
        actions: [
          { label: 'View P&L Dashboard', icon: BarChart3 },
          { label: 'Export to PDF', icon: Download },
          { label: 'Export to Excel', icon: Download },
        ],
      },
    },
  },
};
