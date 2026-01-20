/**
 * KPI Card Component
 * Displays key performance indicator with value, change, and trend
 */

import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div<{ $bgColor?: string }>`
  background: ${(props) => props.$bgColor || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${(props) => props.$bgColor || 'rgba(255, 255, 255, 0.08)'};
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #2ecc71);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const CardIcon = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(52, 152, 219, 0.2);
`;

const CardLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
`;

const CardChange = styled.div<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.$positive ? '#27ae60' : '#e74c3c')};

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: ${(props) =>
      props.$positive
        ? '6px solid #27ae60'
        : '6px solid #e74c3c'};
    transform: ${(props) => (props.$positive ? 'none' : 'rotate(180deg)')};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color?: string }>`
  width: ${(props) => Math.min(props.$percentage, 100)}%;
  height: 100%;
  background: ${(props) => props.$color || '#3498db'};
  transition: width 0.3s ease;
`;

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  showProgress?: boolean;
  progressMax?: number;
  backgroundColor?: string;
  accentColor?: string;
  onClick?: () => void;
}

/**
 * KPI Card Component
 * Displays metric with optional trend, progress bar, and icon
 */
export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  change,
  unit,
  icon = '📊',
  trend = 'neutral',
  showProgress = false,
  progressMax = 100,
  backgroundColor,
  accentColor = '#3498db',
  onClick,
}) => {
  const isPositive = trend === 'up';
  const isNeutral = trend === 'neutral';
  const progressPercentage =
    showProgress && typeof value === 'number' && progressMax > 0
      ? (value / progressMax) * 100
      : 0;

  return (
    <CardContainer
      $bgColor={backgroundColor}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardContent>
        <CardHeader>
          <div>
            <CardLabel>{label}</CardLabel>
          </div>
          <CardIcon>{icon}</CardIcon>
        </CardHeader>

        <div>
          <CardValue>{value}</CardValue>
          {unit && (
            <CardLabel style={{ marginTop: 4 }}>
              {unit}
            </CardLabel>
          )}
        </div>

        {change !== undefined && !isNeutral && (
          <CardChange $positive={isPositive}>
            {isPositive ? '+' : ''}{change}%
          </CardChange>
        )}

        {showProgress && (
          <ProgressBar>
            <ProgressFill
              $percentage={progressPercentage}
              $color={accentColor}
            />
          </ProgressBar>
        )}
      </CardContent>
    </CardContainer>
  );
};

export default KPICard;
