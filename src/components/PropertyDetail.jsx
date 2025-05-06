
import React from 'react';
import './PropertyDetail.css';
import PropertyMap from './PropertyMap';

const PropertyDetail = ({ property }) => {
  return (
    <div className="property-detail">
      <div className="property-header">
        <h1>{property.title}</h1>
        <div className="property-type-price">
          <span className="listing-type">{property.listingType}</span>
          <span className="price">AED {property.price.toLocaleString()}</span>
        </div>
      </div>

      <div className="property-images">
        {property.images?.map((image, index) => (
          <img key={index} src={image} alt={`Property view ${index + 1}`} />
        ))}
      </div>

      <div className="property-description">
        <h2>Description</h2>
        <p>{property.description}</p>
      </div>

      <div className="property-info-grid">
        <div className="info-section">
          <h3>Basic Information</h3>
          <ul>
            <li><strong>Bedrooms:</strong> {property.beds}</li>
            <li><strong>Bathrooms:</strong> {property.baths}</li>
            <li><strong>Area:</strong> {property.sqft} sq.ft</li>
            <li><strong>Floor Level:</strong> {property.features?.floorLevel}</li>
            <li><strong>View:</strong> {property.features?.view}</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>Features</h3>
          <ul>
            <li><strong>Balcony:</strong> {property.features?.balcony ? 'Yes' : 'No'}</li>
            <li><strong>Parking Spaces:</strong> {property.features?.parkingSpaces}</li>
            <li><strong>Kitchen Type:</strong> {property.features?.kitchenType}</li>
            <li><strong>Condition:</strong> {property.features?.condition}</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>Building Specifications</h3>
          <ul>
            <li><strong>Build Year:</strong> {property.specifications?.buildYear}</li>
            <li><strong>Total Floors:</strong> {property.specifications?.totalFloors}</li>
            <li><strong>Plot Area:</strong> {property.specifications?.plotArea} sq.ft</li>
            <li><strong>Build-up Area:</strong> {property.specifications?.buildUpArea} sq.ft</li>
          </ul>
        </div>
      </div>

      <div className="property-amenities">
        <h3>Amenities</h3>
        <div className="amenities-grid">
          {property.amenities?.map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
        </div>
      </div>

      <div className="property-location">
        <h3>Location</h3>
        <PropertyMap location={property.location} />
      </div>
    </div>
  );
};

export default PropertyDetail;
