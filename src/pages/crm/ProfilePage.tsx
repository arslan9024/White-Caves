import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { spacing, typography, borderRadius } from '../../design-tokens';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';
import CRMHubPage from './CRMHubPage';

const ProfileWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${spacing[8]} ${spacing[4]};
`;

const WorkspaceLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${spacing[6]};

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SidebarContainer = styled.aside`
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: ${borderRadius.xl};
  padding: ${spacing[5]};
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(6, 182, 212, 0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  padding-bottom: ${spacing[4]};
  margin-bottom: ${spacing[4]};
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #D4AF37;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
    object-fit: cover;
  }
`;

const SidebarUserInfo = styled.div`
  overflow: hidden;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: #F8FAFC;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 3px 0 0;
    font-size: 0.78rem;
    color: #94A3B8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const SidebarItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-radius: ${borderRadius.lg};
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  background: ${({ $active }) => ($active ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.05) 100%)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#38BDF8' : '#94A3B8')};
  border-left: 4px solid ${({ $active }) => ($active ? '#06B6D4' : 'transparent')};

  &:hover {
    background: rgba(6, 182, 212, 0.15);
    color: #F8FAFC;
    transform: translateX(3px);
  }
`;

const MainContentArea = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

const Card = styled.div`
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: ${borderRadius.xl};
  padding: ${spacing[7]};
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  color: #F8FAFC;

  h2 {
    margin-top: 0;
    margin-bottom: ${spacing[5]};
    font-size: 1.4rem;
    color: #F8FAFC;
    display: flex;
    align-items: center;
    gap: ${spacing[3]};
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: ${spacing[3]};

    span {
      font-size: 1.5rem;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing[5]};

  label {
    display: block;
    margin-bottom: ${spacing[2]};
    font-weight: 700;
    color: #E2E8F0;
    font-size: 0.875rem;
    letter-spacing: 0.02em;
  }

  input,
  select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: ${borderRadius.lg};
    background: rgba(15, 23, 42, 0.8);
    color: #F8FAFC;
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #06B6D4;
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25);
    }
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #06B6D4 0%, #0284C7 100%);
  color: #FFFFFF;
  border: none;
  border-radius: ${borderRadius.lg};
  padding: ${spacing[3]} ${spacing[8]};
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(6, 182, 212, 0.35);
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, #0891B2 0%, #0369A1 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(6, 182, 212, 0.45);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[4]} ${spacing[5]};
  background: rgba(30, 41, 59, 0.6);
  border-radius: ${borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 0.98rem;
    color: #F8FAFC;
  }

  span {
    font-size: 0.85rem;
    color: #94A3B8;
  }
`;

const QuickLinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${spacing[4]};
`;

const QuickLinkCard = styled.div`
  padding: ${spacing[5]};
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: ${borderRadius.xl};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(6, 182, 212, 0.2);
    border-color: #06B6D4;
    background: rgba(30, 41, 59, 0.95);
  }

  h4 {
    margin: 0 0 ${spacing[2]};
    color: #D4AF37;
    font-size: 1.1rem;
    font-weight: 800;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: #94A3B8;
    line-height: 1.5;
  }
`;

const Badge = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(6, 182, 212, 0.15);
  color: #38BDF8;
  border: 1px solid rgba(6, 182, 212, 0.4);
