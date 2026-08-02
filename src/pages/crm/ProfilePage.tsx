import React, { FC } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { spacing, typography, borderRadius } from '../../design-tokens';
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
  background: #FFFFFF;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${borderRadius.xl};
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);
  color: #1E293B;
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
  border: 3px solid #EF4444;
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
    font-weight: 800;
    color: #1E293B;
  }

  p {
    margin: ${spacing[1]} 0 ${spacing[3]};
    color: #64748B;
    font-size: 1.1rem;
  }
`;

const CRMButton = styled.button`
  background: linear-gradient(135deg, #EF4444 0%, #EF4444 100%);
  color: #FFFFFF;
  border: none;
  border-radius: ${borderRadius.md};
  padding: 10px 20px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.45);
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid #EF4444;
        `;
      case 'admin':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid #EF4444;
        `;
      default:
        return `
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid #EF4444;
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
  background: #F8FAFC;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${borderRadius.lg};
  padding: ${spacing[6]};
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);
  color: #1E293B;

  h2 {
    margin-top: 0;
    margin-bottom: ${spacing[4]};
    font-size: 1.25rem;
    color: #EF4444;
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing[4]};

  label {
    display: block;
    margin-bottom: ${spacing[1]};
    font-weight: 700;
    color: #1E293B;
    font-size: 0.875rem;
  }

  input,
  select {
    width: 100%;
    padding: ${spacing[2]} ${spacing[3]};
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: ${borderRadius.md};
    background: #FFFFFF;
    color: #1E293B;
    ${typography.presets.body};

    &:focus {
      outline: 2px solid #EF4444;
      border-color: transparent;
    }
  }
`;

const SaveButton = styled.button`
  background: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing[2]} ${spacing[4]};
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #EF4444;
  }
`;

const TrackerRing = styled.div<{ pct: number }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#EF4444 ${({ pct }) => pct}%, #E2E8F0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing[4]};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    background: #FFFFFF;
    border-radius: 50%;
  }

  span {
    position: relative;
    font-size: 1.5rem;
    font-weight: 700;
    color: #EF4444;
  }
`;

const SessionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SessionItem = styled.li`
  padding: ${spacing[3]} 0;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);

  &:last-child {
    border-bottom: none;
  }

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  strong {
    color: #1E293B;
  }

  span {
    font-size: 0.875rem;
    color: #64748B;
  }
`;

export const ProfilePage: FC = () => {
  useDocumentTitle('Executive Profile | White Caves');
  const navigate = useNavigate();
  const {
    user,
    profileName,
    setProfileName,
    profilePhone,
    setProfilePhone,
    profileLanguage,
    setProfileLanguage,
    handleSaveProfile,
    isSaving,
  } = useUserProfile();

  const isFounder = user?.email === 'arslanmalikgoraha@gmail.com';

  return (
    <PublicLayout>
      <ProfileWrapper>
        <ExecutiveHeader>
          <AvatarContainer>
            <img alt="Profile"
              src={
                user?.photoURL ||
                'https://ui-avatars.com/api/?name=' +
                  (user?.name || 'A') +
                  '&background=EF4444&color=fff'
              }
            />
          </AvatarContainer>
          <HeaderContent>
            <h1>{user?.name || 'Executive User'}</h1>
            <p>{user?.email}</p>
            <BadgeContainer>
              {isFounder && (
                <SecurityBadge $type="founder">LEVEL 5 MASTER (Principal Founder)</SecurityBadge>
              )}
              {isFounder && <SecurityBadge $type="admin">System Superuser</SecurityBadge>}
              {!isFounder && <SecurityBadge>{user?.role || 'Agent'}</SecurityBadge>}
              <CRMButton onClick={() => navigate('/crm')}>
                <span>🚀 Launch CRM Cockpit</span>
              </CRMButton>
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
            <FormGroup>
              <label>Language Preference</label>
              <select value={profileLanguage} onChange={e => setProfileLanguage(e.target.value)}>
                <option value="en">English (US)</option>
                <option value="ar">Arabic (AE)</option>
              </select>
            </FormGroup>
            <SaveButton onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Synchronizing...' : 'Save Configuration'}
            </SaveButton>
          </Card>

          <Card>
            <h2>Active Session Logging</h2>
            <SessionList>
              <SessionItem>
                <div>
                  <strong>Current Session (Desktop)</strong>
                  <span style={{ color: 'var(--accent-red, #EF4444)', fontWeight: 'bold' }}>Active Now</span>
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
            <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.875rem' }}>
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
  </PublicLayout>
  );
};

export default ProfilePage;
