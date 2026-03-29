import styled from 'styled-components';

// ==============================================================================
// MAIN CONTAINER
// ==============================================================================

export const DepartmentPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--white-bg);
  border-radius: 12px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-gray);
    border-radius: 4px;

    &:hover {
      background: var(--text-secondary);
    }
  }

  /* Dark Mode */
  [data-theme="dark"] & {
    background: #1E1E1E;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  /* Empty State Styles */
  &.empty {
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 1024px) {
  }

  @media (max-width: 768px) {
  }

  @media (max-width: 480px) {
  }
`;

// ==============================================================================
// HEADER
// ==============================================================================

export const ContentHeader = styled.div`
  padding: 32px 28px;
  color: white;
  position: relative;
  overflow: hidden;

  /* Circular background decoration */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    z-index: 0;
  }

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

export const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const HeaderTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;

  @media (max-width: 1024px) {
    font-size: 26px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const HeaderDescription = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.95;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// ==============================================================================
// CONTENT BODY
// ==============================================================================

export const ContentBody = styled.div`
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 1024px) {
    padding: 20px;
    gap: 24px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 20px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 16px;
  }
`;

// ==============================================================================
// EMPTY STATE
// ==============================================================================

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
  color: var(--text-secondary);

  @media (max-width: 768px) {
    padding: 40px 24px;
  }

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

export const EmptyStateIcon = styled.svg`
  color: var(--border-gray);
  margin-bottom: 24px;
  opacity: 0.5;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

export const EmptyStateHeading = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text-primary);

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  max-width: 400px;
  opacity: 0.7;
`;

// ==============================================================================
// SERVICE CONTENT
// ==============================================================================

export const ServiceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const ServiceHeader = styled.div`
  border-bottom: 2px solid var(--border-gray);
  padding-bottom: 20px;
`;

export const ServiceTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
`;

export const ServiceDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
`;

// ==============================================================================
// STATS GRID
// ==============================================================================

export const StatsGrid = styled.div<{ $isServiceStats?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => (props.$isServiceStats ? '12px' : '16px')};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: var(--light-gray);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-gray);
  text-align: center;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary-red);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.1);
  }

  /* Dark Mode */
  [data-theme="dark"] & {
    background: #2A2A2A;
    border-color: #333333;
  }
`;

export const StatLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
`;

// ==============================================================================
// OVERVIEW SECTION
// ==============================================================================

export const OverviewSection = styled.div`
  margin-top: 12px;
`;

export const OverviewHeading = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text-primary);
`;

export const OverviewText = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0;
`;

// ==============================================================================
// METRICS SECTION
// ==============================================================================

export const MetricsSection = styled.div``;

export const MetricsSectionHeading = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  background: linear-gradient(135deg, var(--light-gray) 0%, rgba(211, 47, 47, 0.02) 100%);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--border-gray);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all var(--transition-normal);
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--primary-red);
    box-shadow: 0 8px 20px rgba(211, 47, 47, 0.15);
  }

  /* Dark Mode */
  [data-theme="dark"] & {
    background: linear-gradient(135deg, #2A2A2A 0%, rgba(211, 47, 47, 0.05) 100%);
    border-color: #333333;
  }
`;

export const MetricLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: var(--text-secondary);
`;

export const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const MetricChange = styled.div<{ $trend?: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    switch (props.$trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      case 'stable':
      default:
        return 'var(--text-secondary)';
    }
  }};

  svg {
    flex-shrink: 0;
  }
`;

// ==============================================================================
// ANALYTICS SECTION
// ==============================================================================

export const AnalyticsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
`;

// ==============================================================================
// SERVICES SECTION
// ==============================================================================

export const ServicesSection = styled.div``;

export const ServicesSectionHeading = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
`;

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ServiceCard = styled.div`
  background: var(--light-gray);
  border: 2px solid var(--border-gray);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all var(--transition-normal);
  cursor: pointer;
  user-select: none;
  outline: none;

  &:hover {
    border-color: var(--primary-red);
    box-shadow: 0 8px 20px rgba(211, 47, 47, 0.1);
    transform: translateY(-4px);
  }

  &:focus {
    border-color: var(--primary-red);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.2);
    outline: none;
  }

  &:focus-visible {
    border-color: var(--primary-red);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.2);
  }

  /* Dark Mode */
  [data-theme="dark"] & {
    background: #2A2A2A;
    border-color: #333333;
  }

  @media (max-width: 480px) {
  }
`;

export const ServiceCardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const ServiceCardDescription = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

export const ServiceCardAction = styled.button`
  background: transparent;
  border: none;
  color: var(--primary-red);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-top: 4px;
  transition: all var(--transition-fast);
  text-align: left;

  &:hover {
    transform: translateX(4px);
  }
`;

// ==============================================================================
// ACTIONS SECTION
// ==============================================================================

export const ActionsSection = styled.div``;

export const ActionsSectionHeading = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text-primary);
`;

export const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--light-gray);
  border: 1px solid var(--border-gray);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition-fast);
  outline: none;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: var(--primary-red);
    color: white;
    border-color: var(--primary-red);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(211, 47, 47, 0.15);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-red);
    outline-offset: 2px;
  }

  /* Dark Mode */
  [data-theme="dark"] & {
    background: #2A2A2A;
    border-color: #333333;
  }
`;
