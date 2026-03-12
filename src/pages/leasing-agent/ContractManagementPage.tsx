import React, { FC, useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../RolePages.css';

interface ContractData {
  contractNumber: string;
  [key: string]: any;
}

interface FormDataType {
  ownerName: string;
  lessorName: string;
  tenantName: string;
  propertyType: string;
  [key: string]: string;
}

interface ContractManagementPageProps {}

const ContractManagementPage: FC<ContractManagementPageProps> = () => {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const sigRef = useRef<any>(null);

  const initialFormData: FormDataType = {
    ownerName: '',
    lessorName: '',
    lessorEmiratesId: '',
    tenantName: '',
    tenantEmiratesId: '',
    propertyType: 'Apartment',
    contractValue: '',
    annualRent: '',
  };

  const [formData, setFormData] = useState<FormDataType>(initialFormData);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async (): Promise<void> => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateContract = async (): Promise<void> => {
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
        alert(`Contract created successfully!`);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading contracts...</div>;
  }

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Contract Management</h1>
          <p>Create and manage tenancy contracts</p>
        </div>

        <div className="contracts-actions">
          <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create New Contract'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-contract-form">
            <h3>Create New Tenancy Contract</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Lessor Name</label>
                <input
                  type="text"
                  name="lessorName"
                  value={formData.lessorName}
                  onChange={handleInputChange}
                  placeholder="Enter lessor name"
                />
              </div>
              <div className="form-group">
                <label>Tenant Name</label>
                <input
                  type="text"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleInputChange}
                  placeholder="Enter tenant name"
                />
              </div>
              <div className="form-group">
                <label>Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Annual Rent (AED)</label>
                <input
                  type="number"
                  name="annualRent"
                  value={formData.annualRent}
                  onChange={handleInputChange}
                  placeholder="Enter annual rent"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleCreateContract}>Create Contract</button>
              <button className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="contracts-list">
          <h3>Your Contracts</h3>
          {contracts.length === 0 ? (
            <p>No contracts created yet. Create one to get started.</p>
          ) : (
            contracts.map((contract, index) => (
              <div key={index} className="contract-item">
                <h4>{contract.lessorName} - {contract.tenantName}</h4>
                <p>{contract.propertyType} • AED {contract.annualRent}/year</p>
                <div className="contract-actions">
                  <button className="btn-small">View</button>
                  <button className="btn-small">Generate Signature Link</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractManagementPage;
