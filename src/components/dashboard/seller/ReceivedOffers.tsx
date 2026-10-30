import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardOffer } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const ReceivedOffers: React.FC = () => {
  const [offers, setOffers] = useState<DashboardOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers?role=seller&pageSize=50');
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch (error) { log.warn('Failed to fetch seller offers:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const statusColor = (s: string) => {
    if (s === 'accepted') return { c: '#16a34a', bg: '#dcfce7' };
    if (s === 'rejected' || s === 'expired') return { c: '#EF4444', bg: '#fef2f2' };
    if (s === 'countered') return { c: '#d97706', bg: '#fffbeb' };
    return { c: '#EF4444', bg: '#dbeafe' };
  };

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🤝 Received Offers</h2>
        <p style={S.headerSubtitle}>{offers.length} {offers.length === 1 ? 'offer' : 'offers'} on your properties</p>
      </div>
      {offers.length === 0
        ? S.emptyState('🤝', 'No offers received', 'Offers from buyers will appear here when they submit them.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Buyer</th>
                  <th style={S.th}>Offer Amount</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => {
                  const sc = statusColor(o.status ?? '');
                  return (
                    <tr key={o.id}>
                      <td style={S.td}>{o.property?.title ?? '—'}</td>
                      <td style={S.td}>{o.buyer?.name ?? '—'}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(o.amount)}</td>
                      <td style={S.td}>
                        <span style={S.badge(sc.c, sc.bg)}>{S.formatStatus(o.status)}</span>
                      </td>
                      <td style={S.td}>{S.formatDate(o.createdAt)}</td>
                      <td style={S.td}>
                        {o.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{ ...S.btnPrimary, padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Accept</button>
                            <button style={{ ...S.btnSecondary, padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Counter</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

