import styled, { keyframes } from 'styled-components';
import { transitions } from '../../../../styles/theme/transitions';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const ImageExtractorContainer = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);
`;

export const ExtractorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #f59e0b;
  }
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
`;

export const HeaderSubtext = styled.span`
  font-size: 0.85rem;
  color: var(--text-muted);
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: ${(props) => (props.$danger ? '#ef4444' : 'var(--text-primary)')};
  transition: ${transitions.hover};
  border-color: ${(props) => (props.$danger ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)')};

  &:hover {
    background: ${(props) => (props.$danger ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-hover)')};
  }
`;

export const DropZone = styled.div<{ $active?: boolean; $processing?: boolean }>`
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  cursor: pointer;
  transition: ${transitions.all};
  background: var(--bg-tertiary);
  border-color: ${(props) => (props.$active ? '#f59e0b' : 'var(--border-color)')};
  background: ${(props) => (props.$active ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-tertiary)')};
  transform: ${(props) => (props.$active ? 'scale(1.01)' : 'scale(1)')};
  pointer-events: ${(props) => (props.$processing ? 'none' : 'auto')};

  &:hover {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }

  svg {
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  h4 {
    margin: 0 0 8px;
    color: var(--text-primary);
  }

  p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`;

export const ProcessingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  svg {
    color: #f59e0b;
    animation: ${spin} 1s linear infinite;
  }
`;

export const UploadedFiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

export const FileChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary);

  svg {
    color: #22c55e;
  }
`;

export const ExtractedResults = styled.div`
  margin-top: 24px;

  h4 {
    margin: 0 0 16px;
    color: var(--text-primary);
    font-size: 1rem;
  }
`;

export const ResultCard = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  margin-bottom: 16px;
  overflow: hidden;
`;

export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
`;

export const ResultSource = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--text-primary);
`;

export const PreviewBtn = styled.button`
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: ${transitions.hover};

  &:hover {
    background: var(--bg-hover);
    color: #f59e0b;
  }
`;

export const ResultActions = styled.div`
  display: flex;
  gap: 4px;

  button {
    padding: 6px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 4px;
    transition: ${transitions.hover};

    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
  }
`;

export const ResultData = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DataField = styled.div`
  label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }
`;

export const FieldValues = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ValueChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--text-primary);

  input {
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.85rem;
    width: 150px;
    outline: none;
  }

  &:hover .edit-btn {
    opacity: 1;
  }
`;

export const EditBtn = styled.button`
  padding: 2px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;

  &:hover {
    color: #f59e0b;
  }
`;

export const ImportSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  svg {
    color: #f59e0b;
  }

  span {
    flex: 1;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const ImportBtn = styled.button`
  padding: 10px 24px;
  background: #f59e0b;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #d97706;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ImagePreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: var(--z-fullscreen, 700);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const PreviewContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;

  img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 8px;
  }
`;

export const ClosePreviewBtn = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #f59e0b;
  }
`;
