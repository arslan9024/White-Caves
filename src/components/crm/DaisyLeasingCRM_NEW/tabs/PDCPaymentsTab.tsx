import React, { useState } from 'react';
import { PDCCheque, PDCStatus } from '../data/leasing';

interface PDCPaymentsTabProps {
  pdcCheques: PDCCheque[];
  onUpdateStatus: (id: number, status: PDCStatus) => void;
}

const STATUS_FILTERS: Array<PDCStatus | 'all'> = ['all', 'pending', 'presented', 'cleared', 'bounced'];

const STATUS_COLORS: Record<PDCStatus, { bg: string; text: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  presented: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  cleared:   { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  bounced:   { bg: 'rgba(239,68,68,0.15)',  text: '#EF4444' },
};

const isOverdue = (dueDate: string, status: PDCStatus): boolean => {
  if (status !== 'pending') return false;
  return new Date(dueDate) < new Date();
};

const isDueSoon = (dueDate: string, status: PDCStatus): boolean => {
  if (status !== 'pending') return false;
  const due = new Date(dueDate);
  const now = new Date();
  if (due < now) return false;
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};

const PDCPaymentsTab: React.FC<PDCPaymentsTabProps> = ({ pdcCheques, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState<PDCStatus | 'all'>('all');
  const [localCheques, setLocalCheques] = useState<PDCCheque[]>(pdcCheques);

  const handleUpdate = (id: number, status: PDCStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setLocalCheques(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status,
        presentedDate: status === 'presented' ? today : c.presentedDate,
        clearedDate:   status === 'cleared'   ? today : c.clearedDate,
      };
    }));
    onUpdateStatus(id, status);
  };

  const filtered = filterStatus === 'all'
    ? localCheques
    : localCheques.filter(c => c.status === filterStatus);

  const stats = {
    total:     localCheques.length,
    cleared:   localCheques.filter(c => c.status === 'cleared').length,
    presented: localCheques.filter(c => c.status === 'presented').length,
    pending:   localCheques.filter(c => c.status === 'pending').length,
    bounced:   localCheques.filter(c => c.status === 'bounced').length,
  };

  const totalValue = localCheques.reduce((s, c) => s + c.amount, 0);
  const clearedValue = localCheques.filter(c => c.status === 'cleared').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="pdc-view">
      <div className="view-header" style={{ marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>PDC Cheque Management</h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {stats.total} cheques · AED {totalValue.toLocaleString()} total · AED {clearedValue.toLocaleString()} cleared
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total',     value: stats.total,     color: '#94A3B8' },
          { label: 'Cleared',   value: stats.cleared,   color: '#10B981' },
          { label: 'Presented', value: stats.presented, color: '#60A5FA' },
          { label: 'Pending',   value: stats.pending,   color: '#F59E0B' },
          { label: 'Bounced',   value: stats.bounced,   color: '#EF4444' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--rgba-white-05)', border: '1px solid var(--rgba-white-10)',
            borderRadius: '10px', padding: '14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-buttons" style={{ marginBottom: '16px' }}>
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: '1px solid', fontSize: '13px', cursor: 'pointer',
              borderColor: filterStatus === f ? '#14B8A6' : 'var(--color-border-default)',
              background: filterStatus === f ? 'rgba(20,184,166,0.15)' : 'var(--rgba-white-05)',
              color: filterStatus === f ? '#14B8A6' : 'var(--color-text-secondary)',
            }}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '700px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1.2fr 0.8fr 1fr 1fr 1fr 1.2fr',
            padding: '10px 14px',
            background: 'var(--rgba-white-05)',
            borderRadius: '8px 8px 0 0',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            borderBottom: '1px solid var(--rgba-white-10)',
          }}>
            <span>Cheque #</span>
            <span>Bank</span>
            <span>Tenant</span>
            <span>Unit</span>
            <span>Amount (AED)</span>
            <span>Due Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.map((cheque: PDCCheque) => {
            const sCol = STATUS_COLORS[cheque.status];
            const overdue = isOverdue(cheque.dueDate, cheque.status);
            const dueSoon = isDueSoon(cheque.dueDate, cheque.status);

            let rowBg = 'transparent';
            if (cheque.status === 'bounced') rowBg = 'rgba(239,68,68,0.07)';
            else if (overdue) rowBg = 'rgba(239,68,68,0.05)';
            else if (dueSoon) rowBg = 'rgba(245,158,11,0.06)';

            return (
              <div key={cheque.id} style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr 1.2fr 0.8fr 1fr 1fr 1fr 1.2fr',
                padding: '12px 14px',
                borderBottom: '1px solid var(--rgba-white-10)',
                fontSize: '13px',
                alignItems: 'center',
                background: rowBg,
                transition: 'background 0.15s',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-primary)' }}>
                  {cheque.chequeNumber}
                </span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>{cheque.bankName}</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{cheque.tenantName}</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>{cheque.unit}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {cheque.amount.toLocaleString()}
                </span>
                <span style={{ color: overdue ? '#EF4444' : dueSoon ? '#F59E0B' : 'var(--color-text-secondary)', fontSize: '12px' }}>
                  {cheque.dueDate}
                  {overdue && <span style={{ marginLeft: '4px', fontSize: '10px' }}>🔴 Overdue</span>}
                  {dueSoon && !overdue && <span style={{ marginLeft: '4px', fontSize: '10px' }}>⚠️ Soon</span>}
                </span>
                <span>
                  {cheque.status === 'bounced' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: sCol.bg, color: sCol.text }}>
                      ⚠️ Bounced
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: sCol.bg, color: sCol.text }}>
                      {cheque.status}
                    </span>
                  )}
                </span>
                <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {cheque.status === 'pending' && (
                    <button onClick={() => handleUpdate(cheque.id, 'presented')}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #60A5FA', background: 'rgba(59,130,246,0.1)', color: '#60A5FA', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Mark Presented
                    </button>
                  )}
                  {cheque.status === 'presented' && (
                    <>
                      <button onClick={() => handleUpdate(cheque.id, 'cleared')}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #10B981', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Mark Cleared
                      </button>
                      <button onClick={() => handleUpdate(cheque.id, 'bounced')}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #EF4444', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Mark Bounced
                      </button>
                    </>
                  )}
                  {cheque.status === 'bounced' && (
                    <button style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #F59E0B', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Request Replacement
                    </button>
                  )}
                  {cheque.notes && (
                    <span title={cheque.notes} style={{ fontSize: '11px', color: '#64748B', cursor: 'help' }}>📝</span>
                  )}
                </span>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '14px', background: 'var(--rgba-white-05)', borderRadius: '0 0 8px 8px' }}>
              No cheques match the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDCPaymentsTab;
