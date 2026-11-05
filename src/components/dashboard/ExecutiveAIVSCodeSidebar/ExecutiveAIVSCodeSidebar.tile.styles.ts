import styled from 'styled-components';

export const AgentTile = styled.button<{ $isSelected?: boolean; $accentColor?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  background: ${({ $isSelected }) => ($isSelected ? 'rgba(239, 68, 68, 0.18)' : '#070D18')};
  border: ${({ $isSelected }) =>
    $isSelected ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.05)'};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  [data-theme='light'] & {
    background: ${({ $isSelected }) => ($isSelected ? 'rgba(239, 68, 68, 0.12)' : '#F8FAFC')};
    border: ${({ $isSelected }) => ($isSelected ? '1px solid #EF4444' : '1px solid #E2E8F0')};
  }

  &:hover {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }

  .agent-avatar {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    font-size: 0.65rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .agent-info {
    flex: 1;
    overflow: hidden;

    .agent-name {
      font-size: 0.72rem;
      font-weight: 800;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .agent-dept {
      font-size: 0.62rem;
      color: #64748b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .mesh-status {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }
`;

export const AIDirectiveForm = styled.form`
  padding: 8px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  gap: 6px;

  [data-theme='light'] & {
    border-top: 1px solid #e2e8f0;
  }

  input {
    flex: 1;
    background: #070d18;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 0.75rem;
    color: #ffffff;
    outline: none;

    [data-theme='light'] & {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }

    &:focus {
      border-color: #ef4444;
    }
  }

  button {
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.9;
    }
  }
`;
