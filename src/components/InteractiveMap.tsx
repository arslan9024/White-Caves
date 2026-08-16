import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import type { Property } from '../store/propertySlice';
import {
  setViewportBounds,
  setActivePropertyId,
  selectViewportBounds,
  selectActivePropertyId,
} from '../redux/slices/propertySlice';
import { Loader } from '@googlemaps/js-api-loader';
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
  SectionTitleSmall,
  LocationList,
  LocationItem,
  LocationName,
  PropertyCount,
  ResultsSection,
  ResultsHeader,
  ResultsTitle,
  ResultsMeta,
  PropertiesGrid,
  PropertyCard,
  PropertyImage,
  PropertyInfo,
  PropertyTitle,
  PropertyPrice,
  PropertyLocation,
  PropertyDetails,
  DetailBadge,
} from './InteractiveMap.styles';
import { formatPrice } from '../utils';

const dubaiCoordinates = new Map<string, { lat: number; lng: number }>([
  ['Palm Jumeirah', { lat: 25.1124, lng: 55.139 }],
  ['Downtown Dubai', { lat: 25.1972, lng: 55.2744 }],
  ['Emirates Hills', { lat: 25.0657, lng: 55.1568 }],
  ['Dubai Marina', { lat: 25.0805, lng: 55.1403 }],
  ['Arabian Ranches', { lat: 25.056, lng: 55.2689 }],
  ['Jumeirah Village Circle', { lat: 25.0587, lng: 55.2106 }],
  ['Business Bay', { lat: 25.1851, lng: 55.2664 }],
  ['Jumeirah Beach Residence', { lat: 25.0772, lng: 55.1337 }],
  ['Dubai Hills Estate', { lat: 25.1048, lng: 55.2336 }],
  ['City Walk', { lat: 25.2048, lng: 55.2624 }],
  ['Mohammed Bin Rashid City', { lat: 25.15, lng: 55.3 }],
  ['The Springs', { lat: 25.0411, lng: 55.1947 }],
]);

const defaultCoords = { lat: 25.15, lng: 55.2 };

// formatPrice imported from ../utils

interface InteractiveMapProps {
  onPropertySelect?: (property: Property) => void;
}

