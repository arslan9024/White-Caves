import React, { FC, useState, useCallback, useEffect } from 'react';
import {
  DubaiMapContainer,
  MapHeader,
  MapTitle,
  MapSubtitle,
  MapFilters,
  FilterButton,
  MapWrapper,
  MapBackground,
  DubaiBaseMap,
  InteractiveMapOverlay,
  MapSVG,
  MapInfoWindow,
  InfoHeader,
  InfoTitle,
  AreaType,
  InfoProperties,
  PropertyPreview,
  PropertyImage,
  PreviewInfo,
  PreviewTitle,
  PreviewPrice,
  PreviewDetails,
  NoProperties,
  ViewAllButton,
  CloseButton,
  MapLegend,
  LegendTitle,
  LegendItems,
  LegendItem,
  LegendDot,
} from './DubaiMap.styles';

interface Property {
  id: number;
  title: string;
  area: string;
  price: number;
  beds: number;
  type: string;
  image: string;
}

interface DubaiArea {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'luxury' | 'residential' | 'commercial';
}

interface DubaiMapProps {
  properties?: Property[];
  onPropertySelect?: (property: Property) => void;
}

const DubaiMap: FC<DubaiMapProps> = ({ properties = [], onPropertySelect }) => {
  const [selectedMarker, setSelectedMarker] = useState<DubaiArea | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapLoaded, setMapLoaded] = useState(false);

  const dubaiAreas: DubaiArea[] = [
    { id: 'palm', name: 'Palm Jumeirah', lat: 25.1124, lng: 55.1390, type: 'luxury' },
    { id: 'downtown', name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744, type: 'luxury' },
    { id: 'marina', name: 'Dubai Marina', lat: 25.0805, lng: 55.1403, type: 'residential' },
    { id: 'business-bay', name: 'Business Bay', lat: 25.1850, lng: 55.2642, type: 'commercial' },
    { id: 'jvc', name: 'Jumeirah Village Circle', lat: 25.0552, lng: 55.2100, type: 'residential' },
    { id: 'hills', name: 'Dubai Hills', lat: 25.1200, lng: 55.2200, type: 'residential' },
    { id: 'creek', name: 'Dubai Creek Harbour', lat: 25.2000, lng: 55.3300, type: 'luxury' },
    { id: 'emirates', name: 'Emirates Hills', lat: 25.0657, lng: 55.1489, type: 'luxury' },
    { id: 'jbr', name: 'JBR', lat: 25.0784, lng: 55.1337, type: 'residential' },
    { id: 'mbr', name: 'MBR City', lat: 25.1700, lng: 55.3100, type: 'luxury' },
  ];

  const sampleProperties: Property[] = properties.length > 0 ? properties : [
    { id: 1, title: 'Luxury Villa', area: 'palm', price: 15000000, beds: 5, type: 'luxury', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
    { id: 2, title: 'Penthouse Suite', area: 'downtown', price: 12000000, beds: 4, type: 'luxury', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' },
    { id: 3, title: 'Marina Apartment', area: 'marina', price: 2500000, beds: 2, type: 'residential', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400' },
    { id: 4, title: 'Office Tower', area: 'business-bay', price: 8000000, beds: 0, type: 'commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' },
    { id: 5, title: 'Family Villa', area: 'hills', price: 5500000, beds: 4, type: 'residential', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
    { id: 6, title: 'Beachfront Villa', area: 'palm', price: 45000000, beds: 6, type: 'luxury', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400' },
  ];

  const getPropertiesForArea = (areaId: string): Property[] => {
    return sampleProperties.filter(p => p.area === areaId);
  };

  const filteredAreas = activeFilter === 'all' 
    ? dubaiAreas 
    : dubaiAreas.filter(a => a.type === activeFilter);

  const getMarkerColor = (type: string): string => {
    switch(type) {
      case 'luxury': return '#c53030';
      case 'commercial': return '#1a365d';
      case 'residential': return '#38a169';
      default: return '#718096';
    }
  };

  const handleMarkerClick = (area: DubaiArea) => {
    setSelectedMarker(area);
  };

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DubaiMapContainer>
      <MapHeader>
        <MapTitle>Explore Dubai Properties</MapTitle>
        <MapSubtitle>Interactive map with all our listed properties across Dubai</MapSubtitle>
      </MapHeader>

      <MapFilters>
        <FilterButton 
          $isActive={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          All Properties
        </FilterButton>
        <FilterButton 
          $isActive={activeFilter === 'residential'}
          $variant="residential"
          onClick={() => setActiveFilter('residential')}
        >
          Residential
        </FilterButton>
        <FilterButton 
          $isActive={activeFilter === 'commercial'}
          $variant="commercial"
          onClick={() => setActiveFilter('commercial')}
        >
          Commercial
        </FilterButton>
        <FilterButton 
          $isActive={activeFilter === 'luxury'}
          $variant="luxury"
          onClick={() => setActiveFilter('luxury')}
        >
          Luxury
        </FilterButton>
      </MapFilters>

      <MapWrapper>
        <MapBackground>
          <DubaiBaseMap 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Dubai_location.svg/1200px-Dubai_location.svg.png"
            alt="Dubai Map"
            style={{ opacity: 0.15 }}
          />
          
          <InteractiveMapOverlay>
            <MapSVG viewBox="0 0 800 600">
              <g>
                {filteredAreas.map((area) => {
                  const x = ((area.lng - 54.9) / (55.5 - 54.9)) * 800;
                  const y = 600 - ((area.lat - 24.8) / (25.5 - 24.8)) * 600;
                  const areaProperties = getPropertiesForArea(area.id);
                  
                  return (
                    <g 
                      key={area.id}
                      style={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                      }}
                      onClick={() => handleMarkerClick(area)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={areaProperties.length > 0 ? 12 + areaProperties.length * 3 : 8}
                        fill={getMarkerColor(area.type)}
                        opacity={0.2}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={areaProperties.length > 0 ? 8 + areaProperties.length * 2 : 6}
                        fill={getMarkerColor(area.type)}
                      />
                      {areaProperties.length > 0 && (
                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {areaProperties.length}
                        </text>
                      )}
                      <text
                        x={x}
                        y={y + (areaProperties.length > 0 ? 25 + areaProperties.length * 2 : 20)}
                        textAnchor="middle"
                        fill="#1a365d"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {area.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </MapSVG>

            {selectedMarker && (
              <MapInfoWindow>
                <CloseButton onClick={closeInfoWindow}>×</CloseButton>
                <InfoHeader>
                  <InfoTitle>{selectedMarker.name}</InfoTitle>
                  <AreaType>{selectedMarker.type}</AreaType>
                </InfoHeader>
                <InfoProperties>
                  {getPropertiesForArea(selectedMarker.id).length > 0 ? (
                    getPropertiesForArea(selectedMarker.id).slice(0, 3).map(prop => (
                      <PropertyPreview key={prop.id} onClick={onPropertySelect ? () => onPropertySelect(prop) : undefined}>
                        <PropertyImage src={prop.image} alt={prop.title} />
                        <PreviewInfo>
                          <PreviewTitle>{prop.title}</PreviewTitle>
                          <PreviewPrice>${(prop.price / 1000000).toFixed(1)}M</PreviewPrice>
                          <PreviewDetails>{prop.beds} beds</PreviewDetails>
                        </PreviewInfo>
                      </PropertyPreview>
                    ))
                  ) : (
                    <NoProperties>No properties listed</NoProperties>
                  )}
                </InfoProperties>
                <ViewAllButton>View All Properties</ViewAllButton>
              </MapInfoWindow>
            )}
          </InteractiveMapOverlay>
        </MapBackground>
      </MapWrapper>

      <MapLegend>
        <LegendTitle>Property Types</LegendTitle>
        <LegendItems>
          <LegendItem>
            <LegendDot $color="#c53030" />
            <span>Luxury</span>
          </LegendItem>
          <LegendItem>
            <LegendDot $color="#38a169" />
            <span>Residential</span>
          </LegendItem>
          <LegendItem>
            <LegendDot $color="#1a365d" />
            <span>Commercial</span>
          </LegendItem>
        </LegendItems>
      </MapLegend>
    </DubaiMapContainer>
  );
};

export default DubaiMap;
