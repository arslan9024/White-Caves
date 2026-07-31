import React, { FC, useEffect, useState } from 'react';
import { ConflictResolution } from '../../utils/offlineCRDT';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ConflictResolutionToastProps {
  syncedCount?: number;
  conflicts?: ConflictResolution[];
  onDismiss?: () => void;
  autoHideDuration?: number;
}

export const ConflictResolutionToast: FC<ConflictResolutionToastProps> = ({
  syncedCount: propSyncedCount = 0,
  conflicts: propConflicts = [],
  onDismiss,
  autoHideDuration = 5000,
}) => {
  const [visible, setVisible] = useState<boolean>(propSyncedCount > 0 || propConflicts.length > 0);
  const [syncedCount, setSyncedCount] = useState<number>(propSyncedCount);
  const [conflicts, setConflicts] = useState<ConflictResolution[]>(propConflicts);

  useEffect(() => {
    if (propSyncedCount > 0 || propConflicts.length > 0) {
      setSyncedCount(propSyncedCount);
      setConflicts(propConflicts);
      setVisible(true);
    }
  }, [propSyncedCount, propConflicts]);

  useEffect(() => {
    const handleOfflineSynced = (e: Event) => {
      const customEvt = e as CustomEvent<{ syncedCount: number; conflicts: ConflictResolution[] }>;
      if (customEvt.detail.syncedCount > 0) {
        setSyncedCount(customEvt.detail.syncedCount);
        setConflicts(customEvt.detail.conflicts);
        setVisible(true);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('offline:synced', handleOfflineSynced);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('offline:synced', handleOfflineSynced);
      }
    };
  }, []);

  useEffect(() => {
    if (visible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHideDuration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: '#FFFBEB',
        border: '1.5px solid #F59E0B',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '420px',
        zIndex: 9999,
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {conflicts.length > 0 ? (
          <AlertTriangle size={20} color="#D97706" />
        ) : (
          <CheckCircle size={20} color="#059669" />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>
          {conflicts.length > 0 ? 'Offline Edits Reconciled' : 'Offline Changes Synced'}
        </h4>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: 'var(--color-475569, #475569)', lineHeight: 1.4 }}>
          {syncedCount} offline action{syncedCount > 1 ? 's' : ''} synchronized with cloud servers.
          {conflicts.length > 0 &&
            ` Auto-resolved ${conflicts.length} concurrent field conflict${conflicts.length > 1 ? 's' : ''} using vector timestamping.`}
        </p>
      </div>

      <button
        onClick={() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#94A3B8',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ConflictResolutionToast;
