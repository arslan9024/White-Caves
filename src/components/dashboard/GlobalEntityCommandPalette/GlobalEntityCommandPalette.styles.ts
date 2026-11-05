/**
 * White Caves Real Estate LLC - Global Command Palette Styles
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (Styles)
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const PaletteBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  z-index: 9999;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const PaletteDialog = styled.div`
  width: 90%;
  max-width: 680px;
  background: #0b1120;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 14px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.7),
    0 0 25px rgba(239, 68, 68, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 80vh;
  outline: none;

  [data-theme='light'] & {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
`;

export const PaletteSearchHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;

  [data-theme='light'] & {
    border-bottom: 1px solid #e2e8f0;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1.05rem;
    font-weight: 600;
    color: #f8fafc;

    [data-theme='light'] & {
      color: #0f172a;
    }

    &::placeholder {
      color: #64748b;
    }
  }
`;

export const CategoryFilterDeck = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 23, 42, 0.6);

  [data-theme='light'] & {
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
  }
`;

export const CategoryChip = styled.button<{ $active: boolean }>`
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? '#EF4444' : 'rgba(255, 255, 255, 0.1)')};
  background: ${({ $active }) => ($active ? 'rgba(239, 68, 68, 0.15)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#EF4444' : '#94A3B8')};
  transition: all 0.15s ease;

  &:hover {
    border-color: #ef4444;
    color: #f8fafc;
  }
`;

export const PaletteResultsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  max-height: 420px;
`;

export const PaletteResultItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? 'rgba(239, 68, 68, 0.12)' : 'transparent')};
  border: 1px solid ${({ $selected }) => ($selected ? 'rgba(239, 68, 68, 0.3)' : 'transparent')};
  transition: all 0.12s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .item-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;

    .item-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .item-subtitle {
      font-size: 0.72rem;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .item-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
`;

export const PaletteFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: #070d18;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.7rem;
  color: #64748b;

  [data-theme='light'] & {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }

  .shortcuts {
    display: flex;
    gap: 12px;

    kbd {
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 5px;
      border-radius: 4px;
      font-family: inherit;
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
`;
