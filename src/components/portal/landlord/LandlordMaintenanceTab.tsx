/**
 * LandlordMaintenanceTab — Phase 2.5: Maintenance Requests
 *
 * List of maintenance requests submitted by tenants for landlord's properties.
 * Shows: property, title, submitted date, priority (urgent/high/normal), status (open/in progress/closed)
 * Landlord can add notes/comments on a request
 * Cannot close requests (only managing agent can)
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

const LandlordMaintenanceTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>(
    'all'
  );
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requestNotes, setRequestNotes] = useState<Record<string, string>>({});

  const mockRequests = useMemo(
    () => [
      {
        id: 'req-001',
        property: 'Marina View 2BR Apartment',
        tenant: 'Ahmed Al-Rashid',
        title: 'AC unit not cooling properly',
        description: 'Bedroom AC has weak airflow and does not cool at night.',
        submittedDate: '2026-04-11',
        priority: 'high' as const,
        status: 'open' as const,
      },
      {
        id: 'req-002',
        property: 'Downtown Studio',
        tenant: 'Sarah Johnson',
        title: 'Kitchen sink leakage',
        description: 'Slow leak under sink cabinet causing damp smell.',
        submittedDate: '2026-04-08',
        priority: 'medium' as const,
        status: 'in-progress' as const,
      },
      {
        id: 'req-003',
        property: 'JBR 3BR Villa',
        tenant: 'Mohammed Hassan',
        title: 'Bathroom light fixture replacement',
        description: 'Master bathroom light stopped working.',
        submittedDate: '2026-03-28',
        priority: 'low' as const,
        status: 'closed' as const,
      },
      {
        id: 'req-004',
        property: 'Marina View 2BR Apartment',
        tenant: 'Fatima Al-Mansoori',
        title: 'Water heater inconsistent',
        description: 'Hot water turns cold after 5 minutes in guest bathroom.',
        submittedDate: '2026-04-15',
        priority: 'high' as const,
        status: 'open' as const,
      },
    ],
    []
  );

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return mockRequests.filter(request => {
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        request.title.toLowerCase().includes(normalizedSearch) ||
        request.property.toLowerCase().includes(normalizedSearch) ||
        request.tenant.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [mockRequests, priorityFilter, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: mockRequests.length,
      open: mockRequests.filter(request => request.status === 'open').length,
      inProgress: mockRequests.filter(request => request.status === 'in-progress').length,
      closed: mockRequests.filter(request => request.status === 'closed').length,
    };
  }, [mockRequests]);

  const selectedRequest = useMemo(
    () => mockRequests.find(request => request.id === selectedRequestId) ?? null,
    [mockRequests, selectedRequestId]
  );

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view maintenance requests.</p>
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
                <p>{request.property}</p>
                <p>{request.tenant}</p>
              </div>
              <div>
                <p>Submitted: {request.submittedDate}</p>
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
              <strong>ID:</strong> {selectedRequest.id}
            </p>
            <p>
              <strong>Property:</strong> {selectedRequest.property}
            </p>
            <p>
              <strong>Tenant:</strong> {selectedRequest.tenant}
            </p>
            <p>
              <strong>Issue:</strong> {selectedRequest.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedRequest.description}
            </p>
            <p>
              <strong>Priority:</strong> {selectedRequest.priority}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>

            <label htmlFor="landlord-note-input">
              <strong>Landlord Note</strong>
            </label>
            <textarea
              id="landlord-note-input"
              data-testid="maintenance-note-input"
              rows={4}
              placeholder="Add follow-up notes for your internal tracking"
              value={requestNotes[selectedRequest.id] ?? ''}
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
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenanceTab;
