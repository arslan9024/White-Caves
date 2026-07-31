import React from 'react';
import {
  Home,
  FileText,
  Users,
  Wrench,
  RefreshCw,
  BarChart2,
  GitBranch,
  CreditCard,
  AlertCircle,
  TrendingUp,
  ArrowUp,
} from 'lucide-react';
import { useLeasingData } from './hooks/useLeasingData';
import LeasesTab from './tabs/LeasesTab';
import InquiriesTab from './tabs/InquiriesTab';
import MaintenanceTab from './tabs/MaintenanceTab';
import RenewalsTab from './tabs/RenewalsTab';
import AssistantLifecycleTab from '../shared/AssistantLifecycleTab';
import PipelineTab from './tabs/PipelineTab';
import PDCPaymentsTab from './tabs/PDCPaymentsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import '../AssistantDashboard.css';
import './DaisyLeasingCRM.css';

type TabId = 'leases' | 'pipeline' | 'inquiries' | 'pdc' | 'maintenance' | 'renewals' | 'analytics' | 'lifecycle';

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: 'leases', label: 'Leases', icon: <FileText size={14} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <GitBranch size={14} /> },
  { id: 'inquiries', label: 'Inquiries', icon: <Users size={14} /> },
  { id: 'pdc', label: 'PDC', icon: <CreditCard size={14} /> },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={14} /> },
  { id: 'renewals', label: 'Renewals', icon: <RefreshCw size={14} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={14} /> },
  { id: 'lifecycle', label: 'Lifecycle', icon: <RefreshCw size={14} /> },
];

const DaisyLeasingCRM = () => {
  const {
    activeTab,
    setActiveTab,
    leases,
    searchQuery,
    setSearchQuery,
    filteredLeases,
    inquiries,
    maintenance,
    pdcCheques,
    renewals,
    getOccupancyRate,
    updateMaintenanceStatus,
    updatePDCStatus,
    getPnLSummary,
  } = useLeasingData();

  const pnl = getPnLSummary();
  const bouncedPDC = pdcCheques.filter(c => c.status === 'bounced').length;
  const expiringSoon = leases.filter(l => l.daysRemaining < 60).length;

  return (
    <div className="assistant-dashboard daisy">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--accent-teal, #14B8A6) 0%, var(--accent-green, #10B981) 100%)' }}
        >
          <Home size={28} />
        </div>
        <div className="assistant-info">
          <h2>Daisy — Leasing & Tenant Manager</h2>
          <p>
            Rental properties, tenant communications, lease agreements, PDC tracking, and
            maintenance
          </p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(20, 184, 166, 0.2)', color: 'var(--accent-teal, #14B8A6)' }}
          >
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{leases.filter(l => l.status === 'active').length}</span>
            <span className="stat-label">Active Leases</span>
          </div>
          <span className="stat-change positive">
            <ArrowUp size={14} /> {leases.length} total
          </span>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green, #10B981)' }}
          >
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED {pnl.totalMRR.toLocaleString()}</span>
            <span className="stat-label">Monthly Rent (MRR)</span>
          </div>
          <span className="stat-change positive">
            <ArrowUp size={14} /> {getOccupancyRate()}% occ.
          </span>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-gold, #F59E0B)' }}
          >
            <RefreshCw size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{expiringSoon}</span>
            <span className="stat-label">Expiring &lt;60 Days</span>
          </div>
          <span className="stat-change warning">Action needed</span>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red, #EF4444)' }}
          >
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{bouncedPDC}</span>
            <span className="stat-label">Bounced PDC</span>
          </div>
          <span className="stat-change" style={{ color: bouncedPDC > 0 ? 'var(--accent-red, #EF4444)' : 'var(--accent-green, #10B981)' }}>
            {bouncedPDC > 0 ? 'Follow up' : 'All clear'}
          </span>
        </div>
      </div>

      <div className="assistant-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'leases' && (
          <LeasesTab
            leases={filteredLeases}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeTab === 'pipeline' && <PipelineTab inquiries={inquiries} />}

        {activeTab === 'inquiries' && <InquiriesTab inquiries={inquiries} />}

        {activeTab === 'pdc' && (
          <PDCPaymentsTab pdcCheques={pdcCheques} onUpdateStatus={updatePDCStatus} />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceTab requests={maintenance} onUpdateStatus={updateMaintenanceStatus} />
        )}

        {activeTab === 'renewals' && <RenewalsTab renewals={renewals} />}

        {activeTab === 'analytics' && (
          <AnalyticsTab leases={leases} pdcCheques={pdcCheques} inquiries={inquiries} pnl={pnl} />
        )}

        {activeTab === 'lifecycle' && (
          <AssistantLifecycleTab assistantId="daisy" color="#14B8A6" assistantName="Daisy" />
        )}
      </div>
    </div>
  );
};

export default DaisyLeasingCRM;
