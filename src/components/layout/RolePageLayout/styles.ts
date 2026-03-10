import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const RolePageLayoutContainer = styled.div<{ $role?: string }>`
  min-height: 100vh;
  padding: 2rem;
  background: ${theme.colors.background.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1rem;
  }

  /* Role-specific stat card icon background colors */
  ${props => {
    const roleColors: Record<string, string> = {
      buyer: 'rgba(59, 130, 246, 0.1)',
      seller: 'rgba(16, 185, 129, 0.1)',
      landlord: 'rgba(139, 92, 246, 0.1)',
      tenant: 'rgba(6, 182, 212, 0.1)',
      'leasing-agent': 'rgba(245, 158, 11, 0.1)',
      'secondary-sales-agent': 'rgba(239, 68, 68, 0.1)',
      owner: 'rgba(255, 215, 0, 0.1)',
    };

    const color = props.$role ? roleColors[props.$role] : 'rgba(59, 130, 246, 0.1)';

    return `
      .stat-card-reusable .stat-icon-wrapper {
        background: ${color};
      }

      [data-theme="dark"] & .stat-card-reusable .stat-icon-wrapper {
        background: ${color.replace('0.1)', '0.2)')};
      }
    `;
  }}
`;

export const RolePageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const RolePageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const RolePageUniversalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RolePageProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid ${theme.colors.border};
  border-radius: 50%;
  background: ${theme.colors.background.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  img,
  span {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
