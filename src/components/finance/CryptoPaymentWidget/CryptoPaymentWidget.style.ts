import styled from 'styled-components';
export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF); border-radius: 12px; border: 1px solid var(--text-secondary, #E2E8F0); padding: 1.5rem;
  font-family: ${p => p.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; direction: ${p => p.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${p => p.$isRtl ? 'right' : 'left'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: var(--color-1e293b, #1E293B); }
  p { margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--text-secondary, #64748B); }
`;
export const CryptoTable = styled.table`
  width: 100%; border-collapse: collapse;
  th, td { padding: 12px; text-align: center; border-bottom: 1px solid var(--color-e2e8f0, #E2E8F0); font-size: 0.85rem; }
  th { background: var(--color-f8fafc, #F8FAFC); font-weight: 700; color: var(--color-334155, #334155); }
  td:first-child { text-align: left; font-weight: 600; }
`;
export const CoinBadge = styled.span<{ $coin: string }>`
  padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;
  background: ${p => p.$coin === 'BTC' ? '#FEF3C7' : p.$coin === 'ETH' ? '#EDE9FE' : '#DCFCE7'};
  color: ${p => p.$coin === 'BTC' ? '#92400E' : p.$coin === 'ETH' ? '#5B21B6' : '#166534'};
`;
