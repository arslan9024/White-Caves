import styled from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows, media } from '@/design-tokens';

// ────── COMMON TAB COMPONENTS ──────

export const TabContainer = styled.div`
  background: ${colors.background.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[6]};
  gap: ${spacing[4]};
`;

export const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};

  ${media.sm} {
    flex-direction: column;
  }
`;

export const TabTitle = styled.h3`
  ${typography.presets.heading3};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[2]} 0;
`;

export const HeaderLeft = styled.div`
  h2 {
    ${typography.presets.heading2};
    color: ${colors.text.primary};
    margin: 0 0 ${spacing[1]} 0;
  }

  p {
    ${typography.presets.bodySmall};
    color: ${colors.text.secondary};
    margin: 0;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${spacing[2]};
  flex-wrap: wrap;
  justify-content: flex-end;

  ${media.sm} {
    justify-content: flex-start;
    width: 100%;
  }
`;

// ────── BUTTON STYLES ──────

export const PrimaryButton = styled.button`
  background: ${colors.primary[600]};
  color: ${colors.text.inverse};
  border: none;
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${borderRadius.md};
  ${typography.presets.body};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.primary[700]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: ${colors.border.default};
  color: ${colors.text.primary};

  &:hover:not(:disabled) {
    background: ${colors.neutral[300]};
  }
`;

export const DangerButton = styled(PrimaryButton)`
  background: ${colors.error[600]};

  &:hover:not(:disabled) {
    background: ${colors.error[700]};
  }
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary[600]};
  cursor: pointer;
  padding: 0;
  ${typography.presets.body};
  text-decoration: underline;
  transition: all 0.2s;

  &:hover {
    color: ${colors.primary[700]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button<{ danger?: boolean }>`
  background: none;
  border: 1px solid ${colors.border.default};
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: ${spacing[2]};
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary[500]};
    color: ${colors.primary[600]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ────── TABLE COMPONENTS ──────

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.default};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  ${typography.presets.body};

  thead tr {
    background: ${colors.background.surface};
    border-bottom: 2px solid ${colors.border.default};
  }

  thead th {
    padding: ${spacing[3]} ${spacing[4]};
    text-align: left;
    color: ${colors.text.secondary};
    ${typography.presets.bodySmall};
    font-weight: 600;
  }

  tbody tr {
    border-bottom: 1px solid ${colors.border.default};
    transition: background 0.2s;

    &:hover {
      background: ${colors.background.hover};
    }

    &:last-child {
      border-bottom: none;
    }
  }

  tbody td {
    padding: ${spacing[3]} ${spacing[4]};
    color: ${colors.text.primary};
  }
`;

export const TableRow = styled.tr``;

export const TableHeader = styled.th``;

export const TableCell = styled.td``;

export const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[4]};
  border-top: 1px solid ${colors.border.default};
  background: ${colors.background.surface};
`;

// ────── FILTER COMPONENTS ──────

export const FilterRow = styled.div`
  display: flex;
  gap: ${spacing[3]};
  flex-wrap: wrap;
  margin-bottom: ${spacing[4]};
  align-items: center;

  ${media.sm} {
    flex-direction: column;
  }
`;

export const FilterSelect = styled.select`
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.border.default};
  border-radius: ${borderRadius.md};
  ${typography.presets.body};
  color: ${colors.text.primary};
  background: ${colors.background.default};
  cursor: pointer;

  &:hover {
    border-color: ${colors.primary[500]};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary[600]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

// ────── PAGINATION COMPONENTS ──────

export const PaginationContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
  justify-content: center;
  align-items: center;
  padding: ${spacing[3]};
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.border.default};
  background: ${props => (props.$active ? colors.primary[600] : colors.background.default)};
  color: ${props => (props.$active ? colors.text.inverse : colors.text.primary)};
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  ${typography.presets.bodySmall};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${colors.primary[500]};
    background: ${colors.primary[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ────── MODAL COMPONENTS ──────

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: ${colors.background.default};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
`;

export const ModalSmall = styled(Modal)`
  max-width: 400px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[4]};
  border-bottom: 1px solid ${colors.border.default};

  h2 {
    ${typography.presets.heading2};
    color: ${colors.text.primary};
    margin: 0;
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  font-size: 24px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: ${spacing[4]};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing[3]};
  padding: ${spacing[4]};
  border-top: 1px solid ${colors.border.default};
`;

// ────── FORM COMPONENTS ──────

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
    ${typography.presets.bodySmall};
    font-weight: 600;
    color: ${colors.text.primary};
  }

  input,
  select,
  textarea {
    padding: ${spacing[2]} ${spacing[3]};
    border: 1px solid ${colors.border.default};
    border-radius: ${borderRadius.md};
    ${typography.presets.body};
    color: ${colors.text.primary};

    &:focus {
      outline: none;
      border-color: ${colors.primary[600]};
      box-shadow: 0 0 0 3px ${colors.primary[100]};
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

// ────── STATUS & BADGE COMPONENTS ──────

export const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.sm};
  ${typography.presets.bodySmall};
  font-weight: 500;

  ${props => {
    switch (props.$status) {
      case 'qualified':
        return `background: ${colors.success[100]}; color: ${colors.success[700]};`;
      case 'lost':
        return `background: ${colors.error[100]}; color: ${colors.error[700]};`;
      case 'contacted':
        return `background: ${colors.warning[100]}; color: ${colors.warning[700]};`;
      default:
        return `background: ${colors.primary[100]}; color: ${colors.primary[700]};`;
    }
  }}
`;

export const PriorityBadge = styled.span<{ $priority?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.sm};
  ${typography.presets.bodySmall};
  font-weight: 500;

  ${props => {
    switch (props.$priority) {
      case 'high':
        return `background: ${colors.error[100]}; color: ${colors.error[700]};`;
      case 'medium':
        return `background: ${colors.warning[100]}; color: ${colors.warning[700]};`;
      case 'low':
        return `background: ${colors.success[100]}; color: ${colors.success[700]};`;
      default:
        return `background: ${colors.neutral[100]}; color: ${colors.neutral[700]};`;
    }
  }}
`;

export const SourceBadge = styled.span<{ $source?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.sm};
  ${typography.presets.bodySmall};
  font-weight: 500;

  ${props => {
    switch (props.$source) {
      case 'whatsapp':
        return `background: ${colors.success[100]}; color: ${colors.success[700]};`;
      case 'website':
        return `background: ${colors.primary[100]}; color: ${colors.primary[700]};`;
      case 'chatbot':
        return `background: ${colors.warning[100]}; color: ${colors.warning[700]};`;
      case 'referral':
        return `background: ${colors.success[50]}; color: ${colors.success[600]};`;
      default:
        return `background: ${colors.neutral[100]}; color: ${colors.neutral[700]};`;
    }
  }}
`;

export const TypeBadge = styled.span<{ $type?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.sm};
  ${typography.presets.bodySmall};
  font-weight: 500;

  ${props => {
    switch (props.$type) {
      case 'tenancy':
        return `background: ${colors.success[100]}; color: ${colors.success[700]};`;
      case 'sales':
        return `background: ${colors.primary[100]}; color: ${colors.primary[700]};`;
      case 'lease':
        return `background: ${colors.warning[100]}; color: ${colors.warning[700]};`;
      default:
        return `background: ${colors.neutral[100]}; color: ${colors.neutral[700]};`;
    }
  }}
`;

export const UnassignedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.sm};
  ${typography.presets.bodySmall};
  font-weight: 500;
  background: ${colors.warning[100]};
  color: ${colors.warning[700]};
`;

// ────── LOADING & ERROR STATES ──────

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid ${colors.border.default};
  border-top-color: ${colors.primary[600]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing[8]};
  gap: ${spacing[3]};
  ${typography.presets.body};
  color: ${colors.text.secondary};
`;

export const ErrorIcon = styled.div`
  font-size: 48px;
  color: ${colors.error[600]};
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing[8]};
  gap: ${spacing[3]};
  background: ${colors.error[50]};
  border: 1px solid ${colors.error[200]};
  border-radius: ${borderRadius.lg};

  h3 {
    ${typography.presets.heading3};
    color: ${colors.error[600]};
    margin: 0;
  }

  p {
    ${typography.presets.body};
    color: ${colors.error[700]};
    margin: 0;
  }
