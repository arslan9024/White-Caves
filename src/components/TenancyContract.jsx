import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import SignaturePad from './SignaturePad';
import './TenancyContract.css';

export default function TenancyContract({ 
  contractData,
  onSave,
  onUploadToDrive,
  mode = 'view'
}) {
  const user = useSelector(state => state.user.currentUser);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentSigner, setCurrentSigner] = useState(null);
  const [signatures, setSignatures] = useState({
    landlord: contractData?.signatures?.landlord || null,
    tenant: contractData?.signatures?.tenant || null,
    broker: contractData?.signatures?.broker || null
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const contractRef = useRef(null);

  const defaultContractData = {
    contractNumber: contractData?.contractNumber || `TC-${Date.now()}`,
    propertyAddress: contractData?.propertyAddress || '',
    propertyType: contractData?.propertyType || 'Apartment',
    landlordName: contractData?.landlordName || '',
    landlordEmail: contractData?.landlordEmail || '',
    landlordPhone: contractData?.landlordPhone || '',
    landlordEmirates: contractData?.landlordEmirates || '',
    tenantName: contractData?.tenantName || '',
    tenantEmail: contractData?.tenantEmail || '',
    tenantPhone: contractData?.tenantPhone || '',
    tenantEmirates: contractData?.tenantEmirates || '',
    brokerName: contractData?.brokerName || '',
    brokerLicense: contractData?.brokerLicense || '',
    startDate: contractData?.startDate || '',
    endDate: contractData?.endDate || '',
    rentAmount: contractData?.rentAmount || '',
    securityDeposit: contractData?.securityDeposit || '',
    paymentFrequency: contractData?.paymentFrequency || 'Annual',
    numberOfCheques: contractData?.numberOfCheques || 1,
    createdAt: contractData?.createdAt || new Date().toISOString(),
    status: contractData?.status || 'draft'
  };

  const data = { ...defaultContractData, ...contractData };

  const handleSign = (role) => {
    setCurrentSigner(role);
    setShowSignaturePad(true);
  };

  const handleSignatureSave = (signatureData) => {
    setSignatures(prev => ({
      ...prev,
      [currentSigner]: signatureData
    }));
    setShowSignaturePad(false);
    setCurrentSigner(null);
  };

  const handleSaveContract = async () => {
    setIsSaving(true);
    try {
      await onSave?.({
        ...data,
        signatures,
        status: getContractStatus()
      });
    } catch (error) {
      console.error('Error saving contract:', error);
    }
    setIsSaving(false);
  };

  const handleUploadToDrive = async () => {
    setIsUploading(true);
    try {
      await onUploadToDrive?.({
        ...data,
        signatures,
        status: getContractStatus()
      });
    } catch (error) {
      console.error('Error uploading to Drive:', error);
    }
    setIsUploading(false);
  };

  const getContractStatus = () => {
    if (signatures.landlord && signatures.tenant && signatures.broker) {
      return 'fully_signed';
    }
    if (signatures.landlord || signatures.tenant || signatures.broker) {
      return 'partially_signed';
    }
    return 'draft';
  };

  const canSign = (role) => {
    if (mode === 'view') return false;
    return !signatures[role];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `AED ${Number(amount).toLocaleString()}`;
  };

  if (showSignaturePad) {
    return (
      <SignaturePad
        signerName={
          currentSigner === 'landlord' ? data.landlordName :
          currentSigner === 'tenant' ? data.tenantName :
          data.brokerName
        }
        signerRole={currentSigner.charAt(0).toUpperCase() + currentSigner.slice(1)}
        onSave={handleSignatureSave}
        onCancel={() => {
          setShowSignaturePad(false);
          setCurrentSigner(null);
        }}
      />
    );
  }

  return (
    <div className="tenancy-contract" ref={contractRef}>
      <div className="contract-header">
        <div className="contract-logo">
          <img src="/company-logo.jpg" alt="White Caves" />
          <div className="company-info">
            <h2>White Caves Real Estate LLC</h2>
            <p>Licensed Real Estate Brokerage</p>
          </div>
        </div>
        <div className="contract-meta">
          <span className="contract-number">Contract #{data.contractNumber}</span>
          <span className={`contract-status status-${getContractStatus()}`}>
            {getContractStatus().replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <h1 className="contract-title">TENANCY CONTRACT</h1>
      <p className="contract-subtitle">Residential Property Lease Agreement</p>

      <section className="contract-section">
        <h3>Property Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Property Address</label>
            <span>{data.propertyAddress || '-'}</span>
          </div>
          <div className="detail-item">
            <label>Property Type</label>
            <span>{data.propertyType}</span>
          </div>
        </div>
      </section>

      <section className="contract-section">
        <h3>Landlord Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <span>{data.landlordName || '-'}</span>
          </div>
          <div className="detail-item">
            <label>Emirates ID</label>
            <span>{data.landlordEmirates || '-'}</span>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <span>{data.landlordEmail || '-'}</span>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <span>{data.landlordPhone || '-'}</span>
          </div>
        </div>
      </section>

      <section className="contract-section">
        <h3>Tenant Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <span>{data.tenantName || '-'}</span>
          </div>
          <div className="detail-item">
            <label>Emirates ID</label>
            <span>{data.tenantEmirates || '-'}</span>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <span>{data.tenantEmail || '-'}</span>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <span>{data.tenantPhone || '-'}</span>
          </div>
        </div>
      </section>

      <section className="contract-section">
        <h3>Lease Terms</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Lease Start Date</label>
            <span>{formatDate(data.startDate)}</span>
          </div>
          <div className="detail-item">
            <label>Lease End Date</label>
            <span>{formatDate(data.endDate)}</span>
          </div>
          <div className="detail-item">
            <label>Annual Rent</label>
            <span>{formatCurrency(data.rentAmount)}</span>
          </div>
          <div className="detail-item">
            <label>Security Deposit</label>
            <span>{formatCurrency(data.securityDeposit)}</span>
          </div>
          <div className="detail-item">
            <label>Payment Frequency</label>
            <span>{data.paymentFrequency}</span>
          </div>
          <div className="detail-item">
            <label>Number of Cheques</label>
            <span>{data.numberOfCheques}</span>
          </div>
        </div>
      </section>

      <section className="contract-section terms-section">
        <h3>Terms and Conditions</h3>
        <ol className="terms-list">
          <li>The Tenant agrees to pay the rent on time as per the agreed payment schedule.</li>
          <li>The Tenant shall maintain the property in good condition throughout the lease period.</li>
          <li>The Landlord shall ensure the property is habitable and all utilities are functional.</li>
          <li>Either party must provide 90 days written notice before terminating the lease.</li>
          <li>The security deposit shall be refunded within 30 days of lease termination, subject to property inspection.</li>
          <li>Subletting is not permitted without written consent from the Landlord.</li>
          <li>Any disputes shall be resolved under UAE law and Dubai courts jurisdiction.</li>
        </ol>
      </section>

      <section className="contract-section broker-section">
        <h3>Brokerage Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Broker Name</label>
            <span>{data.brokerName || '-'}</span>
          </div>
          <div className="detail-item">
            <label>License Number</label>
            <span>{data.brokerLicense || '-'}</span>
          </div>
        </div>
      </section>

      <section className="contract-section signatures-section">
        <h3>Signatures</h3>
        <div className="signatures-grid">
          <div className="signature-box">
            <h4>Landlord</h4>
            {signatures.landlord ? (
              <div className="signature-display">
                <img src={signatures.landlord.signature} alt="Landlord Signature" />
                <p className="signer-name">{signatures.landlord.signerName}</p>
                <p className="sign-date">{formatDate(signatures.landlord.timestamp)}</p>
              </div>
            ) : (
              <div className="signature-placeholder">
                {canSign('landlord') ? (
                  <button className="btn btn-sign" onClick={() => handleSign('landlord')}>
                    Sign as Landlord
                  </button>
                ) : (
                  <span>Pending Signature</span>
                )}
              </div>
            )}
          </div>

          <div className="signature-box">
            <h4>Tenant</h4>
            {signatures.tenant ? (
              <div className="signature-display">
                <img src={signatures.tenant.signature} alt="Tenant Signature" />
                <p className="signer-name">{signatures.tenant.signerName}</p>
                <p className="sign-date">{formatDate(signatures.tenant.timestamp)}</p>
              </div>
            ) : (
              <div className="signature-placeholder">
                {canSign('tenant') ? (
                  <button className="btn btn-sign" onClick={() => handleSign('tenant')}>
                    Sign as Tenant
                  </button>
                ) : (
                  <span>Pending Signature</span>
                )}
              </div>
            )}
          </div>

          <div className="signature-box broker">
            <h4>Broker/Agent</h4>
            {signatures.broker ? (
              <div className="signature-display">
                <img src={signatures.broker.signature} alt="Broker Signature" />
                <p className="signer-name">{signatures.broker.signerName}</p>
                <p className="sign-date">{formatDate(signatures.broker.timestamp)}</p>
              </div>
            ) : (
              <div className="signature-placeholder">
                {canSign('broker') ? (
                  <button className="btn btn-sign" onClick={() => handleSign('broker')}>
                    Sign as Broker
                  </button>
                ) : (
                  <span>Pending Signature</span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {mode !== 'view' && (
        <div className="contract-actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleSaveContract}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Contract'}
          </button>
          
          {getContractStatus() === 'fully_signed' && (
            <button 
              className="btn btn-primary"
              onClick={handleUploadToDrive}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : '📁 Save to Google Drive'}
            </button>
          )}
        </div>
      )}

      <div className="contract-footer">
        <p>This contract is prepared by White Caves Real Estate LLC</p>
        <p>admin@whitecaves.com | Dubai, UAE</p>
      </div>
    </div>
  );
}
