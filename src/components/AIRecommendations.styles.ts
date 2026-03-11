import styled from 'styled-components';
import { keyframes } from 'styled-components';

// Keyframe animations
const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(212, 175, 55, 0);
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Main container
export const AIRecommendationsContainer = styled.div`
  padding: 40px 20px;
  background: linear-gradient(180deg, transparent, rgba(212, 175, 55, 0.03));
`;

export const AIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

export const AIIcon = styled.div<{ animated?: boolean }>`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #D4AF37, #F4D03F);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${animated ? pulse : 'none'} 2s infinite;

  svg {
    width: 24px;
    height: 24px;
    color: #1a1a2e;
  }
`;

export const AIHeaderText = styled.div`
  h2 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0;
  }

  p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 4px 0 0;
  }
`;

export const RefreshBtn = styled.button`
  margin-left: auto;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    color: var(--text-primary);
  }

  &:hover {
    background: #D4AF37;
    border-color: #D4AF37;

    svg {
      color: #1a1a2e;
    }
  }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);

  button {
    margin-top: 15px;
    padding: 10px 25px;
    background: #D4AF37;
    border: none;
    border-radius: 8px;
    color: #1a1a2e;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #b8860b;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);

  button {
    margin-top: 15px;
    padding: 10px 25px;
    background: #D4AF37;
    border: none;
    border-radius: 8px;
    color: #1a1a2e;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #b8860b;
    }
  }
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: #D4AF37;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: ${spin} 1s linear infinite;
`;

export const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const RecommendationCard = styled.div<{ delay?: number }>`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${props => props.delay ? `${props.delay}s` : '0s'};
  opacity: 0;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    border-color: #D4AF37;
  }
`;

export const MatchScore = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 2;
  background: linear-gradient(135deg, #D4AF37, #F4D03F);
  border-radius: 10px;
  padding: 8px 12px;
  text-align: center;
  min-width: 50px;
`;

export const MatchScoreValue = styled.span`
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1;
`;

export const MatchScoreLabel = styled.span`
  display: block;
  font-size: 0.65rem;
  color: #1a1a2e;
  opacity: 0.8;
  text-transform: uppercase;
  margin-top: 2px;
`;

export const CardImage = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
`;

export const VRBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: linear-gradient(135deg, #D4AF37, #F4D03F);
  color: #1a1a2e;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 3;
`;

export const CardContent = styled.div`
  padding: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
`;

export const CardPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #D4AF37;
  margin-bottom: 12px;
`;

export const CardFeatures = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const CardFeature = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
