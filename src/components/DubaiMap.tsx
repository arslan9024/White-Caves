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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--accent-red, #EF4444)', fontWeight: 800, fontSize: '0.8rem', marginBottom: '12px' }}>
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

      <MapWrapper style={{ background: 'var(--color-0f172a, #0F172A)', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.25)' }}>
        <MapBackground>
          <InteractiveMapOverlay>
            <MapSVG viewBox="0 0 800 500">
              <defs>
                <linearGradient id="gulfWater" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0B1329" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Arabian Gulf Water Background */}
              <rect width="800" height="500" fill="url(#gulfWater)" />

              {/* Dubai Mainland Coastline Curve */}
              <path
                d="M 0 160 Q 200 220 400 280 T 800 420 L 800 500 L 0 500 Z"
                fill="url(#landGradient)"
                stroke="rgba(239, 68, 68, 0.3)"
                strokeWidth="2"
              />

              {/* Sheikh Zayed Road (E11 Major Highway Line) */}
              <path
                d="M 40 185 Q 240 245 440 305 T 780 435"
                fill="none"
                stroke="rgba(250, 204, 21, 0.4)"
                strokeWidth="3"
                strokeDasharray="6 4"
              />

              {/* Dubai Water Canal */}
              <path
                d="M 280 250 Q 320 280 340 340"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3"
                opacity="0.6"
              />

              {/* Palm Jumeirah Vector Island Curve */}
              <g transform="translate(180, 160)">
                {/* Trunk */}
                <path d="M 40 40 L 40 0" stroke="#C9A84C" strokeWidth="4" />
                {/* Fronds */}
                <circle cx="40" cy="0" r="28" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.6" />
                <circle cx="40" cy="0" r="18" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.6" />
                <path d="M 10 -15 C 30 -35 50 -35 70 -15" fill="none" stroke="#C9A84C" strokeWidth="2" />
                <text x="40" y="-38" textAnchor="middle" fill="#FACC15" fontSize="10" fontWeight="bold">Palm Jumeirah</text>
              </g>

              {/* Interactive Area Markers */}
              <g>
                {searchFilteredAreas.map(area => {
                  // Coordinate mapping tailored for Dubai's geography
                  const x = ((area.lng - 55.05) / (55.45 - 55.05)) * 700 + 50;
                  const y = 450 - ((area.lat - 25.0) / (25.35 - 25.0)) * 400;
                  const areaProperties = getPropertiesForArea(area.id);
                  const isSelected = selectedMarker?.id === area.id;

                  return (
                    <MarkerGroup
                      key={area.id}
                      onClick={() => handleMarkerClick(area)}
                      className={isSelected ? 'active' : ''}
                    >
                      {/* Pulse Ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 24 : 16}
                        fill={getMarkerColor(area.type)}
                        opacity={isSelected ? 0.4 : 0.25}
                        filter="url(#glow)"
                      />
                      {/* Inner Solid Marker */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 12 : 9}
                        fill={isSelected ? '#EF4444' : getMarkerColor(area.type)}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {/* Property Count Badge */}
                      <text
                        x={x}
                        y={y + 3}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="800"
                      >
                        {areaProperties.length || '•'}
                      </text>
                      {/* Community Name Label */}
                      <text
                        x={x}
                        y={y + 22}
                        textAnchor="middle"
                        fill="#F8FAFC"
                        fontSize="11"
                        fontWeight="700"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
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
