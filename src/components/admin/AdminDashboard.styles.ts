import styled from 'styled-components';
import { theme } from '../../styles/theme/index';

const { colors, spacing, radius, shadows, transitions, mediaQueries, typography } = theme;
const typeSizes = typography?.sizes || {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  xxl: '1.5rem',
  xxxl: '2rem',
  display: '2.25rem',
};
const typeWeights = typography?.weights || {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};
const reducedMotion = `@media (prefers-reduced-motion: reduce)`;

export const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
  background: ${colors.background.primary};
  padding-top: 64px;
`;

export const AdminHeader = styled.div`
  position: sticky;
  top: 64px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.xl} ${spacing.lg};
  background: ${colors.background.secondary};
  border-bottom: 1px solid ${colors.border};
  backdrop-filter: blur(10px);

  ${mediaQueries.tablet} {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

export const AdminTitle = styled.div`
  h1 {
    margin: 0 0 ${spacing.xs} 0;
    font-size: ${typeSizes.xxxl};
    font-weight: ${typeWeights.bold};
    color: ${colors.text.primary};
  }

  p {
    margin: 0;
    font-size: ${typeSizes.base};
    color: ${colors.text.secondary};
  }
`;

export const AdminUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${spacing.xs};

  ${mediaQueries.tablet} {
    align-items: flex-start;
  }
`;

export const HeaderMeta = styled.span`
  font-size: ${typeSizes.xs};
  color: ${colors.text.tertiary};
  text-align: right;

  ${mediaQueries.tablet} {
    text-align: left;
  }
`;

export const UserName = styled.span`
  font-size: ${typeSizes.base};
  font-weight: ${typeWeights.semibold};
  color: ${colors.text.primary};
`;

export const UserRole = styled.span`
  font-size: ${typeSizes.xs};
  color: ${colors.primary};
  font-weight: ${typeWeights.medium};
`;

export const AdminTabs = styled.div`
  display: flex;
  gap: 0;
  padding: 0 ${spacing.lg};
  background: ${colors.background.secondary};
  border-bottom: 1px solid ${colors.border};
  overflow-x: auto;
  position: sticky;
  top: calc(64px + 96px);
  z-index: 2;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 999px;
  }

  ${mediaQueries.mobile} {
    padding: 0 ${spacing.md};
    top: calc(64px + 88px);
  }
`;

export const Tab = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.md} ${spacing.lg};
  background: none;
  border: none;
  border-bottom: 3px solid ${props => (props.$active ? colors.primary : 'transparent')};
  color: ${props => (props.$active ? colors.primary : colors.text.secondary)};
  font-size: ${typeSizes.base};
  font-weight: ${typeWeights.medium};
  cursor: pointer;
  transition: ${transitions.hover};
  white-space: nowrap;

  &:hover {
    color: ${colors.text.primary};
    border-bottom-color: ${props => (props.$active ? colors.primary : colors.border)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
    border-radius: ${radius.sm} ${radius.sm} 0 0;
  }

  ${reducedMotion} {
    transition: none;
  }

  ${mediaQueries.mobile} {
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typeSizes.sm};
  }
`;

export const AdminContent = styled.div`
  flex: 1;
  padding: ${spacing.xl} ${spacing.lg};
  overflow-y: auto;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;

  ${mediaQueries.mobile} {
    padding: ${spacing.lg} ${spacing.md};
  }
`;

