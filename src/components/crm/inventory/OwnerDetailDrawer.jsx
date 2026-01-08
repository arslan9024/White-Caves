import React from 'react';
import { useSelector } from 'react-redux';
import { X, User, Phone, Mail, Building2, MapPin, ChevronRight } from 'lucide-react';
import './OwnerDetailDrawer.css';

const OwnerDetailDrawer = ({ owner, properties, onClose, onPropertyClick }) => {
  if (!owner) return null;

  const phones = owner.contacts?.filter(c => c.type === 'mobile' || c.type === 'phone') || [];
  const emails = owner.contacts?.filter(c => c.type === 'email') || [];

  return (
    <div className="owner-drawer-overlay" onClick={onClose}>
      <div className="owner-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="owner-avatar">
            <User size={32} />
          </div>
          <div className="owner-info">
            <h2>{owner.name}</h2>
            <span className="owner-id">{owner.id}</span>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="drawer-content">
          <section className="drawer-section">
            <h3><Phone size={16} /> Contact Numbers ({phones.length})</h3>
            <div className="contact-list">
              {phones.length > 0 ? phones.map((phone, idx) => (
                <div key={idx} className={`contact-item ${phone.isPrimary ? 'primary' : ''}`}>
                  <span className="contact-value">{phone.value}</span>
                  {phone.isPrimary && <span className="primary-badge">Primary</span>}
                </div>
              )) : (
                <p className="no-data">No phone numbers</p>
              )}
            </div>
          </section>

          <section className="drawer-section">
            <h3><Mail size={16} /> Email Addresses ({emails.length})</h3>
            <div className="contact-list">
              {emails.length > 0 ? emails.map((email, idx) => (
                <div key={idx} className="contact-item">
                  <span className="contact-value">{email.value}</span>
                </div>
              )) : (
                <p className="no-data">No email addresses</p>
              )}
            </div>
          </section>

          <section className="drawer-section">
            <h3><Building2 size={16} /> Properties ({properties?.length || 0})</h3>
            <div className="properties-list">
              {properties?.length > 0 ? properties.map(property => (
                <button
                  key={property.pNumber}
                  className="property-item"
                  onClick={() => onPropertyClick?.(property)}
                >
                  <div className="property-item-info">
                    <span className="property-pnumber">{property.pNumber}</span>
                    <span className="property-project">{property.project}</span>
                    <span className="property-location">
                      <MapPin size={12} /> {property.area}
                    </span>
                  </div>
                  <div className="property-item-meta">
                    <span className={`property-status status-${property.status?.toLowerCase()}`}>
                      {property.status}
                    </span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              )) : (
                <p className="no-data">No properties found</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetailDrawer;
