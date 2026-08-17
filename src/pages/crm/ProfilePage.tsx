import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { spacing, borderRadius } from '../../design-tokens';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { useLanguage, type LanguageType } from '../../context/LanguageContext';
import { useGlobalCurrency, type CurrencyCode } from '../../context/CurrencyContext';
import { safeStorage } from '../../utils/safeStorage';

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
  background: var(--bg-card, #111827);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color, rgba(239, 68, 68, 0.25));
  border-radius: ${borderRadius.xl};
  padding: ${spacing[5]};
  box-shadow: var(--shadow-card, 0 12px 32px rgba(0, 0, 0, 0.3));
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
  border-bottom: 1px solid var(--border-color, rgba(239, 68, 68, 0.2));

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #ef4444;
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
    object-fit: cover;
  }
`;

const SidebarUserInfo = styled.div`
  overflow: hidden;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text-primary, #f8fafc);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 3px 0 0;
    font-size: 0.78rem;
    color: var(--text-muted, #94a3b8);
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
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)'
      : 'transparent'};
  color: ${({ $active }) => ($active ? '#EF4444' : 'var(--text-secondary, #94a3b8)')};
  border-left: 4px solid ${({ $active }) => ($active ? '#EF4444' : 'transparent')};

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    color: var(--text-primary, #f8fafc);
    transform: translateX(3px);
  }