`;

// ────── NOTIFICATION COMPONENTS ──────

export const Toast = styled.div<{ $type?: 'success' | 'error' | 'info' }>`
  display: flex;
  gap: ${spacing[3]};
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${borderRadius.md};
  ${typography.presets.body};
  box-shadow: ${shadows.md};

  ${props => {
    switch (props.$type) {
      case 'success':
        return `background: ${colors.success[100]}; color: ${colors.success[700]}; border-left: 4px solid ${colors.success[600]};`;
      case 'error':
        return `background: ${colors.error[100]}; color: ${colors.error[700]}; border-left: 4px solid ${colors.error[600]};`;
      case 'info':
        return `background: ${colors.primary[100]}; color: ${colors.primary[700]}; border-left: 4px solid ${colors.primary[600]};`;
      default:
        return '';
    }
  }}
`;

// ────── TEXT COMPONENTS ──────

export const EmptyStateText = styled.p`
  ${typography.presets.body};
  color: ${colors.text.secondary};
  margin: 0;
`;

export const WarningText = styled.p`
  ${typography.presets.bodySmall};
  color: ${colors.warning[700]};
  margin: 0;
`;

// ────── STATS COMPONENTS ──────

export const StatValue = styled.span`
  ${typography.presets.heading3};
  color: ${colors.text.primary};
  font-weight: 600;
