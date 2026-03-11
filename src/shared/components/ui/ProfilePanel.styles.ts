import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const ProfilePanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: ${fadeIn} 0.2s ease;
`;

export const ProfilePanelContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  max-width: 100vw;
  height: 100vh;
  background: var(--bg-primary);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: ${slideInRight} 0.3s ease;

  [data-theme="dark"] & {
    background: var(--bg-primary-dark, #0f172a);
  }
`;

export const ProfilePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const ProfilePanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const ProfilePanelCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  [data-theme="dark"] & {
    background: var(--bg-secondary-dark, #1e293b);
    color: var(--text-secondary-dark, #94a3b8);

    &:hover {
      background: var(--bg-tertiary-dark, #334155);
      color: var(--text-primary-dark, #f9fafb);
    }
  }
`;

export const ProfilePanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export const ProfileAvatarSection = styled.div`
  position: relative;
`;

export const ProfileAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary);
`;

export const ProfileAvatarPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  border: 4px solid var(--border-color);

  [data-theme="dark"] & {
    background: var(--bg-tertiary-dark, #334155);
    color: var(--text-tertiary-dark, #cbd5e1);
    border-color: var(--border-color-dark, #374151);
  }
`;

export const EditAvatarButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  [data-theme="dark"] & {
    border-color: var(--bg-primary-dark, #0f172a);
  }
`;

export const ProfileInfo = styled.div`
  text-align: center;
`;

export const ProfileName = styled.h4`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const ProfileRole = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;

  [data-theme="dark"] & {
    background: rgba(220, 38, 38, 0.1);
  }
`;

export const ProfileDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProfileDetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;

  [data-theme="dark"] & {
    background: var(--bg-secondary-dark, #1e293b);
  }
`;

export const ProfileDetailLabel = styled.span`
  font-size: 12px;
  color: var(--text-muted, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;

  [data-theme="dark"] & {
    color: var(--text-muted-dark, #64748b);
  }
`;

export const ProfileDetailValue = styled.span`
  font-size: 14px;
  color: var(--text-primary);
  word-break: break-all;

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const ProfileActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const ProfileActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-hover, #f3f4f6);
    border-color: var(--text-secondary);
  }

  [data-theme="dark"] & {
    background: var(--bg-secondary-dark, #1e293b);
    border-color: var(--border-color-dark, #374151);
    color: var(--text-primary-dark, #f9fafb);

    &:hover {
      background: var(--bg-hover-dark, #334155);
    }
  }
`;

export const ProfileActionDanger = styled(ProfileActionButton)`
  color: var(--error-color, #ef4444);

  &:hover {
    background: var(--error-bg, #fee2e2);
    border-color: var(--error-color, #ef4444);
  }

  [data-theme="dark"] & {
    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
`;

export const ProfileDivider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--border-color);

  [data-theme="dark"] & {
    background: var(--border-color-dark, #374151);
  }
`;
