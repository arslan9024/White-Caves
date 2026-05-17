import React, { useState } from 'react';
import {
  Home,
  MapPin,
  DollarSign,
  Maximize2,
  Bed,
  Bath,
  Sparkles,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import './PropertyInformationCard.css';

const PropertyInformationCard = ({ property, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    type: property?.type || '',
    area: property?.area || '',
    beds: property?.beds || 0,
    baths: property?.baths || 0,
    price: property?.price || '',
    furnishing: property?.furnishing || 'unfurnished',
    features: property?.features || [],
    description: property?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const propertyTypes = ['Apartment', 'Villa', 'Townhouse', 'Studio', 'Penthouse', 'Duplex'];
  const furnishingOptions = ['Unfurnished', 'Furnished', 'Semi-Furnished'];
  const featuresList = [
    'Swimming Pool',
    'Gym',
    'Security',
    'Parking',
    'Balcony',
    'Garden',
    'AC',
    'Central Cooling',
    'Maid Room',
    'Study',
    'Home Office',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Property type is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (formData.beds < 0) newErrors.beds = 'Bedrooms must be 0 or more';
    if (formData.baths < 0) newErrors.baths = 'Bathrooms must be 0 or more';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
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

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const toggleFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(formData);
      }
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update property' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      type: property?.type || '',
      area: property?.area || '',
      beds: property?.beds || 0,
      baths: property?.baths || 0,
      price: property?.price || '',
      furnishing: property?.furnishing || 'unfurnished',
      features: property?.features || [],
      description: property?.description || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!property) {
    return (
      <div className="property-information-card empty">
        <div className="empty-state">
          <Home size={48} />
          <p>No property selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="property-information-card">
      <div className="card-header">
        <div className="header-title">
          <Home size={24} />
          <h2>Property Information</h2>
        </div>
        {!isEditing && (
          <button
            className="btn-edit"
            onClick={() => setIsEditing(true)}
            title="Edit property"
          >
            <Edit size={18} />
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
          {/* Property Type */}
          <div className="form-group">
            <label htmlFor="type">
              <Home size={16} /> Property Type
              {errors.type && <span className="error-text">{errors.type}</span>}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={errors.type ? 'input-error' : ''}
            >
              <option value="">Select Type</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div className="form-group">
            <label htmlFor="area">
              <Maximize2 size={16} /> Area (Sq. Ft.)
              {errors.area && <span className="error-text">{errors.area}</span>}
            </label>
            <input
              id="area"
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="e.g., 1,200 sqft"
              className={errors.area ? 'input-error' : ''}
            />
          </div>

          {/* Beds & Baths */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="beds">
                <Bed size={16} /> Bedrooms
                {errors.beds && <span className="error-text">{errors.beds}</span>}
              </label>
              <input
                id="beds"
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleNumberChange}
                min="0"
                className={errors.beds ? 'input-error' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="baths">
                <Bath size={16} /> Bathrooms
                {errors.baths && <span className="error-text">{errors.baths}</span>}
              </label>
              <input
                id="baths"
                type="number"
                name="baths"
                value={formData.baths}
                onChange={handleNumberChange}
                min="0"
                className={errors.baths ? 'input-error' : ''}
              />
            </div>
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">
              <DollarSign size={16} /> Price (AED)
              {errors.price && <span className="error-text">{errors.price}</span>}
            </label>
            <input
              id="price"
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 500,000"
              className={errors.price ? 'input-error' : ''}
            />
          </div>

          {/* Furnishing */}
          <div className="form-group">
            <label htmlFor="furnishing">Furnishing</label>
            <select
              id="furnishing"
              name="furnishing"
              value={formData.furnishing}
              onChange={handleInputChange}
            >
              {furnishingOptions.map((option) => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Features */}
          <div className="form-group">
            <label>
              <Sparkles size={16} /> Features
            </label>
            <div className="features-grid">
              {featuresList.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  className={`feature-badge ${
                    formData.features.includes(feature) ? 'selected' : ''
                  }`}
                  onClick={() => toggleFeature(feature)}
                >
                  <CheckCircle size={14} />
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Additional property details..."
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
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
          {/* Property Type */}
          <div className="info-item">
            <span className="info-label">
              <Home size={16} /> Type
            </span>
            <span className="info-value">{property.type || 'Not specified'}</span>
          </div>

          {/* Area */}
          <div className="info-item">
            <span className="info-label">
              <Maximize2 size={16} /> Area
            </span>
            <span className="info-value">{property.area || 'Not specified'}</span>
          </div>

          {/* Beds & Baths */}
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">
                <Bed size={16} /> Beds
              </span>
              <span className="info-value">{property.beds || 0}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <Bath size={16} /> Baths
              </span>
              <span className="info-value">{property.baths || 0}</span>
            </div>
          </div>

          {/* Price */}
          <div className="info-item">
            <span className="info-label">
              <DollarSign size={16} /> Price
            </span>
            <span className="info-value">{property.price || 'On Request'}</span>
          </div>

          {/* Furnishing */}
          <div className="info-item">
            <span className="info-label">Furnishing</span>
            <span className="info-badge">{property.furnishing || 'Not specified'}</span>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="info-item full-width">
              <span className="info-label">
                <Sparkles size={16} /> Features
              </span>
              <div className="features-list">
                {property.features.map((feature) => (
                  <span key={feature} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="info-item full-width">
              <span className="info-label">Description</span>
              <p className="info-description">{property.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyInformationCard;
