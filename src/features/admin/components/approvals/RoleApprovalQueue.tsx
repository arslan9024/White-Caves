import React, { useState, useEffect, useCallback } from 'react';
import { createLogger } from '../../../../utils/logger';

const log = createLogger('RoleApprovalQueue');
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import type { RoleRequest } from '../../../../store/roleSlice';
import { approveRoleRequest, rejectRoleRequest, setPendingRequests } from '../../../../store/roleSlice';
import { apiClient } from '../../../../utils/apiClient';
import { useToast } from '../../../../components/Toast';
import './Approvals.css';
import { formatDate as formatDateUtil } from '../../../../utils';

const RoleApprovalQueue = () => {
  const dispatch = useDispatch();
  const { pendingRequests } = useSelector((state: RootState) => state.role);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [filter, setFilter] = useState<string>('pending');
  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const toast = useToast();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchPendingRequests = useCallback(async () => {
    if (!token) return;
    
    try {
      setFetchError(null);
      apiClient.setAuthToken(token);
      const data = await apiClient.get('/admin/role-requests') as { requests?: RoleRequest[] };
      dispatch(setPendingRequests(data.requests || []));
    } catch (error: unknown) {
      log.error('Failed to fetch role requests:', error);
      setFetchError(error instanceof Error ? error.message : 'Failed to load role requests');
    } finally {
      setInitialLoading(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const filteredRequests = pendingRequests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleApprove = async (request: RoleRequest) => {
    setLoading(true);
    try {
      apiClient.setAuthToken(token!);
      await apiClient.post(`/admin/role-requests/${request.id}/approve`, { 
        reviewedBy: user?.id 
      });
      
      dispatch(approveRoleRequest({
        requestId: request.id,
        reviewedBy: user?.id ?? '',
      }));
      toast.success(`Role request for ${request.displayName || request.userName || 'user'} approved successfully`);
    } catch (error: unknown) {
      log.error('Approval error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (request: RoleRequest) => {
    if (!rejectionReason.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      apiClient.setAuthToken(token!);
      await apiClient.post(`/admin/role-requests/${request.id}/reject`, { 
        reviewedBy: user?.id,
        reason: rejectionReason,
      });
      
      dispatch(rejectRoleRequest({
        requestId: request.id,
        reviewedBy: user?.id ?? '',
        reason: rejectionReason,
      }));

      setSelectedRequest(null);
      setRejectionReason('');
    } catch (error: unknown) {
      log.error('Rejection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      buyer: 'Buyer',
      tenant: 'Tenant',
      seller: 'Seller',
      landlord: 'Landlord',
      leasing_agent: 'Leasing Agent',
      sales_agent: 'Sales Agent',
    };
    return labels[role] || role;
  };

  const getStatusBadge = (status: string): { class: string; label: string } => {
    const badges: Record<string, { class: string; label: string }> = {
      pending: { class: 'pending', label: 'Pending' },
      approved: { class: 'approved', label: 'Approved' },
      rejected: { class: 'rejected', label: 'Rejected' },
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString: string): string => formatDateUtil(dateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="role-approval-queue">
      <div className="queue-header">
        <h2>Role Approval Queue</h2>
        <div className="queue-filters">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="count-badge">
                  {pendingRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-queue">
          <div className="empty-icon">📋</div>
          <h3>No requests found</h3>
          <p>There are no {filter !== 'all' ? filter : ''} role requests at the moment.</p>
        </div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            return (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {request.userName?.[0] || '?'}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{request.userName || 'Unknown User'}</span>
                      <span className="user-email">{request.userEmail || request.userId}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <div className="request-body">
                  <div className="role-change">
                    <span className="current-role">{getRoleLabel(request.currentRole)}</span>
                    <span className="arrow">→</span>
                    <span className="requested-role">{getRoleLabel(request.requestedRole)}</span>
                  </div>
                  {request.reason && (
                    <p className="request-reason">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  )}
                  <span className="request-date">
                    Requested: {formatDate(request.requestedAt)}
                  </span>
                </div>

                {request.status === 'pending' && (
                  <div className="request-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(request)}
                      disabled={loading}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => setSelectedRequest(request)}
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status !== 'pending' && request.reviewedAt && (
                  <div className="review-info">
                    <span>
                      {request.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                      {formatDate(request.reviewedAt)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedRequest && (
        <div className="rejection-modal-overlay" onClick={() => setSelectedRequest(null)} role="presentation">
          <div className="rejection-modal" role="alertdialog" aria-modal="true" aria-label="Reject role request" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Escape') setSelectedRequest(null); }}>
            <h3>Reject Role Request</h3>
            <p>
              Please provide a reason for rejecting {selectedRequest.userName || 'this user'}'s 
              request to become a {getRoleLabel(selectedRequest.requestedRole)}.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
              <button
                className="confirm-reject-btn"
                onClick={() => handleReject(selectedRequest)}
                disabled={loading || !rejectionReason.trim()}
              >
                {loading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleApprovalQueue;
