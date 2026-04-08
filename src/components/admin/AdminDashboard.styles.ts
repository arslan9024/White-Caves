import styled from 'styled-components';

export const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
  background: #FAFAFA;
  padding-top: 64px;
`;

export const AdminHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 24px;
  background: white;
  border-bottom: 1px solid #E0E0E0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const AdminTitle = styled.div`
  h1 {
    margin: 0 0 4px 0;
    font-size: 28px;
    font-weight: 700;
    color: #212121;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #757575;
  }
`;

export const AdminUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #212121;
`;

export const UserRole = styled.span`
  font-size: 12px;
  color: #D4AF37;
  font-weight: 500;
`;

export const AdminTabs = styled.div`
  display: flex;
  gap: 0;
  padding: 0 24px;
  background: white;
  border-bottom: 1px solid #E0E0E0;
  overflow-x: auto;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#D4AF37' : 'transparent'};
  color: ${props => props.$active ? '#D4AF37' : '#757575'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #212121;
    border-bottom-color: ${props => props.$active ? '#D4AF37' : '#E0E0E0'};
  }
`;

export const AdminContent = styled.div`
  flex: 1;
  padding: 32px 24px;
  overflow-y: auto;
`;

export const AdminOverview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

export const MetricCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  border: 1px solid #E0E0E0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

export const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #D4AF37;

  svg {
    flex-shrink: 0;
  }
`;

export const MetricTitle = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #212121;
  margin-bottom: 4px;
`;

export const MetricSubtext = styled.div`
  font-size: 13px;
  color: #9E9E9E;
  margin-bottom: 12px;
`;

export const MetricBar = styled.div`
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  overflow: hidden;
`;

export const MetricBarFill = styled.div<{ $color?: string }>`
  height: 100%;
  background: ${props => props.$color || '#D4AF37'};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

export const MetricStatus = styled.div<{ $status?: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => {
    switch (props.$status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#2196F3';
      case 'warning': return '#FF9800';
      default: return '#D32F2F';
    }
  }};
  margin-bottom: 12px;
`;

export const MetricDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #757575;
`;

export const DetailValue = styled.span`
  font-weight: 600;
  color: #212121;
`;

export const AlertsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #212121;
  }

  svg {
    color: #D4AF37;
  }

  button {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    color: #757575;
    transition: color 0.2s;

    &:hover {
      color: #212121;
    }
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
  padding: 12px 16px;
  background: ${props => props.$severity === 'warning' ? '#FFF3E0' : '#E3F2FD'};
  border-left: 4px solid ${props => props.$severity === 'warning' ? '#FF9800' : '#2196F3'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$severity === 'warning' ? '#FFE0B2' : '#BBDEFB'};
  }
`;

export const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const AlertMessage = styled.span`
  font-size: 14px;
  color: #212121;
  font-weight: 500;
`;

export const AlertStatus = styled.span<{ $status?: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.$status === 'active' ? 'rgba(212, 175, 55, 0.12)' : '#E0E0E0'};
  color: ${props => props.$status === 'active' ? '#B8960C' : '#616161'};
`;

export const ActivitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ActivityIcon = styled.div<{ type?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'create': return '#E8F5E9';
      case 'update': return '#E3F2FD';
      case 'download': return '#FFF3E0';
      case 'system': return '#F3E5F5';
      default: return '#EEEEEE';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'create': return '#4CAF50';
      case 'update': return '#2196F3';
      case 'download': return '#FF9800';
      case 'system': return '#9C27B0';
      default: return '#757575';
    }
  }};
  flex-shrink: 0;
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityUser = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 2px;
`;

export const ActivityAction = styled.div`
  font-size: 13px;
  color: #757575;
`;

export const ActivityTime = styled.div`
  font-size: 12px;
  color: #9E9E9E;
  white-space: nowrap;
`;

export const AdminUsers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const UsersTable = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: #F5F5F5;
    }

    th {
      padding: 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #E0E0E0;
    }

    td {
      padding: 16px;
      border-bottom: 1px solid #E0E0E0;
      font-size: 14px;
      color: #212121;
    }

    tbody tr:hover {
      background: #FAFAFA;
    }
  }
`;

export const RoleBadge = styled.span<{ $role?: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$role) {
      case 'agent': return '#E3F2FD';
      case 'admin': return '#FCE4EC';
      default: return '#F0F0F0';
    }
  }};
  color: ${props => {
    switch (props.$role) {
      case 'agent': return '#1976D2';
      case 'admin': return '#C2185B';
      default: return '#616161';
    }
  }};
`;

export const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$status === 'active' ? '#E8F5E9' : '#FFEBEE'};
  color: ${props => props.$status === 'active' ? '#388E3C' : '#D32F2F'};
`;

export const ActionBtn = styled.button<{ $danger?: boolean }>`
  padding: 8px 16px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: ${props => props.$danger ? '#FFEBEE' : '#E3F2FD'};
  color: ${props => props.$danger ? '#D32F2F' : '#1976D2'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$danger ? '#FFCDD2' : '#BBDEFB'};
  }
`;

export const AdminSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

export const StatusItem = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
`;

export const StatusLabel = styled.div`
  font-size: 12px;
  color: #757575;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatusValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #212121;
`;

export const StatusValueSuccess = styled(StatusValue)`
  color: #4CAF50;
`;

export const SettingsGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const SettingGroup = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  h4 {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #212121;
    border-bottom: 1px solid #E0E0E0;
    padding-bottom: 12px;
  }
`;

export const SettingItem = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #212121;
    margin-bottom: 8px;
  }

  input,
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #D4AF37;
    }
  }

  input[type='checkbox'] {
    width: auto;
    margin-right: 8px;
  }
`;

export const BtnPrimary = styled.button`
  padding: 12px 24px;
  background: #D4AF37;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #B8960C;
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }
`;

export const BtnSecondary = styled.button`
  padding: 12px 24px;
  background: #F5F5F5;
  color: #212121;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #E0E0E0;
  }
`;

export const AdminAnalytics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  margin-left: auto;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #D4AF37;
  }
`;

export const AnalyticsCharts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

export const ChartContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #212121;
  }
`;

export const ChartPlaceholder = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 16px 0;
`;

export const ChartBar = styled.div<{ $height?: string }>`
  width: 20%;
  height: ${props => props.$height || '50%'};
  background: linear-gradient(180deg, #D4AF37, #B8960C);
  border-radius: 4px 4px 0 0;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const PaginationContainer = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

export const ReportActions = styled.div`
  display: flex;
  gap: 16px;
`;

export const AlertIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #FF9800;
`;

export const AlertClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #757575;
  transition: color 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #212121;
  }
`;

export const SaveBtn = styled.button`
  padding: 12px 24px;
  background: #D4AF37;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;

  &:hover {
    background: #B8960C;
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }
`;
