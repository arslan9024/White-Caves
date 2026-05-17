import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, MapPin, Ruler, DollarSign, Image, FileText, ChevronRight, ChevronLeft,
  Check, Upload, X, Plus, Building2, Castle, Hotel, Warehouse, LandPlot,
  Bed, Bath, Car, Sofa, Waves, Dumbbell, Shield, Wifi, Sun, TreePine
} from 'lucide-react';
import './AgentListingForm.css';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Home },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Specifications', icon: Ruler },
  { id: 4, title: 'Pricing', icon: DollarSign },
  { id: 5, title: 'Media', icon: Image },
  { id: 6, title: 'Legal & Marketing', icon: FileText },
];

const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Apartment', icon: Building2 },
  { id: 'villa', name: 'Villa', icon: Castle },
  { id: 'townhouse', name: 'Townhouse', icon: Home },
  { id: 'penthouse', name: 'Penthouse', icon: Hotel },
  { id: 'duplex', name: 'Duplex', icon: Building2 },
  { id: 'triplex', name: 'Triplex', icon: Building2 },
  { id: 'office', name: 'Office', icon: Warehouse },
  { id: 'retail', name: 'Retail', icon: Warehouse },
  { id: 'warehouse', name: 'Warehouse', icon: Warehouse },
  { id: 'land', name: 'Land', icon: LandPlot },
];

const DUBAI_COMMUNITIES = [
  'Downtown Dubai', 'Palm Jumeirah', 'Dubai Marina', 'Emirates Hills',
  'Dubai Hills Estate', 'Jumeirah Bay Island', 'Business Bay', 'Arabian Ranches',
  'Al Barari', 'Bluewaters Island', 'City Walk', 'Dubai Creek Harbour',
  'JLT', 'DIFC', 'Jumeirah Golf Estates', 'MBR City'
];

const AMENITIES = [
  { id: 'pool', name: 'Swimming Pool', icon: Waves },
  { id: 'gym', name: 'Gym', icon: Dumbbell },
  { id: 'security', name: '24/7 Security', icon: Shield },
  { id: 'parking', name: 'Covered Parking', icon: Car },
  { id: 'wifi', name: 'High-Speed WiFi', icon: Wifi },
  { id: 'balcony', name: 'Balcony/Terrace', icon: Sun },
  { id: 'garden', name: 'Private Garden', icon: TreePine },
  { id: 'furnished', name: 'Furnished', icon: Sofa },
];

const VIEWS = ['Sea View', 'City View', 'Golf View', 'Park View', 'Lake View', 'Marina View', 'Garden View'];

const COMPLETION_STATUS = [
  { id: 'ready', name: 'Ready to Move' },
  { id: 'off_plan', name: 'Off-Plan' },
  { id: 'under_construction', name: 'Under Construction' },
];

const FURNISH_TYPES = [
  { id: 'unfurnished', name: 'Unfurnished' },
  { id: 'furnished', name: 'Furnished' },
  { id: 'partially', name: 'Partially Furnished' },
];

