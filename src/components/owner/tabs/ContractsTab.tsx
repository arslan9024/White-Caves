import React, { useState, useEffect } from 'react';
import Pagination from '../../ui/Pagination';
import type { ContractsTabProps, ContractStatus, EjariStatus } from './types';
import './TabStyles.css';

const ContractsTab: React.FC<ContractsTabProps> = ({ data, loading, onAction }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination when filters change (must be before early returns — Rules of Hooks)
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter]);

  // Show loading state
  if (loading) {
    return (
      <div className="contracts-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading contracts">
          <div className="loading-spinner" />
          <p>Loading contracts...</p>
        </div>
      </div>
    );
  }

  const contracts = data?.contracts || [];

  const filteredContracts = contracts.filter(contract => {
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      active: { color: '#22C55E', text: 'Active' },
      pending: { color: '#F59E0B', text: 'Pending' },
      completed: { color: '#3B82F6', text: 'Completed' },
      expired: { color: '#EF4444', text: 'Expired' },
      cancelled: { color: '#6B7280', text: 'Cancelled' }
    };
    const c = config[status] || { color: '#6B7280', text: status };
    return <span className="status-badge" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.text}</span>;
  };

  const getEjariBadge = (status: string) => {
    if (!status) return null;
    const isRegistered = status === 'registered';
    return (
      <span className="ejari-badge" style={{ 
        backgroundColor: isRegistered ? '#22C55E20' : '#EF444420',
        color: isRegistered ? '#22C55E' : '#EF4444'
      }}>
        {isRegistered ? '✓ Registered' : '⏳ Pending'}
      </span>
    );
  };

  const contractStats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    ejariRegistered: contracts.filter(c => c.ejariStatus === 'registered').length
  };

  return (
    <div className="contracts-tab">
      <div className="tab-header">
        <h3>Contract Management</h3>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => onAction?.('generateContract')}>
            <span>📄</span> Generate Contract
          </button>
          <button className="primary-btn" onClick={() => onAction?.('addContract')}>
            <span>➕</span> Add Contract
          </button>
        </div>
      </div>

      <div className="contract-stats-row">
        <div className="contract-stat">
          <span className="stat-number">{contractStats.total}</span>
          <span className="stat-label">Total Contracts</span>
        </div>
        <div className="contract-stat active">
          <span className="stat-number">{contractStats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="contract-stat pending">
          <span className="stat-number">{contractStats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="contract-stat ejari">
          <span className="stat-number">{contractStats.ejariRegistered}</span>
          <span className="stat-label">Ejari Registered</span>
        </div>
      </div>

      <div className="filters-bar">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="tenancy">Tenancy</option>
          <option value="sale">Sale</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="data-table">
        <table aria-label="Contracts list">
          <thead>
            <tr>
              <th>Contract No.</th>
              <th>Type</th>
              <th>Parties</th>
              <th>Property</th>
              <th>Duration/Date</th>
              <th>Amount (AED)</th>
              <th>Status</th>
              <th>Ejari</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContracts.map((contract) => (
              <tr key={contract.id}>
                <td><strong>{contract.contractNumber}</strong></td>
                <td>
                  <span className={`type-badge ${contract.type}`}>
                    {contract.type === 'tenancy' ? '🏠 Tenancy' : '💰 Sale'}
                  </span>
                </td>
                <td>
                  <div className="parties-cell">
                    {contract.type === 'tenancy' ? (
                      <>
                        <small>Tenant: {contract.tenant}</small>
                        <small>Landlord: {contract.landlord}</small>
                      </>
                    ) : (
                      <>
                        <small>Buyer: {contract.buyer}</small>
                        <small>Seller: {contract.seller}</small>
                      </>
                    )}
                  </div>
                </td>
                <td>{contract.property}</td>
                <td>
                  {contract.type === 'tenancy' ? (
                    <div className="date-cell">
                      <small>{contract.startDate}</small>
                      <small>to {contract.endDate}</small>
                    </div>
                  ) : (
                    <small>Completion: {contract.completionDate}</small>
                  )}
                </td>
                <td className="price-cell">AED {contract.amount.toLocaleString()}</td>
                <td>{getStatusBadge(contract.status)}</td>
                <td>{getEjariBadge(contract.ejariStatus)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View" aria-label="View contract" onClick={() => onAction?.('viewContract', contract.id)}>👁️</button>
                    <button className="icon-btn" title="Download PDF" aria-label="Download contract PDF" onClick={() => onAction?.('downloadContract', contract.id)}>📥</button>
                    <button className="icon-btn" title="Edit" aria-label="Edit contract" onClick={() => onAction?.('editContract', contract.id)}>✏️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredContracts.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default React.memo(ContractsTab);
