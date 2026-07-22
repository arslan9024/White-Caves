import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { colors, spacing, typography, borderRadius, shadows } from '../../design-tokens';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';

const ProfileWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]} ${spacing[4]};
`;

const ExecutiveHeader = styled.header`
  display: flex;
  align-items: flex-start;
  gap: ${spacing[6]};
  padding: ${spacing[6]};
  background: linear-gradient(135deg, rgba(38, 38, 46, 0.98), rgba(24, 24, 30, 0.98));
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
  color: #f8f6ef;
  margin-bottom: ${spacing[6]};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #c9a84c;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeaderContent = styled.div`
  flex: 1;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
  }

  p {
    margin: ${spacing[1]} 0 ${spacing[3]};
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[2]};
  margin-top: ${spacing[3]};

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SecurityBadge = styled.span<{ $type?: 'founder' | 'admin' | 'system' }>`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  ${({ $type }) => {
    switch ($type) {
      case 'founder':
        return `
          background: linear-gradient(135deg, #bd8f2f, #e4b75e);
          color: #1f1300;
        `;
      case 'admin':
        return `
          background: rgba(255, 68, 68, 0.15);
          color: #ff6b6b;
          border: 1px solid rgba(255, 68, 68, 0.3);
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${spacing[6]};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${colors.background.surface};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[6]};
  box-shadow: ${shadows.default};

  h2 {
    margin-top: 0;
    margin-bottom: ${spacing[4]};
    font-size: 1.25rem;
    color: ${colors.text.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing[4]};

  label {
    display: block;
    margin-bottom: ${spacing[1]};
    font-weight: 600;
    color: ${colors.text.secondary};
    font-size: 0.875rem;
  }

  input {
    width: 100%;
    padding: ${spacing[2]} ${spacing[3]};
    border: 1px solid ${colors.border.main};
    border-radius: ${borderRadius.md};
    ${typography.presets.body};

    &:focus {
      outline: 2px solid ${colors.primary[500]};
      border-color: transparent;
    }
  }
`;

const SaveButton = styled.button`
  background: ${colors.primary[600]};
  color: white;
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing[2]} ${spacing[4]};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${colors.primary[700]};
  }
`;

const TrackerRing = styled.div<{ pct: number }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#4ade80 ${({ pct }) => pct}%, #e5e7eb 0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing[4]};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    background: ${colors.background.surface};
    border-radius: 50%;
  }

  span {
    position: relative;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.text.primary};
  }
`;

const SessionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SessionItem = styled.li`
  padding: ${spacing[3]} 0;
  border-bottom: 1px solid ${colors.border.light};

  &:last-child {
    border-bottom: none;
  }

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  strong {
    color: ${colors.text.primary};
  }

  span {
    font-size: 0.875rem;
    color: ${colors.text.secondary};
  }
`;

export const ProfilePage: FC = () => {
  useDocumentTitle('Executive Profile | White Caves');
  const {
    user,
    profileName,
    setProfileName,
    profilePhone,
    setProfilePhone,
    updateProfile,
    isUpdating,
  } = useUserProfile();

  const isFounder = user?.email === 'arslanmalikgoraha@gmail.com';

  return (
    <ProfileWrapper>
      <ExecutiveHeader>
        <AvatarContainer>
          <img
            src={
              user?.photoURL ||
              'https://ui-avatars.com/api/?name=' +
                (user?.name || 'A') +
                '&background=C9A84C&color=fff'
            }
            alt="Profile"
          />
        </AvatarContainer>
        <HeaderContent>
          <h1>{user?.name || 'Executive User'}</h1>
          <p>{user?.email}</p>
          <BadgeContainer>
            {isFounder && <SecurityBadge $type="founder">Principal Founder</SecurityBadge>}
            {isFounder && <SecurityBadge $type="system">System Superuser</SecurityBadge>}
            {isFounder && <SecurityBadge $type="admin">Level 5 Admin</SecurityBadge>}
            {!isFounder && <SecurityBadge>{user?.role || 'Agent'}</SecurityBadge>}
          </BadgeContainer>
        </HeaderContent>
      </ExecutiveHeader>

      <Grid>
        <div>
          <Card style={{ marginBottom: spacing[6] }}>
            <h2>Client-Side Profile Configuration</h2>
            <FormGroup>
              <label>Full Name</label>
              <input value={profileName} onChange={e => setProfileName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>Direct Contact Line</label>
              <input value={profilePhone} onChange={e => setProfilePhone(e.target.value)} />
            </FormGroup>
            <SaveButton onClick={updateProfile} disabled={isUpdating}>
              {isUpdating ? 'Synchronizing...' : 'Save Configuration'}
            </SaveButton>
          </Card>

          <Card>
            <h2>Active Session Logging</h2>
            <SessionList>
              <SessionItem>
                <div>
                  <strong>Current Session (Desktop)</strong>
                  <span style={{ color: '#4ade80' }}>Active Now</span>
                </div>
                <span>IP: 192.168.1.1 · Dubai, UAE</span>
              </SessionItem>
              <SessionItem>
                <div>
                  <strong>Mobile Auth (iOS Safari)</strong>
                  <span>2 hours ago</span>
                </div>
                <span>IP: 10.0.0.5 · Abu Dhabi, UAE</span>
              </SessionItem>
            </SessionList>
          </Card>
        </div>

        <div>
          <Card style={{ marginBottom: spacing[6], textAlign: 'center' }}>
            <h2>Corporate Completion Metrics</h2>
            <TrackerRing pct={100}>
              <span>100%</span>
            </TrackerRing>
            <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              Your executive profile and corporate KYC documentation are 100% verified.
            </p>
          </Card>

          <Card>
            <h2>Biometric Security</h2>
            <BiometricSetup />
          </Card>
        </div>
      </Grid>
    </ProfileWrapper>
  );
};

export default ProfilePage;