const InteractiveMap = ({ onPropertySelect }: InteractiveMapProps) => {
  const dispatch = useDispatch();
  const { filteredProperties } = useSelector((state: RootState) => state.properties);
  const savedViewport = useSelector(selectViewportBounds);
  const activePropertyId = useSelector(selectActivePropertyId);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Restore viewport on mount: if Redux has a saved viewport, find the nearest Dubai area
  useEffect(() => {
    // Initialize Google Maps Loader as per AEGIS Stage 4 Mandate
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyDummyKeyForWhiteCavesRealEstate',
      version: 'weekly',
    });
    loader.load().then(() => {
      console.log('Google Maps API loaded successfully.');
    }).catch(e => {
      console.error('Error loading Google Maps API:', e);
    });

    if (!savedViewport || selectedLocation) return;
    const centerLat = (savedViewport.north + savedViewport.south) / 2;
    const centerLng = (savedViewport.east + savedViewport.west) / 2;
    let nearest: string | null = null;
    let minDist = Infinity;
    dubaiCoordinates.forEach((coords, name) => {
      const dist = Math.abs(coords.lat - centerLat) + Math.abs(coords.lng - centerLng);
      if (dist < minDist) {
        minDist = dist;
        nearest = name;
      }
    });
    // Only restore if reasonably close (within 1° of a known area)
    if (nearest && minDist < 1) {
      setSelectedLocation(nearest);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const propertiesByLocation = useMemo(() => {
    const grouped = new Map<string, Property[]>();
    filteredProperties.forEach((property: Property) => {
      const loc = property.location;
      const existing = grouped.get(loc) ?? [];
      grouped.set(loc, [...existing, property]);
    });
    return grouped;
  }, [filteredProperties]);

  const locations = Array.from(propertiesByLocation.keys());

  const handleLocationClick = (location: string) => {
    const next = location === selectedLocation ? null : location;
    setSelectedLocation(next);
    if (next) {
      const coords = dubaiCoordinates.get(next);
      if (coords) {
        dispatch(setViewportBounds({
          north: coords.lat + 0.1,
          south: coords.lat - 0.1,
          east:  coords.lng + 0.1,
          west:  coords.lng - 0.1,
        }));
      }
    }
  };

  const handlePropertyClick = (property: Property) => {
    dispatch(setActivePropertyId(String(property.id)));
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  return (
    <InteractiveMapContainer>
      <MapHeader>
        <MapTitle>Explore Properties by Location</MapTitle>
        <MapSubtitle>
          {filteredProperties.length} properties across {locations.length} areas in Dubai
        </MapSubtitle>
      </MapHeader>

      <MapVisualContainer>
        <DubaiMapVisual>
          <MapBackground>
            <DubaiOutlineSVG viewBox="0 0 800 500">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a8d4e6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#7fb8d4" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5f0e6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ebe4d4" stopOpacity="1" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="800" height="500" fill="url(#waterGradient)" />
              <path
                d="M0,200 Q100,180 200,190 Q350,150 400,160 Q500,140 600,150 Q700,130 800,140 L800,500 L0,500 Z"
                fill="url(#landGradient)"
              />
              <path
                d="M150,200 L180,180 L200,190 L220,175 L200,200 L180,210 Z"
                fill="#f0e8d8"
                stroke="#d4c4a8"
                strokeWidth="1"
              />
              <ellipse cx="200" cy="210" rx="40" ry="25" fill="#c8e0f0" opacity="0.5" />
              <path
                d="M350,180 L380,165 L400,175 L380,195 Z"
                fill="#f0e8d8"
                stroke="#d4c4a8"
                strokeWidth="1"
              />
            </DubaiOutlineSVG>

            <LocationMarkers>
              {locations.map(location => {
                const coords = dubaiCoordinates.get(location) ?? defaultCoords;

                const x = ((coords.lng - 55.0) / 0.4) * 100;
                const y = 100 - ((coords.lat - 25.0) / 0.25) * 100;
                const propertyCount = propertiesByLocation.get(location)?.length ?? 0;

                return (
                  <LocationMarker
                    key={location}
                    $isActive={selectedLocation === location}
                    $left={`${Math.min(Math.max(x, 5), 95)}%`}
                    $top={`${Math.min(Math.max(y, 10), 85)}%`}
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
          <SectionTitleSmall>Dubai Areas</SectionTitleSmall>
          <LocationList>
            {locations.map(location => {
              const properties = propertiesByLocation.get(location) ?? [];
              const avgPrice =
                properties.length > 0
                  ? properties.reduce((sum, p) => sum + (p.price ?? 0), 0) / properties.length
                  : 0;

              return (
                <LocationItem
                  key={location}
                  $isSelected={selectedLocation === location}
                  onClick={() => handleLocationClick(location)}
                >
                  <LocationName>{location}</LocationName>
                  <PropertyCount>
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                  </PropertyCount>
                  <DetailBadge>Avg. {formatPrice(avgPrice)}</DetailBadge>
                </LocationItem>
              );
            })}
          </LocationList>
        </SidePanel>
      </MapVisualContainer>

      {selectedLocation && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsTitle>Properties in {selectedLocation}</ResultsTitle>
            <ResultsMeta>
              {propertiesByLocation.get(selectedLocation)?.length ?? 0} listings
            </ResultsMeta>
          </ResultsHeader>
          <PropertiesGrid>
            {(propertiesByLocation.get(selectedLocation) ?? []).map(property => (
              <PropertyCard
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                style={String(property.id) === activePropertyId ? { border: '2px solid #C9A84C' } : undefined}
              >
                <PropertyImage
                  src={(property.images as string[])?.[0] || '/company-logo.jpg'}
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
                    {property.sqft && (
                      <DetailBadge>{property.sqft.toLocaleString()} sqft</DetailBadge>
                    )}
                  </PropertyDetails>
                  <PropertyPrice>{formatPrice(property.price)}</PropertyPrice>
                </PropertyInfo>
              </PropertyCard>
            ))}
          </PropertiesGrid>
        </ResultsSection>
      )}

      {!selectedLocation && filteredProperties.length > 0 && (
        <ResultsSection>
          <ResultsTitle>Featured Properties</ResultsTitle>
          <PropertiesGrid>
            {filteredProperties.slice(0, 6).map(property => (
              <PropertyCard
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                style={String(property.id) === activePropertyId ? { border: '2px solid #C9A84C' } : undefined}
              >
                <PropertyImage
                  src={(property.images as string[])?.[0] || '/company-logo.jpg'}
                  alt={property.title}
                  width={300}
                  height={200}
                  loading="lazy"
                />
                <PropertyInfo>
                  <PropertyTitle>{property.title?.substring(0, 35)}...</PropertyTitle>
                  <PropertyLocation>{property.location}</PropertyLocation>
                  <PropertyPrice>{formatPrice(property.price)}</PropertyPrice>
                </PropertyInfo>
              </PropertyCard>
            ))}
          </PropertiesGrid>
        </ResultsSection>
      )}
    </InteractiveMapContainer>
  );
};

export default InteractiveMap;
