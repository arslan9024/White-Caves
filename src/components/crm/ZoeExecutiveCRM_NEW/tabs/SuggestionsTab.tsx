import React, { memo } from 'react';
import { Search, Plus, Filter, AlertCircle, CheckCircle, Clock, TrendingUp, Lightbulb, AlertTriangle, DollarSign } from 'lucide-react';

interface Suggestion {
  id: string;
  title?: string;
  description?: string;
  type: string;
  priority?: string;
}

interface SuggestionsTabProps {
  suggestions: Suggestion[];
  unreviewedCount: number;
  criticalCount: number;
  onStatusChange: (id: string, status: string) => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  process_improvement: TrendingUp,
  new_opportunity: Lightbulb,
  risk_alert: AlertTriangle,
  cost_saving: DollarSign
};

import React, { memo, useState } from 'react';
import {
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  DollarSign,
  Send,
  X,
  Share2,
} from 'lucide-react';

interface Suggestion {
  id: string;
  title?: string;
  description?: string;
  type: string;
  priority?: string;
}

interface SuggestionsTabProps {
  suggestions: Suggestion[];
  unreviewedCount: number;
  criticalCount: number;
  onStatusChange: (id: string, status: string) => void;
  onDelegateToDept?: (suggestionId: string, deptCode: string, note: string) => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  process_improvement: TrendingUp,
  new_opportunity: Lightbulb,
  risk_alert: AlertTriangle,
  cost_saving: DollarSign,
};

const CORPORATE_DEPTS = [
  { code: 'DEPT-12', name: 'Executive, Governance & Strategy (AI Zayed)' },
  { code: 'DEPT-11', name: 'Legal, Compliance & Audit (AI Sofia)' },
  { code: 'DEPT-10', name: 'Accounting, Finance & Tax (AI Theodora)' },
  { code: 'DEPT-09', name: 'Research & Market Intelligence (AI Elena)' },
  { code: 'DEPT-08', name: 'Media & Public Relations (AI Maya)' },
  { code: 'DEPT-07', name: 'Partnerships & Capital Growth (AI Maktoum)' },
  { code: 'DEPT-06', name: 'Inventory & Asset Management (AI Sentinel)' },
  { code: 'DEPT-05', name: 'Sales & Deal Operations (AI Clara)' },
  { code: 'DEPT-04', name: 'Technology & Digital Infrastructure (AI Aurora)' },
  { code: 'DEPT-03', name: 'Human Resources & Performance (AI Selena)' },
  { code: 'DEPT-02', name: 'Marketing & Brand Acquisition (AI Olivia)' },
  { code: 'DEPT-01', name: 'Customer Experience & Concierge (AI Corinne)' },
];

const SuggestionsTab: React.FC<SuggestionsTabProps> = memo(
  ({ suggestions, unreviewedCount, criticalCount, onStatusChange, onDelegateToDept }) => {
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [selectedDept, setSelectedDept] = useState('DEPT-05');
    const [delegationNote, setDelegationNote] = useState('');
    const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

    const handleOpenDelegateModal = (s: Suggestion) => {
      setSelectedSuggestion(s);
      setDelegationNote(`AI Zoe Executive Directive: Dispatching strategic item "${s.title || 'Untitled'}" for immediate execution.`);
    };

    const handleConfirmDelegation = () => {
      if (!selectedSuggestion) return;
      if (onDelegateToDept) {
        onDelegateToDept(selectedSuggestion.id, selectedDept, delegationNote);
      }
      onStatusChange(selectedSuggestion.id, 'reviewed');
      setFeedbackToast(`Successfully delegated to ${selectedDept}!`);
      setTimeout(() => setFeedbackToast(null), 3000);
      setSelectedSuggestion(null);
    };

    return (
      <div className="suggestions-view" style={{ position: 'relative' }}>
        {feedbackToast && (
          <div
            data-testid="delegation-toast"
            style={{
              padding: '10px 16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              color: '#10B981',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle size={16} />
            <span>{feedbackToast}</span>
          </div>
        )}

        <div className="view-header">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search suggestions..." aria-label="Search suggestions" />
          </div>
          <div className="filter-buttons">
            <button className="filter-btn">
              <AlertCircle size={14} /> Critical ({criticalCount})
            </button>
            <button className="filter-btn">
              <Clock size={14} /> Unreviewed ({unreviewedCount})
            </button>
          </div>
        </div>

        <div className="suggestions-list">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((suggestion: Suggestion) => {
              const IconComponent = TYPE_ICONS[suggestion.type] || TrendingUp;
              return (
                <div key={suggestion.id} className={`suggestion-card ${suggestion.priority}`}>
                  <div className="suggestion-header">
                    <div className="suggestion-icon">
                      <IconComponent size={20} />
                    </div>
                    <div className="suggestion-info">
                      <h4>{suggestion.title || 'Untitled Suggestion'}</h4>
                      <p>{suggestion.description || 'No description provided'}</p>
                    </div>
                  </div>
                  <div className="suggestion-footer">
                    <span className="priority-badge">{suggestion.priority || 'medium'}</span>
                    <div className="suggestion-actions" style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenDelegateModal(suggestion)}
                        data-testid={`delegate-btn-${suggestion.id}`}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                        }}
                      >
                        <Share2 size={13} /> Delegate
                      </button>
                      <button onClick={() => onStatusChange(suggestion.id, 'reviewed')}>
                        <CheckCircle size={14} /> Review
                      </button>
                      <button onClick={() => onStatusChange(suggestion.id, 'archived')}>
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <p>No suggestions available</p>
            </div>
          )}
        </div>

        {/* ── Zoe 1-Click Executive Delegation Modal ──────────────────────── */}
        {selectedSuggestion && (
          <div
            data-testid="zoe-delegation-modal"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(2, 6, 23, 0.8)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: '480px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                padding: '24px',
                color: '#F8FAFC',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={18} color="#EF4444" />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                    Zoe Executive Delegation
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '14px' }}>
                Dispatching proposal: <strong>{selectedSuggestion.title}</strong>
              </div>

              <label
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Target Department C-Level Director
              </label>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                data-testid="delegation-dept-select"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  fontSize: '0.8rem',
                  marginBottom: '14px',
                }}
              >
                {CORPORATE_DEPTS.map(d => (
                  <option key={d.code} value={d.code}>
                    {d.code} · {d.name}
                  </option>
                ))}
              </select>

              <label
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Executive Directive & SLA Notes
              </label>
              <textarea
                rows={3}
                value={delegationNote}
                onChange={e => setDelegationNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  fontSize: '0.8rem',
                  marginBottom: '20px',
                  resize: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedSuggestion(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: '1px solid #475569',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-testid="confirm-delegation-btn"
                  onClick={handleConfirmDelegation}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    background: '#EF4444',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Send size={13} />
                  <span>Dispatch Directive</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default SuggestionsTab;
