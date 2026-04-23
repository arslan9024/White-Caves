/**
 * LoginSecurityPage
 * =================
 * Owner/admin-only forensic dashboard for the CRM login security stack.
 *
 * Surfaces the new server endpoints:
 *   - GET  /api/auth/security/login-attempts  (audit log)
 *   - POST /api/auth/security/unlock          (clear lockout)
 */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import './LoginSecurityPage.css';

const log = createLogger('LoginSecurityPage');

type AttemptStatus = 'all' | 'failed' | 'success';

interface LoginAttempt {
  id: string;
  action: 'login' | 'login_failed' | 'account_unlocked' | string;
  description: string;
  createdAt: string;
  userId: string | null;
  user: { id: string; email: string; name: string | null; role: string } | null;
  metadata: Record<string, unknown> | null;
}

interface AttemptsResponse {
  success: boolean;
  data: LoginAttempt[];
  meta: { count: number; limit: number; sinceMinutes: number; status: string; emailFilter: string | null };
}

const STATUS_OPTIONS: { value: AttemptStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'failed', label: 'Failed' },
  { value: 'success', label: 'Success' },
];

const SINCE_OPTIONS: { value: number; label: string }[] = [
  { value: 60, label: 'Last hour' },
  { value: 6 * 60, label: 'Last 6 hours' },
  { value: 24 * 60, label: 'Last 24 hours' },
  { value: 7 * 24 * 60, label: 'Last 7 days' },
];

const LoginSecurityPage: FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [status, setStatus] = useState<AttemptStatus>('all');
  const [sinceMinutes, setSinceMinutes] = useState<number>(24 * 60);
  const [emailFilter, setEmailFilter] = useState<string>('');
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // RBAC guard — server enforces too, but keep buyers/agents out of the UI
  useEffect(() => {
    if (user && user.role !== 'owner' && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchAttempts = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('sinceMinutes', String(sinceMinutes));
        params.set('limit', '100');
        if (emailFilter.trim()) params.set('email', emailFilter.trim());
        const res = await authFetch(`/api/auth/security/login-attempts?${params.toString()}`, { signal });
        if (!res.ok) {
          setError(`Request failed: ${res.status} ${res.statusText}`);
          return;
        }
        const json: AttemptsResponse = await res.json();
        setAttempts(json.data || []);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        log.error('Failed to fetch login attempts', err);
        setError('Failed to load login attempts.');
      } finally {
        setLoading(false);
      }
    },
    [status, sinceMinutes, emailFilter],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchAttempts(controller.signal);
    return () => controller.abort();
  }, [fetchAttempts]);

  const handleUnlock = async (target: LoginAttempt): Promise<void> => {
    const userId = target.userId;
    const email = (target.user?.email || (target.metadata?.emailAttempt as string | undefined)) ?? null;
    if (!userId && !email) {
      setToast('Cannot unlock — no user identifier on this row.');
      return;
    }
    if (!window.confirm(`Unlock ${email || userId}? This clears their recent failed attempts.`)) {
      return;
    }
    try {
      setUnlockingId(target.id);
      const res = await authFetch('/api/auth/security/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userId ? { userId } : { email }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setToast(`Unlock failed: ${res.status} ${text}`);
        return;
      }
      const json = await res.json();
      setToast(`Unlocked ${json.data?.email ?? email}; cleared ${json.data?.clearedFailures ?? 0} failures.`);
      await fetchAttempts();
    } catch (err) {
      log.error('Unlock request failed', err);
      setToast('Unlock failed (network error).');
    } finally {
      setUnlockingId(null);
    }
  };

  const failureCount = useMemo(
    () => attempts.filter((a) => a.action === 'login_failed').length,
    [attempts],
  );
  const successCount = useMemo(
    () => attempts.filter((a) => a.action === 'login').length,
    [attempts],
  );

  return (
    <div className="login-security-page">
      <header className="ls-header">
        <h1>Login Security</h1>
        <p>Monitor recent login activity, investigate suspicious attempts, and clear lockouts.</p>
      </header>

      <section className="ls-summary">
        <div className="ls-summary-card ls-summary-success">
          <span className="ls-summary-label">Successful</span>
          <span className="ls-summary-value">{successCount}</span>
        </div>
        <div className="ls-summary-card ls-summary-failed">
          <span className="ls-summary-label">Failed</span>
          <span className="ls-summary-value">{failureCount}</span>
        </div>
        <div className="ls-summary-card ls-summary-total">
          <span className="ls-summary-label">Total</span>
          <span className="ls-summary-value">{attempts.length}</span>
        </div>
      </section>

      <section className="ls-filters" aria-label="Filters">
        <label className="ls-filter">
          <span>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AttemptStatus)}
            aria-label="Status filter"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="ls-filter">
          <span>Window</span>
          <select
            value={sinceMinutes}
            onChange={(e) => setSinceMinutes(Number(e.target.value))}
            aria-label="Window filter"
          >
            {SINCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="ls-filter ls-filter-grow">
          <span>Email contains</span>
          <input
            type="search"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            placeholder="e.g. ghost@whitecaves.ae"
            aria-label="Email filter"
          />
        </label>
        <button
          type="button"
          className="ls-refresh"
          onClick={() => fetchAttempts()}
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </section>

      {error && <div className="ls-error" role="alert">{error}</div>}
      {toast && <div className="ls-toast" role="status">{toast}</div>}

      <section className="ls-table-wrap" aria-label="Login attempts">
        <table className="ls-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Action</th>
              <th>User</th>
              <th>Reason</th>
              <th>IP</th>
              <th>User Agent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && attempts.length === 0 && (
              <tr>
                <td colSpan={7} className="ls-empty">Loading…</td>
              </tr>
            )}
            {!loading && attempts.length === 0 && (
              <tr>
                <td colSpan={7} className="ls-empty">No attempts in the selected window.</td>
              </tr>
            )}
            {attempts.map((row) => {
              const md = (row.metadata || {}) as Record<string, unknown>;
              const reason = (md.reason as string | undefined) || (row.action === 'login' ? 'success' : '—');
              const ip = (md.ip as string | undefined) || '—';
              const ua = (md.userAgent as string | undefined) || '—';
              const isFailed = row.action === 'login_failed';
              const canUnlock = isFailed && (row.userId || row.user?.email || md.emailAttempt);
              return (
                <tr key={row.id} className={`ls-row ls-row-${row.action}`}>
                  <td>{new Date(row.createdAt).toLocaleString()}</td>
                  <td>
                    <span className={`ls-badge ls-badge-${row.action}`}>{row.action}</span>
                  </td>
                  <td>
                    {row.user?.email || (md.emailAttempt as string | undefined) || '—'}
                    {row.user?.role && <small className="ls-role">{row.user.role}</small>}
                  </td>
                  <td>{reason}</td>
                  <td>{ip}</td>
                  <td className="ls-ua" title={ua}>{ua}</td>
                  <td>
                    {canUnlock ? (
                      <button
                        type="button"
                        className="ls-unlock"
                        onClick={() => handleUnlock(row)}
                        disabled={unlockingId === row.id}
                      >
                        {unlockingId === row.id ? 'Unlocking…' : 'Unlock'}
                      </button>
                    ) : (
                      <span className="ls-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LoginSecurityPage;
