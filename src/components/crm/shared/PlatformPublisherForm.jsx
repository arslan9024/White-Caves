import React, { memo, useState, useCallback } from 'react';
import { 
  Upload, Check, AlertCircle, Globe, Building2, 
  Image, FileText, Send, ChevronDown, ChevronUp
} from 'lucide-react';
import './PlatformPublisher.css';

const PLATFORMS = [
  { id: 'bayut', name: 'Bayut', icon: '🏠', color: '#00A0E3', status: 'connected' },
  { id: 'property_finder', name: 'Property Finder', icon: '🔍', color: '#E4002B', status: 'connected' },
  { id: 'dubizzle', name: 'Dubizzle', icon: '📱', color: '#1A1A2E', status: 'pending' }
];

const PROPERTY_FIELDS = {
  common: [
    { id: 'title', label: 'Property Title', type: 'text', required: true },
    { id: 'description', label: 'Description', type: 'textarea', required: true },
    { id: 'price', label: 'Price (AED)', type: 'number', required: true },
    { id: 'bedrooms', label: 'Bedrooms', type: 'select', options: ['Studio', '1', '2', '3', '4', '5+'], required: true },
    { id: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4', '5+'], required: true },
    { id: 'area', label: 'Area (sqft)', type: 'number', required: true },
    { id: 'location', label: 'Location', type: 'text', required: true },
    { id: 'propertyType', label: 'Property Type', type: 'select', options: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio'], required: true },
    { id: 'purpose', label: 'Purpose', type: 'select', options: ['For Sale', 'For Rent'], required: true }
  ],
  bayut: [
    { id: 'permitNumber', label: 'Permit Number', type: 'text', required: true },
    { id: 'brokerORN', label: 'Broker ORN', type: 'text', required: true }
  ],
  property_finder: [
    { id: 'referenceNumber', label: 'Reference Number', type: 'text', required: true }
  ],
  dubizzle: [
    { id: 'adType', label: 'Ad Type', type: 'select', options: ['Basic', 'Featured', 'Premium'], required: false }
  ]
};

const PlatformPublisherForm = memo(({ 
  property,
  onPublish,
  onSaveDraft
}) => {
  const [formData, setFormData] = useState(property || {});
  const [selectedPlatforms, setSelectedPlatforms] = useState(['bayut', 'property_finder']);
  const [publishing, setPublishing] = useState({});
  const [publishResults, setPublishResults] = useState({});
  const [expandedSections, setExpandedSections] = useState({ common: true });
  
  const handleFieldChange = useCallback((fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  }, []);
  
  const togglePlatform = useCallback((platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  }, []);
  
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);
  
  const handlePublish = useCallback(async () => {
    for (const platformId of selectedPlatforms) {
      setPublishing(prev => ({ ...prev, [platformId]: true }));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPublishing(prev => ({ ...prev, [platformId]: false }));
      setPublishResults(prev => ({ 
        ...prev, 
        [platformId]: { success: true, message: 'Published successfully' }
      }));
    }
    
    if (onPublish) {
      onPublish(formData, selectedPlatforms);
    }
  }, [formData, selectedPlatforms, onPublish]);
  
  const renderField = (field) => {
    if (field.type === 'textarea') {
      return (
        <textarea
          value={formData[field.id] || ''}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          rows={4}
        />
      );
    }
    
    if (field.type === 'select') {
      return (
        <select
          value={formData[field.id] || ''}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
        >
          <option value="">Select {field.label}</option>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    
    return (
      <input
        type={field.type}
        value={formData[field.id] || ''}
        onChange={(e) => handleFieldChange(field.id, e.target.value)}
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    );
  };
  
  return (
    <div className="platform-publisher">
      <div className="publisher-header">
        <div className="header-info">
          <Globe size={24} />
          <div>
            <h3>Multi-Platform Publisher</h3>
            <p>Publish your property to multiple portals at once</p>
          </div>
        </div>
      </div>
      
      <div className="platform-selector">
        <h4>Select Platforms</h4>
        <div className="platforms-grid">
          {PLATFORMS.map(platform => (
            <button
              key={platform.id}
              className={`platform-card ${selectedPlatforms.includes(platform.id) ? 'selected' : ''} ${platform.status}`}
              onClick={() => togglePlatform(platform.id)}
              disabled={platform.status !== 'connected'}
            >
              <span className="platform-icon">{platform.icon}</span>
              <span className="platform-name">{platform.name}</span>
              {selectedPlatforms.includes(platform.id) && (
                <Check size={14} className="check-icon" />
              )}
              {platform.status !== 'connected' && (
                <span className="status-badge">Setup Required</span>
              )}
              {publishResults[platform.id] && (
                <span className={`publish-status ${publishResults[platform.id].success ? 'success' : 'error'}`}>
                  {publishResults[platform.id].success ? <Check size={12} /> : <AlertCircle size={12} />}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="form-sections">
        <div className="form-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('common')}
          >
            <FileText size={18} />
            <span>Property Details</span>
            {expandedSections.common ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.common && (
            <div className="section-content">
              <div className="fields-grid">
                {PROPERTY_FIELDS.common.map(field => (
                  <div key={field.id} className={`form-field ${field.type === 'textarea' ? 'full-width' : ''}`}>
                    <label>
                      {field.label}
                      {field.required && <span className="required">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {selectedPlatforms.map(platformId => {
          const platformFields = PROPERTY_FIELDS[platformId];
          if (!platformFields || platformFields.length === 0) return null;
          
          const platform = PLATFORMS.find(p => p.id === platformId);
          
          return (
            <div key={platformId} className="form-section platform-specific">
              <button 
                className="section-header"
                onClick={() => toggleSection(platformId)}
              >
                <span className="platform-icon-small">{platform?.icon}</span>
                <span>{platform?.name} Specific Fields</span>
                {expandedSections[platformId] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedSections[platformId] && (
                <div className="section-content">
                  <div className="fields-grid">
                    {platformFields.map(field => (
                      <div key={field.id} className="form-field">
                        <label>
                          {field.label}
                          {field.required && <span className="required">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="form-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('images')}
          >
            <Image size={18} />
            <span>Property Images</span>
            {expandedSections.images ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.images && (
            <div className="section-content">
              <div className="image-upload-zone">
                <Upload size={32} />
                <p>Drag and drop images here or click to browse</p>
                <span>Supports JPG, PNG up to 10MB each</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="publisher-actions">
        <button className="btn secondary" onClick={onSaveDraft}>
          Save as Draft
        </button>
        <button 
          className="btn primary"
          onClick={handlePublish}
          disabled={selectedPlatforms.length === 0 || Object.values(publishing).some(p => p)}
        >
          {Object.values(publishing).some(p => p) ? (
            <>Publishing...</>
          ) : (
            <><Send size={16} /> Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}</>
          )}
        </button>
      </div>
    </div>
  );
});

PlatformPublisherForm.displayName = 'PlatformPublisherForm';
export default PlatformPublisherForm;
