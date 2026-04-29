import React, { useState } from 'react';
import type { UAEPassTabProps, UAEPassVerificationStatus, UAEPassRole } from './types';
import './TabStyles.css';

const UAEPassTab: React.FC<UAEPassTabProps> = ({ data, loading, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Show loading state
  if (loading) {
    return (
      <div className="uaepass-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading UAE Pass data">
          <div className="loading-spinner" />
          <p>Loading UAE Pass data...</p>
        </div>
      </div>
    );
  }

  const stats = data?.uaepassStats || {
    totalUsers: 0,
    verifiedUsers: 0,
    pendingVerification: 0,
    thisMonth: 0,
    conversionRate: 0
  };

  const users = data?.uaepassUsers || [];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      verified: { color: '#22C55E', text: '✓ Verified' },
      pending: { color: '#F59E0B', text: '⏳ Pending' },
      rejected: { color: '#EF4444', text: '✕ Rejected' }
    };
    const c = config[status] || { color: '#6B7280', text: status };
    return <span className="status-badge" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.text}</span>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      buyer: '#3B82F6',
      seller: '#8B5CF6',
      landlord: '#F59E0B',
      tenant: '#22C55E',
      agent: '#EC4899'
    };
    return <span className="role-badge" style={{ backgroundColor: `${colors[role]}20`, color: colors[role] }}>{role}</span>;
  };

  return (
    <div className="uaepass-tab">
      <div className="tab-header">
        <div className="header-title">
          <h3>UAE Pass Users</h3>
          <div className="uaepass-logo">
            <span className="uae-flag">🇦🇪</span>
            <span>UAE Pass Integration</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => onAction?.('exportUsers')}>
            <span>📥</span> Export
          </button>
          <button className="primary-btn" onClick={() => onAction?.('configureUAEPass')}>
            <span>⚙️</span> Configure
          </button>
        </div>
      </div>

      <div className="uaepass-stats-grid">
        <div className="uaepass-stat">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Total UAE Pass Users</span>
          </div>
        </div>
        <div className="uaepass-stat verified">
          <span className="stat-icon">✓</span>
          <div className="stat-content">
            <span className="stat-value">{stats.verifiedUsers}</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
        <div className="uaepass-stat pending">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <span className="stat-value">{stats.pendingVerification}</span>
            <span className="stat-label">Pending Verification</span>
          </div>
        </div>
        <div className="uaepass-stat">
          <span className="stat-icon">📈</span>
          <div className="stat-content">
            <span className="stat-value">{stats.thisMonth}</span>
            <span className="stat-label">New This Month</span>
          </div>
        </div>
        <div className="uaepass-stat">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <span className="stat-value">{stats.conversionRate}%</span>
            <span className="stat-label">Verification Rate</span>
          </div>
        </div>
      </div>

      <div className="integration-status">
        <div className="status-card active">
          <span className="status-indicator"></span>
          <div className="status-info">
            <strong>UAE Pass Integration Active</strong>
            <span>Connected to UAE Pass Production Environment</span>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select>
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
        <select>
          <option value="all">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="landlord">Landlord</option>
          <option value="tenant">Tenant</option>
        </select>
      </div>

      <div className="data-table">
        <table aria-label="UAE Pass verified users">
          <thead>
            <tr>
              <th>User</th>
              <th>Emirates ID</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <strong>{user.name}</strong>
                  </div>
                </td>
                <td><code>{user.emiratesId}</code></td>
                <td>
                  <div className="contact-cell">
                    <span>{user.email}</span>
                    <small>{user.phone}</small>
                  </div>
                </td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{getStatusBadge(user.status)}</td>
                <td>{user.registeredAt}</td>
                <td>{user.lastLogin || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View Profile" aria-label="View user profile" onClick={() => onAction?.('viewUser', user.id)}>👁️</button>
                    <button className="icon-btn" title="Verify" aria-label="Verify user" onClick={() => onAction?.('verifyUser', user.id)}>✓</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(UAEPassTab);
