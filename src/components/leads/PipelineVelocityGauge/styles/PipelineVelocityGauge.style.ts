/** PipelineVelocityGauge.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const GaugeRow = styled.div`margin-bottom: 1rem;`;
export const GaugeHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;`;
export const StageName = styled.span`font-size: 0.8125rem; font-weight: 600; color: #475569;`;
export const DaysInfo = styled.div`display: flex; align-items: center; gap: 0.4rem;`;
export const AvgDays = styled.span<{ $onTarget: boolean }>`
  font-size: 0.875rem; font-weight: 800;
  color: ${({ $onTarget }) => ($onTarget ? '#22c55e' : '#ef4444')};
`;
export const TargetDays = styled.span`font-size: 0.75rem; color: #94a3b8;`;
export const Track = styled.div`height: 8px; background: #f1f5f9; border-radius: 999px; overflow: hidden;`;
export const Fill = styled.div<{ $pct: number; $color: string }>`
  height: 100%; width: ${({ $pct }) => $pct}%; background: ${({ $color }) => $color};
  border-radius: 999px; transition: width 0.5s ease;
`;
export const Summary = styled.div`
  margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #f1f5f9;
  font-size: 0.8125rem; color: #64748b;
`;
