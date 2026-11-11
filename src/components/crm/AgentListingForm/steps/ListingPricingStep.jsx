// FILE: src/components/crm/AgentListingForm/steps/ListingPricingStep.jsx
import React from 'react';

export default function ListingPricingStep({ formData, updateField }) {
  return (
    <div className="form-step-content">
      <h3 className="step-title">Pricing Details</h3>

      <div className="form-group">
        <label>Listing Type *</label>
        <div className="listing-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${formData.listingType === 'sale' ? 'active' : ''}`}
            onClick={() => updateField('listingType', 'sale')}
          >
            For Sale
          </button>
          <button
            type="button"
            className={`toggle-btn ${formData.listingType === 'rent' ? 'active' : ''}`}
            onClick={() => updateField('listingType', 'rent')}
          >
            For Rent
          </button>
          <button
            type="button"
            className={`toggle-btn ${formData.listingType === 'both' ? 'active' : ''}`}
            onClick={() => updateField('listingType', 'both')}
          >
            Both
          </button>
        </div>
      </div>

      {(formData.listingType === 'sale' || formData.listingType === 'both') && (
        <div className="form-group">
          <label>Sale Price (AED) *</label>
          <input
            type="number"
            value={formData.salePrice}
<<<<<<< Updated upstream
            onChange={e => updateField('salePrice', e.target.value)}
=======
            onChange={(e) => updateField('salePrice', e.target.value)}
>>>>>>> Stashed changes
            placeholder="e.g., 15000000"
            className="form-input price-input"
          />
          {formData.salePrice && formData.builtUpArea && (
            <div className="price-calc">
<<<<<<< Updated upstream
              Price per sqft: AED{' '}
              {Math.round(formData.salePrice / formData.builtUpArea).toLocaleString()}
=======
              Price per sqft: AED {Math.round(formData.salePrice / formData.builtUpArea).toLocaleString()}
>>>>>>> Stashed changes
            </div>
          )}
        </div>
      )}

      {(formData.listingType === 'rent' || formData.listingType === 'both') && (
        <div className="form-row">
          <div className="form-group">
            <label>Rent Price (AED) *</label>
            <input
              type="number"
              value={formData.rentPrice}
<<<<<<< Updated upstream
              onChange={e => updateField('rentPrice', e.target.value)}
=======
              onChange={(e) => updateField('rentPrice', e.target.value)}
>>>>>>> Stashed changes
              placeholder="e.g., 250000"
              className="form-input price-input"
            />
          </div>
          <div className="form-group">
            <label>Rent Frequency</label>
            <select
              value={formData.rentFrequency}
<<<<<<< Updated upstream
              onChange={e => updateField('rentFrequency', e.target.value)}
=======
              onChange={(e) => updateField('rentFrequency', e.target.value)}
>>>>>>> Stashed changes
              className="form-select"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Annual Service Charges (AED)</label>
        <input
          type="number"
          value={formData.serviceCharges}
<<<<<<< Updated upstream
          onChange={e => updateField('serviceCharges', e.target.value)}
=======
          onChange={(e) => updateField('serviceCharges', e.target.value)}
>>>>>>> Stashed changes
          placeholder="e.g., 50000"
          className="form-input"
        />
      </div>
    </div>
  );
}
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
