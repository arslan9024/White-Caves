// FILE: src/pages/dashboard/ProfileDashboardView.tsx
/**
 * White Caves Real Estate LLC - Sovereign Profile Dashboard Workspace View
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { UserCheck, Shield, Key, Globe, DollarSign, Sun, Moon, Lock, Mail } from 'lucide-react';
import { UserRoleContext, ROLE_LABELS } from '../../context/UserRoleContext';
import { ThemeContext } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import { CurrencyContext } from '../../context/CurrencyContext';
import {
  ProfileContainer,
  HeaderSection,
  ContentGrid,
  ProfileCard,
  PreferencesCard,
  ChoiceButton,
} from './ProfileDashboardView.styles';

export const ProfileDashboardView: FC = () => {
  const roleContext = React.useContext(UserRoleContext);
  const user = roleContext?.user;
  const role = roleContext?.role || 'managing_director';
  const accessLevel = roleContext?.accessLevel || 5;
  const switchRole = roleContext?.switchRole || (() => {});

  const themeContext = React.useContext(ThemeContext);
  const isDark = themeContext ? themeContext.isDark : true;
  const toggleTheme = themeContext?.toggleTheme || (() => {});

  const langContext = React.useContext(LanguageContext);
  const language = langContext?.language || 'en';
  const setLanguage = langContext?.setLanguage || (() => {});

  const currencyContext = React.useContext(CurrencyContext);
  const currentCurrency = currencyContext?.currency || 'AED';
  const setCurrency = currencyContext?.setCurrency || (() => {});

  const displayName = user?.name || 'Arslan Malik Bashir Ahmad';
  const displayEmail = user?.email || 'arslan@whitecaves.com';
  const displayPhone = user?.phone || '+971 50 511 0636';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');

  return (
    <ProfileContainer data-testid="profile-dashboard-view">
      <HeaderSection>
        <div className="title-box">
          <h1>
            <UserCheck size={26} color="#ef4444" />
            <span>Sovereign Executive Profile & Preferences</span>
          </h1>
          <p>Manage your enterprise identity, access clearance, and localized workspace settings</p>
        </div>
      </HeaderSection>

      <ContentGrid>
        {/* Left Column: Identity & Access Card */}
        <ProfileCard>
          <div className="avatar-box">
            <div className="avatar-img">{initials}</div>
            <div className="user-info">
              <h2>{displayName}</h2>
              <div className="email">
                <Mail size={12} /> {displayEmail}
              </div>
            </div>
          </div>

          <div className="badges-row">
            <span className="badge role-badge">{ROLE_LABELS[role] || role}</span>
            <span className="badge level-badge">Access Level {accessLevel}</span>
          </div>

          <div className="details-list">
            <div className="item">
              <span className="lbl">Phone</span>
              <span className="val">{displayPhone}</span>
            </div>
            <div className="item">
              <span className="lbl">Assigned Department</span>
              <span className="val">Executive Directorate</span>
            </div>
            <div className="item">
              <span className="lbl">DET Commercial License</span>
              <span className="val">1388443</span>
            </div>
            <div className="item">
              <span className="lbl">RERA Office ORN</span>
              <span className="val">44483</span>
            </div>
            <div className="item">
              <span className="lbl">Ejari Registration</span>
              <span className="val">0120250814005322</span>
            </div>
          </div>
        </ProfileCard>

        {/* Right Column: Global Context Quartet Controls */}
        <PreferencesCard>
          <h3>Workspace Global Context Quartet</h3>

          <div className="pref-section">
            <label>Interface Theme Mode</label>
            <div className="btn-group">
              <ChoiceButton $isActive={isDark} onClick={toggleTheme}>
                <Moon size={14} /> Dark Mode
              </ChoiceButton>
              <ChoiceButton $isActive={!isDark} onClick={toggleTheme}>
                <Sun size={14} /> Light Mode
              </ChoiceButton>
            </div>
          </div>

          <div className="pref-section">
            <label>Workspace Language & Text Direction</label>
            <div className="btn-group">
              <ChoiceButton $isActive={language === 'en'} onClick={() => setLanguage('en')}>
                <Globe size={14} /> English (LTR)
              </ChoiceButton>
              <ChoiceButton $isActive={language === 'ar'} onClick={() => setLanguage('ar')}>
                <Globe size={14} /> العربية (RTL)
              </ChoiceButton>
              <ChoiceButton $isActive={language === 'es'} onClick={() => setLanguage('es')}>
                <Globe size={14} /> Español
              </ChoiceButton>
              <ChoiceButton $isActive={language === 'ru'} onClick={() => setLanguage('ru')}>
                <Globe size={14} /> Русский
              </ChoiceButton>
            </div>
          </div>

          <div className="pref-section">
            <label>Reporting Currency</label>
            <div className="btn-group">
              <ChoiceButton
                $isActive={currentCurrency === 'AED'}
                onClick={() => setCurrency('AED')}
              >
                <DollarSign size={14} /> AED (Dirham)
              </ChoiceButton>
              <ChoiceButton
                $isActive={currentCurrency === 'USD'}
                onClick={() => setCurrency('USD')}
              >
                <DollarSign size={14} /> USD (Dollar)
              </ChoiceButton>
              <ChoiceButton
                $isActive={currentCurrency === 'EUR'}
                onClick={() => setCurrency('EUR')}
              >
                <DollarSign size={14} /> EUR (Euro)
              </ChoiceButton>
              <ChoiceButton
                $isActive={currentCurrency === 'GBP'}
                onClick={() => setCurrency('GBP')}
              >
                <DollarSign size={14} /> GBP (Pound)
              </ChoiceButton>
            </div>
          </div>

          <div className="pref-section">
            <label>Simulate Live User Role</label>
            <div className="btn-group">
              <ChoiceButton
                $isActive={role === 'managing_director'}
                onClick={() => switchRole('managing_director')}
              >
                <Shield size={14} /> MD (Level 5)
              </ChoiceButton>
              <ChoiceButton $isActive={role === 'landlord'} onClick={() => switchRole('landlord')}>
                <UserCheck size={14} /> Landlord (Level 2)
              </ChoiceButton>
              <ChoiceButton $isActive={role === 'agent'} onClick={() => switchRole('agent')}>
                <Key size={14} /> Broker (Level 2)
              </ChoiceButton>
              <ChoiceButton $isActive={role === 'tenant'} onClick={() => switchRole('tenant')}>
                <Lock size={14} /> Tenant (Level 1)
              </ChoiceButton>
            </div>
          </div>
        </PreferencesCard>
      </ContentGrid>
    </ProfileContainer>
  );
};

export default ProfileDashboardView;
