/**
 * ClientsDashboard Component - Simplified version for quick implementation
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllClients } from '../../../store/crmDataSlice';
import {
  selectSearchQuery,
  selectViewType,
  setSearchQuery,
  setView
} from '../../../store/managingDirectorDashboardSlice';
import { useDispatch } from 'react-redux';
import { Search, Grid3x3, List, Download } from 'lucide-react';
import './ClientsDashboard.css';

const ClientsDashboard = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectAllClients);
  const searchQuery = useSelector(selectSearchQuery);
  const viewType = useSelector(selectViewType);

  const filteredClients = useMemo(
    () =>
      clients.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [clients, searchQuery]
  );

  return (
    <div className="clients-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>👥 Active Clients</h1>
          <p className="header-subtitle">{filteredClients.length} clients managed</p>
        </div>
        <button className="action-btn export-btn">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => dispatch(setView('grid'))}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            className={`view-btn ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => dispatch(setView('list'))}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {viewType === 'grid' ? (
        <div className="clients-grid">
          {filteredClients.map(client => (
            <div key={client.id} className="client-card">
              <div
                className="client-avatar"
                style={{ backgroundColor: client.avatar_color }}
              ></div>
              <h3>{client.name}</h3>
              <p className="client-type">{client.type}</p>
              <p className="client-value">AED {(client.total_value / 1000000).toFixed(1)}M</p>
              <div className="client-stats">
                <span>{client.properties_owned} Properties</span>
                <span>{client.deals_count} Deals</span>
              </div>
              <button className="view-btn-small">View Details</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="clients-table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Type</th>
                <th>Total Value</th>
                <th>Properties</th>
                <th>Deals</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.type}</td>
                  <td>AED {(client.total_value / 1000000).toFixed(1)}M</td>
                  <td>{client.properties_owned}</td>
                  <td>{client.deals_count}</td>
                  <td>
                    <span className={`status-badge ${client.status}`}>
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsDashboard;
