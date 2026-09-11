import styled from 'styled-components';
export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF); border-radius: 12px; border: 1px solid var(--text-secondary, #E2E8F0); padding: 1.5rem;
  font-family: ${p => p.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; direction: ${p => p.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${p => p.$isRtl ? 'right' : 'left'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  p { margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--text-secondary, #64748B); }
`;
export const ActionGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
export const ActionCard = styled.div`
  background: var(--color-f8fafc, #F8FAFC); border: 1px solid var(--color-e2e8f0, #E2E8F0); border-radius: 12px; padding: 24px; text-align: center;
  cursor: pointer; transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .label { font-weight: 700; color: var(--color-1e293b, #1E293B); margin-top: 12px; font-size: 0.95rem; }
  .count { font-size: 0.8rem; color: var(--color-64748b, #64748B); margin-top: 4px; }
`;
export const Badge = styled.span`
  background: var(--accent-red, #EF4444); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 700;
  position: absolute; top: -4px; right: -4px;
`;
