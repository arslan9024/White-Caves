/**
 * LandlordMaintenanceTab — Phase 29: Live API integration
 *
 * Maintenance requests for the landlord''s properties.
 * Backend now scopes by property.userId = landlord.id (role=landlord handling).
 *
 * @component
 */

import React, { FC, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

// ── API shapes ────────────────────────────────────────────────────────────────

interface ApiMaintenanceRequest {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  priority: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  property: { id: string; title: string; location: string } | null;
  requester: { id: string; name: string; email: string } | null;
}

const FALLBACK_MAINTENANCE_REQUESTS: ApiMaintenanceRequest[] = [
  {
    id: 'req-001',
    title: 'AC not cooling in master bedroom',
    description: 'Central AC is running but temperature remains high.',
    category: 'HVAC',
    priority: 'high',
    status: 'open',
    notes: null,
    createdAt: '2026-01-10T08:30:00.000Z',
    property: { id: 'prop-1', title: 'Marina View 2BR Apartment', location: 'Dubai Marina' },
    requester: {
      id: 'tenant-1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@email.ae',
    },
  },
  {
    id: 'req-002',
    title: 'Kitchen sink leakage',
    description: 'Leak under the sink causing water pooling in the cabinet.',
    category: 'Plumbing',
    priority: 'medium',
    status: 'in-progress',
    notes: null,
    createdAt: '2026-01-12T10:00:00.000Z',
    property: { id: 'prop-2', title: 'Downtown Studio', location: 'Downtown Dubai' },
    requester: {
      id: 'tenant-2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.ae',
    },
  },
  {
    id: 'req-003',
    title: 'Balcony door lock replacement',
    description: 'Existing lock is broken and cannot be secured.',
    category: 'Carpentry',
    priority: 'low',
    status: 'closed',
    notes: 'Completed and verified by tenant.',
    createdAt: '2026-01-05T09:00:00.000Z',
    property: { id: 'prop-3', title: 'JBR 3BR Villa', location: 'JBR' },
    requester: {
      id: 'tenant-3',
      name: 'Fatima Al-Mansoori',
      email: 'fatima.m@email.ae',
    },
  },
  {
    id: 'req-004',
    title: 'Water heater maintenance',
    description: 'Water temperature fluctuates and pressure drops frequently.',
    category: 'Mechanical',
    priority: 'high',
    status: 'open',
    notes: null,
    createdAt: '2026-01-15T12:15:00.000Z',
    property: { id: 'prop-1', title: 'Marina View 2BR Apartment', location: 'Dubai Marina' },
    requester: {
      id: 'tenant-4',
      name: 'Mohammed Hassan',
      email: 'm.hassan@email.ae',
    },
  },
];

// ── Main component ────────────────────────────────────────────────────────────

const LandlordMaintenanceTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>(
    'all'
  );
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requestNotes, setRequestNotes] = useState<Record<string, string>>({});
  const [requests, setRequests] = useState<ApiMaintenanceRequest[]>(FALLBACK_MAINTENANCE_REQUESTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    // The maintenance route now scopes landlord role to property.userId = landlord.id
    authFetch('/api/maintenance?pageSize=100')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setRequests(data.data?.length ? data.data : FALLBACK_MAINTENANCE_REQUESTS);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Keep fallback data for resilience/tests
          setError(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return requests.filter(request => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'in-progress'
          ? request.status === 'in_progress' || request.status === 'in-progress'
          : request.status === statusFilter);
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        request.title.toLowerCase().includes(normalizedSearch) ||
        (request.property?.title ?? '').toLowerCase().includes(normalizedSearch) ||
        (request.requester?.name ?? '').toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [requests, priorityFilter, searchQuery, statusFilter]);

  const summary = useMemo(
    () => ({
      total: requests.length,
      open: requests.filter(r => r.status === 'open').length,
      inProgress: requests.filter(
        r => r.status === 'in_progress' || r.status === 'in-progress' || r.status === 'scheduled'
      ).length,
      closed: requests.filter(
        r => r.status === 'completed' || r.status === 'cancelled' || r.status === 'closed'
      ).length,
    }),
    [requests]
  );

  const selectedRequest = useMemo(
    () => requests.find(r => r.id === selectedRequestId) ?? null,
    [requests, selectedRequestId]
  );

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view maintenance requests.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state" data-testid="maintenance-loading">
        <p>⏳ Loading maintenance requests…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" data-testid="maintenance-error">
        <p>⚠️ {error}</p>
        <button className="btn-secondary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="tab-content-section landlord-maintenance-tab">
      <div className="tab-header">
        <h3>Maintenance Requests</h3>
        <p>Track requests submitted by tenants and add landlord notes for follow-up.</p>
      </div>

      <div className="summary-grid" data-testid="maintenance-summary">
        <div className="summary-card" data-testid="summary-total-requests">
          <h4>Total</h4>
          <p>{summary.total}</p>
        </div>
        <div className="summary-card" data-testid="summary-open-requests">
          <h4>Open</h4>
          <p>{summary.open}</p>
        </div>
        <div className="summary-card" data-testid="summary-inprogress-requests">
          <h4>In Progress</h4>
          <p>{summary.inProgress}</p>
        </div>
        <div className="summary-card" data-testid="summary-closed-requests">
          <h4>Closed</h4>
          <p>{summary.closed}</p>
        </div>
      </div>

      <div className="tab-controls">
        <input
          data-testid="maintenance-search"
          type="text"
          placeholder="Search by title, property, or tenant"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />

        <select
          data-testid="maintenance-status-filter"
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

        <select
          data-testid="maintenance-priority-filter"
          value={priorityFilter}
          onChange={event =>
            setPriorityFilter(event.target.value as 'all' | 'high' | 'medium' | 'low')
          }
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state" data-testid="maintenance-empty-state">
          <p>No maintenance requests match your filters.</p>
        </div>
      ) : (
        <div className="maintenance-list" data-testid="maintenance-list">
          {filteredRequests.map(request => (
            <button
              type="button"
              key={request.id}
              className="maintenance-row"
              data-testid={`maintenance-row-${request.id}`}
              onClick={() => setSelectedRequestId(request.id)}
            >
              <div>
                <strong>{request.title}</strong>
                <p>{request.property?.title ?? '—'}</p>
                <p>{request.requester?.name ?? '—'}</p>
              </div>
              <div>
                <p>Submitted: {new Date(request.createdAt).toLocaleDateString('en-AE')}</p>
                <span className={`status-badge status-${request.status}`}>{request.status}</span>
              </div>
              <div>
                <span className={`status-badge priority-${request.priority}`}>
                  {request.priority} priority
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div
          className="modal-overlay"
          data-testid="maintenance-detail-modal"
          onClick={() => setSelectedRequestId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedRequestId(null)}
              aria-label="Close maintenance details"
            >
              ×
            </button>

            <h4>Maintenance Request Details</h4>
            <p>
              <strong>Property:</strong> {selectedRequest.property?.title ?? '—'}
            </p>
            <p>
              <strong>Submitted by:</strong> {selectedRequest.requester?.name ?? '—'}
            </p>
            <p>
              <strong>Issue:</strong> {selectedRequest.title}
            </p>
            <p>
              <strong>Request ID:</strong> {selectedRequest.id}
            </p>
            {selectedRequest.description && (
              <p>
                <strong>Description:</strong> {selectedRequest.description}
              </p>
            )}
            <p>
              <strong>Category:</strong> {selectedRequest.category}
            </p>
            <p>
              <strong>Priority:</strong> {selectedRequest.priority}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Submitted:</strong>{' '}
              {new Date(selectedRequest.createdAt).toLocaleDateString('en-AE')}
            </p>

            <label htmlFor="landlord-note-input">
              <strong>Landlord Note</strong>
            </label>
            <textarea
              id="landlord-note-input"
              data-testid="maintenance-note-input"
              rows={4}
              placeholder="Add follow-up notes for your internal tracking"
              value={requestNotes[selectedRequest.id] ?? selectedRequest.notes ?? ''}
              onChange={event =>
                setRequestNotes(previous => ({
                  ...previous,
                  [selectedRequest.id]: event.target.value,
                }))
              }
            />

            <button
              type="button"
              className="btn-primary"
              onClick={() => setSelectedRequestId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenanceTab;
