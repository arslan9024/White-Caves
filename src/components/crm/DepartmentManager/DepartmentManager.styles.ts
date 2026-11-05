import styled from 'styled-components';

export const ManagerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const ManagerModal = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(239, 68, 68, 0.2);
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  background: #0b1120;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #ef4444;

  .brand-group {
    display: flex;
    align-items: center;
    gap: 12px;
    h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    span {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  button.close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #ffffff;
    border-radius: 8px;
    padding: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
    &:hover {
      background: #ef4444;
    }
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ActionToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  .search-wrap {
    flex: 1;
    min-width: 240px;
    position: relative;
    input {
      width: 100%;
      padding: 10px 14px 10px 38px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
      }
    }
    svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
  }

  button.add-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 8px;
    background: #ef4444;
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 800;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    transition:
      transform 0.15s ease,
      background 0.15s ease;
    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  }
`;

export const DepartmentCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

export const DeptCard = styled.div<{ $accentColor?: string }>`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${({ $accentColor }) => $accentColor || '#EF4444'};
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    background: #ffffff;
  }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;

    .code-badge {
      font-family: monospace;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      background: #0f172a;
      color: #ffffff;
    }

    .title-group {
      flex: 1;
      h4 {
        margin: 4px 0 2px 0;
        font-size: 0.95rem;
        font-weight: 800;
        color: #0f172a;
      }
      p {
        margin: 0;
        font-size: 0.75rem;
        color: #64748b;
        line-height: 1.3;
      }
    }
  }

  .card-stats {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.75rem;
    color: #475569;
    padding-top: 8px;
    border-top: 1px dashed #cbd5e1;
  }

  .card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    button {
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;

      &:hover {
        background: #f1f5f9;
      }

      &.delete-btn {
        color: #dc2626;
        border-color: #fecaca;
        background: #fef2f2;
        &:hover {
          background: #fee2e2;
        }
      }
    }
  }
`;

export const FormCard = styled.form`
  background: #f8fafc;
  border: 1.5px solid #ef4444;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    label {
      font-size: 0.72rem;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input,
    select,
    textarea {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      font-size: 0.85rem;
      outline: none;
      box-sizing: border-box;
      &:focus {
        border-color: #ef4444;
      }
    }
  }

  .form-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;

    button {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 800;
      cursor: pointer;
    }
    button.cancel-btn {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #64748b;
    }
    button.submit-btn {
      background: #ef4444;
      border: none;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }
  }
`;
