/** DocumentComplianceChecklist.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;`;
export const Header = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0;`;
export const Score = styled.div<{ $ok: boolean }>`font-size: 0.875rem; font-weight: 700; color: ${({ $ok }) => ($ok ? '#22c55e' : '#ef4444')};`;
export const Group = styled.div`margin-bottom: 0.85rem;`;
export const GroupTitle = styled.div`font-size: 0.6875rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.35rem;`;
export const Item = styled.div`display: flex; align-items: flex-start; gap: 0.55rem; padding: 0.4rem 0; border-bottom: 1px solid #f8fafc; cursor: pointer;`;
export const CheckIcon = styled.div<{ $ok: boolean }>`
  width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0; margin-top: 1px;
  background: ${({ $ok }) => ($ok ? '#f0fdf4' : '#fef2f2')};
  border: 1.5px solid ${({ $ok }) => ($ok ? '#22c55e' : '#fca5a5')};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.625rem; color: ${({ $ok }) => ($ok ? '#22c55e' : '#ef4444')};
`;
export const ItemText = styled.div`flex: 1;`;
export const ItemLabel = styled.div<{ $ok: boolean }>`font-size: 0.8125rem; font-weight: 600; color: ${({ $ok }) => ($ok ? '#1e293b' : '#ef4444')};`;
export const ItemNote = styled.div`font-size: 0.6875rem; color: #f97316; margin-top: 0.15rem;`;
