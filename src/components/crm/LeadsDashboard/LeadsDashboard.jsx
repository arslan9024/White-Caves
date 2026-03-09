/**
 * LeadsDashboard Component
 * Comprehensive leads management dashboard with search, filter, and view modes
 */

import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllLeads,
  updateLead
} from '../../../store/crmDataSlice';
import {
  selectStatusFilter,
  selectSearchQuery,
  selectViewType,
  setStatusFilter,
  setSearchQuery,
  setView
} from '../../../store/managingDirectorDashboardSlice';
import { Search, Grid3x3, List, Download, Filter, X } from 'lucide-react';
import './LeadsDashboard.css';

const LeadsDashboard = () => {
  const dispatch = useDispatch();
  const leads = useSelector(selectAllLeads);
  const statusFilter = useSelector(selectStatusFilter);
  const searchQuery = useSelector(selectSearchQuery);
  const viewType = useSelector(selectViewType);
  const [selectedLeads, setSelectedLeads] = useState(new Set());

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  const handleStatusChange = (leadId, newStage) => {
    dispatch(
      updateLead({
        id: leadId,
        stage: newStage
      })
    );
  };

  const statusOptions = ['hot', 'warm', 'cold'];
  const stageOptions = ['initial', 'viewing', 'proposal', 'negotiation'];

  return (
    <div className="leads-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>🔥 Hot Leads Management</h1>
          <p className="header-subtitle">
            {filteredLeads.length} leads found • {leads.filter(l => l.status === 'hot').length} hot
          </p>
        </div>
        <div className="header-actions">
          <button className="action-btn export-btn">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => dispatch(setSearchQuery(e.target.value))}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => dispatch(setSearchQuery(''))}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${!statusFilter ? 'active' : ''}`}
            onClick={() => dispatch(setStatusFilter(''))}
          >
            All
          </button>
          {statusOptions.map(status => (
            <button
              key={status}
              className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => dispatch(setStatusFilter(status))}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => dispatch(setView('grid'))}
            title="Grid view"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            className={`view-btn ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => dispatch(setView('list'))}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* LEADS VIEW */}
      {viewType === 'grid' ? (
        <div className="leads-grid-view">
          {filteredLeads.length > 0 ? (
            filteredLeads.map(lead => (
              <div key={lead.id} className="lead-card-compact">
                <div className="lead-card-header">
                  <h3>{lead.name}</h3>
                  <span className={`status-badge ${lead.status}`}>
                    {lead.status.toUpperCase()}
                  </span>
                </div>
                <div className="lead-card-body">
                  <p>
                    <strong>Email:</strong> {lead.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {lead.phone}
                  </p>
                  <p>
                    <strong>Amount:</strong> AED {(lead.amount / 1000000).toFixed(1)}M
                  </p>
                  <p>
                    <strong>Agent:</strong> {lead.agent_name}
                  </p>
                </div>
                <div className="lead-card-footer">
                  <select
                    className="stage-select"
                    value={lead.stage}
                    onChange={e => handleStatusChange(lead.id, e.target.value)}
                  >
                    {stageOptions.map(stage => (
                      <option key={stage} value={stage}>
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button className="action-btn-small">Contact</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No leads match your filters</div>
          )}
        </div>
      ) : (
        <div className="leads-list-view">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Amount</th>
                <th>Agent</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td className="name-cell">{lead.name}</td>
                  <td className="contact-cell">
                    <div>{lead.email}</div>
                    <div className="phone">{lead.phone}</div>
                  </td>
                  <td className="amount-cell">AED {(lead.amount / 1000000).toFixed(1)}M</td>
                  <td>{lead.agent_name}</td>
                  <td>
                    <select
                      className="stage-select"
                      value={lead.stage}
                      onChange={e => handleStatusChange(lead.id, e.target.value)}
                    >
                      {stageOptions.map(stage => (
                        <option key={stage} value={stage}>
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${lead.status}`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn-small">Contact</button>
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

export default LeadsDashboard;
