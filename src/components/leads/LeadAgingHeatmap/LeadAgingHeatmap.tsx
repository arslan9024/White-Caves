/** LeadAgingHeatmap.tsx — View Layer */
import React, { FC } from 'react';
import { AGING_LEADS, getAgingColor, getAgingLabel } from './logic/LeadAgingHeatmap.logic';
import { Root, Title, Grid, Cell, CellName, CellDays, CellLabel, Legend, LegendItem } from './styles/LeadAgingHeatmap.style';

export const LeadAgingHeatmap: FC = () => (
  <Root data-testid="lead-aging-heatmap">
    <Title>Lead Aging Heatmap — Days Since Last Contact</Title>
    <Grid>
      {AGING_LEADS.map((lead) => {
        const color = getAgingColor(lead.daysSince);
        return (
          <Cell key={lead.id} $color={color}>
            <CellName title={lead.name}>{lead.name.split(' ')[0]}</CellName>
            <CellDays $color={color}>{lead.daysSince}d</CellDays>
            <CellLabel>{getAgingLabel(lead.daysSince)}</CellLabel>
          </Cell>
        );
      })}
    </Grid>
    <Legend>
      <LegendItem $color="#22c55e">0–3 days (Fresh)</LegendItem>
      <LegendItem $color="#eab308">4–7 days (Warm)</LegendItem>
      <LegendItem $color="#f97316">8–14 days (Cooling)</LegendItem>
      <LegendItem $color="#ef4444">14+ days (Cold)</LegendItem>
    </Legend>
  </Root>
);
export default LeadAgingHeatmap;
