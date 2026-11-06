// FILE: src/components/crm/AgentListingForm/steps/ListingBasicInfoStep.jsx
import React from 'react';
import { PROPERTY_TYPES, COMPLETION_STATUS, FURNISH_TYPES } from '../AgentListingForm.data';

export default function ListingBasicInfoStep({ formData, updateField }) {
  return (
    <div className="form-step-content">
      <h3 className="step-title">Property Basic Information</h3>

      <div className="form-group">
        <label>Property Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => updateField('title', e.target.value)}
          placeholder="e.g., Stunning 4BR Villa with Sea View"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Property Type *</label>
        <div className="property-type-grid">
          {PROPERTY_TYPES.map(type => (
            <button
              key={type.id}
              type="button"
              className={`type-card ${formData.propertyType === type.id ? 'selected' : ''}`}
              onClick={() => updateField('propertyType', type.id)}
            >
              <type.icon size={24} />
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Completion Status</label>
          <select
            value={formData.completionStatus}
            onChange={e => updateField('completionStatus', e.target.value)}
            className="form-select"
          >
            {COMPLETION_STATUS.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Furnishing</label>
          <select
            value={formData.furnishType}
            onChange={e => updateField('furnishType', e.target.value)}
            className="form-select"
          >
            {FURNISH_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="Describe the property features, highlights, and unique selling points..."
          className="form-textarea"
          rows={5}
        />
      </div>
    </div>
  );
}
