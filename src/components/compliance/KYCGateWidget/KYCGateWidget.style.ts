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

export const DocumentCard = styled.div<{ $status: string }>`
  background: ${props => props.$status === 'verified' ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-f8fafc, #F8FAFC)'};
  border: 1px solid ${props => props.$status === 'verified' ? 'var(--color-10b981, #10B981)' : 'var(--text-secondary, #E2E8F0)'};
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;

  .doc-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: ${props => props.$status === 'verified' ? 'var(--color-d1fae5, #D1FAE5)' : 'var(--white, #FFFFFF)'};
      color: ${props => props.$status === 'verified' ? 'var(--color-059669, #059669)' : 'var(--accent-purple, #7C3AED)'};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    h4 {
      margin: 0 0 4px 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-1e293b, #1E293B);
    }

    p {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-secondary, #64748B);
      display: flex;
      align-items: center;
      gap: 4px;

      .spinner {
        animation: spin 1s linear infinite;
      }
    }
  }

  .action-area {
    position: relative;

    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .upload-btn {
      background: var(--white, #FFFFFF);
      border: 1px solid var(--text-secondary, #CBD5E1);
      color: var(--color-334155, #334155);
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      pointer-events: none;
    }

    .verified-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--color-059669, #059669);
      font-weight: 700;
      font-size: 0.9rem;
    }
  }
`;

export const SubmitButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  background: ${props => props.$disabled ? 'var(--text-secondary, #94A3B8)' : 'var(--color-10b981, #10B981)'};
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
  margin-top: 1.5rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-059669, #059669);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
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
  padding: 2.5rem;
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

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
