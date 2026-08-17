/**
 * UnifiedWorkspaceLayout.style.ts — UI Style Layer & Styled-Components
 * Enforces layout properties:
 * - TopNavbar: fixed top-0 left-0 w-full h-16 z-1000 bg-white border-b-2 border-red-500
 * - UnifiedSidebar: fixed top-16 left-0 h-[calc(100vh-64px)] w-[280px] z-900 bg-white border-r
 * - MainCanvas: margin-top:64px; margin-left:280px; padding:24px; bg-white text-slate
 */

import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #FFFFFF;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1E293B;
  overflow-x: hidden;
`;

export const MainContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 64px);
`;

export const UnifiedSidebarWrapper = styled.aside`
  position: fixed;
  top: 64px;
  left: 0;
  height: calc(100vh - 64px);
  width: 280px;
  z-index: 900;
  background-color: #FFFFFF;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(15, 23, 42, 0.04);
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom Red Scrollbar */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #EF4444;
  }
`;

export const MainCanvasWrapper = styled.main`
  margin-top: 64px;
  margin-left: 280px;
  padding: 24px;
  background-color: #FFFFFF;
  color: #1E293B;
  flex: 1;
  min-height: calc(100vh - 64px);
  overflow-y: auto;
  transition: margin-left 0.25s ease-in-out;

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 16px;
  }
`;

export const SidebarSearchBox = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid #F1F5F9;
  background: #F8FAFC;

  input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
    background: #FFFFFF;
    color: #0F172A;
    font-size: 0.8rem;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #EF4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
    }
  }
`;

export const MdHubSection = styled.div`
  margin: 10px 12px;
  padding: 12px;
  border-radius: 12px;
  background: #1E293B;
  color: #FFFFFF;
  border: 1px solid rgba(239, 68, 68, 0.4);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);

  .hub-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 800;
    color: #FFFFFF;
    margin-bottom: 8px;
    letter-spacing: 0.02em;

    span.badge {
      padding: 2px 6px;
      border-radius: 4px;
      background: #EF4444;
      color: #FFFFFF;
      font-size: 0.68rem;
      font-weight: 900;
    }
  }
`;

export const MdHubItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  margin-top: 4px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${p => (p.$active ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.04)')};
  color: ${p => (p.$active ? '#FFFFFF' : '#CBD5E1')};
  border-left: 3px solid ${p => (p.$active ? '#EF4444' : 'transparent')};
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #FFFFFF;
  }

  span.item-badge {
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.4);
    font-size: 0.65rem;
    font-weight: 800;
  }
`;

export const NavCategoryGroup = styled.div`
  padding: 8px 12px;

  .cat-title {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94A3B8;
    padding: 6px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const NavItemButton = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: ${p => (p.$active ? 'rgba(239, 68, 68, 0.08)' : 'transparent')};
  color: ${p => (p.$active ? '#EF4444' : '#475569')};
  font-weight: ${p => (p.$active ? '800' : '600')};
  font-size: 0.78rem;
  cursor: pointer;
  text-align: left;
  border-left: 3px solid ${p => (p.$active ? '#EF4444' : 'transparent')};
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.06);
    color: #EF4444;
  }
`;
