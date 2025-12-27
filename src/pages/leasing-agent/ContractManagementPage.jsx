import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoleNavigation from '../../components/RoleNavigation';
import TenancyContract from '../../components/TenancyContract';
import '../RolePages.css';
import './ContractManagementPage.css';

export default function ContractManagementPage() {
  const [activeView, setActiveView] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    propertyAddress: '',
    propertyType: 'Apartment',
    landlordName: '',
    landlordEmail: '',
    landlordPhone: '',
    landlordEmirates: '',
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    tenantEmirates: '',
    brokerName: '',
    brokerLicense: '',
    startDate: '',
    endDate: '',
    rentAmount: '',
    securityDeposit: '',
    paymentFrequency: 'Annual',
    numberOfCheques: 1
  });

  const [contracts, setContracts] = useState([
    {
      id: 1,
      contractNumber: 'TC-2024-001',
      propertyAddress: 'Marina View Tower, Apt 1502, Dubai Marina',
      landlordName: 'Ahmed Al-Rashid',
      tenantName: 'John Smith',
      rentAmount: 95000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'fully_signed',
      signatures: {
        landlord: { signature: '', signerName: 'Ahmed Al-Rashid', timestamp: '2024-01-01' },
        tenant: { signature: '', signerName: 'John Smith', timestamp: '2024-01-02' },
        broker: { signature: '', signerName: 'Sara Ahmed', timestamp: '2024-01-01' }
      }
    },
    {
      id: 2,
      contractNumber: 'TC-2024-002',
      propertyAddress: 'Downtown Boulevard, Unit 2301',
      landlordName: 'Mohammed Khan',
      tenantName: 'Emma Wilson',
      rentAmount: 120000,
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      status: 'partially_signed',
      signatures: {
        landlord: { signature: '', signerName: 'Mohammed Khan', timestamp: '2024-01-28' },
        tenant: null,
        broker: { signature: '', signerName: 'Sara Ahmed', timestamp: '2024-01-28' }
      }
    },
    {
      id: 3,
      contractNumber: 'TC-2024-003',
      propertyAddress: 'JBR Walk, Apartment 804',
      landlordName: 'Sarah Johnson',
      tenantName: 'Omar Hassan',
      rentAmount: 85000,
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'draft',
      signatures: {
        landlord: null,
        tenant: null,
        broker: null
      }
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateContract = () => {
    const newContract = {
      id: contracts.length + 1,
      contractNumber: `TC-${Date.now()}`,
      ...formData,
      status: 'draft',
      signatures: {
        landlord: null,
        tenant: null,
        broker: null
      }
    };
    setContracts([newContract, ...contracts]);
    setShowCreateForm(false);
    setFormData({
      propertyAddress: '',
      propertyType: 'Apartment',
      landlordName: '',
      landlordEmail: '',
      landlordPhone: '',
      landlordEmirates: '',
      tenantName: '',
      tenantEmail: '',
      tenantPhone: '',
      tenantEmirates: '',
      brokerName: '',
      brokerLicense: '',
      startDate: '',
      endDate: '',
      rentAmount: '',
      securityDeposit: '',
      paymentFrequency: 'Annual',
      numberOfCheques: 1
    });
  };

  const handleSaveContract = async (contractData) => {
    setContracts(prev => prev.map(c => 
      c.id === selectedContract.id ? { ...c, ...contractData } : c
    ));
    alert('Contract saved successfully!');
  };

  const handleUploadToDrive = async (contractData) => {
    try {
      const response = await fetch('/api/contracts/upload-to-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData)
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Contract uploaded to Google Drive successfully!\nFile: ${result.fileName}`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      alert('Contract saved locally. Google Drive upload will be available when connected.');
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
    return `AED ${Number(amount).toLocaleString()}`;
  };

  if (selectedContract) {
    return (
      <div className="role-page">
        <RoleNavigation role="leasing-agent" />
        <div className="role-page-content">
          <div className="page-header">
            <button className="btn btn-back" onClick={() => setSelectedContract(null)}>
              ← Back to Contracts
            </button>
          </div>
          <TenancyContract
            contractData={selectedContract}
            mode="edit"
            onSave={handleSaveContract}
            onUploadToDrive={handleUploadToDrive}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="role-page">
      <RoleNavigation role="leasing-agent" />
      
      <div className="role-page-content">
        <div className="page-header">
          <div>
            <h1>Contract Management</h1>
            <p>Create and manage tenancy contracts</p>
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
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create New Tenancy Contract</h2>
                <button className="close-btn" onClick={() => setShowCreateForm(false)}>×</button>
              </div>
              
              <div className="form-grid">
                <div className="form-section">
                  <h3>Property Details</h3>
                  <div className="form-row">
                    <input
                      type="text"
                      name="propertyAddress"
                      placeholder="Property Address"
                      value={formData.propertyAddress}
                      onChange={handleInputChange}
                    />
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Studio">Studio</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Landlord Information</h3>
                  <div className="form-row">
                    <input type="text" name="landlordName" placeholder="Landlord Name" value={formData.landlordName} onChange={handleInputChange} />
                    <input type="text" name="landlordEmirates" placeholder="Emirates ID" value={formData.landlordEmirates} onChange={handleInputChange} />
                  </div>
                  <div className="form-row">
                    <input type="email" name="landlordEmail" placeholder="Email" value={formData.landlordEmail} onChange={handleInputChange} />
                    <input type="tel" name="landlordPhone" placeholder="Phone" value={formData.landlordPhone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Tenant Information</h3>
                  <div className="form-row">
                    <input type="text" name="tenantName" placeholder="Tenant Name" value={formData.tenantName} onChange={handleInputChange} />
                    <input type="text" name="tenantEmirates" placeholder="Emirates ID" value={formData.tenantEmirates} onChange={handleInputChange} />
                  </div>
                  <div className="form-row">
                    <input type="email" name="tenantEmail" placeholder="Email" value={formData.tenantEmail} onChange={handleInputChange} />
                    <input type="tel" name="tenantPhone" placeholder="Phone" value={formData.tenantPhone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Broker Information</h3>
                  <div className="form-row">
                    <input type="text" name="brokerName" placeholder="Broker Name" value={formData.brokerName} onChange={handleInputChange} />
                    <input type="text" name="brokerLicense" placeholder="License Number" value={formData.brokerLicense} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Lease Terms</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Annual Rent (AED)</label>
                      <input type="number" name="rentAmount" placeholder="95000" value={formData.rentAmount} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Security Deposit (AED)</label>
                      <input type="number" name="securityDeposit" placeholder="5000" value={formData.securityDeposit} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <select name="paymentFrequency" value={formData.paymentFrequency} onChange={handleInputChange}>
                      <option value="Annual">Annual (1 Cheque)</option>
                      <option value="Bi-Annual">Bi-Annual (2 Cheques)</option>
                      <option value="Quarterly">Quarterly (4 Cheques)</option>
                      <option value="Monthly">Monthly (12 Cheques)</option>
                    </select>
                    <div className="form-group">
                      <label>Number of Cheques</label>
                      <input type="number" name="numberOfCheques" min="1" max="12" value={formData.numberOfCheques} onChange={handleInputChange} />
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

        <div className="contracts-list">
          <h3>All Contracts</h3>
          <div className="contracts-table">
            <div className="table-header">
              <span>Contract #</span>
              <span>Property</span>
              <span>Landlord</span>
              <span>Tenant</span>
              <span>Rent</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {contracts.map(contract => {
              const badge = getStatusBadge(contract.status);
              return (
                <div key={contract.id} className="table-row">
                  <span className="contract-num">{contract.contractNumber}</span>
                  <span className="property">{contract.propertyAddress}</span>
                  <span>{contract.landlordName}</span>
                  <span>{contract.tenantName}</span>
                  <span className="rent">{formatCurrency(contract.rentAmount)}</span>
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
        </div>
      </div>
    </div>
  );
}