`;

export const StatLabel = styled.span`
  ${typography.presets.bodySmall};
  color: ${colors.text.secondary};
`;

export const StatNumber = styled.div`
  ${typography.presets.heading3};
  color: ${colors.text.primary};
  font-weight: 600;
`;

export const StatLabelText = styled.div`
  ${typography.presets.bodySmall};
  color: ${colors.text.secondary};
`;

// ────── CONTRACT-SPECIFIC COMPONENTS ──────

export const ContractStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const ContractStat = styled.div<{ variant?: string }>`
  background: ${colors.background.surface};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.default};
`;

export const PartiesCell = styled.td`
  max-width: 200px;
`;

export const DateCell = styled.td`
  white-space: nowrap;
`;

export const PriceCell = styled.td`
  text-align: right;
  font-weight: 500;
`;

// ────── LEAD-SPECIFIC COMPONENTS ──────

export const LeadStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const LeadStat = styled.div`
  background: ${colors.background.surface};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.default};
`;

export const LeadCell = styled.td`
  max-width: 250px;
`;

export const ContactCell = styled.td`
  max-width: 200px;
`;

// ────── TABLE INTERACTION COMPONENTS ──────

export const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing[2]};
  align-items: center;
`;

// ────── STATUS SELECT (for editing) ──────

export const StatusSelect = styled.select`
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.border.default};
  border-radius: ${borderRadius.md};
  ${typography.presets.body};
  color: ${colors.text.primary};
  background: ${colors.background.default};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.primary[600]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

// ────── USERS TAB SPECIFIC COMPONENTS ──────

export const UsersContainer = styled.div`
  background: ${colors.background.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[6]};
`;

export const UsersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};

  ${media.sm} {
    flex-direction: column;
  }
`;

export const UsersStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const UserStatCard = styled.div`
  background: ${colors.background.surface};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.default};
`;

export const CategoryOverview = styled.div`
  margin-bottom: ${spacing[6]};
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${spacing[3]};
`;

export const CategoryCard = styled.div<{ $isActive?: boolean }>`
  background: ${colors.background.surface};
  border: 2px solid ${colors.border.default};
  border-radius: ${borderRadius.md};
  padding: ${spacing[3]};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary[500]};
  }

  ${props =>
    props.$isActive &&
    `
    border-color: ${colors.primary[600]};
    background: ${colors.primary[50]};
  `}
`;

export const CategoryName = styled.div`
  ${typography.presets.bodySmall};
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: ${spacing[1]};
`;

export const CategoryCount = styled.div`
  ${typography.presets.heading3};
  color: ${colors.primary[600]};
  font-weight: 700;
`;

export const UsersToolbar = styled.div`
  display: flex;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
  flex-wrap: wrap;

  ${media.sm} {
    flex-direction: column;
  }
`;

export const SearchBox = styled.input`
  flex: 1;
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.border.default};
  border-radius: ${borderRadius.md};
  ${typography.presets.body};
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${colors.primary[600]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

export const ToolbarFilters = styled.div`
  display: flex;
  gap: ${spacing[2]};
  flex-wrap: wrap;
`;

export const UserCell = styled.td`
  padding: ${spacing[3]} ${spacing[4]};
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

export const UserName = styled.div`
  ${typography.presets.body};
  font-weight: 600;
  color: ${colors.text.primary};
`;

export const UserEmail = styled.div`
  ${typography.presets.bodySmall};
  color: ${colors.text.secondary};
`;

export const RoleBadge = styled.span<{ $role?: string }>`
  display: inline-flex;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.sm};
  ${typography.presets.bodySmall};
  font-weight: 500;

  ${props => {
    switch (props.$role) {
      case 'company_owner':
        return `background: ${colors.primary[100]}; color: ${colors.primary[700]};`;
      case 'sales_manager':
        return `background: ${colors.success[100]}; color: ${colors.success[700]};`;
      case 'agent':
        return `background: ${colors.warning[100]}; color: ${colors.warning[700]};`;
      default:
        return `background: ${colors.neutral[100]}; color: ${colors.neutral[700]};`;
    }
  }}
`;

export const DealsCell = styled.td`
  text-align: center;
  font-weight: 600;
  color: ${colors.primary[600]};
`;

export const ActionButton = styled.button`
  background: none;
  border: 1px solid ${colors.border.default};
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: ${spacing[2]};
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary[500]};
    color: ${colors.primary[600]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const PaginationInfo = styled.div`
  ${typography.presets.bodySmall};
  color: ${colors.text.secondary};
  min-width: fit-content;
`;
