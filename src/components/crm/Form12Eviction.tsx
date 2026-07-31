import React, { useState } from 'react';

export interface Form12EvictionRecord {
  id: string;
  propertyTitle: string;
  tenantName: string;
  notaryReference: string;
  servedDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'SERVED' | '90_DAY_WARNING' | '30_DAY_WARNING' | 'EXPIRED' | 'VACATED';
}

export const Form12Eviction: React.FC = () => {
  const [records, setRecords] = useState<Form12EvictionRecord[]>([
    {
      id: 'F12-001',
      propertyTitle: 'Villa 142 - DAMAC Hills 2 (Akoya)',
      tenantName: 'Mohammed Al-Hashimi',
      notaryReference: 'DXB-NOTARY-2025-8841',
      servedDate: '2025-09-01',
      expiryDate: '2026-09-01',
      daysRemaining: 32,
      status: '30_DAY_WARNING',
    },
    {
      id: 'F12-002',
      propertyTitle: 'Apartment 408 - Marina Gate 1',
      tenantName: 'Alexander Petrov',
      notaryReference: 'DXB-NOTARY-2025-9102',
      servedDate: '2025-11-15',
      expiryDate: '2026-11-15',
      daysRemaining: 107,
      status: 'SERVED',
    },
  ]);

  const [notificationLog, setNotificationLog] = useState<string[]>([]);

  const triggerStatutoryReminder = (id: string) => {
    const target = records.find(r => r.id === id);
    if (!target) return;
    const logEntry = `[${new Date().toLocaleTimeString()}] Statutory Form 12 Reminder dispatched via WhatsApp & Email to ${target.tenantName} (${target.propertyTitle}). ${target.daysRemaining} days remaining until eviction deadline.`;
    setNotificationLog(prev => [logEntry, ...prev]);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-1e293b, #1E293B)', fontSize: '18px', fontWeight: 'bold' }}>Form 12 Eviction Notice Timeline</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary, #64748B)', fontSize: '13px' }}>
            Statutory 12-Month Notice Tracking under Dubai Law No. 33 of 2008 (Notary Public Served Notices)
          </p>
        </div>
        <div style={{ padding: '6px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red, #EF4444)', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
          RERA Statutory Tracker
        </div>
      </div>

      {/* Eviction Records Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '2px solid var(--text-secondary, #E2E8F0)', textAlign: 'left', color: 'var(--color-475569, #475569)' }}>
            <th style={{ padding: '10px 12px' }}>Notice ID</th>
            <th style={{ padding: '10px 12px' }}>Property & Tenant</th>
            <th style={{ padding: '10px 12px' }}>Notary Ref</th>
            <th style={{ padding: '10px 12px' }}>Served Date</th>
            <th style={{ padding: '10px 12px' }}>Expiry Date</th>
            <th style={{ padding: '10px 12px' }}>Days Left</th>
            <th style={{ padding: '10px 12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent-red, #EF4444)', fontFamily: 'monospace' }}>{r.id}</td>
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: '600', color: 'var(--color-1e293b, #1E293B)' }}>{r.propertyTitle}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>{r.tenantName}</div>
              </td>
              <td style={{ padding: '12px', color: 'var(--color-475569, #475569)', fontFamily: 'monospace' }}>{r.notaryReference}</td>
              <td style={{ padding: '12px', color: 'var(--color-475569, #475569)' }}>{r.servedDate}</td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>{r.expiryDate}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: r.daysRemaining < 60 ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-f1f5f9, #F1F5F9)', color: r.daysRemaining < 60 ? 'var(--accent-red, #EF4444)' : 'var(--color-1e293b, #1E293B)', fontWeight: 'bold', fontSize: '11px' }}>
                  {r.daysRemaining} Days
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => triggerStatutoryReminder(r.id)}
                  style={{ padding: '6px 12px', backgroundColor: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Send Notice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Notification Log Console */}
      {notificationLog.length > 0 && (
        <div style={{ backgroundColor: 'var(--color-0f172a, #0F172A)', color: 'var(--color-38bdf8, #38BDF8)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
          <div style={{ color: 'var(--color-94a3b8, #94A3B8)', marginBottom: '8px', fontWeight: 'bold' }}>📡 STATUTORY NOTIFICATION DISPATCH LOG:</div>
          {notificationLog.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '4px' }}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Form12Eviction;
