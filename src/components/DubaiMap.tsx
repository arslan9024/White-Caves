import React, { FC, useState, useCallback, useEffect } from 'react';
import {
  DUBAI_AREAS, SAMPLE_DUBAI_PROPERTIES, getMarkerColor,
  type DubaiProperty, type DubaiArea,
} from '../data/dubaiProperties';
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
  MarkerGroup,
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

interface DubaiMapProps {
  properties?: DubaiProperty[];
  onPropertySelect?: (property: DubaiProperty) => void;
}

const DubaiMap: FC<DubaiMapProps> = ({ properties = [], onPropertySelect }) => {
  const [selectedMarker, setSelectedMarker] = useState<DubaiArea | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapLoaded, setMapLoaded] = useState(false);

  const sampleProperties = properties.length > 0 ? properties : SAMPLE_DUBAI_PROPERTIES;

  const getPropertiesForArea = (areaId: string): DubaiProperty[] => {
    return sampleProperties.filter(p => p.area === areaId);
  };

  const filteredAreas = activeFilter === 'all' 
    ? DUBAI_AREAS 
    : DUBAI_AREAS.filter(a => a.type === activeFilter);

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
            src="/company-logo.jpg"
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
                    <MarkerGroup
                      key={area.id}
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
                    </MarkerGroup>
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
