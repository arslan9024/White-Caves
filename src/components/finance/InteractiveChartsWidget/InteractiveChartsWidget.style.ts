import styled from 'styled-components';
export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF); border-radius: 12px; border: 1px solid var(--text-secondary, #E2E8F0); padding: 1.5rem;
  font-family: ${p => p.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; direction: ${p => p.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${p => p.$isRtl ? 'right' : 'left'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  p { margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--text-secondary, #64748B); }
`;
export const ChartTabs = styled.div`
  display: flex; gap: 8px; margin-bottom: 1.5rem;
`;
export const ChartTab = styled.button<{ $active: boolean }>`
  padding: 8px 16px; border-radius: 6px; border: 1px solid ${p => p.$active ? 'var(--color-3b82f6, #3B82F6)' : 'var(--color-e2e8f0, #E2E8F0)'};
  background: ${p => p.$active ? 'var(--color-3b82f6, #3B82F6)' : 'var(--white, #FFFFFF)'};
  color: ${p => p.$active ? 'var(--white, #FFFFFF)' : 'var(--color-64748b, #64748B)'}; font-weight: 600; cursor: pointer; font-size: 0.85rem;
`;
export const ChartArea = styled.div`
  background: var(--color-f8fafc, #F8FAFC); border: 1px solid var(--color-e2e8f0, #E2E8F0); border-radius: 8px; padding: 24px;
  display: flex; align-items: flex-end; gap: 12px; height: 200px; position: relative;
`;
export const Bar = styled.div<{ $height: number; $color: string }>`
  flex: 1; height: ${p => p.$height}%; background: ${p => p.$color}; border-radius: 4px 4px 0 0; min-width: 20px; transition: height 0.3s;
  &:hover { opacity: 0.8; }
`;
