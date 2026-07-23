/**
 * Shared CRM Page Styled Components
 * Eliminates duplication across LeadManagementPage, PropertyManagementPage, and other CRM pages.
 *
 * BRAND COLOR LAW:
 *   Emerald Green: #10B981  — accents, focus rings, success states
 *   Metallic Gold: #C9A84C  — headings, borders, primary buttons, badges
 *   Obsidian Dark: #0f0f0f  — backgrounds, cards, surfaces
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
  background: #0f0f0f;
  color: #ffffff;
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
  color: #c9a84c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  color: #10b981;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;

  &:hover {
    text-decoration: underline;
    color: #34d399;
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
  border: 1px solid #c9a84c;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  width: 280px;
  outline: none;
  background: #1f1f1f;
  color: #ffffff;
  transition: border-color 0.15s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  }
`;

export const FilterSelect = styled.select`
  border: 1px solid #c9a84c;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: #1f1f1f;
  color: #ffffff;
  cursor: pointer;

  &:focus {
    border-color: #10b981;
  }
`;

// ─── Buttons ────────────────────────────────────────────────────────────

export const PrimaryButton = styled.button`
  background: #c9a84c;
  color: #0f0f0f;
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
    background: #e4b75e;
    box-shadow: 0 8px 18px rgba(201, 168, 76, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
  }
`;

export const SecondaryButton = styled.button`
  background: #1f1f1f;
  color: #c9a84c;
  border: 1px solid #c9a84c;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #2c2c2c;
    border-color: #e4b75e;
  }
`;

// ─── Table ──────────────────────────────────────────────────────────────

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #0f0f0f;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #c9a84c;
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.1);
`;

export const Th = styled.th`
  background: #1a1a1a;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #c9a84c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(201, 168, 76, 0.3);
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid #2c2c2c;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    background: rgba(201, 168, 76, 0.08);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.5);
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
  color: #c9a84c;
  margin-bottom: 0.45rem;
`;

export const FormInput = styled.input`
  width: 100%;
  border: 1px solid #c9a84c;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  outline: none;
  box-sizing: border-box;
  background: #1f1f1f;
  color: #ffffff;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    background: #1a1a1a;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #c9a84c;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  background: #1f1f1f;
  color: #ffffff;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    background: #1a1a1a;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  border: 1px solid #c9a84c;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: #1f1f1f;
  color: #ffffff;
  box-sizing: border-box;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
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
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #10b981;
`;

export const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #ef4444;
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
