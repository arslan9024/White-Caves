import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DUBAI_AREAS,
  SAMPLE_DUBAI_PROPERTIES,
  getMarkerColor,
  type DubaiProperty,
  type DubaiArea,
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
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState<DubaiArea | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const sampleProperties = properties.length > 0 ? properties : SAMPLE_DUBAI_PROPERTIES;

  const getPropertiesForArea = (areaId: string): DubaiProperty[] => {
    return sampleProperties.filter(p => p.area === areaId);
  };

  const filteredAreas =
    activeFilter === 'all' ? DUBAI_AREAS : DUBAI_AREAS.filter(a => a.type === activeFilter);

  const handleMarkerClick = (area: DubaiArea) => {
    setSelectedMarker(area);
  };

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  const handleViewAllProperties = (): void => {
    if (selectedMarker) {
      navigate(`/properties?location=${encodeURIComponent(selectedMarker.name)}`);
      return;
    }
    navigate('/properties');
  };

  const [searchQuery, setSearchQuery] = useState('');

  const searchFilteredAreas = filteredAreas.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DubaiMapContainer>
      <MapHeader>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', fontWeight: 800, fontSize: '0.8rem', marginBottom: '12px' }}>
          <span>🗺️ DLD GEOSPATIAL INTELLIGENCE</span>
        </div>
        <MapTitle>Interactive Dubai Prime Communities Map</MapTitle>
        <MapSubtitle>Click on any community hotspot to view available inventory, average ROI, and price benchmarks</MapSubtitle>
      </MapHeader>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <MapFilters>
          <FilterButton $isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
            🌟 All Communities ({DUBAI_AREAS.length})
          </FilterButton>
          <FilterButton
            $isActive={activeFilter === 'residential'}
            $variant="residential"
            onClick={() => setActiveFilter('residential')}
          >
            🏠 Residential
          </FilterButton>
          <FilterButton
            $isActive={activeFilter === 'commercial'}
            $variant="commercial"
            onClick={() => setActiveFilter('commercial')}
          >
            🏢 Commercial Hubs
          </FilterButton>
          <FilterButton
            $isActive={activeFilter === 'luxury'}
            $variant="luxury"
            onClick={() => setActiveFilter('luxury')}
          >
            💎 Ultra-Luxury
          </FilterButton>
        </MapFilters>

        {/* Search & Quick-Select Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', width: '100%' }}>
          <input
            type="text"
            placeholder="🔍 Search community (e.g. Downtown, Marina, Palm)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 18px',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: '0.875rem',
              width: '100%',
              maxWidth: '360px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <MapWrapper>
        <MapBackground>
          <DubaiBaseMap src="/company-logo.jpg" alt="Dubai Map" style={{ opacity: 0.15 }} />

          <InteractiveMapOverlay>
            <MapSVG viewBox="0 0 800 600">
              <g>
                {searchFilteredAreas.map(area => {
                  const x = ((area.lng - 54.9) / (55.5 - 54.9)) * 800;
                  const y = 600 - ((area.lat - 24.8) / (25.5 - 24.8)) * 600;
                  const areaProperties = getPropertiesForArea(area.id);

                  return (
                    <MarkerGroup key={area.id} onClick={() => handleMarkerClick(area)}>
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
                    getPropertiesForArea(selectedMarker.id)
                      .slice(0, 3)
                      .map(prop => (
                        <PropertyPreview
                          key={prop.id}
                          onClick={() => {
                            if (onPropertySelect) {
                              onPropertySelect(prop);
                              return;
                            }
                            navigate(`/property/${prop.id}`);
                          }}
                        >
                          <PropertyImage src={prop.image} alt={prop.title} />
                          <PreviewInfo>
                            <PreviewTitle>{prop.title}</PreviewTitle>
                            <PreviewPrice>AED {(prop.price / 1000000).toFixed(1)}M</PreviewPrice>
                            <PreviewDetails>{prop.beds} beds</PreviewDetails>
                          </PreviewInfo>
                        </PropertyPreview>
                      ))
                  ) : (
                    <NoProperties>No properties listed</NoProperties>
                  )}
                </InfoProperties>
                <ViewAllButton type="button" onClick={handleViewAllProperties}>
                  View All Properties
                </ViewAllButton>
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
