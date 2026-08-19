/** FollowUpSequenceBuilder.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const StepList = styled.div`display: flex; flex-direction: column; gap: 0.65rem;`;
export const Step = styled.div`
  display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem;
  background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;
`;
export const DayBadge = styled.div`
  background: #1e293b; color: #fff; border-radius: 6px;
  padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
`;
export const ChannelDot = styled.div<{ $color: string }>`
  width: 10px; height: 10px; border-radius: 50%; background: ${({ $color }) => $color};
  flex-shrink: 0; margin-top: 4px;
`;
export const StepText = styled.div`flex: 1; font-size: 0.8125rem; color: #475569;`;
export const RemoveBtn = styled.button`
  background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0.1rem;
  &:hover { color: #ef4444; }
`;
export const AddBtn = styled.button`
  margin-top: 0.75rem; width: 100%; padding: 0.6rem;
  background: #fef2f2; color: #ef4444; border: 1.5px dashed #ef4444;
  border-radius: 8px; font-weight: 700; font-size: 0.875rem; cursor: pointer;
  &:hover { background: #ef4444; color: #fff; }
`;
