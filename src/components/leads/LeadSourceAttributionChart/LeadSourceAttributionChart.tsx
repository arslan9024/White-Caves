/** LeadSourceAttributionChart.tsx — View Layer */
import React, { FC } from 'react';
import { SOURCE_DATA, calcPercent } from './logic/LeadSourceAttributionChart.logic';
import { Root, Title, Row, SourceLabel, BarTrack, Bar, Count, Pct } from './styles/LeadSourceAttributionChart.style';

export const LeadSourceAttributionChart: FC = () => {
  const total = SOURCE_DATA.reduce((a, s) => a + s.count, 0);
  return (
    <Root data-testid="lead-source-chart">
      <Title>Lead Source Attribution</Title>
      {SOURCE_DATA.map((s) => {
        const pct = calcPercent(s.count, total);
        return (
          <Row key={s.label}>
            <SourceLabel>{s.label}</SourceLabel>
            <BarTrack><Bar $pct={pct} $color={s.color} /></BarTrack>
            <Count>{s.count}</Count>
            <Pct>{pct}%</Pct>
          </Row>
        );
      })}
    </Root>
  );
};
export default LeadSourceAttributionChart;
