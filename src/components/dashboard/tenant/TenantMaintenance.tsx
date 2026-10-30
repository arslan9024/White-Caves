import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardMaintenanceRequest } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const TenantMaintenance: React.FC = () => {
  const [requests, setRequests] = useState<DashboardMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/maintenance?pageSize=50');
        const json = await res.json();
        setRequests(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch maintenance requests:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔧 Maintenance Requests</h2>
        <p style={S.headerSubtitle}>Submit and track maintenance issues</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button style={S.btnPrimary}>+ New Request</button>
      </div>

      {requests.length === 0 ? (
        S.emptyState(
          '🔧',
          'No maintenance requests',
          'Submit a request when something needs fixing.'
        )
      ) : (
        <div style={S.listGrid}>
          {requests.map(r => (
            <div key={r.id} style={S.card}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
              >
                <h4 style={{ margin: 0 }}>{r.title}</h4>
                <span
                  style={S.badge(
                    r.priority === 'emergency'
                      ? '#EF4444'
                      : r.priority === 'high'
                        ? '#d97706'
                        : '#EF4444',
                    r.priority === 'emergency'
                      ? '#fef2f2'
                      : r.priority === 'high'
                        ? '#fffbeb'
                        : '#dbeafe'
                  )}
                >
                  {S.formatStatus(r.priority)}
                </span>
              </div>
              {r.description && (
                <p style={{ color: 'var(--text-secondary, #6b7280)', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
                  {r.description}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#9ca3af',
                }}
              >
                <span>📅 {S.formatDate(r.createdAt)}</span>
                <span style={S.badge('#EF4444', '#dbeafe')}>{S.formatStatus(r.status)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

