/** LeadImportCsvWizard.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; max-width: 540px;`;
export const StepIndicator = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.25rem;`;
export const StepDot = styled.div<{ $active: boolean; $done: boolean }>`
  width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700;
  background: ${({ $active, $done }) => $active ? '#ef4444' : $done ? '#22c55e' : '#e2e8f0'};
  color: ${({ $active, $done }) => ($active || $done) ? '#fff' : '#94a3b8'};
`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const DropZone = styled.div`
  border: 2px dashed #ef4444; border-radius: 10px; padding: 2rem; text-align: center;
  background: #fef2f2; cursor: pointer; &:hover { background: #fee2e2; }
`;
export const MapRow = styled.div`display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;`;
export const MapLabel = styled.span`font-size: 0.8125rem; color: #64748b; width: 140px; flex-shrink: 0;`;
export const Arrow = styled.span`color: #ef4444; font-weight: 700;`;
export const MapSelect = styled.select`
  flex: 1; padding: 0.4rem 0.65rem; border: 1px solid #e2e8f0; border-radius: 6px;
  font-size: 0.8125rem; color: #1e293b;
`;
export const ImportBtn = styled.button`
  margin-top: 1rem; width: 100%; padding: 0.75rem; background: #ef4444;
  color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 0.9375rem; cursor: pointer;
  &:hover { background: #dc2626; }
`;
export const SuccessBanner = styled.div`
  background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 10px; padding: 1.5rem; text-align: center;
`;
