import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  UserCheck,
  Search,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  RefreshCw,
  User,
  Globe,
  AlertCircle,
  History,
  FileWarning,
  Scale,
} from 'lucide-react';
import { authFetch } from '../../../utils/authFetch';
import './KYCAMLDashboard.css';

const TABS = [
  { id: 'queue', label: 'Verification Queue', icon: Clock },
  { id: 'profiles', label: 'Risk Profiles', icon: Shield },
  { id: 'alerts', label: 'AML Alerts', icon: AlertTriangle },
  { id: 'pep', label: 'PEP Screening', icon: UserCheck },
  { id: 'sanctions', label: 'Sanctions Check', icon: Globe },
  { id: 'audit', label: 'Audit Trail', icon: History },
  { id: 'reports', label: 'Reports', icon: FileText },
];

const RISK_COLORS = {
  LOW: { bg: '#DCFCE7', text: '#166534', border: '#22C55E' },
  MEDIUM: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  HIGH: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
  PROHIBITED: { bg: '#F3E8FF', text: '#6B21A8', border: '#A855F7' },
};

const STATUS_COLORS = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  documents_required: { bg: '#DBEAFE', text: '#1E40AF' },
  under_review: { bg: '#E0E7FF', text: '#3730A3' },
  edd_required: { bg: '#FEE2E2', text: '#991B1B' },
  approved: { bg: '#DCFCE7', text: '#166534' },
  rejected: { bg: '#FEE2E2', text: '#991B1B' },
  suspended: { bg: '#F3F4F6', text: '#374151' },
  expired: { bg: '#FEF3C7', text: '#92400E' },
};

const ALERT_SEVERITY_COLORS = {
  LOW: { bg: '#DCFCE7', text: '#166534' },
  MEDIUM: { bg: '#FEF3C7', text: '#92400E' },
  HIGH: { bg: '#FEE2E2', text: '#991B1B' },
  CRITICAL: { bg: '#7C3AED', text: '#FFFFFF' },
};

const formatDate = date => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = date => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatCard = ({ label, value, icon: Icon, color = '#B03737', trend }) => (
  <div className="kyc-stat-card">
    <div className="kyc-stat-icon" style={{ backgroundColor: `${color}15`, color }}>
      <Icon size={20} />
    </div>
    <div className="kyc-stat-content">
      <span className="kyc-stat-value">{value}</span>
      <span className="kyc-stat-label">{label}</span>
    </div>
    {trend && (
      <span className={`kyc-stat-trend ${trend > 0 ? 'up' : 'down'}`}>
        {trend > 0 ? '+' : ''}
        {trend}%
      </span>
    )}
  </div>
);

const RiskBadge = ({ category }) => {
  // eslint-disable-next-line security/detect-object-injection
  const colors = RISK_COLORS[category] || RISK_COLORS.LOW;
  return (
    <span
      className="kyc-risk-badge"
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
    >
      {category}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  // eslint-disable-next-line security/detect-object-injection
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const label = status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <span className="kyc-status-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {label}
    </span>
  );
};

const SeverityBadge = ({ severity }) => {
  // eslint-disable-next-line security/detect-object-injection
  const colors = ALERT_SEVERITY_COLORS[severity] || ALERT_SEVERITY_COLORS.MEDIUM;
  return (
    <span className="kyc-severity-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {severity}
    </span>
  );
};