export const AdminOverview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  background: ${colors.background.secondary};
  border-radius: ${radius.xl};
  padding: 20px;
  box-shadow: ${shadows.xs};
  transition: ${transitions.hover};
  border: 1px solid ${colors.border};

  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-2px);
  }

  ${reducedMotion} {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

export const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${radius.xl};
  margin-bottom: ${spacing.md};
  color: ${colors.primary};

  svg {
    flex-shrink: 0;
  }
`;

export const MetricTitle = styled.span`
  font-size: ${typeSizes.sm};
  font-weight: ${typeWeights.medium};
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const MetricValue = styled.div`
  font-size: ${typeSizes.display};
  font-weight: ${typeWeights.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

export const MetricSubtext = styled.div`
  font-size: ${typeSizes.sm};
  color: ${colors.text.tertiary};
  margin-bottom: ${radius.xl};
`;

export const MetricBar = styled.div`
  height: 4px;
  background: ${colors.border};
  border-radius: ${radius.xs};
  overflow: hidden;
`;

export const MetricBarFill = styled.div<{ $color?: string }>`
  height: 100%;
  background: ${props => props.$color || colors.primary};
  border-radius: ${radius.xs};
  transition: width ${transitions.durations.standard} ${transitions.easing.easeInOut};
`;

export const MetricStatus = styled.div<{ $status?: string }>`
  font-size: ${typeSizes.xl};
  font-weight: ${typeWeights.bold};
  color: ${props => {
    switch (props.$status) {
      case 'excellent':
        return colors.success;
      case 'good':
        return colors.info;
      case 'warning':
        return colors.warning;
      default:
        return colors.error;
    }
  }};
  margin-bottom: ${radius.xl};
`;

export const MetricDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${typeSizes.xs};
  color: ${colors.text.secondary};
`;

export const DetailValue = styled.span`
  font-weight: ${typeWeights.semibold};
  color: ${colors.text.primary};
`;

export const AlertsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${radius.xl};
  margin-bottom: ${spacing.md};

  h3 {
    margin: 0;
    font-size: ${typeSizes.lg};
    font-weight: ${typeWeights.semibold};
    color: ${colors.text.primary};
  }

  svg {
    color: ${colors.primary};
  }

  button {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    color: ${colors.text.secondary};
    transition: color ${transitions.durations.shorter} ${transitions.easing.easeOut};

    &:hover {
      color: ${colors.text.primary};
    }
  }

  ${mediaQueries.mobile} {
    align-items: flex-start;
    flex-direction: column;
    gap: ${spacing.sm};
  }
`;

export const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AlertItem = styled.div<{ $severity?: 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${radius.xl} ${spacing.md};
  background: ${props => (props.$severity === 'warning' ? '#FFF3E0' : '#E3F2FD')};
  border-left: 4px solid ${props => (props.$severity === 'warning' ? colors.warning : colors.info)};
  border-radius: ${radius.sm};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: ${props => (props.$severity === 'warning' ? '#FFE0B2' : '#BBDEFB')};
  }
`;

export const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${radius.xl};
  flex: 1;
`;

export const AlertMessage = styled.span`
  font-size: ${typeSizes.base};
  color: ${colors.text.primary};
  font-weight: ${typography.weights.medium};
`;

export const AlertStatus = styled.span<{ $status?: string }>`
  padding: 2px ${spacing.sm};
  border-radius: ${radius.xl};
  font-size: 11px;
  font-weight: ${typography.weights.semibold};
  text-transform: uppercase;
  background: ${props => (props.$status === 'active' ? 'rgba(227, 30, 36, 0.12)' : colors.border)};
  color: ${props => (props.$status === 'active' ? colors.primaryDark : '#616161')};
`;

export const ActivitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${radius.xl};
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.md};
  padding: ${radius.xl} ${spacing.md};
  background: ${colors.background.secondary};
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  transition: ${transitions.hover};

  &:hover {
    box-shadow: ${shadows.sm};
  }
`;

export const ActivityIcon = styled.div<{ type?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${radius.full};
  background: ${props => {
    switch (props.type) {
      case 'create':
        return '#E8F5E9';
      case 'update':
        return '#E3F2FD';
      case 'download':
        return '#FFF3E0';
      case 'system':
        return '#F3E5F5';
      default:
        return colors.background.tertiary;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'create':
        return colors.success;
      case 'update':
        return colors.info;
      case 'download':
        return colors.warning;
      case 'system':
        return '#9C27B0';
      default:
        return colors.text.secondary;
    }
  }};
  flex-shrink: 0;
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityUser = styled.div`
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.semibold};
  color: ${colors.text.primary};
  margin-bottom: 2px;
`;

export const ActivityAction = styled.div`
  font-size: ${typography.sizes.sm};
  color: ${colors.text.secondary};
`;

export const ActivityTime = styled.div`
  font-size: ${typography.sizes.xs};
  color: ${colors.text.tertiary};
  white-space: nowrap;
`;

export const AdminUsers = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

export const UsersTable = styled.div`
  background: ${colors.background.secondary};
  border-radius: ${radius.lg};
  overflow: auto;
  box-shadow: ${shadows.sm};

  table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;

    thead {
      background: ${colors.background.tertiary};
    }

    th {
      padding: ${spacing.md};
      text-align: left;
      font-size: ${typography.sizes.xs};
      font-weight: ${typography.weights.semibold};
      color: ${colors.text.secondary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid ${colors.border};
    }

    td {
      padding: ${spacing.md};
      border-bottom: 1px solid ${colors.border};
      font-size: ${typography.sizes.base};
      color: ${colors.text.primary};
    }

    tbody tr:hover {
      background: ${colors.background.tertiary};
    }
  }
`;

export const RoleBadge = styled.span<{ $role?: string }>`
  display: inline-block;
  padding: ${spacing.xs} ${radius.xl};
  border-radius: ${radius.xl};
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.semibold};
  background: ${props => {
    switch (props.$role) {
      case 'agent':
        return '#E3F2FD';
      case 'admin':
        return '#FCE4EC';
      default:
        return colors.background.tertiary;
    }
  }};
  color: ${props => {
    switch (props.$role) {
      case 'agent':
        return colors.info;
      case 'admin':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  }};
`;

export const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: ${spacing.xs} ${radius.xl};
  border-radius: ${radius.xl};
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.semibold};
  background: ${props => (props.$status === 'active' ? '#E8F5E9' : '#FFEBEE')};
  color: ${props => (props.$status === 'active' ? colors.success : colors.error)};
`;

export const ActionBtn = styled.button<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.md};
  margin-right: ${spacing.xs};
  margin-bottom: ${spacing.xs};
  border: none;
  border-radius: ${radius.sm};
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.medium};
  cursor: pointer;
  background: ${props => (props.$danger ? '#FFEBEE' : '#E3F2FD')};
  color: ${props => (props.$danger ? colors.error : colors.info)};
  transition: ${transitions.hover};

  &:hover {
    background: ${props => (props.$danger ? '#FFCDD2' : '#BBDEFB')};
  }
`;

export const AdminSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

export const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.md};

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const StatusItem = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing.md};
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
`;

export const StatusLabel = styled.div`
  font-size: ${typography.sizes.xs};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatusValue = styled.div`
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.weights.bold};
  color: ${colors.text.primary};
`;

