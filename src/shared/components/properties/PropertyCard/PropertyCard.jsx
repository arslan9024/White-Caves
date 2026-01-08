import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../ui';
import { Flex } from '../../layout';
import './PropertyCard.css';

const PropertyCard = React.memo(({
  property,
  viewMode = 'grid',
  showActions = true,
  onSave,
  onContact,
  onView,
  className = ''
}) => {
  const dispatch = useDispatch();
  const activeRole = useSelector(state => state.navigation?.activeRole);
  
  const {
    id,
    title,
    price,
    location,
    area,
    bedrooms,
    bathrooms,
    type,
    status,
    images = [],
    featured,
    propertyType
  } = property;

  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(id);
  }, [id, onSave]);

  const handleContact = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onContact?.(property);
  }, [property, onContact]);

  const baseClass = 'wc-property-card';
  const classes = [
    baseClass,
    `${baseClass}--${viewMode}`,
    featured && `${baseClass}--featured`,
    className
  ].filter(Boolean).join(' ');

  const statusColors = {
    'available': 'success',
    'sold': 'danger',
    'rented': 'info',
    'pending': 'warning',
    'off-market': 'default'
  };

  return (
    <Link to={`/properties/${id}`} className={classes} onClick={() => onView?.(id)}>
      <Card hoverable elevated padding="none" className={`${baseClass}__inner`}>
        <div className={`${baseClass}__image`}>
          <img 
            src={images[0] || '/placeholder-property.jpg'} 
            alt={title}
            loading="lazy"
          />
          <div className={`${baseClass}__badges`}>
            {featured && <Badge variant="primary" rounded>Featured</Badge>}
            {status && (
              <Badge variant={statusColors[status] || 'default'} rounded>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            )}
          </div>
          <div className={`${baseClass}__type`}>
            {type === 'sale' ? 'For Sale' : 'For Rent'}
          </div>
        </div>

        <div className={`${baseClass}__content`}>
          <div className={`${baseClass}__price`}>
            {formatPrice(price)}
            {type === 'rent' && <span className={`${baseClass}__period`}>/year</span>}
          </div>
          
          <h3 className={`${baseClass}__title`}>{title}</h3>
          
          <p className={`${baseClass}__location`}>
            <span className={`${baseClass}__location-icon`}>📍</span>
            {location}
          </p>

          <Flex gap="medium" className={`${baseClass}__features`}>
            {bedrooms !== undefined && (
              <div className={`${baseClass}__feature`}>
                <span className={`${baseClass}__feature-icon`}>🛏️</span>
                <span>{bedrooms} Beds</span>
              </div>
            )}
            {bathrooms !== undefined && (
              <div className={`${baseClass}__feature`}>
                <span className={`${baseClass}__feature-icon`}>🚿</span>
                <span>{bathrooms} Baths</span>
              </div>
            )}
            {area && (
              <div className={`${baseClass}__feature`}>
                <span className={`${baseClass}__feature-icon`}>📐</span>
                <span>{area.toLocaleString()} sqft</span>
              </div>
            )}
          </Flex>

          {propertyType && (
            <Badge variant="default" size="small" className={`${baseClass}__property-type`}>
              {propertyType}
            </Badge>
          )}

          {showActions && (
            <div className={`${baseClass}__actions`}>
              <Button 
                variant="ghost" 
                size="small"
                onClick={handleSave}
                aria-label="Save property"
              >
                ❤️ Save
              </Button>
              <Button 
                variant="primary" 
                size="small"
                onClick={handleContact}
              >
                Contact
              </Button>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
