import React from 'react';
import { 
  Home, MapPin, Building2, Layers, Eye, DollarSign, 
  FileText, Hash, Calendar, Phone, Mail, User, Zap
} from 'lucide-react';
import './PropertyDetailsCard.css';

const FIELD_CONFIGS = [
  { key: 'pNumber', label: 'P-Number', icon: Hash, section: 'identification' },
  { key: 'plotNumber', label: 'Plot Number', icon: Hash, section: 'identification' },
  { key: 'plotNo', label: 'Plot No', icon: Hash, section: 'identification' },
  { key: 'sd', label: 'SD', icon: FileText, section: 'identification' },
  { key: 'registration', label: 'Registration', icon: FileText, section: 'identification' },
  { key: 'municipalityNo', label: 'Municipality No', icon: FileText, section: 'identification' },
  
  { key: 'area', label: 'Area', icon: MapPin, section: 'location' },
  { key: 'project', label: 'Project', icon: Building2, section: 'location' },
  { key: 'cluster', label: 'Cluster', icon: Layers, section: 'location' },
  { key: 'masterProject', label: 'Master Project', icon: Building2, section: 'location' },
  { key: 'building', label: 'Building', icon: Building2, section: 'location' },
  { key: 'unitNumber', label: 'Unit Number', icon: Home, section: 'location' },
  { key: 'floor', label: 'Floor', icon: Layers, section: 'location' },
  
  { key: 'layout', label: 'Layout', icon: Layers, section: 'specifications' },
  { key: 'view', label: 'View', icon: Eye, section: 'specifications' },
  { key: 'rooms', label: 'Rooms', icon: Home, section: 'specifications' },
  { key: 'actualArea', label: 'Actual Area', icon: Layers, section: 'specifications' },
  
  { key: 'status', label: 'Status', icon: FileText, section: 'status' },
  { key: 'askingPrice', label: 'Asking Price', icon: DollarSign, section: 'status', format: 'currency' },
  
  { key: 'otp', label: 'OTP (Dubai REST)', icon: FileText, section: 'utilities' },
  { key: 'dewaPremiseNumber', label: 'DEWA Premise', icon: Zap, section: 'utilities' }
];

const SECTIONS = [
  { id: 'identification', label: 'Identification' },
  { id: 'location', label: 'Location' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'status', label: 'Status & Pricing' },
  { id: 'utilities', label: 'Utilities' }
];

const formatValue = (value, format) => {
  if (value === null || value === undefined || value === '' || value === '.') {
    return '-';
  }
  if (format === 'currency' && typeof value === 'number') {
    return new Intl.NumberFormat('en-AE', { 
      style: 'currency', 
      currency: 'AED',
      minimumFractionDigits: 0 
    }).format(value);
  }
  return String(value);
};

const FieldItem = ({ config, value }) => {
  const Icon = config.icon;
  const displayValue = formatValue(value, config.format);
  
  return (
    <div className={`field-item ${displayValue === '-' ? 'empty' : ''}`}>
      <div className="field-icon">
        <Icon size={14} />
      </div>
      <div className="field-content">
        <span className="field-label">{config.label}</span>
        <span className="field-value">{displayValue}</span>
      </div>
    </div>
  );
};

const PropertyDetailsCard = ({ property, owners = [], onOwnerClick, compact = false }) => {
  if (!property) return null;

  const renderSection = (section) => {
    const fields = FIELD_CONFIGS.filter(f => f.section === section.id);
    const hasValues = fields.some(f => {
      const val = property[f.key];
      return val !== null && val !== undefined && val !== '' && val !== '.';
    });
    
    if (!hasValues && compact) return null;
    
    return (
      <div key={section.id} className="details-section">
        <h4 className="section-title">{section.label}</h4>
        <div className="fields-grid">
          {fields.map(config => (
            <FieldItem 
              key={config.key} 
              config={config} 
              value={property[config.key]} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`property-details-card ${compact ? 'compact' : ''}`}>
      <div className="card-header">
        <div className="property-id">
          <Hash size={18} />
          <span>{property.pNumber || 'N/A'}</span>
        </div>
        {property.status && (
          <span className={`status-badge ${property.status.toLowerCase()}`}>
            {property.status}
          </span>
        )}
      </div>

      <div className="sections-container">
        {SECTIONS.map(renderSection)}
      </div>

      {owners.length > 0 && (
        <div className="owners-section">
          <h4 className="section-title">
            <User size={16} />
            Owners ({owners.length})
          </h4>
          <div className="owners-list">
            {owners.map((owner, idx) => (
              <div 
                key={owner.id || idx} 
                className="owner-item"
                onClick={() => onOwnerClick?.(owner)}
              >
                <div className="owner-avatar">
                  {(owner.name || 'U').charAt(0)}
                </div>
                <div className="owner-info">
                  <span className="owner-name">{owner.name || 'Unknown'}</span>
                  {owner.contacts?.length > 0 && (
                    <div className="owner-contacts">
                      {owner.contacts.slice(0, 2).map((c, i) => (
                        <span key={i} className="contact-badge">
                          {c.type === 'email' ? <Mail size={10} /> : <Phone size={10} />}
                          {c.value}
                        </span>
                      ))}
                      {owner.contacts.length > 2 && (
                        <span className="more-contacts">+{owner.contacts.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsCard;
