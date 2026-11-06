// FILE: src/components/crm/AgentListingForm/steps/ListingMediaStep.jsx
import React from 'react';
import { Upload } from 'lucide-react';

export default function ListingMediaStep({ formData, updateField }) {
  return (
    <div className="form-step-content">
      <h3 className="step-title">Property Media</h3>

      <div className="form-group">
        <label>Property Images *</label>
        <div className="upload-zone">
          <Upload size={32} />
          <p>Drag & drop images here or click to upload</p>
          <span>Supported formats: JPG, PNG, WEBP (Max 10MB each)</span>
        </div>
        <div className="upload-tips">
          <p>Tips: Upload at least 10 high-quality images including:</p>
          <ul>
            <li>Exterior shots</li>
            <li>All rooms and spaces</li>
            <li>Kitchen and bathrooms</li>
            <li>Views from balcony/terrace</li>
            <li>Building amenities</li>
          </ul>
        </div>
      </div>

      <div className="form-group">
        <label>Floor Plans</label>
        <div className="upload-zone small">
          <Upload size={24} />
          <p>Upload floor plan images</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Video URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={e => updateField('videoUrl', e.target.value)}
            placeholder="YouTube or Vimeo link"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Virtual Tour URL</label>
          <input
            type="url"
            value={formData.virtualTourUrl}
            onChange={e => updateField('virtualTourUrl', e.target.value)}
            placeholder="Matterport or 3D tour link"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
}
