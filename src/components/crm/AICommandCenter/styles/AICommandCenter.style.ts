// FILE: src/components/crm/AICommandCenter/styles/AICommandCenter.style.ts
/**
 * AICommandCenter.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Luxury Red (#EF4444) / Crisp White (#FFFFFF) / Slate (#1E293B) palette.
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const CommandCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 8px;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary, #0f172a);
`;

export const HeaderBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 28px;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-left: 5px solid #ef4444;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary, #0f172a);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    margin: 6px 0 0;
    font-size: 0.88rem;
    color: var(--text-muted, #64748b);
  }
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 10px #ef4444;
    animation: pulseRed 1.8s infinite;
  }

  @keyframes pulseRed {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.6;
    }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

export const StatCardWrapper = styled.div<{ $color?: string }>`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.12);
  }

  .stat-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span.label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted, #64748b);
    }

    strong.value {
      font-size: 1.55rem;
      font-weight: 900;
      color: ${p => p.$color || '#EF4444'};
    }
  }

  .stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    background: ${p => (p.$color ? `${p.$color}15` : 'rgba(239, 68, 68, 0.1)')};
    color: ${p => p.$color || '#EF4444'};
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 14px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 280px;

  input {
    width: 100%;
    padding: 10px 14px 10px 38px;
    border-radius: 10px;
    border: 1px solid var(--border-input, #e2e8f0);
    background: var(--bg-input, #f8fafc);
    color: var(--text-primary, #0f172a);
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
      background: #ffffff;
    }
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }
`;

export const DepartmentPills = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

export const DeptPill = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${p => (p.$active ? '#EF4444' : 'var(--border-color, #CBD5E1)')};
  background: ${p => (p.$active ? '#EF4444' : 'var(--bg-secondary, #F8FAFC)')};
  color: ${p => (p.$active ? '#FFFFFF' : 'var(--text-secondary, #334155)')};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ef4444;
    color: ${p => (p.$active ? '#FFFFFF' : '#EF4444')};
  }

  &:focus-visible {
    outline: 2px solid #ef4444;
    outline-offset: 2px;
  }
`;

export const AssistantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const AssistantCard = styled.div<{ $active?: boolean }>`
  background: var(--bg-card, #ffffff);
  border: 1px solid ${p => (p.$active ? '#EF4444' : 'var(--border-color, #E2E8F0)')};
  border-radius: 16px;
  padding: 20px;
  box-shadow: ${p =>
    p.$active ? '0 12px 30px rgba(239, 68, 68, 0.18)' : '0 4px 18px rgba(15, 23, 42, 0.06)'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444, #f97316);
    opacity: ${p => (p.$active ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 34px -4px rgba(15, 23, 42, 0.15);
    border-color: #ef4444;
    &::before {
      opacity: 1;
    }
  }
`;

export const AssistantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid #ef4444;
  }

  .meta {
    flex: 1;
    overflow: hidden;

    h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-primary, #0f172a);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    span.code {
      font-size: 0.7rem;
      font-family: monospace;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      font-weight: 800;
    }

    p.title {
      margin: 2px 0 0;
      font-size: 0.78rem;
      color: var(--text-muted, #64748b);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export { TagList, CapabilityTag, MetricsRow, LaunchBtn } from './AICommandCenterCard.style';
