import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  Share2,
  Building,
  Car,
  Waves,
  Dumbbell,
  Shield,
  Trees,
  Wifi,
  Snowflake,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PropertyImageSlider from './PropertyImageSlider';
import { formatPrice } from '../../../utils';
import { Config } from '../../../config/constants';
import { authFetch } from '../../../utils/authFetch';
import './PropertyDetailModal.css';

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  Security: Shield,
  Garden: Trees,
  WiFi: Wifi,
  AC: Snowflake,
  Concierge: Building,
  'Beach Access': Waves,
  Cinema: Building,
};

export interface PropertyData {
  id?: string;
  title: string;
  location: string;
  price: number;
  priceType?: 'yearly' | string;
  pricePerSqft?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  yearBuilt?: string | number;
  type: string;
  purpose?: 'buy' | 'rent' | string;
  featured?: boolean;
  description?: string;
  images?: string[];
  image?: string;
  amenities?: string[];
}

export interface PropertyDetailModalProps {
  property: PropertyData | null;
  onClose: () => void;
  onContact?: (property: PropertyData) => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

// Time slots: value is 24-hour HH:MM for ISO construction, label is display text
const TIME_SLOTS = [
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
] as const;

export default function PropertyDetailModal({
  property,
  onClose,
  onContact: _onContact,
  onFavorite,
  isFavorite,
}: PropertyDetailModalProps): React.ReactElement | null {
  const [activeTab, setActiveTab] = useState<string>('overview');
  // Phase 35: Viewing booking form state
  const [viewingDate, setViewingDate] = useState<string>('');
  const [viewingTime, setViewingTime] = useState<string>('');
  const [viewingStatus, setViewingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [viewingError, setViewingError] = useState<string>('');

  if (!property) return null;

  // Use imported formatPrice utility (no local shadow)

  const handleWhatsApp = (): void => {
    const message = `Hi, I'm interested in the property: ${property.title} in ${property.location}`;
    window.open(
      `https://wa.me/${Config.COMPANY.WHATSAPP}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCall = (): void => {
    window.open(`tel:${Config.COMPANY.PHONE.replace(/\s/g, '')}`, '_self');
  };

  const handleEmail = (): void => {
    const subject = `Inquiry: ${property.title}`;
    const body = `Hi,\n\nI'm interested in the property: ${property.title} located in ${property.location}.\n\nPlease contact me with more details.\n\nThank you.`;
    window.open(
      `mailto:${Config.COMPANY.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_self'
    );
  };

  // Phase 35: Wire "Request Viewing" to POST /api/viewings (auth) or WhatsApp fallback (public)
  const handleRequestViewing = async (): Promise<void> => {
    if (!viewingDate) {
      setViewingError('Please select a date.');
      return;
    }
    if (!viewingTime) {
      setViewingError('Please select a preferred time.');
      return;
    }

    setViewingStatus('submitting');
    setViewingError('');

    try {
      const token = localStorage.getItem('token');

      if (token && property.id) {
        // Authenticated path → create a formal viewing record
        const scheduledAt = `${viewingDate}T${viewingTime}:00.000Z`;
        const res = await authFetch('/api/viewings', {
          method: 'POST',
          body: JSON.stringify({ propertyId: property.id, scheduledAt, type: 'in_person' }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(data.message ?? `Request failed (${res.status})`);
        }
      } else {
        // Public / unauthenticated path → WhatsApp pre-filled message
        const dateLabel = new Date(viewingDate + 'T12:00:00').toLocaleDateString('en-AE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const timeLabel = TIME_SLOTS.find(s => s.value === viewingTime)?.label ?? viewingTime;
        const msg = `Hi, I'd like to view ${property.title} in ${property.location} on ${dateLabel} at ${timeLabel}. Please confirm availability.`;
        window.open(
          `https://wa.me/${Config.COMPANY.WHATSAPP}?text=${encodeURIComponent(msg)}`,
          '_blank',
          'noopener,noreferrer'
        );
      }

      setViewingStatus('success');
    } catch (err) {
      setViewingStatus('error');
      setViewingError(
        err instanceof Error ? err.message : 'Could not submit request. Please try again.'
      );
    }
  };

  const tabs: Array<{ id: string; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' },
    { id: 'floorplan', label: 'Floor Plan' },
  ];

  return (
    <div
      className="property-detail-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Property details"
    >
      <div className="property-detail-modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-gallery">
          <PropertyImageSlider
            images={property.images || [property.image || '']}
            title={property.title}
            onFavorite={onFavorite}
            isFavorite={isFavorite}
            showThumbnails={true}
            aspectRatio="16/9"
          />

          <div className="property-badges">
            {property.featured && <span className="badge featured">Featured</span>}
            <span className={`badge purpose ${property.purpose}`}>
              {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="badge type">{property.type}</span>
          </div>
        </div>

        <div className="modal-content">
          <div className="content-main">
            <div className="property-header">
              <div className="header-info">
                <h1>{property.title}</h1>
                <p className="location">
                  <MapPin size={16} />
                  {property.location}, Dubai
                </p>
              </div>
              <div className="header-price">
                <span className="price">
                  {formatPrice(property.price, { priceType: property.priceType })}
                </span>
                {property.pricePerSqft && (
                  <span className="price-sqft">AED {property.pricePerSqft}/sqft</span>
                )}
              </div>
            </div>

            <div className="property-specs-bar">
              <div className="spec-item">
                <Bed size={20} />
                <div className="spec-info">
                  <span className="spec-value">{property.beds}</span>
                  <span className="spec-label">Bedrooms</span>
                </div>
              </div>
              <div className="spec-item">
                <Bath size={20} />
                <div className="spec-info">
                  <span className="spec-value">{property.baths}</span>
                  <span className="spec-label">Bathrooms</span>
                </div>
              </div>
              <div className="spec-item">
                <Maximize size={20} />
                <div className="spec-info">
                  <span className="spec-value">{property.sqft?.toLocaleString()}</span>
                  <span className="spec-label">Sq.Ft</span>
                </div>
              </div>
              <div className="spec-item">
                <Calendar size={20} />
                <div className="spec-info">
                  <span className="spec-value">{property.yearBuilt || '2023'}</span>
                  <span className="spec-label">Year Built</span>
                </div>
              </div>
            </div>

            <div className="content-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <h3>Property Description</h3>
                  <p className="description">
                    {property.description ||
                      `Experience luxury living at its finest in this stunning ${property.type.toLowerCase()} located in the prestigious ${property.location} area. This exceptional property offers ${property.beds} spacious bedrooms, ${property.baths} modern bathrooms, and ${property.sqft?.toLocaleString()} sq.ft of premium living space.

The property features high-end finishes throughout, floor-to-ceiling windows with breathtaking views, a gourmet kitchen with top-of-the-line appliances, and elegant living spaces perfect for both relaxation and entertaining.

Residents will enjoy world-class amenities and the convenience of being close to Dubai's finest dining, shopping, and entertainment destinations.`}
                  </p>

                  <h3>Key Features</h3>
                  <ul className="features-list">
                    <li>
                      <ChevronRight size={14} /> Premium location in {property.location}
                    </li>
                    <li>
                      <ChevronRight size={14} /> High-quality finishes and materials
                    </li>
                    <li>
                      <ChevronRight size={14} /> Spacious {property.sqft?.toLocaleString()} sq.ft
                      layout
                    </li>
                    <li>
                      <ChevronRight size={14} /> Modern kitchen with premium appliances
                    </li>
                    <li>
                      <ChevronRight size={14} /> Floor-to-ceiling windows
                    </li>
                    <li>
                      <ChevronRight size={14} /> 24/7 security and concierge services
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div className="amenities-tab">
                  <h3>Property Amenities</h3>
                  <div className="amenities-grid">
                    {property.amenities?.map(amenity => {
                      // eslint-disable-next-line security/detect-object-injection
                      const IconComponent = AMENITY_ICONS[amenity] || Building;
                      return (
                        <div key={amenity} className="amenity-item">
                          <IconComponent size={20} />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>

                  <h3>Building Amenities</h3>
                  <div className="amenities-grid">
                    <div className="amenity-item">
                      <Shield size={20} />
                      <span>24/7 Security</span>
                    </div>
                    <div className="amenity-item">
                      <Car size={20} />
                      <span>Covered Parking</span>
                    </div>
                    <div className="amenity-item">
                      <Dumbbell size={20} />
                      <span>Fitness Center</span>
                    </div>
                    <div className="amenity-item">
                      <Waves size={20} />
                      <span>Swimming Pool</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="location-tab">
                  <h3>Location</h3>
                  <p className="location-desc">
                    Located in {property.location}, one of Dubai&apos;s most sought-after
                    neighborhoods. The property offers easy access to major highways, world-class
                    shopping destinations, fine dining restaurants, and top international schools.
                  </p>
                  <div className="location-map">
                    <div className="map-placeholder">
                      <MapPin size={48} />
                      <span>{property.location}, Dubai</span>
                    </div>
                  </div>
                  <h3>Nearby Attractions</h3>
                  <ul className="nearby-list">
                    <li>
                      <span>Dubai Mall</span> <span>5 min drive</span>
                    </li>
                    <li>
                      <span>Dubai Metro Station</span> <span>3 min walk</span>
                    </li>
                    <li>
                      <span>International Airport</span> <span>15 min drive</span>
                    </li>
                    <li>
                      <span>Beach</span> <span>10 min drive</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'floorplan' && (
                <div className="floorplan-tab">
                  <h3>Floor Plan</h3>
                  <div className="floorplan-placeholder">
                    <Building size={64} />
                    <p>Floor plan available upon request</p>
                    <button className="request-btn" onClick={handleEmail}>
                      Request Floor Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="content-sidebar">
            <div className="contact-card">
              <h3>Interested in this property?</h3>
              <p>Contact our team for more information or to schedule a viewing.</p>

              <div className="contact-buttons">
                <button className="contact-btn whatsapp" onClick={handleWhatsApp}>
                  <MessageCircle size={18} />
                  WhatsApp
                </button>
                <button className="contact-btn call" onClick={handleCall}>
                  <Phone size={18} />
                  Call Now
                </button>
                <button className="contact-btn email" onClick={handleEmail}>
                  <Mail size={18} />
                  Email
                </button>
              </div>

              <div className="action-buttons">
                <button className={`action-btn ${isFavorite ? 'active' : ''}`} onClick={onFavorite}>
                  <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button className="action-btn" onClick={() => {}}>
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>

            <div className="agent-card">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Agent"
                className="agent-avatar"
                loading="lazy"
                width={48}
                height={48}
              />
              <div className="agent-info">
                <h4>Mohammed Al Rashid</h4>
                <p>Senior Property Consultant</p>
                <div className="agent-stats">
                  <span>50+ Properties</span>
                  <span>120+ Deals</span>
                </div>
              </div>
            </div>

            <div className="schedule-card">
              <h4>Schedule a Viewing</h4>

              {viewingStatus === 'success' ? (
                <div className="viewing-success" role="status">
                  <p className="viewing-success-msg">
                    ✅ Viewing request submitted! Our team will confirm within 24&nbsp;hours.
                  </p>
                  <button
                    className="schedule-btn"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => {
                      setViewingStatus('idle');
                      setViewingDate('');
                      setViewingTime('');
                    }}
                  >
                    Book Another Viewing
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="viewing-date" className="sr-only">
                    Preferred date
                  </label>
                  <input
                    id="viewing-date"
                    type="date"
                    className="date-input"
                    aria-required="true"
                    min={new Date().toISOString().split('T')[0]}
                    value={viewingDate}
                    onChange={e => setViewingDate(e.target.value)}
                  />
                  <label htmlFor="viewing-time" className="sr-only">
                    Preferred time
                  </label>
                  <select
                    id="viewing-time"
                    className="time-select"
                    aria-required="true"
                    value={viewingTime}
                    onChange={e => setViewingTime(e.target.value)}
                  >
                    <option value="">Select preferred time</option>
                    {TIME_SLOTS.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  {viewingError && (
                    <p className="viewing-error" role="alert">
                      {viewingError}
                    </p>
                  )}

                  <button
                    className="schedule-btn"
                    onClick={() => {
                      void handleRequestViewing();
                    }}
                    disabled={viewingStatus === 'submitting'}
                    aria-busy={viewingStatus === 'submitting'}
                  >
                    {viewingStatus === 'submitting' ? 'Submitting…' : 'Request Viewing'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
