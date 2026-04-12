import styled from 'styled-components';
import { transitions } from '../../../styles/theme/transitions';
import { radius } from '../../../styles/theme/radius';

export const CommandCenterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
`;

export const CommandCenterHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky, 200);
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CommandCenterTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
  background: linear-gradient(
    135deg,
    #f8fafc 0%,
    var(--primary-color, #0ea5e9) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const CommandCenterSubtitle = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
`;

export const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ViewToggleContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${radius.lg};
  padding: 4px;
`;

export const ToggleBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  border: none;
  background: ${(props) =>
    props.$active
      ? 'var(--primary-color, #0ea5e9)'
      : 'transparent'};
  color: ${(props) =>
    props.$active ? 'white' : '#64748b'};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.hover};

  &:hover {
    color: #e2e8f0;
  }
`;

export const HeaderAction = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.hover};
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CommandCenterMain = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  flex: 1;
  min-height: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 20px 24px;
`;

export const ActivitySidebar = styled.aside`
  background: rgba(15, 23, 42, 0.6);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  color: #e2e8f0;

  svg {
    animation: spin 2s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;