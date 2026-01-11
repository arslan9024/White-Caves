import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectActiveCategory, 
  selectActiveSubItem,
  selectSelectedAssistantForChat,
  selectAiAssistantById,
  selectDocumentViewMode,
  selectActiveDocument
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
import CRMDocumentViewer from './CRMDocumentViewer';

import {
  ExecutiveMixedDashboard,
  OperationsMixedDashboard,
  SalesMixedDashboard,
  PropertiesMixedDashboard,
  ServicesMixedDashboard,
  LeasingMixedDashboard,
  MarketingMixedDashboard,
  FinanceMixedDashboard,
  ComplianceMixedDashboard,
  AnalyticsMixedDashboard,
  AdminMixedDashboard
} from './mixed';

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

const MIXED_DASHBOARD_COMPONENTS = {
  executive: ExecutiveMixedDashboard,
  operations: OperationsMixedDashboard,
  sales: SalesMixedDashboard,
  properties: PropertiesMixedDashboard,
  services: ServicesMixedDashboard,
  leasing: LeasingMixedDashboard,
  marketing: MarketingMixedDashboard,
  finance: FinanceMixedDashboard,
  compliance: ComplianceMixedDashboard,
  analytics: AnalyticsMixedDashboard,
  admin: AdminMixedDashboard,
};

const SUB_ITEM_CONFIGS = {
  'md-dashboard': { title: 'MD Dashboard', description: 'Executive overview and strategic metrics' },
  'strategic-kpis': { title: 'Strategic KPIs', description: 'Key performance indicators' },
  'announcements': { title: 'Company Announcements', description: 'Internal communications' },
  'company-overview': { title: 'Company Overview', description: 'Organization structure' },
  'departments': { title: 'Departments', description: 'Manage company departments' },
  'employees': { title: 'Employees', description: 'Staff management' },
  'teams': { title: 'Team Structure', description: 'Team assignments' },
  'scheduling': { title: 'Scheduling', description: 'Calendar and appointments' },
  'onboarding': { title: 'Onboarding', description: 'New hire onboarding' },
  'leads': { title: 'Leads', description: 'Track leads through stages' },
  'deals': { title: 'Deals', description: 'Active deals and negotiations' },
  'client-journey': { title: 'Client Journey', description: 'Client lifecycle management' },
  'contracts': { title: 'Contracts', description: 'Contract management' },
  'negotiations': { title: 'Negotiations', description: 'Deal negotiations' },
  'portfolio': { title: 'Portfolio', description: 'All properties overview' },
  'listings': { title: 'Active Listings', description: 'Currently active listings' },
  'add-listing': { title: 'Add New Listing', description: 'Create new property listing' },
  'developer-pipeline': { title: 'Developer Pipeline', description: 'Off-plan developments' },
  'media-gallery': { title: 'Media Gallery', description: 'Property images and videos' },
  'virtual-tours': { title: 'Virtual Tours', description: 'Matterport tours' },
  'service-catalog': { title: 'Service Catalog', description: '40 services across 6 categories' },
  'service-tracker': { title: 'Service Tracker', description: 'Track service requests' },
  'owner-tools': { title: 'Owner Tools', description: 'Property owner services' },
  'vendor-management': { title: 'Vendor Management', description: 'Manage service vendors' },
  'ejari-system': { title: 'Ejari System', description: 'Digital tenancy contracts' },
  'tenancy-lifecycle': { title: 'Tenancy Lifecycle', description: 'Lease management' },
  'renewals': { title: 'Renewals', description: 'Lease renewals' },
  'landlord-portal': { title: 'Landlord Portal', description: 'Landlord communications' },
  'tenant-management': { title: 'Tenant Management', description: 'Tenant records' },
  'campaigns': { title: 'Marketing Campaigns', description: 'Active campaigns' },
  'whatsapp-center': { title: 'WhatsApp Center', description: 'WhatsApp Business integration' },
  'content-calendar': { title: 'Content Calendar', description: 'Marketing schedule' },
  'website-assets': { title: 'Website Assets', description: 'Web materials' },
  'email-templates': { title: 'Email Templates', description: 'Email marketing templates' },
  'payments': { title: 'Payments', description: 'Financial transactions' },
  'invoices': { title: 'Invoices', description: 'Invoice management' },
  'commissions': { title: 'Commissions', description: 'Agent commissions' },
  'reports': { title: 'Financial Reports', description: 'Revenue and expense reports' },
  'rera-audits': { title: 'RERA Audits', description: 'Regulatory compliance audits' },
  'document-vault': { title: 'Document Vault', description: 'Secure documents' },
  'kyc-aml': { title: 'KYC/AML', description: 'Know Your Customer and AML checks' },
  'audit-log': { title: 'Audit Log', description: 'Activity tracking' },
  'market-dashboard': { title: 'Market Dashboard', description: 'Market trends' },
  'performance-reports': { title: 'Performance Reports', description: 'Team performance' },
  'forecasting': { title: 'Forecasting', description: 'AI-powered predictions' },
  'agent-performance': { title: 'Agent Performance', description: 'Agent metrics' },
  'settings': { title: 'Settings', description: 'Platform configuration' },
  'integrations': { title: 'Integrations', description: 'Third-party connections' },
  'knowledge-base': { title: 'Knowledge Base', description: 'Documentation and help' },
  'system-health': { title: 'System Health', description: 'System status and monitoring' },
};

