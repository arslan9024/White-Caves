import styled from 'styled-components';
import { typography } from '../styles/theme/typography';
import { transitions } from '../styles/theme/transitions';
import { radius } from '../styles/theme/radius';

export const OffplanTrackerContainer = styled.div`
  padding: 3rem 5%;
  background: var(--bg-light, #f7fafc);

  @media (max-width: 768px) {
    padding: 1.5rem 5%;
  }
`;

export const TrackerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderContent = styled.div``;

export const HeaderTitle = styled.h2`
  font-family: ${typography.fontFamily.heading};
  font-size: 2rem;
  color: var(--primary-color, #1a365d);
  margin-bottom: 0.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const HeaderSubtitle = styled.p`
  color: var(--text-muted, #718096);
  margin: 0;
`;

export const TrackerStats = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

export const StatBadge = styled.div`
  background: var(--bg-primary, #ffffff);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg, 0.75rem);
  box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.06));
  text-align: center;

  @media (max-width: 768px) {
    flex: 1;
    min-width: 100px;
  }
`;

export const StatNumber = styled.div`
  display: block;
  font-family: ${typography.fontFamily.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary-color, #c53030);
`;

export const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted, #718096);
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color, #e2e8f0);
    border-radius: 2px;
  }
`;

export const FilterTab = styled.button<{ $isActive?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$isActive ? 'var(--primary-color, #1a365d)' : 'var(--bg-primary, #ffffff)'};
  border: 1px solid ${props => props.$isActive ? 'var(--primary-color, #1a365d)' : 'var(--border-color, #e2e8f0)'};
  border-radius: 9999px;
  font-family: ${typography.fontFamily.primary};
  font-size: 0.9rem;
  color: ${props => props.$isActive ? 'var(--text-on-primary, #ffffff)' : 'var(--text-primary, #1a202c)'};
  cursor: pointer;
  transition: ${transitions.hover};
  white-space: nowrap;

  &:hover {
    border-color: var(--primary-color, #1a365d);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const ProjectCard = styled.div`
  background: var(--bg-primary, #ffffff);
  border-radius: var(--radius-lg, 0.75rem);
  overflow: hidden;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
  transition: ${transitions.all};

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl, 0 16px 40px rgba(0, 0, 0, 0.12));
  }
`;

export const ProjectImage = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${ProjectCard}:hover & img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 150px;
  }
`;

export const ProjectBadge = styled.span<{ $variant?: 'status' | 'segment' }>`
  position: absolute;
  ${props => props.$variant === 'segment' ? 'top: 1rem; right: 1rem;' : 'top: 1rem; left: 1rem;'}
  padding: 0.5rem 1rem;
  background: ${props => props.$variant === 'segment' ? 'rgba(26, 54, 93, 0.9)' : 'var(--secondary-color, #c53030)'};
  color: var(--text-on-primary, #ffffff);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 9999px;
`;

export const ProjectContent = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const DeveloperInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
`;

export const DeveloperLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const DeveloperName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
`;

export const ProjectTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ProjectLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

export const LocationIcon = styled.span`
  color: var(--secondary-color, #c53030);
`;

export const ProjectDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-light, #f7fafc);
  border-radius: var(--radius-md);
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted, #718096);
`;

export const DetailValue = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
`;

export const ProjectPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--secondary-color, #c53030);
  margin-bottom: 1rem;
`;

export const FeaturesChip = styled.span`
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: var(--bg-light, #f7fafc);
  border-radius: ${radius.md};
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${props => props.$variant === 'secondary' ? 'var(--bg-light, #f7fafc)' : 'var(--primary-color, #1a365d)'};
  color: ${props => props.$variant === 'secondary' ? 'var(--text-primary)' : 'white'};
  border: ${props => props.$variant === 'secondary' ? '1px solid var(--border-color, #e2e8f0)' : 'none'};
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    ${props => props.$variant === 'secondary'
      ? 'background: var(--bg-tertiary, #edf2f7); border-color: var(--primary-color, #1a365d);'
      : 'background: var(--primary-dark, #0f2847);'
    }
  }
`;

export const Countdown = styled.div`
  background: var(--bg-light, #f7fafc);
  padding: 1rem;
  border-radius: var(--radius-md);
  text-align: center;
`;

export const CountdownLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted, #718096);
  margin-bottom: 0.5rem;
`;

export const CountdownTimer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
`;

export const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TimeValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--secondary-color, #c53030);
`;

export const TimeLabel = styled.span`
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
`;

export const PaymentPlan = styled.div`
  padding: 0.75rem 1rem;
  background: #f0f4ff;
  border-left: 3px solid var(--primary-color, #1a365d);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--text-primary);

  strong {
    color: var(--primary-color, #1a365d);
  }
`;
