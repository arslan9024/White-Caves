import React, { FC, useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import './AuditLogUI.css';

/**
 * AuditLogUI — P1-002: Immutable, filterable, paginated audit log surface
 * for compliance, manager, and admin roles.
 *
 * Connects to GET /api/activities for activity data.
 * Exports to XLSX via server-side route (POST /api/reporting/activities/export).
 */

export interface AuditLogEntry {
  id: string;
  type: string;
  action: string;
  description: string;
  userId: string | null;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface AuditLogUIProps {
  entries: AuditLogEntry[];
  isLoading?: boolean;
  onExport?: () => void;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

const PAGE_SIZE = 25;

const ACTION_LABELS: Record<string, string> = {
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  viewed: 'Viewed',
  exported: 'Exported',
  login: 'Login',
  logout: 'Logout',
  escalated: 'Escalated',
  assigned: 'Assigned',
  syndication_queued: 'Syndication Queued',
  kyc_passed: 'KYC Passed',
  kyc_failed: 'KYC Failed',
};

const AuditLogUI: FC<AuditLogUIProps> = ({
  entries,
  isLoading = false,
  onExport,
  totalCount,
  page = 1,
  pageSize = PAGE_SIZE,
  onPageChange,
}) => {
  const [filterType, setFilterType] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return entries.filter(entry => {
      if (filterType && entry.type !== filterType) return false;
      if (filterAction && entry.action !== filterAction) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          entry.description.toLowerCase().includes(q) ||
          (entry.userId ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, filterType, filterAction, searchQuery]);

  const uniqueTypes = useMemo(
    () => Array.from(new Set(entries.map(e => e.type))).sort(),
    [entries]
  );
  const uniqueActions = useMemo(
    () => Array.from(new Set(entries.map(e => e.action))).sort(),
    [entries]
  );

  const handleTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value),
    []
  );
  const handleActionChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => setFilterAction(e.target.value),
    []
  );
  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    []
  );

  const totalPages = Math.ceil((totalCount ?? filtered.length) / pageSize);

  return (
    <section className="audit-log-ui" aria-label="Audit Log">
      <header className="audit-log-ui__header">
        <h2 className="audit-log-ui__title">Audit Log</h2>
        <div className="audit-log-ui__controls">
          <input
            type="search"
            className="audit-log-ui__search"
            placeholder="Search by description or user…"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search audit log"
          />

          <select
            className="audit-log-ui__filter"
            value={filterType}
            onChange={handleTypeChange}
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="audit-log-ui__filter"
            value={filterAction}
            onChange={handleActionChange}
            aria-label="Filter by action"
          >
            <option value="">All Actions</option>
            {uniqueActions.map(a => (
              <option key={a} value={a}>
                {ACTION_LABELS[a] ?? a}
              </option>
            ))}
          </select>

          {onExport && (
            <button
              type="button"
              className="audit-log-ui__export-btn"
              onClick={onExport}
              aria-label="Export audit log to XLSX"
            >
              Export XLSX
            </button>
          )}
        </div>
      </header>

      {isLoading ? (
        <div className="audit-log-ui__loading" role="status" aria-live="polite">
          Loading audit log…
        </div>
      ) : filtered.length === 0 ? (
        <div className="audit-log-ui__empty" role="status">
          No audit log entries match your filters.
        </div>
      ) : (
        <div className="audit-log-ui__table-wrapper" role="region" aria-label="Audit log entries">
          <table className="audit-log-ui__table">
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Type</th>
                <th scope="col">Action</th>
                <th scope="col">Description</th>
                <th scope="col">User</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id} className="audit-log-ui__row">
                  <td className="audit-log-ui__cell audit-log-ui__cell--timestamp">
                    <time dateTime={entry.createdAt}>
                      {new Date(entry.createdAt).toLocaleString('en-AE', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </time>
                  </td>
                  <td className="audit-log-ui__cell">
                    <span className={`audit-log-ui__badge audit-log-ui__badge--${entry.type}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="audit-log-ui__cell">
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </td>
                  <td className="audit-log-ui__cell audit-log-ui__cell--description">
                    {entry.description}
                  </td>
                  <td className="audit-log-ui__cell">
                    {entry.userId ? (
                      <code className="audit-log-ui__user-id">{entry.userId.slice(0, 8)}…</code>
                    ) : (
                      <span className="audit-log-ui__system">System</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && onPageChange && (
        <nav className="audit-log-ui__pagination" aria-label="Audit log pagination">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            ← Prev
          </button>
          <span className="audit-log-ui__page-info">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
};

export default AuditLogUI;
