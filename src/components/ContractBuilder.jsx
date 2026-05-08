import React, { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';
import './ContractBuilder.css';

/**
 * ContractBuilder - Component for creating contracts from templates
 * Allows users to select a template and fill in required variables
 */
export default function ContractBuilder({
  onContractCreated,
  propertyData: _propertyData,
  partyData,
}) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('select'); // select, fill, review

  // Fetch available templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await authFetch('/api/contracts');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    }
  };

  // Handle template selection
  const handleSelectTemplate = template => {
    setSelectedTemplate(template);
    setFormData({});
    setPreview('');
    setError('');
    setStep('fill');
  };

  // Handle form input change
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate and preview
  const handlePreview = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authFetch('/api/contracts/from-template/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate._id,
          data: formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data.data.content);
        setStep('review');
      } else {
        setError(data.error || 'Validation failed');
      }
    } catch (err) {
      setError('Failed to preview contract');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create contract
  const handleCreateContract = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authFetch('/api/contracts/from-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate._id,
          templateData: formData,
          partyData: {
            ...partyData,
            createdBy: {
              userId: 'current-user-id', // TODO: Get from auth
              email: 'user@example.com',
              name: 'Current User',
            },
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (onContractCreated) {
          onContractCreated(data);
        }
        // Reset form
        setSelectedTemplate(null);
        setFormData({});
        setPreview('');
        setStep('select');
      } else {
        setError(data.error || 'Failed to create contract');
      }
    } catch (err) {
      setError('Failed to create contract');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contract-builder">
      <div className="builder-container">
        <h2>Create Contract from Template</h2>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Step 1: Select Template */}
        {step === 'select' && (
          <div className="step select-template">
            <h3>Select a Template</h3>
            <div className="template-grid">
              {templates.length > 0 ? (
                templates.map(template => (
                  <div
                    key={template._id}
                    className="template-card"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className="template-icon">📄</div>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                    <span className="template-category">{template.category}</span>
                  </div>
                ))
              ) : (
                <p>No templates available</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Fill Form */}
        {step === 'fill' && selectedTemplate && (
          <div className="step fill-form">
            <h3>Fill Contract Details: {selectedTemplate.name}</h3>

            <form className="contract-form">
              {/* Property Details Section */}
              <fieldset>
                <legend>Property Details</legend>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress || ''}
                    onChange={handleInputChange}
                    placeholder="Enter property address"
                  />
                </div>
                <div className="form-group">
                  <label>Area (sqft)</label>
                  <input
                    type="number"
                    name="propertyArea"
                    value={formData.propertyArea || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 75000"
                  />
                </div>
                <div className="form-group">
                  <label>Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="villa">Villa</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
              </fieldset>

              {/* Tenant Section */}
              <fieldset>
                <legend>Tenant Information</legend>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="tenantName"
                    value={formData.tenantName || ''}
                    onChange={handleInputChange}
                    placeholder="Tenant full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="tenantEmail"
                    value={formData.tenantEmail || ''}
                    onChange={handleInputChange}
                    placeholder="tenant@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="tenantPhone"
                    value={formData.tenantPhone || ''}
                    onChange={handleInputChange}
                    placeholder="+971 5X XXX XXXX"
                  />
                </div>
                <div className="form-group">
                  <label>Emirates ID</label>
                  <input
                    type="text"
                    name="tenantEmiratesId"
                    value={formData.tenantEmiratesId || ''}
                    onChange={handleInputChange}
                    placeholder="123 4567 8901234"
                  />
                </div>
              </fieldset>

              {/* Landlord Section */}
              <fieldset>
                <legend>Landlord Information</legend>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="landlordName"
                    value={formData.landlordName || ''}
                    onChange={handleInputChange}
                    placeholder="Landlord full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="landlordEmail"
                    value={formData.landlordEmail || ''}
                    onChange={handleInputChange}
                    placeholder="landlord@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="landlordPhone"
                    value={formData.landlordPhone || ''}
                    onChange={handleInputChange}
                    placeholder="+971 5X XXX XXXX"
                  />
                </div>
              </fieldset>

              {/* Lease Terms Section */}
              <fieldset>
                <legend>Lease Terms</legend>
                <div className="form-group">
                  <label>Monthly Rent (AED)</label>
                  <input
                    type="number"
                    name="rentAmount"
                    value={formData.rentAmount || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                  />
                </div>
                <div className="form-group">
                  <label>Duration (months)</label>
                  <input
                    type="number"
                    name="durationMonths"
                    value={formData.durationMonths || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Security Deposit (AED)</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 100000"
                  />
                </div>
              </fieldset>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep('select')}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePreview}
                  disabled={loading}
                >
                  {loading ? 'Validating...' : 'Preview Contract'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Review Contract */}
        {step === 'review' && preview && (
          <div className="step review-contract">
            <h3>Review Contract</h3>

            <div className="contract-preview">
              <div className="preview-content" dangerouslySetInnerHTML={{ __html: preview }} />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep('fill')}>
                Back to Edit
              </button>
              <button
                type="button"
                className="btn-primary btn-create"
                onClick={handleCreateContract}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Contract'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
