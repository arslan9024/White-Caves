import styled from 'styled-components';

export { StatsDeck, StatCard } from './DepartmentStatsDeck.styles';
export { EditDrawerCard } from './DepartmentEditDrawer.styles';
export { DepartmentCard } from './DepartmentCard.styles';

export const WorkspaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const WorkspaceHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .tag {
      font-size: 0.72rem;
      font-weight: 800;
      color: #ef4444;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--text-primary, #ffffff);
      line-height: 1.2;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    p {
      margin: 0;
      font-size: 0.82rem;
      color: var(--text-muted, #94a3b8);

      [data-theme='light'] & {
        color: #64748b;
      }
    }
  }
`;

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 260px;
    max-width: 460px;

    input {
      width: 100%;
      background: var(--bg-card, #070d18);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      border-radius: 8px;
      padding: 9px 12px 9px 36px;
      font-size: 0.82rem;
      color: var(--text-primary, #ffffff);
      outline: none;
      box-sizing: border-box;

      [data-theme='light'] & {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        color: #0f172a;
      }

      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
      }
    }

    svg {
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
    }
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);

    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  }
`;

export const DepartmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;
