import React from 'react';
import { Wifi, Plus, RefreshCw } from 'lucide-react';

export interface DeviceConnectionHeaderProps {
  deviceStatus: 'CONNECTED' | 'PAIRING' | 'DISCONNECTED';
  phoneNumber: string;
  lastCheckedTime: string;
  loadingChats: boolean;
  onNewChat: () => void;
  onSync: () => void;
}

export const DeviceConnectionHeader: React.FC<DeviceConnectionHeaderProps> = ({
  deviceStatus,
  phoneNumber,
  lastCheckedTime,
  loadingChats,
  onNewChat,
  onSync,
}) => {
  return (
    <div
      style={{
        background: deviceStatus === 'CONNECTED' ? '#ECFDF5' : deviceStatus === 'PAIRING' ? '#FFFBEB' : '#FEF2F2',
        border: deviceStatus === 'CONNECTED' ? '1.5px solid #10B981' : deviceStatus === 'PAIRING' ? '1.5px solid #F59E0B' : '1.5px solid #EF4444',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Wifi size={24} color={deviceStatus === 'CONNECTED' ? '#10B981' : deviceStatus === 'PAIRING' ? '#F59E0B' : '#EF4444'} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-1e293b, #1E293B)' }}>
              WhatsApp Account Status:
            </span>
            <span
              style={{
                fontWeight: 900,
                fontSize: '0.82rem',
                padding: '3px 10px',
                borderRadius: '6px',
                background: deviceStatus === 'CONNECTED' ? '#10B981' : deviceStatus === 'PAIRING' ? '#F59E0B' : '#EF4444',
                color: '#FFFFFF',
              }}
            >
              {deviceStatus === 'CONNECTED' ? '🟢 ONLINE & CONNECTED' : deviceStatus === 'PAIRING' ? '🟡 LINKING REQUIRED (PAIRING)' : '🔴 UNLINKED / DISCONNECTED'}
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-475569, #475569)', display: 'block', marginTop: '2px' }}>
            Line: <strong>{phoneNumber}</strong> (Arslan Malik) · Checked: <strong>{lastCheckedTime || 'Just now'}</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={onNewChat}
          style={{
            background: '#06B6D4',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} /> New Live Chat
        </button>
        <button
          onClick={onSync}
          disabled={loadingChats}
          style={{
            background: '#FFFFFF',
            color: '#1E293B',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <RefreshCw size={15} className={loadingChats ? 'spin' : ''} /> {loadingChats ? 'Syncing...' : 'Sync Device Sessions'}
        </button>
      </div>
    </div>
  );
};

