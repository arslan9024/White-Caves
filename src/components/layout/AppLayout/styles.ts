import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const AppLayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const AppMain = styled.main<{ $withNav?: boolean }>`
  flex: 1;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  ${props => props.$withNav && `
    padding-top: ${theme.spacing.lg};
    
    @media (max-width: ${theme.breakpoints.mobile}) {
      padding-top: 60px;
    }
  `}
`;
