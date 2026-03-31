import React, { useState } from 'react';
import {
  NeighborhoodAnalyzerContainer,
  AnalyzerHeader,
  AnalyzerTitle,
  AnalyzerSubtitle,
  AreaSelector,
  AreaButton,
  AnalyzerContent,
  AreaHero,
  HeroOverlay,
  HeroContent,
  HeroTitle,
  HeroDescription,
  HeroBadges,
  Badge,
  MetricsGrid,
  MetricCard,
  MetricLabel,
  MetricValue,
  InsightsSection,
  InsightsTitle,
  InsightsList,
  InsightItem,
  RisksSection,
  RisksTitle,
  RisksList,
  RiskItem,
  SectionDivider,
} from './NeighborhoodAnalyzer.styles';

interface FutureProject {
  name: string;
  completion: string;
}

interface Demographics {
  population: number;
  avgAge: number;
  expats: number;
  families: number;
}

interface Amenities {
  restaurants: number;
  schools: number;
  healthcare: number;
  shopping: number;
  parks: number;
}

interface Transport {
  metro: number;
  bus: number;
  walkability: number;
}

interface Neighborhood {
  name: string;
  score: number;
  investmentGrade: string;
  trend: 'rising' | 'stable' | 'declining';
  avgPrice: number;
  pricePerSqft: number;
  rentalYield: number;
  appreciation: number;
  image: string;
  description: string;
  demographics: Demographics;
  amenities: Amenities;
  transport: Transport;
  futureProjects: FutureProject[];
  insights: string[];
  risks: string[];
}

type NeighborhoodKey = 'dubai-marina' | 'downtown-dubai' | 'palm-jumeirah';

