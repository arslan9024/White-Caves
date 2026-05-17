import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  BellOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  Zap,
  BarChart2,
} from 'lucide-react';
import {
  selectNotificationsByAssistant,
  selectUnreadCountByAssistant,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../../store/slices/aiAssistantDashboardSlice';
import type { RootState } from '../../../store/store';
import './LifecycleNotificationFeed.css';

// ── severity icon / color helpers ─────────────────────────────────────────

const SEVERITY_ICON: Record<string, React.ReactNode> = {
  critical: <XCircle size={14} className="sev-critical" />,
  warning: <AlertTriangle size={14} className="sev-warning" />,
  info: <Info size={14} className="sev-info" />,
  success: <CheckCircle2 size={14} className="sev-success" />,
};

const NOTIF_TYPE_ICON: Record<string, React.ReactNode> = {
  task_lifecycle: <Clock size={12} className="type-icon lifecycle" />,
  task_action: <Zap size={12} className="type-icon action" />,
  task_result: <BarChart2 size={12} className="type-icon result" />,
};

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

// ── Notification item ─────────────────────────────────────────────────────

interface NotifItemProps {
  notif: {
    id: string;
    type: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
    isRead: boolean;
    timestamp: string;
    [key: string]: unknown;
  };
  assistantId: string;
  onMarkRead: (assistantId: string, notifId: string) => void;
}

const NotifItem = memo(({ notif, assistantId, onMarkRead }: NotifItemProps) => {
  const handleClick = useCallback(() => {
    if (!notif.isRead) onMarkRead(assistantId, notif.id);
  }, [notif.isRead, notif.id, assistantId, onMarkRead]);

  const typeIcon = NOTIF_TYPE_ICON[notif.type] ?? NOTIF_TYPE_ICON['task_lifecycle'];
  const sevIcon = SEVERITY_ICON[notif.severity] ?? SEVERITY_ICON['info'];

  return (
    <div
      className={`lnf-item ${notif.isRead ? 'read' : 'unread'} sev-${notif.severity}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`${notif.isRead ? 'Read' : 'Unread'} notification: ${notif.message}`}
    >
      <div className="lnf-item-icon">{sevIcon}</div>
      <div className="lnf-item-body">
        <div className="lnf-item-header">
          <span className="lnf-type-pill">
            {typeIcon}
            {notif.type.replace(/_/g, ' ')}
          </span>
          <span className="lnf-time">{formatTimeAgo(notif.timestamp)}</span>
        </div>
        <p className="lnf-message">{notif.message}</p>
      </div>
      {!notif.isRead && <div className="lnf-unread-dot" aria-hidden="true" />}
    </div>
  );
});
NotifItem.displayName = 'NotifItem';

// ── Main component ────────────────────────────────────────────────────────

interface LifecycleNotificationFeedProps {
  assistantId: string;
  /** Only show these notification types. Defaults to all lifecycle types. */
  types?: string[];
  maxItems?: number;
  /** Assistant accent color */
  color?: string;
}

const LIFECYCLE_TYPES = ['task_lifecycle', 'task_action', 'task_result'];

const LifecycleNotificationFeed = memo(
  ({
    assistantId,
    types = LIFECYCLE_TYPES,
    maxItems = 30,
    color = '#0EA5E9',
  }: LifecycleNotificationFeedProps) => {
    const dispatch = useDispatch();

    const allNotifs = useSelector((state: RootState) =>
      selectNotificationsByAssistant(assistantId)(state),
    );

    const unreadCount = useSelector((state: RootState) =>
      selectUnreadCountByAssistant(assistantId)(state),
    );

    // Filter to lifecycle-type notifications
    const filtered = allNotifs
      .filter((n) => types.includes(n.type))
      .slice(0, maxItems);

    const unreadFiltered = filtered.filter((n) => !n.isRead).length;

    const handleMarkRead = useCallback(
      (aId: string, nId: string) => {
        dispatch(markNotificationRead({ assistantId: aId, notificationId: nId }));
      },
      [dispatch],
    );

    const handleMarkAllRead = useCallback(() => {
      dispatch(markAllNotificationsRead(assistantId));
    }, [dispatch, assistantId]);

    return (
      <div
        className="lifecycle-notification-feed"
        style={{ '--lnf-accent': color } as React.CSSProperties}
      >
        {/* Header */}
        <div className="lnf-header">
          <div className="lnf-header-left">
            {unreadFiltered > 0 ? (
              <Bell size={15} className="lnf-bell active" />
            ) : (
              <BellOff size={15} className="lnf-bell" />
            )}
            <span className="lnf-title">Lifecycle Notifications</span>
            {unreadFiltered > 0 && (
              <span className="lnf-badge">{unreadFiltered > 99 ? '99+' : unreadFiltered}</span>
            )}
          </div>
          {unreadFiltered > 0 && (
            <button
              className="lnf-mark-all-btn"
              onClick={handleMarkAllRead}
              aria-label="Mark all lifecycle notifications as read"
            >
              <CheckCircle2 size={13} /> Mark all read
            </button>
          )}
        </div>

        {/* Feed */}
        <div className="lnf-feed" role="log" aria-live="polite" aria-label="Lifecycle notifications">
          {filtered.length === 0 ? (
            <div className="lnf-empty">
              <BellOff size={28} />
              <p>No lifecycle notifications yet</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <NotifItem
                key={notif.id}
                notif={notif}
                assistantId={assistantId}
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </div>

        {/* Footer summary */}
        {filtered.length > 0 && (
          <div className="lnf-footer">
            {unreadCount > 0 && (
              <span className="lnf-footer-unread">{unreadCount} total unread</span>
            )}
            <span className="lnf-footer-total">Showing {filtered.length} events</span>
          </div>
        )}
      </div>
    );
  },
);

LifecycleNotificationFeed.displayName = 'LifecycleNotificationFeed';
export default LifecycleNotificationFeed;
