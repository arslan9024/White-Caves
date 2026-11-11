import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 680px;
  background: #090e17;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
  color: #f8fafc;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  [data-theme='light'] & {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: rgba(15, 23, 42, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  [data-theme='light'] & {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;

    h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 800;
      color: #ffffff;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;

    &:hover {
      color: #ef4444;
    }
  }
`;

export const InputSection = styled.div`
  padding: 16px 20px;
  background: #0d1527;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;

  [data-theme='light'] & {
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
  }

  .input-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
  }

  .amount-input-box {
    display: flex;
    align-items: center;
    background: #172033;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 8px 12px;
    gap: 8px;

    [data-theme='light'] & {
      background: #ffffff;
      border: 1px solid #cbd5e1;
    }

    input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }
  }
`;

export const CurrencyGrid = styled.div`
  padding: 16px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  max-height: 380px;
  overflow-y: auto;
`;

export const CurrencyTile = styled.button<{ $isSelected: boolean; $isCrypto?: boolean }>`
  background: ${({ $isSelected }) => ($isSelected ? 'rgba(239, 68, 68, 0.15)' : '#111827')};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? '#ef4444' : 'rgba(255, 255, 255, 0.06)')};
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ef4444;
  }

  [data-theme='light'] & {
    background: ${({ $isSelected }) => ($isSelected ? 'rgba(239, 68, 68, 0.1)' : '#f8fafc')};
    border-color: ${({ $isSelected }) => ($isSelected ? '#ef4444' : '#e2e8f0')};
  }

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .code-flag {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 800;
      font-size: 0.78rem;
      color: #ffffff;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .rate-chip {
      font-size: 0.62rem;
      color: #94a3b8;
      font-family: monospace;
    }
  }

  .converted-val {
    font-size: 1.05rem;
    font-weight: 800;
    color: ${({ $isSelected }) => ($isSelected ? '#ef4444' : '#ffffff')};

    [data-theme='light'] & {
      color: ${({ $isSelected }) => ($isSelected ? '#ef4444' : '#0f172a')};
    }
  }

  .name-text {
    font-size: 0.65rem;
    color: #64748b;
  }
`;

