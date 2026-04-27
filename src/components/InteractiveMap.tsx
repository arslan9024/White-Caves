import { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { Property } from '../store/propertySlice';
import {
  InteractiveMapContainer,
  MapHeader,
  MapTitle,
  MapSubtitle,
  MapVisualContainer,
  DubaiMapVisual,
  MapBackground,
  DubaiOutlineSVG,
  LocationMarkers,
  LocationMarker,
  MarkerCount,
  SidePanel,
  LocationList,
  LocationItem,
  LocationName,
  PropertyCount,
  PropertiesGrid,
  PropertyCard,
  PropertyImage,
  PropertyInfo,
  PropertyTitle,
  PropertyPrice,
  PropertyDetails,
  DetailBadge,
} from './InteractiveMap.styles';
import { formatPrice } from '../utils';

const dubaiCoordinates: Record<string, { lat: number; lng: number }> = {
  'Palm Jumeirah': { lat: 25.1124, lng: 55.1390 },
  'Downtown Dubai': { lat: 25.1972, lng: 55.2744 },
  'Emirates Hills': { lat: 25.0657, lng: 55.1568 },
  'Dubai Marina': { lat: 25.0805, lng: 55.1403 },
  'Arabian Ranches': { lat: 25.0560, lng: 55.2689 },
  'Jumeirah Village Circle': { lat: 25.0587, lng: 55.2106 },
  'Business Bay': { lat: 25.1851, lng: 55.2664 },
  'Jumeirah Beach Residence': { lat: 25.0772, lng: 55.1337 },
  'Dubai Hills Estate': { lat: 25.1048, lng: 55.2336 },
  'City Walk': { lat: 25.2048, lng: 55.2624 },
  'Mohammed Bin Rashid City': { lat: 25.1500, lng: 55.3000 },
  'The Springs': { lat: 25.0411, lng: 55.1947 }
};

const defaultCoords = { lat: 25.15, lng: 55.20 };

// formatPrice imported from ../utils

interface InteractiveMapProps {
  onPropertySelect?: (property: Property) => void;
}

const InteractiveMap = ({ onPropertySelect }: InteractiveMapProps) => {
  const { filteredProperties } = useSelector((state: RootState) => state.properties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const propertiesByLocation = useMemo(() => {
    const grouped: Record<string, Property[]> = {};
    filteredProperties.forEach((property: Property) => {
      const loc = property.location;
      if (!grouped[loc]) {
        grouped[loc] = [];
      }
      grouped[loc].push(property);
    });
    return grouped;
  }, [filteredProperties]);

  const locations = Object.keys(propertiesByLocation);

  const handleLocationClick = (location: string) => {
    setSelectedLocation(location === selectedLocation ? null : location);
    setSelectedProperty(null);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  return (
    <InteractiveMapContainer>
      <MapHeader>
        <MapTitle>Explore Properties by Location</MapTitle>
        <MapSubtitle>{filteredProperties.length} properties across {locations.length} areas in Dubai</MapSubtitle>
      </MapHeader>

      <MapVisualContainer>
        <DubaiMapVisual>
          <MapBackground>
            <DubaiOutlineSVG viewBox="0 0 800 500">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#a8d4e6', stopOpacity:0.6}} />
                  <stop offset="100%" style={{stopColor:'#7fb8d4', stopOpacity:0.4}} />
                </linearGradient>
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#f5f0e6', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#ebe4d4', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="800" height="500" fill="url(#waterGradient)" />
              <path d="M0,200 Q100,180 200,190 Q350,150 400,160 Q500,140 600,150 Q700,130 800,140 L800,500 L0,500 Z" fill="url(#landGradient)" />
              <path d="M150,200 L180,180 L200,190 L220,175 L200,200 L180,210 Z" fill="#f0e8d8" stroke="#d4c4a8" strokeWidth="1" />
              <ellipse cx="200" cy="210" rx="40" ry="25" fill="#c8e0f0" opacity="0.5" />
              <path d="M350,180 L380,165 L400,175 L380,195 Z" fill="#f0e8d8" stroke="#d4c4a8" strokeWidth="1" />
            </DubaiOutlineSVG>
            
            <LocationMarkers>
              {locations.map((location) => {
                const coords = dubaiCoordinates[location] || defaultCoords;
                
                const x = ((coords.lng - 55.0) / 0.4) * 100;
                const y = 100 - ((coords.lat - 25.0) / 0.25) * 100;
                const propertyCount = propertiesByLocation[location].length;
                
                return (
                  <LocationMarker
                    key={location}
                    $isActive={selectedLocation === location}
                    style={{ left: `${Math.min(Math.max(x, 5), 95)}%`, top: `${Math.min(Math.max(y, 10), 85)}%` }}
                    onClick={() => handleLocationClick(location)}
                  >
                    <MarkerCount>{propertyCount}</MarkerCount>
                  </LocationMarker>
                );
              })}
            </LocationMarkers>
          </MapBackground>
        </DubaiMapVisual>

        <SidePanel>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>Dubai Areas</h3>
          <LocationList>
            {locations.map((location) => {
              const properties = propertiesByLocation[location];
              const avgPrice = properties.length > 0
                ? properties.reduce((sum, p) => sum + (p.price ?? 0), 0) / properties.length
                : 0;
              
              return (
                <LocationItem
                  key={location}
                  $isSelected={selectedLocation === location}
                  onClick={() => handleLocationClick(location)}
                >
                  <LocationName>{location}</LocationName>
                  <PropertyCount>{properties.length} {properties.length === 1 ? 'property' : 'properties'}</PropertyCount>
                  <DetailBadge>Avg. {formatPrice(avgPrice)}</DetailBadge>
                </LocationItem>
              );
            })}
          </LocationList>
        </SidePanel>
      </MapVisualContainer>

      {selectedLocation && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Properties in {selectedLocation}</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{propertiesByLocation[selectedLocation].length} listings</span>
          </div>
          <PropertiesGrid>
            {propertiesByLocation[selectedLocation].map((property) => (
              <PropertyCard 
                key={property.id}
                onClick={() => handlePropertyClick(property)}
              >
                <PropertyImage 
                  src={(property.images as string[])?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={property.title}
                  width={300}
                  height={200}
                  loading="lazy"
                />
                <PropertyInfo>
                  <PropertyTitle>{property.title}</PropertyTitle>
                  <PropertyDetails>
                    {property.beds && <DetailBadge>{property.beds} Beds</DetailBadge>}
                    {property.baths && <DetailBadge>{property.baths} Baths</DetailBadge>}
                    {property.sqft && <DetailBadge>{property.sqft.toLocaleString()} sqft</DetailBadge>}
                  </PropertyDetails>
                  <PropertyPrice>{formatPrice(property.price)}</PropertyPrice>
                </PropertyInfo>
              </PropertyCard>
            ))}
          </PropertiesGrid>
        </div>
      )}

      {!selectedLocation && filteredProperties.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Featured Properties</h3>
          <PropertiesGrid>
            {filteredProperties.slice(0, 6).map((property) => (
              <PropertyCard 
                key={property.id}
                onClick={() => handlePropertyClick(property)}
              >
                <PropertyImage 
                  src={(property.images as string[])?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={property.title}
                  width={300}
                  height={200}
                  loading="lazy"
                />
                <PropertyInfo>
                  <PropertyTitle>{property.title?.substring(0, 35)}...</PropertyTitle>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{property.location}</span>
                  <PropertyPrice>{formatPrice(property.price)}</PropertyPrice>
                </PropertyInfo>
              </PropertyCard>
            ))}
          </PropertiesGrid>
        </div>
      )}
    </InteractiveMapContainer>
  );
};

export default InteractiveMap;
