/**
 * TenantMaintenanceTab — Phase 2.10: Maintenance Requests
 *
 * Submit and view maintenance requests, track status.
 *
 * @component
 */

import React, { FC, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

interface MaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  submitted: string;
  status: 'open' | 'in-progress' | 'closed';
  isLocal?: boolean;
}

const INITIAL_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'tm-001',
    title: 'AC service required',
    priority: 'high',
    submitted: '2026-04-10',
    status: 'open',
  },
  {
    id: 'tm-002',
    title: 'Kitchen sink leakage',
    priority: 'medium',
    submitted: '2026-04-07',
    status: 'in-progress',
  },
  {
    id: 'tm-003',
    title: 'Balcony door alignment',
    priority: 'low',
    submitted: '2026-03-29',
    status: 'closed',
  },
];

const TenantMaintenanceTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>(
    'all'
  );
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [priorityInput, setPriorityInput] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return requests.filter(request => {
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
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

    setSubmitError(null);
    setIsSubmitting(true);

    const today = new Date().toISOString().split('T')[0];
    const tempId = `tm-local-${Date.now()}`;

    const newRequest: MaintenanceRequest = {
      id: tempId,
      title,
      description: descriptionInput.trim() || undefined,
      priority: priorityInput,
      submitted: today,
      status: 'open',
      isLocal: true,
    };

    // Optimistic update — show immediately
    setRequests(prev => [newRequest, ...prev]);
    setTitleInput('');
    setDescriptionInput('');
    setPriorityInput('medium');

    try {
      // Attempt to persist via API; gracefully ignore errors (Phase 5 will wire full API)
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'maintenance_request',
          description: `[${priorityInput.toUpperCase()}] ${title}${newRequest.description ? ` — ${newRequest.description}` : ''}`,
          userId: currentUser?.id,
        }),
      });
    } catch {
      // Non-blocking — local state is the source of truth for now
    } finally {
      setIsSubmitting(false);
    }
  }, [titleInput, descriptionInput, priorityInput, currentUser?.id]);

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
        <label
          htmlFor="maintenance-priority"
          style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
        >
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
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>

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
          <p>No maintenance requests match your filters.</p>
        </div>
      ) : (
        <div className="maintenance-list" data-testid="tenant-maintenance-list">
          {filteredRequests.map(request => (
            <div
              key={request.id}
              className={`maintenance-row${request.isLocal ? ' maintenance-row--local' : ''}`}
              data-testid={`tenant-maintenance-row-${request.id}`}
            >
              <div>
                <strong>{request.title}</strong>
                {request.isLocal && (
                  <span className="local-badge" data-testid="maintenance-local-badge">
                    Submitted
                  </span>
                )}
                <p>{request.id}</p>
              </div>
              <div>
                <p>Submitted: {request.submitted}</p>
                <span
                  className={`priority-badge priority-${request.priority}`}
                  data-testid={`maintenance-priority-${request.id}`}
                  aria-label={`Priority: ${request.priority}`}
                >
                  {request.priority}
                </span>
                <span className={`status-badge status-${request.status}`}>{request.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantMaintenanceTab;
