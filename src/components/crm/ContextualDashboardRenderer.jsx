import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectActiveCategory, 
  selectActiveSubItem,
  selectSelectedAssistantForChat,
  selectAiAssistantById
} from '../../store/slices/crmViewSlice';
import ExecutiveOverview from './views/ExecutiveOverview';
import OperationsView from './views/OperationsView';
import SalesView from './views/SalesView';
import PropertiesView from './views/PropertiesView';
import ServicesView from './views/ServicesView';
import LeasingView from './views/LeasingView';
import MarketingView from './views/MarketingView';
import FinanceView from './views/FinanceView';
import ComplianceView from './views/ComplianceView';
import AnalyticsView from './views/AnalyticsView';
import AdminView from './views/AdminView';

const VIEW_COMPONENTS = {
  executive: ExecutiveOverview,
  operations: OperationsView,
  sales: SalesView,
  properties: PropertiesView,
  services: ServicesView,
  leasing: LeasingView,
  marketing: MarketingView,
  finance: FinanceView,
  compliance: ComplianceView,
  analytics: AnalyticsView,
  admin: AdminView,
};

const SUB_ITEM_CONFIGS = {
  'md-dashboard': { title: 'MD Dashboard', description: 'Executive overview and strategic metrics' },
  'strategic-kpis': { title: 'Strategic KPIs', description: 'Key performance indicators' },
  'announcements': { title: 'Company Announcements', description: 'Internal communications' },
  'company-overview': { title: 'Company Overview', description: 'Organization structure' },
  'departments': { title: 'Departments', description: 'Manage company departments' },
  'employees': { title: 'Employees', description: 'Staff management' },
  'teams': { title: 'Teams', description: 'Team assignments' },
  'scheduling': { title: 'Scheduling', description: 'Calendar and appointments' },
  'onboarding': { title: 'Onboarding', description: 'New hire onboarding' },
  'lead-pipeline': { title: 'Lead Pipeline', description: 'Track leads through stages' },
  'client-journey': { title: 'Client Journey', description: 'Client lifecycle management' },
  'deals': { title: 'Deals', description: 'Active deals and negotiations' },
  'routing-assignments': { title: 'Lead Routing', description: 'Automatic lead assignment' },
  'contracts-sales': { title: 'Sales Contracts', description: 'Contract management' },
  'property-grid': { title: 'Property Grid', description: 'All properties overview' },
  'new-listing': { title: 'New Listing', description: 'Add new property' },
  'off-plan': { title: 'Off-Plan Properties', description: 'Off-plan developments' },
  'workflow-tracker': { title: 'Workflow Tracker', description: 'Property workflows' },
  'media-assets': { title: 'Media Assets', description: 'Property images and videos' },
  'virtual-tours': { title: 'Virtual Tours', description: 'Matterport tours' },
  'service-catalog': { title: 'Service Catalog', description: '40 services across 6 categories' },
  'service-requests': { title: 'Service Requests', description: 'Pending requests' },
  'maintenance': { title: 'Maintenance', description: 'Property maintenance' },
  'handover': { title: 'Handover Management', description: 'Property handovers' },
  'tenancy-lifecycle': { title: 'Tenancy Lifecycle', description: 'Lease management' },
  'ejari-contracts': { title: 'Ejari Contracts', description: 'Digital tenancy contracts' },
  'renewals': { title: 'Renewals', description: 'Lease renewals' },
  'tenant-portal': { title: 'Tenant Portal', description: 'Tenant communications' },
  'residents': { title: 'Residents', description: 'Resident management' },
  'campaigns': { title: 'Marketing Campaigns', description: 'Active campaigns' },
  'launch-events': { title: 'Launch Events', description: 'Property launches' },
  'content-hub': { title: 'Content Hub', description: 'Marketing materials' },
  'social-integration': { title: 'Social Media', description: 'Social channels' },
  'whatsapp-center': { title: 'WhatsApp Center', description: 'WhatsApp Business integration' },
  'email-campaigns': { title: 'Email Campaigns', description: 'Email marketing' },
  'transactions': { title: 'Transactions', description: 'Financial transactions' },
  'invoices': { title: 'Invoices', description: 'Invoice management' },
  'commissions': { title: 'Commissions', description: 'Agent commissions' },
  'revenue-reports': { title: 'Revenue Reports', description: 'Financial reports' },
  'kyc-profiles': { title: 'KYC Profiles', description: 'Know Your Customer profiles' },
  'aml-monitoring': { title: 'AML Monitoring', description: 'Anti-money laundering checks' },
  'confidential-vault': { title: 'Confidential Vault', description: 'Secure documents' },
  'verification-queue': { title: 'Verification Queue', description: 'Pending verifications' },
  'audit-log': { title: 'Audit Log', description: 'Activity tracking' },
  'market-analytics': { title: 'Market Analytics', description: 'Market trends' },
  'performance-dashboard': { title: 'Performance Dashboard', description: 'Team performance' },
  'ai-insights': { title: 'AI Insights', description: 'AI-powered analytics' },
  'custom-reports': { title: 'Custom Reports', description: 'Report builder' },
  'system-settings': { title: 'System Settings', description: 'Platform configuration' },
  'integrations': { title: 'Integrations', description: 'Third-party connections' },
  'api-docs': { title: 'API Documentation', description: 'Developer resources' },
};

