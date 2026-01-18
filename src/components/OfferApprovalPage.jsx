import React, { useState } from 'react';
import './OfferApprovalPage.css';

const OfferApprovalPage = ({
  propertyDetails,
  offerDetails,
  landlordDetails,
  tenantDetails,
  onApprove,
  onReject,
  userRole = 'tenant', // 'tenant', 'landlord', 'agent'
  isLoading = false,
}) => {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleApprove = () => {
    setConfirmAction('approve');
    setShowConfirmDialog(true);
  };

  const handleReject = () => {
    setConfirmAction('reject');
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    setShowConfirmDialog(false);
    if (confirmAction === 'approve') {
      await onApprove(approvalNotes);
    } else if (confirmAction === 'reject') {
      await onReject(approvalNotes);
    }
  };

  const getRoleSpecificMessage = () => {
    switch (userRole) {
      case 'tenant':
        return 'Please review the offer terms and confirm if you accept this property offer.';
      case 'landlord':
        return 'Please review the tenant details and rental terms before accepting.';
      case 'agent':
        return 'Please review all details before sending for signatures.';
      default:
        return 'Please review the offer details.';
    }
  };

  return (
    <div className="offer-approval-page">
      <div className="approval-header">
        <h1>Offer Review & Approval</h1>
        <p className="role-badge">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
      </div>

      <div className="approval-message">
        <p>{getRoleSpecificMessage()}</p>
      </div>

      <div className="approval-sections">
        {/* Property Details Section */}
        <div className="approval-section">
          <h2>Property Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Property Name</label>
              <p>{propertyDetails?.name || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Location</label>
              <p>{propertyDetails?.location || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Property Type</label>
              <p>{propertyDetails?.type || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Size</label>
              <p>{propertyDetails?.size || 'N/A'} sqft</p>
            </div>
          </div>
        </div>

        {/* Offer Terms Section */}
        <div className="approval-section">
          <h2>Offer Terms</h2>
          <div className="details-grid">
            <div className="detail-item highlight">
              <label>Monthly Rent</label>
              <p className="amount">AED {offerDetails?.monthlyRent?.toLocaleString() || '0'}</p>
            </div>
            <div className="detail-item highlight">
              <label>Security Deposit</label>
              <p className="amount">AED {offerDetails?.securityDeposit?.toLocaleString() || '0'}</p>
            </div>
            <div className="detail-item">
              <label>Lease Duration</label>
              <p>{offerDetails?.leaseDuration || 'N/A'} months</p>
            </div>
            <div className="detail-item">
              <label>Start Date</label>
              <p>{offerDetails?.startDate ? new Date(offerDetails.startDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {offerDetails?.specialTerms && (
            <div className="terms-section">
              <h3>Special Terms</h3>
              <p>{offerDetails.specialTerms}</p>
            </div>
          )}
        </div>

        {/* Party Details Section */}
        {userRole === 'agent' && (
          <>
            <div className="approval-section">
              <h2>Landlord Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Name</label>
                  <p>{landlordDetails?.name || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{landlordDetails?.email || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{landlordDetails?.phone || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Emirates ID</label>
                  <p>{landlordDetails?.emiratesId || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="approval-section">
              <h2>Tenant Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Name</label>
                  <p>{tenantDetails?.name || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{tenantDetails?.email || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{tenantDetails?.phone || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Emirates ID</label>
                  <p>{tenantDetails?.emiratesId || 'N/A'}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notes Section */}
        <div className="approval-section">
          <h2>Additional Notes</h2>
          <textarea
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            placeholder="Add any notes or comments..."
            rows="4"
            className="approval-notes"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="approval-actions">
        <button
          onClick={handleReject}
          disabled={isLoading}
          className="btn-reject"
        >
          {isLoading ? 'Processing...' : 'Reject Offer'}
        </button>
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="btn-approve"
        >
          {isLoading ? 'Processing...' : 'Approve Offer'}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-dialog-overlay">
          <div className="confirmation-dialog">
            <h3>
              {confirmAction === 'approve'
                ? 'Confirm Approval'
                : 'Confirm Rejection'}
            </h3>
            <p>
              {confirmAction === 'approve'
                ? 'Are you sure you want to approve this offer? This action cannot be undone.'
                : 'Are you sure you want to reject this offer? Please provide a reason.'}
            </p>
            <div className="dialog-actions">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={confirmAction === 'approve' ? 'btn-approve' : 'btn-reject'}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferApprovalPage;
