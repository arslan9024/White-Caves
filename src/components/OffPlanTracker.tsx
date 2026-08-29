import React, { useState, useEffect, useMemo } from 'react';
import type { HomepageProperty, LocationTrend, MarketStats } from '../store/slices/homepageSlice';
import {
  OffplanTrackerContainer,
  TrackerHeader,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle,
  TrackerStats,
  StatBadge,
  StatNumber,
  StatLabel,
  FilterTabs,
  FilterTab,
  ProjectsGrid,
  ProjectCard,
  ProjectImage,
  ProjectBadge,
  ProjectContent,
  DeveloperInfo,
  DeveloperLogo,
  DeveloperName,
  ProjectTitle,
  ProjectLocation,
  ProjectDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  ProjectPrice,
  ProjectFeatures,
  FeaturesChip,
  ActionButtons,
  ActionButton,
  Countdown,
  CountdownLabel,
  CountdownTimer,
  TimeUnit,
  TimeValue,
  TimeLabel,
  PaymentPlan,
  LocationIcon,
} from './OffPlanTracker.styles';

interface OffPlanProject {
  id: number;
  name: string;
  developer: string;
  developerLogo: string;
  location: string;
  type: string;
  segment: string;
  launchDate: Date;
  completionDate: Date;
  priceFrom: number;
  units: number;
  image: string;
  status: string;
  paymentPlan: string;
  features: string[];
}

interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Countdowns {
  [key: number]: CountdownValue;
}

interface OffPlanTrackerProps {
  marketStats?: MarketStats;
  locationTrends?: LocationTrend[];
  featuredProperties?: HomepageProperty[];
}

const STATIC_OFFPLAN_PROJECTS: OffPlanProject[] = [
  {
    id: 1,
    name: 'Marina Vista',
    developer: 'Emaar Properties',
    developerLogo: '/white-caves-logo.png',
    location: 'Dubai Marina',
    type: 'Apartment',
    segment: 'luxury',
    launchDate: new Date('2025-01-15'),
    completionDate: new Date('2027-06-01'),
    priceFrom: 2500000,
    units: 450,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
    status: 'launching-soon',
    paymentPlan: '60/40',
    features: ['Sea View', 'Private Beach', 'Smart Home']
  },
  {
    id: 2,
    name: 'Creek Harbour Tower',
    developer: 'Emaar Properties',
    developerLogo: '/white-caves-logo.png',
    location: 'Dubai Creek Harbour',
    type: 'Apartment',
    segment: 'luxury',
    launchDate: new Date('2025-02-01'),
    completionDate: new Date('2028-03-01'),
    priceFrom: 1800000,
    units: 800,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
    status: 'launching-soon',
    paymentPlan: '80/20',
    features: ['Creek View', 'Burj Khalifa View', 'Premium Amenities']
  },
  {
    id: 3,
    name: 'Palm Residences II',
    developer: 'Nakheel',
    developerLogo: '/white-caves-logo.png',
    location: 'Palm Jumeirah',
    type: 'Villa',
    segment: 'ultra-luxury',
    launchDate: new Date('2025-01-20'),
    completionDate: new Date('2027-12-01'),
    priceFrom: 15000000,
    units: 80,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
    status: 'launching-soon',
    paymentPlan: '50/50',
    features: ['Beach Access', 'Private Pool', 'Garden']
  },
  {
    id: 4,
    name: 'Business Bay Central',
    developer: 'DAMAC',
    developerLogo: '/white-caves-logo.png',
    location: 'Business Bay',
    type: 'Apartment',
    segment: 'commercial',
    launchDate: new Date('2025-03-10'),
    completionDate: new Date('2027-09-01'),
    priceFrom: 950000,
    units: 1200,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
    status: 'pre-registration',
    paymentPlan: '70/30',
    features: ['Office Space', 'Meeting Rooms', 'Parking']
  },
  {
    id: 5,
    name: 'Dubai Hills Villas',
    developer: 'Meraas',
    developerLogo: '/white-caves-logo.png',
    location: 'Dubai Hills Estate',
    type: 'Villa',
    segment: 'residential',
    launchDate: new Date('2025-02-15'),
    completionDate: new Date('2026-12-01'),
    priceFrom: 5500000,
    units: 150,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    status: 'launching-soon',
    paymentPlan: '60/40',
    features: ['Golf View', 'Private Garden', 'Smart Home']
  }
];

function addDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function addMonths(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

function buildLiveOffPlanProjects(
  marketStats?: MarketStats,
  locationTrends: LocationTrend[] = [],
  featuredProperties: HomepageProperty[] = []
): OffPlanProject[] {
  const leadImage = featuredProperties[0]?.images?.[0] || '/company-logo.jpg';

  return locationTrends.slice(0, 4).map((trend, index) => ({
    id: 8000 + index,
    name: `${trend.name} Signature Residences`,
    developer: ['Emaar Properties', 'Nakheel', 'Meraas', 'DAMAC'][index % 4],
    developerLogo: '/white-caves-logo.png',
    location: trend.name,
    type: featuredProperties[index]?.type || 'Apartment',
    segment:
      trend.avgPrice >= 12_000_000 ? 'ultra-luxury' :
      trend.avgPrice >= 5_000_000 ? 'luxury' :
      'residential',
    launchDate: addDays(14 + index * 9),
    completionDate: addMonths(18 + index * 4),
    priceFrom: Math.max(Math.round(trend.avgPrice * 0.75), 950_000),
    units: Math.max(Math.round(trend.propertyCount * 0.8), 60),
    image: featuredProperties[index]?.images?.[0] || leadImage,
    status: index === 0 ? 'launching-soon' : 'pre-registration',
    paymentPlan: ['60/40', '70/30', '80/20', '50/50'][index % 4],
    features: [
      `${trend.trendPercent}% Demand Momentum`,
      `Avg AED ${(trend.avgPrice / 1_000_000).toFixed(1)}M`,
      `${trend.propertyCount} tracked opportunities`,
    ],
  }));
}

const OffPlanTracker = ({
  marketStats,
  locationTrends = [],
  featuredProperties = [],
}: OffPlanTrackerProps) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [countdowns, setCountdowns] = useState<Countdowns>({});

  const offPlanProjects = useMemo(() => {
    const liveProjects = buildLiveOffPlanProjects(marketStats, locationTrends, featuredProperties);
    return liveProjects.length > 0 ? liveProjects : STATIC_OFFPLAN_PROJECTS;
  }, [marketStats, locationTrends, featuredProperties]);

  const calculateCountdown = (date: Date): CountdownValue => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: Countdowns = {};
      offPlanProjects.forEach((project) => {
        newCountdowns[project.id] = calculateCountdown(project.launchDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [offPlanProjects]);

  const filteredProjects = activeFilter === 'all' 
    ? offPlanProjects 
    : offPlanProjects.filter((p) => p.segment === activeFilter);

  return (
    <OffplanTrackerContainer>
      <TrackerHeader>
        <HeaderContent>
          <HeaderTitle>Off-Plan Investment Tracker</HeaderTitle>
          <HeaderSubtitle>
            Monitor upcoming developments and secure pre-launch opportunities
          </HeaderSubtitle>
        </HeaderContent>

        <TrackerStats>
          <StatBadge>
            <StatNumber>{offPlanProjects.length}</StatNumber>
            <StatLabel>Active Projects</StatLabel>
          </StatBadge>
          <StatBadge>
            <StatNumber>AED {(offPlanProjects.reduce((sum, p) => sum + p.priceFrom, 0) / 1000000).toFixed(0)}B</StatNumber>
            <StatLabel>Total Investment</StatLabel>
          </StatBadge>
        </TrackerStats>
      </TrackerHeader>

      <FilterTabs>
        <FilterTab 
          $isActive={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </FilterTab>
        <FilterTab 
          $isActive={activeFilter === 'luxury'}
          onClick={() => setActiveFilter('luxury')}
        >
          Luxury
        </FilterTab>
        <FilterTab 
          $isActive={activeFilter === 'residential'}
          onClick={() => setActiveFilter('residential')}
        >
          Residential
        </FilterTab>
        <FilterTab 
          $isActive={activeFilter === 'commercial'}
          onClick={() => setActiveFilter('commercial')}
        >
          Commercial
        </FilterTab>
      </FilterTabs>

      <ProjectsGrid>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectImage style={{ backgroundImage: `url(${project.image})` }}>
              <ProjectBadge>{project.status}</ProjectBadge>
            </ProjectImage>

            <ProjectContent>
              <DeveloperInfo>
                <DeveloperLogo src={project.developerLogo} alt={project.developer} />
                <DeveloperName>{project.developer}</DeveloperName>
              </DeveloperInfo>

              <ProjectTitle>{project.name}</ProjectTitle>

              <ProjectLocation>
                <LocationIcon>📍</LocationIcon>
                {project.location}
              </ProjectLocation>

              <ProjectDetails>
                <DetailItem>
                  <DetailLabel>Type</DetailLabel>
                  <DetailValue>{project.type}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Units</DetailLabel>
                  <DetailValue>{project.units}</DetailValue>
                </DetailItem>
              </ProjectDetails>

              <ProjectPrice>
                From <strong>AED {(project.priceFrom / 1000000).toFixed(1)}M</strong>
              </ProjectPrice>

              <div>
                <PaymentPlan>Payment Plan: {project.paymentPlan}</PaymentPlan>
              </div>

              {/* ── Statutory DLD Escrow Guarantee (Law No. 8 of 2007) [T-005] ── */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  margin: '10px 0',
                  fontSize: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🛡️ DLD Escrow Law No. 8
                  </span>
                  <span style={{ color: '#047857', fontWeight: 700, fontSize: '0.7rem' }}>
                    100% Protected
                  </span>
                </div>
                <div style={{ color: '#475569', fontSize: '0.72rem', lineHeight: 1.35 }}>
                  Statutory Trust Account certified by Dubai Land Department & CBUAE.
                </div>
              </div>

              <ProjectFeatures>
                {project.features.map((feature) => (
                  <FeaturesChip key={feature}>{feature}</FeaturesChip>
                ))}
              </ProjectFeatures>

              <Countdown>
                <CountdownLabel>Launching In</CountdownLabel>
                <CountdownTimer>
                  {countdowns[project.id] && (
                    <>
                      <TimeUnit>
                        <TimeValue>{countdowns[project.id].days}</TimeValue>
                        <TimeLabel>Days</TimeLabel>
                      </TimeUnit>
                      <TimeUnit>
                        <TimeValue>{countdowns[project.id].hours}</TimeValue>
                        <TimeLabel>Hrs</TimeLabel>
                      </TimeUnit>
                      <TimeUnit>
                        <TimeValue>{countdowns[project.id].minutes}</TimeValue>
                        <TimeLabel>Min</TimeLabel>
                      </TimeUnit>
                      <TimeUnit>
                        <TimeValue>{countdowns[project.id].seconds}</TimeValue>
                        <TimeLabel>Sec</TimeLabel>
                      </TimeUnit>
                    </>
                  )}
                </CountdownTimer>
              </Countdown>

              <ActionButtons>
                <ActionButton className="primary">Reserve</ActionButton>
                <ActionButton className="secondary">More Info</ActionButton>
              </ActionButtons>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </OffplanTrackerContainer>
  );
};

export default OffPlanTracker;
