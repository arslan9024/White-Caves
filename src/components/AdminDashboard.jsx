import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProperties } from '../store/propertySlice';
import './AdminDashboard.css';

const emptyProperty = {
  title: '',
  location: '',
  type: 'Villa',
  beds: 3,
  baths: 3,
  sqft: 2000,
  price: 5000000,
  description: '',
  amenities: [],
  images: []
};

const propertyTypes = ['Villa', 'Apartment', 'Penthouse', 'Townhouse'];
const locations = [
  'Palm Jumeirah', 'Downtown Dubai', 'Emirates Hills', 'Dubai Marina',
  'Arabian Ranches', 'Jumeirah Village Circle', 'Business Bay',
  'Jumeirah Beach Residence', 'Dubai Hills Estate', 'City Walk',
  'Mohammed Bin Rashid City', 'The Springs'
];
const availableAmenities = [
  'Pool', 'Beach Access', 'Garden', 'Gym', 'Parking', 
  'Security', 'Concierge', 'Cinema', 'Spa', 'Tennis Court'
];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const properties = useSelector(state => state.properties.properties);
  
  const [activeTab, setActiveTab] = useState('list');
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState(emptyProperty);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [notification, setNotification] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const isAdmin = user?.isSuperUser || 
                  user?.roles?.includes('SUPER_USER') || 
                  user?.roles?.includes('AGENT') ||
                  user?.isDecisionMaker === true;

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageAdd = () => {
    if (newImageUrl && newImageUrl.trim()) {
      const url = newImageUrl.trim();
      if (url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) || url.startsWith('https://images.unsplash.com')) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url]
        }));
        setNewImageUrl('');
        setFormErrors(prev => ({ ...prev, image: '' }));
      } else {
        setFormErrors(prev => ({ ...prev, image: 'Please enter a valid image URL' }));
      }
    }
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title || formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    if (!formData.location) {
      errors.location = 'Please select a location';
    }
    if (!formData.price || formData.price < 100000) {
      errors.price = 'Price must be at least AED 100,000';
    }
    if (formData.beds < 1 || formData.beds > 20) {
      errors.beds = 'Bedrooms must be between 1 and 20';
    }
    if (formData.baths < 1 || formData.baths > 20) {
      errors.baths = 'Bathrooms must be between 1 and 20';
    }
    if (formData.sqft < 100) {
      errors.sqft = 'Area must be at least 100 sqft';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('Please fix the form errors', 'error');
      return;
    }
    setFormErrors({});

    if (editingProperty) {
      const updatedProperties = properties.map(p => 
        p.id === editingProperty.id ? { ...formData, id: p.id } : p
      );
      dispatch(setProperties(updatedProperties));
      showNotification('Property updated successfully');
    } else {
      const newProperty = {
        ...formData,
        id: Math.max(...properties.map(p => p.id), 0) + 1
      };
      dispatch(setProperties([...properties, newProperty]));
      showNotification('Property created successfully');
    }

    setFormData(emptyProperty);
    setEditingProperty(null);
    setActiveTab('list');
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      ...property,
      amenities: property.amenities || [],
      images: property.images || []
    });
    setActiveTab('form');
  };

  const handleDelete = (propertyId) => {
    const updatedProperties = properties.filter(p => p.id !== propertyId);
    dispatch(setProperties(updatedProperties));
    setShowDeleteModal(null);
    showNotification('Property deleted successfully');
  };

  const handleCancel = () => {
    setFormData(emptyProperty);
    setEditingProperty(null);
    setActiveTab('list');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="admin-access-denied">
          <span className="access-icon">🔒</span>
          <h2>Admin Access Required</h2>
          <p>You need administrator privileges to access this section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {notification && (
        <div className={`admin-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="admin-header">
        <div className="admin-title">
          <h2>Property Management</h2>
          <p>Manage your property listings</p>
        </div>
        <div className="admin-stats">
          <div className="admin-stat">
            <span className="stat-number">{properties.length}</span>
            <span className="stat-label">Total Properties</span>
          </div>
          <div className="admin-stat">
            <span className="stat-number">{properties.filter(p => p.type === 'Villa').length}</span>
            <span className="stat-label">Villas</span>
          </div>
          <div className="admin-stat">
            <span className="stat-number">{properties.filter(p => p.type === 'Apartment').length}</span>
            <span className="stat-label">Apartments</span>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => { setActiveTab('list'); handleCancel(); }}
        >
          📋 Property List
        </button>
        <button 
          className={`admin-tab ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          {editingProperty ? '✏️ Edit Property' : '➕ Add Property'}
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'list' && (
          <div className="property-list-section">
            <div className="list-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="type-filter"
              >
                <option value="all">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button 
                className="add-property-btn"
                onClick={() => { setEditingProperty(null); setFormData(emptyProperty); setActiveTab('form'); }}
              >
                ➕ Add New
              </button>
            </div>

            <div className="property-table-wrapper">
              <table className="property-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Beds/Baths</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map(property => (
                    <tr key={property.id}>
                      <td className="property-cell">
                        <div className="property-preview">
                          <div 
                            className="property-thumb"
                            style={{ 
                              backgroundImage: `url(${property.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'})`
                            }}
                          ></div>
                          <span className="property-title">{property.title}</span>
                        </div>
                      </td>
                      <td>{property.location}</td>
                      <td>
                        <span className={`type-badge ${property.type.toLowerCase()}`}>
                          {property.type}
                        </span>
                      </td>
                      <td>{property.beds} / {property.baths}</td>
                      <td className="price-cell">{formatPrice(property.price)}</td>
                      <td className="actions-cell">
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEdit(property)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => setShowDeleteModal(property)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProperties.length === 0 && (
                <div className="no-results">
                  <span>🏠</span>
                  <p>No properties found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <form className="property-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="title">Property Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury Villa with Pool - Palm Jumeirah"
                    className={formErrors.title ? 'error' : ''}
                    required
                  />
                  {formErrors.title && <span className="form-error">{formErrors.title}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={formErrors.location ? 'error' : ''}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  {formErrors.location && <span className="form-error">{formErrors.location}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="type">Property Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Property Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="beds">Bedrooms</label>
                  <input
                    type="number"
                    id="beds"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className={formErrors.beds ? 'error' : ''}
                  />
                  {formErrors.beds && <span className="form-error">{formErrors.beds}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="baths">Bathrooms</label>
                  <input
                    type="number"
                    id="baths"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className={formErrors.baths ? 'error' : ''}
                  />
                  {formErrors.baths && <span className="form-error">{formErrors.baths}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="sqft">Area (sqft)</label>
                  <input
                    type="number"
                    id="sqft"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    min="100"
                    step="100"
                    className={formErrors.sqft ? 'error' : ''}
                  />
                  {formErrors.sqft && <span className="form-error">{formErrors.sqft}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price (AED) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="100000"
                    step="100000"
                    className={formErrors.price ? 'error' : ''}
                    required
                  />
                  {formErrors.price && <span className="form-error">{formErrors.price}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Description</h3>
              <div className="form-group full-width">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a detailed description of the property..."
                  rows="4"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Images</h3>
              <div className="images-section">
                <div className="image-list">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-item">
                      <img src={img} alt={`Property ${index + 1}`} />
                      <button 
                        type="button"
                        className="remove-image"
                        onClick={() => handleImageRemove(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="image-add-section">
                  <input
                    type="text"
                    placeholder="Enter image URL (e.g., https://images.unsplash.com/...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className={formErrors.image ? 'error' : ''}
                  />
                  <button 
                    type="button"
                    className="add-image-btn-inline"
                    onClick={handleImageAdd}
                  >
                    Add Image
                  </button>
                </div>
                {formErrors.image && <span className="form-error">{formErrors.image}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {editingProperty ? 'Update Property' : 'Create Property'}
              </button>
            </div>
          </form>
        )}
      </div>

      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Property</h3>
            <p>Are you sure you want to delete "{showDeleteModal.title}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(null)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={() => handleDelete(showDeleteModal.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
