// @ts-nocheck
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { spacing, radius, shadows, transitions, colors, mediaQueries } = theme;

/* ═══ Motion a11y ══════════════════════════════════
   Reduce all transforms / animations for users who
   prefer reduced motion (OS-level setting).          */
const reducedMotion = `@media (prefers-reduced-motion: reduce)`;

// ==============================================================================
// MAIN CONTAINER
// ==============================================================================

export const DepartmentPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${colors.background.secondary};
  border-radius: ${radius.xl};
  overflow-y: auto;
  box-shadow: ${shadows.card};

  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: ${spacing.sm};
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: ${radius.sm};

    &:hover {
      background: ${colors.text.secondary};
    }
  }

  /* Dark Mode */
  [data-theme='dark'] & {
    background: ${colors.background.dark};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  /* Empty State Styles */
  &.empty {
    align-items: center;
    justify-content: center;
  }
`;

// ==============================================================================
// HEADER
// ==============================================================================

export const ContentHeader = styled.div`
  padding: ${spacing.xl} 28px;
  color: ${colors.text.inverse};
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
    border-radius: ${radius.full};
    z-index: 0;
  }

  ${mediaQueries.tablet} {
    padding: ${spacing.lg} 20px;
  }

  ${mediaQueries.mobile} {
    padding: ${spacing.md} 12px;
  }
`;

export const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const ContentBreadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.sm};
  opacity: 0.9;
  font-size: 12px;

  ${mediaQueries.tablet} {
    font-size: 11px;
  }
`;

export const BreadcrumbItem = styled.span<{ $isCurrent?: boolean }>`
  font-weight: ${props => (props.$isCurrent ? 700 : 500)};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const BreadcrumbSeparator = styled.span`
  opacity: 0.7;
`;

export const HeaderTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 ${spacing.sm} 0;
  letter-spacing: -0.5px;

  ${mediaQueries.tablet} {
    font-size: 24px;
  }

  ${mediaQueries.mobile} {
    font-size: 18px;
  }
`;

export const HeaderDescription = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.95;
  font-weight: 400;

  ${mediaQueries.mobile} {
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
  gap: ${spacing.xl};

  ${mediaQueries.tablet} {
    padding: 20px;
    gap: ${spacing.lg};
  }

  ${mediaQueries.mobile} {
    padding: 12px;
    gap: ${spacing.md};
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
  color: ${colors.text.secondary};

  ${mediaQueries.tablet} {
    padding: 40px ${spacing.lg};
  }

  ${mediaQueries.mobile} {
    padding: 30px 20px;
  }
`;

export const EmptyStateIcon = styled.svg`
  color: ${colors.border};
  margin-bottom: ${spacing.lg};
  opacity: 0.5;

  ${mediaQueries.tablet} {
    width: 48px;
    height: 48px;
  }
`;

export const EmptyStateHeading = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 ${radius.xl} 0;
  color: ${colors.text.primary};

  ${mediaQueries.tablet} {
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
  border-bottom: 2px solid ${colors.border};
  padding-bottom: 20px;
`;

export const ServiceTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 ${spacing.sm} 0;
  color: ${colors.text.primary};
`;

export const ServiceDescription = styled.p`
  margin: 0;
  color: ${colors.text.secondary};
  font-size: 14px;
`;

// ==============================================================================
// STATS GRID
// ==============================================================================

export const StatsGrid = styled.div<{ $isServiceStats?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => (props.$isServiceStats ? radius.xl : spacing.md)};

  ${mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${colors.background.tertiary};
  padding: ${spacing.md};
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  text-align: center;
  transition: ${transitions.hover};

  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${shadows.luxuryCard};
  }

  ${reducedMotion} {
    transition: none;
  }

  /* Dark Mode */
  [data-theme='dark'] & {
    background: ${colors.background.darkSecondary};
    border-color: #333333;
  }
`;

export const StatLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.sm};
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.text.primary};
`;

// ==============================================================================
// OVERVIEW SECTION
// ==============================================================================

export const OverviewSection = styled.div`
  margin-top: ${radius.xl};