export default function AgentListingForm({ onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    completionStatus: 'ready',
    furnishType: 'unfurnished',
    community: '',
    subCommunity: '',
    buildingName: '',
    floorNumber: '',
    unitNumber: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    builtUpArea: '',
    plotSize: '',
    parkingSpaces: '',
    yearBuilt: '',
    developer: '',
    amenities: [],
    views: [],
    listingType: 'sale',
    salePrice: '',
    rentPrice: '',
    rentFrequency: 'yearly',
    serviceCharges: '',
    images: [],
    floorPlans: [],
    videoUrl: '',
    virtualTourUrl: '',
    titleDeedNumber: '',
    reraPermitNumber: '',
    ownershipType: 'freehold',
    marketingPackage: 'premium',
    featuredLevel: 5,
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    
    if (onClose) onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step-content">
            <h3 className="step-title">Property Basic Information</h3>
            
            <div className="form-group">
              <label>Property Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
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
                  onChange={(e) => updateField('completionStatus', e.target.value)}
                  className="form-select"
                >
                  {COMPLETION_STATUS.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Furnishing</label>
                <select
                  value={formData.furnishType}
                  onChange={(e) => updateField('furnishType', e.target.value)}
                  className="form-select"
                >
                  {FURNISH_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the property features, highlights, and unique selling points..."
                className="form-textarea"
                rows={5}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step-content">
            <h3 className="step-title">Property Location</h3>
            
            <div className="form-group">
              <label>Community *</label>
              <select
                value={formData.community}
                onChange={(e) => updateField('community', e.target.value)}
                className="form-select"
              >
                <option value="">Select Community</option>
                {DUBAI_COMMUNITIES.map(community => (
                  <option key={community} value={community}>{community}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sub-Community</label>
                <input
                  type="text"
                  value={formData.subCommunity}
                  onChange={(e) => updateField('subCommunity', e.target.value)}
                  placeholder="e.g., Frond A"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Building Name</label>
                <input
                  type="text"
                  value={formData.buildingName}
                  onChange={(e) => updateField('buildingName', e.target.value)}
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
                  onChange={(e) => updateField('floorNumber', e.target.value)}
                  placeholder="e.g., 25"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Unit Number</label>
                <input
                  type="text"
                  value={formData.unitNumber}
                  onChange={(e) => updateField('unitNumber', e.target.value)}
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
                onChange={(e) => updateField('address', e.target.value)}
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

      case 3:
        return (
          <div className="form-step-content">
            <h3 className="step-title">Property Specifications</h3>
            
            <div className="form-row four-col">
              <div className="form-group">
                <label><Bed size={16} /> Bedrooms *</label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => updateField('bedrooms', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="studio">Studio</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label><Bath size={16} /> Bathrooms *</label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => updateField('bathrooms', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label><Ruler size={16} /> Built-up Area (sqft) *</label>
                <input
                  type="number"
                  value={formData.builtUpArea}
                  onChange={(e) => updateField('builtUpArea', e.target.value)}
                  placeholder="e.g., 2500"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label><LandPlot size={16} /> Plot Size (sqft)</label>
                <input
                  type="number"
                  value={formData.plotSize}
                  onChange={(e) => updateField('plotSize', e.target.value)}
                  placeholder="For villas/land"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Car size={16} /> Parking Spaces</label>
                <input
                  type="number"
                  value={formData.parkingSpaces}
                  onChange={(e) => updateField('parkingSpaces', e.target.value)}
                  placeholder="e.g., 2"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Year Built</label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => updateField('yearBuilt', e.target.value)}
                  placeholder="e.g., 2022"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Developer</label>
                <input
                  type="text"
                  value={formData.developer}
                  onChange={(e) => updateField('developer', e.target.value)}
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

      case 4:
        return (
          <div className="form-step-content">
            <h3 className="step-title">Pricing Details</h3>
            
            <div className="form-group">
              <label>Listing Type *</label>
              <div className="listing-type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${formData.listingType === 'sale' ? 'active' : ''}`}
                  onClick={() => updateField('listingType', 'sale')}
                >
                  For Sale
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.listingType === 'rent' ? 'active' : ''}`}
                  onClick={() => updateField('listingType', 'rent')}
                >
                  For Rent
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.listingType === 'both' ? 'active' : ''}`}
                  onClick={() => updateField('listingType', 'both')}
                >
                  Both
                </button>
              </div>
            </div>

            {(formData.listingType === 'sale' || formData.listingType === 'both') && (
              <div className="form-group">
                <label>Sale Price (AED) *</label>
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => updateField('salePrice', e.target.value)}
                  placeholder="e.g., 15000000"
                  className="form-input price-input"
                />
                {formData.salePrice && formData.builtUpArea && (
                  <div className="price-calc">
                    Price per sqft: AED {Math.round(formData.salePrice / formData.builtUpArea).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {(formData.listingType === 'rent' || formData.listingType === 'both') && (
              <div className="form-row">
                <div className="form-group">
                  <label>Rent Price (AED) *</label>
                  <input
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => updateField('rentPrice', e.target.value)}
                    placeholder="e.g., 250000"
                    className="form-input price-input"
                  />
                </div>
                <div className="form-group">
                  <label>Rent Frequency</label>
                  <select
                    value={formData.rentFrequency}
                    onChange={(e) => updateField('rentFrequency', e.target.value)}
                    className="form-select"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Annual Service Charges (AED)</label>
              <input
                type="number"
                value={formData.serviceCharges}
                onChange={(e) => updateField('serviceCharges', e.target.value)}
                placeholder="e.g., 50000"
                className="form-input"
              />
            </div>
          </div>
        );

      case 5:
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
                  onChange={(e) => updateField('videoUrl', e.target.value)}
                  placeholder="YouTube or Vimeo link"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Virtual Tour URL</label>
                <input
                  type="url"
                  value={formData.virtualTourUrl}
                  onChange={(e) => updateField('virtualTourUrl', e.target.value)}
                  placeholder="Matterport or 3D tour link"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-step-content">
            <h3 className="step-title">Legal & Marketing Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Title Deed Number</label>
                <input
                  type="text"
                  value={formData.titleDeedNumber}
                  onChange={(e) => updateField('titleDeedNumber', e.target.value)}
                  placeholder="For ready properties"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>RERA Permit Number *</label>
                <input
                  type="text"
                  value={formData.reraPermitNumber}
                  onChange={(e) => updateField('reraPermitNumber', e.target.value)}
                  placeholder="Required for listing"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ownership Type</label>
              <div className="radio-group">
                {['freehold', 'leasehold', 'usufruct'].map(type => (
                  <label key={type} className="radio-item">
                    <input
                      type="radio"
                      name="ownershipType"
                      value={type}
                      checked={formData.ownershipType === type}
                      onChange={(e) => updateField('ownershipType', e.target.value)}
                    />
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Marketing Package</label>
              <div className="package-grid">
                {[
                  { id: 'basic', name: 'Basic', price: 'Free', features: ['Standard listing', 'Basic visibility'] },
                  { id: 'premium', name: 'Premium', price: 'AED 500', features: ['Featured badge', 'Priority ranking', 'Social promotion'] },
                  { id: 'luxury', name: 'Luxury', price: 'AED 1,500', features: ['All Premium features', 'Virtual staging', 'Drone footage'] },
                  { id: 'platinum', name: 'Platinum', price: 'AED 5,000', features: ['All Luxury features', 'PR coverage', 'International syndication'] },
                ].map(pkg => (
                  <button
                    key={pkg.id}
                    type="button"
                    className={`package-card ${formData.marketingPackage === pkg.id ? 'selected' : ''}`}
                    onClick={() => updateField('marketingPackage', pkg.id)}
                  >
                    <div className="package-header">
                      <span className="package-name">{pkg.name}</span>
                      <span className="package-price">{pkg.price}</span>
                    </div>
                    <ul className="package-features">
                      {pkg.features.map((f, i) => (
                        <li key={i}><Check size={14} /> {f}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Featured Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.featuredLevel}
                onChange={(e) => updateField('featuredLevel', parseInt(e.target.value))}
                className="form-range"
              />
              <div className="range-labels">
                <span>Standard</span>
                <span>Level: {formData.featuredLevel}</span>
                <span>Top Featured</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="agent-listing-form">
      <div className="form-header">
        <h2>Create Property Listing</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        )}
      </div>

      <div className="form-progress">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              className={`progress-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="step-icon">
                {currentStep > step.id ? <Check size={18} /> : <step.icon size={18} />}
              </div>
              <span className="step-label">{step.title}</span>
            </button>
            {index < STEPS.length - 1 && <div className="progress-line" />}
          </React.Fragment>
        ))}
      </div>

      <div className="form-body">
        {renderStepContent()}
      </div>

      <div className="form-footer">
        <button
          className="btn-secondary"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {currentStep < 6 ? (
          <button className="btn-primary" onClick={nextStep}>
            Next
            <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn-submit" onClick={handleSubmit}>
            <Check size={18} />
            Submit Listing
          </button>
        )}
      </div>
    </div>
  );
}
