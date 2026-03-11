import styled from 'styled-components';

export const WeatherWidgetContainer = styled.div<{ $compact?: boolean }>`
  display: ${props => props.$compact ? 'flex' : 'flex'};
  flex-direction: ${props => props.$compact ? 'row' : 'column'};
  gap: ${props => props.$compact ? '8px' : '8px'};
  padding: ${props => props.$compact ? '8px 12px' : '12px 16px'};
  background: ${props => props.$compact 
    ? 'var(--bg-tertiary)' 
    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  };
  border-radius: 12px;
  color: ${props => props.$compact ? 'var(--text-primary)' : 'white'};
  ${props => props.$compact && 'border: 1px solid var(--border-color);'}

  [data-theme="dark"] & ${props => props.$compact && `
    background: var(--bg-tertiary-dark, #334155);
  `}
`;

export const WeatherMain = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const WeatherIcon = styled.div<{ $large?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.$large && `
    padding: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  `}
`;

export const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WeatherTemp = styled.div<{ $compact?: boolean }>`
  font-size: ${props => props.$compact ? '14px' : '20px'};
  font-weight: 700;
`;

export const WeatherDescription = styled.div`
  font-size: 13px;
  opacity: 0.9;
`;

export const WeatherDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  opacity: 0.9;
  gap: 16px;
`;

export const WeatherLocation = styled.span`
  font-weight: 500;
`;

export const WeatherHumidity = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const WeatherStat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`;
