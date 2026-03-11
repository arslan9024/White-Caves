import React, { useEffect } from 'react';
import { useRecommendations, useUserBehavior } from '../hooks/useRecommendations';
import OptimizedImage from './OptimizedImage';
import {
  AIRecommendationsContainer,
  AIHeader,
  AIIcon,
  AIHeaderText,
  RefreshBtn,
  LoadingState,
  LoadingSpinner,
  ErrorState,
  EmptyState,
  RecommendationsGrid,
  RecommendationCard,
  MatchScore,
  MatchScoreValue,
  MatchScoreLabel,
  CardImage,
  VRBadge,
  CardContent,
  CardTitle,
  CardPrice,
  CardFeatures,
  CardFeature
} from './AIRecommendations.styles';

export default function AIRecommendations({ onPropertyClick }) {
  const { recommendations, loading, error, refresh } = useRecommendations();
  const { trackPropertyView } = useUserBehavior();

  const handlePropertyClick = (property) => {
    trackPropertyView(property);
    onPropertyClick?.(property);
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <AIRecommendationsContainer>
        <AIHeader>
          <AIIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </AIIcon>
          <h2>AI-Powered Recommendations</h2>
        </AIHeader>
        <LoadingState>
          <LoadingSpinner />
          <p>Analyzing your preferences...</p>
        </LoadingState>
      </AIRecommendationsContainer>
    );
  }

  if (error) {
    return (
      <AIRecommendationsContainer>
        <ErrorState>
          <p>Unable to load recommendations</p>
          <button onClick={refresh}>Try Again</button>
        </ErrorState>
      </AIRecommendationsContainer>
    );
  }

  if (recommendations.length === 0) {
    return (
      <AIRecommendationsContainer>
        <AIHeader>
          <AIIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </AIIcon>
          <h2>Personalized For You</h2>
        </AIHeader>
        <EmptyState>
          <p>Browse more properties to get personalized recommendations</p>
        </EmptyState>
      </AIRecommendationsContainer>
    );
  }

  return (
    <AIRecommendationsContainer>
      <AIHeader>
        <AIIcon animated>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </AIIcon>
        <AIHeaderText>
          <h2>AI-Powered Picks For You</h2>
          <p>Based on your preferences and browsing history</p>
        </AIHeaderText>
        <RefreshBtn onClick={refresh}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </RefreshBtn>
      </AIHeader>

      <RecommendationsGrid>
        {recommendations.map((property, index) => (
          <RecommendationCard 
            key={property._id}
            delay={index * 0.1}
            onClick={() => handlePropertyClick(property)}
          >
            <MatchScore>
              <MatchScoreValue>{property.matchScore}%</MatchScoreValue>
              <MatchScoreLabel>Match</MatchScoreLabel>
            </MatchScore>
            
            <CardImage>
              <OptimizedImage
                src={property.images?.[0] || '/placeholder-property.jpg'}
                alt={property.title}
              />
              {property.virtualTour && (
                <VRBadge>360° Tour</VRBadge>
              )}
            </CardImage>

            <CardContent>
              <CardPrice>{formatPrice(property.price)}</CardPrice>
              <CardTitle>{property.title}</CardTitle>
              <p>{property.location}</p>

              <CardFeatures>
                <CardFeature>{property.bedrooms} Beds</CardFeature>
                <CardFeature>{property.bathrooms} Baths</CardFeature>
                <CardFeature>{property.area?.toLocaleString()} sqft</CardFeature>
              </CardFeatures>

              {property.matchReasons?.length > 0 && (
                <div>
                  {property.matchReasons.map((reason, i) => (
                    <span key={i} style={{ display: 'inline-block', marginRight: '8px', fontSize: '0.85rem' }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline', marginRight: '4px' }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {reason}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </RecommendationCard>
        ))}
      </RecommendationsGrid>
    </AIRecommendationsContainer>
  );
}
