// FILE: src/components/crm/AgentListingForm/steps/ListingLegalStep.jsx
import React from 'react';
import { Check } from 'lucide-react';
import { MARKETING_PACKAGES } from '../AgentListingForm.data';

export default function ListingLegalStep({ formData, updateField }) {
  return (
    <div className="form-step-content">
      <h3 className="step-title">Legal & Marketing Details</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Title Deed Number</label>
          <input
            type="text"
            value={formData.titleDeedNumber}
            onChange={e => updateField('titleDeedNumber', e.target.value)}
            placeholder="For ready properties"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>RERA Permit Number *</label>
          <input
            type="text"
            value={formData.reraPermitNumber}
            onChange={e => updateField('reraPermitNumber', e.target.value)}
            placeholder="Required for listing"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Ownership Type</label>
        <div className="radio-group">
          {['freehold', 'leasehold', 'usufruct'].map(type => (
            <label key={type} className="radio-item">
              <input
                type="radio"
                name="ownershipType"
                value={type}
                checked={formData.ownershipType === type}
                onChange={e => updateField('ownershipType', e.target.value)}
              />
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Marketing Package</label>
        <div className="package-grid">
          {MARKETING_PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              type="button"
              className={`package-card ${formData.marketingPackage === pkg.id ? 'selected' : ''}`}
              onClick={() => updateField('marketingPackage', pkg.id)}
            >
              <div className="package-header">
                <span className="package-name">{pkg.name}</span>
                <span className="package-price">{pkg.price}</span>
              </div>
              <ul className="package-features">
                {pkg.features.map((f, i) => (
                  <li key={i}>
                    <Check size={14} /> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Featured Level (1-10)</label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.featuredLevel}
          onChange={e => updateField('featuredLevel', parseInt(e.target.value, 10))}
          className="form-range"
        />
        <div className="range-labels">
          <span>Standard</span>
          <span>Level: {formData.featuredLevel}</span>
          <span>Top Featured</span>
        </div>
      </div>
    </div>
  );
}
