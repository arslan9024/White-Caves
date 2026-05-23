import React from 'react';
import {
  PropertyDetailContainer,
  PropertyHeader,
  PropertyTypePrice,
  ListingType,
  Price,
  PropertyImages,
  PropertyDescription,
  PropertyInfoGrid,
  InfoSection,
  PropertyAmenities,
  AmenitiesGrid,
  AmenityTag,
  PropertyLocation
} from './PropertyDetail.styles';
import PropertyMap from './PropertyMap';

interface PropertyFeatures {
  floorLevel?: string;
  view?: string;
  balcony?: boolean;
  parkingSpaces?: number;
  kitchenType?: string;
  condition?: string;
}

interface PropertySpecifications {
  buildYear?: number;
  totalFloors?: number;
  plotArea?: number;
  buildUpArea?: number;
}

interface PropertyData {
  title: string;
  listingType: string;
  price: number;
  images?: string[];
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  features?: PropertyFeatures;
  amenities?: string[];
  specifications?: PropertySpecifications;
  location: string;
}

interface PropertyDetailProps {
  property: PropertyData;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property }) => {
  return (
    <PropertyDetailContainer>
      <PropertyHeader>
        <h1>{property.title}</h1>
        <PropertyTypePrice>
          <ListingType>{property.listingType}</ListingType>
          <Price>AED {(property.price ?? 0).toLocaleString()}</Price>
        </PropertyTypePrice>
      </PropertyHeader>

      <PropertyImages>
        {property.images?.map((image, index) => (
          <img key={image ?? `img-${index}`} src={image} alt={`Property view ${index + 1}`} loading="lazy" width={400} height={300} />
        ))}
      </PropertyImages>

      <PropertyDescription>
        <h2>Description</h2>
        <p>{property.description}</p>
      </PropertyDescription>

      <PropertyInfoGrid>
        <InfoSection>
          <h3>Basic Information</h3>
          <ul>
            <li>
              <strong>Bedrooms:</strong> {property.beds}
            </li>
            <li>
              <strong>Bathrooms:</strong> {property.baths}
            </li>
            <li>
              <strong>Area:</strong> {property.sqft} sq.ft
            </li>
            <li>
              <strong>Floor Level:</strong> {property.features?.floorLevel}
            </li>
            <li>
              <strong>View:</strong> {property.features?.view}
            </li>
          </ul>
        </InfoSection>

        <InfoSection>
          <h3>Features</h3>
          <ul>
            <li>
              <strong>Balcony:</strong> {property.features?.balcony ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>Parking Spaces:</strong> {property.features?.parkingSpaces}
            </li>
            <li>
              <strong>Kitchen Type:</strong> {property.features?.kitchenType}
            </li>
            <li>
              <strong>Condition:</strong> {property.features?.condition}
            </li>
          </ul>
        </InfoSection>

        <InfoSection>
          <h3>Building Specifications</h3>
          <ul>
            <li>
              <strong>Build Year:</strong> {property.specifications?.buildYear}
            </li>
            <li>
              <strong>Total Floors:</strong> {property.specifications?.totalFloors}
            </li>
            <li>
              <strong>Plot Area:</strong> {property.specifications?.plotArea} sq.ft
            </li>
            <li>
              <strong>Build-up Area:</strong> {property.specifications?.buildUpArea} sq.ft
            </li>
          </ul>
        </InfoSection>
      </PropertyInfoGrid>

      <PropertyAmenities>
        <h3>Amenities</h3>
        <AmenitiesGrid>
          {property.amenities?.map((amenity) => (
            <AmenityTag key={amenity}>{amenity}</AmenityTag>
          ))}
        </AmenitiesGrid>
      </PropertyAmenities>

      <PropertyLocation>
        <h3>Location</h3>
        <PropertyMap location={property.location} />
      </PropertyLocation>
    </PropertyDetailContainer>
  );
};

export default PropertyDetail;
