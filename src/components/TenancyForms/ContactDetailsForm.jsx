import React, { useState } from 'react';
import '../styles/TenancyForms.css';

const ContactDetailsForm = ({ onNext, onPrevious, initialData = {} }) => {
  const [formData, setFormData] = useState({
    agentName: initialData.agentName || '',
    agentEmail: initialData.agentEmail || '',
    agentPhone: initialData.agentPhone || '',
    companyName: initialData.companyName || '',
    companyAddress: initialData.companyAddress || '',
    companyPhone: initialData.companyPhone || '',
    companyEmail: initialData.companyEmail || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.agentName.trim()) {
      newErrors.agentName = 'Agent name is required';
    }

    if (!formData.agentEmail.trim()) {
      newErrors.agentEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agentEmail)) {
      newErrors.agentEmail = 'Invalid email format';
    }

    if (!formData.agentPhone.trim()) {
      newErrors.agentPhone = 'Phone number is required';
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
      <h3>Contact & Company Details</h3>
      <p className="form-subtitle">Provide agent and company information</p>

      <fieldset className="form-fieldset">
        <legend>Agent Information</legend>

        <div className="form-group">
          <label htmlFor="agentName">Agent Name *</label>
          <input
            type="text"
            id="agentName"
            name="agentName"
            value={formData.agentName}
            onChange={handleChange}
            placeholder="Enter agent name"
            className={errors.agentName ? 'error' : ''}
          />
          {errors.agentName && <span className="error-message">{errors.agentName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="agentEmail">Agent Email *</label>
            <input
              type="email"
              id="agentEmail"
              name="agentEmail"
              value={formData.agentEmail}
              onChange={handleChange}
              placeholder="agent@example.com"
              className={errors.agentEmail ? 'error' : ''}
            />
            {errors.agentEmail && <span className="error-message">{errors.agentEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="agentPhone">Agent Phone *</label>
            <input
              type="tel"
              id="agentPhone"
              name="agentPhone"
              value={formData.agentPhone}
              onChange={handleChange}
              placeholder="+971 50 123 4567"
              className={errors.agentPhone ? 'error' : ''}
            />
            {errors.agentPhone && <span className="error-message">{errors.agentPhone}</span>}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Company Information (Optional)</legend>

        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyAddress">Company Address</label>
          <textarea
            id="companyAddress"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            placeholder="Enter company address"
            rows="2"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyPhone">Company Phone</label>
            <input
              type="tel"
              id="companyPhone"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              placeholder="+971 4 123 4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyEmail">Company Email</label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              placeholder="company@example.com"
            />
          </div>
        </div>
      </fieldset>

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

export default ContactDetailsForm;