const NeighborhoodAnalyzer: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<NeighborhoodKey>('dubai-marina');
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const neighborhoods: Record<NeighborhoodKey, Neighborhood> = {
    'dubai-marina': {
      name: 'Dubai Marina',
      score: 92,
      investmentGrade: 'A+',
      trend: 'rising',
      avgPrice: 1850000,
      pricePerSqft: 1650,
      rentalYield: 6.8,
      appreciation: 8.5,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      description: 'Premier waterfront community with stunning marina views and world-class amenities.',
      demographics: {
        population: 45000,
        avgAge: 35,
        expats: 85,
        families: 35
      },
      amenities: {
        restaurants: 95,
        schools: 8,
        healthcare: 12,
        shopping: 25,
        parks: 6
      },
      transport: {
        metro: 2,
        bus: 15,
        walkability: 88
      },
      futureProjects: [
        { name: 'Marina Promenade Extension', completion: '2025' },
        { name: 'New Metro Station', completion: '2026' }
      ],
      insights: [
        'High demand from young professionals and investors',
        'Strong rental market with consistent occupancy rates',
        'Premium positioning attracts international buyers',
        'Limited new supply keeps prices stable'
      ],
      risks: ['High competition', 'Market saturation in some segments']
    },
    'downtown-dubai': {
      name: 'Downtown Dubai',
      score: 95,
      investmentGrade: 'A+',
      trend: 'stable',
      avgPrice: 2850000,
      pricePerSqft: 2100,
      rentalYield: 5.5,
      appreciation: 10.2,
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
      description: 'Iconic district home to Burj Khalifa and Dubai Mall, representing ultimate luxury.',
      demographics: {
        population: 35000,
        avgAge: 38,
        expats: 90,
        families: 25
      },
      amenities: {
        restaurants: 150,
        schools: 5,
        healthcare: 8,
        shopping: 50,
        parks: 4
      },
      transport: {
        metro: 3,
        bus: 20,
        walkability: 82
      },
      futureProjects: [
        { name: 'Opera District Expansion', completion: '2025' },
        { name: 'Downtown South', completion: '2027' }
      ],
      insights: [
        'Global landmark status ensures lasting value',
        'High capital appreciation potential',
        'Strong short-term rental market',
        'Premium maintenance and service standards'
      ],
      risks: ['Higher entry price point', 'Tourist-dependent rentals']
    },
    'palm-jumeirah': {
      name: 'Palm Jumeirah',
      score: 90,
      investmentGrade: 'A',
      trend: 'rising',
      avgPrice: 8500000,
      pricePerSqft: 2800,
      rentalYield: 4.5,
      appreciation: 12.5,
      image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800',
      description: 'World-famous man-made island offering exclusive beachfront living.',
      demographics: {
        population: 18000,
        avgAge: 42,
        expats: 95,
        families: 55
      },
      amenities: {
        restaurants: 80,
        schools: 3,
        healthcare: 5,
        shopping: 12,
        parks: 8
      },
      transport: {
        metro: 0,
        bus: 8,
        walkability: 45
      },
      futureProjects: [
        { name: 'Palm West Beach', completion: '2025' },
        { name: 'The Palm Tower II', completion: '2026' }
      ],
      insights: [
        'Ultra-luxury positioning command premium prices',
        'Highest appreciation potential in Dubai',
        'Exclusive community attracts ultra-HNIs',
        'Strong international demand'
      ],
      risks: ['Limited supply', 'Accessibility challenges']
    }
  };

  const current = neighborhoods[selectedArea];

  return (
    <NeighborhoodAnalyzerContainer>
      <AnalyzerHeader>
        <AnalyzerTitle>Neighborhood Intelligence</AnalyzerTitle>
        <AnalyzerSubtitle>Make informed investment decisions with comprehensive area analytics</AnalyzerSubtitle>

        <AreaSelector>
          {(Object.keys(neighborhoods) as NeighborhoodKey[]).map((key) => (
            <AreaButton
              key={key}
              $isActive={selectedArea === key}
              onClick={() => setSelectedArea(key)}
            >
              {neighborhoods[key].name}
            </AreaButton>
          ))}
        </AreaSelector>
      </AnalyzerHeader>

      <AnalyzerContent>
        <AreaHero $backgroundImage={current.image}>
          <HeroOverlay />
          <HeroContent>
            <HeroTitle>{current.name}</HeroTitle>
            <HeroDescription>{current.description}</HeroDescription>
            <HeroBadges>
              <Badge $variant="score">Score: {current.score}/100</Badge>
              <Badge $variant="grade">{current.investmentGrade}</Badge>
              <Badge $variant="trend" $trend={current.trend}>{current.trend}</Badge>
            </HeroBadges>
          </HeroContent>
        </AreaHero>

        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Average Price</MetricLabel>
            <MetricValue>AED {(current.avgPrice / 1000000).toFixed(1)}M</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Price per sqft</MetricLabel>
            <MetricValue>AED {current.pricePerSqft}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Rental Yield</MetricLabel>
            <MetricValue>{current.rentalYield}%</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Appreciation</MetricLabel>
            <MetricValue>{current.appreciation}%</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Population</MetricLabel>
            <MetricValue>{(current.demographics.population / 1000).toFixed(0)}K</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Expat %</MetricLabel>
            <MetricValue>{current.demographics.expats}%</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Walkability</MetricLabel>
            <MetricValue>{current.transport.walkability}%</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Schools</MetricLabel>
            <MetricValue>{current.amenities.schools}</MetricValue>
          </MetricCard>
        </MetricsGrid>

        <SectionDivider />

        <InsightsSection>
          <InsightsTitle>Investment Insights</InsightsTitle>
          <InsightsList>
            {current.insights.map((insight) => (
              <InsightItem key={insight}>✓ {insight}</InsightItem>
            ))}
          </InsightsList>
        </InsightsSection>

        <RisksSection>
          <RisksTitle>Considerations</RisksTitle>
          <RisksList>
            {current.risks.map((risk) => (
              <RiskItem key={risk}>⚠ {risk}</RiskItem>
            ))}
          </RisksList>
        </RisksSection>
      </AnalyzerContent>
    </NeighborhoodAnalyzerContainer>
  );
};

export default NeighborhoodAnalyzer;
