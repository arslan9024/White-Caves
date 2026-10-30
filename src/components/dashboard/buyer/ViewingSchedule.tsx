import React, { useEffect, useState, useCallback } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import { settledJson } from '../../../utils/settledJson';
import type { DashboardViewing } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const ViewingSchedule: React.FC = () => {
  const [viewings, setViewings] = useState<DashboardViewing[]>([]);
  const [appointments, setAppointments] = useState<DashboardViewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    propertyId: '',
    scheduledAt: '',
    type: 'in_person' as 'in_person' | 'virtual',
  });

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const [viewingsRes, appointmentsRes] = (await settledJson(
        [authFetch('/api/viewings?pageSize=50'), authFetch('/api/appointments')],
        [{ data: [] }, { data: [] }]
      )) as [{ data?: DashboardViewing[] }, { data?: DashboardViewing[] }];

      setViewings(viewingsRes.data ?? []);
      setAppointments(appointmentsRes.data ?? []);
    } catch (error) {
      log.warn('Failed to fetch viewing schedule:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSchedule();
  }, [loadSchedule]);

  const scheduleAppointment = useCallback(async () => {
    setScheduleError(null);
    setScheduleSuccess(null);

    if (!form.propertyId.trim() || !form.scheduledAt.trim()) {
      setScheduleError('Property ID and date/time are required.');
      return;
    }

    setSaving(true);
    try {
      const response = await authFetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: form.propertyId.trim(),
          scheduledAt: form.scheduledAt,
          type: form.type,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setScheduleError(payload.error || 'Failed to schedule appointment.');
        return;
      }

      setScheduleSuccess('Appointment scheduled successfully.');
      setForm({ propertyId: '', scheduledAt: '', type: 'in_person' });
      await loadSchedule();
    } catch (error) {
      log.warn('Failed to schedule appointment:', error);
      setScheduleError('Failed to schedule appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [form, loadSchedule]);

  const combinedViewings: DashboardViewing[] = [...appointments, ...viewings];

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>👁️ Viewing Schedule</h2>
        <p style={S.headerSubtitle}>Manage your property viewing appointments</p>
      </div>

      <div style={{ ...S.card, marginBottom: '1rem' }}>
        <h3 style={S.cardTitle}>➕ Schedule Appointment</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '0.5rem',
            alignItems: 'end',
          }}
        >
          <div>
            <label style={{ ...S.headerSubtitle, display: 'block' }}>Property ID</label>
            <input
              type="text"
              value={form.propertyId}
              onChange={event => setForm(prev => ({ ...prev, propertyId: event.target.value }))}
              placeholder="property_123"
              data-testid="buyer-appointment-property-id"
            />
          </div>
          <div>
            <label style={{ ...S.headerSubtitle, display: 'block' }}>Date & Time</label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={event => setForm(prev => ({ ...prev, scheduledAt: event.target.value }))}
              data-testid="buyer-appointment-datetime"
            />
          </div>
          <div>
            <label style={{ ...S.headerSubtitle, display: 'block' }}>Type</label>
            <select
              value={form.type}
              onChange={event =>
                setForm(prev => ({ ...prev, type: event.target.value as 'in_person' | 'virtual' }))
              }
              data-testid="buyer-appointment-type"
            >
              <option value="in_person">In Person</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => void scheduleAppointment()}
            disabled={saving}
            data-testid="buyer-appointment-submit"
          >
            {saving ? 'Scheduling…' : 'Schedule'}
          </button>
        </div>
        {scheduleError && <p style={{ color: 'var(--accent-red, #EF4444)', marginTop: '0.5rem' }}>{scheduleError}</p>}
        {scheduleSuccess && (
          <p style={{ color: 'var(--accent-green, #16a34a)', marginTop: '0.5rem' }}>{scheduleSuccess}</p>
        )}
      </div>

      {combinedViewings.length === 0 ? (
        S.emptyState('👁️', 'No viewings scheduled', 'Request a viewing from any property listing.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Agent</th>
                <th style={S.th}>Date</th>
                <th style={S.th}>Time</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {combinedViewings.map(v => (
                <tr key={v.id}>
                  <td style={S.td}>{v.property?.title ?? v.propertyId}</td>
                  <td style={S.td}>{v.agent?.name ?? '—'}</td>
                  <td style={S.td}>{S.formatDate(v.scheduledAt)}</td>
                  <td style={S.td}>
                    {v.scheduledAt
                      ? new Date(v.scheduledAt).toLocaleTimeString('en-AE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        v.status === 'completed' ? '#16a34a' : '#EF4444',
                        v.status === 'completed' ? '#dcfce7' : '#dbeafe'
                      )}
                    >
                      {S.formatStatus(v.status)}
                    </span>
                  </td>
                  <td style={S.td}>{v.rating ? `${'⭐'.repeat(v.rating)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

