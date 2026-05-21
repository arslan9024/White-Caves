/**
 * useNotifications — Custom hook for Notifications management
 * Handles fetch, mark read, mark all read, delete, and filtering.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate as formatDateUtil } from '../../../utils';
import { createLogger } from '../../../utils/logger';
import * as crmService from '../../../services/crmService';

const log = createLogger('useNotifications');

// ─── Types ──────────────────────────────────────────────────────────────

export interface Notification {
  id: string | number;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  created_at?: string;
  [key: string]: unknown;
}

type NotificationBadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ─── Constants ──────────────────────────────────────────────────────────

export const TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; badgeVariant: NotificationBadgeVariant }
> = {
  info: { label: 'Info', icon: 'ℹ️', badgeVariant: 'info' },
  lead: { label: 'Lead', icon: '🎯', badgeVariant: 'primary' },
  property: { label: 'Property', icon: '🏠', badgeVariant: 'success' },
  commission: { label: 'Commission', icon: '💰', badgeVariant: 'warning' },
  system: { label: 'System', icon: '⚙️', badgeVariant: 'secondary' },
};

const ITEMS_PER_PAGE = 10;

// ─── Hook ───────────────────────────────────────────────────────────────

export function useNotifications() {
  const navigate = useNavigate();
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await crmService.fetchNotifications();
      const normalized = ((Array.isArray(items) ? items : []) as Notification[]).map(item => ({
        ...item,
        created_at:
          (item.created_at as string | undefined) || (item.createdAt as string | undefined),
      }));
      setAllNotifications(normalized);

      const unread = await crmService.fetchUnreadCount();
      setUnreadCount(Number(unread?.unreadCount || 0));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      log.error('Failed to fetch notifications:', message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Local state ────────────────────────────────────────────────

  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, readFilter]);

  // ─── Derived data ───────────────────────────────────────────────

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n: Notification) => {
      const matchesType = typeFilter === 'all' || n.type === typeFilter;
      const matchesRead =
        readFilter === 'all' ||
        (readFilter === 'unread' && !n.read) ||
        (readFilter === 'read' && n.read);
      return matchesType && matchesRead;
    });
  }, [allNotifications, typeFilter, readFilter]);

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Actions ────────────────────────────────────────────────────

  const handleMarkAsRead = useCallback(async (id: string | number) => {
    try {
      await crmService.markNotificationRead(String(id));
      setAllNotifications(prev =>
        prev.map(n => (String(n.id) === String(id) ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: unknown) {
      log.error(
        'Failed to mark notification as read:',
        err instanceof Error ? err.message : String(err)
      );
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await crmService.markAllNotificationsRead();
      setAllNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err: unknown) {
      log.error(
        'Failed to mark all notifications as read:',
        err instanceof Error ? err.message : String(err)
      );
    }
  }, []);

  const handleDelete = useCallback(async (id: string | number) => {
    try {
      await crmService.deleteNotification(String(id));
      setAllNotifications(prev => prev.filter(n => String(n.id) !== String(id)));
      const unread = await crmService.fetchUnreadCount();
      setUnreadCount(Number(unread?.unreadCount || 0));
    } catch (err: unknown) {
      log.error('Failed to delete notification:', err instanceof Error ? err.message : String(err));
    }
  }, []);

  const getTimeAgo = useCallback((dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDateUtil(dateStr);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  }, []);

  const handleReadFilterChange = useCallback((value: 'all' | 'unread' | 'read') => {
    setReadFilter(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    allNotifications,
    filteredNotifications,
    paginatedNotifications,
    unreadCount,
    totalPages,
    loading,
    error,
    // State
    typeFilter,
    readFilter,
    currentPage,
    // Page constants
    ITEMS_PER_PAGE,
    // Actions
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleTypeFilterChange,
    handleReadFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    // Formatters
    getTimeAgo,
  };
}
