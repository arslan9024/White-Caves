import React, { useState } from 'react';
import '../styles/TenancyForms.css';

const LandlordForm = ({ onNext, onPrevious, initialData = {} }) => {
  const [formData, setFormData] = useState({
    landlordName: initialData.landlordName || '',
    landlordEmail: initialData.landlordEmail || '',
    landlordPhone: initialData.landlordPhone || '',
    landlordNationality: initialData.landlordNationality || '',
    landlordPassportNo: initialData.landlordPassportNo || '',
    landlordEmirates: initialData.landlordEmirates || '',
    landlordAddress: initialData.landlordAddress || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.landlordName.trim()) {
      newErrors.landlordName = 'Landlord name is required';
    }

    if (!formData.landlordEmail.trim()) {
      newErrors.landlordEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.landlordEmail)) {
      newErrors.landlordEmail = 'Invalid email format';
    }

    if (!formData.landlordPhone.trim()) {
      newErrors.landlordPhone = 'Phone number is required';
    }

    if (!formData.landlordNationality.trim()) {
      newErrors.landlordNationality = 'Nationality is required';
    }

    if (!formData.landlordPassportNo.trim()) {
      newErrors.landlordPassportNo = 'Passport/ID number is required';
    }

    if (!formData.landlordEmirates.trim()) {
      newErrors.landlordEmirates = 'Emirates ID is required';
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
      <h3>Landlord Information</h3>
      <p className="form-subtitle">Enter landlord details</p>

      <div className="form-group">
        <label htmlFor="landlordName">Full Name *</label>
        <input
          type="text"
          id="landlordName"
          name="landlordName"
          value={formData.landlordName}
          onChange={handleChange}
          placeholder="Enter landlord's full name"
          className={errors.landlordName ? 'error' : ''}
        />
        {errors.landlordName && <span className="error-message">{errors.landlordName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="landlordEmail">Email Address *</label>
          <input
            type="email"
            id="landlordEmail"
            name="landlordEmail"
            value={formData.landlordEmail}
            onChange={handleChange}
            placeholder="landlord@example.com"
            className={errors.landlordEmail ? 'error' : ''}
          />
          {errors.landlordEmail && <span className="error-message">{errors.landlordEmail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="landlordPhone">Phone Number *</label>
          <input
            type="tel"
            id="landlordPhone"
            name="landlordPhone"
            value={formData.landlordPhone}
            onChange={handleChange}
            placeholder="+971 50 123 4567"
            className={errors.landlordPhone ? 'error' : ''}
          />
          {errors.landlordPhone && <span className="error-message">{errors.landlordPhone}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="landlordNationality">Nationality *</label>
          <input
            type="text"
            id="landlordNationality"
            name="landlordNationality"
            value={formData.landlordNationality}
            onChange={handleChange}
            placeholder="e.g., Indian"
            className={errors.landlordNationality ? 'error' : ''}
          />
          {errors.landlordNationality && <span className="error-message">{errors.landlordNationality}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="landlordPassportNo">Passport/ID Number *</label>
          <input
            type="text"
            id="landlordPassportNo"
            name="landlordPassportNo"
            value={formData.landlordPassportNo}
            onChange={handleChange}
            placeholder="Enter passport or ID number"
            className={errors.landlordPassportNo ? 'error' : ''}
          />
          {errors.landlordPassportNo && <span className="error-message">{errors.landlordPassportNo}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="landlordEmirates">Emirates ID *</label>
        <input
          type="text"
          id="landlordEmirates"
          name="landlordEmirates"
          value={formData.landlordEmirates}
          onChange={handleChange}
          placeholder="Enter Emirates ID"
          className={errors.landlordEmirates ? 'error' : ''}
        />
        {errors.landlordEmirates && <span className="error-message">{errors.landlordEmirates}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="landlordAddress">Address</label>
        <textarea
          id="landlordAddress"
          name="landlordAddress"
          value={formData.landlordAddress}
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

export default LandlordForm;
