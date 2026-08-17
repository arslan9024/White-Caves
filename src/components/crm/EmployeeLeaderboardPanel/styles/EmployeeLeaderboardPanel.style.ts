/**
 * EmployeeLeaderboardPanel.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Red / Slate / Crisp White luxury visual hierarchy.
 */

import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  background: var(--bg-card, #F8FAFC);
  border-radius: 16px;
  border: 1px solid rgba(239, 68, 68, 0.15);
  font-family: 'Inter', sans-serif;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary, #1E293B);
  margin: 0;
  font-family: 'Outfit', sans-serif;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary, #64748B);
  margin: 4px 0 0 0;
`;

export const ToggleContainer = styled.div`
  display: flex;
  background: #E2E8F0;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
`;

export const ToggleBtn = styled.button<{ $active: boolean; $color?: string }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active, $color }) => ($active ? $color || '#EF4444' : 'transparent')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#1E293B')};
  transition: all 200ms ease;
  font-size: 0.8rem;
`;

export const DeptSelector = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 20px;
`;

export const DeptPill = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1.5px solid ${({ $active }) => ($active ? '#EF4444' : '#E2E8F0')};
  background: ${({ $active }) => ($active ? '#EF4444' : '#FFFFFF')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#1E293B')};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 150ms ease;

  &:hover {
    border-color: #EF4444;
  }
`;

export const GridCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

export const PersonnelCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #EF4444;
  }
`;

export const Avatar = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
`;

export const Details = styled.div`
  flex: 1;

  h4 {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 800;
    color: #1E293B;
  }

  p {
    margin: 2px 0 0;
    font-size: 0.75rem;
    color: #64748B;
  }
`;

export const LevelBadge = styled.span<{ $color: string }>`
  font-size: 0.65rem;
  font-weight: 800;
  color: ${({ $color }) => $color};
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ $color }) => $color};
  text-transform: uppercase;
`;
