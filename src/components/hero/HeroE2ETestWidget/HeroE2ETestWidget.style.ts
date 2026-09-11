import styled from 'styled-components';
export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF); border-radius: 12px; border: 1px solid var(--text-secondary, #E2E8F0); padding: 1.5rem;
  font-family: ${p => p.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; direction: ${p => p.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${p => p.$isRtl ? 'right' : 'left'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  p { margin: 0 0 1rem 0; font-size: 0.85rem; color: var(--text-secondary, #64748B); }
`;
export const InfoGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;
`;
export const InfoCard = styled.div`
  background: var(--color-f8fafc, #F8FAFC); border: 1px solid var(--color-e2e8f0, #E2E8F0); border-radius: 8px; padding: 14px; text-align: center;
  .value { font-size: 1.2rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  .label { font-size: 0.75rem; color: var(--color-64748b, #64748B); margin-top: 4px; }
`;
