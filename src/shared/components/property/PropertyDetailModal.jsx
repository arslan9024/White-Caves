import React, { useState } from 'react';
import { 
  X, MapPin, Bed, Bath, Maximize, Calendar, Phone, Mail, 
  MessageCircle, Heart, Share2, Building, Car, Waves, 
  Dumbbell, Shield, Trees, Wifi, Snowflake, ChevronRight
} from 'lucide-react';
import PropertyImageSlider from './PropertyImageSlider';
import './PropertyDetailModal.css';

const AMENITY_ICONS = {
  'Pool': Waves,
  'Gym': Dumbbell,
  'Parking': Car,
  'Security': Shield,
  'Garden': Trees,
  'WiFi': Wifi,
  'AC': Snowflake,
  'Concierge': Building,
  'Beach Access': Waves,
  'Cinema': Building
};

export default function PropertyDetailModal({ property, onClose, onContact, onFavorite, isFavorite }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!property) return null;

  const formatPrice = (price, priceType) => {
    if (priceType === 'yearly') {
      return `AED ${price.toLocaleString()}/year`;
    }
    return `AED ${price.toLocaleString()}`;
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the property: ${property.title} in ${property.location}`;
    window.open(`https://wa.me/971563616136?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+971563616136', '_self');
  };

  const handleEmail = () => {
    const subject = `Inquiry: ${property.title}`;
    const body = `Hi,\n\nI'm interested in the property: ${property.title} located in ${property.location}.\n\nPlease contact me with more details.\n\nThank you.`;
    window.open(`mailto:info@whitecaves.ae?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' },
    { id: 'floorplan', label: 'Floor Plan' }
  ];

  return (
    <div className="property-detail-modal-overlay" onClick={onClose}>
      <div className="property-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-gallery">
          <PropertyImageSlider 
            images={property.images || [property.image]}
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
                <span className="price">{formatPrice(property.price, property.priceType)}</span>
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
                    {property.description || `Experience luxury living at its finest in this stunning ${property.type.toLowerCase()} located in the prestigious ${property.location} area. This exceptional property offers ${property.beds} spacious bedrooms, ${property.baths} modern bathrooms, and ${property.sqft?.toLocaleString()} sq.ft of premium living space.

The property features high-end finishes throughout, floor-to-ceiling windows with breathtaking views, a gourmet kitchen with top-of-the-line appliances, and elegant living spaces perfect for both relaxation and entertaining.

Residents will enjoy world-class amenities and the convenience of being close to Dubai's finest dining, shopping, and entertainment destinations.`}
                  </p>

                  <h3>Key Features</h3>
                  <ul className="features-list">
                    <li><ChevronRight size={14} /> Premium location in {property.location}</li>
                    <li><ChevronRight size={14} /> High-quality finishes and materials</li>
                    <li><ChevronRight size={14} /> Spacious {property.sqft?.toLocaleString()} sq.ft layout</li>
                    <li><ChevronRight size={14} /> Modern kitchen with premium appliances</li>
                    <li><ChevronRight size={14} /> Floor-to-ceiling windows</li>
                    <li><ChevronRight size={14} /> 24/7 security and concierge services</li>
                  </ul>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div className="amenities-tab">
                  <h3>Property Amenities</h3>
                  <div className="amenities-grid">
                    {property.amenities?.map((amenity, index) => {
                      const IconComponent = AMENITY_ICONS[amenity] || Building;
                      return (
                        <div key={index} className="amenity-item">
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
                    Located in {property.location}, one of Dubai's most sought-after neighborhoods. 
                    The property offers easy access to major highways, world-class shopping destinations, 
                    fine dining restaurants, and top international schools.
                  </p>
                  <div className="location-map">
                    <div className="map-placeholder">
                      <MapPin size={48} />
                      <span>{property.location}, Dubai</span>
                    </div>
                  </div>
                  <h3>Nearby Attractions</h3>
                  <ul className="nearby-list">
                    <li><span>Dubai Mall</span> <span>5 min drive</span></li>
                    <li><span>Dubai Metro Station</span> <span>3 min walk</span></li>
                    <li><span>International Airport</span> <span>15 min drive</span></li>
                    <li><span>Beach</span> <span>10 min drive</span></li>
                  </ul>
                </div>
              )}

              {activeTab === 'floorplan' && (
                <div className="floorplan-tab">
                  <h3>Floor Plan</h3>
                  <div className="floorplan-placeholder">
                    <Building size={64} />
                    <p>Floor plan available upon request</p>
                    <button className="request-btn" onClick={handleEmail}>Request Floor Plan</button>
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
                <button 
                  className={`action-btn ${isFavorite ? 'active' : ''}`} 
                  onClick={onFavorite}
                >
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
              <input type="date" className="date-input" />
              <select className="time-select">
                <option>Select preferred time</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>12:00 PM</option>
                <option>2:00 PM</option>
                <option>3:00 PM</option>
                <option>4:00 PM</option>
              </select>
              <button className="schedule-btn">Request Viewing</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
