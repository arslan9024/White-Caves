import React from 'react';
import { useProspectsForm, STATUS_OPTIONS, STAGE_OPTIONS } from '../hooks/useProspectsForm';

export default function ProspectsTab() {
  const {
    filteredLeads,
    stats,
    filterStatus,
    setFilterStatus,
    filterStage,
    setFilterStage,
    searchQuery,
    setSearchQuery,
    updateLead,
    showAddForm,
    formData,
    toggleAddForm,
    setField,
    handleAddLead,
    handleDeleteLead,
  } = useProspectsForm();

  const statusOptions = [...STATUS_OPTIONS];
  const stageOptions = [...STAGE_OPTIONS];

  return (
    <div className="prospects-section">
      {/* Summary Stats */}
      <div className="prospects-header">
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
            Prospects & Leads
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            margin: '4px 0 0 0'
          }}>
            {stats.totalLeads} total • ${(stats.totalValue / 1000).toFixed(0)}K pipeline
          </p>
        </div>
        <button className="button-primary" onClick={toggleAddForm}>
          {showAddForm ? 'Cancel' : '+ Add Lead'}
        </button>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <form onSubmit={handleAddLead} style={{
          padding: '16px',
          background: 'var(--color-background-secondary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.name}
              onChange={(e) => setField('name', e.target.value)}
              className="filter-input"
              style={{ gridColumn: '1 / -1' }}
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setField('type', e.target.value)}
              className="filter-select"
            >
              <option value="commercial">Commercial</option>
              <option value="startup">Startup</option>
              <option value="enterprise">Enterprise</option>
              <option value="sme">SME</option>
            </select>
            <select
              value={formData.size}
              onChange={(e) => setField('size', e.target.value)}
              className="filter-select"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setField('email', e.target.value)}
              className="filter-input"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setField('phone', e.target.value)}
              className="filter-input"
            />
            <input
              type="number"
              placeholder="Deal Value"
              value={formData.value}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                setField('value', Number.isNaN(parsed) ? 0 : parsed);
              }}
              className="filter-input"
            />
            <select
              value={formData.status}
              onChange={(e) => setField('status', e.target.value)}
              className="filter-select"
            >
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={formData.stage}
              onChange={(e) => setField('stage', e.target.value)}
              className="filter-select"
            >
              <option value="initial_contact">Initial Contact</option>
              <option value="discovery">Discovery</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="contract_review">Contract Review</option>
            </select>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setField('notes', e.target.value)}
              className="filter-input"
              style={{ gridColumn: '1 / -1', minHeight: '60px' }}
            />
          </div>
          <button type="submit" className="button-primary" style={{ marginTop: '12px' }}>
            Add Lead
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="prospects-filters">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Status' : s}</option>
          ))}
        </select>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="filter-select"
        >
          {stageOptions.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Stages' : s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Leads Grid */}
      <div className="prospects-grid">
        {filteredLeads.length > 0 ? (
          filteredLeads.map(lead => (
            <div key={lead.id} className="lead-card">
              <div className="lead-card-header">
                <h4 className="lead-card-title">{lead.name}</h4>
                <span className={`lead-card-status ${lead.status}`}>
                  {lead.status}
                </span>
              </div>

              <div className="lead-card-details">
                <div className="lead-card-detail">
                  <strong>${lead.value.toLocaleString()}</strong> potential
                </div>
                <div className="lead-card-detail">
                  Stage: <strong>{lead.stage.replace(/_/g, ' ')}</strong>
                </div>
                <div className="lead-card-detail">
                  Probability: <strong>{lead.probability}%</strong>
                </div>
                {lead.email && (
                  <div className="lead-card-detail">
                    📧 {lead.email}
                  </div>
                )}
                {lead.phone && (
                  <div className="lead-card-detail">
                    ☎️ {lead.phone}
                  </div>
                )}
                {lead.notes && (
                  <div className="lead-card-detail">
                    📝 {lead.notes}
                  </div>
                )}
              </div>

              <div className="lead-card-actions">
                <button
                  className="card-action-button"
                  onClick={() => updateLead(lead.id, { status: 'interested' })}
                >
                  Engage
                </button>
                <button
                  className="card-action-button"
                  onClick={() => updateLead(lead.id, { status: 'qualified' })}
                >
                  Qualify
                </button>
                <button
                  className="card-action-button danger"
                  onClick={() => handleDeleteLead(lead.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)'
          }}>
            <p style={{ fontSize: '14px' }}>No leads found. Try adjusting your filters or add a new lead.</p>
          </div>
        )}
      </div>
    </div>
  );
}
