// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE STYLES — Replaces UnifiedDashboardPage.css
// ─────────────────────────────────────────────────────────────

import styled from 'styled-components';
import { colors, spacing, typography, media, shadows, borderRadius } from '@/design-tokens';

// ── PAGE LAYOUT ──
export const PageContainer = styled.div`
  min-height: 100%;
  background: #0f1115;
  color: ${colors.text.primary};
  padding: ${spacing[5]};

  ${media.sm} {
    padding: ${spacing[3]};
  }
`;

// ── SIDEBAR BRAND ──
export const SideRailBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[1]} ${spacing[1]} ${spacing[2]};
`;

export const SideRailBrandLogo = styled.div`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${borderRadius.md};
  background: linear-gradient(135deg, #d4af37, #aa8529);
  color: ${colors.text.inverse};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  flex-shrink: 0;
`;

export const SideRailBrandName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${colors.text.primary};
  letter-spacing: 0.02em;
`;

export const SideRailDivider = styled.hr`
  height: 1px;
  background: ${colors.border};
  margin: ${spacing[1]} 0;
  border: none;
`;

// ── SKIP LINK (ACCESSIBILITY) ──
export const SkipLink = styled.a`
  position: absolute;
  inset-inline-start: ${spacing[5]};
  inset-block-start: -48px;
  z-index: 20;
  background: ${colors.primary[500]};
  color: #fff;
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${borderRadius.sm};
  text-decoration: none;
  transition: inset-block-start 0.2s ease;
  ${typography.presets.label};

  &:focus {
    inset-block-start: ${spacing[4]};
  }
`;

// ── TOPBAR ──
export const TopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 6;
  display: grid;
  grid-template-columns: auto minmax(280px, 1fr) auto;
  align-items: center;
  gap: ${spacing[4]};
  min-height: 64px;
  margin-bottom: ${spacing[5]};
  padding: ${spacing[3]} ${spacing[4]};
  background: rgba(15, 17, 21, 0.95);
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  backdrop-filter: blur(18px);

  ${media.md} {
    grid-template-columns: 1fr;
    gap: ${spacing[3]};
    min-height: auto;
  }
`;

export const TopBarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

export const TopBarLogo = styled.div`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: ${borderRadius.lg};
  background: linear-gradient(135deg, #d4af37, #aa8529);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

export const TopBarEyebrow = styled.div`
  margin: 0 0 ${spacing[1]} 0;
  color: ${colors.text.secondary};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const TopBarTitle = styled.strong`
  font-size: 0.98rem;
`;

export const TopBarSearch = styled.div`
  position: relative;
  min-width: 0;
`;

export const SearchInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0 ${spacing[4]} 0 ${spacing[5]};
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background: rgba(248, 249, 250, 0.96);
  color: ${colors.text.primary};
  ${typography.presets.body};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(196, 30, 58, 0.35);
    box-shadow: 0 0 0 4px rgba(196, 30, 58, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${colors.text.secondary};
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  inset-inline-start: ${spacing[4]};
  inset-block-start: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${colors.text.secondary};
`;

// ── WORKSPACE SHELL ──
export const WorkspaceShell = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[4]};
`;

// ── ERROR BANNER ──
export const ErrorBanner = styled.div`
  max-width: 100%;
  margin: 0 auto ${spacing[4]};
  padding: ${spacing[4]} ${spacing[5]};
  background: ${colors.error[50]};
  border: 1px solid ${colors.error[200]};
  border-radius: ${borderRadius.lg};
  color: ${colors.error[900]};
  ${typography.presets.body};
  display: flex;
  align-items: center;
  gap: ${spacing[3]};

  strong {
    font-weight: 600;
  }
`;

// ── TAB LOADING ──
export const TabLoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: ${colors.text.secondary};
  ${typography.presets.body};
`;

// ── FILTERS BAR ──
export const FiltersBar = styled.div`
  display: flex;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
  flex-wrap: wrap;

  ${media.sm} {
    gap: ${spacing[2]};
  }
`;

export const SearchField = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  ${media.sm} {
    min-width: 100%;
  }
`;

export const SearchFieldInput = styled.input`
  width: 100%;
  padding: ${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[5]};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.default};
  background: ${colors.background.surface};
  color: ${colors.text.primary};
  ${typography.presets.body};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
  }

  &::placeholder {
    color: ${colors.text.secondary};
  }
`;

export const SearchFieldIcon = styled.span`
  position: absolute;
  left: ${spacing[2]};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.secondary};
  pointer-events: none;
`;

export const FilterSelect = styled.select`
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.default};
  background: ${colors.background.surface};
  color: ${colors.text.primary};
  ${typography.presets.body};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary[300]};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
  }
