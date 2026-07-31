import React, { memo, useCallback, useEffect, useState } from 'react';
import { MessageSquare, PhoneCall, ShieldCheck, Workflow } from 'lucide-react';
import InternalModuleMount from './shared/InternalModuleMount';
import { apiClient } from '../../utils/apiClient';

const statCardStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.62)',
  border: '1px solid rgba(37, 211, 102, 0.28)',
  borderRadius: 12,
  padding: 14,
  minHeight: 92,
};

const LindaWhatsAppCRM = memo(() => {
  const [lindaStatus, setLindaStatus] = useState<string>('unknown');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<'start' | 'stop' | null>(null);
  const [controlError, setControlError] = useState<string>('');

  const refreshLindaStatus = useCallback(async (): Promise<void> => {
    try {
      const response = (await apiClient.get('/linda/status')) as {
        success?: boolean;
        data?: { status?: string; isConnected?: boolean };
      };

      const nextStatus = response?.data?.status ?? 'unknown';
      const nextConnected = Boolean(response?.data?.isConnected);

      setLindaStatus(nextStatus);
      setIsConnected(nextConnected);
      setControlError('');
    } catch (error: unknown) {
      setControlError(error instanceof Error ? error.message : 'Failed to load Linda status');
      setLindaStatus('unavailable');
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    void refreshLindaStatus();

    const intervalId = window.setInterval(() => {
      void refreshLindaStatus();
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshLindaStatus]);

  const handleStartLinda = useCallback(async (): Promise<void> => {
    setLoadingAction('start');
    setControlError('');
    try {
      await apiClient.post('/linda/connect', {});
      await refreshLindaStatus();
    } catch (error: unknown) {
      setControlError(error instanceof Error ? error.message : 'Failed to start Linda runtime');
    } finally {
      setLoadingAction(null);
    }
  }, [refreshLindaStatus]);

  const handleStopLinda = useCallback(async (): Promise<void> => {
    setLoadingAction('stop');
    setControlError('');
    try {
      await apiClient.post('/linda/disconnect', {});
      await refreshLindaStatus();
    } catch (error: unknown) {
      setControlError(error instanceof Error ? error.message : 'Failed to stop Linda runtime');
    } finally {
      setLoadingAction(null);
    }
  }, [refreshLindaStatus]);

  const handleToggleLindaRuntime = useCallback(async (): Promise<void> => {
    if (loadingAction !== null) {
      return;
    }

    if (isConnected) {
      await handleStopLinda();
      return;
    }

    await handleStartLinda();
  }, [handleStartLinda, handleStopLinda, isConnected, loadingAction]);

  const fallbackContent = (
    <section aria-label="Linda WhatsApp CRM" style={{ display: 'grid', gap: 16 }}>
      <header
        style={{
          background: 'linear-gradient(135deg, rgba(37,211,102,0.18), rgba(15,23,42,0.72))',
          border: '1px solid rgba(37, 211, 102, 0.32)',
          borderRadius: 14,
          padding: 16,
        }}
      >
        <h2 style={{ margin: 0, color: 'var(--color-ecfdf5, #ECFDF5)' }}>Linda — WhatsApp Command Hub</h2>
        <p style={{ margin: '8px 0 0 0', color: 'var(--color-a7f3d0, #A7F3D0)', fontSize: 13 }}>
          Internal command center for chat routing, lead intake quality, and conversation handoffs.
          Mounted directly in White Caves with no external runtime dependency.
        </p>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <span
            role="status"
            aria-live="polite"
            style={{ color: isConnected ? 'var(--color-86efac, #86EFAC)' : 'var(--color-fca5a5, #FCA5A5)', fontSize: 12, fontWeight: 700 }}
          >
            Linda Runtime: {isConnected ? 'CONNECTED' : lindaStatus.toUpperCase()}
          </span>

          <button
            type="button"
            onClick={() => {
              void handleToggleLindaRuntime();
            }}
            disabled={loadingAction !== null}
            style={{
              background: isConnected ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.25)',
              border: isConnected
                ? '1px solid rgba(248,113,113,0.45)'
                : '1px solid rgba(22,163,74,0.45)',
              color: isConnected ? '#FECACA' : '#DCFCE7',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: loadingAction !== null ? 'not-allowed' : 'pointer',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {loadingAction === 'start'
              ? 'Starting Linda…'
              : loadingAction === 'stop'
                ? 'Stopping Linda…'
                : isConnected
                  ? 'Stop Linda Runtime'
                  : 'Start Linda Runtime'}
          </button>
        </div>

        {controlError && (
          <p style={{ margin: '8px 0 0 0', color: 'var(--color-fca5a5, #FCA5A5)', fontSize: 12 }}>{controlError}</p>
        )}
      </header>

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        <div style={statCardStyle}>
          <MessageSquare size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: 'var(--color-e2e8f0, #E2E8F0)', fontWeight: 600 }}>
            Active Conversations
          </p>
          <strong style={{ color: 'var(--color-86efac, #86EFAC)', fontSize: 24 }}>42</strong>
        </div>
        <div style={statCardStyle}>
          <PhoneCall size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: 'var(--color-e2e8f0, #E2E8F0)', fontWeight: 600 }}>
            Handoffs to Sales
          </p>
          <strong style={{ color: 'var(--color-86efac, #86EFAC)', fontSize: 24 }}>17</strong>
        </div>
        <div style={statCardStyle}>
          <Workflow size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: 'var(--color-e2e8f0, #E2E8F0)', fontWeight: 600 }}>Automation Flows</p>
          <strong style={{ color: 'var(--color-86efac, #86EFAC)', fontSize: 24 }}>11</strong>
        </div>
        <div style={statCardStyle}>
          <ShieldCheck size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: 'var(--color-e2e8f0, #E2E8F0)', fontWeight: 600 }}>
            Policy Compliance
          </p>
          <strong style={{ color: 'var(--color-86efac, #86EFAC)', fontSize: 24 }}>99.1%</strong>
        </div>
      </div>

      <article
        style={{
          background: 'rgba(15, 23, 42, 0.62)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: 12,
          padding: 14,
        }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--color-e2e8f0, #E2E8F0)' }}>Collaboration Contracts</h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-cbd5e1, #CBD5E1)', fontSize: 13, lineHeight: 1.6 }}>
          <li>CONSUMES ← Nina conversation intents, Mary inventory snapshots</li>
          <li>FEEDS → Clara lead qualification stream, Henry immutable audit events</li>
          <li>
            Fallback rule: if confidence &lt; 70%, route to human agent queue in under 2 minutes
          </li>
        </ul>
      </article>
    </section>
  );

  return <InternalModuleMount assistantId="linda" fallback={fallbackContent} />;
});

LindaWhatsAppCRM.displayName = 'LindaWhatsAppCRM';

export default LindaWhatsAppCRM;