const VerificationQueueTab = ({ data, onViewProfile }) => (
  <div className="kyc-tab-content">
    <div className="kyc-table-container">
      <table className="kyc-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Type</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Due Diligence</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="kyc-empty">
                No pending verifications
              </td>
            </tr>
          ) : (
            data.map(profile => (
              <tr key={profile.customerId}>
                <td>
                  <div className="kyc-customer-cell">
                    <User size={16} />
                    <div>
                      <span className="kyc-customer-name">{profile.personalInfo?.fullNameEn}</span>
                      <span className="kyc-customer-id">{profile.customerId}</span>
                    </div>
                  </div>
                </td>
                <td>{profile.customerType?.replace(/_/g, ' ')}</td>
                <td>
                  <StatusBadge status={profile.kycStatus} />
                </td>
                <td>
                  <RiskBadge category={profile.riskAssessment?.category} />
                </td>
                <td>{profile.dueDiligenceLevel}</td>
                <td>{formatDate(profile.createdAt)}</td>
                <td>
                  <button className="kyc-action-btn" onClick={() => onViewProfile(profile)}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const RiskProfilesTab = ({ data, onViewProfile }) => (
  <div className="kyc-tab-content">
    <div className="kyc-risk-summary">
      {Object.entries(RISK_COLORS).map(([category, colors]) => (
        <div
          key={category}
          className="kyc-risk-summary-card"
          style={{ borderLeftColor: colors.border }}
        >
          <span className="kyc-risk-count">
            {data.filter(p => p.riskAssessment?.category === category).length}
          </span>
          <span className="kyc-risk-label">{category} Risk</span>
        </div>
      ))}
    </div>
    <div className="kyc-table-container">
      <table className="kyc-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Nationality</th>
            <th>Risk Score</th>
            <th>Risk Category</th>
            <th>PEP Status</th>
            <th>Next Review</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="kyc-empty">
                No risk profiles found
              </td>
            </tr>
          ) : (
            data.map(profile => (
              <tr key={profile.customerId}>
                <td>
                  <div className="kyc-customer-cell">
                    <User size={16} />
                    <span>{profile.personalInfo?.fullNameEn}</span>
                  </div>
                </td>
                <td>{profile.personalInfo?.nationality}</td>
                <td>
                  <div className="kyc-score-bar">
                    <div
                      className="kyc-score-fill"
                      style={{
                        width: `${profile.riskAssessment?.score || 0}%`,
                        backgroundColor: RISK_COLORS[profile.riskAssessment?.category]?.border,
                      }}
                    />
                    <span>{profile.riskAssessment?.score || 0}</span>
                  </div>
                </td>
                <td>
                  <RiskBadge category={profile.riskAssessment?.category} />
                </td>
                <td>
                  {profile.pepScreening?.isPEP ? (
                    <span className="kyc-pep-badge pep">PEP</span>
                  ) : (
                    <span className="kyc-pep-badge clear">Clear</span>
                  )}
                </td>
                <td>{formatDate(profile.nextReviewDate)}</td>
                <td>
                  <button className="kyc-action-btn" onClick={() => onViewProfile(profile)}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AMLAlertsTab = ({ data, onViewAlert }) => (
  <div className="kyc-tab-content">
    <div className="kyc-alerts-summary">
      <div className="kyc-alert-stat open">
        <AlertCircle size={20} />
        <span>{data.filter(a => a.status === 'open').length}</span>
        <label>Open</label>
      </div>
      <div className="kyc-alert-stat investigating">
        <Search size={20} />
        <span>{data.filter(a => a.status === 'under_investigation').length}</span>
        <label>Investigating</label>
      </div>
      <div className="kyc-alert-stat escalated">
        <AlertTriangle size={20} />
        <span>{data.filter(a => a.status === 'escalated').length}</span>
        <label>Escalated</label>
      </div>
      <div className="kyc-alert-stat critical">
        <FileWarning size={20} />
        <span>{data.filter(a => a.severity === 'CRITICAL').length}</span>
        <label>Critical</label>
      </div>
    </div>
    <div className="kyc-table-container">
      <table className="kyc-table">
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" className="kyc-empty">
                No AML alerts found
              </td>
            </tr>
          ) : (
            data.map(alert => (
              <tr
                key={alert.alertId}
                className={alert.severity === 'CRITICAL' ? 'critical-row' : ''}
              >
                <td className="kyc-alert-id">{alert.alertId}</td>
                <td className="kyc-alert-title">{alert.title}</td>
                <td>{alert.alertType?.replace(/_/g, ' ')}</td>
                <td>
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td>
                  <StatusBadge status={alert.status} />
                </td>
                <td>{alert.customerSnapshot?.name || '-'}</td>
                <td>{formatDateTime(alert.createdAt)}</td>
                <td>
                  <button className="kyc-action-btn" onClick={() => onViewAlert(alert)}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const PEPScreeningTab = ({ data }) => (
  <div className="kyc-tab-content">
    <div className="kyc-pep-info">
      <div className="kyc-info-card">
        <h4>PEP Categories</h4>
        <ul>
          <li>
            <strong>Domestic PEP:</strong> Government officials, politicians, judges
          </li>
          <li>
            <strong>Foreign PEP:</strong> Foreign government officials, diplomats
          </li>
          <li>
            <strong>International PEP:</strong> UN, World Bank, IMF officials
          </li>
          <li>
            <strong>Family/Associates:</strong> Close relatives and business associates
          </li>
        </ul>
      </div>
    </div>
    <div className="kyc-table-container">
      <table className="kyc-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>PEP Status</th>
            <th>Category</th>
            <th>Position</th>
            <th>Country</th>
            <th>Confidence</th>
            <th>Screened</th>
          </tr>
        </thead>
        <tbody>
          {data.filter(p => p.pepScreening?.isPEP).length === 0 ? (
            <tr>
              <td colSpan="7" className="kyc-empty">
                No PEP matches found
              </td>
            </tr>
          ) : (
            data
              .filter(p => p.pepScreening?.isPEP)
              .map(profile => (
                <tr key={profile.customerId}>
                  <td>{profile.personalInfo?.fullNameEn}</td>
                  <td>
                    <span className="kyc-pep-badge pep">PEP</span>
                  </td>
                  <td>{profile.pepScreening?.pepCategory}</td>
                  <td>{profile.pepScreening?.pepPosition}</td>
                  <td>{profile.pepScreening?.pepCountry}</td>
                  <td>{Math.round((profile.pepScreening?.matchConfidence || 0) * 100)}%</td>
                  <td>{formatDateTime(profile.pepScreening?.screenedAt)}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const SanctionsCheckTab = ({ data }) => (
  <div className="kyc-tab-content">
    <div className="kyc-sanctions-info">
      <div className="kyc-info-card warning">
        <h4>Sanctions Lists Checked</h4>
        <div className="kyc-sanctions-lists">
          <span>UN Consolidated</span>
          <span>OFAC SDN (US)</span>
          <span>EU Consolidated</span>
          <span>UK Sanctions</span>
          <span>UAE Local</span>
        </div>
      </div>
    </div>
    <div className="kyc-table-container">
      <table className="kyc-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Match Status</th>
            <th>Lists Checked</th>
            <th>Clearance</th>
            <th>Last Checked</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="kyc-empty">
                No sanctions data available
              </td>
            </tr>
          ) : (
            data.map(profile => (
              <tr
                key={profile.customerId}
                className={profile.sanctionsCheck?.hasMatch ? 'match-row' : ''}
              >
                <td>{profile.personalInfo?.fullNameEn}</td>
                <td>
                  {profile.sanctionsCheck?.hasMatch ? (
                    <span className="kyc-match-badge match">Match Found</span>
                  ) : (
                    <span className="kyc-match-badge clear">No Match</span>
                  )}
                </td>
                <td>{profile.sanctionsCheck?.listsChecked?.length || 0} lists</td>
                <td>
                  <StatusBadge status={profile.sanctionsCheck?.clearanceStatus} />
                </td>
                <td>{formatDateTime(profile.sanctionsCheck?.checkedAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AuditTrailTab = ({ data }) => (
  <div className="kyc-tab-content">
    <div className="kyc-audit-timeline">
      {data.length === 0 ? (
        <div className="kyc-empty">No audit logs found</div>
      ) : (
        data.map((log, index) => (
          <div key={log.auditId || index} className="kyc-audit-item">
            <div className="kyc-audit-marker" />
            <div className="kyc-audit-content">
              <div className="kyc-audit-header">
                <span className="kyc-audit-action">{log.action?.replace(/_/g, ' ')}</span>
                <span className="kyc-audit-time">{formatDateTime(log.timestamp)}</span>
              </div>
              <div className="kyc-audit-details">
                <span className="kyc-audit-entity">
                  {log.entityType}: {log.entityId}
                </span>
                {log.actor?.username && (
                  <span className="kyc-audit-actor">by {log.actor.username}</span>
                )}
              </div>
              {log.details?.description && (
                <p className="kyc-audit-description">{log.details.description}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const ReportsTab = () => (
  <div className="kyc-tab-content">
    <div className="kyc-reports-grid">
      <div className="kyc-report-card">
        <FileText size={24} />
        <h4>Daily KYC Summary</h4>
        <p>New profiles, verifications completed, pending reviews</p>
        <button className="kyc-report-btn">Generate</button>
      </div>
      <div className="kyc-report-card">
        <AlertTriangle size={24} />
        <h4>AML Alert Report</h4>
        <p>Open alerts, investigations, escalations</p>
        <button className="kyc-report-btn">Generate</button>
      </div>
      <div className="kyc-report-card">
        <Shield size={24} />
        <h4>Risk Distribution</h4>
        <p>Customer risk categorization analysis</p>
        <button className="kyc-report-btn">Generate</button>
      </div>
      <div className="kyc-report-card">
        <UserCheck size={24} />
        <h4>PEP Summary</h4>
        <p>Politically exposed persons overview</p>
        <button className="kyc-report-btn">Generate</button>
      </div>
      <div className="kyc-report-card">
        <Scale size={24} />
        <h4>Regulatory Report</h4>
        <p>CBUAE/RERA compliance submission</p>
        <button className="kyc-report-btn">Generate</button>
      </div>
      <div className="kyc-report-card">
        <History size={24} />
        <h4>Audit Report</h4>
        <p>Complete compliance audit trail</p>
        <button className="kyc-report-btn">Generate</button>
      </div>
    </div>
  </div>
);

const KYCAMLDashboard = ({
  assistant: _assistant = 'henry',
  accessLevel = 'full',
  showTabs = ['queue', 'profiles', 'alerts', 'pep', 'sanctions', 'audit', 'reports'],
}) => {
  const [activeTab, setActiveTab] = useState(showTabs[0] || 'queue');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, alertsRes, auditRes] = await Promise.all([
        authFetch('/api/compliance/stats').then(r => r.json()),
        authFetch('/api/compliance/kyc/pending?limit=50').then(r => r.json()),
        authFetch('/api/compliance/alerts/open?limit=50').then(r => r.json()),
        authFetch('/api/compliance/audit?limit=50').then(r => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (pendingRes.success) {
        setPendingProfiles(pendingRes.data);
        setRiskProfiles(pendingRes.data);
      }
      if (alertsRes.success) setAlerts(alertsRes.data);
      if (auditRes.success) setAuditLogs(auditRes.logs || []);
    } catch (error) {
      console.warn('KYC/AML dashboard data load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleTabs = TABS.filter(tab => showTabs.includes(tab.id));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'queue':
        return <VerificationQueueTab data={pendingProfiles} onViewProfile={setSelectedProfile} />;
      case 'profiles':
        return <RiskProfilesTab data={riskProfiles} onViewProfile={setSelectedProfile} />;
      case 'alerts':
        return <AMLAlertsTab data={alerts} onViewAlert={setSelectedAlert} />;
      case 'pep':
        return <PEPScreeningTab data={riskProfiles} />;
      case 'sanctions':
        return <SanctionsCheckTab data={riskProfiles} />;
      case 'audit':
        return <AuditTrailTab data={auditLogs} />;
      case 'reports':
        return <ReportsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="kyc-aml-dashboard">
      <div className="kyc-header">
        <div className="kyc-header-left">
          <Shield className="kyc-header-icon" />
          <div>
            <h2>KYC/AML Compliance Center</h2>
            <p>Customer verification, risk assessment, and anti-money laundering monitoring</p>
          </div>
        </div>
        <div className="kyc-header-right">
          <button className="kyc-refresh-btn" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="kyc-stats-bar">
        <StatCard
          label="Pending Verification"
          value={stats?.profiles?.pendingVerification || 0}
          icon={Clock}
          color="#F59E0B"
        />
        <StatCard
          label="High Risk Profiles"
          value={(stats?.profiles?.byRisk?.HIGH || 0) + (stats?.profiles?.byRisk?.PROHIBITED || 0)}
          icon={AlertTriangle}
          color="#EF4444"
        />
        <StatCard
          label="Open Alerts"
          value={stats?.alerts?.byStatus?.find(s => s._id === 'open')?.count || 0}
          icon={AlertCircle}
          color="#B03737"
        />
        <StatCard
          label="Approved Today"
          value={stats?.profiles?.byStatus?.approved || 0}
          icon={CheckCircle}
          color="#10B981"
        />
      </div>

      <div className="kyc-tabs">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`kyc-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="kyc-content">
        {loading ? (
          <div className="kyc-loading">
            <RefreshCw className="spinning" size={32} />
            <p>Loading compliance data...</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {selectedProfile && (
        <div className="kyc-modal-overlay" onClick={() => setSelectedProfile(null)}>
          <div className="kyc-modal" onClick={e => e.stopPropagation()}>
            <div className="kyc-modal-header">
              <h3>KYC Profile Details</h3>
              <button onClick={() => setSelectedProfile(null)}>&times;</button>
            </div>
            <div className="kyc-modal-content">
              <div className="kyc-profile-detail">
                <label>Customer ID</label>
                <span>{selectedProfile.customerId}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Full Name</label>
                <span>{selectedProfile.personalInfo?.fullNameEn}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Nationality</label>
                <span>{selectedProfile.personalInfo?.nationality}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Customer Type</label>
                <span>{selectedProfile.customerType?.replace(/_/g, ' ')}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Risk Score</label>
                <span>{selectedProfile.riskAssessment?.score} / 100</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Risk Category</label>
                <RiskBadge category={selectedProfile.riskAssessment?.category} />
              </div>
              <div className="kyc-profile-detail">
                <label>KYC Status</label>
                <StatusBadge status={selectedProfile.kycStatus} />
              </div>
              <div className="kyc-profile-detail">
                <label>Due Diligence Level</label>
                <span>{selectedProfile.dueDiligenceLevel}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>PEP Status</label>
                <span>
                  {selectedProfile.pepScreening?.isPEP
                    ? 'Yes - ' + selectedProfile.pepScreening?.pepCategory
                    : 'No'}
                </span>
              </div>
              <div className="kyc-profile-detail">
                <label>Sanctions Status</label>
                <span>{selectedProfile.sanctionsCheck?.hasMatch ? 'Match Found' : 'Cleared'}</span>
              </div>
            </div>
            <div className="kyc-modal-actions">
              {accessLevel === 'full' && selectedProfile.kycStatus !== 'approved' && (
                <>
                  <button className="kyc-approve-btn">Approve</button>
                  <button className="kyc-reject-btn">Reject</button>
                </>
              )}
              <button className="kyc-close-btn" onClick={() => setSelectedProfile(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAlert && (
        <div className="kyc-modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="kyc-modal" onClick={e => e.stopPropagation()}>
            <div className="kyc-modal-header">
              <h3>AML Alert Details</h3>
              <button onClick={() => setSelectedAlert(null)}>&times;</button>
            </div>
            <div className="kyc-modal-content">
              <div className="kyc-profile-detail">
                <label>Alert ID</label>
                <span>{selectedAlert.alertId}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Title</label>
                <span>{selectedAlert.title}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Description</label>
                <span>{selectedAlert.description}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Type</label>
                <span>{selectedAlert.alertType?.replace(/_/g, ' ')}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Severity</label>
                <SeverityBadge severity={selectedAlert.severity} />
              </div>
              <div className="kyc-profile-detail">
                <label>Status</label>
                <StatusBadge status={selectedAlert.status} />
              </div>
              <div className="kyc-profile-detail">
                <label>Customer</label>
                <span>{selectedAlert.customerSnapshot?.name || '-'}</span>
              </div>
              <div className="kyc-profile-detail">
                <label>Assigned To</label>
                <span>{selectedAlert.assignedTo || '-'}</span>
              </div>
            </div>
            <div className="kyc-modal-actions">
              {accessLevel === 'full' && (
                <>
                  <button className="kyc-investigate-btn">Investigate</button>
                  <button className="kyc-escalate-btn">Escalate</button>
                </>
              )}
              <button className="kyc-close-btn" onClick={() => setSelectedAlert(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCAMLDashboard;
