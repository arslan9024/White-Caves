import React, { useState, useMemo } from 'react';
import { DollarSign, CheckCircle, Clock, X, CreditCard, Filter, Plus, ChevronDown, Users } from 'lucide-react';

export interface Commission {
  id: string;
  agentId?: string;
  agentName?: string;
  agent_name?: string;
  leadId?: string;
  propertyId?: string;
  amount: number;
  percentage?: number;
  type?: string;    // sale, rental, referral
  status: string;   // pending, approved, paid, cancelled
  notes?: string;
  paidAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface CommissionsTabProps {
  commissions: Commission[];
  pendingCommissions: Commission[];
  approvedCommissions: Commission[];
  paidCommissions: Commission[];
  loading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onBulkPay?: (ids: string[]) => void;
  onCreate?: (data: Record<string, unknown>) => void;
  onRefresh?: () => void;
}

const CommissionsTab: React.FC<CommissionsTabProps> = ({
  commissions,
  pendingCommissions,
  approvedCommissions,
  paidCommissions,
  loading = false,
  onApprove,
  onReject,
  onBulkPay,
  onCreate,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Filter commissions
  const filtered = useMemo(() => {
    let result = [...commissions];
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      result = result.filter(c => c.type === typeFilter);
    }
    return result;
  }, [commissions, statusFilter, typeFilter]);

  // Summary stats
  const stats = useMemo(() => ({
    total: commissions.reduce((s, c) => s + (Number(c.amount) || 0), 0),
    pendingTotal: pendingCommissions.reduce((s, c) => s + (Number(c.amount) || 0), 0),
    approvedTotal: approvedCommissions.reduce((s, c) => s + (Number(c.amount) || 0), 0),
    paidTotal: paidCommissions.reduce((s, c) => s + (Number(c.amount) || 0), 0),
  }), [commissions, pendingCommissions, approvedCommissions, paidCommissions]);

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => String(c.id))));
    }
  };

  const handleBulkPay = () => {
    // Only pay approved commissions from selection
    const approvedSelected = [...selectedIds].filter(id =>
      commissions.find(c => String(c.id) === id && c.status === 'approved')
    );
    if (approvedSelected.length > 0 && onBulkPay) {
      onBulkPay(approvedSelected);
      setSelectedIds(new Set());
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="commissions-view">
      {/* Summary Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card" style={{ background: 'var(--color-f0fdf4, #f0fdf4)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign size={18} color="#16a34a" />
            <span style={{ fontSize: '13px', color: 'var(--color-666, #666)' }}>Total Commissions</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-green, #16a34a)' }}>
            AED {stats.total.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-888, #888)', marginTop: '4px' }}>{commissions.length} total</div>
        </div>

        <div className="stat-card" style={{ background: 'var(--color-fef3c7, #fef3c7)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={18} color="#d97706" />
            <span style={{ fontSize: '13px', color: 'var(--color-666, #666)' }}>Pending</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold, #d97706)' }}>
            AED {stats.pendingTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-888, #888)', marginTop: '4px' }}>{pendingCommissions.length} awaiting approval</div>
        </div>

        <div className="stat-card" style={{ background: 'var(--color-dbeafe, #dbeafe)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle size={18} color="#EF4444" />
            <span style={{ fontSize: '13px', color: 'var(--color-666, #666)' }}>Approved</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-blue, #EF4444)' }}>
            AED {stats.approvedTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-888, #888)', marginTop: '4px' }}>{approvedCommissions.length} ready to pay</div>
        </div>

        <div className="stat-card" style={{ background: 'var(--color-f0fdf4, #f0fdf4)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CreditCard size={18} color="#059669" />
            <span style={{ fontSize: '13px', color: 'var(--color-666, #666)' }}>Paid</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-green, #059669)' }}>
            AED {stats.paidTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-888, #888)', marginTop: '4px' }}>{paidCommissions.length} completed</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="tab-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="filter-group" style={{ display: 'flex', gap: '6px' }}>
            <button className={`filter-tag ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All ({commissions.length})</button>
            <button className={`filter-tag ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>Pending ({pendingCommissions.length})</button>
            <button className={`filter-tag ${statusFilter === 'approved' ? 'active' : ''}`} onClick={() => setStatusFilter('approved')}>Approved ({approvedCommissions.length})</button>
            <button className={`filter-tag ${statusFilter === 'paid' ? 'active' : ''}`} onClick={() => setStatusFilter('paid')}>Paid ({paidCommissions.length})</button>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-ddd, #ddd)', fontSize: '13px' }}
          >
            <option value="all">All Types</option>
            <option value="sale">Sale</option>
            <option value="rental">Rental</option>
            <option value="referral">Referral</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {selectedIds.size > 0 && (
            <button
              className="btn-approve"
              onClick={handleBulkPay}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '8px', background: 'var(--accent-green, #059669)', color: 'var(--white, #fff)', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              <CreditCard size={14} />
              Pay Selected ({selectedIds.size})
            </button>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-ddd, #ddd)', background: 'var(--white, #fff)', cursor: 'pointer', fontSize: '13px' }}
            >
              ↻ Refresh
            </button>
          )}
          {onCreate && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '8px', background: 'var(--accent-purple, #7c3aed)', color: 'var(--white, #fff)', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              <Plus size={14} />
              New Commission
            </button>
          )}
        </div>
      </div>

      {/* Commissions Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-888, #888)' }}>Loading commissions...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-888, #888)' }}>
          <DollarSign size={32} color="var(--color-ccc, #ccc)" style={{ marginBottom: '8px' }} />
          <p>No commissions found</p>
          <p style={{ fontSize: '13px' }}>Try changing filters or create a new commission</p>
        </div>
      ) : (
        <table className="expenses-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.size === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Agent</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Rate</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((commission) => (
              <tr key={commission.id} className={`status-${commission.status}`}>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(String(commission.id))}
                    onChange={() => toggleSelect(String(commission.id))}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={14} color="var(--text-secondary, #64748B)" />
                    <span>{commission.agentName || commission.agent_name || 'Unassigned'}</span>
                  </div>
                </td>
                <td>
                  <span className="category-badge" style={{
                    background: commission.type === 'sale' ? 'rgba(239, 68, 68, 0.1)' : commission.type === 'rental' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    color: commission.type === 'sale' ? 'var(--primary-red, #EF4444)' : commission.type === 'rental' ? 'var(--accent-amber, #F59E0B)' : 'var(--accent-purple, #8B5CF6)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    {commission.type || 'sale'}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>
                  AED {Number(commission.amount).toLocaleString()}
                </td>
                <td style={{ color: 'var(--color-888, #888)', fontSize: '13px' }}>
                  {commission.percentage ? `${commission.percentage}%` : '—'}
                </td>
                <td style={{ fontSize: '13px', color: 'var(--color-666, #666)' }}>
                  {formatDate(commission.createdAt)}
                </td>
                <td>
                  <span className={`status-badge status-${commission.status}`} style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: commission.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' :
                      commission.status === 'approved' ? 'rgba(59, 130, 246, 0.15)' :
                      commission.status === 'paid' ? 'rgba(16, 185, 129, 0.15)' :
                      'rgba(239, 68, 68, 0.15)',
                    color: commission.status === 'pending' ? 'var(--accent-amber, #F59E0B)' :
                      commission.status === 'approved' ? 'var(--accent-blue, #3B82F6)' :
                      commission.status === 'paid' ? 'var(--accent-green, #10B981)' :
                      'var(--primary-red, #EF4444)',
                  }}>
                    {commission.status}
                  </span>
                </td>
                <td>
                  <div className="expense-actions" style={{ display: 'flex', gap: '6px' }}>
                    {commission.status === 'pending' && onApprove && (
                      <button
                        className="btn-approve"
                        onClick={() => onApprove(String(commission.id))}
                        title="Approve commission"
                        style={{ background: 'var(--primary-red, #EF4444)', color: 'var(--white, #FFFFFF)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    )}
                    {commission.status === 'pending' && onReject && (
                      <button
                        className="btn-reject"
                        onClick={() => onReject(String(commission.id))}
                        title="Cancel commission"
                        style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--primary-red, #EF4444)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                    {commission.status === 'approved' && onBulkPay && (
                      <button
                        onClick={() => onBulkPay([String(commission.id)])}
                        title="Pay commission"
                        style={{ background: 'var(--accent-green, #10B981)', color: 'var(--white, #FFFFFF)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                      >
                        <CreditCard size={14} />
                        Pay
                      </button>
                    )}
                    {commission.status === 'paid' && (
                      <span style={{ color: 'var(--accent-green, #10B981)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} />
                        {formatDate(commission.paidAt)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Summary footer */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--color-eee, #eee)', marginTop: '8px', fontSize: '13px', color: 'var(--color-666, #666)' }}>
          <span>Showing {filtered.length} of {commissions.length} commissions</span>
          <span style={{ fontWeight: 600 }}>
            Filtered total: AED {filtered.reduce((s, c) => s + (Number(c.amount) || 0), 0).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default CommissionsTab;
