/**
 * CRMHubPage.styles.ts
 *
 * Dedicated styled-components design tokens and layout primitives
 * for the White Caves ERP Dashboard & Navigation System.
 */

import styled from 'styled-components';

export const HubContainer = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 1rem 1.5rem;
  font-family: inherit;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const MainLayout = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const UnifiedSidebar = styled.aside<{ $collapsed: boolean }>`
  width: ${props => (props.$collapsed ? '72px' : '340px')};
  min-width: ${props => (props.$collapsed ? '72px' : '340px')};
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: ${props => (props.$collapsed ? '0.75rem 0.5rem' : '1.25rem')};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 1rem;
  height: calc(100vh - 4.5rem);
  min-height: calc(100vh - 4.5rem);
  overflow-y: auto;
  z-index: 20;

  @media (max-width: 1024px) {
    width: 100%;
    min-width: 100%;
    position: static;
    height: auto;
    min-height: auto;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 4px;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #F1F5F9;

  .brand {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0F172A;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .collapse-toggle {
    background: #F1F5F9;
    border: none;
    color: #64748B;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.15s ease;

    &:hover {
      background: #E2E8F0;
      color: #0F172A;
    }
  }
`;

export const TopLevelTileButton = styled.button<{ $open: boolean; $accentColor?: string }>`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${props => (props.$open ? (props.$accentColor || '#EF4444') : '#E2E8F0')};
  background: ${props => (props.$open ? `${props.$accentColor || '#EF4444'}0F` : '#FFFFFF')};
  color: ${props => (props.$open ? (props.$accentColor || '#EF4444') : '#1E293B')};
  font-size: 0.88rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: ${props => (props.$open ? '0 4px 14px rgba(239, 68, 68, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)')};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$accentColor || '#EF4444'};
    transform: translateY(-1px);
  }

  .arrow {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
    transform: ${props => (props.$open ? 'rotate(90deg)' : 'rotate(0deg)')};
  }
`;

export const DeptHeader = styled.div<{ $active: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  background: ${props => (props.$active ? '#EF4444' : '#F8FAFC')};
  color: ${props => (props.$active ? '#FFFFFF' : '#1E293B')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => (props.$active ? '#DC2626' : '#E2E8F0')};

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .num-tag {
    font-size: 0.75rem;
    font-weight: 800;
    color: ${props => (props.$active ? '#FFFFFF' : '#EF4444')};
  }
`;

export const SubGroupHeader = styled.div<{ $open: boolean }>`
  padding: 6px 10px;
  border-radius: 6px;
  background: ${props => (props.$open ? '#F1F5F9' : 'transparent')};
  color: #475569;
  font-size: 0.76rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: #F1F5F9;
  }

  .arrow {
    font-size: 0.65rem;
    transition: transform 0.2s ease;
    transform: ${props => (props.$open ? 'rotate(90deg)' : 'rotate(0deg)')};
  }
`;

export const NestedItemList = styled.div<{ $open: boolean }>`
  display: ${props => (props.$open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 2px;
  padding-left: 0.5rem;
  margin-top: 2px;
`;

export const SidebarSubItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: ${props => (props.$active ? 'rgba(239, 68, 68, 0.1)' : 'transparent')};
  color: ${props => (props.$active ? '#EF4444' : '#64748B')};
  font-size: 0.78rem;
  font-weight: ${props => (props.$active ? 800 : 600)};
  text-align: left;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => (props.$active ? 'rgba(239, 68, 68, 0.15)' : '#F8FAFC')};
    color: ${props => (props.$active ? '#EF4444' : '#1E293B')};
  }
`;

export const ContentArea = styled.main`
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  min-height: 80vh;
`;

export const ContentHeader = styled.div`
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F8FAFC;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const LiveCorporateTicker = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.65rem 1.25rem;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow-x: auto;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #E2E8F0;
  }
`;

export const TickerItem = styled.div`
  font-size: 0.78rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;

  strong {
    color: #1E293B;
  }

  span {
    color: #059669;
    font-weight: 700;
  }
`;
