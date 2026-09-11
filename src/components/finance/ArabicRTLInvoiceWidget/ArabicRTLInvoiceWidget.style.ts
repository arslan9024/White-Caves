import styled from 'styled-components';
export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF); border-radius: 12px; border: 1px solid var(--text-secondary, #E2E8F0); padding: 1.5rem;
  font-family: ${p => p.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; direction: ${p => p.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${p => p.$isRtl ? 'right' : 'left'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  p { margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--text-secondary, #64748B); }
`;
export const InvoiceBox = styled.div`
  border: 2px solid var(--color-1e293b, #1E293B); border-radius: 8px; padding: 24px; margin-top: 1rem;
`;
export const InvoiceTable = styled.table`
  width: 100%; border-collapse: collapse; margin-top: 16px;
  th, td { padding: 10px 12px; border-bottom: 1px solid var(--color-e2e8f0, #E2E8F0); font-size: 0.85rem; }
  th { background: var(--color-f8fafc, #F8FAFC); font-weight: 700; }
  td.amount { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
`;
export const TotalRow = styled.div`
  display: flex; justify-content: space-between; padding: 8px 12px; font-size: 0.9rem;
  &.grand { font-weight: 800; font-size: 1.1rem; color: var(--color-1e293b, #1E293B); border-top: 2px solid var(--color-1e293b, #1E293B); margin-top: 4px; padding-top: 12px; }
`;
