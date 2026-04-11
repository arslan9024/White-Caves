/**
 * Queue Manager Panel - Display queue and assign agents
 */

import React, { useCallback, useState } from 'react';
import { useAppDispatch } from '@/store/store';
import { assignAgent } from '@/store/slices/nadiaSlice';
import { QueuedConversation, QueueStats } from '@/types/nadia';
import {
  QueueManagerContainer,
  QueueManagerHeader,
  QueueStats as QueueStatsContainer,
  StatItem,
  QueueManagerScroll,
  QueueItemContainer,
  QueueItemHeader,
  QueueItemName,
  QueueItemMeta,
  PriorityBadge,
  AssignAgentForm,
  AssignAgentInput,
  AssignButtonSmall,
  LoadingSpinner,
  EmptyState,
} from './nadia.styles';

interface QueueManagerPanelProps {
  queue: QueuedConversation[];
  stats: QueueStats;
  loading?: boolean;
}

const QueueManagerPanel: React.FC<QueueManagerPanelProps> = ({
  queue,
  stats,
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [agentPhones, setAgentPhones] = useState<Record<string, string>>({});
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assigningQueue, setAssigningQueue] = useState(false);

  /**
   * Handle agent assignment
   */
  const handleAssignAgent = useCallback(
    (queueId: string, agentPhone: string) => async (e: React.FormEvent) => {
      e.preventDefault();
      setAssignError(null);

      if (!agentPhone.trim()) {
        setAssignError('Agent phone is required');
        return;
      }

      if (!/^\+?\d{10,}$/.test(agentPhone)) {
        setAssignError('Invalid phone number format');
        return;
      }

      setAssigningQueue(true);
      try {
        await dispatch(
          assignAgent({
            queueId,
            agentPhone: agentPhone.trim(),
          })
        ).unwrap();
        setAgentPhones((prev) => {
          const next = { ...prev };
          delete next[queueId];
          return next;
        });
      } catch (error) {
        setAssignError(error instanceof Error ? error.message : 'Failed to assign agent');
      } finally {
        setAssigningQueue(false);
      }
    },
    [dispatch]
  );

  /**
   * Update agent phone for a queue item
   */
  const handlePhoneChange = (queueId: string, phone: string) => {
    setAgentPhones((prev) => ({
      ...prev,
      [queueId]: phone,
    }));
  };

  return (
    <QueueManagerContainer>
      {/* Header */}
      <QueueManagerHeader>
        <h3>📊 Queue Management</h3>

        {/* Stats Grid */}
        <QueueStatsContainer>
          <StatItem>
            <span>Total Queued</span>
            <span>{stats.totalQueued}</span>
          </StatItem>
          <StatItem>
            <span>🔴 Urgent</span>
            <span>{stats.byPriority.URGENT}</span>
          </StatItem>
          <StatItem>
            <span>🟠 High</span>
            <span>{stats.byPriority.HIGH}</span>
          </StatItem>
          <StatItem>
            <span>🟡 Normal</span>
            <span>{stats.byPriority.NORMAL}</span>
          </StatItem>
          <StatItem>
            <span>Avg Response</span>
            <span>{stats.avgResponseTimeMinutes}m</span>
          </StatItem>
          <StatItem>
            <span>Oldest Wait</span>
            <span>{stats.oldestInQueueMinutes}m</span>
          </StatItem>
        </QueueStatsContainer>
      </QueueManagerHeader>

      {/* Queue Items */}
      <QueueManagerScroll>
        {assignError && (
          <div
            style={{
              padding: '8px 12px',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '6px',
              fontSize: '12px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            role="alert"
          >
            <span>⚠️ {assignError}</span>
            <button
              onClick={() => setAssignError(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {loading && queue.length === 0 ? (
          <LoadingSpinner />
        ) : queue.length === 0 ? (
          <EmptyState>
            <p>Queue is empty</p>
          </EmptyState>
        ) : (
          queue.map((queueItem, index) => (
            <QueueItemContainer key={queueItem.queueId}>
              <QueueItemHeader>
                <div>
                  <QueueItemName>
                    {index + 1}. {queueItem.customerName || queueItem.customerPhone}
                  </QueueItemName>
                  <QueueItemMeta>{queueItem.customerPhone}</QueueItemMeta>
                </div>
                <PriorityBadge priority={queueItem.priority}>
                  {queueItem.priority}
                </PriorityBadge>
              </QueueItemHeader>

              {/* Meta info */}
              <QueueItemMeta style={{ marginBottom: '8px' }}>
                Wait: {queueItem.waitTimeMinutes}m • Score: {queueItem.leadScore}/100
              </QueueItemMeta>

              {/* Agent assignment form */}
              <AssignAgentForm
                onSubmit={handleAssignAgent(
                  queueItem.queueId,
                  agentPhones[queueItem.queueId] || ''
                )}
              >
                <AssignAgentInput
                  type="tel"
                  placeholder="+971501234567"
                  value={agentPhones[queueItem.queueId] || ''}
                  onChange={(e) => handlePhoneChange(queueItem.queueId, e.target.value)}
                  disabled={assigningQueue}
                  aria-label="Agent phone number"
                />
                <AssignButtonSmall
                  type="submit"
                  disabled={assigningQueue || !agentPhones[queueItem.queueId]}
                >
                  {assigningQueue && assigningId === queueItem.queueId
                    ? 'Assigning...'
                    : 'Assign Agent'}
                </AssignButtonSmall>
              </AssignAgentForm>
            </QueueItemContainer>
          ))
        )}
      </QueueManagerScroll>
    </QueueManagerContainer>
  );
};

QueueManagerPanel.displayName = 'QueueManagerPanel';

export default QueueManagerPanel;
