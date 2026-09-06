import styled from 'styled-components';
import { Z_INDEX } from '../../../../styles/zIndexTokens';

export const ExpenseClaimFormShell = styled.form`
  display: grid;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem;
  color: var(--deep-slate, #1e293b);
  background: var(--crisp-white, #ffffff);
  border: 1px solid color-mix(in srgb, var(--primary-red, #ef4444) 20%, transparent);
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1.5rem rgb(30 41 59 / 0.08);
  position: relative;
  z-index: ${Z_INDEX.CONTENT};
`;

export const ExpenseClaimTitle = styled.h2`
  margin: 0;
  color: var(--deep-slate, #1e293b);
  font-size: 1.1rem;
`;

export const ExpenseClaimGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
  }
`;

export const ExpenseClaimField = styled.label`
  display: grid;
  gap: 0.35rem;
  color: var(--deep-slate, #1e293b);
  font-size: 0.8rem;
  font-weight: 700;
`;

export const ExpenseClaimInput = styled.input`
  min-height: 2.75rem;
  padding: 0.65rem 0.75rem;
  color: var(--deep-slate, #1e293b);
  background: var(--crisp-white, #ffffff);
  border: 1px solid rgb(30 41 59 / 0.25);
  border-radius: 0.5rem;

  &:focus-visible {
    outline: 0.1875rem solid rgb(239 68 68 / 0.3);
    outline-offset: 0.125rem;
    border-color: var(--primary-red, #ef4444);
  }
`;

export const ExpenseClaimSelect = styled.select`
  min-height: 2.75rem;
  padding: 0.65rem 0.75rem;
  color: var(--deep-slate, #1e293b);
  background: var(--crisp-white, #ffffff);
  border: 1px solid rgb(30 41 59 / 0.25);
  border-radius: 0.5rem;
`;

export const ExpenseClaimTextarea = styled.textarea`
  min-height: 6rem;
  padding: 0.65rem 0.75rem;
  resize: vertical;
  color: var(--deep-slate, #1e293b);
  background: var(--crisp-white, #ffffff);
  border: 1px solid rgb(30 41 59 / 0.25);
  border-radius: 0.5rem;
`;

export const ExpenseClaimActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const ExpenseClaimButton = styled.button<{ $secondary?: boolean }>`
  min-height: 2.75rem;
  padding: 0.65rem 1rem;
  color: ${({ $secondary }) =>
    $secondary ? 'var(--deep-slate, #1e293b)' : 'var(--crisp-white, #ffffff)'};
  background: ${({ $secondary }) =>
    $secondary ? 'var(--crisp-white, #ffffff)' : 'var(--primary-red, #ef4444)'};
  border: 1px solid var(--primary-red, #ef4444);
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 800;
`;

export const ExpenseClaimError = styled.p`
  margin: 0;
  color: var(--primary-red, #ef4444);
  font-size: 0.8rem;
  font-weight: 700;
`;
