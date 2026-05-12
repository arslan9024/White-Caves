import React, { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';
import './ContractBuilder.css';

const DEFAULT_TEMPLATES = [
  {
    _id: 'tpl-residential-standard',
    name: 'Residential Lease — Standard',
    description: 'Standard residential tenancy agreement for apartments and villas.',
    category: 'Residential',
  },
  {
    _id: 'tpl-commercial-standard',
    name: 'Commercial Lease — Standard',
    description: 'Standard commercial lease agreement for office and retail spaces.',
    category: 'Commercial',
  },
];

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
        const apiTemplates = data.data || data.contracts || [];
        if (Array.isArray(apiTemplates) && apiTemplates.length > 0) {
          setTemplates(
            apiTemplates.map(item => ({
              _id: item.id || item._id,
              name: item.name || item.contractNumber || 'Contract Template',
              description:
                item.description ||
                `Lessor: ${item.lessorName || '—'} · Tenant: ${item.tenantName || '—'}`,
              category: item.propertyType || item.category || 'General',
            }))
          );
        } else {
          setTemplates(DEFAULT_TEMPLATES);
        }
      }
    } catch (err) {
      setTemplates(DEFAULT_TEMPLATES);
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

  // Local validation + preview (backend template validation endpoint is deprecated)
  const handlePreview = async () => {
    setLoading(true);
    setError('');

    try {
      if (!formData.landlordName?.trim()) {
        setError('Landlord name is required.');
        return;
      }
      if (!formData.tenantName?.trim()) {
        setError('Tenant name is required.');
        return;
      }
      if (!formData.rentAmount || Number(formData.rentAmount) <= 0) {
        setError('Monthly rent must be greater than 0.');
        return;
      }
      if (!formData.startDate) {
        setError('Start date is required.');
        return;
      }

      const html = `
        <h4>${selectedTemplate?.name || 'Tenancy Contract'}</h4>
        <p><strong>Property:</strong> ${formData.propertyAddress || '—'}</p>
        <p><strong>Property Type:</strong> ${formData.propertyType || '—'}</p>
        <p><strong>Landlord:</strong> ${formData.landlordName || '—'} (${formData.landlordEmail || 'no email'})</p>
        <p><strong>Tenant:</strong> ${formData.tenantName || '—'} (${formData.tenantEmail || 'no email'})</p>
        <p><strong>Monthly Rent:</strong> AED ${Number(formData.rentAmount || 0).toLocaleString()}</p>
        <p><strong>Lease Start:</strong> ${formData.startDate || '—'}</p>
        <p><strong>Security Deposit:</strong> AED ${Number(formData.securityDeposit || 0).toLocaleString()}</p>
      `;

      setPreview(html);
      setStep('review');
    } finally {
      setLoading(false);
    }
  };

  // Create contract
  const handleCreateContract = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authFetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessorName: formData.landlordName?.trim(),
          tenantName: formData.tenantName?.trim(),
          propertyType: formData.propertyType || selectedTemplate?.category || 'Apartment',
          annualRent: Math.round(Number(formData.rentAmount || 0) * 12),
          metadata: {
            templateId: selectedTemplate?._id,
            templateName: selectedTemplate?.name,
            monthlyRent: Number(formData.rentAmount || 0),
            durationMonths: Number(formData.durationMonths || 12),
            startDate: formData.startDate,
            securityDeposit: Number(formData.securityDeposit || 0),
            propertyAddress: formData.propertyAddress,
            partyData: partyData || {},
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (onContractCreated) {
          onContractCreated(data.contract || data.data || data);
        }
        // Reset form
        setSelectedTemplate(null);
        setFormData({});
        setPreview('');
        setStep('select');
        await fetchTemplates();
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
