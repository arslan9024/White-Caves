// FILE: src/components/dashboard/VSCodeBreadcrumbs/VSCodeBreadcrumbs.styles.ts
/**
 * White Caves Real Estate LLC - VSCode Breadcrumbs Styles
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const BreadcrumbsBar = styled.nav<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 16px;
  background-color: ${props => (props.$isDark ? '#090D16' : '#F8FAFC')};
  border-bottom: 1px solid
    ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.08)')};
  font-family:
    'JetBrains Mono',
    monospace,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: 0.72rem;
  color: ${props => (props.$isDark ? '#94A3B8' : '#64748B')};
  overflow-x: auto;
  white-space: nowrap;
  user-select: none;
  z-index: 15;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HistoryNavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-right: 8px;
  padding-right: 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

export const NavArrowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const BreadcrumbItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const BreadcrumbButton = styled.button<{ $isActive?: boolean; $isLast?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: ${props => (props.$isLast ? '#38BDF8' : props.$isActive ? '#F8FAFC' : '#94A3B8')};
  font-weight: ${props => (props.$isLast ? '700' : '500')};
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }

  .id-badge {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 0.65rem;
    font-weight: 700;
  }
`;

export const SiblingPopover = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 220px;
  max-height: 280px;
  overflow-y: auto;
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  z-index: 50;
`;

export const SiblingOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 8px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 0.7rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.12s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.15);
    color: #38bdf8;
  }

  .sib-id {
    font-family: monospace;
    color: #ef4444;
    font-size: 0.65rem;
    font-weight: 700;
  }
`;
