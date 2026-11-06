// FILE: src/components/crm/RoleManager/RoleManager.styles.ts
/**
 * White Caves Real Estate LLC - Role Manager Styling Tokens (Tier 3)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const RoleManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
`;

export const RoleHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  padding-bottom: 20px;

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 6px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    p {
      margin: 0;
      font-size: 13px;
      color: #94a3b8;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const RoleMetricsDeck = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

export const RoleMetricCard = styled.div<{ $accentColor?: string }>`
  background: #111827;
  border: 1px solid ${props => props.$accentColor || 'rgba(239, 68, 68, 0.2)'};
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

  .metric-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .value {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
    }

    .subtext {
      font-size: 12px;
      color: #cbd5e1;
    }
  }

  .metric-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$accentColor || '#ef4444'};
  }
`;

export const RoleFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 16px;

  .search-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 6px 12px;
    flex: 1;
    max-width: 360px;

    input {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 13px;
      outline: none;
      width: 100%;
    }
  }

  .filter-pills {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

export const FilterPill = styled.button<{ $isActive: boolean }>`
  background: ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.05)')};
  color: ${props => (props.$isActive ? '#ffffff' : '#cbd5e1')};
  border: 1px solid ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$isActive ? '#dc2626' : 'rgba(255, 255, 255, 0.1)')};
  }
`;

export const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
`;

export const RoleCard = styled.div<{ $isSimulated: boolean; $levelColor: string }>`
  background: #111827;
  border: 1px solid ${props => (props.$isSimulated ? '#ef4444' : 'rgba(255, 255, 255, 0.08)')};
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  box-shadow: ${props =>
    props.$isSimulated ? '0 0 20px rgba(239, 68, 68, 0.25)' : '0 4px 16px rgba(0, 0, 0, 0.2)'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(239, 68, 68, 0.4);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .role-title-box {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .code-badge {
        font-size: 10px;
        font-weight: 700;
        color: #ef4444;
        letter-spacing: 0.05em;
      }

      .role-name {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
      }

      .tier-label {
        font-size: 11px;
        color: #94a3b8;
      }
    }

    .level-badge {
      background: ${props => props.$levelColor}22;
      color: ${props => props.$levelColor};
      border: 1px solid ${props => props.$levelColor}44;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
    }
  }

  .role-desc {
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.5;
  }

  .role-permissions-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-height: 60px;
    overflow-y: auto;

    .perm-badge {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding-top: 10px;

    .assigned-count {
      font-size: 11px;
      color: #94a3b8;
    }

    .simulate-btn {
      background: ${props => (props.$isSimulated ? '#ef4444' : 'rgba(255, 255, 255, 0.08)')};
      color: #ffffff;
      border: 1px solid ${props => (props.$isSimulated ? '#ef4444' : 'rgba(255, 255, 255, 0.15)')};
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: #dc2626;
      }
    }
  }
`;
