import styled from 'styled-components';

export const Dashboard = styled.div<{ rtl: boolean }>`
  padding: 24px;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
  min-height: 100vh;
  color: #ffffff;
  direction: ${props => props.rtl ? 'rtl' : 'ltr'};
  text-align: ${props => props.rtl ? 'right' : 'left'};
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
`;

export const HeaderLeft = styled.div`
  flex: 1;
  min-width: 300px;
`;

export const DashboardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;

  svg {
    width: 32px;
    height: 32px;
    color: #dc2626;
  }
`;

export const DashboardSubtitle = styled.p`
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
`;

export const HeaderControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ControlSelect = styled.select`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #dc2626;
    background: rgba(255, 255, 255, 0.12);
  }

  option {
    background: #1a1a2e;
    color: #ffffff;
  }
`;

export const TimeRangeButtons = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  gap: 2px;
`;

export const TimeBtn = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? '#DC2626' : 'transparent'};
  border: none;
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    color: #ffffff;
    background: ${props => props.active ? '#DC2626' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const KpiCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(220, 38, 38, 0.3);
    box-shadow: 0 8px 32px rgba(220, 38, 38, 0.15);
  }
`;

export const KpiHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const KpiIcon = styled.div`
  color: #DC2626;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const KpiTrend = styled.div<{ type: 'positive' | 'negative' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
  background: ${props => {
    switch (props.type) {
      case 'positive': return 'rgba(5, 150, 105, 0.2)';
      case 'negative': return 'rgba(220, 38, 38, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return '#94a3b8';
    }
  }};
`;

export const KpiValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

export const KpiName = styled.div`
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 16px;
`;

export const KpiProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProgressBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #DC2626, #f97316);
  border-radius: 3px;
  transition: width 0.5s ease;
  width: ${props => props.width || '0'}%;
`;

export const ProgressText = styled.div`
  font-size: 12px;
  color: #64748b;
  display: flex;
  justify-content: space-between;
`;

export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AnalyticsCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(220, 38, 38, 0.2);
  }
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;

  svg {
    width: 20px;
    height: 20px;
    color: #dc2626;
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const TableHeaderCell = styled.th`
  padding: 12px 0;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:last-child {
    text-align: right;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 14px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);

  &:last-child {
    text-align: right;
  }
`;

export const DemandBadge = styled.span<{ demand: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.demand) {
      case 'Very High': return 'rgba(220, 38, 38, 0.2)';
      case 'High': return 'rgba(34, 197, 94, 0.2)';
      case 'Medium': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.demand) {
      case 'Very High': return '#ef4444';
      case 'High': return '#22c55e';
      case 'Medium': return '#f59e0b';
      default: return '#9ca3af';
    }
  }};
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.4);

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;
