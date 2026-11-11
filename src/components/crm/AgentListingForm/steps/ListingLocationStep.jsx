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
<<<<<<< Updated upstream
          onChange={e => updateField('community', e.target.value)}
=======
          onChange={(e) => updateField('community', e.target.value)}
>>>>>>> Stashed changes
          className="form-select"
        >
          <option value="">Select Community</option>
          {DUBAI_COMMUNITIES.map(community => (
<<<<<<< Updated upstream
            <option key={community} value={community}>
              {community}
            </option>
=======
            <option key={community} value={community}>{community}</option>
>>>>>>> Stashed changes
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Sub-Community</label>
          <input
            type="text"
            value={formData.subCommunity}
<<<<<<< Updated upstream
            onChange={e => updateField('subCommunity', e.target.value)}
=======
            onChange={(e) => updateField('subCommunity', e.target.value)}
>>>>>>> Stashed changes
            placeholder="e.g., Frond A"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Building Name</label>
          <input
            type="text"
            value={formData.buildingName}
<<<<<<< Updated upstream
            onChange={e => updateField('buildingName', e.target.value)}
=======
            onChange={(e) => updateField('buildingName', e.target.value)}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            onChange={e => updateField('floorNumber', e.target.value)}
=======
            onChange={(e) => updateField('floorNumber', e.target.value)}
>>>>>>> Stashed changes
            placeholder="e.g., 25"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Unit Number</label>
          <input
            type="text"
            value={formData.unitNumber}
<<<<<<< Updated upstream
            onChange={e => updateField('unitNumber', e.target.value)}
=======
            onChange={(e) => updateField('unitNumber', e.target.value)}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          onChange={e => updateField('address', e.target.value)}
=======
          onChange={(e) => updateField('address', e.target.value)}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
