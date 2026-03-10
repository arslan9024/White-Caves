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
import { useSelector } from 'react-redux';
import {
  FileText, Download, Plus, Settings, TrendingUp, Users, AlertCircle,
  Clock, CheckCircle, Activity, Briefcase, BarChart3, MessageSquare
} from 'lucide-react';
import './DepartmentContentPanel.css';

// Department content definitions
const DEPARTMENT_CONTENT = {
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
  }
};

const DepartmentContentPanel = () => {
  const selectedDepartment = useSelector(state => state.sidebar?.selectedDepartment);
  const selectedService = useSelector(state => state.sidebar?.selectedService);

  // Get content for selected department
  const deptContent = selectedDepartment 
    ? DEPARTMENT_CONTENT[selectedDepartment] 
    : null;

  const serviceContent = deptContent && selectedService
    ? deptContent.services[selectedService]
    : null;

  if (!deptContent) {
    return (
      <div className="department-content-panel empty">
        <div className="empty-state">
          <Briefcase size={64} />
          <h2>Select a Department</h2>
          <p>Choose a department from the left sidebar to view content and manage operations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="department-content-panel">
      {/* Header */}
      <div 
        className="content-header" 
        style={{ background: deptContent.bgGradient }}
      >
        <div className="header-content">
          <h1>{deptContent.name}</h1>
          <p>{deptContent.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-body">
        {/* Service-Specific Content */}
        {serviceContent ? (
          <div className="service-content">
            <div className="service-header">
              <h2>{selectedService}</h2>
              <p>{serviceContent.description}</p>
            </div>

            {/* Service Stats */}
            <div className="stats-grid service-stats">
              {serviceContent.stats.map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Service Actions */}
            <div className="actions-section">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                {serviceContent.actions.map((action, idx) => {
                  const IconComponent = action.icon;
                  return (
                    <button key={idx} className="action-button">
                      <IconComponent size={20} />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Department Overview */}
            <div className="overview-section">
              <h2>Department Overview</h2>
              <p className="overview-text">
                Select a service from the left sidebar to view detailed information and manage operations.
              </p>
            </div>

            {/* Department Metrics */}
            <div className="metrics-section">
              <h2>Key Metrics</h2>
              <div className="metrics-grid">
                {deptContent.metrics.map((metric, idx) => (
                  <div key={idx} className="metric-card">
                    <div className="metric-label">{metric.label}</div>
                    <div className="metric-value">{metric.value}</div>
                    <div className={`metric-change ${metric.trend}`}>
                      {metric.trend === 'up' && <TrendingUp size={14} />}
                      {metric.trend === 'down' && <Activity size={14} style={{ transform: 'rotate(180deg)' }} />}
                      {metric.trend === 'stable' && <AlertCircle size={14} />}
                      <span>{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Services */}
            <div className="services-section">
              <h2>Available Services</h2>
              <div className="services-grid">
                {Object.entries(deptContent.services).map(([name, service], idx) => (
                  <div key={idx} className="service-card">
                    <div className="service-card-title">{name}</div>
                    <p className="service-card-description">{service.description}</p>
                    <button className="service-card-action">
                      View Service →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentContentPanel;
