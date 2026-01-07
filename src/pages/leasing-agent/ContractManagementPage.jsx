import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../RolePages.css';
import './ContractManagementPage.css';

export default function ContractManagementPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const sigRef = useRef(null);

  const initialFormData = {
    ownerName: '',
    lessorName: '',
    lessorEmiratesId: '',
    lessorLicenseNo: '',
    lessorLicensingAuthority: '',
    lessorEmail: '',
    lessorPhone: '',
    tenantName: '',
    tenantEmiratesId: '',
    tenantLicenseNo: '',
    tenantLicensingAuthority: '',
    tenantEmail: '',
    tenantPhone: '',
    propertyUsage: 'Residential',
    plotNo: '',
    makaniNo: '',
    buildingName: '',
    propertyNo: '',
    propertyType: 'Apartment',
    propertyArea: '',
    location: '',
    premisesNo: '',
    contractPeriodFrom: '',
    contractPeriodTo: '',
    contractValue: '',
    annualRent: '',
    securityDeposit: '',
    modeOfPayment: 'Cheque',
    numberOfCheques: '1',
    brokerName: '',
    brokerEmail: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/contracts');
      const data = await response.json();
      if (data.success) {
        setContracts(data.contracts);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateContract = async () => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setContracts(prev => [data.contract, ...prev]);
        setShowCreateForm(false);
        setFormData(initialFormData);
        alert(`Contract ${data.contract.contractNumber} created successfully!`);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    }
  };

  const generateSignatureLink = async (contractId, role) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/generate-signature-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      
      const data = await response.json();
      if (data.success) {
        await navigator.clipboard.writeText(data.signatureLink);
        setCopiedLink({ role, link: data.signatureLink });
        setTimeout(() => setCopiedLink(null), 5000);
        fetchContracts();
      }
    } catch (error) {
      console.error('Error generating link:', error);
      alert('Failed to generate signature link.');
    }
  };

  const handleBrokerSign = async () => {
    if (sigRef.current?.isEmpty()) {
      alert('Please provide your signature.');
      return;
    }

    try {
      const signature = sigRef.current.toDataURL('image/png');
      const response = await fetch(`/api/contracts/${selectedContract.id}/broker-sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, signerName: selectedContract.brokerName })
      });
      
      const data = await response.json();
      if (data.success) {
        setShowSignatureModal(false);
        fetchContracts();
        alert('Broker signature added successfully!');
      }
    } catch (error) {
      console.error('Error signing:', error);
      alert('Failed to add signature.');
    }
  };

  const uploadToDrive = async (contract) => {
    try {
      const response = await fetch('/api/contracts/upload-to-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract)
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Contract uploaded to Google Drive!\nFile: ${data.fileName}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload to Google Drive. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { label: 'Draft', class: 'badge-draft' },
      partially_signed: { label: 'Pending Signatures', class: 'badge-pending' },
      fully_signed: { label: 'Fully Signed', class: 'badge-signed' }
    };
    return badges[status] || badges.draft;
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `AED ${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (selectedContract && !showSignatureModal) {
    return (
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="page-header">
            <button className="btn btn-back" onClick={() => setSelectedContract(null)}>
              ← Back to Contracts
            </button>
          </div>
          
          <div className="contract-detail">
            <div className="detail-header">
              <div>
                <h2>Contract {selectedContract.contractNumber}</h2>
                <span className={`badge ${getStatusBadge(selectedContract.status).class}`}>
                  {getStatusBadge(selectedContract.status).label}
                </span>
              </div>
              <div className="detail-actions">
                {!selectedContract.signatures?.broker && (
                  <button className="btn btn-primary" onClick={() => setShowSignatureModal(true)}>
                    Sign as Broker
                  </button>
                )}
                {selectedContract.status === 'fully_signed' && (
                  <button className="btn btn-secondary" onClick={() => uploadToDrive(selectedContract)}>
                    Save to Google Drive
                  </button>
                )}
              </div>
            </div>

            <div className="ejari-form-preview">
              <h3>Ejari Unified Tenancy Contract</h3>
              <p className="arabic-title">عقد الإيجار الموحد</p>

              <div className="preview-section">
                <h4>Owner / Lessor Information | معلومات المالك / المؤجر</h4>
                <div className="preview-grid">
                  <div className="preview-field">
                    <label>Owner's Name</label>
                    <span>{selectedContract.ownerName || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Lessor's Name</label>
                    <span>{selectedContract.lessorName || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Emirates ID</label>
                    <span>{selectedContract.lessorEmiratesId || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Email</label>
                    <span>{selectedContract.lessorEmail || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Phone</label>
                    <span>{selectedContract.lessorPhone || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h4>Tenant Information | معلومات المستأجر</h4>
                <div className="preview-grid">
                  <div className="preview-field">
                    <label>Tenant's Name</label>
                    <span>{selectedContract.tenantName || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Emirates ID</label>
                    <span>{selectedContract.tenantEmiratesId || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Email</label>
                    <span>{selectedContract.tenantEmail || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Phone</label>
                    <span>{selectedContract.tenantPhone || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h4>Property Information | معلومات العقار</h4>
                <div className="preview-grid">
                  <div className="preview-field">
                    <label>Property Usage</label>
                    <span>{selectedContract.propertyUsage || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Building Name</label>
                    <span>{selectedContract.buildingName || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Property Type</label>
                    <span>{selectedContract.propertyType || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Location</label>
                    <span>{selectedContract.location || '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>Property Area</label>
                    <span>{selectedContract.propertyArea ? `${selectedContract.propertyArea} sq.m` : '-'}</span>
                  </div>
                  <div className="preview-field">
                    <label>DEWA Premises No.</label>
                    <span>{selectedContract.premisesNo || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h4>Contract Information | معلومات العقد</h4>
                <div className="preview-grid">
                  <div className="preview-field">
                    <label>Contract Period</label>
                    <span>{formatDate(selectedContract.contractPeriodFrom)} - {formatDate(selectedContract.contractPeriodTo)}</span>
                  </div>
                  <div className="preview-field">
                    <label>Annual Rent</label>
                    <span>{formatCurrency(selectedContract.annualRent)}</span>
                  </div>
                  <div className="preview-field">
                    <label>Security Deposit</label>
                    <span>{formatCurrency(selectedContract.securityDeposit)}</span>
                  </div>
                  <div className="preview-field">
                    <label>Payment Mode</label>
                    <span>{selectedContract.modeOfPayment || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="signature-links-section">
                <h4>Signature Links</h4>
                <p className="section-desc">Generate and share these links with the landlord and tenant for digital signing.</p>
                
                <div className="signature-link-cards">
                  <div className="sig-link-card">
                    <div className="sig-link-header">
                      <span className="sig-role">Landlord/Lessor</span>
                      {selectedContract.signatures?.lessor ? (
                        <span className="sig-status signed">Signed</span>
                      ) : (
                        <span className="sig-status pending">Pending</span>
                      )}
                    </div>
                    {selectedContract.signatures?.lessor ? (
                      <div className="sig-info">
                        <img src={selectedContract.signatures.lessor.signature} alt="Signature" className="sig-preview" />
                        <span className="sig-name">{selectedContract.signatures.lessor.signerName}</span>
                        <span className="sig-date">{formatDate(selectedContract.signatures.lessor.signedAt)}</span>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-outline" 
                        onClick={() => generateSignatureLink(selectedContract.id, 'lessor')}
                      >
                        Generate & Copy Link
                      </button>
                    )}
                    {copiedLink?.role === 'lessor' && (
                      <div className="copied-notice">Link copied! Share with landlord.</div>
                    )}
                  </div>

                  <div className="sig-link-card">
                    <div className="sig-link-header">
                      <span className="sig-role">Tenant</span>
                      {selectedContract.signatures?.tenant ? (
                        <span className="sig-status signed">Signed</span>
                      ) : (
                        <span className="sig-status pending">Pending</span>
                      )}
                    </div>
                    {selectedContract.signatures?.tenant ? (
                      <div className="sig-info">
                        <img src={selectedContract.signatures.tenant.signature} alt="Signature" className="sig-preview" />
                        <span className="sig-name">{selectedContract.signatures.tenant.signerName}</span>
                        <span className="sig-date">{formatDate(selectedContract.signatures.tenant.signedAt)}</span>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-outline" 
                        onClick={() => generateSignatureLink(selectedContract.id, 'tenant')}
                      >
                        Generate & Copy Link
                      </button>
                    )}
                    {copiedLink?.role === 'tenant' && (
                      <div className="copied-notice">Link copied! Share with tenant.</div>
                    )}
                  </div>

                  <div className="sig-link-card">
                    <div className="sig-link-header">
                      <span className="sig-role">Broker/Agent</span>
                      {selectedContract.signatures?.broker ? (
                        <span className="sig-status signed">Signed</span>
                      ) : (
                        <span className="sig-status pending">Pending</span>
                      )}
                    </div>
                    {selectedContract.signatures?.broker ? (
                      <div className="sig-info">
                        <img src={selectedContract.signatures.broker.signature} alt="Signature" className="sig-preview" />
                        <span className="sig-name">{selectedContract.signatures.broker.signerName}</span>
                        <span className="sig-date">{formatDate(selectedContract.signatures.broker.signedAt)}</span>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => setShowSignatureModal(true)}
                      >
                        Sign Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <div>
            <h1>Contract Management</h1>
            <p>Create and manage Ejari tenancy contracts</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            + New Contract
          </button>
        </div>

        <div className="contract-stats">
          <div className="stat-card">
            <span className="stat-value">{contracts.filter(c => c.status === 'fully_signed').length}</span>
            <span className="stat-label">Fully Signed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{contracts.filter(c => c.status === 'partially_signed').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{contracts.filter(c => c.status === 'draft').length}</span>
            <span className="stat-label">Drafts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{contracts.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        {showCreateForm && (
          <div className="create-contract-modal">
            <div className="modal-content ejari-modal">
              <div className="modal-header">
                <div>
                  <h2>Create Ejari Tenancy Contract</h2>
                  <p className="arabic-subtitle">عقد الإيجار الموحد</p>
                </div>
                <button className="close-btn" onClick={() => setShowCreateForm(false)}>×</button>
              </div>
              
              <div className="ejari-form">
                <div className="form-section">
                  <h3>Owner / Lessor Information | معلومات المالك / المؤجر</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Owner's Name | اسم المالك</label>
                      <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Lessor's Name | اسم المؤجر</label>
                      <input type="text" name="lessorName" value={formData.lessorName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Lessor's Emirates ID | الهوية الإماراتية</label>
                      <input type="text" name="lessorEmiratesId" placeholder="784-XXXX-XXXXXXX-X" value={formData.lessorEmiratesId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>License No. (If Company) | رقم الرخصة</label>
                      <input type="text" name="lessorLicenseNo" value={formData.lessorLicenseNo} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Lessor's Email | البريد الإلكتروني</label>
                      <input type="email" name="lessorEmail" value={formData.lessorEmail} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Lessor's Phone | رقم الهاتف</label>
                      <input type="tel" name="lessorPhone" placeholder="+971 XX XXX XXXX" value={formData.lessorPhone} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Tenant Information | معلومات المستأجر</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Tenant's Name | اسم المستأجر</label>
                      <input type="text" name="tenantName" value={formData.tenantName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Tenant's Emirates ID | الهوية الإماراتية</label>
                      <input type="text" name="tenantEmiratesId" placeholder="784-XXXX-XXXXXXX-X" value={formData.tenantEmiratesId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>License No. (If Company) | رقم الرخصة</label>
                      <input type="text" name="tenantLicenseNo" value={formData.tenantLicenseNo} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Licensing Authority | سلطة الترخيص</label>
                      <input type="text" name="tenantLicensingAuthority" value={formData.tenantLicensingAuthority} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Tenant's Email | البريد الإلكتروني</label>
                      <input type="email" name="tenantEmail" value={formData.tenantEmail} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Tenant's Phone | رقم الهاتف</label>
                      <input type="tel" name="tenantPhone" placeholder="+971 XX XXX XXXX" value={formData.tenantPhone} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Property Information | معلومات العقار</h3>
                  <div className="property-usage-select">
                    <label>Property Usage | استخدام العقار</label>
                    <div className="radio-group">
                      {['Residential', 'Commercial', 'Industrial'].map(usage => (
                        <label key={usage} className="radio-label">
                          <input 
                            type="radio" 
                            name="propertyUsage" 
                            value={usage}
                            checked={formData.propertyUsage === usage}
                            onChange={handleInputChange}
                          />
                          <span>{usage}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Plot No. | رقم الأرض</label>
                      <input type="text" name="plotNo" value={formData.plotNo} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Makani No. | رقم مكاني</label>
                      <input type="text" name="makaniNo" value={formData.makaniNo} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Building Name | اسم المبنى</label>
                      <input type="text" name="buildingName" value={formData.buildingName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Property No. | رقم العقار</label>
                      <input type="text" name="propertyNo" value={formData.propertyNo} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Property Type | نوع الوحدة</label>
                      <select name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Studio">Studio</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Office">Office</option>
                        <option value="Retail">Retail</option>
                        <option value="Warehouse">Warehouse</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Property Area (sq.m) | المساحة</label>
                      <input type="number" name="propertyArea" value={formData.propertyArea} onChange={handleInputChange} />
                    </div>
                    <div className="form-group full-width">
                      <label>Location | الموقع</label>
                      <input type="text" name="location" placeholder="Area, District, Dubai" value={formData.location} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Premises No. (DEWA) | رقم المبنى (ديوا)</label>
                      <input type="text" name="premisesNo" value={formData.premisesNo} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Contract Information | معلومات العقد</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contract Period From | من</label>
                      <input type="date" name="contractPeriodFrom" value={formData.contractPeriodFrom} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Contract Period To | إلى</label>
                      <input type="date" name="contractPeriodTo" value={formData.contractPeriodTo} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Contract Value (AED) | قيمة العقد</label>
                      <input type="number" name="contractValue" value={formData.contractValue} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Annual Rent (AED) | الإيجار السنوي</label>
                      <input type="number" name="annualRent" value={formData.annualRent} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Security Deposit (AED) | مبلغ التأمين</label>
                      <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Mode of Payment | طريقة الدفع</label>
                      <select name="modeOfPayment" value={formData.modeOfPayment} onChange={handleInputChange}>
                        <option value="Cheque">Cheque</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Number of Cheques</label>
                      <select name="numberOfCheques" value={formData.numberOfCheques} onChange={handleInputChange}>
                        <option value="1">1 Cheque (Annual)</option>
                        <option value="2">2 Cheques (Bi-Annual)</option>
                        <option value="4">4 Cheques (Quarterly)</option>
                        <option value="6">6 Cheques</option>
                        <option value="12">12 Cheques (Monthly)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Broker Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Broker Name</label>
                      <input type="text" name="brokerName" value={formData.brokerName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Broker Email</label>
                      <input type="email" name="brokerEmail" value={formData.brokerEmail} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateContract}>Create Contract</button>
              </div>
            </div>
          </div>
        )}

        {showSignatureModal && (
          <div className="create-contract-modal">
            <div className="modal-content signature-modal">
              <div className="modal-header">
                <h2>Broker Signature</h2>
                <button className="close-btn" onClick={() => setShowSignatureModal(false)}>×</button>
              </div>
              
              <div className="signature-modal-content">
                <p>Sign as the broker/agent for contract {selectedContract?.contractNumber}</p>
                
                <div className="signature-pad-container">
                  <SignatureCanvas
                    ref={sigRef}
                    canvasProps={{
                      className: 'broker-signature-canvas',
                      width: 450,
                      height: 180
                    }}
                    backgroundColor="white"
                  />
                  <button className="clear-sig-btn" onClick={() => sigRef.current?.clear()}>
                    Clear
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowSignatureModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleBrokerSign}>Submit Signature</button>
              </div>
            </div>
          </div>
        )}

        <div className="contracts-list">
          <h3>All Contracts</h3>
          {loading ? (
            <div className="loading">Loading contracts...</div>
          ) : contracts.length === 0 ? (
            <div className="empty-state">
              <p>No contracts yet. Create your first tenancy contract.</p>
            </div>
          ) : (
            <div className="contracts-table">
              <div className="table-header">
                <span>Contract #</span>
                <span>Property</span>
                <span>Lessor</span>
                <span>Tenant</span>
                <span>Annual Rent</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {contracts.map(contract => {
                const badge = getStatusBadge(contract.status);
                return (
                  <div key={contract.id} className="table-row">
                    <span className="contract-num">{contract.contractNumber}</span>
                    <span className="property">{contract.buildingName || contract.location || '-'}</span>
                    <span>{contract.lessorName || contract.ownerName || '-'}</span>
                    <span>{contract.tenantName || '-'}</span>
                    <span className="rent">{formatCurrency(contract.annualRent)}</span>
                    <span><span className={`badge ${badge.class}`}>{badge.label}</span></span>
                    <span className="actions">
                      <button className="btn btn-sm" onClick={() => setSelectedContract(contract)}>
                        View / Sign
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
