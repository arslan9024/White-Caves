import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background: ${props => props.theme?.colors?.bgPrimary || '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#2c3e50'};
  margin: 0 0 1.5rem;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  background: ${props => props.theme?.colors?.surfaceAlt || '#f8f9fa'};
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const MetricLabel = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme?.colors?.textSecondary || '#666'};
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const Rating = styled.div`
  font-size: 2rem;
  color: ${props => props.theme?.colors?.danger || '#e41e3f'};
  font-weight: bold;
`;

export const MetricValue = styled.div`
  font-size: 1.8rem;
  color: ${props => props.theme?.colors?.text || '#2c3e50'};
  font-weight: bold;
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  margin: 0.5rem 0 0;
`;

export const RewardsSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#2c3e50'};
  margin: 0 0 1.5rem;
`;

export const RewardsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const RewardCard = styled.div`
  background: ${props => props.theme?.colors?.surfaceAlt || '#f8f9fa'};
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme?.colors?.danger || '#e41e3f'};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(228, 30, 63, 0.15);
    transform: translateY(-2px);
  }

  h5 {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme?.colors?.text || '#2c3e50'};
    font-weight: 600;
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: ${props => props.theme?.colors?.textSecondary || '#666'};
  }
`;

export const Points = styled.span`
  display: inline-block;
  background: ${props => props.theme?.colors?.danger || '#e41e3f'};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

export const ProgressBar = styled.div<{ percentage: number }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.percentage}%;
    background: ${props => props.theme?.colors?.success || '#4caf50'};
    transition: width 0.3s ease;
  }
`;

export const Badge = styled.span<{ variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0.25rem;

  ${props => {
    switch (props.variant) {
      case 'success':
        return `background: #4caf50; color: white;`;
      case 'warning':
        return `background: #ff9800; color: white;`;
      case 'danger':
        return `background: #f44336; color: white;`;
      default:
        return `background: #2196f3; color: white;`;
    }
  }}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};

  p {
    margin: 0;
    font-size: 1rem;
  }
`;
