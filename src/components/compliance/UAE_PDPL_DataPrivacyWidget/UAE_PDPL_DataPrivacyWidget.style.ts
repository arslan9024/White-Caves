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
  display: flex;
  justify-content: space-between;
  align-items: center;

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

  .dpa-btn {
    background: var(--white, #FFFFFF);
    border: 1px solid var(--text-secondary, #CBD5E1);
    color: var(--color-1e293b, #1E293B);
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--color-f8fafc, #F8FAFC);
      border-color: var(--color-94a3b8, #94A3B8);
    }
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
    color: var(--color-3b82f6, #3B82F6);
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
      border-color: var(--color-3b82f6, #3B82F6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: var(--white, #FFFFFF);
    }
  }
`;

export const ConsentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  background: var(--color-f8fafc, #F8FAFC);
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--color-e2e8f0, #E2E8F0);

  label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-334155, #334155);
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: var(--color-e2e8f0, #E2E8F0);
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--color-3b82f6, #3B82F6);
    }
  }
`;

export const ActionButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  background: ${props => props.$disabled ? 'var(--text-secondary, #94A3B8)' : 'var(--color-3b82f6, #3B82F6)'};
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
    background: var(--color-2563eb, #2563EB);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .spinner {
    animation: spin 1s linear infinite;
  }
`;

export const SuccessCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  background: var(--color-ecfdf5, #ECFDF5);
  border: 1px solid var(--color-a7f3d0, #A7F3D0);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1.5rem;
  animation: scaleIn 0.3s ease-out;

  .icon {
    color: var(--color-10b981, #10B981);
  }

  h4 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-065f46, #065F46);
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-047857, #047857);
    background: rgba(16, 185, 129, 0.1);
    padding: 8px 16px;
    border-radius: 6px;
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
