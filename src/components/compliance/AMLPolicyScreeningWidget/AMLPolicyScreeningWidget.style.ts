import styled from 'styled-components';

export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF);
  border-radius: 12px;
  border: 1px solid var(--text-secondary, #E2E8F0);
  padding: 1.5rem;
  font-family: ${props => props.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"};
  direction: ${props => props.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRtl ? 'right' : 'left'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const WidgetHeader = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-f1f5f9, #F1F5F9);
  padding-bottom: 1rem;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-1e293b, #1E293B);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary, #64748B);
  }
`;

export const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-1e293b, #1E293B);
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    color: var(--color-ef4444, #EF4444);
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-334155, #334155);
  }

  input, select {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid var(--text-secondary, #CBD5E1);
    font-size: 0.9rem;
    color: var(--color-1e293b, #1E293B);
    background: var(--color-f8fafc, #F8FAFC);
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-ef4444, #EF4444);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      background: var(--white, #FFFFFF);
    }
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .toggle-btn {
    flex: 1;
    padding: 12px;
    border: 1px solid var(--text-secondary, #CBD5E1);
    background: var(--white, #FFFFFF);
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-475569, #475569);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    &.active {
      background: var(--color-ef4444, #EF4444);
      color: var(--white, #FFFFFF);
      border-color: var(--color-ef4444, #EF4444);
    }

    &:hover:not(.active) {
      background: var(--color-f1f5f9, #F1F5F9);
    }
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: var(--color-f8fafc, #F8FAFC);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-e2e8f0, #E2E8F0);

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-1e293b, #1E293B);
    cursor: pointer;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--color-ef4444, #EF4444);
    }
  }
`;

export const ActionButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  background: ${props => props.$disabled ? 'var(--text-secondary, #94A3B8)' : 'var(--color-ef4444, #EF4444)'};
  color: var(--white, #FFFFFF);
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-dc2626, #DC2626);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  .spinner {
    animation: spin 1s linear infinite;
  }
`;

export const ResultCard = styled.div<{ $status: 'clear' | 'flagged' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  background: ${props => props.$status === 'clear' ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-fef2f2, #FEF2F2)'};
  border: 1px solid ${props => props.$status === 'clear' ? 'var(--color-10b981, #10B981)' : 'var(--color-ef4444, #EF4444)'};
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1.5rem;
  animation: scaleIn 0.3s ease-out;

  .icon {
    color: ${props => props.$status === 'clear' ? 'var(--color-10b981, #10B981)' : 'var(--color-ef4444, #EF4444)'};
  }

  h4 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: ${props => props.$status === 'clear' ? 'var(--color-065f46, #065F46)' : 'var(--color-991b1b, #991B1B)'};
  }

  .score-badge {
    background: ${props => props.$status === 'clear' ? 'var(--color-d1fae5, #D1FAE5)' : 'var(--color-fee2e2, #FEE2E2)'};
    color: ${props => props.$status === 'clear' ? 'var(--color-065f46, #065F46)' : 'var(--color-991b1b, #991B1B)'};
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 800;
    font-size: 0.9rem;
  }

  .download-btn {
    margin-top: 1rem;
    background: var(--white, #FFFFFF);
    border: 1px solid var(--text-secondary, #CBD5E1);
    color: var(--color-1e293b, #1E293B);
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--color-f8fafc, #F8FAFC);
    }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
