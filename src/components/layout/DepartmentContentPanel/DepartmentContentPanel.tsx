/**
 * DepartmentContentPanel - Dynamic content for selected department
 * 
 * Features:
 * - Department-specific metrics and analytics
 * - Service-level drill-down content
 * - Quick action buttons
 * - Department overview cards
 * - Responsive grid layout
 * - Dark mode support
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileText, Download, Plus, Settings, TrendingUp, Users, AlertCircle,
  Clock, CheckCircle, Activity, Briefcase, BarChart3, MessageSquare,
  type LucideIcon
} from 'lucide-react';
import { selectService } from '../../../store/slices/sidebarSlice';
import { addNotification } from '../../../store/slices/notificationSlice';
import useActionHandler from '../../../hooks/useActionHandler';
import MetricsChart from '../../charts/MetricsChart';
import TrendChart from '../../charts/TrendChart';
import DistributionChart from '../../charts/DistributionChart';
import EnhancedStatCard from '../../charts/EnhancedStatCard';
import '../../charts/charts.css';
import type { RootState } from '../../../store/store';
import * as S from './styles';

// Type definitions
interface MetricItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface ActionItem {
  label: string;
  icon: LucideIcon;
}

interface ServiceStat {
  label: string;
  value: string;
}

interface ServiceContent {
  description: string;
  stats: ServiceStat[];
  actions: ActionItem[];
}

interface DepartmentContent {
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  description: string;
  metrics: MetricItem[];
  services: Record<string, ServiceContent>;
}

// Department content definitions
const DEPARTMENT_CONTENT: Record<string, DepartmentContent> = {
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
      { label: 'Data Accuracy', value: '99.8%', change: '+2%', trend: 'up' }
    ],
    services: {
      'Inventory Management': {
        description: 'Manage All Property Inventory',
        stats: [
          { label: 'Indexed Properties', value: '9,378' },
          { label: 'Active Listings', value: '4,250' },
          { label: 'Pending Review', value: '145' }
        ],
        actions: [
          { label: 'View Inventory', icon: FileText },
          { label: 'Import Data', icon: Download },
          { label: 'Add Property', icon: Plus }
        ]
      },
      'Properties': {
        description: 'Property Management & Tracking',
        stats: [
          { label: 'Total Properties', value: '9,378' },
          { label: 'Residential', value: '5,420' },
          { label: 'Commercial', value: '3,958' }
        ],
        actions: [
          { label: 'View Properties', icon: FileText },
          { label: 'Search', icon: Activity },
          { label: 'New Property', icon: Plus }
        ]
      },
      'Asset Tracking': {
        description: 'Track Assets & Equipment',
        stats: [
          { label: 'Total Assets', value: '12,450' },
          { label: 'Deployed', value: '11,200' },
          { label: 'In Maintenance', value: '1,250' }
        ],
        actions: [
          { label: 'Asset Registry', icon: FileText },
          { label: 'Maintenance Log', icon: Clock },
          { label: 'Schedule Maintenance', icon: Plus }
        ]
      },
      'Data Management': {
        description: 'Data Tools & Extraction',
        stats: [
          { label: 'Data Records', value: '145,320' },
          { label: 'Last Updated', value: 'Today' },
          { label: 'Accuracy Rate', value: '99.8%' }
        ],
        actions: [
          { label: 'Data Tools', icon: BarChart3 },
          { label: 'Export Data', icon: Download },
          { label: 'OCR Extraction', icon: FileText }
        ]
      }
    }
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
      { label: 'Budget Utilization', value: '76%', change: 'On Track', trend: 'stable' }
    ],
    services: {
      'Invoicing': {
        description: 'Invoice Management & Generation',
        stats: [
          { label: 'Total Invoices', value: '1,245' },
          { label: 'Paid', value: '1,170' },
          { label: 'Pending', value: '75' }
        ],
        actions: [
          { label: 'Create Invoice', icon: Plus },
          { label: 'View All', icon: FileText },
          { label: 'Send Reminders', icon: MessageSquare }
        ]
      },
      'Payment Tracking': {
        description: 'Track Payments & Collections',
        stats: [
          { label: 'Received This Month', value: 'AED 340K' },
          { label: 'Pending Payments', value: 'AED 95K' },
          { label: 'Average Collection Days', value: '7 days' }
        ],
        actions: [
          { label: 'Payment Log', icon: FileText },
          { label: 'Send Invoice', icon: MessageSquare },
          { label: 'Record Payment', icon: Plus }
        ]
      },
      'Financial Reports': {
        description: 'Generate & View Financial Reports',
        stats: [
          { label: 'Profit Margin', value: '32%' },
          { label: 'Revenue This Month', value: 'AED 890K' },
          { label: 'Expenses', value: 'AED 605K' }
        ],
        actions: [
          { label: 'View Reports', icon: BarChart3 },
          { label: 'Export P&L', icon: Download },
          { label: 'Schedule Report', icon: Clock }
        ]
      },
      'Budget Analysis': {
        description: 'Budget Planning & Analysis',
        stats: [
          { label: 'Total Budget', value: 'AED 2M' },
          { label: 'Spent', value: 'AED 1.52M' },
          { label: 'Remaining', value: 'AED 480K' }
        ],
        actions: [
          { label: 'View Budget', icon: BarChart3 },
          { label: 'Create Budget', icon: Plus },
          { label: 'Budget vs Actual', icon: TrendingUp }
        ]
      }
    }
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
      { label: 'Sales Pipeline', value: 'AED 18.5M', change: '+22%', trend: 'up' }
    ],
    services: {
      'Lead Management': {
        description: 'Track & Manage Leads',
        stats: [
          { label: 'Total Leads', value: '342' },
          { label: 'Qualified', value: '145' },
          { label: 'In Conversation', value: '89' }
        ],
        actions: [
          { label: 'Add Lead', icon: Plus },
          { label: 'View All Leads', icon: Users },
          { label: 'Lead Analytics', icon: BarChart3 }
        ]
      },
      'Negotiations': {
        description: 'Manage Deal Negotiations',
        stats: [
          { label: 'Active Negotiations', value: '34' },
          { label: 'At Final Stage', value: '8' },
          { label: 'Avg Negotiation Time', value: '14 days' }
        ],
        actions: [
          { label: 'View Negotiations', icon: Briefcase },
          { label: 'Add Negotiation', icon: Plus },
          { label: 'Task List', icon: FileText }
        ]
      },
      'Deal Tracking': {
        description: 'Track Deals & Closures',
        stats: [
          { label: 'Deals This Month', value: '12' },
          { label: 'Value Closed', value: 'AED 4.2M' },
          { label: 'Pending Closure', value: '8' }
        ],
        actions: [
          { label: 'Deal Pipeline', icon: TrendingUp },
          { label: 'New Deal', icon: Plus },
          { label: 'Win/Loss Analysis', icon: BarChart3 }
        ]
      },
      'Commission Tracking': {
        description: 'Track Commissions & Payouts',
        stats: [
          { label: 'Total Commission', value: 'AED 620K' },
          { label: 'Pending Payout', value: 'AED 145K' },
          { label: 'This Month', value: 'AED 89K' }
        ],
        actions: [
          { label: 'Commission Log', icon: FileText },
          { label: 'Calculate Commission', icon: BarChart3 },
          { label: 'Payout Report', icon: Download }
        ]
      }
    }
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
      { label: 'Lead Generation', value: '342/mo', change: '+24%', trend: 'up' }
    ],
    services: {
      'Campaigns': {
        description: 'Create & Manage Campaigns',
        stats: [
          { label: 'Active Campaigns', value: '12' },
          { label: 'Completed', value: '56' },
          { label: 'Avg ROI', value: '4.2x' }
        ],
        actions: [
          { label: 'Create Campaign', icon: Plus },
          { label: 'View Campaigns', icon: BarChart3 },
          { label: 'Campaign Analytics', icon: TrendingUp }
        ]
      },
      'Content': {
        description: 'Content Management',
        stats: [
          { label: 'Published Posts', value: '234' },
          { label: 'Total Views', value: '125.4K' },
          { label: 'Avg Engagement', value: '8.3%' }
        ],
        actions: [
          { label: 'Create Content', icon: Plus },
          { label: 'Content Library', icon: FileText },
          { label: 'Performance', icon: BarChart3 }
        ]
      },
      'Analytics': {
        description: 'Marketing Analytics & Reporting',
        stats: [
          { label: 'Website Visits', value: '23.4K' },
          { label: 'Conversion Rate', value: '3.2%' },
          { label: 'Customer Acquisition Cost', value: 'AED 245' }
        ],
        actions: [
          { label: 'View Analytics', icon: BarChart3 },
          { label: 'Custom Report', icon: Download },
          { label: 'Trends Analysis', icon: TrendingUp }
        ]
      },
      'Lead Generation': {
        description: 'Lead Generation Tools',
        stats: [
          { label: 'Leads This Month', value: '342' },
          { label: 'Lead Quality Score', value: '7.8/10' },
          { label: 'Conversion Rate', value: '18%' }
        ],
        actions: [
          { label: 'Lead Dashboard', icon: Users },
          { label: 'Create Form', icon: Plus },
          { label: 'Lead Scoring', icon: TrendingUp }
        ]
      }
    }
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
      { label: 'Customer Sat.', value: '9.2/10', change: '+0.8', trend: 'up' }
    ],
    services: {
      'Messages': {
        description: 'Internal & External Messages',
        stats: [
          { label: 'Unread', value: '34' },
          { label: 'Today', value: '847' },
          { label: 'Response Rate', value: '96%' }
        ],
        actions: [
          { label: 'View Messages', icon: MessageSquare },
          { label: 'New Message', icon: Plus },
          { label: 'Message Templates', icon: FileText }
        ]
      },
      'Emails': {
        description: 'Email Management',
        stats: [
          { label: 'Sent Today', value: '245' },
          { label: 'Open Rate', value: '42%' },
          { label: 'Click Rate', value: '8.3%' }
        ],
        actions: [
          { label: 'View Emails', icon: FileText },
          { label: 'Send Email', icon: Plus },
          { label: 'Email Analytics', icon: BarChart3 }
        ]
      },
      'Templates': {
        description: 'Message & Email Templates',
        stats: [
          { label: 'Email Templates', value: '32' },
          { label: 'Message Templates', value: '18' },
          { label: 'Most Used', value: 'Welcome Series' }
        ],
        actions: [
          { label: 'View Templates', icon: FileText },
          { label: 'Create Template', icon: Plus },
          { label: 'Template Analytics', icon: BarChart3 }
        ]
      },
      'Notifications': {
        description: 'Notification Management',
        stats: [
          { label: 'Sent Today', value: '1,203' },
          { label: 'Delivery Rate', value: '99.3%' },
          { label: 'Open Rate', value: '76%' }
        ],
        actions: [
          { label: 'Send Notification', icon: Plus },
          { label: 'Notification Log', icon: FileText },
          { label: 'Notification Analytics', icon: BarChart3 }
        ]
      }
    }
  },
  executive: {
    name: 'Executive',
    icon: 'Globe',
    color: '#DC2626',
    bgGradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
    description: 'Strategic oversight, KPIs, executive reports, and board insights',
    metrics: [
      { label: 'Revenue YTD', value: 'AED 24.8M', change: '+32%', trend: 'up' },
      { label: 'Growth Rate', value: '18.5%', change: '+4.2%', trend: 'up' },
      { label: 'Market Share', value: '12.3%', change: '+2.1%', trend: 'up' },
      { label: 'Profitability', value: '28%', change: '+5%', trend: 'up' }
    ],
    services: {
      'Strategic Overview': {
        description: 'Company Vision & Strategy',
        stats: [
          { label: 'Fiscal Year Goals', value: '8/10' },
          { label: 'Strategic Initiatives', value: '12 Active' },
          { label: 'Executive KPIs', value: '42 Tracked' }
        ],
        actions: [
          { label: 'Strategic Dashboard', icon: BarChart3 },
          { label: 'Board Summary', icon: FileText },
          { label: 'Strategic Plan', icon: Briefcase }
        ]
      },
      'KPIs': {
        description: 'Key Performance Indicators',
        stats: [
          { label: 'Total KPIs', value: '42' },
          { label: 'On Target', value: '38' },
          { label: 'At Risk', value: '4' }
        ],
        actions: [
          { label: 'View KPIs', icon: BarChart3 },
          { label: 'KPI Trends', icon: TrendingUp },
          { label: 'Create KPI', icon: Plus }
        ]
      },
      'Reports': {
        description: 'Executive Reports & Dashboards',
        stats: [
          { label: 'Monthly Reports', value: '24' },
          { label: 'Board Reports', value: '8' },
          { label: 'Quarterly Reviews', value: '6' }
        ],
        actions: [
          { label: 'View Reports', icon: BarChart3 },
          { label: 'Generate Report', icon: Plus },
          { label: 'Export Reports', icon: Download }
        ]
      },
      'Insights': {
        description: 'Business Intelligence & Insights',
        stats: [
          { label: 'Insights Generated', value: '156' },
          { label: 'Actionable Items', value: '42' },
          { label: 'Implemented', value: '35' }
        ],
        actions: [
          { label: 'View Insights', icon: Activity },
          { label: 'AI Analysis', icon: TrendingUp },
          { label: 'Trend Reports', icon: BarChart3 }
        ]
      }
    }
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
      { label: 'Policy Updates', value: '12', change: '+3 pending', trend: 'up' }
    ],
    services: {
      'Regulations': {
        description: 'Regulatory Requirements & Standards',
        stats: [
          { label: 'Active Regulations', value: '24' },
          { label: 'Compliant', value: '23' },
          { label: 'In Review', value: '1' }
        ],
        actions: [
          { label: 'View Regulations', icon: FileText },
          { label: 'Compliance Checklist', icon: CheckCircle },
          { label: 'Status Report', icon: BarChart3 }
        ]
      },
      'Audits': {
        description: 'Audit Tracking & Management',
        stats: [
          { label: 'Annual Audits', value: '4' },
          { label: 'Completed', value: '4' },
          { label: 'Findings Resolved', value: '98%' }
        ],
        actions: [
          { label: 'View Audits', icon: FileText },
          { label: 'Schedule Audit', icon: Clock },
          { label: 'Audit Reports', icon: BarChart3 }
        ]
      },
      'Policies': {
        description: 'Company Policies & Procedures',
        stats: [
          { label: 'Total Policies', value: '34' },
          { label: 'Current Version', value: '2.1' },
          { label: 'Under Review', value: '2' }
        ],
        actions: [
          { label: 'View Policies', icon: FileText },
          { label: 'Create Policy', icon: Plus },
          { label: 'Approval Workflow', icon: CheckCircle }
        ]
      },
      'Documentation': {
        description: 'Compliance Documentation',
        stats: [
          { label: 'Documents', value: '245' },
          { label: 'Archived', value: '180' },
          { label: 'Active', value: '65' }
        ],
        actions: [
          { label: 'Document Repository', icon: FileText },
          { label: 'Upload Document', icon: Plus },
          { label: 'Search Documents', icon: Activity }
        ]
      }
    }
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
      { label: 'Deployment Cycles', value: '24/mo', change: '+6', trend: 'up' }
    ],
    services: {
      'Systems': {
        description: 'Infrastructure & System Management',
        stats: [
          { label: 'Servers Active', value: '42' },
          { label: 'Database Clusters', value: '8' },
          { label: 'API Gateways', value: '4' }
        ],
        actions: [
          { label: 'System Status', icon: Activity },
          { label: 'Monitoring Dashboard', icon: BarChart3 },
          { label: 'Performance Metrics', icon: TrendingUp }
        ]
      },
      'Integration': {
        description: 'System Integration & APIs',
        stats: [
          { label: 'Active Integrations', value: '18' },
          { label: 'API Endpoints', value: '156' },
          { label: 'Integration Health', value: '99.2%' }
        ],
        actions: [
          { label: 'API Documentation', icon: FileText },
          { label: 'Integration Manager', icon: Settings },
          { label: 'Test Integration', icon: CheckCircle }
        ]
      },
      'Support': {
        description: 'Technical Support & Ticketing',
        stats: [
          { label: 'Open Tickets', value: '8' },
          { label: 'Avg Resolution Time', value: '2.4 hours' },
          { label: 'Satisfaction Rate', value: '96%' }
        ],
        actions: [
          { label: 'Support Tickets', icon: FileText },
          { label: 'Create Ticket', icon: Plus },
          { label: 'Knowledge Base', icon: Activity }
        ]
      },
      'Development': {
        description: 'Development & Feature Releases',
        stats: [
          { label: 'Active Projects', value: '6' },
          { label: 'Completed Sprints', value: '34' },
          { label: 'Feature Pipeline', value: '28 Items' }
        ],
        actions: [
          { label: 'Project Dashboard', icon: Briefcase },
          { label: 'Sprint Board', icon: BarChart3 },
          { label: 'Release Notes', icon: FileText }
        ]
      }
    }
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
      { label: 'Compliance Status', value: '100%', change: 'All Clear', trend: 'stable' }
    ],
    services: {
      'Contracts': {
        description: 'Contract Management & Execution',
        stats: [
          { label: 'Active Contracts', value: '156' },
          { label: 'Pending Signature', value: '8' },
          { label: 'Expiring Soon', value: '12' }
        ],
        actions: [
          { label: 'View Contracts', icon: FileText },
          { label: 'New Contract', icon: Plus },
          { label: 'Contract Analysis', icon: BarChart3 }
        ]
      },
      'Agreements': {
        description: 'Service Agreements & Terms',
        stats: [
          { label: 'Master Agreements', value: '24' },
          { label: 'Service Agreements', value: '89' },
          { label: 'Updated This Year', value: '18' }
        ],
        actions: [
          { label: 'View Agreements', icon: FileText },
          { label: 'Create Agreement', icon: Plus },
          { label: 'Template Library', icon: Briefcase }
        ]
      },
      'Compliance': {
        description: 'Legal Compliance & Regulations',
        stats: [
          { label: 'Regulatory Requirements', value: '28' },
          { label: 'Compliant Items', value: '28' },
          { label: 'Last Audit', value: 'Passed' }
        ],
        actions: [
          { label: 'Compliance Dashboard', icon: BarChart3 },
          { label: 'Audit Trail', icon: Activity },
          { label: 'Regulatory Updates', icon: Plus }
        ]
      },
      'Documentation': {
        description: 'Legal Documents & Records',
        stats: [
          { label: 'Legal Documents', value: '432' },
          { label: 'Archived', value: '356' },
          { label: 'Active', value: '76' }
        ],
        actions: [
          { label: 'Document Archive', icon: FileText },
          { label: 'Upload Document', icon: Plus },
          { label: 'Legal Search', icon: Activity }
        ]
      }
    }
  }
};

const DepartmentContentPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { handleAction } = useActionHandler();
  const selectedDepartment = useSelector((state: RootState) => (state as any).sidebar?.selectedDepartment) as string | null;
  const selectedService = useSelector((state: RootState) => (state as any).sidebar?.selectedService) as string | null;

  // Get content for selected department
  const deptContent = selectedDepartment 
    ? DEPARTMENT_CONTENT[selectedDepartment] 
    : null;

  const serviceContent = deptContent && selectedService
    ? deptContent.services[selectedService]
    : null;

  // Handle service card click
  const handleServiceCardClick = (serviceName: string) => {
    if (selectedDepartment) {
      dispatch(selectService({ 
        department: selectedDepartment, 
        service: serviceName 
      }));
    }
  };

  // Handle quick action clicks with new navigation system
  const handleActionClick = (actionLabel: string) => {
    if (selectedDepartment) {
      handleAction(actionLabel, selectedDepartment, selectedService || '');
    }
  };

  if (!deptContent) {
    return (
      <S.DepartmentPanel className="empty">
        <S.EmptyState>
          <S.EmptyStateIcon as={Briefcase} size={64} />
          <S.EmptyStateHeading>Select a Department</S.EmptyStateHeading>
          <S.EmptyStateText>Choose a department from the left sidebar to view content and manage operations</S.EmptyStateText>
        </S.EmptyState>
      </S.DepartmentPanel>
    );
  }

  return (
    <S.DepartmentPanel>
      {/* Header */}
      <S.ContentHeader 
        style={{ background: deptContent.bgGradient }}
      >
        <S.HeaderContent>
          <S.HeaderTitle>{deptContent.name}</S.HeaderTitle>
          <S.HeaderDescription>{deptContent.description}</S.HeaderDescription>
        </S.HeaderContent>
      </S.ContentHeader>

      {/* Main Content */}
      <S.ContentBody>
        {/* Service-Specific Content */}
        {serviceContent ? (
          <S.ServiceContent>
            <S.ServiceHeader>
              <S.ServiceTitle>{selectedService}</S.ServiceTitle>
              <S.ServiceDescription>{serviceContent.description}</S.ServiceDescription>
            </S.ServiceHeader>

            {/* Service Stats */}
            <S.StatsGrid isServiceStats={true}>
              {serviceContent.stats.map((stat, idx) => (
                <S.StatCard key={idx}>
                  <S.StatLabel>{stat.label}</S.StatLabel>
                  <S.StatValue>{stat.value}</S.StatValue>
                </S.StatCard>
              ))}
            </S.StatsGrid>

            {/* Service Actions */}
            <S.ActionsSection>
              <S.ActionsSectionHeading>Quick Actions</S.ActionsSectionHeading>
              <S.ActionsGrid>
                {serviceContent.actions.map((action, idx) => {
                  const IconComponent = action.icon;
                  return (
                    <S.ActionButton 
                      key={idx} 
                      onClick={() => handleActionClick(action.label)}
                      title={`${action.label} - ${selectedService}`}
                    >
                      <IconComponent size={20} />
                      <span>{action.label}</span>
                    </S.ActionButton>
                  );
                })}
              </S.ActionsGrid>
            </S.ActionsSection>
          </S.ServiceContent>
        ) : (
          <>
            {/* Department Overview */}
            <S.OverviewSection>
              <S.OverviewHeading>Department Overview</S.OverviewHeading>
              <S.OverviewText>
                Select a service from the left sidebar to view detailed information and manage operations.
              </S.OverviewText>
            </S.OverviewSection>

            {/* Department Metrics */}
            <S.MetricsSection>
              <S.MetricsSectionHeading>Key Metrics</S.MetricsSectionHeading>
              <S.MetricsGrid>
                {deptContent.metrics.map((metric, idx) => (
                  <EnhancedStatCard
                    key={idx}
                    label={metric.label}
                    value={metric.value}
                    change={metric.change}
                    trend={metric.trend}
                    color={deptContent.color}
                    backgroundColor={deptContent.bgGradient}
                    sparklineData={[35, 42, 38, 51, 48, 60]}
                  />
                ))}
              </S.MetricsGrid>
            </S.MetricsSection>

            {/* Analytics Charts */}
            <S.AnalyticsSection>
              <MetricsChart 
                data={deptContent.metrics}
                title={`${deptContent.name} Metrics Overview`}
                color={deptContent.color}
                height={350}
              />
              
              <TrendChart
                data={[
                  { name: 'Week 1', value: 35, target: 40 },
                  { name: 'Week 2', value: 42, target: 40 },
                  { name: 'Week 3', value: 38, target: 40 },
                  { name: 'Week 4', value: 51, target: 40 },
                  { name: 'Week 5', value: 48, target: 40 },
                  { name: 'Week 6', value: 60, target: 40 }
                ]}
                title={`${deptContent.name} Trend Analysis`}
                color={deptContent.color}
                height={350}
              />
              
              <DistributionChart
                data={Object.entries(deptContent.services).slice(0, 5).map(([name]) => ({
                  name,
                  value: Math.floor(Math.random() * 40) + 15
                }))}
                title={`${deptContent.name} Service Distribution`}
                height={350}
              />
            </S.AnalyticsSection>

            {/* Available Services */}
            <S.ServicesSection>
              <S.ServicesSectionHeading>Available Services</S.ServicesSectionHeading>
              <S.ServicesGrid>
                {Object.entries(deptContent.services).map(([name, service], idx) => (
                  <S.ServiceCard 
                    key={idx} 
                    onClick={() => handleServiceCardClick(name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleServiceCardClick(name);
                      }
                    }}
                  >
                    <S.ServiceCardTitle>{name}</S.ServiceCardTitle>
                    <S.ServiceCardDescription>{service.description}</S.ServiceCardDescription>
                    <S.ServiceCardAction 
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleServiceCardClick(name);
                      }}
                    >
                      View Service →
                    </S.ServiceCardAction>
                  </S.ServiceCard>
                ))}
              </S.ServicesGrid>
            </S.ServicesSection>
          </>
        )}
      </S.ContentBody>
    </S.DepartmentPanel>
  );
};

export default DepartmentContentPanel;
