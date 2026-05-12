import React, { useState } from 'react';
import { authFetch } from '../utils/authFetch';
import PropertyInfoForm from './TenancyForms/PropertyInfoForm';
import LandlordForm from './TenancyForms/LandlordForm';
import TenantForm from './TenancyForms/TenantForm';
import ContactDetailsForm from './TenancyForms/ContactDetailsForm';
import TenancyTermsForm from './TenancyForms/TenancyTermsForm';
import './TenancyContractForm.css';

const TenancyContractForm = ({ onSuccess, initialContractId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [contractId, setContractId] = useState(initialContractId || null);

  const [formData, setFormData] = useState({
    propertyInfo: {
      description: '',
      address: '',
      city: '',
      emirate: '',
      plotNumber: '',
      buildingNumber: '',
      floorNumber: '',
      unitNumber: '',
      unitArea: '',
      propertyType: 'Apartment',
      furnished: 'Unfurnished',
    },
    landlordInfo: {
      name: '',
      nationalId: '',
      passportNumber: '',
      nationality: '',
      emiratesId: '',
      email: '',
      phone: '',
      mobileNumber: '',
      address: '',
      bankName: '',
      bankAccountNumber: '',
      iban: '',
    },
    tenantInfo: {
      name: '',
      nationalId: '',
      passportNumber: '',
      nationality: '',
      emiratesId: '',
      email: '',
      phone: '',
      mobileNumber: '',
      address: '',
      occupation: '',
      employer: '',
      visaNumber: '',
      visaExpiryDate: '',
    },
    contactDetails: {
      landlordContactPerson: '',
      landlordContactPhone: '',
      landlordContactEmail: '',
      tenantContactPerson: '',
      tenantContactPhone: '',
      tenantContactEmail: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
    tenancyTerms: {
      leaseStartDate: '',
      leaseEndDate: '',
      leasePeriodMonths: '',
      renewalOption: 'Negotiable',
      renewalTermMonths: '',
      rentAmount: '',
      rentCurrency: 'AED',
      securityDeposit: '',
      maintenanceFees: '',
      maintenanceIncludedIn: 'Rent',
      utilities: {
        water: false,
        electricity: false,
        gas: false,
        internet: false,
        chiller: false,
      },
      paymentMethod: 'Bank Transfer',
      paymentDay: 1,
      maintenanceResponsibility: 'Landlord',
      breakTerms: '',
      allowedActivities: 'Residential',
      restrictions: '',
      damageResponsibility: '',
    },
  });

  // Update form data section
  const updateFormSection = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        // eslint-disable-next-line security/detect-object-injection
        ...prev[section],
        ...data,
      },
    }));
  };

  // Handle step navigation
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save draft or create new contract
  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatusMessage(null);

      const payload = {
        propertyId:
          formData.propertyInfo.unitNumber?.trim() ||
          formData.propertyInfo.plotNumber?.trim() ||
          `property_${Date.now()}`,
        landlordName: formData.landlordInfo.name?.trim(),
        tenantName: formData.tenantInfo.name?.trim(),
        startDate: formData.tenancyTerms.leaseStartDate,
        endDate: formData.tenancyTerms.leaseEndDate,
        annualRent: Number(formData.tenancyTerms.rentAmount || 0),
      };

      if (!payload.landlordName || !payload.tenantName) {
        throw new Error('Landlord and tenant names are required');
      }
      if (!payload.startDate || !payload.endDate) {
        throw new Error('Lease start and end dates are required');
      }
      if (!payload.annualRent || payload.annualRent <= 0) {
        throw new Error('Annual rent must be greater than 0');
      }

      let response;
      if (contractId) {
        // Update existing draft
        response = await authFetch(`/api/tenancy-agreements/${contractId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            status: 'draft',
          }),
        });
      } else {
        // Create new draft
        response = await authFetch('/api/tenancy-agreements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            status: 'draft',
          }),
        });
      }

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Error saving draft');
      }

      if (!contractId) {
        setContractId(json.data?.id);
      }

      setError(null);
      // Show success message
      const message = contractId ? 'Draft updated successfully' : 'Draft created successfully';
      setStatusMessage({ type: 'success', text: message });
    } catch (err) {
      const message = err?.message || 'Error saving draft';
      setError(message);
      setStatusMessage({ type: 'error', text: message });
      console.error('Error saving draft:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF
  const handleGeneratePDF = async () => {
    if (!contractId) {
      setError('Please save the draft first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStatusMessage(null);

      const response = await authFetch(`/api/tenancy-agreements/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      const json = await response.json();

      if (response.ok && json.success) {
        setStatusMessage({ type: 'success', text: 'Tenancy agreement activated successfully!' });
        if (onSuccess) {
          onSuccess({
            contractId,
            agreement: json.data,
          });
        }
      } else {
        throw new Error(json.error || 'Error activating tenancy agreement');
      }
    } catch (err) {
      const message = err?.message || 'Error activating tenancy agreement';
      setError(message);
      setStatusMessage({ type: 'error', text: message });
      console.error('Error generating PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Property Information' },
    { number: 2, title: 'Landlord Information' },
    { number: 3, title: 'Tenant Information' },
    { number: 4, title: 'Contact Details' },
    { number: 5, title: 'Tenancy Terms' },
    { number: 6, title: 'Review & Generate' },
  ];

  return (
    <div className="tenancy-form-container">
      <div className="form-header">
        <h1>Tenancy Contract Form</h1>
        {contractId && <div className="contract-id-badge">Contract ID: {contractId}</div>}
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {statusMessage && (
        <div
          className={`status-message ${statusMessage.type === 'error' ? 'error-message' : 'success-message'}`}
          role={statusMessage.type === 'error' ? 'alert' : 'status'}
          data-testid="tenancy-contract-status-banner"
        >
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="form-stepper">
        {steps.map(step => (
          <div
            key={step.number}
            className={`stepper-step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
            onClick={() => setCurrentStep(step.number)}
          >
            <div className="step-number">{step.number}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-content">
        {currentStep === 1 && (
          <PropertyInfoForm
            data={formData.propertyInfo}
            onChange={data => updateFormSection('propertyInfo', data)}
          />
        )}

        {currentStep === 2 && (
          <LandlordForm
            data={formData.landlordInfo}
            onChange={data => updateFormSection('landlordInfo', data)}
          />
        )}

        {currentStep === 3 && (
          <TenantForm
            data={formData.tenantInfo}
            onChange={data => updateFormSection('tenantInfo', data)}
          />
        )}

        {currentStep === 4 && (
          <ContactDetailsForm
            data={formData.contactDetails}
            onChange={data => updateFormSection('contactDetails', data)}
          />
        )}

        {currentStep === 5 && (
          <TenancyTermsForm
            data={formData.tenancyTerms}
            onChange={data => updateFormSection('tenancyTerms', data)}
          />
        )}

        {currentStep === 6 && <ReviewStep formData={formData} />}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={handlePrevious} disabled={currentStep === 1}>
          ← Previous
        </button>

        <button className="btn btn-primary" onClick={handleSaveDraft} disabled={loading}>
          {loading ? 'Saving...' : 'Save Draft'}
        </button>

        {currentStep < 6 ? (
          <button className="btn btn-primary" onClick={handleNext} disabled={loading}>
            Next →
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleGeneratePDF}
            disabled={loading || !contractId}
          >
            {loading ? 'Generating...' : '📄 Generate PDF'}
          </button>
        )}
      </div>
    </div>
  );
};

// Review Step Component
const ReviewStep = ({ formData }) => {
  return (
    <div className="review-step">
      <h2>Review Contract Details</h2>

      <div className="review-section">
        <h3>📍 Property Information</h3>
        <div className="review-grid">
          <div>
            <strong>Description:</strong> {formData.propertyInfo.description}
          </div>
          <div>
            <strong>Address:</strong> {formData.propertyInfo.address}
          </div>
          <div>
            <strong>Area:</strong> {formData.propertyInfo.unitArea} sq.ft.
          </div>
          <div>
            <strong>Type:</strong> {formData.propertyInfo.propertyType}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>🏠 Landlord Information</h3>
        <div className="review-grid">
          <div>
            <strong>Name:</strong> {formData.landlordInfo.name}
          </div>
          <div>
            <strong>Email:</strong> {formData.landlordInfo.email}
          </div>
          <div>
            <strong>Phone:</strong> {formData.landlordInfo.phone}
          </div>
          <div>
            <strong>ID:</strong>{' '}
            {formData.landlordInfo.emiratesId || formData.landlordInfo.passportNumber}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>👤 Tenant Information</h3>
        <div className="review-grid">
          <div>
            <strong>Name:</strong> {formData.tenantInfo.name}
          </div>
          <div>
            <strong>Email:</strong> {formData.tenantInfo.email}
          </div>
          <div>
            <strong>Phone:</strong> {formData.tenantInfo.phone}
          </div>
          <div>
            <strong>ID:</strong>{' '}
            {formData.tenantInfo.emiratesId || formData.tenantInfo.passportNumber}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>📅 Tenancy Terms</h3>
        <div className="review-grid">
          <div>
            <strong>Lease Period:</strong>{' '}
            {new Date(formData.tenancyTerms.leaseStartDate).toLocaleDateString()} to{' '}
            {new Date(formData.tenancyTerms.leaseEndDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Monthly Rent:</strong> AED {formData.tenancyTerms.rentAmount}
          </div>
          <div>
            <strong>Security Deposit:</strong> AED {formData.tenancyTerms.securityDeposit}
          </div>
          <div>
            <strong>Payment Method:</strong> {formData.tenancyTerms.paymentMethod}
          </div>
        </div>
      </div>

      <div className="review-info">
        <p>
          ✓ All information has been filled. Click &quot;Generate PDF&quot; to create the contract
          document.
        </p>
      </div>
    </div>
  );
};

export default TenancyContractForm;
