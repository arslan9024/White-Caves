import styled from 'styled-components';
export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF); border-radius: 12px; border: 1px solid var(--text-secondary, #E2E8F0); padding: 1.5rem;
  font-family: ${p => p.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; direction: ${p => p.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${p => p.$isRtl ? 'right' : 'left'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  p { margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--text-secondary, #64748B); }
`;
export const AlertCard = styled.div<{ $severity: string }>`
  padding: 16px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;
  border-left: 4px solid ${p => p.$severity === 'critical' ? '#EF4444' : p.$severity === 'warning' ? '#F59E0B' : '#3B82F6'};
  background: ${p => p.$severity === 'critical' ? '#FEF2F2' : p.$severity === 'warning' ? '#FFFBEB' : '#EFF6FF'};
  .type { font-weight: 700; font-size: 0.9rem; color: var(--color-1e293b, #1E293B); }
  .message { font-size: 0.85rem; color: var(--color-64748b, #64748B); margin-top: 4px; }
`;
