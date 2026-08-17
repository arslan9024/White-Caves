/**
 * UserPreferencesDropdown — Luxury Profile & Quick Preferences Selector Menu
 * White Caves Real Estate LLC — Internationalization & UI/UX Suite
 *
 * Integrates:
 * - Theme Triad Preference (Light / Dark / System)
 * - 4-Language Universal Selector (English / Arabic RTL / Spanish / Russian)
 * - Multi-Currency Selector (AED / USD / EUR / GBP)
 * - User Profile & CRM Shortcuts
 */

import React, { FC, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTheme, type ThemeMode } from '../../../context/ThemeContext';
import { useLanguage, type LanguageType } from '../../../context/LanguageContext';
import { useGlobalCurrency, type CurrencyCode } from '../../../context/CurrencyContext';
import { logout } from '../../../store/authSlice';

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 290px;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 16px 40px -4px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 14px;
  z-index: 1200;
  animation: dropdownSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Inter', sans-serif;

  @keyframes dropdownSlideIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color, #f1f5f9);

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ef4444;
  }
`;

const UserDetails = styled.div`
  overflow: hidden;
  h4 {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 800;
    color: var(--text-primary, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    margin: 2px 0 0;
    font-size: 0.76rem;
    color: var(--text-muted, #64748b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SectionLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted, #94a3b8);
  margin: 12px 0 6px;
`;

const SelectorPillGroup = styled.div`
  display: flex;
  gap: 4px;
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 10px;
  padding: 3px;
`;

const PillBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 5px 6px;
  border-radius: 7px;
  border: none;
  background: ${p => (p.$active ? '#EF4444' : 'transparent')};
  color: ${p => (p.$active ? '#FFFFFF' : 'var(--text-secondary, #475569)')};
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${p => (p.$active ? '#FFFFFF' : '#EF4444')};
    background: ${p => (p.$active ? '#EF4444' : 'rgba(239, 68, 68, 0.08)')};
  }
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 0.84rem;
  font-weight: 600;
  color: #ef4444;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: #fef2f2;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: var(--border-color, #f1f5f9);
  margin: 10px 0;
`;

export interface UserPreferencesDropdownProps {
  user: any;
  onClose: () => void;
}

export const UserPreferencesDropdown: FC<UserPreferencesDropdownProps> = ({
  user,
  onClose,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { currency, setCurrency, currencies } = useGlobalCurrency();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handleLogout = () => {
    onClose();
    dispatch(logout());
    navigate('/');
  };

  const userAvatar =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || user?.email || 'Executive'
    )}&background=EF4444&color=fff`;

  return (
    <DropdownContainer ref={dropdownRef} data-testid="user-preferences-dropdown">
      {user ? (
        <UserHeader>
          <img src={userAvatar} alt={user.name || 'User Profile'} />
          <UserDetails>
            <h4>{user.name || 'Executive User'}</h4>
            <p>{user.email}</p>
          </UserDetails>
        </UserHeader>
      ) : (
        <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary, #0f172a)' }}>
            ⚙️ App Preferences
          </h4>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
            Customize your viewing experience
          </p>
        </div>
      )}

      {/* Theme Triad Preference */}
      <SectionLabel>Theme Mode</SectionLabel>
      <SelectorPillGroup data-testid="dropdown-theme-selector">
        <PillBtn
          $active={themeMode === 'light'}
          onClick={() => setThemeMode('light')}
          data-testid="pill-theme-light"
        >
          <span>☀️</span> Light
        </PillBtn>
        <PillBtn
          $active={themeMode === 'dark'}
          onClick={() => setThemeMode('dark')}
          data-testid="pill-theme-dark"
        >
          <span>🌙</span> Dark
        </PillBtn>
        <PillBtn
          $active={themeMode === 'system'}
          onClick={() => setThemeMode('system')}
          data-testid="pill-theme-system"
        >
          <span>💻</span> Auto
        </PillBtn>
      </SelectorPillGroup>

      {/* 4-Language Universal Preference */}
      <SectionLabel>Language</SectionLabel>
      <SelectorPillGroup data-testid="dropdown-language-selector">
        {Object.values(supportedLanguages).map(langItem => (
          <PillBtn
            key={langItem.code}
            $active={language === langItem.code}
            onClick={() => setLanguage(langItem.code as LanguageType)}
            data-testid={`pill-lang-${langItem.code}`}
            title={langItem.name}
          >
            <span>{langItem.flag}</span>
            <span>{langItem.code.toUpperCase()}</span>
          </PillBtn>
        ))}
      </SelectorPillGroup>

      {/* Multi-Currency Preference */}
      <SectionLabel>Currency</SectionLabel>
      <SelectorPillGroup data-testid="dropdown-currency-selector">
        {Object.values(currencies).map(currItem => (
          <PillBtn
            key={currItem.code}
            $active={currency === currItem.code}
            onClick={() => setCurrency(currItem.code as CurrencyCode)}
            data-testid={`pill-curr-${currItem.code}`}
            title={currItem.name}
          >
            <span>{currItem.flag}</span>
            <span>{currItem.code}</span>
          </PillBtn>
        ))}
      </SelectorPillGroup>

      <Divider />

      {/* Navigation Shortcuts */}
      {user ? (
        <>
          <MenuLink to="/profile" onClick={onClose}>
            <span>👤</span> My Profile & Settings
          </MenuLink>
          <MenuLink to="/dashboard" onClick={onClose}>
            <span>🚀</span> Executive Dashboard
          </MenuLink>
          <ActionBtn onClick={handleLogout}>
            <span>🚪</span> Sign Out
          </ActionBtn>
        </>
      ) : (
        <MenuLink to="/signin" onClick={onClose} style={{ color: '#EF4444', fontWeight: 700 }}>
          <span>🔑</span> Sign In / Register
        </MenuLink>
      )}
    </DropdownContainer>
  );
};

export default UserPreferencesDropdown;