`;

const MainContentArea = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

const Card = styled.div`
  background: var(--bg-card, #111827);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: ${borderRadius.xl};
  padding: ${spacing[7]};
  box-shadow: var(--shadow-card, 0 16px 40px rgba(0, 0, 0, 0.35));
  color: var(--text-primary, #f8fafc);

  h2 {
    margin-top: 0;
    margin-bottom: ${spacing[5]};
    font-size: 1.4rem;
    color: var(--text-primary, #f8fafc);
    display: flex;
    align-items: center;
    gap: ${spacing[3]};
    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
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
    color: var(--text-secondary, #e2e8f0);
    font-size: 0.875rem;
    letter-spacing: 0.02em;
  }

  input,
  select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border-input, rgba(255, 255, 255, 0.15));
    border-radius: ${borderRadius.lg};
    background: var(--bg-input, rgba(15, 23, 42, 0.8));
    color: var(--text-primary, #f8fafc);
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
    }
  }
`;

const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing[4]};
  margin-top: ${spacing[3]};
`;

const PreferenceBox = styled.div`
  background: var(--bg-secondary, rgba(30, 41, 59, 0.5));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: ${borderRadius.lg};
  padding: ${spacing[4]};
`;

const OptionButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const OptionBtn = styled.button<{ $selected: boolean }>`
  flex: 1;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid ${p => (p.$selected ? '#EF4444' : 'var(--border-color, rgba(255, 255, 255, 0.15))')};
  background: ${p => (p.$selected ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-input, transparent)')};
  color: ${p => (p.$selected ? '#EF4444' : 'var(--text-secondary, #94A3B8)')};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ef4444;
    color: var(--text-primary, #ffffff);
  }
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
  cursor: pointer;

  span {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-secondary, #e2e8f0);
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: #ef4444;
    cursor: pointer;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  border: none;
  border-radius: ${borderRadius.lg};
  padding: ${spacing[3]} ${spacing[8]};
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.35);
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.45);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
`;

export const ProfilePage: FC = () => {
  useDocumentTitle('Executive Workspace & Preferences | White Caves');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'preferences' | 'rera' | 'goals' | 'security' | 'sessions' | 'shortcuts'
  >('profile');

  const {
    user,
    profileName,
    setProfileName,
    profilePhone,
    setProfilePhone,
    profilePhotoUrl,
    setProfilePhotoUrl,
    handleSaveProfile,
    isSaving,
  } = useUserProfile();

  const { themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { currency, setCurrency, currencies } = useGlobalCurrency();

  // Additional user preferences
  const [measurementUnit, setMeasurementUnit] = useState<'sqft' | 'sqm'>(() => {
    return (safeStorage.get('whitecaves_unit') as 'sqft' | 'sqm') || 'sqft';
  });
  const [notifyWhatsApp, setNotifyWhatsApp] = useState<boolean>(true);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [notifySms, setNotifySms] = useState<boolean>(false);

  const handleSavePreferences = () => {
    safeStorage.set('whitecaves_unit', measurementUnit);
    safeStorage.set(
      'whitecaves_notifications',
      JSON.stringify({ notifyWhatsApp, notifyEmail, notifySms })
    );
    handleSaveProfile();
  };

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
              <SidebarItem
                $active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              >
                <span>👤</span> Profile Info
              </SidebarItem>
              <SidebarItem
                $active={activeTab === 'preferences'}
                onClick={() => setActiveTab('preferences')}
              >
                <span>⚙️</span> System Preferences
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
              <SidebarItem
                $active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
              >
                <span>🔐</span> Biometric Security
              </SidebarItem>
              <SidebarItem
                $active={activeTab === 'sessions'}
                onClick={() => setActiveTab('sessions')}
              >
                <span>💻</span> Active Sessions
              </SidebarItem>
            </SidebarNav>
          </SidebarContainer>

          {/* Dynamic Content Views */}
          <MainContentArea>
            {/* Tab 1: Profile Info */}
            {activeTab === 'profile' && (
              <Card>
                <h2>
                  <span>👤</span> Personal Profile Information
                </h2>
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
                <SaveButton onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Synchronizing Profile...' : 'Save Profile Changes'}
                </SaveButton>
              </Card>
            )}

            {/* Tab 2: System Preferences */}
            {activeTab === 'preferences' && (
              <Card>
                <h2>
                  <span>⚙️</span> Universal Preferences & Customization
                </h2>
                <PreferencesGrid>
                  {/* Theme Mode */}
                  <PreferenceBox>
                    <label
                      style={{
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      🎨 Theme Mode
                    </label>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        margin: '2px 0 8px',
                      }}
                    >
                      Select appearance mode
                    </p>
                    <OptionButtonGroup>
                      <OptionBtn
                        $selected={themeMode === 'light'}
                        onClick={() => setThemeMode('light')}
                      >
                        ☀️ Light
                      </OptionBtn>
                      <OptionBtn
                        $selected={themeMode === 'dark'}
                        onClick={() => setThemeMode('dark')}
                      >
                        🌙 Dark
                      </OptionBtn>
                      <OptionBtn
                        $selected={themeMode === 'system'}
                        onClick={() => setThemeMode('system')}
                      >
                        💻 System
                      </OptionBtn>
                    </OptionButtonGroup>
                  </PreferenceBox>

                  {/* Language */}
                  <PreferenceBox>
                    <label
                      style={{
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      🌐 Language
                    </label>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        margin: '2px 0 8px',
                      }}
                    >
                      Universal 4-language support
                    </p>
                    <OptionButtonGroup>
                      {Object.values(supportedLanguages).map(l => (
                        <OptionBtn
                          key={l.code}
                          $selected={language === l.code}
                          onClick={() => setLanguage(l.code as LanguageType)}
                        >
                          <span>{l.flag}</span> {l.code.toUpperCase()}
                        </OptionBtn>
                      ))}
                    </OptionButtonGroup>
                  </PreferenceBox>

                  {/* Base Currency */}
                  <PreferenceBox>
                    <label
                      style={{
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      💵 Base Currency
                    </label>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        margin: '2px 0 8px',
                      }}
                    >
                      Display property values in
                    </p>
                    <OptionButtonGroup>
                      {Object.values(currencies).map(c => (
                        <OptionBtn
                          key={c.code}
                          $selected={currency === c.code}
                          onClick={() => setCurrency(c.code as CurrencyCode)}
                        >
                          <span>{c.flag}</span> {c.code}
                        </OptionBtn>
                      ))}
                    </OptionButtonGroup>
                  </PreferenceBox>

                  {/* Area Measurement Units */}
                  <PreferenceBox>
                    <label
                      style={{
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      📐 Area Measurement
                    </label>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        margin: '2px 0 8px',
                      }}
                    >
                      Floor plan surface metric
                    </p>
                    <OptionButtonGroup>
                      <OptionBtn
                        $selected={measurementUnit === 'sqft'}
                        onClick={() => setMeasurementUnit('sqft')}
                      >
                        Sq.Ft (Feet²)
                      </OptionBtn>
                      <OptionBtn
                        $selected={measurementUnit === 'sqm'}
                        onClick={() => setMeasurementUnit('sqm')}
                      >
                        Sq.M (Meters²)
                      </OptionBtn>
                    </OptionButtonGroup>
                  </PreferenceBox>
                </PreferencesGrid>

                <div style={{ marginTop: spacing[6] }}>
                  <label
                    style={{
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      color: 'var(--text-primary)',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    🔔 Notification Channels
                  </label>
                  <ToggleRow>
                    <span>📱 Priority WhatsApp Deal & Lead Alerts</span>
                    <input
                      type="checkbox"
                      checked={notifyWhatsApp}
                      onChange={e => setNotifyWhatsApp(e.target.checked)}
                    />
                  </ToggleRow>
                  <ToggleRow>
                    <span>📧 Weekly Market Intelligence & Executive Digest</span>
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.checked)}
                    />
                  </ToggleRow>
                  <ToggleRow>
                    <span>💬 SMS Instant Viewing Schedule Alerts</span>
                    <input
                      type="checkbox"
                      checked={notifySms}
                      onChange={e => setNotifySms(e.target.checked)}
                    />
                  </ToggleRow>
                </div>

                <div style={{ marginTop: spacing[6] }}>
                  <SaveButton onClick={handleSavePreferences} disabled={isSaving}>
                    {isSaving ? 'Saving Preferences...' : 'Save & Synchronize All Preferences'}
                  </SaveButton>
                </div>
              </Card>
            )}

            {/* Tab 3: RERA & Government Accreditation */}
            {activeTab === 'rera' && (
              <Card>
                <h2>
                  <span>📜</span> Dubai Land Department & RERA Government Licenses
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: spacing[5] }}>
                  Official corporate accreditations and active license expiry monitors for White Caves Real Estate LLC.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: spacing[6] }}>
                  {/* DET License */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary, rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EF4444' }}>DET COMMERCIAL LICENSE</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: '#10B981', color: '#FFF', fontWeight: 800 }}>ACTIVE</span>
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>No. 1388443</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>Office Classification: General Brokerage</p>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      ⏳ Expiry: <span style={{ color: '#EF4444' }}>31-Jul-2026</span> (Audit Valid)
                    </div>
                  </div>

                  {/* RERA ORN */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary, rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EF4444' }}>RERA REGISTRATION (ORN)</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: '#10B981', color: '#FFF', fontWeight: 800 }}>ACTIVE</span>
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>ORN: 44483</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>Real Estate Regulatory Agency Dubai</p>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      ⏳ Expiry: <span style={{ color: '#EF4444' }}>15-Aug-2026</span> (Verified)
                    </div>
                  </div>

                  {/* Office HQ Ejari */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary, rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EF4444' }}>HQ EJARI CERTIFICATE</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: '#10B981', color: '#FFF', fontWeight: 800 }}>ACTIVE</span>
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>0120250814005322</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>Office D-72, El Shaye - 4 Building</p>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      ⏳ Expiry: <span style={{ color: '#EF4444' }}>01-Oct-2026</span> (Registered)
                    </div>
                  </div>

                  {/* ICP Card */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary, rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EF4444' }}>ICP ESTABLISHMENT CARD</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: '#10B981', color: '#FFF', fontWeight: 800 }}>ACTIVE</span>
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>MOL: 2/1/1192499</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>Ministry of Human Resources & Emiratisation</p>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      ⏳ Expiry: <span style={{ color: '#EF4444' }}>20-Nov-2026</span> (Compliant)
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Tab 4: Goals */}
            {activeTab === 'goals' && (
              <Card>
                <h2>
                  <span>🎯</span> Executive Goals & Sovereign Milestones
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: spacing[5] }}>
                  Track AED volume goals, closed transactions, and investment portfolios for Q3/Q4.
                </p>

                {/* Interactive Milestone Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary, #F8FAFC)', borderLeft: '4px solid #EF4444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Q3 Target: AED 250M Gross Transaction Volume</strong>
                      <span style={{ color: '#EF4444', fontWeight: 800 }}>88% Achieved</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#E2E8F0', overflow: 'hidden' }}>
                      <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg, #EF4444, #F97316)' }} />
                    </div>
                  </div>

                  <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary, #F8FAFC)', borderLeft: '4px solid #10B981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>DAMAC Hills 2 Cluster Portfolio: 9,378 Units Onboarded</strong>
                      <span style={{ color: '#10B981', fontWeight: 800 }}>100% Synced</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#E2E8F0', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#10B981' }} />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Tab 5: Biometric Security */}
            {activeTab === 'security' && (
              <Card>
                <h2>
                  <span>🔐</span> Biometric Security & Credentials
                </h2>
                <BiometricSetup />
              </Card>
            )}

            {/* Tab 6: Active Sessions */}
            {activeTab === 'sessions' && (
              <Card>
                <h2>
                  <span>💻</span> Active Sessions & Live IP Tickers
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: spacing[4] }}>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary, #F8FAFC)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Web App Dashboard Session (Current)</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>IP: 185.192.68.10 · Dubai, UAE · SSL Encrypted · TLS 1.3</span>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.75rem', fontWeight: 800 }}>ACTIVE NOW</span>
                  </div>
                </div>
              </Card>
            )}
          </MainContentArea>
        </WorkspaceLayout>
      </ProfileWrapper>
    </PublicLayout>
  );
};

export default ProfilePage;