const AI_ASSISTANT_CAPABILITIES = {
  zoe: ['executive', 'analytics', 'operations'],
  ella: ['sales', 'marketing'],
  liam: ['sales', 'operations'],
  sophia: ['services', 'compliance'],
  max: ['finance', 'compliance'],
  nina: ['leasing', 'services'],
  henry: ['properties', 'services'],
  olivia: ['properties', 'marketing'],
  mary: ['properties', 'analytics'],
  mason: ['properties', 'compliance'],
  marcus: ['operations', 'services'],
  leo: ['compliance', 'finance'],
  ivy: ['marketing', 'sales'],
  walter: ['marketing', 'sales'],
  grace: ['leasing', 'compliance'],
  sam: ['properties', 'marketing'],
  kevin: ['operations', 'admin'],
  phoebe: ['sales', 'marketing'],
  amber: ['leasing', 'compliance'],
  ethan: ['services', 'operations'],
  iris: ['marketing', 'analytics'],
  jack: ['admin', 'compliance'],
  luna: ['leasing', 'operations'],
  aurora: ['admin', 'operations'],
  stella: ['admin', 'operations'],
  nova: ['admin', 'operations'],
  ember: ['admin', 'operations'],
  marina: ['admin', 'operations'],
  coral: ['admin', 'analytics'],
  celeste: ['analytics', 'operations'],
};

export default function ContextualDashboardRenderer() {
  const activeCategory = useSelector(selectActiveCategory);
  const activeSubItem = useSelector(selectActiveSubItem);
  const selectedAssistantId = useSelector(selectSelectedAssistantForChat);
  const selectedAssistant = useSelector(state => 
    selectedAssistantId ? selectAiAssistantById(selectedAssistantId)(state) : null
  );

  const ViewComponent = VIEW_COMPONENTS[activeCategory] || ExecutiveOverview;
  const subItemConfig = SUB_ITEM_CONFIGS[activeSubItem] || {};

  const assistantContext = selectedAssistant ? {
    assistantId: selectedAssistant.id,
    assistantName: selectedAssistant.name,
    assistantRole: selectedAssistant.role,
    assistantDept: selectedAssistant.dept,
    capabilities: AI_ASSISTANT_CAPABILITIES[selectedAssistant.id] || [],
    isRelevant: AI_ASSISTANT_CAPABILITIES[selectedAssistant.id]?.includes(activeCategory),
  } : null;

  return (
    <div className="contextual-dashboard">
      <ViewComponent 
        activeSubItem={activeSubItem}
        subItemConfig={subItemConfig}
        assistantContext={assistantContext}
      />
    </div>
  );
}
