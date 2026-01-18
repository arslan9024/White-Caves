import React, { useState } from 'react';
import '../styles/TenancyForms.css';

const TenantForm = ({ onNext, onPrevious, initialData = {} }) => {
  const [formData, setFormData] = useState({
    tenantName: initialData.tenantName || '',
    tenantEmail: initialData.tenantEmail || '',
    tenantPhone: initialData.tenantPhone || '',
    tenantNationality: initialData.tenantNationality || '',
    tenantPassportNo: initialData.tenantPassportNo || '',
    tenantEmirates: initialData.tenantEmirates || '',
    tenantAddress: initialData.tenantAddress || '',
    tenantOccupation: initialData.tenantOccupation || '',
    tenantEmployer: initialData.tenantEmployer || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Tenant name is required';
    }

    if (!formData.tenantEmail.trim()) {
      newErrors.tenantEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenantEmail)) {
      newErrors.tenantEmail = 'Invalid email format';
    }

    if (!formData.tenantPhone.trim()) {
      newErrors.tenantPhone = 'Phone number is required';
    }

    if (!formData.tenantNationality.trim()) {
      newErrors.tenantNationality = 'Nationality is required';
    }

    if (!formData.tenantPassportNo.trim()) {
      newErrors.tenantPassportNo = 'Passport/ID number is required';
    }

    if (!formData.tenantEmirates.trim()) {
      newErrors.tenantEmirates = 'Emirates ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="form-section">
      <h3>Tenant Information</h3>
      <p className="form-subtitle">Enter tenant details</p>

      <div className="form-group">
        <label htmlFor="tenantName">Full Name *</label>
        <input
          type="text"
          id="tenantName"
          name="tenantName"
          value={formData.tenantName}
          onChange={handleChange}
          placeholder="Enter tenant's full name"
          className={errors.tenantName ? 'error' : ''}
        />
        {errors.tenantName && <span className="error-message">{errors.tenantName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tenantEmail">Email Address *</label>
          <input
            type="email"
            id="tenantEmail"
            name="tenantEmail"
            value={formData.tenantEmail}
            onChange={handleChange}
            placeholder="tenant@example.com"
            className={errors.tenantEmail ? 'error' : ''}
          />
          {errors.tenantEmail && <span className="error-message">{errors.tenantEmail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tenantPhone">Phone Number *</label>
          <input
            type="tel"
            id="tenantPhone"
            name="tenantPhone"
            value={formData.tenantPhone}
            onChange={handleChange}
            placeholder="+971 50 123 4567"
            className={errors.tenantPhone ? 'error' : ''}
          />
          {errors.tenantPhone && <span className="error-message">{errors.tenantPhone}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tenantNationality">Nationality *</label>
          <input
            type="text"
            id="tenantNationality"
            name="tenantNationality"
            value={formData.tenantNationality}
            onChange={handleChange}
            placeholder="e.g., Indian"
            className={errors.tenantNationality ? 'error' : ''}
          />
          {errors.tenantNationality && <span className="error-message">{errors.tenantNationality}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tenantPassportNo">Passport/ID Number *</label>
          <input
            type="text"
            id="tenantPassportNo"
            name="tenantPassportNo"
            value={formData.tenantPassportNo}
            onChange={handleChange}
            placeholder="Enter passport or ID number"
            className={errors.tenantPassportNo ? 'error' : ''}
          />
          {errors.tenantPassportNo && <span className="error-message">{errors.tenantPassportNo}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tenantEmirates">Emirates ID *</label>
          <input
            type="text"
            id="tenantEmirates"
            name="tenantEmirates"
            value={formData.tenantEmirates}
            onChange={handleChange}
            placeholder="Enter Emirates ID"
            className={errors.tenantEmirates ? 'error' : ''}
          />
          {errors.tenantEmirates && <span className="error-message">{errors.tenantEmirates}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tenantOccupation">Occupation</label>
          <input
            type="text"
            id="tenantOccupation"
            name="tenantOccupation"
            value={formData.tenantOccupation}
            onChange={handleChange}
            placeholder="e.g., Software Engineer"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tenantEmployer">Employer/Company</label>
        <input
          type="text"
          id="tenantEmployer"
          name="tenantEmployer"
          value={formData.tenantEmployer}
          onChange={handleChange}
          placeholder="Enter employer name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tenantAddress">Address</label>
        <textarea
          id="tenantAddress"
          name="tenantAddress"
          value={formData.tenantAddress}
          onChange={handleChange}
          placeholder="Enter full address"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPrevious} className="btn-secondary">
          Previous
        </button>
        <button type="button" onClick={handleNext} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
};

export default TenantForm;
