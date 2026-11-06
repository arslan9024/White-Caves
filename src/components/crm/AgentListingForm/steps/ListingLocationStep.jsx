// FILE: src/components/crm/AgentListingForm/steps/ListingLocationStep.jsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { DUBAI_COMMUNITIES } from '../AgentListingForm.data';

export default function ListingLocationStep({ formData, updateField }) {
  return (
    <div className="form-step-content">
      <h3 className="step-title">Property Location</h3>

      <div className="form-group">
        <label>Community *</label>
        <select
          value={formData.community}
          onChange={e => updateField('community', e.target.value)}
          className="form-select"
        >
          <option value="">Select Community</option>
          {DUBAI_COMMUNITIES.map(community => (
            <option key={community} value={community}>
              {community}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Sub-Community</label>
          <input
            type="text"
            value={formData.subCommunity}
            onChange={e => updateField('subCommunity', e.target.value)}
            placeholder="e.g., Frond A"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Building Name</label>
          <input
            type="text"
            value={formData.buildingName}
            onChange={e => updateField('buildingName', e.target.value)}
            placeholder="e.g., Burj Khalifa"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Floor Number</label>
          <input
            type="number"
            value={formData.floorNumber}
            onChange={e => updateField('floorNumber', e.target.value)}
            placeholder="e.g., 25"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Unit Number</label>
          <input
            type="text"
            value={formData.unitNumber}
            onChange={e => updateField('unitNumber', e.target.value)}
            placeholder="e.g., 2501"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Full Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={e => updateField('address', e.target.value)}
          placeholder="Complete property address"
          className="form-input"
        />
      </div>

      <div className="map-placeholder">
        <MapPin size={32} />
        <span>Map integration will be added here</span>
      </div>
    </div>
  );
}
