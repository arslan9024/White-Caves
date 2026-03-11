import React from 'react';
import { 
  Home, MapPin, Building2, Layers, Eye, DollarSign, 
  FileText, Hash, Calendar, Phone, Mail, User, Zap
} from 'lucide-react';
import {
  PropertyDetailsCardContainer,
  CardHeader,
  PropertyId,
  StatusBadge,
  SectionsContainer,
  DetailsSection,
  SectionTitle,
  FieldsGrid,
  FieldContent,
  FieldLabel,
  FieldValue,
  OwnersSection,
  OwnersList,
  OwnerItem,
  OwnerAvatar,
  OwnerInfo,
  OwnerName,
  OwnerContacts,
  ContactBadge,
  MoreContacts
} from './PropertyDetailsCard.styles';

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

const FieldItemRenderer = ({ config, value }) => {
  const Icon = config.icon;
  const displayValue = formatValue(value, config.format);
  const isEmpty = displayValue === '-';
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 12px',
      background: 'var(--bg-secondary)',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      opacity: isEmpty ? '0.5' : '1'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        background: 'rgba(220, 38, 38, 0.1)',
        borderRadius: '6px',
        color: 'var(--primary)',
        flexShrink: 0
      }}>
        <Icon size={14} />
      </div>
      <FieldContent>
        <FieldLabel>{config.label}</FieldLabel>
        <FieldValue>{displayValue}</FieldValue>
      </FieldContent>
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
      <DetailsSection key={section.id}>
        <SectionTitle>{section.label}</SectionTitle>
        <FieldsGrid>
          {fields.map(config => (
            <FieldItemRenderer 
              key={config.key} 
              config={config} 
              value={property[config.key]} 
            />
          ))}
        </FieldsGrid>
      </DetailsSection>
    );
  };

  return (
    <PropertyDetailsCardContainer>
      <CardHeader>
        <PropertyId>
          <Hash size={18} />
          <span>{property.pNumber || 'N/A'}</span>
        </PropertyId>
        {property.status && (
          <StatusBadge $status={property.status.toLowerCase()}>
            {property.status}
          </StatusBadge>
        )}
      </CardHeader>

      <SectionsContainer>
        {SECTIONS.map(renderSection)}
      </SectionsContainer>

      {owners.length > 0 && (
        <OwnersSection>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '12px', marginTop: 0 }}>
            <User size={16} />
            Owners ({owners.length})
          </h4>
          <OwnersList>
            {owners.map((owner, idx) => (
              <OwnerItem 
                key={owner.id || idx}
                onClick={() => onOwnerClick?.(owner)}
              >
                <OwnerAvatar>
                  {(owner.name || 'U').charAt(0)}
                </OwnerAvatar>
                <OwnerInfo>
                  <OwnerName>{owner.name || 'Unknown'}</OwnerName>
                  {owner.contacts?.length > 0 && (
                    <OwnerContacts>
                      {owner.contacts.slice(0, 2).map((c, i) => (
                        <ContactBadge key={i}>
                          {c.type === 'email' ? <Mail size={10} /> : <Phone size={10} />}
                          {c.value}
                        </ContactBadge>
                      ))}
                      {owner.contacts.length > 2 && (
                        <MoreContacts>+{owner.contacts.length - 2}</MoreContacts>
                      )}
                    </OwnerContacts>
                  )}
                </OwnerInfo>
              </OwnerItem>
            ))}
          </OwnersList>
        </OwnersSection>
      )}
    </PropertyDetailsCardContainer>
  );
};

export default PropertyDetailsCard;
