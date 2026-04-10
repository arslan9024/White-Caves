/**
 * CRM API Service — Centralized API calls for all CRM features
 */
import { authFetch, extractApiError } from '../utils/authFetch';

const API = '/api';

// Helper to parse JSON response
async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || body.error || `Request failed (${res.status})`);
  }
  const json = await res.json();
  return json.data ?? json;
}

// Helper to build query string from params
function buildQuery(params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return '';
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
}

// ─── Commissions ────────────────────────────────────────────────────────

export async function fetchCommissions(params?: Record<string, string>) {
  const res = await authFetch(`${API}/finance/commissions${buildQuery(params)}`);
  return parseResponse<unknown[]>(res);
}

export async function fetchCommission(id: string) {
  const res = await authFetch(`${API}/finance/commissions/${id}`);
  return parseResponse<Record<string, unknown>>(res);
}

export async function createCommission(data: Record<string, unknown>) {
  const res = await authFetch(`${API}/finance/commissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function updateCommission(id: string, data: Record<string, unknown>) {
  const res = await authFetch(`${API}/finance/commissions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Record<string, unknown>>(res);
}

// ─── Transactions ───────────────────────────────────────────────────────

export async function fetchTransactions(params?: Record<string, string>) {
  const res = await authFetch(`${API}/transactions${buildQuery(params)}`);
  return parseResponse<unknown[]>(res);
}

export async function fetchTransaction(id: string) {
  const res = await authFetch(`${API}/transactions/${id}`);
  return parseResponse<Record<string, unknown>>(res);
}

export async function createTransaction(data: Record<string, unknown>) {
  const res = await authFetch(`${API}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function updateTransaction(id: string, data: Record<string, unknown>) {
  const res = await authFetch(`${API}/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function deleteTransaction(id: string) {
  const res = await authFetch(`${API}/transactions/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(await extractApiError(res, 'Failed to delete transaction'));
  }
  return id;
}

// ─── Clients ────────────────────────────────────────────────────────────

export async function fetchClients(params?: Record<string, string>) {
  const res = await authFetch(`${API}/clients${buildQuery(params)}`);
  return parseResponse<unknown[]>(res);
}

export async function fetchClient(id: string) {
  const res = await authFetch(`${API}/clients/${id}`);
  return parseResponse<Record<string, unknown>>(res);
}

export async function createClient(data: Record<string, unknown>) {
  const res = await authFetch(`${API}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function updateClient(id: string, data: Record<string, unknown>) {
  const res = await authFetch(`${API}/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function deleteClient(id: string) {
  const res = await authFetch(`${API}/clients/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(await extractApiError(res, 'Failed to delete client'));
  }
  return id;
}

// ─── Notifications ──────────────────────────────────────────────────────

export async function fetchNotifications(params?: Record<string, string>) {
  const res = await authFetch(`${API}/notifications${buildQuery(params)}`);
  return parseResponse<unknown[]>(res);
}

export async function fetchUnreadCount() {
  const res = await authFetch(`${API}/notifications/unread-count`);
  return parseResponse<{ count: number }>(res);
}

export async function markNotificationRead(id: string) {
  const res = await authFetch(`${API}/notifications/${id}/read`, {
    method: 'PATCH',
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function markAllNotificationsRead() {
  const res = await authFetch(`${API}/notifications/read-all`, {
    method: 'PATCH',
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function deleteNotification(id: string) {
  const res = await authFetch(`${API}/notifications/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(await extractApiError(res, 'Failed to delete notification'));
  }
  return id;
}

// ─── Favorites ──────────────────────────────────────────────────────────

export async function fetchFavorites() {
  const res = await authFetch(`${API}/favorites`);
  return parseResponse<unknown[]>(res);
}

export async function addFavorite(propertyId: string) {
  const res = await authFetch(`${API}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ propertyId }),
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function removeFavorite(propertyId: string) {
  const res = await authFetch(`${API}/favorites/${propertyId}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(await extractApiError(res, 'Failed to remove favorite'));
  }
  return propertyId;
}

export async function checkFavorite(propertyId: string) {
  const res = await authFetch(`${API}/favorites/check/${propertyId}`);
  return parseResponse<{ isFavorite: boolean }>(res);
}

// ─── Users (Management) ────────────────────────────────────────────────

export async function fetchUsers(params?: Record<string, string>) {
  const res = await authFetch(`${API}/users${buildQuery(params)}`);
  return parseResponse<unknown[]>(res);
}

export async function fetchUser(id: string) {
  const res = await authFetch(`${API}/users/${id}`);
  return parseResponse<Record<string, unknown>>(res);
}

export async function updateUserRole(id: string, role: string) {
  const res = await authFetch(`${API}/users/${id}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  return parseResponse<Record<string, unknown>>(res);
}

export async function updateUserStatus(id: string, status: string) {
  const res = await authFetch(`${API}/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return parseResponse<Record<string, unknown>>(res);
}

// ─── Reporting ──────────────────────────────────────────────────────────

export async function fetchDashboardSummary() {
  const res = await authFetch(`${API}/dashboard/summary`);
  return parseResponse<Record<string, unknown>>(res);
}

export async function fetchExecutiveReport() {
  const res = await authFetch(`${API}/dashboard/executive`);
  return parseResponse<Record<string, unknown>>(res);
}

export async function fetchKPIs() {
  const res = await authFetch(`${API}/dashboard/kpis`);
  return parseResponse<Record<string, unknown>>(res);
}

export async function exportCrmData(params: Record<string, string>) {
  const res = await authFetch(`${API}/dashboard/activities${buildQuery(params)}`);
  return parseResponse<unknown[]>(res);
}
