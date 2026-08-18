/** MultiPartySigningTracker.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; max-width: 520px;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 0.25rem;`;
export const Progress = styled.div`font-size: 0.8125rem; color: #64748b; margin-bottom: 1rem;`;
export const SignerRow = styled.div`
  display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0;
  border-bottom: 1px solid #f1f5f9;
`;
export const RoleBadge = styled.span`
  font-size: 0.6875rem; font-weight: 700; padding: 0.15rem 0.5rem;
  border-radius: 4px; background: #f1f5f9; color: #475569; flex-shrink: 0;
`;
export const SignerInfo = styled.div`flex: 1;`;
export const SignerName = styled.div`font-size: 0.875rem; font-weight: 600; color: #1e293b;`;
export const SignerEmail = styled.div`font-size: 0.75rem; color: #94a3b8;`;
export const StatusChip = styled.div<{ $status: string }>`
  font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px;
  background: ${({ $status }) => $status === 'signed' ? '#f0fdf4' : $status === 'opened' ? '#fef9c3' : $status === 'sent' ? '#eff6ff' : $status === 'declined' ? '#fef2f2' : '#f8fafc'};
  color: ${({ $status }) => $status === 'signed' ? '#15803d' : $status === 'opened' ? '#92400e' : $status === 'sent' ? '#1d4ed8' : $status === 'declined' ? '#dc2626' : '#64748b'};
`;
export const AdvanceBtn = styled.button`
  font-size: 0.6875rem; padding: 0.2rem 0.5rem; background: #ef4444; color: #fff;
  border: none; border-radius: 4px; cursor: pointer;
  &:hover { background: #dc2626; }
`;
export const CompleteBanner = styled.div`
  background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 8px; padding: 0.75rem;
  text-align: center; color: #15803d; font-weight: 700; margin-top: 0.75rem;
`;
