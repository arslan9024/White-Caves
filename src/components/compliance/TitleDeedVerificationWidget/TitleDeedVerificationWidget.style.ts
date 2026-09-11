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
      border-color: var(--accent-purple, #7C3AED);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
      background: var(--white, #FFFFFF);
    }
  }
`;

export const QRUploadZone = styled.div`
  border: 2px dashed var(--text-secondary, #CBD5E1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--color-f8fafc, #F8FAFC);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
  position: relative;

  &:hover {
    border-color: var(--accent-purple, #7C3AED);
    background: rgba(124, 58, 237, 0.05);
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .icon {
    color: var(--accent-purple, #7C3AED);
  }

  .text {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-475569, #475569);
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`;

export const ValidateButton = styled.button<{ $isVerifying: boolean }>`
  background: ${props => props.$isVerifying ? 'var(--text-secondary, #94A3B8)' : 'var(--accent-purple, #7C3AED)'};
  color: var(--white, #FFFFFF);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: ${props => props.$isVerifying ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-5b21b6, #5B21B6);
    transform: translateY(-1px);
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const ResultCard = styled.div<{ $status: 'verified' | 'fraud' | 'mismatch' }>`
  background: ${props => 
    props.$status === 'verified' ? 'var(--color-ecfdf5, #ECFDF5)' : 
    props.$status === 'fraud' ? 'var(--color-fef2f2, #FEF2F2)' : 
    'var(--color-fffbeb, #FFFBEB)'};
  border: 1px solid ${props => 
    props.$status === 'verified' ? 'var(--color-a7f3d0, #A7F3D0)' : 
    props.$status === 'fraud' ? 'var(--color-fecaca, #FECACA)' : 
    'var(--color-fde68a, #FDE68A)'};
  border-radius: 12px;
  padding: 1.5rem;
  animation: slideUp 0.3s ease-out forwards;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const ResultHeader = styled.div<{ $status: 'verified' | 'fraud' | 'mismatch' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed ${props => 
    props.$status === 'verified' ? 'var(--color-6ee7b7, #6EE7B7)' : 
    props.$status === 'fraud' ? 'var(--color-fca5a5, #FCA5A5)' : 
    'var(--color-fcd34d, #FCD34D)'};

  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: ${props => 
      props.$status === 'verified' ? 'var(--color-065f46, #065F46)' : 
      props.$status === 'fraud' ? 'var(--color-991b1b, #991B1B)' : 
      'var(--color-92400e, #92400E)'};
  }

  .icon {
    color: ${props => 
      props.$status === 'verified' ? 'var(--color-10b981, #10B981)' : 
      props.$status === 'fraud' ? 'var(--color-ef4444, #EF4444)' : 
      'var(--color-f59e0b, #F59E0B)'};
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-475569, #475569);
  }

  .value {
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--color-1e293b, #1E293B);
  }
`;
