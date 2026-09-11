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

export const ScoreSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  background: var(--color-f8fafc, #F8FAFC);
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--color-e2e8f0, #E2E8F0);

  .score-info {
    flex: 1;

    h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--color-1e293b, #1E293B);
    }
  }
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  height: 12px;
  background: var(--color-e2e8f0, #E2E8F0);
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${props => props.$progress}%;
    background: ${props => 
      props.$progress === 100 ? 'var(--color-10b981, #10B981)' : 
      props.$progress > 50 ? 'var(--color-f59e0b, #F59E0B)' : 
      'var(--color-ef4444, #EF4444)'};
    transition: width 0.4s ease-in-out, background 0.4s ease;
  }
`;

export const ChecklistContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const ChecklistItem = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.$checked ? 'var(--color-10b981, #10B981)' : 'var(--text-secondary, #E2E8F0)'};
  background: ${props => props.$checked ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--white, #FFFFFF)'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.$checked ? 'var(--color-10b981, #10B981)' : 'var(--text-secondary, #CBD5E1)'};
    background: ${props => props.$checked ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-f8fafc, #F8FAFC)'};
  }

  .checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid ${props => props.$checked ? 'var(--color-10b981, #10B981)' : 'var(--text-secondary, #94A3B8)'};
    background: ${props => props.$checked ? 'var(--color-10b981, #10B981)' : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  span.label {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${props => props.$checked ? 'var(--color-065f46, #065F46)' : 'var(--color-334155, #334155)'};
    flex: 1;
  }
`;

export const FileUploadArea = styled.div<{ $hasFile: boolean }>`
  border: 2px dashed ${props => props.$hasFile ? 'var(--color-10b981, #10B981)' : 'var(--accent-purple, #7C3AED)'};
  background: ${props => props.$hasFile ? 'var(--color-ecfdf5, #ECFDF5)' : 'rgba(124, 58, 237, 0.03)'};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
  position: relative;

  &:hover {
    background: ${props => props.$hasFile ? 'var(--color-d1fae5, #D1FAE5)' : 'rgba(124, 58, 237, 0.08)'};
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .icon {
    color: ${props => props.$hasFile ? 'var(--color-10b981, #10B981)' : 'var(--accent-purple, #7C3AED)'};
  }

  .text {
    font-size: 0.9rem;
    font-weight: 800;
    color: ${props => props.$hasFile ? 'var(--color-065f46, #065F46)' : 'var(--accent-purple, #7C3AED)'};
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

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-ecfdf5, #ECFDF5);
  border: 1px solid var(--color-a7f3d0, #A7F3D0);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
  color: var(--color-065f46, #065F46);
  font-weight: 800;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