const AI_ASSISTANT_CAPABILITIES = {
  zoe: ['executive', 'analytics', 'operations', 'sales', 'properties', 'services', 'leasing', 'marketing', 'finance', 'compliance', 'admin'],
  ella: ['sales', 'marketing'],
  liam: ['sales', 'operations'],
  sophia: ['services', 'compliance'],
  max: ['finance', 'compliance'],
  nina: ['leasing', 'services'],
  henry: ['properties', 'services', 'compliance'],
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
  coral: ['analytics', 'admin'],
  celeste: ['analytics', 'operations'],
  theodora: ['finance', 'executive'],
  daisy: ['leasing', 'properties'],
  clara: ['sales', 'marketing'],
  linda: ['marketing', 'sales'],
  sage: ['analytics', 'properties'],
  evangeline: ['compliance', 'legal'],
};

export default function ContextualDashboardRenderer() {
  const activeCategory = useSelector(selectActiveCategory);
  const activeSubItem = useSelector(selectActiveSubItem);
  const selectedAssistantId = useSelector(selectSelectedAssistantForChat);
  const selectedAssistant = useSelector(state => 
    selectedAssistantId ? selectAiAssistantById(selectedAssistantId)(state) : null
  );
  const documentViewMode = useSelector(selectDocumentViewMode);
  const activeDocument = useSelector(selectActiveDocument);

  if (documentViewMode === 'document' && activeDocument) {
    return (
      <div className="contextual-dashboard">
        <CRMDocumentViewer />
      </div>
    );
  }

  const assistantContext = selectedAssistant ? {
    assistantId: selectedAssistant.id,
    assistantName: selectedAssistant.name,
    assistantRole: selectedAssistant.role,
    assistantDept: selectedAssistant.dept,
    capabilities: AI_ASSISTANT_CAPABILITIES[selectedAssistant.id] || [],
    isRelevant: AI_ASSISTANT_CAPABILITIES[selectedAssistant.id]?.includes(activeCategory),
  } : null;

  const useMixedDashboard = assistantContext?.isRelevant || activeCategory === 'executive';
  
  if (useMixedDashboard) {
    const MixedComponent = MIXED_DASHBOARD_COMPONENTS[activeCategory];
    if (MixedComponent) {
      return (
        <div className="contextual-dashboard mixed-mode">
          <MixedComponent 
            subItem={activeSubItem}
            selectedAssistant={selectedAssistant?.id}
            assistantContext={assistantContext}
          />
        </div>
      );
    }
  }

  const ViewComponent = VIEW_COMPONENTS[activeCategory] || ExecutiveOverview;
  const subItemConfig = SUB_ITEM_CONFIGS[activeSubItem] || {};

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
