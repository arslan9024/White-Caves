import React, { useState } from 'react';
import './TabStyles.css';

const PropertiesTab = ({ data, loading, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const properties = data?.properties || [
    { id: 1, code: 'WC-PAL-001', title: 'Luxury Villa Palm Jumeirah', type: 'Villa', location: 'Palm Jumeirah', price: 15000000, status: 'available', agent: 'Ahmed Ali', beds: 5, baths: 6, area: 8500, image: null },
    { id: 2, code: 'WC-DWN-002', title: 'Penthouse Downtown Dubai', type: 'Apartment', location: 'Downtown Dubai', price: 8500000, status: 'reserved', agent: 'Sara Khan', beds: 4, baths: 5, area: 4200, image: null },
    { id: 3, code: 'WC-MAR-003', title: 'Marina View Apartment', type: 'Apartment', location: 'Dubai Marina', price: 3200000, status: 'available', agent: 'Mohammed Hassan', beds: 2, baths: 3, area: 1800, image: null },
    { id: 4, code: 'WC-JVC-004', title: 'Family Townhouse JVC', type: 'Townhouse', location: 'JVC', price: 2100000, status: 'under_contract', agent: 'Fatima Ahmed', beds: 3, baths: 4, area: 2500, image: null },
    { id: 5, code: 'WC-BUS-005', title: 'Business Bay Office', type: 'Commercial', location: 'Business Bay', price: 5500000, status: 'available', agent: null, beds: 0, baths: 2, area: 3200, image: null },
    { id: 6, code: 'WC-EMH-006', title: 'Emirates Hills Villa', type: 'Villa', location: 'Emirates Hills', price: 28000000, status: 'sold', agent: 'Ahmed Ali', beds: 7, baths: 8, area: 12000, image: null },
  ];

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    const matchesType = typeFilter === 'all' || prop.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'available': { color: '#22C55E', text: 'Available' },
      'reserved': { color: '#F59E0B', text: 'Reserved' },
      'under_contract': { color: '#8B5CF6', text: 'Under Contract' },
      'sold': { color: '#EF4444', text: 'Sold' },
      'off_market': { color: '#6B7280', text: 'Off Market' }
    };
    const config = statusConfig[status] || { color: '#6B7280', text: status };
    return <span className="status-badge" style={{ backgroundColor: `${config.color}20`, color: config.color }}>{config.text}</span>;
  };

  return (
    <div className="properties-tab">
      <div className="tab-header">
        <h3>Property Management</h3>
        <button className="primary-btn" onClick={() => onAction?.('addProperty')}>
          <span>➕</span> Add Property
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="under_contract">Under Contract</option>
          <option value="sold">Sold</option>
          <option value="off_market">Off Market</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Commercial">Commercial</option>
          <option value="Land">Land</option>
        </select>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Location</th>
              <th>Price (AED)</th>
              <th>Status</th>
              <th>Agent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((prop) => (
              <tr key={prop.id}>
                <td>
                  <div className="property-cell">
                    <div className="property-thumb">🏠</div>
                    <div className="property-info">
                      <strong>{prop.code}</strong>
                      <small>{prop.title}</small>
                    </div>
                  </div>
                </td>
                <td><span className="type-tag">{prop.type}</span></td>
                <td>{prop.location}</td>
                <td className="price-cell">AED {prop.price.toLocaleString()}</td>
                <td>{getStatusBadge(prop.status)}</td>
                <td>{prop.agent || <span className="unassigned">Unassigned</span>}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View" onClick={() => onAction?.('viewProperty', prop.id)}>👁️</button>
                    <button className="icon-btn" title="Edit" onClick={() => onAction?.('editProperty', prop.id)}>✏️</button>
                    <button className="icon-btn danger" title="Delete" onClick={() => onAction?.('deleteProperty', prop.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>Showing {filteredProperties.length} of {properties.length} properties</span>
        <div className="pagination">
          <button className="page-btn">←</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">→</button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
