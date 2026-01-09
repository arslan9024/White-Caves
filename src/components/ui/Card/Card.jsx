import React from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'normal',
  hoverable = false,
  bordered = true,
  shadow = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    'wc-card',
    `wc-card--${variant}`,
    `wc-card--padding-${padding}`,
    `wc-card--shadow-${shadow}`,
    hoverable && 'wc-card--hoverable',
    bordered && 'wc-card--bordered',
    onClick && 'wc-card--clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`wc-card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`wc-card-body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`wc-card-footer ${className}`} {...props}>
    {children}
  </div>
);

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor,
  className = '',
  ...props
}) => (
  <Card variant="stat" className={className} {...props}>
    <div className="wc-stat-card-content">
      <div className="wc-stat-card-info">
        <span className="wc-stat-card-title">{title}</span>
        <span className="wc-stat-card-value">{value}</span>
        {change !== undefined && (
          <span className={`wc-stat-card-change wc-stat-card-change--${changeType}`}>
            {changeType === 'positive' && '+'}{change}
          </span>
        )}
      </div>
      {icon && (
        <div 
          className="wc-stat-card-icon" 
          style={{ backgroundColor: iconColor ? `${iconColor}15` : undefined, color: iconColor }}
        >
          {icon}
        </div>
      )}
    </div>
  </Card>
);

const PropertyCard = ({
  image,
  title,
  price,
  priceLabel = '',
  location,
  bedrooms,
  bathrooms,
  area,
  status,
  statusLabel,
  onFavorite,
  isFavorite,
  onClick,
  className = '',
  ...props
}) => (
  <Card variant="property" hoverable onClick={onClick} className={className} {...props}>
    <div className="wc-property-card-image">
      {image && <img src={image} alt={title} />}
      {status && (
        <span className={`wc-property-card-status wc-property-card-status--${status}`}>
          {statusLabel || status}
        </span>
      )}
      {onFavorite && (
        <button 
          className={`wc-property-card-favorite ${isFavorite ? 'wc-property-card-favorite--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onFavorite(); }}
        >
          ♥
        </button>
      )}
    </div>
    <div className="wc-property-card-content">
      <h3 className="wc-property-card-title">{title}</h3>
      <p className="wc-property-card-location">{location}</p>
      <div className="wc-property-card-specs">
        {bedrooms !== undefined && <span>{bedrooms} Beds</span>}
        {bathrooms !== undefined && <span>{bathrooms} Baths</span>}
        {area && <span>{area}</span>}
      </div>
      <div className="wc-property-card-price">
        <span className="wc-property-card-price-value">{price}</span>
        {priceLabel && <span className="wc-property-card-price-label">{priceLabel}</span>}
      </div>
    </div>
  </Card>
);

const AgentCard = ({
  avatar,
  name,
  role,
  department,
  departmentColor,
  stats = [],
  actions,
  className = '',
  ...props
}) => (
  <Card variant="agent" className={className} {...props}>
    <div className="wc-agent-card-header">
      <div className="wc-agent-card-avatar">
        {avatar ? <img src={avatar} alt={name} /> : <span>{name?.charAt(0)}</span>}
      </div>
      <div className="wc-agent-card-info">
        <h3 className="wc-agent-card-name">{name}</h3>
        <p className="wc-agent-card-role">{role}</p>
        {department && (
          <span 
            className="wc-agent-card-department" 
            style={{ backgroundColor: departmentColor ? `${departmentColor}20` : undefined, color: departmentColor }}
          >
            {department}
          </span>
        )}
      </div>
    </div>
    {stats.length > 0 && (
      <div className="wc-agent-card-stats">
        {stats.map((stat, index) => (
          <div key={index} className="wc-agent-card-stat">
            <span className="wc-agent-card-stat-value">{stat.value}</span>
            <span className="wc-agent-card-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    )}
    {actions && <div className="wc-agent-card-actions">{actions}</div>}
  </Card>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Stat = StatCard;
Card.Property = PropertyCard;
Card.Agent = AgentCard;

export default Card;
