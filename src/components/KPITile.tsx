import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPITileProps {
  title: string;
  value: number;
  unit?: string;
  previousValue?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'gold' | 'green' | 'red' | 'blue';
  isLoading?: boolean;
  format?: 'number' | 'currency' | 'percentage';
}

const Container = styled(motion.div)<{ $color: string }>`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(201, 168, 76, 0.5);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.08) 100%
    );
    box-shadow: 0 8px 32px rgba(201, 168, 76, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const TrendIcon = styled(motion.div)<{ $trend: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => {
    switch (props.$trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return 'rgba(255, 255, 255, 0.5)';
    }
  }};
  font-size: 12px;
  font-weight: 600;
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
`;

const Value = styled(motion.div)`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Unit = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
`;

const ChartBar = styled(motion.div)`
  height: 4px;
  background: linear-gradient(90deg, rgba(201, 168, 76, 0.3) 0%, rgba(201, 168, 76, 0.8) 100%);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ChartBarFill = styled(motion.div)<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #c9a84c 0%, #d4af76 100%);
  width: ${props => `${Math.min(props.$percentage, 100)}%`};
  border-radius: 2px;
`;

const ChangeText = styled.span<{ $positive: boolean }>`
  font-size: 12px;
  color: ${props => (props.$positive ? '#10b981' : '#ef4444')};
  font-weight: 600;
`;

const SkeletonLoader = styled(motion.div)`
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const formatValue = (
  value: number,
  format: 'number' | 'currency' | 'percentage' = 'number'
): string => {
  switch (format) {
    case 'currency':
      return `AED ${value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    case 'percentage':
      return `${value.toFixed(1)}%`;
    default:
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
  }
};

const calculateChange = (
  current: number,
  previous: number | undefined
): {
  percentage: number;
  isPositive: boolean;
} => {
  if (previous === undefined || previous === 0) {
    return { percentage: 0, isPositive: true };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    percentage: Math.abs(change),
    isPositive: change >= 0,
  };
};

export const KPITile: React.FC<KPITileProps> = ({
  title,
  value,
  unit,
  previousValue,
  trend = 'neutral',
  color = 'gold',
  isLoading = false,
  format = 'number',
}) => {
  const { percentage: changePercentage, isPositive } = useMemo(
    () => calculateChange(value, previousValue),
    [value, previousValue]
  );

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { y: -4 },
  };

  const valueVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.4 } },
  };

  const chartBarVariants = {
    initial: { scaleX: 0, originX: 0 },
    animate: { scaleX: 1, transition: { delay: 0.3, duration: 0.8 } },
  };

  return (
    <Container
      $color={color}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <TitleContainer>
        <Title>{title}</Title>
        {previousValue !== undefined && (
          <TrendIcon $trend={trend} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {trend === 'up' ? (
              <TrendingUp size={16} />
            ) : trend === 'down' ? (
              <TrendingDown size={16} />
            ) : null}
            <ChangeText $positive={isPositive}>{changePercentage.toFixed(1)}%</ChangeText>
          </TrendIcon>
        )}
      </TitleContainer>

      {isLoading ? (
        <SkeletonLoader initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} />
      ) : (
        <>
          <ValueContainer>
            <Value variants={valueVariants}>{formatValue(value, format)}</Value>
            {unit && <Unit>{unit}</Unit>}
          </ValueContainer>

          <ChartBar variants={chartBarVariants} initial="initial" animate="animate">
            <ChartBarFill $percentage={(value / (previousValue || value * 1.5)) * 100} />
          </ChartBar>
        </>
      )}
    </Container>
  );
};

export default KPITile;
