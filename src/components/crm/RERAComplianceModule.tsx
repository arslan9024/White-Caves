import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';
import { useToast } from '../Toast';
import type { CRMModuleProps } from './types';

const log = createLogger('RERACompliance');

interface RERAAgent {
  id: string | number;
  name: string;
  reraNumber?: string | null;
  status: string;
  expiryDate?: string | null;
  [key: string]: unknown;
}

/**
 * RERA Compliance Module
 * Manages real estate agent licenses, compliance tracking, and RERA registration
 *
 * Features:
 * - Display RERA registration status for all agents
 * - Register/update RERA numbers
 * - Track license expiry dates
 * - Compliance reports
 * - Alert system for expired licenses
 */

export default function RERAComplianceModule({
  role: _role,
  user: _user,
  data: _data,
}: CRMModuleProps) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [agents, setAgents] = useState<RERAAgent[]>([]);
  const [, setReraStatus] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [, setSelectedAgent] = useState<RERAAgent | null>(null);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    expiryDate: '',
    agentName: '',
  });
  const isMountedRef = useRef(true);

  const fetchRERAStatus = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await authFetch('/api/rera/status');
      if (!isMountedRef.current) return;
      if (response.ok) {
        const data = await response.json();
        setReraStatus(data);
        setAgents(data.agents || []);
      } else {
        setFetchError('Failed to load RERA compliance data.');
        setAgents([]);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      log.error('Failed to fetch RERA status:', error);
      setFetchError('Unable to connect to the server.');
      setAgents([]);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchRERAStatus();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchRERAStatus]);

  const handleRegisterRERA = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authFetch('/api/rera/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchRERAStatus();
        setFormData({ licenseNumber: '', expiryDate: '', agentName: '' });
        toast.success('RERA registration successful!');
      }
    } catch (error) {
      log.error('RERA registration error:', error);
      toast.error('Failed to register RERA');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'valid':
        return '#22c55e';
      case 'expired':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const renderDashboard = () => (
    <div className="module-dashboard">
      <div className="module-summary">
        <div className="summary-card">
          <h3>Total Agents</h3>
          <p className="summary-value">{agents.length}</p>
        </div>
        <div className="summary-card" style={{ borderColor: '#22c55e' }}>
          <h3>Licenses Valid</h3>
          <p className="summary-value" style={{ color: '#22c55e' }}>
            {agents.filter(a => a.status === 'valid').length}
          </p>
        </div>
        <div className="summary-card" style={{ borderColor: '#ef4444' }}>
          <h3>Licenses Expired</h3>
          <p className="summary-value" style={{ color: '#ef4444' }}>
            {agents.filter(a => a.status === 'expired').length}
          </p>
        </div>
        <div className="summary-card" style={{ borderColor: '#f59e0b' }}>
          <h3>Pending Registration</h3>
          <p className="summary-value" style={{ color: '#f59e0b' }}>
            {agents.filter(a => a.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="module-table">
        <h3>Agent RERA Status</h3>
        <table>
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>RERA License</th>
              <th>Status</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id}>
                <td>{agent.name}</td>
                <td>{agent.reraNumber || 'N/A'}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(agent.status) }}
                  >
                    {agent.status.toUpperCase()}
                  </span>
                </td>
                <td>{agent.expiryDate || 'N/A'}</td>
                <td>
                  <button className="action-btn" onClick={() => setSelectedAgent(agent)}>
                    {agent.reraNumber ? 'Update' : 'Register'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="module-form">
      <h3>Register RERA License</h3>
      <form onSubmit={handleRegisterRERA}>
        <div className="form-group">
          <label>Agent Name</label>
          <input
            type="text"
            value={formData.agentName}
            onChange={e => setFormData({ ...formData, agentName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>RERA License Number</label>
          <input
            type="text"
            placeholder="e.g., RERA-123456"
            value={formData.licenseNumber}
            onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>License Expiry Date</label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Register RERA License
        </button>
      </form>
    </div>
  );

  return (
    <div className="dubai-crm-module rera-compliance-module">
      <div className="module-header">
        <h1>RERA Compliance Management</h1>
        <p>Monitor and manage real estate agent licenses and RERA registration</p>
      </div>

      <div className="module-tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register License
        </button>
      </div>

      <div className="module-content">
        {isLoading ? (
          <div className="loading">Loading RERA data...</div>
        ) : fetchError ? (
          <div
            style={{
              padding: '1.5rem',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#B91C1C',
              textAlign: 'center',
            }}
          >
            <p style={{ marginBottom: '1rem' }}>{fetchError}</p>
            <button
              onClick={fetchRERAStatus}
              style={{
                padding: '0.5rem 1rem',
                background: '#B91C1C',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        ) : activeTab === 'dashboard' ? (
          renderDashboard()
        ) : (
          renderRegisterForm()
        )}
      </div>
    </div>
  );
}
