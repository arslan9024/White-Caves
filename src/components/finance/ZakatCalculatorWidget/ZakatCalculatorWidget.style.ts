import styled from 'styled-components';
export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF); border-radius: 12px; border: 1px solid var(--text-secondary, #E2E8F0); padding: 1.5rem;
  font-family: ${p => p.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; direction: ${p => p.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${p => p.$isRtl ? 'right' : 'left'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  p { margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--text-secondary, #64748B); }
`;
export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  label { display: block; font-weight: 600; color: var(--color-334155, #334155); margin-bottom: 8px; font-size: 0.9rem; }
  input { width: 100%; padding: 12px; border: 1px solid var(--color-e2e8f0, #E2E8F0); border-radius: 8px; font-size: 1rem;
    &:focus { outline: none; border-color: var(--color-3b82f6, #3B82F6); } }
`;
export const ResultCard = styled.div<{ $highlight: boolean }>`
  background: ${p => p.$highlight ? 'var(--color-f0fdf4, #F0FDF4)' : 'var(--color-f8fafc, #F8FAFC)'};
  border: 1px solid ${p => p.$highlight ? 'var(--color-bbf7d0, #BBF7D0)' : 'var(--color-e2e8f0, #E2E8F0)'};
  border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
  .label { font-weight: 600; color: var(--color-334155, #334155); font-size: 0.9rem; }
  .value { font-weight: 800; font-size: 1.2rem; color: ${p => p.$highlight ? 'var(--color-166534, #166534)' : 'var(--color-1e293b, #1E293B)'}; }
`;
