import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardLead } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const SalesLeads: React.FC = () => {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leads?pageSize=50');
        const json = await res.json();
        setLeads(json.data ?? json.leads ?? []);
      } catch (error) {
        log.warn('Failed to fetch leads:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🎯 Sales Leads</h2>
        <p style={S.headerSubtitle}>{leads.length} leads</p>
      </div>
      {leads.length === 0 ? (
        S.emptyState('🎯', 'No leads', 'Leads will appear when potential buyers express interest.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Source</th>
                <th style={S.th}>Property Interest</th>
                <th style={S.th}>Budget</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>
                    <strong>{l.name}</strong>
                  </td>
                  <td style={S.td}>{S.formatStatus(l.source ?? 'direct')}</td>
                  <td style={S.td}>{l.propertyInterest ?? '—'}</td>
                  <td style={S.td}>{S.formatCurrency(l.budget)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        l.status === 'hot'
                          ? '#EF4444'
                          : l.status === 'warm'
                            ? '#d97706'
                            : '#16a34a',
                        l.status === 'hot' ? '#fef2f2' : l.status === 'warm' ? '#fffbeb' : '#dcfce7'
                      )}
                    >
                      {S.formatStatus(l.status ?? 'new')}
                    </span>
                  </td>
                  <td style={S.td}>{S.formatDate(l.lastContactDate ?? l.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

