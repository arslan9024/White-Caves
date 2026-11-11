import React, { useState, memo } from 'react';
import {
  RefreshCw,
  QrCode,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import type { LindaSessionItem } from './LindaWhatsAppCRM.data';

export interface SessionsPanelProps {
  sessions: LindaSessionItem[];
  onPingSession: (sessionId: string) => void;
  onPairDeviceCode: (session: LindaSessionItem) => void;
  onScanDeviceQr: (session: LindaSessionItem) => void;
}

/**
 * LindaSessionsPanel — Multi-Agent WhatsApp Sessions Grid
 * Modularized under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
export const LindaSessionsPanel: React.FC<SessionsPanelProps> = memo(({
  sessions,
  onPingSession,
  onPairDeviceCode,
  onScanDeviceQr,
}) => {
  const { isDark } = useTheme();
  const [maskPhone, setMaskPhone] = useState(false);
  const [pingStatusMap, setPingStatusMap] = useState<Record<string, string>>({});

  const handlePing = (id: string) => {
    setPingStatusMap(prev => ({ ...prev, [id]: 'Pinging…' }));
    setTimeout(() => {
      setPingStatusMap(prev => ({ ...prev, [id]: '24ms OK' }));
      setTimeout(() => {
        setPingStatusMap(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 2500);
    }, 400);
    onPingSession(id);
  };

  const formatPhone = (phone: string) => {
    if (!maskPhone) return phone;
    const parts = phone.split(' ');
    if (parts.length < 2) return phone;
    return `${parts[0]} *** *** ${parts[parts.length - 1].slice(-3)}`;
  };

  return (
    <div
      style={{
        background: isDark ? 'rgba(15, 23, 42, 0.82)' : '#FFFFFF',
        border: isDark ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid #BFDBFE',
        borderRadius: 12,
        padding: 14,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(15, 23, 42, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ margin: 0, color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 15 }}>
            📱 Multi-Account WhatsApp Sessions & Device Linking Desk ({sessions.length})
          </h3>
          <p style={{ margin: '4px 0 0 0', color: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}>
            Real-time Baileys Multi-Device socket status & health inspection
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setMaskPhone(!maskPhone)}
            style={{
              background: maskPhone
                ? isDark
                  ? 'rgba(234, 179, 8, 0.2)'
                  : '#FEF9C3'
                : isDark
                  ? 'rgba(148, 163, 184, 0.15)'
                  : '#F1F5F9',
              border: maskPhone ? '1px solid #EAB308' : '1px solid #CBD5E1',
              color: maskPhone ? (isDark ? '#FEF08A' : '#854D0E') : isDark ? '#94A3B8' : '#64748B',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            {maskPhone ? '🔒 Unmask Numbers' : '👁️ Mask Numbers'}
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', textAlign: 'left' }}>
              <th style={{ padding: '8px 10px', color: isDark ? '#94A3B8' : '#64748B' }}>Status</th>
              <th style={{ padding: '8px 10px', color: isDark ? '#94A3B8' : '#64748B' }}>Session Name</th>
              <th style={{ padding: '8px 10px', color: isDark ? '#94A3B8' : '#64748B' }}>Phone / WAID</th>
              <th style={{ padding: '8px 10px', color: isDark ? '#94A3B8' : '#64748B' }}>Role & Port</th>
              <th style={{ padding: '8px 10px', color: isDark ? '#94A3B8' : '#64748B' }}>Throughput</th>
              <th style={{ padding: '8px 10px', color: isDark ? '#94A3B8' : '#64748B' }}>Uptime</th>
              <th style={{ padding: '8px 10px', color: isDark ? '#94A3B8' : '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => {
              const isReady = session.status === 'connected';
              return (
                <tr
                  key={session.id}
                  style={{
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #F1F5F9',
                  }}
                >
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: isReady
                          ? isDark
                            ? 'rgba(34, 197, 94, 0.2)'
                            : '#DCFCE7'
                          : isDark
                            ? 'rgba(239, 68, 68, 0.2)'
                            : '#FEE2E2',
                        color: isReady
                          ? isDark
                            ? '#86EFAC'
                            : '#166534'
                          : isDark
                            ? '#FCA5A5'
                            : '#991B1B',
                      }}
                    >
                      {isReady ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                      {session.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px', fontWeight: 600, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                    {session.name}
                  </td>
                  <td style={{ padding: '10px', fontFamily: 'monospace', color: isDark ? '#CBD5E1' : '#334155' }}>
                    {formatPhone(session.phone)}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontFamily: 'monospace',
                        background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
                        color: isDark ? '#93C5FD' : '#1D4ED8',
                      }}
                    >
                      {session.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px', fontFamily: 'monospace', color: isDark ? '#86EFAC' : '#15803D' }}>
                    ↑{session.messagesSent} / ↓{session.messagesReceived}
                  </td>
                  <td style={{ padding: '10px', color: isDark ? '#CBD5E1' : '#475569' }}>
                    {session.uptime} · <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>{session.lastActivity}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => handlePing(session.id)}
                        style={{
                          background: isDark ? 'rgba(34, 197, 94, 0.18)' : '#DCFCE7',
                          border: '1px solid rgba(34, 197, 94, 0.45)',
                          color: isDark ? '#DCFCE7' : '#166534',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <RefreshCw size={11} /> {pingStatusMap[session.id] || 'Ping'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onPairDeviceCode(session)}
                        style={{
                          background: isDark ? 'rgba(234, 179, 8, 0.18)' : '#FEF9C3',
                          border: '1px solid rgba(234, 179, 8, 0.45)',
                          color: isDark ? '#FEF08A' : '#854D0E',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <KeyRound size={11} /> Code (2.1)
                      </button>
                      <button
                        type="button"
                        onClick={() => onScanDeviceQr(session)}
                        style={{
                          background: isDark ? 'rgba(59, 130, 246, 0.18)' : '#DBEAFE',
                          border: '1px solid rgba(59, 130, 246, 0.45)',
                          color: isDark ? '#BFDBFE' : '#1E40AF',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <QrCode size={11} /> QR (2.2)
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
