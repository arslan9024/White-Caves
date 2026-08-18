/** LeadAgingHeatmap.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const Grid = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;`;
export const Cell = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color + '22'}; border: 1.5px solid ${({ $color }) => $color};
  border-radius: 8px; padding: 0.6rem; text-align: center;
`;
export const CellName = styled.div`font-size: 0.75rem; font-weight: 600; color: #1e293b; margin-bottom: 0.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
export const CellDays = styled.div<{ $color: string }>`font-size: 1.1rem; font-weight: 800; color: ${({ $color }) => $color};`;
export const CellLabel = styled.div`font-size: 0.625rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;`;
export const Legend = styled.div`display: flex; gap: 0.75rem; margin-top: 0.75rem; flex-wrap: wrap;`;
export const LegendItem = styled.div<{ $color: string }>`
  display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; color: #475569;
  &::before { content: ''; width: 10px; height: 10px; border-radius: 2px; background: ${({ $color }) => $color}; }
`;
