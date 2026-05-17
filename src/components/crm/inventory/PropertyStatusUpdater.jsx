import React, { useState } from 'react';
import {
  AlertCircle,
  Home,
  Building2,
  TrendingUp,
  Hammer,
  Clock,
  Save,
  X,
  CheckCircle,
} from 'lucide-react';
import './PropertyStatusUpdater.css';

const PropertyStatusUpdater = ({ property, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    furnishing: property?.furnishing || 'unfurnished',
    occupancyStatus: property?.occupancyStatus || 'vacant',
    marketAvailability: property?.marketAvailability || 'available',
    constructionStage: property?.constructionStage || 'handed_over',
    legalStatus: property?.legalStatus || 'registered',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const furnishingOptions = [
    { value: 'unfurnished', label: 'Unfurnished', color: '#8b5cf6' },
    { value: 'furnished', label: 'Furnished', color: '#ec4899' },
    { value: 'semi-furnished', label: 'Semi-Furnished', color: '#f59e0b' },
  ];

  const occupancyOptions = [
    { value: 'vacant', label: 'Vacant', color: '#10b981' },
    { value: 'occupied', label: 'Occupied by Owner', color: '#3b82f6' },
    { value: 'rented', label: 'Rented', color: '#06b6d4' },
    { value: 'mixed', label: 'Mixed (Owner + Rental)', color: '#8b5cf6' },
  ];

  const marketOptions = [
    { value: 'available', label: 'Available', color: '#10b981' },
    { value: 'for-rent', label: 'For Rent', color: '#3b82f6' },
    { value: 'for-sale', label: 'For Sale', color: '#dc2626' },
    { value: 'hold', label: 'On Hold', color: '#f59e0b' },
    { value: 'not-available', label: 'Not Available', color: '#6b7280' },
  ];

  const constructionOptions = [
    { value: 'under_construction', label: 'Under Construction', color: '#f59e0b' },
    { value: 'handed_over', label: 'Handed Over', color: '#10b981' },
    { value: 'renovation', label: 'Renovation', color: '#06b6d4' },
    { value: 'maintenance', label: 'Maintenance', color: '#8b5cf6' },
  ];

  const legalOptions = [
    { value: 'registered', label: 'Registered', color: '#10b981' },
    { value: 'pending', label: 'Registration Pending', color: '#f59e0b' },
    { value: 'disputed', label: 'Under Dispute', color: '#dc2626' },
    { value: 'freehold', label: 'Freehold', color: '#3b82f6' },
    { value: 'leasehold', label: 'Leasehold', color: '#8b5cf6' },
  ];

  const handleStatusChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(formData);
      }
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update status' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      furnishing: property?.furnishing || 'unfurnished',
      occupancyStatus: property?.occupancyStatus || 'vacant',
      marketAvailability: property?.marketAvailability || 'available',
      constructionStage: property?.constructionStage || 'handed_over',
      legalStatus: property?.legalStatus || 'registered',
    });
    setErrors({});
    setIsEditing(false);
  };

  const getOptionLabel = (value, options) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getOptionColor = (value, options) => {
    return options.find((opt) => opt.value === value)?.color || '#6b7280';
  };

  if (!property) {
    return (
      <div className="property-status-updater empty">
        <div className="empty-state">
          <Home size={48} />
          <p>No property selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="property-status-updater">
      <div className="card-header">
        <h2>Property Status</h2>
        {!isEditing && (
          <button className="btn-edit" onClick={() => setIsEditing(true)} title="Edit status">
            Update
          </button>
        )}
      </div>

      {errors.submit && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{errors.submit}</span>
        </div>
      )}

      {isEditing ? (
        <div className="form-section">
          {/* Furnishing */}
          <div className="status-group">
            <label>
              <Home size={16} /> Furnishing
            </label>
            <div className="button-group">
              {furnishingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`status-button ${
                    formData.furnishing === option.value ? 'selected' : ''
                  }`}
                  onClick={() => handleStatusChange('furnishing', option.value)}
                  style={
                    formData.furnishing === option.value
                      ? { backgroundColor: option.color, color: 'white' }
                      : {}
                  }
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Occupancy Status */}
          <div className="status-group">
            <label>
              <Building2 size={16} /> Occupancy Status
            </label>
            <div className="button-group">
              {occupancyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`status-button ${
                    formData.occupancyStatus === option.value ? 'selected' : ''
                  }`}
                  onClick={() => handleStatusChange('occupancyStatus', option.value)}
                  style={
                    formData.occupancyStatus === option.value
                      ? { backgroundColor: option.color, color: 'white' }
                      : {}
                  }
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Market Availability */}
          <div className="status-group">
            <label>
              <TrendingUp size={16} /> Market Availability
            </label>
            <div className="button-group">
              {marketOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`status-button ${
                    formData.marketAvailability === option.value ? 'selected' : ''
                  }`}
                  onClick={() => handleStatusChange('marketAvailability', option.value)}
                  style={
                    formData.marketAvailability === option.value
                      ? { backgroundColor: option.color, color: 'white' }
                      : {}
                  }
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Construction Stage */}
          <div className="status-group">
            <label>
              <Hammer size={16} /> Construction Stage
            </label>
            <div className="button-group">
              {constructionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`status-button ${
                    formData.constructionStage === option.value ? 'selected' : ''
                  }`}
                  onClick={() => handleStatusChange('constructionStage', option.value)}
                  style={
                    formData.constructionStage === option.value
                      ? { backgroundColor: option.color, color: 'white' }
                      : {}
                  }
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Legal Status */}
          <div className="status-group">
            <label>
              <CheckCircle size={16} /> Legal Status
            </label>
            <div className="button-group">
              {legalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`status-button ${
                    formData.legalStatus === option.value ? 'selected' : ''
                  }`}
                  onClick={() => handleStatusChange('legalStatus', option.value)}
                  style={
                    formData.legalStatus === option.value
                      ? { backgroundColor: option.color, color: 'white' }
                      : {}
                  }
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Updating...' : <><Save size={16} /> Update Status</>}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="info-section">
          {/* Furnishing Status */}
          <div className="status-item">
            <span className="status-label">
              <Home size={14} /> Furnishing
            </span>
            <span
              className="status-badge"
              style={{
                backgroundColor: getOptionColor(property.furnishing, furnishingOptions),
              }}
            >
              {getOptionLabel(property.furnishing, furnishingOptions)}
            </span>
          </div>

          {/* Occupancy Status */}
          <div className="status-item">
            <span className="status-label">
              <Building2 size={14} /> Occupancy
            </span>
            <span
              className="status-badge"
              style={{
                backgroundColor: getOptionColor(property.occupancyStatus, occupancyOptions),
              }}
            >
              {getOptionLabel(property.occupancyStatus, occupancyOptions)}
            </span>
          </div>

          {/* Market Availability */}
          <div className="status-item">
            <span className="status-label">
              <TrendingUp size={14} /> Market
            </span>
            <span
              className="status-badge"
              style={{
                backgroundColor: getOptionColor(
                  property.marketAvailability,
                  marketOptions
                ),
              }}
            >
              {getOptionLabel(property.marketAvailability, marketOptions)}
            </span>
          </div>

          {/* Construction Stage */}
          <div className="status-item">
            <span className="status-label">
              <Hammer size={14} /> Construction
            </span>
            <span
              className="status-badge"
              style={{
                backgroundColor: getOptionColor(
                  property.constructionStage,
                  constructionOptions
                ),
              }}
            >
              {getOptionLabel(property.constructionStage, constructionOptions)}
            </span>
          </div>

          {/* Legal Status */}
          <div className="status-item">
            <span className="status-label">
              <CheckCircle size={14} /> Legal
            </span>
            <span
              className="status-badge"
              style={{
                backgroundColor: getOptionColor(property.legalStatus, legalOptions),
              }}
            >
              {getOptionLabel(property.legalStatus, legalOptions)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyStatusUpdater;
