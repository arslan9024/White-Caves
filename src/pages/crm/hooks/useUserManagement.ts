/**
 * useUserManagement — Custom hook for User/Role management
 * Fetches users from crmService and provides role change, status toggle, and filtering.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate as formatDateUtil } from '../../../utils';
import { createLogger } from '../../../utils/logger';
import * as crmService from '../../../services/crmService';

const log = createLogger('useUserManagement');

// ─── Types ──────────────────────────────────────────────────────────────

export interface User {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: string;
  last_active?: string;
  created_at?: string;
  avatar?: string;
  [key: string]: unknown;
}

type UserBadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ─── Constants ──────────────────────────────────────────────────────────

export const ROLE_CONFIG: Record<string, { label: string; color: string; badgeVariant: UserBadgeVariant }> = {
  owner: { label: 'Owner', color: '#8B5CF6', badgeVariant: 'primary' },
  manager: { label: 'Manager', color: '#3B82F6', badgeVariant: 'info' },
  admin: { label: 'Admin', color: '#EC4899', badgeVariant: 'error' },
  agent: { label: 'Agent', color: '#10B981', badgeVariant: 'success' },
  finance: { label: 'Finance', color: '#F59E0B', badgeVariant: 'warning' },
  operations: { label: 'Operations', color: '#6B7280', badgeVariant: 'secondary' },
};

export const STATUS_CONFIG: Record<string, { label: string; badgeVariant: UserBadgeVariant }> = {
  active: { label: 'Active', badgeVariant: 'success' },
  inactive: { label: 'Inactive', badgeVariant: 'secondary' },
};

const ITEMS_PER_PAGE = 10;

// ─── Hook ───────────────────────────────────────────────────────────────

export function useUserManagement() {
  const navigate = useNavigate();

  // ─── Local state ────────────────────────────────────────────────

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  // ─── Fetch users ───────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await crmService.fetchUsers();
      setUsers(result as User[]);
    } catch (err: unknown) {
      log.error('Failed to fetch users:', err instanceof Error ? err.message : String(err));
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ─── Derived data ───────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    return users.filter((u: User) => {
      const matchesSearch = !search || [
        u.name, u.email, u.department,
      ].some(field => field?.toLowerCase().includes(search.toLowerCase()));
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const roleCounts: Record<string, number> = {};
    users.forEach(u => {
      const role = u.role || 'unknown';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    return { total, active, roleCounts };
  }, [users]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: users.length };
    users.forEach((u: User) => {
      const role = u.role || 'unknown';
      counts[role] = (counts[role] || 0) + 1;
    });
    return counts;
  }, [users]);

  // ─── Actions ────────────────────────────────────────────────────

  const handleChangeRole = useCallback(async (userId: string | number, newRole: string) => {
    try {
      await crmService.updateUserRole(String(userId), newRole);
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err: unknown) {
      log.error('Failed to change role:', err instanceof Error ? err.message : String(err));
      setError('Failed to update role. Please try again.');
    }
  }, []);

  const handleToggleStatus = useCallback(async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await crmService.updateUserStatus(String(user.id), newStatus);
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
    } catch (err: unknown) {
      log.error('Failed to toggle status:', err instanceof Error ? err.message : String(err));
      setError('Failed to update user status. Please try again.');
    }
  }, []);

  const getRoleBadgeVariant = useCallback((role: string) => {
    return ROLE_CONFIG[role]?.badgeVariant || 'secondary';
  }, []);

  const getStatusBadgeVariant = useCallback((status: string) => {
    return STATUS_CONFIG[status]?.badgeVariant || 'secondary';
  }, []);

  const formatDate = useCallback((dateStr: string | undefined) => formatDateUtil(dateStr), []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    users, filteredUsers, paginatedUsers, stats, roleCounts, totalPages,
    loading, error,
    // State
    search, roleFilter, statusFilter, currentPage,
    // Page constants
    ITEMS_PER_PAGE,
    // Actions
    handleChangeRole, handleToggleStatus,
    handleSearchChange, handleRoleFilterChange, handleStatusFilterChange,
    setCurrentPage, retryFetch, goBack,
    // Formatters
    getRoleBadgeVariant, getStatusBadgeVariant, formatDate,
  };
}
