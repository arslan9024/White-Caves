import styled from 'styled-components';

export const StudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TopActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .ai-badge {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 900;
      color: #0f172a;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;

export const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1.2fr;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftDocumentPane = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 1rem;
`;

export const PaneHeader = styled.div`
  background: #0f172a;
  color: #ffffff;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 0.85rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

export const DocumentCanvasViewer = styled.div<{ $zoom: number }>`
  padding: 1.5rem;
  background: #e2e8f0;
  min-height: 480px;
  max-height: 600px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: ${props => props.$zoom}%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: max-width 0.2s ease;
  }

  iframe {
    width: 100%;
    height: 520px;
    border: none;
    border-radius: 8px;
  }
`;

export const RightVariablesPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const VariableSectionCard = styled.div<{ $verified?: boolean }>`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #ef4444;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ef4444;
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.08);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .section-title {
      font-size: 0.76rem;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .match-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #ef4444;
      background: #ecfdf5;
      padding: 3px 8px;
      border-radius: 999px;
      border: 1px solid #a7f3d0;
    }
  }

  .value-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .field-box {
    display: flex;
    flex-direction: column;
    gap: 3px;

    label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748b;
      display: flex;
      justify-content: space-between;

      .ar {
        direction: rtl;
        color: #94a3b8;
      }
    }

    input,
    select {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 7px 10px;
      font-size: 0.88rem;
      font-weight: 700;
      color: #0f172a;
      outline: none;
      transition: border 0.15s ease;

      &:focus {
        border-color: #ef4444;
        background: #ffffff;
      }
    }
  }
`;

export const MrzTerminal = styled.div`
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 14px;
  font-family: monospace;
  font-size: 0.78rem;
  color: #ef4444;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, #EF4444, #EF4444);
        color: #FFFFFF;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        &:hover { opacity: 0.92; transform: translateY(-1px); }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: #FEE2E2;
        color: #DC2626;
        border: 1px solid #FCA5A5;
        &:hover { background: #FECACA; }
      `;
    }
    return `
      background: #FFFFFF;
      color: #334155;
      border: 1px solid #CBD5E1;
      &:hover { background: #F8FAFC; border-color: #94A3B8; }
    `;
  }}
`;

export const ZoomBtn = styled.button`
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;
