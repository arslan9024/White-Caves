import React, { useState } from "react";
import { Zap, CheckCircle, AlertCircle } from "lucide-react";
import "./QuickAddPropertyForm.css";

export default function QuickAddPropertyForm({ opportunity, onClose, onSave }) {
  const [formData, setFormData] = useState({
    propertyType: opportunity?.propertyType || "",
    location: opportunity?.location || "",
    bedrooms: opportunity?.bedrooms || "",
    bathrooms: opportunity?.bathrooms || "",
    price: opportunity?.price || "",
    furnishing: opportunity?.furnishing || "semi_furnished",
    ownerRelationshipType: "direct_owner",
    features: opportunity?.features || [],
    description: "",
    publishImmediately: true,
    contactEmail: "",
    contactPhone: opportunity?.ownerPhone || ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.propertyType) newErrors.propertyType = "Property type is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.bedrooms && formData.propertyType !== "studio") newErrors.bedrooms = "Bedrooms are required";
    if (!formData.price) newErrors.price = "Price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      onSave(formData);
    }
  };

  const handleAddFeature = (feature) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const suggestedFeatures = [
    "pool", "gym", "parking", "garden", "balcony", "terrace",
    "maid room", "laundry", "ac", "kitchen appliances", "security", "playground"
  ];

  if (submitted) {
    return (
      <div className="quick-add-form success-screen">
        <div className="success-container">
          <CheckCircle size={64} />
          <h2>Property Added Successfully!</h2>
          <p>Your property has been added to Mary inventory</p>
          <div className="property-summary">
            <h3>{formData.propertyType} - {formData.location}</h3>
            <div className="summary-details">
              <span>{formData.bedrooms} BR</span>
              <span>AED {parseInt(formData.price).toLocaleString()}/month</span>
            </div>
          </div>
          <button className="btn-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-add-form">
      <div className="form-header">
        <div className="header-content">
          <Zap size={24} />
          <div>
            <h2>Quick Add to Mary</h2>
            <p>Add this property to your inventory in seconds</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <h3 className="section-title">
            <CheckCircle size={18} /> Extraction Preview
          </h3>
          <div className="preview-grid">
            <div className="preview-item">
              <span className="label">Extracted from</span>
              <p className="value">{opportunity?.ownerName || "Unknown"}</p>
            </div>
            <div className="preview-item">
              <span className="label">Confidence</span>
              <div className="confidence-score">
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${opportunity?.confidence}%` }}
                  />
                </div>
                <span className="score-value">{opportunity?.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Property Information</h3>

          <div className="form-group">
            <label htmlFor="propertyType">Property Type *</label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={`form-input ${errors.propertyType ? "error" : ""}`}
            >
              <option value="">Select property type</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="penthouse">Penthouse</option>
              <option value="studio">Studio</option>
              <option value="duplex">Duplex</option>
              <option value="other">Other</option>
            </select>
            {errors.propertyType && <span className="error-message">{errors.propertyType}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Arabian Ranches"
                className={`form-input ${errors.location ? "error" : ""}`}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms *</label>
              <input
                id="bedrooms"
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                max="10"
                className={`form-input ${errors.bedrooms ? "error" : ""}`}
              />
              {errors.bedrooms && <span className="error-message">{errors.bedrooms}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                id="bathrooms"
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                max="10"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Pricing & Availability</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Monthly Rent (AED) *</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`form-input ${errors.price ? "error" : ""}`}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="furnishing">Furnishing Status</label>
              <select
                id="furnishing"
                name="furnishing"
                value={formData.furnishing}
                onChange={handleChange}
                className="form-input"
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi_furnished">Semi-Furnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Property Features</h3>
          
          <div className="features-section">
            <p className="features-hint">Select features included with this property</p>
            <div className="features-grid">
              {suggestedFeatures.map(feature => (
                <button
                  key={feature}
                  type="button"
                  className={`feature-btn ${formData.features.includes(feature) ? "selected" : ""}`}
                  onClick={() => handleAddFeature(feature)}
                >
                  {feature}
                </button>
              ))}
            </div>

            {formData.features.length > 0 && (
              <div className="selected-features">
                <label>Selected Features:</label>
                <div className="feature-tags">
                  {formData.features.map(feature => (
                    <span key={feature} className="feature-tag">
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Owner Information</h3>

          <div className="form-group">
            <label htmlFor="ownerRelationshipType">Relationship Type</label>
            <select
              id="ownerRelationshipType"
              name="ownerRelationshipType"
              value={formData.ownerRelationshipType}
              onChange={handleChange}
              className="form-input"
            >
              <option value="direct_owner">Direct Owner</option>
              <option value="property_manager">Property Manager</option>
              <option value="broker">Broker</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactPhone">Contact Phone</label>
              <input
                id="contactPhone"
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                id="contactEmail"
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="description">Additional Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details about the property..."
              rows="4"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="publish-option">
            <input
              id="publishImmediately"
              type="checkbox"
              name="publishImmediately"
              checked={formData.publishImmediately}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="publishImmediately" className="checkbox-label">
              Publish this property immediately (visible to agents)
            </label>
          </div>
          {!formData.publishImmediately && (
            <p className="info-message">
              <AlertCircle size={16} />
              Property will be saved as draft and can be published later
            </p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
          >
            <Zap size={18} />
            Add to Mary Inventory
          </button>
        </div>
      </form>
    </div>
  );
}
