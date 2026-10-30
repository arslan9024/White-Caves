import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardLead } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const SellerInquiries: React.FC = () => {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leads?source=inquiry&pageSize=50');
        const json = await res.json();
        setLeads(json.data ?? json.leads ?? []);
      } catch (error) { log.warn('Failed to fetch seller inquiries:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📞 Inquiries</h2>
        <p style={S.headerSubtitle}>{leads.length} buyer {leads.length === 1 ? 'inquiry' : 'inquiries'}</p>
      </div>
      {leads.length === 0
        ? S.emptyState('📞', 'No inquiries yet', 'Inquiries from interested buyers will appear here.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Contact</th>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Score</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td style={S.td}>
                      <strong>{l.name || l.contactName || '—'}</strong>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #6b7280)' }}>{l.email || l.phone || '—'}</span>
                    </td>
                    <td style={S.td}>{l.property?.title ?? l.propertyId ?? '—'}</td>
                    <td style={S.td}>
                      <span style={S.badge('#d97706', '#fffbeb')}>{l.score ?? 0}/100</span>
                    </td>
                    <td style={S.td}>
                      <span style={S.badge('#EF4444', '#dbeafe')}>{S.formatStatus(l.status)}</span>
                    </td>
                    <td style={S.td}>{S.formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};
