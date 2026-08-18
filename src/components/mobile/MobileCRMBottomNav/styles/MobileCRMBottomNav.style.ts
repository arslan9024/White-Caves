/**
 * MobileCRMBottomNav.style.ts — Style Layer
 */

import styled from 'styled-components';

export const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: stretch;
  z-index: 900;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

export const NavItem = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px 4px 4px;
  color: ${({ $active }) => ($active ? '#ef4444' : '#94a3b8')};
  transition: color 0.2s;
  &:active {
    background: #f8fafc;
  }
`;

export const NavLabel = styled.span<{ $active: boolean }>`
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  font-family: 'Inter', sans-serif;
`;

export const ActiveDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ef4444;
  position: absolute;
  top: 6px;
`;
