/**
 * Shared CRM Page Styled Components
 * Eliminates duplication across LeadManagementPage, PropertyManagementPage, and other CRM pages.
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
  background:
    radial-gradient(circle at top right, rgba(227, 30, 36, 0.08), transparent 30%),
    radial-gradient(circle at bottom left, rgba(46, 90, 79, 0.05), transparent 35%);
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
  color: #1a1a2e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;

  &:hover {
    text-decoration: underline;
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  width: 280px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const FilterSelect = styled.select`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: #3b82f6;
  }
`;

// ─── Buttons ────────────────────────────────────────────────────────────

export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #e31e24 0%, #b71c1c 100%);
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: linear-gradient(135deg, #e2c35a 0%, #e31e24 100%);
    box-shadow: 0 8px 18px rgba(227, 30, 36, 0.28);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #dc2626;
  }
`;

export const SecondaryButton = styled.button`
  background: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #f5f5f5;
    border-color: #bbb;
  }
`;

// ─── Table ──────────────────────────────────────────────────────────────

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export const Th = styled.th`
  background: #fafafa;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e8e8e8;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    background: #f8f9ff;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #888;
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
  color: #435467;
  margin-bottom: 0.45rem;
`;

export const FormInput = styled.input`
  width: 100%;
  border: 1px solid #d8dee9;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  outline: none;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &:focus {
    border-color: #e31e24;
    box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.2);
    background: white;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #d8dee9;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &:focus {
    border-color: #e31e24;
    box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.2);
    background: white;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  border: 1px solid #d8dee9;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: white;
  box-sizing: border-box;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus {
    border-color: #e31e24;
    box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.2);
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
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #1d4ed8;
`;

export const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #dc2626;
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
