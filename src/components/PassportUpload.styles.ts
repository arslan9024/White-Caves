import styled from 'styled-components';

/* ============================================================================
 * Passport Upload Styled Components
 * ============================================================================ */

export const PassportUploadContainer = styled.div`
  padding: 2rem;
  background: ${(props) => props.theme.colors?.background || '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0.75rem 0;
  }
`;

export const PassportForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

export const FormInput = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f5f5f5;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.9375rem;
  }
`;

export const FileInput = styled.input.attrs({ type: 'file' })`
  padding: 0.8rem;
  border: 2px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f5f5f5;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const SubmitButton = styled.button`
  background: #4caf50;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.3s ease;
  font-family: inherit;

  &:hover:not(:disabled) {
    background: #45a049;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.9375rem;
  }
`;

export const UploadArea = styled.div<{ $isDragActive?: boolean }>`
  border: 2px dashed ${(props) => (props.$isDragActive ? '#4caf50' : '#ddd')};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  background: ${(props) => (props.$isDragActive ? 'rgba(76, 175, 80, 0.05)' : 'transparent')};
  cursor: pointer;

  &:hover {
    border-color: #4caf50;
    background: rgba(76, 175, 80, 0.03);
  }

  p {
    color: #666;
    margin: 0.5rem 0;
    font-size: 0.9375rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    p {
      font-size: 0.875rem;
    }
  }
`;

export const ProgressBar = styled.div<{ $progress?: number }>`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => `${props.$progress || 0}%`};
    background: linear-gradient(90deg, #4caf50 0%, #45a049 100%);
    transition: width 0.3s ease;
  }
`;

export const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  border-left: 4px solid #c62828;

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
`;

export const SuccessMessage = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  border-left: 4px solid #2e7d32;

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
`;
