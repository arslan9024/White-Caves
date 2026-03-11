import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

export const Label = styled.label<{ required?: boolean }>`
  font-size: ${theme.typography.sizes.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${theme.colors.dark.text};
  }
`;

export const Required = styled.span`
  color: ${theme.colors.error};
  margin-left: 4px;
`;

export const DropZone = styled.div<{ isDragActive?: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.lg};
  text-align: center;
  background: ${props => props.isDragActive ? 'rgba(211, 47, 47, 0.05)' : theme.colors.background.tertiary};
  transition: ${theme.transitions.all};
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.primary};
    background: rgba(211, 47, 47, 0.05);
  }

  &[data-theme='dark'] {
    background: ${props => props.isDragActive ? 'rgba(211, 47, 47, 0.1)' : theme.colors.dark.bgTertiary};
    border-color: ${props => props.isDragActive ? theme.colors.primaryLight : theme.colors.dark.border};

    &:hover {
      border-color: ${theme.colors.primaryLight};
      background: rgba(211, 47, 47, 0.1);
    }
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const UploadIcon = styled.span`
  font-size: 32px;
  display: block;
  margin: 0 0 ${theme.spacing.sm} 0;
`;

export const UploadText = styled.p`
  margin: 0;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  font-weight: 500;

  &[data-theme='dark'] {
    color: ${theme.colors.dark.text};
  }
`;

export const UploadHint = styled.p`
  margin: ${theme.spacing.xs} 0 0 0;
  font-size: 12px;
  color: ${theme.colors.text.tertiary};

  &[data-theme='dark'] {
    color: ${theme.colors.dark.textSecondary};
  }
`;

export const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.md} 0 0 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm};
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-size: 12px;

  &[data-theme='dark'] {
    background: ${theme.colors.dark.bgSecondary};
    border-color: ${theme.colors.dark.border};
  }
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  flex: 1;
`;

export const FileName = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: 500;

  &[data-theme='dark'] {
    color: ${theme.colors.dark.text};
  }
`;

export const FileSize = styled.span`
  color: ${theme.colors.text.tertiary};
  font-size: 11px;

  &[data-theme='dark'] {
    color: ${theme.colors.dark.textSecondary};
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.error};
  font-size: 16px;
  padding: 4px 8px;
  transition: ${theme.transitions.all};

  &:hover {
    opacity: 0.8;
  }

  &[data-theme='dark'] {
    color: ${theme.colors.errorLight};
  }
`;

export const HelperText = styled.span<{ error?: boolean }>`
  font-size: 12px;
  color: ${props => props.error ? theme.colors.error : theme.colors.text.tertiary};
  margin-top: 4px;
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${props => props.error ? theme.colors.errorLight : theme.colors.dark.textSecondary};
  }
`;
