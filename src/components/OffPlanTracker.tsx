import React, { useState, useEffect } from 'react';
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

const offPlanProjects: OffPlanProject[] = [
  {
    id: 1,
    name: 'Marina Vista',
    developer: 'Emaar Properties',
    developerLogo: 'https://via.placeholder.com/60x60?text=Emaar',
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
    developerLogo: 'https://via.placeholder.com/60x60?text=Emaar',
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
    developerLogo: 'https://via.placeholder.com/60x60?text=Nakheel',
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
    developerLogo: 'https://via.placeholder.com/60x60?text=DAMAC',
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
    developerLogo: 'https://via.placeholder.com/60x60?text=Meraas',
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

const OffPlanTracker: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [countdowns, setCountdowns] = useState<Countdowns>({});

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
  }, []);

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
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'luxury'}
          onClick={() => setActiveFilter('luxury')}
        >
          Luxury
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'residential'}
          onClick={() => setActiveFilter('residential')}
        >
          Residential
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'commercial'}
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
                <LocationIcon size={16} />
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

              <div style={{ margin: '12px 0' }}>
                {project.features.map((feature, idx) => (
                  <FeaturesChip key={idx}>{feature}</FeaturesChip>
                ))}
              </div>

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