`;

// ── DATA TABLE ──
export const DataTable = styled.div`
  background: ${colors.background.surface};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${spacing[6]};
  box-shadow: ${shadows.sm};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: ${colors.background.hover};
    border-bottom: 1px solid ${colors.border};
  }

  th {
    ${typography.presets.label};
    padding: ${spacing[3]} ${spacing[4]};
    text-align: left;
    color: ${colors.text.secondary};
    font-weight: 600;
  }

  td {
    ${typography.presets.body};
    padding: ${spacing[3]} ${spacing[4]};
    border-bottom: 1px solid ${colors.border};
    color: ${colors.text.primary};
  }

  tbody tr:hover {
    background: ${colors.background.hover};
  }
`;

// ── ACTION BUTTONS ──
export const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing[1]};
  align-items: center;
`;

export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: ${borderRadius.default};
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${colors.background.hover};
  }

  &.danger {
    color: ${colors.error[500]};

    &:hover {
      background: ${colors.error[50]};
    }
  }
`;

// ── PAGINATION ──
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${spacing[6]};
  padding: ${spacing[4]} ${spacing[5]};
  background: ${colors.background.surface};
  border-top: 1px solid ${colors.border};
  flex-wrap: wrap;
  gap: ${spacing[3]};
`;

export const PaginationInfo = styled.span`
  ${typography.presets.body};
  color: ${colors.text.secondary};
`;

export const PaginationButtons = styled.div`
  display: flex;
  gap: ${spacing[1]};
  align-items: center;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  min-width: 44px;
  height: 44px;
  padding: ${spacing[1]} ${spacing[2]};
  border: 1px solid ${props => (props.active ? colors.primary[500] : colors.border)};
  border-radius: ${borderRadius.default};
  background: ${props => (props.active ? colors.primary[500] : colors.background.default)};
  color: ${props => (props.active ? colors.text.inverse : colors.text.primary)};
  ${typography.presets.label};
  cursor: ${props => (props.active || props.disabled ? 'default' : 'pointer')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${colors.primary[500]};
    ${props =>
      !props.active &&
      `
    background: ${colors.background.hover};
  `}
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ── MODALS ──
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${spacing[4]};
`;

export const ModalContent = styled.div<{ small?: boolean }>`
  background: ${colors.background.surface};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  max-width: ${props => (props.small ? '400px' : '600px')};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[5]} ${spacing[5]};
  border-bottom: 1px solid ${colors.border};

  h3 {
    margin: 0;
    ${typography.presets.heading3};
    color: ${colors.text.primary};
  }
`;

export const ModalCloseButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: ${spacing[5]};
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: ${spacing[3]};
  justify-content: flex-end;
  padding: ${spacing[5]} ${spacing[5]};
  border-top: 1px solid ${colors.border};

  ${media.sm} {
    flex-direction: column-reverse;
  }
`;

// ── FORM ELEMENTS ──
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[4]};

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};

  label {
    ${typography.presets.label};
    color: ${colors.text.primary};
    font-weight: 600;
  }

  input,
  select,
  textarea {
    padding: ${spacing[2]} ${spacing[3]};
    border: 1px solid ${colors.border};
    border-radius: ${borderRadius.default};
    background: #0f1115;
    color: ${colors.text.primary};
    ${typography.presets.body};
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${colors.primary[500]};
      box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
    }

    &::placeholder {
      color: ${colors.text.secondary};
    }

    &:disabled {
      background: ${colors.background.hover};
      color: ${colors.text.secondary};
      cursor: not-allowed;
    }
  }
`;

// ── BUTTONS ──
export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[2]} ${spacing[5]};
  border: none;
  border-radius: ${borderRadius.md};
  background: linear-gradient(135deg, #d4af37, #aa8529);
  color: ${colors.text.inverse};
  ${typography.presets.label};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  color: ${colors.text.primary};
  border: 1px solid ${colors.border};

  &:hover:not(:disabled) {
    background: ${colors.background.hover};
    box-shadow: none;
  }
`;

export const DangerButton = styled(PrimaryButton)`
  background: ${colors.error[500]};

  &:hover:not(:disabled) {
    background: ${colors.error[600]};
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

// ── TOAST ──
export const Toast = styled.div`
  position: fixed;
  bottom: ${spacing[4]};
  right: ${spacing[4]};
  padding: ${spacing[3]} ${spacing[4]};
  background: ${colors.success[500]};
  color: white;
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.lg};
  ${typography.presets.body};
  z-index: 2000;
  animation: slideInUp 0.3s ease-out;

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// ── EMPTY STATE ──
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing[12]} ${spacing[6]};
  text-align: center;
  background: ${colors.background.surface};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.lg};
  color: ${colors.text.secondary};

  ${typography.presets.body};

  a {
    color: ${colors.primary[500]};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ── WARNING TEXT ──
export const WarningText = styled.p`
  color: ${colors.error[500]};
  ${typography.presets.caption};
  margin: ${spacing[2]} 0 0;
`;
