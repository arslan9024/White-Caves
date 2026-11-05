import styled from 'styled-components';

export const StatsDeck = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
`;

export const StatCard = styled.div<{ $accent?: string }>`
  background: var(--bg-card, #070d18);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s ease;

  [data-theme='light'] & {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ${({ $accent }) => ($accent ? `${$accent}18` : 'rgba(239, 68, 68, 0.12)')};
    color: ${({ $accent }) => $accent || '#EF4444'};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-meta {
    display: flex;
    flex-direction: column;

    .num {
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--text-primary, #ffffff);
      line-height: 1.1;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .label {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;

      [data-theme='light'] & {
        color: #64748b;
      }
    }
  }
`;
