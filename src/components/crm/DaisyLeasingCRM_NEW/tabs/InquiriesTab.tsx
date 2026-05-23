import React, { useState } from 'react';
import { Phone, Mail, Calendar, Plus } from 'lucide-react';
import { RentalInquiry, InquiryStatus, LEASING_STAGE_LABELS, LeasingStage } from '../data/leasing';

interface InquiriesTabProps {
  inquiries: RentalInquiry[];
}

const STATUS_FILTERS: Array<InquiryStatus | 'all'> = [
  'all',
  'new',
  'viewing_scheduled',
  'offer_made',
  'documents_pending',
  'approved',
  'rejected',
];

const STATUS_COLORS: Record<InquiryStatus, string> = {
  new: '#64748B',
  viewing_scheduled: '#3B82F6',
  offer_made: '#F59E0B',
  documents_pending: '#8B5CF6',
  approved: '#10B981',
  rejected: '#EF4444',
};

const SOURCE_COLORS: Record<string, string> = {
  'Property Finder': '#E31E24',
  'Agent Referral': '#14B8A6',
  Dubizzle: '#F59E0B',
  'WhatsApp Inquiry': '#10B981',
  Website: '#6366F1',
};

const NATIONALITY_FLAGS: Record<string, string> = {
  Chinese: '🇨🇳',
  French: '🇫🇷',
  Pakistani: '🇵🇰',
  Emirati: '🇦🇪',
  Russian: '🇷🇺',
  British: '🇬🇧',
  Indian: '🇮🇳',
  American: '🇺🇸',
};

const InquiriesTab: React.FC<InquiriesTabProps> = ({ inquiries }) => {
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');

  const filtered =
    statusFilter === 'all' ? inquiries : inquiries.filter(inq => inq.status === statusFilter);

  const totalPipeline = inquiries.reduce((sum, inq) => {
    const match = inq.budget.match(/[\d,]+/);
    if (!match) return sum;
    return sum + parseInt(match[0].replace(/,/g, ''), 10);
  }, 0);

  return (
    <div className="inquiries-view">
      <div className="view-header">
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Rental Inquiries</h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {inquiries.length} total · AED {(totalPipeline / 1000).toFixed(0)}K+ pipeline value
          </p>
        </div>
        <button className="add-btn">
          <Plus size={16} /> Add Inquiry
        </button>
      </div>

      <div className="filter-buttons" style={{ marginBottom: '16px' }}>
        {STATUS_FILTERS.map(opt => (
          <button
            key={opt}
            onClick={() => setStatusFilter(opt)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderColor: statusFilter === opt ? '#14B8A6' : 'var(--color-border-default)',
              background: statusFilter === opt ? 'rgba(20,184,166,0.15)' : 'var(--rgba-white-05)',
              color: statusFilter === opt ? '#14B8A6' : 'var(--color-text-secondary)',
            }}
          >
            {opt === 'all' ? 'All' : opt.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="inquiry-cards">
        {filtered.map((inq: RentalInquiry) => {
          const stageLabel =
            LEASING_STAGE_LABELS[inq.leasingStage as LeasingStage] ?? `Stage ${inq.leasingStage}`;
          const stagePct = Math.round((inq.leasingStage / 10) * 100);
          const flag = NATIONALITY_FLAGS[inq.nationality] ?? '🌐';
          const statusColor = STATUS_COLORS[inq.status] ?? '#64748B';
          const sourceColor = SOURCE_COLORS[inq.source] ?? '#64748B';

          return (
            <div key={inq.id} className="inquiry-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--color-text-primary)' }}>
                    {flag} {inq.name}
                  </h4>
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {inq.nationality} · {inq.phone}
                  </p>
                </div>
                <span
                  className={`status-badge ${inq.status}`}
                  style={{
                    background: `${statusColor}22`,
                    color: statusColor,
                    border: `1px solid ${statusColor}44`,
                  }}
                >
                  {inq.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '13px',
                }}
              >
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  🏠 <strong style={{ color: 'var(--color-text-primary)' }}>{inq.property}</strong>
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>🛏 {inq.bedrooms}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>💰 AED {inq.budget}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>📅 {inq.moveInDate}</div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Stage {inq.leasingStage}: {stageLabel}
                  </span>
                  <span style={{ fontSize: '11px', color: '#14B8A6', fontWeight: 600 }}>
                    {stagePct}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: 'var(--rgba-white-10)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${stagePct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #14B8A6 0%, #10B981 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>

              {inq.notes && (
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                    borderLeft: '2px solid var(--rgba-white-10)',
                    paddingLeft: '8px',
                  }}
                >
                  {inq.notes.length > 90 ? `${inq.notes.slice(0, 90)}…` : inq.notes}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${sourceColor}22`,
                    color: sourceColor,
                    border: `1px solid ${sourceColor}44`,
                  }}
                >
                  {inq.source}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  {inq.date}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-default)',
                    background: 'var(--rgba-white-05)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Phone size={12} /> Call
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-default)',
                    background: 'var(--rgba-white-05)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Mail size={12} /> Email
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-default)',
                    background: 'var(--rgba-white-05)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Calendar size={12} /> Schedule
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #14B8A6',
                    background: 'rgba(20,184,166,0.1)',
                    color: '#14B8A6',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginLeft: 'auto',
                  }}
                >
                  Advance ➡
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '40px',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
            }}
          >
            No inquiries match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesTab;
