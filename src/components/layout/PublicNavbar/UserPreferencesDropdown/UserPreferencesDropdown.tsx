/**
 * UserPreferencesDropdown.tsx — View Layer (7-Category Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC, useState } from 'react';
import { Cpu, Pencil } from 'lucide-react';
import { AvatarUploadCropModal } from '../../../profile/AvatarUploadCropModal/AvatarUploadCropModal';
import {
  useUserPreferencesDropdownLogic,
  UseUserPreferencesDropdownProps,
} from './logic/UserPreferencesDropdown.logic';
import { PREFERENCE_LABELS } from './data/UserPreferencesDropdown.data';
import {
  DropdownContainer,
  UserHeader,
  AvatarWrapper,
  AvatarEditBadge,
  UserDetails,
  EditProfileInlineLink,
  RoleBadge,
  SectionTitle,
  ButtonGrid,
  SelectBtn,
  RoleSelectBox,
  LinksGroup,
  TelemetryPillsRow,
  DropdownTelemetryPill,
  MenuLinkBtn,
} from './styles/UserPreferencesDropdown.style';
import { type ThemeMode } from '../../../../context/ThemeContext';
import { type LanguageType } from '../../../../context/LanguageContext';
import { type CurrencyCode } from '../../../../context/CurrencyContext';
import { type UserRole } from '../../../../context/UserRoleContext';

export interface UserPreferencesDropdownProps extends UseUserPreferencesDropdownProps {
  hideThemeSelector?: boolean;
}

export const UserPreferencesDropdown: FC<UserPreferencesDropdownProps> = ({
  user,
  onClose = () => {},
  hideThemeSelector = false,
}) => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const {
    dropdownRef,
    user: activeUser,
    currentRole,
    accessLevel,
    isFounder,
    isManagingDirector,
    allRoles,
    roleLabels,
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
    handleSelectRole,
  } = useUserPreferencesDropdownLogic({ user, onClose });

  const avatar =
    activeUser?.photoURL ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(activeUser?.name || PREFERENCE_LABELS.guestName) +
      '&background=EF4444&color=fff';

  return (
    <>
      <DropdownContainer ref={dropdownRef} data-testid="user-preferences-dropdown">
        {/* User Info Header: Role badge replaces name; email & inline edit */}
        <UserHeader>
          <AvatarWrapper>
            <img src={avatar} alt="User Avatar" />
            <AvatarEditBadge
              type="button"
              title="Edit Profile Picture"
              aria-label="Edit Profile Picture"
              data-testid="edit-avatar-btn"
              onClick={() => setIsCropModalOpen(true)}
            >
              <Pencil size={11} />
            </AvatarEditBadge>
          </AvatarWrapper>

          <UserDetails>
            <RoleBadge $level={accessLevel} data-testid="active-role-badge">
              {isFounder
                ? '👑 Founder (L5)'
                : `L${accessLevel} · ${roleLabels[currentRole] || currentRole}`}
            </RoleBadge>
            <p title={activeUser?.email || activeUser?.role || PREFERENCE_LABELS.guestRole}>
              {activeUser?.email || activeUser?.role || PREFERENCE_LABELS.guestRole}
            </p>
            <EditProfileInlineLink
              type="button"
              onClick={() => handleNavigate('/profile')}
              data-testid="inline-edit-profile-btn"
            >
              <Pencil size={11} />
              <span>Edit Profile</span>
            </EditProfileInlineLink>
          </UserDetails>
        </UserHeader>

      {/* 1. Theme Triad Selector (omitted when top navbar provides master full-page theme toggle) */}
      {!hideThemeSelector && (
        <>
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
        </>
      )}

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

      {/* 4. 14-Role Sovereign Simulator (Level 5 RBAC Gate for Administrative Founder Controls) */}
      {(accessLevel >= 5 || isFounder || isManagingDirector) && (
        <>
          <SectionTitle>
            <span>🏛️ Operational Role / Portal</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-red, #ef4444)' }}>
              14-Role Matrix (L5 Sovereign)
            </span>
          </SectionTitle>
          <RoleSelectBox
            value={currentRole}
            onChange={e => handleSelectRole(e.target.value as UserRole)}
            data-testid="role-simulator-select"
          >
            <optgroup label="Tier 1: Internal Corporate Machinery">
              <option value="managing_director">👑 Managing Director (L5 Sovereign)</option>
              <option value="manager">📊 Department Manager (L4)</option>
              <option value="supervisor">⚡ Team Supervisor (L3)</option>
              <option value="agent">💼 Licensed Broker (L2)</option>
              <option value="intern">🎓 Corporate Intern (L1)</option>
            </optgroup>
            <optgroup label="Tier 2: Paired Client Portals">
              <option value="tenant">🔑 Leasing Tenant (Client L1)</option>
              <option value="landlord">🏢 Property Landlord (Asset Owner L2)</option>
              <option value="buyer">🏡 Secondary Buyer (Client L1)</option>
              <option value="seller">📜 Property Seller (Mandate L1)</option>
              <option value="offplan_buyer">🏗️ Off-Plan Purchaser (HNWI L1)</option>
              <option value="developer">🏙️ Primary Developer Partner (L2)</option>
            </optgroup>
            <optgroup label="Tier 3: Strategic Partners & Public">
              <option value="conveyancer">⚖️ DLD Conveyancer / Trustee (L2)</option>
              <option value="contractor">🛠️ Maintenance Contractor (L2)</option>
              <option value="guest">🌐 Executive Guest (Public L1)</option>
            </optgroup>
          </RoleSelectBox>
        </>
      )}

      {/* Links & Actions */}
      <LinksGroup>
        <MenuLinkBtn onClick={() => handleNavigate('/crm')}>
          <span>📊 CRM Hub & Master Pipeline</span>
          <span>→</span>
        </MenuLinkBtn>
        <MenuLinkBtn onClick={() => handleNavigate('/off-plan')}>
          <span>🏗️ Primary Market Portal</span>
          <span>→</span>
        </MenuLinkBtn>
        <MenuLinkBtn onClick={() => handleNavigate('/properties')}>
          <span>🏡 Secondary Market Portal</span>
          <span>→</span>
        </MenuLinkBtn>
        <MenuLinkBtn onClick={() => handleNavigate('/profile')}>
          <span>👤 {PREFERENCE_LABELS.profileLink}</span>
          <span>→</span>
        </MenuLinkBtn>
        <MenuLinkBtn className="logout-btn" onClick={handleLogout}>
          <span>🚪 {PREFERENCE_LABELS.logoutBtn}</span>
        </MenuLinkBtn>
      </LinksGroup>

      {/* Dubai Land Department, RERA & Zoe Mesh Regulatory Telemetry */}
      <TelemetryPillsRow data-testid="dropdown-telemetry-row">
        <DropdownTelemetryPill title="DLD Dubai Land Department License">
          <div className="live-dot" />
          <span>DLD:</span>
          <span className="val">1388443</span>
        </DropdownTelemetryPill>
        <DropdownTelemetryPill title="RERA Office Registration Number">
          <span>RERA:</span>
          <span className="val">44483</span>
        </DropdownTelemetryPill>
        <DropdownTelemetryPill title="AI Zoe Mesh Distributed Agents">
          <Cpu size={11} color="#10B981" />
          <span>Zoe:</span>
          <span className="val" style={{ color: '#10B981' }}>121</span>
        </DropdownTelemetryPill>
      </TelemetryPillsRow>
    </DropdownContainer>
  );
};

export default UserPreferencesDropdown;
