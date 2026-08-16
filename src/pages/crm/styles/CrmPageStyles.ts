/**
 * Shared CRM Page Styled Components
 * Eliminates duplication across LeadManagementPage, PropertyManagementPage, and other CRM pages.
 *
 * AEGIS 2.0 COLOR LOCKDOWN:
 *   ✅ White Caves Red  : #EF4444 — headings, borders, primary buttons, badges
 *   ✅ Brilliant White  : #FFFFFF — backgrounds, cards, surfaces
 *   ✅ Deep Slate Gray  : #1E293B — text, secondary surfaces
 *   ❌ FORBIDDEN: Metallic Gold (#C9A84C), Emerald Green (as primary), Obsidian Black
 *
 * Usage:
 *   import { PageContainer, PageHeader, PrimaryButton, ... } from '../styles/CrmPageStyles';
 */
import styled from 'styled-components';
import { typography } from '../../../styles/theme/typography';

// ─── Layout ─────────────────────────────────────────────────────────────

export const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: ${typography.fontFamily.primary};
  background: #FFFFFF;
  color: #1E293B;
  min-height: 100vh;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #EF4444;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  color: #EF4444;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;

  &:hover {
    text-decoration: underline;
    color: #B91C1C;
  }
`;

// ─── Action Bar & Filters ───────────────────────────────────────────────

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

export const SearchInput = styled.input`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  width: 280px;
  outline: none;
  background: #FFFFFF;
  color: #1E293B;
  transition: border-color 0.15s;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
`;

export const FilterSelect = styled.select`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: #FFFFFF;
  color: #1E293B;
  cursor: pointer;

  &:focus {
    border-color: #EF4444;
  }
`;

// ─── Buttons ────────────────────────────────────────────────────────────

export const PrimaryButton = styled.button`
  background: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: #DC2626;
    box-shadow: 0 8px 18px rgba(239, 68, 68, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  background: rgba(239, 68, 68, 0.08);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
  }
`;

export const SecondaryButton = styled.button`
  background: #F8FAFC;
  color: #1E293B;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #F1F5F9;
    border-color: #CBD5E1;
  }
`;

// ─── Table ──────────────────────────────────────────────────────────────

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.06);
`;

export const Th = styled.th`
  background: #F8FAFC;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #EF4444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #475569;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.04);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94A3B8;
`;

// ─── Form ───────────────────────────────────────────────────────────────

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #EF4444;
  margin-bottom: 0.45rem;
`;

export const FormInput = styled.input`
  width: 100%;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  outline: none;
  box-sizing: border-box;
  background: #FFFFFF;
  color: #1E293B;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  background: #FFFFFF;
  color: #1E293B;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: #FFFFFF;
  color: #1E293B;
  box-sizing: border-box;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus {
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }
`;

// ─── Pagination ─────────────────────────────────────────────────────────

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

// ─── Banners ────────────────────────────────────────────────────────────

export const LoadingBanner = styled.div`
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #EF4444;
`;

export const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #EF4444;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// ─── Modal Footers ──────────────────────────────────────────────────────

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;
