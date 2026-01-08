import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../ui';
import './ServiceCard.css';

const ServiceCard = React.memo(({
  service,
  variant = 'vertical',
  showPrice = true,
  showBooking = true,
  onBook,
  onLearnMore,
  className = ''
}) => {
  const {
    id,
    title,
    description,
    price,
    priceUnit,
    icon,
    image,
    category,
    duration,
    popular
  } = service;

  const formatPrice = (price, unit) => {
    if (!price) return 'Contact for pricing';
    const formatted = new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(price);
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const handleBook = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onBook?.(service);
  }, [service, onBook]);

  const baseClass = 'wc-service-card';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    popular && `${baseClass}--popular`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Card hoverable elevated padding="none" className={classes}>
      {image && (
        <div className={`${baseClass}__image`}>
          <img src={image} alt={title} loading="lazy" />
          {popular && (
            <Badge variant="primary" rounded className={`${baseClass}__popular-badge`}>
              Popular
            </Badge>
          )}
        </div>
      )}

      <div className={`${baseClass}__content`}>
        {icon && !image && (
          <div className={`${baseClass}__icon`}>{icon}</div>
        )}

        {category && (
          <Badge variant="default" size="small" className={`${baseClass}__category`}>
            {category}
          </Badge>
        )}

        <h3 className={`${baseClass}__title`}>{title}</h3>
        
        {description && (
          <p className={`${baseClass}__description`}>{description}</p>
        )}

        <div className={`${baseClass}__meta`}>
          {duration && (
            <span className={`${baseClass}__duration`}>
              <span className={`${baseClass}__duration-icon`}>⏱️</span>
              {duration}
            </span>
          )}
          
          {showPrice && price && (
            <span className={`${baseClass}__price`}>
              {formatPrice(price, priceUnit)}
            </span>
          )}
        </div>

        {showBooking && (
          <div className={`${baseClass}__actions`}>
            <Button
              variant="ghost"
              size="small"
              onClick={() => onLearnMore?.(service)}
            >
              Learn More
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleBook}
            >
              Book Now
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
