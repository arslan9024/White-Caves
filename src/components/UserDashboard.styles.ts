import styled from 'styled-components';

export const UserDashboard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

export const DashboardLoading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--border, rgba(0, 0, 0, 0.1));
  border-top-color: var(--primary, #c9a962);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const DashboardHeader = styled.div`
  margin-bottom: 32px;
`;

export const DashboardWelcome = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const UserAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary, #c9a962), #b08d4a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  flex-shrink: 0;
`;

export const WelcomeText = styled.div`
  h2 {
    margin: 0 0 4px 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary, #1a1a2e);
  }

  p {
    margin: 0;
    color: var(--text-secondary, #6b7280);
    font-size: 1rem;
  }

  [data-theme='dark'] & h2 {
    color: white;
  }

  [data-theme='dark'] & p {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const DashboardTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  padding-bottom: 0;
  margin-bottom: 24px;
  overflow-x: auto;

  [data-theme='dark'] & {
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

export const DashboardTab = styled.button<{ isActive: boolean }>`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary, #6b7280);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }

  &:hover {
    color: var(--text-primary, #1a1a2e);
  }

  [data-theme='dark'] &:hover {
    color: white;
  }

  ${props => props.isActive && `
    color: var(--primary, #c9a962);
    border-bottom-color: var(--primary, #c9a962);
  `}

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
`;

export const TabIcon = styled.span`
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const TabLabel = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const TabCount = styled.span`
  background: var(--primary, #c9a962);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const DashboardContent = styled.div`
  min-height: 400px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const StatCard = styled.div`
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
`;

export const StatIcon = styled.div`
  font-size: 2rem;
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary, #1a1a2e);

  [data-theme='dark'] & {
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const StatLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const OverviewSections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

export const OverviewSection = styled.div`
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  padding: 20px;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  h3 {
    margin: 0 0 16px 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
  }

  [data-theme='dark'] & h3 {
    color: white;
  }
`;

export const MiniPropertyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MiniPropertyCard = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const MiniPropertyImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

export const MiniPropertyInfo = styled.div`
  h4 {
    margin: 0 0 4px 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
    line-height: 1.3;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--primary, #c9a962);
    font-weight: 600;
  }

  [data-theme='dark'] & h4 {
    color: white;
  }
`;

export const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AlertItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--surface-alt, #f5f5f7);
  border-radius: 8px;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const AlertName = styled.span`
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);

  [data-theme='dark'] & {
    color: white;
  }
`;

export const AlertFrequency = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted, #9ca3af);
  background: var(--surface, #ffffff);
  padding: 4px 8px;
  border-radius: 4px;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const EmptyMessage = styled.p`
  color: var(--text-muted, #9ca3af);
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
  margin: 0;
`;

export const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FavoriteCard = styled.div`
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

export const FavoriteImage = styled.div`
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
`;

export const RemoveFavorite = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #ef4444;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: white;
    transform: scale(1.1);
  }
`;

export const FavoriteDetails = styled.div`
  padding: 16px;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
    line-height: 1.4;
  }

  [data-theme='dark'] & h4 {
    color: white;
  }
`;

export const FavoriteLocation = styled.p`
  margin: 0 0 12px 0;
  color: var(--text-secondary, #6b7280);
  font-size: 0.9rem;
`;

export const FavoriteSpecs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const FavoritePrice = styled.p`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary, #c9a962);
`;

export const FavoriteDate = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted, #9ca3af);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: var(--surface-alt, #f5f5f7);
  border-radius: 16px;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
  }

  h4 {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
    color: var(--text-primary, #1a1a2e);
  }

  p {
    margin: 0;
    color: var(--text-secondary, #6b7280);
  }

  [data-theme='dark'] & h4 {
    color: white;
  }
`;

export const EmptyIcon = styled.span`
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
`;

export const SearchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SearchCard = styled.div`
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const AlertCard = styled.div<{ isInactive?: boolean }>`
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  opacity: ${props => (props.isInactive ? 0.6 : 1)};

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SearchInfo = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
  }

  [data-theme='dark'] & h4 {
    color: white;
  }
`;

export const AlertInfo = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
  }

  [data-theme='dark'] & h4 {
    color: white;
  }
`;

export const SearchCriteria = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

export const CriteriaTag = styled.span`
  background: var(--surface-alt, #f5f5f7);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const SearchDate = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted, #9ca3af);
  margin: 0;
`;

export const SearchActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const RunSearchBtn = styled.button`
  padding: 8px 16px;
  background: var(--primary, #c9a962);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #b08d4a;
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const DeleteSearchBtn = styled.button`
  padding: 8px 16px;
  background: none;
  color: var(--text-muted, #9ca3af);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const AlertType = styled.p`
  font-size: 0.85rem;
  color: var(--primary, #c9a962);
  margin: 0 0 8px 0;
  text-transform: capitalize;
`;

export const AlertCriteria = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const AlertFrequencyInfo = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted, #9ca3af);
  margin: 0;
  text-transform: capitalize;
`;

export const AlertControls = styled.div`
  flex-shrink: 0;
`;

export const AlertToggle = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border, #ccc);
  border-radius: 26px;
  transition: 0.3s;

  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
  }

  input:checked + & {
    background-color: var(--primary, #c9a962);
  }

  input:checked + &:before {
    transform: translateX(22px);
  }
`;

export const ActivityTimeline = styled.div`
  position: relative;
  padding-left: 32px;

  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border, rgba(0, 0, 0, 0.1));
  }

  [data-theme='dark'] &::before {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ActivityItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -25px;
    top: 24px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary, #c9a962);
    border: 2px solid var(--surface, #ffffff);
  }

  [data-theme='dark'] &::before {
    border-color: var(--surface-dark, #1a1a2e);
  }
`;

export const ActivityIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

export const ActivityContent = styled.div`
  p {
    margin: 0 0 4px 0;
    color: var(--text-primary, #1a1a2e);
    font-size: 0.95rem;
  }

  strong {
    color: var(--primary, #c9a962);
  }

  [data-theme='dark'] & p {
    color: white;
  }
`;

export const ActivityTime = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted, #9ca3af);
`;
