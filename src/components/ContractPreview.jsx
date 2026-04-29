import React, { useState } from 'react';
import './ContractPreview.css';

/**
 * ContractPreview Component
 * Displays contract details before signing
 * Shows contract content, terms, and signature requirements
 */
const ContractPreview = ({
  contract,
  onSign,
  onEdit,
  onCancel,
  onDownload,
  loading = false,
  error = null
}) => {
  const [expandedSections, setExpandedSections] = useState({
    terms: false,
    property: true,
    parties: true,
    schedule: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (error) {
    return (
      <div className="contract-preview">
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
        <button onClick={onCancel} className="btn-secondary">
          Back to Editor
        </button>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contract-preview">
        <div className="empty-state">
          <p>No contract to preview</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="contract-preview">
      <div className="preview-header">
        <div className="header-content">
          <h2>Contract Preview</h2>
          <p className="contract-type">{contract.templateType} Contract</p>
          <p className="contract-date">Created: {formatDate(contract.createdDate)}</p>
        </div>
        <div className="header-actions">
          {onDownload && (
            <button onClick={onDownload} className="btn-icon" title="Download">
              ⬇️ Download PDF
            </button>
          )}
        </div>
      </div>

      <div className="preview-content">
        {/* Property Details Section */}
        <section className="preview-section">
          <button
            className="section-header"
            onClick={() => toggleSection('property')}
          >
            <span className="icon">{expandedSections.property ? '▼' : '▶'}</span>
            <h3>Property Details</h3>
          </button>
          {expandedSections.property && (
            <div className="section-body">
              <div className="detail-group">
                <div className="detail-row">
                  <span className="label">Property Title:</span>
                  <span className="value">{contract.propertyTitle}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">{contract.propertyLocation}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Size:</span>
                  <span className="value">{contract.propertySize} sqft</span>
                </div>
                {contract.bedrooms && (
                  <div className="detail-row">
                    <span className="label">Bedrooms:</span>
                    <span className="value">{contract.bedrooms}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Parties Section */}
        <section className="preview-section">
          <button
            className="section-header"
            onClick={() => toggleSection('parties')}
          >
            <span className="icon">{expandedSections.parties ? '▼' : '▶'}</span>
            <h3>Party Details</h3>
          </button>
          {expandedSections.parties && (
            <div className="section-body">
              <div className="parties-grid">
                {/* Seller */}
                <div className="party-card">
                  <h4>Seller</h4>
                  <p className="party-name">{contract.sellerName}</p>
                  <p className="party-email">{contract.sellerEmail}</p>
                  <p className="party-phone">{contract.sellerPhone}</p>
                </div>

                {/* Buyer/Tenant */}
                <div className="party-card">
                  <h4>Buyer/Tenant</h4>
                  <p className="party-name">{contract.buyerName}</p>
                  <p className="party-email">{contract.buyerEmail}</p>
                  <p className="party-phone">{contract.buyerPhone}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Financial Details Section */}
        <section className="preview-section">
          <button
            className="section-header"
            onClick={() => toggleSection('schedule')}
          >
            <span className="icon">{expandedSections.schedule ? '▼' : '▶'}</span>
            <h3>Financial Details</h3>
          </button>
          {expandedSections.schedule && (
            <div className="section-body">
              <div className="detail-group">
                {contract.totalPrice && (
                  <div className="detail-row highlight">
                    <span className="label">Total Price:</span>
                    <span className="value">{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'AED'
                    }).format(contract.totalPrice)}</span>
                  </div>
                )}
                {contract.downPayment && (
                  <div className="detail-row">
                    <span className="label">Down Payment:</span>
                    <span className="value">{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'AED'
                    }).format(contract.downPayment)}</span>
                  </div>
                )}
                {contract.startDate && (
                  <div className="detail-row">
                    <span className="label">Start Date:</span>
                    <span className="value">{formatDate(contract.startDate)}</span>
                  </div>
                )}
                {contract.endDate && (
                  <div className="detail-row">
                    <span className="label">End Date:</span>
                    <span className="value">{formatDate(contract.endDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Terms Section */}
        <section className="preview-section">
          <button
            className="section-header"
            onClick={() => toggleSection('terms')}
          >
            <span className="icon">{expandedSections.terms ? '▼' : '▶'}</span>
            <h3>Terms & Conditions</h3>
          </button>
          {expandedSections.terms && (
            <div className="section-body">
              <div className="terms-content">
                {contract.termsAndConditions ? (
                  <p>{contract.termsAndConditions}</p>
                ) : (
                  <p className="no-terms">Standard terms apply</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Signatures Section */}
        <section className="preview-section signatures-section">
          <h3>Signatures</h3>
          <div className="signatures-grid">
            <div className="signature-placeholder">
              <p className="placeholder-label">Seller Signature</p>
              {contract.sellerSignature ? (
                <img src={contract.sellerSignature} alt="Seller signature" />
              ) : (
                <div className="empty-signature">Pending signature</div>
              )}
              <p className="signer-name">{contract.sellerName}</p>
            </div>

            <div className="signature-placeholder">
              <p className="placeholder-label">Buyer/Tenant Signature</p>
              {contract.buyerSignature ? (
                <img src={contract.buyerSignature} alt="Buyer signature" />
              ) : (
                <div className="empty-signature">Pending signature</div>
              )}
              <p className="signer-name">{contract.buyerName}</p>
            </div>
          </div>
        </section>

        {/* Status Section */}
        <section className="preview-section status-section">
          <h3>Contract Status</h3>
          <div className="status-info">
            <div className="status-badge" data-status={contract.status?.toLowerCase()}>
              {contract.status || 'Draft'}
            </div>
            {contract.lastModified && (
              <p className="status-date">
                Last modified: {formatDate(contract.lastModified)}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="preview-actions">
        <button
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={onEdit}
          className="btn-secondary"
          disabled={loading}
        >
          Edit Contract
        </button>
        <button
          onClick={onSign}
          className="btn-primary"
          disabled={loading || contract.status === 'Signed'}
        >
          {loading ? 'Processing...' : 'Proceed to Sign'}
        </button>
      </div>
    </div>
  );
};

export default ContractPreview;
