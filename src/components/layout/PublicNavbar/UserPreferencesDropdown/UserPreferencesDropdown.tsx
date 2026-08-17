/**
 * UserPreferencesDropdown.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useUserPreferencesDropdownLogic, UseUserPreferencesDropdownProps } from './logic/UserPreferencesDropdown.logic';
import { PREFERENCE_LABELS } from './data/UserPreferencesDropdown.data';
import {
  DropdownContainer,
  UserHeader,
  UserDetails,
  SectionTitle,
  ButtonGrid,
  SelectBtn,
  LinksGroup,
  MenuLinkBtn,
} from './styles/UserPreferencesDropdown.style';
import { type ThemeMode } from '../../../../context/ThemeContext';
import { type LanguageType } from '../../../../context/LanguageContext';
import { type CurrencyCode } from '../../../../context/CurrencyContext';

export interface UserPreferencesDropdownProps extends UseUserPreferencesDropdownProps {}

export const UserPreferencesDropdown: FC<UserPreferencesDropdownProps> = ({ user, onClose }) => {
  const {
    dropdownRef,
    themeMode,
    setThemeMode,
    language,
    setLanguage,
    supportedLanguages,
    currency,
    setCurrency,
    currencies,
    themeItems,
    handleNavigate,
    handleLogout,
  } = useUserPreferencesDropdownLogic({ user, onClose });

  const avatar =
    user?.photoURL ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(user?.name || PREFERENCE_LABELS.guestName) +
      '&background=EF4444&color=fff';

  return (
    <DropdownContainer ref={dropdownRef} data-testid="user-preferences-dropdown">
      {/* User Info Header */}
      <UserHeader>
        <img src={avatar} alt="User Avatar" />
        <UserDetails>
          <h4>{user?.name || PREFERENCE_LABELS.guestName}</h4>
          <p>{user?.email || user?.role || PREFERENCE_LABELS.guestRole}</p>
        </UserDetails>
      </UserHeader>

      {/* 1. Theme Triad Selector */}
      <SectionTitle>{PREFERENCE_LABELS.themeTitle}</SectionTitle>
      <ButtonGrid $cols={3}>
        {themeItems.map(item => (
          <SelectBtn
            key={item.id}
            $selected={themeMode === item.id}
            onClick={() => setThemeMode(item.id as ThemeMode)}
            data-testid={`pref-theme-${item.id}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </SelectBtn>
        ))}
      </ButtonGrid>

      {/* 2. 4-Language Universal Selector */}
      <SectionTitle>{PREFERENCE_LABELS.languageTitle}</SectionTitle>
      <ButtonGrid $cols={4}>
        {Object.values(supportedLanguages).map(l => (
          <SelectBtn
            key={l.code}
            $selected={language === l.code}
            onClick={() => setLanguage(l.code as LanguageType)}
            data-testid={`pref-lang-${l.code}`}
          >
            <span>{l.flag}</span>
            <span>{l.code.toUpperCase()}</span>
          </SelectBtn>
        ))}
      </ButtonGrid>

      {/* 3. Currency Selector */}
      <SectionTitle>{PREFERENCE_LABELS.currencyTitle}</SectionTitle>
      <ButtonGrid $cols={4}>
        {Object.values(currencies).map(c => (
          <SelectBtn
            key={c.code}
            $selected={currency === c.code}
            onClick={() => setCurrency(c.code as CurrencyCode)}
            data-testid={`pref-curr-${c.code.toLowerCase()}`}
          >
            <span>{c.flag}</span>
            <span>{c.code}</span>
          </SelectBtn>
        ))}
      </ButtonGrid>

      {/* Links & Actions */}
      <LinksGroup>
        <MenuLinkBtn onClick={() => handleNavigate('/profile')}>
          <span>👤 {PREFERENCE_LABELS.profileLink}</span>
          <span>→</span>
        </MenuLinkBtn>
        <MenuLinkBtn onClick={() => handleNavigate('/crm')}>
          <span>📊 {PREFERENCE_LABELS.dashboardLink}</span>
          <span>→</span>
        </MenuLinkBtn>
        <MenuLinkBtn className="logout-btn" onClick={handleLogout}>
          <span>🚪 {PREFERENCE_LABELS.logoutBtn}</span>
        </MenuLinkBtn>
      </LinksGroup>
    </DropdownContainer>
  );
};

export default UserPreferencesDropdown;