`;

export const ProfilePage: FC = () => {
  useDocumentTitle('Executive Workspace | White Caves');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'rera' | 'goals' | 'dashboard' | 'security' | 'sessions' | 'shortcuts'>('profile');

  const {
    user,
    profileName,
    setProfileName,
    profilePhone,
    setProfilePhone,
    profileLanguage,
    setProfileLanguage,
    profilePhotoUrl,
    setProfilePhotoUrl,
    brnNumber,
    setBrnNumber,
    reraLicense,
    setReraLicense,
    handleSaveProfile,
    isSaving,
  } = useUserProfile();

  const avatarSrc =
    profilePhotoUrl ||
    user?.photoURL ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(profileName || user?.name || 'Executive User') +
      '&background=EF4444&color=fff';

  return (
    <PublicLayout>
      <ProfileWrapper>
        <WorkspaceLayout>
          {/* Left Sidebar Navigation */}
          <SidebarContainer>
            <SidebarHeader>
              <img src={avatarSrc} alt="Executive Avatar" />
              <SidebarUserInfo>
                <h3>{profileName || user?.name || 'Executive User'}</h3>
                <p>{user?.email}</p>
              </SidebarUserInfo>
            </SidebarHeader>

            <SidebarNav>
              <SidebarItem $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                <span>👤</span> Profile Settings
              </SidebarItem>
              <SidebarItem $active={activeTab === 'rera'} onClick={() => setActiveTab('rera')}>
                <span>📜</span> RERA Accreditation
              </SidebarItem>
              <SidebarItem $active={activeTab === 'goals'} onClick={() => setActiveTab('goals')}>
                <span>🎯</span> Executive Goals
              </SidebarItem>
              <SidebarItem $active={false} onClick={() => navigate('/dashboard')}>
                <span>📊</span> Executive Dashboard
              </SidebarItem>
              <SidebarItem $active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
                <span>🔐</span> Biometric Security
              </SidebarItem>
              <SidebarItem $active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')}>
                <span>💻</span> Active Sessions
              </SidebarItem>
              <SidebarItem $active={activeTab === 'shortcuts'} onClick={() => setActiveTab('shortcuts')}>
                <span>⚡</span> Portals & Shortcuts
              </SidebarItem>
            </SidebarNav>
          </SidebarContainer>

          {/* Dynamic Content Views */}
          <MainContentArea>
            {activeTab === 'profile' && (
              <Card>
                <h2><span>👤</span> Personal Profile & Preferences</h2>
                <FormGroup>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Direct Contact Line</label>
                  <input
                    type="text"
                    placeholder="+971 50 XXX XXXX"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Profile Avatar Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={profilePhotoUrl}
                    onChange={e => setProfilePhotoUrl(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Language Preference</label>
                  <select value={profileLanguage} onChange={e => setProfileLanguage(e.target.value)}>
                    <option value="en">English (US)</option>
                    <option value="ar">Arabic (AE — UAE RTL)</option>
                  </select>
                </FormGroup>
                <SaveButton onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Synchronizing Profile...' : 'Save Configuration'}
                </SaveButton>
              </Card>
            )}

            {activeTab === 'rera' && (
              <Card>
                <h2><span>📜</span> RERA & DLD Government Accreditation</h2>
                <div style={{ marginBottom: spacing[4], display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Badge>RERA Licensed Agent ✅</Badge>
                  <Badge style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderColor: '#EF4444' }}>DET Reg #1388443</Badge>
                </div>

                {/* Company Credential Expiration & Countdown Matrix */}
                <div style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <h4 style={{ margin: '0 0 0.75rem', color: '#EF4444', fontSize: '0.95rem' }}>🏛️ Governing Credentials Expiration Tracker</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '10px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <strong style={{ color: '#F8FAFC', display: 'block', fontSize: '0.85rem' }}>DET Trade License</strong>
                      <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>#1388443 · Exp: 30-07-2026</span>
                      <div style={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 800, marginTop: '4px' }}>⏳ Renewal in 168 Days</div>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <strong style={{ color: '#F8FAFC', display: 'block', fontSize: '0.85rem' }}>RERA ORN Permit</strong>
                      <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>#44483 · Exp: 30-07-2026</span>
                      <div style={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 800, marginTop: '4px' }}>⏳ Renewal in 168 Days</div>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <strong style={{ color: '#F8FAFC', display: 'block', fontSize: '0.85rem' }}>HQ Office Ejari</strong>
                      <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>#0120250814005322</span>
                      <div style={{ color: '#EF4444', fontSize: '0.75rem', fontWeight: 800, marginTop: '4px' }}>⚠️ 30-Day Alert: 13-08-2026</div>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <strong style={{ color: '#F8FAFC', display: 'block', fontSize: '0.85rem' }}>ICP Establishment Card</strong>
                      <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>#2/1/1192499 · Exp: 31-08-2026</span>
                      <div style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 800, marginTop: '4px' }}>✅ Active & Compliant</div>
                    </div>
                  </div>
                </div>

                <FormGroup>
                  <label>RERA Broker Registration Number (BRN)</label>
                  <input
                    type="text"
                    placeholder="e.g. BRN-78912"
                    value={brnNumber}
                    onChange={e => setBrnNumber(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>RERA Corporate License Number</label>
                  <input
                    type="text"
                    placeholder="e.g. DLD-2026-9901"
                    value={reraLicense}
                    onChange={e => setReraLicense(e.target.value)}
                  />
                </FormGroup>
                <SaveButton onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Updating Credentials...' : 'Save RERA Accreditation'}
                </SaveButton>
              </Card>
            )}

            {activeTab === 'goals' && (
              <Card>
                <h2><span>🎯</span> Executive Target & KPI Milestones</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                      <strong style={{ color: '#E2E8F0', fontSize: '0.95rem' }}>Quarterly Sales Volume Target (AED 15,000,000)</strong>
                      <span style={{ color: '#06B6D4', fontWeight: 800 }}>82%</span>
                    </div>
                    <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, #06B6D4 0%, #38BDF8 100%)', borderRadius: '999px' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                      <strong style={{ color: '#E2E8F0', fontSize: '0.95rem' }}>Ejari Lease Contracts Executed (45 Units)</strong>
                      <span style={{ color: '#D4AF37', fontWeight: 800 }}>95%</span>
                    </div>
                    <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #D4AF37 0%, #FBBF24 100%)', borderRadius: '999px' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                      <strong style={{ color: '#E2E8F0', fontSize: '0.95rem' }}>HNWI Client Acquisition Target (12 Clients)</strong>
                      <span style={{ color: '#10B981', fontWeight: 800 }}>75%</span>
                    </div>
                    <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)', borderRadius: '999px' }} />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'dashboard' && <CRMHubPage />}

            {activeTab === 'security' && (
              <Card>
                <h2><span>🔐</span> Biometric Security & Multi-Factor Auth</h2>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', color: '#38BDF8' }}>
                  <strong>Security Status: Enterprise Hardened (Grade A+)</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94A3B8' }}>WebAuthn biometrics enabled for instant passkey login across iOS, Android, and Desktop browsers.</p>
                </div>
                <BiometricSetup />
              </Card>
            )}

            {activeTab === 'sessions' && (
              <Card>
                <h2><span>💻</span> Active Session Audit Logs</h2>
                <SessionList>
                  <SessionItem>
                    <div>
                      <strong style={{ color: '#F8FAFC' }}>Current Session (Desktop Executive Cockpit)</strong>
                      <span style={{ color: '#10B981', fontWeight: 'bold' }}>● Active Now</span>
                    </div>
                    <span style={{ color: '#94A3B8' }}>IP: 192.168.1.1 · Dubai, UAE</span>
                  </SessionItem>
                  <SessionItem>
                    <div>
                      <strong style={{ color: '#F8FAFC' }}>Mobile Auth (iOS App / PWA)</strong>
                      <span style={{ color: '#94A3B8' }}>Last active 2 hours ago</span>
                    </div>
                    <span style={{ color: '#94A3B8' }}>IP: 10.0.0.5 · Abu Dhabi, UAE</span>
                  </SessionItem>
                </SessionList>
              </Card>
            )}

            {activeTab === 'shortcuts' && (
              <Card>
                <h2><span>⚡</span> Executive Portals & Shortcuts</h2>
                <QuickLinkGrid>
                  <QuickLinkCard onClick={() => setActiveTab('dashboard')}>
                    <h4>📊 Executive Dashboard</h4>
                    <p>Access live CRM metrics, leads, and transaction pipelines</p>
                  </QuickLinkCard>
                  <QuickLinkCard onClick={() => navigate('/landlord')}>
                    <h4>🏰 Landlord Portal</h4>
                    <p>Overview of owned properties, occupancy, & payouts</p>
                  </QuickLinkCard>
                  <QuickLinkCard onClick={() => navigate('/tenant')}>
                    <h4>🔑 Tenant Portal</h4>
                    <p>Rent schedules, Ejari downloads, & maintenance tickets</p>
                  </QuickLinkCard>
                  <QuickLinkCard onClick={() => navigate('/owner/whatsapp')}>
                    <h4>🤖 Nina AI & WhatsApp</h4>
                    <p>Configure bot sessions and broadcast campaigns</p>
                  </QuickLinkCard>
                </QuickLinkGrid>
              </Card>
            )}
          </MainContentArea>
        </WorkspaceLayout>
      </ProfileWrapper>
    </PublicLayout>
  );
};

export default ProfilePage;
