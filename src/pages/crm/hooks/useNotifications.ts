/**
 * useNotifications — Custom hook for Notifications management
 * Handles fetch, mark read, mark all read, delete, and filtering.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDate as formatDateUtil } from '../../../utils';
import { createLogger } from '../../../utils/logger';
import * as crmService from '../../../services/crmService';

const log = createLogger('useNotifications');
import type { AppDispatch } from '../../../store/store';
import {
  selectAllNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
  selectNotificationsError,
  fetchNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
} from '../../../store/crmDataSlice';

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

export const TYPE_CONFIG: Record<string, { label: string; icon: string; badgeVariant: NotificationBadgeVariant }> = {
  info: { label: 'Info', icon: 'ℹ️', badgeVariant: 'info' },
  lead: { label: 'Lead', icon: '🎯', badgeVariant: 'primary' },
  property: { label: 'Property', icon: '🏠', badgeVariant: 'success' },
  commission: { label: 'Commission', icon: '💰', badgeVariant: 'warning' },
  system: { label: 'System', icon: '⚙️', badgeVariant: 'secondary' },
};

const ITEMS_PER_PAGE = 10;

// ─── Hook ───────────────────────────────────────────────────────────────

export function useNotifications() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allNotifications = useSelector(selectAllNotifications) as Notification[];
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchNotificationsAPI(undefined));
  }, [dispatch]);

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
      const matchesRead = readFilter === 'all' ||
        (readFilter === 'unread' && !n.read) ||
        (readFilter === 'read' && n.read);
      return matchesType && matchesRead;
    });
  }, [allNotifications, typeFilter, readFilter]);

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Actions ────────────────────────────────────────────────────

  const handleMarkAsRead = useCallback((id: string | number) => {
    dispatch(markNotificationReadAPI(String(id))).catch((error: unknown) => {
      log.error('Failed to mark notification as read:', error instanceof Error ? error.message : String(error));
    });
  }, [dispatch]);

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllNotificationsReadAPI()).catch((error: unknown) => {
      log.error('Failed to mark all notifications as read:', error instanceof Error ? error.message : String(error));
    });
  }, [dispatch]);

  const handleDelete = useCallback(async (id: string | number) => {
    try {
      await crmService.deleteNotification(String(id));
      // Re-fetch notifications after deletion
      dispatch(fetchNotificationsAPI(undefined));
    } catch (err: unknown) {
      log.error('Failed to delete notification:', err instanceof Error ? err.message : String(err));
    }
  }, [dispatch]);

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
    dispatch(fetchNotificationsAPI(undefined));
  }, [dispatch]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    allNotifications, filteredNotifications, paginatedNotifications,
    unreadCount, totalPages,
    loading, error,
    // State
    typeFilter, readFilter, currentPage,
    // Page constants
    ITEMS_PER_PAGE,
    // Actions
    handleMarkAsRead, handleMarkAllAsRead, handleDelete,
    handleTypeFilterChange, handleReadFilterChange,
    setCurrentPage, retryFetch, goBack,
    // Formatters
    getTimeAgo,
  };
}
