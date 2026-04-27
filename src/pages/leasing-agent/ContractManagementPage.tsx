import React, { FC, useState, useEffect, useRef } from 'react';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';

const log = createLogger('ContractManagement');
import SignatureCanvas from 'react-signature-canvas';
import { useToast } from '../../components/Toast';
import '../RolePages.css';

interface ContractData {
  id?: string;
  contractNumber: string;
  lessorName?: string;
  tenantName?: string;
  propertyType?: string;
  annualRent?: number | string;
  [key: string]: unknown;
}

interface FormDataType {
  ownerName: string;
  lessorName: string;
  tenantName: string;
  propertyType: string;
  [key: string]: string;
}

const ContractManagementPage: FC = () => {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const sigRef = useRef<SignatureCanvas | null>(null);
  const isMountedRef = useRef(true);
  const toast = useToast();

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
    isMountedRef.current = true;
    const controller = new AbortController();
    fetchContracts(controller.signal);
    return () => {
      controller.abort();
      isMountedRef.current = false;
    };
  }, []);

  const fetchContracts = async (signal?: AbortSignal): Promise<void> => {
    try {
      const response = await authFetch('/api/contracts', { signal });
      if (!isMountedRef.current) return;
      if (!response.ok) {
        const errData = await response.json().catch(e => {
          log.debug('Non-JSON error response:', e);
          return { error: 'Failed to fetch contracts' };
        });
        log.error('Failed to fetch contracts:', errData.error || response.statusText);
        if (isMountedRef.current) toast.error(errData.error || 'Failed to fetch contracts');
        return;
      }
      const data = await response.json();
      if (data.success && isMountedRef.current) {
        setContracts(data.contracts);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      log.error('Error fetching contracts:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateContract = async (): Promise<void> => {
    if (submitting) return;
    if (!formData.lessorName?.trim()) {
      toast.warning('Lessor name is required');
      return;
    }
    if (!formData.tenantName?.trim()) {
      toast.warning('Tenant name is required');
      return;
    }
    if (!formData.annualRent || parseFloat(formData.annualRent) <= 0) {
      toast.warning('Annual rent must be greater than 0');
      return;
    }
    setSubmitting(true);
    try {
      // Trim all string fields before sending to API
      const trimmedData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [key, typeof val === 'string' ? val.trim() : val])
      );
      const response = await authFetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedData)
      });
      
      if (!isMountedRef.current) return;
      
      if (!response.ok) {
        const errData = await response.json().catch(e => {
          log.debug('Non-JSON error response:', e);
          return { error: 'Failed to create contract' };
        });
        if (isMountedRef.current) toast.error(errData.error || `Failed to create contract (${response.status})`);
        return;
      }
      const data = await response.json();
      if (data.success && isMountedRef.current) {
        setContracts(prev => [data.contract, ...prev]);
        setShowCreateForm(false);
        setFormData(initialFormData);
        toast.success('Contract created successfully!');
      }
    } catch (error) {
      log.error('Error creating contract:', error);
      if (isMountedRef.current) toast.error('Failed to create contract. Please try again.');
    } finally {
      if (isMountedRef.current) setSubmitting(false);
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
              <button className="btn-primary" onClick={handleCreateContract} disabled={submitting}>{submitting ? 'Creating...' : 'Create Contract'}</button>
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
              <div key={contract.id ?? `${contract.lessorName}-${contract.tenantName}`} className="contract-item">
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
