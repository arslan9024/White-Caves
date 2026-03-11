import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProperties } from '../store/propertySlice';
import * as S from './AdminDashboard.styles';

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
      <S.DashboardContainer>
        <S.AccessDeniedContainer>
          <span className="access-icon">🔒</span>
          <h2>Admin Access Required</h2>
          <p>You need administrator privileges to access this section.</p>
        </S.AccessDeniedContainer>
      </S.DashboardContainer>
    );
  }

  return (
    <S.DashboardContainer>
      {notification && (
        <S.Notification type={notification.type}>
          {notification.message}
        </S.Notification>
      )}

      <S.Header>
        <S.Title>
          <h2>Property Management</h2>
          <p>Manage your property listings</p>
        </S.Title>
        <S.Stats>
          <S.Stat>
            <S.StatNumber>{properties.length}</S.StatNumber>
            <S.StatLabel>Total Properties</S.StatLabel>
          </S.Stat>
          <S.Stat>
            <S.StatNumber>{properties.filter(p => p.type === 'Villa').length}</S.StatNumber>
            <S.StatLabel>Villas</S.StatLabel>
          </S.Stat>
          <S.Stat>
            <S.StatNumber>{properties.filter(p => p.type === 'Apartment').length}</S.StatNumber>
            <S.StatLabel>Apartments</S.StatLabel>
          </S.Stat>
        </S.Stats>
      </S.Header>

      <S.Tabs>
        <S.Tab 
          active={activeTab === 'list'}
          onClick={() => { setActiveTab('list'); handleCancel(); }}
        >
          📋 Property List
        </S.Tab>
        <S.Tab 
          active={activeTab === 'form'}
          onClick={() => setActiveTab('form')}
        >
          {editingProperty ? '✏️ Edit Property' : '➕ Add Property'}
        </S.Tab>
      </S.Tabs>

      <S.Content>
        {activeTab === 'list' && (
          <S.ListSection>
            <S.ListControls>
              <S.SearchBox>
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </S.SearchBox>
              <S.TypeFilter
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </S.TypeFilter>
              <S.AddPropertyBtn
                onClick={() => { setEditingProperty(null); setFormData(emptyProperty); setActiveTab('form'); }}
              >
                ➕ Add New
              </S.AddPropertyBtn>
            </S.ListControls>

            <S.TableWrapper>
              <S.PropertyTable>
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
                      <S.PropertyCell>
                        <S.PropertyPreview>
                          <S.PropertyThumb
                            style={{ 
                              backgroundImage: `url(${property.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'})`
                            }}
                          />
                          <S.PropertyTitle>{property.title}</S.PropertyTitle>
                        </S.PropertyPreview>
                      </S.PropertyCell>
                      <td>{property.location}</td>
                      <td>
                        <S.TypeBadge type={property.type}>
                          {property.type}
                        </S.TypeBadge>
                      </td>
                      <td>{property.beds} / {property.baths}</td>
                      <S.PriceCell>{formatPrice(property.price)}</S.PriceCell>
                      <S.ActionsCell>
                        <S.ActionBtn 
                          variant="edit"
                          onClick={() => handleEdit(property)}
                          title="Edit"
                        >
                          ✏️
                        </S.ActionBtn>
                        <S.ActionBtn 
                          variant="delete"
                          onClick={() => setShowDeleteModal(property)}
                          title="Delete"
                        >
                          🗑️
                        </S.ActionBtn>
                      </S.ActionsCell>
                    </tr>
                  ))}
                </tbody>
              </S.PropertyTable>
              {filteredProperties.length === 0 && (
                <S.NoResults>
                  <span>🏠</span>
                  <p>No properties found matching your criteria</p>
                </S.NoResults>
              )}
            </S.TableWrapper>
          </S.ListSection>
        )}

        {activeTab === 'form' && (
          <S.PropertyForm onSubmit={handleSubmit}>
            <S.FormSection>
              <h3>Basic Information</h3>
              <S.FormGrid>
                <S.FormGroup fullWidth>
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
                  {formErrors.title && <S.FormError>{formErrors.title}</S.FormError>}
                </S.FormGroup>
                <S.FormGroup>
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
                  {formErrors.location && <S.FormError>{formErrors.location}</S.FormError>}
                </S.FormGroup>
                <S.FormGroup>
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
                </S.FormGroup>
              </S.FormGrid>
            </S.FormSection>

            <S.FormSection>
              <h3>Property Details</h3>
              <S.FormGrid>
                <S.FormGroup>
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
                  {formErrors.beds && <S.FormError>{formErrors.beds}</S.FormError>}
                </S.FormGroup>
                <S.FormGroup>
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
                  {formErrors.baths && <S.FormError>{formErrors.baths}</S.FormError>}
                </S.FormGroup>
                <S.FormGroup>
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
                  {formErrors.sqft && <S.FormError>{formErrors.sqft}</S.FormError>}
                </S.FormGroup>
                <S.FormGroup>
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
                  {formErrors.price && <S.FormError>{formErrors.price}</S.FormError>}
                </S.FormGroup>
              </S.FormGrid>
            </S.FormSection>

            <S.FormSection>
              <h3>Description</h3>
              <S.FormGroup fullWidth>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a detailed description of the property..."
                  rows={4}
                />
              </S.FormGroup>
            </S.FormSection>

            <S.FormSection>
              <h3>Amenities</h3>
              <S.AmenitiesGrid>
                {availableAmenities.map(amenity => (
                  <S.AmenityCheckbox key={amenity}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    <span>{amenity}</span>
                  </S.AmenityCheckbox>
                ))}
              </S.AmenitiesGrid>
            </S.FormSection>

            <S.FormSection>
              <h3>Images</h3>
              <S.ImagesSection>
                <S.ImageList>
                  {formData.images.map((img, index) => (
                    <S.ImageItem key={index}>
                      <img src={img} alt={`Property ${index + 1}`} />
                      <button 
                        type="button"
                        className="remove-image"
                        onClick={() => handleImageRemove(index)}
                      >
                        ×
                      </button>
                    </S.ImageItem>
                  ))}
                </S.ImageList>
                <S.ImageAddSection>
                  <input
                    type="text"
                    placeholder="Enter image URL (e.g., https://images.unsplash.com/...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className={formErrors.image ? 'error' : ''}
                  />
                  <S.AddImageBtn
                    type="button"
                    onClick={handleImageAdd}
                  >
                    Add Image
                  </S.AddImageBtn>
                </S.ImageAddSection>
                {formErrors.image && <S.FormError>{formErrors.image}</S.FormError>}
              </S.ImagesSection>
            </S.FormSection>

            <S.FormActions>
              <S.CancelBtn type="button" onClick={handleCancel}>
                Cancel
              </S.CancelBtn>
              <S.SubmitBtn type="submit">
                {editingProperty ? 'Update Property' : 'Create Property'}
              </S.SubmitBtn>
            </S.FormActions>
          </S.PropertyForm>
        )}
      </div>

      {showDeleteModal && (
        <S.DeleteModalOverlay onClick={() => setShowDeleteModal(null)}>
          <S.DeleteModal onClick={e => e.stopPropagation()}>
            <h3>Delete Property</h3>
            <p>Are you sure you want to delete "{showDeleteModal.title}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <S.ModalActions>
              <S.CancelBtn onClick={() => setShowDeleteModal(null)}>
                Cancel
              </S.CancelBtn>
              <S.DeleteBtn onClick={() => handleDelete(showDeleteModal.id)}>
                Delete
              </S.DeleteBtn>
            </S.ModalActions>
          </S.DeleteModal>
        </S.DeleteModalOverlay>
      )}
    </S.DashboardContainer>
  );
}
