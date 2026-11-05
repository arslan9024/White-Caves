import styled from 'styled-components';

export const EditDrawerCard = styled.div`
  background: var(--bg-card, #070d18);
  border: 1.5px solid #ef4444;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
  animation: slideDown 0.2s ease-out;

  [data-theme='light'] & {
    background: #ffffff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 900;
      color: var(--text-primary, #ffffff);

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    button {
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      &:hover {
        color: #ef4444;
      }
    }
  }

  form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;

      label {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted, #94a3b8);
        letter-spacing: 0.5px;

        [data-theme='light'] & {
          color: #64748b;
        }
      }

      input,
      textarea {
        background: var(--bg-secondary, #0b1120);
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 0.82rem;
        color: var(--text-primary, #ffffff);
        outline: none;

        [data-theme='light'] & {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }

        &:focus {
          border-color: #ef4444;
        }
      }

      &.full-width {
        grid-column: 1 / -1;
      }
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 8px;

      button {
        padding: 8px 18px;
        border-radius: 6px;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .cancel-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: var(--text-muted, #94a3b8);

        [data-theme='light'] & {
          border-color: #cbd5e1;
          color: #475569;
        }
      }

      .save-btn {
        background: #ef4444;
        border: none;
        color: #ffffff;

        &:hover {
          background: #dc2626;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
`;
