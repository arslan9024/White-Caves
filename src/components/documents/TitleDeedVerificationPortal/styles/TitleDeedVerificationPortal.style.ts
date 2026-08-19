/** TitleDeedVerificationPortal.style.ts */
import styled, { keyframes } from 'styled-components';
const spin = keyframes`to { transform: rotate(360deg); }`;
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; max-width: 540px;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1.25rem;`;
export const SearchRow = styled.div`display: flex; gap: 0.5rem;`;
export const SearchInput = styled.input`
  flex: 1; padding: 0.65rem 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 0.9375rem; font-family: monospace; letter-spacing: 0.08em;
  &:focus { outline: 2px solid #ef4444; border-color: transparent; }
`;
export const SearchBtn = styled.button`
  padding: 0.65rem 1.25rem; background: #ef4444; color: #fff; border: none;
  border-radius: 8px; font-weight: 700; font-size: 0.875rem; cursor: pointer;
  &:hover { background: #dc2626; }
`;
export const Spinner = styled.div`
  width: 28px; height: 28px; border: 3px solid #fca5a5; border-top-color: #ef4444;
  border-radius: 50%; animation: ${spin} 0.7s linear infinite; margin: 1.5rem auto;
`;
export const Result = styled.div<{ $status: string }>`
  margin-top: 1rem; border: 1.5px solid ${({ $status }) => $status === 'verified' ? '#22c55e' : $status === 'encumbered' ? '#f97316' : '#ef4444'};
  border-radius: 10px; padding: 1rem;
  background: ${({ $status }) => $status === 'verified' ? '#f0fdf4' : $status === 'encumbered' ? '#fff7ed' : '#fef2f2'};
`;
export const ResultRow = styled.div`display: flex; justify-content: space-between; padding: 0.3rem 0; border-bottom: 1px solid rgba(0,0,0,0.05);`;
export const ResultLabel = styled.span`font-size: 0.8125rem; color: #94a3b8; font-weight: 500;`;
export const ResultValue = styled.span`font-size: 0.8125rem; font-weight: 700; color: #1e293b;`;
export const StatusBanner = styled.div<{ $status: string }>`
  font-size: 0.875rem; font-weight: 700; text-align: center; padding: 0.5rem;
  color: ${({ $status }) => $status === 'verified' ? '#15803d' : $status === 'encumbered' ? '#c2410c' : '#dc2626'};
`;
