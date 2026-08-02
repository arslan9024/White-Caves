import React from 'react';
import styled from 'styled-components';

interface KPIProps {
  label: React.ReactNode;
  value: React.ReactNode;
  change?: number | string;
  icon?: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
}

const Container = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const Change = styled.span<{ $trend: 'positive' | 'negative' | 'neutral' }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props =>
    props.$trend === 'positive' ? '#059669' : props.$trend === 'negative' ? '#EF4444' : '#6b7280'};
`;

const KPI: React.FC<KPIProps> = ({ label, value, change, icon, trend = 'neutral' }) => {
  const formattedChange =
    change === undefined || change === null
      ? null
      : typeof change === 'number'
        ? `${change}%`
        : change;

  return (
    <Container data-trend={trend} className={trend}>
      <Header>
        <Label>{label}</Label>
        {icon ? <span>{icon}</span> : null}
      </Header>
      <Value>{value}</Value>
      {formattedChange ? <Change $trend={trend}>{formattedChange}</Change> : null}
    </Container>
  );
};

export default KPI;
