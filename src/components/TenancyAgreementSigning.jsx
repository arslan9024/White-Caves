import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SignatureCanvas from 'react-signature-canvas';
import './TenancyAgreementSigning.css';

export default function TenancyAgreementSigning() {
  const currentUser = useSelector(state => state.user.currentUser);
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const signatureRef = useRef(null);

  useEffect(() => {
    fetchUserAgreements();
  }, [currentUser]);

  const fetchUserAgreements = async () => {
    if (!currentUser?._id) return;
    
    try {
      const response = await fetch(`/api/tenancy-agreements/user/${currentUser._id}`);
      const data = await response.json();
      setAgreements(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agreements:', error);
      setLoading(false);
    }
  };

  const openSignatureModal = (agreement, role) => {
    setSelectedAgreement(agreement);
    setUserRole(role);
    setUserEmail(currentUser?.email || '');
    setShowSignatureModal(true);
  };

  const openRejectModal = (agreement, role) => {
    setSelectedAgreement(agreement);
    setUserRole(role);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const closeModals = () => {
    setShowSignatureModal(false);
    setShowRejectModal(false);
    setSelectedAgreement(null);
    setUserRole(null);
    setUserEmail('');
    setRejectionReason('');
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSign = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert('Please provide a signature');
      return;
    }

    if (!userEmail || !userEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setSigning(true);
    const signatureData = signatureRef.current.toDataURL();

    try {
      const response = await fetch(`/api/tenancy-agreements/${selectedAgreement._id}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
          signatureData,
          userName: currentUser.name,
          userEmail: userEmail,
          userRole
        }),
      });

      if (response.ok) {
        const updatedAgreement = await response.json();
        setAgreements(agreements.map(a => 
          a._id === updatedAgreement._id ? updatedAgreement : a
        ));
        alert('Agreement signed successfully! ✓');
        closeModals();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to sign agreement');
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      alert('Failed to sign agreement');
    } finally {
      setSigning(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setSigning(true);

    try {
      const response = await fetch(`/api/tenancy-agreements/${selectedAgreement._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
          userRole,
          rejectionReason
        }),
      });

      if (response.ok) {
        const updatedAgreement = await response.json();
        setAgreements(agreements.map(a => 
          a._id === updatedAgreement._id ? updatedAgreement : a
        ));
        alert('Agreement rejected');
        closeModals();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reject agreement');
      }
    } catch (error) {
      console.error('Error rejecting agreement:', error);
      alert('Failed to reject agreement');
    } finally {
      setSigning(false);
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const getUserRole = (agreement) => {
    if (agreement.landlordId._id === currentUser._id || agreement.landlordId === currentUser._id) {
      return 'landlord';
    } else if (agreement.tenantId._id === currentUser._id || agreement.tenantId === currentUser._id) {
      return 'tenant';
    }
    return null;
  };

  const canSign = (agreement) => {
    const role = getUserRole(agreement);
    if (!role) return false;
    
    if (agreement.status === 'REJECTED') return false;
    
    if (role === 'landlord') {
      return !agreement.signatures.landlord.signed && agreement.signatures.landlord.status !== 'REJECTED';
    } else {
      return !agreement.signatures.tenant.signed && agreement.signatures.tenant.status !== 'REJECTED';
    }
  };

  const canReject = (agreement) => {
    const role = getUserRole(agreement);
    if (!role) return false;
    
    if (role === 'landlord') {
      return !agreement.signatures.landlord.signed && agreement.signatures.landlord.status !== 'REJECTED';
    } else {
      return !agreement.signatures.tenant.signed && agreement.signatures.tenant.status !== 'REJECTED';
    }
  };

  const getStatusBadge = (agreement) => {
    if (agreement.status === 'REJECTED') {
      return <span className="status-badge rejected">✗ Rejected</span>;
    } else if (agreement.status === 'FULLY_SIGNED') {
      return <span className="status-badge fully-signed">✓ Fully Signed</span>;
    } else if (agreement.status === 'PARTIALLY_SIGNED') {
      return <span className="status-badge partially-signed">⚠ Partially Signed</span>;
    } else {
      return <span className="status-badge pending">⏳ Pending Signatures</span>;
    }
  };

  const getSignatureStatus = (signature) => {
    if (signature.status === 'REJECTED') {
      return <span className="sig-status rejected">✗ Rejected</span>;
    } else if (signature.status === 'SIGNED' || signature.signed) {
      return <span className="sig-status signed">✓ Signed</span>;
    } else {
      return <span className="sig-status pending">⏳ Pending</span>;
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!currentUser) {
    return (
      <div className="tenancy-container">
        <div className="no-auth-message">
          <h2>Please log in to view tenancy agreements</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="tenancy-container">
      <div className="tenancy-header">
        <h1>Tenancy Agreements</h1>
        <p>Sign and manage your rental agreements with email validation</p>
      </div>

      {agreements.length === 0 ? (
        <div className="no-agreements">
          <p>No tenancy agreements found</p>
        </div>
      ) : (
        <div className="agreements-list">
          {agreements.map((agreement) => {
            const role = getUserRole(agreement);
            const landlordData = agreement.landlordId.name ? agreement.landlordId : { name: 'Landlord' };
            const tenantData = agreement.tenantId.name ? agreement.tenantId : { name: 'Tenant' };

            return (
              <div key={agreement._id} className={`agreement-card ${agreement.status.toLowerCase()}`}>
                <div className="agreement-header">
                  <h3>{agreement.agreementDetails.propertyAddress}</h3>
                  {getStatusBadge(agreement)}
                </div>

                <div className="agreement-details">
                  <div className="detail-row">
                    <span className="label">Monthly Rent:</span>
                    <span className="value">${agreement.agreementDetails.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Security Deposit:</span>
                    <span className="value">${agreement.agreementDetails.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Lease Period:</span>
                    <span className="value">
                      {new Date(agreement.agreementDetails.leaseStartDate).toLocaleDateString()} - {new Date(agreement.agreementDetails.leaseEndDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Your Role:</span>
                    <span className="value role-badge">{role?.toUpperCase()}</span>
                  </div>
                </div>

                <div className="signatures-status">
                  <div className="signature-item">
                    <div className="sig-header">
                      <span className="signature-label">Landlord ({landlordData.name})</span>
                      {getSignatureStatus(agreement.signatures.landlord)}
                    </div>
                    <div className="sig-email">Email: {agreement.landlordEmail}</div>
                    {agreement.signatures.landlord.signed && (
                      <div className="sig-date">Signed: {new Date(agreement.signatures.landlord.signedAt).toLocaleDateString()}</div>
                    )}
                    {agreement.signatures.landlord.status === 'REJECTED' && agreement.signatures.landlord.rejectionReason && (
                      <div className="sig-rejection">Reason: {agreement.signatures.landlord.rejectionReason}</div>
                    )}
                  </div>
                  <div className="signature-item">
                    <div className="sig-header">
                      <span className="signature-label">Tenant ({tenantData.name})</span>
                      {getSignatureStatus(agreement.signatures.tenant)}
                    </div>
                    <div className="sig-email">Email: {agreement.tenantEmail}</div>
                    {agreement.signatures.tenant.signed && (
                      <div className="sig-date">Signed: {new Date(agreement.signatures.tenant.signedAt).toLocaleDateString()}</div>
                    )}
                    {agreement.signatures.tenant.status === 'REJECTED' && agreement.signatures.tenant.rejectionReason && (
                      <div className="sig-rejection">Reason: {agreement.signatures.tenant.rejectionReason}</div>
                    )}
                  </div>
                </div>

                <div className="action-buttons">
                  {canSign(agreement) && (
                    <button
                      className="sign-button"
                      onClick={() => openSignatureModal(agreement, role)}
                    >
                      Sign Agreement
                    </button>
                  )}
                  {canReject(agreement) && (
                    <button
                      className="reject-button"
                      onClick={() => openRejectModal(agreement, role)}
                    >
                      Reject Agreement
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showSignatureModal && (
        <div className="modal-overlay">
          <div className="signature-modal">
            <div className="modal-header">
              <h2>Sign Tenancy Agreement</h2>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>

            <div className="modal-content">
              <div className="agreement-summary">
                <p><strong>Property:</strong> {selectedAgreement?.agreementDetails.propertyAddress}</p>
                <p><strong>Signing as:</strong> {userRole?.toUpperCase()}</p>
                <p className="email-requirement"><strong>Required Email:</strong> {userRole === 'landlord' ? selectedAgreement?.landlordEmail : selectedAgreement?.tenantEmail}</p>
              </div>

              <div className="email-input-section">
                <label>Confirm Your Email:</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="email-input"
                />
                <p className="validation-note">Email must match the registered {userRole} email</p>
              </div>

              <div className="signature-section">
                <label>Your Signature:</label>
                <div className="signature-pad-container">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'signature-pad',
                      width: 500,
                      height: 200
                    }}
                  />
                </div>
                <button className="clear-btn" onClick={clearSignature}>Clear</button>
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={closeModals}>
                  Cancel
                </button>
                <button 
                  className="submit-btn" 
                  onClick={handleSign}
                  disabled={signing}
                >
                  {signing ? 'Signing...' : 'Submit Signature'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="signature-modal reject-modal">
            <div className="modal-header">
              <h2>Reject Tenancy Agreement</h2>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>

            <div className="modal-content">
              <div className="agreement-summary">
                <p><strong>Property:</strong> {selectedAgreement?.agreementDetails.propertyAddress}</p>
                <p><strong>Rejecting as:</strong> {userRole?.toUpperCase()}</p>
              </div>

              <div className="rejection-section">
                <label>Reason for Rejection:</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this agreement..."
                  className="rejection-textarea"
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={closeModals}>
                  Cancel
                </button>
                <button 
                  className="submit-reject-btn" 
                  onClick={handleReject}
                  disabled={signing}
                >
                  {signing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
