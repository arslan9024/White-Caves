import React, { FC, useState, useEffect, useRef } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import '../RolePages.css';

const log = createLogger('TenantScreening');

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  income?: number | null;
}

interface ScreeningChecklistItem {
  id: number;
  name: string;
  required: boolean;
}

interface ChecklistSection {
  category: string;
  items: ScreeningChecklistItem[];
}

const TenantScreeningPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('checklist');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState<boolean>(false);
  const [tenantsError, setTenantsError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (activeTab !== 'applications') return;
    const controller = new AbortController();

    const fetchTenants = async (): Promise<void> => {
      try {
        setLoadingTenants(true);
        setTenantsError(null);
        const res = await authFetch('/api/tenants?pageSize=50', { signal: controller.signal });
        if (!isMountedRef.current) return;
        if (res.ok) {
          const json = await res.json();
          setTenants(json.data || []);
        } else {
          setTenantsError('Failed to load tenant applications.');
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        log.error('Error fetching tenants:', err);
        setTenantsError('Unable to connect to the server.');
      } finally {
        if (isMountedRef.current) setLoadingTenants(false);
      }
    };

    fetchTenants();
    return () => controller.abort();
  }, [activeTab]);

  const screeningChecklist: ChecklistSection[] = [
    { category: 'Identity Verification', items: [
      { id: 1, name: 'Valid Emirates ID', required: true },
      { id: 2, name: 'Valid Passport with UAE Visa', required: true },
      { id: 3, name: 'Visa validity check (min 6 months remaining)', required: true },
    ]},
    { category: 'Employment & Income', items: [
      { id: 4, name: 'Salary Certificate (dated within 30 days)', required: true },
      { id: 5, name: 'Employment Contract', required: false },
      { id: 6, name: 'Bank Statements (last 3 months)', required: true },
    ]},
    { category: 'Rental History', items: [
      { id: 8, name: 'Previous landlord reference', required: false },
      { id: 9, name: 'Previous tenancy contract', required: false },
      { id: 10, name: 'No rental dispute history (RDC check)', required: true },
    ]},
  ];

  const redFlags: string[] = [
    'Salary less than 3x monthly rent',
    'Visa expiring within 6 months',
    'Previous rental disputes or evictions',
    'Bounced cheques history',
    'Inconsistent employment history',
  ];

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
  };

  const statusLabel = (status: string): string =>
    status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Tenant Screening</h1>
          <p>Verify tenant credentials and manage applications</p>
        </div>

        <div className="tabs-bar">
          <button className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => handleTabChange('checklist')}>Screening Checklist</button>
          <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => handleTabChange('applications')}>Pending Applications</button>
          <button className={`tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`} onClick={() => handleTabChange('guidelines')}>Guidelines</button>
        </div>

        {activeTab === 'checklist' && (
          <div className="screening-checklist">
            {screeningChecklist.map((section) => (
              <div key={section.category} className="checklist-section">
                <h3>{section.category}</h3>
                <div className="checklist-items">
                  {section.items.map(item => (
                    <div key={item.id} className="checklist-item">
                      <input type="checkbox" id={`check-${item.id}`} />
                      <label htmlFor={`check-${item.id}`}>
                        {item.name}
                        {item.required && <span className="required-badge">Required</span>}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-list">
            <h3>Tenant Applications</h3>

            {loadingTenants && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Loading applications…
              </div>
            )}

            {tenantsError && (
              <div style={{ padding: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', marginBottom: '1rem' }}>
                {tenantsError}
              </div>
            )}

            {!loadingTenants && !tenantsError && tenants.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', border: '2px dashed var(--border-color, #e5e7eb)', borderRadius: '12px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <h4>No tenant applications yet</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Tenant records will appear here once created.</p>
              </div>
            )}

            {tenants.map((tenant) => (
              <div key={tenant.id} className="application-card">
                <div className="application-header">
                  <div className="applicant-info">
                    <h4>{tenant.name}</h4>
                    <span className="property-name">{tenant.email}</span>
                  </div>
                  <span className={`status-badge ${tenant.status.toLowerCase().replace(/_/g, '-')}`}>
                    {statusLabel(tenant.status)}
                  </span>
                </div>
                <div className="application-details">
                  {tenant.phone && <span className="detail">Phone: {tenant.phone}</span>}
                  {tenant.income && <span className="detail">Income: AED {tenant.income.toLocaleString()}/yr</span>}
                  <span className="detail">Added: {new Date(tenant.createdAt).toLocaleDateString('en-AE')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="guidelines-section">
            <h3>Red Flags to Watch</h3>
            <div className="red-flags-list">
              {redFlags.map((flag) => (
                <div key={flag} className="red-flag-item">
                  <span className="flag-icon">⚠️</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>

            <h3>Best Practices</h3>
            <ul className="best-practices">
              <li>Always verify original documents before accepting copies</li>
              <li>Check visa validity and employment status independently</li>
              <li>Contact previous landlords for references</li>
              <li>Verify salary through employment letter</li>
              <li>Run basic background check through DED</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantScreeningPage;
