import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../../store/dashboardSlice';
import './PropertyCard.css';

export function PropertyStatusBadge({ status }) {
  const statusLower = status?.toLowerCase().replace(/\s+/g, '-') || '';
  return (
    <span className={`property-status-badge ${statusLower}`}>
      {status}
    </span>
  );
}

export default function PropertyCard({
  id,
  image,
  title,
  location,
  price,
  beds,
  baths,
  area,
  status,
  type = 'sale',
  showFavorite = true,
  onClick,
  to,
  className = ''
}) {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.some(f => f.id === id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites({ id, title, location, price, image }));
    }
  };

  const content = (
    <>
      <div className="property-card-image">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div className="property-placeholder">🏠</div>
        )}
        {status && <PropertyStatusBadge status={status} />}
        {showFavorite && (
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="property-card-content">
        <h4 className="property-title">{title}</h4>
        <p className="property-location">📍 {location}</p>
        <p className="property-price">
          {price}
          {type === 'rent' && <span className="price-suffix">/year</span>}
        </p>
        {(beds || baths || area) && (
          <div className="property-specs">
            {beds && <span>🛏️ {beds}</span>}
            {baths && <span>🚿 {baths}</span>}
            {area && <span>📐 {area}</span>}
          </div>
        )}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`property-card-reusable ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <div 
      className={`property-card-reusable ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {content}
    </div>
  );
}

export function PropertyCardGrid({ children, columns = 3, className = '' }) {
  return (
    <div 
      className={`property-card-grid ${className}`}
      style={{ '--property-columns': columns }}
    >
      {children}
    </div>
  );
}

export function PropertyListItem({
  title,
  location,
  price,
  status,
  views,
  inquiries,
  daysListed,
  onClick,
  className = ''
}) {
  return (
    <div 
      className={`property-list-item ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="property-icon">🏠</div>
      <div className="property-info">
        <span className="property-title">{title}</span>
        <span className="property-location">{location}</span>
      </div>
      {(views !== undefined || inquiries !== undefined) && (
        <div className="property-metrics">
          {views !== undefined && <span>👁️ {views}</span>}
          {inquiries !== undefined && <span>💬 {inquiries}</span>}
        </div>
      )}
      <div className="property-meta">
        <span className="property-price">{price}</span>
        {status && <PropertyStatusBadge status={status} />}
        {daysListed !== undefined && (
          <span className="days-listed">{daysListed}d ago</span>
        )}
      </div>
    </div>
  );
}
