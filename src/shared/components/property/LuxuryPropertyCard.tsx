import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Share2, ChevronRight } from 'lucide-react';
import PropertyImageSlider from './PropertyImageSlider';
import { PropertyType } from '../../../hooks/usePropertyBrowser';
import { createLogger } from '../../../utils/logger';
import './LuxuryPropertyCard.css';

const log = createLogger('LuxuryPropertyCard');

export interface LuxuryPropertyCardProps {
  property: PropertyType;
  isFavorite: boolean;
  onFavoriteToggle: (property: PropertyType) => void;
  onClick: (property: PropertyType) => void;
}

export default function LuxuryPropertyCard({
  property,
  isFavorite,
  onFavoriteToggle,
  onClick,
}: LuxuryPropertyCardProps): React.ReactElement {
  
  const handleShare = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = `${window.location.origin}/property/${property.id}`;
    if (navigator.share) {
      navigator.share({ title: property.title, url }).catch(err => log.warn('Share failed:', err));
    } else {
      navigator.clipboard.writeText(url).catch(err => log.warn('Clipboard write failed:', err));
    }
  };

  return (
    <article 
      className="luxury-property-card"
      onClick={() => onClick(property)}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') onClick(property);
      }}
      role="button"
      aria-label={`View ${property.title}`}
    >
      <div className="lpc-image-wrapper">
        <PropertyImageSlider 
          images={property.images}
          title={property.title}
          isFavorite={isFavorite}
          onFavorite={() => onFavoriteToggle(property)}
          showControls={true}
          showThumbnails={false}
          aspectRatio="16/10"
        />
        <div className="lpc-badges">
          {property.featured && <span className="lpc-badge featured">Featured</span>}
          <span className={`lpc-badge purpose ${property.purpose}`}>
            {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
      </div>

      <div className="lpc-content">
        <span className="lpc-type">{property.type}</span>
        <h3 className="lpc-title">{property.title}</h3>
        <p className="lpc-location">
          <MapPin size={14} />
          {property.location}
        </p>

        <div className="lpc-specs">
          <span title="Bedrooms">
            <Bed size={14} /> {property.beds}
          </span>
          <span title="Bathrooms">
            <Bath size={14} /> {property.baths}
          </span>
          <span title="Area (sqft)">
            <Maximize size={14} /> {property.sqft.toLocaleString()}
          </span>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="lpc-amenities">
            {property.amenities.slice(0, 3).map(a => (
              <span key={a} className="lpc-amenity-chip">
                {a}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="lpc-amenity-chip more">
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="lpc-footer">
          <span className="lpc-price">
            AED {property.price.toLocaleString()}
            {property.purpose === 'rent' && <span className="lpc-price-period">/yr</span>}
          </span>
          
          <div className="lpc-actions">
            <button
              className="lpc-share-btn"
              onClick={handleShare}
              aria-label="Share property"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <Link
              to={`/property/${property.id}`}
              className="lpc-view-btn"
              onClick={e => e.stopPropagation()}
            >
              Details <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
