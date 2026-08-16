import React, { FC } from 'react';
import styled from 'styled-components';

const DeckContainer = styled.div`
  padding: 1.5rem;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 16px;
  color: #FFFFFF;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 1rem;
`;

const KpiCard = styled.div`
  padding: 1rem;
  background: #1E293B;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;

  .value {
    font-size: 1.4rem;
    font-weight: 900;
    color: #EF4444;
    margin: 4px 0;
  }
`;

export const ExecutiveFlightDeck: FC = () => {
  return (
    <DeckContainer data-testid="executive-flight-deck">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#EF4444' }}>⚡ Managing Director Executive Flight Deck</h3>
        <span style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', color: '#EF4444', padding: '4px 10px', borderRadius: '12px' }}>
          LEVEL 5 GOD-MODE
        </span>
      </div>

      <KpiGrid>
        <KpiCard>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Revenue YTD</span>
          <div className="value">AED 48.5M</div>
          <span style={{ fontSize: '0.72rem', color: '#10B981' }}>📈 +18.4% vs target</span>
        </KpiCard>
        <KpiCard>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Managed Units</span>
          <div className="value">9,378</div>
          <span style={{ fontSize: '0.72rem', color: '#38BDF8' }}>98.2% Occupancy</span>
        </KpiCard>
        <KpiCard>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Lead Response SLA</span>
          <div className="value">4.2 Mins</div>
          <span style={{ fontSize: '0.72rem', color: '#10B981' }}>⚡ Sub-15m Compliant</span>
        </KpiCard>
        <KpiCard>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Supervisors</span>
          <div className="value">108 / 108</div>
          <span style={{ fontSize: '0.72rem', color: '#EF4444' }}>12 Depts Synced</span>
        </KpiCard>
      </KpiGrid>
    </DeckContainer>
  );
};

export default ExecutiveFlightDeck;
