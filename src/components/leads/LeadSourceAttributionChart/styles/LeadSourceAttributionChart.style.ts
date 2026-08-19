/** LeadSourceAttributionChart.style.ts */
import styled from 'styled-components';
export const Root = styled.div`padding: 1.25rem; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const Row = styled.div`display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.6rem;`;
export const SourceLabel = styled.span`font-size: 0.8125rem; color: #475569; width: 120px; flex-shrink: 0;`;
export const Bar = styled.div<{ $pct: number; $color: string }>`
  height: 10px; border-radius: 999px;
  width: ${({ $pct }) => $pct}%; background: ${({ $color }) => $color};
  min-width: 4px; transition: width 0.4s ease;
`;
export const BarTrack = styled.div`flex: 1; background: #f1f5f9; border-radius: 999px; overflow: hidden;`;
export const Count = styled.span`font-size: 0.75rem; font-weight: 600; color: #1e293b; width: 32px; text-align: right;`;
export const Pct = styled.span`font-size: 0.75rem; color: #94a3b8; width: 36px;`;
