import { Home, Key, Users, Calendar, FileText, Clock, ArrowUp, ArrowDown, AlertCircle, DollarSign } from 'lucide-react';
import { useLeasingData } from './hooks/useLeasingData';
import LeasesTab from './tabs/LeasesTab';
import InquiriesTab from './tabs/InquiriesTab';
import MaintenanceTab from './tabs/MaintenanceTab';
import RenewalsTab from './tabs/RenewalsTab';
import AssistantLifecycleTab from '../shared/AssistantLifecycleTab';
import '../AssistantDashboard.css';
import './DaisyLeasingCRM.css';

const DaisyLeasingCRM = () => {
  const {
    activeTab,
    setActiveTab,
    leases,
    searchQuery,
    setSearchQuery,
    getTotalAnnualRent,
    getOccupancyRate,
    getActiveTenants,
    inquiries,
    maintenance,
  } = useLeasingData();

  // Renewal stats
  const renewalStats = {
    dueThisMonth: 12,
    renewalSent: 8,
    confirmed: 5
  };

  return (
    <div className="assistant-dashboard daisy">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)' }}>
          <Home size={28} />
        </div>
        <div className="assistant-info">
          <h2>Daisy - Leasing & Tenant Manager</h2>
          <p>Manages rental properties, tenant communications, lease agreements, and maintenance requests</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#14B8A6' }}>
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{leases.length}</span>
            <span className="stat-label">Active Leases</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 8</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Expiring Soon</span>
          </div>
          <span className="stat-change warning">30 days</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED {(getTotalAnnualRent() / 1000000).toFixed(1)}M</span>
            <span className="stat-label">Annual Revenue</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 5%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{maintenance.length}</span>
            <span className="stat-label">Maintenance</span>
          </div>
          <span className="stat-change">Open</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['leases', 'inquiries', 'maintenance', 'renewals', 'lifecycle'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'leases' && (
          <LeasesTab 
            leases={leases}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesTab inquiries={inquiries} />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceTab requests={maintenance} />
        )}

        {activeTab === 'renewals' && (
          <RenewalsTab renewalStats={renewalStats} renewalList={[]} />
        )}

        {activeTab === 'lifecycle' && (
          <AssistantLifecycleTab assistantId="daisy" color="#14B8A6" assistantName="Daisy" />
        )}
      </div>
    </div>
  );
};

export default DaisyLeasingCRM;