export const StatusValueSuccess = styled(StatusValue)`
  color: ${colors.success};
`;

export const SettingsGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

export const SettingGroup = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing.lg};
  border-radius: ${radius.lg};
  box-shadow: ${shadows.sm};

  h4 {
    margin: 0 0 20px 0;
    font-size: ${typography.sizes.md};
    font-weight: ${typography.weights.semibold};
    color: ${colors.text.primary};
    border-bottom: 1px solid ${colors.border};
    padding-bottom: ${radius.xl};
  }
`;

export const SettingItem = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: ${typography.sizes.base};
    font-weight: ${typography.weights.medium};
    color: ${colors.text.primary};
    margin-bottom: ${spacing.sm};
  }

  input,
  select {
    width: 100%;
    padding: ${spacing.sm} ${radius.xl};
    border: 1px solid ${colors.border};
    border-radius: ${radius.sm};
    font-size: ${typography.sizes.base};
    transition: border-color ${transitions.durations?.short || '0.2s'};

    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }
  }

  input[type='checkbox'] {
    width: auto;
    margin-right: ${spacing.sm};
  }
`;

export const BtnPrimary = styled.button`
  padding: ${radius.xl} ${spacing.lg};
  background: ${colors.primary};
  color: ${colors.background.secondary};
  border: none;
  border-radius: ${radius.sm};
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.semibold};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: ${colors.primaryDark};
    box-shadow: ${shadows.luxuryGlow};
  }
`;

export const BtnSecondary = styled.button`
  padding: ${radius.xl} ${spacing.lg};
  background: ${colors.background.tertiary};
  color: ${colors.text.primary};
  border: none;
  border-radius: ${radius.sm};
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  transition: ${transitions.hover};
  white-space: nowrap;

  &:hover {
    background: ${colors.border};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.8;
  }

  ${mediaQueries.mobile} {
    width: 100%;
    justify-content: center;
  }
`;

export const AdminAnalytics = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

export const FilterSelect = styled.select`
  padding: ${spacing.sm} ${radius.xl};
  margin-left: auto;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  font-size: ${typography.sizes.base};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  ${mediaQueries.tablet} {
    margin-left: 0;
    width: 100%;
  }
`;

export const AnalyticsCharts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing.lg};

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const ChartContainer = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing.lg};
  border-radius: ${radius.lg};
  box-shadow: ${shadows.sm};

  h4 {
    margin: 0 0 ${spacing.md} 0;
    font-size: ${typography.sizes.md};
    font-weight: ${typography.weights.semibold};
    color: ${colors.text.primary};
  }
`;

export const ChartPlaceholder = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: ${spacing.md} 0;

  ${mediaQueries.mobile} {
    height: 160px;
  }
`;

export const ChartBar = styled.div<{ $height?: string }>`
  width: 20%;
  height: ${props => props.$height || '50%'};
  background: ${colors.luxury.goldDark};
  border-radius: ${radius.sm} ${radius.sm} 0 0;
  transition: ${transitions.hover};

  &:hover {
    opacity: 0.8;
  }
`;

export const PaginationContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;

  ${mediaQueries.mobile} {
    justify-content: center;
  }
`;

export const ReportActions = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

export const AlertIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${colors.warning};
`;

export const AlertClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  font-size: ${typography.sizes.xl};
  cursor: pointer;
  color: ${colors.text.secondary};
  transition: color ${transitions.durations?.short || '0.2s'};
  flex-shrink: 0;

  &:hover {
    color: ${colors.text.primary};
  }
`;

export const SaveBtn = styled.button`
  padding: ${radius.xl} ${spacing.lg};
  background: ${colors.primary};
  color: ${colors.background.secondary};
  border: none;
  border-radius: ${radius.sm};
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.semibold};
  cursor: pointer;
  transition: ${transitions.hover};
  margin-top: ${radius.xl};

  &:hover {
    background: ${colors.primaryDark};
    box-shadow: ${shadows.luxuryGlow};
  }

  ${mediaQueries.mobile} {
    width: 100%;
    justify-content: center;
  }
`;
