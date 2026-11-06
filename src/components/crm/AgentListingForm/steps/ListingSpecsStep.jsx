// FILE: src/components/crm/AgentListingForm/steps/ListingSpecsStep.jsx
import React from 'react';
import { Bed, Bath, Ruler, LandPlot, Car } from 'lucide-react';
import { VIEWS, AMENITIES } from '../AgentListingForm.data';

export default function ListingSpecsStep({ formData, updateField, toggleArrayField }) {
  return (
    <div className="form-step-content">
      <h3 className="step-title">Property Specifications</h3>

      <div className="form-row four-col">
        <div className="form-group">
          <label>
            <Bed size={16} /> Bedrooms *
          </label>
          <select
            value={formData.bedrooms}
            onChange={e => updateField('bedrooms', e.target.value)}
            className="form-select"
          >
            <option value="">Select</option>
            <option value="studio">Studio</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>
            <Bath size={16} /> Bathrooms *
          </label>
          <select
            value={formData.bathrooms}
            onChange={e => updateField('bathrooms', e.target.value)}
            className="form-select"
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>
            <Ruler size={16} /> Built-up Area (sqft) *
          </label>
          <input
            type="number"
            value={formData.builtUpArea}
            onChange={e => updateField('builtUpArea', e.target.value)}
            placeholder="e.g., 2500"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>
            <LandPlot size={16} /> Plot Size (sqft)
          </label>
          <input
            type="number"
            value={formData.plotSize}
            onChange={e => updateField('plotSize', e.target.value)}
            placeholder="For villas/land"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            <Car size={16} /> Parking Spaces
          </label>
          <input
            type="number"
            value={formData.parkingSpaces}
            onChange={e => updateField('parkingSpaces', e.target.value)}
            placeholder="e.g., 2"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Year Built</label>
          <input
            type="number"
            value={formData.yearBuilt}
            onChange={e => updateField('yearBuilt', e.target.value)}
            placeholder="e.g., 2022"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Developer</label>
          <input
            type="text"
            value={formData.developer}
            onChange={e => updateField('developer', e.target.value)}
            placeholder="e.g., Emaar"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Views</label>
        <div className="checkbox-grid">
          {VIEWS.map(view => (
            <label key={view} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.views.includes(view)}
                onChange={() => toggleArrayField('views', view)}
              />
              <span>{view}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Amenities</label>
        <div className="amenities-grid">
          {AMENITIES.map(amenity => (
            <button
              key={amenity.id}
              type="button"
              className={`amenity-card ${formData.amenities.includes(amenity.id) ? 'selected' : ''}`}
              onClick={() => toggleArrayField('amenities', amenity.id)}
            >
              <amenity.icon size={20} />
              <span>{amenity.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
