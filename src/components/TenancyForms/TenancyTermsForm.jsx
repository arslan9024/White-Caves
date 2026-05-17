import React, { useState } from 'react';
import '../styles/TenancyForms.css';

const TenancyTermsForm = ({ onNext, onPrevious, initialData = {} }) => {
  const [formData, setFormData] = useState({
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    monthlyRent: initialData.monthlyRent || '',
    securityDeposit: initialData.securityDeposit || '',
    chequeFrequency: initialData.chequeFrequency || 'monthly',
    noOfCheques: initialData.noOfCheques || '12',
    rentIncreasePercentage: initialData.rentIncreasePercentage || '0',
    maintenanceResponsibility: initialData.maintenanceResponsibility || 'landlord',
    utilities: initialData.utilities || '',
    specialTerms: initialData.specialTerms || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.monthlyRent || formData.monthlyRent <= 0) {
      newErrors.monthlyRent = 'Monthly rent must be a positive number';
    }

    if (!formData.securityDeposit || formData.securityDeposit < 0) {
      newErrors.securityDeposit = 'Security deposit must be a positive number';
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

  const calculateEndDate = () => {
    if (formData.startDate && formData.noOfCheques) {
      const start = new Date(formData.startDate);
      const months = parseInt(formData.noOfCheques);
      const end = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
      return end.toISOString().split('T')[0];
    }
    return '';
  };

  const handleNoOfChequesChange = (e) => {
    const value = e.target.value;
    handleChange(e);
    // Auto-calculate end date
    if (formData.startDate) {
      const start = new Date(formData.startDate);
      const months = parseInt(value);
      const end = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
      setFormData((prev) => ({
        ...prev,
        endDate: end.toISOString().split('T')[0],
      }));
    }
  };

  return (
    <div className="form-section">
      <h3>Tenancy Terms</h3>
      <p className="form-subtitle">Define lease terms and conditions</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="noOfCheques">Number of Cheques *</label>
          <select
            id="noOfCheques"
            name="noOfCheques"
            value={formData.noOfCheques}
            onChange={handleNoOfChequesChange}
          >
            <option value="12">12 cheques (1 year)</option>
            <option value="24">24 cheques (2 years)</option>
            <option value="36">36 cheques (3 years)</option>
            <option value="48">48 cheques (4 years)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={errors.endDate ? 'error' : ''}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="monthlyRent">Monthly Rent (AED) *</label>
          <input
            type="number"
            id="monthlyRent"
            name="monthlyRent"
            value={formData.monthlyRent}
            onChange={handleChange}
            placeholder="Enter monthly rent"
            className={errors.monthlyRent ? 'error' : ''}
          />
          {errors.monthlyRent && <span className="error-message">{errors.monthlyRent}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="securityDeposit">Security Deposit (AED) *</label>
          <input
            type="number"
            id="securityDeposit"
            name="securityDeposit"
            value={formData.securityDeposit}
            onChange={handleChange}
            placeholder="Enter security deposit"
            className={errors.securityDeposit ? 'error' : ''}
          />
          {errors.securityDeposit && <span className="error-message">{errors.securityDeposit}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="chequeFrequency">Cheque Frequency *</label>
          <select
            id="chequeFrequency"
            name="chequeFrequency"
            value={formData.chequeFrequency}
            onChange={handleChange}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annual">Semi-Annual</option>
            <option value="annual">Annual</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rentIncreasePercentage">Annual Rent Increase (%)</label>
          <input
            type="number"
            id="rentIncreasePercentage"
            name="rentIncreasePercentage"
            value={formData.rentIncreasePercentage}
            onChange={handleChange}
            placeholder="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maintenanceResponsibility">Maintenance Responsibility *</label>
          <select
            id="maintenanceResponsibility"
            name="maintenanceResponsibility"
            value={formData.maintenanceResponsibility}
            onChange={handleChange}
          >
            <option value="landlord">Landlord</option>
            <option value="tenant">Tenant</option>
            <option value="shared">Shared</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="utilities">Utilities Included</label>
        <input
          type="text"
          id="utilities"
          name="utilities"
          value={formData.utilities}
          onChange={handleChange}
          placeholder="e.g., Water, Electricity, Maintenance"
        />
      </div>

      <div className="form-group">
        <label htmlFor="specialTerms">Special Terms & Conditions</label>
        <textarea
          id="specialTerms"
          name="specialTerms"
          value={formData.specialTerms}
          onChange={handleChange}
          placeholder="Enter any additional terms or conditions"
          rows="4"
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

export default TenancyTermsForm;
