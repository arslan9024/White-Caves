// FILE: src/pages/dashboard/ProfileDashboardView.styles.ts
/**
 * White Caves Real Estate LLC - Sovereign Profile Dashboard Workspace Styles
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
`;

export const HeaderSection = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  padding-bottom: 20px;

  .title-box {
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
      margin: 4px 0 0;
      font-size: 13px;
      color: #94a3b8;
    }
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfileCard = styled.div`
  background: #111827;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  .avatar-box {
    display: flex;
    align-items: center;
    gap: 16px;

    .avatar-img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid #ef4444;
      background: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ef4444;
      font-size: 22px;
      font-weight: 800;
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
    }

    .user-info {
      h2 {
        margin: 0;
        font-size: 17px;
        font-weight: 800;
        color: #ffffff;
      }
      .email {
        font-size: 12px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 2px;
      }
    }
  }

  .badges-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .badge {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .role-badge {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .level-badge {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
  }

  .details-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 16px;

    .item {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      .lbl {
        color: #94a3b8;
      }
      .val {
        color: #ffffff;
        font-weight: 600;
      }
    }
  }
`;

export const PreferencesCard = styled.div`
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pref-section {
    display: flex;
    flex-direction: column;
    gap: 10px;

    label {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .btn-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  }
`;

export const ChoiceButton = styled.button<{ $isActive: boolean }>`
  background: ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.05)')};
  color: ${props => (props.$isActive ? '#ffffff' : '#cbd5e1')};
  border: 1px solid ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.12)')};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$isActive ? '#dc2626' : 'rgba(255, 255, 255, 0.1)')};
    color: #ffffff;
  }
`;
