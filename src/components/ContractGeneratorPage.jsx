import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ContractGeneratorPage.css';

/**
 * ContractGeneratorPage
 * Displays contract generation workflow and preview
 */
const ContractGeneratorPage = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState('preview'); // preview, review, customize, ready
  const [contract, setContract] = useState(null);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generateError, setGenerateError] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizations, setCustomizations] = useState({});

  // Fetch offer and contract on mount
  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/offers/${offerId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch offer');
      }

      const data = await response.json();
      setOffer(data.data || data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generateContract = async () => {
    try {
      setGenerateError(null);
      const response = await fetch(`/api/contract-generator/from-offer/${offerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: 'White Caves Real Estate LLC',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate contract');
      }

      const data = await response.json();
      setContract(data.data);
      setStep('review');
    } catch (err) {
      setGenerateError(err.message);
    }
  };

  const updateCustomization = (field, value) => {
    setCustomizations({
      ...customizations,
      [field]: value,
    });
  };

  const handlePreview = async () => {
    if (!contract) return;

    try {
      const response = await fetch(`/api/contract-generator/${contract._id}/preview`);
      const html = await response.text();

      // Open in new window for preview
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(html);
      previewWindow.document.close();
    } catch (err) {
      console.error('Error previewing contract:', err);
    }
  };

  const handleSave = async () => {
    if (!contract) return;

    try {
      const response = await fetch(`/api/contract-generator/${contract._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customizations),
      });

      if (!response.ok) {
        throw new Error('Failed to save contract');
      }

      setStep('ready');
    } catch (err) {
      setGenerateError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="contract-generator">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contract-generator">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/offers')} className="btn btn-primary">
            Back to Offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-generator">
      {/* Header */}
      <div className="cg-header">
        <h1>Contract Generation</h1>
        <div className="breadcrumbs">
          <span className={`step ${step === 'preview' ? 'active' : 'completed'}`}>
            <span className="number">1</span> Preview
          </span>
          <span className="separator">→</span>
          <span className={`step ${step === 'review' ? 'active' : step === 'preview' ? 'pending' : 'completed'}`}>
            <span className="number">2</span> Review
          </span>
          <span className="separator">→</span>
          <span className={`step ${step === 'customize' ? 'active' : step === 'review' ? 'pending' : 'completed'}`}>
            <span className="number">3</span> Customize
          </span>
          <span className="separator">→</span>
          <span className={`step ${step === 'ready' ? 'active' : 'pending'}`}>
            <span className="number">4</span> Ready
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="cg-content">
        {/* Offer Summary */}
        {offer && (
          <div className="offer-summary">
            <h2>Offer Summary</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Property</span>
                <span className="value">{offer.propertyId?.name || 'N/A'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Monthly Rent</span>
                <span className="value">AED {offer.monthlyRent?.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Lease Duration</span>
                <span className="value">{offer.leaseDuration} months</span>
              </div>
              <div className="summary-item">
                <span className="label">Start Date</span>
                <span className="value">{new Date(offer.startDate).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Security Deposit</span>
                <span className="value">AED {offer.securityDeposit?.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Status</span>
                <span className={`value status ${offer.status}`}>{offer.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="step-content">
            <div className="step-info">
              <h3>Step 1: Ready to Generate?</h3>
              <p>
                The offer has been approved by both the landlord and tenant. You can now generate a formal EJARI-compliant
                tenancy contract based on the offer details.
              </p>
            </div>

            {generateError && (
              <div className="error-message">
                <p>{generateError}</p>
              </div>
            )}

            <div className="step-actions">
              <button onClick={generateContract} className="btn btn-primary btn-lg">
                Generate Contract Now
              </button>
              <button onClick={() => navigate(`/offers/${offerId}`)} className="btn btn-secondary">
                Back to Offer
              </button>
            </div>
          </div>
        )}

        {/* Step: Review */}
        {step === 'review' && contract && (
          <div className="step-content">
            <div className="step-info">
              <h3>Step 2: Review Contract Details</h3>
              <p>Review the generated contract details below. You can customize specific fields if needed.</p>
            </div>

            <div className="contract-preview-box">
              <div className="preview-section">
                <h4>Property Details</h4>
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="label">Property Name</span>
                    <span className="value">{contract.propertyDetails?.name}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Type</span>
                    <span className="value">{contract.propertyDetails?.type}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Location</span>
                    <span className="value">{contract.propertyDetails?.location}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Size</span>
                    <span className="value">{contract.propertyDetails?.size} sqft</span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h4>Lease Terms</h4>
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="label">Monthly Rent</span>
                    <span className="value">AED {contract.leaseTerms?.monthlyRent?.toLocaleString()}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Duration</span>
                    <span className="value">{contract.leaseTerms?.duration} months</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Security Deposit</span>
                    <span className="value">AED {contract.leaseTerms?.securityDeposit?.toLocaleString()}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Cheque Frequency</span>
                    <span className="value">{contract.leaseTerms?.chequeFrequency}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button onClick={handlePreview} className="btn btn-secondary">
                Preview Full Contract
              </button>
              <button
                onClick={() => setStep('customize')}
                className="btn btn-primary"
              >
                Customize Details
              </button>
            </div>
          </div>
        )}

        {/* Step: Customize */}
        {step === 'customize' && contract && (
          <div className="step-content">
            <div className="step-info">
              <h3>Step 3: Customize Contract (Optional)</h3>
              <p>Update any contract details that need to be modified before signing.</p>
            </div>

            <div className="customize-form">
              <div className="form-section">
                <h4>Landlord Details</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      defaultValue={contract.landlordDetails?.name}
                      onChange={(e) => updateCustomization('landlordDetails.name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      defaultValue={contract.landlordDetails?.email}
                      onChange={(e) => updateCustomization('landlordDetails.email', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      defaultValue={contract.landlordDetails?.phone}
                      onChange={(e) => updateCustomization('landlordDetails.phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Emirates ID</label>
                    <input
                      type="text"
                      defaultValue={contract.landlordDetails?.emiratesId}
                      onChange={(e) => updateCustomization('landlordDetails.emiratesId', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Tenant Details</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      defaultValue={contract.tenantDetails?.name}
                      onChange={(e) => updateCustomization('tenantDetails.name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      defaultValue={contract.tenantDetails?.email}
                      onChange={(e) => updateCustomization('tenantDetails.email', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      defaultValue={contract.tenantDetails?.phone}
                      onChange={(e) => updateCustomization('tenantDetails.phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Emirates ID</label>
                    <input
                      type="text"
                      defaultValue={contract.tenantDetails?.emiratesId}
                      onChange={(e) => updateCustomization('tenantDetails.emiratesId', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Lease Terms</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Monthly Rent (AED)</label>
                    <input
                      type="number"
                      defaultValue={contract.leaseTerms?.monthlyRent}
                      onChange={(e) => updateCustomization('leaseTerms.monthlyRent', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Security Deposit (AED)</label>
                    <input
                      type="number"
                      defaultValue={contract.leaseTerms?.securityDeposit}
                      onChange={(e) => updateCustomization('leaseTerms.securityDeposit', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Rent Increase %</label>
                    <input
                      type="number"
                      defaultValue={contract.leaseTerms?.rentIncreasePercentage}
                      onChange={(e) => updateCustomization('leaseTerms.rentIncreasePercentage', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Special Terms</label>
                    <textarea
                      defaultValue={contract.leaseTerms?.specialTerms}
                      onChange={(e) => updateCustomization('leaseTerms.specialTerms', e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button onClick={() => setStep('review')} className="btn btn-secondary">
                Back
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save & Continue
              </button>
            </div>
          </div>
        )}

        {/* Step: Ready */}
        {step === 'ready' && contract && (
          <div className="step-content">
            <div className="success-message">
              <h3>✓ Contract Generated Successfully!</h3>
              <p>The contract is ready for signature collection.</p>
            </div>

            <div className="ready-options">
              <div className="option-box">
                <h4>Next Steps</h4>
                <ul>
                  <li>Send contract to landlord for signature</li>
                  <li>Send contract to tenant for signature</li>
                  <li>Collect signatures from both parties</li>
                  <li>Register contract with EJARI</li>
                  <li>Send final signed copy to all parties</li>
                </ul>
              </div>

              <div className="option-box">
                <h4>Contract Information</h4>
                <div className="info-item">
                  <span className="label">Contract ID</span>
                  <span className="value">{contract._id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status</span>
                  <span className="value">{contract.status}</span>
                </div>
                <div className="info-item">
                  <span className="label">Created</span>
                  <span className="value">{new Date(contract.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button onClick={handlePreview} className="btn btn-secondary">
                Preview Contract
              </button>
              <button onClick={() => navigate(`/contracts/${contract._id}/signature`)} className="btn btn-primary">
                Proceed to Signatures
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractGeneratorPage;
