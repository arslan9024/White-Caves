import React, { useState } from 'react';
import './TabStyles.css';

const ContractsTab = ({ data, loading, onAction }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const contracts = data?.contracts || [
    { id: 1, contractNumber: 'TC-2024-001', type: 'tenancy', tenant: 'John Smith', landlord: 'Mohammed Al Rashid', property: 'Marina View Apt 1502', startDate: '2024-01-01', endDate: '2024-12-31', amount: 95000, status: 'active', ejariStatus: 'registered' },
    { id: 2, contractNumber: 'TC-2024-002', type: 'tenancy', tenant: 'Sarah Wilson', landlord: 'Ahmed Hassan', property: 'JBR Tower A - 2301', startDate: '2024-02-15', endDate: '2025-02-14', amount: 120000, status: 'active', ejariStatus: 'registered' },
    { id: 3, contractNumber: 'SC-2024-001', type: 'sale', buyer: 'Chen Wei', seller: 'Dubai Properties LLC', property: 'Downtown Villa 45', amount: 4500000, status: 'pending', completionDate: '2024-06-30' },
    { id: 4, contractNumber: 'TC-2024-003', type: 'tenancy', tenant: 'Emily Brown', landlord: 'Fatima Al Maktoum', property: 'Palm Jumeirah Villa 12', startDate: '2024-03-01', endDate: '2025-02-28', amount: 350000, status: 'pending', ejariStatus: 'pending' },
    { id: 5, contractNumber: 'SC-2024-002', type: 'sale', buyer: 'Rashid Khan', seller: 'White Caves RE', property: 'Business Bay Tower 1201', amount: 2800000, status: 'completed', completionDate: '2024-04-15' },
    { id: 6, contractNumber: 'TC-2024-004', type: 'tenancy', tenant: 'David Lee', landlord: 'Omar Trading', property: 'Silicon Oasis Apt 305', startDate: '2023-06-01', endDate: '2024-05-31', amount: 45000, status: 'expired', ejariStatus: 'registered' },
  ];

  const filteredContracts = contracts.filter(contract => {
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      active: { color: '#22C55E', text: 'Active' },
      pending: { color: '#F59E0B', text: 'Pending' },
      completed: { color: '#3B82F6', text: 'Completed' },
      expired: { color: '#EF4444', text: 'Expired' },
      cancelled: { color: '#6B7280', text: 'Cancelled' }
    };
    const c = config[status] || { color: '#6B7280', text: status };
    return <span className="status-badge" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.text}</span>;
  };

  const getEjariBadge = (status) => {
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
        <table>
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
            {filteredContracts.map((contract) => (
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
                    <button className="icon-btn" title="View" onClick={() => onAction?.('viewContract', contract.id)}>👁️</button>
                    <button className="icon-btn" title="Download PDF" onClick={() => onAction?.('downloadContract', contract.id)}>📥</button>
                    <button className="icon-btn" title="Edit" onClick={() => onAction?.('editContract', contract.id)}>✏️</button>
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

export default ContractsTab;
