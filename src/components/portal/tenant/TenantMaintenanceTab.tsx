/**
 * TenantMaintenanceTab — Phase 2.10 / Phase 30: Maintenance Requests (Live API)
 *
 * Loads requests from GET /api/maintenance.
 * POSTs new requests to POST /api/maintenance using the tenant's active lease propertyId.
 *
 * @component
 */

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

interface ApiMaintenance {
  id: string;
  title: string;
  description?: string | null;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'open' | 'in_progress' | 'resolved' | 'cancelled';
  createdAt: string;
  category?: string | null;
}

interface ApiLease {
  id: string;
  propertyId: string;
}

// Map API status names to display-friendly values
function mapStatus(s: string): 'open' | 'in-progress' | 'closed' {
  if (s === 'in_progress') return 'in-progress';
  if (s === 'resolved' || s === 'cancelled') return 'closed';
  return 'open';
}

const TenantMaintenanceTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [requests, setRequests] = useState<ApiMaintenance[]>([]);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>('all');

  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [priorityInput, setPriorityInput] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      authFetch('/api/leases?role=tenant&pageSize=1').then(r => r.json()),
      authFetch('/api/maintenance?pageSize=50').then(r => r.json()),
    ])
      .then(([leasesData, maintData]) => {
        const lease = (leasesData.data as ApiLease[])?.[0] ?? null;
        setPropertyId(lease?.propertyId ?? null);
        setRequests((maintData.data as ApiMaintenance[]) ?? []);
      })
      .catch(() => setError('Unable to load maintenance requests. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return requests.filter(request => {
      const displayStatus = mapStatus(request.status);
      const matchesStatus = statusFilter === 'all' || displayStatus === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        request.title.toLowerCase().includes(normalizedSearch) ||
        request.id.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleSubmit = useCallback(async () => {
    const title = titleInput.trim();
    if (!title) {
      setSubmitError('Please enter an issue title.');
      return;
    }
    if (!propertyId) {
      setSubmitError('No active lease found. Unable to submit maintenance request.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await authFetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          title,
          description: descriptionInput.trim() || undefined,
          category: 'general',
          priority: priorityInput,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setRequests(prev => [data.data as ApiMaintenance, ...prev]);
        setTitleInput('');
        setDescriptionInput('');
        setPriorityInput('medium');
      } else {
        setSubmitError(data.message ?? 'Failed to submit request. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [titleInput, descriptionInput, priorityInput, propertyId]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view and submit maintenance requests.</p>
      </div>
    );
  }

  return (
    <div className="tab-content-section tenant-maintenance-tab">
      <div className="tab-header">
        <h3>Maintenance Requests</h3>
        <p>Track open issues and submit new service requests.</p>
      </div>

      <div className="request-form" data-testid="tenant-maintenance-form">
        <h4>Submit New Request</h4>
        {submitError && (
          <p className="form-error" data-testid="tenant-maintenance-error">
            {submitError}
          </p>
        )}
        <input
          data-testid="tenant-maintenance-title-input"
          type="text"
          placeholder="Issue title"
          value={titleInput}
          onChange={event => setTitleInput(event.target.value)}
        />
        <textarea
          data-testid="tenant-maintenance-description-input"
          placeholder="Describe the issue"
          rows={3}
          value={descriptionInput}
          onChange={event => setDescriptionInput(event.target.value)}
        />
        <label htmlFor="maintenance-priority" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Priority
        </label>
        <select
          id="maintenance-priority"
          data-testid="tenant-maintenance-priority-select"
          value={priorityInput}
          onChange={event => setPriorityInput(event.target.value as 'low' | 'medium' | 'high')}
        >
          <option value="low">Low — Minor inconvenience</option>
          <option value="medium">Medium — Needs attention soon</option>
          <option value="high">High — Urgent / Safety issue</option>
        </select>
        <button
          type="button"
          className="btn-primary"
          data-testid="tenant-maintenance-submit-btn"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting || loading}
          aria-disabled={isSubmitting || loading}
        >
          {isSubmitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>

      {error && (
        <div className="error-message" data-testid="tenant-maintenance-load-error">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-state" data-testid="tenant-maintenance-loading">
          <p>Loading requests…</p>
        </div>
      ) : (
        <>
          <div className="tab-controls">
            <input
              data-testid="tenant-maintenance-search"
              type="text"
              placeholder="Search by title or request ID"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
            />
            <select
              data-testid="tenant-maintenance-status-filter"
              value={statusFilter}
              onChange={event =>
                setStatusFilter(event.target.value as 'all' | 'open' | 'in-progress' | 'closed')
              }
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="empty-state" data-testid="tenant-maintenance-empty-state">
              <p>
                {requests.length === 0
                  ? 'No maintenance requests yet. Submit your first request above.'
                  : 'No maintenance requests match your filters.'}
              </p>
            </div>
          ) : (
            <div className="maintenance-list" data-testid="tenant-maintenance-list">
              {filteredRequests.map(request => {
                const displayStatus = mapStatus(request.status);
                const submitted = request.createdAt.split('T')[0];
                return (
                  <div
                    key={request.id}
                    className="maintenance-row"
                    data-testid={`tenant-maintenance-row-${request.id}`}
                  >
                    <div>
                      <strong>{request.title}</strong>
                      <p>{request.id}</p>
                    </div>
                    <div>
                      <p>Submitted: {submitted}</p>
                      <span
                        className={`priority-badge priority-${request.priority}`}
                        data-testid={`maintenance-priority-${request.id}`}
                        aria-label={`Priority: ${request.priority}`}
                      >
                        {request.priority}
                      </span>
                      <span className={`status-badge status-${displayStatus}`}>{displayStatus}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TenantMaintenanceTab;
