import React, { FC, useState, useEffect, useRef } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import '../RolePages.css';

const log = createLogger('SalesPipeline');

interface Lead {
  id: string | number;
  name: string;
  company?: string;
  budget?: number;
  status: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'new', name: 'New', color: '#6b7280' },
  { id: 'viewing', name: 'Viewing', color: '#3b82f6' },
  { id: 'negotiating', name: 'Negotiating', color: '#f59e0b' },
  { id: 'offered', name: 'Offered', color: '#8b5cf6' },
  { id: 'won', name: 'Won', color: '#10b981' },
];

// Statuses not shown on the board (lost/contacted/qualified fall back to new column)
const STATUS_TO_STAGE: Record<string, string> = {
  new: 'new',
  contacted: 'new',
  qualified: 'new',
  viewing: 'viewing',
  offered: 'offered',
  negotiating: 'negotiating',
  won: 'won',
};

const SalesPipelinePage: FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    const fetchLeads = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        // Exclude lost leads — they don't belong on the active pipeline board
        const res = await authFetch('/api/leads?pageSize=100', { signal: controller.signal });
        if (!isMountedRef.current) return;
        if (res.ok) {
          const json = await res.json();
          const allLeads: Lead[] = json.data || json.leads || [];
          setLeads(allLeads.filter(l => l.status !== 'lost'));
        } else {
          setError('Failed to load pipeline data.');
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        log.error('Error fetching leads:', err);
        setError('Unable to connect to the server.');
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    fetchLeads();
    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, []);

  const getLeadsByStage = (stageId: string): Lead[] =>
    leads.filter(l => (STATUS_TO_STAGE[l.status] ?? 'new') === stageId);

  const totalPipelineValue = leads.reduce((sum, lead) => sum + (lead.budget || 0), 0);

  const formatCurrency = (amount: number): string =>
    amount >= 1_000_000
      ? `AED ${(amount / 1_000_000).toFixed(1)}M`
      : `AED ${amount.toLocaleString()}`;

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Sales Pipeline</h1>
          <p>Track your deals from inquiry to closing</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading pipeline…
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '1rem',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#B91C1C',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="pipeline-summary">
              <div className="summary-card">
                <span className="summary-label">Active Deals</span>
                <span className="summary-value">{leads.length}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Pipeline Value</span>
                <span className="summary-value">{formatCurrency(totalPipelineValue)}</span>
              </div>
            </div>

            {leads.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  border: '2px dashed var(--border-color, #e5e7eb)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No active deals</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Leads will appear here as they move through the pipeline.
                </p>
              </div>
            ) : (
              <div className="pipeline-board">
                {PIPELINE_STAGES.map(stage => (
                  <div key={stage.id} className="pipeline-column">
                    <div className="column-header" style={{ borderTopColor: stage.color }}>
                      <h3>{stage.name}</h3>
                      <span className="deal-count">{getLeadsByStage(stage.id).length}</span>
                    </div>
                    <div className="column-deals">
                      {getLeadsByStage(stage.id).map(lead => (
                        <div
                          key={lead.id}
                          className="deal-card"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <h4>{lead.name}</h4>
                          {lead.company && <p className="deal-buyer">{lead.company}</p>}
                          <div className="deal-details">
                            {lead.budget ? (
                              <span className="deal-price">{formatCurrency(lead.budget)}</span>
                            ) : (
                              <span
                                className="deal-price"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                No budget
                              </span>
                            )}
                            <span className="deal-days" style={{ textTransform: 'capitalize' }}>
                              {lead.source || ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedLead && (
          <div
            className="deal-modal-overlay"
            onClick={() => setSelectedLead(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Deal details"
          >
            <div className="deal-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedLead(null)}>
                ×
              </button>
              <h2>{selectedLead.name}</h2>
              <div className="modal-details">
                {selectedLead.company && (
                  <div className="detail-row">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{selectedLead.company}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Budget</span>
                  <span className="detail-value">
                    {selectedLead.budget ? formatCurrency(selectedLead.budget) : '—'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Stage</span>
                  <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                    {selectedLead.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Source</span>
                  <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                    {selectedLead.source || '—'}
                  </span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setSelectedLead(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Sales Process Guide</h3>
          <div className="process-steps">
            <div className="process-step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>New / Inquiry</h4>
                <p>Initial buyer contact. Qualify the lead, understand requirements and budget.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Viewing</h4>
                <p>
                  Property viewings. Show matching properties, gather feedback, address concerns.
                </p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h4>Negotiating</h4>
                <p>
                  Price negotiation. Facilitate offers between buyer and seller, reach agreement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPipelinePage;