`;

export const OverviewHeading = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 ${radius.xl} 0;
  color: ${colors.text.primary};
`;

export const OverviewText = styled.p`
  color: ${colors.text.secondary};
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
  margin: 0 0 ${spacing.md} 0;
  color: ${colors.text.primary};
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${spacing.md};

  ${mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const MetricCard = styled.div`
  background: linear-gradient(
    135deg,
    ${colors.background.tertiary} 0%,
    ${colors.primaryVeryLight} 100%
  );
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  gap: ${radius.xl};
  transition: ${transitions.hover};
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: ${colors.primary};
    box-shadow: ${shadows.luxuryCard};
  }

  ${reducedMotion} {
    transition: none;
    &:hover {
      transform: none;
    }
  }

  /* Dark Mode */
  [data-theme='dark'] & {
    background: linear-gradient(
      135deg,
      ${colors.background.darkSecondary} 0%,
      rgba(227, 30, 36, 0.04) 100%
    );
    border-color: #333333;
  }
`;

export const MetricLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: ${colors.text.secondary};
`;

export const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.text.primary};
  line-height: 1;

  ${mediaQueries.mobile} {
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
        return colors.status.active;
      case 'down':
        return colors.error;
      case 'stable':
      default:
        return colors.text.secondary;
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
  gap: ${spacing.lg};
  margin-top: ${spacing.md};
`;

// ==============================================================================
// SERVICES SECTION
// ==============================================================================

export const ServicesSection = styled.div``;

export const ServicesSectionHeading = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 ${spacing.md} 0;
  color: ${colors.text.primary};
`;

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: ${spacing.md};

  ${mediaQueries.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const ServiceCard = styled.div`
  background: ${colors.background.tertiary};
  border: 2px solid ${colors.border};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: ${radius.xl};
  transition: ${transitions.hover};
  cursor: pointer;
  user-select: none;
  outline: none;

  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${shadows.luxuryCard};
    transform: translateY(-4px);
  }

  &:focus-visible {
    border-color: ${colors.primary};
    box-shadow: ${shadows.luxuryFocus};
  }

  ${reducedMotion} {
    transition: none;
    &:hover {
      transform: none;
    }
  }

  /* Dark Mode */
  [data-theme='dark'] & {
    background: ${colors.background.darkSecondary};
    border-color: #333333;
  }
`;

export const ServiceCardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;

  ${mediaQueries.mobile} {
    font-size: 14px;
  }
`;

export const ServiceCardDescription = styled.p`
  font-size: 13px;
  color: ${colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

export const ServiceCardAction = styled.button`
  background: transparent;
  border: none;
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  padding: ${spacing.xs} 0;
  margin-top: ${spacing.xs};
  transition: ${transitions.active};
  text-align: left;
  outline: none;

  &:hover {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
    border-radius: ${radius.sm};
  }

  ${reducedMotion} {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

// ==============================================================================
// ACTIONS SECTION
// ==============================================================================

export const ActionsSection = styled.div``;

export const ActionsSectionHeading = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 ${radius.xl} 0;
  color: ${colors.text.primary};
`;

export const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;

  ${mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  padding: ${radius.xl} ${spacing.md};
  min-height: 44px;
  background: ${colors.background.tertiary};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  cursor: pointer;
  color: ${colors.text.primary};
  font-size: 13px;
  font-weight: 500;
  transition: ${transitions.hover};
  outline: none;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: ${colors.primary};
    color: ${colors.text.inverse};
    border-color: ${colors.primary};
    transform: translateY(-2px);
    box-shadow: ${shadows.luxuryCard};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${shadows.active};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  ${reducedMotion} {
    transition: none;
    &:hover {
      transform: none;
    }
  }

  /* Dark Mode */
  [data-theme='dark'] & {
    background: ${colors.background.darkSecondary};
    border-color: #333333;
  }
`;

