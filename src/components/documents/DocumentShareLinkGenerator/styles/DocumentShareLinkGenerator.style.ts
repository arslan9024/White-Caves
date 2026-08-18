/** DocumentShareLinkGenerator.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; max-width: 440px;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const OptionRow = styled.div`display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.75rem;`;
export const OptionLabel = styled.label`font-size: 0.8125rem; font-weight: 600; color: #475569; width: 120px;`;
export const Select = styled.select`flex: 1; padding: 0.45rem 0.65rem; border: 1px solid #e2e8f0; border-radius: 7px; font-size: 0.875rem; color: #1e293b;`;
export const Toggle = styled.input`accent-color: #ef4444;`;
export const GenBtn = styled.button`
  width: 100%; padding: 0.7rem; background: #ef4444; color: #fff; border: none;
  border-radius: 8px; font-weight: 700; font-size: 0.875rem; cursor: pointer; margin-top: 0.25rem;
  &:hover { background: #dc2626; }
`;
export const LinkBox = styled.div`
  display: flex; align-items: center; gap: 0.5rem; background: #f8fafc;
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; margin-top: 0.75rem;
`;
export const LinkText = styled.code`flex: 1; font-size: 0.6875rem; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
export const CopyBtn = styled.button<{ $copied: boolean }>`
  padding: 0.3rem 0.65rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.75rem; font-weight: 700;
  background: ${({ $copied }) => ($copied ? '#22c55e' : '#ef4444')}; color: #fff;
  transition: background 0.25s;
`;
export const PinBox = styled.div`background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 0.75rem; margin-top: 0.5rem; text-align: center;`;
export const PinCode = styled.div`font-size: 1.5rem; font-weight: 800; letter-spacing: 0.25em; color: #ef4444;`;
