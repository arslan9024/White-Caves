/** PipelineVelocityGauge.tsx — View Layer */
import React, { FC } from 'react';
import { STAGE_VELOCITIES, calcVelocityPct, isOnTarget } from './logic/PipelineVelocityGauge.logic';
import { Root, Title, GaugeRow, GaugeHeader, StageName, DaysInfo, AvgDays, TargetDays, Track, Fill, Summary } from './styles/PipelineVelocityGauge.style';

export const PipelineVelocityGauge: FC = () => {
  const avgTotal = STAGE_VELOCITIES.reduce((a, s) => a + s.avgDays, 0);
  return (
    <Root data-testid="pipeline-velocity-gauge">
      <Title>Pipeline Velocity — Avg Days Per Stage</Title>
      {STAGE_VELOCITIES.map((sv) => {
        const pct = calcVelocityPct(sv.avgDays, sv.target);
        const onTarget = isOnTarget(sv.avgDays, sv.target);
        return (
          <GaugeRow key={sv.stage}>
            <GaugeHeader>
              <StageName>{sv.stage}</StageName>
              <DaysInfo>
                <AvgDays $onTarget={onTarget}>{sv.avgDays}d</AvgDays>
                <TargetDays>/ {sv.target}d target</TargetDays>
              </DaysInfo>
            </GaugeHeader>
            <Track><Fill $pct={pct} $color={sv.color} /></Track>
          </GaugeRow>
        );
      })}
      <Summary>
        ⚡ Total pipeline cycle: <strong>{avgTotal.toFixed(1)} days</strong> avg from lead to close
      </Summary>
    </Root>
  );
};
export default PipelineVelocityGauge;
