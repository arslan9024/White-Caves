/**
 * TenantMaintenanceTab — Phase 2.10: Maintenance Requests
 *
 * Submit and view maintenance requests, track status.
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

interface MaintenanceRequest {
  id: string;
  title: string;
  submitted: string;
  status: 'open' | 'in-progress' | 'closed';
  isNew?: boolean;
}

const TenantMaintenanceTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>(
    'all'
  );
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [newRequests, setNewRequests] = useState<MaintenanceRequest[]>([]);

  const seedRequests: MaintenanceRequest[] = useMemo(
    () => [
      {
        id: 'tm-001',
        title: 'AC service required',
        submitted: '2026-04-10',
        status: 'open' as const,
      },
      {
        id: 'tm-002',
        title: 'Kitchen sink leakage',
        submitted: '2026-04-07',
        status: 'in-progress' as const,
      },
      {
        id: 'tm-003',
        title: 'Balcony door alignment',
        submitted: '2026-03-29',
        status: 'closed' as const,
      },
    ],
    []
  );

  const requests = useMemo(() => [...newRequests, ...seedRequests], [newRequests, seedRequests]);

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

  const handleSubmit = () => {
    const trimmedTitle = titleInput.trim();
    const trimmedDesc = descriptionInput.trim();

    if (!trimmedTitle) {
      setSubmitError('Please enter an issue title.');
      return;
    }
    if (!trimmedDesc) {
      setSubmitError('Please describe the issue.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newId = `tm-${String(newRequests.length + seedRequests.length + 1).padStart(3, '0')}`;
    const newRequest: MaintenanceRequest = {
      id: newId,
      title: trimmedTitle,
      submitted: today,
      status: 'open',
      isNew: true,
    };

    setNewRequests(prev => [newRequest, ...prev]);
    setTitleInput('');
    setDescriptionInput('');
    setSubmitError('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

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
        {submitSuccess && (
          <div className="success-message" data-testid="tenant-maintenance-success">
            ✅ Your maintenance request has been submitted. Our team will be in touch shortly.
          </div>
        )}
        {submitError && (
          <div className="error-message" data-testid="tenant-maintenance-error" role="alert">
            {submitError}
          </div>
        )}
        <input
          data-testid="tenant-maintenance-title-input"
          type="text"
          placeholder="Issue title"
          value={titleInput}
          onChange={event => {
            setTitleInput(event.target.value);
            if (submitError) setSubmitError('');
          }}
        />
        <textarea
          data-testid="tenant-maintenance-description-input"
          placeholder="Describe the issue"
          rows={3}
          value={descriptionInput}
          onChange={event => {
            setDescriptionInput(event.target.value);
            if (submitError) setSubmitError('');
          }}
        />
        <button
          type="button"
          className="btn-primary"
          data-testid="tenant-maintenance-submit-btn"
          onClick={handleSubmit}
        >
          Submit Request
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
              className={`maintenance-row${request.isNew ? ' maintenance-row--new' : ''}`}
              data-testid={`tenant-maintenance-row-${request.id}`}
            >
              <div>
                <strong>{request.title}</strong>
                <p>
                  {request.id}
                  {request.isNew ? ' · Just submitted' : ''}
                </p>
              </div>
              <div>
                <p>Submitted: {request.submitted}</p>
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
