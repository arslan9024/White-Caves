/** BulkLeadActionToolbar.style.ts */
import styled from 'styled-components';
export const ToolbarRoot = styled.div`
  display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem;
  background: #1e293b; border-radius: 8px; color: #fff;
`;
export const Count = styled.span`
  font-size: 0.875rem; font-weight: 700; background: #ef4444;
  padding: 0.15rem 0.55rem; border-radius: 999px; margin-right: 0.25rem;
`;
export const ActionBtn = styled.button<{ $variant?: 'danger' }>`
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.4rem 0.85rem; border-radius: 6px; border: none; cursor: pointer;
  font-size: 0.8125rem; font-weight: 600;
  background: ${({ $variant }) => $variant === 'danger' ? '#fef2f2' : '#334155'};
  color: ${({ $variant }) => $variant === 'danger' ? '#ef4444' : '#fff'};
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
`;
export const Divider = styled.div`width: 1px; height: 20px; background: #475569;`;
