import React from 'react';
import { useSelector } from 'react-redux';
import { X, User, Phone, Mail, Building2, MapPin, ChevronRight } from 'lucide-react';
import {
  OwnerDrawerOverlay,
  OwnerDrawer,
  DrawerHeader,
  OwnerAvatar,
  OwnerInfo,
  OwnerID,
  DrawerCloseButton,
  DrawerContent,
  DrawerSection,
  ContactList,
  ContactItem,
  ContactValue,
  PrimaryBadge,
  PropertiesList,
  PropertyItem,
  PropertyItemInfo,
  PropertyPNumber,
  PropertyProject,
  PropertyLocation,
  PropertyItemMeta,
  PropertyStatus,
  NoData
} from './OwnerDetailDrawer.styles';

interface Owner {
  id: string;
  name: string;
  contacts?: Array<{
    type: 'mobile' | 'phone' | 'email';
    value: string;
    isPrimary?: boolean;
  }>;
}

interface Property {
  pNumber: string;
  project: string;
  area: string;
  status: string;
}

interface OwnerDetailDrawerProps {
  owner: Owner | null;
  properties?: Property[];
  onClose: () => void;
  onPropertyClick?: (property: Property) => void;
}

const OwnerDetailDrawer: React.FC<OwnerDetailDrawerProps> = ({
  owner,
  properties = [],
  onClose,
  onPropertyClick
}) => {
  if (!owner) return null;

  const phones = owner.contacts?.filter(c => c.type === 'mobile' || c.type === 'phone') || [];
  const emails = owner.contacts?.filter(c => c.type === 'email') || [];

  return (
    <OwnerDrawerOverlay onClick={onClose} role="presentation">
      <OwnerDrawer onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Owner details: ${owner.name}`} onKeyDown={e => { if (e.key === 'Escape') onClose(); }}>
        <DrawerHeader>
          <OwnerAvatar>
            <User size={32} />
          </OwnerAvatar>
          <OwnerInfo>
            <h2>{owner.name}</h2>
            <OwnerID>{owner.id}</OwnerID>
          </OwnerInfo>
          <DrawerCloseButton onClick={onClose} type="button" aria-label="Close drawer">
            <X size={24} />
          </DrawerCloseButton>
        </DrawerHeader>

        <DrawerContent>
          <DrawerSection>
            <h3>
              <Phone size={16} /> Contact Numbers ({phones.length})
            </h3>
            <ContactList>
              {phones.length > 0 ? (
                phones.map((phone, idx) => (
                  <ContactItem key={phone.value ?? `phone-${idx}`} $isPrimary={phone.isPrimary}>
                    <ContactValue>{phone.value}</ContactValue>
                    {phone.isPrimary && <PrimaryBadge>Primary</PrimaryBadge>}
                  </ContactItem>
                ))
              ) : (
                <NoData>No phone numbers</NoData>
              )}
            </ContactList>
          </DrawerSection>

          <DrawerSection>
            <h3>
              <Mail size={16} /> Email Addresses ({emails.length})
            </h3>
            <ContactList>
              {emails.length > 0 ? (
                emails.map((email, idx) => (
                  <ContactItem key={email.value ?? `email-${idx}`}>
                    <ContactValue>{email.value}</ContactValue>
                  </ContactItem>
                ))
              ) : (
                <NoData>No email addresses</NoData>
              )}
            </ContactList>
          </DrawerSection>

          <DrawerSection>
            <h3>
              <Building2 size={16} /> Properties ({properties?.length || 0})
            </h3>
            <PropertiesList>
              {properties && properties.length > 0 ? (
                properties.map(property => (
                  <PropertyItem
                    key={property.pNumber}
                    onClick={() => onPropertyClick?.(property)}
                    type="button"
                  >
                    <PropertyItemInfo>
                      <PropertyPNumber>{property.pNumber}</PropertyPNumber>
                      <PropertyProject>{property.project}</PropertyProject>
                      <PropertyLocation>
                        <MapPin size={12} /> {property.area}
                      </PropertyLocation>
                    </PropertyItemInfo>
                    <PropertyItemMeta>
                      <PropertyStatus $status={property.status}>
                        {property.status}
                      </PropertyStatus>
                      <ChevronRight size={16} />
                    </PropertyItemMeta>
                  </PropertyItem>
                ))
              ) : (
                <NoData>No properties found</NoData>
              )}
            </PropertiesList>
          </DrawerSection>
        </DrawerContent>
      </OwnerDrawer>
    </OwnerDrawerOverlay>
  );
};

export default OwnerDetailDrawer;
