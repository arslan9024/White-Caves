import styled from 'styled-components';

export const NavbarHeader = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #0b1120;
  border-bottom: 2px solid #ef4444;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 950;
  user-select: none;
`;

export const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;

  .logo-box {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 14px;
    color: #ffffff;
    box-shadow: 0 2px 10px rgba(239, 68, 68, 0.35);
  }

  .title-area {
    display: flex;
    flex-direction: column;

    h1 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.6px;
    }

    .badge-sub {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.68rem;
      color: #94a3b8;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

export const CenterTeleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const TelemetryPill = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  font-size: 0.75rem;

  .label {
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
  }

  .val {
    color: #f8fafc;
    font-weight: 800;
    font-family: monospace;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
    animation: pulse 2s infinite;
  }
`;

export const RightActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const QuickActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.35);
  }

  .alert-pip {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px #ef4444;
  }
`;

export const ProfileMenuWrapper = styled.div`
  position: relative;
`;

export const ProfileTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 4px 4px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.25);
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 13px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .user-meta {
    text-align: left;
    display: flex;
    flex-direction: column;

    .name {
      font-size: 0.8rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }

    .role {
      font-size: 0.65rem;
      color: #ef4444;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 260px;
  background: #0b1120;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;

  .section-label {
    padding: 6px 10px 4px 10px;
    font-size: 0.68rem;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin: 4px 0;
  }
`;

export const DropdownItem = styled.button<{ $isDanger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  background: transparent;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ $isDanger }) => ($isDanger ? '#EF4444' : '#E2E8F0')};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${({ $isDanger }) =>
      $isDanger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.06)'};
    color: ${({ $isDanger }) => ($isDanger ? '#F87171' : '#FFFFFF')};
  }
`;
